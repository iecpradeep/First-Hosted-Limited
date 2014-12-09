namespace RareRestlet
{
    partial class frmMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.MainMenu mainMenu1;

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
            this.mainMenu1 = new System.Windows.Forms.MainMenu();
            this.btnSell = new System.Windows.Forms.Button();
            this.btnUnsell = new System.Windows.Forms.Button();
            this.statMain = new System.Windows.Forms.StatusBar();
            this.btnRest = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.btnSettings = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnSell
            // 
            this.btnSell.Location = new System.Drawing.Point(132, 70);
            this.btnSell.Name = "btnSell";
            this.btnSell.Size = new System.Drawing.Size(105, 29);
            this.btnSell.TabIndex = 0;
            this.btnSell.Text = "Sell stuff";
            this.btnSell.Click += new System.EventHandler(this.btnSell_Click);
            // 
            // btnUnsell
            // 
            this.btnUnsell.Location = new System.Drawing.Point(132, 105);
            this.btnUnsell.Name = "btnUnsell";
            this.btnUnsell.Size = new System.Drawing.Size(105, 29);
            this.btnUnsell.TabIndex = 1;
            this.btnUnsell.Text = "Unsell it";
            this.btnUnsell.Click += new System.EventHandler(this.btnUnsell_Click);
            // 
            // statMain
            // 
            this.statMain.Location = new System.Drawing.Point(0, 178);
            this.statMain.Name = "statMain";
            this.statMain.Size = new System.Drawing.Size(240, 22);
            // 
            // btnRest
            // 
            this.btnRest.Location = new System.Drawing.Point(3, 70);
            this.btnRest.Name = "btnRest";
            this.btnRest.Size = new System.Drawing.Size(105, 29);
            this.btnRest.TabIndex = 2;
            this.btnRest.Text = "REST test";
            this.btnRest.Click += new System.EventHandler(this.btnRest_Click);
            // 
            // btnExit
            // 
            this.btnExit.Location = new System.Drawing.Point(132, 140);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(105, 29);
            this.btnExit.TabIndex = 5;
            this.btnExit.Text = "Exit";
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // btnSettings
            // 
            this.btnSettings.Location = new System.Drawing.Point(3, 140);
            this.btnSettings.Name = "btnSettings";
            this.btnSettings.Size = new System.Drawing.Size(105, 29);
            this.btnSettings.TabIndex = 8;
            this.btnSettings.Text = "Settings";
            this.btnSettings.Click += new System.EventHandler(this.btnSettings_Click);
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(96F, 96F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.AutoScroll = true;
            this.ClientSize = new System.Drawing.Size(240, 200);
            this.Controls.Add(this.btnSettings);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.btnRest);
            this.Controls.Add(this.statMain);
            this.Controls.Add(this.btnSell);
            this.Controls.Add(this.btnUnsell);
            this.MinimizeBox = false;
            this.Name = "frmMain";
            this.Text = "FirstPOS Mobile";
            this.Load += new System.EventHandler(this.frmMain_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnSell;
        private System.Windows.Forms.Button btnUnsell;
        private System.Windows.Forms.StatusBar statMain;
        private System.Windows.Forms.Button btnRest;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Button btnSettings;
    }
}

