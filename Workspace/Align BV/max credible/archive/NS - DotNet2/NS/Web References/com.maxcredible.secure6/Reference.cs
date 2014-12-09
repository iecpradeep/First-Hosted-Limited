﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.269
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// 
// This source code was auto-generated by Microsoft.VSDesigner, Version 4.0.30319.269.
// 
#pragma warning disable 1591

namespace NS.com.maxcredible.secure6 {
    using System;
    using System.Web.Services;
    using System.Diagnostics;
    using System.Web.Services.Protocols;
    using System.ComponentModel;
    using System.Xml.Serialization;
    
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.1")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Web.Services.WebServiceBindingAttribute(Name="Invoer_mcSoap", Namespace="http://www.MaxCredible.com/")]
    public partial class Invoer_mc : System.Web.Services.Protocols.SoapHttpClientProtocol {
        
        private System.Threading.SendOrPostCallback XMLReceiveOperationCompleted;
        
        private System.Threading.SendOrPostCallback XMLBatchReceiveOperationCompleted;
        
        private bool useDefaultCredentialsSetExplicitly;
        
        /// <remarks/>
        public Invoer_mc() {
            this.Url = global::NS.Properties.Settings.Default.MaxCredibleExport_com_maxcredible_secure6_Invoer_mc;
            if ((this.IsLocalFileSystemWebService(this.Url) == true)) {
                this.UseDefaultCredentials = true;
                this.useDefaultCredentialsSetExplicitly = false;
            }
            else {
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        public new string Url {
            get {
                return base.Url;
            }
            set {
                if ((((this.IsLocalFileSystemWebService(base.Url) == true) 
                            && (this.useDefaultCredentialsSetExplicitly == false)) 
                            && (this.IsLocalFileSystemWebService(value) == false))) {
                    base.UseDefaultCredentials = false;
                }
                base.Url = value;
            }
        }
        
        public new bool UseDefaultCredentials {
            get {
                return base.UseDefaultCredentials;
            }
            set {
                base.UseDefaultCredentials = value;
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        /// <remarks/>
        public event XMLReceiveCompletedEventHandler XMLReceiveCompleted;
        
        /// <remarks/>
        public event XMLBatchReceiveCompletedEventHandler XMLBatchReceiveCompleted;
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://www.MaxCredible.com/XMLReceive", RequestNamespace="http://www.MaxCredible.com/", ResponseNamespace="http://www.MaxCredible.com/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public System.Xml.XmlNode XMLReceive(string txtUN, string txtUP, string txtXML) {
            object[] results = this.Invoke("XMLReceive", new object[] {
                        txtUN,
                        txtUP,
                        txtXML});
            return ((System.Xml.XmlNode)(results[0]));
        }
        
        /// <remarks/>
        public void XMLReceiveAsync(string txtUN, string txtUP, string txtXML) {
            this.XMLReceiveAsync(txtUN, txtUP, txtXML, null);
        }
        
        /// <remarks/>
        public void XMLReceiveAsync(string txtUN, string txtUP, string txtXML, object userState) {
            if ((this.XMLReceiveOperationCompleted == null)) {
                this.XMLReceiveOperationCompleted = new System.Threading.SendOrPostCallback(this.OnXMLReceiveOperationCompleted);
            }
            this.InvokeAsync("XMLReceive", new object[] {
                        txtUN,
                        txtUP,
                        txtXML}, this.XMLReceiveOperationCompleted, userState);
        }
        
        private void OnXMLReceiveOperationCompleted(object arg) {
            if ((this.XMLReceiveCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.XMLReceiveCompleted(this, new XMLReceiveCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://www.MaxCredible.com/XMLBatchReceive", RequestNamespace="http://www.MaxCredible.com/", ResponseNamespace="http://www.MaxCredible.com/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public System.Xml.XmlNode XMLBatchReceive(string Username, string Password, string BatchName, string SendXML) {
            object[] results = this.Invoke("XMLBatchReceive", new object[] {
                        Username,
                        Password,
                        BatchName,
                        SendXML});
            return ((System.Xml.XmlNode)(results[0]));
        }
        
        /// <remarks/>
        public void XMLBatchReceiveAsync(string Username, string Password, string BatchName, string SendXML) {
            this.XMLBatchReceiveAsync(Username, Password, BatchName, SendXML, null);
        }
        
        /// <remarks/>
        public void XMLBatchReceiveAsync(string Username, string Password, string BatchName, string SendXML, object userState) {
            if ((this.XMLBatchReceiveOperationCompleted == null)) {
                this.XMLBatchReceiveOperationCompleted = new System.Threading.SendOrPostCallback(this.OnXMLBatchReceiveOperationCompleted);
            }
            this.InvokeAsync("XMLBatchReceive", new object[] {
                        Username,
                        Password,
                        BatchName,
                        SendXML}, this.XMLBatchReceiveOperationCompleted, userState);
        }
        
        private void OnXMLBatchReceiveOperationCompleted(object arg) {
            if ((this.XMLBatchReceiveCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.XMLBatchReceiveCompleted(this, new XMLBatchReceiveCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        public new void CancelAsync(object userState) {
            base.CancelAsync(userState);
        }
        
        private bool IsLocalFileSystemWebService(string url) {
            if (((url == null) 
                        || (url == string.Empty))) {
                return false;
            }
            System.Uri wsUri = new System.Uri(url);
            if (((wsUri.Port >= 1024) 
                        && (string.Compare(wsUri.Host, "localHost", System.StringComparison.OrdinalIgnoreCase) == 0))) {
                return true;
            }
            return false;
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.1")]
    public delegate void XMLReceiveCompletedEventHandler(object sender, XMLReceiveCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.1")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class XMLReceiveCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal XMLReceiveCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public System.Xml.XmlNode Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((System.Xml.XmlNode)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.1")]
    public delegate void XMLBatchReceiveCompletedEventHandler(object sender, XMLBatchReceiveCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.1")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class XMLBatchReceiveCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal XMLBatchReceiveCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public System.Xml.XmlNode Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((System.Xml.XmlNode)(this.results[0]));
            }
        }
    }
}

#pragma warning restore 1591