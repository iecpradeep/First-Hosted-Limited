namespace NS
{
    partial class MaxCredible_Export
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnGet = new System.Windows.Forms.Button();
            this.lblDTFrom = new System.Windows.Forms.Label();
            this.lblDTTo = new System.Windows.Forms.Label();
            this.txtSearchResults = new System.Windows.Forms.TextBox();
            this.lblSearchResults = new System.Windows.Forms.Label();
            this.LblStatus = new System.Windows.Forms.Label();
            this.TxtSavedSearch1 = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.btnFinish = new System.Windows.Forms.Button();
            this.LblFinish = new System.Windows.Forms.Label();
            this.ProgressNSSearch = new System.Windows.Forms.ProgressBar();
            this.GrpNSSearch = new System.Windows.Forms.GroupBox();
            this.DTPickerTo = new System.Windows.Forms.DateTimePicker();
            this.DTPickerFrom = new System.Windows.Forms.DateTimePicker();
            this.GrpMaxCredible = new System.Windows.Forms.GroupBox();
            this.ProgressMCUpload = new System.Windows.Forms.ProgressBar();
            this.label3 = new System.Windows.Forms.Label();
            this.TxtChunkQty = new System.Windows.Forms.TextBox();
            this.TxtMaxCredibleUpload = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.BtnMaxCredibleUpload = new System.Windows.Forms.Button();
            this.TxtChunkSize = new System.Windows.Forms.TextBox();
            this.LblChunkSize = new System.Windows.Forms.Label();
            this.ChkAutoUpload = new System.Windows.Forms.CheckBox();
            this.ChkAutoFinish = new System.Windows.Forms.CheckBox();
            this.ChkFileXMLOnly = new System.Windows.Forms.CheckBox();
            this.GrpNSSearch.SuspendLayout();
            this.GrpMaxCredible.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnGet
            // 
            this.btnGet.Location = new System.Drawing.Point(15, 99);
            this.btnGet.Name = "btnGet";
            this.btnGet.Size = new System.Drawing.Size(75, 23);
            this.btnGet.TabIndex = 0;
            this.btnGet.Text = "Search";
            this.btnGet.UseVisualStyleBackColor = true;
            this.btnGet.Click += new System.EventHandler(this.btnGet_Click);
            // 
            // lblDTFrom
            // 
            this.lblDTFrom.AutoSize = true;
            this.lblDTFrom.Location = new System.Drawing.Point(12, 66);
            this.lblDTFrom.Name = "lblDTFrom";
            this.lblDTFrom.Size = new System.Drawing.Size(30, 13);
            this.lblDTFrom.TabIndex = 1;
            this.lblDTFrom.Text = "From";
            // 
            // lblDTTo
            // 
            this.lblDTTo.AutoSize = true;
            this.lblDTTo.Location = new System.Drawing.Point(174, 66);
            this.lblDTTo.Name = "lblDTTo";
            this.lblDTTo.Size = new System.Drawing.Size(20, 13);
            this.lblDTTo.TabIndex = 3;
            this.lblDTTo.Text = "To";
            // 
            // txtSearchResults
            // 
            this.txtSearchResults.AcceptsTab = true;
            this.txtSearchResults.Location = new System.Drawing.Point(15, 150);
            this.txtSearchResults.Multiline = true;
            this.txtSearchResults.Name = "txtSearchResults";
            this.txtSearchResults.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtSearchResults.Size = new System.Drawing.Size(309, 320);
            this.txtSearchResults.TabIndex = 7;
            // 
            // lblSearchResults
            // 
            this.lblSearchResults.AutoSize = true;
            this.lblSearchResults.Location = new System.Drawing.Point(11, 132);
            this.lblSearchResults.Name = "lblSearchResults";
            this.lblSearchResults.Size = new System.Drawing.Size(123, 13);
            this.lblSearchResults.TabIndex = 8;
            this.lblSearchResults.Text = "NetSuite Search Results";
            // 
            // LblStatus
            // 
            this.LblStatus.AutoSize = true;
            this.LblStatus.Location = new System.Drawing.Point(110, 104);
            this.LblStatus.Name = "LblStatus";
            this.LblStatus.Size = new System.Drawing.Size(214, 13);
            this.LblStatus.TabIndex = 10;
            this.LblStatus.Text = "Click \'Search\' to download NetSuite records";
            // 
            // TxtSavedSearch1
            // 
            this.TxtSavedSearch1.Location = new System.Drawing.Point(93, 49);
            this.TxtSavedSearch1.Name = "TxtSavedSearch1";
            this.TxtSavedSearch1.Size = new System.Drawing.Size(251, 20);
            this.TxtSavedSearch1.TabIndex = 12;
            this.TxtSavedSearch1.Text = "customsearch_maxcredibleinvoiceexport_v1";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 40);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(55, 13);
            this.label1.TabIndex = 11;
            this.label1.Text = "Search ID";
            // 
            // btnFinish
            // 
            this.btnFinish.Location = new System.Drawing.Point(688, 488);
            this.btnFinish.Name = "btnFinish";
            this.btnFinish.Size = new System.Drawing.Size(75, 23);
            this.btnFinish.TabIndex = 14;
            this.btnFinish.Text = "Finish";
            this.btnFinish.UseVisualStyleBackColor = true;
            this.btnFinish.Click += new System.EventHandler(this.btnFinish_Click);
            // 
            // LblFinish
            // 
            this.LblFinish.AutoSize = true;
            this.LblFinish.Location = new System.Drawing.Point(480, 493);
            this.LblFinish.Name = "LblFinish";
            this.LblFinish.Size = new System.Drawing.Size(202, 13);
            this.LblFinish.TabIndex = 15;
            this.LblFinish.Text = "Click \'Finish\' to log off and exit application";
            // 
            // ProgressNSSearch
            // 
            this.ProgressNSSearch.Location = new System.Drawing.Point(35, 488);
            this.ProgressNSSearch.Name = "ProgressNSSearch";
            this.ProgressNSSearch.Size = new System.Drawing.Size(291, 23);
            this.ProgressNSSearch.TabIndex = 16;
            // 
            // GrpNSSearch
            // 
            this.GrpNSSearch.Controls.Add(this.DTPickerTo);
            this.GrpNSSearch.Controls.Add(this.DTPickerFrom);
            this.GrpNSSearch.Controls.Add(this.label1);
            this.GrpNSSearch.Controls.Add(this.lblDTFrom);
            this.GrpNSSearch.Controls.Add(this.txtSearchResults);
            this.GrpNSSearch.Controls.Add(this.lblDTTo);
            this.GrpNSSearch.Controls.Add(this.btnGet);
            this.GrpNSSearch.Controls.Add(this.LblStatus);
            this.GrpNSSearch.Controls.Add(this.lblSearchResults);
            this.GrpNSSearch.Location = new System.Drawing.Point(20, 12);
            this.GrpNSSearch.Name = "GrpNSSearch";
            this.GrpNSSearch.Size = new System.Drawing.Size(344, 511);
            this.GrpNSSearch.TabIndex = 17;
            this.GrpNSSearch.TabStop = false;
            this.GrpNSSearch.Text = "Step 1 - Search and Load NetSuite Records";
            // 
            // DTPickerTo
            // 
            this.DTPickerTo.Location = new System.Drawing.Point(200, 63);
            this.DTPickerTo.MinDate = new System.DateTime(2012, 1, 1, 0, 0, 0, 0);
            this.DTPickerTo.Name = "DTPickerTo";
            this.DTPickerTo.Size = new System.Drawing.Size(124, 20);
            this.DTPickerTo.TabIndex = 14;
            // 
            // DTPickerFrom
            // 
            this.DTPickerFrom.Location = new System.Drawing.Point(48, 63);
            this.DTPickerFrom.MinDate = new System.DateTime(2012, 1, 1, 0, 0, 0, 0);
            this.DTPickerFrom.Name = "DTPickerFrom";
            this.DTPickerFrom.Size = new System.Drawing.Size(124, 20);
            this.DTPickerFrom.TabIndex = 12;
            // 
            // GrpMaxCredible
            // 
            this.GrpMaxCredible.Controls.Add(this.ProgressMCUpload);
            this.GrpMaxCredible.Controls.Add(this.label3);
            this.GrpMaxCredible.Controls.Add(this.TxtChunkQty);
            this.GrpMaxCredible.Controls.Add(this.TxtMaxCredibleUpload);
            this.GrpMaxCredible.Controls.Add(this.label2);
            this.GrpMaxCredible.Controls.Add(this.BtnMaxCredibleUpload);
            this.GrpMaxCredible.Controls.Add(this.TxtChunkSize);
            this.GrpMaxCredible.Controls.Add(this.LblChunkSize);
            this.GrpMaxCredible.Location = new System.Drawing.Point(403, 12);
            this.GrpMaxCredible.Name = "GrpMaxCredible";
            this.GrpMaxCredible.Size = new System.Drawing.Size(379, 395);
            this.GrpMaxCredible.TabIndex = 18;
            this.GrpMaxCredible.TabStop = false;
            this.GrpMaxCredible.Text = "Step 2 - Upload Records to MaxCredible";
            // 
            // ProgressMCUpload
            // 
            this.ProgressMCUpload.Location = new System.Drawing.Point(17, 359);
            this.ProgressMCUpload.Name = "ProgressMCUpload";
            this.ProgressMCUpload.Size = new System.Drawing.Size(325, 23);
            this.ProgressMCUpload.TabIndex = 21;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(14, 87);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(140, 13);
            this.label3.TabIndex = 22;
            this.label3.Text = "MaxCredible Upload Results";
            // 
            // TxtChunkQty
            // 
            this.TxtChunkQty.Location = new System.Drawing.Point(307, 37);
            this.TxtChunkQty.Name = "TxtChunkQty";
            this.TxtChunkQty.ReadOnly = true;
            this.TxtChunkQty.Size = new System.Drawing.Size(53, 20);
            this.TxtChunkQty.TabIndex = 24;
            // 
            // TxtMaxCredibleUpload
            // 
            this.TxtMaxCredibleUpload.AcceptsTab = true;
            this.TxtMaxCredibleUpload.Location = new System.Drawing.Point(17, 103);
            this.TxtMaxCredibleUpload.Multiline = true;
            this.TxtMaxCredibleUpload.Name = "TxtMaxCredibleUpload";
            this.TxtMaxCredibleUpload.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.TxtMaxCredibleUpload.Size = new System.Drawing.Size(343, 250);
            this.TxtMaxCredibleUpload.TabIndex = 21;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(206, 40);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(95, 13);
            this.label2.TabIndex = 23;
            this.label2.Text = "Number of Chunks";
            // 
            // BtnMaxCredibleUpload
            // 
            this.BtnMaxCredibleUpload.Enabled = false;
            this.BtnMaxCredibleUpload.Location = new System.Drawing.Point(285, 70);
            this.BtnMaxCredibleUpload.Name = "BtnMaxCredibleUpload";
            this.BtnMaxCredibleUpload.Size = new System.Drawing.Size(75, 23);
            this.BtnMaxCredibleUpload.TabIndex = 21;
            this.BtnMaxCredibleUpload.Text = "Upload";
            this.BtnMaxCredibleUpload.UseVisualStyleBackColor = true;
            this.BtnMaxCredibleUpload.Click += new System.EventHandler(this.BtnMaxCredibleUpload_Click);
            // 
            // TxtChunkSize
            // 
            this.TxtChunkSize.Location = new System.Drawing.Point(92, 37);
            this.TxtChunkSize.Name = "TxtChunkSize";
            this.TxtChunkSize.ReadOnly = true;
            this.TxtChunkSize.Size = new System.Drawing.Size(53, 20);
            this.TxtChunkSize.TabIndex = 22;
            this.TxtChunkSize.Text = "25";
            this.TxtChunkSize.TextChanged += new System.EventHandler(this.TxtChunkSize_TextChanged);
            // 
            // LblChunkSize
            // 
            this.LblChunkSize.AutoSize = true;
            this.LblChunkSize.Location = new System.Drawing.Point(25, 40);
            this.LblChunkSize.Name = "LblChunkSize";
            this.LblChunkSize.Size = new System.Drawing.Size(61, 13);
            this.LblChunkSize.TabIndex = 21;
            this.LblChunkSize.Text = "Chunk Size";
            // 
            // ChkAutoUpload
            // 
            this.ChkAutoUpload.AutoSize = true;
            this.ChkAutoUpload.Location = new System.Drawing.Point(420, 433);
            this.ChkAutoUpload.Name = "ChkAutoUpload";
            this.ChkAutoUpload.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.ChkAutoUpload.Size = new System.Drawing.Size(343, 17);
            this.ChkAutoUpload.TabIndex = 19;
            this.ChkAutoUpload.Text = "Upload to MaxCredible automatically as soon as \'Search\' completes";
            this.ChkAutoUpload.UseVisualStyleBackColor = true;
            // 
            // ChkAutoFinish
            // 
            this.ChkAutoFinish.AutoSize = true;
            this.ChkAutoFinish.Location = new System.Drawing.Point(500, 456);
            this.ChkAutoFinish.Name = "ChkAutoFinish";
            this.ChkAutoFinish.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.ChkAutoFinish.Size = new System.Drawing.Size(263, 17);
            this.ChkAutoFinish.TabIndex = 20;
            this.ChkAutoFinish.Text = "Finish automatically as soon as \'Upload\' completes";
            this.ChkAutoFinish.UseVisualStyleBackColor = true;
            // 
            // ChkFileXMLOnly
            // 
            this.ChkFileXMLOnly.AutoSize = true;
            this.ChkFileXMLOnly.Location = new System.Drawing.Point(491, 410);
            this.ChkFileXMLOnly.Name = "ChkFileXMLOnly";
            this.ChkFileXMLOnly.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.ChkFileXMLOnly.Size = new System.Drawing.Size(272, 17);
            this.ChkFileXMLOnly.TabIndex = 21;
            this.ChkFileXMLOnly.Text = "Create XML files only - no MaxCredible web services";
            this.ChkFileXMLOnly.UseVisualStyleBackColor = true;
            // 
            // MaxCredible_Export
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(801, 535);
            this.Controls.Add(this.ChkFileXMLOnly);
            this.Controls.Add(this.ChkAutoFinish);
            this.Controls.Add(this.ChkAutoUpload);
            this.Controls.Add(this.GrpMaxCredible);
            this.Controls.Add(this.ProgressNSSearch);
            this.Controls.Add(this.LblFinish);
            this.Controls.Add(this.btnFinish);
            this.Controls.Add(this.TxtSavedSearch1);
            this.Controls.Add(this.GrpNSSearch);
            this.Name = "MaxCredible_Export";
            this.Text = "MaxCredible Export";
            this.GrpNSSearch.ResumeLayout(false);
            this.GrpNSSearch.PerformLayout();
            this.GrpMaxCredible.ResumeLayout(false);
            this.GrpMaxCredible.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnGet;
        private System.Windows.Forms.Label lblDTFrom;
        private System.Windows.Forms.Label lblDTTo;
        private System.Windows.Forms.TextBox txtSearchResults;
        private System.Windows.Forms.Label lblSearchResults;
        private System.Windows.Forms.Label LblStatus;
        private System.Windows.Forms.TextBox TxtSavedSearch1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btnFinish;
        private System.Windows.Forms.Label LblFinish;
        private System.Windows.Forms.ProgressBar ProgressNSSearch;
        private System.Windows.Forms.GroupBox GrpNSSearch;
        private System.Windows.Forms.GroupBox GrpMaxCredible;
        private System.Windows.Forms.CheckBox ChkAutoUpload;
        private System.Windows.Forms.CheckBox ChkAutoFinish;
        private System.Windows.Forms.TextBox TxtChunkSize;
        private System.Windows.Forms.Label LblChunkSize;
        private System.Windows.Forms.Button BtnMaxCredibleUpload;
        private System.Windows.Forms.TextBox TxtChunkQty;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox TxtMaxCredibleUpload;
        private System.Windows.Forms.ProgressBar ProgressMCUpload;
        private System.Windows.Forms.CheckBox ChkFileXMLOnly;
        private System.Windows.Forms.DateTimePicker DTPickerFrom;
        private System.Windows.Forms.DateTimePicker DTPickerTo;
    }
}

