using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace NS
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            try
            {
                Application.Run(new MaxCredible_Export());
            }
            catch (Exception ex)
            {
                Application.Exit();
            }
        }
    }
}
