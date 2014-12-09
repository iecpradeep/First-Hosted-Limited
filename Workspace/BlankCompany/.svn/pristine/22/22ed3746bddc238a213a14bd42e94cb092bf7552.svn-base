/*************************************************************************
 * Name: portalIframe.js
 * Script Type: Inline HTML Portlet
 * Client: Demo Company
 * 
 * Version: 1.0.0 - 20th September 2012 - Initial release - PAL
 * 
 * Author: FHL
 * Purpose: Creates an IFrame inside an Inline HTML Portlet, and displays the page within it.
 *  
 * Script: customscript_xxx
 * Deploy: customdeploy_xxx
 *   
 * 
 **************************************************************************/

var isProduction = true;
var contentURL = 'https://www.google.co.uk/adwords';
var portletTitle = 'Google Adwords Portal';

function showPortlet(portlet, column)
{
var show = true;
var where = 'showPortlet';
log(show, where, '***** start ****');
log(show, where, 'isProduction=' + isProduction + ';contentURL=' + contentURL);

try
{
log(show, where, 'suiteletURL=' + contentURL);
portlet.setTitle(portletTitle);

var a = [];
a.push('<table width="100%">');
a.push('	<tr>');
a.push('	 <td width="100%" align="left">');
a.push('	 <iframe align="left" style="width: 100%; height: 400px; margin: 0pt; border: 0pt none; padding: 0pt;" src="' + contentURL + '"></iframe>');
a.push('	 </td>');
a.push('	</tr>');
a.push('</table>');

// trim leading/trailing spaces/tabs from each node string
for (var i = 0; i < a.length; i++) {
a[i] = a[i].replace(/(^(\s|\t)*|(\s|\t)*$)/g, '');
}

// concatenate node strings into one large xml string
var content = a.join('');
//log(show, where, 'content=' + content);

// set the content of the portlet
portlet.setHtml('<td><span>' + content + '</span><td>');
}
catch (ex)
{
log(show, where, 'Error: ' + ex.message);
}
finally
{
log(show, where, '***** End ****');
}	
}

function log(show, where, what)
{
if (where == null) { where = '';} 
if (what == null) { what = '';} 
if (show){ nlapiLogExecution('debug', where, what); }
}