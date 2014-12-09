/*******************************************************
 * Name:		Pure Sport Loyalty Scheme Script
 * 
 * Script Type:	User Event
 * Version:		1.2.0
 * Date:		2nd September 2011 - 12th January 2012
 * Author:		Pete Lewis, First Hosted Limited.
 * 
 *******************************************************/

function ProcessLoyaltyScheme(type)
{
	var currentContext = '';
	currentContext = nlapiGetContext();
	var executionContext = currentContext.getExecutionContext();
	var usageRemaining = currentContext.getRemainingUsage();
	var TheRecord = '';	//This is the Transaction we are catching on the After Submit event.
	var TheCurrentTXID = nlapiGetRecordId();
	var CurrentRecordType = '';
	
	var IsRefund = false;
	
	var CardNumber = 0;
	var TheAmount = 0;
	var TheCustomerID = 0;
	var TheCustomerRecord = 0;
	var PointsRedeemed = 0;
	var IsClub = false;
	var ThePointsBalance = 0;
	var TheNewPointsBalance = 0;
	var TheClubID = 0;
	var TheClub = '';
	
	var RedemptionRate = 0;
	var AccrualRate = 0;
	var AccruedValue = 0;
	var AccruableAmount = 0;
	var RedeemedValue = 0;
	var PointsAccrued = 0;
	var TypeRef = '';
	var TheParameterRecord = '';
	
	//Aurora Order Value issues...
	var OriginalTotal = 0;
	var AttentionDescription = '';
	
	
	if(TheCurrentTXID == -1)
		{
		nlapiLogExecution('ERROR', 'End of Script. Current Transaction ID', 'Error: -1');
		return true;	//Don't stop it from saving...just continue with whatever it was doing...
		}
	CurrentRecordType = nlapiGetRecordType();
	nlapiLogExecution('DEBUG', 'Current Record ID and Type:', TheCurrentTXID  + '. Event Type: ' + type);
	
	if(currentContext.getExecutionContext() != 'userinterface')
		{
		//we need it to work only on UserInterface for now...so silently allow it without processing.
		nlapiLogExecution('DEBUG', 'Execution Context: ', currentContext.getExecutionContext());
		//return true;
		}
	
	var TheRole = nlapiGetRole();
	if(TheRole == '3')
		{
		//only Administrator for now...
		//nlapiLogExecution('DEBUG', 'Role Check: ', 'Administrator ');
		
		}
	else
		{
			//Non-administrator role can get lost for the time being.
			nlapiLogExecution('DEBUG', 'Role Issue','A non-administrator role attempted to initiate this: ' + TheRole);
			//return true;
		}
	
	switch(type.toString())
	{
		case 'create':
		case 'edit':
		case 'xedit':
			break;
		case 'delete':
			nlapiLogExecution('DEBUG', 'On Delete', 'The Record with the Transaction ID of "' + TheCurrentTXID +'" has been deleted.');
			nlapiSendEmail(19731 , 'dan@puresport-specialists.com', 'Transaction Deleted', 'The Record with the Transaction ID of "' + TheCurrentTXID +'" has been deleted.\n\nAny loyalty points might be out of sync.', null, 'pl@firsthosted.co.uk', null, null);
			return true;
			break;
		default:
			//type is not supported here so just ignore it...
			nlapiLogExecution('DEBUG', 'End of Script. Not Running', 'Unsupported type. Exiting script...' + type);
			return true;
	}
		
	
	
	switch(CurrentRecordType.toString())
	{

			
		case 'cashrefund':
		case 'customerrefund':
			IsRefund = true;
		case 'salesorder':
		case 'cashsale':
			TheRecord = nlapiLoadRecord(CurrentRecordType, TheCurrentTXID);	//we have now got what we need to do this! :)
			nlapiLogExecution('DEBUG', 'Record Loaded:', CurrentRecordType + '. ID: ' + TheCurrentTXID);
			
			var TXSource = TheRecord.getFieldValue('custbody_transaction_source');
			
			if(TXSource == null)
				{
				TXSource = 9;	//6 is Not Specified
				TheRecord.setFieldValue('custbody_transaction_source', TXSource);
				}
			
			AttentionDescription = TheRecord.getFieldValue('custbody_attention_description');
			
			
			OriginalTotal = TheRecord.getFieldValue('custbody_originalordertotal');
			
			if(OriginalTotal != null)
				{
				
				
				}
			
			nlapiLogExecution('AUDIT', 'Transaction Source', 'Source: ' + TXSource + '. Context: ' + executionContext);
			nlapiLogExecution('AUDIT', 'Is this a refund transaction?', IsRefund);
			break;
		default:
			nlapiLogExecution('DEBUG', 'End of Script. RecordType', CurrentRecordType );
		return true;
			break;
	}
	
	

	
	//Start the script now...
	CardNumber = TheRecord.getFieldValue('custbody_loyaltyschemecardnumber');
	
	if(CardNumber == null)
		{
			nlapiLogExecution('AUDIT', 'End of Script', 'This transaction does not have a Loyalty Card Number associated with the Transaction.');
			return true;
		}
	
	
	
	//now we're in unchartered territory...
	
	try
	{
		
		//
		if(CardExist(CardNumber) == false)
			{
			//exit out of the script as the CardExist() function will alert the Administrator of the issue.
			TheRecord.setFieldValue('custbody_attention', 'T');
			TheRecord.setFieldValue('custbody_attention_description', 'Loyalty Scheme Card does not exist.\nPlease check the card record "' + CardNumber + '" to verify whether it is correct.');
			nlapiSubmitRecord(TheRecord);
			return true;
			}
		
		
		
		//get Customer ID and load the Customer Record
			TheCustomerID = TheRecord.getFieldValue('entity');
			TheCustomerRecord = nlapiLoadRecord('customer', TheCustomerID);
			
			//get the points accrued from TX...
			PointsAccrued = TheRecord.getFieldValue('custbody_pointsaccrued');
			
			if(PointsAccrued != '0')
				{
				
				if(IsRefund == true)
					{
					//This is a Refund.
					}
				else
					{
						//check with them...
						nlapiLogExecution('AUDIT', 'This Transaction has already had its points accrued...');
						
						TheRecord.setFieldValue('custbody_attention', 'T');
						TheRecord.setFieldValue('custbody_attention_description', 'This transaction has already had its points accrued.\nThis transaction will not be processed again.');
						nlapiSubmitRecord(TheRecord);
						return true;
					}

				}
			
			//get the transaction amount
			TheAmount = TheRecord.getFieldValue('total');
			//get the points redeemed
			PointsRedeemed = TheRecord.getFieldValue('custbody_pointsredeemed');
			
			//get the TypeRef
			try
			{
				IsClub = TheCustomerRecord.getFieldValue('custentity_club');
				TypeRef = TheCustomerRecord.getFieldValue('custentity_clubtypereference');
				
				if(IsClub == 'T')
				{
					IsClub = true;
					//do they have a type reference?
					if(TypeRef == null)
					{
						//Default TypeRef for Club is 'Club'
						TypeRef = 'Club';
					}
				}
				else
				{
					IsClub = false;
					//do they have a type reference?
					if(TypeRef == null)
					{
						//Default TypeRef for Client is 'Client'
						TypeRef = 'Client';
					}
				}
			}
			catch(typereferror)
			{
				nlapiLogExecution('ERROR','#170: Error in the TypeRef() function', TypeRef);
				
			}
			
			
			

		
		//are they a club?
			//yes
			if(IsClub == true)
				{
					//alert('The Transaction was made by a Club.');
					nlapiLogExecution('DEBUG', 'IsClub Transaction: ', 'Yes. Made by a Club customer.');
		
					//Load Param Record
					TheParameterRecord = GetParameterRecord(TypeRef, IsClub);
					
					//get Accrual rate
					AccrualRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeaccrualrate');
					
					//get redemption rate
					RedemptionRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeredemptionrate');
					RedeemedValue = 0;
					
					//calc redeemed points value if they have redeemed some
					if(PointsRedeemed > 0)
						{
						RedeemedValue = RedemptionRate * PointsRedeemed;
						}
					
					nlapiLogExecution('DEBUG', 'Club Tx Redeemed Value', RedeemedValue);
					
					//calc accrued value
					AccruedValue = AccrualRate * TheAmount;
					
					//subtract points redeemed
					
					AccruableAmount = TheAmount;// - RedeemedValue;
					
					AccruedValue = AccrualRate * AccruableAmount;
					
					//get current balance
					
					ThePointsBalance = GetPointsBalance(CardNumber);
					
					if(ThePointsBalance == -987654321)
						{
						//There was an error...
						nlapiLogExecution('ERROR','GetPointsBalance Error', '-987654321');
						TheRecord.setFieldValue('custbody_attention', 'T');
						TheRecord.setFieldValue('custbody_attention_description', 'Club No-Association Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card.');
						nlapiSubmitRecord(TheRecord);
						return true;	//let it continue still...
						}
					if(ThePointsBalance == -99999)
					{
						//There was an error...
						nlapiLogExecution('ERROR','GetPointsBalance Error', '-99999');
						TheRecord.setFieldValue('custbody_attention', 'T');
						TheRecord.setFieldValue('custbody_attention_description', 'Club No-Association Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card: ' + CardNumber);
						nlapiSubmitRecord(TheRecord);
						return true;	//let it continue still...
					}
					
					//add calculated points
					if(IsRefund == true)
						{
						
						TheNewPointsBalance = parseInt(ThePointsBalance) - parseInt(AccruedValue) + parseInt(PointsRedeemed);
						
						}
					else
						{
						
							TheNewPointsBalance = parseInt(ThePointsBalance) + parseInt(AccruedValue) - parseInt(PointsRedeemed);

						}
					
					//set points balance
					SetPointsBalance(CardNumber, TheNewPointsBalance);
					AccruedValue = parseInt(AccruedValue);
					TheRecord.setFieldValue('custbody_pointsaccrued', AccruedValue);
					nlapiSubmitRecord(TheRecord);
					
					nlapiLogExecution('AUDIT', 'Customer (Is a Club)', 'Club points now set from ' + ThePointsBalance + ' points to ' + TheNewPointsBalance + ' points.');
				
				}
				else
				{
					
					nlapiLogExecution('DEBUG', 'IsClub Transaction: ', 'The Transaction was NOT made by a Club.');
								//no
					
					//get club info
					TheClubID = parseInt(GetAssociatedClubID(CardNumber));
					
					nlapiLogExecution('AUDIT', 'TheClubID', 'CardNumber: ' + CardNumber + '. TheClubID: ' + TheClubID);
					
					//#########################################################################################################
					if(TheClubID == 0)//are they associated to a club? no
						{//no
								
						
						//alert('The Transaction was not made by a Club.');
						nlapiLogExecution('DEBUG', 'IsClub Transaction: ', 'No, made by a Customer. No association.');
			
						//Load Param Record
						TheParameterRecord = GetParameterRecord(TypeRef, IsClub);
						
						//get Accrual rate
						AccrualRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeaccrualrate');
						nlapiLogExecution('DEBUG', 'AccrualRate', AccrualRate);
						//get redemption rate
						RedemptionRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeredemptionrate');
						RedeemedValue = 0;
						nlapiLogExecution('DEBUG', 'RedemptionRate', RedemptionRate);
						//calc redeemed points value if they have redeemed some
						if(PointsRedeemed > 0)
							{
							RedeemedValue = RedemptionRate * PointsRedeemed;
							}
						
						nlapiLogExecution('DEBUG', 'Redeemed Value', RedeemedValue);
						
						//calc accrued value
						AccruedValue = AccrualRate * TheAmount;
						
						//subtract points already redeemed as payment for the value 
						//we are associating based on their redemption rate
						AccruableAmount = TheAmount;// - RedeemedValue;
						
						AccruedValue = AccrualRate * AccruableAmount;
						
						//get current balance
						ThePointsBalance = GetPointsBalance(CardNumber);
						
						if(ThePointsBalance == -987654321)
							{
							//There was an error...
							nlapiLogExecution('ERROR','GetPointsBalance Error', '-987654321');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'Non-Club No-Association Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card.');
							nlapiSubmitRecord(TheRecord);
							return true;	//let it continue still...
							}
						if(ThePointsBalance == -99999)
						{
							//There was an error...
							nlapiLogExecution('ERROR','GetPointsBalance Error', '-99999');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'Non-Club No-Association Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card: ' + CardNumber);
							nlapiSubmitRecord(TheRecord);
							return true;	//let it continue still...
						}
		
						//add calculated points
						if(IsRefund == true)
							{
							TheNewPointsBalance = parseInt(ThePointsBalance) - parseInt(AccruedValue)  + parseInt(PointsRedeemed);
							}
						else
							{
							TheNewPointsBalance = parseInt(ThePointsBalance) + parseInt(AccruedValue)  - parseInt(PointsRedeemed);
							}
						
						//set points balance
						SetPointsBalance(CardNumber, TheNewPointsBalance);
						AccruedValue = parseInt(AccruedValue);
						TheRecord.setFieldValue('custbody_pointsaccrued', AccruedValue);
						nlapiSubmitRecord(TheRecord);
						
						nlapiLogExecution('AUDIT', 'Customer (Not a Club)', 'Card points now set from ' + ThePointsBalance + ' points to ' + TheNewPointsBalance + ' points.');
					
						

						
						//#####################################################################################################
						}
					else//yes, they are associated to a club
						{

						nlapiLogExecution('DEBUG', 'IsClub Transaction: ', 'Made by a Customer, with Club associated...');
			
						//Load Param Record
						TheParameterRecord = GetParameterRecord(TypeRef, IsClub);
						
						//get Accrual rate
						AccrualRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeaccrualrate');
						
						//get redemption rate
						RedemptionRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeredemptionrate');
						RedeemedValue = 0;
						
						//calc redeemed points value if they have redeemed some
						if(PointsRedeemed > 0)
							{
							RedeemedValue = RedemptionRate * PointsRedeemed;
							}
						
						nlapiLogExecution('DEBUG', 'Redeemed Value', RedeemedValue);
						
						//calc accrued value
						AccruedValue = AccrualRate * TheAmount;
						
						//subtract points already redeemed as payment for the value 
						//we are associating based on their redemption rate
						AccruableAmount = TheAmount;// - RedeemedValue;
						
						AccruedValue = AccrualRate * AccruableAmount;
						
						//get current balance
						ThePointsBalance = GetPointsBalance(CardNumber);
						
						if(ThePointsBalance == -987654321)
							{
							//There was an error...
							nlapiLogExecution('ERROR','GetPointsBalance Error', '-987654321');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'Non-Club With Association Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card.');
							nlapiSubmitRecord(TheRecord);
							return true;	//let it continue still...
							}
						if(ThePointsBalance == -99999)
						{
							//There was an error...
							nlapiLogExecution('ERROR','GetPointsBalance Error', '-99999');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'Non-Club With Association Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card: ' + CardNumber);
							nlapiSubmitRecord(TheRecord);
							return true;	//let it continue still...
						}
		
						//add calculated points
						if(IsRefund == true)
							{
							TheNewPointsBalance = parseInt(ThePointsBalance) - parseInt(AccruedValue)  + parseInt(PointsRedeemed);
							}
						else
							{
							TheNewPointsBalance = parseInt(ThePointsBalance) + parseInt(AccruedValue)  - parseInt(PointsRedeemed);
							}
						
						//set points balance
						SetPointsBalance(CardNumber, TheNewPointsBalance);
						AccruedValue = parseInt(AccruedValue);
						TheRecord.setFieldValue('custbody_pointsaccrued', AccruedValue);
						nlapiSubmitRecord(TheRecord);
						
						nlapiLogExecution('AUDIT', 'Customer (Not a Club)', 'Card points now set from ' + ThePointsBalance + ' points to ' + TheNewPointsBalance + ' points.');
					//###########################################
						
						
						nlapiLogExecution('AUDIT','Associated Club...','Working out Associated Club points now...');
						
						//alert('The Transaction was not made by a Club.');
						
						TheClub = nlapiLoadRecord('customer', TheClubID);
						TypeRef = TheClub.getFieldValue('custentity_clubtypereference');
						CardNumber = GetClubCardNumber(TheClubID);
						
						switch(parseInt(CardNumber))
						{
						
						case -99999:
							//the card is invalid.
							nlapiLogExecution('ERROR', 'Invalid card. Exiting script...', 'Error Returned: -99999');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'GetClubCardNumber for Associated Club error.\nPlease check the associated TypeRef card as it was not found: ' + TypeRef);
							nlapiSubmitRecord(TheRecord);
							return true;
							break;
						case -88888:
							nlapiLogExecution('ERROR', 'Card not found. Exiting script...', 'Error Returned: -88888');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'GetClubCardNumber for Associated Club error.\nPlease check the associated TypeRef card as it was not found: ' + TypeRef);
							nlapiSubmitRecord(TheRecord);
							break;
						case -77777:
							nlapiLogExecution('ERROR', 'Unexpected error. Exiting script...', 'Error Returned: -77777');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'GetClubCardNumber for Associated Club error.\nPlease check the logs for details.');
							nlapiSubmitRecord(TheRecord);
							break;
							default:
								break;
						}
						
						//Load Param Record
						TheParameterRecord = GetParameterRecord(TypeRef, IsClub);
						
						//get Accrual rate
						AccrualRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeaccrualrate');
						
						//get redemption rate
						RedemptionRate = TheParameterRecord.getFieldValue('custrecord_loyaltyschemeredemptionrate');
						RedeemedValue = 0;
						
						//calc redeemed points value if they have redeemed some
						if(parseInt(PointsRedeemed) > 0)
							{
							RedeemedValue = RedemptionRate * PointsRedeemed;
							}
						
						nlapiLogExecution('DEBUG', 'Club Redeemed Value', RedeemedValue);
						
		
						
						//subtract points already redeemed as payment for the value 
						//we are associating based on their redemption rate
						AccruableAmount = TheAmount;// - RedeemedValue;
						
						AccruedValue = AccrualRate * AccruableAmount;
						
						//get current balance
						nlapiLogExecution('AUDIT', 'CardNumber #506', CardNumber);
						ThePointsBalance = GetPointsBalance(CardNumber);
						
						if(ThePointsBalance == -987654321)
							{
							//There was an error...
							nlapiLogExecution('ERROR','GetPointsBalance Error on Associated Club', '-987654321');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'GetPointsBalance Error on Associated Club.\nPlease check the associated card.\n' + error.message);
							nlapiSubmitRecord(TheRecord);
							return true;	//let it continue still...
							}
						if(ThePointsBalance == -99999)
						{
							//There was an error...
							nlapiLogExecution('ERROR','GetPointsBalance Error', '-99999');
							TheRecord.setFieldValue('custbody_attention', 'T');
							TheRecord.setFieldValue('custbody_attention_description', 'Associated Club Loyalty Scheme Card has caused an Invalid Points error.\nPlease check the associated card: ' + CardNumber);
							nlapiSubmitRecord(TheRecord);
							return true;	//let it continue still...
						}
		
						//add calculated points
						if(IsRefund == true)
							{
							TheNewPointsBalance = parseInt(ThePointsBalance) - parseInt(AccruedValue)  + parseInt(PointsRedeemed);
							}
						else
							{
							TheNewPointsBalance = parseInt(ThePointsBalance) + parseInt(AccruedValue)  - parseInt(PointsRedeemed);
							}
						//set points balance
						SetPointsBalance(CardNumber, TheNewPointsBalance);

						nlapiLogExecution('AUDIT', 'Associated Club', 'Card points now set from ' + ThePointsBalance + ' points to ' + TheNewPointsBalance + ' points.');
						//#########################################
						}//end associated
					
				//end club	

				}
				
				//########################################
				
				//nlapiLogExecution('DEBUG', '### AccruePoints(TransactionID, TXType)', 'Transaction Customer: ' + TheCustomerID + '\nTransaction Total: ' + TheAmount + '\nTransaction Points Redeemed: ' + PointsRedeemed + '\nLoyalty Card Number: ' + TheCardNumber + '\nType Ref/Password: ' + TheTypeRef + '\nAccrual Rate: ' + AccrualRate + '\nRedemption Rate: ' + RedemptionRate + '\nCalculated Points Value: ' + CalcAccrued +  '\nPoints Accrued: ' + PointsAccrued);
				
						
		
		
		
		
		
		
	}
	catch(error)
	{
		nlapiLogExecution('ERROR', 'End of Script. Process Loyalty Scheme error: ', error.message);
		//TheRecord.setFieldValue('custbody_attention', 'T');
		//TheRecord.setFieldValue('custbody_attention_description', 'Loyalty Scheme Card has caused an unexpected error.\nPlease check the associated card.\n' + error.message);
		//nlapiSubmitRecord(TheRecord);
		usageRemaining = currentContext.getRemainingUsage();
		nlapiLogExecution('DEBUG', 'Script Usage Remaining: ', usageRemaining);
		return true;
		
	}
	
	//default if it happens to get this far without erroring :)
	usageRemaining = currentContext.getRemainingUsage();
	nlapiLogExecution('DEBUG', 'End of Script. Usage Remaining: ', usageRemaining);
	return true;
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
		
	//alert('Script has entered SetPointsBalance()\n\nCardnumber: ' + CardNumber);
	//Can't do alerts in a User Event Script.
	nlapiLogExecution('AUDIT', 'SetPointsBalance()', 'Cardnumber: ' + CardNumber);
	//return true;
	
	if(NewBalance == null)
		{
		//alert('Invalid Parameter:\n\nNewBalance cannot be null');
		nlapiLogExecution('ERROR', 'SetPointsBalance()', 'NewBalance is NULL.');
		return false;
		}
	
	try
	{
		// Define search filters
		var filters = new Array();
		//Get all where the CardNumber is the one passed through...
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecardnumber', null, 'is', CardNumber);
		filters[1] = new nlobjSearchFilter ('custrecord_loyaltyschemeexpired', null, 'is', 'F');
		
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
			
			//alert('CardRecordID: ' + TheID);
			nlapiLogExecution('DEBUG', 'SetPointsBalance()', 'CardRecordID: ' + TheID);
			CardRecord = nlapiLoadRecord('customrecord_loyaltyschemecard', TheID);
			CardRecord.setFieldValue('custrecord_loyaltyschemebalance', parseInt(NewBalance));
			nlapiSubmitRecord(CardRecord);
			//alert('Points balance set.');
			nlapiLogExecution('DEBUG', 'SetPointsBalance()', 'Points balance set: ' + parseInt(NewBalance));
			return true;		
			}
		else
			{
				//alert('Error in SetPointsBalance(CardNumber, NewBalance):\n\nInvalid value for InternalID: ' + TheID);
				nlapiLogExecution('ERROR', 'SetPointsBalance()', 'Invalid value for InternalID: "' + TheID + '".');
				return false;
			}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'SetPointsBalance()', 'Error in SetPointsBalance(CardNumber, NewBalance):\n\n' + e.message);
		return false;
	}
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
	nlapiLogExecution('AUDIT', 'GetPointsBalance(CardNumber):', 'CardNumber: ' + CardNumber);
		
	if(CardNumber == '' || CardNumber == null)
		{
			//alert('CardNumber is blank.');
			return -987654321;
		}
	
	try
	{
		var TheBalance = 0;
	
		// Define search filters
		var filters = new Array();
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecardnumber', null, 'is', CardNumber);
		filters[1] = new nlobjSearchFilter ('custrecord_loyaltyschemeexpired', null, 'is', 'F');
		
		// Define search columns
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemebalance');
		columns[1] = new nlobjSearchColumn('custrecord_loyaltyschemeexpired');
		columns[2] = new nlobjSearchColumn('custrecord_loyaltyschemecustomer');
		columns[3] = new nlobjSearchColumn('internalid');
		
		// Execute the search
		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);
	
		if(searchResults == null)
			{
				nlapiLogExecution('ERROR', 'GetPointsBalance(CardNumber) resulted in error:', 'CardNumber: ' + CardNumber + ' is not a valid card.');
				return -99999;
			}

		TheBalance = parseInt(searchResults[0].getValue(columns[0]));
		
		return TheBalance;

	}
	catch(e)
	{
		//alert('Error in GetPointsBalance(CardNumber):\n\n' + e.message);
		nlapiLogExecution('ERROR', 'Loyalty Scheme Error...', e.message);
		//nlapiSendEmail(19731 , 'dan@puresport-specialists.com', 'Loyalty Scheme Error', 'An error has occurred whilst getting the Points Balance of a Loyalty Card.\n\n' + e.message, null, 'pl@firsthosted.co.uk', null, null);
		return -99999;
	}
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
		
		nlapiLogExecution('DEBUG','Parameter RecordID:', values);
		//alert('GetParameter Values: ' + values);
		
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

function CardExist(CardNumber)
{
	/*****************************************************
	 * 
	 *       Does the CardNumber exist
	 * 
	 *****************************************************/
	
	
	/* custrecord_loyaltycard
	 * gets whether a Card Number exists or not
	 * return boolean value if it does or not
	 */
		
	if(CardNumber == '' || CardNumber == null)
		{
			//alert('CardNumber is blank or null.');
			nlapiLogExecution('DEBUG', 'CardExist(CardNumber)','CardNumber is blank or null');
			return false;
		}
	
	try
	{

		// Define search filters
		var filters = new Array();
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecardnumber', null, 'is', CardNumber);
	
		// Define search columns
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid');

		
		// Execute the search
		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);
	
		if(searchResults == null)
			{
				return false;
			}
		else
			{
				return true;
			}

	}
	catch(e)
	{
		alert('Error in CardExist(CardNumber):\n\n' + e.message);
		nlapiSendEmail(19731 , 'dan@puresport-specialists.com', 'Loyalty Scheme CardExist Error', 'An error has occurred whilst getting the validity of a Loyalty Card.\n\n' + e.message, null, 'pl@firsthosted.co.uk', null, null);
		return false;
	}
}



function GetAssociatedClubID(CardNumber)
{
	/*****************************************************
	 * 
	 *       Get associated club using CardNumber
	 * 
	 *****************************************************/
	
	
	/* custrecord_loyaltycard
	 * get associated club
	 * return club
	 */
		
	if(CardNumber == '' || CardNumber == null)
		{
			return 0;
		}
	try
	{
		var TheClub = 0;
		// Define search filters
		var filters = new Array();
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecardnumber', null, 'is', CardNumber);
		filters[1] = new nlobjSearchFilter ('custrecord_loyaltyschemeclub', null, 'noneof', '@NONE@');
		//###############################################################################
		//###############################################################################
		//
		// need to ensure the card is actually associated to a club...
		//
		//###############################################################################
	
		// Define search columns
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemeclub');

		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);
	
		if(searchResults == null)
			{
				return 0;
			}
		else
			{	
				TheClub = searchResults[0].getValue(columns[0]);	
				return TheClub;
			}
	}
	catch(e)
	{
		//alert('Error in GetAssociatedClubID(CardNumber):\n\n' + e.message);
		nlapiLogExecution('ERROR','GetAssociatedClubID(CardNumber) Error:', e.message);
		nlapiSendEmail(19731 , 'dan@puresport-specialists.com', 'Loyalty Scheme Error', 'An error has occurred whilst getting the Associated Club ID of a Loyalty Card.\n\n' + e.message, null, 'pl@firsthosted.co.uk', null, null);
		return 0;
	}
}






/*
 * Use this function when you need to get the 
 * balance of the associated club.
 * 
 * Use "SetClubBalance" above to set the value.
 */
function GetClubCardNumber(ClubID)
{
	var TheCardNumber = 0;
	try
	{
		if(ClubID == null)
			{
			nlapiLogExecution('ERROR','GetClubCardNumber() ClubID', 'ClubID is null.');
			return -88888;
			}
		//alert('Searching for Club using ClubID "' + ClubID + '"');
		nlapiLogExecution('DEBUG', 'Searching for Club CardNumber using ClubID', ClubID);
		
		// Define search filters
		var filters = new Array();
		filters[0] = new nlobjSearchFilter ('custrecord_loyaltyschemecustomer', null, 'is', ClubID);
		filters[1] = new nlobjSearchFilter ('custrecord_loyaltyschemeexpired', null, 'is', 'F');	//no expired cards please
	
		// Define search columns
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('custrecord_loyaltyschemeclub');
		columns[1] = new nlobjSearchColumn('custrecord_loyaltyschemecardnumber');
		columns[2] = new nlobjSearchColumn('custrecord_loyaltyschemebalance');
		columns[3] = new nlobjSearchColumn('internalid');
		columns[4] = new nlobjSearchColumn('custrecord_loyaltyschemeexpired');
		columns[5] = new nlobjSearchColumn('custrecord_loyaltyschemecustomer');
		
		// Execute the search
		var searchResults = nlapiSearchRecord('customrecord_loyaltyschemecard', null, filters, columns);
	
	
		if(searchResults == null)
			{//Card not found...
			return -88888;
			}
		
		var Concat = searchResults[0].getValue(columns[0]) + ', ' + searchResults[0].getValue(columns[1]) + ', ' +  searchResults[0].getValue(columns[2]) + ', ' +  searchResults[0].getValue(columns[3]) + ', ' +  searchResults[0].getValue(columns[4]) + ', ' +  searchResults[0].getValue(columns[5]);
		
		
		if(searchResults[0].getValue(columns[3]) == searchResults[0].getValue(columns[5]))
			{//customer is the same as the club!
			return -99999;
			}
		if(searchResults[0].getValue(columns[4]) == 'T')
			{//customer is the same as the club!
			return -88888;
			}
		
		if(searchResults.length > 1)
			{
			nlapiLogExecution('ERROR', '##### GetClubCardNumber(ClubID) ERROR', searchResults.length + ' records were returned for ' + ClubID + '...assuming first record is correct. ' + Concat);			
			}
		
		TheCardNumber = searchResults[0].getValue(columns[1]); //We need the card number to be returned...
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'GetClubCardNumber Error:', e.message);
		return -77777;
	}

	return TheCardNumber;
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