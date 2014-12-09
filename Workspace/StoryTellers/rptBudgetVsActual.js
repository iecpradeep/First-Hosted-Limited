/************************************************************************************************
 * Name:			Budget vs Actual Dashboard Portlet (rptBudgetVsActual.js)
 * Script Type:		Portlet
 * Client:			The Storytellers
 *
 * Version:	1.0.0 - 15 Aug 2012 - first release - MJL
 *
 * Author:	FHL
 * Purpose:	Creates an iframe that displays the standard Budget vs. Actual report on a Dashboard
 ************************************************************************************************/

/**
 * Creates the portlet
 * 
 * @param {nlobjPortlet} portlet Current portlet object
 * @param {Number} column Column position index: 1 = left, 2 = middle, 3 = right
 * @returns {Void}
 */
function htmlPortlet(portlet, column) 
{
    portlet.setTitle('Budget vs. Actual');
    var contentURL = '/app/reporting/reportrunner.nl?cr=-197&whence=';
//    var html = [
//        '<table>',
//            '<tr>',
//                '<td width="100%" align="left">',
//            	'<iframe align="left" style="width: 1525px; height: 600px; margin: 0pt; border: 0pt none; padding: 0pt;" src="' + contentURL + '"></iframe>',
//            	'</td>',
//            '</tr>',
//        '</table>'
//    ];
    
	  var html = [
	      '<div>',
	      '<iframe align="left" style="width: 1525px; height: 600px; margin: 0pt; border: 0pt none; padding: 0pt;" src="' + contentURL + '"></iframe>',
	      '</div>'
	  ];
    
    for (var i = 0; i < html.length; i++)
	{
		html[i] = html[i].replace(/(^(\s|\t)*|(\s|\t)*$)/g, '');
	}
    
    portlet.setHtml(html.join(''));
}
