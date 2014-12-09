function matrixForm(request,response)
{
	// load SO record
	var soRecord = nlapiLoadRecord('salesorder',1);
	var soRef = soRecord.getFieldValue('tranid');	
	var lineCount = soRecord.getLineItemCount('item');

	var invAddr = soRecord.getFieldValue('billaddress');
	var invCountry = soRecord.getFieldValue('billcountry');
	if (invCountry == 'GB') invCountry = '';
	var invPhone = soRecord.getFieldValue('billphone');
	if (invPhone == null) invPhone = '';

	var shipAddr = soRecord.getFieldValue('shipaddress');
	var shipCountry = soRecord.getFieldValue('shipcountry');
	if (shipCountry == 'GB') shipCountry = '';
	var shipPhone = soRecord.getFieldValue('shipphone');
	if (shipPhone == null) shipPhone = '';

 	var cusRecord = soRecord.getFieldValue('entity');
	var poNumber = soRecord.getFieldValue('otherrefnum');
	var soDate = soRecord.getFieldValue('trandate');
	var soDeliverDate = soRecord.getFieldValue('shipdate');
	var soLateDate = soRecord.getFieldValue('enddate');
	if (soLateDate == null) soLateDate = '';

 	//var html = '<html><body style=\"font-family:Helvetica;font-size:9px\">';
	var html = '';

	//var css ='<style>.h1 {font-family:Helvetica;}</style>\n';
	//html += css;
	//css styles not working yet so use styles variables ...!
	
	var fontStyle1 = ' style=\"font-family:Helvetica;\" ';
	var fontStyle2 = ' style=\"font-family:Helvetica;font-weight:bold;\" ';
	var fontStyle3 = ' style=\"font-family:Helvetica;text-align:right;\" ';
	var fontStyle4 = ' style=\"font-family:Helvetica;font-weight:bold;width:200px;\" ';
	var fontStyle5 = ' style=\"font-family:Helvetica;font-size:10px;\" ';
	
	var lineArray = new Array();
	
	for (x = 0; x < lineCount; x++)
	{
		lineArray[x] = 0;		
	} //for
	
	var previousParent = null;
	var header = '<tr><td colspan=\"4\">&nbsp;</td><td colspan=\"3\" align=\"right\"><h1' + fontStyle1 + '>Self Service Ltd.</h1></td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">25 Harcourt Street</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">London W1H 4HN</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">Phone No. : 0208 9680407</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">VAT No. : 839387574</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td></tr>'

	header += '<tr><td colspan=\"7\"><table><tr><td colspan=\"2\">&nbsp;</td><td ' + fontStyle1 + '><b>Sales Order</b><br />Document No.: ' + soRef + '</td></tr><tr><td ' + fontStyle1 + '><div style=\"width:120px;\"><b>Invoice Address</b><br />' + invAddr + '<br />' + invCountry + '<br />' + invPhone + '</div></td><td ' + fontStyle1 + '><div style=\"width:120px;\"><b>Delivery Address</b><br />' + shipAddr + '<br />' + shipCountry + '<br />' + shipPhone + '</div></td><td ' + fontStyle1 + '><div style=\"width:200px;\"><b>Customer Account : ' + cusRecord + '</b><br />PO Number : ' + poNumber + '<br />Order Date : ' + soDate + '<br />Delivery Date : ' + soDeliverDate + '<br />Late Date : ' + soLateDate + '</div></td></tr></table></td></tr>'
	
	html += '<table cellpadding=\"2\" width=\"100\%\">';	
	html += header;
	html += '<tr><td' + fontStyle4 + '>Stock Ref.</td><td' + fontStyle2 + '>Description</td><td ' + fontStyle2 + '>Dept.</td><td' + fontStyle2 + '>Catalogue</td><td' + fontStyle2 + '>Quantity</td><td' + fontStyle2 + '>Unit Price</td><td' + fontStyle2 + ' align=\"right\">Total</td></tr>';

	var grandtotal = 0;

	for (var i = 1; i <= lineCount; i++) 
	{
		
		if (lineArray[i-1] == 0) 
		{
			var sizeArray = new Array(0, 0, 0, 0, 0);
			
			var currentItem = soRecord.getLineItemValue('item', 'item', i);
			
			var parent = nlapiLookupField('inventoryitem', currentItem, 'parent');
			var parentName = nlapiLookupField('inventoryitem', currentItem, 'parent', true);
			var colour = nlapiLookupField('inventoryitem',currentItem,'custitem1');
			var colourName = nlapiEscapeXML(nlapiLookupField('inventoryitem',currentItem,'custitem1',true));
			
			

			
			if (parent != previousParent) 
			{
				if (previousParent != null)
				{
					//html += '</table></td></tr>';
					html += '<tr><td colspan=\"7\">&nbsp;</td></tr>';
				}
				
				var description = nlapiLookupField('inventoryitem',currentItem,'salesdescription');
				var department = nlapiLookupField('inventoryitem',currentItem,'department',true);
				var catalogue = nlapiLookupField('inventoryitem',currentItem,'custitem3');
				var price = nlapiLookupField('inventoryitem',currentItem,'price');
				
				html += '<tr><td' + fontStyle4 + '>' + parentName + '</td><td' + fontStyle1 + '>' + description + '</td><td' + fontStyle1 + '>' + department + '</td><td ' + fontStyle1 + ' colspan=\"4\">' + catalogue + '</td></tr>';

				html += '<tr><td' + fontStyle4 + '><table ' + fontStyle5 + ' cellpadding=\"2\" width=\"100\%\"><tr><td>Colours/Sizes</td><td>XS</td><td>S</td><td>M</td><td>L</td><td>XL</td></tr></table></td><td colspan=\"6\">&nbsp;</td></tr>';
			} //if
			
			for (j = 1; j <= lineCount; j++) 
			{
				var lookupItem = soRecord.getLineItemValue('item', 'item', j);
				var lookupParent = nlapiLookupField('inventoryitem', lookupItem, 'parent');
				var lookupColour = nlapiLookupField('inventoryitem', lookupItem, 'custitem1');
				
				if (lookupParent == parent && lookupColour == colour) 
				{
					var size = nlapiLookupField('inventoryitem', lookupItem, 'custitem2');
					sizeArray[size - 1] = 1;
					lineArray[j-1] = 1;
					
				} //if	
			} //for

		var total = 0;
		
		for (var y=0; y<5; y++)
		{
			total += sizeArray[y];
		}
		
		html += '<tr><td><table ' + fontStyle5 + ' cellpadding=\"2\" width=\"100\%\"><tr><td>' + colourName + '</td><td>' + sizeArray[0] + '</td><td>' + sizeArray[1] + '</td><td>' + sizeArray [2] + '</td><td>' + sizeArray[3] + '</td><td>' + sizeArray[4] + '</td></tr></table></td><td colspan=\"3\">&nbsp;</td><td ' + fontStyle5 + '>' + total + '</td><td ' + fontStyle5 + '>' + price + '</td><td ' + fontStyle5 + ' align=\"right\"><b>' + (price*total).toFixed(2) + '</b></td></tr>';

		grandtotal += parseFloat(price*total);	
		
		previousParent = parent;

		} //if
		
	} //for

	html += '<tr><td colspan=\"5\">&nbsp;</td><td align=\"right\">ORDER TOTAL</td><td ' + fontStyle5 + ' align=\"right\"><b>&pound;&nbsp;' + (grandtotal).toFixed(2) + '</b></td></tr>';	
	html += '</table>';
	

	//var xml = nlapiStringToXML(html);
	//response.write(html);
	
	//html = nlapiEscapeXML(html);

	var testhtml = '<table cellpadding=\"2\" width=\"80\%\"><tr><td>Colours/Sizes</td><td>XS</td><td>S</td><td>M</td><td>L</td><td>XL</td></tr></table>';
	
	var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</pdf>';
	var file = nlapiXMLToPDF( xml );
	response.setContentType('PDF','salesorder.pdf');
	response.write( file.getValue() ); 

} //function
