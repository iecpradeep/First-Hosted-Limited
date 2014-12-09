namespace NS
{
    partial class Form1
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
            this.lblCurrency = new System.Windows.Forms.Label();
            this.txtCurrency = new System.Windows.Forms.TextBox();
            this.txtJDECountry = new System.Windows.Forms.TextBox();
            this.lblJDECountry = new System.Windows.Forms.Label();
            this.txtSubsidiary = new System.Windows.Forms.TextBox();
            this.lblSubsidiary = new System.Windows.Forms.Label();
            this.txtSearchResults = new System.Windows.Forms.TextBox();
            this.lblSearchResults = new System.Windows.Forms.Label();
            this.lblFinished = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // btnGet
            // 
            this.btnGet.Location = new System.Drawing.Point(12, 12);
            this.btnGet.Name = "btnGet";
            this.btnGet.Size = new System.Drawing.Size(75, 23);
            this.btnGet.TabIndex = 0;
            this.btnGet.Text = "Get";
            this.btnGet.UseVisualStyleBackColor = true;
            this.btnGet.Click += new System.EventHandler(this.btnGet_Click);
            // 
            // lblCurrency
            // 
            this.lblCurrency.AutoSize = true;
            this.lblCurrency.Location = new System.Drawing.Point(12, 53);
            this.lblCurrency.Name = "lblCurrency";
            this.lblCurrency.Size = new System.Drawing.Size(49, 13);
            this.lblCurrency.TabIndex = 1;
            this.lblCurrency.Text = "Currency";
            this.lblCurrency.Click += new System.EventHandler(this.label1_Click);
            // 
            // txtCurrency
            // 
            this.txtCurrency.Location = new System.Drawing.Point(84, 50);
            this.txtCurrency.Name = "txtCurrency";
            this.txtCurrency.Size = new System.Drawing.Size(100, 20);
            this.txtCurrency.TabIndex = 2;
            // 
            // txtJDECountry
            // 
            this.txtJDECountry.Location = new System.Drawing.Point(84, 76);
            this.txtJDECountry.Name = "txtJDECountry";
            this.txtJDECountry.Size = new System.Drawing.Size(100, 20);
            this.txtJDECountry.TabIndex = 4;
            // 
            // lblJDECountry
            // 
            this.lblJDECountry.AutoSize = true;
            this.lblJDECountry.Location = new System.Drawing.Point(12, 79);
            this.lblJDECountry.Name = "lblJDECountry";
            this.lblJDECountry.Size = new System.Drawing.Size(66, 13);
            this.lblJDECountry.TabIndex = 3;
            this.lblJDECountry.Text = "JDE Country";
            // 
            // txtSubsidiary
            // 
            this.txtSubsidiary.Location = new System.Drawing.Point(84, 102);
            this.txtSubsidiary.Name = "txtSubsidiary";
            this.txtSubsidiary.Size = new System.Drawing.Size(100, 20);
            this.txtSubsidiary.TabIndex = 6;
            // 
            // lblSubsidiary
            // 
            this.lblSubsidiary.AutoSize = true;
            this.lblSubsidiary.Location = new System.Drawing.Point(12, 105);
            this.lblSubsidiary.Name = "lblSubsidiary";
            this.lblSubsidiary.Size = new System.Drawing.Size(55, 13);
            this.lblSubsidiary.TabIndex = 5;
            this.lblSubsidiary.Text = "Subsidiary";
            // 
            // txtSearchResults
            // 
            this.txtSearchResults.Location = new System.Drawing.Point(12, 157);
            this.txtSearchResults.Multiline = true;
            this.txtSearchResults.Name = "txtSearchResults";
            this.txtSearchResults.Size = new System.Drawing.Size(260, 93);
            this.txtSearchResults.TabIndex = 7;
            // 
            // lblSearchResults
            // 
            this.lblSearchResults.AutoSize = true;
            this.lblSearchResults.Location = new System.Drawing.Point(12, 141);
            this.lblSearchResults.Name = "lblSearchResults";
            this.lblSearchResults.Size = new System.Drawing.Size(79, 13);
            this.lblSearchResults.TabIndex = 8;
            this.lblSearchResults.Text = "Search Results";
            // 
            // lblFinished
            // 
            this.lblFinished.AutoSize = true;
            this.lblFinished.Location = new System.Drawing.Point(226, 12);
            this.lblFinished.Name = "lblFinished";
            this.lblFinished.Size = new System.Drawing.Size(0, 13);
            this.lblFinished.TabIndex = 9;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 262);
            this.Controls.Add(this.lblFinished);
            this.Controls.Add(this.lblSearchResults);
            this.Controls.Add(this.txtSearchResults);
            this.Controls.Add(this.txtSubsidiary);
            this.Controls.Add(this.lblSubsidiary);
            this.Controls.Add(this.txtJDECountry);
            this.Controls.Add(this.lblJDECountry);
            this.Controls.Add(this.txtCurrency);
            this.Controls.Add(this.lblCurrency);
            this.Controls.Add(this.btnGet);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnGet;
        private System.Windows.Forms.Label lblCurrency;
        private System.Windows.Forms.TextBox txtCurrency;
        private System.Windows.Forms.TextBox txtJDECountry;
        private System.Windows.Forms.Label lblJDECountry;
        private System.Windows.Forms.TextBox txtSubsidiary;
        private System.Windows.Forms.Label lblSubsidiary;
        private System.Windows.Forms.TextBox txtSearchResults;
        private System.Windows.Forms.Label lblSearchResults;
        private System.Windows.Forms.Label lblFinished;
    }
}

