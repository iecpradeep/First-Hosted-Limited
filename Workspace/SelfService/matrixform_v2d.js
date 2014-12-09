var CSS_DEFINITION = '<style type="text/css">';
CSS_DEFINITION += 'h1 { font-family: Helvetica;} ';
CSS_DEFINITION += 'h3 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'h4 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'h5 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'table { font-family: Helvetica; text-align: left; font-size: 11px; } ';
CSS_DEFINITION += 'table.headerinfo { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold; } ';
CSS_DEFINITION += 'table.matrix { margin: 0 0 20px 0; } ';
CSS_DEFINITION += 'table.matrix td { padding: 2px 2px 2px 0; width: 50px; } ';
//CSS_DEFINITION += 'td { border: 1; } ';
CSS_DEFINITION += 'td.colourname { width: 100px; font-weight: bold; } ';
CSS_DEFINITION += 'td.coloursize { width: 22px; font-weight: bold; font-style: italic; } ';
CSS_DEFINITION += 'p { font-family: Helvetica; text-align: left; font-size: 10px;} ';
CSS_DEFINITION += 'p.header { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold;} ';
CSS_DEFINITION += 'p.detail { font-family: Helvetica; text-align: left; font-size: 9px;} ';
CSS_DEFINITION += '.print { font-family: Helvetica; text-align: left; font-size: x-small;} ';
CSS_DEFINITION += '.standard { font-family: Helvetica;} ';
CSS_DEFINITION += '.emphasised { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.rightalign { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.sizematrix { font-family: Helvetica; width:200px;} ';
CSS_DEFINITION += '.detailed { font-family: Helvetica; font-size:10px;} ';
CSS_DEFINITION += '</style>';

var fontStyle1 = ' class="standard" ';
var fontStyle2 = ' class="emphasised" ';
var fontStyle3 = ' class="rightalign" ';
var fontStyle4 = ' class="sizematrix" ';
var fontStyle5 = ' class="detailed" ';

function getHeadNode()
{
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

function createReportHeader(recordID, report_type)
{
    var soHRecord;
    switch (report_type)
    {
        case 'ORD':
            soHRecord = nlapiLoadRecord('salesorder', recordID);
            break;
        case 'INV':
            soHRecord = nlapiLoadRecord('invoice', recordID);
            break;
        case 'CRN':
            soHRecord = nlapiLoadRecord('creditmemo', recordID);
            break;
        case 'PIN':
            soHRecord = nlapiLoadRecord('salesorder', recordID);
            break;
    }
    
    var soHRef = soHRecord.getFieldValue('tranid');
    var custRecord = nlapiLoadRecord('customrecord_matrixreporttemplate', 1);
    var selfServiceInfo = custRecord.getFieldValue('custrecord_selfserviceuk');
    
    var cusRecord = soHRecord.getFieldValue('entity');
    var cusName = soHRecord.getFieldText('entity');
    var invNo = soHRecord.getFieldText('createdfrom');
    var poNumber = soHRecord.getFieldValue('otherrefnum');
    if (poNumber == null) 
        poNumber = '';
    var soDate = soHRecord.getFieldValue('trandate');
    if (soDate == null) 
        soDate = '';
    var soDeliverDate = soHRecord.getFieldValue('shipdate');
    if (soDeliverDate == null) 
        soDeliverDate = '';
    var soLateDate = soHRecord.getFieldValue('custbody_latedate');
    if (soLateDate == null) 
        soLateDate = '';
    
    // Report Types ...
    // Proforma Invoice (the Sales Order} - ORD
    // Invoice - INV
    // Credit Note - CRN
    // Picking Note - PIN
    
    var invAddr = soHRecord.getFieldValue('billaddress');
    var invCountry = soHRecord.getFieldValue('billcountry');
    if (invCountry == 'GB') 
        invCountry = '';
    var invPhone = soHRecord.getFieldValue('billphone');
    if (invPhone == null) 
        invPhone = '';
    
    var shipTitle = 'Delivery Address';
    var shipAddr = soHRecord.getFieldValue('shipaddress');
    var shipCountry = soHRecord.getFieldValue('shipcountry');
    if (shipCountry == 'GB') 
        shipCountry = '';
    var shipPhone = soHRecord.getFieldValue('shipphone');
    if (shipPhone == null) 
        shipPhone = '';
    
    var reportTitle = '';
    var headerPanel = '<table><tr><td><b>Customer Account :</b></td><td><b>' + cusName + '</b></td></tr>';
    switch (report_type)
    {
        case 'ORD':
            reportTitle = 'Proforma Invoice (Sales Order)';
            headerPanel += '<tr><td>Order No.:</td><td>' + soHRef + '</td></tr><tr><td>PO Number:</td><td>' + poNumber + '</td></tr><tr><td>Order Date:</td><td>' + soDate + '</td></tr><tr><td>Delivery Date:</td><td>' + soDeliverDate + '</td></tr><tr><td>Late Date:</td><td>' + soLateDate + '</td></tr>';
            break;
        case 'INV':
            reportTitle = 'Invoice';
            headerPanel += '<tr><td>Document No.:</td><td>' + soHRef + '</td></tr><tr><td>PO Number:</td><td>' + poNumber + '</td></tr><tr><td>Ship Date:</td><td>' + soDeliverDate + '</td></tr><tr><td>Invoice Date:</td><td>' + soDate + '</td></tr>';
            break;
        case 'CRN':
            reportTitle = 'Credit Note / Memo';
            shipAddr = '';
            shipPhone = '';
            shipTitle = '';
            headerPanel += '<tr><td>Document No.:</td><td>' + soHRef + '</td></tr><tr><td>Invoice No.:</td><td>' + invNo + '</td></tr><tr><td>PO Number:</td><td>' + poNumber + '</td></tr><tr><td>Ship Date:</td><td>' + soDeliverDate + '</td></tr><tr><td>Credit Note Date:</td><td>' + soDate + '</td></tr>';
            break;
        case 'PIN':
            reportTitle = 'Picking Note';
            headerPanel += '<tr><td>Document No.:</td><td>' + soHRef + '</td></tr><tr><td>PO Number:</td><td>' + poNumber + '</td></tr><tr><td>Order Date:</td><td>' + soDate + '</td></tr><tr><td>Delivery Date:</td><td>' + soDeliverDate + '</td></tr><tr><td>Late Date:</td><td>' + soLateDate + '</td></tr>';
            break;
    }
    headerPanel += '</table>';
    
    var header = '<tr><td colspan=\"3\"><h1' + fontStyle1 + '>' + reportTitle + '</h1></td><td></td><td colspan=\"3\" align=\"right\"><h1' + fontStyle1 + '>Self Service Ltd.</h1></td></tr>'
    header += '<tr><td colspan=\"5\"></td><td colspan=\"2\" align=\"right\">' + selfServiceInfo.replace(/\n/g, '<br />') + '</td></tr>'
    header += '<tr><td ' + fontStyle1 + ' colspan=\"7\"><table width=\"100%\"><tr><td><div style=\"width:120px;vertical-align:top;\"><b>Invoice Address</b><br />' + invAddr.replace(/\n/g, '<br />') + '<br />' + invCountry + '<br />' + invPhone + '</div></td><td ' + fontStyle1 + '><div style=\"width:120px;vertical-align:top;\"><b>' + shipTitle + '</b><br />' + shipAddr.replace(/\n/g, '<br />') + '<br />' + shipCountry + '<br />' + shipPhone + '</div></td><td ' + fontStyle1 + ' align=\"right\"><div style=\"width:200px;vertical-align:top;\">' + headerPanel + '</div></td></tr></table></td></tr>';
    header += '<tr><td colspan=\"7\"></td></tr>'
    return header;
}

function createReportFooter(recordID, report_type, totalQty)
{
    var soFRecord;
    switch (report_type)
    {
        case 'ORD':
            soFRecord = nlapiLoadRecord('salesorder', recordID);
            break;
        case 'INV':
            soFRecord = nlapiLoadRecord('invoice', recordID);
            break;
        case 'CRN':
            soFRecord = nlapiLoadRecord('creditmemo', recordID);
            break;
        case 'PIN':
            soFRecord = nlapiLoadRecord('salesorder', recordID);
            break;
    }
    var soFRef = soFRecord.getFieldValue('tranid');
    var soSubtotal = soFRecord.getFieldValue('subtotal');
    var taxTotal = soFRecord.getFieldValue('taxtotal');
    var soTotal = soFRecord.getFieldValue('total');
    var isFactored = soFRecord.getFieldValue('custbody_isfactored');
    if (isFactored == '') 
        isFactored = 'F';
    var currencyid = parseInt(soFRecord.getFieldValue('currency')); // 1= GBP, 2= EUR, 4=USD
    var currencyText = soFRecord.getFieldValue('currencyname');
    var currencySymbol = soFRecord.getFieldValue('currencysymbol');
    var paymentAcct = '';
    var custRecord = nlapiLoadRecord('customrecord_matrixreporttemplate', 1); // Template text for company address and payments ...
    var selfServiceInfo = custRecord.getFieldValue('custrecord_selfserviceuk');
    var templateAcctfield = '';
    
    if (report_type == 'ORD' || report_type == 'INV') 
    {
        paymentAcct = ' Invalid Payment Account Option';
        switch (currencyid)
        {
            case 1:
                if (isFactored == "T") 
                {
                    templateAcctfield = 'custrecord_factored_gbp_acct';
                }
                if (isFactored == "F") 
                {
                    templateAcctfield = 'custrecord_nonfactored_gbp_acct';
                }
                break;
            case 2:
                if (isFactored == "T") 
                {
                    templateAcctfield = 'custrecord_factored_eur_acct';
                }
                if (isFactored == "F") 
                {
                    templateAcctfield = 'custrecord_nonfactored_eur_acct';
                }
                break;
            case 4:
                if (isFactored == "F") 
                {
                    templateAcctfield = 'custrecord_nonfactored_usd_acct';
                }
                break;
        }
    }
    
    if (templateAcctfield != '') 
        paymentAcct = custRecord.getFieldValue(templateAcctfield);
    
    // Report Types ...
    // Proforma Invoice (the Sales Order} - ORD
    // Invoice - INV
    // Credit Note - CRN
    // Picking Note - PIN
    
    var reportTitle = '';
    switch (report_type)
    {
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
    
    var footer = '<tr><td colspan=\"7\" style=\"border-bottom:solid black 2px;\"></td></tr>';
    footer += '<tr><td colspan=\"2\"></td><td align=\"right\" colspan=\"2\"><b>Total Quantity</b></td><td ' + fontStyle5 + ' align=\"right\"><b>' + totalQty + '</b></td><td colspan=\"2\"></td></tr>';
    footer += '<tr><td colspan=\"3\" rowspan=\"3\">' + paymentAcct.replace(/\n/g, '<br />') + '</td><td align=\"right\" colspan=\"3\"><b>NET</b></td><td ' + fontStyle5 + ' align=\"right\">' + soSubtotal + '</td></tr>';
    footer += '<tr><td></td><td align=\"right\" colspan=\"2\"><b>VAT</b></td><td ' + fontStyle5 + ' align=\"right\">' + taxTotal + '</td></tr>';
    footer += '<tr><td align=\"right\" colspan=\"2\"><b>' + currencyText + '</b></td><td align=\"right\"><b>TOTAL</b></td><td ' + fontStyle5 + ' align=\"right\" style=\"border-top:solid black 1px;\"><b>' + soTotal + '</b></td></tr>';
    //footer += '<tr><td colspan=\"2\">' + paymentAcct + '</td><td></td><td colspan=\"4\" align=\"right\"></td></tr>'
    
    return footer;
}

// Replacement function for matrix custom fields - Colour ...
function getColourFieldName(theItemRec)
{
	var theColour = 'custitem_colour_junkmail'; // Default
	//var itemRecord = nlapiLoadRecord('inventoryitem', theItemRec);
   
	// Determine the IDs and types of the Colour based on which field is > 0 ...
	if (theItemRec.getFieldValue('custitem_colour_disney').length > 0) 
		theColour = 'custitem_colour_disney';
	if (theItemRec.getFieldValue('custitem_colour_junkmail').length > 0)
		theColour = 'custitem_colour_junkmail';
	if (theItemRec.getFieldValue('custitem_colour_junkfood').length > 0)
		theColour = 'custitem_colour_junkfood';
	if (theItemRec.getFieldValue('custitem_colour_wildfox').length > 0)
		theColour = 'custitem_colour_wildfox';
	if (theItemRec.getFieldValue('custitem_colour_lamer').length > 0)
		theColour = 'custitem_colour_lamer';
	if (theItemRec.getFieldValue('custitem_colour_lna').length > 0)
		theColour = 'custitem_colour_lna';
	if (theItemRec.getFieldValue('custitem_colour_stylestalker').length > 0)
		theColour = 'custitem_colour_stylestalker';
		
	return theColour;
}

// Replacement function for matrix custom fields - Size ...
function getSizeFieldName(theItemRec)
{
   	var theSize = 'custitem_size_junkmail'; // Default
   	//var itemRecord = nlapiLoadRecord('inventoryitem', theItemRec);
   	
    // Determine the IDs and types of the Size based on which field is > 0 ...
	if (theItemRec.getFieldValue('custitem_size_disney').length > 0) 
		theSize = 'custitem_size_disney';
	if (theItemRec.getFieldValue('custitem_size_junkmail').length > 0)
		theSize = 'custitem_size_junkmail';
	if (theItemRec.getFieldValue('custitem_size_junkfood').length > 0)
		theSize = 'custitem_size_junkfood';
	if (theItemRec.getFieldValue('custitem_size_wildfox').length > 0)
		theSize = 'custitem_size_wildfox';
	if (theItemRec.getFieldValue('custitem_size_lamer').length > 0)
		theSize = 'custitem_size_lamer';
	if (theItemRec.getFieldValue('custitem_size_lna').length > 0)
		theSize = 'custitem_size_lna';
	if (theItemRec.getFieldValue('custitem_size_stylestalker').length > 0)
		theSize = 'custitem_size_stylestalker';
		
    return theSize;
}

function getSizeFieldRef(theItemRef)
{
   	var theRef = 0; // Default
   	
    // Determine the IDs and types of the Size based on which field is > 0 ...
	if (theItemRef == 'custitem_size_disney') 
		theRef = 11;
	if (theItemRef == 'custitem_size_junkmail') 
		theRef = 16;
	if (theItemRef == 'custitem_size_junkfood') 
		theRef = 13;
	if (theItemRef == 'custitem_size_wildfox') 
		theRef = 10;
	if (theItemRef == 'custitem_size_lamer') 
		theRef = 12;
	if (theItemRef == 'custitem_size_lna') 
		theRef = 14;
	if (theItemRef == 'custitem_size_stylestalker') 
		theRef = 15;
    return theRef;
}

function matrixForm(request, response)
{
    var reportType = request.getParameter('custparam_reptype');
    //var reportType = 'ORD'; // Test value(s) ...
    //var reportType = nlapiGetContext().getSetting('SCRIPT', 'custscript_reporttype');
    // Proforma Invoice (the Sales Order} - ORD
    // Invoice - INV
    // Credit Note - CRN
    // Picking Note - PIN
    
    // load SO record
    var soRecordId = request.getParameter('custparam_soid');
    
    var strRecType = 'salesorder';
    switch (reportType)
    {
        case 'ORD':
            strRecType = 'salesorder';
            break;
        case 'INV':
            strRecType = 'invoice';
            break;
        case 'CRN':
            strRecType = 'creditmemo';
            break;
        case 'PIN':
            strRecType = 'salesorder';
            break;
    }
	
    var soRecord = nlapiLoadRecord(strRecType, soRecordId, {recordmode: 'dynamic'});
    
    var soRef = soRecord.getFieldValue('tranid');
    var lineCount = soRecord.getLineItemCount('item');
    var soCurrency = soRecord.getFieldValue('currencyname');
    
    // Set correct columns and fields if picking note ....
    var displayLocation = false;
    if (reportType == 'PIN') 
        displayLocation = true;
    var locationHeader = '';
    if (displayLocation) 
        locationHeader = 'Location';
    var qtyField = 'quantity';
    if (displayLocation)
		qtyField = 'quantitycommitted';
    
    var lineArray = new Array();
    for (x = 0; x < lineCount; x++) 
        lineArray[x] = 0;
    
    var matrixArray = new Array(lineCount);
    for (m = 0; m < lineCount; m++) 
        matrixArray[m] = new Array(5);
    
    var html = '';
    
    html += '<table cellpadding="2" width="100%">';
    html += createReportHeader(soRecordId, reportType);
    html += '<tr><td' + fontStyle4 + '>Stock Ref. (Description)</td><td' + fontStyle2 + '>' + locationHeader + '</td><td ' + fontStyle2 + '>Dept.</td><td' + fontStyle2 + '>Brand</td><td' + fontStyle2 + ' align="right">Quantity</td><td' + fontStyle2 + ' align="right">Unit Price</td><td' + fontStyle2 + ' align="right">Total</td></tr>';
    html += '<tr><td colspan="7" style="border-top:solid black 2px;"></td></tr>';
    
    var grandtotal = 0;
    var qtytotal = 0;
    
    // Pointers to process the items ...
    var thisColour = null;
    var nextColour = null; // Used to detect >1 colour for a parent & keep going until null ...
    var nextColourItem = 0; // The item # of the next colour
    
	var itemArray = new Array();
    
    // Build matrix of parents, colours, qty and sizes for lookup
    for (var i = 1; i <= lineCount; i++) 
    {
        var currentItemId = soRecord.getLineItemValue('item', 'item', i);
		var currentItem = nlapiLoadRecord('inventoryitem', currentItemId);
        
        var parent = currentItem.getFieldValue('parent');
        matrixArray[i - 1][0] = parent;
        
 		var colourField = getColourFieldName(currentItem); // e.g. 'custitem_colour_stylestalker'
        var colour = currentItem.getFieldValue(colourField); // e.g. '2'
        matrixArray[i - 1][1] = colour;
        
        var sizeField = getSizeFieldName(currentItem); // e.g. 'custitem_size_stylestalker'
        var sizematrix = currentItem.getFieldValue(sizeField);
        matrixArray[i - 1][2] = sizematrix;
        
        var quantityonorder = soRecord.getLineItemValue('item', qtyField, i);
		if (quantityonorder) 
			matrixArray[i - 1][3] = parseInt(quantityonorder);
		else
			matrixArray[i - 1][3] = 0;
        
        var itemAmount = soRecord.getLineItemValue('item', 'amount', i);
        matrixArray[i - 1][4] = parseFloat(itemAmount);
		
		// Put item in array for use in 'for' loop below
		itemArray.push(currentItem);
    }
    
    for (var j = 1; j <= lineCount; j++) 
    {
        if (lineArray[j - 1] == 0) 
		{
			// Only process lines that are available
			var currentItem = soRecord.getLineItemValue('item', 'item', j);
			
			var currentRecord = itemArray[j - 1];
			
			var parent = currentRecord.getFieldValue('parent');
			var parentName = currentRecord.getFieldText('parent');
            var description = currentRecord.getFieldValue('salesdescription');
            var department = currentRecord.getFieldText('department');
            var catalogue = currentRecord.getFieldValue('custitem3');
            var brand = currentRecord.getFieldValue('manufacturer');
            var price = currentRecord.getFieldValue('price');
            
            var location = '';
            if (displayLocation) 
                location = currentRecord.getFieldText('location');
            
            // Work out the particular colour / size matrix to use for this parent item
            var cusRecord = nlapiLoadRecord('customrecord_sizesmatrix', getSizeFieldRef(getSizeFieldName(currentRecord)));
            var sizematrixRef = cusRecord.getFieldValue('custrecord_sizematrixname');
            var sizematrixarray = cusRecord.getFieldValue('custrecord_sizematrixcommalist').split(",");
            var numSizes = 0;
			
			// Actual matrix item option headers
            var sizeHtml = '<td colspan="4"><table class="matrix"><tr><td class="colourname">Colours/Sizes</td>';
            while (numSizes < sizematrixarray.length) 
            {
                sizeHtml += '<td class="coloursize" align="right">' + sizematrixarray[numSizes] + '</td>';
                numSizes++;
            }
			sizeHtml += '</tr>';
            
            // Determine the IDs and types of the Colour / Size Matrix based on the custom fields 
            // Colours & sizes set for parent type ...
            var lookupSizeField = getSizeFieldName(currentRecord);
            var lookupColourField = getColourFieldName(currentRecord)
			//html += '<tr><td colspan="7">Size = ' + lookupSizeField + ' Colour = ' + lookupColourField + '</td></tr>'; // Trace ...
          
            var colour = currentRecord.getFieldValue(lookupColourField);

            var colourName = nlapiEscapeXML(currentRecord.getFieldText(lookupColourField));
            
            nextColour = colour; // i.e. the first colour for this parent ...
            nextColourItem = j;
			
			var totalHtml = '', rateHtml = '', amountHtml = '';
            
            while (nextColour != null) 
            {
            
                thisColour = nextColour;
                var lookupItem = soRecord.getLineItemValue('item', 'item', nextColourItem);
                var lookupAmount = soRecord.getLineItemValue('item', 'amount', nextColourItem);
                var lookupRate = soRecord.getLineItemValue('item', 'rate', nextColourItem);
                var lookupColourName = nlapiEscapeXML(nlapiLookupField('inventoryitem', lookupItem, lookupColourField, true));
                nextColour = null; // Assume no more colours will be found for this parent ...
                nextColourItem = 0;
                
                var sizeArray = new Array();
                for (sa = 0; sa < numSizes; sa++) 
                    sizeArray[sa] = 0;
                
                var total = 0; // Quantities
                var amountTotal = 0; // The total of all colour sizes amounts
                for (var ma = 1; ma <= lineCount; ma++) 
                {
                    if (lineArray[ma - 1] == 0) 
                    {
                        var lookupParent = matrixArray[ma - 1][0];
                        var lookupSize = matrixArray[ma - 1][2];
                        var lookupColour = matrixArray[ma - 1][1];
                        var lookupQty = matrixArray[ma - 1][3];
                        var lookupAmount = matrixArray[ma - 1][4];
                        
                        if (lookupParent == parent) 
                        {
                            if (lookupColour == thisColour) 
                            {
                                sizeArray[lookupSize - 1] = lookupQty;
                                amountTotal += lookupAmount;
                                lineArray[ma - 1] = 1; //Mark that item line as 'done' ...	
                            }
                            else 
                            {
                                if (nextColour == null) 
                                {
                                    nextColour = lookupColour; // Another colour found ...
                                    nextColourItem = ma; // Set item # ...								   	
                                }
                            }
                        }
                    }
                }
                
                for (var y = 0; y < numSizes; y++) 
                    total += sizeArray[y];
                
                //sizeTotal = parseFloat(total * price); 
                //if(sizeTotal != lookupAmount) sizeTotal = lookupAmount;
                
                if (total > 0) // Prevent spurious empty colour line outputting for 1 Size only range 
				{
					sizeHtml += '<tr><td>' + nlapiEscapeXML(lookupColourName) + '</td>';
                    for (sz = 0; sz < numSizes; sz++) 
					{
						if (sizeArray[sz] == 0) 
							sizeHtml += '<td align="right"></td>';
						else 
							sizeHtml += '<td align="right">' + sizeArray[sz] + '</td>';
					}
					sizeHtml += '</tr>';
					
					if (totalHtml == '') 
						totalHtml = '<table class="matrix"><tr><td>&nbsp;</td></tr>';
					totalHtml += '<tr><td ' + fontStyle5 + ' align="right">' + total + '</td></tr>';
					
					if (rateHtml == '') 
						rateHtml = '<table class="matrix"><tr><td>&nbsp;</td></tr>';
					rateHtml += '<tr><td ' + fontStyle5 + ' align="right">' + lookupRate + '</td></tr>';
					
					if (amountHtml == '') 
						amountHtml = '<table class="matrix"><tr><td>&nbsp;</td></tr>';
					amountHtml += '<tr><td ' + fontStyle5 + ' align="right"><b>' + amountTotal.toFixed(2) + '</b></td></tr>';
                }
                
                qtytotal += total;
                grandtotal += parseFloat(price * total);
                
            } //while (nextColour != null)
            
			sizeHtml += '</table></td>';
            
			if (totalHtml != '')
				totalHtml += '</table>';
				
			if (rateHtml != '')
				rateHtml += '</table>';
				
			if (amountHtml != '')
				amountHtml += '</table>';
            
			if (j > 1) 
                html += '<tr><td colspan="7"></td></tr>'; // Spacer ...
            html += '<tr><td' + fontStyle4 + '>' + nlapiEscapeXML(parentName) + ' (' + nlapiEscapeXML(description) + ')</td><td' + fontStyle1 + '>' + nlapiEscapeXML(location) + '</td><td' + fontStyle1 + '>' + nlapiEscapeXML(department) + '</td><td ' + fontStyle1 + ' colspan="4">' + nlapiEscapeXML(brand) + '</td></tr>';
            html += '<tr>' + sizeHtml + '<td align="right">' + totalHtml + '</td><td align="right">' + rateHtml + '</td><td align="right">' + amountHtml + '</td></tr>';
        }
    }
    
    html += createReportFooter(soRecordId, reportType, qtytotal);
    html += '</table>';
    
    var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n' +
		'<pdf>\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</pdf>';
	//response.setContentType('HTMLDOC', strRecType + soRecordId + '.html');
	//response.write(xml);
    var file = nlapiXMLToPDF(xml);
    response.setContentType('PDF', strRecType + soRecordId + '.pdf');
    response.write(file.getValue());
    
} //function
