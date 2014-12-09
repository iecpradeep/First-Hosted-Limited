function writePLUFileR(){
/***************************************************
 * function writePLUFileU()
 * Purpose:  Create Arcadia PLU format R file, save
 * in file cabinet and attach a copy to an email
 * Reschedules if close to script credit limit
 * N.B. Does not check maximum of 5,000 items (Arcadia)
 * 
 * 1.0.0 version control started JM 13/2/2013 mod on site [todo] standards 
 * 1.0.1 modification made to email address JM 13/2/2013 
 ***************************************************/

// Scheduled script to run once a week
// identify all items that are currently for sale in Arcadia shops 
//  write out the correct prices (GBP and EUR if relevant) and barcodes, and email to a
//  specific box.com address
//
// initially 10,000 usage credits are available for a scheduled script



	
var context = nlapiGetContext();
nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());


// 1.0.1
var userEmail = 'upload.Daily_P.6hfq967tzm@u.box.com'; // user set up in Rare Fashion instance without login access 
//var userEmail = 'upload.Rare___.2k70xvolkf@u.box.com'; // user set up in Rare Fashion instance without login access 

var userId = 3001;  // internal ID of this user

var bcsv = '';


try {

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
    
    /*
     * function break
     */
    
    // does a temporary 'R' file already exist with today's date in its name?
    var rFileExists = false;
    var rFileName = 'R' + ymd + '.txt';
    var rFileFilters = new Array();
    rFileFilters[0] = new nlobjSearchFilter('custrecord_r_file_name', null, "is", rFileName, null);
    
    var rSearchResults = nlapiSearchRecord('customrecord_r_file', null, rFileFilters, null);
    if (rSearchResults != null) { // If so, load its contents into the variable 'bcsv' 
        rFileExists = true;
        var rFileId = rSearchResults[0].getId();
        var fullFileName = 'temp/' + rFileName;
        var rFile = nlapiLoadFile(fullFileName);
        bcsv = rFile.getValue();
    } //  end if (uSearchResults != null)
    nlapiLogExecution('DEBUG', 'does a R file for today already exist? ', rFileExists);
    
    //
    // Filters defines criteria used in search - in live system these are to include: 
    //   a) Item is sold through retail channel;
    //   b) Item has a Rare barcode (used for sales in Arcadia stores); and
    //   c) Item is not inactive
    //   d) Item details have not been written to the output file
    //  
    
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custitem_barcode_1', null, 'isnotempty', null);
    filters[1] = new nlobjSearchFilter('class', null, 'anyOf', 'Retail');
    filters[2] = new nlobjSearchFilter('pricelevel', 'pricing', 'is', '2'); // Internal ID of 'RRP' pricing level = 2
    filters[3] = new nlobjSearchFilter('custitem_written_to_r', null, 'is', 'F');  // has not yet been written to the file
    filters[4] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    
    
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
            nlapiLogExecution('DEBUG', 'No more search results returned');
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
                bcsv = bcsv + upd + ',0,' + brand + ',' + concession + ',';
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
                    // checkbox (indicating record has been written to R File) is set to 'T'
                    nlapiSubmitField('inventoryitem', internalId, 'custitem_written_to_r', 'T');
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
            bcsv = bcsv + upd + ',0,' + brand + ',' + concession + ',';
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
	uFileName = 'R' + ymd + '.txt'; 
    // check if any more results available
	searchResults = null;
    searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
    if ((searchResults != null) || (context.getRemainingUsage() <= scriptCreditMargin)) { // either more results to come or loop hit script credit margin before completing => only partial results 
        newAttachment = nlapiCreateFile(rFileName, 'PLAINTEXT', bcsv);
        // internal ID of folder '/temp/' in the RF file cabinet is 268.
        newAttachment.setFolder(268);
        fileInternalId = nlapiSubmitFile(newAttachment);
        
        if (rFileExists == true) { // if a file for today is already there, just update 
            nlapiSubmitField('customrecord_r_file', rFileId, 'custrecord_r_file_id', fileInternalId);
            nlapiSubmitField('customrecord_r_file', rFileId, 'custrecord_r_file_name', rFileName);
            nlapiLogExecution('DEBUG', 'R File record updated - name', rFileName);
        } // end if( rFileExists == true)
        if (rFileExists == false) { // if a file for today is not already there, create a new record to hold its details
            var newRecord = nlapiCreateRecord('customrecord_r_file');
            newRecord.setFieldValue('name', rFileName);
            newRecord.setFieldValue('custrecord_r_file_id', fileInternalId);
            newRecord.setFieldValue('custrecord_r_file_name', rFileName);
            var nRId = nlapiSubmitRecord(newRecord);
            nlapiLogExecution('DEBUG', 'R File record submitted', nRId);
        } // end if( rFileExists == false)
        // email partial results set in case anything goes wrong. 
        nlapiLogExecution('DEBUG', 'bscv', bcsv);
        var newEmail = nlapiSendEmail(userId, userEmail, 'Partial R-file for Arcadia (CSV)', 'NetSuite generated file attached', null, null, null, newAttachment);
        nlapiLogExecution('DEBUG', 'partial file - remaining usage', context.getRemainingUsage());
    } // end if ((searchResults != null) ...
    
    if ((searchResults == null) && (context.getRemainingUsage() > scriptCreditMargin)) { // loop completed without reaching script credit margin this time => no more results left to check
        if (bcsv.length > 0) {// loop completed and there are results in the 'bcsv' string variable
            // save data to file
			newAttachment = nlapiCreateFile(rFileName, 'PLAINTEXT', bcsv);
        	// internal ID of folder '/temp/' in the RF file cabinet is 268.
        	newAttachment.setFolder(268);
        	fileInternalId = nlapiSubmitFile(newAttachment);
            
			var fileExtension;
            
            // nlapiCreateFile(name, type, contents)
            // file name Rxxxx.nnn : 
            //    xxxx = Group ID for Rare,
            //    nnn = file number in sequence 001 to 999 (then reverts to 001)
            // current value in sequence to be kept in 'R file details' custom record and should only be read or written here
            // get previous sequence data from "latest record" and update it
            /*					
             R File Details: find a 'customrecord_r_file' with name = 'latest record'
             read in the value of the field 'custrecord_r_file_number'
             if it equals 'null' or 999 set it to 1
             if not, increment it
             write out the new value to the field 'custrecord_r_file_number'
             write out the latest value of the File Name to the field 'custrecord_r_file_name'
             */
           
            var latestFilters = new Array();
            var latestName = 'latest record'; // must already exist in NetSuite
            latestFilters[0] = new nlobjSearchFilter('name', null, 'is', latestName, null);
            
            var latestColumns = new Array();
            latestColumns[0] = new nlobjSearchColumn('name');
            latestColumns[1] = new nlobjSearchColumn('custrecord_r_file_name');
            latestColumns[2] = new nlobjSearchColumn('custrecord_r_file_number');
            
            var latestSearchResults = nlapiSearchRecord('customrecord_r_file', null, latestFilters, latestColumns);
            if (latestSearchResults != null) { //  found record used to hold previous file data (if such data exists)	
                var latestFileId = latestSearchResults[0].getId();
                var rSeqNumber = latestSearchResults[0].getValue(latestColumns[2]);
                if ((rSeqNumber == null) || (rSeqNumber == 999)) {  //  record of previous file does not exist OR previous file is last in sequence
                    rSeqNumber = 0;
                } // end if((rSeqNumber==null) ...
                var nextNumber = parseInt(rSeqNumber,10) + 1;
                
				// write out details of data file to 'latest record' custom record
				nlapiSubmitField('customrecord_r_file', latestFileId, 'custrecord_r_file_name', rFileName);
				nlapiSubmitField('customrecord_r_file', latestFileId, 'custrecord_r_file_number', nextNumber);
				nlapiSubmitField('customrecord_r_file', latestFileId, 'custrecord_r_file_id', fileInternalId);
				// 
				if (rFileExists == true) { // if a file for today is already there, just update
                	nlapiSubmitField('customrecord_r_file', rFileId, 'custrecord_r_file_name', rFileName);
					nlapiSubmitField('customrecord_r_file', rFileId, 'custrecord_r_file_number', nextNumber);
					nlapiSubmitField('customrecord_r_file', rFileId, 'custrecord_r_file_id', fileInternalId);
					nlapiLogExecution('DEBUG', 'R File record updated - name', rFileName);
				} // end if( rFileExists == true)
				if (rFileExists == false) { // if a file for today is not already there, create a new record to hold its details
					var newRecord = nlapiCreateRecord('customrecord_r_file');
					newRecord.setFieldValue('name', rFileName);
					newRecord.setFieldValue('custrecord_r_file_id', fileInternalId);
					newRecord.setFieldValue('custrecord_r_file_name', rFileName);
					newRecord.setFieldValue('custrecord_r_file_number', nextNumber);
					var nRId = nlapiSubmitRecord(newRecord);
					nlapiLogExecution('DEBUG', 'R File record submitted', nRId);
				} // end if( rFileExists == false)
                
				
                fileExtension = nextNumber.toString(10);
                var numLength = fileExtension.length;
                
                switch (numLength) {
                    case 1:
                        fileExtension = '00' + fileExtension;
                        break;
                    case 2:
                        fileExtension = '0' + fileExtension;
                        break;
                    default:
                        break;
                } // end switch
                nlapiLogExecution('DEBUG', 'file extension =' + fileExtension);
                
            } // end if (latestSearchResults != null)
            if (latestSearchResults == null) {
                nlapiLogExecution('DEBUG', 'Error / latest record / custom record containing file details does not exist');
            } //end if  (latestSearchResults == null)  
            fileName = 'R0435.' + fileExtension;
            //					fileName = 'R0435.001';
            newAttachment = nlapiCreateFile(fileName, 'PLAINTEXT', bcsv);
            
            //  nlapiLogExecution(type, title, details)     
            nlapiLogExecution('DEBUG', 'bscv', bcsv);
            
            //  Send results in CSV file attached to an email to a designated recipient:            
            // 	nlapiSendEmail(author, recipient, subject, body, cc, bcc, records, attachments)
            var newEmail = nlapiSendEmail(userId, userEmail, 'R-file for Arcadia (CSV)', 'NetSuite generated file attached', null, null, null, newAttachment);
            //  final version to be sent to box.com account, CC:'d to Rare Fashion administrator?
            
            // keep a copy of the file in the file cabinet, in case of problems
            // internal ID of folder '/temp/' in the RF file cabinet is 268.
            rFileName = 'R' + ymd + '.txt';
            newAttachment = nlapiCreateFile(rFileName, 'PLAINTEXT', bcsv);
            newAttachment.setFolder(268);
            fileInternalId = nlapiSubmitFile(newAttachment);
            
            nlapiLogExecution('DEBUG', 'email sent - remaining usage', context.getRemainingUsage());
            nlapiLogExecution('DEBUG', 'email', newEmail);
        } //end if (bcsv.length > 0)
        if (bcsv.length == 0) { // loop completed and there aren't any results in the 'bcsv' string variable => nothing added or updated today
            nlapiLogExecution('DEBUG', 'No matching records.  R file not created.  Script exiting ', context.getRemainingUsage());
            var messageBody = 'R-file: search returned no records either modified or created in the last 24 hours. R file not created.';
            var messageTitle = 'Arcadia R file (CSV) not created today (' + ymd + ').';
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
    var newEmail = nlapiSendEmail(userId, userEmail, 'Error with Arcadia R file (CSV)', messageBody, null, null, null, null);
} //end catch
} // end function writePLUFileR()


function untickPLUFileR()
{
// reset checkbox 'written to Arcadia R file' on item records
// scheduled to run 6 hours after writePLUFileR() script 
var context = nlapiGetContext();
nlapiLogExecution('DEBUG', 'remaining usage - start', context.getRemainingUsage());

var filters = new Array();
filters[0] = new nlobjSearchFilter('custitem_barcode_1', null, 'isnotempty', null);
filters[1] = new nlobjSearchFilter('custitem_written_to_r', null, 'is', 'T');

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
        nlapiSubmitField('inventoryitem', internalId, 'custitem_written_to_r', 'F');
        //				nlapiLogExecution('DEBUG', 'resetting written to R flag for item ID='+internalId);
    }// end for
} // end if
nlapiLogExecution('DEBUG', 'remaining usage - end', context.getRemainingUsage());

if (rescheduled == false) { // check if any more search results available, if so reschedule to run again  
    searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
    if (searchResults != null) {
        status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
    }
}
} // end function untickPLUFileR()
