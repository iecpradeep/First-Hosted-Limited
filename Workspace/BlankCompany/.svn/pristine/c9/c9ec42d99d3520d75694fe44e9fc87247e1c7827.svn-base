/*************
 * Test Harness for getUrl
 */


function getUrlTest()
{
	var retVal = '';
	try
	{
		var query = getURLParameter('idt');
		alert(query);
	}
	catch(e)
	{
		retVal = 'error: ' + e.message;
		alert(retVal);
	}
	//return retVal;
}



/***********************
 * getURLParameter - gets the specified parameter from the URL
 * 
 * @param parameterName - The URL Parameter
 * @returns - The Value of the Parameter
 */
function getURLParameter(parameterName)
{
	
	var retVal = '';
	var regexS = '';  
	var regex = '';  
	var results = ''; 

	try
	{
		parameterName = parameterName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		regexS = "[\\?&]"+parameterName+"=([^&#]*)";  
		regex = new RegExp( regexS );  
		results = regex.exec(window.location.href); 

		if( results == null )   
		{
			retVal = '';  
		}
		else 
		{
			retVal = results[1];
		}
	}
	catch(e)
	{
		retVal = e.message();
	}

	return retVal;
}
