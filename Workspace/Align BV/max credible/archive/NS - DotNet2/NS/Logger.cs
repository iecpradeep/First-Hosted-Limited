using System;
using System.Collections;
using System.Text;
using System.IO;
using System.Net.Mail;
using NS.Properties;

namespace NS
{
    class Logger
    {
        static private String LEVEL_INFO = "info";
        static private String LEVEL_DEBUG = "debug";

        private String _level = LEVEL_INFO;

        /// <summary>
        /// Constructor.
        /// </summary>
        public Logger(String level)
        {
            _level = level;
        }

        private string getlogFile()
        {
            return Settings.Default.MC_XMLOutputDir + Settings.Default.APP_LogFileName;
        }

        private string getlogTempFile()
        {
            return getlogFile().Replace(".TXT", "_TEMP.TXT");
        }

        private bool islogFileEnabled()
        {
            bool theResult = false;
            bool isEnabled = Settings.Default.APP_LogEnabled;
            if (isEnabled) theResult = true;

            return theResult;
        }

        private bool canDeleteLog()
        {
            bool theResult = false;
            bool isEnabled = Settings.Default.APP_LogCanDelete;
            if (isEnabled) theResult = true;

            return theResult;
        }

        /// <summary>
        /// Private method that writes a string to the console
        /// </summary>
        private void log(String msg)
        {
            System.Console.Out.WriteLine(msg);

            if (islogFileEnabled())
            {
                StreamWriter sw = new StreamWriter(getlogFile(), true);
                sw.WriteLine(DateTime.Now + " :: " + msg);
                sw.Close();
            }
        }

        public void deleteLog()
        {
            if (islogFileEnabled() && canDeleteLog() && System.IO.File.Exists(getlogFile()))
            {
                System.IO.File.Delete(getlogFile());
                System.Console.WriteLine("Log File Deleted.");
                string[] filePaths = Directory.GetFiles(@".", "LOG_*_TMP.txt");
                foreach (string fp in filePaths) System.IO.File.Delete(fp);
            }
        }

        public bool emailLog(string theToAddress, string theCcAddress) //Overrides the default if present
        {
            bool theResult = false;
            if (theToAddress == "") theToAddress = Settings.Default.APP_EmailToAddress; //Default
            if (theCcAddress == "") theCcAddress = Settings.Default.APP_EmailCcAddress; //Default

            if (theToAddress != "")
            {
                string sSMTPHost = Settings.Default.APP_EmailSMTPServer;
                string sSMTPUser = Settings.Default.APP_EmailSMTPUser;
                string sSMTPPassword = Settings.Default.APP_EmailSMTPPassword;
                string sTempFile = "LOG_" + System.DateTime.Now.Ticks.ToString() + "_TMP.TXT";
                System.IO.File.Copy(getlogFile(), sTempFile, true); //If we don't use a random tempfile the attachment locks the log file after use?!
                try
                {
                    MailMessage MyEmail = new MailMessage();
                    MyEmail.To.Add(theToAddress);
                    if (theCcAddress != "") MyEmail.CC.Add(theCcAddress);
                    MyEmail.Subject = "Max Credible overnight import log file";
                    MyEmail.From = new MailAddress("noreply@aligntech.com", "Align BV automated email");
                    MyEmail.IsBodyHtml = false;
                    MyEmail.Body = "Log file attached.";
                    SmtpClient MySMTP = new SmtpClient(sSMTPHost);
                    Attachment attachment = new Attachment(sTempFile); //create the attachment
                    MyEmail.Attachments.Add(attachment);	//add the attachment
                    MySMTP.Credentials = new System.Net.NetworkCredential(sSMTPUser, sSMTPPassword);
                    MySMTP.DeliveryMethod = SmtpDeliveryMethod.Network;
                    MySMTP.Send(MyEmail);
                    System.Console.WriteLine("Log file emailed successfully to " + theToAddress);
                    theResult = true;
                }
                catch (Exception ex)
                {
                    System.Console.WriteLine("Email sending log file encountered an error. " + ex.Message);
                }
                System.IO.File.Delete(sTempFile);
            }
            return theResult;
        }

        /// <summary>
        /// Logs if level is LEVEL_INFO
        /// </summary>
        public void info(String msg)
        {
            if (_level == LEVEL_INFO || _level == LEVEL_DEBUG)
            {
                log(msg);
            }
        }

        /// <summary>
        /// Writes to the console
        /// </summary>
        public void write(String text)
        {
            System.Console.Write(text);
        }

        /// <summary>
        /// Writes line to the console
        /// </summary>
        public void writeLn(String text)
        {
            System.Console.WriteLine(text);
        }

        /// <summary>
        /// Reads line from the console
        /// </summary>
        public String readLn()
        {
            return System.Console.ReadLine().Trim();
        }

        /// <summary>
        /// Logs if level is LEVEL_DEBUG
        /// </summary>
        public void debug(String msg)
        {
            if (_level == LEVEL_DEBUG)
            {
                log("--- DEBUG: " + msg);
                //log( "*** WARNING: " + msg );
                //log( "***   ERROR: " + msg );
            }
        }


        /// <summary>
        /// Logs SOAP faults
        /// </summary>
        public void fault(String fault, String code, String msg)
        {
            log("\n***   SOAP FAULT: fault type=" + fault + " with code=" + code + ". " + msg);
        }


        /// <summary>
        /// Logs SOAP faults
        /// </summary>
        public void fault(String msg)
        {
            log("[SOAP Fault]: " + msg);
        }


        /// <summary>
        /// Logs warnings
        /// </summary>
        public void warning(String msg)
        {
            log("*** WARNING: " + msg);
        }


        /// <summary>
        /// Logs an error message
        /// </summary>
        public void error(String msg)
        {
            log("[Error]: " + msg);
        }

        public void error(com.netsuite.webservices.Status status)
        {
            log(string.Format("[Error]: {0}", GetStatusDetails(status)));
        }

        /// <summary>
        /// Logs an error message with a new line
        /// </summary>
        public void error(String msg, bool isNewLine)
        {
            if (isNewLine)
                log("\n[Error]: " + msg);
            else
                log("[Error]: " + msg);
        }


        public void errorForRecord(String msg)
        {
            log("    [Error]: " + msg);
        }

        public void errorForRecord(com.netsuite.webservices.Status status)
        {
            log(string.Format("  [Error]: {0}", GetStatusDetails(status)));
        }

        /// <summary>
        /// <p>Processes the status object and prints the status details</p>
        /// </summary>
        private string GetStatusDetails(com.netsuite.webservices.Status status)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            for (int i = 0; i < status.statusDetail.Length; i++)
            {
                sb.AppendFormat("[Code={0}] {1}\n", status.statusDetail[i].code, status.statusDetail[i].message);
            }
            return sb.ToString();
        }
    }
}
