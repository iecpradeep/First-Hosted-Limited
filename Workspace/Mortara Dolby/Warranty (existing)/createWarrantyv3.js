function queueForCreateWarranty(type) {
    var createdfrom = nlapiGetFieldValue('createdfrom');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'is', createdfrom);

    var trnsearchresult = nlapiSearchRecord('transaction', null, filters, null);
    if (trnsearchresult != null) {
        for (var a = 0; trnsearchresult != null && a < trnsearchresult.length; a++) {

            var trnsearchresult = trnsearchresult[a];
            var itemtype = trnsearchresult.getRecordType();
        }

        if (itemtype == 'purchaseorder') {
            var queueScript = false;
            if (type == 'create') {
                nlapiSetFieldValue('custbody_warranty_status', 1);
                queueScript = true;
            }
            else {
                var warrantyStatus = nlapiGetFieldValue('custbody_warranty_status');
                if (isBlank(warrantyStatus)) {
                    nlapiSetFieldValue('custbody_warranty_status', 1);
                    queueScript = true;
                }

            }
            nlapiLogExecution('DEBUG','queueStatus is : '+ queueScript);
            if (queueScript == true) {
                nlapiScheduleScript('customscript_createwarrantscheduled', 'customdeploy_create_warranty_records');

            }
        }
        else {
            nlapiSetFieldValue('custbody_warranty_status', 4);
        }
    }
}

function queueForAssignWarranty() {

    var createdfrom = nlapiGetFieldValue('createdfrom');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'is', createdfrom);

    var trnsearchresult = nlapiSearchRecord('transaction', null, filters, null);
    if (trnsearchresult != null) {
        for (var a = 0; trnsearchresult != null && a < trnsearchresult.length; a++) {

            var trnsearchresult = trnsearchresult[a];
            var itemtype = trnsearchresult.getRecordType();
        }

        nlapiLogExecution('DEBUG', 'itemtype : ' + itemtype);
        if (itemtype == 'salesorder') {

            var queueScript = false;
            if (type == 'create') {
                nlapiSetFieldValue('custbody_warranty_status', 1);
                queueScript = true;
            }
            else {
                var warrantyStatus = nlapiGetFieldValue('custbody_warranty_status');
                nlapiLogExecution('DEBUG', 'warrantyStatus : ' + warrantyStatus);
                if (isBlank(warrantyStatus)) {
                    nlapiSetFieldValue('custbody_warranty_status', 1);
                    queueScript = true;
                }

            }
            nlapiLogExecution('DEBUG','queueStatus is : '+ queueScript);
            if (queueScript == true) {
                nlapiScheduleScript('customscript_assignwarrantyscheduled', 'customdeploy_assignwarrantyscheduled');
            }
        }
        else {
            nlapiSetFieldValue('custbody_warranty_status', 4);
            nlapiLogExecution('DEBUG','Setting warranty Status through script : ');
        }
    }

}


function createWarranty() {


    nlapiLogExecution('DEBUG', 'Running createWarranty ', 'Entered State ');
    //create warranty records post save
    var context = nlapiGetContext();
    var maximumusage = 350;
    var usage = 0;
    var remainingusage = 0;
    var previousremainingusage = 10000;
    var moreRequired = 0;

    for (var loop = 0; loop < 1; loop++) {
        nlapiLogExecution('DEBUG', 'Loop is : ' + loop);
        var receiptForWarrantySearchresult = nlapiSearchRecord('transaction', 'customsearch_receipts_pending_warranty', null, null);
        if (receiptForWarrantySearchresult != null) {
            if (receiptForWarrantySearchresult.length == 1000) {
                moreRequired = 1;
            }
            nlapiLogExecution('DEBUG', 'Number of Fulfilments to process  = ' + receiptForWarrantySearchresult.length);
            for (var a = 0; receiptForWarrantySearchresult != null && a < receiptForWarrantySearchresult.length; a++) {
                var errorcode = 0;
                var itemeceiptRecord = receiptForWarrantySearchresult[ a ];
                var itemReceiptID = itemeceiptRecord.getId();
                var trnType = itemeceiptRecord.getRecordType();
                var errorCode = 0;

                var itemReceiptRecord = nlapiLoadRecord(trnType, itemReceiptID);
                var custrecord_purchaseorder = itemReceiptRecord.getFieldValue('createdfrom');
                nlapiLogExecution('DEBUG', 'Transaction Number ', 'poNumber : ' + custrecord_purchaseorder);

                var orderType = nlapiLookupField('purchaseorder', custrecord_purchaseorder, 'custbody_ordetype');
                nlapiLogExecution('DEBUG', 'OrderType ', 'orderType : ' + orderType);

                var itemReceiptDate = itemReceiptRecord.getFieldValue('trandate');

                var warrantyStartDate = fixDate(itemReceiptDate);
                var warrantyDate = new Date(warrantyStartDate);

                var numLines = itemReceiptRecord.getLineItemCount('item');
                for (var c = 1; c <= numLines; c++) {
                    nlapiLogExecution('DEBUG', 'Cycling through Lines  ', 'numlines : ' + numLines);
                    var serialNumbers = new Array();
                    var line = itemReceiptRecord.selectLineItem('item', c);
                    var custrecord_lotitem = itemReceiptRecord.getCurrentLineItemValue('item', 'item');
                    var custrecord_lotitemtext = itemReceiptRecord.getCurrentLineItemText('item', 'item');

                    /*****
                     *
                     *get warranty Information from Item record
                     *
                     ****/

                    nlapiLogExecution('DEBUG', 'Getting Item Information for Warranty  ', 'Line Num : ' + c + ' item : ' + custrecord_lotitem);
                    var itemfilters = new Array();
                    itemfilters[0] = new nlobjSearchFilter('internalid', null, 'is', custrecord_lotitem);

                    var itemcolumns = new Array();
                    itemcolumns[0] = new nlobjSearchColumn('custitem_warrantyoffered');
                    itemcolumns[1] = new nlobjSearchColumn('custitem_supplierwarranty');
                    itemcolumns[2] = new nlobjSearchColumn('custitem_customerwarranty');

                    var itemsearchresults = nlapiSearchRecord('item', null, itemfilters, itemcolumns);
                    if (itemsearchresults != null) {
                        for (var d = 0; itemsearchresults != null && d < itemsearchresults.length; d++) {

                            var itemsearchresult = itemsearchresults[d];
                            var itemtype = itemsearchresult.getRecordType();
                            var custitem_warrantyoffered = itemsearchresult.getValue('custitem_warrantyoffered');
                            var custrecord_supplierwarrantyperiod = itemsearchresult.getValue('custitem_supplierwarranty');
                            var custitem_customerwarranty = itemsearchresult.getValue('custitem_customerwarranty');
                            nlapiLogExecution('DEBUG', 'Item Variables Set  ', 'custitem_warrantyoffered : ' + c + ' : custrecord_supplierwarrantyperiod: ' + custrecord_supplierwarrantyperiod);
                        }
                    }

                    if (custitem_warrantyoffered == 'T') {
                        nlapiLogExecution('DEBUG', 'In Warranty Creation Section  ', 'custitem_warrantyoffered : ');
                        var custrecord_quantity = itemReceiptRecord.getCurrentLineItemValue('item', 'quantity');
                        if (isBlank(custrecord_supplierwarrantyperiod)) {
                            custrecord_supplierwarrantyperiod = 12;
                        }

                        var custrecord_warrantyserialnumber = itemReceiptRecord.getCurrentLineItemValue('item', 'serialnumbers');


                        var splits = /[\n\r]/g;
                        var splitSerials = custrecord_warrantyserialnumber.split(splits);
                        nlapiLogExecution('DEBUG', 'Trying to splits ', splitSerials);

                        if (splitSerials != null) {
                            nlapiLogExecution('DEBUG', 'splitSerials.length ', splitSerials.length);
                            if (itemtype == 'lotnumberedinventoryitem') {
                                for (var q = 1; q <= custrecord_quantity; q++) {
                                    var NewSerialNumber = nlapiCreateRecord('customrecord_serialnumbers');
                                    NewSerialNumber.setFieldValue('name', 'LOT:' + splitSerials[0] + '-item-' + q);
                                    NewSerialNumber.setFieldValue('custrecord_sn_lot_number', splitSerials[0]);
                                    try {
                                        var sn = nlapiSubmitRecord(NewSerialNumber);
                                        serialNumbers[q - 1] = sn;

                                    }
                                    catch (sererr) {
                                        nlapiLogExecution('ERROR', 'Error in Submission of NewSerialNumber', sererr);
                                        errorCode = 1;
                                    }


                                }
                            }
                            else {

                                for (var s = 0; s < splitSerials.length; s++) {
                                    var NewSerialNumber = nlapiCreateRecord('customrecord_serialnumbers');
                                    nlapiLogExecution('DEBUG', 'splitSerials[' + s + ']', splitSerials[s]);
                                    NewSerialNumber.setFieldValue('name', splitSerials[s]);

                                    try {
                                        nlapiLogExecution('DEBUG', 'Creating New Serial Number Record for Serialised ', 'Doing it now');
                                        serialNumbers[s] = nlapiSubmitRecord(NewSerialNumber);

                                    }
                                    catch (sererr) {
                                        nlapiLogExecution('ERROR', 'Error in Submission of NewSerialNumber', sererr);
                                    }
                                }
                            }

                        }
                        else {
                            custrecord_warrantyserialnumber = 'No Serial Number';
                        }
                        if (orderType != 2) {
                            var warrantyEndDate = nlapiAddMonths(warrantyDate, custrecord_supplierwarrantyperiod);
                            var truncWarrantyEndDate = truncDate(warrantyEndDate);

                            for (var i = 1; i <= custrecord_quantity; i++) {
                                nlapiLogExecution('DEBUG', 'serialNumbers[i - 1]', serialNumbers[i - 1]);

                                var newWarrantyRecord = nlapiCreateRecord('customrecord_warrantydetails');
                                newWarrantyRecord.setFieldValue('custrecord_warrantyserialnumber', serialNumbers[i - 1]);
                                newWarrantyRecord.setFieldValue('custrecord_purchaseorder', custrecord_purchaseorder);
                                newWarrantyRecord.setFieldValue('custrecord_supplierwarrantyperiod', custrecord_supplierwarrantyperiod);
                                newWarrantyRecord.setFieldValue('custrecord_warrantyenddate', truncWarrantyEndDate);
                                newWarrantyRecord.setFieldValue('custrecord_wrrantystatus', 1);
                                nlapiLogExecution('DEBUG', 'serialNumbers[i - 1]', serialNumbers[i - 1]);
                                var serialName = nlapiLookupField('customrecord_serialnumbers', serialNumbers[i - 1], 'name');
                                newWarrantyRecord.setFieldValue('name', (serialName + ':' + custrecord_lotitemtext));


                                try {
                                    nlapiLogExecution('DEBUG', 'Trying to newWarrantyRecord ', 'Doing it now');
                                    var WarrantyID = nlapiSubmitRecord(newWarrantyRecord);
                                    nlapiLogExecution('DEBUG', 'Created Warranty', WarrantyID);

                                    var newWarrantyItem = nlapiCreateRecord('customrecord_warrantyitem');
                                    newWarrantyItem.setFieldValue('custrecord_warrantyitem', custrecord_lotitem);
                                    newWarrantyItem.setFieldValue('custrecord_warranty_serial_item', serialNumbers[i - 1]);
                                    newWarrantyItem.setFieldValue('custrecord_warrantyrecord', WarrantyID);
                                    newWarrantyItem.setFieldValue('custrecord_itemactive', 'T');
                                    var WarrantyItemID = nlapiSubmitRecord(newWarrantyItem);

                                }
                                catch (warrantyLineError) {
                                    nlapiLogExecution('ERROR', 'Error in Submission of newWarrantyRecord', warrantyLineError);
                                    errorCode = 1;

                                }
                            }


                        }
                        itemReceiptRecord.commitLineItem('item');
                    }
                }
                try {
                    if (errorCode == 0) {
                        itemReceiptRecord.setFieldValue('custbody_warranty_status', 2);
                    }
                    else {
                        itemReceiptRecord.setFieldValue('custbody_warranty_status', 2);
                    }

                    var soID = nlapiSubmitRecord(itemReceiptRecord);
                    nlapiLogExecution('DEBUG', 'Submitted the Item Receipt ', soID);
                }
                catch (soError) {
                    nlapiLogExecution('ERROR', 'Error in Submission of SO', soError);
                }


                remainingusage = context.getRemainingUsage();
                usage = (previousremainingusage - remainingusage);
                previousremainingusage = remainingusage;

                if (usage > maximumusage) {
                    maximumusage = usage;
                }
                if (context.getRemainingUsage() <= maximumusage && (a + 1) < isg_dunning_searchresults.length) {
                    nlapiLogExecution('AUDIT', 'Hit the limit.  got to ', a);
                    var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
                    if (status == 'QUEUED')
                        break;

                }

            }
        }


        if (moreRequired == 1) {
            nlapiLogExecution('AUDIT', 'There were 1000 results.  Queued for reexecution to check', moreRequired);
            var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
            if (status == 'QUEUED') {
                break;
            }
        }
    }
    return true;

}


function assignWarranty() {

    var context = nlapiGetContext();
    var maximumusage = 350;
    var usage = 0;
    var remainingusage = 0;
    var previousremainingusage = 10000;
    var moreRequired = 0;

    for (var loop = 0; loop < 1; loop++) {

        var fulfilmentForWarrantyResults = nlapiSearchRecord('transaction', 'customsearch_fulfilment_pending_warranty', null, null);
        if (fulfilmentForWarrantyResults != null) {
            if (fulfilmentForWarrantyResults.length == 1000) {
                moreRequired = 1;
            }
            nlapiLogExecution('DEBUG', 'Number of Fulfilments to process  = ' + fulfilmentForWarrantyResults.length);
            for (var a = 0; fulfilmentForWarrantyResults != null && a < fulfilmentForWarrantyResults.length; a++) {
                var errorcode = 0;
                var itemFulfilmentRecord = fulfilmentForWarrantyResults[ a ];
                var itemFulfilment = itemFulfilmentRecord.getId();
                var trnType = itemFulfilmentRecord.getRecordType();


                nlapiLogExecution('DEBUG', 'Running Aiign Warranty for fulfilment : ', 'itemFulfilment is : ' + itemFulfilment);
                var ifRecord = nlapiLoadRecord(trnType, itemFulfilment);
                var orderType = ifRecord.getFieldValue('custbody_ordetype');
                var custrecord_salesorder = ifRecord.getFieldValue('createdfrom');
                var fulfilmentDate = ifRecord.getFieldValue('trandate');

//get information from sales order

                var fields = ['entity']
                var soinfo = nlapiLookupField('salesorder', custrecord_salesorder, fields);
                var customer = soinfo.entity;

                if (orderType == 1) {

                    var CustomerWarrantyStartDate = fixDate(fulfilmentDate);
                    var warrantyDate = new Date(CustomerWarrantyStartDate);
                    var numLines = ifRecord.getLineItemCount('item');
                    for (var b = 1; b <= numLines; b++) {

                        var line = ifRecord.selectLineItem('item', b);

                        var custrecord_lotitem = ifRecord.getCurrentLineItemValue('item', 'item');

                        /*****
                         *
                         *get warranty Information from Item record
                         *
                         ****/


                        var itemfilters = new Array();
                        itemfilters[0] = new nlobjSearchFilter('internalid', null, 'is', custrecord_lotitem);

                        var itemcolumns = new Array();
                        itemcolumns[0] = new nlobjSearchColumn('custitem_warrantyoffered');
                        itemcolumns[1] = new nlobjSearchColumn('custitem_customerwarranty');

                        var itemsearchresults = nlapiSearchRecord('item', null, itemfilters, itemcolumns);
                        if (itemsearchresults != null) {
                            for (var c = 0; itemsearchresults != null && c < itemsearchresults.length; c++) {
                                var itemsearchresult = itemsearchresults[c];
                                var itemtype = itemsearchresult.getRecordType();
                                var custitem_warrantyoffered = itemsearchresult.getValue('custitem_warrantyoffered');
                                var custitem_customerwarranty = itemsearchresult.getValue('custitem_customerwarranty');
                            }
                        }


                        if (custitem_warrantyoffered == 'T') {
                            if (isBlank(custitem_customerwarranty)) {
                                custitem_customerwarranty = 12;
                            }

                            var splitSerials = ifRecord.getCurrentLineItemValues('item', 'serialnumbers');
                            var quantity = ifRecord.getCurrentLineItemValue('item', 'quantity');
                            //nlapiLogExecution('DEBUG', 'warrantyserialnumbers : ' + warrantyserialnumbers);
                            //var splits = /[\n\r]/g;
                            //var splitSerials = warrantyserialnumbers.split(splits);
                            var serialNumbers = new Array();
                            nlapiLogExecution('DEBUG', 'splitSerials.length : ' + splitSerials.length);
                            for (var d = 0; d < splitSerials.length; d++) {
                                nlapiLogExecution('DEBUG', 'd : ' + d);

                                var serialfilters = new Array();
                                if (itemtype == 'lotnumberedinventoryitem') {
                                    nlapiLogExecution('DEBUG', 'itemtype : ' + itemtype);
                                    nlapiLogExecution('DEBUG', 'splitSerials[0] : ' + splitSerials[0]);
                                    serialfilters[serialfilters.length] = new nlobjSearchFilter('custrecord_sn_lot_number', null, 'is', splitSerials[0]);
                                    serialfilters[serialfilters.length] = new nlobjSearchFilter('custrecord_sn_lot_allocated', null, 'is', 'F');
                                }
                                else {
                                    nlapiLogExecution('DEBUG', 'splitSerials['+d+'] : ' + splitSerials[d]);
                                    serialfilters[serialfilters.length] = new nlobjSearchFilter('name', null, 'is', splitSerials[d]);
                                }

                                var serialsearchresults = nlapiSearchRecord('customrecord_serialnumbers', null, serialfilters, null);
                                if (serialsearchresults != null) {
                                    nlapiLogExecution('DEBUG', 'serialsearchresults.length : ' + serialsearchresults.length);
                                    if (itemtype == 'lotnumberedinventoryitem') {
                                        nlapiLogExecution('DEBUG', 'SEARIAL SEARCH RESULTS itemtype : ' + itemtype);
                                        for (var e = 0; e < quantity; e++) {
                                            nlapiLogExecution('DEBUG', 'e : ' + e);
                                            var serialsearchresult = serialsearchresults[e];
                                            serialNumbers[e] = serialsearchresult.getId();
                                        }
                                    }
                                    else {
                                        nlapiLogExecution('DEBUG', 'SEARIAL SEARCH RESULTS itemtype : ' + itemtype);
                                        for (var f = 0; f < serialsearchresults.length; f++) {
                                            nlapiLogExecution('DEBUG', 'f : ' + f);
                                            var serialsearchresult = serialsearchresults[f];
                                            serialNumbers[f] = serialsearchresult.getId();
                                        }
                                    }

                                }
                                else {

                                    for (var g = 0; g <= quantity; g++) {
                                        serialNumbers[g] = 'No Serial Number';
                                    }
                                }
                            }


                            for (var qty = 1; qty <= quantity; qty++) {

                                nlapiLogExecution('DEBUG', 'serialNumbers['+qty+' - 1]', serialNumbers[qty - 1]);

                                if(serialNumbers[qty - 1]!='No Serial Number')
                                {
                                    var columns = new Array();
                                    columns[columns.length] = new nlobjSearchColumn('custrecord_warrantyrecord', null, null);



                                    var filters = new Array();
                                    filters[filters.length] = new nlobjSearchFilter('custrecord_warranty_serial_item', null, 'anyof', serialNumbers[qty - 1]);

                                    var searchresults = nlapiSearchRecord('customrecord_warrantyitem', null, filters, columns);
                                    if (searchresults != null) {
                                        for (var k = 0; k < searchresults.length; k++) {
                                            nlapiLogExecution('DEBUG', 'k : ' + k, 'searchresults.length : ' + searchresults.length);
                                            var searchresult = searchresults[ k ];

                                            var warrantyrecord = searchresult.getValue('custrecord_warrantyrecord');
                                            var waRecord = nlapiLoadRecord('customrecord_warrantydetails', warrantyrecord);
                                            var serialItem = waRecord.getFieldValue('custrecord_warrantyserialnumber');
                                            waRecord.setFieldValue('custrecord_salesorderdate', fulfilmentDate);
                                            waRecord.setFieldValue('custrecord_salesorderlink', custrecord_salesorder);
                                            waRecord.setFieldValue('custrecord_customer', customer);
                                            waRecord.setFieldValue('custrecord_customerwarrantyperiod', custitem_customerwarranty);

                                            //Calculate and set warranty end date
                                            var warrantyEndDate = nlapiAddMonths(warrantyDate, custitem_customerwarranty);
                                            var truncWarrantyEndDate = truncDate(warrantyEndDate);
                                            waRecord.setFieldValue('custrecord_custwarrantyenddate', truncWarrantyEndDate);
                                            try {
                                                var WarrantyID = nlapiSubmitRecord(waRecord);

                                                nlapiSubmitField('customrecord_serialnumbers', serialItem, 'custrecord_sn_lot_allocated', 'T');
                                                nlapiLogExecution('DEBUG', 'Submitted the  WarrantyID ', WarrantyID);
                                            }
                                            catch (waError) {
                                                nlapiLogExecution('ERROR', 'Error in Submission of wa', waError);
                                                errorcode=1;
                                            }
                                        }


                                    }
                                    else {
                                        nlapiLogExecution('ERROR', 'No Warranty items Found Matching', 'All Done');
                                    }
                                }
                                else
                                {
                                    nlapiLogExecution('ERROR', 'No Warranty items Found Matching', 'All Done');

                                }


                            }


                        }
                    }

                }
                if (orderType == 2) {
                    nlapiLogExecution('DEBUG', 'Changing Warranty Item on Warranty ', 'orderType is : ' + orderType);
                    var numLines = ifRecord.getLineItemCount('item');
                    for (var h = 1; h <= numLines; h++) {
                        var line = ifRecord.selectLineItem('item', h);
                        var existingWarrantySerialNumber = ifRecord.getCurrentLineItemValue('item', 'custcol_warrantryreplaceserialnumber');
                        if (isNotBlank(existingWarrantySerialNumber)) {
                            var columns = new Array();
                            columns[columns.length] = new nlobjSearchColumn('custrecord_warrantyrecord', null, null);

                            var filters = new Array();
                            filters[filters.length] = new nlobjSearchFilter('custrecord_warrantyserialnumber', null, 'anyof', existingWarrantySerialNumber);
                            filters[filters.length] = new nlobjSearchFilter('custrecord_itemactive', null, 'is', 'T');
                            var searchresults = nlapiSearchRecord('customrecord_warrantyitem', null, filters, columns);
                            if (searchresults != null) {
                                for (var i = 0; i < searchresults.length; i++) {
                                    var searchresult = searchresults[ i ];

                                    var custrecord_warrantyreplacementserialnumber = ifRecord.getCurrentLineItemValue('item', 'serialnumbers');
                                    var custrecord_lotitem = ifRecord.getCurrentLineItemValue('item', 'item');
                                    var warrantyItem = searchresult.getId();
                                    var warrantyrecord = searchresult.getValue('custrecord_warrantyrecord');
                                    try {
                                        //inactivate previous Item
                                        nlapiSubmitField('customrecord_warrantyitem', warrantyItem, 'custrecord_inactive', 'F');

                                        var newWarrantyItem = nlapiCreateRecord('customrecord_warrantyitem');
                                        newWarrantyItem.setFieldValue('custrecord_warrantyitem', custrecord_lotitem);
                                        newWarrantyItem.setFieldValue('custrecord_warranty_serial_item', custrecord_warrantyreplacementserialnumber);
                                        newWarrantyItem.setFieldValue('custrecord_warrantyrecord', warrantyrecord);
                                        newWarrantyItem.setFieldValue('custrecord_itemactive', 'T');
                                        var WarrantyItemID = nlapiSubmitRecord(newWarrantyItem);
                                        nlapiSubmitField('customrecord_serialnumbers', custrecord_warrantyreplacementserialnumber, 'custrecord_sn_lot_allocated', 'T');
                                    }
                                    catch (warrantyLineError) {
                                        nlapiLogExecution('ERROR', 'Error in Submission of newWarrantyRecord', warrantyLineError);
                                        errorcode=1;
                                    }
                                }

                            }
                        }
                        else {
                            nlapiLogExecution('AUDIT', 'No Existing Warranty Found')
                        }
                    }
                }

                remainingusage = context.getRemainingUsage();
                usage = (previousremainingusage - remainingusage);
                previousremainingusage = remainingusage;

                if (usage > maximumusage) {
                    maximumusage = usage;
                }
                if (context.getRemainingUsage() <= maximumusage && (t + 1) < isg_dunning_searchresults.length) {
                    nlapiLogExecution('AUDIT', 'Hit the limit.  got to ', t);
                    var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
                    if (status == 'QUEUED') {
                        break;
                    }


                }
                if(errorcode==0)
                {
                    ifRecord.setFieldValue('custbody_warranty_status', 2);
                    try {
                        var itemFulfilmentID = nlapiSubmitRecord(ifRecord);
                        nlapiLogExecution('DEBUG', 'SUBMITTED ITEM FULFILMENT : ' + itemFulfilmentID);
                    } catch (e) {
                        nlapiLogExecution('ERROR', 'SUBMITTING ITEM FULFILMENT FAILED : ' + itemFulfilment);
                    }
                }
                else
                {
                    nlapiLogExecution('ERROR', 'SUBMITTING ITEM FULFILMENT FAILED : ' + itemFulfilment);
                    ifRecord.setFieldValue('custbody_warranty_status', 3);
                    try {
                        var itemFulfilmentID = nlapiSubmitRecord(ifRecord);
                        nlapiLogExecution('DEBUG', 'SUBMITTED ITEM FULFILMENT : ' + itemFulfilmentID);
                    } catch (e) {
                        nlapiLogExecution('ERROR', 'SUBMITTING ITEM FULFILMENT FAILED : ' + itemFulfilment);
                    }
                }
            }
        }


        if (moreRequired == 1) {
            nlapiLogExecution('AUDIT', 'There were 1000 results.  Queued for reexecution to check', moreRequired);
            var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
            if (status == 'QUEUED')
                break;
        }
    }
    return true;

}

function createWarrantyPurchaseOrder() {
    var customer = nlapiGetFieldValue('entity');

    var warrantyPurchaseOrder = nlapiCreateRecord('purchaseorder', {recordmode:'dynamic'});

    warrantyPurchaseOrder.setFieldValue('location', 29);
    warrantyPurchaseOrder.setFieldValue('customform', 126);
    warrantyPurchaseOrder.setFieldValue('tobeemailed', 'F');

    var numLines = nlapiGetLineItemCount('item');
    for (var a = 1; a <= numLines; a++) {

        nlapiLogExecution('DEBUG', 'Going for the loop', 'c is : ' + a);
        var line = nlapiSelectLineItem('item', a);
        var item = nlapiGetCurrentLineItemValue('item', 'item');
        var warrantyRecord = nlapiGetCurrentLineItemValue('item', 'custcol_warranty');
        warrantyStatus = nlapiLookupField('customrecord_warrantydetails', warrantyRecord, 'custrecord_wrrantystatus');
        warrantyPurchaseOrder.selectNewLineItem('item');
        warrantyPurchaseOrder.setCurrentLineItemValue('item', 'item', item);
        if (warrantyStatus == 1) {
            warrantyPurchaseOrder.setCurrentLineItemValue('item', 'rate', 0);
        }
        warrantyPurchaseOrder.setCurrentLineItemValue('item', 'custcol_warranty', warrantyRecord);
        warrantyPurchaseOrder.commitLineItem('expense');
    }

    try {

        var WarrantyPO = nlapiSubmitRecord(warrantyPurchaseOrder);
        nlapiLogExecution('DEBUG', 'newWarrantyRecord WarrantyPO :', WarrantyPO);
    }
    catch (warrantyPOError) {
        nlapiLogExecution('ERROR', 'Error in Submission of newWarrantyPORecord', warrantyPOError);
    }
    //This section monitors the usage remaining and re-queues the script to run if there are still records to process.


    return true;
}


function fixDate(poDate) {


    var splitDate = poDate.split("/");

    var days = splitDate[0];
    var months = splitDate[1];
    var yearstime = splitDate[2];

    var years = yearstime.split(" ");


    if (days < 10) {
        days = '0' + days;
    }
    if (months < 10) {
        months = '0' + months;

    }

    var warrantyDate = months + '/' + days + '/' + years[0];

    return warrantyDate;
}


function truncDate(warrantyEndDate) {


    var dayOfMonth = warrantyEndDate.getUTCDate();
    var monthOfYear = warrantyEndDate.getUTCMonth();
    var Year = warrantyEndDate.getUTCFullYear();


    monthOfYear += 1;

    warrantyEndingDate = dayOfMonth + '/' + monthOfYear + '/' + Year;

    return warrantyEndingDate;
}
function isBlank(fld) {
    return (fld == null || fld == '');
}
function isNotBlank(fld) {
    return (fld != null && fld != '');
}