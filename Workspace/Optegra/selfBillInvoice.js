/*******************************************************
 * Name:		interface for self bill invoices
 * Script Type:	Suitelet
 *
 * Version:	1.0.0 3/5/2012 - 1st release JM
 *
 * Author:	fhl
 * Purpose:	interface for self bill invoices
 * 
 * Script:	customscript_selfbillinvoices  
 * Deploy:	customdeploy_selfbillinvoices
 *******************************************************/

/**
 * @param request
 * @param response
 */
function selfBillInvoice(request, response)
{
   if ( request.getMethod() == 'GET' )
   {
        var form = nlapiCreateForm('Generate Self Bill Invoices');
        var fromdate = form.addField('fromdate','date', 'From Date');
        fromdate.setLayoutType('normal','startcol');
        
        var todate = form.addField('todate','date', 'To Date');
        fromdate.setLayoutType('normal','startcol');
        
        form.addSubmitButton('Generate Self Bill Invoices');
        response.writePage(form);
   }
   else
   {
	   // [todo]
   }

} 