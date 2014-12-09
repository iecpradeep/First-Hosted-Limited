function setDelVat(type){
	var currentRecord;
	
	if ((type == 'create') || ((type == 'edit') && (nlapiGetContext().getExecutionContext() != "scheduled"))) { // Execute this only when Sales order is created or edited. 
		currentRecord = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId()); //For AfterSubmit
		
		var taxtotal = parseFloat(currentRecord.getFieldValue('taxtotal'));
		if (taxtotal > 0){ //Only triggers if there is VAT on the order
			var shippingtaxcode = currentRecord.getFieldValue('shippingtaxcode'); //Gets the tax codes as entered
			var handlingtaxcode = currentRecord.getFieldValue('handlingtaxcode');
			
			
			if ((shippingtaxcode == 9 && handlingtaxcode != 1558 )){ //The rest only triggers if the shipping code is 'Z'
			
				//Collects up the shipping charges as entered, avoiding errors for empty slots.
				var shippingcost = currentRecord.getFieldValue('shippingcost');
				var handlingcost = currentRecord.getFieldValue('handlingcost');
				
				
				if (shippingcost != null) {shippingcost = parseFloat(shippingcost);}
				else {shippingcost = 0;}
				if (handlingcost != null) {handlingcost = parseFloat(handlingcost);}
				else {handlingcost = 0;}
				
				//Now we're going to properly calculate VAT and VAT subtotal.  Can't use the VAT field given by Netsuite in the total as you get rounding errors.				
				var lines = currentRecord.getLineItemCount('item');
				var runningtotal = 0;
				for (var j = 1; j <= lines; j++) 
					{
						var vatcode = currentRecord.getLineItemValue('item', 'taxcode', j);
						if (vatcode == 1558) {runningtotal = runningtotal + parseFloat(currentRecord.getLineItemValue('item', 'amount', j)); }
					}
																	
				//Calculates the proportion of the value of the order represented by standard rated goods
				var subtotal = parseFloat(currentRecord.getFieldValue('subtotal'));
				var S = runningtotal/subtotal;
				var Z = 1 - S;
				
				//Calculates the total charged for shipping
				var T = shippingcost + handlingcost;
				
				//Now we have to recalculate the Ex VAT shipping charge so that the final inc Vat charge
				//is the same as the previous total.  Also, the standard and zero rated components must be in the correc
				//proportions according to the above.  The maths are a little complicated:
				//
				//	1.2(Sx) + Zx = T       or     x = T / (1.2S + Z)
				//
				//where S = proportion relating to Standard rated goods, Z = proportion related to Zero rated goods
				//and T = Total shipping cost charged, x = new Ex VAT shipping charge
				
				//Calculates the new Ex Vat total delivery charge according to the above logic
				var x = T / ((1.2*S)+Z);
				currentRecord.setFieldValue('custbodydelvatloss', T-x); //Records loss
				
				//Rounding errors can happen all throughout this procedure because Netsuite only stores
				//the values to 2 dp, so we now need to make sure the final total is not different
				// from T by 1p.
				
				var hc = Math.round(100*(x*S))/100; //Rounds the calculated Vatable portion to 2dp
				var sc = Math.round(100*(x-Z))/100; //Rounds the calculated non Vatable portion to 2dp
				var newtotal = Math.round(100*((hc*1.2)+sc))/100; // Calculated the new total inc Vat rounded to 2 dp
				var difference = T-newtotal; // Checks if there is a difference between the new rounded total and the oiginal.
				sc = sc + difference; // If so, add to the non vatable portion.
				currentRecord.setFieldValue('custbodydelvatloss', T-(sc+hc)); //Records loss
				
				//Assigns the standard rated portion to 'Hanlding Cost', changing to Standard VAT code and
				//back calculating the charge so that the total including VAT comes out the same as before
				currentRecord.setFieldValue('handlingcost', hc); 
				currentRecord.setFieldValue('handlingtaxcode', 1558);
												
				//Assigns the zero rated portion to 'Shipping Cost', keeping the Zero rated code
				currentRecord.setFieldValue('shippingcost', sc);
											
				var sub = nlapiSubmitRecord(currentRecord, true);
			}
		}	
	
	}
}
}