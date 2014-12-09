/*******************************************************
 * Name:		Aepona PO Event script
 * Script Type:	User Event
 * Version:		1.0.0
 * Date:		03 June 2011
 * Author:		FHL
 *******************************************************/

function calculateUSD(type)
{
	if (type == 'create' || type == 'edit') 
	{
		//Obtain a handle to the newly created PO
		var poRecord = nlapiGetNewRecord();
		var poRecordId = poRecord.getId();
				
		var currency = poRecord.getFieldValue('currency');
		var total = parseFloat(poRecord.getFieldValue('total'));
		var fxrate = 1.00;
		
		// target currency of 1 = USD.  No date specified so use current date.
		fxrate = parseFloat(nlapiExchangeRate(currency,1));
		
		
		var totalusd = total * fxrate;
		
	
		nlapiSubmitField('purchaseorder',poRecordId,'custbody_prusdfxrate',fxrate.toFixed(3),false);
		nlapiSubmitField('purchaseorder',poRecordId,'custbody_prtotalusd',totalusd.toFixed(2),false);
		
				
	} //if
	
	return true;
	
} //function

function beforeLoad(type,form,request)
{
	
	//nlapiSetRedirectURL('SUITELET','customscript65','customdeploy1');
	//return true;


		//Get the button before relabeling or disabling
		var copyButton = form.getButton('autofill');
		var altcopyButton = form.getButton('secondaryautofill');

		
		//Disable the button in the UI
		if (copyButton) copyButton.setDisabled(true);
		if (altcopyButton) altcopyButton.setDisabled(true);
	
		var context = nlapiGetContext();
		var poRecord = nlapiGetNewRecord();
		var status = poRecord.getFieldValue('status');
		
		if (context.getDepartment() != '21' || status == '1')
		{
			var printButton = form.getButton('print');
			if (printButton) printButton.setDisabled(true);
			
		}

		var nextapproverfield = form.getField('nextapprover');
		if (nextapproverfield) nextapproverfield.setDisplayType('hidden');
	
		return true;
	
} //function