/*************************************************************************************
 * Name:		pr2_NewContactSuitlet.js
 * Script Type:	Suitlet
 *
 * Version:		1.0.0    - 02/07/2013 - First Release - SA
 * version:		1.0.1   - 04/07/2013  - Amended - Added try catch block - SA
 * 
 *
 * Author:		[FHL]
 * 
 * Purpose:		clientscript calls this suitlet, when click on custom button (create new contact), form will pop and it will create a new contact record.
 * 
 * Script: 		customscript_prnewcontactsuitelet  
 * Deploy: 		customdeploy_prnewcontactsuitle
 * 
 * Notes:		[todo - deployment details i.e. form associated etc]
 * 
 * Library: 	Libary.js
 *************************************************************************************/
function createContact(request,response)
{
	try
	{
		if ( request.getMethod() == 'GET' )
		{

			var SupplierID = request.getParameter('SID');

			var SupplierName = nlapiLookupField('vendor', SupplierID, 'entityid');
			var Subsidiary = nlapiLookupField('vendor', SupplierID, 'subsidiary');
			var SubsidiaryCountry = nlapiLookupField('subsidiary', Subsidiary, 'country');
			var SubsidiaryName = nlapiLookupField('subsidiary', Subsidiary, 'name');

			var Contactform = nlapiCreateForm("New Contact");
			var headergroup = Contactform.addFieldGroup( 'headerfieldgroup', 'Contact');

			var detailsgroup = Contactform.addFieldGroup( 'detailsfieldgroup', 'Email | Phone | Fax');
			var addressgroup = Contactform.addFieldGroup( 'addressfieldgroup', 'Address');

			var frmContactSalutation = Contactform.addField('custpage_salutation', 'text', 'Mr./Ms...', null, 'headerfieldgroup');
			frmContactSalutation.setLayoutType('startrow','startrow');
			var frmContactFirstName = Contactform.addField('custpage_firstname', 'text', 'First Name', null, 'headerfieldgroup');
			frmContactFirstName.setMandatory(true);
			var frmContactLastName = Contactform.addField('custpage_lastname', 'text', 'Last Name', null, 'headerfieldgroup');
			frmContactFirstName.setLayoutType('normal', 'startcol');
			var frmSupplierName = Contactform.addField('custpage_suppliername', 'select', 'Supplier', null, 'headerfieldgroup');
			frmSupplierName.setDefaultValue(SupplierName);
			frmSupplierName.setLayoutType('normal', 'startcol');
			frmSupplierName.addSelectOption(SupplierID, SupplierName);

			var frmSubsidiaryName = Contactform.addField('custpage_subsidiary', 'select', 'Subsidiary', null, 'headerfieldgroup')
			frmSubsidiaryName.setDefaultValue(SubsidiaryName);	
			frmSubsidiaryName.addSelectOption(Subsidiary, SubsidiaryName);

			var frmConatctEmail = Contactform.addField('custpage_contactemail', 'email', 'E Mail', null, 'detailsfieldgroup');
			var frmContactPhone = Contactform.addField('custpage_contactphone', 'phone', 'Phone', null, 'detailsfieldgroup');
			var frmContactFax = Contactform.addField('custpage_contactfax', 'phone', 'Fax', null, 'detailsfieldgroup');
			var frmAddLabel = Contactform.addField('custpage_addlabel', 'text', 'Label', null, 'addressfieldgroup');
			var frmAddAttention = Contactform.addField('custpage_addattention', 'text', 'Attention', null, 'addressfieldgroup');
			var frmAddAddressee = Contactform.addField('custpage_addaddressee', 'text', 'Addressee', null, 'addressfieldgroup');


			var frmAddPhone = Contactform.addField('custpage_addphone', 'phone', 'Phone', null, 'addressfieldgroup');
			var frmAdd1 = Contactform.addField('custpage_addaddress1', 'text', 'Address 1', null, 'addressfieldgroup');
			var frmAdd2 = Contactform.addField('custpage_addaddress2', 'text', 'Address 2', null, 'addressfieldgroup');
			var frmAdd3 = Contactform.addField('custpage_addaddress3', 'text', 'Address 3', null, 'addressfieldgroup');
			var frmAddCity = Contactform.addField('custpage_addcity', 'text', 'City', null, 'addressfieldgroup');
			var frmAddCSP = Contactform.addField('custpage_addcsp', 'text', 'County/State/Province', null, 'addressfieldgroup');
			var frmAddPC = Contactform.addField('custpage_addpostcode', 'text', 'Post Code', null, 'addressfieldgroup');
			var frmAddCountry = Contactform.addField('custpage_addcountry', 'select', 'Country', null, 'addressfieldgroup');

			var countrySearchColumns = new Array();

			countrySearchColumns[0] = new nlobjSearchColumn('name');
			countrySearchColumns[1] = new nlobjSearchColumn('internalid');
			countrySearchColumns[2] = new nlobjSearchColumn('custrecord_matchid');

			var countrySearchResults = nlapiSearchRecord('customrecord_pr_countires', null, null, countrySearchColumns);

			if (countrySearchResults != null)
			{                                              

				for (var i = 0; i < countrySearchResults.length; i++)
				{ 
					frmAddCountry.addSelectOption(countrySearchResults[i].getValue(countrySearchColumns[2]),countrySearchResults[i].getValue(countrySearchColumns[0]));
					frmAddCountry.setDefaultValue(SubsidiaryCountry);
				}         
			}


			Contactform.addSubmitButton('Save');
			response.writePage(Contactform);	

		}	

		else
		{	
			var SupplierName = request.getParameter('custpage_suppliername');
			var ContactSalutation = request.getParameter('custpage_salutation');
			var ContactFirstName = request.getParameter('custpage_firstname');
			var ContactLastName = request.getParameter('custpage_lastname');
			var contactSubsidiary = request.getParameter('custpage_subsidiary')
			var contactFullName = String(ContactFirstName) + String(ContactLastName);

			var ContactEmail = request.getParameter('custpage_contactemail');
			var ContactPhone = request.getParameter('custpage_contactphone');	
			var ContactFax = request.getParameter('custpage_contactfax');
			var AddLabel = request.getParameter('custpage_addlabel');
			var AddAttention = request.getParameter('custpage_addattention');
			var AddAddressee = request.getParameter('custpage_addaddressee');
			var AddPhone = request.getParameter('custpage_addphone');
			var Add1 = '';
			var Add2 = '';
			var Add3 = '';
			var AddCity = '';
			var AddCSP = '';
			var AddPC = '';
			var AddCountry = '';

			Add1 = request.getParameter('custpage_addaddress1');
			Add2 = request.getParameter('custpage_addaddress2');
			Add3 = request.getParameter('custpage_addaddress3');
			AddCity = request.getParameter('custpage_addcity');
			AddCSP = request.getParameter('custpage_addcsp');
			AddPC = request.getParameter('custpage_addpostcode');
			AddCountry = request.getParameter('custpage_addcountry');

			var AddressTxt = '';

			if (Add1.length > 0)
			{
				AddressTxt+=Add1+'\n';
			}
			if (Add2.length > 0)
			{
				AddressTxt+=Add2+'\n';
			}
			if (Add3.length > 0)
			{
				AddressTxt+=Add3+'\n';
			}
			if (AddCity.length > 0)
			{
				AddressTxt+=AddCity+'\n';
			}
			if (AddCSP.length > 0)
			{
				AddressTxt+=AddCSP+'\n';
			}
			if (AddPC.length > 0)
			{
				AddressTxt+=AddPC+'\n';
			}
			if (AddCountry.length > 0)
			{
				AddressTxt+=AddCountry;
			}

			var COrecord= nlapiCreateRecord('contact');
			COrecord.setFieldValue('company', SupplierName);
			COrecord.setFieldValue('salutation', ContactFirstName);
			COrecord.setFieldValue('lasttname', ContactLastName);
			COrecord.setFieldValue('entityid', contactFullName);
			COrecord.setFieldValue('subsidiary', contactSubsidiary);

			COrecord.setFieldValue('email', ContactEmail);
			COrecord.setFieldValue('phone', ContactPhone);
			COrecord.setFieldValue('fax', ContactFax);

			COrecord.selectNewLineItem('addressbook');
			COrecord.setCurrentLineItemValue('addressbook','attention', AddAttention);
			COrecord.setCurrentLineItemValue('addressbook','label', AddLabel);
			COrecord.setCurrentLineItemValue('addressbook','adressee', AddAddressee);
			COrecord.setCurrentLineItemValue('addressbook','phone', AddPhone);
			COrecord.setCurrentLineItemValue('addressbook','addr1', Add1);
			COrecord.setCurrentLineItemValue('addressbook','addr2', Add2);
			COrecord.setCurrentLineItemValue('addressbook','addr3', Add3);
			COrecord.setCurrentLineItemValue('addressbook','city', AddCity);
			COrecord.setCurrentLineItemValue('addressbook','state', AddCSP);
			COrecord.setCurrentLineItemValue('addressbook','zip', AddPC);
			COrecord.setCurrentLineItemValue('addressbook','country', AddCountry);
			COrecord.commitLineItem('addressbook');

			var COid = nlapiSubmitRecord(COrecord);

			AddressTxt = escapeString(AddressTxt);	

			var scripthtml = '<html><script>';	

			scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_contact_email", "'+ContactEmail+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_contact_phone", "'+ContactPhone+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_contact_fax", "'+ContactFax+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_prsuppliercontactaddress", "'+AddressTxt+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_prsuppliercontactselect", "'+COid+'");';
			scripthtml+='window.close();';
			scripthtml+='</script></html>';

			response.write(scripthtml);
		}

	}
	catch (e)
	{
		errHandler('createContact', e);

	}
}

/**************
 *function escapeString(str)
 *************/
function escapeString(str)
{
	try
	{

		str=str.replace(/\n/g,'\\n');
		str=str.replace(/\r/g,'');
	}
	catch (e)
	{
		errHandler('escapeString', e);
	}
	return str;
}

/**************
 *function reduceString(str)
 *************/

function reduceString(str)
{
	try
	{
		str=str.replace(/\n/g,' ');
		str=str.replace(/\r/g,'');
	}
	catch (e)
	{
		errHandler('reduceString', e);
	}
	return str;
}


/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * version:		1.0.1   - 04/07/2013  - Amended - Added try catch block - SA
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