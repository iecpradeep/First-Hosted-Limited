/*****************************************************************************
 *	Name		:	calculateKitpackAvgCost
 *	Script Type	:	user event - After Record Submit 
 *	Applies to 	: 	Kit/Package Item Record
 *	Client		: 	Destiny Entertainments
 *
 *	Version		:	1.0.0 - 23/04/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To calculate and set the average cost of kit/packages
 * 
 * 	Script		: customscript_kitpackavgcostcalc	
 * 	Deploy		: customdeploy_kitpackavgcostcalc  
 * 
 * 	Library		: library.js
 * 
 ***************************************************************************/

//declaring global variables 
var avgCostOfKit = 0.00;
var recordType = '';
var recordId = 0;


/**********************************************************************
 * calculateKitPackAvgCost Function - the main function
 * 
 **********************************************************************/
function calculateKitPackAvgCost(type)
{
	if(type == 'create' || type == 'edit')
	{
		//initialising the static variables use in the script
		initialise();
			
		//doing the processing
		process();
	}
	
}


/**********************************************************************
 * initialise Function - initialise the static variables use in the script
 * 
 **********************************************************************/
function initialise()
{
	try
	{
		recordId = nlapiGetRecordId();			//getting the current record internal id
		recordType = nlapiGetRecordType();		//getting the current record type

	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}



/**********************************************************************
 * process Function - call processing functions
 * 
 **********************************************************************/
function process()
{
	try
	{
		getMemberItemCost();			//calling getMemberItemCost function
		setAvgCost();					//calling setAvgCost function
		
	}
	catch(e)
	{
		errorHandler('process', e);
	}
}



/**********************************************************************
 * getMemberItemCost Function - get the member items an related records of the kit/package  
 * 
 **********************************************************************/
function getMemberItemCost()
{
	//declaring local variables
	var noOfMembers = 0;
	var itemIntId = 0;
	var itemQuantity = 0;
	var itemAvgCost = 0.00;
	
	
	try
	{
		noOfMembers = nlapiGetLineItemCount('member');				//getting the no of member items in the kit's members' list
		
		//looping through each member
		for(var i = 1; i <= noOfMembers; i++)
		{
			itemIntId = nlapiGetLineItemValue('member', 'item', i);							//getting  member item internal id
			itemQuantity = nlapiGetLineItemValue('member', 'quantity', i);					//getting member item quantity
			itemAvgCost = nlapiLookupField('item', itemIntId, 'averagecost');				//getting the 'Average Cost' from the member item record
			
			//if average cost is empty:
			if(itemAvgCost == '')
			{
				//set the average cost as 0
				itemAvgCost = 0.00;
			}	
			
			//calling the calculateAvgCost function
			calculateAvgCost(itemQuantity,itemAvgCost);
			
		}
		
	}
	catch(e)
	{
		errorHandler('getMemberItemCost', e);
	}
}



/**********************************************************************
 * calculateAvgCost Function - calculating the kit/package item cost depending on the member items 
 * 
 * @param memberItemQuantity	- no of particular items included in the kit/package 
 * @param memberItemAverageCost	- average cost of member item		
 **********************************************************************/
function calculateAvgCost(memberItemQuantity, memberItemAverageCost)
{
	var totalCostOfMemberItem = 0.00;
	
	try
	{
		memberItemAverageCost = parseFloat(memberItemAverageCost);				//passing the average cost to float for calculation purpose
		memberItemQuantity = parseInt(memberItemQuantity, 0);					//passing the average cost to float for calculation purpose
		totalCostOfMemberItem = memberItemQuantity * memberItemAverageCost;		//calculating the total cost of member item

		avgCostOfKit = parseFloat(avgCostOfKit) + parseFloat(totalCostOfMemberItem);	//calculating the average cost of the kit/package

	}
	catch(e)
	{
		errorHandler('calculateAvgCost', e);
	}

}




/**********************************************************************
 * setAvgCost Function - setting the 'Kit/Package Average Cost' field with the calculated cost of kit package
 *  
 **********************************************************************/
function setAvgCost(type)
{
	//var submittedRecord = null; 
	
	try
	{
		//passing the avgCostOfKit to float with two decimal points	
		avgCostOfKit = convertToFloat(avgCostOfKit);				
		
		//submitting the field
		nlapiSubmitField(recordType, recordId, 'custitem_kitpackavgcost', avgCostOfKit);
		
		
	}
	catch(e)
	{
		errorHandler('setAvgCost', e);
	}


}