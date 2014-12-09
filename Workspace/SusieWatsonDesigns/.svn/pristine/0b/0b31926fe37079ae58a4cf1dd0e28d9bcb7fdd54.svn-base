/********************************************************************
* Name:			fhl.homeslider.suitelet.js
* Script Type:	Suitelet
*
* Version:	1.0.0 - 2013-03-14 - Initial release - SB
*
* Author:	S.Boot FHL
*
* Purpose:	Provides fhl.homeslider.js with slider data in JSON
*
* Script:	customscript_fhl_home_slider
* Deploy:	customdeploy_fhl_home_slider
*
* Notes:	Called by fhl.homeslider.js
*
* Library:	
********************************************************************/

function homesliderSuitelet(request, response)
{
	var slidesJSON = {slides:[]};
	
	// Set content type for output
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	
	// Find active Slides
	var slideResults = null;
	
	try
	{
		slideResults = slideSearch();
		
		// Loop through active slide records
		if (slideResults)
		{
			for (var i = 0; i < slideResults.length; i++)
			{
				// Populate JSON structure
				slidesJSON.slides.push({
					title: slideResults[i].getValue('custrecord_title'),
					linkText: slideResults[i].getValue('custrecord_link_text'),
					optionalText: slideResults[i].getValue('custrecord_optional_text'),
					image: slideResults[i].getText('custrecord_image'),
					link: slideResults[i].getValue('custrecord_link')
				});
			}
		}
	
		// Output to response
		response.write(JSON.stringify(slidesJSON));
	}
	catch(e)
	{
		errorHandler("slideSearch", e);
	}  
}

/**
 * Search for active Slide records
 * @returns {nlobjSearchResult}
 */
function slideSearch()
{
	var filters = new Array();
	var columns = new Array();
	var results = null;

	try
	{
		// Filters                  
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');                          

		// Columns to return
		columns[0] = new nlobjSearchColumn('custrecord_title');
		columns[1] = new nlobjSearchColumn('custrecord_link_text');
		columns[2] = new nlobjSearchColumn('custrecord_optional_text');
		columns[3] = new nlobjSearchColumn('custrecord_image');
		columns[4] = new nlobjSearchColumn('custrecord_link');

		// Perform search
		results = nlapiSearchRecord('customrecord_content_slide', null, filters, columns);
	}
	catch(e)
	{
		errorHandler("slideSearch", e);
	}     	      

	return results;
}

/**
 * error handler
 */
function errorHandler(errorSource, e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution( 'ERROR', 'unexpected error: ' + errorSource , errorMessage);
}

/**
 * get error message string
 */
function getErrorMessage(e)
{
	var retVal = '';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}

	return retVal;
}