function SAFieldChanged(type, name, linenum)
{
	//DEBUG ******
	alert('SAFieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum);
	
	
	
/*
	if((name =='custcol_contractvalue') || (name == 'quantity'))
	{
		
		//nlapiSetCurrentLineItemValue('item','amount',9469,false,false);
		//nlapiSetFieldValue('amount',10000,false,false);
		SACalculateGP(type, name, linenum);
	}
	
	if ((name == 'item') && (type == 'item'))
	{
		var TheItem = nlapiGetCurrentLineItemValue('item','item');
		
		nlapiSetFieldValue('custbody_itemid',TheItem, false, false);
		
		//alert('ITEM ITEM FIELD CHANGED!!!!\n\n\n\nThe Item record is here: ' + TheItem);
		
	}
*/
} 


function OnSave_UpdatePrices()
{
	
var a = new Array();
a['User-Agent-x'] = 'SuiteScript-Call';
nlapiRequestURL( 'https://webservices.netsuite.com/wsdl/v1_2_0/netsuite.wsdl', null, a, handleResponse);
function handleResponse( response )
{
	var headers = response.getAllHeaders();
	var output = 'Code: '+response.getCode()+'\n';
	output += 'Headers:\n';
	for ( var i in headers )
		output += i + ': '+headers[i]+'\n';
		output += '\n\nBody:\n\n';
		//output += response.getBody();
		alert( output );
}
	return true;
	
	
	
	
	
	
	
	
	
	
	
	
	// load an item record
	//var record = nlapiLoadRecord('inventoryitem', 536);
	var theRecord = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
	
	//alert(nlapiGetRecordId());
	
	//theRecord.setLineItemValue('price1', 'price', '1', 999);
	//theRecord.setLineItemValue('price1', 'price', '3', 2999);
		
		
	//Set the pricing matrix header field (Qty) in the second column to 600

	//nlapiSetMatrixValue('price1', 'price', '2', 600);    


	//Set values on line one. First you must select the line, then set all values,
	//then commit the line.

	var SalesPrice = theRecord.getFieldValue('custitem_salesprice');
	var TWWLPrice = theRecord.getFieldValue('custitem_twwlprice');
	var TradePrice = theRecord.getFieldValue('custitem_tradeprice');
	var OnlinePrice = theRecord.getFieldValue('custitem_onlineprice');
	
	
	//Sales Price
	nlapiSelectLineItem('price1', '1'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1'); 
		
	//TWWL
	nlapiSelectLineItem('price1', '2'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1');
	
	//Trade Price
	nlapiSelectLineItem('price1', '3'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1'); 
		
	//Online Price
	nlapiSelectLineItem('price1', '4'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1'); 	
	//nlapiSubmitRecord(theRecord,false,false);
	
	return true;

	
}
