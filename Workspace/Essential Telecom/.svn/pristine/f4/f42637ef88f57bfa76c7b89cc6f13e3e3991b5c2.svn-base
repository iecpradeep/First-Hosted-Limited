/**********************************************************************
* Name:         BlueBerry mobile SIM calculation
* Script Type:  Client
* Client:		Essential Telecom/Blueberry Mobile
* 
* Version:      1.0.0 - 11th May 2012 - 1st release - AN

* Author:       Anthony Nixon & Matthew Lawrence, First Hosted Limited
* Purpose:      To calculate the SIM card balance
***********************************************************************/

/**
 * Disables call time and topup fields on page load
 */
function SIMpageinit()
{
	nlapiDisableField('custrecord_sim_activity_calltime', true);
	nlapiDisableField('custrecord_sim_activity_topup', true);

	return true;
}

/**
* Calls the other two functions based on the field changed
* 
* @type - unused
* @name - name of the field that has changed
* @linenum - unused
*/
function SIMCalculation(type, name, linenum)
{
	var phonenumber = null;
	var balance = 0;
	var filters = new Array();
	var columns = new Array();
	var results = null;
	
	if(name == 'custrecord_sim_activity_phonenumber')
	{
		phonenumber = nlapiGetFieldText('custrecord_sim_activity_phonenumber');
		
		if (phonenumber.length > 0)
		{			
			nlapiDisableField('custrecord_sim_activity_calltime', false);
		    nlapiDisableField('custrecord_sim_activity_topup', false);
		    
			filters[0] = new nlobjSearchFilter('custrecord_sim_phone_number', null, 'is', phonenumber);
			
			columns[0] = new nlobjSearchColumn('custrecord_sim_balance');
			
			results = nlapiSearchRecord('customrecord_sim_card', null, filters, columns);
			
			if (results != null)
			{
				balance = results[0].getValue(columns[0]);
				nlapiSetFieldValue('custrecord_sim_activity_balance', balance);	
			}
		}
	}

	if(name == 'custrecord_sim_activity_calltime')
	{
		SIMCalculationUsed();
	}

	if(name == 'custrecord_sim_activity_topup')
	{
		SIMCalculationTopUp();
	}

   return true;
}

/**
* Calculates when minutes are removed
*/
function SIMCalculationUsed()
{
	var balance = 0;
	var minutesUsed = 0;
	var newBalance = 0;
	
	balance = nlapiGetFieldValue('custrecord_sim_activity_balance');
	minutesUsed = nlapiGetFieldValue('custrecord_sim_activity_calltime');
	
	newBalance = parseInt(balance) - parseInt(minutesUsed);
	
	if (newBalance >= 0)
	{
		nlapiSetFieldValue('custrecord_sim_activity_balance', newBalance);
	}
	else
	{
		alert('Cannot process negative balance.');
	}
	
	nlapiDisableField('custrecord_sim_activity_phonenumber', true);
	nlapiDisableField('custrecord_sim_activity_calltime', true);
	nlapiDisableField('custrecord_sim_activity_topup', true);
	
	return true;
       
}

/**
* Calculates when minutes are added
*/
function SIMCalculationTopUp()
{
	var balance = 0;
	var topupValue = 0;
	var newBalance = 0;
	
	balance = nlapiGetFieldValue('custrecord_sim_activity_balance');
	topupValue = nlapiGetFieldValue('custrecord_sim_activity_topup');
	
	newBalance = parseInt(balance) + parseInt(topupValue);
	
	nlapiSetFieldValue('custrecord_sim_activity_balance', newBalance);
	
	nlapiDisableField('custrecord_sim_activity_phonenumber', true);
	nlapiDisableField('custrecord_sim_activity_calltime', true);
	nlapiDisableField('custrecord_sim_activity_topup', true);
	
	return true;
}
