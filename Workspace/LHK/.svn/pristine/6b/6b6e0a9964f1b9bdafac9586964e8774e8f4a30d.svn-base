/*******************************************************
 * Name:        	createRotation.js
 * Script Type: 	User Event
 *               
 * Version:      1.0.0 - Initial Release - ?
 *                                      
 * Author:		?  
 *                               
 * Purpose:      Creates a rotation                               
 *******************************************************/

function createRotation(type)
{
	if(type == 'create' || type == 'edit') //EMB 07.13.2012 - create Rotation record only on 'Creation and Edit of PO'
	{

		//************************************************************
		// initialise
		//	create rotation records post save
		//************************************************************
		var SalesOrderNumber = nlapiGetRecordId();
		var soRecord = nlapiLoadRecord('purchaseorder', SalesOrderNumber);
		var truncSupplier = soRecord.getFieldText('entity');
		var potype = soRecord.getFieldValue('custbody_po_order_type');
		var poduedate = soRecord.getFieldValue('custbody_lhkreceiveby');
		var pocurrency = soRecord.getFieldValue('currency');
		var pofxrate = parseFloat(soRecord.getFieldValue('exchangerate'));
		//var truncSupplier = supplier.substr(0,4);
		var poNumber = soRecord.getFieldValue('tranid');
		var podate = soRecord.getFieldValue('trandate');
		var numLines = soRecord.getLineItemCount('item');

		//************************************************************
		// for each PO line
		//************************************************************

		for (var c=1; c <= numLines; c++)
		{

			var line = soRecord.selectLineItem('item', c);
			soRecord.setCurrentLineItemValue('item','custcol_line_ref', c);
			var custcol_tran_rotation = soRecord.getCurrentLineItemValue('item', 'custcol_tran_rotation');

			//************************************************************
			// check if the line has had a rotation created already
			//************************************************************
			
			if(isBlank(custcol_tran_rotation))
			{

				var rotationNumber = (truncSupplier+'-'+poNumber+'-'+c);
				var custrecord_lotitem = soRecord.getCurrentLineItemValue('item', 'item');
				var custrecord_loyqtyordered = soRecord.getCurrentLineItemValue('item', 'quantity');
				var custrecord_item_uom = soRecord.getCurrentLineItemValue('item', 'custcol_fhl_uom');
				var linerate = parseFloat(soRecord.getCurrentLineItemValue('item','rate'));
				var lineqty = soRecord.getCurrentLineItemValue('item','quantity');
				var units = soRecord.getCurrentLineItemValue('item','unitconversionrate');
				var unitsselect = soRecord.getCurrentLineItemValue('item','units');
				var custrecord_loycurrentavailable = parseFloat(custrecord_loyqtyordered)* parseFloat(units);
				var gbpcost = parseFloat(linerate * pofxrate);
				var location = soRecord.getFieldValue('location');

				//************************************************************
				// create rotation
				//************************************************************

				var newRotationRecord = nlapiCreateRecord('customrecord_rotation');
				newRotationRecord.setFieldValue('customform',10);
				newRotationRecord.setFieldValue('name',rotationNumber);
				newRotationRecord.setFieldValue('custrecord_lotitem',custrecord_lotitem);
				newRotationRecord.setFieldValue('custrecord_loyqtyordered',custrecord_loycurrentavailable);
				newRotationRecord.setFieldValue('custrecord_loycurrentavailable',custrecord_loycurrentavailable);
				newRotationRecord.setFieldValue('custrecord_lotqtysold',0);
				newRotationRecord.setFieldValue('custrecord_item_uom',custrecord_item_uom);
				newRotationRecord.setFieldValue('custrecord_rotation_ordertype',potype);
				newRotationRecord.setFieldValue('custrecord_rotation_expecteddelivery',poduedate);
				newRotationRecord.setFieldValue('custrecord_rotation_currency',pocurrency);
				newRotationRecord.setFieldValue('custrecord_rotation_fxrate',pofxrate);
				newRotationRecord.setFieldValue('custrecord_rotation_unitscost',linerate);
				newRotationRecord.setFieldValue('custrecord_rotation_polineunits',unitsselect);
				newRotationRecord.setFieldValue('custrecord_rotation_item_units_purchased',lineqty);
				newRotationRecord.setFieldValue('custrecord_rotation_item_units_available',lineqty);
				newRotationRecord.setFieldValue('custrecord_rotation_gbp_unitcost',gbpcost);
				newRotationRecord.setFieldValue('custrecord_rotation_item_units_sold',0);
				newRotationRecord.setFieldValue('custrecord_rotation_purchase_date',podate);
				newRotationRecord.setFieldValue('custrecord_rotation_location',location);
				newRotationRecord.setFieldValue('custrecord_rotation_ponumber',poNumber); //EMB 07.12.2012 - Set PO Number
				newRotationRecord.setFieldValue('custrecord_lhk_po_link',SalesOrderNumber); //EMB 08.13.2012 - Set PO Kink

				try
				{
					var rotationID = nlapiSubmitRecord(newRotationRecord);
				}
				catch (rotationLineError)
				{
					nlapiLogExecution('ERROR','Error in Submission of Rotation', rotationLineError);
				}
				if (isNotBlank(rotationID))
				{
					soRecord.setCurrentLineItemValue('item','custcol_tran_rotation',rotationID);
				}
			}
			soRecord.commitLineItem('item');

		}
		try
		{
			var soID = nlapiSubmitRecord(soRecord);
			nlapiLogExecution('DEBUG', 'Submitted the PO ', soID);
		}
		catch (soError)
		{
			nlapiLogExecution('ERROR','Error in Submission of SO', soError);
		}
		return true;
	}
}


/**
 * 
 * [TODO] - Should be in a Library
 * 
 */
function isBlank(fld) 
{
	return (fld==null || fld=='');
}

function isNotBlank(fld) 
{
	return (fld!=null && fld!='');
}



