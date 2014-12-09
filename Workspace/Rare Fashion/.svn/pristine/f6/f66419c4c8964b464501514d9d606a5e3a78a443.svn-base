// source http://www.merlyn.demon.co.uk/js-maths.htm 
function nMod(X, Y) { return X - Math.floor(X/Y)*Y ;}

function nDiv(X, Y) { return Math.floor(X/Y); /* full range */ }

function jsDate_To_nsDate(jsdate)// used for dateConv
{	  	
	    var theDay = jsdate.getDate();
	    var theMonth = jsdate.getMonth()+1;
	    var theYear = jsdate.getFullYear();
		var nsdate = theDay+"/"+theMonth+"/"+theYear;
		return nsdate;
}

function nsDate_To_jsDate(nsdate)// used for dateConv
{
	  	var dateStr = nsdate.split("/");  
	    var theDay = dateStr[0];
	    var theMonth = dateStr[1] - 1;
	    var theYear = dateStr[2];
		var jsdate= new Date(theYear ,theMonth ,theDay);
		return jsdate;
}

function dateConv(date,mode)//mode 0 = NetSuite to JS | mode 1 = JS to NetSuite
{
	if (mode == 0)
		return nsDate_To_jsDate(date);
	
	if (mode == 1)
		return jsDate_To_nsDate(date);
}



function findBinName(branchId, itemId)
{
//	nlapiLogExecution('DEBUG', 'find bin name - branchId ', branchId);  //
//	nlapiLogExecution('DEBUG', 'find bin name - itemId ', itemId);  //
	var latestFilters = new Array();
	latestFilters[0] = new nlobjSearchFilter('internalid', null, 'is', itemId, null);  
	latestFilters[1] = new nlobjSearchFilter('location', 'binnumber', 'is', branchId); 
            
	var latestColumns = new Array();
	latestColumns[0] = new nlobjSearchColumn('name');
	latestColumns[1] = new nlobjSearchColumn('binnumber', 'binnumber');
            
	var latestSearchResults = nlapiSearchRecord('item', null, latestFilters, latestColumns);
	if (latestSearchResults != null)
	{ 
		var binName = latestSearchResults[0].getValue(latestColumns[1]);
	}  // end if (latestSearchResults != null)

	return binName;
} // end function findBinName


function getBinId(binName)
{
	var binId = -999;  // error condition by default
	var nextFilters = new Array();
	nextFilters[0] = new nlobjSearchFilter('binnumber', null, 'is', binName, null);
	var nextColumns = new Array();
	nextColumns[0] = new nlobjSearchColumn('binnumber');

	var nextSearchResults = nlapiSearchRecord('bin', null, nextFilters, nextColumns);
	if (nextSearchResults != null)
	{
		binId = nextSearchResults[0].getId();  // the internal ID of the bin
	}  // end if (nextSearchResults != null)
	
	return binId;
} // end function getBinId


function getBinName(binId)
{
	var nextFilters = new Array();
	nextFilters[0] = new nlobjSearchFilter('internalid', null, 'is', binId);
	var nextColumns = new Array();
	nextColumns[0] = new nlobjSearchColumn('binnumber');

	var nextSearchResults = nlapiSearchRecord('bin', null, nextFilters, nextColumns);
	if (nextSearchResults != null)
	{
		var binName = nextSearchResults[0].getValue(nextColumns[0]);
	}  // end if (nextSearchResults != null)
	
	return binName;
} // end function getBinName


function binItemTotal(binName, itemId)
{
// advanced inventory: to obtain the total stock of a specific item held in a given bin

	var filters = new Array();
	var columns = new Array();

	filters[0] = new nlobjSearchFilter('internalid', null, 'is', itemId); 
	filters[1] = new nlobjSearchFilter('binnumber', null, 'is', binName);

	columns[0] = new nlobjSearchColumn('name');
	columns[1] = new nlobjSearchColumn('binonhandcount');

    var binItemTotal = 0;  // .setSummaryType('sum') only applies to nlobjSearchFilter 
	var searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
	if (searchResults != null)
	{
		binItemTotal = parseInt(searchResults[0].getValue(columns[1]),10);
	}  // end if (searchResults != null)
	
	return binItemTotal;
} // end function binItemTotal



function getMBRFile()
{
/***************************************************
* function 
* Purpose: Access an Arcadia daily sales file in plain text format from a specific location,
* extract its contents into custom records and call a follow-up script to convert contents 
* of those custom records into NetSuite transactions.
*    
***************************************************/

        try{
        	 var context = nlapiGetContext();
             nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage()); 
// initially 10,000 credits available
        	
            var today = new Date();
            var nsDate = dateConv(today,1);
            var d = today.getDate();
            var dd;
            var m = today.getMonth()+1;
            var mm;
            var yyyy = today.getFullYear();

            if (d.toString().length == 1)
               {
                 dd = "0" + d;
               }
            else
               {
                 dd = d;
               }

            if (m.toString().length == 1)
               {
                 mm = "0" + m;
               }
            else
               {
                 mm = m;
               }

            var a = new Array(yyyy.toString(),mm,dd);
            var ymd = a.join('');
            
// does a file import custom record already exist with today's date in its name?
            var loopStart = 0;
            var crExists = false;
            var crID;
            var crFilters = new Array();
            crFilters[0] = new nlobjSearchFilter('custrecord_file_date', null, "on", nsDate, null);
 
            var crSearchResults = nlapiSearchRecord('customrecord_file_import', null, crFilters, null);
            if (crSearchResults != null) { // If so identify the last file line that has been written to a record  
                crExists = true;
                crID = crSearchResults[0].getId();
                loopStart = nlapiLookupField('customrecord_file_import', crID, 'custrecord_current_line');
            } //  end if (uSearchResults != null)
            nlapiLogExecution('DEBUG', 'does a file import custom record for today already exist? ', crExists);
            
            
// Original file location - need either a fixed filename and location or a predictable filename and fixed (and accessible) location              
//        	direct (static) link to actual MBR file on 848's box.com account            
			var externalUrl = 'https://848.box.com/shared/static/5fifjvnaeeoofle1xfj1.txt';
        	var fName='5fifjvnaeeoofle1xfj1.txt';
// >>>>>>>>>>>>>>>>>>>        	
            var response = nlapiRequestURL(externalUrl, null, null);
// the text file is returned as the body of the response to the HTTP GET request            
            var errMsg = response.getError();
            nlapiLogExecution('DEBUG', 'errMsg', errMsg);
            var code = response.getCode();
            nlapiLogExecution('DEBUG', 'code', code);

            var output = response.getBody();
//			nlapiLogExecution('DEBUG', 'output string is '+output);
            var olen = output.length;
//            nlapiLogExecution('DEBUG', 'output string length (chars) is '+olen);
            
            var nLines = nDiv(olen,92);
            var nRemain = nMod(olen,92);

// each line is of identical length, hence the file length should be an integer multiple of this number (plus one for the EoF marker)            
//            nlapiLogExecution('DEBUG', 'number of 92 char lines is ',nLines);
//            nlapiLogExecution('DEBUG', 'plus a remainder of ',nRemain);
            
            var internalId;
            var parentName;
            var last;
            
            if(!crExists)
            {
// create the parent record for the import - child records for all lines in the file link back to this parent record
            	var newFIRecord = nlapiCreateRecord('customrecord_file_import');
                nlapiLogExecution('DEBUG', 'record created');
            
                parentName = 'MBR-import-'+ymd;
                newFIRecord.setFieldValue('name', parentName);
                nlapiLogExecution('DEBUG', 'parent record name', parentName);
                newFIRecord.setFieldValue('custrecord_file_name', fName);
                nlapiLogExecution('DEBUG', 'file name', fName);
                newFIRecord.setFieldValue('custrecord_file_date', nsDate);
                nlapiLogExecution('DEBUG', 'today is', nsDate);
                newFIRecord.setFieldValue('custrecord_number_of_lines', nLines);
                nlapiLogExecution('DEBUG', 'number of lines ', nLines);
                newFIRecord.setFieldValue('custrecord_current_line', 0);
                nlapiLogExecution('DEBUG', 'current line ', 0);
                newFIRecord.setFieldValue('custrecord_import_complete', 'F');
                nlapiLogExecution('DEBUG', 'import complete ', 'F');

                internalId = nlapiSubmitRecord(newFIRecord);
                nlapiLogExecution('DEBUG', 'record submitted', internalId);
                last = 0;
// parent record created
            }  // end if(!crExists)
             
            if(crExists)
            {
            	loopStart = nlapiLookupField('customrecord_file_import', crID, 'custrecord_current_line');
                parentName = nlapiLookupField('customrecord_file_import', crID, 'name');
                fName = nlapiLookupField('customrecord_file_import', crID, 'custrecord_file_name');
                internalId = crID;
                nlapiLogExecution('DEBUG', 'record used:', internalId);
                last = loopStart*92;
            } // end if(crExists)
            
            var fileLine = new Array();
            var i = 0;
            var first;
            var outString;
            var iPlusOne;
            var iPlusOneTS;
            var recordType;
            var childName;
            var concessionNumber;
            var branchNumber;
            var recDate;
            var transDate;
            var productText;
            var productNumber;
            var branchNet;
            var pricePence;
            var timeHHMM;
            var tillNumber;
            var transNumber;
            var operatorNumber;
            var quantity;
            var discount1Reason;
            var discount1Value;
            var discount2Reason;
            var discount2Value;
            var discount3Reason;
            var discount3Value;
            var returnIndicator;
            var paymentMethod;
			
            var scriptCreditMargin = 121; // 9850
            for (i = loopStart;i <= (nLines-1); i++)
            {
            	 if (context.getRemainingUsage() <= scriptCreditMargin) 
            	 { // reschedule current script if low on credits
                     var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
                     if (status == 'QUEUED') 
                         break; // breaks out of for-loop
                 } // end if ( context.getRemainingUsage() <= scriptCreditMargin )

// extract the data from the MBR file, line by line, into the array fileLine[]
            	first = last; 
            	last = first+92;
                fileLine[i] = output.slice(first,last);
                outString = first.toString()+' - '+last.toString();
                nlapiLogExecution('DEBUG', 'first-last ', outString);
                nlapiLogExecution('DEBUG', 'output ', fileLine[i]);

// limit number of file line records created during initial testing - e.g. if(i<3) {...}           
                if(i>=0)  
            		{
// copy the data from fileLine[i] into a string and extract slices into custom fields on the file line record                	
                		outString = fileLine[i];
// order and length of substrings based on information from Arcadia 
                  		var recLen = 2;
    					first = 0;
    					recordType = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 4;
                    	concessionNumber = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 4;
                    	branchNumber = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 8;
                    	recDate = outString.slice(first,first+recLen);      //  CCYYMMDD format

                    	jsDate = new Date(recDate.slice(0,4), recDate.slice(4,6)-1,recDate.slice(6,8),06,00,0);

                    	transDate = jsDate_To_nsDate(jsDate);
// transDate = transmission date (recordType = 01 only); transDate = transaction date (all other recordType values)                  		

                    	first = first + recLen;
    					recLen = 13;
    					productNumber = -1;
    					productText = outString.slice(first,first+recLen);
    					if((recordType==1) || (recordType==3))
    					{   // UAN13 barcode if recordType = 03
    						productNumber = productText;
    					}  //end if
      					if((recordType==4) || (recordType==99))    					
    					{   // productNumber contains branch net for recordType = 04  and sum of all branch nets for recordType = 99
      						// N.B. It could contain non-numeric characters
    						branchNet = productText;
    					}  //end if


    					first = first + recLen;
    					recLen = 7;
                    	pricePence = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 4;
                    	timeHHMM = outString.slice(first,first+recLen);
                    	
    					first = first + recLen;
    					recLen = 3;				
                    	tillNumber = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 6;				
                    	transNumber = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 7;				
                    	operatorNumber = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 2;				
                    	quantity = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 2;				
                    	discount1Reason = parseInt(outString.slice(first,first+recLen),10);

    					first = first + recLen;
    					recLen = 7;				
                    	discount1Value = parseInt(outString.slice(first,first+recLen),10);
                    	
    					first = first + recLen;
    					recLen = 2;				
                    	discount2Reason = parseInt(outString.slice(first,first+recLen),10);
                    	
                    	first = first + recLen;
    					recLen = 7;				
                    	discount2Value = parseInt(outString.slice(first,first+recLen),10);
                    	
                    	first = first + recLen;
    					recLen = 2;				
                    	discount3Reason = parseInt(outString.slice(first,first+recLen),10);
                    	
                    	first = first + recLen;
    					recLen = 7;				
                    	discount3Value = parseInt(outString.slice(first,first+recLen),10);
                    	
                    	first = first + recLen;
    					recLen = 1;				
                    	returnIndicator = parseInt(outString.slice(first,first+recLen),10);
                    	
    					first = first + recLen;
    					recLen = 2;				
                    	paymentMethod = parseInt(outString.slice(first,first+recLen),10);                		

                		
// extract data from each line into custom fields, ready to create NetSuite transactions in a second script           
                		newRecord = null;
                		newRecord = nlapiCreateRecord('customrecord_file_line');
                		iPlusOne = parseInt(i,10)+1;
                		iPlusOneTS = iPlusOne.toString(); 
                		childName = parentName+' line '+iPlusOneTS;
                		newRecord.setFieldValue('name', childName);
                		newRecord.setFieldValue('custrecord_parent_file_import', internalId);
                		newRecord.setFieldValue('custrecord_file_line_data', fileLine[i]);
                		newRecord.setFieldValue('custrecord_file_line_number', iPlusOne);           
                		newRecord.setFieldValue('custrecord_record_type', recordType);
                		newRecord.setFieldValue('custrecord_concession_number', concessionNumber);
                		newRecord.setFieldValue('custrecord_branch_number', branchNumber);
                		newRecord.setFieldValue('custrecord_trans_date', transDate);
                		newRecord.setFieldValue('custrecord_product_number', productNumber);
                		newRecord.setFieldValue('custrecord_price_pence', pricePence);
                		newRecord.setFieldValue('custrecord_time_hhmm', timeHHMM);
                		newRecord.setFieldValue('custrecord_till_number', tillNumber);
                		newRecord.setFieldValue('custrecord_transaction_number', transNumber);
                		newRecord.setFieldValue('custrecord_operator_number', operatorNumber);
                		newRecord.setFieldValue('custrecord_quantity', quantity);
                		newRecord.setFieldValue('custrecord_discount_1_reason', discount1Reason);
                		newRecord.setFieldValue('custrecord_discount_1_value', discount1Value);
                		newRecord.setFieldValue('custrecord_discount_2_reason', discount2Reason);
                		newRecord.setFieldValue('custrecord_discount_2_value', discount2Value);
                		newRecord.setFieldValue('custrecord_discount_3_reason', discount3Reason);
                		newRecord.setFieldValue('custrecord_discount_3_value', discount3Value);
                		newRecord.setFieldValue('custrecord_return_indicator', returnIndicator);
                		newRecord.setFieldValue('custrecord_payment_method', paymentMethod);
    					if((recordType==4) ||  (recordType==99))
    					{
    						newRecord.setFieldValue('custrecord_branch_net', branchNet);
    					}

                		id = nlapiSubmitRecord(newRecord);
                		nlapiLogExecution('DEBUG', 'FL record submitted', id);

              		
// nlapiSubmitField(type, id, fields, values,doSourcing) 
// N.B. doSourcing = true or false (default), not 'T' or 'F'
                        nlapiSubmitField('customrecord_file_import', internalId, 'custrecord_current_line', i+1);
                		
// debugging text to check that fields are being mapped correctly, currently limited to printout data for just the second line in the file:           
                		if(i==1)
                			{
                				nlapiLogExecution('DEBUG', 'test line');
                				nlapiLogExecution('DEBUG', 'output ', fileLine[i]);            
                				nlapiLogExecution('DEBUG', 'recordType ', recordType);    
                				nlapiLogExecution('DEBUG', 'concessionNumber ', concessionNumber);            
                				nlapiLogExecution('DEBUG', 'branchNumber ', branchNumber);
                				nlapiLogExecution('DEBUG', 'transDate ', transDate);
                				nlapiLogExecution('DEBUG', 'productNumber ', productNumber);            
                				nlapiLogExecution('DEBUG', 'pricePence ', pricePence);
                				nlapiLogExecution('DEBUG', 'timeHHMM ', timeHHMM);
                				nlapiLogExecution('DEBUG', 'tillNumber ', tillNumber);
                				nlapiLogExecution('DEBUG', 'transNumber ', transNumber);
                				nlapiLogExecution('DEBUG', 'operatorNumber ', operatorNumber);
                				nlapiLogExecution('DEBUG', 'quantity ', quantity);
                				nlapiLogExecution('DEBUG', 'discount1Reason ', discount1Reason);
                				nlapiLogExecution('DEBUG', 'discount1Value ', discount1Value);
                				nlapiLogExecution('DEBUG', 'discount2Reason ', discount2Reason);
                				nlapiLogExecution('DEBUG', 'discount2Value ', discount2Value);
                				nlapiLogExecution('DEBUG', 'discount3Reason ', discount3Reason);
                				nlapiLogExecution('DEBUG', 'discount3Value ', discount3Value);
                				nlapiLogExecution('DEBUG', 'returnIndicator ', returnIndicator);
                				nlapiLogExecution('DEBUG', 'paymentMethod ', paymentMethod);
            					if((recordType==4) ||  (recordType==99))
            					{
            						nlapiLogExecution('DEBUG', 'branchNet', branchNet);
            					}  //end if
                			}  // end if
            		} // end if                 
            }       // end for        

            if (context.getRemainingUsage() > scriptCreditMargin){
            	nlapiSubmitField('customrecord_file_import', internalId, 'custrecord_import_complete', 'T');
            	nlapiLogExecution('DEBUG', 'import complete ', 'T');
            }
           
            if (nRemain ==1)
            	{
            		var EoF = output.slice(last,last+1);
            		nlapiLogExecution('DEBUG', 'last char ', EoF.charCodeAt());
            	} // end if
            
            nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());            

        }   // end try
        catch(e) 
        {
              nlapiLogExecution('ERROR', 'code crash', e.message);
              nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());
        }
        
} // end function getMBRFile



function userEventFileLine(type)
{
	var context = nlapiGetContext();
	nlapiLogExecution('DEBUG', 'UE remaining usage', context.getRemainingUsage()); 
	// initially 10,000 credits available
	var refundNominal = context.getSetting('SCRIPT', 'custscript_refund_nominal_id');
	var euVatCode = context.getSetting('SCRIPT', 'custscript_eu_vat_code');
	var ukVatCode = context.getSetting('SCRIPT', 'custscript_uk_vat_code');
	var euVatPercent = context.getSetting('SCRIPT', 'custscript_eu_vat_rate_percent');
	var ukVatPercent = context.getSetting('SCRIPT', 'custscript_uk_vat_rate_percent');
	var errorRecipient = context.getSetting('SCRIPT', 'custscript_error_message_recipient');

  //  Only execute the logic if a file line custom record is created
  if(type == 'create')
  {
    //Obtain a handle to the newly created custom record: customrecord_file_line
    var custRec = nlapiGetNewRecord();
    var custRecId = nlapiGetRecordId();
		
    if(custRec.getFieldValue('custrecord_record_type') == 3) 
    {  // recordType = 03 => sale or return transaction
	    var thisDay = custRec.getFieldValue('custrecord_trans_date');
	    var branchNumber = custRec.getFieldValue('custrecord_branch_number');
	    nlapiLogExecution('DEBUG', 'crgfv branchNumber', 'value = ' + branchNumber);
	    var barCode = custRec.getFieldValue('custrecord_product_number');
	    var pricePence = custRec.getFieldValue('custrecord_price_pence');
	    var timeHHMM = custRec.getFieldValue('custrecord_time_hhmm');
	    var tillNumber = custRec.getFieldValue('custrecord_till_number');
	    var transNumber = custRec.getFieldValue('custrecord_transaction_number');
	    var operatorNumber = custRec.getFieldValue('custrecord_operator_number');
	    var quantity = custRec.getFieldValue('custrecord_quantity');
	    var grossAmt = parseFloat(String(pricePence))/100.0;
		var memo = 'Operator: '+operatorNumber+'; \n Till number: '+tillNumber+'; \n';
		memo +='Transaction number: '+transNumber+'; \n Time: '+timeHHMM+'; \n';
		var netAmt;
        var taxRate;
        nlapiLogExecution('DEBUG', 'barCode', 'value = ' + barCode);

		var dumpItem = false;
// does branch exist in NetSuite ? [START]
        var branchExists = false;
        var branchCustomer = false;
// Define search filters
        var branchFilters = new Array();
        branchFilters[0] = new nlobjSearchFilter ('custrecord_store_code', null, 'equalTo', branchNumber); // 'equalTo' ?
// Define search columns
        var branchColumns = new Array();
        branchColumns[0] = new nlobjSearchColumn('custrecord_arcadia_store_region');
           
        var branchSearchResults = nlapiSearchRecord('location', null, branchFilters, branchColumns);
        if(branchSearchResults != null)
        {
           	branchExists = true;
           	if(branchSearchResults.length ==1)
           		{
           		uniqueBranch = true;
           		}  // end if(branchSearchResults.length ==1)
           	// Get the value of the internal ID of the first customer with that branch number 
           	var branchId = branchSearchResults[0].getId();
           	var branchRegion = branchSearchResults[0].getValue(branchColumns[0]); // UK or EU
        }  //  end if(branchSearchResults != null) 
        if(branchSearchResults == null)
        {
		    memo += 'Branch '+branchNumber+' is not a valid location in NetSuite. \n';
			memo += 'Using dump branch instead. \n';
           	// use defaults for region (VAT) if not recognised
           	branchId = 5; // TS dump branch in Rare Fashion NetSuite instance: internal ID = 5
           	branchRegion = 1; // UK by default
        }  // end if(branchSearchResults == null)
		nlapiLogExecution('DEBUG', 'branchExists? '+ branchExists);
        nlapiLogExecution('DEBUG', 'branchId', 'internal ID = ' + branchId);
        nlapiLogExecution('DEBUG', 'branch region', 'value = ' + branchRegion);

// does branch exist in NetSuite ? [END]        
           
        if(branchExists==true)
        	{
// does item exist in NetSuite ? [START]        
// Define search filters
        var itemFilters = new Array();
		itemFilters[0] = new nlobjSearchFilter('custitem_barcode_1', null, 'is', barCode);
		itemFilters[1] = new nlobjSearchFilter('class', null, 'anyOf', 'Retail');
		itemFilters[2] = new nlobjSearchFilter('pricelevel', 'pricing', 'is', '2');  // Internal ID of 'RRP' pricing level = 2
		
// Define search columns
        var itemColumns = new Array();
		itemColumns[0] = new nlobjSearchColumn('custitem_barcode_1');
     // item price in whatever currencies it is priced in
        itemColumns[1] = new nlobjSearchColumn('unitprice', 'pricing');  // sale price inc VAT
        itemColumns[2] = new nlobjSearchColumn('currency', 'pricing');   // GBP or EUR only currently
     // matrix item full name for debugging purposes 
        itemColumns[3] = new nlobjSearchColumn('name');

// Execute the search
// nlapiSearchRecord(type, id, filters, columns)
        var itemSearchResults = nlapiSearchRecord('inventoryitem', null, itemFilters, itemColumns);
 
        var itemExists = false;
        var uniqueItem = false;

        if(itemSearchResults != null) 
    	{
			itemExists = true;
			if(itemSearchResults.length ==1)
    		{
				uniqueItem = true;
    		}  // end if(itemSearchResults.length ==1)
			// Get the value of the internal ID of the first item with that barcode 
			var itemId = itemSearchResults[0].getId();
			nlapiLogExecution('DEBUG', 'itemId', 'internal ID = ' + itemId);
			var priceDelta = parseFloat(itemSearchResults[0].getValue(itemColumns[1]))-parseFloat(grossAmt);
			if(priceDelta >= 0.5){ 
				nlapiLogExecution('DEBUG', 'price difference = ' +priceDelta );
				memo += 'Price discrepancy: '+priceDelta+';\n';
			}
    	}  // end if(itemSearchResults != null) 

        if(itemSearchResults == null)
        	{
        	nlapiLogExecution('DEBUG', 'not an inventory item ');
        	memo += 'There is no inventory item with this barcode '+barCode+' in NetSuite. \n';
            var nitemFilters =new Array();
            var nitemColumns =new Array();
        	nitemFilters[0] = new nlobjSearchFilter ('custitem_barcode_1', null, 'is', barCode); // 'equalTo' ?
            nitemColumns[0] = new nlobjSearchColumn('custitem_barcode_1');			
//        	itemSearchResults = nlapiSearchRecord('noninventoryitem', null, nitemFilters, nitemColumns);
        	var nitemSearchResults = nlapiSearchRecord('item', null, nitemFilters, nitemColumns);
        	if(nitemSearchResults == null)
        		{
        		nlapiLogExecution('DEBUG', 'not a non-inventory item either');	
				memo += 'There is no non-inventory item with this barcode '+barCode+' in NetSuite either. \n';
        		// use TS dump item => set itemId to a fixed value or search for name
				dumpItem = true;
        		itemId = 1688; // internal ID of non-inventory item 'TS Dump Item' for sale in Rare Fashion
        		}  // end if(nitemSearchResults == null)
        	} // end if(itemSearchResults == null)
// does item exist in NetSuite ? [END]        


// does customer exist in NetSuite ? [START]
        // Define search filters
			var customerFilters = new Array();
			customerFilters[0] = new nlobjSearchFilter ('custentity_arcadia_store_id', null, 'equalTo', branchNumber); // 'equalTo' ?
        // Define search columns
			var customerColumns = new Array();
			customerColumns[0] = new nlobjSearchColumn('custentity_customer_region'); // UK or EU only at present
           
			var customerSearchResults = nlapiSearchRecord('customer', null, customerFilters, customerColumns);
			var customerExists = false;
			var uniqueCustomer = false;
			if(customerSearchResults != null) 
				{
				customerExists = true;
				if(customerSearchResults.length ==1)
					{
					uniqueCustomer = true;
					}  //  end if(customerSearchResults.length ==1)
           	// Get the value of the internal ID of the first customer with that branch number 
				var customerId = customerSearchResults[0].getId();
				var customerRegion = customerSearchResults[0].getValue(customerColumns[0]); // UK or EU
				nlapiLogExecution('DEBUG', 'customerId', 'internal ID = ' + customerId);
				nlapiLogExecution('DEBUG', 'customer region', 'value = ' + customerRegion);
           	}  // end if(customerSearchResults != null) 
			if(customerSearchResults == null) 
          	{
				memo += 'There is no virtual customer associated with branch '+branchNumber+' in NetSuite. \n';
        	   // use default TS dump customer
				customerId = 3005;  //  internal ID of 'Arcadia Virtual Customer TS999' - dump customer
        	   // use default TS dump location
				customerRegion = 1;				
          	}  //  end if(customerSearchResults == null)
// does customer exist in NetSuite ? [END]        
        }  //  end if(branchExists == true)
 
 
// Cash Sale Transaction [START]
		var accountId;
        if(custRec.getFieldValue('custrecord_return_indicator') == 1) 
			{ // sale
    	    //Create a new blank instance of a Cash Sale
    	    var sCashSale = nlapiCreateRecord("cashsale");
    	    sCashSale.setFieldValue('trandate', thisDay);
    	    // customer - 
    	    if(branchExists == false) 
				{
				// use default TS dump customer
				customerId = 3005;  //  internal ID of 'Arcadia Virtual Customer TS999' - dump customer

				sCashSale.setFieldValue('entity', customerId);  // Internal ID of one existing customer
          	// use default TS dump location
          	  // branch ID now output of search above
				customerRegion = 1;       	   
				sCashSale.setFieldValue('location', branchId); //
          	// use default TSDump non-inventory item
				dumpItem = true;
				itemId = 1688;  //  internal ID of non-inventory item 'TS Dump Item' for sale in Rare Fashion

				}  //  end if(branchExists == false)

    	    if(branchExists == true) 
				{
				sCashSale.setFieldValue('entity', customerId);  // Internal ID of one existing customer
				sCashSale.setFieldValue('location', branchId); //
				}  //  end if(branchExists == true)

//  not mandatory for cash sale - will default to 'undeposited funds' if not included
//    	      accountId = cashsaleNominal; 
//    	      sCashSale.setFieldValue('account', accountId);  

			  /* Rare Fashion
			  // RF accountId could be 131 = '4100 Topshop sales'; RF 'undeposited funds' has no RF code assigned, internal ID = 117
			  //          RF UI does not allow account '4100 Topshop sales' - only bank accounts or default 'undeposited funds' 
			  accountId = 117; // 'undeposited funds' account in Rare Fashion
			  */ // Rare Fashion

			if (branchRegion==1)
				{  // UK
    	    	sCashSale.setFieldValue('currency', '1');  // GBP in this case  
				}
    	    else if (branchRegion==2)
				{  // EU
    	    	sCashSale.setFieldValue('currency', '4');  // EUR in this case  
				}

// Add gathered 'memo' data to memo field specific to cash sale
    	    var sCSmemo = memo+'Transaction data in custom record File Line: '+custRecId+'.\n'; 

			sCashSale.selectNewLineItem('item');
			sCashSale.setCurrentLineItemValue('item','quantity', quantity);

			if(!dumpItem){
				var binName = findBinName(branchId, itemId);
				var binId = getBinId(binName);		  
//       		var binName = getBinName(binId);
				nlapiLogExecution('DEBUG', 'branchId, itemId, binName, binId '+branchId+' '+itemId+' '+binName+' '+binId);   
				if(binItemTotal(binName, itemId) >= quantity)
					{   // sufficient stock available in bin to fulfil order
					nlapiLogExecution('DEBUG', 'stock available in bin to fulfil order ', 'sufficient  = ' +true);
					sCashSale.setCurrentLineItemValue('item','item', itemId);
					nlapiLogExecution('DEBUG', 'item item set');   	
					sCashSale.setCurrentLineItemValue('item','binnumbers', binName);
					nlapiLogExecution('DEBUG', 'item binnumbers set');
					sCSmemo +='Sold stock from bin '+binName+' at branch '+branchId+'. \n';
					} // end if(binItemTotal(binId, itemId) >= quantity)	
				if(binItemTotal(binName, itemId) < quantity)
					{  // insufficient stock available in bin to fulfil order
					nlapiLogExecution('DEBUG', 'stock available in bin to fulfil order ', 'sufficient  = ' +false);
					itemId = 1688; // internal ID of non-inventory item 'TS Dump Item' for sale in Rare Fashion
					sCashSale.setCurrentLineItemValue('item','item', itemId);
					// need to set memo field to something meaningful
					sCSmemo +='Insufficient stock available in bin '+binName+' to fulfil order. \n';
					sCSmemo +='TS Dump non-inventory item used in sale transaction instead. \n';
					}  // end if(binItemTotal(binId, itemId) < quantity)
				} // end if(!dumpItem)

			if(dumpItem)
				{  // branch doesn't exist
				nlapiLogExecution('DEBUG', 'dumpItem');
				itemId = 1688; // internal ID of non-inventory item 'TS Dump Item' for sale in Rare Fashion
				sCashSale.setCurrentLineItemValue('item','item', itemId);
				// already set memo field to something meaningful
				}  // end if(dumpItem)
		
// >>>			  
    	    if (branchRegion==1)
				{  // UK
				sCashSale.setCurrentLineItemValue('item','taxcode', parseInt(ukVatCode)); // VAT code internal ID
//				sCashSale.setCurrentLineItemValue('item','taxcode', 6); // standard VAT - VAT:S-GB - rate in Rare Fashion (20%)
				taxRate = ukVatPercent;
				}
    	    else if (branchRegion==2)
				{  // EU
    	    	sCashSale.setCurrentLineItemValue('item','taxcode', parseInt(euVatCode)); // VAT code internal ID
//				sCashSale.setCurrentLineItemValue('item','taxcode', 5); // undefined VAT  - VAT:UNDEF - rate in Rare Fashion (0%)
				taxRate = euVatPercent;
				} 
			  
			// depends on taxRate being set
			netAmt = parseFloat(String(pricePence))/(100.0+parseFloat(taxRate));  // calculate Net amount
			sCashSale.setCurrentLineItemValue('item', 'amount', netAmt); // override total Net amount 
        	sCashSale.setCurrentLineItemValue('item', 'taxrate1', taxRate); // override default tax rate 
        	// 'Rate' shown on transaction is may now be inconsistent with this information
    	    sCashSale.commitLineItem('item');   
   				
			sCashSale.setFieldValue('memo', sCSmemo);  
			  
    	    try
				{ //committing the cash sale record to the NetSuite database
    	        var callId = nlapiSubmitRecord(sCashSale, true);
    	        nlapiLogExecution('DEBUG', 'cash sale record created successfully', 'ID = ' + callId);
				}  // end try
    	    catch(e)
				{
    	        nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
				nlapiLogExecution('ERROR', 'code crash', e.message);
				var errorLine = custRec.getFieldValue('custrecord_file_line_data');
				var errorLineNumber = custRec.getFieldValue('custrecord_file_line_number');
				var messageBody = 'Script failed on creating sale transaction from file line: '+custRecId+'.';
				messageBody = messageBody + ' NetSuite error code: ' + e.getCode()+'.';
				messageBody = messageBody + ' Error message from NetSuite user event script: ' + e.message+'.';
				messageBody = messageBody + ' Error details: ' + e.getDetails()+'.';
				messageBody = messageBody + ' MBR file line number: ' + errorLineNumber+'.';
				messageBody = messageBody + ' MBR file line contents: '+errorLine+'.';
				messageBody = messageBody + ' Remaining script usage credits available at this point ' + context.getRemainingUsage()+'.';
				var newEmail = nlapiSendEmail(errorRecipient, errorRecipient, 'User Event Script - Error Creating Cash Sale', messageBody, null, null, null, null);
				}  //end catch    	      
    	} // end if(custRec.getFieldValue('custrecord_return_indicator') == 1)
 // Cash Sale Transaction [END]
 
 
 // Cash Refund Transaction [START]
    	if(custRec.getFieldValue('custrecord_return_indicator') == 2) 
    	{ // return 
    	      //Create a new blank instance of a Cash Sale Refund
    	      var sCashRefund = nlapiCreateRecord("cashrefund");
    	      accountId = refundNominal; // unlike cash sale, account internal ID is required here
			  /* Rare Fashion
			  // UI does not allow accountId =131 - '4100 Topshop sales' - only bank accounts or default 'undeposited funds' 
			  accountId = 117; // 'undeposited funds' account in Rare Fashion - N.B. Has no nominal code assigned.
			  */ // Rare Fashion
    	      sCashRefund.setFieldValue('account', accountId);
    	      sCashRefund.setFieldValue('trandate', thisDay);
    	      
    	      if(branchExists == false)
				{
        	    // use default TS dump customer
        	    customerId = 3005;  //  internal ID of 'Arcadia Virtual Customer TS999' - dump customer
        	    sCashRefund.setFieldValue('entity', customerId);  // Internal ID of one existing customer
        	    // use default TS dump location
        	    // branchId already identified from search way above
        	    customerRegion = 1;       	   
        	    sCashRefund.setFieldValue('location', branchId); //
             	// use default TSDump non-inventory item
				dumpItem = true;
          	    itemId = 1688; // internal ID of non-inventory item 'TS Dump Item' for sale in Rare Fashion
				}  //  end if(branchExists == false)

    	      if(branchExists == true)
    	      {
    	    	  sCashRefund.setFieldValue('entity', customerId);  // Internal ID of one existing customer
    	    	  sCashRefund.setFieldValue('location', branchId); //
        	  }  //  end if(branchExists == false)

    	      
       	      if (branchRegion==1)
    	      { // UK
    	    	  sCashRefund.setFieldValue('currency', '1');  // GBP in this case  
    	      } //EU
    	      else if (branchRegion==2)
    	      {
    	    	  sCashRefund.setFieldValue('currency', '4');  // EUR in this case  
    	      }
    	      
    	      var sCRmemo = memo+'Transaction data in custom record File Line: '+custRecId+'.\n';
    	      sCashRefund.setFieldValue('memo', sCRmemo);  
    	      
    	      sCashRefund.selectNewLineItem('item');
    	      sCashRefund.setCurrentLineItemValue('item','quantity', quantity);

			if(!dumpItem){
				var binName = findBinName(branchId, itemId);
				var binId = getBinId(binName);		  
//       var binName = getBinName(binId);
				nlapiLogExecution('DEBUG', 'branchId, itemId, binName, binId '+branchId+' '+itemId+' '+binName+' '+binId);
				sCashRefund.setCurrentLineItemValue('item','item', itemId);
				nlapiLogExecution('DEBUG', 'item item set');   	
				sCashRefund.setCurrentLineItemValue('item','binnumbers', binName);
				nlapiLogExecution('DEBUG', 'item binnumbers set');		
			}
				
			if(dumpItem){
				sCashRefund.setCurrentLineItemValue('item','item', itemId);
			}
// >>>			  
    	      if (branchRegion==1)
    	      { // UK
    	    	  sCashRefund.setCurrentLineItemValue('item','taxcode', parseInt(ukVatCode)); // VAT code internal ID
//				  sCashRefund.setCurrentLineItemValue('item','taxcode', 6); // standard VAT - VAT:S-GB - rate in Rare Fashion (20%)
				  taxRate = ukVatPercent;
    	      }
    	      else if (branchRegion==2)
    	      { // EU
    	    	  sCashRefund.setCurrentLineItemValue('item','taxcode', parseInt(euVatCode)); // VAT code internal ID
//				  sCashRefund.setCurrentLineItemValue('item','taxcode', 5); // undefined VAT  - VAT:UNDEF - rate in Rare Fashion (0%)
				  taxRate = euVatPercent;
    	      } 

  			  // depends on taxRate being set
			  netAmt = parseFloat(String(pricePence))/(100.0+parseFloat(taxRate));  // calculate Net amount
    	      sCashRefund.setCurrentLineItemValue('item', 'amount', netAmt); // override total Net amount 
			  sCashRefund.setCurrentLineItemValue('item', 'taxrate1', taxRate); // override default tax rate 
        	// 'Rate' shown on transaction may now be inconsistent with this information
			  sCashRefund.commitLineItem('item');   

    	      try
    	      { //committing the cash sale refund record to the NetSuite database
    	        var callId = nlapiSubmitRecord(sCashRefund, true);
    	        nlapiLogExecution('DEBUG', 'cash sale refund record created successfully', 'ID = ' + callId);
    	      }  // end try
    	      catch(e)
    	      {
    	        nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
				nlapiLogExecution('ERROR', 'code crash', e.message);
				var errorLine = custRec.getFieldValue('custrecord_file_line_data');
				var errorLineNumber = custRec.getFieldValue('custrecord_file_line_number');
				var messageBody = 'Script failed on creating refund transaction from file line: '+custRecId+'.';
				messageBody = messageBody + ' NetSuite error code: ' + e.getCode()+'.';
				messageBody = messageBody + ' Error message from NetSuite user event script: ' + e.message+'.';
				messageBody = messageBody + ' Error details: ' + e.getDetails()+'.';
				messageBody = messageBody + ' MBR file line number: ' + errorLineNumber+'.';
				messageBody = messageBody + ' MBR file line contents: '+errorLine+'.';
				messageBody = messageBody + ' Remaining script usage credits available at this point ' + context.getRemainingUsage()+'.';
				var newEmail = nlapiSendEmail(errorRecipient, errorRecipient, 'User Event Script - Error Creating Refund', messageBody, null, null, null, null);
    	      }  //end catch

    	} // end if(custRec.getFieldValue('custrecord_return_indicator') == 2) 
    // Cash Refund Transaction [END]
	
    } // end if(custRec.getFieldValue('custrecord_record_type') == 3)
    
    } // end if(type == 'create')
  nlapiLogExecution('DEBUG', 'UE remaining usage', context.getRemainingUsage());
} // end function UserEventFileLine 
