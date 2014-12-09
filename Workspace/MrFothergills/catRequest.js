/*****************************************************************************
 * Name:        catRequest.js
 * Script Type: User Event
 *
 * Version:     1.0.0 - 26/06/2013 - Initial release - SB
 *              1.0.1 - 16/07/2013 - Changed the search function - JP, SM, JA
 *              1.0.2 - 19/07/2013 - Changed the before submit to have attributes of after submit so
 *                                  e-mail would show product - SM
 *              1.0.3 - 19/07/2013 - Separated the main beforeSubmit form into 2 more sub forms - SM
 *
 * Author:      SM,JP,JA FHL
 * 
 * Purpose:     To map the catalogues that are submitted from the internet 
 *              (Catalogue Request Form).
 * 
 * Script:      customscript_cataloguerequest
 * Deploy:      customdeploy_cataloguerequest
 *              
 * 
 * Notes:       Merging of catalogueRequest and catRequestUE
 * 
 * Library:     Library.js
 *************************************************************************************/

var custId = null;
var customerId = null;
var email = null;
var brand = null;
var existingCustomer = '';

var salutation = '';
var firstName = '';
var lastName = '';
var phone = '';
var email = '';
var customer = '';
var address1 = '';
var address2 = '';
var address3 = '';
var city = '';
var state = '';
var country = '';
var zip = '';

//After Submit
var catReqRecord = null;
var catReqRecordUsed = false;
var newCatRequest = null;
var customer = null;

var shipAddress = new Object();
var catalogueMapping = null;
var updateRecord = null;
var date = null;
var catalogues = new Array();

//Search and split 
var filters = new Array();
var columns = new Array();
var searchAddress = '';
var splitAddress = new Array();
var addressToBeSplit = null;
var lineCheck = null;
var countyFromArray = null;

/*
 * before submitting catalogue request
 */
function beforeSubmit(type)
{
    try
    {
        // If creating a new Catalogue Request
        if (type == 'create')
        {
            // Don't do anything if customer already selected
            createUpdateCustomer();
            findCatalogue();
        }
    }
    catch(e)
    {
        errorHandler('beforeSubmit', e);
    }
}

/*
 * after submitting catalogue request
 */
function afterSubmit(type)
{
    try
    {
        // get current record
        updateRecord = nlapiGetNewRecord();
        catReqRecord = updateRecord;

        shipAddress.line1 = updateRecord.getFieldValue('custrecord_cr_addr1');
        shipAddress.line2 = updateRecord.getFieldValue('custrecord_cr_addr2');
        shipAddress.line3 = updateRecord.getFieldValue('custrecord_cr_addr3');
        shipAddress.city = updateRecord.getFieldValue('custrecord_cr_city');
        shipAddress.state = updateRecord.getFieldValue('custrecord_cr_state');
        shipAddress.zip = updateRecord.getFieldValue('custrecord_cr_zip');

        // get current date and convert to string in user's date format
        date = nlapiDateToString(new Date());

        // get customer from current record
        customer = updateRecord.getId();
        brand = updateRecord.getFieldValue('custrecord_cr_brand');

        catalogueMapping = null;

        // get catalogue request type 1 mapping      

        switch(brand)
        {
            case '1':
                catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',search ('MRF - Cat A'),'custrecord_crmapping_catalogue');
                break;
            case '2':
                catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',search ('DTB - Cat A'),'custrecord_crmapping_catalogue');
                break;
            case '3':
                catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',search ('Woolmans - Cat A'),'custrecord_crmapping_catalogue');
                break;
        }  //switch

        submitNewCatRequest();

        return true;    
    }
    catch (e) 
    {
        errorHandler('afterSubmit', e);
    }
}

/*
 * Checks the customerId to see if the customer is already in the system
 */
function createUpdateCustomer()
{
    try
    {
        customerId = nlapiGetFieldValue('custrecord_cr_customer');
        if (!customerId)
        {
            setVariables();

            // Customer exists
            if (existingCustomer > 0 && email && brand)
            {
                updateVariables();

                // If Address 1, City and Zip not empty and don't match a current address, add them
                findAddress();

                nlapiSubmitRecord(customer);
                nlapiSetFieldValue('custrecord_cr_customer', existingCustomer);
            }
            // Customer doesn't exist
            else
            {
                // Create Customer
                createCustomer();
            }
        }
    }
    catch (e) 
    {
        errorHandler('createUpdateCustomer', e);
    }

}

/*
 * Load existing variables
 */
function setVariables()
{
    try
    {
        email = nlapiGetFieldValue('custrecord_cr_email');
        brand = nlapiGetFieldValue('custrecord_cr_brand');

        existingCustomer = genericSearchTwoParams('customer', 'email', email, 'custentity_mrf_cust_brand', brand);

        salutation = nlapiGetFieldValue('custrecord_cr_salutation');
        firstName = nlapiGetFieldValue('custrecord_cr_firstname');
        lastName = nlapiGetFieldValue('custrecord_cr_lastname');
        address1 = nlapiGetFieldValue('custrecord_cr_addr1');
        address2 = nlapiGetFieldValue('custrecord_cr_addr2');
        address3 = nlapiGetFieldValue('custrecord_cr_addr3');
        city = nlapiGetFieldValue('custrecord_cr_city');
        state = nlapiGetFieldValue('custrecord_cr_state');
        country = 'GB';
        zip = nlapiGetFieldValue('custrecord_cr_zip');
        phone = nlapiGetFieldValue('custrecord_cr_phone');
        email = nlapiGetFieldValue('custrecord_cr_email');
    }
    catch(e)
    {
        errorHandler('setVariables', e);
    }
}   

/*
 * Update the existing variables
 */
function updateVariables()
{
    try
    {
        // Update Customer
        customer = nlapiLoadRecord('customer', existingCustomer);       
        // Update Salutation
        if (salutation)
        {
            customer.setFieldValue('custentity_salutation', salutation);
        }      
        // Update Phone
        if (phone)
        {
            customer.setFieldValue('phone', phone);
        }   
        if (zip)
        {
            customer.setFieldValue('zip', zip);
        }
    }
    catch(e)
    {
        errorHandler('updateVariables', e);
    }
}

/*
 * Find an existing address
 */
function findAddress()
{
    var lineAddress1 = '';
    var lineCity = '';
    var lineZip = null;
    var addressFoundLineNumber = '';

    try
    {       
        if (address1 && city && zip)    
        {

            addressFoundLineNumber = 0;
            // Loop over current addresses
            for (var i = 1; i <= customer.getLineItemCount('addressbook'); i++)
            {
                lineAddress1 = customer.getLineItemValue('addressbook', 'addr1', i);
                lineCity = customer.getLineItemValue('addressbook', 'city', i);
                lineZip = customer.getLineItemValue('addressbook', 'zip', i);

                if (lineAddress1.toLowerCase() == addres1.toLowerCase() &&
                        lineCity.toLowerCase() == city.toLowerCase() &&
                        lineZip.toLowerCase() == zip.toLowerCase())
                {
                    addressFoundLineNumber = i;
                }
            }

            if (addressFoundLineNumber == 0)
            {
                // Add new address
                customer.selectNewLineItem('addressbook');
                customer.setCurrentLineItemValue('addressbook', 'addr1', address1);
                customer.setCurrentLineItemValue('addressbook', 'addr2', address2);
                customer.setCurrentLineItemValue('addressbook', 'addr3', address3);
                customer.setCurrentLineItemValue('addressbook', 'city', city);
                customer.setCurrentLineItemValue('addressbook', 'state', state);
                customer.setCurrentLineItemValue('addressbook', 'country', country);
                customer.setCurrentLineItemValue('addressbook', 'zip', zip);
                //customer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
                customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
                customer.commitLineItem('addressbook');
            }
            else
            {
                customer.selectLineItem('addressbook', addressFoundLineNumber);
                customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
                customer.commitLineItem('addressbook');
            }
        }
    }
    catch(e)
    {
        errorHandler('findAddress', e);
    }
}

/*
 * Create a new Customer
 */
function createCustomer()
{
    try
    {
        customer = nlapiCreateRecord('lead');

        customer.setFieldValue('custentity_mrf_cust_brand', brand);
        customer.setFieldValue('custentity_salutation', salutation);
        customer.setFieldValue('firstname', firstName);
        customer.setFieldValue('lastname', lastName);
        customer.setFieldValue('phone', phone);
        customer.setFieldValue('email', email);
        customer.setFieldValue('weblead', 'T');

        customer.selectNewLineItem('addressbook');
        customer.setCurrentLineItemValue('addressbook', 'addr1', address1);
        customer.setCurrentLineItemValue('addressbook', 'addr2', address2);
        customer.setCurrentLineItemValue('addressbook', 'addr3', address3);
        customer.setCurrentLineItemValue('addressbook', 'city', city);
        customer.setCurrentLineItemValue('addressbook', 'state', state);
        customer.setCurrentLineItemValue('addressbook', 'country', country);
        customer.setCurrentLineItemValue('addressbook', 'zip', zip);
        customer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
        customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
        customer.commitLineItem('addressbook');

        customerId = nlapiSubmitRecord(customer);
        nlapiSetFieldValue('custrecord_cr_customer', customerId);
    }
    catch(e)
    {
        errorHandler('createCustomer', e);
    }
}


/*
 * Find which catalogue the customer is requesting
 */
function findCatalogue()
{
    var columns = new Array ();
    try
    {
        customerId = nlapiGetFieldValue('custrecord_cr_customer');
        columns [0] = new nlobjSearchColumn ('name');
        catalogues = nlapiSearchRecord ('customrecord_cataloguerequestmapping', null, null, columns);

        // get current date and convert to string in user's date format
        date = nlapiDateToString(new Date());

        // get customer from current record
        customer = customerId;
        brand = nlapiGetFieldValue('custrecord_cr_brand');

        catalogueMapping = null;

        // get catalogue request type 1 mapping      
        nlapiLogExecution("DEBUG", "brand", brand);
        switch(brand)
        {
            case '1':
                catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',search ('MRF - Cat A'),'custrecord_crmapping_catalogue');
                break;
            case '2':
                catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',search ('DTB - Cat A'),'custrecord_crmapping_catalogue');
                break;
            case '3':
                catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',search ('Woolmans - Cat A'),'custrecord_crmapping_catalogue');
                break;
        }  //switch

        nlapiSetFieldValue('custrecord_cr_catalogue', catalogueMapping);
    }
    catch(e)
    {
        errorHandler('findCatalogue', e);
    }
}

/*
 * Reuse existing Catalogue Request record
 * Use it as the basis for other Requests if necessary
 * Create new record if non exist already
 * @returns nlobjRecord
 */
function newCatReqRecord()
{
    var newRecord = null;
    try
    {
        if (catReqRecordUsed)
        {
            newRecord = nlapiCopyRecord('customrecord_cataloguerequest', catReqRecord.getId());
        }
        else
        {
            newRecord = nlapiLoadRecord('customrecord_cataloguerequest', catReqRecord.getId());
            catReqRecordUsed = true;
        }
    }
    catch (e)
    {
        errorHandler('newCatReqRecord', e);
    }

    return newRecord;
}

/*
 * update Shipping Address
 */
function updateShippingAddress()
{
    try
    {
        newCatRequest.setFieldValue('custrecord_cr_addr1', shipAddress.line1);
        newCatRequest.setFieldValue('custrecord_cr_addr2', shipAddress.line2);
        newCatRequest.setFieldValue('custrecord_cr_addr3', shipAddress.line3);
        newCatRequest.setFieldValue('custrecord_cr_city', shipAddress.city);
        newCatRequest.setFieldValue('custrecord_cr_state', shipAddress.state);
        newCatRequest.setFieldValue('custrecord_cr_zip', shipAddress.zip);
    }
    catch (e)
    {
        errorHandler('updateShippingAddress', e);
    }
}

/*
 * Submits catalogue requests 
 */
function submitNewCatRequest()
{
    try
    {
        // create new catalogue request object
        newCatRequest = newCatReqRecord();

        if (shipAddress.line1)
        {
            updateShippingAddress();
        }

        // set field values
        newCatRequest.setFieldValue('custrecord_cr_catalogue', catalogueMapping);
        newCatRequest.setFieldValue('custrecord_cr_daterequested', date);

        // submit record

        nlapiSubmitRecord(newCatRequest);
    }
    catch (e)
    {
        errorHandler('submitNewCatRequest', e);
    }
}

/*
 * Searches for the internal id from the name
 */
function search(cat)
{
    var retVal = 0;

    try
    {
        for (var i = 0; i < catalogues.length; i++)
        {
            if (catalogues[i].getValue('name') == cat)
            {
                retVal = catalogues[i].getId ();
            }
        }
    }
    catch(e)
    {
        errorHandler('search', e);
    }

    return retVal;
}

/*
 * Searches for the address block of the customer
 */
function populateAddress()
{
    try
    {
        filters[0]= new nlobjSearchFilter('internalid', null, 'is', custId );
        columns[0] = new nlobjSearchColumn('address');
        searchAddress = nlapiSearchRecord('customer', null, filters, columns);
        addressToBeSplit = searchAddress[0].getValue(columns[0]);

        addressSplit();
    }
    catch(e)
    {
        errorHandler('populateAddress', e);
    }
    
}

/*
 *Split the address block and stores the seperate lines in an array
 */
function addressSplit()
{
    try
    {
        splitAddress = addressToBeSplit.split("\n");
        setAddress();

    }
    catch(e)
    {
        return false;
    }
}

/*
 * Sets the address for the customer
 */
function setAddress()
{
    try
    {
        lineCheck = splitAddress.length;
        nlapiSetFieldValue('custrecord_cr_addr1', splitAddress[1]);
        nlapiSetFieldValue('custrecord_cr_addr2', splitAddress[2]);
        nlapiSetFieldValue('custrecord_cr_city', splitAddress[3]);
        nlapiSetFieldValue('custrecord_cr_zip', splitAddress[5]);    
    }
    catch(e)
    {
        errorHandler('setAddress', e);
    } 
}

/*
 * Sets the country of the address
 */
function setCounty()
{
    try
    {
        countyFromArray = splitAddress[4];
        filters[1] = new lobjSearchFilter('', null, 'is', countyFromArray);   
    }
    catch(e)
    {
        errorHandler('setCountry', e);
    }    
}
