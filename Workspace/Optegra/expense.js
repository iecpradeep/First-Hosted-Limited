/*************************************************************************
 * Name: expense.js  - Expense Report Customisations
 * Script Type: client script
 * Client: Optegra/Augentis
 * 
 * Version: 1.5.1 - 12 Jul 2012 - 1st release - JP/DB/PL/ML
 * Version: 1.5.2 - 12 Jul 2012 - amended - on site amendment to default the account to '350005'  
 * 										  - disable insurance required policy for 12/7 only [TODO] remove 13/7
 * Version: 1.5.3 - 8th August 2012 - Set default account when Payment Method is Credit Card. 
 * 										- Created function called checkPaymentMethod() which can be called whenever the account needs to be set.
 * Version: 1.5.4 - 30th August 2012 - Re-enabled Car Insurance Policy check.
 * Version: 1.5.5 - 6th September 2012 - Re-disabled Car Insurance Policy check.
 * Author: FHL
 * Purpose: expense form customisations
 * 
 *  
 **************************************************************************/

//Debug Setting
var InDebug = false;

//Magic Numbers Warning :
var mileageCategoryId = '11';
var defaultTax = '213';
var defaultZeroTax = '215';
var defaultAccount = 3126;					//1.5.2 defaults to 350005
var defaultCreditCardAccount = 3171; 	//1.5.3 credit card 
var cashInternalID = 1;							//Cash or Debit Card
var creditCardInternalID = 2; 					//Company Credit Card

//Initialise the variables to be used throughout
var currentCategory = '';
var lowRate = 0;
var highRate = 0;
var breakpoint = 0;
var ppmRate = 0;
var currentEmployee = '';
var settingsId = 0;
var settingsRec = new Object();
var allowTaxReceipt = '';
var comments = '';
var paymentMethod = 0;


/*************************************************************
 * Page Init function
 * Called when form is initialised, used to set default fields
 *************************************************************/

function pageInit()
{
	
	if(InDebug)
	{
		alert('!!!!WARNING!!!!\n\n\nThis page is in DEBUG mode - you will receive MANY popups throughout the use of this Transaction Entry Form.\n\n\n\nTo disable this mode, contact your NetSuite Administrator and state "expense.js - line 10".');
		alert('default account set to 350005');
	}
	//Set multicurrency to OFF, do not fire fieldchanged.
	nlapiSetFieldValue('usemulticurrency','F',false,true);

	// 1.5.2 - account default added
	nlapiSetFieldValue('account', defaultAccount);
	

	//Disable line item tax fields
	nlapiDisableLineItemField('expense','taxrate1',true);
	nlapiDisableLineItemField('expense','taxcode',true);
	nlapiDisableLineItemField('expense','tax1amt',true);
	// zzz
	//nlapiDisableLineItemField('expense','amount',true); //1.02

	//Disable line item mileage fields
	nlapiDisableLineItemField('expense','custcol_mileage',true);
	nlapiDisableLineItemField('expense','custcol_mileageto',true);
	nlapiDisableLineItemField('expense','custcol_mileagefrom',true);


	//set default tax code to zero (Z-GB)
	nlapiSetCurrentLineItemValue('expense','receipt','T');
	nlapiSetCurrentLineItemValue('expense','custcol_vatreceipt','F');
	nlapiSetCurrentLineItemValue('expense','taxcode',defaultZeroTax);

	var d = new Date();
	var today = nlapiDateToString(d);
	getMileageRates(today);

	currentEmployee = nlapiGetFieldValue('employee');

	//Default this selection so that we get the Employee specified in the Expense Report.
	//If there is no Employee in there, use the Current User
	
	if (currentEmployee == null || currentEmployee == '')
		{
		currentEmployee = nlapiGetUser();

		} //if
	
	if(InDebug)
	{
		alert(currentEmployee);
	}
	
	getMileageToDate(currentEmployee);

	return true;

} //function pageInit()

/*************************************************************
 * Line Init function
 * Called when new line is initialised, used to restrict entry fields that
 * cannot be restricted via form customisation through UI
 *************************************************************/

function lineInit()
{	

	currentCategory = nlapiGetCurrentLineItemValue('expense','category');

	try
	{
		if(currentCategory.length == 0)
			{
			nlapiDisableLineItemField('expense','taxrate1',true);
			nlapiDisableLineItemField('expense','taxcode',true);
			nlapiDisableLineItemField('expense','tax1amt',true);
			
			//set default tax code to zero (Z-GB)
			nlapiSetCurrentLineItemValue('expense','receipt','T');
			nlapiSetCurrentLineItemValue('expense','custcol_vatreceipt','F');
			nlapiSetCurrentLineItemValue('expense','taxcode',defaultTax);
			nlapiDisableLineItemField('expense','amount',true); //1.02
			
			//Disable line item mileage fields
			nlapiDisableLineItemField('expense','custcol_mileage',true);
			nlapiDisableLineItemField('expense','custcol_mileageto',true);
			nlapiDisableLineItemField('expense','custcol_mileagefrom',true);
			}
		if(currentCategory == mileageCategoryId)
			{
			//enable the mileage fields...
			nlapiDisableLineItemField('expense','custcol_mileage',false);
			nlapiDisableLineItemField('expense','custcol_mileageto',false);
			nlapiDisableLineItemField('expense','custcol_mileagefrom',false);
			}
	}
	catch(e)
	{
	alert('Something has caused the Line Init function to generate an error:\n\n'+ e.message);
	}

	if(InDebug)
	{
		alert('Current Category: ' + currentCategory);
	}
	
	return true;
}  //function lineInit()



function onFieldChange(type, name)
{
	if(name == 'accountingapproval')
	{
		var accountingApprovalStatus = nlapiGetFieldValue('accountingapproval');
		currentEmployee = nlapiGetFieldValue('entity');
		
		if(InDebug)
		{
			alert('Accounting Approval: ' + accountingApprovalStatus);
		}

		if(accountingApprovalStatus == 'T' && currentEmployee == nlapiGetUser())
		{
			alert('You cannot approve your own Expense Reports.');
			nlapiSetFieldValue('accountingapproval','F',false,false);
		}
		else
		
		{
			//1.5.3 Check Payment Method
			checkPaymentMethod();
		}
	}
	
	//1.5.3 Check Payment Method
	if(name == 'custbody_expense_paid_using')
	{
		checkPaymentMethod();
	}
	
	try
	{
		var currentClaimAmount = 0;
		var currentTaxAmount = 0;
		var currentNetTotal = 0;
		currentClaimAmount = nlapiGetFieldValue('total');
		currentTaxAmount = nlapiGetFieldValue('tax1amt');
		currentNetTotal = currentClaimAmount - currentTaxAmount;
		//Debug alert to check the running values at every single chance
		if(InDebug)
		{
			alert('Test:\nCurrent Report Amount: ' + currentClaimAmount + '\nCurrent Tax Amount: ' + currentTaxAmount + '\nCurrent Net Total: ' + currentNetTotal);	
		}
		
		nlapiSetFieldValue('custbody_exp_subtotal', currentNetTotal, false, false); //We don't want the changing of this field to trigger the post sourcing otherwise it will recursively keep calling itself	
	}
	catch(e)
	{
		//Ignore, it's unimportant if it fails...we just don't want it to stop anything else from working.	
	}
	
	
	if ((type == 'expense') && (name == 'category'))
		{
			//When selecting Mileage, the receipt amount is disabled.
			//When changing it back, the column has to be re-enabled
			nlapiDisableLineItemField('expense', 'grossamt', false);

			var currentCategory = nlapiGetCurrentLineItemValue('expense', 'category');
			var rec;

			if(String(currentCategory).length != 0)
				{			

					if(InDebug)
					{
						alert('currentCategory: ' + currentCategory);
					}
					//get current category
					//sercha exp cat lookup records, where customrecord_expense_categoy_lookup == currentCategory
					var categoryFilter = new nlobjSearchFilter('custrecord_ecl_category', null, 'is', currentCategory);

					var categoryColumn = new nlobjSearchColumn('internalid');

					var categorySearchResult = nlapiSearchRecord('customrecord_expense_category_lookup',null,categoryFilter,categoryColumn);

					if (categorySearchResult == null)
						{
							alert('No Expense Category Lookup Records have been found for this Expense Category\n\nPlease contact your NetSuite Administrator.');
							return false;
						}

					else
						{

							settingsId = categorySearchResult[0].getValue('internalid');
							settingsRec = nlapiLoadRecord('customrecord_expense_category_lookup', settingsId);
							defaultTax = settingsRec.getFieldValue('custrecord_ecl_vat_code');
							allowTaxReceipt = settingsRec.getFieldValue('custrecord_ecl_allowvatreceipt');
							comments = settingsRec.getFieldValue('custrecord_ecl_comments');


							if(allowTaxReceipt == 'T')
								{
								//enable reciept column
								//set default tax code to standard (S-GB)
								nlapiSetCurrentLineItemValue('expense','taxcode',defaultTax);
								nlapiSetCurrentLineItemValue('expense','custcol_vatreceipt','T');
								nlapiDisableLineItemField('expense', 'custcol_vatreceipt', false);
								}
							else
								{
									//disable receipt column
									//set default tax code to Zero (Z-GB)
									nlapiSetCurrentLineItemValue('expense','taxcode',defaultZeroTax);
									nlapiSetCurrentLineItemValue('expense','custcol_vatreceipt','F');
									nlapiDisableLineItemField('expense', 'custcol_vatreceipt', true);
								}
							//...repeat for each field
							
							if(InDebug)
							{
								alert('About to be: ' + String(defaultTax));
							}
							
							//nlapiSetCurrentLineItemValue('expense','taxcode',defaultTax);
							var currentComments = nlapiGetCurrentLineItemValue('expense','memo');
							
							if(String(currentComments).length == 0)
							{
								if((String(comments).length > 0) && (String(comments) != 'null'))	//Have to be sure that it's not letting a conversion of the null object in to String pass through.
								{
									nlapiSetCurrentLineItemValue('expense','memo',comments);
								}
							}
						}
				}
		}

	if ((type == 'expense') && ((name == 'category') || (name == 'custcol_mileage'))) 
	{
		var category = nlapiGetCurrentLineItemValue('expense', 'category');

		// mileage specific 
		if (category == mileageCategoryId) 
			{

			//enable mileage fields
			nlapiDisableLineItemField('expense', 'custcol_mileage', false); 
			nlapiDisableLineItemField('expense', 'custcol_mileageto', false);
			nlapiDisableLineItemField('expense', 'custcol_mileagefrom', false);
			nlapiDisableLineItemField('expense', 'grossamt', true);
			
			var mileageClaim;

			// get miles from previous Reports and this one
			var milesThisClaim = 0;

			milesThisClaim += parseInt(nlapiGetFieldValue('custbody_mileageclaimedytd'));
			milesThisClaim += getCurrentClaimMileage();

			//determine mileage rate based on previous claimed miles

			var mileageRate = 0.00;
			var breakpoint = parseInt(nlapiGetFieldValue('custbody_mileagebreakpoint'));
			var lowRate = parseFloat(nlapiGetFieldValue('custbody_mileagelowrate'));
			var highRate = parseFloat(nlapiGetFieldValue('custbody_mileagehighrate'));
			var ppm = nlapiGetFieldValue('custbody_ppm');
			var ppmRate = nlapiGetFieldValue('custbody_mileageppmrate');

			if(InDebug)
			{
				alert('breakpoint=' + breakpoint + '\nlowrate=' + lowRate + '\nhighrate=' + highRate + '\nppm=' + ppm + '\nppmRate=' + ppmRate);	
			}
		

			if (ppm == 'F')
				{
				if (milesThisClaim < breakpoint)
					{
						mileageRate = highRate;

					} //if
				else
					{
						mileageRate = lowRate;
					} //else	
				} //if
			else
				{
					//set ppm rate
					mileageRate = ppmRate;
				} //else

			if (InDebug) 
			{
				//Override the mileageRate for testing purposes.
				//var mileageRate = parseFloat(0.45); // GBP/mile for 10,000 miles or less in current FY
			}
			nlapiSetCurrentLineItemValue('expense', 'custcol_mileage_rate', mileageRate, false, false);

			var milesTravelled = parseFloat(nlapiGetCurrentLineItemValue('expense', 'custcol_mileage')); // integer
			if ((milesTravelled <= 0) || (milesTravelled == null) || (isNaN(milesTravelled))) 
				{
					milesTravelled = parseFloat(0);
				} //if
			mileageRate = parseFloat(nlapiGetCurrentLineItemValue('expense', 'custcol_mileage_rate')); // currency to float
			mileageClaim = parseFloat(milesTravelled * mileageRate);

			nlapiSetCurrentLineItemValue('expense', 'amount', mileageClaim, false, false);

			} //if
		else 
			{
				nlapiSetCurrentLineItemValue('expense', 'custcol_mileage_rate', '', false, false);
				nlapiSetCurrentLineItemValue('expense', 'custcol_mileage', '', false, false);

				//category is not mileage
				nlapiDisableLineItemField('expense', 'custcol_mileage', true);
				nlapiDisableLineItemField('expense', 'custcol_mileageto', true);
				nlapiDisableLineItemField('expense', 'custcol_mileagefrom', true);
			} //else		
	} //if

	// VAT Receipt Selection

	if ((type == 'expense') && (name == 'custcol_vatreceipt'))
		{

			var receiptValue = nlapiGetCurrentLineItemValue('expense','custcol_vatreceipt');

			if (receiptValue == 'T')
			{
				//set default tax code to standard (S-GB)
				if(InDebug)
				{
					alert('defaultTax = ' + defaultTax);
				}
				nlapiSetCurrentLineItemValue('expense','taxcode', defaultTax);
			}
			else
			{
				//set default tax code to zero (Z-GB)
				nlapiSetCurrentLineItemValue('expense','taxcode',defaultZeroTax);
			}
		} //if

	// if employee has changed then recalculate mileage claimed this year.
	if (name == 'employee')
		{
		var currentEmployee = nlapiGetFieldValue('employee');

		if (currentEmployee != null && currentEmployee != '')
			{
			getMileageToDate(currentEmployee);

			} //if

		} //if


	// if transaction date has changed then retrieve the mileage rates
	if (name == 'trandate')
		{
		var transactionDate = nlapiGetFieldValue('trandate');

		if (transactionDate != null && transactionDate != '')
			{

			getMileageRates(transactionDate);

			} //if

		} //if

	return true;
}


function onSave(type, name)
{
	//var currentExpRptStatus = nlapiGetFieldValue('status');
	//alert('Exp Rpt.\n\nStatus: ' + currentExpRptStatus);
	var accountingApprovalStatus = nlapiGetFieldValue('accountingapproval');
	var supervisorApprovalStatus = nlapiGetFieldValue('supervisorapproval');
	var currentUserID = nlapiGetUser();
	//Altered this script to look for the Employee specified, and NOT the currently logged in User...
	
	var userId = nlapiGetFieldValue('entity');	//nlapiGetUser() has been deprecated. 	
	// Inline Currency Transaction Body Field to hold saved Transaction Total
	//custbody_hiddentotal
	
	var hiddenAmount = nlapiGetFieldValue('custbody_hiddentotal');
	var hiddenOwner = nlapiGetFieldValue('custbody_hiddenowner');
	var currentTotal = nlapiGetFieldValue('amount');
	currentEmployee = nlapiGetFieldValue('entity');
	
	
	if(String(hiddenOwner) != String(currentEmployee))
	{
		if(String(hiddenOwner).length == 0)
		{
			//First time it's being saved....
			if(InDebug)
			{
				alert('First time the Expense Report has been saved?\nHidden Owner looks to be empty, so put current employee in to it!');
			}
			
			nlapiSetFieldValue('custbody_hiddenowner', currentEmployee);
		}
		else
		{
			alert('Changing the Employee once an Expense Report has been saved is disallowed as it would allow you to circumvent restrictions in effect on this Record.\n\nTo enter this Expense Report for someone else, you must create a New Expense Report for that Employee.');
			return false;
		}
	}
	else
	{
		if(InDebug)
		{
			alert('hidden owner == current employee');
			//this is an ok combination, but we'll leave the alert in for future use.
		}

	}
	
	
	if(String(hiddenAmount).length != 0)
	{
		if(InDebug)
		{
			alert('hidden Amount Length != 0');
		}
		
		//nlapiSetFieldValue('custbody_hiddentotal', currentTotal)	;
		if(hiddenAmount != currentTotal)
		{
			if(InDebug)
			{
				alert('Hidden Amount != currentTotal');
			}
			
			if(currentUserID != currentEmployee)
			{
				alert('As you do not own this Expense Report, you cannot make any changes which alter the Expense Report Amount!');
				return false;
			}
			else
			{
				if(InDebug)
				{
					//allow save?
					alert('You are the owner of this Expense Report.\nAllow saving of this record now?');	
				}

				nlapiSetFieldValue('custbody_hiddentotal', currentTotal)	;
			}
		}
		else
		{
			if(InDebug)
			{
				//testing
				alert('It looks like the Hidden Total is the same as the Total, thus you have not made any changes to the Total.\n\nThis record will now save...');	
			}
		}
	}
	else 
	{
		if(InDebug)
		{
			alert('hidden Amount Length == 0');		
		}
		nlapiSetFieldValue('custbody_hiddentotal', currentTotal)	;
	}
	
	
	if(InDebug)
	{
		alert('Accounting Approval Status: ' + accountingApprovalStatus +  '\nSupervisor Approval Value: ' + supervisorApprovalStatus + '\nCurrent UserID: ' + currentUserID + '\nEmployee ID: ' + userId);
	}
	

	/*
	if(userId == currentUserID)
	{
		alert('The current User ID is the owner of the Expense Report.');
	}
	else
	{
		alert('The current User ID is *NOT* the owner of the Expense Report.');
	}
	 */

	if(accountingApprovalStatus == 'T' && supervisorApprovalStatus == 'F')
		{
		alert('You cannot save this Expense Report as the Supervisor has not approved this claim, therefore Accounting cannot approve it yet.');
		return false;
		}

	var lineNum = nlapiGetLineItemCount('expense');
	
	if(InDebug)
	{
		alert('Current number of expense lines: '+lineNum);
	}
	
	var field;
	var expenseDate;
	for (var j=1; j<= lineNum; j++)
		{
			field = nlapiGetLineItemValue('expense', 'category',j); 
			expenseDate = nlapiGetLineItemValue('expense', 'expensedate',j); 
			
			if(InDebug)
			{
				alert('Current Expense Line: '+ j + '\nCurrent Expense Date: ' + expenseDate + '\nExpense Category: ' + currentCategory);
			}

			if (String(field) == mileageCategoryId) 
				{ //internal ID for 'mileage'

					var myDate = nlapiStringToDate(expenseDate);
					
					if(InDebug)
					{
						alert('Specified Employee User ID ' + userId);
					}
					
					//var x = nlapiSearchRecord('employee', new nlobjSearchFilter('internalid', null, 'is', userId),new nlobjSearchColumn( 'entityid'));
					var filters = new Array();
					filters[0] = new nlobjSearchFilter( 'custrecord_car_insurance_policyholder', null, 'anyof', userId);
					filters[1] = new nlobjSearchFilter( 'custrecord_car_insurance_start_date', null, 'onOrBefore', expenseDate);
					filters[2] = new nlobjSearchFilter( 'custrecord_car_insurance_end_date', null, 'after', expenseDate);
					var columns = new Array();
					columns[0] = new nlobjSearchColumn('custrecord_car_insurance_policy_number' );
					columns[1] = new nlobjSearchColumn('custrecord_car_insurance_start_date' );
					columns[2] = new nlobjSearchColumn('custrecord_car_insurance_end_date' );
					// Create the saved search
					var searchResults = nlapiSearchRecord('customrecord_car_insurance', null, filters, columns );
					if (searchResults != null)
						{
							if(InDebug)
							{
								alert('number of search results '+searchResults.length);
								alert('policy number '+searchResults[0].getValue(columns[0]));
								alert('policy expires '+searchResults[0].getValue(columns[2]));
							}
							return true;	
						}
					if (searchResults == null)
						{
						
						
						// temp Chantelle required modification made on site 12/7/2012
						// 1.5.2
						//1.5.4 On site modification Carrie/Claire - re-enable Insurance Policy check.
						//	if(true==false)
						//	{
						
								var alertText = "You cannot enter a mileage claim for this Employee as they do not have a car insurance policy registered on the system";
								alertText += " or it is not valid for the date of the Expense Report entered." + '\n' + '\n';
								alertText += "Please either amend (or remove) the mileage claim line, or cancel the current claim and enter valid insurance details before re-entering the claim.";
								if(InDebug)
								{
									alertText += "\n\nUserID: " + userId;
								}
								
								//1.5.5 - re-disabled Car Insurance Policy check Case S3803
								//alert(alertText);
								//return false;
								return true;
						//	}
						//	else
						//	{
						//		alert('Insurance policy disabled for 12/7/2012 - please call FHL to remove 13/7/2012....')
						//		return true;
						//	}
						}
				}
		}
	return true;
}

/*************************************************************
 * 
 *       Line validate function
 *
 *************************************************************/

function lineValidate()
{

	var memo = nlapiGetCurrentLineItemValue('expense','memo');
	var currentCategory = nlapiGetCurrentLineItemValue('expense','category');

	if (currentCategory.length == 0) 
		{
			return true;
		}

	if (memo == null || memo == '' || memo == 'null')
		{
		alert('You must enter a reason before continuing.');
		return false;	

		} //if
	else
		{
			//When they attempt to click away from a mileage claim...
			if(currentCategory == mileageCategoryId)
			{
				
				var enteredMileage = parseInt(nlapiGetCurrentLineItemValue('expense', 'custcol_mileage'));
				var enteredMileageTo = String(nlapiGetCurrentLineItemValue('expense', 'custcol_mileageto'));
				var enteredMileageFrom = String(nlapiGetCurrentLineItemValue('expense', 'custcol_mileagefrom'));		
				
				
				if(isNaN(enteredMileage) || enteredMileage < 1)
				{
					alert('To claim for Miles Travelled, it is highly recommended you enter the number of miles you travelled before continuing.');
					return false;
				}
				

				if((enteredMileageTo.length <= 4) || (enteredMileageFrom.length <= 4))
				{
					alert('You must ensure the following fields are completed correctly in order to claim for Mileage:\n\n- Mileage From\n- Mileage To');
					return false;
				}
				else
				{
					//check here to see whether the  + and mileage accrued on this expense report doesn't exceed 10,000
					var calculatedMileage = 0;
					var ytdMileage = 0;
					var inlineMileage = 0;
					var breakPointMileage = 0;
					var invBreakPointMileage = 0;
					var currentMileageRate = 0;
					var mileageDifference = 0;

					ytdMileage = parseInt(nlapiGetFieldValue('custbody_mileageclaimedytd'));
					calculatedMileage = getCurrentClaimMileage();
					inlineMileage = ytdMileage + calculatedMileage + enteredMileage;
					breakPointMileage = breakpoint - inlineMileage;
					invBreakPointMileage = inlineMileage - breakpoint;
					mileageDifference = enteredMileage - invBreakPointMileage;
					
					if(InDebug)
					{
						alert('ytdMileage = ' + ytdMileage + '\nCalculated Mileage = ' + calculatedMileage + '\nMileage entered = ' + enteredMileage + '\nInline Mileage = ' + inlineMileage + '\nMileage break point = ' + breakpoint + '\nbreakpoint - Inline Mileage = ' + String(breakPointMileage) + '\nInverse Breakpoint Mileage = ' + invBreakPointMileage);
					}
					
					if((breakPointMileage) < 0)
					{
						//check to see if they are a ppm or if they are using the lower rate anyway...
						currentMileageRate = nlapiGetCurrentLineItemValue('expense', 'custcol_mileage_rate');
						if(String(currentMileageRate) == String(highRate))
						{
							if(InDebug)
							{
								alert('breakpoint - inlineMileage = ' + breakPointMileage + '\n\nThis line exceeds the ' + breakpoint + ' miles limit by ' + invBreakPointMileage + '.\nPlease enter the first ' + invBreakPointMileage + ' miles on one line, and the rest on a new line.');
							}
							alert('By entering this Mileage line, you are exceeding your threshold of ' + breakpoint + ' miles.\nPlease split it out on to two lines, with the first line being ' + mileageDifference  + ' miles, and the second being ' + invBreakPointMileage);
							return false;
						}
					}

					if(InDebug)
					{
						alert('This mileage line item seems to be ok...');
					}
					
					return true;	
				}
			}
			else
			{
				return true;
			}
		} //else
} //function lineValidate()

/****************************************************
 * Check Payment Method
 * 
 * Call this Function when you need to automatically change 
 * the account depending on the Payment Method
 * 
 ****************************************************/
function checkPaymentMethod()
{
	try
	{
		//1.5.3 - set default account depending on the payment method.
		paymentMethod = parseInt(nlapiGetFieldValue('custbody_expense_paid_using'));
		
		switch(paymentMethod)
		{
			case cashInternalID:
				nlapiSetFieldValue('account', defaultAccount);
				break;
			case creditCardInternalID:
				nlapiSetFieldValue('account', defaultCreditCardAccount);
				break;
			default:
				alert('The Payment Method selected is not handled within this subroutine.\nPlease contact your NetSuite Administrator. (Err:1.5.3a expense.js).');
				break;
		}
	}
	catch(e)
	{
		alert('An error has occured whilst attempting to check the Payment Method of this Expense Claim.\nPlease contact your NetSuite Administrator. (Err: 1.5.3b expense.js).');
	}
}



/*************************************************************
 * Get Mileage Rates function
 *************************************************************/

function getMileageRates(date)
{

	//construct search

	var rateSearchFilters = new Array();
	var rateSearchColumns = new Array();

	rateSearchFilters[0] = new nlobjSearchFilter('custrecord_mileageeffectivedate', null, 'onorbefore', date);

	rateSearchColumns[0] = new nlobjSearchColumn('custrecord_mileageratelow');
	rateSearchColumns[1] = new nlobjSearchColumn('custrecord_mileageratehigh');
	rateSearchColumns[2] = new nlobjSearchColumn('custrecord_breakpoint');
	rateSearchColumns[3] = new nlobjSearchColumn('custrecord_mileageppmrate');
	rateSearchColumns[4] = new nlobjSearchColumn('custrecord_mileageeffectivedate');

	rateSearchColumns[4].setSort(true);


	// perform search
	var rateSearchResults = nlapiSearchRecord('customrecord_mileagerate', null, rateSearchFilters, rateSearchColumns);

	if (rateSearchResults)
		{
			lowRate = parseFloat(rateSearchResults[0].getValue(rateSearchColumns[0]));
			highRate = parseFloat(rateSearchResults[0].getValue(rateSearchColumns[1]));
			breakpoint = parseInt(rateSearchResults[0].getValue(rateSearchColumns[2]));
			ppmRate = parseFloat(rateSearchResults[0].getValue(rateSearchColumns[3]));
		} //if

	nlapiSetFieldValue('custbody_mileagehighrate',highRate);
	nlapiSetFieldValue('custbody_mileagelowrate',lowRate);
	nlapiSetFieldValue('custbody_mileagebreakpoint',breakpoint);
	nlapiSetFieldValue('custbody_mileageppmrate',ppmRate);

	return true;

} //function getMileageRates

/*************************************************************
 * Get Mileage To Date function
 *************************************************************/

function getMileageToDate(employee)
{

	//construct search

	var ytdSearchFilters = new Array();
	var ytdSearchColumns = new Array();

	var d = new Date()
	
	//########################
	// TODO: What should be done here is get the start of the financial year based on the Expense Line Date...
	// TODO: Also, I would expect the Search to do the Mileage Sum, and not Javascript...
	//
	// ...Pete.
	//########################
	d.setDate(2012,3,1);
	var trandate = nlapiDateToString(d);


	//ytdSearchFilters[0] = new nlobjSearchFilter('trandate', null, 'onorafter', trandate);
	ytdSearchFilters[0] = new nlobjSearchFilter('mainline',null,'is','F');
	ytdSearchFilters[1] = new nlobjSearchFilter('employee',null,'anyof',employee);


	ytdSearchColumns[0] = new nlobjSearchColumn('custcol_mileage');

	// perform search
	var ytdSearchResults = nlapiSearchRecord('expensereport', null, ytdSearchFilters, ytdSearchColumns);

	var mileageToDate = 0;
	var mileageLine = 0;

	if (ytdSearchResults)
		{
			if(InDebug)
			{
				alert('YTD Search Results Length: ' + ytdSearchResults.length);	
			}
						
			for (var i=0; i < ytdSearchResults.length; i++)
			{
				mileageLine = parseInt(ytdSearchResults[i].getValue(ytdSearchColumns[0]));

				if (!isNaN(mileageLine)) 
				{
					mileageToDate += mileageLine;
				}	//if			
			} //for
		} //if

	nlapiSetFieldValue('custbody_mileageclaimedytd',mileageToDate);

	return true;

} //function getMileageToDate

/*************************************************************
 * Calculate mileage on this claim
 *************************************************************/

function getCurrentClaimMileage()
{
	var lineCount = nlapiGetLineItemCount('expense');
	var mileage = 0;
	var lineMiles = 0;

	if (lineCount > 0)
		{
			for (var lineNum=1; lineNum <= lineCount; lineNum++)
				{
					
					lineMiles = parseInt(nlapiGetLineItemValue('expense','custcol_mileage',lineNum));
					
					if (!isNaN(lineMiles))
					{
						mileage += lineMiles;
						
					} //if

				} //for	

		} //if

	return mileage;

} //function