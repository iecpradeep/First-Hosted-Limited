function setLineField(type){
	try
	{
		var currentRecord;
		var lines;
		var i;
		var lotChooserNumber;
		var lotChooserDate;
		
		// fhl edit
		var typeIsLot;
		
		if ((type == 'create') || ((type == 'edit') && (nlapiGetContext().getExecutionContext() != "scheduled"))) { // Execute this only when Sales order is created or edited. 
			
			//currentRecord = nlapiGetNewRecord();
			//var recid = nlapiGetRecordId();
			currentRecord = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId()); //For AfterSubmit
			
			nlapiLogExecution("DEBUG", "Record Type", nlapiGetRecordType());
			nlapiLogExecution("DEBUG", "Record Id", nlapiGetRecordId());
			
			//Class chooser
			
			try {
			var tclass = currentRecord.getFieldValue('class');
			
			nlapiLogExecution("DEBUG", "tclass: ", tclass);
			
			
				if ((tclass != 1) && (tclass != 2) && (tclass != 3) && (tclass != 4) && (tclass != 5)){		
					var entity = currentRecord.getFieldValue('entity');
					var customer_category = nlapiLookupField('customer', entity, 'category');
					var price_level = nlapiLookupField('customer', entity, 'pricelevel');
					
					nlapiLogExecution("DEBUG", "entity: ", entity);
					nlapiLogExecution("DEBUG", "customer_category: ", customer_category);
					nlapiLogExecution("DEBUG", "price_level: ", price_level);					
					
					if (customer_category == 1) {
						if (price_level == 7)//5% discount
						{currentRecord.setFieldValue('class', 2);}
						else if (price_level == 6)//10% discount
						{currentRecord.setFieldValue('class', 6);}
						else if (price_level == 2)//15% discount
						{currentRecord.setFieldValue('class', 3);}
						else //no discount
						{currentRecord.setFieldValue('class', 1);}
					}
					else {currentRecord.setFieldValue('class', 4);}
				}
			}
			catch(err){nlapiLogExecution("ERROR", "setLineField", err.message);}
				
		
			
			lines = currentRecord.getLineItemCount('item'); // Get the number of line items on the order before submit 
			nlapiLogExecution("DEBUG", "lines: ", lines);
			
			for (i = 1; i <= lines; i++) { //For each line item
				//First check that there is no lot number already input
				var IsAlreadyLotNumber = currentRecord.getLineItemValue('item', 'serialnumbers', i);
				nlapiLogExecution("DEBUG", "IsAlreadyLotNumber: ", IsAlreadyLotNumber);
				
				if (IsAlreadyLotNumber == null) {
				
				// fhl code edit
				typeIsLot = currentRecord.getLineItemValue('item', 'custcol_itemtype', i);
				nlapiLogExecution('DEBUG','the item type is: ', typeIsLot);
						
					
				try {
				
					var itid = currentRecord.getLineItemValue('item', 'item', i); //Gets the internal id of the item on the line
					
					nlapiLogExecution("DEBUG", "itid: ", itid);
					
					var itemRecord = nlapiLoadRecord('lotnumberedinventoryitem', itid); //Loads the item record

					nlapiLogExecution("DEBUG", "itemRecord: ", itemRecord);
					
					var numbersCount = itemRecord.getLineItemCount('numbers'); //Counts the number of lots available
					
					nlapiLogExecution("DEBUG", "numbersCount: ", numbersCount);
					
					//Creates ordering array
					var lotOrderArray = new Array(numbersCount);
					nlapiLogExecution("DEBUG", "lotOrderArray: ", lotOrderArray);
					
					
					//Cycles through the lots to put them in order in an array
					for (var j = 1; j <= numbersCount; j++) {
						
						//nlapiSendEmail(-5, 'jon@thetapaslunchcompany.co.uk', 'Lot Script', 'Script Output.\n'+qtyOnHand+'\n\n', null, null, null, null);
						
						if (j == 1) {
							lotOrderArray[0] = j;
						} //Puts the first lot in first position
						
						if (j > 1) {
							//First put the incoming lot at the bottom of the list
							lotOrderArray[j-1] = j;
							
							//Now compare dates with the one above until it rises to correct position (oldest first)
							for (var k = j-1; k > 0; k--) {
							
							//Some processing to compare dates
							
							//Separates the stored date into components
							var lotChooserDate = itemRecord.getLineItemValue('numbers', 'expirationdate', lotOrderArray[k-1]);
							nlapiLogExecution("DEBUG", "lotChooserDate: ", lotChooserDate);
								
							var lotChooserDateArray = new Array();
							lotChooserDateArray = lotChooserDate.split('/');
							nlapiLogExecution("DEBUG", "lotChooserDateArray: ", lotChooserDateArray);
							
							var lcYear = lotChooserDateArray[2];
							var lcMonth = lotChooserDateArray[1];
							var lcDay = lotChooserDateArray[0];
							nlapiLogExecution("DEBUG", "lcYear: ", lcYear);
							nlapiLogExecution("DEBUG", "lcMonth: ", lcMonth);
							nlapiLogExecution("DEBUG", "lcDay: ", lcDay);
							
							//Separates the date for comparison into components
							var lotExpiry = itemRecord.getLineItemValue('numbers', 'expirationdate', lotOrderArray[k]);
							nlapiLogExecution("DEBUG", "lotExpiry: ", lotExpiry);
							
							var lotExpiryArray = new Array();
							lotExpiryArray = lotExpiry.split('/');
							nlapiLogExecution("DEBUG", "lotExpiryArray: ", lotExpiryArray);
							
							var leYear = lotExpiryArray[2];
							var leMonth = lotExpiryArray[1];
							var leDay = lotExpiryArray[0];
							nlapiLogExecution("DEBUG", "leYear: ", leYear);
							nlapiLogExecution("DEBUG", "leMonth: ", leMonth);
							nlapiLogExecution("DEBUG", "leDay: ", leDay);
							
							
							//Runs the comparison
							var isEarlier = 0;
							if (leYear < lcYear) {
								isEarlier = 1;
							} //If the new lot's year is before the existing then choose it
							if (leYear == lcYear) { //If they have the some year then compare months
								if (leMonth < lcMonth) {
									isEarlier = 1;
								} //If the incoming month is before then choose it
								if (leMonth == lcMonth) { //If they have the same month (and year) compare days
									if (leDay < lcDay) {
										isEarlier = 1;
									} //If the incoming day is earlier then choose it, else stick with the previous lot
								}//Finish the month comparison
							}//Finish the  year comparison
							if (isEarlier == 1) {
								var swapper = lotOrderArray[k-1];
								lotOrderArray[k-1] = lotOrderArray[k];
								lotOrderArray[k] = swapper;
							} //Finish Swap if necessary
						}//Finish swapping positions when lot gets to correct position according to date
					} //Finish procedure for all but the first lot
					} //Finish ordering lots in array	
					
						//Now go through the ordered lots and work out availability
						
						var qtty_needed = currentRecord.getLineItemValue('item', 'quantity', i); //Quantity required of that product
						var com = itemRecord.getFieldValue('quantitycommitted'); //Quantity of the item committed across all orders
						var qtty_com_this = currentRecord.getLineItemValue('item', 'quantitycommitted', i); //Quantity committed this order (for editing)
						nlapiLogExecution("DEBUG", "qtty_needed: ", qtty_needed);
						nlapiLogExecution("DEBUG", "com: ", com);
						nlapiLogExecution("DEBUG", "qtty_com_this: ", qtty_com_this);
						
						com = com - qtty_com_this;//Because it includes the current order in committed if editing.
						nlapiLogExecution("DEBUG", "com: ", com);
						//nlapiSendEmail(-5, 'jon@thetapaslunchcompany.co.uk', 'Script', 'Script.\n'+com+'\n\n', null, null, null, null);					
						
						var lotChooserNumber = "";
						
						for (l = 1; l <= numbersCount; l++) {
							nlapiLogExecution("DEBUG", "l", l);
							
							var qtyOnHand = parseFloat(itemRecord.getLineItemValue('numbers', 'quantityonhand', lotOrderArray[l-1]));
							nlapiLogExecution("DEBUG", "qtyOnHand", qtyOnHand);
					
							//Work out how many of the lot are available
							var available = qtyOnHand - com;
							nlapiLogExecution("DEBUG", "available", available);
							
													
								if (available > 0) {
									if (available >= qtty_needed) {
										var grab = qtty_needed;
										nlapiLogExecution("DEBUG", "grab", grab);
										
										var lotNumber = itemRecord.getLineItemValue('numbers', 'serialnumber', lotOrderArray[l-1]);
										nlapiLogExecution("DEBUG", "lotNumber", lotNumber);
										
										lotChooserNumber = lotChooserNumber + lotNumber + "(" + grab + ")";
										nlapiLogExecution("DEBUG", "lotChooserNumber", lotChooserNumber);
										
										l=numbersCount;
										nlapiLogExecution("DEBUG", "l", l);
									}
									else {
										var grab = available;
										nlapiLogExecution("DEBUG", "grab", grab);
										
										var lotNumber = itemRecord.getLineItemValue('numbers', 'serialnumber', lotOrderArray[l-1]);
										nlapiLogExecution("DEBUG", "lotNumber", lotNumber);
										
										lotChooserNumber = lotChooserNumber + lotNumber + "(" + grab + "),";
										nlapiLogExecution("DEBUG", "lotChooserNumber", lotChooserNumber);
										
										qtty_needed = qtty_needed - grab;
										nlapiLogExecution("DEBUG", "qtty_needed", qtty_needed);
									}
								}
								com = com - qtyOnHand;
								nlapiLogExecution("DEBUG", "com", com);
								
								if (com < 0) {com = 0;}

						}	
							
							
						//Finally record the lot numbers chosen.	
						currentRecord.setLineItemValue('item', 'serialnumbers', i, lotChooserNumber);
						
						
				} //End of error catching loop
				catch(err){errorHandler("setLineField", err);}
					
				} //Only when there is no lot number already
			} //For each line item
			var sub = nlapiSubmitRecord(currentRecord, true);
		} // 1st If - Controls when the script is executed
	}
	catch(e)
	{
		errorHandler("setLineField", e);
	}
}//End the function