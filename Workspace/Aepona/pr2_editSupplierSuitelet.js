/*************************************************************************************
 * Name:		pr2_editSupplierSuitelet.js 
 * Script Type:	suitlet
 *
 * Version:		1.0.1  -				-First Release - ??
 * Version:		1.0.2  - 01/07/2013     -added the code to get the address of chosen bill adress (select supplier address field), previously it was getting from default billing address. - SA
 * Version:		1.0.3  - 01/07/2013     - added try catch for the updateSupplier block - SA
 * version:		1.0.4   - 04/07/2013  - Amended - Added try catch block - SA
 *
 * Author:		FHL
 * 
 * Purpose:		when you choose send to method and the datas are not filled in then popup suitelet to add details, it will set vendor record as well as current record (PR record)
 * 
 * Script: 		customscript_pr_editsupplier  
 * Deploy: 		customdeploy_pr_editsupplier
 * 
 * Notes:		[todo - deployment details i.e. form associated etc]
 * 
 * Library: 	Libary.js
 *************************************************************************************/


function updateSupplier(request,response)
{
	try
	{
		
	if ( request.getMethod() == 'GET' )
	{
		var SupplierID = request.getParameter('SID');
		nlapiLogExecution('error', 'SupplierID', SupplierID);

		var billadrressList = request.getParameter('billadrressIntID');
		nlapiLogExecution('debug', 'billaddresslist', billadrressList );

		var RequestedField = request.getParameter('UpdateField');
		var SupplierName = nlapiLookupField('vendor', SupplierID, 'entityid');
		var SupplierEmail = nlapiLookupField('vendor', SupplierID, 'email');
		var SupplierPhone = nlapiLookupField('vendor', SupplierID, 'phone');
		var SupplierFax = nlapiLookupField('vendor', SupplierID, 'fax');
		var Subsidiary = nlapiLookupField('vendor', SupplierID, 'subsidiary');
		var SubsidiaryCountry = nlapiLookupField('subsidiary', Subsidiary, 'country');


		var Add1 ='';

		var record = nlapiLoadRecord('vendor',SupplierID  );
		var lineCount = record.getLineItemCount('addressbook');
		var addIntID = 0;
		var address = '';
		for(var x = 1; x <= lineCount; x++ )
		{
			addIntID = record.getLineItemValue('addressbook', 'internalid', x);
			if(addIntID == billadrressList)
			{

				Add1 = record.getLineItemValue('addressbook', 'addr1', x);
				var Add2 = record.getLineItemValue('addressbook', 'addr2', x);
				var Add3 = record.getLineItemValue('addressbook', 'addr3', x);
				var AddCity = record.getLineItemValue('addressbook', 'city', x);
				var AddCSP = record.getLineItemValue('addressbook', 'state', x);

				var AddPC = record.getLineItemValue('addressbook', 'zip', x);

			}
		}

		var AddCountry = nlapiLookupField('vendor', SupplierID, 'billcountry');

		var Supplierform = nlapiCreateForm("Supplier");
		var headergroup = Supplierform.addFieldGroup( 'headerfieldgroup', 'Contact');
		var detailsgroup = Supplierform.addFieldGroup( 'detailsfieldgroup', 'Email | Phone | Fax');
		var addressgroup = Supplierform.addFieldGroup( 'addressfieldgroup', 'Address');
		var frmSuppID = Supplierform.addField('custpage_supplierid', 'text', 'Supplier ID', null, 'headerfieldgroup').setDefaultValue(SupplierID);
		var frmSuppName = Supplierform.addField('custpage_suppliername', 'select', 'Supplier', null, 'headerfieldgroup');
			frmSuppName.setDefaultValue(SupplierName);
			frmSuppName.addSelectOption(SupplierID, SupplierName);
		var frmSuppEmail = Supplierform.addField('custpage_supplieremail', 'email', 'E Mail', null, 'detailsfieldgroup').setDefaultValue(SupplierEmail);
		var frmSuppPhone = Supplierform.addField('custpage_supplierphone', 'phone', 'Phone', null, 'detailsfieldgroup').setDefaultValue(SupplierPhone);
		var frmSuppFax = Supplierform.addField('custpage_supplierfax', 'phone', 'Fax', null, 'detailsfieldgroup').setDefaultValue(SupplierFax);
		var frmAddLabel = Supplierform.addField('custpage_addlabel', 'text', 'Label', null, 'addressfieldgroup');
		var frmAddAttention = Supplierform.addField('custpage_addattention', 'text', 'Attention', null, 'addressfieldgroup');
		var frmAddAddressee = Supplierform.addField('custpage_addaddressee', 'text', 'Addressee', null, 'addressfieldgroup').setDefaultValue(SupplierName);
		var frmAddPhone = Supplierform.addField('custpage_addphone', 'phone', 'Phone', null, 'addressfieldgroup').setDefaultValue(SupplierPhone);
		var frmAdd1 = Supplierform.addField('custpage_addaddress1', 'text', 'Address 1', null, 'addressfieldgroup').setDefaultValue(Add1);
		var frmAdd2 = Supplierform.addField('custpage_addaddress2', 'text', 'Address 2', null, 'addressfieldgroup').setDefaultValue(Add2);
		var frmAdd3 = Supplierform.addField('custpage_addaddress3', 'text', 'Address 3', null, 'addressfieldgroup').setDefaultValue(Add3);
		var frmAddCity = Supplierform.addField('custpage_addcity', 'text', 'City', null, 'addressfieldgroup').setDefaultValue(AddCity);
		var frmAddCSP = Supplierform.addField('custpage_addcsp', 'text', 'County/State/Province', null, 'addressfieldgroup').setDefaultValue(AddCSP);
		var frmAddPC = Supplierform.addField('custpage_addpostcode', 'text', 'Post Code', null, 'addressfieldgroup').setDefaultValue(AddPC);
		var frmAddCountry = Supplierform.addField('custpage_addcountry', 'select', 'Country', null, 'addressfieldgroup');


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
		frmAddCountry.setDefaultValue(SubsidiaryCountry);
		Supplierform.addSubmitButton('Update Details');

		response.writePage(Supplierform);	
	}	

	else
	{			
		var SupplierID = request.getParameter('custpage_supplierid');
		var SupplierEmail = request.getParameter('custpage_supplieremail');
		var SupplierPhone = request.getParameter('custpage_supplierphone');
		var SupplierFax = request.getParameter('custpage_supplierfax');
		var AddLabel = request.getParameter('custpage_addlabel');
		var AddAttention = request.getParameter('custpage_addattention');
		var AddAddressee = request.getParameter('custpage_addaddressee');
		var AddPhone = request.getParameter('custpage_addphone');
		var Add1 = request.getParameter('custpage_addaddress1');
		var Add2 = request.getParameter('custpage_addaddress2');
		var Add3 = request.getParameter('custpage_addaddress3');
		var AddCity = request.getParameter('custpage_addcity');
		var AddCSP = request.getParameter('custpage_addcsp');
		var AddPC = request.getParameter('custpage_addpostcode');
		var AddCountry = request.getParameter('custpage_addcountry');

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


		var SUrecord = nlapiLoadRecord('vendor', SupplierID);
		SUrecord.setFieldValue('email', SupplierEmail);
		SUrecord.setFieldValue('phone', SupplierPhone);
		SUrecord.setFieldValue('fax', SupplierFax);
		SUrecord.selectNewLineItem('addressbook');
		SUrecord.setCurrentLineItemValue('addressbook','attention', AddAttention);
		SUrecord.setCurrentLineItemValue('addressbook','label', AddLabel);
		SUrecord.setCurrentLineItemValue('addressbook','adressee', AddAddressee);
		SUrecord.setCurrentLineItemValue('addressbook','addr1', Add1);
		SUrecord.setCurrentLineItemValue('addressbook','addr2', Add2);
		SUrecord.setCurrentLineItemValue('addressbook','addr3', Add3);
		SUrecord.setCurrentLineItemValue('addressbook','city', AddCity);
		SUrecord.setCurrentLineItemValue('addressbook','state', AddCSP);
		SUrecord.setCurrentLineItemValue('addressbook','zip', AddPC);
		SUrecord.setCurrentLineItemValue('addressbook','country', 'GB');
		SUrecord.setCurrentLineItemValue('addressbook','defaultbilling', 'T');
		SUrecord.setCurrentLineItemValue('addressbook','defaultshipping', 'T');
		SUrecord.commitLineItem('addressbook');
		var SUid = nlapiSubmitRecord(SUrecord);	

		AddressTxt = escapeString(AddressTxt);

		var scripthtml = '<html><script>';

		scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_supplier_email", "'+SupplierEmail+'");';
		scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_supplier_phone", "'+SupplierPhone+'");';
		scripthtml+='window.opener.nlapiSetFieldValue("custbody_pr_supplier_fax", "'+SupplierFax+'");';
		scripthtml+='window.opener.nlapiSetFieldValue("billaddress", "'+AddressTxt+'");';
		scripthtml+='window.close();';
		scripthtml+='</script></html>';

		response.write(scripthtml);
	}

	}
	catch (e)
	{
		errHandler('updateSupplier', e);

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
 * version:		1.0.4   - 04/07/2013  - Amended - Added try catch block - SA
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