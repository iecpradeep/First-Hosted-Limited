/******************************************************************************************************
 * function writePLUFileU()
 *
 * Purpose:  Create Arcadia PLU format U file, save in file cabinet and attach a copy to an email
 *			 Reschedules if close to script credit limit
 * 
 *
 *
 * 1.0.0 version control started JM 13/2/2013 mod on site [todo] standards 
 * 1.0.1 modification made to email address JM 13/2/2013
 * 
 *  
 *  notes:
 *  
 *  	Scheduled script to run once a day
 * 		identify all items 
 *			a) that are added for sale in Arcadia shops (created)
 *       		b) (that were available for sale in Arcadia shops but aren't any longer)
 *     		c) that are currently for sale in Arcadia shops and whose prices have changed 
 *         		in the last 24 hours 
 *     			write out the correct prices (GBP and EUR if relevant) and barcodes, and email to a
 *    			specific box.com address
 *   
 *   			**initially 10,000 usage credits are available for a scheduled script
 *
 *  
 ******************************************************************************************************/

function writePLUFileU()
{
   
    
    var context = nlapiGetContext();
    nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());
    
    // 1.0.1 
    var userEmail = 'upload.Daily_P.6hfq967tzm@u.box.com'; // user set up in Rare Fashion instance without login access 
    //var userEmail = 'upload.Rare___.2k70xvolkf@u.box.com'; // user set up in Rare Fashion instance without login access 

    var userId = 3001; // internal ID of this employee
    var bcsv = '';
    
    
    try {
    
        // example for checking single digit month and day
        
        var today = new Date();
        var d = today.getDate();
        var m = today.getMonth() + 1;
        var dd;
        var mm;
        var yyyy = today.getFullYear();
        
        if (d.toString().length == 1) {
            dd = "0" + d;
        }
        else {
            dd = d;
        }
        
        if (m.toString().length == 1) {
            mm = "0" + m;
        }
        else {
            mm = m;
        }
        
        var a = new Array(yyyy.toString(), mm, dd);
        var ymd = a.join('');
        
        // does a temporary 'U' file already exist with today's date in its name?
        var uFileExists = false;
        var uFileName = 'U' + ymd + '.txt';
        var uFileFilters = new Array();
        uFileFilters[0] = new nlobjSearchFilter('custrecord_u_file_name', null, "is", uFileName, null);
        
        var uSearchResults = nlapiSearchRecord('customrecord_u_file', null, uFileFilters, null);
        if (uSearchResults != null) { // If so, load its contents into the variable 'bcsv' 
            uFileExists = true;
            var uFileId = uSearchResults[0].getId();
            var fullFileName = 'temp/' + uFileName;
            var uFile = nlapiLoadFile(fullFileName);
            bcsv = uFile.getValue();
        } //  end if (uSearchResults != null)
        nlapiLogExecution('DEBUG', 'does a U file for today already exist? ', uFileExists);
        
        //
        // Filters defines criteria used in search - in live system these are to include: 
        //   a) Item is sold through retail channel;
        //   b) Item has a Rare barcode (used for sales in Arcadia stores); and
        //   c) Item details have changed (or new item has been created) in the previous 24 hours.
        // N.B. item delete will be a problem to detect (=> make item inactive instead?)
        //  
        //  filters[0]: appropriate price level for upload, currently using 'Base Price' which is price level '1' 
        //  filters[1]: class (Sales Channel) = Retail
        //  filters[2]: barcode is present  
        //      for meanings of undocumented additional parameters for Logical-OR see: usergroup.netsuite.com/users/showthread.php?t=26978
        //  filters[3,4]: either (date created) logical-OR (price changed date) is within the previous one day
        //
        
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('pricelevel', 'pricing', 'is', '2');  // Internal ID of 'RRP' pricing level = 2
        filters[1] = new nlobjSearchFilter('class', null, 'anyOf', 'Retail');
        filters[2] = new nlobjSearchFilter('custitem_barcode_1', null, 'isnotempty', null);
        filters[3] = new nlobjSearchFilter('created', null, 'within', 'previousoneday', null, 1, 0, true, false); // 
        filters[4] = new nlobjSearchFilter('custitem_price_last_changed_date', null, 'within', 'previousoneday', null, 0, 1, false, false); // 
        filters[5] = new nlobjSearchFilter('custitem_written_to_u', null, 'is', 'F');  // has not yet been written to the file
		filters[6] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        
        
        // Columns define information returned in the search results
        // columns[0]: EAN13 format barcode
		// columns[1]: matrix item full name (for debugging purposes only)
        // columns[2]: item price in whatever currencies it is priced in
        // columns[3]: currency item is priced in
        // columns[4]: internal ID of item - to enable updating custom field
        // N.B. One result returned per currency (i.e. the same item is returned twice if two currencies are in use). 
        
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('custitem_barcode_1');
        columns[1] = new nlobjSearchColumn('name');
		columns[2] = new nlobjSearchColumn('unitprice', 'pricing');
        columns[3] = new nlobjSearchColumn('currency', 'pricing');
        columns[4] = new nlobjSearchColumn('internalid');
        
        
        // create lines for CSV output 			
        var upd = '12'; // Arcadia code representing: insert, amend, or replace 
        var brand = '60'; // Topshop 
        var concession = '0054'; // concession no. for Rare Fashion
        var internalId;
        var prevInternalId;
        var idWritten = false;
        var scriptCreditMargin = 121; // safety margin to allow for completion of clean-up and preparation for rescheduling  
        // nlapiSearchRecord(type, id, filters, columns)
        // Maximum of 1,000 records returned each search.  Need to check if repeating the search returns more records.
        // potentially 35,000 matrix items x 2 currencies = 70,000 search results.  N.B. 5MB limit on email attachments.
        
		var i=-999;
        var searchResults = null;
        do {
            searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
            if (searchResults == null) 
                nlapiLogExecution('DEBUG', 'No more search results returned or no records modified in last 24 hours?');
            if (searchResults != null) {
                nlapiLogExecution('DEBUG', 'number of records in search results ', searchResults.length);
                prevInternalId = 0;
                for (i = 0; i < searchResults.length; i++) {
                    if ((context.getRemainingUsage() <= scriptCreditMargin) && ((i + 1) < searchResults.length)) { // reschedule current script if low on credits
                        var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
                        if (status == 'QUEUED') 
                            break; // breaks out of for-loop
                    } // end if ( (context.getRemainingUsage() <= scriptCreditMargin) && ((i+1) < searchResults.length ) )
                    // write out the Rare barcode for Arcadia 
                    bcsv = bcsv + upd + ',' + ymd + ',' + brand + ',' + concession + ',';
                    bcsv = bcsv + searchResults[i].getValue(columns[0]) + ',';
                    bcsv = bcsv + parseInt((searchResults[i].getValue(columns[2]) * 100+0.5), 10) + ',';
                    
                    if (searchResults[i].getValue(columns[3]) == "1") { // GBP
                        bcsv = bcsv + '0 \n';
                    } // end if
                    else 
                        if (searchResults[i].getValue(columns[3]) == "4") { // EUR
                            bcsv = bcsv + 'IEP0 \n';
                        } // end else if
                    internalId = searchResults[i].getValue(columns[4]);
                    
                    idWritten = false;
                    // useful in reducing script credit usage as records with the same internalID are returned consecutively
                    if (internalId != prevInternalId) {
                        // checkbox (indicating record has been written to U File) is set to 'T'
                        nlapiSubmitField('inventoryitem', internalId, 'custitem_written_to_u', 'T');
                        idWritten = true;
                    } // end if (internalId != prevInternalId)
                    prevInternalId = internalId;
                } // end for
                nlapiLogExecution('DEBUG', 'end for - remaining usage', context.getRemainingUsage());
            } //end if (searchResults != null) 
        }
        while ((searchResults != null) && (context.getRemainingUsage() > scriptCreditMargin))
        
        
        if (searchResults != null) {
            if ((i < searchResults.length) && (idWritten = true)) { // only first currency is guaranteed to be written to file. Duplicates are OK, missing values are not
                bcsv = bcsv + upd + ',' + ymd + ',' + brand + ',' + concession + ',';
                bcsv = bcsv + searchResults[i].getValue(columns[0]) + ',';
				bcsv = bcsv + parseInt((searchResults[i].getValue(columns[2]) * 100+0.5), 10) + ',';
                
                if (searchResults[i].getValue(columns[3]) == "1") { // GBP
                    bcsv = bcsv + '0 \n';
                } // end if
                else 
                    if (searchResults[i].getValue(columns[3]) == "4") { // EUR
                        bcsv = bcsv + 'IEP0 \n';
                    } //
            } // end if ((i < searchResults.length) && (idWritten = true))
        } // end if (searchResults != null)
        
		
		var newAttachment;
		var fileInternalId;
		uFileName = 'U' + ymd + '.txt'; 
        // check if any more results available
		searchResults = null;
        searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
        if ((searchResults != null) || (context.getRemainingUsage() <= scriptCreditMargin)) { // either more results to come or loop hit script credit margin before completing => only partial results 
            newAttachment = nlapiCreateFile(uFileName, 'PLAINTEXT', bcsv);
            // internal ID of folder '/temp/' in the RF file cabinet = 268.
            newAttachment.setFolder(268);
            fileInternalId = nlapiSubmitFile(newAttachment);
            
            if (uFileExists == true) { // if a file for today is already there, just update 
                nlapiSubmitField('customrecord_u_file', uFileId, 'custrecord_u_file_id', fileInternalId);
                nlapiSubmitField('customrecord_u_file', uFileId, 'custrecord_u_file_name', uFileName);
                nlapiLogExecution('DEBUG', 'U File record updated - name', uFileName);
            } // end if( uFileExists == true)
            if (uFileExists == false) { // if a file for today is not already there, create a new record to hold its details
                var newRecord = nlapiCreateRecord('customrecord_u_file');
                newRecord.setFieldValue('name', uFileName);
                newRecord.setFieldValue('custrecord_u_file_id', fileInternalId);
                newRecord.setFieldValue('custrecord_u_file_name', uFileName);
                var nRId = nlapiSubmitRecord(newRecord);
                nlapiLogExecution('DEBUG', 'U File record submitted', nRId);
            } // end if( uFileExists == false)
            // email partial results set in case anything goes wrong. 
            nlapiLogExecution('DEBUG', 'bscv', bcsv);
            var newEmail = nlapiSendEmail(userId, userEmail, 'Partial U-file for Arcadia (CSV)', 'NetSuite generated file attached', null, null, null, newAttachment);
            nlapiLogExecution('DEBUG', 'partial file - remaining usage', context.getRemainingUsage());
        } // end if ((searchResults != null) ...
        
        if ((searchResults == null) && (context.getRemainingUsage() > scriptCreditMargin)) { // loop completed without reaching script credit margin this time => no more results left to check
            if (bcsv.length > 0) {// loop completed and there are results in the 'bcsv' string variable
                // save data to file
				newAttachment = nlapiCreateFile(uFileName, 'PLAINTEXT', bcsv);
            	// internal ID of folder '/temp/' in the RF file cabinet is 268.
            	newAttachment.setFolder(268);
            	fileInternalId = nlapiSubmitFile(newAttachment);
                
				var fileExtension;
                
                // nlapiCreateFile(name, type, contents)
                // file name Uxxxx.nnn : 
                //    xxxx = Group ID for Rare,
                //    nnn = file number in sequence 001 to 999 (then reverts to 001)
                // current value in sequence to be kept in 'U file details' custom record and should only be read or written here
                // get previous sequence data from "latest record" and update it
                /*					
                 U File Details: find a 'customrecord_u_file' with name = 'latest record'
                 read in the value of the field 'custrecord_u_file_number'
                 if it equals 'null' or 999 set it to 1
                 if not, increment it
                 write out the new value to the field 'custrecord_u_file_number'
                 write out the latest value of the File Name to the field 'custrecord_u_file_name'
                 */
               
                var latestFilters = new Array();
                var latestName = 'latest record'; // must already exist in NetSuite
                latestFilters[0] = new nlobjSearchFilter('name', null, 'is', latestName, null);
                
                var latestColumns = new Array();
                latestColumns[0] = new nlobjSearchColumn('name');
                latestColumns[1] = new nlobjSearchColumn('custrecord_u_file_name');
                latestColumns[2] = new nlobjSearchColumn('custrecord_u_file_number');
                
                var latestSearchResults = nlapiSearchRecord('customrecord_u_file', null, latestFilters, latestColumns);
                if (latestSearchResults != null) { //  found record used to hold previous file data (if such data exists)	
                    var latestFileId = latestSearchResults[0].getId();
                    var uSeqNumber = latestSearchResults[0].getValue(latestColumns[2]);
                    if ((uSeqNumber == null) || (uSeqNumber == 999)) {  //  record of previous file does not exist OR previous file is last in sequence
                        uSeqNumber = 0;
                    } // end if((uSeqNumber==null) ...
                    var nextNumber = parseInt(uSeqNumber,10) + 1;
                    
					// write out details of data file to 'latest record' custom record
					nlapiSubmitField('customrecord_u_file', latestFileId, 'custrecord_u_file_name', uFileName);
					nlapiSubmitField('customrecord_u_file', latestFileId, 'custrecord_u_file_number', nextNumber);
					nlapiSubmitField('customrecord_u_file', latestFileId, 'custrecord_u_file_id', fileInternalId);
					// 
					if (uFileExists == true) { // if a file for today is already there, just update
                    	nlapiSubmitField('customrecord_u_file', uFileId, 'custrecord_u_file_name', uFileName);
						nlapiSubmitField('customrecord_u_file', uFileId, 'custrecord_u_file_number', nextNumber);
						nlapiSubmitField('customrecord_u_file', uFileId, 'custrecord_u_file_id', fileInternalId);
						nlapiLogExecution('DEBUG', 'U File record updated - name', uFileName);
					} // end if( uFileExists == true)
					if (uFileExists == false) { // if a file for today is not already there, create a new record to hold its details
						var newRecord = nlapiCreateRecord('customrecord_u_file');
						newRecord.setFieldValue('name', uFileName);
						newRecord.setFieldValue('custrecord_u_file_id', fileInternalId);
						newRecord.setFieldValue('custrecord_u_file_name', uFileName);
						newRecord.setFieldValue('custrecord_u_file_number', nextNumber);
						var nRId = nlapiSubmitRecord(newRecord);
						nlapiLogExecution('DEBUG', 'U File record submitted', nRId);
					} // end if( uFileExists == false)
                    
					
                    fileExtension = nextNumber.toString(10);
                    var numLength = fileExtension.length;
                    
                    switch (numLength) {
                        case 0:
                            
                            break;
                        case 1:
                            fileExtension = '00' + fileExtension;
                            ;                            break;
                        case 2:
                            fileExtension = '0' + fileExtension;
                            break;
                        case 3:
                            break;
                        default:
                    } // end switch
                    nlapiLogExecution('DEBUG', 'file extension =' + fileExtension);
                    
                } // end if (latestSearchResults != null)
                if (latestSearchResults == null) {
                    nlapiLogExecution('DEBUG', 'Error / latest record / custom record containing file details does not exist');
                } //end if  (latestSearchResults == null)  
                fileName = 'U0435.' + fileExtension;
                //					fileName = 'U0435.001';
                newAttachment = nlapiCreateFile(fileName, 'PLAINTEXT', bcsv);
                
                //  nlapiLogExecution(type, title, details)     
                nlapiLogExecution('DEBUG', 'bscv', bcsv);
                
                //  Send results in CSV file attached to an email to a designated recipient:            
                // 	nlapiSendEmail(author, recipient, subject, body, cc, bcc, records, attachments)
                var newEmail = nlapiSendEmail(userId, userEmail, 'U-file for Arcadia (CSV)', 'NetSuite generated file attached', null, null, null, newAttachment);
                //  final version to be sent to box.com account, CC:'d to Rare Fashion administrator ?
                
                // keep a copy of the file in the file cabinet, in case of problems
                // internal ID of folder '/temp/' in the RF file cabinet is 268.
                uFileName = 'U' + ymd + '.txt';
                newAttachment = nlapiCreateFile(uFileName, 'PLAINTEXT', bcsv);
                newAttachment.setFolder(268);
                fileInternalId = nlapiSubmitFile(newAttachment);
                
                nlapiLogExecution('DEBUG', 'email sent - remaining usage', context.getRemainingUsage());
                nlapiLogExecution('DEBUG', 'email', newEmail);
            } //end if (bcsv.length > 0)
            if (bcsv.length == 0) { // loop completed and there aren't any results in the 'bcsv' string variable => nothing added or updated today
                nlapiLogExecution('DEBUG', 'No matching records.  U file not created.  Script exiting ', context.getRemainingUsage());
                var messageBody = 'U-file: search returned no records either modified or created in the last 24 hours. U file not created.';
                var messageTitle = 'Arcadia U file (CSV) not created today (' + ymd + ').';
                var newEmail = nlapiSendEmail(userId, userEmail, messageTitle, messageBody, null, null, null, null);
            } // end if (bcsv.length == 0)
        } //end if ((searchResults == null) && (context.getRemainingUsage() > scriptCreditMargin))
        return true;
    } //end try
       
catch (e) {
        nlapiLogExecution('ERROR', 'code crash', e.message);
        nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());
        
        var messageBody = 'Script Failed. Error message from NetSuite script: ' + e.message;
        messageBody = messageBody + ' Content processed, but not yet saved: ' + bcsv;
        messageBody = messageBody + ' Remaining script usage credits available at this point ' + context.getRemainingUsage();
        var newEmail = nlapiSendEmail(userId, userEmail, 'Error with Arcadia U file (CSV)', messageBody, null, null, null, null);
    } //end catch
} // end function writePLUFileU()


function untickPLUFileU(){ // reset checkbox 'written to Arcadia U file' on item records 
    var context = nlapiGetContext();
    nlapiLogExecution('DEBUG', 'remaining usage - start', context.getRemainingUsage());
    
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custitem_barcode_1', null, 'isnotempty', null);
    filters[1] = new nlobjSearchFilter('custitem_written_to_u', null, 'is', 'T');
    
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custitem_barcode_1');
    columns[1] = new nlobjSearchColumn('internalid');
    columns[2] = new nlobjSearchColumn('name');
    
    var status;
    var searchResults;
    var internalId;
    var scriptCreditMargin = 50;
    var rescheduled = false;
    
    searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
    if (searchResults == null) 
        nlapiLogExecution('DEBUG', 'no search results returned (no records modified in last 24 hours?)');
    if (searchResults != null) {
        nlapiLogExecution('DEBUG', 'number of items returned by search=' + searchResults.length);
        for (var i = 0; i < searchResults.length; i++) {
            if ((context.getRemainingUsage() <= scriptCreditMargin) && ((i + 1) < searchResults.length)) { // reschedule current script if low on credits
                status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
                rescheduled = true;
                if (status == 'QUEUED') 
                    break; // breaks out of for-loop
            } // end if
            internalId = searchResults[i].getValue(columns[1]);
            nlapiSubmitField('inventoryitem', internalId, 'custitem_written_to_u', 'F');
            //				nlapiLogExecution('DEBUG', 'resetting written to U flag for item ID='+internalId);
        }// end for
    } // end if
    nlapiLogExecution('DEBUG', 'remaining usage - end', context.getRemainingUsage());
    
    if (rescheduled == false) { // check if any more search results available, if so reschedule to run again  
        searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
        if (searchResults != null) {
            status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
        }
    }
} // end function untickPLUFileU()



function onFieldChange(type, name){
    if (((type == 'price1') && (name == 'price')) || ((type == 'price4') && (name == 'price'))) { // price1 = GBP, price4 = EUR
        // use custom date_price_modified field to note the last time a price (either in GBP or EUR) was changed        
        nlapiSetFieldValue('custitem_price_last_changed_date', nlapiDateToString(new Date(), 'datetimetz'), false);
        // N.B. The date is not changed unless the record is saved. 
        // Does not work for mass update of prices
    }
    return true;
}


function myAfterSubmitUE(type){

    if ((type == 'create') || (type == 'edit') || (type == 'xedit')) {
        nlapiLogExecution('DEBUG', 'type argument', 'type is edit');
        var itemRecord = nlapiGetNewRecord();
        var itemId = nlapiGetRecordId();
        if ((itemRecord.getLineItemMatrixValue('price1', 'price', 1, 1) != null) || (itemRecord.getLineItemMatrixValue('price4', 'price', 1, 1) != null)) {
            nlapiLogExecution('DEBUG', 'after Submit - price has changed: internal id = ' + itemId);
            itemRecord.setFieldValue('custitem_price_last_changed_date', nlapiDateToString(new Date(), 'datetimetz')); // in local server time
        }
        else {
            nlapiLogExecution('DEBUG', 'after Submit - price has NOT changed');
        }
	// do not use mass update for prices
    }
    
}
