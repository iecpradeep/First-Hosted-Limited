/*************************************************************************************
 * Name:		pr2_editContactSuitlet.js
 * Script Type:	Suitlet
 *
 * Version:		1.0.0                     first relase - ???
 * Version:		1.0.1   - 31/05/20013   - copied script from NetSuite and created in SVN.- SA
 * Version:		1.0.2   - 03/07/20013   - added address line fields and added try catch to the main block.- SA
 * version:		1.0.3   - 04/07/2013  - Amended - Added try catch block - SA
 *
 * Author:		[FHL]
 * 
 * Purpose:		clientscript calls this suitlet, when creating PR, if issue to method and the populated information doesnot match then suitlet pop ups to update the details. 
 * 
 * Script: 		customscript_pr_editcontact    
 * Deploy: 		customdeploy_pr_editcontact
 * 
 * Notes:		[todo - deployment details i.e. form associated etc]
 * 
 * Library: 	Libary.js
 *************************************************************************************/
function updateContact(request,response)
{
	try
	{	

		if ( request.getMethod() == 'GET' )
		{
			var ContactID = request.getParameter('CID');
			var SupplierID = request.getParameter('SID');
			var RequestedField = request.getParameter('UpdateField');
			var ContactName = nlapiLookupField('contact', ContactID, 'entityid');
			var ContactEmail = nlapiLookupField('contact', ContactID, 'email');
			var ContactPhone = nlapiLookupField('contact', ContactID, 'phone');
			var ContactFax = nlapiLookupField('contact', ContactID, 'fax');
			var contactFirstName = nlapiLookupField('contact', ContactID, 'firstname');
			var contactLastName = nlapiLookupField('contact', ContactID, 'lastname');
			var contactSalutation = nlapiLookupField('contact', ContactID, 'salutation');
			var SupplierName = nlapiLookupField('vendor', SupplierID, 'entityid');
			var Subsidiary = nlapiLookupField('vendor', SupplierID, 'subsidiary');
			var SubsidiaryCountry = nlapiLookupField('subsidiary', Subsidiary, 'country');

			var record = nlapiLoadRecord('contact',ContactID);
			var lineCount = record.getLineItemCount('addressbook');
			var defaultBillingAdd = '';
			var address = '';
			for(var i = 1; i <= lineCount; i++ )
			{
				defaultBillingAdd = record.getLineItemValue('addressbook', 'defaultbilling', i);
				// in select contact field, always default billing address will be shown
				if(defaultBillingAdd == 'T')
				{
					//Version:		1.0.2   - 03/07/20013   - added address line fields 
					var Add1 = record.getLineItemValue('addressbook', 'addr1', i);
					var Add2 = record.getLineItemValue('addressbook', 'addr2', i);
					var Add3 = record.getLineItemValue('addressbook', 'addr3', i);
					var AddPhone = record.getLineItemValue('addressbook', 'phone', i);
					var AddAttention = record.getLineItemValue('addressbook', 'attention', i);
					var AddCity = record.getLineItemValue('addressbook', 'city', i);
					var AddCSP = record.getLineItemValue('addressbook', 'state', i);
					var AddPC = record.getLineItemValue('addressbook', 'zip', i);

				}
			}

			var billcountry = nlapiLookupField('contact', ContactID, 'billcountry');

			var Contactform = nlapiCreateForm("Edit Contact Details");
			var headergroup = Contactform.addFieldGroup( 'headerfieldgroup', 'Contact');
			var detailsgroup = Contactform.addFieldGroup( 'detailsfieldgroup', 'Email | Phone | Fax');
			var addressgroup = Contactform.addFieldGroup( 'addressfieldgroup', 'Address');
			var frmContactID = Contactform.addField('custpage_contactid', 'text', 'Contact ID', null, 'headerfieldgroup').setDefaultValue(ContactID);

			var frmContactSalutation = Contactform.addField('custpage_contactsalutation', 'text', 'Mr./Ms...', null, 'headerfieldgroup').setDefaultValue(contactSalutation);
			var frmContactFirstName = Contactform.addField('custpage_contactfirstname', 'text', 'First Name', null, 'headerfieldgroup').setDefaultValue(contactFirstName);
			var frmContactLastName = Contactform.addField('custpage_contactlastname', 'text', 'Last Name', null, 'headerfieldgroup').setDefaultValue(contactLastName);

			var frmSupplierName = Contactform.addField('custpage_suppliername', 'select', 'Supplier Name', null, 'headerfieldgroup');
			frmSupplierName.setDefaultValue(SupplierName);
			frmSupplierName.addSelectOption(SupplierID, SupplierName);

			var frmConatctEmail = Contactform.addField('custpage_contactemail', 'email', 'E Mail', null, 'detailsfieldgroup').setDefaultValue(ContactEmail);
			var frmContactPhone = Contactform.addField('custpage_contactphone', 'phone', 'Phone', null, 'detailsfieldgroup').setDefaultValue(ContactPhone);
			var frmContactFax = Contactform.addField('custpage_contactfax', 'phone', 'Fax', null, 'detailsfieldgroup').setDefaultValue(ContactFax);
			var frmAddLabel = Contactform.addField('custpage_addlabel', 'text', 'Label', null, 'addressfieldgroup');
			var frmAddAttention = Contactform.addField('custpage_addattention', 'text', 'Attention', null, 'addressfieldgroup').setDefaultValue(AddAttention);
			var frmAddAddressee = Contactform.addField('custpage_addaddressee', 'text', 'Addressee', null, 'addressfieldgroup').setDefaultValue(ContactName);
			var frmAddPhone = Contactform.addField('custpage_addphone', 'phone', 'Phone', null, 'addressfieldgroup').setDefaultValue(AddPhone);
			var frmAdd1 = Contactform.addField('custpage_addaddress1', 'text', 'Address 1', null, 'addressfieldgroup').setDefaultValue(Add1);
			var frmAdd2 = Contactform.addField('custpage_addaddress2', 'text', 'Address 2', null, 'addressfieldgroup').setDefaultValue(Add2);
			var frmAdd3 = Contactform.addField('custpage_addaddress3', 'text', 'Address 3', null, 'addressfieldgroup').setDefaultValue(Add3);
			var frmAddCity = Contactform.addField('custpage_addcity', 'text', 'City', null, 'addressfieldgroup').setDefaultValue(AddCity);
			var frmAddCSP = Contactform.addField('custpage_addcsp', 'text', 'County/State/Province', null, 'addressfieldgroup').setDefaultValue(AddCSP);
			var frmAddPC = Contactform.addField('custpage_addpostcode', 'text', 'Post Code', null, 'addressfieldgroup').setDefaultValue(AddPC);
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
				}         
			}
			if (billcountry == '' || billcountry == null)
			{
				frmAddCountry.setDefaultValue(SubsidiaryCountry);						
			}
			else
			{
				frmAddCountry.setDefaultValue(billcountry);
			}

			Contactform.addSubmitButton('Update Details');

			response.writePage(Contactform);	

		}	

		else
		{	
			var contactSalutation = request.getParameter('custpage_contactsalutation');
			var contactFirstName = request.getParameter('custpage_contactfirstname');
			var contactLastName = request.getParameter('custpage_contactlastname');
			var ContactID = request.getParameter('custpage_contactid');
			var contactFullName = String(contactFirstName) + String(contactLastName);

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

			var COrecord = nlapiLoadRecord('contact', ContactID);
			COrecord.setFieldValue('salutation', contactSalutation);
			COrecord.setFieldValue('firstname', contactFirstName);
			COrecord.setFieldValue('lastname',contactLastName);
			COrecord.setFieldValue('entityid', contactFullName);
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
			COrecord.setCurrentLineItemValue('addressbook','defaultbilling', 'T');
			COrecord.setCurrentLineItemValue('addressbook','defaultshipping', 'T');
			COrecord.commitLineItem('addressbook');

			var COid = nlapiSubmitRecord(COrecord);

			AddressTxt = escapeString(AddressTxt);	

			var scripthtml = '<html><script>';	

			scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_contact_email", "'+ContactEmail+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_contact_phone", "'+ContactPhone+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_contact_fax", "'+ContactFax+'");';
			scripthtml+='window.opener.nlapiSetFieldValue("custbody_prsuppliercontactaddress", "'+AddressTxt+'");';
			scripthtml+='window.close();';
			scripthtml+='</script></html>';

			response.write(scripthtml);
		}

	}
	catch (e)
	{
		errHandler('updateContact', e);

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
 * version:		1.0.3   - 04/07/2013  - Amended - Added try catch block - SA
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