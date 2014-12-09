

function prospectinit(type, form)
{
   
	
	
	
	if (type == 'view')
   	{

		
      		form.addButton('custpage_bookdemobutton','Book Demonstration','bookdemo()');
   	}
}

function bookdemo()
{

	nlapiRequestURL('https://system.netsuite.com/app/crm/calendar/event.nl?whence=&cf=6',null,a,null,'popup');

}