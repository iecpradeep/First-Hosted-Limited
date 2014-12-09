/******************
 * Expressions Search Example
 * 
 * @param {Object} customerId
 */
function executeSearch(customerId)
{
	try
	{

			//Setup the Filters and the Columns to be returned
			var searchFilter = '';
			var searchColumns = new Array();
		
			//get the Transaction Date for the Search
			tranDate = nlapiGetFieldValue('trandate');
			
			//TODO: This needs to be verified...
			//criteria =[[ 'internalid', 'is', customer  ],'and',[ 'customer.campaignresponse','is', campaignCode ]];
			
			searchFilter = [['custrecord_ga_enddate', 'after', tranDate ], 'or', [ 'custrecord_ga_enddate', 'isempty', null ] , 'and', ['custrecord_ga_donor', 'is', customerId ], 'and', ['custrecord_ga_startdate', 'onorbefore', tranDate ] ] ;
			searchColumns[0] = new nlobjSearchColumn('custrecord_ga_enddate');
		
			// perform search
			var searchResults = nlapiSearchRecord('customrecord_giftaid', null, searchFilter, searchColumns);
	
		
			if (searchResults)
			{
				if(InDebug)
				{
					alert('gift Aid Search Results Length: ' + searchResults.length);	
				}
				return true;
			}
	}
	catch(e)
	{
		alert('gAerr #190\nSearch Error:\n' + e.message);
	}
	//If it's gotten this far then they do not have a Valid Gift Aid

	return false;
}


/*********************
 * 
 *   Search Records Formula Criteria
 * 
 */
function searchRecords()
{
   // specify a formula column that displays the name as: Last Name, First Name (Middle Name)
   var name = new nlobjSearchColumn('formulatext')
   name.setFormula("{lastname}||', '||{firstname}||case when LENGTH({middlename})=0 then '' else ' ('||{middlename}||')' end")
 
   // now specify a numeric formula field
   var number = new nlobjSearchColumn('formulanumeric').setFormula("1234.5678")
 
   // now specify a numeric formula field and format the output using a special function
   var roundednumber = new nlobjSearchColumn('formulanumeric').setFormula("1234.5678").setFunction("round")
 
   // now specify a sort column (sort by internal ID ascending)
   var internalid = new nlobjSearchColumn('internalid').setSort( false /* bsortdescending */ )
 
   var columns = [name, number, roundednumber, internalid]
   var filterHasMiddleName = new nlobjSearchFilter('middlename', null, 'isNotEmpty')
 
   var searchresults = nlapiSearchRecord('contact', null, filterHasMiddleName , columns )
   for ( var i = 0; i < searchresults.length; i++ )
   {
      // access the value using the column objects
      var contactname = searchresults[i].getValue(name)
      var value = searchresults[i].getValue(number)
      var valuerounded = searchresults[i].getValue(roundednumber)
   }
}


