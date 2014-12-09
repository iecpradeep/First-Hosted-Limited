var customPage = null;
var grpScript = null;
var outCome = null;
var outComeTwo = null;
var cutOffTime = null;
var daysToAdd = null;

//netsuite date
var serverDate = null;
var date = null;
var currentDay = null;

//gmt date
var gmtDay = null;
var gmtHours = null;
var gmtYear = null;
var gmtMonth = null;
var gmtDayOfWeek = null;


function suitelet()
{	
	customPage = nlapiCreateForm('Test');
	grpScript = customPage.addFieldGroup('scriptgroup', 'Script Information', null);
	outCome = customPage.addField('custpage_outcome', 'inlinehtml', 'Script Status', null, 'scriptgroup');
	outComeTwo = customPage.addField('custpage_outcometwo', 'inlinehtml', 'Script Status', null, 'scriptgroup');
	
	serverDate = new Date();
	date = new Date();
	
	date.setDate(16);
	
	outCome.setDefaultValue('Server time: ' + serverDate);

	// get UTC time
	gmtDayOfWeek = date.getUTCDay();
	gmtDay = date.getUTCDate();
	gmtYear = date.getUTCFullYear();
	gmtMonth = date.getUTCMonth();
	gmtHours = date.getUTCHours();
	
	getDeliveryDate();
	
	outComeTwo.setDefaultValue('Converted time: ' + date);
	
	response.writePage(customPage);
}

function getDeliveryDate()
{
	cutOffTime = 7;
	
	try
	{
		if(gmtHours > cutOffTime)
		{
			workOutDaysToAdd();
			date.setDate(gmtDay + daysToAdd);
		}
	}
	catch(e)
	{

	}
}

function workOutDaysToAdd()
{
	try
	{		
		switch(gmtDayOfWeek)
		{
		case 0: // sunday
			
			daysToAdd = 1;
			break;
		case 1: // monday
			
			daysToAdd = 1;
			break;
		case 2: // tuesday
			
			daysToAdd = 1;
			break;
		case 3: // wednesday
			
			daysToAdd = 1;
			break;
		case 4: // thursday
			
			daysToAdd = 1;
			break;
		case 5: // friday
			
			daysToAdd = 3;
			break;
		case 6: // saturday
			
			daysToAdd = 2;
			break;
			
		default:
			daysToAdd = 1;
			break;
			
		}
	}
	catch(e)
	{
		
	}
}


