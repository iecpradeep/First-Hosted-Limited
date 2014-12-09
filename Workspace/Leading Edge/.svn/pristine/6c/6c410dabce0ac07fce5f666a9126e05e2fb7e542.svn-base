/******************************************************************************
* Name:                    Leading Edge Accruals script                      *
* Script Type:             User Event                                        *
* Version:                 2.0.20                                            *
* Date:                    11 May 2011 - 19th December 2011                  *
* Author:                  Pete Lewis, Anthony Nixon, First Hosted Limited.  *
******************************************************************************/

/*
 * 
 * Function called after record submit
 * 
 * InternalId's for Accounts: 141 & 142
 * 
 * Take from 141, put in to 142.
 * 
 */

function saveSalesOrder(type)
{
       var userId = nlapiGetUser();
       nlapiLogExecution('DEBUG', 'userId', userId);
       var RoleID = nlapiGetRole();// == 1018
	   if(RoleID == 1018)
       {
              if (type == 'edit')           //We only want this on EDIT as DELETE and CREATE are not needed...
              {
                     nlapiLogExecution('DEBUG', 'Status', '*** Start Accruals Script Edit Debug ***');

                     //Obtain a handle to the salesOrder we are wanting to edit...
                     var soRecord = null;
                     var soRecordId = null;
                     var soLastStatus = null;
                     var soCurrentStatus = null;
                     var soJournalID = null;
                     var soDept = null;
                     var soDate = null;
					 var soAgentID = null;

                     soRecord = nlapiLoadRecord('salesorder',nlapiGetRecordId());
                     soRecordId = soRecord.getId();
                     soLastStatus = soRecord.getFieldValue('custbody_lastsavedstatusvalue');
                     soCurrentStatus = soRecord.getFieldValue('custbody_orderstatus');
                     soJournalID = soRecord.getFieldValue('custbody_journalid');
                     soDept = soRecord.getFieldValue('department');
                     soDate = soRecord.getFieldValue('trandate');

                     nlapiLogExecution('DEBUG','Sales Order Date', soDate);
                     nlapiLogExecution('DEBUG','Sales Order Id', soRecordId);
                     nlapiLogExecution('DEBUG','LastStatus', soLastStatus);
                     nlapiLogExecution('DEBUG','Current Status', soCurrentStatus);
                     
                     // cash sale journal for allocating payment amounts
                     var totalValue = soRecord.getFieldValue('altsalestotal');   //we want the alt sales amount
                     var fromAc = 0;
                     var toAc = 0;

                     // account numbers - defaulted throughout entire code
                     fromAc = 175;
                     toAc = 315;

                     nlapiLogExecution('DEBUG', 'Total Value', totalValue);
                     nlapiLogExecution('DEBUG', 'fromAc', fromAc);
                     nlapiLogExecution('DEBUG', 'toAc', toAc);

					soAgentID = soRecord.getFieldValue('custbody_adminagent');
					if(OnJobNumbered(soAgentID))
					{
						nlapiLogExecution('DEBUG', 'Admin Agent commissions plan set to Job Numbered', 'Admin Agent ID: ' + soAgentID);
					}
					else
					{
						nlapiLogExecution('DEBUG', 'Admin Agent is not set to Job Numbered', 'Admin Agent ID: ' + soAgentID);
						return true;
					}

                     if(soJournalID==null)
                     {
                           if (soLastStatus != soCurrentStatus)
                           {
                                  if(soCurrentStatus == 7)
                                  {
                                         var jnl = createJournal(totalValue, fromAc, toAc, soDept, soDate);

                                         soRecord.setFieldValue('custbody_journalid', jnl);
                                         nlapiLogExecution('DEBUG', 'Journal created. ID is ', jnl);
                                         //Save the record at this point!!!
                                         nlapiSubmitRecord(soRecord,false,false);             
                                  }
                                  else
                                  {
                                         nlapiLogExecution('DEBUG', 'Status', 'Last Status: ' + soLastStatus + ', Current Status: ' + soCurrentStatus + '...No Journal Created....');
                                  }
                           }
                           else
                           {
                                  nlapiLogExecution('DEBUG', 'Status not changed.', 'Last Status: ' + soLastStatus + ', Current Status: ' + soCurrentStatus + '...No Journal Created....');
                           }
                     }
                     else
                     {
                           //nlapiLogExecution('DEBUG','Journal Exists','A Journal ID of ' + soJournalID + ' has been detected, so no new Journal will be created.');
                           if(soLastStatus == null)
                           {
                                  //The Last Status is null...this means something didn't go right last time...
                                  nlapiLogExecution('ERROR', 'Record previously failed to save', 'Please retry the operation...');

                           }
                           else
                           {
                                  switch(soLastStatus.toString()) {
                                  case '2':                       //Base Request
                                  case '3':                       //dirty order
                                  case '4':                       //Order Vol
                                  case '5':                       //Credit Referral
                                  case '6':                       //ODF
                                         nlapiLogExecution('DEBUG', 'Last Status Value unsupported. A journal has already been created.', 'Last Status value: ' + soLastStatus);
                                         break; 

                                  case '7':           
                                         //last status was Job Numbered
                                         switch(soCurrentStatus) 
                                         {
                                         case '8':
                                                //Gone from Job Numbered to Closed
                                                nlapiLogExecution('DEBUG', 'Gone from Job Numbered to Closed');
                                                ReverseJournal(soJournalID);                                                                 

                                                //Save the record at this point
                                                nlapiSubmitRecord(soRecord,false,false);             

                                                break;
                                         case '7':
                                                nlapiLogExecution('DEBUG', 'Order Status', 'Was - and still is - Job Numbered');
                                                break;
                                         default:
                                                //not sure what to do here...
                                                nlapiLogExecution('DEBUG', 'Unhandled code path', 'Last Status: Job Numbered. New Status: ' + soCurrentStatus);
                                         break;
                                         }

                                         break;
                                  case '8':
                                         //They are editing a Closed order - Maybe get the SO to auto-fulfill at this point?
                                         nlapiLogExecution('DEBUG', 'Last Order Status', 'A Closed Sales Order has been edited...');
                                         break;
                                  default:
                                         nlapiLogExecution('DEBUG', 'Last Order Status', 'Default trapped. Last Status: ' + soLastStatus + ', Current Status: ' + soCurrentStatus);
                                  break;
                                  }           
                           }
                     }

                     //Cancelled status
                     var soCancelled = soRecord.getFieldValue('custbody_ordercancelled');

                     nlapiLogExecution('DEBUG', 'soCancelled >>', soCancelled);

                     if(soCancelled == 'T')
                     {
                           //this means it's cancelled...
                           nlapiLogExecution('DEBUG', 'Cancelled called', 'True');
                           //we need to do nothing as it's a cancelled order and there's been no fulfillment...
                           if(soJournalID>1)
                           {
                                  //Cancelled order, so reverse the Journal if it's there...
                                  nlapiLogExecution('DEBUG', 'Reversing Journal...','Journal ID passed: ' + soJournalID);
                                  ReverseJournal(soJournalID);
                           }
                     }
                     //set the last saved status to the current status
                     
                     // update the record to save it again
                     soRecord = nlapiLoadRecord('salesorder', soRecordId);
                     soRecord.setFieldValue('custbody_lastsavedstatusvalue', soCurrentStatus);     

                     try 
                     {
                           nlapiSubmitRecord(soRecord,false,false); //submit the record for saving.
                     } 
                     catch (e) 
                     {
                           nlapiLogExecution('ERROR', 'Failed to submit:', 'Sales Order');
                     }
                                         
              } //if
              else
              {
                     nlapiLogExecution('DEBUG','Unsupported','This mode is not supported. Only EDIT will execute this script.');  
              }
       }	//nlapiGetRole() == 1018
       return true;
} //function

function ReverseJournal(journalID)
{
       if(journalID > 1)
       {
              // todays date
              var today = nlapiDateToString(new Date());

              // loads the journal 
              var jnl = nlapiLoadRecord('journalentry',journalID);

              // sets the field value of the reversal date to today and approves it
              jnl.setFieldValue('reversaldate',today);
              jnl.setFieldValue('approved','T');
              
              // a memo to notify us of when this action happens in the system
              jnl.setCurrentLineItemValue('line','memo','Journal automatically reversed from closed sales order');
              nlapiSubmitRecord(jnl,false,false);

              // prints out the Reverse journal ID for reference
              nlapiLogExecution('DEBUG', 'JournalReversal', 'Id - ' + jnl.getId());

              return true;
       }
       else
       {
              nlapiLogExecution('DEBUG', 'Journal Reversal','Journal ID is not greater than 1.');
              return false;
       }
} // Function ReverseJournal


function createJournal(totalValue, fromAcc, toAcc, Dept, soDate)
{
	

       // get the journal record
       var journalRecord = nlapiCreateRecord('journalentry');

    // get todays date and put the soDate into a new variable
       var today = nlapiDateToString(new Date());
       var TheSODate = soDate;
       
       // null check handling
       if(soDate == null)
       {
              nlapiLogExecution('DEBUG', 'soDate is null', null);
       }
       else // tell me what today and SODate is
       {
              nlapiLogExecution('DEBUG', 'TheSODate', TheSODate);
              nlapiLogExecution('DEBUG', 'today', today);
       }
       
       //convert everything to a float as we are dealing with numbers
       totalValue = parseFloat(totalValue);
       fromAcc = parseFloat(fromAcc);
       toAcc = parseFloat(toAcc);
       
       //we need to force this to last month, then if it fails, set it to today....
       
       // check if the period we are trying to post in is open
       if(inOpenPeriod(TheSODate))
       {
              //If the period the Sales Order was created in is still open, set the journal date to the end date of that month
              var newSODate = splitDate(TheSODate);
              journalRecord.setFieldValue('trandate',newSODate);     

       }
       else
       {
              //If the period is closed, set the posting date to today.
              journalRecord.setFieldValue('trandate',today);                 
       }
       
       journalRecord.setFieldValue('custbody_customerdepartment', Dept);
       journalRecord.setFieldValue('reversaldefer','F');
       journalRecord.setFieldValue('approved','T');

       // set line item credit (total value)
       journalRecord.selectNewLineItem('line');
       journalRecord.setCurrentLineItemValue('line','account',fromAcc);
       journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
       journalRecord.setCurrentLineItemValue('line','memo','Journal automatically created from Sales Order.');

       journalRecord.commitLineItem('line');   

       if (totalValue > 0)
       {
              // set line item debit (cash value)
              journalRecord.selectNewLineItem('line');
              journalRecord.setCurrentLineItemValue('line','account',toAcc);
              journalRecord.setCurrentLineItemValue('line','debit',parseFloat(totalValue));
              journalRecord.commitLineItem('line');                  
       } //if

       id = nlapiSubmitRecord(journalRecord,true);

       return id;
} //function createJournal

function afterSubmitUE(type)
{      
       nlapiLogExecution('DEBUG', 'Status', '*** Start After Submit Script Debug ***');
       
       if(type == 'create')  
       {    
              //should not execute
              nlapiLogExecution('DEBUG', 'type argument', 'type is create');  
              nlapiLogExecution('DEBUG', 'CREATE', 'Not to be run on Create');  
       }           

       if(type == 'delete')  
       {    
              //should not execute
              nlapiLogExecution('DEBUG', 'type argument', 'Deleting Transactions is not recommended. Consider making it inactive instead.');  
       }             

       if(type == 'edit')  
       {    
              //this is the only point the code should execute
              nlapiLogExecution('DEBUG', 'type argument', 'type is edit');  
              saveSalesOrder(type);
       }             

       if(type == 'approve')  
       {    
              //should not execute
              nlapiLogExecution('DEBUG', 'type argument', 'Approve does not allow this script to execute');  
       }

       nlapiLogExecution('DEBUG', 'Status', '*** END After Submit Script Debug ***');
}

function inOpenPeriod(date)
{
       if (date == null) 
       {
              return false;
       }

       //set search criteria: find all periods that date falls into that aren't quarter or year
       var filters = new Array();
       filters[0] = new nlobjSearchFilter('startdate', null, 'onorbefore', date);
       filters[1] = new nlobjSearchFilter('enddate', null, 'onorafter', date);
       filters[2] = new nlobjSearchFilter('isquarter', null, 'is', 'F');
       filters[3] = new nlobjSearchFilter('isyear', null, 'is', 'F');

       // Do the search
       var searchresults = nlapiSearchRecord('accountingperiod', null, filters, null);

       // 
       for (var i = 0; searchresults != null && i < searchresults.length; i++) 
       {
              var id = searchresults[i].getId();
              nlapiLogExecution('DEBUG', 'id?', id);
              var allLocked = nlapiLookupField('accountingperiod', id, 'allLocked');
              nlapiLogExecution('DEBUG', 'allLocked?', allLocked);
              if (allLocked == 'F')
              {
                     return true;
              }
       }
       return false;
} // Function inOpenPeriod

function splitDate(date)
{
       //split the date by /
       var SplitDate = date.split('/');
       
       // get the converted last day of the month from the days in month function
       var convertedDay = daysInMonth(SplitDate[1], SplitDate[2]);
       
       //check dates
       nlapiLogExecution('DEBUG', 'SplitDate month', SplitDate[1]);
       nlapiLogExecution('DEBUG', 'SplitDate year', SplitDate[2]);
       nlapiLogExecution('DEBUG', 'convertedmonth', convertedDay);
       
       //rebuild the date with the end of the month day 
       var newDate = convertedDay + '/' + SplitDate[1] + '/' + SplitDate[2];
       
       //send the newly constructed date back
       return newDate;
}

function daysInMonth(month, year)
{
       //create an array with the different maxium number of days for each month
       var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
       
       if (month != 2) // if not the second month
       {
              return m[month - 1];
       }
       
       if (year % 4 != 0)
       {      
              return m[1];
       }
       
       if (year % 100 == 0 && year % 400 != 0)
       {
              return m[1];
       }
       return m[1] + 1;
}

function OnJobNumbered(EntityID)
{
	var TheEntityRecord = '';
	var TheEntityRecordID = EntityID;
	var JobNumberedTimingPlanID = 1;
	var TimingPlan = null;
	var TimingPlanFieldName = 'custentity_commtimingplan';
	
	if(TheEntityRecordID == null || TheEntityRecordID == 0 || TheEntityRecordID.length == 0)
	{
		//This means they are not entitled to accrue commission at Job Numbered...
		return false;
	}
	
	try
	{
		//First we attempt to load up the Sales Agent as a Partner as that's what most of them are...
		TheEntityRecord = nlapiLoadRecord('partner', TheEntityRecordID);
	}
	catch(ae)
	{
		//If it fails, it means the Sales Agent attached to the Sales Order is an Employee, so we retry with the Employee record type
		try
		{
			TheEntityRecord = nlapiLoadRecord('employee', TheEntityRecordID);
		}
		catch(ee)
		{
			//If the Sales Agent is neither an Employee or Partner, then don't do anything with it.
			return false;
		}
	}
	
	//At this point we should have the record loaded in to TheEntityRecord, with the Record ID being in TheEntityRecordID
	
	try
	{
		TimingPlan = TheEntityRecord.getFieldValue(TimingPlanFieldName);
		if (TimingPlan == JobNumberedTimingPlanID) 
		{
			//The Timing Plan associated with the Entity is the same as the one we need to be Job Numbered
			return true;
		}
		else 
		{
			return false;
		}
	}
	catch(e)
	{
		//Any error at this stage is unacceptable		
		return false;
	}
}
