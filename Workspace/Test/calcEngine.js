/**********************************************************************************************************
 * Name:        calcEngine.js
 * Script Type: Suitelet
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  
 * Author:      FHL
 * Purpose:     Allow multiple sims to be selected (items separated by chr(5))
 * 
 * Script:      customscript_simSelector
 * Deploy:     	customdeploy_simSelector
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var searchResults = null;


/**
 * Top-level function called by Script Deployment
 */
function calcEngine(request, response)
{
	var customerExists = 'internalID = 23;';
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	
	runSavedSearch(1, 10,'customsearch_calctest');
	dosomething();
	runSavedSearch(20, 30,'customsearch_calctest');
	dosomething();
	runSavedSearch(40, 50,'customsearch_calctest');
	dosomething();
	runSavedSearch(50, 60,'customsearch_calctest');
	dosomething();
	runSavedSearch(70, 80,'customsearch_calctest');
	dosomething();
	runSavedSearch(80, 90,'customsearch_calctest');
	dosomething();
	runSavedSearch(90, 100,'customsearch_calctest');
	dosomething();
	runSavedSearch(1, 120,'customsearch_calctest');
	
	genericSearch('customer', 'internalid',823);
	
	var customerExists = 'internalID = ' + searchResults.length; 
	
	writeItemsToCRS();
	
	response.write(customerExists);
	
	return true;
}



/**
 * writeItemsToCRS
 * 
 */

function writeItemsToCRS()
{

	var currentLineNumber=0;
	var retVal = true;
	
//	try
//	{

	//	var linesInBasket = nlapiGetLineItemCount('item');
		
		for(var x=1; x<=20; x++)
		{
			
		//	currentLineNumber = x;
			
		//	nlapiSelectLineItem('item', currentLineNumber);
			
			var newRec = nlapiCreateRecord('customrecord_offershipcalc');
			
			newRec.setFieldValue('custrecord_item', 'zzz');
			newRec.setFieldValue('custrecord_desc', 'xxx');
			
			newRec = nlapiSubmitRecord(newRec, false);

			
		}
		

	//}
//	catch(e)
//	{
//		errorHandler("writeItemsToCRS", e);
	//	alert('error writeItemsToCRS')
//	}     	      

	return retVal;

}


function dosomething()
{

	var x = 0;
	var y = 0;
	var z = 0;
	var s = '';
	
	
	for(var a=0; a<100; a++)
	{
		
		x = Math.floor(Math.random()*11);
		y = Math.floor(Math.random()*11);
		z = x * y;
		
		s=s+'a'+z;
		
	}
	


}
 