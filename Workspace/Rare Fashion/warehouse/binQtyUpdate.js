


/**
 * adjust inventory by bin
 */
function adjustInventoryBin()
{

	var invAdj = null;
	var subRecord = null;

	//	inventory adjustment

	invAdj = nlapiCreateRecord('inventoryadjustment', {recordmode : 'dynamic'});

	invAdj.setFieldValue('account', 125);
	invAdj.selectNewLineItem('inventory');
	invAdj.setCurrentLineItemValue('inventory', 'item', 2624);
	invAdj.setCurrentLineItemValue('inventory', 'location', 32);
	invAdj.setCurrentLineItemValue('inventory', 'adjustqtyby', -5);

	//	inventory detail sub of adjustment record

	subRecord = invAdj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');

	subRecord.selectNewLineItem('inventoryassignment');
	subRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', -5);
	subRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', 902);
	subRecord.commitLineItem('inventoryassignment');

	subRecord.commit();
	invAdj.commitLineItem('inventory');
	nlapiSubmitRecord(invAdj);


}