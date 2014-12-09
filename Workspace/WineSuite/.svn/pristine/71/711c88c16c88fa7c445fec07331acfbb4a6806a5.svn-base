function numberLinesInOrder()
{
				var numLines = nlapiGetLineItemCount('item');
				for (var c=1; c <= numLines; c++)
				{
				var line = nlapiSelectLineItem('item', c);				
				nlapiSetCurrentLineItemValue('item','custcol_line_ref', c);
				nlapiCommitLineItem('item');
				}
return true;
}
				

function reservationSetup(type)
{
	var logger = new Logger();
	logger.enableDebug();
		
	var salesOrderNumber = nlapiGetRecordId();
	var customer = 	nlapiGetFieldValue('entity');
	var numLines = nlapiGetLineItemCount('item');
	var updateReservations = nlapiGetFieldValue('custbody_fhlreservationstatus');
	var triggerReservationSuitelet = 'F';
	
	logger.debug('SO Number : ' 						+ salesOrderNumber);
	logger.debug('customer : ' 							+  customer);
	logger.debug('numLines : ' 							+ numLines);
	logger.debug('triggerReservationSuitelet : ' 	+ triggerReservationSuitelet);
	var numLines = nlapiGetLineItemCount('item');
	for (var c=1; c <= numLines; c++)
		{
		var line = nlapiSelectLineItem('item', c);	
		var custcol_lotreservcation = nlapiGetCurrentLineItemValue('item','custcol_lotreservcation');
		if ((isBlank(custcol_lotreservcation)) || (updateReservations == 2))
			{
			var triggerReservationSuitelet = 'T';
			logger.debug('triggerReservationSuitelet  Set To : ' 	+ triggerReservationSuitelet);
			}
		}
		
		
		
		if  (triggerReservationSuitelet ==  'T')
		{
	 	logger.debug('triggerReservationSuitelet  Set To T.  Initiating Suitelet Redirect ');
	 	createNewReservation(salesOrderNumber, customer, numLines)
		}
return true;

}

function createNewReservation(salesOrderNumber, customer, numLines)
{
		var updateType = 2;		
		var params = new Array();

   		params['customer'] = customer;
		params['transactionNumber'] = salesOrderNumber;
		params['updateType'] = updateType;
		params['numLines'] = numLines;
		
		
		var url_servlet = nlapiSetRedirectURL('SUITELET',38, 1, null, params);
		return true;
}





//Library Functions	
function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}
function Logger() 
{

    /** Determines whether to print DEBUG type messages or not */
    var bEnableDebug = false;
    
    /** Force client side alerts instead of server side logs */
    var bForceClientSide = false;

    this.enableDebug = function Logger_enableDebug()
    {
        bEnableDebug = true;
    }

		this.getError = function Logger_errors(ex)
		{
			
		}
		
    this.log = function Logger_log(stType, stTitle, stMessage)
    {
        if (isBlank(stType))
        {
            throw nlapiCreateError('ERROR', 'Logging Error', 'No Log Type Defined');
        }
        
        if (stType.trim() === 'DEBUG')
        {
           if (!bEnableDebug)
           {
               return;
           }
        }
        
        if (bForceClientSide)
        {
            alert(stType + ' : ' + stTitle + ' : ' + stMessage);
            return;
        }
        
        if (typeof nlapiLogExecution === 'undefined')
        {
            alert(stType + ' : ' + stTitle + ' : ' + stMessage);
        }
        else
        {
            nlapiLogExecution(stType, stTitle, stMessage);
        }                
    }	
	
	this.debug = function Logger_debug(stTitle, stMessage)
	{
		this.log('DEBUG', stTitle, stMessage);
	}
}

String.prototype.trim = function String_trim()
{
	if (this === null)
	{
	    return null;
	}
	
	return this.replace(/^\s*/, '').replace(/\s+$/, '');
}

function getObjectName(object)
{
    if (isNullOrUndefined(object))
    {
        return object;
    }
    
    return /(\w+)\(/.exec(object.constructor.toString())[1];
}