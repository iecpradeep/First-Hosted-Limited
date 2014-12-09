/*******************************************************
 * Name:			Dolby Medical Auto Lot Numbering Script
 * Script Type:		Client Script
 * Version:			1.1.0
 * Date:			August - October 2011
 * Author:			Darren Birt, First Hosted Limited.
 * Modified by:		Pete Lewis, First Hosted Limited
 * 
 * @returns {Boolean}
 *  
 *******************************************************/



function autoLotNumber()
{
	//get line item count
	var linecount = parseInt(nlapiGetLineItemCount('item'));
	
	//get current lot number
	var nextLotNumber = parseInt(nlapiLookupField('customrecord_autolotnumbering',1,'custrecord_nextlotnumber'));

	var numberString = '';
	var IsLotItem = '';
	//var costingmethod = '';
	
	
	for (var i=1; i<=linecount; i++)
	{
		
		var autonumber = nlapiGetLineItemValue('item','custcol_autolotnumber',i);
		
		if (autonumber == 'T')
		{
		
			var item = nlapiGetLineItemValue('item','item',i);
			
			IsLotItem = nlapiLookupField('item', item, 'islotitem');
			//costingmethod = nlapiLookupField('item',item,'costingmethod');
			
			if (IsLotItem == 'T')
			{
				if (nextLotNumber < 10)
				{
					numberString = '00000' + nextLotNumber;
				
				} //if
				if (nextLotNumber >=10 && nextLotNumber < 100)
				{
					numberString = '0000' + nextLotNumber;
				
				} //if
				if (nextLotNumber >=100 && nextLotNumber < 1000)
				{
					numberString = '000' + nextLotNumber;
				
				} //if
				if (nextLotNumber >=1000 && nextLotNumber < 10000)
				{
					numberString = '00' + nextLotNumber;
				
				} //if
				if (nextLotNumber >=10000 && nextLotNumber < 100000)
				{
					numberString = '0' + nextLotNumber;
				
				} //if
				
						
				nlapiSelectLineItem('item',i);
				nlapiSetCurrentLineItemValue('item','serialnumbers',numberString);
				nlapiCommitLineItem('item');			
				
				
				
				nextLotNumber++;				
				
				
			} //if
			else
			{
				//alert('The Costing Method of this Item is not supported by the Auto Lot Number script.\nRequired: LOT\nCurrent costing method: ' + costingmethod);
				alert('The selected Item is not supported by the Auto Lot Number script.\nRequired: IsLotItem = T\nCurrent IsLotItem: ' + IsLotItem);
				nlapiSelectLineItem('item',i);
				nlapiSetCurrentLineItemValue('item','custcol_autolotnumber','F');
				nlapiCommitLineItem('item');			

			} //else			

		
		} //if
		
	} //for

	nlapiSubmitField('customrecord_autolotnumbering',1,'custrecord_nextlotnumber',nextLotNumber);

	
	return true;
	
} //function

function alertSerialNumbers()
{
alert(nlapiGetCurrentLineItemValue('serialnumbers'));
return true;
}