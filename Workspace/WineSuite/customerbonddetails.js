// JavaScript Document
function getCustomerBondDetails(params) {
	var myReturn = new Array();
	cid = params.getParameter("cid");
	
	var filters = new Array();
	filters.push(new nlobjSearchFilter('custrecord_customername', null, 'is',cid));
	
	var columns = new Array();
	columns.push(new nlobjSearchColumn('internalid'));
	columns[0].setSort();
	columns.push(new nlobjSearchColumn('custrecord_bondwarehouse'));
	columns.push(new nlobjSearchColumn('custrecord_customername'));
	columns.push(new nlobjSearchColumn('custrecord2'));
	columns.push(new nlobjSearchColumn('custrecord_bondwarehouseaddress'));
	columns.push(new nlobjSearchColumn('custrecord_isdefaultbond'));
	
	var bdetails = nlapiSearchRecord('customrecord_custbonddetails', null, filters, columns);
	nlapiLogExecution('ERROR', 'cid', cid);
	if(bdetails) {
		for(var i=0; i < bdetails.length; i++) {
			
			var itemObj = new Object();
			itemObj.id = bdetails[i].getId();
			itemObj.custrecord_bondwarehouse = bdetails[i].getText("custrecord_bondwarehouse");
			itemObj.custrecord_bondwarehouseid = bdetails[i].getValue("custrecord_bondwarehouse");
			itemObj.custrecord_customername = bdetails[i].getText("custrecord_customername");
			itemObj.custrecord2 = bdetails[i].getValue("custrecord2");
			itemObj.custrecord_bonddefault = bdetails[i].getValue("custrecord_isdefaultbond");
			itemObj.custrecord_bondwarehouseaddress = newstring(bdetails[i].getValue("custrecord_bondwarehouseaddress"));
			myReturn.push(itemObj);
		}
	}
	
	
	myJSON = JSON.stringify({items:myReturn});

	response.write(myJSON);
}

function createnewbonddetails(params) {
		cid = params.getParameter("cid");
		custrecord_bondwarehouse = params.getParameter("whouse");
		custrecord2 = params.getParameter("accnum");
		try {
			
			var filters = new Array();
			filters.push(new nlobjSearchFilter('custrecord_customername', null, 'is',cid));
			filters.push(new nlobjSearchFilter('custrecord_isdefaultbond', null, 'is','T'));
			
			var bdetails = nlapiSearchRecord('customrecord_custbonddetails', null, filters);
			if(bdetails) {
				var bdetailrec = nlapiLoadRecord('customrecord_custbonddetails',bdetails[0].getId());	
				bdetailrec.setFieldValue('custrecord_isdefaultbond','F');
				nlapiSubmitRecord(bdetailrec);
			}
	
	
			var bdetailrec = nlapiCreateRecord("customrecord_custbonddetails");
			bdetailrec.setFieldValue("custrecord_bondwarehouse",custrecord_bondwarehouse);
			bdetailrec.setFieldValue('name',bdetailrec.getFieldText('custrecord_bondwarehouse'))
			bdetailrec.setFieldValue("custrecord_customername",cid);
			bdetailrec.setFieldValue("custrecord2",custrecord2);
			bdetailrec.setFieldValue("custrecord_isdefaultbond",'T');
			nlapiSubmitRecord(bdetailrec);

		} catch(e){ nlapiLogExecution('ERROR', 'customer error', e); }
		
}


function updateCustomerBondDetails(params){
	cid = params.getParameter("cid");
	bid = params.getParameter("bid");
	custrecord_bondwarehouse = params.getParameter("whouse");
	custrecord2 = params.getParameter("accnum");
	 nlapiLogExecution('ERROR', 'cid', cid);
	 nlapiLogExecution('ERROR', 'bid', bid);
	  nlapiLogExecution('ERROR', 'custrecord_bondwarehouse', custrecord_bondwarehouse);
	var filters = new Array();
	filters.push(new nlobjSearchFilter('custrecord_customername', null, 'is',cid));
	filters.push(new nlobjSearchFilter('internalid', null, 'is',bid));
	
	var bdetails = nlapiSearchRecord('customrecord_custbonddetails', null, filters);
	if(bdetails) {
		var bdetailrec = nlapiLoadRecord('customrecord_custbonddetails',bid);	
		bdetailrec.setFieldValue('custrecord_bondwarehouse',custrecord_bondwarehouse)
		bdetailrec.setFieldValue('name',bdetailrec.getFieldText('custrecord_bondwarehouse'))
		bdetailrec.setFieldValue('custrecord2',custrecord2)
		nlapiSubmitRecord(bdetailrec);
		
	}
	
}

function makebonddetailsdefault(params) {
	cid = params.getParameter("cid");
	bid = params.getParameter("bid");
	try {
	var filters = new Array();
	filters.push(new nlobjSearchFilter('custrecord_customername', null, 'is',cid));
	filters.push(new nlobjSearchFilter('custrecord_isdefaultbond', null, 'is','T'));
	
	var bdetails = nlapiSearchRecord('customrecord_custbonddetails', null, filters);
	if(bdetails) {
		var bdetailrec = nlapiLoadRecord('customrecord_custbonddetails',bdetails[0].getId());	
		bdetailrec.setFieldValue('custrecord_isdefaultbond','F');
		nlapiSubmitRecord(bdetailrec);
	}
	
	
	var bdetailrec = nlapiLoadRecord('customrecord_custbonddetails',bid);
	bdetailrec.setFieldValue('custrecord_isdefaultbond','T');
	nlapiSubmitRecord(bdetailrec);
	nlapiLogExecution('ERROR', 'bid', bid);
	} catch(e){ nlapiLogExecution('ERROR', 'customer error', e); }
}


function getBondWarehouseAddress() {
	var myReturn = new Array();
	var columns = new Array();
	columns.push(new nlobjSearchColumn('internalid'));
	columns.push(new nlobjSearchColumn('custrecord_address'));
	var whouselist = nlapiSearchRecord('customrecord_warhouseaddress', null, null, columns);
	if(whouselist) {
		for(var i=0; i < whouselist.length; i++) {	
			var itemObj = new Object();
			itemObj.id = whouselist[i].getId();
			itemObj.custrecord_address = newstring(whouselist[i].getValue("custrecord_address"));
			myReturn.push(itemObj);
		}
	}
	
	myJSON = JSON.stringify({items:myReturn});

	response.write(myJSON);
}

function newstring(text) {
	return text.replace(/[\n\r\t]/gm,'#newline');
}