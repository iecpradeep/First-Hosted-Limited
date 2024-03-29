/*********************************************************************************************************************************************************
 * Name:			createRotation.js
 * Script Type:		User Event
 * Client:			WineSuite
 *
 * Version:			1.0.0 � 10/04/2013 � 1st release - AM
 *
 * Author:			FHL
 * Purpose:			Either on create or edit of a Purchase Order
 * 
 * Script: 			customscript_fhl_create_rotation
 * Deploy: 			customdeploy_fhl_crete_rotation
 * 					
 * Library: 		library.js
 * 
 *********************************************************************************************************************************************************/


/**
 * @param type
 * @returns {Boolean}
 */
function createRotation(type)
{
	var SalesOrderNumber = null;
	var soRecord = null;
	var truncSupplier = null;
	var potype = null;
	var poduedate = null;
	var pocurrency = null;
	var pofxrate = null;
	var poNumber = null;
	var podate = null;
	var numLines = null;
	var rotationNumber = null;
	var custrecord_lotitem = null;
	var custrecord_loyqtyordered = null;
	var custrecord_item_uom = null;
	var linerate = null;
	var lineqty = null;
	var units = null;
	var unitsselect = null;
	var custrecord_loycurrentavailable = null;
	var gbpcost = null;
	var location = null;
	var line = null;
	var custcol_tran_rotation = null;
	var newRotationRecord = null;
	var rotationID = null;
	var soID = null;

	if(type == 'create' || type == 'edit') //EMB 07.13.2012 - create Rotation record only on 'Creation and Edit of PO'
	{
		// Get the record Id
		SalesOrderNumber = nlapiGetRecordId();
		nlapiLogExecution('DEBUG', 'SalesOrderNumber ', 'SalesOrderNumber : ' + SalesOrderNumber);
		soRecord = nlapiLoadRecord('purchaseorder', SalesOrderNumber);
		
		truncSupplier = soRecord.getFieldText('entity');
		potype = soRecord.getFieldValue('custbody_po_order_type');
		poduedate = soRecord.getFieldValue('custbody_lhkreceiveby');
		pocurrency = soRecord.getFieldValue('currency');
		pofxrate = parseFloat(soRecord.getFieldValue('exchangerate'));
		//var truncSupplier = supplier.substr(0,4);
		poNumber = soRecord.getFieldValue('tranid');
		podate = soRecord.getFieldValue('trandate');
		nlapiLogExecution('DEBUG', 'Transaction Number ', 'poNumber : ' + poNumber);

		// Count the number of line items
		numLines = soRecord.getLineItemCount('item');
		
		// Loop through the lines
		for (var c=1; c <= numLines; c++)
		{
			nlapiLogExecution('DEBUG', 'Going for the loop', 'c is : ' + c);
			line = soRecord.selectLineItem('item', c);
			soRecord.setCurrentLineItemValue('item','custcol_line_ref', c);

			custcol_tran_rotation = soRecord.getCurrentLineItemValue('item', 'custcol_tran_rotation');

			// If the custom rotation column is blank
			if(isBlank(custcol_tran_rotation))
			{
				nlapiLogExecution('DEBUG', 'Rotation is blank ', 'Line Number  : ' + c);
				
				// Create the Rotation Number
				rotationNumber = (truncSupplier+'-'+poNumber+'-'+c);
				custrecord_lotitem = soRecord.getCurrentLineItemValue('item', 'item');
				custrecord_loyqtyordered = soRecord.getCurrentLineItemValue('item', 'quantity');
				custrecord_item_uom = soRecord.getCurrentLineItemValue('item', 'custcol_fhl_uom');
				linerate = parseFloat(soRecord.getCurrentLineItemValue('item','rate'));
				lineqty = soRecord.getCurrentLineItemValue('item','quantity');
				units = soRecord.getCurrentLineItemValue('item','unitconversionrate');
				unitsselect = soRecord.getCurrentLineItemValue('item','units');
				
				nlapiLogExecution('DEBUG', 'Units Of Measure  : ', custrecord_item_uom);
				
				// Multiply the quantity ordered by the units of measure 
				custrecord_loycurrentavailable = parseFloat(custrecord_loyqtyordered)* parseFloat(units);
				
				// Multiply the Rate by the Purchase Order Exchange Rate
				gbpcost = parseFloat(linerate * pofxrate);
				
				location = soRecord.getFieldValue('location');

				nlapiLogExecution('DEBUG', 'Created Rotation : ', rotationNumber);
				nlapiLogExecution('DEBUG', 'number available is set to ', 'custrecord_loycurrentavailable : ' + custrecord_loycurrentavailable);

				// Create new Rotation record
				newRotationRecord = nlapiCreateRecord('customrecord_rotation');
				newRotationRecord.setFieldValue('customform',10); // [TODO] Magic number 10
				newRotationRecord.setFieldValue('name',rotationNumber);
				newRotationRecord.setFieldValue('custrecord_lotitem',custrecord_lotitem);
				newRotationRecord.setFieldValue('custrecord_loyqtyordered',custrecord_loycurrentavailable);
				newRotationRecord.setFieldValue('custrecord_loycurrentavailable',custrecord_loycurrentavailable);
				newRotationRecord.setFieldValue('custrecord_lotqtysold',0);
				newRotationRecord.setFieldValue('custrecord_item_uom',custrecord_item_uom);
				newRotationRecord.setFieldValue('custrecord_rotation_ordertype',potype);
				newRotationRecord.setFieldValue('custrecord_rotation_expecteddelivery',poduedate);
				
				nlapiLogExecution('DEBUG', 'date is ', 'date : ' + poduedate);
				
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
					nlapiLogExecution('DEBUG', 'Trying to Submit Rotation ', 'Doing it now');
					rotationID = nlapiSubmitRecord(newRotationRecord);
					nlapiLogExecution('DEBUG', 'Created Rotation ', rotationID);
				}
				catch (rotationLineError)
				{
					nlapiLogExecution('ERROR','Error in Submission of Rotation', rotationLineError);
				}
				
				if (isNotBlank(rotationID))
				{
					// If the Rotation Id is not blank then set it to the line item.
					soRecord.setCurrentLineItemValue('item','custcol_tran_rotation',rotationID);
					nlapiLogExecution('DEBUG', 'Updated the line ', 'Doing it now');
				}
			}
			soRecord.commitLineItem('item');
		}
		
		try
		{
			soID = nlapiSubmitRecord(soRecord);
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
 * Added to library.js
 * 
 */

//function isBlank(fld) {return (fld==null||fld=='');}
//function isNotBlank(fld) {return (fld!=null&&fld!='');}

