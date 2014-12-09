/************************************************************************************************************
 * Name:			Set Support Item (setSupportItem.js)
 * Script Type:		User Event
 * Client:			Mortara Dolby
 *
 * Version:	1.0.0 - 30 Apr 2012 - first release - TD
 * 			1.1.0 - 09 Aug 2012 - tries every item type - MJL
 *
 * Author:	FHL
 * Purpose:	Executes saved search and places results into the demo stock
 ************************************************************************************************************/

var recType = nlapiGetRecordType();
var salesOrderID = nlapiGetRecordId();

var recSalesOrder = null;
var soCustomForm = 0;
var numLines = 0;

var supportItem = null;
var contractItem = ''; 

var soID = 0; 

/**
 * Get support item for each item on a sales order and add to each line
 * 
 * 1.1.0 tries every item type - MJL
 */
function associateSupportItem()
{
	var retVal = false;
	
	nlapiLogExecution('AUDIT', 'RUNNING SUPPORT CONTRACT LOOKUP', 'NOW');
	
	recSalesOrder = nlapiLoadRecord(recType, salesOrderID);
	numLines = recSalesOrder.getLineItemCount('item');
	soCustomForm = recSalesOrder.getFieldValue('customform');
	
	if (numLines > 0)
	{
		for (var i = 1; i <= numLines; i++)
		{
			recSalesOrder.selectLineItem('item', i);
			supportItem = recSalesOrder.getCurrentLineItemValue('item', 'item');
			
			try
			{
				contractItem = nlapiLookupField('descriptionitem', supportItem, 'custitem_contractitem');
			}
			catch (errDescItem)
			{
				try
				{
					contractItem = nlapiLookupField('discountitem', supportItem, 'custitem_contractitem');
				}
				catch (errDiscItem)
				{
					try
					{
						contractItem = nlapiLookupField('inventoryitem', supportItem, 'custitem_contractitem');
					}
					catch (errInvItem)
					{
						try
						{
							contractItem = nlapiLookupField('itemgroup', supportItem, 'custitem_contractitem');
						}
						catch (errItemGroup)
						{
							try
							{
								contractItem = nlapiLookupField('kititem', supportItem, 'custitem_contractitem');
							}
							catch (errKitItem)
							{
								try
								{
									contractItem = nlapiLookupField('noninventoryitem', supportItem, 'custitem_contractitem');
								}
								catch (errNonInvItem)
								{
									try
									{
										contractItem = nlapiLookupField('otherchargeitem', supportItem, 'custitem_contractitem');
									}
									catch (errOtherCharge)
									{
										try
										{
											contractItem = nlapiLookupField('serviceitem', supportItem, 'custitem_contractitem');
										}
										catch (errServItem)
										{
											try
											{
												contractItem = nlapiLookupField('subtotalitem', supportItem, 'custitem_contractitem');
											}
											catch (subTotalItem)
											{
												nlapiLogExecution('ERROR', 'Cannot lookup field value on item', subTotalItem.message);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		if (contractItem =='T')
		{
			recSalesOrder.selectLineItem('item', (i - 1));
			recSalesOrder.setCurrentLineItemValue('item', 'custcol_citem_servicecontract', supportItem);
			recSalesOrder.commitLineItem('item');
		}
		
		try
		{
			soID = nlapiSubmitRecord(recSalesOrder, true);
			retVal = true;
		}
		catch(e)
		{
			nlapiLogExecution('ERROR', 'Failed to submit record', e.message);
		}
	}	
	return retVal;
}