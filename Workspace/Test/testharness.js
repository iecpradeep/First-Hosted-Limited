

**
 * dial a number
 *
 */

function callVoicenetService()
{

	var jsonobj = null;
	var JSONText = '';
	var headers = new Array();
	var vnURL = 'https://testapi.VoiceNet-solutions.com/phones/01239803356/calls';
	var toPhone = '01270446816';
	var token = '9fea5c43320b4c39ec8547fdb0a45f1e';

	try
	{

		jsonobj=
		{
				"call":
				{
					"phone_number":toPhone
				},
				"token": token
		};

		// set up headers
		headers['User-Agent-x'] = 'SuiteScript-Call';
	    headers['Content-Type'] = 'application/json';

	    JSONText = JSON.stringify(jsonobj, replacer);

		// goto the URL
		vnURL = getVoiceNetURL(fromPhone);
		nlapiRequestURL(vnURL, JSONText, headers, null);
		nlapi

	}
	catch(e)
	{
		errorHandler("dialNumber", e);		
	}

}