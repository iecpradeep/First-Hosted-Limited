/*******************************************************
 * Name:		Aepona PR Release 2 (pr2_client.js)
 * Script Type:	Client
 * Version:		1.0.0
 * Version:		1.0.1 - 25/04/2013 - Modified the button label - SA
 * Version:		1.0.2 -  01/05/2013 - amended the PO send method  field disable - SA
 * Version:		1.0.3 -  31/05/2013 - amended get field value for contact id - SA
 * version:		1.0.4 -  01/07/2013 - added button for editing contact details - SA
 * version:		1.0.5 -  01/07/2013 - added programming standard, i.e defined variable on global - SA
 * version:		1.0.6 -  03/07/2013 - added a block to get environment and to set variable (urls)  accordingly  - SA
 * Version:     1.1.7 -  04/07/2013 - Added try catch block - SA
 * Version:     1.1.8 -  04/07/2013 - Added a function 'onSave', it compares the send to field and required information field - SA
 * Version:     1.1.9 -  05/07/2013 - Added a filter as to display alert only if save button = submit for approval- SA
 * 
 * Script: 		customscript_prclient    
 * Deploy: 		customdeploy_prclient
 * 
 * Date:		25 March 2013
 * Author:		FHL
 *******************************************************/


var context = null;

var yes = '1';
var no = '2';

var afterSaveSubmit = '1';
var afterSaveDraft = '2';

var currentDomain = '';
var editImgURI = '';
var newImgURI = '';

var editContactScriptURI = '';
var createContactScriptURI = '';
var sendToSupplierScriptURI = '';
var supplierScriptURI = '';

var projectrelated = '';
var prtype = '';

var item = '';
var help = '';
var supplierId = '';

var address = '';
var billaddress = '';
var selection = '';

var savedasdraft = '';

var sendtosupplier = '';
var realcontactid = '';
var billselection = '';
var contactId = '';
var createContactLink = '';
var contactLink = '';
var fieldHTML = '';

var confirmValue = false;

var firstapprover = '';
var secondapprover = '';

var contactvalue = '';
var sendmethod = '';
var contactemail = '';
var supplieremail = '';
var contactfax = '';
var supplierfax = '';
var realcontactid = '';

var contactaddress = '';
var supplieraddress = '';

var billadrressList = '';

var disallowedPRIssueToOption = 8;
var contactViaPost = '1';
var contactViaEmail = '2';
var contactViaFax = '3';
var supplierViaPost = '4';
var supplierViaEmail = '5';
var supplierViaFax = '6';
var doNotIssue = '7';

initialiseVariables();

/*******************
// version:		1.0.6 -  03/07/2013 - added a block to get environment and to set variable (urls)  accordingly  - SA
 ********************/
function initialiseVariables()
{
	try
	{
		context = nlapiGetContext();
		switch(context.getEnvironment())
		{
		case 'SANDBOX':
			currentDomain = 'https://system.sandbox.netsuite.com';

			editContactScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=83&deploy=1&compid=1246650&CID=';
			createContactScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=119&deploy=1&compid=1246650&SID=';
			sendToSupplierScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=84&deploy=1&compid=1246650&SID=';
			supplierScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=110&deploy=1&custpage_supplierid=';

			editImgURI = currentDomain + '/core/media/media.nl?id=12059&c=1246650&h=4c44d4c3e6d191a43783';
			newImgURI = currentDomain + '/core/media/media.nl?id=12058&c=1246650&h=f87478c938137d89902f';

			break;
		case 'PRODUCTION':
			currentDomain = 'https://system.netsuite.com';

			editContactScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=83&deploy=1&compid=1246650&CID=';
			createContactScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=119&deploy=1&compid=1246650&SID=';
			sendToSupplierScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=84&deploy=1&compid=1246650&SID=';
			supplierScriptURI = currentDomain + '/app/site/hosting/scriptlet.nl?script=110&deploy=1&custpage_supplierid=';

			editImgURI = currentDomain + '/core/media/media.nl?id=12059&c=1246650&h=4c44d4c3e6d191a43783';
			newImgURI = currentDomain + '/core/media/media.nl?id=12058&c=1246650&h=f87478c938137d89902f';

			break;
		}


	}
	catch(e)
	{
		errHandler('initialiseVariables', e);
	}


}


/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function onChange(type, name)
{

	try
	{
		if (type == 'item' && name == 'item')
		{
			item = nlapiGetCurrentLineItemValue('item','item');
			if (item != '' && item != null)
			{
				help = nlapiLookupField('customrecord_pr_item_help',item,'custrecord_pr_help_help');
				nlapiSetFieldValue('custbody_help',help,false,false);
			}//end if
		}//end if

		/***************************************
		 * 
		 *	Unreachable code
		 *	if (type == 'item' && name == 'item')
		 *	{
		 *		nlapiSetCurrentLineItemValue('item','rate',0.00,false,true);
		 *		nlapiSetCurrentLineItemValue('item','tax1amt',0.00,false,true);
		 *		nlapiSetCurrentLineItemValue('item','grossamt',0.00,false,true);
		 *		//nlapiSetCurrentLineItemValue('item','taxrate1',0.00,false,true);
		 *		nlapiSetCurrentLineItemValue('item','amount',0.00,false,true);
		 *		//nlapiSetFieldValue('custbody_prquoteref', '');
		 *	} 
		 ***********************************/



		if (name == 'entity')
		{
			supplierId = nlapiGetFieldValue('entity');
			// 1.0.1 -modified the button label
			//var supplierLink = '<input type="button" value="Edit Supplier Contact Details" onclick="editSupplier(' + supplierId + ')"></html>';
			fieldHTML = '<html><tr><align="right"><span><td nowrap="" align="left" class="smallgraytextnolink"><span class="smallgraytextnolink"><a class="smallgraytextnolink" tabindex="-1" style="cursor:help">Edit Supplier Details</a>&nbsp;</span></td><td align="right"><img value="Edit" src="' + editImgURI +  '" onclick="editSupplier(' + supplierId + ')"></td></span></align></tr></html>';

			createContactLink = '<html><tr><align="right"><span><td nowrap="" align="left" class="smallgraytextnolink"><span class="smallgraytextnolink"><a class="smallgraytextnolink" tabindex="-1" style="cursor:help">Create New Contact</a>&nbsp;</span></td><td align="right"><img value="New" src="' + newImgURI + '" onclick="createContact(' + supplierId + ')"></td></span></align></tr></html>';
			nlapiSetFieldValue('custbody_editsuppliercontactdetails',fieldHTML,false,true);
			nlapiSetFieldValue('custbody_createnewcontact',createContactLink,false,true);

		} 

		// 1.0.4 -  01/07/2013 - added button for editing the contact details - SA
		if (name == 'custbody_prsuppliercontactselect')
		{
			contactId = nlapiGetFieldValue('entity');
			fieldHTML = '<html><tr><align="right"><span><td nowrap="" align="left" class="smallgraytextnolink"><span class="smallgraytextnolink"><a class="smallgraytextnolink" tabindex="-1" style="cursor:help">Edit Contact Details</a>&nbsp;</span></td><td align="right"><img value="Edit" src="' + editImgURI +  '" onclick="editContact(' + contactId + ')"></td></span></align></tr></html>';
			nlapiSetFieldValue('custbody_editcontactdetails',fieldHTML,false,true);

		}

		if (name == 'custbody_shipselect')
		{
			selection = nlapiGetFieldValue('custbody_shipselect');

			if (selection != null && selection != '' && selection != disallowedPRIssueToOption)
			{
				address = nlapiLookupField('customrecord_prshippingaddress',selection,'custrecord_address');
				nlapiSetFieldValue('custbody_prshipaddress',address,false,false);
				nlapiDisableField('custbody_prshipaddress', true);
			} 
			else
			{
				nlapiSetFieldValue('custbody_prshipaddress','',false,false);
				nlapiDisableField('custbody_prshipaddress', false);
			} 

		} 

		if (name == 'custbody_pr_aepona_billto')
		{
			billselection = nlapiGetFieldValue('custbody_pr_aepona_billto');
			if (billselection != null && billselection != '')
			{
				billaddress = nlapiLookupField('customrecord_pr_billing_address',billselection,'custrecord_bill_address');
				nlapiSetFieldValue('custbody_prbillingaddress',billaddress,false,false);
				nlapiDisableField('custbody_prbillingaddress', true);
			} 
			else
			{
				nlapiSetFieldValue('custbody_prbillingaddress','',false,false);
				nlapiDisableField('custbody_prbillingaddress', false);
			}
		} 
		if (name == 'custbody_sendtosupplier')
		{
			var sendtosupplier = nlapiGetFieldValue('custbody_sendtosupplier');
			if (sendtosupplier == contactViaFax)
			{
				//nlapiDisableField('custbody_suppliersendmethod', true);
				nlapiSetFieldValue('custbody_suppliersendmethod', '', false, true);
			} 
			else
			{
				nlapiDisableField('custbody_suppliersendmethod', false);
			} 
		} 

		if (name == 'custbody_sendtosupplier' || name == 'custbody_suppliersendmethod')//send method and recipient combo
		{
			nlapiLogExecution('error', 'test2', 'test2');
			sendtosupplier = nlapiGetFieldValue('custbody_sendtosupplier');
			contactvalue = nlapiGetFieldValue('custbody_pr_contact');
			sendmethod = nlapiGetFieldValue('custbody_suppliersendmethod');
			contactemail = nlapiGetFieldValue('custbody_pr_contact_email');
			supplieremail = nlapiGetFieldValue('custbody_pr_supplier_email');
			contactfax = nlapiGetFieldValue('custbody_pr_contact_fax');
			supplierfax = nlapiGetFieldValue('custbody_pr_supplier_fax');

			// Version:		1.0.3 - amended get field value for contact id - SA
			realcontactid = nlapiGetFieldValue('custbody_prsuppliercontactselect');

			contactaddress = nlapiGetFieldValue('custbody_prsuppliercontactaddress');
			supplieraddress = nlapiGetFieldValue('billaddress');
			supplierid = nlapiGetFieldValue('entity');

			billadrressList = nlapiGetFieldValue('billaddresslist');
			nlapiLogExecution('error', 'realcontactid', realcontactid);


			if (sendtosupplier == contactViaPost && (contactaddress == '' || contactaddress == null)) //Contact Via Hard Copy (Post)
			{
				confirmValue = confirm('There is no Postal Address for this Contact or you have not yet selected a Contact\n\nClick OK to edit the Contact in Pop Up Window\n\nClick Cancel to continue entering information on this Form.');
				if (confirmValue == true)
				{
					window.open(editContactScriptURI + realcontactid + '&SID=' + supplierid, '_blank', "dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
				}
			} 

			if (sendtosupplier == contactViaEmail && (contactemail == '' || contactemail == null)) //Contact Via Email
			{
				confirmValue = confirm('There is no Email Address for this Contact or you have not yet selected a Contact\n\nClick OK to edit the Contact in Pop Up Window\n\nClick Cancel to continue entering information on this Form');
				if (confirmValue == true)
				{
					window.open(editContactScriptURI + realcontactid + '&SID=' + supplierid, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
				}
			} 

			if (sendtosupplier == contactViaFax && (contactfax == '' || contactfax == null)) //Contact Via Fax
			{
				confirmValue = confirm('nnThere is no Fax Number for this Contact or you have not yet selected a Contact\n\nClick OK to edit the Contact in Pop Up Window\n\nClick Cancel to continue entering information on this Form');
				if (confirmValue == true)
				{
					window.open(editContactScriptURI + realcontactid + '&SID=' + supplierid, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
				}
			} 


			if (sendtosupplier == supplierViaPost && supplieraddress == '') //Supplier Via Hard Copy (Post)
			{
				confirmValue = confirm('There is no Postal Address for this Supplier or you have not yet selected a Supplier\n\nClick OK to edit the Supplier in Pop Up Window\n\nClick Cancel to continue entering information on this Form');
				if (confirmValue == true)
				{
					window.open(sendToSupplierScriptURI + supplierid + '&billadrressIntID=' + billadrressList, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
				}						
			} 

			if (sendtosupplier == supplierViaEmail && supplieremail == '') //Supplier Via Email
			{
				confirmValue = confirm('There is no Email Address for this Supplier or you have not yet selected a Supplier\n\nClick OK to edit the Supplier in Pop Up Window\n\nClick Cancel to continue entering information on this Form');
				if (confirmValue == true)
				{
					window.open(sendToSupplierScriptURI + supplierid + '&billadrressIntID=' + billadrressList, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
				}						
			} 

			if (sendtosupplier == supplierViaFax && supplierfax == '') //Supplier Via Fax
			{
				confirmValue = confirm('There is no Fax Number for this Supplier or you have not yet selected a Supplier\n\nClick OK to edit the Supplier in Pop Up Window\n\nClick Cancel to continue entering information on this Form');
				if (confirmValue == true)
				{
					window.open(sendToSupplierScriptURI + supplierid + '&billadrressIntID=' + billadrressList, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
				}
			} 
		} //end send method and recipient combo if



		if (name == 'custbody_projectrelated')
		{
			projectrelated = nlapiGetFieldValue('custbody_projectrelated');

			if (projectrelated == no) //project related = NO
			{
				nlapiDisableLineItemField('item', 'customer', true);
				nlapiDisableLineItemField('item', 'custcol_prcustomerlist', true);
				nlapiDisableLineItemField('item', 'custcol_prprojectlist', true);

				nlapiSetCurrentLineItemValue('item','customer','',false,true);
				nlapiSetCurrentLineItemValue('item','custcol_prcustomerlist','',false,true);
				nlapiSetCurrentLineItemValue('item','custcol_prprojectlist','',false,true);
			} 
			if (projectrelated == yes)
			{
				nlapiDisableLineItemField('item', 'customer', false);
				nlapiDisableLineItemField('item', 'custcol_prcustomerlist', false);
				nlapiDisableLineItemField('item', 'custcol_prprojectlist', false);
			}
		}

		if (name == 'custbody_prdepartment')
		{
			var prdepartment = nlapiGetFieldValue('custbody_prdepartment');
			if (prdepartment != null && prdepartment != '')
			{
				nlapiSetFieldValue('department',prdepartment,false,false);
			} 
			else
			{
				nlapiSetFieldValue('department','',false,false);
			} 
		} 
		if (name == 'custbody_prtype')
		{
			prtype = nlapiGetFieldValue('custbody_prtype');
			if (prtype != null && prtype != '')
			{
				firstapprover = nlapiLookupField('customrecord_prapprovals',prtype,'custrecord_prapprovalfirstapprover');
				nlapiSetFieldValue('custbody_prfirstapprover',firstapprover,false,false);

				secondapprover = nlapiLookupField('customrecord_prapprovals',prtype,'custrecord_prapprovalsecondapprover');
				nlapiSetFieldValue('custbody_prsecondapprover',secondapprover,false,false);
			} 
		}

	}
	catch(e)
	{
		errHandler('onChange', e);
	}


	return true;
} //function


/**
 * @param type
 * @param name
 */
function postSourcing(type,name)
{ 
	try
	{

		projecterelated = nlapiGetFieldValue('custbody_projectrelated');

		if (type == 'item' && name == 'item')
		{
			nlapiSetCurrentLineItemValue('item','rate',0.00,false,true);
			nlapiSetCurrentLineItemValue('item','tax1amt',0.00,false,true);
			nlapiSetCurrentLineItemValue('item','grossamt',0.00,false,true);
			//	nlapiSetCurrentLineItemValue('item','taxrate1',0.00,false,true);
			nlapiSetCurrentLineItemValue('item','amount',0.00,false,true);
			//	nlapiSetFieldValue('custbody_prquoteref', '');
		} //end if
		if (type == 'item' && name == 'item' && projecterelated == no)
		{
			//alert(projecterelated);
			nlapiDisableLineItemField('item','custcol_prcustomerlist',true);
			nlapiDisableLineItemField('item','custcol_prprojectlist',true);
		} //end if

		if (type == 'item' && name == 'item' && projecterelated == yes)
		{
			nlapiDisableLineItemField('item','custcol_prcustomerlist',false);
			nlapiDisableLineItemField('item','custcol_prprojectlist',false);
		} //end if


	}
	catch(e)
	{
		errHandler('postSourcing', e);
	}
} //function


/**
 * Version:		1.0.2 -  01/05/2013 - amended the PO send method  field disable - SA
 */
function onLoad()
{
	try
	{
		nlapiDisableLineItemField('item', 'tax1amt', true);
		nlapiDisableLineItemField('item', 'grossamt', true);
		nlapiDisableLineItemField('item', 'taxrate1', true);
		nlapiDisableLineItemField('item', 'taxcode', true);
		nlapiDisableLineItemField('item', 'amount', true);


		sendtosupplier = nlapiGetFieldValue('custbody_sendtosupplier');
		savedasdraft = nlapiGetFieldValue('custbody_pr_submitforreview');

		// 1.0.2 -  if save button field is submit for approval then disable the field, i.e only PR requestor can set the PO send method. '1' = submit for approval.
		if (savedasdraft == afterSaveSubmit)
		{
			nlapiDisableField('custbody_suppliersendmethod', true);
		} //end if
		else
		{
			nlapiDisableField('custbody_suppliersendmethod', false);
		} //else

	}
	catch(e)
	{
		errHandler('onLoad', e);
	}

} //function


/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function validateLine(type,name)
{
	var projectselect = nlapiGetCurrentLineItemValue('item','custcol_prprojectlist');
	var linedesc = nlapiGetCurrentLineItemValue('item','description');
	var projecterelated2 = nlapiGetFieldValue('custbody_projectrelated');
	var ddproject = nlapiGetCurrentLineItemValue('item','custcol_prprojectlist');
	if (type == 'item' && projecterelated2 == yes && projectselect == '')
	{
		alert("Please select a Customer and Project");
		return false;
	} //end if

	/*		if (type == 'item' && projecterelated2 == 'No')
		{
			alert('You have selected Project Related as NO, Customer and Project details will be removed! Please re edit this line if necessary');
			nlapiSetCurrentLineItemValue('item', 'custcol_prcustomerlist', '');
			nlapiSetCurrentLineItemValue('item', 'custcol_prprojectlist', '');
			nlapiSetCurrentLineItemValue('item', 'custcol_prprojectlist_display', '');
			return true;		
		} //end if
	 */
	nlapiSetFieldValue('custbody_help','',false,false);
	nlapiSetCurrentLineItemValue('item','customer',ddproject);
	return true;
}




//function
///**
//* @returns {Boolean}
//*/
//function onSave()
//{
//var sendtosupplier = nlapiGetFieldText('custbody_sendtosupplier');
//var sendmethod = nlapiGetFieldValue('custbody_suppliersendmethod');
//var suppliercontactemail = nlapiGetFieldValue('custbody_prsuppliercontactemail');
//var supplieremail = nlapiGetFieldValue('custbody_prsupplieremail').length;
//var suppliercontactfax = nlapiGetFieldValue('custbody_prsuppliercontactfax');
//var supplierfax = nlapiGetFieldValue('custbody_prsupplierfax');
//var shipaddressselect = nlapiGetFieldValue('custbody_shipselect');
//var shipaddress = nlapiGetFieldValue('custbody_prshipaddress');
//if (sendtosupplier != 'Do Not Issue' && (sendmethod =='' || sendmethod == null))
//{
//alert("Please select a method to send this PR to the Supplier");
//return false;
//} //end if
//if (shipaddressselect == 8 && (shipaddress == '' || shipaddress == null))
//{
//alert("Please provide a Custom Ship Address or select a standard address from the list");
//return false;				
//}//end if
//else
//{
//return true;
//}

//if (sendtosupplier == 1 && sendmethod == 3 && suppliercontactemail < 1)
//{
//alert("You need to enter a Contact Email Address");
//return false;				
//}//end if
//else
//{
//return true;
//}
//}//function


/*******************************
 *function onSave()
 *
 * @returns {Boolean}
 *
 *Version:     1.1.8 -  04/07/2013 - Added a function 'onSave', it compares the send to field and required information field - SA
 *Version:     1.1.9 -  05/07/2013 - Added a filter as to display alert only if save button = submit for approval- SA
 ********************************/

function onSave()
{	
	try
	{
		

		sendtosupplier = nlapiGetFieldValue('custbody_sendtosupplier');
		contactvalue = nlapiGetFieldValue('custbody_pr_contact');
		//sendmethod = nlapiGetFieldValue('custbody_suppliersendmethod');
		contactemail = nlapiGetFieldValue('custbody_pr_contact_email');
		supplieremail = nlapiGetFieldValue('custbody_pr_supplier_email');
		contactfax = nlapiGetFieldValue('custbody_pr_contact_fax');
		supplierfax = nlapiGetFieldValue('custbody_pr_supplier_fax');

		contactaddress = nlapiGetFieldValue('custbody_prsuppliercontactaddress');
		supplieraddress = nlapiGetFieldValue('billaddress');
		
		//Version: 1.1.9  Added a filter as to display alert only if save button = submit for approval- SA
		savedasdraft = nlapiGetFieldValue('custbody_pr_submitforreview');

		if (sendtosupplier == contactViaPost && (contactaddress == '' || contactaddress == null) && savedasdraft == afterSaveSubmit) //Contact Via Hard Copy (Post)
		{
			alert("You need to enter a Contact Address");
			return false;
		} 

		if (sendtosupplier == contactViaEmail && (contactemail == '' || contactemail == null) && savedasdraft == afterSaveSubmit) //Contact Via Email
		{
			alert("You need to enter a Contact Email Address");
			return false;
		} 

		if (sendtosupplier == contactViaFax && (contactfax == '' || contactfax == null) && savedasdraft == afterSaveSubmit) //Contact Via Fax
		{
			alert("You need to enter a Contact Fax Number");
			return false;
		} 

		if (sendtosupplier == supplierViaPost && supplieraddress == '' && savedasdraft == afterSaveSubmit) //Supplier Via Hard Copy (Post)
		{
			alert("You need to enter a Supplier Address");
			return false;						
		} 

		if (sendtosupplier == supplierViaEmail && supplieremail == '' && savedasdraft == afterSaveSubmit) //Supplier Via Email
		{
			alert("You need to enter a Supplier Email Address");
			return false;						
		} 

		if (sendtosupplier == supplierViaFax && supplierfax == '' && savedasdraft == afterSaveSubmit) //Supplier Via Fax
		{
			alert("You need to enter a Contact Fax Number");
			return false;
		} 

		if (sendtosupplier == doNotIssue && savedasdraft == afterSaveSubmit) //if do not issue and when save button pressed = submit for approval
		{
			alert("Please select a Send To method");
			return false;
		} 
		
		else
			{
			
			return true;
			}

	}
	catch(e)
	{
		errHandler('onSave', e);
	}
} 

/**
 * @param supplierId
 * @returns {Boolean}
 */
function editSupplier(supplierId)
{
	try
	{
		window.open(supplierScriptURI + supplierId,"_blank","dependant=yes,height=200,width=400,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");

	}
	catch(e)
	{
		errHandler('editSupplier', e);
	}

	return true;
}  

/**
 * @param supplierId
 * @returns {Boolean}
 * Version:		1.0.3 - amended get field value for contact id - SA
 */
function editContact(contactId)
{
	try
	{
		// Version:		1.0.3 - amended get field value for contact id - SA
		realcontactid = nlapiGetFieldValue('custbody_prsuppliercontactselect');
		supplierid = nlapiGetFieldValue('entity');
		window.open(editContactScriptURI + realcontactid + '&SID=' + supplierid, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");

	}
	catch(e)
	{
		errHandler('editContact', e);
	}
} 

/**
 * @param supplierId
 * @returns {Boolean}
 * 
 */
function createContact(supplierId)
{
	try
	{
		window.open(createContactScriptURI + supplierId, '_blank',"dependant=yes,height=600,width=1100,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");
	}
	catch(e)
	{
		errHandler('createContact', e);
	}
}



/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * Version:     1.1.7 -  04/07/2013 - Added try catch block - SA
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}
