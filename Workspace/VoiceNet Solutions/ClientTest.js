


/**
 *
 *  TEST HARNESS FOR DEBUGGER ONLY - commented out specifically - do not delete
 * 
 */
function clientTest()
{
	var headers = new Array();

	var response = null;
	var myJSONText = null;
	var contents = null;
	var url = '';
	var token = '';
	var phoneNo = '';
	
	try
	{
		headers['Content-Type'] = 'application/json';
		phoneNo = "01270446816";
		token = "9fea5c43320b4c39ec8547fdb0a45f1e";
		url = "https://testapi.voicenet-solutions.com/phones/01239803356/calls";
		contents = {"call":{"phone_number":phoneNo },"token":token};
		myJSONText =  JSON.stringify(contents , replacers());
		nlapiRequestURL( url, myJSONText , headers);
	}
	catch(e)
	{
		alert('clientTest'+ e.message);
		nlapiLogExecution('error', 'clientTest', e.message);
	}
}

	headers['Content-Type'] = 'application/json';
	var phoneNo = "01270446816";
	var token = "9fea5c43320b4c39ec8547fdb0a45f1e";
	var url = "https://testapi.voicenet-solutions.com/phones/01239803356/calls";
	var contents = {"call":{"phone_number":phoneNo },"token":token};
	var myJSONText =  JSON.stringify(contents , replacers);
	
	var response = nlapiRequestURL( url, myJSONText , headers);
	
	var a=0;


/**
 * @param key
 * @param value
 * @returns
 */
function replacers(key, value) 
{
	if (typeof value == 'number' && !isFinite(value)) 
	{
		return String(value);
	}
	
	return value;
}
