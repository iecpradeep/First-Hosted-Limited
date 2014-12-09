using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
//using NS.com.netsuite.webservices;
using NS.com.netsuite.sandbox.webservices;
using System.Collections;

namespace NS
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnGet_Click(object sender, EventArgs e)
        {   
            NetSuiteService service = new NetSuiteService();
            service.CookieContainer = new System.Net.CookieContainer();
            setupNetSuiteObjects(service);
            getCustomRecord(service, "1", "13");
            //this.Refresh();
            //MessageBox.Show("hello world", "hello world");
            //getCustomRecord(service, "2", "13");
            savedSearch(service, "19");
            Status logoutStatus = service.logout().status;
            if (logoutStatus.isSuccess)
            {
                lblFinished.Text = "Finished";
            }
        }

        public void setupNetSuiteObjects(NetSuiteService service)
        {
            Passport passport = new Passport();
            passport.account = "3524453";
            passport.email = "align@firsthosted.co.uk";
            RecordRef role = new RecordRef();
            role.internalId = "3";
            passport.role = role; 
            passport.password = "at1234#"; //remember to replace
            Status loginStatus = service.login(passport).status;
        }

        public void getCustomRecord(NetSuiteService service, string recordNo, string recordTypeNo)
        { 
            CustomRecordRef recWebService = new CustomRecordRef();
            recWebService.internalId = recordNo;
            recWebService.typeId = recordTypeNo;
            ReadResponse rr = service.get(recWebService);
            
            if (rr.status.isSuccess)
            {
                CustomRecord currExtension = (CustomRecord)rr.record;
                ArrayList currExtFieldList = new ArrayList(currExtension.customFieldList);

                for (int i = 0; i < currExtFieldList.Count; i++)
                {
                    switch (currExtFieldList[i].GetType().Name)
                    {
                        case "StringCustomFieldRef":
                            StringCustomFieldRef jdeCountry = (StringCustomFieldRef)currExtFieldList[i];
                            if (jdeCountry.internalId == "custrecord_jdecountry")
                            {
                                txtJDECountry.Text = jdeCountry.value;
                            }
                            break;

                        case "SelectCustomFieldRef":
                            SelectCustomFieldRef objSelect = (SelectCustomFieldRef)currExtFieldList[i];
                            if (objSelect.internalId == "custrecord_currency")
                            {
                                ListOrRecordRef currency = (ListOrRecordRef)objSelect.value;
                                txtCurrency.Text = currency.name;
                            }
                            else if (objSelect.internalId == "custrecord_subsidiary")
                            {
                                ListOrRecordRef subsidiary = (ListOrRecordRef)objSelect.value;
                                txtSubsidiary.Text = subsidiary.name;
                            }
                            break;
                    }
                }
            }
            else
            {
                txtJDECountry.Text = "Failed at isSuccess";
            }
        }

        public void savedSearch(NetSuiteService service, string searchID)
        {
            CustomRecordSearchAdvanced csa = new CustomRecordSearchAdvanced();
            csa.savedSearchId = searchID;
            
            SearchResult SR = service.search(csa);

            if (SR.status.isSuccess)
            {
                SearchRow[] searchRows = SR.searchRowList;
                
                for (int i = 0; i < searchRows.Length; i++)
                {
                    CustomRecordSearchRow crsr = (CustomRecordSearchRow)searchRows[i];
                    ArrayList customFieldList = new ArrayList(crsr.basic.customFieldList);
                    String strRecNumberPrefix = "Record " + i.ToString() + ": ";

                    for (int j = 0; j < customFieldList.Count; j++)
                    {
                        MessageBox.Show("Field Type for element " + j + ": " + customFieldList[j].GetType().Name);
                        switch (customFieldList[j].GetType().Name)
                        {   
                            case "SearchColumnSelectCustomField":
                                SearchColumnSelectCustomField scselectcf = (SearchColumnSelectCustomField)customFieldList[j];
                                if (scselectcf.internalId == "custrecord_currency")
                                {
                                    ListOrRecordRef lorrCurrency = (ListOrRecordRef)scselectcf.searchValue;
                                    RecordRef rrCurrency = new RecordRef();
                                    rrCurrency.internalId = lorrCurrency.internalId;
                                    rrCurrency.type = RecordType.currency;
                                    txtSearchResults.Text = txtSearchResults.Text + strRecNumberPrefix + rrCurrency.name + Environment.NewLine;
                                }
                                else if (scselectcf.internalId == "custrecord_subsidiary")
                                {
                                    ListOrRecordRef lorrSubsidiary = (ListOrRecordRef)scselectcf.searchValue;
                                    RecordRef rrSubsidiary = new RecordRef();
                                    rrSubsidiary.internalId = lorrSubsidiary.internalId;
                                    rrSubsidiary.type = RecordType.subsidiary;
                                    txtSearchResults.Text = txtSearchResults.Text + strRecNumberPrefix + rrSubsidiary.name + Environment.NewLine;
                                }
                                break;
                            case "SearchColumnStringCustomField":
                                SearchColumnStringCustomField scstringcf = (SearchColumnStringCustomField)customFieldList[j];
                                if (scstringcf.internalId == "custrecord_jdecountry")
                                {
                                    txtSearchResults.Text = txtSearchResults.Text + strRecNumberPrefix + scstringcf.searchValue + Environment.NewLine;
                                }
                                break;
                            default:
                                break;
                        }
                    }  
                }
            }
            else
            {
                txtSearchResults.Text = "Failure";
            }
        }

        private void label1_Click(object sender, EventArgs e)
        { 
        
        }
    }
}