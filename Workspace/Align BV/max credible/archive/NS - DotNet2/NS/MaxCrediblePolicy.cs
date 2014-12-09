using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using NS.Properties;

namespace NS
{
    public class MaxCrediblePolicy : ICertificatePolicy 
    {
        public bool CheckValidationResult(
		ServicePoint srvPoint
		, X509Certificate certificate
        , WebRequest request, int certificateProblem)

        {

            //Return True to force the certificate to be accepted.
            return true;

        } // end CheckValidationResult
    }
}
