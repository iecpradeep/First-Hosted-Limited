/**********************************************************************
* Name:         Update SIM Card Balance
* Script Type:  User Event
* Client:		Essential Telecom/Blueberry Mobile
* 
* Version:      1.0.0 - 11th May 2012 - 1st release - AN

* Author:       Anthony Nixon & Matthew Lawrence, First Hosted Limited
* Purpose:      To update the balance on the SIM card record after a 
* 				new SIM activity been posted 
***********************************************************************/

/**
 * Updates SIM Card balance after submit 
 */
function updateSIMbalance()
{
	var simActivityID = nlapiGetRecordId();
	var simActivityType = nlapiGetRecordType();
	var activityBalance = 0;
	var cardInternalID = 0;
	
	activityBalance = nlapiLookupField(simActivityType, simActivityID, 'custrecord_sim_activity_balance');
	cardInternalID = nlapiLookupField(simActivityType, simActivityID, 'custrecord_sim_activity_phonenumber');
	
	nlapiSubmitField('customrecord_sim_card', cardInternalID, 'custrecord_sim_balance', activityBalance);

}