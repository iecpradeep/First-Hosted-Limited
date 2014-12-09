﻿/*
 * MaxCredible - NetSuite Invoice Export Application
 * Version      1.0 first release candidate (Beta 8)
 * Last Updated 7th September 2012
 * Author       First Hosted Ltd.
 * Developer(s) Leigh Darby (leigh@firsthosted.co.uk), Anthony Morganti (Anthony.Morganti@firsthosted.co.uk)
*/

//NetSuite Live / Sandbox option - comment out if live is default build
#define useNSSandbox

using System;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Collections;
using System.Security.Cryptography.X509Certificates;
using System.Xml.Serialization;
using System.Xml.XPath;
using System.Xml;
using System.IO;
using System.Diagnostics;

//Application NetSuite & MaxCredible Classes & Services follow
using NS.Properties;
#if useNSSandbox // Set the switch above as required
using NS.com.netsuite.sandbox.webservices;
using NS.com.maxcredible.secure6;
#else
using NS.com.netsuite.webservices;
using NS.com.maxcredible.secure5;
#endif

namespace NS
{
    public partial class MaxCredible_Export : Form
    {
        //Global Objects
        EventLog _NSEventLog = new EventLog();
        Logger _NSFileLog = new Logger("info");
        NetSuiteService _NSservice;
        SearchRow[] _SSRECORDS;
        Invoer_mc _MaxCredibleService;
        HTTP_POSTS _MaxCredibleData;
        String[,] _CurrencySymbols = new string[Settings.Default.MC_CurrencySymbolsMax,2];
        //TimeZoneInfo _logTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Settings.Default.APP_LogTimeZoneCultureInfo);

        public MaxCredible_Export()
        {
            InitializeComponent();

            TxtSavedSearch1.Text = Settings.Default.NS_MaxCredible_Savedsearch;

            DTPickerTo.Value = System.DateTime.Now.Date.AddDays(Settings.Default.APP_DefaultDateOffset);
            double delDayOffset = Settings.Default.APP_DefaultDateRange + Settings.Default.APP_DefaultDateOffset;
            DTPickerFrom.Value = System.DateTime.Now.Date.AddDays(delDayOffset);

            if (!Settings.Default.APP_DatesEnabled)
            {
                DTPickerFrom.Visible = false;
                lblDTFrom.Visible = false;
                DTPickerTo.Visible = false;
                lblDTTo.Visible = false;
            }

            _NSservice = new NetSuiteService();
            _NSFileLog.deleteLog();

            _MaxCredibleData = new HTTP_POSTS();
            _MaxCredibleService = new Invoer_mc();

            string environment = "";
            #if useNSSandbox // override with live URLs if set in config file
            environment = "SANDBOX/STAGING";
            if (Settings.Default.APP_UseLiveWebServices)
            {
                environment = "LIVE";
                _NSservice.Url = Settings.Default.NS_com_netsuite_webservices_NetSuiteService;
                _MaxCredibleService.Url = Settings.Default.MaxCredibleExport_com_maxcredible_secure5_Invoer_mc;
            }
            #else // live build so invert the web services URLs logic
            environment = "LIVE";
            if (!Settings.Default.APP_UseLiveWebServices)
            {
                environment = "SANDBOX/STAGING";
                _NSservice.Url = Settings.Default.NS_com_netsuite_sandbox_webservices_NetSuiteService;
                _MaxCredibleService.Url = Settings.Default.MaxCredibleExport_com_maxcredible_secure6_Invoer_mc;
            }
            #endif

            GrpNSSearch.Text += " " + environment;
            GrpMaxCredible.Text += " " + environment;

            _NSservice.CookieContainer = new System.Net.CookieContainer();
            setupNetSuiteObjects(_NSservice);

            //Set up defaults for processing flow
            if (Settings.Default.APP_XMLFileOnly) ChkFileXMLOnly.Checked = true;
            if (Settings.Default.APP_AutoFinish) ChkAutoFinish.Checked = true;
            if (Settings.Default.APP_AutoUpload) ChkAutoUpload.Checked = true;

            if (!ChkFileXMLOnly.Checked)// Read back in and upload to MaxCredible
            {
                try
                {
                    System.Net.ServicePointManager.CertificatePolicy = new MaxCrediblePolicy();
                    X509Certificate Cert = X509Certificate.CreateFromCertFile(Settings.Default.MC_CertificateFile); //Defined in config file
                    _MaxCredibleService.ClientCertificates.Add(Cert);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("MaxCredible Security / Certificate Error :\nCertificate File :" + Settings.Default.MC_CertificateFile + "\n" + ex.Message);
                    ChkFileXMLOnly.Checked = true;
                    ChkFileXMLOnly.Enabled = false;
                }
            }

            if (Settings.Default.APP_AutoSearch) btnGet_Click(null, EventArgs.Empty);
        }

        public void btnGet_Click(object sender, EventArgs e)
        {
            BtnMaxCredibleUpload.Enabled = false; //Prevent uploading whilst search in progress
            TxtChunkSize.ReadOnly = true;
            txtSearchResults.Text = "";
            ProgressNSSearch.Value = 0;
            savedSearchMaxCredible(_NSservice);
            BtnMaxCredibleUpload.Enabled = true;
            TxtChunkSize.ReadOnly = false;
            //Immediately run Upload if the option is checked ...
            if (ChkAutoUpload.Checked) BtnMaxCredibleUpload_Click(null, EventArgs.Empty);
        }

        private void BtnMaxCredibleUpload_Click(object sender, EventArgs e)
        {
            btnGet.Enabled = false; //Prevent searching whilst upload in progress
            uploadXMLMaxCredible(_NSservice);
            btnGet.Enabled = true;
            //Immediately run Finish if the option is checked ...
            if (ChkAutoFinish.Checked) btnFinish_Click(null, EventArgs.Empty);
        }

        public void btnFinish_Click(object sender, EventArgs e)
        {
            AppendTextBoxLine(txtSearchResults, "Logging off ...", true); 
            try
            {
                Status logoutStatus = _NSservice.logout().status;
                if (logoutStatus.isSuccess)
                {
                    AppendTextBoxLine(txtSearchResults, "Finished", true);
                    this.Close();               
                }
            }
            catch
            {
                AppendTextBoxLine(txtSearchResults, "Finished (logged out already)", true);
                this.Close();
            }
        }

        public void setupNetSuiteObjects(NetSuiteService service)
        {
            try //Using a session test - if it fails then login ...
            {
                GetServerTimeResult testResult = service.getServerTime();
            }
            catch
            {
                AppendTextBoxLine(txtSearchResults, "Logging in ...", true);
                Passport passport = new Passport();
                passport.account = Settings.Default.NS_AccountID;
                passport.email = Settings.Default.NS_UserEmail;
                RecordRef role = new RecordRef();
                role.internalId = Settings.Default.NS_Role;
                passport.role = role;
                passport.password = Settings.Default.NS_Password;
                Status loginStatus = service.login(passport).status;
                if (loginStatus.isSuccess)
                {
                    AppendTextBoxLine(txtSearchResults, "Logged in OK : " + passport.account + " : " + passport.email, true);
                }
                else
                {
                    AppendTextBoxLine(txtSearchResults, "Login Error : " + loginStatus.statusDetail[0].message, true);
                }
            }
        }

        public void savedSearchMaxCredible(NetSuiteService service)
        {
            TransactionSearchAdvanced TSA = new TransactionSearchAdvanced();
            TSA.savedSearchScriptId = TxtSavedSearch1.Text;
            TransactionSearch TS = new TransactionSearch();
            TransactionSearchBasic TSB = new TransactionSearchBasic();

            if (Settings.Default.APP_DatesEnabled)
            {
                DateTime theSearchStartDate = DTPickerFrom.Value;
                DateTime theSearchFinishDate = DTPickerTo.Value;
                SearchDateField theDTSearch = new SearchDateField();
                theDTSearch.operatorSpecified = true;
                theDTSearch.@operator = SearchDateFieldOperator.within;
                theDTSearch.searchValue2Specified = true;
                theDTSearch.searchValueSpecified = true;
                theDTSearch.searchValue = theSearchStartDate;
                theDTSearch.searchValue2 = theSearchFinishDate;

                TSB.tranDate = theDTSearch;
            }

            TS.basic = TSB;
            TSA.criteria = TS;

            AppendTextBoxLine(txtSearchResults, "Performing search ...", true);
            SearchResult SR = service.search(TSA);

            if (SR.totalRecords == 0)
            {
                AppendTextBoxLine(txtSearchResults, "No records / consignments were returned in the Saved Search : " + TxtSavedSearch1.Text, true);
            }
            else
            {
                AppendTextBoxLine(txtSearchResults, SR.totalRecords + " records / consignments were returned in the Saved Search : " + TxtSavedSearch1.Text, true);

                SearchRow[] SSR;
                SSR = SR.searchRowList;
                SearchRow[] SSRM;

                // Build Intermediate List to allow pagination 
                System.Collections.ArrayList theInvoiceList = new System.Collections.ArrayList();
                for (int ssr = 0; ssr < SSR.Length; ssr++) theInvoiceList.Add(SSR[ssr]);
                AppendTextBoxLine(txtSearchResults, "Records downloaded : " + theInvoiceList.Count + " of " + SR.totalRecords.ToString(), true);

                if (SR.totalRecords > SR.pageSize)
                {
                    int batchNo = 2;
                    // Keep getting pages until there are no more pages to get
                    while (SR.totalRecords > ((batchNo - 1) * SR.pageSize))
                    {
                        AppendTextBoxLine(txtSearchResults, "Fetching next batch no. " + batchNo, true);
                        // Invoke searchMore() operation - ensure logged in ...
                        setupNetSuiteObjects(service); // To ensure logged in before next batch
                        SearchResult SRM = service.searchMore(batchNo);
                        if (SRM != null)
                        {
                            // Process response
                            if (SRM.status.isSuccess)
                            {
                                SSRM = SRM.searchRowList;
                                for (int ssrm = 0; ssrm < SSRM.Length; ssrm++) theInvoiceList.Add(SSRM[ssrm]);
                                AppendTextBoxLine(txtSearchResults, "Records downloaded : " + theInvoiceList.Count + " of " + SR.totalRecords.ToString(), true);
                                batchNo++;
                            }
                            else
                            {
                                AppendTextBoxLine(txtSearchResults, getStatusDetails(SRM.status), true);
                            }
                        }
                    }
                }

                _SSRECORDS = new SearchRow[theInvoiceList.Count];
                IEnumerator iienum = theInvoiceList.GetEnumerator();
                for (int iicr = 0; iienum.MoveNext(); iicr++)
                {
                    _SSRECORDS[iicr] = (SearchRow)iienum.Current;
                }

                //Record list assembly complete - create list for MaxCredible upload
                ProgressNSSearch.Maximum = _SSRECORDS.Length;
                for (int i = 0; i < _SSRECORDS.Length; i++)
                {
                    TransactionSearchRow TSR = (TransactionSearchRow)_SSRECORDS[i];

                    // Declare all the variables for use when writing the file...
                    //DOCNUM
                    string theInternalid = "";
                    if (TSR.basic.internalId != null)
                    {
                        theInternalid = TSR.basic.internalId[0].searchValue.internalId;
                    }

                    string sDocNum = "";
                    if (TSR.basic.tranId != null)
                    {
                        sDocNum = TSR.basic.tranId[0].searchValue.ToString();
                    }

                    //DATE
                    string sDate = "";
                    if (TSR.basic.tranDate != null)
                    {
                        sDate = TSR.basic.tranDate[0].searchValue.ToString("dd/MM/yyyy");
                    }

                    AppendTextBoxLine(txtSearchResults, (i+1) + "\t" + theInternalid + "\t" + sDocNum + "\t" + sDate, false);
                    ProgressNSSearch.Value++;
                }

                // Set up MaxCredible Data defaults based on records returned
                _MaxCredibleData.NR_RECORDS = _SSRECORDS.Length.ToString();
                _MaxCredibleData.CHUNK_SIZE = TxtChunkSize.Text;
                GrpMaxCredible.Text = "Step 2 - Upload " + _MaxCredibleData.NR_RECORDS + " Records to MaxCredible";
                updateChunkSizes();
                
            }
            return;
        }

        public void uploadXMLMaxCredible(NetSuiteService service)
        {
            //Start processing for MaxCredible upload
            int currentMCRecord= 0;
            int currentMCChunk = 1;
            HTTP_POSTS theseHTTPSPOSTS = new HTTP_POSTS();
            theseHTTPSPOSTS.NR_RECORDS = _SSRECORDS.Length.ToString();
            int MCchunkSize = Convert.ToInt32(_MaxCredibleData.CHUNK_SIZE);
            int MCchunkQty = Convert.ToInt32(TxtChunkQty.Text);
            ProgressMCUpload.Maximum = _SSRECORDS.Length;
            string MCBatchName = Settings.Default.MC_XMLOutputPrefix + System.DateTime.Now.ToString("ddMMyyHHmmss");
            for (int i = 0; i < _SSRECORDS.Length; i++)
            {
                TransactionSearchRow TSR = (TransactionSearchRow)_SSRECORDS[i];
                theseHTTPSPOSTS.CHUNK_NR = currentMCChunk.ToString();
                currentMCRecord = i + 1;
                HTTP_POST thisHTTPPOST = createHTTP_POST(TSR);
                thisHTTPPOST.RECORD_NR = currentMCRecord.ToString();
                theseHTTPSPOSTS.HTTP_POST.Add(thisHTTPPOST);
                AppendTextBoxLine(TxtMaxCredibleUpload, "  Invoice " + currentMCRecord.ToString("0000") + "\t" + thisHTTPPOST.FACTUURNUMMER, true);

                if ((currentMCRecord % MCchunkSize == 0 && i != 0) || currentMCRecord == _SSRECORDS.Length)
                {
                    XmlSerializer XMLData = new XmlSerializer(theseHTTPSPOSTS.GetType());
                    if (System.IO.Directory.Exists(Settings.Default.MC_XMLOutputDir))
                    {
                        StreamWriter XMLfile = new StreamWriter(Settings.Default.MC_XMLOutputDir + MCBatchName + currentMCChunk.ToString("0000") + ".xml", false);
                        XMLData.Serialize(XMLfile, theseHTTPSPOSTS);
                        XMLfile.Close();
                        AppendTextBoxLine(TxtMaxCredibleUpload, "Chunk " + currentMCChunk + " of " + MCchunkQty + " created", true);
                    }

                    if (!ChkFileXMLOnly.Checked)// Read back in and upload to MaxCredible
                    {
                        try
                        {
                            XmlNode MCResponseNode;
                            XmlDocument MCRequestDoc = new XmlDocument();
                            XmlTextReader XMLTextReader = new XmlTextReader(Settings.Default.MC_XMLOutputDir + MCBatchName + currentMCChunk.ToString("0000") + ".xml");
                            MCRequestDoc.Load(XMLTextReader);
                            string MCXML = MCRequestDoc.OuterXml.Replace("<HTTP_POST><HTTP_POST>", "<HTTP_POST>").Replace("</HTTP_POST></HTTP_POST>", "</HTTP_POST>"); //Remove outer list node as MaxCredible does not implement
                            //This really needs more elegant XML node / attribute transform handling but just quick string replacements at the moment ...
                            //Before - <HTTP_POSTS xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                            //After - <HTTP_POSTS xmlns="http://www.MaxCredible.com/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="Posten_Batch.xsd">
                            MCXML = MCXML.Replace("<HTTP_POSTS ", "<HTTP_POSTS xmlns=\"http://www.MaxCredible.com/\"  xsi:schemaLocation=\"Posten_Batch.xsd\" ");
                            MCXML = MCXML.Replace(" encoding=\"utf-8\"", ""); //Breaks if encoding present
                            System.IO.File.WriteAllText(Settings.Default.MC_XMLOutputDir + "Request_" + currentMCChunk.ToString("0000") + ".xml", MCXML);
                            MCResponseNode = _MaxCredibleService.XMLBatchReceive(Settings.Default.MC_UserName, Settings.Default.MC_Password, MCBatchName, MCXML);
                            AppendTextBoxLine(TxtMaxCredibleUpload, "MC Response Chunk " + currentMCChunk.ToString("0000") + " : " + MCResponseNode.OuterXml, true);
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show("MaxCredible Web Services Error :\n" + ex.Message);
                        }
                    }

                    currentMCChunk++;
                    ProgressMCUpload.Value = currentMCRecord;
                    theseHTTPSPOSTS.HTTP_POST.Clear(); //Ready for next chunk
                }                
            }

            //Write textbox contents to log file - deprecated as now done as text box appended
            //if (Settings.Default.APP_LogFileName != "")
            //{
            //    System.IO.File.WriteAllText(Settings.Default.MC_XMLOutputDir + Settings.Default.APP_LogFileName, TxtMaxCredibleUpload.Text);
            //    AppendTextBoxLine(TxtMaxCredibleUpload, "Log file created : " + Settings.Default.APP_LogFileName, false);
            //}
        }

        private String getStatusDetails(Status status)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            for (int i = 0; i < status.statusDetail.Length; i++)
            {
                sb.Append("[Code=" + status.statusDetail[i].code + "] " + status.statusDetail[i].message + "\n");
            }
            return sb.ToString();
        }

        private void AppendTextBoxLine(TextBox theTextBox, string myStr, bool addDateTime)
        {
            if (theTextBox.Text.Length > 0)
            {
                theTextBox.AppendText(Environment.NewLine);
            }

            if (addDateTime)
            {
                //Deprecated - is a DotNet 4 feature - DateTime logDateTime = TimeZoneInfo.ConvertTimeFromUtc(System.DateTime.Now.ToLocalTime(), _logTimeZone);
                DateTime logDateTime = System.DateTime.Now.ToLocalTime();
                string sNow = logDateTime.ToString();
                theTextBox.AppendText(sNow.PadRight(40-sNow.Length));
            }

            theTextBox.AppendText(myStr);
            if (Settings.Default.APP_WindowsEventLogEnabled) _NSEventLog.WriteEntry(myStr);
            _NSFileLog.info(myStr);
        }

        private void TxtChunkSize_TextChanged(object sender, EventArgs e)
        {
            //Re-calculate number of chunks based on integer value present
            int newSize = 0;
            if (int.TryParse(this.Text, out newSize)){
                _MaxCredibleData.CHUNK_SIZE = this.Text;
            } else {
                this.Text = _MaxCredibleData.CHUNK_SIZE;
            }
            updateChunkSizes();
        }

        private void updateChunkSizes()
        {
            int MCchunkSize = Convert.ToInt32(_MaxCredibleData.CHUNK_SIZE);
            int MCchunkQty = Convert.ToInt32(Math.Round(Convert.ToDouble(_SSRECORDS.Length / MCchunkSize) + 0.5, 0, MidpointRounding.AwayFromZero));
            TxtChunkQty.Text = MCchunkQty.ToString();
        }

        // Creation per record function from searchrow supplied and Align MaxCredible spec.
        HTTP_POST createHTTP_POST(TransactionSearchRow theTSRRow)
        {
            HTTP_POST theHTTP_POST = new HTTP_POST();

            // Empty by default (not used) values as defined by Align BV
            theHTTP_POST.DEBITEURVOORLETTERS = "";
            theHTTP_POST.DEBITEURGEBOORTEDATUM = "";
            theHTTP_POST.DEBITEURHUISNUMMER = "";

            /* Mandatory fields according to MaxCredible
            DEBITEURNUMMER	Customer number	String, 50 char
            DEBITEURNAAM	Customer name	String, 50 char
            DEBITEURADRES	Customer address	String, 50 char
            DEBITEURHUISNUMMER	Customer housenumber	String, 50 char
            DEBITEURPOSTCODE	Customer postalcode	4 digits and 2 alpha numerics when country is ‘Nederland’
            DEBITEURSTAD	Customer city	String, 50 char
            FACTUURNUMMER	Invoice number	Unique, not allowed to change.
            String, 50 char
            FACTUURBEDRAG	Invoice amount	Numeric
            FACTUURDATUM	Invoice date	Date. (dd-mm-yyyy)
            PROFILEID	Profile	Numeric. Must be a valid profileid
            VALUTA	Currency	String. Must be a valid currency (e.g. EUR)
            CLASSIFYID	Classify	Numeric. Value 1, unless agreed otherwise.
            FACTUURVERVALDATUM	Due date of the invoice	Data. (dd-mm-yyyy)

             Customer DEBIT... fields
            <DEBITEURNUMMER>111598</DEBITEURNUMMER>  <!-- client number -->
		    <DEBITEURNAAM>Studio Dentistico Dr. Antonino</DEBITEURNAAM> <!-- Client name -->
		    <DEBITEURADRES>Via Barbaro 14  </DEBITEURADRES> <!-- Client address -->
		    <DEBITEURPOSTCODE>37139</DEBITEURPOSTCODE> <!-- Client postal code -->
		    <DEBITEURSTAD>Verona</DEBITEURSTAD> <!-- Client city -->
		    <DEBITEURLAND>IT</DEBITEURLAND>  <!-- Client country -->
		    <DEBITEURTELEFOON>(+39)045 97 22 79</DEBITEURTELEFOON> <!-- Client phone number -->
		    <DEBITEURFAX>(+39)045 89 58 71 4</DEBITEURFAX> <!-- Client fax number -->
		    <DEBITEURCONTACTPERSOON>Antonino, Vittorio</DEBITEURCONTACTPERSOON> <!-- Contact person name -->

            */

            string sEntityId = "";
            if (theTSRRow.customerJoin.entityId != null)
            {
                sEntityId = theTSRRow.customerJoin.entityId[0].searchValue.ToString();
            }
            theHTTP_POST.DEBITEURNUMMER = sEntityId;

            string sCustName = "";
            if (theTSRRow.customerJoin.companyName != null)
            {
                sCustName = defaultMaxStringLength(theTSRRow.customerJoin.companyName[0].searchValue.ToString());
            }
            theHTTP_POST.DEBITEURNAAM = sCustName;

            string sCustAddr = "";
            string sCustState = "";
            string sCustCountry = "";
            string sCustPostCode = "";

            if (theTSRRow.customerJoin.billAddress1 != null) // Use Customer Join / Lookup billing details
            {
                sCustAddr = defaultMaxStringLength(theTSRRow.customerJoin.billAddress1[0].searchValue.ToString());

                if (theTSRRow.customerJoin.billCity != null)
                    sCustState = defaultMaxStringLength(theTSRRow.customerJoin.billCity[0].searchValue.ToString());

                if (theTSRRow.customerJoin.billCountryCode != null)
                    sCustCountry = defaultMaxStringLength(theTSRRow.customerJoin.billCountryCode[0].searchValue.ToString());

                if (theTSRRow.customerJoin.billZipCode != null)
                    sCustPostCode = theTSRRow.customerJoin.billZipCode[0].searchValue.ToString();
            }
            else  // Use Invoice billing details
            {
                if (theTSRRow.basic.billAddress1 != null)
                    sCustAddr = defaultMaxStringLength(theTSRRow.basic.billAddress1[0].searchValue.ToString());
                
                if (theTSRRow.basic.billCity != null)
                    sCustState = defaultMaxStringLength(theTSRRow.basic.billCity[0].searchValue.ToString());
                
                if (theTSRRow.basic.billCountryCode != null)
                    sCustCountry = defaultMaxStringLength(theTSRRow.basic.billCountryCode[0].searchValue.ToString());

                if (theTSRRow.basic.billZip != null)
                    sCustPostCode = theTSRRow.basic.billZip[0].searchValue.ToString();
            }

            theHTTP_POST.DEBITEURSTAD = sCustState;
            theHTTP_POST.DEBITEURADRES = sCustAddr;
            theHTTP_POST.DEBITEURLAND = sCustCountry;
            theHTTP_POST.DEBITEURPOSTCODE = sCustPostCode;

            string sCustTel = "";
            if (theTSRRow.customerJoin.phone != null)
            {
                sCustTel = theTSRRow.customerJoin.phone[0].searchValue.ToString();
            }
            theHTTP_POST.DEBITEURTELEFOON = sCustTel;

            string sCustFax = "";
            if (theTSRRow.customerJoin.fax != null)
            {
                sCustFax = theTSRRow.customerJoin.fax[0].searchValue.ToString();
            }
            theHTTP_POST.DEBITEURFAX = sCustFax;

            string sCustEmail = "";
            if (theTSRRow.customerJoin.email != null)
            {
                sCustEmail = theTSRRow.customerJoin.email[0].searchValue.ToString();
            }
            theHTTP_POST.DEBITEUREMAIL = sCustEmail;

            string sCustContact = "";
            if (theTSRRow.customerJoin.contact != null)
            {
                sCustContact = theTSRRow.customerJoin.contact[0].searchValue.ToString();
            }
            theHTTP_POST.DEBITEURCONTACTPERSOON = sCustContact;

            /* Invoice fields
            <FACTUURNUMMER>1458760</FACTUURNUMMER>  <!-- invoice number -->
		    <FACTUURBEDRAG> 250.00</FACTUURBEDRAG>  <!-- invoice amount -->
		    <FACTUURDATUM>2011-12-28</FACTUURDATUM>  <!-- invoice date -->
		    <FACTUURVERVALDATUM>2012-01-27</FACTUURVERVALDATUM>  <!-- invoice due date -->
            */

            string sInvNum = "";
            if (theTSRRow.basic.tranId != null)
            {
                sInvNum = theTSRRow.basic.tranId[0].searchValue.ToString();
            }
            theHTTP_POST.FACTUURNUMMER = sInvNum;

            double sInvAmount = 0.00;
            if (theTSRRow.basic.fxAmount != null)
            {
                sInvAmount = theTSRRow.basic.fxAmount[0].searchValue;
            }
            theHTTP_POST.FACTUURBEDRAG = sInvAmount.ToString("0.00");

            double sInvBaseAmount = 0.00;
            if (theTSRRow.basic.amount != null)
            {
                sInvBaseAmount = theTSRRow.basic.amount[0].searchValue;
            }
            theHTTP_POST.FACTUURBEDRAG_BASIS = sInvBaseAmount.ToString("0.00");

            string sInvDate = "";
            if (theTSRRow.basic.tranDate != null)
            {
                sInvDate = theTSRRow.basic.tranDate[0].searchValue.ToString("yyyy-MM-dd");
            }
            theHTTP_POST.FACTUURDATUM = sInvDate;

            string sInvDueDate = "";
            if (theTSRRow.basic.dueDate != null)
            {
                sInvDueDate = theTSRRow.basic.dueDate[0].searchValue.ToString("yyyy-MM-dd");
            }
            theHTTP_POST.FACTUURVERVALDATUM = sInvDueDate;

            /* Misc. fields
            <KENMERK>ISABELLA V, V (2183537)</KENMERK>  <!-- kenmerk/additional info -->
            <PROFILEID>87</PROFILEID>   <!-- profile ID -->
            <VALUTA>EUR</VALUTA>  <!-- currency -->
            <CLASSIFYID>1</CLASSIFYID>   <!—Classification -->
            <STARTDATUM>2012-01-27</STARTDATUM> <!-- ??? -->
            <CUSTOMER_OPTION1> 250.00</CUSTOMER_OPTION1> <!-- ? looks like amount again -->
            <VALUTA_BASIS>EUR</VALUTA_BASIS> <!-- base currency -->
            <OPENSTAANDBEDRAG_BASIS> 250.00</OPENSTAANDBEDRAG_BASIS> <!-- Open invoice amount -->
            <FACTUURBEDRAG_BASIS> 250.00</FACTUURBEDRAG_BASIS> <!-- Invoice amount base -->
            */

            string sComments = "";
            if (theTSRRow.basic.memo != null)
            {
                sComments = defaultMaxStringLength(theTSRRow.basic.memo[0].searchValue.ToString());
            }
            theHTTP_POST.KENMERK = sComments;

            string sCurrency = "";
            if (theTSRRow.basic.currency != null)
            {
                sCurrency = getCurrencySymbol(theTSRRow.basic.currency[0].searchValue.internalId.ToString());
            }
            theHTTP_POST.VALUTA = sCurrency;

            // To be confirmed what StartDate actually means and is used for ...
            theHTTP_POST.STARTDATUM = System.DateTime.Now.Date.ToString("yyyy-MM-dd");
            if (sInvDueDate != "") theHTTP_POST.STARTDATUM = sInvDueDate;

            theHTTP_POST.PROFILEID = Settings.Default.MC_DefaultProfileID;
            theHTTP_POST.CLASSIFYID = Settings.Default.MC_DefaultClassifyID;
            theHTTP_POST.CUSTOMER_OPTION1 = sInvAmount.ToString("0.00");
            theHTTP_POST.VALUTA_BASIS = Settings.Default.MC_BaseCurrency;

            return theHTTP_POST;

        }

        //Uses a sparse global array to store currency lookups in memory for speed
        string getCurrencySymbol(string theCurrencyID)
        {
            string symbol = "";
            for (int id = 0; id < Settings.Default.MC_CurrencySymbolsMax; id++)
            {
                if (_CurrencySymbols[id, 0] == theCurrencyID)
                {
                    return _CurrencySymbols[id, 1];
                }
                else
                {
                    if (_CurrencySymbols[id, 0] == null)
                    {
                        RecordRef CurrencyRef = new RecordRef();
                        CurrencyRef.typeSpecified = true;
                        CurrencyRef.type = RecordType.currency;
                        CurrencyRef.internalId = theCurrencyID;
                        ReadResponse getSymbolResponse = _NSservice.get(CurrencyRef);
                        if (getSymbolResponse.status.isSuccess)
                        {
                            Currency theCurrency = (Currency)getSymbolResponse.record;
                            _CurrencySymbols[id, 0] = theCurrencyID;
                            _CurrencySymbols[id, 1] = theCurrency.symbol;
                            return theCurrency.symbol;
                        }
                        else
                        {
                            return "";
                        }
                    }
                }
            }
            return symbol;
        }

        private string defaultMaxStringLength(string theString)
        {
            int defaultCharLimit = Settings.Default.MC_DefaultCharLimit;
            string theMaxString = "";
            if (theString != "")
            {
                if (theString.Length > defaultCharLimit)
                {
                    theMaxString = theString.Substring(0, defaultCharLimit);
                }
                else
                {
                    theMaxString = theString;
                }
            }
            return theMaxString;
        }

        // ============ Custom Field general purpose access functions for all types ==========
        private string getStringCustomField(CustomFieldRef[] theCFList, string theCFinternalID)
        {
            string theCFValue = "";
            if (theCFList != null)
            {
                for (int cf = 0; cf < theCFList.Length; cf++)
                {
                    CustomFieldRef theCF = theCFList[cf];
                    if (theCF.ToString().EndsWith("StringCustomFieldRef"))
                    {
                        StringCustomFieldRef theStrCF = (StringCustomFieldRef)theCF;
                        if (theStrCF.internalId == theCFinternalID) theCFValue = theStrCF.value;
                    }
                }
            }
            return theCFValue;
        }

        private bool getBooleanCustomField(CustomFieldRef[] theCFList, string theCFinternalID)
        {
            bool theCFValue = false;
            if (theCFList != null)
            {
                for (int cf = 0; cf < theCFList.Length; cf++)
                {
                    CustomFieldRef theCF = theCFList[cf];
                    if (theCF.ToString().EndsWith("BooleanCustomFieldRef"))
                    {
                        BooleanCustomFieldRef theStrCF = (BooleanCustomFieldRef)theCF;
                        if (theStrCF.internalId == theCFinternalID) theCFValue = theStrCF.value;
                    }
                }
            }
            return theCFValue;
        }

        private int getLongCustomField(CustomFieldRef[] theCFList, string theCFinternalID)
        {
            long theCFValue = 0;
            if (theCFList != null)
            {
                for (int cf = 0; cf < theCFList.Length; cf++)
                {
                    CustomFieldRef theCF = theCFList[cf];
                    if (theCF.ToString().EndsWith("LongCustomFieldRef"))
                    {
                        LongCustomFieldRef theStrCF = (LongCustomFieldRef)theCF;
                        if (theStrCF.internalId == theCFinternalID) theCFValue = theStrCF.value;
                    }
                }
            }
            return Convert.ToInt32(theCFValue);
        }
        private double getDoubleCustomField(CustomFieldRef[] theCFList, string theCFinternalID)
        {
            double theCFValue = 0.00;
            if (theCFList != null)
            {
                for (int cf = 0; cf < theCFList.Length; cf++)
                {
                    CustomFieldRef theCF = theCFList[cf];
                    if (theCF.ToString().EndsWith("DoubleCustomFieldRef"))
                    {
                        DoubleCustomFieldRef theStrCF = (DoubleCustomFieldRef)theCF;
                        if (theStrCF.internalId == theCFinternalID) theCFValue = theStrCF.value;
                    }
                }
            }
            return theCFValue;
        }

        private DateTime getDateTimeCustomField(CustomFieldRef[] theCFList, string theCFinternalID)
        {
            DateTime theCFValue = System.DateTime.Now;
            if (theCFList != null)
            {
                for (int cf = 0; cf < theCFList.Length; cf++)
                {
                    CustomFieldRef theCF = theCFList[cf];
                    if (theCF.ToString().EndsWith("DateCustomFieldRef"))
                    {
                        DateCustomFieldRef theStrCF = (DateCustomFieldRef)theCF;
                        if (theStrCF.internalId == theCFinternalID) theCFValue = theStrCF.value;
                    }
                }
            }
            return theCFValue;
        }

        private ListOrRecordRef getSelectCustomField(CustomFieldRef[] theCFList, string theCFinternalID)
        {
            ListOrRecordRef theCFValue = null;
            if (theCFList != null)
            {
                for (int cf = 0; cf < theCFList.Length; cf++)
                {
                    CustomFieldRef theCF = theCFList[cf];
                    if (theCF.ToString().EndsWith("SelectCustomFieldRef"))
                    {
                        SelectCustomFieldRef theStrCF = (SelectCustomFieldRef)theCF;
                        if (theStrCF.internalId == theCFinternalID) theCFValue = theStrCF.value;
                    }
                }
            }
            return theCFValue;
        }
    }
}