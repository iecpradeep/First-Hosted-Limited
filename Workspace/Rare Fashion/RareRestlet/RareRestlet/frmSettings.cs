using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace RareRestlet
{
    public partial class frmSettings : Form
    {
        public frmSettings()
        {
            InitializeComponent();
        }

        private void btnReturn_Click(object sender, EventArgs e)
        {
            //MessageBox.Show("Sorry you wish to return it :(", "RareRESTLET Test", MessageBoxButtons.OK, MessageBoxIcon.Asterisk, MessageBoxDefaultButton.Button1);
            MessageBox.Show("You selected:\n" + cmbSavedSearch.Text, "REST Test", MessageBoxButtons.OK, MessageBoxIcon.Hand, MessageBoxDefaultButton.Button1);
            this.Close();
        }

        private void frmOrder_Load(object sender, EventArgs e)
        {
            var searches = new string[4];
            searches[0] = "custsearch_getinvitem";
            searches[1] = "custsearch_itemsearch1";
            searches[2] = "custsearch_salesorders";
            searches[3] = "custsearch_purchaserpt";

            DataSet myDataSet = new DataSet();

            // --- Preparation
            DataTable sTable = new DataTable("Searches");
            DataColumn sName = new DataColumn("Name", typeof(string));
            sTable.Columns.Add(sName);

            for (int i = 0; i < searches.Length; i++)
            {
                DataRow sSearch = sTable.NewRow();
                sSearch["Name"] = searches[i];
                sTable.Rows.Add(sSearch);
            }
            myDataSet.Tables.Add(sTable);

            cmbSavedSearch.DataSource = myDataSet.Tables["Searches"].DefaultView;
            cmbSavedSearch.DisplayMember = "Name";

            cmbSavedSearch.BindingContext = this.BindingContext;
        }
    }
}