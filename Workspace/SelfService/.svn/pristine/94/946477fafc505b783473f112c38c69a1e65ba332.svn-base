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

var fontStyle1 = ' class=\"standard\" ';
var fontStyle2 = ' class=\"emphasised\" ';
var fontStyle3 = ' class=\"rightalign\" ';
var fontStyle4 = ' class=\"sizematrix\" ';
var fontStyle5 = ' class=\"detailed\" ';

function getHeadNode()
{
	var htmlHead = '<head>'; //head start element
	htmlHead += CSS_DEFINITION;
	htmlHead += '</head>'; //head end element
	return htmlHead;
}

function createReportHeader(recordID, report_type)
{

	// Report Types ...
	// Proforma Invoice (the Sales Order} - ORD
	// Invoice - INV
	// Credit Note - CRN
	// Picking Note - PIN

var reportTitle = '';
switch (report_type) {
	case 'ORD':
	reportTitle = 'Proforma Invoice (Sales Order)';
	break;
	case 'INV':
	reportTitle = 'Invoice';
	break;
	case 'CRN':
	reportTitle = 'Credit Note';
	break;
	case 'PIN':
	reportTitle = 'Picking Note';
	break;
}

	var soHRecord = nlapiLoadRecord('salesorder',recordID);
	var soHRef = soHRecord.getFieldValue('tranid');

	var invAddr = soHRecord.getFieldValue('billaddress');
	var invCountry = soHRecord.getFieldValue('billcountry');
	if (invCountry == 'GB') invCountry = '';
	var invPhone = soHRecord.getFieldValue('billphone');
	if (invPhone == null) invPhone = '';

	var shipAddr = soHRecord.getFieldValue('shipaddress');
	var shipCountry = soHRecord.getFieldValue('shipcountry');
	if (shipCountry == 'GB') shipCountry = '';
	var shipPhone = soHRecord.getFieldValue('shipphone');
	if (shipPhone == null) shipPhone = '';

 	var cusRecord = soHRecord.getFieldValue('entity');
	var cusName = soHRecord.getFieldText('entity');
	var poNumber = soHRecord.getFieldValue('otherrefnum');
	var soDate = soHRecord.getFieldValue('trandate');
	var soDeliverDate = soHRecord.getFieldValue('shipdate');
	var soLateDate = soHRecord.getFieldValue('custbody_latedate');
	if (soLateDate == null) soLateDate = '';

	var header = '<tr><td colspan=\"2\"><h1' + fontStyle1 + '>' + reportTitle + '</h1></td><td colspan=\"2\">&nbsp;</td><td colspan=\"3\" align=\"right\"><h1' + fontStyle1 + '>Self Service Ltd.</h1></td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">25 Harcourt Street</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">London W1H 4HN</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">Phone No. : 0208 9680407</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td><td colspan=\"2\"' + fontStyle3 + ' align=\"right\">VAT No. : 839387574</td></tr>'
	header += '<tr><td colspan=\"5\">&nbsp;</td></tr>'

	header += '<tr><td colspan=\"7\"><table><tr><td colspan=\"2\">&nbsp;</td><td ' + fontStyle1 + '><b>Sales Order</b><br />Document No.: ' + soHRef + '</td></tr><tr><td ' + fontStyle1 + '><div style=\"width:120px;\"><b>Invoice Address</b><br />' + invAddr + '<br />' + invCountry + '<br />' + invPhone + '</div></td><td ' + fontStyle1 + '><div style=\"width:120px;\"><b>Delivery Address</b><br />' + shipAddr + '<br />' + shipCountry + '<br />' + shipPhone + '</div></td><td ' + fontStyle1 + '><div style=\"width:200px;\"><b>Customer Account : ' + cusName + '</b><br />PO Number : ' + poNumber + '<br />Order Date : ' + soDate + '<br />Delivery Date : ' + soDeliverDate + '<br />Late Date : ' + soLateDate + '</div></td></tr></table></td></tr>'
	return header;
}

function getColourField(thematrixid)
{
	var theColour = 'custitem1'; // Default
	// Determine the IDs and types of the Colour based on the sizematrix custom field ID in the parent ...
    if (parseInt(thematrixid) == 4) theColour = 'custitem1';
    if (parseInt(thematrixid) == 5) theColour = 'custitem4';
	return theColour;    
}

function getSizeField(thematrixid)
{
	var theSize = 'custitem2'; // Default
	// Determine the IDs and types of the Size based on the sizematrix custom field ID in the parent ...
    if (parseInt(thematrixid) == 4) theSize = 'custitem2';
    if (parseInt(thematrixid) == 5) theSize = 'custitem5';
	return theSize;    
}

function matrixForm(request,response)
{
	// load SO record
	// var soRecordId = request.getParameter('custparam_soid');
	// use test until live ...
	var soRecordId = 1;
	
	//var reportType = request.getParameter('custparam_reptype');
	// Proforma Invoice (the Sales Order} - ORD
	// Invoice - INV
	// Credit Note - CRN
	// Picking Note - PIN
	var reportType = 'ORD'; // Test value(s) ...

	var isFactored = request.getParameter('custparam_factored');
	
	var soRecord = nlapiLoadRecord('salesorder',soRecordId);
	var soRef = soRecord.getFieldValue('tranid');
	var lineCount = soRecord.getLineItemCount('item');
	var soCurrency = soRecord.getFieldValue('currencyname');

	var lineArray = new Array();	
	for (x = 0; x < lineCount; x++) lineArray[x] = 0;		
	
	var matrixArray = new Array(lineCount);	
	for (m=0; m<lineCount; m++) matrixArray[m] = new Array(4);		
	
	var html = '';

	html += '<table cellpadding=\"2\" width=\"100\%\">';	
	html += createReportHeader(soRecordId, reportType);
	html += '<tr><td' + fontStyle4 + '>Stock Ref.</td><td' + fontStyle2 + '>Description</td><td ' + fontStyle2 + '>Dept.</td><td' + fontStyle2 + '>Brand</td><td' + fontStyle2 + '>Quantity</td><td' + fontStyle2 + '>Unit Price</td><td' + fontStyle2 + ' align=\"right\">Total</td></tr>';

	var grandtotal = 0;

	// Pointers to process the items ...
	var thisColour = null;
	var nextColour = null; // Used to detect >1 colour for a parent & keep going until null ...
		
    // Build matrix of parents, colours, qty and sizes for lookup ...
    for (var i = 1; i <= lineCount; i++) {
             
            var currentItem = soRecord.getLineItemValue('item', 'item', i);
            
            var parent = nlapiLookupField('inventoryitem', currentItem, 'parent');           
			matrixArray[i-1] [0] = parent;
			
            var sizematrix = nlapiLookupField('inventoryitem', currentItem, 'custitem_sizematrixname');
			
            var sizeField = getSizeField(sizematrix);
           	var sizematrix = nlapiLookupField('inventoryitem', currentItem, sizeField);
			matrixArray[i-1] [2] = sizematrix;

            var colourField = getColourField(sizematrix);
          	var colour = nlapiLookupField('inventoryitem', currentItem, colourField);
			matrixArray[i-1] [1] = colour;		
			
			var quantityonorder = soRecord.getLineItemValue('item', 'quantity', i);
			matrixArray[i-1] [3] = parseInt(quantityonorder);	
   }

   for (var j = 1; j <= lineCount; j++) {
        if (lineArray[j - 1] == 0) { // Only process lines that are available ...
            var currentItem = soRecord.getLineItemValue('item', 'item', j);
            
            var parent = nlapiLookupField('inventoryitem', currentItem, 'parent');
            var parentName = nlapiLookupField('inventoryitem', currentItem, 'parent', true);
            
            var description = nlapiLookupField('inventoryitem', currentItem, 'salesdescription');
            var department = nlapiLookupField('inventoryitem', currentItem, 'department', true);
            var catalogue = nlapiLookupField('inventoryitem', currentItem, 'custitem3');
            var brand = nlapiLookupField('inventoryitem', currentItem, 'manufacturer');
            var price = nlapiLookupField('inventoryitem', currentItem, 'price');
            
            // Work out the particular colour / size matrix to use for this parent item ...
            var sizematrix = nlapiLookupField('inventoryitem', currentItem, 'custitem_sizematrixname');
            var cusRecord = nlapiLoadRecord('customrecord_sizesmatrix', sizematrix);
            var sizematrixRef = cusRecord.getFieldValue('custrecord_sizematrixname');
            var sizematrixarray = cusRecord.getFieldValue('custrecord_sizematrixcommalist').split(",");
            var numSizes = 0;
            var sizeHtml = '<table ' + fontStyle5 + ' cellpadding=\"2\" width=\"100\%\"><tr><td>Colours/Sizes</td>';
            while (numSizes < sizematrixarray.length) {
                sizeHtml += '<td align=\"right\">' + sizematrixarray[numSizes] + '</td>';
                numSizes++;
            }
            sizeHtml += '</tr></table>';
            
            if (j>1) html += '<tr><td colspan=\"7\">&nbsp;</td></tr>'; // Spacer ...
            html += '<tr><td' + fontStyle4 + '>' + parentName + ' (' + sizematrixRef + ')</td><td' + fontStyle1 + '>' + description + '</td><td' + fontStyle1 + '>' + department + '</td><td ' + fontStyle1 + ' colspan=\"4\">' + brand + '</td></tr>';
            html += '<tr><td' + fontStyle4 + '>' + sizeHtml + '</td><td colspan=\"6\">&nbsp;</td></tr>';

            // Determine the IDs and types of the Colour / Size Matrix based on the sizematrix custom field ID in the parent ...
            // Colours & sizes set for parent type ...
            var lookupColourField = getColourField(sizematrix);
            var lookupSizeField = getSizeField(sizematrix);
            
            var colour = nlapiLookupField('inventoryitem', currentItem, lookupColourField);
            var colourName = nlapiEscapeXML(nlapiLookupField('inventoryitem', currentItem, lookupColourField, true));
            
            nextColour = colour; // i.e. the first colour for this parent ...
            while (nextColour != null) {
			
				thisColour = nextColour;
				var lookupItem = soRecord.getLineItemValue('item', 'item', j);
            	var lookupColourName = nlapiEscapeXML(nlapiLookupField('inventoryitem', lookupItem, lookupColourField, true));
				nextColour = null; // Assume no more colours will be found for this parent ...

				var sizeArray = new Array();
				for (sa = 0; sa < numSizes; sa++) sizeArray[sa] = 0;
				
				for (var ma = 1; ma <= lineCount; ma++) {
					var lookupParent = matrixArray[ma-1] [0];
					var lookupSize = matrixArray[ma-1] [2];
					var lookupColour = matrixArray[ma-1] [1];
					var lookupQty = matrixArray[ma-1] [3];

					html += '<tr><td colspan=\"7\">Parent=' + lookupParent + ': Colour=' + lookupColour + ': Size=' + lookupSize + ': Qty=' + lookupQty + '</td></tr>';
														
				} //for
				
				var total = 0;
				for (var y = 0; y < numSizes; y++) total += sizeArray[y];
				
				html += '<tr><td><table ' + fontStyle5 + ' cellpadding=\"2\" width=\"100\%\"><tr><td>' + lookupColourName + '</td>';
				for (sz = 0; sz < numSizes; sz++) html += '<td align=\"right\">' + sizeArray[sz] + '</td>';
				html += '</tr></table></td><td colspan=\"3\">&nbsp;</td><td ' + fontStyle5 + '>' + total + '</td><td ' + fontStyle5 + '>' + price + '</td><td ' + fontStyle5 + ' align=\"right\"><b>' + (price * total).toFixed(2) + '</b></td></tr>';
				
				grandtotal += parseFloat(price * total);
				
			}            
		}
	}

	html += '<tr><td colspan=\"5\">&nbsp;</td><td align=\"right\">ORDER GRAND TOTAL - ' + soCurrency + '</td><td ' + fontStyle5 + ' align=\"right\"><b>&pound;&nbsp;' + (grandtotal).toFixed(2) + '</b></td></tr>';	
	html += '</table>';

	var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n' + getHeadNode() +'\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</pdf>';
	var file = nlapiXMLToPDF( xml );
	response.setContentType('PDF','salesorder.pdf');
	response.write( file.getValue() ); 

} //function
