

function sayhi()
{
    var o = new Object();
    o.sayhi = 'Hello World! ';
    return o;
}

//
//function credentials()
//{
//    this.email='anthony.morganti@firsthosted.co.uk';
//    this.account='698509';
//    this.role='3';
//    this.password='Trixie1172';
//}
// 
//function replacer(key, value) {
//    if (typeof value === 'number' && !isFinite(value)) {
//        return String(value);
//    }
//    return value;
//}
// 
// 
//                //Setting up URL              
//                var url = 'https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=234&deploy=1';
//                //Calling credential function
//                var cred = new credentials();
//                
//                //Setting up Headers 
//                var headers = new Array();
//                headers['User-Agent-x'] = 'SuiteScript-Call';
//                headers['Authorization'] = 'NLAuth nlauth_account='+cred.account+', nlauth_email='+cred.email+', nlauth_signature='+cred.password+', nlauth_role='+cred.role;
//                headers['Content-Type'] = 'application/json';
//                
//                //Setting up Datainput
//                var jsonobj={"recordtype":"customer","entityid":"John Doe","companyname":"ABC Company", "subsidiary":"1","email":"jdoe@email.com"};
//                
//                //Stringifying JSON
//                var myJSONText = JSON.stringify(jsonobj, replacer);
// 
//                var response = nlapiRequestURL( url, myJSONText , headers );
//    
//                                //Below is being used to put a breakpoint in the debugger
//                var i=0;
// 
////****RESTLET Code****
// 
//// Create a standard NetSuite record
//function createRecord(datain)
//{
//    var err = new Object();
//   
//    // Validate if mandatory record type is set in the request
//    if (!datain.recordtype)
//    {
//        err.status = "failed";
//        err.message= "missing recordtype";
//        return err;
//   }
//   
//    var record = nlapiCreateRecord(datain.recordtype);
//   
//    for (var fieldname in datain)
//    {
//     if (datain.hasOwnProperty(fieldname))
//     {
//         if (fieldname != 'recordtype' && fieldname != 'id')
//         {
//             var value = datain[fieldname];
//             if (value && typeof value != 'object') // ignore other type of parameters
//             {
//                 record.setFieldValue(fieldname, value);
//             }
//         }
//     }
//    }
//    var recordId = nlapiSubmitRecord(record);
//    nlapiLogExecution('DEBUG','id='+recordId);
//   
//    var nlobj = nlapiLoadRecord(datain.recordtype,recordId);
//    return nlobj;
//}