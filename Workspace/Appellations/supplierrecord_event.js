
var supplierid = 0;
var startSPL = '';
var printBtn = '';

	
/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Boolean}
 */
function beforeLoad(type, form, request)
{
	var retVal = true;
	
	supplierid = nlapiGetRecordId();
	startSPL = "window.open('"+"/app/site/hosting/scriptlet.nl?script=56&deploy=1&compid=1336541&SID="+ supplierid+"')";;
    printBtn = form.addButton('custpage_startspl', 'Generate Supplier Packing List', startSPL);
    
    return retVal;
}
