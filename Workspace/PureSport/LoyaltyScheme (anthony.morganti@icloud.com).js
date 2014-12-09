/*******************************************************
 * Name:		Pure Sport Loyalty Scheme Script
 * Script Type:	User Event
 * Version:		1.0.0
 * Date:		2nd September 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/


function TestLoyalty()
{

	alert('Loyalty Card Test - Getting and Setting the Values based on just the Loyalty Card Number.');
	var CardNumber = prompt('Enter an existing Loyalty Card Number: ', '12345');	
	var CurrentPointsBalance = 0;
	
	if(trim(CardNumber) == '')
		{
			alert('Card Number not specified on Transaction - No need to run script.');
			return true;
		}
	
	alert('Getting the Points Balance of the Card "' + CardNumber + '"...');
	CurrentPointsBalance = GetPointsBalance(CardNumber);
	
	alert('Points Balance is: ' + CurrentPointsBalance);
	var NewPointsBalance = prompt('Enter New Balance for Card Number ' + CardNumber,CurrentPointsBalance);
	SetPointsBalance(CardNumber, NewPointsBalance);
	
	
	var TXID = prompt('Enter an existing Transaction ID:','22870');	
	
	alert('Is is associated to a Club?\n\n' + IsClub(TXID, 'salesorder'));
	
	alert('Accruing Points to the Transaction: ' + TXID);
	
	AccruePoints(TXID);
	
	
	var CusID = prompt('Enter an existing Customer ID (one that is NOT a club): ', '27276');
	alert('TypeRef for the Customer entered: ' + GetTypeRef(CusID));
	
	var ClubID = prompt('Enter an existing Customer ID (one that IS a club): ', '27275');
	alert('Club Points Balance: ' + GetClubBalance(ClubID));
	
	
	
	
}

/*/ declare an 'enum'
*TxType = function() {
*	/// <field name="SO" type="Number" integer="true" static="true"/>
*	/// <field name="CS" type="Number" integer="true" static="true"/>
*	/// <field name="RF" type="Number" integer="true" static="true"/>
*	/// <field name="CR" type="Number" integer="true" static="true"/>
*	};
*	TxType.prototype = { SO : 0, CS : 1, RF : 2, CR : 3 };
*	TxType.SO = 0;	//SalesOrder
*	TxType.CS = 1;	//CashSale
*	TxType.RF = 2;	//SalesOrder Refund
*	TxType.CR = 3;	//CashSale Refund
*	TxType.__enum = true;
*/

function RedeemPoints(CardNumber, TXValue, RedemptionRate)
{
	/*****************************************************
	 * 
	 *       Redeem Points using Card Number
	 *       Transaction Value, and Redemption Rate
	 * 
	 *****************************************************/
	
	if(CardNumber.length == 0)
		{
			nlapiLogExecution('ERROR','Redeem Loyalty Points', 'Loyalty Card Number is not passed through.');
			return false;
		}

	if(TXValue.length == 0)
	{
		nlapiLogExecution('ERROR','Redeem Loyalty Points', 'Transaction Value is not passed through.');
		return false;
	}
	
	if(RedemptionRate.length == 0)
	{
		nlapiLogExecution('ERROR','Redeem Loyalty Points', 'Redemption Rate is not passed through.');
		return false;
	}
	
	
	
	
}


function GetTypeRef(EntityID)
{
	var TypeRef = '';
	
	try
	{
		var TheEntity = nlapiLoadRecord('customer', EntityID);
		
		var IsClub = TheEntity.getFieldValue('custentity_club');
		TypeRef = TheEntity.getFieldValue('custentity_typereference');
		
		if(IsClub == 'T')
			{
				//do they have a type reference?
				if(TypeRef.length == 0)
				{
					//Default TypeRef for Club is 'Club'
					return 'Club';
				}
				else
				{
					return TypeRef;
				}
			}
		else
			{
				//do they have a type reference?
				if(TypeRef.length == 0)
				{
					//Default TypeRef for Client is 'Client'
					return 'Client';
				}
				else
				{
					return TypeRef;
				}
			}
		
	}
	catch(e)
	{
		alert('Error in GetTypeRef(EntityID).\n\nTypeRef: ' + TypeRef);
	}

	return TypeRef;
}

function AccruePoints(TransactionID)
{	
	
	/*****************************************************
	 * 
	 *       Accrue Points using Transaction ID
	 * 
	 *****************************************************/
	
	
	/* Accrue the actual points based on the TX ID
	 * 
	 * 1. Load the Tx Record
	 * 2. Get the amount
	 * 3. get the customer record
	 * 4. open loyalty card record
	 * 5. get the card number
	 * 6. get the accrual rate based on the card number
	 * 7. calculate the accrual value by multiplying with accrual rate
	 * 8. subtract the points redeemed
	 * 9. get the current points balance
	 * 10. add points balance and calculated points together
	 * 11. set points balance
	 * 12. submit record
	 * 
	 */
	var TheRecord = '';	//Tx Record
	var TheType = 'unknown';
	
	
	try
	{

			TheRecord = nlapiLoadRecord('salesorder', TransactionID);
			TheType = 'salesorder';
			
			TheType = TheRecord.getFieldValue('This');
		
			alert('TheType = ' + TheType);
			
	}
	catch(e1)
	{
		try
		{
		
				TheRecord = nlapiLoadRecord('cashsale', TransactionID);
				TheType = 'cashsale';

				alert('TheType = ' + TheType);
			
		}
		catch(e2)
		{
			try
			{
				
					TheRecord = nlapiLoadRecord('cashrefund', TransactionID);
					TheType = 'cashrefund';
					
					//This function is not designed to handle Refunds as you cannot accrue points on a refunded transaction.
					
				
			}
			catch(e3)
			{
				try
				{
				
						TheRecord = nlapiLoadRecord('customerrefund', TransactionID);
						TheType = 'customerrefund';
						//This function is not designed to handle Refunds as you cannot accrue points on a refunded transaction.
					
				}
				catch(e)
				{
					nlapiLogExecution('ERROR','Unhandled Transaction Type','An unhandled transaction type has been passed through.Error: ' + e.message);
					alert('Exception Error n200: ' + e.message);
					return false;
				}
			}
		}
	}

	if(IsClub(TransactionID, TheType) == true)
	{
		alert('The Transaction was made by a Customer who is a Club.');
	}
	else
	{
		alert('The Transaction was made by a Customer who is NOT a Club.');
	}
	
	var TheCardNumber = 0;
	var TheAmount = 0;
	var TheCustomer = 0;
	var PointsRedeemed = 0;
	
	
	var RedemptionRate = 0;
	var AccrualRate = 0;
	var CalcAccrued = 0;
	var PointsAccrued = 0;
	var TheTypeRef = '';
	var TheParameterRecord = '';
	
	try
	{
		TheCardNumber = TheRecord.getFieldValue('custrecord_loyaltyschemecardnumber');
		
		alert('The Transaction\'s Loyalty Card Number : ' + TheCardNumber);
		
		if(trim(TheCardNumber) == '')//No card number to go by...
		{
			alert('No card number associated with this transaction - no need to run this script!');
			return true;
		}
		else
		{
			TheCustomer = TheRecord.getFieldValue('entity');
			TheAmount = TheRecord.getFieldValue('total');
			PointsRedeemed = TheRecord.getFieldValue('custbody_pointsredeemed');
			
			
			TheTypeRef = GetTypeRef(TheCustomer);
			
			
			TheParameterRecord = GetParameterRecord(TheTypeRef, IsClub(TheCustomer,TheType));
			
			AccrualRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeaccrualrate');
			RedemptionRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeredemptionrate');
			
			CalcAccrued = AccrualRate * TheAmount;
			PointsAccrued = CalcAccrued - PointsRedeemed;
			
			alert('Transaction Customer: ' + TheCustomer + '\nTransaction Total: ' + TheAmount + '\nTransaction Points Redeemed: ' + PointsRedeemed + '\nLoyalty Card Number: ' + TheCardNumber + '\nType Ref/Password: ' + TheTypeRef + '\nAccrual Rate: ' + AccrualRate + '\nRedemption Rate: ' + RedemptionRate + '\nCalculated Points Value: ' + CalcAccrued +  '\nPoints Accrued: ' + PointsAccrued);
			
			
			
			

		}
	}
	catch(e5)
	{
		nlapiLogExecution('ERROR','Cannot load record', 'Error: ' + e.message);	
		alert('An error has occurred: ' + e.message);
	}

}


function RefundPoints(TransactionID)
{
	/*****************************************************
	 * 
	 *       Refund Points using Transaction ID
	 * 
	 *****************************************************/
	
	
	/* Refund the actual points based on the TX ID
	 * Load the Tx Record
	 * Get the amount
	 * get the customer record
	 * open loyalty card record
	 * get the card number
	 * get the accrual rate based on the card number
	 * calculate the accrual value by multiplying with accrual rate
	 * subtract the points redeemed
	 * get the current points balance
	 * subtract calculated points from points balance
	 * set points balance
	 * submit record
	 */
	 
	alert('Refund Transaction ID: ' + TransactionID + ' is not a valid customer-refund transaction');
	return true;	
}




function GetPointsBalance(CardNumber)
{
	/*****************************************************
	 * 
	 *       Get points balance using CardNumber
	 * 
	 *****************************************************/
	
	
	/* custrecord_loyaltycard
	 * get points balance
	 * return points balance
	 */
		
	if(CardNumber == '')
		{
			alert('CardNumber is blank.');
			return false;
		}
	
	try
	{
		var TheBalance = 0;
	
		// Define search filters
		var filters = new Array();
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecardnumber', null, 'is', CardNumber);
	
		// Define search columns
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemebalance');
		columns[1] = new nlobjSearchColumn('custrecord_loyaltyschemeexpired');
		columns[2] = new nlobjSearchColumn('custrecord_loyaltyschemecustomer');
		columns[3] = new nlobjSearchColumn('internalid');
		
		// Execute the search
		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);
	
		// Get the value of the columns
		//var values = 'Points Balance: ' + searchResults[0].getValue(columns[0]) + '\nHas Expired?: ' +  searchResults[0].getValue(columns[1]) + '\nCustomer ID: ' + searchResults[0].getValue(columns[2]) + '\nRecord InternalID: ' + searchResults[0].getValue(columns[3]);
	
		//alert(values);
	
		//nlapiLogExecution('DEBUG','SearchResult', values);
		TheBalance = searchResults[0].getValue(columns[0]);
		
		return TheBalance;

	}
	catch(e)
	{
		alert('Error in GetPointsBalance(CardNumber):\n\n' + e.message);
		nlapiSendEmail(19731 , 'dan@puresport-specialists.com', 'Loyalty Scheme Error', 'An error has occurred whilst getting the Points Balance of a Loyalty Card.\n\n' + e.message, null, 'pl@firsthosted.co.uk', null, null);
		return false;
	}
}



function SetPointsBalance(CardNumber, NewBalance)
{
		/*********************************************
		 *  Set the points balance using CardNumber
		 *********************************************/
		
		/* Search for the Card using CardNumber
		 * Load the Card Record
		 * Set the Points Balance
		 * Submit record
		 * return true
		 */
		
	alert('Script has entered SetPointsBalance()\n\nCardnumber: ' + CardNumber);
	//return true;
	
	if(NewBalance == null)
		{
		alert('Invalid Parameter:\n\nNewBalance cannot be null');
		return false;
		}
	
	try
	{
		// Define search filters
		var filters = new Array();
		//Get all where the CardNumber is the one passed through...
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecardnumber', null, 'is', CardNumber);
		
		// Define search columns we want to return
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemebalance');
		columns[1] = new nlobjSearchColumn('custrecord_loyaltyschemeexpired');
		columns[2] = new nlobjSearchColumn('custrecord_loyaltyschemecustomer');
		columns[3] = new nlobjSearchColumn('internalid');
		
		// Execute the search
		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);
	
		// Get the value of the Company Name column
		//var values = 'Points Balance: ' + searchResults[0].getValue(columns[0]) + '\nHas Expired?: ' +  searchResults[0].getValue(columns[1]) + '\nCustomer ID: ' + searchResults[0].getValue(columns[2]) + '\nRecord InternalID: ' + searchResults[0].getValue(columns[3]);
	
		var TheID;
		TheID = searchResults[0].getValue(columns[3]);
		
		if(TheID > 0)
			{
			var CardRecord;
			
			alert('CardRecordID: ' + TheID);
			CardRecord = nlapiLoadRecord('customrecord_loyaltyschemecard', TheID);
			CardRecord.setFieldValue('custrecord_loyaltyschemebalance', NewBalance);
			nlapiSubmitRecord(CardRecord);
			alert('Points balance set.');
			return true;		
			}
		else
			{
				alert('Error in SetPointsBalance(CardNumber, NewBalance):\n\nInvalid value for InternalID: ' + TheID);
				return false;
			}
	}
	catch(e)
	{
		alert('Error in SetPointsBalance(CardNumber, NewBalance):\n\n' + e.message);
		return false;
	}
}





/*
 * Use this function when you need to set the 
 * balance of the associated club.
 * Use "GetClubBalance" below to get the value.
 */
function SetClubBalance(ClubID, NewBalance)
{
	try
	{
		NewBalance = nlapiGetFieldValue('custbody_epossalechequeamount');
		
		alert('NewBalance: ' + NewBalance);
		
		
		var iBalance = NewBalance;
		
		var ClubCard = nlapiLoadRecord('customrecord_loyaltyschemecard',ClubID);
		
		var CurrentBalance = ClubCard.getFieldValue('custrecord_loyaltyschemebalance');
		alert('Current balance of card: ' + CurrentBalance);
		
		ClubCard.setFieldValue('custrecord_loyaltyschemebalance', iBalance);
		nlapiSubmitRecord(Clubcard);

	}
	catch(e)
	{
		alert('Error in SetClubBalance(ClubID, NewBalance):\n\n' + e.message);
	}
}


/*
 * Use this function when you need to get the 
 * balance of the associated club.
 * 
 * Use "SetClubBalance" above to set the value.
 */
function GetClubBalance(ClubID)
{
	var iBalance = 0;
	
	alert('Searching for Club using ClubID "' + ClubID + '"');
	
	// Define search filters
	var filters = new Array();
	filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemeclub', null, 'is', ClubID);

	// Define search columns
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemeclub');
	columns[1] = new nlobjSearchColumn('custrecord_loyaltyschemecardnumber');
	columns[2] = new nlobjSearchColumn('custrecord_loyaltyschemebalance');
	columns[3] = new nlobjSearchColumn('internalid');
	columns[4] = new nlobjSearchColumn('custrecord_loyaltyschemeexpired');
	
	// Execute the search
	var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);

	// Get the value of the Company Name column
	var values = searchResults[0].getValue(columns[3]);

	
	alert('ClubID Loyalty Card ID: "' + values + '"');
	
	ClubRecord = nlapiLoadRecord('customrecord_loyaltyschemecard', values);
	
	iBalance = ClubRecord.getFieldText('custrecord_loyaltyschemebalance');
	
	alert('Points Balance: ' + iBalance);
	
	//need to do a search on the Loyalty Scheme Card, where the CustomerID is the same as ClubID
	
	

	return iBalance;
}

/***************************************************************
 * TypeRef is what we are going to search for...
 * Whether they are a club or not determines the default record
 * returns an nlobjRecord
 ***************************************************************/
function GetParameterRecord(TypeRef,IsClub)
{
	//customrecord_loyaltyschemeparameter
	//customrecord_loyaltyschemecard
	var ParamRecord;
	
	if (TypeRef.length == 0)
	{
		if (IsClub == true)
		{
			//default param for club
			TypeRef == 'Club';
			//Return the standard club record (Id 2)
			ParamRecord = nlapiLoadRecord('customrecord_loyaltyschemeparameter', 2);
		}
		else
		{
			//deault param for customer is client (Id 1)
			TypeRef == 'Client';
			ParamRecord = nlapiLoadRecord('customrecord_loyaltyschemeparameter', 1);
		}	
		return ParamRecord;
	}
	//need to search for the Parameter record now we have guaranteed results...
	try
	{
		//set up search to find ParamRecord.
		// Define search filters
		var filters = new Array();
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemetypereference', null, 'is', TypeRef);

		// Define search columns
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemetypereference');
		columns[1] = new nlobjSearchColumn('custrecord_loyaltyschemeaccrualrate');
		columns[2] = new nlobjSearchColumn('custrecord_loyaltyschemeredemptionrate');
		columns[3] = new nlobjSearchColumn('internalid');
		
		// Execute the search
		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemeparameter', null, filters, columns);

		// Get the value of the Company Name column
		var values = searchResults[0].getValue(columns[3]);
		//var test = 0;
		
		nlapiLogExecution('DEBUG','SearchResult', values);
		alert('GetParameter Values: ' + values);
		
		ParamRecord = nlapiLoadRecord('customrecord_loyaltyschemeparameter', values);
	}
	catch (e)
	{
		//something failed, so return default records
		if (IsClub == true)
		{
			//default param for club (Id 2)
			ParamRecord = nlapiLoadRecord('customrecord_loyaltyschemeparameter', 2);
		}
		else
		{
			//deault param for customer is client (Id 1)
			ParamRecord = nlapiLoadRecord('customrecord_loyaltyschemeparameter', 1);
		}
	}
	
	
	return ParamRecord;

}



function toFixed(value, precision)
{
    var precision = precision || 0,
        neg = value < 0,
        power = Math.pow(10, precision),
        value = Math.round(value * power),
        integral = String((neg ? Math.ceil : Math.floor)(value / power)),
        fraction = String((neg ? -value : value) % power),
        padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
}



function mRound(multiple, value)
{
	var n = value;
	
    if(n > 0)        
		return Math.ceil(n/multiple) * multiple;    
	else if( n < 0)        
		return Math.floor(n/multiple) * multiple;    
	else        
		return multiple;
}



/*
 * Field Changed events
 * Parameters: type, name, linenum
 */
function myFieldChanged(type, name, linenum)
{
	//only show for administrator
	if(nlapiGetRole() != '3')
		{
			return true;
		}
	else
		{
			//TestLoyalty();		
		}
	
	return true;	//comment this line out to run the OnFieldChanged script
	
	var TheValue = nlapiGetFieldValue(name);
	var TheText = nlapiGetFieldText(name);
	
	if (linenum == 1)
		{
			alert('linenum FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
		}
	
	if(name=='memo')	//this is to test it
	{
		alert('attempting to set the points balance to ' + TheValue);

		try
		{
			var CardNum = nlapiGetFieldValue('custbody_loyaltyschemecardnumber');
			
			if(trim(CardNum) == '')
				{
					alert('Card Number is blank.');
					return false;
				}
			
			SetPointsBalance(CardNum, TheValue);
			alert('Getting balance for card num ' + CardNum + '\n\nBalance: ' + GetPointsBalance(CardNum));
		}
		catch(e)
		{
			alert('error whilst attempting to set the points balance: ' + e.message);
		}
	}

	
	
	
	if(name=='custbody_pr_aurora_order')
	{
		alert('PR Aurora Order Number is ' + TheValue);
		if(trim(TheValue) == '')
		{
			alert('Aurora Number is blank.');
			return false;		
		}
	
		try
		{
			alert('Getting Club status from TX ID ' + TheValue);
			var ClubTest = IsClub(TheValue);
			alert('ClubTest: ' + ClubTest); 
		}
		
		catch(e)
		{
			alert('Error getting Entity Club Status:\n\n' + e.message);
		}
	}	
	
	
	if(name=='custbody_loyaltyschemecardnumber')
	{
		//alert('Card number is ' + TheValue);
		if(trim(TheValue) == '')
			{
				alert('Card Number is blank.');
				return false;		
			}
	
		try
		{
			alert('Getting balance for card num ' + TheValue + '\n\nBalance: ' + GetPointsBalance(TheValue));
		}
		catch(e)
		{
			alert('Error getting points balance:\n\n' + e.message);
		}
	}	
} 





function IsClub(TransactionID, TXtype)
{
	/*********************************************************************************
	 *  
	 *  Gets whether the Customer associated with the Transaction is a Club or not
	 * 
	 *  custentity_club 	- Whether they are a club or not
	 *  custentity_clubtypereference	- Club Password / Type Reference
	 * 
	 ********************************************************************************/
	
var TheTX = '';
var TheCus = '';
var TheEntity = '';
var IsClub = '';


try
	{	
		TheTX = nlapiLoadRecord(TXtype, TransactionID);	
	}
catch(cluberror)
{
	nlapiLogExecution('ERROR', 'IsClub(TransactionID, TXtype)', cluberror.message);
	return false;
}

TheEntity = TheTX.getFieldValue('entity');

alert('Entity associated with TransactionID: ' + TheEntity);
nlapiLogExecution('DEBUG', 'IsClub Entity', TheEntity);

TheCus = nlapiLoadRecord('customer', TheEntity);

IsClub = TheCus.getFieldValue('custentity_club');

if(IsClub == 'T')
	{
		return true;
	}
else
	{
		return false;
	}

}

//Removes white spaces before and after
function trim(str)
{
	return ltrim(rtrim(str));
}
 
//Removes white spaces before
function ltrim(str) {
	var chars = "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
//Removes white spaces after
function rtrim(str) {
	var chars = "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}