/*****************************************************
 * Title	:	Edgecumbe Project Stats
 * Version	:	1.1
 * Date		:	19 May 2011
 * Type:	:	User Event Script
 * Author	:	FHL
 * Purpose	:	Calculate stats for project records
 * Applies	:	Project Record
 */

function onLoad(type)
{
	
	if (type == 'view' || type == 'edit')
	{
		
	
		//get current project ID
		var project = nlapiGetFieldValue('id');
		var projectid = nlapiGetFieldValue('entityid');
	
	
	
	//Sales Order Values...
	
		//construct search filters and columns
		var salesOrderSearchFilters = new Array();
		var salesOrderSearchColumns = new Array();
		
		salesOrderSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'F');
		salesOrderSearchFilters[1] = new nlobjSearchFilter('entity', null, 'anyof', project);
		
		salesOrderSearchColumns[0] = new nlobjSearchColumn('amount');
		
		//salesOrderSearchColumns[1] = new nlobjSearchColumn('internalid','jobmain');
		
		salesOrderSearchColumns[1] = new nlobjSearchColumn('internalid');
	
		// perform search
		var salesOrderSearchResults = nlapiSearchRecord('salesorder', null, salesOrderSearchFilters, salesOrderSearchColumns);
		
		var soTotal = 0.00;
		
		var soID = '';
		
		
		if (salesOrderSearchResults)
		{
			
			for (var j=0; j<salesOrderSearchResults.length; j++)
			{
				
				soTotal += parseFloat(salesOrderSearchResults[j].getValue(salesOrderSearchColumns[0]));
			
		
			if (salesOrderSearchResults[j].getValue(salesOrderSearchColumns[1]).length > 1)
			{
				
				soID = 'https://system.netsuite.com/app/accounting/transactions/salesord.nl?id=' + salesOrderSearchResults[j].getValue(salesOrderSearchColumns[1]);
			}
			
			} //for
					
		} //if
	
		// set body field value.  Note project record has internal id JOB
		nlapiSubmitField('job',project,'custentity_salesordersum',soTotal);	
		
		nlapiSubmitField('job',project,'custentity_salesorderid',soID);	
				
//#############################
//ProjectTask values................................
//#############################
		
				//construct search filters and columns
		var projectTaskSearchFilters = new Array();
		var projectTaskSearchColumns = new Array();
		
		//projectTaskSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'F');
		projectTaskSearchFilters[0] = new nlobjSearchFilter('project', null, 'anyof', project);
		
		projectTaskSearchColumns[0] = new nlobjSearchColumn('custevent_projecttaskfee');
	
		// perform search
		var projectTaskSearchResults = nlapiSearchRecord('projecttask', null, projectTaskSearchFilters, projectTaskSearchColumns);
		
		var prTotal = 0.00;
		
		if (projectTaskSearchResults)
		{
			
			for (var j=0; j<projectTaskSearchResults.length; j++)
			{
				
				prTotal += parseFloat(projectTaskSearchResults[j].getValue(projectTaskSearchColumns[0]));
			
				
			} //for
					
		} //if
	
		// set body field value.  Note project record has internal id JOB
		nlapiSubmitField('job',project,'custentity_projectsum',prTotal);	

	}
	

	return true;

	
} //function onLoad()