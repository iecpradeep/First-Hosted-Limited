/*****************************************
 * Name:	 Expense Claim Printing
 * Author:   Toby. Amended 6th March 2012 by Pete Lewis
 * Client: 	 The StoryTellers
 * Date:     06 Mar 2012
 * Version:  1.2
 ******************************************/

function currencyChange(type, name)
{
	try
	{
		if(name == 'currency')
		{
		setBankDetails();
		}
	}
	catch(e)
	{
		alert('An error has occurred\n' + e.message);
	}
return true;
}

function setBankDetails()
{
var currency = nlapiGetFieldValue('currency');

	var accountfilters = new Array();
	accountfilters[0] = new nlobjSearchFilter('custrecord_currency', null, 'anyof', currency);
	
	var accountcolumns = new Array();
	accountcolumns[0] = new nlobjSearchColumn('custrecord_accountnumber');
	accountcolumns[1] = new nlobjSearchColumn('custrecord_sortcode');
	accountcolumns[2] = new nlobjSearchColumn('custrecord_iban');
	
	var accountsearchresults = nlapiSearchRecord( 'customrecord_bankaccountdetails', null, accountfilters, accountcolumns);
	if (accountsearchresults != null)
	{
		for (var i = 0; accountsearchresults != null && i < accountsearchresults.length; i++)
		{
			var searchresult = accountsearchresults[ i ];
			var accountNo = searchresult.getValue('custrecord_accountnumber');
			var sortCode = searchresult.getValue('custrecord_sortcode');
			var IBAN = searchresult.getValue('custrecord_iban');
		
			nlapiSetFieldValue('custbody_sortcode', sortCode);
			nlapiSetFieldValue('custbody_accountnumber', accountNo);
			nlapiSetFieldValue('custbody_iban', IBAN);
		}
	
	}
return true;
}
