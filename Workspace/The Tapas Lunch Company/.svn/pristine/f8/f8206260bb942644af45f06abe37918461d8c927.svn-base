function setItemTransform(type){
	var currentRecord;
	
	if ((type == 'create') || ((type == 'edit') && (nlapiGetContext().getExecutionContext() != "scheduled"))) { // Execute this only when Sales order is created or edited. 
		try {
		currentRecord = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId()); //For AfterSubmit
		
		var lines = currentRecord.getLineItemCount('item'); // Get the number of line items on the order before submit 
		var new_lines = lines;
		for (i = 1; i <= lines; i++) { //For each line item
		
			var itid = currentRecord.getLineItemValue('item', 'item', i); //Gets the internal id of the item on the line
			
//  For example: Taste of Spain Pack
	if (itid == '2050') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2053;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 1646;
				swap_items[3] = 1997;
				swap_items[4] = 86;
				swap_items[5] = 1478;
				swap_items[6] = 2019;
				swap_items[7] = 143;
				swap_items[8] = 157;
				swap_items[9] = 270;
				swap_items[10] = 187;
				swap_items[11] = 197;
				swap_items[12] = 1990;
				swap_items[13] = 1586;
				swap_items[14] = 1530;
				swap_items[15] = 242;
				swap_items[16] = 247;
				swap_items[17] = 253;
				swap_items[18] = 254;
				swap_items[19] = 1598;
				swap_items[20] = 299;
				swap_items[21] = 125;
				var discount = -2.15;
				var no_of_items = swap_items.length;

			}
			
			//  For example: Tapas Party Pack
	if (itid == '2055') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2054;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 1486;
				swap_items[3] = 1647;
				swap_items[4] = 916;
				swap_items[5] = 1506;
				swap_items[6] = 1507;
				swap_items[7] = 1508;
				swap_items[8] = 143;
				swap_items[9] = 210;
				swap_items[10] = 216;
				swap_items[11] = 218;
				swap_items[12] = 242;
				swap_items[13] = 1775;
				swap_items[14] = 250;
				swap_items[15] = 254;
				swap_items[16] = 1581;
				var discount = -1.65;				
				var no_of_items = swap_items.length;


			}


//  For example: Complete Paella Pack
	if (itid == '2058') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2064;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 60;
				swap_items[3] = 61;
				swap_items[4] = 1657;
				swap_items[5] = 1654;
				swap_items[6] = 1655;
				swap_items[7] = 74;
				swap_items[8] = 79;
				swap_items[9] = 1478;
				swap_items[10] = 970;
				swap_items[11] = 197;
				swap_items[12] = 1566;
				swap_items[13] = 229;
				swap_items[14] = 230;
				var discount = -1.65;
				var no_of_items = swap_items.length;


			}


//  For example: Meat Lovers Pack
	if (itid == '2062') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2069;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 1616;
				swap_items[3] = 215;
				swap_items[4] = 1566;
				swap_items[5] = 1586;
				swap_items[6] = 254;
				swap_items[7] = 1598;
				var discount = -1.55;			
				var no_of_items = swap_items.length;


			}



//  For example: HEalty Organic Pack
	if (itid == '2061') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2068;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 1569;
				swap_items[3] = 1888;
				swap_items[4] = 1890;
				swap_items[5] = 138;
				swap_items[6] = 169;
				swap_items[7] = 1565;
				swap_items[8] = 1776;
				swap_items[9] = 2048;
				swap_items[10] = 1585;
				swap_items[11] = 1609;
				swap_items[12] = 1610;
					var discount = -1.80;
				var no_of_items = swap_items.length;

			}





//  For example: Cooking Pack
	if (itid == '2060') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2067;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 1995;
				swap_items[3] = 60;
				swap_items[4] = 61;
				swap_items[5] = 1485;
				swap_items[6] = 69;
				swap_items[7] = 1658;
				swap_items[8] = 1659;
				swap_items[9] = 78;
				swap_items[10] = 79;
				swap_items[11] = 80;
				swap_items[12] = 1478;
				swap_items[13] = 970;
				swap_items[14] = 1881;
				swap_items[15] = 1884;
				swap_items[16] = 1885;
				swap_items[17] = 1672;
				swap_items[18] = 1566;
				swap_items[19] = 1669;
				swap_items[20] = 229;
				swap_items[21] = 1136;
				swap_items[22] = 2011;
				var discount = -1.43;
				var no_of_items = swap_items.length;


			}



//  For example: Spanish Sweet Christmas Pack
	if (itid == '2063') {  //This is where you put the item id of the non-inventory flase product
				var pack_desc_id = 2065;  //This is the id of the description line which substitutes
				var run_swap = 1;
				swap_items = new Array();
				swap_items[0] = 1556; //If you want to include the gift card it must be the first item
				swap_items[1] = 2056;
				swap_items[2] = 126;
				swap_items[3] = 125;
				swap_items[4] = 1603;
				swap_items[5] = 123;
				swap_items[6] = 2026;
				swap_items[7] = 120;
				swap_items[8] = 119;
				swap_items[9] = 115;
				swap_items[10] = 127;
				swap_items[11] = 1605;
				var discount = -1.90;	
				var no_of_items = swap_items.length;


			}


//  For example: Ham Pack
	if (itid == '2059') { //This is where you put the item id of the non-inventory flase product
		var pack_desc_id = 2066; //This is the id of the description line which substitutes
		var run_swap = 1;
		swap_items = new Array();
		swap_items[0] = 1556; //If you want to include the gift card it must be the first item
		swap_items[1] = 2056;
		swap_items[2] = 264;
		swap_items[3] = 912;
		swap_items[4] = 2003;
		swap_items[5] = 919;
		swap_items[6] = 1581;
		swap_items[7] = 1620;
		swap_items[8] = 1621;
			var discount = -2.89;
		var no_of_items = swap_items.length;
	}

						
			
			if (run_swap == 1) {
				var qty = currentRecord.getLineItemValue('item', 'quantity', i); //Gets the quantity
				var price_level = currentRecord.getLineItemValue('item', 'price', i); //Gets the price level
				var gift_message = currentRecord.getLineItemValue('item', 'options', i); //Gets the gift message
														
				//Replace the actual line with a generic description line
				currentRecord.setLineItemValue('item', 'item', i, pack_desc_id);
								
				//Start of pack description line
				currentRecord.setLineItemValue('item', 'item', new_lines+1, 2051);
					
				//Now add the items in the pack
				
				//If the first item is the gift card then transmit the message
				if (swap_items[0] == 1556){currentRecord.setLineItemValue('item', 'options', new_lines+2, gift_message);}
				
				for (l = 1; l <= no_of_items; l++) {
					currentRecord.setLineItemValue('item', 'item', new_lines + 1 + l, swap_items[l - 1]);
					currentRecord.setLineItemValue('item', 'quantity', new_lines + 1 + l, qty);
					currentRecord.setLineItemValue('item', 'price', new_lines + 1 + l, price_level);
				}
				
				//Adds the discount line for the gift box and card
				currentRecord.setLineItemValue('item', 'item', new_lines+2+no_of_items, 2057);
				currentRecord.setLineItemValue('item', 'price', new_lines+2+no_of_items, -1);
				currentRecord.setLineItemValue('item', 'rate', new_lines+2+no_of_items, discount*qty);
												
				//End of pack description line
				currentRecord.setLineItemValue('item', 'item', new_lines+3+no_of_items, 2052);
				
				//Update total number of lines
				new_lines = new_lines+2+no_of_items;
				
				//Change run swap flag back
				run_swap = 0;			
						
			}			
		}

										
	var sub = nlapiSubmitRecord(currentRecord, true);
		} //end TRY
		catch (err){ //If there is a failure to transform - hold the order
			currentRecord = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			currentRecord.setFieldValue('custbodyisholddespatch', 'T');
			currentRecord.setFieldValue('custbodyapprovalcheck',currentRecord.getFieldValue('custbodyapprovalcheck') +  "Transfrom Failure");
			var sub = nlapiSubmitRecord(currentRecord, true);
			errorHandler("setItemTransform", err);
		}
	
	}
}