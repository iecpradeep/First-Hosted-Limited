/*******************************************************
 * Name:		EPW Pricing Update Script on Inventory Item
 * Script Type:	User Event
 * Version:		1.2.0
 * Date:		24 June 2011 - 25th July 2011
 * Author:		Peter Lewis, FHL
 *******************************************************/

/*
 * Function called after record submit
 */


function saveInvItem(type)
{
	nlapiLogExecution('DEBUG', 'Status', '*** Start WCA Script Edit Debug ***');

	var RoundingMultiple = 0.05;

	try 
	{
		var invRecord = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
	} 
	catch (e) 
	{
		nlapiLogExecution('DEBUG','Unsupported type', e);
		return true;	//No point in continuing
	}

	var invRecordId = invRecord.getId();
	
	nlapiLogExecution('DEBUG', 'Inventory Item Id', invRecordId);

		
	//invRecord.setFieldValue('custbody_journalid', 222);
	
	//invRecord.setFieldValue('custbody_lastsavedstatusvalue', soCurrentStatus);		//set the last saved status to the current status
	
	var SalesPrice = invRecord.getFieldValue('custitem_salesprice');
	var TWWLPrice =  mRound(RoundingMultiple,SalesPrice * 1.1);
	invRecord.setFieldValue('custitem_twwlpriceincvat', TWWLPrice);
	var TradePrice = invRecord.getFieldValue('custitem_tradeprice');
	var OnlinePrice = invRecord.getFieldValue('custitem_onlinepriceexvat');
	var InBondPrice =invRecord.getFieldValue('custitem_inbond');	//Ready for InBond custom field now...
	
	
	nlapiLogExecution('DEBUG', 'SalesPrice', SalesPrice);
	nlapiLogExecution('DEBUG', 'TWWLPrice', TWWLPrice);
	nlapiLogExecution('DEBUG', 'TradePrice', TradePrice);
	nlapiLogExecution('DEBUG', 'OnlinePrice', OnlinePrice);
	nlapiLogExecution('DEBUG', 'InBondPrice', InBondPrice);
	
	//Cut them to 4 d.p.
	SalesPrice = toFixed(SalesPrice, 4);
	TWWLPrice = toFixed(TWWLPrice, 4);
	TradePrice = toFixed(TradePrice, 4);
	OnlinePrice = toFixed(OnlinePrice, 4);
	InBondPrice = toFixed(InBondPrice, 4);
		
	//Sales Price
	invRecord.selectLineItem('price1','1');
	invRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, SalesPrice); 
	invRecord.commitLineItem('price1');
	nlapiLogExecution('DEBUG', 'SalesPrice', SalesPrice);
	
	//InBond Price
	invRecord.selectLineItem('price1','2');
	invRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, InBondPrice); 
	invRecord.commitLineItem('price1');
	nlapiLogExecution('DEBUG', 'InBondPrice Price', InBondPrice);
	
	//TWWL
	invRecord.selectLineItem('price1','3');
	invRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, TWWLPrice); 
	invRecord.commitLineItem('price1');
	nlapiLogExecution('DEBUG', 'TWWLPrice', TWWLPrice);
	
	//Trade Price
	invRecord.selectLineItem('price1','4');
	invRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, TradePrice); 
	invRecord.commitLineItem('price1');
	nlapiLogExecution('DEBUG', 'TradePrice', TradePrice);
			
	//Online Price
	invRecord.selectLineItem('price1','5');
	invRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, OnlinePrice); 
	invRecord.commitLineItem('price1');
	nlapiLogExecution('DEBUG', 'Online Price', OnlinePrice);


	nlapiSubmitRecord(invRecord,true,true);	//submit the record for saving.
	
	nlapiLogExecution('DEBUG', 'Record Submitted. ID=', invRecordId);
	return true;
} //function


function toFixed(value, precision) {
    var precision = precision || 0,
        neg = value < 0,
        power = Math.pow(10, precision),
        value = Math.round(value * power),
        integral = String((neg ? Math.ceil : Math.floor)(value / power)),
        fraction = String((neg ? -value : value) % power),
        padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
}



function mRound(multiple, value)
{
	var n = value;
	
    if(n > 0)        
		return Math.ceil(n/multiple) * multiple;    
	else if( n < 0)        
		return Math.floor(n/multiple) * multiple;    
	else        
		return multiple;
}

