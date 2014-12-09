/***************************************************************************
 * 
 * Name:			Inline Edit non-Inline Editable Fields
 * Script Type:		User Event (called by Inline Editing on Field Change)
 * Client:			Cineflix Rights Limited
 *
 * Version:			1.0.0 - 19th July 2012 - First revision - PL
 * 					1.1.0 - 20th July 2012 - Second revision - AM/PL
 *
 * Author:			FHL
 * 
 * Purpose:			When Custom Status field is changed whilst in XEDIT mode, 
 * 					update the standard non-inline editable fields.
 * 
 ***************************************************************************/

var inDebug = true;
var currentStatus = '';
var fakeStatus = '';
var currentDate = '';
var fakeDate = '';
var fakeQuarter = '';
var expectedCloseQuarter = '';
var recID = 0;
var recType = '';	
var estimateRecord = null;


/************************************************
 * After Submit Function to be called. Passes the parameter "type"
 * @param {Object} type
 ************************************************/
function estimateAfterSubmit(type)
{
	recID = nlapiGetRecordId();
	recType = nlapiGetRecordType();	

	try
	{
		if (inDebug) 
		{
			nlapiLogExecution('debug', 'Called Estimate AfterSubmit', 'Type: ' + type + ', rectype: ' + recType + ', Record ID : ' + recID);
		}

		//xedit is inline editing
		if (type == 'xedit') 
		{
			estimateRecord = nlapiLoadRecord(recType, recID);
			currentStatus = estimateRecord.getFieldValue('entitystatus');
			fakeStatus = estimateRecord.getFieldValue('custbody_estimatestatus');
			fakeDate = estimateRecord.getFieldValue('custbody_inline_edit_date');	
			currentDate = estimateRecord.getFieldValue('enddate');
			
			//Fake Status is the extra Body Field created which is a list of Entity Statuses to give the ability to inline edit.
				

			if(fakeStatus == currentStatus)
			{
				if (inDebug) 
				{
					nlapiLogExecution('debug', 'Called XEDIT', 'fakeStatus == currentStatus');
				}
			}
			else
			{
				if(String(fakeStatus).length == 0 || fakeStatus == null)			
				{
					if (inDebug) 
					{
						nlapiLogExecution('debug', 'Called XEDIT', 'fakeStatus length == 0 or null');
					}
				}
				else
				{
					if (inDebug) 
					{
						nlapiLogExecution('debug', 'Called XEDIT', 'fakeStatus length is different :) fakeStatus: ' + fakeStatus + ', currentStatus: ' + currentStatus);
					}

					currentStatus = parseInt(currentStatus);
					if(currentStatus == 13 || currentStatus == 7)				
					{
						//cannot allow them to change an Actual or Forecast status so just trip it to continue to the date processing code

					}
					else
					{
						estimateRecord.setFieldValue('entitystatus', fakeStatus);
					}
				}
			}

			if (inDebug) 
			{
				nlapiLogExecution('debug', 'Called XEDIT, past the Status Changing logic.', 'Type: ' + type);
			}
			
			//insert date changing logic here, and dont forget to put the Expected Close Quarter info here too
			//has date been changed?
			//if changed, put value in expected close date
			//calculate the expected close quarter
			//expectedCloseQuarter = expectedClose
			//put value in expected close quarter

			//Fake Status is the extra Body Field created which is a list of Entity Statuses to give the ability to inline edit.

			if(fakeDate == currentDate)
			{
				if (inDebug) 
				{
					nlapiLogExecution('debug', 'Called XEDIT', 'fakeDate == currentDate');
				}
			}
			else
			{
				nlapiLogExecution('DEBUG','Fakedate not Currentdate','in loop.');
				if(String(fakeDate).length == 0 || fakeDate == null)			
				{
					if (inDebug) 
					{
						nlapiLogExecution('debug', 'Called XEDIT', 'fakeDate length == 0 or null');
					}
				}
				else
				{
					if (inDebug) 
					{
						nlapiLogExecution('debug', 'Called XEDIT', 'fakeDate length is different :) fakeDate: ' + fakeDate 
								+ ', currentDate: ' + currentDate);
					}

					fakeQuarter = getQuarter(fakeDate);
					estimateRecord.setFieldValue('enddate', fakeDate);
					estimateRecord.setFieldValue('custbody_expected_close_quarter', fakeQuarter);

				}
			}

			nlapiLogExecution('DEBUG','Estimate After Submit Estimate: ','Record Submitting now.');
			nlapiSubmitRecord(estimateRecord);	


		}
		else
		{
			if (inDebug) 
			{
				//nlapiLogExecution('debug', 'Not xedit', 'Type: ' + type);
			}
		}


	}
	catch(e)
	{
		nlapiLogExecution('ERROR','Estimate After Submit generated error: ','Error Message: ' + e.message);
	}


	return true;
}


//This is the logic for the Quarters information...
function getQuarter(CloseDate)
{
	try
	{
		var dateStr = CloseDate.split("/");
		//var xDate = new Date(CloseDate);
		var theValue = '';
		var theYear = dateStr[2];


		switch(parseInt(dateStr[1]))
		{
		// Quarter 2 Jan Feb Mar
		case 1:	
		case 2:
		case 3: 
			theValue = 'Q2 ' + theYear;
			break;

			// Quarter 3 Apr May Jun
		case 4:
		case 5:
		case 6:
			theValue = 'Q3 ' + theYear;
			break;

			// Quarter 4 for Jul Aug Sep
		case 7:
		case 8:
		case 9: 
			theValue = 'Q4 ' + theYear;
			break;

			//Q1 Oct Nov Dec
		case 10:
		case 11:
		case 12:
			theValue = 'Q1 ' + (parseInt(theYear) + 1).toString();
			break;
		}


		return theValue;
	}
	catch(exception)
	{
		nlapiLogExecution('ERROR','Error in Quarter Calc', exception.message);
		//alert('An error has occurred.\nPlease retry the operation.\n(GetQuarter)\n' + exception);
		return false;
	}
}