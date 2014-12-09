/**************************************************************************************
 * Name:		Innov : Rotation UE (Innov.UE.LHK.Rotation.js)
 * 
 * Script Type:	User Event
 * 
 * Client:		Appellations
 *
 * Version:		1.0.0 - 08 Aug 2012 - first release - Innov
 * 				1.0.1 - 28 Aug 2012 - Inventory Transfer and Inventory Adjustment is hidden 
 * 									  when All Rotation quantity is already sold for that record
 * 				1.0.2 - 10 Jun 2013 - update to FHL coding standards - MJL
 *
 * Author:		FHL
 * 
 * Purpose:		Add Button for Inventory Transfer and Adjustment on Rotation custom record & attach PO to rotation
 * 
 * Script: 		customscript_innov_rotation_ue
 * Deploy: 		customdeploy_rotation_deploy
 * 
 * Notes:		Now separated from SuiteBundles folder
 * 
 * Library: 	innov.lhk.library.js 
 **************************************************************************************/

var log = new Log('DEBUG');

var beforeLoad = function(type, form, request)
{

	if(type == 'view' || type == 'edit')
	{

		var rotationId = nlapiGetRecordId();

		try
		{
			
			//**************************************
			// update the rotation record
			//**************************************
			updateRotationRecord(rotationId);
			
			// add buttons
			
			form.setScript('customscript_innov_rotation_cl');

			var available = nlapiGetFieldValue('custrecord_loycurrentavailable');

			if(available > 0)
			{
				form.addButton('custpage_rotation_invtransfer', 'Rotation Inventory Transfer', 'inventoryTransfer()');
				form.addButton('custpage_rotation_invadjustment', 'Rotation Inventory Adjustment', 'inventoryAdjustment()');
			}

			form.addButton('custpage_rotation_update', 'Rotation Update', 'updateRotationRecord()');
			var poID = nlapiGetFieldValue('custrecord_rotation_ponumber');
			var poLink = nlapiGetFieldValue('custrecord_lhk_po_link');

			log.write('PO Tran ID: ' + poID + ' | PO Link: ' + poLink);
			
			
			// check if the purchase order link has been established - if not establish it

			if(!isBlank(poID) && isBlank(poLink))
			{
				//search purchase orders
				var result = [];
				var filters =
					[
					 new nlobjSearchFilter('tranid', null, 'is', poID),
					 new nlobjSearchFilter('mainline', null, 'is', 'T', null)

					 ];

				var s = nlapiSearchRecord('purchaseorder',null, filters, null);

				try
				{
					if(!isBlank(s))
					{
						var id = s[0].getId();
						log.write('PO Transaction ID: ' + id);
						nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_lhk_po_link', id);
					}
				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}
		catch(ex)
		{
			log.error(ex);
		}
	}
}
