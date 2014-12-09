var CSS_DEFINITION = '<style type="text/css">';
CSS_DEFINITION += 'h1 { font-family: Helvetica; font-size: 18px;} ';
CSS_DEFINITION += '.signatureblock {width:400px; height:200px; border:solid black 1px;} ';
CSS_DEFINITION += 'table { font-family: Helvetica; text-align: left; font-size: 11px;} ';
CSS_DEFINITION += 'table.headerinfo { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold} ';
CSS_DEFINITION += '.print { font-family: Helvetica; text-align: left; font-size: x-small;} ';
CSS_DEFINITION += '.standard { font-family: Helvetica; font-size:12px;} ';
CSS_DEFINITION += '.emphasised { font-family: Helvetica; font-weight:bold; font-size:12px;} ';
CSS_DEFINITION += '.rightalign { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.detailed { font-family: Helvetica; font-size:8px;} ';
CSS_DEFINITION += '</style>';

var fontStyle1 = ' class=\"standard\" ';
var fontStyle2 = ' class=\"emphasised\" ';
var fontStyle3 = ' class=\"rightalign\" ';
var fontStyle4 = ' class=\"sizematrix\" ';
var fontStyle5 = ' class=\"detailed\" ';

function getHeadNode(){
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

// Common variables ...
var userid = nlapiGetUser(); // entity id of the current user
var userRecord = null;
var companyName = '';
var companyAddr = '';
var theAcct = '';

function setUpUserDetails(theUserID){
	userRecord = nlapiLoadRecord('customer', theUserID);
	companyName = userRecord.getFieldValue('companyname');
	companyAddr = userRecord.getFieldValue('defaultaddress');
	theAcct = userRecord.getFieldValue('entityid');
}

function getLongMonth(theMonth){
    var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return m[parseInt(theMonth-1)];
}

function getLongDay(theDay){
    if (parseInt(theDay) <= 9) { return '0' + theDay; } else { return theDay; }
}

var today = new Date();
var theDate = nlapiDateToString(today); // [d]d/[m]m/yyyy
if (request.getParameter('custparam_manifestdate') != '' && request.getParameter('custparam_manifestdate') != null) theDate = request.getParameter('custparam_manifestdate');
var dateArray = theDate.split("/");
var theLongDate = getLongDay(dateArray[0]) + " " + getLongMonth(dateArray[1]) + " " + dateArray[2] ;

function createReportHeader(fromDate,toDate,companyAddr,showAll){

	var reportTitle = 'NEP Pallets';
	var dateRange = theLongDate;
	if (!showAll) { 
		if (fromDate != '' && toDate != ''){
			if (fromDate == toDate) {
				var dateArray = fromDate.split("/");
				dateRange = getLongDay(dateArray[0]) + " " + getLongMonth(dateArray[1]) + " " + dateArray[2] ;
			}
			else {
				dateRange = fromDate + ' - ' + toDate;
			}
		}
	}

    var header = '<tr><td colspan=\"9\" align=\"center\"><h1>' + reportTitle + '</h1></td></tr>';
    header += '<tr><td colspan=\"4\" ' + fontStyle1 + '><h1>Delivery Manifest</h1></td><td>&nbsp;</td><td colspan=\"5\" ' + fontStyle1 + ' align=\"right\"><h1>' + dateRange + '</h1></td></tr>';
    header += '<tr><td colspan=\"4\" ' + fontStyle1 + '><b>' + nlapiEscapeXML(companyAddr).replace(/\n/g, '<br />') + '</b></td><td>&nbsp;</td><td colspan=\"5\" ' + fontStyle1 + ' align=\"right\">Account:&nbsp;' + theAcct + '</td></tr>';
    header += '<tr><td colspan=\"9\">&nbsp;</td></tr>';
    header += '<tr><td>DOCNUM</td><td>SVCE</td><td>CONSIGNEE</td><td>REF.</td><td>TOWN</td><td width="15mm">PCODE</td><td>PALLETS</td><td>[CHK]</td><td>WT (KG)</td></tr>';
    header += '<tr><td colspan=\"9\" style=\"height:10px; border-top:solid black 2px;\">&nbsp;</td></tr>';
    return header;
}

function createReportFooter(totalConsignments, totalCartons, totalWeight){
    var signatureBlock = '<table  style=\"margin:10px;\"><tr><td ' + fontStyle2 + ' style=\"width:75px; vertical-align:bottom;\">Signature</td><td style=\"width:300px; border-bottom:dotted gray 1px;\">&nbsp;</td></tr><tr><td ' + fontStyle2 + ' style=\"width:75px; height:30px; vertical-align:bottom;\">Print</td><td style=\"width:300px; border-bottom:dotted gray 1px;\">&nbsp;</td></tr></table>';
    
    var footer = '<tr><td colspan=\"9\" style=\"height:10px; border-bottom:solid black 2px;\">&nbsp;</td></tr>';
    footer += '<tr><td ' + fontStyle5 + ' colspan=\"6\">Consignments are carried subject to Terms &amp; Conditions of Carriage,<br />copies of which are available upon request from your depot.</td><td align=\"right\" colspan=\"2\"><b>Total Consignments</b></td><td ' + fontStyle2 + ' align=\"right\">' + totalConsignments + '</td></tr>';
    footer += '<tr><td colspan=\"6\" rowspan=\"3\" style=\"margin:5px; border-top:solid gray 1px; border-right:solid gray 1px; border-bottom:solid gray 1px; border-left:solid gray 1px;\">' + signatureBlock + '</td><td align=\"right\" colspan=\"2\"><b>Total Pallets</b></td><td ' + fontStyle2 + ' align=\"right\">' + totalCartons + '</td></tr>';
    footer += '<tr><td align=\"right\" colspan=\"2\"><b>Total Weight (KG)</b></td><td ' + fontStyle2 + ' align=\"right\"><b>&nbsp;' + totalWeight.toFixed(2) + '</b></td></tr>';
    footer += '<tr><td colspan=\"3\">&nbsp;</td></tr>';
    footer += '<tr><td ' + fontStyle5 + ' colspan=\"9\">Confidential Information.&nbsp;&copy;&nbsp;All rights reserved.</td></tr>';
    return footer;
}

function printManifest(request, response){ // no paramater = default to todays's date ...
    var manifestDate = 'today';
	if (request.getParameter('custparam_manifestdate') != '') manifestDate = request.getParameter('custparam_manifestdate');
    var fromDate = '';
	if (request.getParameter('custparam_dtfrom') != '') fromDate = request.getParameter('custparam_dtfrom');
    var toDate = '';
	if (request.getParameter('custparam_dt') != '') toDate = request.getParameter('custparam_dt');

	if (request.getParameter('custparam_cn') != '' && request.getParameter('custparam_cn') != null && request.getParameter('custparam_cn') != 0)
		userid = request.getParameter('custparam_cn');
	setUpUserDetails(userid);
	
	var showAll = false;
	if (request.getParameter('custparam_ignoredates') == 'T') showAll=true;
    //if (strDate != '' && strDate != null) manifestDate = strDate;
    
    var html = '';
    html += '<table cellpadding=\"2\" width=\"100%\">';
    html += createReportHeader(fromDate,toDate,companyAddr,showAll);
    
    // ----- Build Search for Today for this customer ...
    var mySearchFilters = new Array();
    var mySearchColumns = new Array();
    
    mySearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
    mySearchFilters[1] = new nlobjSearchFilter('entity', null, 'anyof', userid);
    mySearchFilters[2] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'noneof', ('4')); // Ignore cancelled ones
    mySearchFilters[3] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
    mySearchFilters[4] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', ('2')); // Parcels only
    mySearchFilters[5] = new nlobjSearchFilter('class', null, 'noneof', ('10')); // Not PURs
	if (showAll) {
		mySearchFilters[6] = new nlobjSearchFilter('trandate', null, 'on', 'today');
	} else {
		if (fromDate != '' && toDate != ''){
			if (fromDate == toDate) {
				mySearchFilters[6] = new nlobjSearchFilter('trandate', null, 'on', fromDate);
			} else {
				mySearchFilters[6] = new nlobjSearchFilter('trandate', null, 'onorafter', fromDate);
				mySearchFilters[7] = new nlobjSearchFilter('trandate', null, 'onorbefore', toDate);				
			}		
		} else {
			mySearchFilters[6] = new nlobjSearchFilter('trandate', null, 'on', manifestDate);
		}
	}

	mySearchColumns[0] = new nlobjSearchColumn('tranid');
    mySearchColumns[1] = new nlobjSearchColumn('custbody_labelservice');
    mySearchColumns[2] = new nlobjSearchColumn('custbody_delname');
    mySearchColumns[3] = new nlobjSearchColumn('custbody_deliveryaddr4');
    mySearchColumns[4] = new nlobjSearchColumn('custbody_deliverypostcode');
    mySearchColumns[5] = new nlobjSearchColumn('custbody_labelparcels');
    mySearchColumns[6] = new nlobjSearchColumn('custbody_labeltotalweight');
    mySearchColumns[7] = new nlobjSearchColumn('custbody_labelfswflag');
    mySearchColumns[8] = new nlobjSearchColumn('otherrefnum');
    
    // Perform search ....
    var mySearchResults = nlapiSearchRecord('salesorder', null, mySearchFilters, mySearchColumns);
    
    // Display results ....
    if (mySearchResults) {
    
        var totalCartons = 0;
        var totalWeight = 0.00;
        
        for (i = 0; i < mySearchResults.length; i++) {
            var docNum = mySearchResults[i].getValue(mySearchColumns[0]);
            var serviceDesc = mySearchResults[i].getValue(mySearchColumns[1]);
            var ServiceArray = serviceDesc.split(' ');
            var service = nlapiEscapeXML(ServiceArray[0]);
            var custRef = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[8]));
            var consignee = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[2]));
            var town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[3]));
            var postcode = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[4]));
            var parcels = parseInt(mySearchResults[i].getValue(mySearchColumns[5]));
            totalCartons += parcels; // for footer ...
            var parcelweight = parseFloat(mySearchResults[i].getValue(mySearchColumns[6]));
            totalWeight += parcelweight;
            var fswflag = mySearchResults[i].getValue(mySearchColumns[7]);
            
            html += '<tr><td>' + docNum + '</td><td>' + service + '</td><td>' + consignee + '</td><td>' + custRef + '</td><td>' + town + '</td><td style="width:15mm;">' + postcode + '</td><td>' + parcels + '</td><td>[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td><td align="right">' + parcelweight.toFixed(2) + '</td></tr>';
        } // for ...
        html += createReportFooter(mySearchResults.length, totalCartons, totalWeight);
    }
    else {
        html += '<tr><td colspan=\"9\">There are no consignments for ' + theLongDate + '</td></tr>';
    }
    
    //if (mySearchResults) html += createReportFooter(mySearchResults.length, totalCartons, totalWeight);
    html += '</table>';
    
    var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</pdf>';
    var file = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'manifest.pdf');
    response.write(file.getValue());
    
}
