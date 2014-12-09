var CSS_DEFINITION = '<style type="text/css">';
CSS_DEFINITION += 'h1 { font-family: Helvetica;} ';
CSS_DEFINITION += 'h3 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'h4 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'h5 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'table { font-family: Helvetica; text-align: left; font-size: 11px;} ';
CSS_DEFINITION += 'table.headerinfo { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold} ';
CSS_DEFINITION += 'p { font-family: Helvetica; text-align: left; font-size: 10px;} ';
CSS_DEFINITION += 'p.header { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold;} ';
CSS_DEFINITION += 'p.detail { font-family: Helvetica; text-align: left; font-size: 9px;} ';
CSS_DEFINITION += '.print { font-family: Helvetica; text-align: left; font-size: x-small;} ';
CSS_DEFINITION += '.standard { font-family: Helvetica;} ';
CSS_DEFINITION += '.emphasised { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.rightalign { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.sizematrix { font-family: Helvetica; font-weight:bold;width:200px;} ';
CSS_DEFINITION += '.detailed { font-family: Helvetica; font-size:10px;} ';
CSS_DEFINITION += '</style>';

function getHeadNode()
{
	var htmlHead = '<head>'; //head start element
	htmlHead += CSS_DEFINITION;
	htmlHead += '</head>'; //head end element
	return htmlHead;
}

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
	
	var fontStyle1 = ' class=\"standard\" ';
	var fontStyle2 = ' class=\"emphasised\" ';
	var fontStyle3 = ' class=\"rightalign\" ';
	var fontStyle4 = ' class=\"sizematrix\" ';
	var fontStyle5 = ' class=\"detailed\" ';
	
	var lineArray = new Array();
	
	for (x = 0; x < lineCount; x++) lineArray[x] = 0;		
	
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
			var currentItem = soRecord.getLineItemValue('item', 'item', i);
			
			var parent = nlapiLookupField('inventoryitem', currentItem, 'parent');
			var parentName = nlapiLookupField('inventoryitem', currentItem, 'parent', true);
            var lookupColourField = 'custitem1';
            var lookupSizeField = 'custitem2';
			
                //Work out the particular colour / size matrix to use for this item ...
                var sizematrix = nlapiLookupField('inventoryitem', currentItem, 'custitem_sizematrixname');
                var cusRecord = nlapiLoadRecord('customrecord_sizesmatrix', sizematrix);
                var sizematrixRef = cusRecord.getFieldValue('custrecord_sizematrixname');
                var sizematrixarray = cusRecord.getFieldValue('custrecord_sizematrixcommalist').split(",");
                var numSizes = 0;
                var sizeHtml = '<table ' + fontStyle5 + ' cellpadding=\"2\" width=\"100\%\"><tr><td>Colours/Sizes</td>';
                while (numSizes < sizematrixarray.length) {
                    sizeHtml += '<td align=\"right\">' + sizematrixarray[numSizes] + '</td>';
                    numSizes += 1;
                }
                sizeHtml += '</tr></table>'
                var sizeArray = new Array();
                for (i = 0; i < numSizes; i++) sizeArray[i] = 0;
                
                // Determine the IDs and types of the Colour / Size Matrix based on the sizematrix custom field ID in the parent ...
                // Colours ...
                if (parseInt(sizematrix) == 4) lookupColourField = 'custitem1';
                if (parseInt(sizematrix) == 5) lookupColourField = 'custitem4';
                // Sizes ...
                if (parseInt(sizematrix) == 4) lookupSizeField = 'custitem2';
                if (parseInt(sizematrix) == 5) lookupSizeField = 'custitem5';
                
                var colour = nlapiLookupField('inventoryitem', currentItem, lookupColourField);
                var colourName = nlapiEscapeXML(nlapiLookupField('inventoryitem', currentItem, lookupColourField, true));
                
            if (parent != previousParent) {
				
				// Throw a line gap ...
                if (previousParent != null) html += '<tr><td colspan=\"7\">&nbsp;</td></tr>';
                
                var description = nlapiLookupField('inventoryitem', currentItem, 'salesdescription');
                var department = nlapiLookupField('inventoryitem', currentItem, 'department', true);
                var catalogue = nlapiLookupField('inventoryitem', currentItem, 'custitem3');
                var price = nlapiLookupField('inventoryitem', currentItem, 'price');
                
                html += '<tr><td' + fontStyle4 + '>' + parentName + ' (' + sizematrixRef + ')</td><td' + fontStyle1 + '>' + description + '</td><td' + fontStyle1 + '>' + department + '</td><td ' + fontStyle1 + ' colspan=\"4\">' + catalogue + '</td></tr>';
                html += '<tr><td' + fontStyle4 + '>' + sizeHtml + '</td><td colspan=\"6\">&nbsp;</td></tr>';
            } //if
			
			for (j=1; j<=lineCount; j++) 
			{
				var lookupItem = soRecord.getLineItemValue('item', 'item', j);
				var lookupParent = nlapiLookupField('inventoryitem', lookupItem, 'parent');			
				var lookupColour = nlapiLookupField('inventoryitem', lookupItem, lookupColourField);
				
				if (lookupParent == parent && lookupColour == colour) 
				{
					var size = nlapiLookupField('inventoryitem', lookupItem, lookupSizeField);
					var quantityonorder = soRecord.getLineItemValue('item', 'quantity', j);
					sizeArray[size - 1] = parseInt(quantityonorder);
					lineArray[j-1] = 1; //Mark that item line as 'done' ...
				} //if	
			} //for

		var total = 0;	
		for (var y=0; y<numSizes; y++) total += sizeArray[y];
		
		html += '<tr><td><table ' + fontStyle5 + ' cellpadding=\"2\" width=\"100\%\"><tr><td>' + colourName + '</td>';
		for (sz=0; sz<numSizes; sz++) html += '<td align=\"right\">' + sizeArray[sz] + '[' + parent + ']</td>';
		html += '</tr></table></td><td colspan=\"3\">&nbsp;</td><td ' + fontStyle5 + '>' + total + '</td><td ' + fontStyle5 + '>' + price + '</td><td ' + fontStyle5 + ' align=\"right\"><b>' + (price*total).toFixed(2) + '</b></td></tr>';
		
		grandtotal += parseFloat(price*total);	
		
		previousParent = parent;

		} //if (lineArray[i-1] == 0) 
		
	} //for (var i = 1; i <= lineCount; i++) 

	html += '<tr><td colspan=\"' + numSizes + '\">&nbsp;</td><td align=\"right\">ORDER GRAND TOTAL</td><td ' + fontStyle5 + ' align=\"right\"><b>&pound;&nbsp;' + (grandtotal).toFixed(2) + '</b></td></tr>';	
	html += '</table>';

	//var xml = nlapiStringToXML(html);
	//response.write(html);
	
	//html = nlapiEscapeXML(html);

	var testhtml = '<table cellpadding=\"2\" width=\"80\%\"><tr><td>Colours/Sizes</td><td>XS</td><td>S</td><td>M</td><td>L</td><td>XL</td></tr></table>';
	
	var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n' + getHeadNode() +'\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</pdf>';
	var file = nlapiXMLToPDF( xml );
	response.setContentType('PDF','salesorder.pdf');
	response.write( file.getValue() ); 

} //function
