using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Net;


namespace RareRestlet
{
    public partial class frmMain : Form
    {

        public string account = RareRestlet.Properties.Resources.account;
        public string email = RareRestlet.Properties.Resources.username;
        public string password = RareRestlet.Properties.Resources.password;
        public string role = RareRestlet.Properties.Resources.role;
        public string url = "https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=96&deploy=1";
        public string contents = "";

        public frmMain()
        {
            InitializeComponent();
        }

        private void btnSell_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Things have been sold!", "FirstPOS Mobile:", MessageBoxButtons.OK, MessageBoxIcon.Asterisk, MessageBoxDefaultButton.Button1);
            statMain.Text = "Stuff Sold!";
            this.BackColor = Color.Green;
        }

        private void btnUnsell_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Things have been unsold!", "FirstPOS Mobile:", MessageBoxButtons.OK, MessageBoxIcon.Exclamation, MessageBoxDefaultButton.Button1);
            statMain.Text = "Stuff Unsold!";
            this.BackColor = Color.Red;
        }

        private void frmMain_Load(object sender, EventArgs e)
        {
            this.BackColor = Color.White;
            //MessageBox.Show("Welcome to Rare Restlet Test\nPlease be nice.", "First Hosted Notice:", MessageBoxButtons.OK, MessageBoxIcon.Hand, MessageBoxDefaultButton.Button1);
        }

        private void picFirstHosted_Click(object sender, EventArgs e)
        {
            //MessageBox.Show("Please donate all monies to Pete.", "Rare Restlet Mobile:", MessageBoxButtons.OK, MessageBoxIcon.Hand, MessageBoxDefaultButton.Button1);

        }

        private void btnRest_Click(object sender, EventArgs e)
        {
            try
            {  
                DateTime dt = new DateTime();
                statMain.Text = "Setting contents...";
                Application.DoEvents();
                contents = "<stockitemexists>123</stockitemexists>";//<adjustment><binfrom>10</binfrom><qty>20</qty><binto>30</binto><testpete>Windows Mobile " + dt.TimeOfDay + "</testpete>";
                statMain.Text = "Encoding contents...";
                Application.DoEvents();
                contents = encodeXML(contents);

                // call the rest web service to transfer the payload
                contents = "{\"recordtype\":\"customer\",\"contents\":\"" + contents + "\"}";
                statMain.Text = "Calling Consume REST...";
                Application.DoEvents();
                string restResponse = consumeRESTWebService(contents);
                statMain.Text = "Response Length: " + toKb(restResponse.Length) + "...Splitting to 300...";
                Application.DoEvents();
                restResponse = restResponse.Substring(0, 300);
                MessageBox.Show( restResponse,"Rest Response:");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error Message: \n" + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Asterisk, MessageBoxDefaultButton.Button1);
               //statMain.Text = "Error Inner: " + ex.InnerException.ToString();
            }

        }


        //************************************************************
        // call the netsuite rest web service
        //************************************************************


        private string consumeRESTWebService(string content)
        {

            string responseMessage = "";

            try
            {
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "POST";

                byte[] byteArray = Encoding.UTF8.GetBytes(content);

                string authorization = "NLAuth nlauth_account=" + account + ", nlauth_email=" + email + ",nlauth_signature=" + password + ", nlauth_role=" + role + "";
                
                request.Headers.Add("authorization", authorization.ToString());
                
                request.Accept = "*.*";
                request.ContentType = "application/json";
                
                //request.ContentType = "text/plain";
                request.ContentLength = byteArray.Length;

                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                if (HttpStatusCode.OK == response.StatusCode)
                {
                    dataStream = response.GetResponseStream();
                    StreamReader reader = new StreamReader(dataStream);

                    string line;
                    while ((line = reader.ReadLine()) != null)
                    {
                        responseMessage = line.ToString();
                    }
                    dataStream.Close();
                    response.Close();
                }
                else
                {
                    responseMessage = "Web Service return code not OK " + response.StatusCode;
                }
            }
            catch (Exception ex)
            {
                responseMessage = ex.Message.ToString();
            }

            return responseMessage;
        }

        //*********************************************
        // encode xml
        //*********************************************
        private string encodeXML(string xml)
        {          
            string retVal = "";

            try
            {
                retVal = xml
                    .Replace("&", "&amp;")
                    .Replace("<", "&lt;")
                    .Replace(">", "&gt;")
                    .Replace("\"", "&quot;")
                    .Replace("'", "&apos;")
                    .Replace("\r", "&#xD;")
                    .Replace("\n", "&#xA;");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error", ex.Message);
            }
            return retVal;
        }

        public string toKb(int length)
        {
            return Convert.ToString(Convert.ToInt32(length / 1024)) + "Kb";
        }
        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnSettings_Click(object sender, EventArgs e)
        {
            frmSettings settingsForm = new frmSettings();
            settingsForm.Show();
        }
    }
}