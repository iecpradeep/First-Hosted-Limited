/**
 * @projectDescription SuiteScript API (Last Updated on 13 Nov 2013)
 * @version 2013.2
 * Known issues:
 * Windows->Preferences->JavaScript-<Editor->Content Assist
 * Insertion:
 * [ ] Guess filled function argument       (Must be turned off)
 */

var JSON = {
/**
 * This method parses a JSON text to produce an object or array.
 * @param {String} text - JSON string to parse.
 * @param {Function} reviver [optional] - Optional function that can filter and transform the results. It receives each of the keys and values, and its return value is used instead of the original value. If it returns what it received, then the structure is not modified. If it returns undefined then the member is deleted.
 * @returns {Object} JavaScript value.
 * @memberOf JSON
 */
parse : function(text, reviver) { },
/**
 * This method produces a JSON text from a JavaScript value.
 * @param {Object} value - Any JavaScript value, usually an object or array.
 * @param {Object} replacer [optional] - An optional parameter that determines how object values are stringified for objects. It can be a function or an array of strings.
 * @param {Object} space [optional] - An optional parameter that specifies the indentation of nested structures. If it is omitted, the text will be packed without extra whitespace. If it is a number, it will specify the number of spaces to indent at each level. If it is a string (such as '\t' or '&nbsp;'), it contains the characters used to indent at each level.
 * @returns {String} JSON string
 * @memberOf JSON
 */
stringify : function(value, replacer, space) { }
};

/**
 * Adds/subtracts a number of days to or from a Date object
 * @param {Date} dt - Date object
 * @param {Number} numDays - Number of days being added to the date
 * @returns {Date} Date object corresponding to date that was passed in, plus the days you added or subtracted
 * @since 2008.1
 */
function nlapiAddDays(dt, numDays) { };

/**
 * Adds/subtracts a number of months to or from a Date object
 * @param {Date} dt - Date object
 * @param {Number} numMonths - number of months being added to the date
 * @returns {Date} Date object corresponding to date that was passed in, plus the months you added or subtracted
 * @since 2008.1
 */
function nlapiAddMonths(dt, numMonths) { };

/**
 * Attaches a single record to another record. The following attachment relationships are supported:
 * <br>- Issue attached to Support Case
 * <br>- Contact attached to Customer,Partner,Vendor,Lead,Prospect,Project
 * <br>- File attached to any transaction, item, activity, custom, or entity record
 * <br>- Custom child record attached to supported parent record
 * <br>- Entity to a static entity group. Note that if attaching an entity to a static entity group, you must specify entitygroup as the internal ID for the attachRecType argument (see below).
 * <br>This API is supported in client, user event, scheduled, and Suitelet scripts.
 * <br>API Governance: 10
 * @param {String} srcRecType - The record internal ID name for the record being attached.  Note that if you want to attach a file from the file cabinet, set type to file.
 * @param {String} srcRecId - The record internalId for the record being attached, for example 555 or 78.
 * @param {String} attachRecType - The record internal ID for the record being attached to. Note that if attaching an entity to a static entity group, the internal ID for the entity group record type is entitygroup.
 * @param {String} attachRecId - The record internalId for the record being attached to.
 * @param {Object} attrObj [optional] - Name/value pairs containing attributes for the attachment:
 * <br> - contact->company record: role (the contact role id used for attaching contact to customer/vendor/partner)
 * <br> - customrecord*->parent record: field (the custom field used to link child custom record to parent record)
 * @returns {Void}
 * @since 2008.1
 */
function nlapiAttachRecord(srcRecType, srcRecId, attachRecType, attachRecId, attrObj) { };

/**
 * Cancels any uncommitted changes to the current line of a sublist
 * <br>Restriction: Only supported for sublists of type inlineeditor and editor
 * @param {String} subListType
 * @returns {Void}
 * @since 2005.0
 */
function nlapiCancelLineItem(subListType) { };

/**
 * Saves/commits the changes to the current line in a sublist. This is the equivalent of clicking Done for a line item in the UI.
 * @param {String} subListType
 * @returns {Void}
 * @since 2005.0
 */
function nlapiCommitLineItem(subListType) { };

/**
 * Initializes a new record using field data from an existing record. Note that this API simply creates a new instance of another record. After making changes to the copy, you must submit the copy (which is considered as a new record) to the database for your changes to be committed to NetSuite.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: standard transactions: 10, standard non-transactions: 5, custom records: 2
 * @param {String} recType - The record internal ID name.
 * @param {Number} recId - The internalId for the record. If you are unsure how to find a record's internalId, see Showing Record and Field IDs in Your Account.
 * @param {Object} initObj [optional] - Contains an array of name/value pairs of defaults to be used during record initialization.
 * @returns {nlobjRecord} An nlobjRecord object of a copied record
 * @since 2007.0
 */
function nlapiCopyRecord(recType, recId, initObj) { };

/**
 * Use this function to return a reference to an nlobjAssistant object, which is the basis for building your own custom assistant. This API is supported in Suitelets.
 * <br>Restriction: Suitelets only
 * @param {String} title - The name of the assistant. This name will appear at the top of all assistant pages.
 * @param {Boolean} isHideHeader [optional] - If not set, defaults to false. If set to true, the header (navbar/logo) on the assistant is hidden from view.
 * @returns {nlobjAssistant} nlobjAssistant object
 * @since 2009.2
 */
function nlapiCreateAssistant(title, isHideHeader) { };

/**
 * Initializes a new record and returns an nlobjCSVImport object. You can then use the methods available on the returned record object to populate the object with the desired information.
 * <br>Next, you can pass this object to nlapiSubmitCSVImport(nlobjCSVImport), which asynchronously imports the data from the returned object into NetSuite.
 * <br>Note that this API cannot be used to import data that is imported by simple (2-step) assistants in the UI, because these import types do not support saved import maps.
 * <br>This limitation applies to budget, single journal entry, single inventory worksheet, project tasks, and Web site redirects imports.
 * <br>Warning: This API is only supported for bundle installation scripts, scheduled scripts, and RESTlets.
 * @returns {nlobjCSVImport} An nlobjCSVImport object to be passed as a parameter to nlapiSubmitCSVImport(nlobjCSVImport).
 * @since 2012.2
 */
function nlapiCreateCSVImport() { };

/**
 * Returns a nlobjSubrecord object. Use this API to create a subrecord from a sublist field on the parent record.Important: This API should only be used in user event scripts on the parent record. Note, however, this API is not supported in beforeLoad user event scripts. This API is also not currently supported in form-level or record-level client SuiteScripts associated with the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiCreateCurrentLineItemSubrecord(subListType, fldName) { };

/**
 * Creates an nlobjError (complete with stacktrace) that can be thrown to abort script execution. This API is supported in user event, scheduled, portlet, and Suitelet scripts.
 * @param {String} code - A user-defined error code
 * @param {String} details - The error details
 * @param {Boolean} isSuppressNotification [optional] - If not set, defaults to false and an email notification with error details is sent after script execution. If set to true, the error email notification is suppressed. Note: The values for this parameter can be true or false, not T or F.
 * @returns {nlobjError} An nlobjError object
 * @since 2008.2
 */
function nlapiCreateError(code, details, isSuppressNotification) { };

/**
 * Instantiates and returns an nlobjFile object. The file object can be used as an email or fax attachement. The file object can also be saved to the file cabinet using nlapiSubmitFile(file).Note: There is a 5MB limitation to the size of the document that can be created using this API.
 * <br>The nlapiCreateFile API can also be used for streaming to clients (via Suitelets). For streaming or attaching binary content, you can call the following. Note that each of these APIs can load or generate binary content, provided that the contents argument is base-64 encoded.
 * <br>- nlapiLoadFile(id)
 * <br>- nlapiPrintRecord(type, id, mode, properties)
 * <br>- nlapiMergeRecord(id, baseType, baseId, altType, altId, fields)
 * <br>This API is supported in user event, scheduled, portlet, mass update, and Suitelet scripts.Important: Be aware that the nlapiCreateFile function does not support the creation of non-text file types such as PDFs, unless the contents argument is base-64 encoded.
 * <br>API Governance: 10
 * <br>Restriction: Server SuiteScript only
 * @param {String} filename - The name of the file
 * @param {String} fileType - The file type. Note that when specifiying the type for an ad-hoc email or fax attachment, only non-binary types are supported (for example, PLAINTEXT, HTMLDOC, XMLDOC), unless the contents argument is base-64 encoded.
 * @param {String} fileContent - The contents of the file
 * @returns {nlobjFile} An nlobjFile object
 * @since 2008.1
 */
function nlapiCreateFile(filename, fileType, fileContent) { };

/**
 * Creates an nlobjForm object which can be used to generate an entry form page. This API is available to Suitelets only.
 * <br>Restriction: Suitelets only
 * @param {String} title - The title for the form
 * @param {Boolean} isHideNavbar [optional] - Set to true if the navigation bar should be hidden on the Suitelet. Setting to true enables "popup page" use cases in which the popup can be created with the UI Objects API rather than just HTML.
 * @returns {nlobjForm} An nlobjForm object
 * @since 2008.2
 */
function nlapiCreateForm(title, isHideNavbar) { };

/**
 * Creates an nlobjList object used to generate an internal standalone list. This API is available to Suitelets only.
 * <br>Restriction: Suitelets only
 * @param {String} title - The title for the list
 * @param {Boolean} isHideNavbar [optional] - Set to true if the navigation bar should be hidden on the Suitelet. Setting to true enables "popup page" use cases in which the popup can be created with the UI Objects API rather than just HTML.
 * @returns {nlobjList} An nlobjList object
 * @since 2008.2
 */
function nlapiCreateList(title, isHideNavbar) { };

/**
 * Initializes a new record and returns an nlobjRecord object containing all the default field data for that record type. You can then use the methods available on the returned record object to populate the record with the desired information.
 * <br>The nlapiCreateRecord function must be followed by the nlapiSubmitRecord(record, doSourcing, ignoreMandatoryFields) function before the record is actually committed to the database.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts. I.Note: Values for all required fields must be provided or a newly instantiated record cannot be submitted.
 * <br>There may be additional required fields when custom forms are used. Also, Note records cannot be created as standalone records. These records are always associated with another record. Similarly, Message records require an author and recipient to ensure that they are not created as standalone records.
 * <br>API Governance: standard transactions: 10, standard non-transactions: 5, custom records: 2
 * @param {String} recType - The record internal ID name.
 * @param {Object} initObj [optional] - Contains an array of name/value pairs of defaults to be used during record initialization.
 * @returns {nlobjRecord} An nlobjRecord object of a new record
 * @since 2007.0
 * @throws SSS_INVALID_RECORD_TYPE
 * @throws SSS_TYPE_ARG_REQD
 */
function nlapiCreateRecord(recType, initObj) { };

/**
 * Creates an instance of a report definition object. The report is built on this object using subsequent methods.
 * <br>The report definition can be used to create a form for rendering the pivot table report in a browser, or the pivot table APIs can be used to extract the values of the individual rows and columns of the pivot table.
 * @returns {nlobjReportDefinition} nlobjReportDefinition
 * @since 2012.2
 */
function nlapiCreateReportDefinition() { };

/**
 * Creates an nlobjReportForm object to render the report definition.
 * @param {String} title - The title of the form.
 * @returns {nlobjReportForm} nlobjReportForm
 * @since 2012.2
 */
function nlapiCreateReportForm(title) { };

/**
 * Creates a new search. The search can be modified and run as an ad-hoc search, without saving it. Alternatively, calling nlobjSearch.saveSearch(title, scriptId) will save the search to the database, so it can be resused later in the UI or using nlapiLoadSearch(type, id).Note: This function is agnostic in terms of its filters argument. It can accept input of either a search filter (nlobjSearchFilter), a search filter list (nlobjSearchFilter[]), or a search filter expression (Object[]).
 * @param {String} recType - The record internal ID of the record type you are searching (for example, customer|lead|prospect|partner|vendor|contact).
 * @param {nlobjSearchFilter} filters [optional] - A single nlobjSearchFilter object or an array of nlobjSearchFilter object or a search filter expression.
 * @param {nlobjSearchColumn} columns [optional] - A single nlobjSearchColumn object or an array of nlobjSearchColumn objects. Note that you can further filter the returned nlobjSearch object by passing additional search return column values. You will do this using the nlobjSearch.setColumns(columns) method.
 * @returns {nlobjSearch} nlobjSearch
 * @since 2012.1
 */
function nlapiCreateSearch(recType, filters, columns) { };

/**
 * Returns a nlobjSubrecord object. Use this API to create a subrecord from a body field on the parent record. Important: This API should only be used in user event scripts on the parent record. Note, however, this API is not supported in beforeLoad user event scripts. This API is not currently supported in form-level or record-level client SuiteScripts associated with the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiCreateSubrecord(fldName) { };

/**
 * Converts a Date object into a String using the current user's date format
 * @param {Date} dt - Date object being converted into a String
 * @param {String} dtFormat [optional] - Format type to use: date,datetime,timeofday with date being the default
 * @returns {String} String format of the date that was passed: date(default), datetime, timeofday
 * @since 2005.0
 */
function nlapiDateToString(dt, dtFormat) { };

/**
 * Deletes a file and returns the internal ID of the file that was deleted. This API is supported in user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: 20
 * <br>Restriction: Server SuiteScript only
 * @param {Number} fileId - The internal ID for the file you want to delete
 * @returns {Number} The internal ID for the file that was deleted as an integer
 * @since 2009.1
 */
function nlapiDeleteFile(fileId) { };

/**
 * Use this API to delete an existing record. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: standard transactions: 20, standard non-transactions: 10, custom records: 4
 * @param {String} recType - The record internal ID name.
 * @param {Number} recId - The internalId for the record
 * @returns {Void}
 * @since 2007.0
 * @throws SSS_INVALID_RECORD_TYPE
 * @throws SSS_TYPE_ARG_REQD
 * @throws SSS_INVALID_INTERNAL_ID
 * @throws SSS_ID_ARG_REQD
 */
function nlapiDeleteRecord(recType, recId) { };

/**
 * Use this API to detache a single record from another record. The following detach relationships are supported:
 * <br>- Issue detached from Support Case
 * <br>- Contact detached from Customer,Partner,Vendor,Lead,Prospect,Project
 * <br>- File detached from any transaction, item, activity, custom, or entity record
 * <br>- Custom child record detached from supported parent record
 * <br>- Entity detached from a static entity group. Note that if detaching an entity from a static entity group, you must specify entitygroup as the internal ID for the type2 argument (see below).
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: 10
 * @param {String} srcRecType - The record internal ID name for the record being detached. For a list of record names, see the column called "Record Internal ID" in SuiteScript Supported Records.
 * @param {Number} srcRecId - The record internalId for the record being detached
 * @param {String} detachRecType - The record internal ID name for the record being detached from. Note that if detaching an entity from a static entity group, the internal ID for the entity group record type is entitygroup.
 * @param {Number} detachRecId - The record internalId for the record being detached from
 * @param {Object} attrObj [optional] - Name/value pairs containing attributes for the attachment:
 * <br> - customrecord*->parent record: field (the custom field used to link child custom record to parent record)
 * @returns {Void}
 * @since 2008.1
 */
function nlapiDetachRecord(srcRecType, srcRecId, detachRecType, detachRecId, attrObj) { };

/**
 * Sets the given field to disabled or enabled based on the value (true or false). This API is supported in client scripts only.
 * @param {String} fldName - The internal ID name of the field to enable/disable
 * @param {Boolean} isDisabled - If set to true the field is disabled. If set to false it is enabled. Important: The values for this parameter can be true or false, not T or F.
 * @returns {Void}
 */
function nlapiDisableField(fldName, isDisabled) { };

/**
 * Sets the given line item field of a sublist to disabled or enabled based on the value (true or false).
 * @param {String} subListType
 * @param {String} fldName - The name of the line item field to enable/disable
 * @param {Boolean} isDisabled - If set to true the field is disabled. If set to false it is enabled. Important: The values for this parameter can be true or false, not T or F.
 * @returns {Void}
 */
function nlapiDisableLineItemField(subListType, fldName, isDisabled) { };

/**
 * Returns a nlobjSubrecord object. Use this API to edit a subrecord from a sublist field on the parent record.Important: This API should only be used in user event scripts on the parent record. This API is not currently supported in form-level or record-level client SuiteScripts associated with the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiEditCurrentLineItemSubrecord(subListType, fldName) { };

/**
 * Returns a nlobjSubrecord object. Use this API to edit a subrecord from a body field on the parent record.Important: This API should only be used in user event scripts on the parent record. This API is not currently supported in form-level or record-level client SuiteScripts associated with the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiEditSubrecord(fldName) { };

/**
 * Encrypts a clear text String using a SHA-1 hash function. This is the same encryption used for password fields.
 * @param {String} s - String being encrypted
 * @param {String} algorithm [optional] - algorithm to use
 * @param {String} key [optional] - secret key to use
 * @returns {String} String
 * @since 2009.2
 */
function nlapiEncrypt(s, algorithm, key) { };

/**
 * Prepares a String for use in XML by escaping XML markup (for example, angle brackets, quotation marks, and ampersands)
 * @param {String} text - String being escaped
 * @returns {String} String
 * @since 2008.1
 */
function nlapiEscapeXML(text) { };

/**
 * Use this API to get the exchange rate between two currencies based on a certain date. The exchange rate values you are getting are those that appear in the Exchange Rate column of the Currency Exchange Rates record (see figure).Note: The Currency Exchange Rate record itself is not a scriptable record.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>
 * <br>When using this API, the first currency (sourceCurrency) is the one to look up relative to the second (targetCurrency), which MUST be a base currency. The date (effectiveDate) is the rate in effect on that date. If there are multiple rates, it is the latest entry on that date.
 * <br>For example, if you call nlapiExchangeRate('GBP', 'USD', '04/22/2010') and it returns '2', this means that if you were to enter an invoice on 4/22/10 for a GBP customer in your USD subsidiary, the rate would be 2.
 * <br>API Governance: 10
 * @param {String} fromCurrency - (String,Number) The currency internal ID or symbol. For example, you can use either 1 (currency ID) or USD (currency symbol). If you have the Multiple Currencies feature enabled in your account, you can see all currency IDs and symbols by going to Lists > Accounting > Currencies.
 * @param {String} toCurrency - (String,Number) The currency internal ID or symbol. Note that the targetCurrency must be the base currency. If the value you provide for targetCurrency parameter is not the base currency, null will be returned when the API is executed.
 * @param {String} effectiveDt [optional] - (String,Number) If not supplied, then effectiveDate reflects the current date.
 * @returns {Number} The exchange rate (as a float) in the same precision that is displayed in the NetSuite UI. Note that null is returned if the targetCurrency is not set to a base currency.
 * @since 2009.1
 */
function nlapiExchangeRate(fromCurrency, toCurrency, effectiveDt) { };

/**
 * This API returns the line number of a particular price in a given column. If the value is present on multiple lines, it will return the line item of the first line that contains the value. This API is supported in client and user event scripts. Use this API on a matrix sublists only.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * @param {String} subListType - The sublist internal ID. <br>
 * @param {String} fldName - The internal ID of the matrix field<br>
 * @param {String} fldValue - The value of the field<br>
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1, not 0.
 * @returns {Number} The line number (as an integer) of a specified matrix field
 * @since 2009.2
 */
function nlapiFindLineItemMatrixValue(subListType, fldName, fldValue, fldColumn) { };

/**
 * Use this API to find the line number of a specific field in a sublist. This API can be used on any sublists that supports SuiteScript. This API is supported in client and user event scripts only.
 * @param {String} subListType
 * @param {String} fldName - The field internal ID
 * @param {String} fldValue - The value of the field
 * @returns {Number} The line number (as an integer) of a specific sublist field
 * @since 2009.2
 */
function nlapiFindLineItemValue(subListType, fldName, fldValue) { };

/**
 * Formats a String into a currency field value
 * @param {String} text - String being formatted into currency
 * @returns {String} String
 * @since 2008.1
 */
function nlapiFormatCurrency(text) { };

/**
 * Used to branch scripts depending on the metadata or context of the execution. For example, you may want the script to perform in one way when a form is accessed via the UI and another when the form is accessed via Web services.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @returns {nlobjContext} Context Object
 * @since 2007.0
 */
function nlapiGetContext() { };

/**
 * This API returns the value of a datetime field on the currently selected line of a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then returned. If timeZone is not passed in, the datetime value is returned in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. This field ID must point to a datetime formatted field.
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {String} The string value of a Date/Time field on the currently selected line.
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
function nlapiGetCurrentLineItemDateTimeValue(type, fieldId, timeZone) { };

/**
 * Returns the line number of the currently selected line in a group.Note: The first line number on a sublist is 1 (not 0).
 * @param {String} subListType
 * @returns {Number} The integer value for the currently selected line number in a sublist
 * @since 2005.0
 */
function nlapiGetCurrentLineItemIndex(subListType) { };

/**
 * Use this API to get the value of the currently selected matrix field. This API should be used on matrix sublists only. This API is supported in client and user event scripts.Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field being set.
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1, not 0.
 * @returns {String} The string value of a field on the currently selected line in a matrix sublist. Returns null if the field does not exist.
 * @since 2009.2
 */
function nlapiGetCurrentLineItemMatrixValue(subListType, fldName, fldColumn) { };

/**
 * Returns the display name (the UI label) of a select field (based on its current selection) on the currently selected line. Typically used in validate line functions.
 * @param {String} subListType
 * @param {String} fldName - The name of the field being set
 * @returns {String} The string display name of a select field (based on its current selection) on the currently selected line. Returns null if the field does not exist.
 * @since 2005.0
 */
function nlapiGetCurrentLineItemText(subListType, fldName) { };

/**
 * Returns the value of a sublist field on the currently selected line
 * @param {String} subListType
 * @param {String} fldName - The name of the field being set
 * @returns {String} The string value of a field on the currently selected line. Returns null if field does not exist.
 * @since 2005.0
 */
function nlapiGetCurrentLineItemValue(subListType, fldName) { };

/**
 * This API returns the value of a datetime field. If timeZone is passed in, the datetime value is converted to that time zone and then returned. If timeZone is not passed in, the datetime value is returned in the default time zone.
 * @param {String} fieldId — The internal field ID. This field ID must point to a datetime formatted field.
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {String} The string value of a datetime field.
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
function nlapiGetDateTimeValue(fieldId, timeZone) { };

/**
 * Returns the values of a multiselect sublist field on the currently selected line. One example of a multiselect sublist field is the Serial Numbers field on the Items sublist.
 * <br>This function is not supported in client SuiteScript. It is meant to be used in user event scripts.
 * @param {String} recType - The sublist internal ID (for example, use addressbook as the ID for the Address sublist).
 * @param {String} fldName - The name of the multiselect field.
 * @returns {String[]} An array of string values for the multiselect sublist field (on the currently selected line)
 * @since 2012.1
 */
function nlapiGetCurrentLineItemValues(recType, fldName) { };

/**
 * This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @returns {Number} The integer value of the current user's department (for example, 3, 9, or 1)
 * @since 2005.0
 */
function nlapiGetDepartment() { };

/**
 * Use this function to obtain body field metadata. Calling this function instantiates the nlobjField object, which then allows you to use the methods available to nlobjField to get field metadata.
 * <br>This API is supported in client and user event scripts only. Note, however, when nlapiGetField is used in client scripts, the field object returned is read-only. The means that you can use nlobjField getter methods in client scripts (to obtain metadata about the field), but you cannot use nlobjField setter methods to set field properties.Note: To obtain metadata for sublist fields, use nlapiGetLineItemField(type, fldnamm, line).
 * @param {String} fldName - The internal ID of the field
 * @returns {nlobjField} Returns an nlobjField object representing this field
 * @since 2009.1
 */
function nlapiGetField(fldName) { };

/**
 * Use this API to get the text value (rather than the internal ID value) of a field. This API is available in client and user event scripts only.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} fldName - The internal ID of the field
 * @returns {String} The string UI display name for a select field corresponding to the current selection
 * @since 2005.0
 */
function nlapiGetFieldText(fldName) { };

/**
 * Returns the display names for a multiselect field corresponding to the current selection. This API is available in client and user event scripts only.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} fldName - The name of the field whose display values are returned
 * @returns {String[]} The display names for a multiselect field as an Array.
 * @since 2009.1
 */
function nlapiGetFieldTexts(fldName) { };

/**
 * Use this function to get the internal ID of a field. For example, if the customer Abe Simpson appears in a field, this function will return 87, which represents the internal ID value of the Abe Simpson customer record. Note that if you are getting the value of an inline checkbox, the return value will be F if the field is unset.
 * <br>This API is available in client and user event scripts only.
 * <br>Also be aware that this API is not supported during delete events. Calling nlapiGetFieldValue(...) on a record you are attempting to delete will return a user error.
 * <br>Also note that if you are trying to return an array of values from a multiselect field, it is recommended that you use the nlapiGetFieldValues(fldName) API.
 * <br>Finally, NetSuite recommends that you read the topic Getting Field Values in SuiteScript, which addresses the rare instances in which the value returned by this API is inconsistent.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} fldName - The internal ID name of the field.
 * @returns {String} The string value of a field on the current record, or returns null if the field does not exist on the record or the field is restricted.
 * @since 2005.0
 */
function nlapiGetFieldValue(fldName) { };

/**
 * Use this function to get an array of internal ID values for a multiselect field.
 * <br>This API is available in client and user event scripts only.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} fldName - The internal ID of the field. For a list of fields that are supported in SuiteScript and their internal IDs, see the SuiteScript Reference Guide.
 * @returns {String[]} The values of a multiselect field as an Array on the current record. Returns null if the field does not exist on the record or the field is restricted.
 * @since 2009.1
 */
function nlapiGetFieldValues(fldName) { };

/**
 * Returns a job manager instance (nlobjJobManager). You then use the methods on nlobjJobManager to create and submit your merge duplicate records request. This API is supported in script types that run on the server. You cannot use this function in a client script.
 * This API costs no governance units.
 * @param {String} jobType - Set to DUPLICATERECORDS.
 * @returns {nlobjJobManager} nlobjJobManager
 * @since 2013.1
 */
function nlapiGetJobManager(jobType) { };

/**
 * Use this API to determine the number of line items on a sublist. You can then use APIs such as nlapiInsertLineItem or nlapiRemoveLineItem to add or remove lines before/after existing lines.
 * <br>The nlapiGetLineItemCount API is available in Client and User Event scripts only. If you want to get the line count of a sublist in a Suitelet, see nlobjSubList.getLineItemCount(group).Important: The first line number on a sublist is 1 (not 0).
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType
 * @returns {Number} The integer value for the number of lines in a sublist for the current record
 * @since 2005.0
 */
function nlapiGetLineItemCount(subListType) { };

/**
 * This API returns the value of a datetime field on a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then returned. If timeZone is not passed in, the datetime value is returned in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {Number} lineNum — The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {String} The string value of a datetime field on a sublist.
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
function nlapiGetLineItemDateTimeValue(type, fieldId, lineNum, timeZone) { };

/**
 * Use this function to obtain sublist (line item) field metadata. Calling this function instantiates the nlobjField object, which then allows you to use all the methods available to nlobjField to get field metadata.Note: To obtain metadata for body fields, use nlapiGetField(fldName).
 * @param {String} subListType
 * @param {String} fldName - The internal ID of the sublist field
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {nlobjField} An nlobjField object representing this line item field
 * @since 2009.1
 */
function nlapiGetLineItemField(subListType, fldName, line) { };

/**
 * Use this API to obtain metadata for a field that appears in a matrix sublist. This API is supported in client and user event scripts.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>Calling this function instantiates the nlobjField object, which then allows you to use all the methods available to the nlobjField object.Note: To obtain metadata for body fields, use nlapiGetField(fldName).
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The internal ID of the field (line) whose value you want returned.
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1, not 0.
 * @returns {nlobjField} An nlobjField object representing this sublist field. Returns null if the field you have specified does not exist.
 * @since 2009.2
 */
function nlapiGetLineItemMatrixField(subListType, fldName, line, fldColumn) { };

/**
 * Use this API to get the value of a matrix field that appears on a specific line in a specific column. This API can be used only in the context of a matrix sublist. This API is supported in client and user event scripts.Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field whose value you want returned.
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1 (not 0).
 * @returns {String} The string value of the matrix field.
 * @since 2009.2
 */
function nlapiGetLineItemMatrixValue(subListType, fldName, line, fldColumn) { };

/**
 * Returns the display name of a select field (based on its current selection) in a sublist.
 * @param {String} subListType
 * @param {String} fldName - The name of the field being set
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} The string value of the display name of a select field (based on its current selection) in a sublist. Returns null if field does not exist on the record or the field is restricted.
 * @since 2005.0
 */
function nlapiGetLineItemText(subListType, fldName, line) { };

/**
 * Available only in client and user event SuiteScripts. Note that you cannot set default line item values when the line is not in edit mode.
 * <br>Also, NetSuite recommends that you read the topic Getting Field Values in SuiteScript, which addresses the rare instances in which the value returned by this API is inconsistent.Note: Normally custom transaction column fields that are not checked to show on a custom form are not available to get/setLineItemValue APIs. However, if you set them to show, but then set the label to empty, they will be available on the form but will not appear on the sublist. Note this does not apply to fields that are marked as Hidden on the custom field definition. These fields are always available on every form.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType
 * @param {String} fldName - The internal ID of the field (line item) whose value is being returned
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} The string value of a sublist line item
 * @since 2005.0
 */
function nlapiGetLineItemValue(subListType, fldName, line) { };

/**
 * Returns the values of a multiselect sublist field on a selected line. One example of a multiselect sublist field is the Serial Numbers field on the Items sublist.
 * <br>This function is not supported in client SuiteScript. It is meant to be used in user event scripts.
 * @param {String} recType - The sublist internal ID (for example, use addressbook as the ID for the Address sublist).
 * @param {String} fldName - The internal ID of the multiselect field
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String[]} An array of string values for the multiselect sublist field
 * @since 2012.1
 */
function nlapiGetLineItemValues(recType, fldName, line) { };

/**
 * Returns the integer value of the current user's location. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @returns {Number} The integer value of the current user's location (for example, 5, 7, -2). Note that if a location has not been set, the value of -1 is returned.
 * @since 2005.0
 */
function nlapiGetLocation() { };

/**
 * Returns the NetSuite login credentials of currently logged-in user.
 * This API is supported in user event, portlet, Suitelet, RESTlet, and SSP scripts. For information about the unit cost associated with this API, see API Governance.
 * @returns {nlobjLogin} nlobjLogin
 * @since 2012.2
 */
function nlapiGetLogin() { };

/**
 * Use this API in a matrix sublist to get the number of columns for a specific matrix field. This API is supported in client and user event scripts.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript. Note: The first column in a matrix is 1, not 0.
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The field internal ID of the matrix field.
 * @returns {Number} The integer value for the number of columns of a specified matrix field
 * @since 2009.2
 */
function nlapiGetMatrixCount(subListType, fldName) { };

/**
 * Use this API to get field metadata for a matrix "header" field in a matrix sublist.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>For example, if the Quantity Pricing feature is enabled in your account, you will see the Qty fields at the top of the pricing matrix. The Qty fields are considered to be the header fields in the pricing matrix.
 * <br>This API is supported in client and user event scripts.
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix header field.
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1 (not 0).
 * @returns {nlobjField} nlobjField object
 * @since 2009.2
 */
function nlapiGetMatrixField(subListType, fldName, fldColumn) { };

/**
 * Use this API to get the value of a matrix "header" field in a matrix sublist.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>For example, if the Quantity Pricing feature is enabled in your account, you will see the Qty fields at the top of the pricing matrix. The Qty fields are considered to be the header fields in the pricing matrix.
 * <br>This API is supported in client and user event scripts.
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix header field.
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1 (not 0).
 * @returns {Number} The integer value of a matrix header field. For example, on the Pricing sublist the value of a specified quantity level (Qty) field is returned.
 * @since 2009.2
 */
function nlapiGetMatrixValue(subListType, fldName, fldColumn) { };

/**
 * Available in beforeLoad, beforeSubmit, and afterSubmit user event scripts. This API never reflects any changes set by the system during the submit operation. It only reflects the field and line item (sublist) values submitted by the user.
 * <br>Note that you are not allowed to submit the current or previous record returned by nlapiGetNewRecord(). Also note that only fields that are changed (submitted) will be available via nlapiGetNewRecord().
 * <br>Restriction: User Event scripts only
 * @returns {nlobjRecord} An nlobjRecord containing all the values being used for a write operation
 * @since 2008.1
 */
function nlapiGetNewRecord() { };

/**
 * Available in beforeLoad, beforeSubmit, and afterSubmit user event scripts. You are not allowed to submit the current or previous record returned by nlapiGetOldRecord().
 * <br>Restriction: beforeSubmit|afterSubmit User Event scripts only
 * @returns {nlobjRecord} An nlobjRecord containing all the values for the current record prior to the write operation
 * @since 2008.1
 */
function nlapiGetOldRecord() { };

/**
 * Use this API to retrieve the internalId of the current record in a user event script. This API is available in client and user event scripts only.
 * @returns {Number} The integer value of the record whose form the user is currently on, or for the record that the current user event script is executing on. Note that the value of -1 is returned if there is no current record or the current record is a new record.
 * @since 2007.0
 */
function nlapiGetRecordId() { };

/**
 * Use this API to retrieve the record type internal ID of the current record in a user event script or a client script. If there is no current record type, the value of null will be returned.
 * @returns {String} The record type internal ID as a string.
 * @since 2007.0
 */
function nlapiGetRecordType() { };

/**
 * Returns the internalId for the current user's role. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @returns {Number} The integer value of the current user's role (for example: 1, 3, or 5). Note that the value of -31 is returned if a user cannot be properly identified by NetSuite. This occurs when the user has not authenticated to NetSuite, for example when using externally available (Available without Login) Suitelets or online forms.
 * @since 2005.0
 */
function nlapiGetRole() { };

/**
 * Returns the internalId for the current user's subsidiary. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @returns {Number} The integer value for the current user's subsidiary (for example 1, 3, or 5). Note that if a subsidiary has not been set (for example, the subsidiaries feature is not turned on in the user's account), the value of 1 is returned if this function is called.
 * @since 2008.1
 */
function nlapiGetSubsidiary() { };

/**
 * Returns the internalId of the current NetSuite user. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @returns {Number} The integer value of the current user (for example, 195, 25, 21). Note that the value of-4 is returned if a user cannot be properly identified by NetSuite. This occurs when the user has not authenticated to NetSuite, for example when using externally available (Available without Login) Suitelets or online forms.
 * @since 2005.0
 */
function nlapiGetUser() { };

/**
 * Use this function to initiate a workflow on-demand. This function is the programmatic equivalent of the Initiate Workflow action in the SuiteFlow Manager. The function returns the workflow instance ID for the workflow-record combination. A user error is thrown if the record in the workflow is invalid or not supported for that workflow.
 * <br>This API is supported in user event, scheduled, portlet, Suitelet, mass update, and workflow action scripts.
 * <br>API Governance: 20
 * @param {String} recType - The record type ID of the workflow base record (for example, 'customer', 'salesorder', 'lead'). In the Workflow Manager this is the record type that is specified in the Record Type field.
 * @param {Number} recId - The internal ID of the base record.
 * @param {String} workflowId - String or number. The internal ID or script ID for the workflow definition. This is the ID that appears in the ID field on the Workflow Definition Page.
 * @returns {Number} The internal ID (int) of the workflow instance used to track the workflow against the record.
 * @since 2010.1
 */
function nlapiInitiateWorkflow(recType, recId, workflowId) { };

/**
 * Inserts a line above the currently selected line in a sublist. Available to client and user event scripts only.
 * @param {String} subListType
 * @param {Number} line - The line number in which to insert new line. Note the first line number on a sublist is 1 (not 0).
 * @returns {Void}
 * @since 2005.0
 */
function nlapiInsertLineItem(subListType, line) { };

/**
 * Adds a select option to a select/multiselect field that was added through scripting. This field will appear as a line item on a sublist.
 * <br>Note that this API can only be used on select/multiselect fields that are added via the UI Objects API (for example on Suitelets or beforeLoad user events).
 * <br>For performance reasons, you should disable the drop-down before adding multiple options, then enable the drop-down when finished.
 * <br>Restriction: Client SuiteScript only
 * @param {String} subListType
 * @param {String} fldName - The name of the scripted field
 * @param {String} optValue - (String,Number) A unique value for the select option. Note that the datatype for this argument will vary depending on the value that is set. For example, you may assign numerical values such as 1, 2, 3 or string values such as option1, option2, option3.
 * @param {String} optText - The display name of the select option
 * @param {Boolean} isSelected [optional] - If not set, this argument defaults to false. If set to true, the selected option will become the default selection. Note: The values for this parameter are true or false, not T or F.
 * @returns {Void}
 * @since 2008.2
 */
function nlapiInsertLineItemOption(subListType, fldName, optValue, optText, isSelected) { };

/**
 * Adds a select option to a select/multiselect field added via script. Note that this API can only be used on select/multiselect fields that are added via the UI Objects API (for example, in Suitelets or beforeLoad user events scripts).
 * <br>Restriction: Client SuiteScript only
 * @param {String} fldName - The internalId of the scripted field
 * @param {String} optValue - (String,Number) A unique value for the select option. Note that the datatype for this argument will vary depending on the value that is set. For example, you may assign numerical values such as 1, 2, 3 or string values such as option1, option2, option3.
 * @param {String} optText - The display name of the select option
 * @param {Boolean} isSelected [optional] - If not set, this argument defaults to false. If set to true, the select option becomes the default option. Important: The values for this parameter can be true or false, not T or F.
 * @returns {Void}
 * @since 2008.2
 */
function nlapiInsertSelectOption(fldName, optValue, optText, isSelected) { };

/**
 * Determines whether any changes have been made to a sublist
 * <br>Restriction: Client SuiteScript only
 * @param {String} subListType
 * @returns {Boolean} Returns true if the currently selected line of the sublist has been edited
 * @since 2005.0
 */
function nlapiIsLineItemChanged(subListType) { };

/**
 * Use this API to load a NetSuite configuration page. The following configuration pages support SuiteScript: Company Information, General Preferences, User Preferences, Accounting Preferences, Accounting Periods, Tax Periods.
 * Once a page is loaded, you can set configuration values using nlobjConfiguration.setFieldValue(name, value).
 * The nlapiLoadConfiguration function is available in scheduled scripts, user event scripts, and Suitelets. It consumes 10 usage units per call.
 * @param {String} type -  [required] - The internal ID of the configuration page. Available IDs are:
 * <br> - companyinformation - The internal ID for the Company Information page (Setup > Company > Company Information).
 * <br> - companypreferences - The internal ID for the General Preferences page(Setup > Company > General Preferences).
 * <br> - userpreferences - The internal ID for the Set Preferences page (Home > Set Preferences).
 * <br> - accountingpreferences - The internal ID for the Accounting Preferences page (Setup > Accounting > Accounting Preferences).
 * <br> - accountingperiods - The internal ID for the Accounting Periods page (Setup > Accounting > Manage Accounting Periods).
 * <br> - taxperiods - The internal ID for the Tax Periods page (Setup > Accounting > Manage Tax Periods).
 * <br> - companyfeatures - The internal ID for looking up which features are enabled in an account.
 * @returns {nlobjConfiguration} nlobjConfiguration object
 * @since 2009.2
 */
function nlapiLoadConfiguration(type) { };

/**
 * Loads a file from the NetSuite file cabinet (using the file's internal ID or path). Returns an nlobjFile containing the file's metadata (name and type) and contents in the form of a String (base-64 encoded if the file's type is binary). The script context must have privileges to the file (based on folder permissions), and the file cannot be a hidden (bundled) file.
 * <br>This API is supported in user event, scheduled, portlet, and Suitelet scripts.
 * <br>Note: There is a 5MB limitation to the size of the document that can be accessed using this API.
 * <br>API Governance: 10
 * <br>Restriction: Server SuiteScript only
 * @param {String} fileId - (String,Number) The internal id of the file in the file cabinet. Can also be a relative path to the file in the file cabinet (for example: SuiteScript/myfile.js).
 * @returns {nlobjFile} An nlobjFile object
 * @since 2008.2
 */
function nlapiLoadFile(fileId) { };

/**
 * Loads an existing record from the system and returns an nlobjRecord object containing all the field data for that record. You can then extract the desired information from the loaded record using the methods available on the returned record object. This API is a core API. It is available in both client and server contexts.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts. Important: Only records that support SuiteScript can be loaded using this API. Also be aware that if a particular record instance has been locked by the Lock Record workflow action, you will be unable to load the record using the nlapiLoadRecord(...) API.
 * <br>Note that when using this API, you can:
 * <br>- set the type parameter to 'inventoryitem' to load the follwing types of item records: inventoryitem, lotnumberedinventoryitem, serializedinventoryitem
 * <br>- set the type parameter to 'assemblyitem' to load the following types of item records: assemblyitem, lotnumberedassemblyitem, serializedassemblyitem
 * <br>- set the type parameter to 'customer' to load the following types of entity records: customer, lead, prospect
 * <br>API Governance: standard transactions: 10, standard non-transactions: 5, custom records: 2
 * @param {String} recType - The record internal ID name. This parameter is case-insensitive. 
 * @param {Number} recId - internalId for the record, for example 555 or 78.
 * @param {Object} initObj [optional] - Contains an array of name/value pairs of defaults to be used during record initialization.
 * @returns {nlobjRecord} An nlobjRecord object of an existing NetSuite record. This function returns the record object exactly as the record appears in the system. Therefore, in beforeLoad user event scripts, if you attempt to change a field and load the record simultaneously, the change will not take effect.
 * @since 2007.0
 * @throws SSS_INVALID_RECORD_TYPE
 * @throws SSS_TYPE_ARG_REQD
 * @throws SSS_INVALID_INTERNAL_ID
 * @throws SSS_ID_ARG_REQD
 */
function nlapiLoadRecord(recType, recId, initObj) { };

/**
 * Loads an existing saved search. The saved search could have been created using the UI, or created using nlapiCreateSearch(type, filters, columns) in conjunction with nlobjSearch.saveSearch(title, scriptId).
 * <br>API Governance: 5
 * @param {String} recType [optional] - The record internal ID of the record type you are searching (for example, customer|lead|prospect|partner|vendor|contact). This parameter is case-insensitive. 
 * @param {String} searchId - The internal ID or script ID of the saved search. The script ID of the saved search is required, regardless of whether you specify the search type. If you do not specify the search type, you must set type to null and then set the script/search ID.
 * @returns {nlobjSearch} nlobjSearch
 * @since 2012.1
 */
function nlapiLoadSearch(recType, searchId) { };

/**
 * This API is supported in Suitelet, scheduled, portlet, user event, and record-level (global) client scripts.
 * <br>Use this API to log an entry on the Execution Log subtab. The Execution Log subtab appears on the Script Deployment page for a script. See Using the Script Execution Log to learn more about writing logs to the Execution Log subtab.Note: When you are debugging a script in the SuiteScript Debugger, log details appear on the Execution Log tab of the SuiteScript Debugger, NOT the script's Script Deployment page.
 * <br>The log type argument is used in conjunction with the Log Level field on the Script Deployment to determine whether to log an entry on the Execution Log subtab. If a log level is defined on a Script Deployment, then only nlapiLogExecution calls with a log type equal to or greater than this log level will be logged. This is useful during the debugging of a script or for providing useful execution notes for auditing or tracking purposes. See Setting Script Execution Log Levels for more information using the Log Level field.
 * <br>Important: Be aware that NetSuite governs the amount of logging that can be done by a company in any given 60 minute time period. For complete details, see Governance on Script Logging.
 * <br>Also note that if the script's deployment status is set to Released, then the default Log Level is ERROR. If the status is set to Testing, the default Log Level is DEBUG.Note: The Execution Log tab also lists notes returned by NetSuite such as error messages. For additional information on using the Execution Log, see Using the Script Execution Log in the NetSuite Help Center.
 * @param {String} logType - One of the following log types:
 * <br> - DEBUG
 * <br> - AUDIT
 * <br> - ERROR
 * <br> - EMERGENCY
 * @param {String} title [optional] - A title used to organize log entries (max length: 99 characters). If you set title to null or empty string (''), you will see the word "Untitled" appear in your log entry.
 * @param {String} details [optional] - The details of the log entry (max length: 3000 characters)
 * @returns {Void}
 * @since 2008.1
 */
function nlapiLogExecution(logType, title, details) { };

/**
 * Performs a search for one or more body fields on a record. This function supports joined-field lookups. Note that the notation for joined fields is: join_id.field_name
 * <br>Note: Long text fields are truncated at 4000 characters in search/lookup operations.
 * <br>This API is available in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: standard transactions: 10, standard non-transactions: 5, custom records: 2
 * @param {String} recType - The record internal ID name.  Record IDs are listed in the "Record Internal ID" column.
 * @param {Number} recId - The internalId for the record, for example 777 or 87.
 * @param {String} fldNames - String or array of strings. Sets an array of column/field names to look up, or a single column/field name. The fields parameter can also be set to reference joined fields (see the third code sample).
 * @param {Boolean} isText [optional] - If not set, this argument defaults to false and the internal ID of the drop-down field is returned. If set to true, this argument returns the UI display name for this field or fields (valid only for SELECT,IMAGE,DOCUMENT fields).
 * @returns {String} - (String,Object) A single value or an associative array of field name -> value (or text) pairs depending on the field's argument.
 * @since 2008.1
 */
function nlapiLookupField(recType, recId, fldNames, isText) { };

/**
 * Performs a mail merge operation and returns an nlobjFile object containing the results. This API is supported in user event, scheduled, and Suitelet scripts.Note: There is a 5MB limitation to the size of the file that can be merged using this API.
 * <br>Important: This API supports the same records types that are supported in NetSuite's mail merge feature. Supported record types include NetSuite transactions, entities, custom records, and support cases. Note that activity type records such as tasks and events are not currently supported. Also note that transaction column fields are not supported in NetSuite mail merge and therefore are not available through nlapiMergeRecord.Note: With nlapiSendEmail(author, recipient, subject, body, cc, bcc, records, attachments) you can use NetSuite email templates to construct the body of the email using nlapiMergeRecord. The nlapiMergeRecord API performs a merge operation using a NetSuite email template and up to two business records.
 * <br>API Governance: 10
 * <br>Restriction: only supported for record types that are available in mail merge: transactions, entities, custom records, and cases
 * <br>Restriction: Server SuiteScript only
 * @param {Number} emailTemplateId - The internalId of the email template
 * @param {String} recType - The recordType for the primary record used in the merge
 * @param {Number} recId - The internalId for the primary record used in the merge
 * @param {String} altRecType [optional] - The recordType for the secondary record used in the merge
 * @param {Number} altRecId [optional] - The internalId for the secondary record used in the merge
 * @param {Object} tagsObj [optional] - Array of NL tag names to data values (custom name-value merge fields used for merge operation). Note that tag names must begin with NL.
 * @returns {nlobjFile} An nlobjFile object containing the results of the merge operation
 * @since 2008.1
 */
function nlapiMergeRecord(emailTemplateId, recType, recId, altRecType, altRecId, tagsObj) { };

/**
 * Use this API to generate a new OAuth token for a user. Currently this API can be called from portlet scripts, user event scripts, and Suitelets only.
 * <br>Note that you must have the SuiteSignOn feature enabled in your account before you can use SuiteSignOn functionality. (To enable these features, go to Setup > Company > Enable Features. On the SuiteCloud tab, select the Web Services check box and the SuiteSignOn check box, then click Save.)
 * <br>Restriction: Suitelets and Portlets only
 * <br>API Governance: 20
 * @param {String} scriptId - The custom scriptId specified on the SuiteSignOn record (see figure). NetSuite recommends you create a custom scriptId for each SuiteSignOn record to avoid naming conflicts should you decide use SuiteBundler to deploy your scripts into other accounts.
 * @returns {String} URL, OAuth token, and any integration variables as a string
 * @since 2009.2
 */
function nlapiOutboundSSO(scriptId) { };

/**
 * Returns an nlobjFile object containing the PDF or HTML document. This API is supported in user event, scheduled, and Suitelet scripts.Note: There is a 5MB limitation to the size of the file that can be accessed using this API.
 * <br>There are two primary use cases for nlapiPrintRecord:1. Send email or fax attachments using either nlapiSendEmail(author, recipient, subject, body, cc, bcc, records, attachments) or nlapiSendFax(author, recipient, subject, body, records, attachments). See Example 1 and Example 2.For example, you can create a PDF or HTML object of a transaction or statment and then send the object as an attachment. This would be useful when sending out monthly collections notices for customers with overdue invoices.2. Stream PDF/HTML documents to the server (for example, to maintain an archive of statement/transactions on your server). Example 3.Important: nlapiPrintRecord is not supported in client scripting. This is a server-side-only API. Also note that this function does not send transactions or statements to a printer to be printed. It also does not launch Adobe Acrobat if the mode specified is PDF.
 * <br>Restriction: Server SuiteScript only
 * <br>API Governance: 10
 * @param {String} printType - Print operation type. Can be any of the following:
 * <br> - TRANSACTION
 * <br> - STATEMENT
 * <br> - PACKINGSLIP
 * <br> - PICKINGTICKET
 * <br> - BILLOFMATERIAL
 * @param {Number} transactionId - The internal ID of the transaction or statement being printed
 * @param {String} outputType [optional] - The output type: PDF,HTML,DEFAULT. DEFAULT uses the user/company preference for print output
 * @param {Object} configObj [optional] - Name/value pairs used to configure the print operation.
 * <br> - TRANSACTION: formnumber
 * <br> - STATEMENT: openonly (T,F), startdate, statementdate, formnumber
 * <br> - PACKINGSLIP: formnumber, itemfulfillment
 * <br> - PICKINGTICKET: formnumber, shipgroup, location
 * @returns {nlobjFile} nlobjFile object
 * @since 2008.1
 */
function nlapiPrintRecord(printType, transactionId, outputType, configObj) { };

/**
 * Makes a server call in order to refresh staticlist (read-only) sublists.
 * <br>For inlineeditor or editor sublists, it simply redraws the sublist.
 * <br>This API does not do anything for sublists of type list.
 * <br>Restriction: Only supported for sublists of type inlineeditor, editor, and staticlist
 * <br>Restriction: Client SuiteScript only.
 * @param {String} subListType
 * @returns {Void}
 * @since 2005.0
 */
function nlapiRefreshLineItems(subListType) { };

/**
 * This API is available within a client SuiteScript associated with a custom FORM portlet, or from JavaScript event handlers attached to portlet elements. This API cannot be called directly from within a FORM portlet script.
 * @returns {Void}
 * @since 2011.1
 */
function nlapiRefreshPortlet() { };

/**
 * Returns a nlobjSubrecord object. Use this API to remove a subrecord from a sublist field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {Void}
 * @since 2011.2
 */
function nlapiRemoveCurrentLineItemSubrecord(subListType, fldName) { };

/**
 * Removes the currently selected line in a sublist. Available to client and user event scripts only.Note: For Scheduled scripts, use the equivalent record-level method: nlobjRecord.removeLineItem(group, line).
 * @param {String} subListType - The sublist internal ID
 * @param {Number} line  The line number in which to remove. Note the first line number on a sublist is 1 (not 0).
 * @returns {Void}
 * @since 2005.0
 */
function nlapiRemoveLineItem(subListType, line) { };

/**
 * Removes a single select option from a select or multiselect line item field added through a script
 * <br>Restriction: Client SuiteScript only
 * @param {String} subListType -  The sublist internal ID
 * @param {String} fldName - The name of the scripted field
 * @param {String} optValue - The value of the select option to be removed or null to delete all the options
 * @returns {Void}
 * @since 2008.2
 */
function nlapiRemoveLineItemOption(subListType, fldName, optValue) { };

/**
 * Removes a single select option from a select or multiselect field added via script. Note that this API call can only be used on select/multiselect fields that are added via the UI Objects API (for example on Suitelets or beforeLoad user event scripts).
 * <br>Restriction: Client SuiteScript only
 * @param {String} fldName   - The name of the scripted field
 * @param {String} optValue   - The value of the select option to be removed or null to delete all the options
 * @returns {Void}
 * @since 2008.2
 */
function nlapiRemoveSelectOption(fldName, optValue) { };

/**
 * Returns a nlobjSubrecord object. Use this API to remove a subrecord from a body field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {Void}
 * @since 2011.2
 */
function nlapiRemoveSubrecord(fldName) { };

/**
 * Requests an HTTP(s) URL (internal or external). Note a timeout occurs if the initial connection takes > 5 seconds and/or the request takes > 45 to respond.
 * nlapiRequestURL automatically encodes binary content using base64 representation, since JavaScript is a character-based language with no support for binary types. This means you can take the contents returned  and save them in the NetSuite file cabinet as a file or stream them directly to a response.
 * Also note that if you call nlapiRequestURL, passing in the header with a content type, NetSuite respects the following types:
 * <br>- all text media types (types starting with “text/”)
 * <br>- "application/json"
 * <br>- "application/soap+xml"
 * <br>Otherwise, NetSuite will overwrite the content type with our default type as if the type had not been specified. NetSuite default types are:
 * <br>- "text/xml; charset=UTF-8"
 * <br>- "application/x-www-form-urlencoded; charset=UTF-8"
 * Additionally, nlapiRequestURL calls from the server do not include the current user's session information. This means you can only use this API to request Suitelets that are set to  using the external URL.
 * Usage metering allowed is 10 units. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * @param {String} url - The HTTP(s) URL being requested - (fully qualified unless NetSuite page)
 * @param {Object} postData [optional] - Body used for a POST request. It can either be an associative array of form parameters or a string. If set to null , then a GET request is used.
 * @param {Object} headers [optional] - An associative array of name (header) value (header value) pairs.
 * @param {Function} callback [optional] - A callback function called when the request is completed ( client SuiteScript only ). IMPORTANT: There is NO callback parameter when you use nlapiRequestURL(...) in a server-side call. In a server-side call, httpMethod becomes the fourth parameter for this API, as in: nlapiRequestURL(url, postdata, headers, httpMethod).
 * If you specifiy a callback a client-side SuiteScript, the request is processed asynchronously, and once it is processed, the callback is called/invoked.
 * If you know your request may take a long time and you do not want to impair user experience, it is recommended that you set the callback function within nlapiRequestURL so that the request is processed asynchronously. If a callback function is specified, then the response will be passed, instead to the callback function, upon completion.
 * However, if validation is needed, nlapiRequestURL should run synchronously and the callback function should be omitted from nlapiRequestURL. For example:
 * @param {String} httpMethod [optional] - Specify the appropriate http method to use for your integration. IMPORTANT: When using nlapiRequestURL(...) in a server-side script, httpMethod becomes the fourth parameter. In other words, the function signature in a server-side script is nlapiRequestURL(url, postdata, headers, httpMethod).
 * Supported http methods are HEAD, DELETE and PUT. This parameter allows for easier integration with external RESTful services using the standard REST functions. Note that if the httpMethod parameter is empty or not specified, this behavior is followed: the method is POST if postdata is not empty. The method is GET if it is.
 * Be aware that the httpMethod parameter overrides, so you can specify GET and specify postdata, NetSuite will do a GET and ignore the postdata.
 * @returns {Object} Object or void if a callback function has been specified)
 * @throws SSS_REQUEST_TIME_EXCEEDED — if the request exceeds the 45 second timeout period
 * @throws SSS_INVALID_URL (with “Invalid URL — Connection Closed” message) — if the connection is closed due to an invalid URL, including those containing white space
 * @throws SSS_CONNECTION_CLOSED (with “Connection Closed” message) — if the connection is closed because the server associated with the URL is unresponsive
 * @throws SSS_CONNECTION_TIME_OUT — if the initial connection exceeds the 5 second timeout period
 */
function nlapiRequestURL(url, postData, headers, callback, httpMethod) { };

/**
 * Allows you to send credentials outside of NetSuite. This API securely accesses a handle to credentials that users specify in a NetSuite credential field.
 * Note a timeout occurs if the internal connections takes > 5 seconds and/or the request takes> 45 seconds to respond.
 * Also note that if you call nlapiRequestURLWithCredentials, passing in the header with a content type, NetSuite respects only the following two types:
 * <br>- "application/json"
 * <br>- "application/soap+xml"
 * Otherwise, NetSuite will overwrite the content type with our default type as if the type had not been specified. NetSuite default types are: 
 * <br>- "text/xml; charset=UTF-8"
 * <br>- "application/x-www-form-urlencoded; charset=UTF-8"
 * You can Base64 any part of the request by wrapping any text in $base64(<input text>). NetSuite will then Base64 encode the values in <input text>. This can be done in the value of a header, in the post body, or url. See .
 * If you require additional encryption or encoding on the request string, you can pass an nlobjCredentialBuilder object to nlapiRequestURLWithCredentials in the url, postdata or headers argument. The  constructor takes in a user defined string, that can include an embedded globally unique string (GUID), and your URL's host name. nlobjCredentialBuilder includes six string transformation methods: two encryption methods for SHA-1 and SHA-256 encryption, two encoding methods for Base64 and UTF8 encoding, a character replacement method, and a string appending method. See .
 * Usage metering allowed for this API is 10 units. 
 * @param {String} credentials List of credential handles. This API does not know where you have stored the data, it only knows the credentials to use by handle. Therefore, if you have multiple credentials for a single call, you will need a list. The handles are 32 byte, globally unique strings (GUIDs).
 * @param {String} url (String or nlobjCredentialBuilderObject) The HTTP(s) URL being requested - (fully qualified unless NetSuite page).
 * @param {String} postdata [optional] (String, nlobjCredentialBuilderObject or Object) Body used for a POST request. It can be a string, an nlobjCredentialBuilder object, an associative array of form parameter pairs, or an associative array of form parameter and nlobjCredentialBuilder object pairs. If set to null , then a GET request is used.
 * @param {Object} headers [optional] (nlobjCredentialBuilderObject or Object) Can be an nlobjCredentialBuilder object, an associative array of header and header value pairs, or an associative array of header and nlobjCredentialBuilder object pairs.
 * @param {String} httpMethod [optional] Specify the appropriate http method to use for your integration. Supported http methods are HEAD, DELETE and PUT. This parameter allows for easier integration with external RESTful services using the standard REST functions. Note that if the httpMethod parameter is empty or not specified, this behavior is followed: the method is POST if postdata is not empty. The method is GET if it is.
 * Be aware that the httpMethod parameter overrides, so you can specify GET and specify postdata, NetSuite will do a GET and ignore the postdata.
 * @returns {Object}
 * @since 2012.1
 */
function nlapiRequestURLWithCredentials(credentials, url, postdata, headers, httpMethod) { };

/**
 * This API can be used to ensure that a custom form portlet's embedded iframe resizes when the size of its contents change. This type of iframe does not resize automatically as its contents change, so when a form portlet's contents shrink they are surrounded by white space, and when contents grow they are cut off. A call to this API prevents these display issues.
 * <br>This API is available within a client SuiteScript associated with a custom FORM portlet, or from JavaScript event handlers attached to portlet elements. This API cannot be called directly from within a FORM portlet script.
 * @returns {Void}
 * 
 * @since 2011.1
 */
function nlapiResizePortlet() { };

/**
 * Creates a URL on-the-fly by passing URL parameters from within your SuiteScript. For example, when creating a SuiteScript Portlet script, you may want to create and display the record URLs for each record returned in a search.
 * <br>When creating the URL, you can use either the RECORD reference as retrieved in a search result or a known TASKLINK. Each page in NetSuite has a unique Tasklink Id associated with it for a given record type. Refer to the SuiteScript Reference Guide for a list of available NetSuite tasklinks.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>Note: You can also discover the Tasklink for a page within NetSuite by viewing the HTML page source. Search for a string similar to the following, where LIST_SCRIPT refers to the TASKLINK.onclick="nlPopupHelp('LIST_SCRIPT','help')
 * @param {String} urlType - The base type for this resource. These types include:
 * <br> - RECORD - Record Type
 * <br> - TASKLINK - Task Link
 * <br> - SUITELET - Suitelet
 * @param {String} recTypeOrScriptId - The primary id for this resource (recordType for RECORD, scriptId for SUITELET)
 * @param {String} recIdOrDeployId [optional] - The secondary id for this resource (recordId for RECORD, deploymentId for SUITELET). Important: This argument is required if type has been set to RECORD and you are trying to resolve to a specific NetSuite record. In the scenario, you must set id to the id of the target record.
 * @param {String} displayMode [optional] - If the type argument is set to RECORD, set displayMode to either VIEW or EDIT to return a URL for the record in EDIT mode or VIEW mode. Note that even for RECORD calls, the displayMode argument is optional. The default value is VIEW.
 * @returns {String} Depending on the values specified for the type and displayMode arguments, returns URL string to an internal NetSuite resource or an external/internal URL to a Suitelet.
 * 
 * @since 2007.0
 */
function nlapiResolveURL(urlType, recTypeOrScriptId, recIdOrDeployId, displayMode) { };

/**
 * A call to this API places a scheduled script into the NetSuite scheduling queue. For this to work, the scheduled script must have a status of Not Scheduled on the Script Deployment page. If the script's status is set to Testing on the Script Deployment page, the API will not place the script into the scheduling queue.
 * If the deployment status on the Script Deployment page is set to Scheduled, the script will be placed into the queue according to the time(s) specified on the Script Deployment page.
 * <br>This API is supported in user event, portlet, scheduled, and Suitelet scripts.
 * <br>Important:  There is no unit metering if you are re-queueing the current script (see Example 1 - Rescheduling a Script). Note, however, nlapiScheduleScript is still 20 units per call if you are trying to schedule other scripts.
 * One or more calls to nlapiScheduleScript can be made from Suitelet, user event, and portlet scripts. Note that you can also call nlapiScheduleScript from within a scheduled script to:1. Place the currently executing scheduled script back into the scheduled script workqueue.2. Call another scheduled script. When the new script is called, it is then put in the scheduled script workqueue.3. Place a scheduled script into the queue from another script type, such as a user event script or a Suitelet.Note:  Only administrators can run scheduled scripts. If a user event script calls nlapiScheduleScript, the user event script has to be deployed with admin permissions.
 * For additional details specific to using nlapiScheduleScript, see Using nlapiScheduleScript to Deploy a Script into the Scheduling Queue.
 * For general details on working with scheduled scripts, see Overview of Scheduled Script Topics. 
 * <br>API Governance: 20
 * @param {String} scriptId - String or number. The script internalId or custom scriptId
 * @param {String} deployId [optional] - String or number. The deployment internal ID or script ID. If empty, the first "free" deployment will be used. Free means that the script's deployment status appears as Not Scheduled or Completed. If there are multiple "free" scripts, the NetSuite scheduler will take the first free script that appears in the scheduling queue.
 * @param {Object} paramObj [optional] - Object of name/values used in this schedule script instance - used to override the script parameters values for this execution.
 * @returns {String} A string whose value is QUEUED if the script was successfully queued by this call, or it returns the script's current status. Valid status values are:
 * @since 2008.1
 */
function nlapiScheduleScript(scriptId, deployId, paramObj) { };

/**
 * Performs a search for duplicate records based on the account's Duplicate Detection configuration. Note that this API only works for records that support duplicate record detection. These records include customers, leads, prospects, contacts, partners, and vendors.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>Restriction: returns the first 1000 rows in the search
 * <br>API Governance: 10
 * @param {String} recType - The record internal ID name you are checking duplicates for (for example, customer,lead,prospect,partner,vendor,contact).
 * @param {Object} fldNames [optional] - The internal ID names of the fields used to detect duplicate (for example, companyname,email,name,phone,address1,city,state,zipcode). Depending on the use case, fields may or may not be a required argument. If you are searching for duplicates based on the fields that appear on a certain record type, fields would be a required argument. If you are searching for the duplicate of a specific record (of a specifed type), you would set id and not set fields.
 * @param {Number} recId [optional] - internalId of existing record. Depending on the use case, id may or may not be a required argument. If you are searching for a specific record of a specified type, you must set id. If you are searching for duplicates based on field names, you will not set id; you will set fields.
 * @returns {nlobjSearchResult[]} - An Array of nlobjSearchResult objects corresponding to the duplicate records. Important: Results are limited to 1000 records. Note that if there are no search results, null is returned.
 * @since 2008.1
 */
function nlapiSearchDuplicate(recType, fldNames, recId) { };

/**
 * Performs a global search against a single keyword or multiple keywords. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: 10
 * <br>Restriction: returns the first 1000 rows in the search
 * @param {String} searchText - Global search keywords string or expression
 * @returns {nlobjSearchResult[]} - An Array of nlobjSearchResult objects containing the following four columns: name, type (as shown in the UI), info1, and info2.Important: Results are limited to 1000 rows. Note that if there are no search results, null is returned.
 * @since 2008.1
 */
function nlapiSearchGlobal(searchText) { };

/**
 * Performs a search using a set of criteria (your search filters) and columns (the results). Alternatively, you can use this API to execute an existing saved search. Results are limited to 1000 rows. Also note that in search/lookup operations, long text fields are truncated at 4,000 characters.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.Note: This API can also be used to search custom lists.
 * <br>You can extract the desired information from the search results using the methods available on the returned nlobjSearchResult object.
 * <br>Note that results returned by nlapiSearchRecord are not sortable. However, you can accomplish sorting using either of the following methods:1. Reference a saved search that is sorted by internalid or internalidnumber2. Sort the array of results that is returned in JavaScript using a custom Array sorting function. See the topic called "Creating, displaying, and sorting an array" athttp://developer.mozilla.org/. Note: This function is agnostic in terms of its filters argument. It can accept input of either a search filter (nlobjSearchFilter), a search filter list (nlobjSearchFilter[]), or a search filter expression (Object[]).
 * <br>API Governance: 10
 * <br>Restriction: returns the first 1000 rows in the search
 * @param {String} recType [optional] - The record internal ID of the record type you are searching.
 * @param {String} searchId [optional] - (String,Number) The internalId or custom scriptId for the saved search. To obtain the internalId, go to Lists > Search > Saved Searches. The internalId appears in the Internal ID column. If you have created a custom scriptId when building your search, this ID will appear in the ID column.
 * <br> - If the internalId or scriptId is valid, the saved search is executed (assuming the search has no user or role restrictions applied to it).
 * <br> - If you do not specify the search type, the id parameter becomes REQUIRED. In this case, you must set type to null and then specify the scriptId for the saved search.
 * <br> - If there is no internalId or scriptId (null or empty string or left out altogether), an ad-hoc search will be executed and this argument will be ignored.
 * <br> - If the internalId or scriptId is invalid, the following user error is thrown: That search or mass updates does not exist.
 * @param {nlobjSearchFilter[]} searchFilters [optional] - (nlobjSearchFilter,Array)  A single nlobjSearchFilter object or an array of nlobjSearchFilter objects or a search filter expression.
 * @param {nlobjSearchColumn[]} searchColumns [optional] - (nlobjSearchColumn,Array) A single nlobjSearchColumn object or an array of nlobjSearchColumn objects. Note that you can further filter the returned saved search by passing additional search return column values.
 * @returns {nlobjSearchResult[]} - An array of nlobjSearchResult objects corresponding to the searched records.
 * @since 2007.0
 * @throws SSS_INVALID_RECORD_TYPE
 * @throws SSS_TYPE_ARG_REQD
 * @throws SSS_INVALID_SRCH_ID
 * @throws SSS_INVALID_SRCH_FILTER
 * @throws SSS_INVALID_SRCH_FILTER_JOIN
 * @throws SSS_INVALID_SRCH_OPERATOR
 * @throws SSS_INVALID_SRCH_COL_NAME
 * @throws SSS_INVALID_SRCH_COL_JOIN
 */
function nlapiSearchRecord(recType, searchId, searchFilters, searchColumns) { };

/**
 * Selects an existing line in a sublist
 * @param {String} subListType -  The sublist internal ID
 * @param {Number} line - The line number to select. Note the first line number on a sublist is 1 (not 0).
 * @returns {Void}
 * @since 2005.0
 */
function nlapiSelectLineItem(subListType, line) { };

/**
 * Use this function if you want to set a value on a sublist line that does not currently exist. This API is the UI equivalent of clicking a sublist tab (for example the Items sublist tab) so that you can then add a new line (or item, in this example) to the sublist.
 * <br>Restriction: Only supported for sublists of type inlineeditor and editor
 * @param {String} subListType -  The sublist internal ID
 * @returns {Void}
 * @since 2005.0
 */
function nlapiSelectNewLineItem(subListType) { };

/**
 * Selects a node from an XML document using an XPath expression
 * @param {Node} node - XML node being queried
 * @param {String} xpath - XPath expression used to query node
 * @returns {Node} Node
 * @since 2008.1
 */
function nlapiSelectNode(node, xpath) { };

/**
 * Selects an array of nodes from an XML document using an XPath expression
 * @param {Node} node - XML node being queried
 * @param {String} xpath - XPath expression used to query node
 * @returns {Node[]} Node[]
 * 
 * @since 2008.1
 */
function nlapiSelectNodes(node, xpath) { };

/**
 * Selects a value from an XML document using an XPath expression
 * @param {Node} node - XML node being queried
 * @param {String} xpath - XPath expression used to query node
 * @returns {String} String
 * 
 * @since 2008.2
 */
function nlapiSelectValue(node, xpath) { };

/**
 * Selects an array of values from an XML document using an XPath expression
 * @param {Node} node - XML node being queried
 * @param {String} path - XPath expression used to query node
 * @returns {String[]} String[]
 * 
 * @since 2008.1
 */
function nlapiSelectValues(node, path) { };

/**
 * Use this function to send a single "on-demand" campaign email to a specified recipient and return a campaign response ID to track the email. Note that this function works in conjunction with the Lead Nurturing (campaigndrip) sublist only; it does not work with the E-mail (campaignemail) sublist.
 * <br>This API is supported in user event, scheduled, Suitelet, mass update, and workflow action scripts.
 * <br>API Governance: 10
 * <br>Restriction: works in conjunction with the Lead Nurturing (campaigndrip) sublist only
 * @param {Number} campaignEventId - The internal ID of the campaign event. The campaign must be of type campaigndrip, which is referred to as Lead Nurturing in the UI.
 * @param {Number} recipientId - The internal ID of the recipient. Note that the recipient must have an email.
 * @returns {Number} A campaign response ID (tracking code) as an integer, or -1 if the send fails.
 * 
 * @since 2010.1
 */
function nlapiSendCampaignEmail(campaignEventId, recipientId) { };

/**
 * Sends and records outgoing email to an individual or to a group of individuals. This function can be used for automatic email notifications of critical events or for message logging. Note that you can also send multiple attachments of any media type using this function. Email attachment size cannot exceed 5 MB. In other words, you can send as many attachments as you like, but collectively, all attachments cannot exceed 5 MB.
 * <br>This function also allows email to be attached to custom records if the user references the custom record by either its internalId or scriptId.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.Note: You can use NetSuite email templates to construct the body of the email using nlapiMergeRecord(id, baseType, baseId, altType, altId, fields), which performs a merge operation using a NetSuite email template and up to two business records.
 * <br>API Governance: 10
 * <br>Restriction: all outbound emails subject to email Anti-SPAM policies
 * @param {Number} senderId - The internalId of an employee record (this is the sender). To get the internal ID for an employee, go Lists > Employees > Employees (you must have admin access to the account in order to access the Employees list page). The employee's ID will appear in the Internal ID column on the list page. Note, however, you must have the Show Internal IDs preference enabled in your account. To enable this preference, go to Home > Set Preferences > General tab > under Defaults > click Show Internal IDs > click Save.
 * @param {String} recipientIdOrEmail - (String,Number) External email address or the internal ID of the entity in NetSuite. Note that if the internal ID of the recipient entity record is used, the email message is automatically attached to the entity record.
 * @param {String} subject - Subject of the outgoing mail.
 * @param {String} body - Body of the outgoing email.
 * @param {String[]} cc [optional] - (String,Array) An array of email addresses or a single email address to copy
 * @param {String[]} bcc [optional] - (String,Array) An array of email addresses or a single email address to blind copy.
 * @param {Object} recordIdsObj [optional] - An associative array of internal records to associate/attach this email with. The following table lists valid keys -> values.
 * @param {nlobjFile} attachments [optional] - A single nlobjFile object or an array of nlobjFile objects to attach to outgoing email (not supported in Client SuiteScript).
 * @returns {Void}
 * @since 2007.0
 */
function nlapiSendEmail(senderId, recipientIdOrEmail, subject, body, cc, bcc, recordIdsObj, attachments) { };

/**
 * Sends and records an outgoing fax using the fax settings already defined in the user's account. This API is supported in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: 10
 * @param {Number} senderId - InternalId of an employee record (this is the sender)
 * @param {String} recipientIdOrFax - InternalId of the recipient entity or a free-form fax (if set to an internalId the fax will be saved)
 * @param {String} subject - Subject of the outgoing fax
 * @param {String} body [optional] - Body of the outgoing fax
 * @param {Object} recordIdsObj [optional] - Name/value pairs of internal records to associate this fax with (if set, fax will be saved)
 * <br> - transaction - transaction/opportunity internalid
 * <br> - activity - case/campaign internalid
 * <br> - entity - entity internalid
 * <br> - record - custom record internalId
 * <br> - recordtype - custom recordType internalId (or script id)
 * @param {nlobjFile} attachments [optional] - array of nlobjFile objects or a single nlobjFile object to attach to outgoing fax (not supported in Client SuiteScript)
 * @returns {Void}
 * 
 * @since 2008.1
 */
function nlapiSendFax(senderId, recipientIdOrFax, subject, body, recordIdsObj, attachments) { };

/**
 * This API sets the value of a datetime field on the currently selected line of a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then set. If timeZone is not passed in, the datetime value is set in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {String} dateTime — The date and time in format mm/dd/yyyy hh:mm:ss am|pm (for example, '09/25/2013 06:00:01 am').
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {Void}
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
function nlapiSetCurrentLineItemDateTimeValue(type, fieldId, dateTime, timeZone) { };

/**
 * This API is typically used in validate line functions to set the value of a given matrix sublist field before it has been added to the form. This API is supported in client and user event scripts. Also note that it should be used on matrix sublists only.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>Restriction: supported in client and user event scripts only.
 * <br>Restriction: synchronous arg is only supported in Client SuiteScript
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field.
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1 (not 0).
 * @param {String} fldValue - String or number. The value the field is being set to.
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the field change script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2009.2
 */
function nlapiSetCurrentLineItemMatrixValue(subListType, fldName, fldColumn, fldValue, isFireFieldChanged, isSynchronous) { };

/**
 * This API sets the value of a datetime field. If timeZone is passed in, the datetime value is converted to that time zone and then set. If timeZone is not passed in, the datetime value is set in the default time zone.
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {String} dateTime — The date and time in format mm/dd/yyyy hh:mm:ss am|pm (for example, '09/25/2013 06:00:01 am').
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {Void}
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
function nlapiSetDateTimeValue(fieldId, dateTime, timeZone) { };

/**
 * Sets the value of a select field on the currently selected line using the display name. See also, Using the Fire Field Changed Parameter.
 * <br>Restriction: synchronous arg is only supported in client SuiteScript
 * @param {String} subListType
 * @param {String} fldName - The name of the field being set
 * @param {String} fldText - The display name associated with the value that the field is being set to
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2005.0
 */
function nlapiSetCurrentLineItemText(subListType, fldName, fldText, isFireFieldChanged, isSynchronous) { };

/**
 * Sets the value of the given line-item field before it has been added to the form. Typically used in validate line functions. See also, Using the Fire Field Changed Parameter.
 * <br>Restriction: synchronous arg is only supported in client SuiteScript
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The name of the field being set
 * @param {String} fldValue - The value the field is being set to. Note: Check box fields take the values of T or F, not true or false.
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2005.0
 */
function nlapiSetCurrentLineItemValue(subListType, fldName, fldValue, isFireFieldChanged, isSynchronous) { };

/**
 * Sets the values for a multi-select sublist field. Note that like any other "set field" APIs, the values you use will be internal ID values. For example, rather than specifying 'Abe Simpson' as a customer value, you will use 232 or 88 or whatever the internal ID is for customer Abe Simpson.
 * <br>However, if you are using this API to set the serialnumber field on the Item sublist, you will set the text string of the actual serial number, for example 'serialnum1', 'serialnum2', and so on.
 * <br>This API is supported in client scripts only.
 * @param {String} subListType - The sublist internal ID (for example, use addressbook as the ID for the Address sublist).
 * @param {String} fldName - The name of the multi-select sublist field being set.
 * @param {String[]} values - The values for the field.
 * @param {Boolean} firefieldchanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} synchronous [optional] - This parameter is relevant for client SuiteScripts only. In client scripts, if you do not set the value of synchronous, the default value is false, and the API executes asynchronously. If set to true, this API executes synchronously, which ensures a predictable script execution. Setting to true forces your client script to wait on any specified sourcing before continuing with the rest of the script.
 * @returns {Void}
 * 
 * @since 2012.1
 */
function nlapiSetCurrentLineItemValues(subListType, fldName, values, firefieldchanged, synchronous) { };

/**
 * Sets the value of a select field on the current record using the UI display name. This function is available in client and user event scripts only.
 * <br>Restriction: synchronous arg is only supported in client SuiteScript
 * @param {String} fldname - The name of the field being set
 * @param {String} fldText - The display name associated with the value that the field is being set to
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2005.0
 */
function nlapiSetFieldText(fldname, fldText, isFireFieldChanged, isSynchronous) { };

/**
 * Sets the values of a multi-select field on the current record using the UI display names. This function is available in client and user event scripts only.
 * <br>Restriction: supported in client and user event scripts only.
 * <br>Restriction: synchronous arg is only supported in client SuiteScript
 * @param {String} fldName - The name of the field being set
 * @param {String[]} fldTexts - The display names associated with the values that the field is being set to
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2009.1
 */
function nlapiSetFieldTexts(fldName, fldTexts, isFireFieldChanged, isSynchronous) { };

/**
 * Sets the value of a given body field. This API can be used in user event beforeLoad scripts to initialize field on new records or non-stored fields. (Non-stored fields are those that have the Store Value preference unchecked on the custom field page.)
 * <br>For client-side scripting, this API can be triggered by a PageInit client event trigger.
 * <br>This API is available in client and user event scripts only.
 * <br>Restriction: supported in client and user event scripts only.
 * <br>Restriction: synchronous arg is only supported in client SuiteScript
 * @param {String} fldName - The internal ID of the field
 * @param {String} fldValue - The value the field is being set to. Note: Check box fields take the values of T or F, not true or false.
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2005.0
 */
function nlapiSetFieldValue(fldName, fldValue, isFireFieldChanged, isSynchronous) { };

/**
 * Sets the value of a multiselect body field on a current record. This API can be used for user event beforeLoad scripts to initialize fields on new records or non-stored fields. (Non-stored fields are those that have the Store Value preference unchecked on the custom field page.
 * <br>For client-side scripting, this API can be triggered by a PageInit client event trigger.
 * <br>This API is available in client and user event scripts only.
 * <br>Restriction: supported in client and user event scripts only.
 * <br>Restriction: synchronous arg is only supported in client SuiteScript
 * @param {String} fldName - The internal ID of the field
 * @param {String} fldValues - The value the field is being set to (Array).
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the fieldchange script for that field is executed. If no value is provided, this argument defaults to true. (Important: This parameter is available in client scripts only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * 
 * @since 2009.1
 */
function nlapiSetFieldValues(fldName, fldValues, isFireFieldChanged, isSynchronous) { };

/**
 * This API sets the value of a datetime field on a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then set. If timeZone is not passed in, the datetime value is set in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {Number} lineNum — The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {String} dateTime — The date and time in format mm/dd/yyyy hh:mm:ss am|pm (for example, '09/25/2013 06:00:01 am').
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {void}
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
function nlapiSetLineItemDateTimeValue(type, fieldId, lineNum, dateTime, timeZone) { };

/**
 * Sets the value of a sublist field on the current record. This API can be used in beforeLoad scripts to initialize sublist line items on new records. Available in user event scripts only.
 * <br>This function can be used in client SuiteScript, however, it is only supported on custom fields and the Description field. If you use this function to set the value of a standard, built-in line item field, the function will not execute properly.Note: Normally custom transaction column fields that are not checked to show on a custom form are not available to get/setLineItemValue APIs. However, if you set them to show, but then set the label to empty, they will be available on the form but will not appear on the sublist. Note this does not apply to fields that are marked as Hidden on the custom field definition. These fields are always available on every form.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The name of the field being set
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {String} fldValue - The value the field is being set to
 * @returns {Void}
 * @since 2005.0
 */
function nlapiSetLineItemValue(subListType, fldName, line, fldValue) { };

/**
 * This API is used to set a header field in a matrix sublist. This API is supported in client and user event scripts. It is typically used in pageInit (client) and beforeLoad (user event) events. Also note that this API should be used on matrix sublists only.Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>In the case of the Pricing sublist, this API is used to set the quantity levels that appear in the Qty fields. Note that you should use this API only if you have the Quantity Pricing feature enabled in your account, as these header fields appear only if this feature is enabled.
 * <br>Restriction: isSynchronous arg is only supported in client SuiteScript
 * @param {String} subListType - The sublist internal ID.
 * @param {String} fldName - The name of the field being set.
 * @param {String} fldValue - The value the field is being set to. Note: Check box fields take the values of T or F, not true or false.
 * @param {Number} fldColumn - The column number for this field. Column numbers start at 1 (not 0).
 * @param {Boolean} isFireFieldChanged [optional] - If true, then the field change script for that field is executed. If no value is provided, this argument defaults to true. (Available in Client SuiteScript only). See Using the Fire Field Changed Parameter for more information.
 * @param {Boolean} isSynchronous [optional] - This parameter is relevant for client SuiteScripts only. In server scripts (such as user event scripts), this parameter will always execute as true.
 * @returns {Void}
 * @since 2009.2
 */
function nlapiSetMatrixValue(subListType, fldName, fldValue, fldColumn, isFireFieldChanged, isSynchronous) { };

/**
 * Creates a recovery point saving the state of the script's execution. When NetSuite resumes the execution of the script, it resumes the script at the specified recovery point. Also note that when the script is resumed, its governance units are reset. Be aware, however, all scheduled scripts have a 50 MB memory limit. For complete details on scheduled script memory limits, see Understanding Memory Usage in Scheduled Scripts.
 * <br>A typical implementation for this API might be as follows. Based on the status returned by nlapiSetRecoveryPoint(), the script executes different logic.res = nlapiSetRecoveryPoint()
 * <br>if (res.status == "FAILURE')
 * <br>     examine the reason and either cleanup/try again OR exit
 * <br>else if (res.status == "SUCCESS')
 * <br>    do X
 * <br>else if (res.status == "RESUME')
 * <br>    examine the reason and react appropriately
 * <br>do Z
 * <br>do A
 * <br>Note you can use nlapiSetRecoveryPoint() in conjunction with nlapiYieldScript() to effectively pause the script until a later time when it is more appropriate to run the script. Important: This API can only be called from scheduled scripts; calling this API from any other script type will result in an error.
 * <br>The nlapiSetRecoveryPoint() API consumes 100 units per call.
 * <br>For an overview of possible use cases for setting recovery points in your scheduled scripts, see Setting Recovery Points in Scheduled Scripts.
 * @returns {Void}
 */
function nlapiSetRecoveryPoint() { };

/**
 * Sets the redirect URL by resolving to a NetSuite resource. Note that all parameters must be prefixed with custparam otherwise an SSS_INVALID_ARG error will be thrown.
 * <br>This API is supported in user event and Suitelet scripts.
 * <br>You can use nlapiSetRedirectURL to customize user workflows within NetSuite. In a user event script, you can use nlapiSetRedirectURL to send the user to a NetSuite page based on a specific user event. For example, under certain conditions you may choose to redirect the user to another NetSuite page or custom Suitelet to complete a workflow.Note: You cannot redirect a user to an external URL.
 * <br>If you redirect a user to a record, the record must first exist in NetSuite. If you want to redirect a user to a new record, you must first create and submit the record before redirecting them. You must also ensure that any required fields for the new record are populated before submitting the record.
 * @param {String} urlType - The base type for this resource. The types include:
 * <br> - RECORD: Record type - - Note that when you set type to RECORD, and the third param (id) to null, the redirection is to the "create new" record page, not an existing record page.
 * <br> - TASKLINK: Tasklink
 * <br> - SUITELET: Suitelet
 * <br> - EXTERNAL: The URL of a Suitelet that is available externally (for example, Suitelets that have been set to "Available without Login" on the Script Deployment page)
 * @param {String} recTypeOrScriptId - The primary id for this resource (recordType for RECORD, scriptId for SUITELET, taskId for TASKLINK, url for EXTERNAL)
 * @param {String} recIdOrDeployId [optional] - The secondary id for this resource (recordId for RECORD, deploymentId for SUITELET). Important: This argument is required if type has been set to RECORD and you are trying to redirect to a specific NetSuite record. In the scenario, you must set id to the id of the target record.
 * @param {Boolean} isEditMode [optional] - For RECORD calls, this determines whether to return a URL for the record in edit mode or view mode. If set to true, returns the URL to an existing record in edit mode. Important: The values for this parameter can be true or false, not T or F.
 * @param {Object} paramObj [optional] - An associative array of additional URL parameters. Important: All parameters must be prefixed with custparam.
 * @returns {Void}
 */
function nlapiSetRedirectURL(urlType, recTypeOrScriptId, recIdOrDeployId, isEditMode, paramObj) { };

/**
 * Converts a string to a date object, formats the date object based on the format argument passed in, and then returns the formatted date object. Be aware that leading zeroes in the month and day values are not supported.
 * @param {String} str - String being converted to a date.
 * @param {String} format [optional] - Use one of the following arguments.
 * <br>- datetime — formats the string as a concatenation of date and time (hour and minutes), based on the Date Format and Time Format selected in Set Preferences. If you use this format type, your input string must not include seconds.
 * <br>- datetimetz — formats the string as a concatenation of date and time (hour, minutes and seconds), based on the Date Format and Time Format selected in Set Preferences. If you use this format type, your input string must include seconds.
 * @returns {Date} Date object. Returns NaN if date includes a leading zero.
 */
function nlapiStringToDate(str, format) { };

/**
 * Parses a String into a w3c XML document. This API is useful if you want to navigate/query a structured XML document more effectively using either the Document API or NetSuite built-in XPath functions.
 * @param {String} text - String being converted
 * @returns {Document} W3C Document object
 * @since 2008.1
 */
function nlapiStringToXML(text) { };

/**
 * Submits a CSV import job to asynchronously import record data into NetSuite. This API can be used to:
 * <br>- Automate standard record data import for SuiteApp installations, demo environments, and testing environments.
 * <br>- Import data on a schedule using a scheduled script.
 * <br>- Build integrated CSV imports with RESTlets.
 * When the API is executed, the import job is added to the queue. The progress of an import job can be viewed at Setup > Import/Export > View CSV Import Status. For details, see .
 * Executing this API consumes 100 governance units.
 * Note that this API cannot be used to import data that is imported by simple (2-step) assistants in the UI, because these import types do not support saved import maps. This limitation applies to budget, single journal entry, single inventory worksheet, project tasks, and Web site redirects imports.
 * Also note that this API only has access to the field mappings of a saved import map; it does not have access to advanced import options defined in the Import Assistant, such as multi-threading and multiple queues. Even if you set options to use multiple threads or queues for an import job and then save the import map, these settings are not available to this API. When this API submits a CSV import job based on the saved import map, a single thread and single queue are used.
 * @param {nlobjCSVImport} nlobjCSVImport object with methods to set the following: saved import map, primary file, linked file(s) (optional), import job name (optional).
 * @returns {String} Job ID of the import (which is also the identifier for the CSV response file)
 * @since 2012.2
 */
function nlapiSubmitCSVImport(nlobjCSVImport) { };

/**
 * Use this API to submit changes to a configuration page that was loaded into the system using nlapiLoadConfiguration(type). The following configuration pages support SuiteScript: Company Information, General Preferences, Enable Features, Accounting Preferences, Accounting Periods, Tax Periods.
 * <br>The nlapiSubmitConfiguration function is available in scheduled and Suitelet scripts only.
 * <br>API Governance: 20
 * <br>Restriction: Server SuiteScript only
 * @param {nlobjConfiguration} config - nlobjConfiguration object containing the data record
 * @returns {Void}
 * @since 2009.2
 */
function nlapiSubmitConfiguration(config) { };

/**
 * Updates one or more body fields or custom fields on a record. This function can be used on any record that supports inline editing and on any body field or custom field that supports inline editing. Note that this function cannot be used to update sublist "line item" fields.
 * <br>The nlapiSubmitField(...) function is a companion function to nlapiLookupField(type, id, fields, text).
 * <br>nlapiSubmitField(...) is available in client, user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: standard transactions: 10, standard non-transactions: 5, custom records: 2
 * <br>Restriction: only supported for records and fields where DLE (Direct List Editing) is supported
 * @param {String} recType - The record internal ID name of the record you are updating.
 * @param {Number} recId - The internalId for the record, for example 777 or 87
 * @param {String} fldNames - String or array of string. Field names being updated
 * @param {String} fldValues - String/number or array of string/number. Field values being updated
 * @param {Boolean} isDoSourcing [optional] - If not set, this argument defaults to false and field sourcing does not occur. If set to true, sources in dependent field information for empty fields. Note: doSourcing takes the values of true or false, not T or F.
 * @returns {Void}
 * @since 2008.1
 */
function nlapiSubmitField(recType, recId, fldNames, fldValues, isDoSourcing) { };

/**
 * Submits a file and returns the internal ID to the file that was added to (or updated in) the NetSuite file cabinet. Note that if a file with the same name exists in the folder that this file is added to, then that file will be updated.
 * <br>Note: There is a 5MB limitation to the size of the document that can be submitted using this API.
 * <br>This API is supported in user event, scheduled, portlet, and Suitelet scripts.
 * <br>API Governance: 20
 * <br>Restriction: Server SuiteScript only
 * @param {nlobjFile} file - The nlobjFile that will be updated
 * @returns {Number} The integer value of the file ID.
 * @since 2009.1
 */
function nlapiSubmitFile(file) { };

/**
 * Submits and commits new records or changes applied to an existing record and returns the internalId for the committed record. The nlapiSumitRecord function can be used in conjunction with nlapiCreateRecord or nlapiLoadRecord in order to create or modify a record related to the current one.
 * <br>This API is supported in client, user event, scheduled, portlet, and Suitelet scripts. Important: When using nlapiSubmitRecord in a user event script, it is possible that the related record modified or created by the script is committed to the database but the actual record initiating the script fails on save. To avoid this scenario, SuiteScripts that cause actions on records other than the current one should be set to run afterSubmit.
 * <br>API Governance: standard transactions: 20, standard non-transactions: 10, custom records: 4
 * @param {nlobjRecord} record - nlobjRecord object containing the data record
 * @param {Boolean} isDoSourcing [optional] - If not set, this argument defaults to false, which means that dependent field values are not sourced. If set to true, sources dependent field information for empty fields. Be aware that doSourcing takes the values of true or false, not T or F.
 * @param {Boolean} isIgnoreMandatory [optional] - Disables mandatory field validation for this submit operation. If set to true, ignores all standard and custom fields that were made mandatory through customization. All fields that were made mandatory through company preferences are also ignored.
 * @returns {Number} An integer value of the committed record's internal ID (for example, 555, 21, or 4).
 * @since 2007.0
 * @throws SSS_INVALID_RECORD_OBJ
 * @throws SSS_RECORD_OBJ_REQD
 * @throws SSS_INVALID_SOURCE_ARG
 */
function nlapiSubmitRecord(record, isDoSourcing, isIgnoreMandatory) { };

/**
 * Initializes a new record using data from an existing record of a different type and returns an nlobjRecord. This function can be useful for automated order processing such as creating item fulfillment transactions and invoices off of orders.
 * <br>This API is supported in client, user event, scheduled, and Suitelet scripts.
 * <br>For a list of supported transform types, see Supported Transformation Types.
 * <br>API Governance: 10 for transactions, 2 for custom records, 4 for all other records
 * @param {String} recType - The record internal ID name.  The internal ID appears in the column called "Record Internal ID".
 * @param {Number} recId - The internalId for the record, for example 555 or 78.
 * @param {String} transformType - The record internal ID name of the record you are transforming the existing record into
 * @param {Object} transformValuesObj [optional] - An array of field name -> value pairs containing field defaults used for transformation. Note that you can also specify whether you want the record transformation to occur in dynamic mode. For details, see Working with Records in Dynamic Mode.
 * @returns {nlobjRecord} An nlobjRecord object
 * @since 2007.0
 * @throws SSS_INVALID_URL_CATEGORY
 * @throws SSS_CATEGORY_ARG_REQD
 * @throws SSS_INVALID_TASK_ID
 * @throws SSS_TASK_ID_REQD
 * @throws SSS_INVALID_INTERNAL_ID
 * @throws SSS_INVALID_EDITMODE_ARG
 */
function nlapiTransformRecord(recType, recId, transformType, transformValuesObj) { };

/**
 * Use this API to trigger a workflow on a record. The actions and transitions of the workflow will be evaluated for the record based on the current state that it is in.
 * <br>This API is supported in user event, scheduled, portlet, Suitelet, mass update, and workflow action scripts.
 * <br>API Governance: 20
 * @param {String} recType - The record type ID of the workflow base record (for example, 'customer', 'salesorder', 'lead'). In the Workflow Manager this is the record type that is specified in the Record Type field.
 * @param {Number} recId - The internal ID of the base record (for example 55 or 124).
 * @param {String} workflowId - String or number. The internal ID or script ID for the workflow definition. This is the ID that appears in the ID field on the Workflow Definition Page.
 * @param {String} actionId [optional] - String or number. The internal ID or script ID of the action script.
 * @returns {Number} The internal ID (int) of the workflow instance used to track the workflow against the record.
 * @since 2010.1
 */
function nlapiTriggerWorkflow(recType, recId, workflowId, actionId) { };

/**
 * Returns a nlobjSubrecord object. Use this API to view a subrecord from a sublist field on the parent record. Calling this API analogous to doing a "get" on a subrecord, however, the nlobjSubrecord object returned is in read-only mode. Therefore, an error is thrown if you attempt to edit a subrecord returned by this API.
 * <br>You can call this API when you want your script to read the nlobjSubrecord object of the current sublist line you are on. After you get the nlobjSubrecord object, you can use regular record API to access its values.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiViewCurrentLineItemSubrecord(subListType, fldName) { };

/**
 * Returns a nlobjSubrecord object. Use this API to view a subrecord from a sublist field on the parent record. Calling this API analogous to doing a "get" on a subrecord, however, the nlobjSubrecord object returned is in read-only mode. Therefore, an error is thrown if you attempt to edit a subrecord returned by this function.
 * <br>You can call this API when you want to read the value of a line you are not currently on (or have not selected). For example, if you are editing line 2 as your current line, you can call nlapiViewLineItemSubrecord on line 1 to get the value of line 1.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * <br>Restriction: supported in client and user event scripts only.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @param {Number} linenum - The line number for the sublist field. Note the first line number on a sublist is 1 (not 0).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiViewLineItemSubrecord(subListType, fldName, linenum) { };

/**
 * Returns a nlobjSubrecord object. Use this API to view a subrecord from a body field on the parent record. Calling this API analogous to doing a "get" on a subrecord, however, the nlobjSubrecord object returned is in read-only mode. Therefore, an error is thrown if you attempt to edit a subrecord returned by this function.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @since 2011.2
 */
function nlapiViewSubrecord(fldName) { };

/**
 * When you void a transaction, its total and all its line items are set to zero, but the transaction is not removed from the system. NetSuite supports two types of voids: direct voids and voids by reversing journal. See the help topic  for additional information.
 * nlapiVoidTransaction voids a transaction and then returns an id that indicates the type of void performed. If a direct void is performed, nlapiVoidTransaction returns the ID of the record voided. If a void by reversing journal is performed, nlapiVoidTransaction returns the ID of the newly created voiding journal.
 * The type of void performed depends on the targeted account's preference settings:
 * <br>- If the Using Reversing Journals preference is disabled, nlapiVoidTransaction performs a direct void. See the help topic  for a list of transactions that support direct voids.
 * <br>- If the Using Reversing Journals preference is enabled, nlapiVoidTransaction performs a void by reversing journal. See the help topic  for a list of transactions that support voids by reversing journal.
 * This API is supported in the following script types:
 * <br>- Client
 * <br>- User Event
 * <br>- Scheduled
 * <br>- Suitelet
 * <br>- RESTlet
 * <br>- Workflow Action
 * The Governance on this API is 10.
 * @param {String} transactionType — internal ID of the record type to be voided. See the help topics and for a list of valid arguments.
 * @param {Number} recordId — the internal ID of the specific record to be voided. See the help topics for additional information.
 * @since 2013.2
 */
function nlapiVoidTransaction(transactionType, recordId) { };

/**
 * Use this API in conjunction with the Big Faceless Report Generator built by Big Faceless Organization (BFO). The BFO Report Generator is a third-party library used for converting XML to PDF documents. Using nlapiXMLToPDF in combination with the BFO report library, SuiteScript developers can now generate PDF reports from Suitelets.
 * <br>Note: SuiteScript developers do not need to install any BFO-related files or components to use the Report Generator functionality.
 * <br>The nlapiXMLToPDF API passes XML to the BFO tag library (which is stored by NetSuite), and returns a PDF nlobjFile object. Note that there is a 5MB limitation to the size of the file that can be created.
 * <br>The following list includes just some of the output styles that can be generated using nlapiXMLToPDF and BFO tags:
 * <br>- Consolidated data from multiple transactions into one (for example, a virtual consolidated invoice)
 * <br>- Highly tailored transaction output with images
 * <br>- Product labels with bar codes
 * <br>- Pallet labels with bar codes (custom records)
 * <br>- Custom-formatted product catalogs with images
 * <br>- Proposals
 * <br>Important: For details on BFO, available tags, and BFO examples, see the following links:
 * <br>- http://faceless.org/products/report/docs/userguide.pdf
 * <br>- http://faceless.org/products/report/docs/tags/
 * <br>Restriction: Server SuiteScript only
 * <br>API Governance: 10
 * @param {String} xmlText XML
 * @returns {nlobjFile} PDF nlobjFile object
 * 
 * @since 2009.1
 */
function nlapiXMLToPDF(xmlText) { };

/**
 * Converts (serializes) an XML document into a String. This API is useful if you want to serialize and store a Document in a custom field (for example).
 * @param {Document} xmlDocument - XML document being serialized
 * @returns {String} String
 * 
 * @since 2008.1
 */
function nlapiXMLToString(xmlDocument) { };

/**
 * Creates a recovery point and then reschedules the script. The newly rescheduled script has its governance units reset, and is then placed at the back of the scheduled script queue. To summarize, nlapiYieldScript works as follows:1. Creates a new recovery point.2. Creates a new scheduled script with a governance reset.3. Associates the recovery point to the scheduled script4. Puts the script at the back of the scheduled script queue.Note: If the yield call fails, a FAILURE status will be returned. On success, the call does not return until the script is resumed.
 * <br>Calling this function consumes no governance units. Note also, calling this API resets the unit counter for the currently executing script. Be aware, however, all scheduled scripts have a 50 MB memory limit. Calling this API will not reset the memory size of the script to 0. It only resets the governance units. For complete details on scheduled script memory limits, see Understanding Memory Usage in Scheduled Scripts. Note: This API can only be called from scheduled scripts. Calling this API from any other script type will result in an error.
 * @returns {Void} It is advisable to use the finally block for code which is not going to affect program flow, for example - writing log entries.
 * 
 */
function nlapiYieldScript() { };

/**
 * Use this method to add a field to an assistant and return the field object.
 * @param {String} fldName - The internal ID for this field
 * @param {String} fldType - The field type. Any of the following field types can be specified:
 * <br> - text
 * <br> - email
 * <br> - radio - See Working with Radio Buttons for details on this field type.
 * <br> - label - This is a field type that has no values. In Working with Radio Buttons, see the first code sample that shows how to set this field type.
 * <br> - phone
 * <br> - date
 * <br> - currency
 * <br> - float
 * <br> - integer
 * <br> - checkbox
 * <br> - select - Note that if you want to add your own (custom) options on a select field, you must set the source parameter to NULL. Then, when a value is specified, the value will populate the options from the source.
 * <br> - url
 * <br> - timeofday
 * <br> - textarea
 * <br> - multiselect
 * <br> - image
 * <br> - inlinehtml
 * <br> - password
 * <br> - help
 * <br> - percent
 * <br> - longtext
 * <br> - richtext
 * @param {String} fldLabel [optional] - The UI label for this field
 * @param {String} sourceId [optional] - String or number. The internalId or scriptId of the source list for this field if it is a select (List/Record) field.
 * @param {String} fldGroup [optional] - If you are adding the field to a field group, specify the internal ID of the field group
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.addField = function(fldName, fldType, fldLabel, sourceId, fldGroup) { };

/**
 * Use this method to add a field group to an assistant page. Note that when a field group is added to an assistant, by default it is collapsible. Also, by default, it will appear as uncollapsed when the page loads. If you want to change these behaviors, you will use the nlobjFieldGroup.setCollapsible(collapsible, hidden) method.
 * @param {String} grpName - The internal ID for the field group
 * @param {String} grpLabel - The UI label for the field group
 * @returns {nlobjFieldGroup} nlobjFieldGroup
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.addFieldGroup = function(grpName, grpLabel) { };

/**
 * Use this method to add a step to an assistant.
 * @param {String} grpName - The internal ID for this step (for example, 'entercontacts').
 * @param {String} grpLabel - The UI label for the step (for example, 'Enter Contacts'). By default, the step will appear vertically in the left panel of the assistant (see figure).
 * @returns {nlobjAssistantStep} nlobjAssistantStep
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.addStep = function(grpName, grpLabel) { };

/**
 * Use this method to add a sublist to an assistant page and return an nlobjSubList object. Note that only inlineeditor sublists can be added to assistant pages.
 * @param {String} listId - The internal ID for the sublist
 * @param {String} listType - The sublist type. Currently, only a value of inlineeditor can be set.
 * @param {String} listLabel - The UI label for the sublist
 * @returns {nlobjSubList} nlobjSubList
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.addSubList = function(listId, listType, listLabel) { };

/**
 * Use this method to get all field groups on an assistant page. Also note that where you call this method matters. If you call getAllFieldGroups() early in your script, and then add three more field groups at the end of your script, getAllFieldGroups() will return only those field groups that were added prior to the call.
 * @returns {String[]} String[] of all field groups in the assistant
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getAllFieldGroups = function() { };

/**
 * Use this method to get all fields in an assistant. Regardless of which page or step the fields have been added to, all fields will be returned. Also note that where you call this method matters. If you call getAllFields() early in your script, and then add ten more fields at the end of your script, getAllFields() will return only those fields that were added prior to the call.
 * @returns {String[]} String[] of all fields in a custom assistant
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getAllFields = function() { };

/**
 * Use this method to return an array of all the assistant steps for this assistant.
 * @returns {nlobjAssistantStep[]} nlobjAssistantStep[]
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getAllSteps = function() { };

/**
 * Use this method to get all sublist names that appear on an assistant page. Also note that where you call this method matters. If you call getAllSubLists() early in your script, and then add three more sublists at the end of your script, getAllSubLists() will return only those sublists that were added prior to the call.
 * @returns {String[]} String[] of all sublists in an assistant
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getAllSubLists = function() { };

/**
 * Use this method to get the current step that was set via nlobjAssistant.setCurrentStep(step). After getting the current step, you can add fields, field groups, and sublists to the step.
 * @returns {nlobjAssistantStep} nlobjAssistantStep
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getCurrentStep = function() { };

/**
 * Use this method to return a field on an assistant page.
 * @param {String} fldName - The internal ID of the field
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getField = function(fldName) { };

/**
 * Use this method to return a field group on an assistant page.
 * @param {String} grpName - The internal ID for the field group
 * @returns {nlobjFieldGroup} nlobjFieldGroup
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getFieldGroup = function(grpName) { };

/**
 * Use this method to get the last submitted action that was performed by the user. Typically you will use getNextStep() to determine the next step (based on the last action).
 * <br>Possible assistant submit actions that can be specified are:
 * <br>- next - means that the user has clicked the Next button in the assistant
 * <br>- back - means that the user has clicked the Back button
 * <br>- cancel - means that the user has clicked the Cancel button
 * <br>- finish - means that the user has clicked the Finish button. By default, inline text then appears on the finish page saying "Congratulations! You have completed the <assistant title>" - where <assistant title> is the title set in nlapiCreateAssistant(title, hideHeader) or nlobjAssistant.setTitle(title).
 * <br>- jump - if nlobjAssistant.setOrdered(ordered) has been set to false (meaning that steps can be completed in random order), then jump is used to get the user's last action in a non-sequential process.
 * @returns {String} The last submit action (as a string)
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getLastAction = function() { };

/**
 * Use this method to get the step the last submitted action came from.
 * @returns {nlobjAssistantStep} nlobjAssistantStep
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getLastStep = function() { };

/**
 * Use this method to return the next logical step corresponding to the user's last submitted action. You should only call this method after you have successfully captured all the information from the last step and are ready to move on to the next step. You would use the return value to set the current step prior to continuing.
 * @returns {nlobjAssistantStep} Returns the next logical step based on the user's last submit action, assuming there were no errors. Typically you will call setCurrentStep(step) using the returned step if the submit was successful.
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getNextStep = function() { };

/**
 * Use this method to return an nlobjAssistantStep object on an assistant page.
 * @param {String} stepName - The internal ID of the step
 * @returns {nlobjAssistantStep} nlobjAssistantStep
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getStep = function(stepName) { };

/**
 * Use this method to get the total number of steps in an assistant.
 * @returns {Number} The total number of steps in an assistant. Value returned as an integer.
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getStepCount = function() { };

/**
 * Use this method to return a sublist on an assistant page .
 * @param {String} listName - The internal ID for the sublist
 * @returns {nlobjSubList} nlobjSubList
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.getSubList = function(listName) { };

/**
 * Use this method to determine if an assistant has an error message to display for the current step.
 * @returns {Boolean} Returns true if setError(html) was called
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.hasError = function() { };

/**
 * Use this method to determine when all steps in an assistant are completed.
 * @returns {Boolean} Returns true if all steps in the assistant have been completed or if setFinished(html) has been called.
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.isFinished = function() { };

/**
 * Use this method to manage redirects in an assistant. In most cases, an assistant redirects to itself as in:nlapiSetRedirectURL('suitelet', nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId());
 * <br>The sendRedirect(response) method is like a wrapper method that performs this redirect. This method also addresses the case in which one assistant redirects to another assistant. In this scenario, the second assistant must return to the first assistant if the user Cancels or the user Finishes. This method, when used in the second assistant, ensures that the user is redirected back to the first assistant.
 * @param {nlobjResponse} response - The response object
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.sendRedirect = function(response) { };

/**
 * Use this method to mark a step as the current step. In the UI, the step will be highlighted when the user is on that step (see figure).
 * @param {nlobjAssistantStep} step - The name of the step object
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setCurrentStep = function(step) { };

/**
 * Use this method to set an error message for the currrent step. If you choose, you can use HTML tags to format the message.
 * @param {String} html - Error message text
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setError = function(html) { };

/**
 * Use this method to set values for fields on an assistant page.
 * @param {Object} values - An object containing name/value pairs that map field names to field values
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setFieldValues = function(values) { };

/**
 * Use this method to mark the last page in an assistant. Set the rich text to display a completion message on the last page.
 * @param {String} html - The text to display once the assistant has finished. For example, "Congratulations! You have successfully set up your account."
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setFinished = function(html) { };

/**
 * Use this method to display steps without numbers.
 * @param {Boolean} hasStepNumber [optional] - Set to false to turn step numbering off.
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2010.1
 */
nlobjAssistant.prototype.setNumbered = function(hasStepNumber) { };

/**
 * Use this method to enforce a sequential ordering of assistant steps. If steps are ordered, users must complete the current step before the assistant will allow them to proceed to the next step. From a display perspective, ordered steps will always appear in the left panel of the assistant (see first figure). Note that by default, steps in an assistant are ordered.
 * <br>If steps are unordered, they can be completed in any order. Additionally, unordered steps are always displayed horizontally under the assistant title (see second figure).
 * @param {Boolean} ordered - A value of true means steps must be completed sequentially, and that they will appear vertically in the left panel of the assistant. A value of false means steps do not need to be completed sequentially, and they will appear horizontally, directly below the assistant title.
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setOrdered = function(ordered) { };

/**
 * Use this method to set the scriptId for a global client script you want to run on an assistant page.
 * @param {String} scriptId - String or number. The scriptId of the global client script
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setScript = function(scriptId) { };

/**
 * Use this method to show/hide the Add to Shortcuts link that appears in the top-right corner of an assistant page. Note that if you do not call this method in your script, the default is to show the Add to Shortcuts link at the top of all assistant pages. Therefore, it is recommended that you use this method only if you want to hide this link.
 * <br>Note: The Add to Shortcuts link is always hidden on external pages.
 * @param {Boolean} show - A value of false means that the Add to Shortcuts link does not appear on the assistant. A value of true means that it will appear.
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setShortcut = function(show) { };

/**
 * Use this method to set the splash screen for an assistant page.
 * @param {String} title - The title of the splash screen
 * @param {String} text1 - Text for the splash screen
 * @param {String} text2 [optional] - If you want splash content to have a two-column appearance, provide content in the text2 parameter.
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setSplash = function(title, text1, text2) { };

/**
 * Use this method to set the title for the assistant. If you have already defined the title using nlapiCreateAssistant(title, hideHeader), you do not need to call the setTitle(title) method. Also note that the title you provide using setTitle(title) will override the title specified in the nlapiCreateAssistant(...) function.
 * @param {String} title - Assistant title
 * @returns {Void}
 * @memberOf nlobjAssistant
 * @since 2009.2
 */
nlobjAssistant.prototype.setTitle = function(title) { };

/**
 * Use this method to get all fields entered by the user during the step.
 * @returns {String[]} String[] of all fields entered by the user during the step
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getAllFields = function() { };

/**
 * Use this method to get all sublist fields enteredby the user during this step.
 * @param {String} grp - The sublist internal ID
 * @returns {String[]} String[] of all sublist fields entered by the user during the step
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getAllLineItemFields = function(grp) { };

/**
 * Use this method to get all sublists entered by the user during this step.
 * @returns {String[]} String[] of all sublists entered by the user during this step
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getAllLineItems = function() { };

/**
 * Use this method to get the value of a field entered by the user during this step.
 * @param {String} name - The internal ID of the field whose value is being returned
 * @returns {String} The internal ID (string) value for the field
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getFieldValue = function(name) { };

/**
 * Use this method to get the selected values of a multi-select field as an Array.
 * @param {String} name - The name of the multi-select field
 * @returns {String[]} String[] of field IDs. Returns null if field is not on the record. Note the values returned are read-only.
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getFieldValues = function(name) { };

/**
 * Use the method to get the number of lines previously entered by the user in this step.
 * <br>Important: The first line number on a sublist is 1 (not 0).
 * @param {String} group - The sublist internal ID
 * @returns {Number} The integer value of the number of line items on a sublist. Note that -1 is returned if the sublist does not exist.
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getLineItemCount = function(group) { };

/**
 * Use this method to get the value of a line item (sublist) field entered by the user during this step.
 * @param {String} group - The sublist internal ID
 * @param {String} name - The name of the sublist field whose value is being returned
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} The string value of the sublist field
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getLineItemValue = function(group, name, line) { };

/**
 * Use this method to get a step number. The number returned represents where this step appears sequentially in the assistant.
 * @returns {Number} The index of this step in the assistant page (1-based)
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.getStepNumber = function() { };

/**
 * Use this method to set help text for an assistant step.
 * @param {String} help - The help text for the step
 * @returns {nlobjAssistantStep} nlobjAssistantStep
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.setHelpText = function(help) { };

/**
 * Use this method to set the label for an assistant step. Note that you can also create a label for a step when the step is first added to the assistant. Do this using nlobjAssistant.addStep(name, label).
 * @param {String} label - The UI label for this step
 * @returns {nlobjAssistantStep} nlobjAssistantStep
 * @memberOf nlobjAssistantStep
 * @since 2009.2
 */
nlobjAssistantStep.prototype.setLabel = function(label) { };

/**
 * Disables the button. When using this API, the assumption is that you have already defined the button's UI label when you created the button using nlobjForm.addButton(name, label, script). The setDisabled() method simply grays-out the button's appearance in the UI.Important: This method is not currently supported for standard NetSuite buttons. This method can be used with custom buttons only.
 * @param {Boolean} disabled   - If set to true, the button will still appear on the form, however, the button label will be grayed-out.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjButton
 * @since 2008.2
 */
nlobjButton.prototype.setDisabled = function(disabled) { };

/**
 * Sets the UI label for the button. When using this API, the assumption is that you have already defined the button's UI label when you created the button using nlobjForm.addButton(name, label, script). You can set setLabel() to trigger based on the execution context. For example, based on the user viewing a page, you can use setLabel() to re-label a button's UI label so that the label is meaningful to that particular user.
 * <br>This API is supported on standard NetSuite buttons as well as on custom buttons.
 * @param {String} label   - The UI label for the custom button
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjButton
 * @since 2008.2
 */
nlobjButton.prototype.setLabel = function(label) { };

/**
 * Sets the button as hidden in the UI. This API is supported on custom buttons and on some standard NetSuite buttons.
 * @param {Boolean} visible   - Defaults to true if not set. If set to false, the button will be hidden in the UI.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjButton
 * @since 2010.2
 */
nlobjButton.prototype.setVisible = function(visible) { };

/**
 * Sets the data to be imported in a linked file for a multi-file import job, by referencing a file in the file cabinet using nlapiLoadFile, or by inputting CSV data as raw string.
 * <br>If an import job requires multiple linked files, this method can be executed multiple times, once for each linked file.
 * @param {String} file - Can be one of the following:
 * <br> - The internal ID, as shown in the file cabinet, of the CSV file containing data to be imported, referenced by nlapiLoadFile, preceded by an identifier for the record sublist for which data is being imported. For example:
 * <br> - Raw string of the data to be imported.
 * @returns {Void}
 * @memberOf nlobjCSVImport
 * @since 2012.2
 */
nlobjCSVImport.prototype.setLinkedFile = function(file) { };

/**
 * Sets the name of the saved import map to be used for an import, by referencing the internal ID or script ID of the import map.
 * @param {String} savedImport - The internal ID or script ID of the saved mapping to use for the import job. The internal ID is system-defined and is displayed in the ID column at Setup > Import/Export > Saved CSV Imports. The script ID can be defined in the Import Assistant and is also displayed on this page.
 * @returns {Void}
 * @memberOf nlobjCSVImport
 * @since 2012.2
 */
nlobjCSVImport.prototype.setMapping = function(savedImport) { };

/**
 * Sets the name of the import job to be shown on the status page for CSV imports.
 * @param {String} jobName - The text to be displayed in the Job Name column at Setup > Import/Export > View CSV Import Status. The default job name format is: <import type> - <csv file name> - <email address of logged-in user>.
 * @returns {Void}
 * @memberOf nlobjCSVImport
 * @since 2012.2
 */
nlobjCSVImport.prototype.setOption = function(jobName) { };

/**
 * Sets the data to be imported in the primary file for an import job, by referencing a file in the file cabinet using nlapiLoadFile, or by inputting CSV data as raw string.
 * @param {String} file - Can be one of the following:
 * <br> - The internal ID, as shown in the file cabinet, of the CSV file containing data to be imported, referenced by nlapiLoadFile. For example:
 * <br> - Raw string of the data to be imported.
 * @returns {Void}
 * @memberOf nlobjCSVImport
 * @since 2012.2
 */
nlobjCSVImport.prototype.setPrimaryFile = function(file) { };

/**
 * Adds a URL parameter (optionally defined per row) to this column's URL. Should only be called after calling setURL(url, dynamic)
 * @param {String} param - The parameter name added to the URL
 * @param {String} value - The parameter value added to the URL or a column in the data source that returns the parameter value for each row
 * @param {Boolean} dynamic [optional] - If true, then the parameter value is actually an alias that is calculated per row
 * @returns {Void}
 * @memberOf nlobjColumn
 * @since 2008.2
 */
nlobjColumn.prototype.addParamToURL = function(param, value, dynamic) { };

/**
 * Sets the UI label for this column
 * @param {String} label - The UI label used for this column
 * @returns {Void}
 * @memberOf nlobjColumn
 * @since 2008.2
 */
nlobjColumn.prototype.setLabel = function(label) { };

/**
 * Sets the base URL (optionally defined per row) for this column
 * @param {String} url - The base URL or a column in the data source that returns the base URL for each row
 * @param {Boolean} dynamic [optional] - If true, then the URL is actually an alias that is calculated per row
 * @returns {Void}
 * @memberOf nlobjColumn
 * @since 2008.2
 */
nlobjColumn.prototype.setURL = function(url, dynamic) { };

/**
 * Use this method to return a normal keyed array of all the field names on a configuration page.
 * @returns {String[]} String[] of field names
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getAllFields = function() { };

/**
 * Use the method to return field metadata for a field
 * @param {String} fldName - The internal ID of the field
 * @returns {nlobjField} The nlobjField object
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getField = function(fldName) { };

/**
 * Use this method to return the UI display value for a select field. This API is supported in select fields only.
 * <br>Restriction: only supported for select fields
 * @param {String} name - The internal ID of the field
 * @returns {String} String - The UI display value corresponding to the current selection for a select field. Returns null if field does not exist on the configuration page or if the field is restricted.
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getFieldText = function(name) { };

/**
 * Use this method to return the UI display values for a multiselect field
 * @param {String} name - The name of the multiselect field whose field display values are being returned
 * @returns {String[]} Returns the selected text values of a multiselect field as an Array
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getFieldTexts = function(name) { };

/**
 * Use this method to return the internal ID value of a field
 * @param {String} name - The internal ID of the field
 * @returns {String} The internal ID (string) value for the field
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getFieldValue = function(name) { };

/**
 * Returns a read-only array of multi-select field values. This API is supported on multi-select fields only.
 * <br>Restriction: only supported for multi-select fields
 * @param {String} name - The internal ID of the field
 * @returns {String[]} String[] of field IDs. Returns null if field is not on the configuration page.
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getFieldValues = function(name) { };

/**
 * Use this method to return the internal ID of a configuration page, for example, accountingpreferences or taxperiods.
 * @returns {String} The internal ID of the configuration page as a string
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.getType = function() { };

/**
 * Use this method to set the value of a select field using its corresponding display value. This API is supported on select fields only.
 * <br>Restriction: only supported for select fields
 * @param {String} name - The internal ID of the field being set
 * @param {String} text - The field display name as it appears in the UI
 * @returns {Void}
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.setFieldText = function(name, text) { };

/**
 * Use this method to set the values (via the UI display values) of a multi-select field. This API is supported on multi-select fields only.
 * <br>Restriction: only supported for multi-select fields
 * @param {String} name - The internal ID of the field being set
 * @param {String[]} texts - (String[]) Array of field display values
 * @returns {Void}
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.setFieldTexts = function(name, texts) { };

/**
 * Use this method to set the value of a field
 * @param {String} name - The internal ID of the field being set
 * @param {String} value - The value the field is being set to
 * @returns {Void}
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.setFieldValue = function(name, value) { };

/**
 * Use this method to set the value of a multi-select field. This API is supported on multi-select fields only.
 * <br>Restriction: only supported for multi-select fields
 * @param {String} name - The internal ID of the field being set
 * @param {String[]} value - (String[]) The value the field is being set to
 * @returns {Void}
 * @memberOf nlobjConfiguration
 * @since 2009.2
 */
nlobjConfiguration.prototype.setFieldValues = function(name, value) { };

/**
 * Returns an Object containing name-value pairs of color groups to their corresponding RGB hex color based on the currently logged in user's color theme preferences.
 * <br>Using this method, developers can get a user's color theme and apply the entire color theme map (or just individual attributes) to bundled Suitelets that have been installed into a user's account. Doing so ensures that the look-and-feel of each Suitelet matches all other records/pages running in the account.Note: NetSuite color themes are read-only. Developers cannot programmatically create new color themes or add additional attributes to NetSuite's existing color theme template. In NetSuite, color themes can be set by going to Home > Set Preferences > Appearances tab.
 * @returns {Object} Object
 * @memberOf nlobjContext
 * @since 2010.1
 */
nlobjContext.prototype.getColorPreferences = function() { };

/**
 * Returns the currently logged in user's account ID
 * @returns {String} The string value of user's account ID, for example NL555ABC
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getCompany = function() { };

/**
 * Returns the internal ID of the currently logged in user's department
 * @returns {Number} The logged in user's department ID as an integer
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getDepartment = function() { };

/**
 * Returns the deploymentId for the current script deployment (ie., the currently executing script)
 * @returns {String} The deploymentId as a string
 * @memberOf nlobjContext
 * @since 2009.1
 */
nlobjContext.prototype.getDeploymentId = function() { };

/**
 * Returns the currently logged in user's e-mail address. The email field on the user's employee record must contain an email address.
 * @returns {String} An email address as a string
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getEmail = function() { };

/**
 * Returns the environment in which the current script is being executed. Valid values are SANDBOX , PRODUCTION , BETA , INTERNAL.
 * @returns {String} The name of the environment as a string
 * @memberOf nlobjContext
 * @since 2008.2
 */
nlobjContext.prototype.getEnvironment = function() { };

/**
 * Returns context information about what triggered the current script. Available values are:
 * <br>- userinterface - Client SuiteScript or user event triggers invoked from the UI
 * <br>- webservices - User event triggers invoked from webservice calls
 * <br>- csvimport - User event triggers invoked during CSV imports
 * <br>- offlineclient - User event triggers invoked during offlineclient
 * <br>- smbxml - User event triggers invoked during SMBXML calls
 * <br>- portlet - Portlet script or user event triggers invoked via portlet scripts
 * <br>- scheduled - Scheduled script or user event triggers invoked via scheduled scripts
 * <br>- suitelet - Suitelet or user event triggers invoked via suitelets
 * <br>- custommassupdate - Mass update script triggers invoked via custom Mass Update scripts
 * <br>- workflow - Workflow action script triggers invoked via Workflow Action scripts
 * <br>- webstore - User event triggers invoked from the web store (for example to determine if sales orders or customers were created in the web store).
 * <br>- userevent - This context type represents cases in which records are generated in the backend (as opposed to being generated by the UI). For example, the 'userevent' context distinguishes the case wherein a Bill Payment is submitted as part of a non-record page. Whereas the 'userinterface' context identifies when a single Bill Payment record is submitted from the UI.
 * @returns {String} The execution context as a string
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getExecutionContext = function() { };

/**
 * Use this method to determine if a particular feature is enabled in a NetSuite account. These are the features that appear on the Enable Features page (Setup > Company > Enable Features).
 * @param {String} name - The internal ID of the feature.
 * @returns {Boolean} Returns true if a feature is enabled in the current account
 * @memberOf nlobjContext
 * @since 2009.2
 */
nlobjContext.prototype.getFeature = function(name) { };

/**
 * Returns the internal ID of the currently logged in user's location
 * @returns {Number} The logged in user's location ID as an integer
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getLocation = function() { };

/**
 * Returns the script logging level for the current script execution. This method is not supported on client scripts.
 * @returns {String} The string value of the script log level. Possible values are DEBUG, AUDIT, ERROR, EMERGENCY
 * @memberOf nlobjContext
 * @since 2008.2
 */
nlobjContext.prototype.getLogLevel = function() { };

/**
 * Returns the currently logged in user's name
 * @returns {String} The logged in user's name as a string
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getName = function() { };

/**
 * Return the % complete specified for the current scheduled script execution. The return value will appear in the %Complete column in the Scheduled Script Status page. Note that this method can only be called from scheduled scripts.
 * @returns {Number} The integer value of the percent complete field
 * @memberOf nlobjContext
 * @since 2009.1
 */
nlobjContext.prototype.getPercentComplete = function() { };

/**
 * Use this method to get a user's permission level for a given permission.
 * @param {String} name - The internal ID of a permission.
 * @returns {Number} The integer value of user's permission level for a given permission. Values 4 through 0 can be returned:
 * @memberOf nlobjContext
 * @since 2009.2
 */
nlobjContext.prototype.getPermission = function(name) { };

/**
 * Use this method to get the value of a NetSuite preference. Currently only General Preferences and Accounting Preferences are exposed in SuiteScript. (You can view General Preferences by going to Setup > Company > General Preferences. View Accounting Preferences by going to Setup > Accounting > Accounting Preferences.)
 * <br>If you want to change the value of a General or Accounting preference using SuiteScript, you must load each preference page using nlapiLoadConfiguration(type), where name is either 'companypreferences' (for the General Preferences page) or 'accountingpreferences' (for the Accounting Preferences page). The nlapiLoadConfiguration API returns an nlobjRecord object, which lets you change preference values using the setFieldValue() method. For additional details, see nlapiLoadConfiguration. Note: The permission level will be 4 if the script is configured to execute as admin. You can configure a script to execute as admin by selecting "administrator" from the Execute as Role field on Script Deployment page.
 * @param {String} name - The internal ID of the preference.
 * @returns {String} The value of a system or script preference for the current user. The value can be T or F if the preference is a NetSuite checkbox field. The value can also be a string if the preference is a NetSuite dropdown field.
 * @memberOf nlobjContext
 * @since 2009.2
 */
nlobjContext.prototype.getPreference = function(name) { };

/**
 * Returns the number of scheduled script queues in a given account.
 * This method is helpful for SuiteApp developers who want to check for the number of queues in an account. If the consumer of the SuiteApp has purchased a SuiteCloud Plus license, a call to getQueueCount() will return 5, meaning that the account has 5 scheduled script queues. A call to getQueueCount() in accounts that do not have a SuiteCloud Plus licence will return 1, meaning the account has only 1 scheduled script queue. (Note that in some cases, an account may have two licenses supporting 10 queues, or three licenses supporting 15 queues.)
 * Once you get the number back in script, you can make business logic decisions based on that number. For example, if you know an account has 5 queues, you can have more than 1 script deployment and distribute the processing load to more than 1 queue.
 * @returns {Number} The number of queues
 * @memberOf nlobjContext
 * @since 2013.1
 */
nlobjContext.prototype.getQueueCount = function() { };

/**
 * Returns the remaining amount of unit usage for the current script
 * @returns {Number} The integer value of the remaining unit count
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getRemainingUsage = function() { };

/**
 * Returns the internal ID of the currently logged in user's role
 * @returns {String} The logged in user's role ID as a string
 * @memberOf nlobjContext
 * @since 2007.1
 */
nlobjContext.prototype.getRole = function() { };

/**
 * Returns the internal ID of the currently logged in user's center type (role center)
 * @returns {String} The string value of the logged in user's center - for example, SALES, ACCOUNTING, CLASSIC. Note that the string value of a custom center can also be returned.
 * @memberOf nlobjContext
 * @since 2008.2
 */
nlobjContext.prototype.getRoleCenter = function() { };

/**
 * Returns the custom scriptId of the role (as opposed to the internal numerical ID).
 * When bundling a custom role, the internal ID number of the role in the target account can change after the bundle is installed. Therefore, in the target account you can use getRoleId() to return the unique/custom scriptId assigned to the role.
 * @returns {String} Custom scriptId of a role as a string.
 * @memberOf nlobjContext
 * @since 2012.2
 */
nlobjContext.prototype.getRoleId = function() { };

/**
 * Returns the scriptId for the currently executing script
 * @returns {String} The scriptId as a string
 * @memberOf nlobjContext
 * @since 2009.1
 */
nlobjContext.prototype.getScriptId = function() { };

/**
 * Use this method to get the value of a user-defined session object for the current user.
 * @param {String} name - The key used to store the session object
 * @returns {String} Returns the string value of a user-defined session object for the current user
 * @memberOf nlobjContext
 * @since 2009.2
 */
nlobjContext.prototype.getSessionObject = function(name) { };

/**
 * Use this API to get a system or script setting. Note that if you want to get session, feature, or permission settings directly, you can also use these nlobjContext methods:
 * <br>- getSessionObject(name)
 * <br>- getFeature(name)
 * <br>- getPermission(name)
 * @param {String} type - The type of script/system setting. Possible values include:
 * <br> - SESSION - session variable (volatile setting defined per session). Supported in server scripts only. Important: The SESSION type value is not supported in Client SuiteScript.
 * <br> - FEATURE - returns T (enabled) or F (disabled) depending on whether a feature is enabled. Supported in client and server SuiteScript.
 * <br> - PERMISSION - returns permission level: 0 (none), 1 (view), 2 (create), 3 (edit), 4 (full). Supported in client and server SuiteScript.
 * <br> - SCRIPT - script parameter (defined per script). Supported in client and server SuiteScript. If you do not know what script parameters are in NetSuite, see Creating Script Parameters Overview.
 * @param {String} name - The name of the script/system setting
 * @returns {String, Number} If type is specified as SCRIPT, SESSION, or FEATURE, a string value is returned. If type is specified as PERMISSION, an integer value is returned.
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.getSetting = function(type, name) { };

/**
 * Returns the internal ID of the currently logged in user's subsidiary
 * @returns {Number} The logged in user's subsidiary ID as an integer
 * @memberOf nlobjContext
 * @since 2007.1
 */
nlobjContext.prototype.getSubsidiary = function() { };

/**
 * Returns the currently logged in user's internal ID
 * @returns {String} The logged in user's ID as a string
 * @memberOf nlobjContext
 * @since 2007.1
 */
nlobjContext.prototype.getUser = function() { };

/**
 * Returns the version of NetSuite that the method is called in. For example, if getVersion() is executed in an account running NetSuite 2010.2, the value returned is 2010.2. If getVersion() is executed in an account running NetSuite 2010.1, the value returned is 2010.1.
 * <br>This method may be helpful to those installing SuiteBundles in other NetSuite accounts, and wish to know the version number before installing the bundle.
 * @returns {Number} The NetSuite account version as a number - for example: 2010.2
 * @memberOf nlobjContext
 * @since 2010.2
 */
nlobjContext.prototype.getVersion = function() { };

/**
 * Sets the percent complete for the currently executing scheduled script. Note that this method can only be called from scheduled scripts.
 * @param {Number} pct - The percentage of records completed
 * @returns {Void}
 * @memberOf nlobjContext
 * @since 2009.1
 */
nlobjContext.prototype.setPercentComplete = function(pct) { };

/**
 * Use this method to add or set the value of a user-defined session object for the current user. This value is valid during the current user's login.
 * <br>This call allows the user to temporarily save something to the session before persisting it in a custom record.
 * @param {String} name - The key used to store the session object
 * @param {String} value - The value to associate with this key in the user's session
 * @returns {Void}
 * @memberOf nlobjContext
 * @since 2009.2
 */
nlobjContext.prototype.setSessionObject = function(name, value) { };

/**
 * Sets the value of a script or user-defined setting. Only available in server scripts.
 * @param {String} type - The type of script/system settingSESSION - session variable (volatile setting defined per session)
 * @param {String} name - The name of the script/system setting
 * @param {String} value - The new value for the script/system setting
 * @returns {Void}
 * @memberOf nlobjContext
 * @since 2007.0
 */
nlobjContext.prototype.setSetting = function(type, name, value) { };

//required declaration for code completion to work for "new" syntax
/**
 * @param {String} str -  request string; can include an embedded GUID (globally unique string)
 * @param {String} domain - URLiveL's host name. Host name must exactly match the host name in your URL.
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
var nlobjCredentialBuilder = function(str, domain) { };

/**
 * Appends a passed in string to an nlobjCredentialBuilder object.
 * @param {String} text - String to be appended
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
nlobjCredentialBuilder.prototype.append = function(text) { };

/**
 * Encodes an nlobjCredentialBuilder object per the base64 scheme.
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
nlobjCredentialBuilder.prototype.base64 = function() { };

/**
 * Replaces all instances of string1 with string2.
 * @param {String} string1 — String to be replaced
 * @param {String} string2 — String to be replaced with
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
nlobjCredentialBuilder.prototype.replace = function(string1, string2) { };

/**
 * Encrypts an nlobjCredentialBuilder object with the SHA-1 hash function.
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
nlobjCredentialBuilder.prototype.sha1 = function() { };

/**
 * Encrypts an nlobjCredentialBuilder object with the SHA-256 hash function.
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
nlobjCredentialBuilder.prototype.sha256 = function() { };

/**
 * Encodes an nlobjCredentialBuilder object per the UTF-8 scheme.
 * @returns {nlobjCredentialBuilder} An nlobjCredentialBuilder object.
 * @since 2013.2
 */
nlobjCredentialBuilder.prototype.utf8 = function() { };

var nlobjDuplicateJobRequest = { };
nlobjDuplicateJobRequest.prototype.ENTITY_CUSTOMER='';
nlobjDuplicateJobRequest.prototype.ENTITY_CONTACT='';
nlobjDuplicateJobRequest.prototype.ENTITY_LEAD='';
nlobjDuplicateJobRequest.prototype.ENTITY_PROSPECT='';
nlobjDuplicateJobRequest.prototype.ENTITY_PARTNER='';
nlobjDuplicateJobRequest.prototype.ENTITY_VENDOR='';
nlobjDuplicateJobRequest.prototype.MASTERSELECTIONMODE_CREATED_EARLIEST='';
nlobjDuplicateJobRequest.prototype.MASTERSELECTIONMODE_MOST_RECENT_ACTIVITY='';
nlobjDuplicateJobRequest.prototype.MASTERSELECTIONMODE_MOST_POPULATED_FIELDS='';
nlobjDuplicateJobRequest.prototype.MASTERSELECTIONMODE_SELECT_BY_ID='';
nlobjDuplicateJobRequest.prototype.OPERATION_MERGE='';
nlobjDuplicateJobRequest.prototype.OPERATION_DELETE='';
nlobjDuplicateJobRequest.prototype.OPERATION_MAKE_MASTER_PARENT='';
nlobjDuplicateJobRequest.prototype.OPERATION_MARK_AS_NOT_DUPES='';

/**
 * @param {String} entityType [required] - Set to a constant value defined on the nlobjDuplicateJobRequest object. When you pass in the constant, your code should look like <nlobjDuplicateJobRequestInstance>.<constant>. The following are the constant values:
 * <br> - ENTITY_CUSTOMER
 * <br> - ENTITY_CONTACT
 * <br> - ENTITY_LEAD
 * <br> - ENTITY_PROSPECT
 * <br> - ENTITY_PARTNER
 * <br> - ENTITY_VENDOR
 * @returns {Void}
 * @memberOf nlobjDuplicateJobRequest
 * @since 2013.1
 */
nlobjDuplicateJobRequest.prototype.setEntityType = function(entityType) { };

/**
 * @param {String} masterID  [required] - Required and valid only if setMasterSelectionMode(mode) is set to MASTERSELECTIONMODE_SELECT_BY_ID
 * @returns {Void}
 * @memberOf nlobjDuplicateJobRequest
 * @since 2013.1
 */
nlobjDuplicateJobRequest.prototype.setMasterId = function(masterID) { };

/**
 * @param {String} mode  [required] - Set to a constant value defined on the nlobjDuplicateJobRequest object. When you pass in the constant, your code should look like <nlobjDuplicateJobRequestInstance>.<constant>. The following are the constant values:
 * <br> - MASTERSELECTIONMODE_CREATED_EARLIEST
 * <br> - MASTERSELECTIONMODE_MOST_RECENT_ACTIVITY
 * <br> - MASTERSELECTIONMODE_MOST_POPULATED_FIELDS
 * <br> - MASTERSELECTIONMODE_SELECT_BY_ID
 * @returns {Void}
 * @memberOf nlobjDuplicateJobRequest
 * @since 2013.1
 */
nlobjDuplicateJobRequest.prototype.setMasterSelectionMode = function(mode) { };

/**
 * @param {String} operation  [required] - Set to a constant value defined on the nlobjDuplicateJobRequest object. When you pass in the constant, your code should look like <nlobjDuplicateJobRequestInstance>.<constant>. The following are the constant values:
 * <br> - OPERATION_MERGE
 * <br> - OPERATION_DELETE
 * <br> - OPERATION_MAKE_MASTER_PARENT
 * <br> - OPERATION_MARK_AS_NOT_DUPES
 * @returns {Void}
 * @memberOf nlobjDuplicateJobRequest
 * @since 2013.1
 */
nlobjDuplicateJobRequest.prototype.setOperation = function(operation) { };

/**
 * @param {Object[]} dupeRecords [required] - Array of records to be merged
 * @returns {Void}
 * @memberOf nlobjDuplicateJobRequest
 * @since 2013.1
 */
nlobjDuplicateJobRequest.prototype.setRecords = function(dupeRecords) { };

/**
 * Returns the error code for this system or user-defined error
 * @returns {String} The error code as a string
 * @memberOf nlobjError
 * @since 2008.2
 */
nlobjError.prototype.getCode = function() { };

/**
 * Returns the error message (user-defined or system) associated with this error
 * @returns {String} The string value of the error message
 * @memberOf nlobjError
 * @since 2008.2
 */
nlobjError.prototype.getDetails = function() { };

/**
 * Returns an error reference ID. If you have included a catch block in your code, you can use getId() to get the internal reference number for an unexpected error. This method is useful if you want to keep your own log of error numbers or you want to email the value of getId() to someone else.
 * <br>Also note that if you have to call Technical Support to help you resolve a SuiteScript issue, this ID may be helpful to your Support rep in diagnosing the problem.Note: If you do not use getId() to programmatically get the ID, you can also view the ID in the UI. After a script has executed, the script's error ID (if there is an error) appears on the Execution Log subtab of the Script Deployment page. The ID also appears on the Execution Log subtab in the SuiteScript Debugger. Finally, if you have chosen to be emailed whenever there is a problem with a script, the error ID is provided in the email that is sent to you.
 * @returns {String} The error ID as a string
 * @memberOf nlobjError
 * @since 2008.2
 */
nlobjError.prototype.getId = function() { };

/**
 * Returns the internal ID of the submitted record if this error was thrown in an afterSubmit script
 * @returns {Number} The the internal ID of the submitted record as an integer
 * @memberOf nlobjError
 * @since 2008.2
 */
nlobjError.prototype.getInternalId = function() { };

/**
 * Returns the stacktrace containing the location of the error
 * @returns {String[]} String[]
 * @memberOf nlobjError
 * @since 2008.2
 */
nlobjError.prototype.getStackTrace = function() { };

/**
 * Return the name of the user event script (if applicable) that the error was thrown from.
 * @returns {String} The string value of the user event that threw the error - for example, beforeLoad, beforeSubmit, or afterSubmit
 * @memberOf nlobjError
 * @since 2008.2
 */
nlobjError.prototype.getUserEvent = function() { };

/**
 * Adds a select option to a SELECT field
 * @param {String} value - The internal ID of this select option
 * @param {String} text - The UI label for this option
 * @param {Boolean} selected [optional] - If true, then this option is selected by default
 * @returns {Void}
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.addSelectOption = function(value, text, selected) { };

/**
 * Returns field UI label
 * @returns {String} String value of the field's UI label
 * @memberOf nlobjField
 * @since 2009.1
 */
nlobjField.prototype.getLabel = function() { };

/**
 * Returns the field internal ID
 * @returns {String} String value of a field's internal ID
 * @memberOf nlobjField
 * @since 2009.1
 */
nlobjField.prototype.getName = function() { };

/**
 * Use this API to obtain a list of available options on a select field. This API can be used on both standard and custom select fields. Only the first 1,000 available options will be returned by this API.
 * <br>This method can only be used in server contexts against a record object. Also note that a call to this method may return different results for the same field for different roles.
 * <br>If you attempt to get select options on a field that is not a select field, or if you reference a field that does not exist on the form, null is returned.
 * @param {String} filter [optional] - A search string to filter the select options that are returned. For example, if there are 50 select options available, and 10 of the options contains 'John', e.g. "John Smith" or "Shauna Johnson", only those 10 options will be returned.
 * @param {String} filteroperator [optional] - Supported operators are contains, is, startswith. If not specified, defaults to the contains operator.
 * @returns {nlobjSelectOption[]} An array of nlobjSelectOption objects. These objects represent the key-value pairs representing a select option (for example: 87, Abe Simpson).
 * @memberOf nlobjField
 * @since 2009.2
 */
nlobjField.prototype.getSelectOptions = function(filter, filteroperator) { };

/**
 * Returns the field type - for example, text, date, currency, select, checkbox, etc.
 * @returns {String} String value of field's SuiteScript type
 * @memberOf nlobjField
 * @since 2009.1
 */
nlobjField.prototype.getType = function() { };

/**
 * Sets the alias used to set the value for this field. By default the alias is equal to the field's name. The method is only supported on scripted fields via the UI Object API.
 * @param {String} alias  column used to populate the field (mostly relevant when populating sublist fields)
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setAlias = function(alias) { };

/**
 * Use this method to set the layout type for a field and optionally the break type. This method is only supported on scripted fields that have been created using the UI Object API.
 * @param {String} breaktype  break type used to add a break in flow layout for this field: startcol,startrow,none
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2009.2
 */
nlobjField.prototype.setBreakType = function(breaktype) { };

/**
 * Sets the default value for this field. This method is only supported on scripted fields via the UI object API.
 * @param {String} value - The default value for this field. Note that if you pass an empty string, the field will default to a blank field in the UI.
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setDefaultValue = function(value) { };

/**
 * Sets the height and width for the field. Only supported on multi-selects, long text, rich text, and fields that get rendered as INPUT (type=text) fields. This API is not supported on list/record fields. This method is only supported on scripted fields via the UI object API.
 * @param {Number} width - The width of the field (cols for textarea, characters for all others)
 * @param {Number} height [optional] - The height of the field (rows for textarea and multiselect fields)
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setDisplaySize = function(width, height) { };

/**
 * Sets the display type for this field.
 * <br>Be aware that this method cannot be used in client scripts. In other words, if you use nlapiGetField(fldName) in a client script to return a field object that has been added to a form, you cannot use setDisplayType to set the field's display type. The nlobjField object returned from nlapiGetField(fldName) is read-only.
 * @param {String} type - The display type for this field
 * <br> - inline - This makes the field display as inline text
 * <br> - hidden - This hides the field on the form.
 * <br> - readonly - This disables the field but it is still selectable and scrollable (for textarea fields)
 * <br> - entry - This makes the sublist field appear as a data entry input field (for non checkbox, select fields)
 * <br> - disabled - This disables the field from user-changes
 * <br> - normal - (default) This makes the field appear as a normal input field (for non-sublist fields)
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setDisplayType = function(type) { };

/**
 * Use this method to set help text for this field.
 * @param {String} help - Help text for the field. When the field label is clicked, a field help popup will open to display the help text.
 * @param {Boolean} inline [optional] - If not set, defaults to false. This means that field help will appear only in a field help popup box when the field label is clicked. If set to true, field help will display in a field help popup box, as well as inline below the field (see figure).
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2009.2
 */
nlobjField.prototype.setHelpText = function(help, inline) { };

/**
 * Sets the UI label for this field. The method is available only on scripted fields via the UI object API.
 * @param {String} label - The UI label used for this field
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setLabel = function(label) { };

/**
 * Sets the display type for this field and optionally the break type. This method is only supported on scripted fields via the UI Object API.
 * @param {String} type - The layout type for this field. Use any of the following layout types:
 * <br> - outside - This makes the field appear outside (above or below based on form default) the normal field layout area
 * <br> - outsidebelow - This makes the field appear below the normal field layout area
 * <br> - outsideabove - This makes the field appear above the normal field layout area
 * <br> - startrow - This makes the field appear first in a horizontally aligned field group in normal field layout flow
 * <br> - midrow - This makes the field appear in the middle of a horizonatally aligned field group in normal field layout flow
 * <br> - endrow - This makes the field appear last in a horizonatally aligned field group in normal field layout flow
 * <br> - normal - (default)
 * @param {String} breaktype - The layout break type. Use any of the following break types.
 * <br> - startcol - This starts a new column (also disables automatic field balancing if set for any field)
 * <br> - startrow - For outside fields, this places the field on a new row
 * <br> - none - (default)
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setLayoutType = function(type, breaktype) { };

/**
 * Sets the text that gets displayed in lieu of the field value for URL fields.
 * @param {String} text - The displayed value (in lieu of URL)
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setLinkText = function(text) { };

/**
 * Sets the field to mandatory. The method is only supported on scripted fields via the UI Object API.
 * @param {Boolean} mandatory - If true, then the field will be defined as mandatory
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setMandatory = function(mandatory) { };

/**
 * Sets the max length for this field (only valid for text, rich text, long text, and textarea fields). This method is only supported on scripted fields via the UI Object API.
 * @param {Number} maxlength - The max length for this field
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setMaxLength = function(maxlength) { };

/**
 * Sets the number of empty field spaces before/above this field. This method is only supported on scripted fields via the UI Object API.
 * @param {Number} padding - The number of empty vertical spaces (rows) before this field
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjField
 * @since 2008.2
 */
nlobjField.prototype.setPadding = function(padding) { };

/**
 * Use this method to define whether a field group can be collapsed. You can also use this method to define if the field group will display as collapsed or expanded when the page first loads.
 * @param {Boolean} collapsible - A value of true means that the field group can be collapsed. A value of false means that the field group cannot be collapsed - the field group displays as a static group that cannot be opened or closed.
 * @param {Boolean} hidden [optional] - If not set, defaults to false. This means that when the page loads, the field group will not appear collasped. Note: If you set the collapsible parameter to false (meaning the field group is not collapsible), then any value you specify for hidden will be ignored.
 * @returns {nlobjFieldGroup} nlobjFieldGroup
 * @memberOf nlobjFieldGroup
 * @since 2009.2
 */
nlobjFieldGroup.prototype.setCollapsible = function(collapsible, hidden) { };

/**
 * Use this method to create a UI label for a field group.
 * @param {String} label - The UI label for the field group
 * @returns {nlobjFieldGroup} nlobjFieldGroup
 * @memberOf nlobjFieldGroup
 * @since 2009.2
 */
nlobjFieldGroup.prototype.setLabel = function(label) { };

/**
 * Use this method to conditionally show or hide the border of a field group. A field group border consists of the field group title and the gray line that frames the group by default.
 * @param {Boolean} isShow - Set to true to show a field group border. Set to false to hide the border.
 * @returns {Void}
 * @memberOf nlobjFieldGroup
 * @since 2011.1
 */
nlobjFieldGroup.prototype.setShowBorder = function(isShow) { };

/**
 * Use this method to conditionally show or hide the border of a field group. A field group border consists of the field group title and the gray line that frames the group by default.
 * @param {Boolean} isSingleColumn - Set to true to place all fields in the field group into a single column. Set to false to allow NetSuite to auto-align your field group fields into one, two, or three columns, depending on the number of fields and the width of your screen.
 * @returns {Void}
 * @memberOf nlobjFieldGroup
 * @since 2011.1
 */
nlobjFieldGroup.prototype.setSingleColumn = function(isSingleColumn) { };

/**
 * @returns {String} The string description of the file. This is the description that appears in the Description field on the folder or file record.
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getDescription = function() { };

/**
 * @returns {Number} Integer: The internal ID of the file's folder within the NetSuite file cabinet, for example 10, 2, etc.
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getFolder = function() { };

/**
 * Returns the internal ID of the file (if the file is stored in the NetSuite file cabinet)
 * @returns {Number} The integer value of file ID, for example 8, 108, 11, etc. This is the ID that appears in the Internal ID column next to the file in the file cabinet.
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getId = function() { };

/**
 * Returns the name of the file
 * @returns {String} The string value of the file name
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getName = function() { };

/**
 * Returns the size of the file in bytes
 * @returns {Number} The integer value of the file size
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getSize = function() { };

/**
 * Returns the type of the file
 * @returns {String} The string value of the file type - for example, PDF, CSV, PLAINTEXT. (For a list of supported file type IDs, see Supported File Types.)
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getType = function() { };

/**
 * Returns the URL to the file if it is stored in the NetSuite file cabinet
 * @returns {String} The URL as a string
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getURL = function() { };

/**
 * Returns the contents of the file (base 64 encoded for binary files)
 * @returns {String} The string value of the file contents
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.getValue = function() { };

/**
 * @returns {Boolean} Boolean: The file's inactive status as either true or false. Returns true if the file is inactive.
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.isInactive = function() { };

/**
 * @returns {Boolean} Boolean: The file's online status as either true or false. Returns true if the file is "Available without Login."
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.isOnline = function() { };

/**
 * @param {String} description - A description of the file. This description will appear in the Description field on the folder or file record.
 * @returns {Void}
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.setDescription = function(description) { };

/**
 * Sets the character encoding of a file. The available encoding types are as follows:
 * <br>- UTF-8
 * <br>- windows-1252
 * <br>- ISO-8859-1
 * <br>- GB18030
 * <br>- GB2312
 * <br>- SHIFT_JIS
 * <br>- MacRoman
 * @param {String} encodingType - The type of encoding for the file.
 * @returns {Void}
 * @memberOf nlobjFile
 * @since 2010.1
 */
nlobjFile.prototype.setEncoding = function(encodingType) { };

/**
 * Sets the internal ID of the folder that the file is in
 * @param {Number} id - The internal ID of the file's folder, for example 10, -4, 20, etc.
 * @returns {Void}
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.setFolder = function(id) { };

/**
 * Sets the file's inactive status. When you inactive a file or folder, it no longer appears on lists unless (in the UI) you have selected the Show Inactives check box.
 * <br>Note: The Show Inactives check box appears in the bottom-left corner of the Folders list. Navigate to the Folders list by going to Documents > Files > File Cabinet.
 * @param {Boolean} inactive - The file's inactive status. Set to true to inactive the file. Set to false to make the file active.
 * @returns {Void}
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.setIsInactive = function(inactive) { };

/**
 * Sets the file's online ("Available without Login") status. When a file is online, other users can download the file without a login session. This means you can upload images, MP3, or any othe file type to the file cabinet and give other users the file URL without giving them access to the account.
 * @param {Boolean} online - The file's updated online status. Set to true to make the file available online. Set to false if you do not want the file available online.
 * @returns {Void}
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.setIsOnline = function(online) { };

/**
 * Sets the name of the file
 * @param {String} name - The name of the file
 * @returns {Void}
 * @memberOf nlobjFile
 * @since 2009.1
 */
nlobjFile.prototype.setName = function(name) { };

/**
 * Adds a button to a form
 * @param {String} name - The internal ID name of the button. The internal ID must be in lowercase, contain no spaces, and include the prefix custpage if you are adding the button to an existing page. For example, if you add a button that appears as Update Order, the button internal ID should be something similar to custpage_updateorder.
 * @param {String} label - The UI label used for this button
 * @param {String} script [optional] - The onclick script used for this button
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addButton = function(name, label, script) { };

/**
 * Adds a field that lets you store credentials in NetSuite to be used when invoking services provided by third parties. For example, merchants need to store credentials in NetSuite used to communicate with Payment Gateway providers when executing credit card transactions.
 * <br>This method is supported in client and server scripts.
 * <br>Additional things to note about this method:
 * <br>- Credentials associated with this field are stored in encrypted form.
 * <br>- No piece of SuiteScript holds a credential in clear text mode.
 * <br>- NetSuite reports or forms will never provide to the end user the clear text form of a credential.
 * <br>- Any exchange of the clear text version of a credential with a third party must occur over SSL.
 * <br>- For no reason will NetSuite ever log the clear text value of a credential (for example, errors, debug message, alerts, system notes, and so on).
 * @param {String} id - The internal ID of the credential field.
 * @param {String} label - The UI label for the credential field.
 * @param {String} website [optional] - The domain the credentials can be sent to. For example, 'www.mysite.com'.
 * @param {String} scriptId [optional] - The scriptId of the script that is allowed to use this credential field. For example, 'customscript_my_script'.
 * @param {String} value [optional] - If you choose, you can set an initial value for this field. This value is the handle to the credentials.
 * @param {Boolean} entityMatch [optional] - Controls whether use of nlapiRequestUrlWithCredentials with this credential is restricted to the same entity that originally entered the credential. An example where you would not want this (you would set to false) is with a credit card processor, where the credential represents the company an employee is working for and multiple entities will be expected to make secure calls out to the processor (clerks, for example). An example where you might want to set entityMatch to true is when each user of the remote call has his or her own credentials.
 * @param {String} tab [optional] - The tab parameter can be used to specify either a tab or a field group (if you have added nlobjFieldGroup objects to your form). If tab is empty, then the field is added to the "main" section of the form.
 * @returns {nlobjField} nlobjField object
 * @memberOf nlobjForm
 * @since 2012.1
 */
nlobjForm.prototype.addCredentialField = function(id, label, website, scriptId, value, entityMatch, tab) { };

/**
 * Adds an nlobjField object to a form and returns a reference to it
 * @param {String} name - The internal ID name of the field. The internal ID must be in lowercase, contain no spaces, and include the prefix custpage if you are adding the field to an existing page. For example, if you add a field that appears as Purchase Details, the field internal ID should be something similar to custpage_purchasedetails or custpage_purchase_details.
 * @param {String} type - The field type for this field. Use any of the following enumerated field types:
 * <br> - text
 * <br> - radio - See Working with Radio Buttons for details on adding this field type.
 * <br> - label - This is a field type that has no values. It is used for placing a label next to another field. In Working with Radio Buttons, see the first code sample that shows how to set this field type and how it will render in the UI.
 * <br> - email
 * <br> - phone
 * <br> - date
 * <br> - currency
 * <br> - float
 * <br> - integer
 * <br> - checkbox
 * <br> - select
 * <br> - url
 * <br> - timeofday
 * <br> - textarea
 * <br> - multiselect
 * <br> - image - This field type is available only for fields appearing on list/staticlist sublists. You cannot specify an image field on a form.
 * <br> - inlinehtml
 * <br> - password
 * <br> - help
 * <br> - percent
 * <br> - longtext
 * <br> - richtext
 * <br> - file - This field type is available onluy for Suitelets and will appear on the main tab of the Suitelet page. Setting the field type to file adds a file upload widget to the page and changes the form encoding type for the form to multipart/form-data.
 * @param {String} label [optional] - The UI label for this field (this is the value displayed for help fields)
 * @param {String} sourceOrRadio [optional] - String or number. The internalId or scriptId of the source list for this field if it is a select (List/Record) or multi-select field. See List/Record Type IDs for the internal IDs of all supported list/record types.
 * @param {String} tab [optional] - The tab under which to display this field. If empty, then the field is added to the main section of the form (immediately below the title bar)
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addField = function(name, type, label, sourceOrRadio, tab) { };

/**
 * Adds a field group to the form.
 * @param {String} name - Provide an internal ID for the field group.
 * @param {String} label - The UI label for the field group
 * @param {String} tab [optional] - Specify the tab you the field group to appear on. If no tab is specified, the field group is placed on the "main" area of the form.
 * @returns {nlobjFieldGroup} nlobjFieldGroup
 * @memberOf nlobjForm
 * @since 2011.1
 */
nlobjForm.prototype.addFieldGroup = function(name, label, tab) { };

/**
 * Adds a navigation cross-link to the form
 * @param {String} type - The type of navbar link to add. Possible values include:
 * <br> - breadcrumb - appears on top left corner after system bread crumbs
 * <br> - crosslink - appears on top right corner
 * @param {String} title - The text displayed in the link
 * @param {String} url - The URL used for this link
 * @returns {Void}
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addPageLink = function(type, title, url) { };

/**
 * Adds a reset button to a form
 * @param {String} label [optional] - The UI label used for this button. If no label is provided, the label defaults to Reset.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addResetButton = function(label) { };

/**
 * Adds an nlobjSubList object to a form and returns a reference to it. Note that sorting (in the UI) is not supported on static sublists created using the addSubList(...) method if the row count exceeds 25.
 * @param {String} name - The internal ID name of the sublist. The internal ID must be in lowercase, contain no spaces, and include the prefix custpage if you are adding the sublist to an existing page. For example, if you add a sublist that appears on the UI as Purchase Details, the sublist internal ID should be something equivalent to custpage_purchasedetails or custpage_purchase_details.
 * @param {String} type - The sublist type. Use any of the following types:
 * <br> - editor - An edit sublist with non-inline form fields (similar to the Address sublist)
 * <br> - inlineeditor - An edit sublist with inline fields (similar to the Item sublist)
 * <br> - list - A list sublist with editable fields (similar to the Billable Items sublist)
 * <br> - staticlist - A read-only segmentable list sublist (similar to the search results sublist)
 * @param {String} label - The UI label for this sublist
 * @param {String} tab [optional] - The tab under which to display this sublist. If empty, the sublist is added to the main tab.
 * @returns {nlobjSubList} nlobjSubList
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addSubList = function(name, type, label, tab) { };

/**
 * Adds a subtab to a form and returns an nlobjTab object reference to it.Important: If you add only one subtab, the UI label you define for the subtab will not appear in the UI. You must define two subtabs for subtab UI labels to appear.
 * @param {String} name - The internal ID name of the subtab. The internal ID must be in lowercase, contain no spaces, and include the prefix custpage if you are adding the subtab to an existing page. For example, if you add a subtab that appears on the UI as Purchase Details, the subtab internal ID should be something similar to custpage_purchasedetails or custpage_purchase_details.
 * @param {String} label - The UI label of the subtab
 * @param {String} tab [optional] - The tab under which to display this subtab. If empty, it is added to the main tab.
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addSubTab = function(name, label, tab) { };

/**
 * Adds a submit button to a form
 * @param {String} label [optional] - The UI label for this button. If no label is provided, the label defaults to Save.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addSubmitButton = function(label) { };

/**
 * Adds a tab to a form and returns an nlobjTab object reference to the tab
 * @param {String} name - The internal ID name of the tab. The internal ID must be in lowercase, contain no spaces, and include the prefix custpage if you are adding the tab to an existing page. For example, if you add a tab that appears on the UI as Purchase Details, the tab internal ID should be something equivalent to custpage_purchasedetails or custpage_purchase_details.
 * @param {String} label - The UI label of the tab
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.addTab = function(name, label) { };

/**
 * Returns an nlobjButton object by name
 * @param {String} buttonId - The internal ID of the button. Internal IDs must be in lowercase and contain no spaces.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.getButton = function(buttonId) { };

/**
 * Returns an nlobjField object by name
 * @param {String} name - The internal ID name of the field. Internal ID names must be in lowercase and contain no spaces.
 * @param {String} radio   - If this is a radio field, specify which radio field to return based on the radio value.
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.getField = function(name, radio) { };

/**
 * Returns an nlobjSubList object by name
 * @param {String} name - The internal ID name of the sublist. Internal ID names must be in lowercase and contain no spaces.
 * @returns {nlobjSubList} nlobjSubList
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.getSubList = function(name) { };

/**
 * Returns an nlobjTab object by name
 * @param {String} name - The internal ID name of the subtab. Internal ID names must be in lowercase and contain no spaces.
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.getSubTab = function(name) { };

/**
 * Returns an nlobjTab object by name
 * @param {String} name - The internal ID name of the tab. Internal ID names must be in lowercase and contain no spaces.
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.getTab = function(name) { };

/**
 * Returns an array of nlobjTab objects containing all the tabs in a form.
 * @returns {nlobjTab[]} nlobjTab[]
 * @memberOf nlobjForm
 * @since 2012.2
 */
nlobjForm.prototype.getTabs = function() { };

/**
 * Inserts a field (nlobjField) in front of another field and returns a reference to it
 * @param {nlobjField} field - nlobjField object to insert
 * @param {String} nextfield - The name of the field you are inserting in front of
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.insertField = function(field, nextfield) { };

/**
 * Inserts a sublist (nlobjSubList) in front of another sublist/subtab and returns a reference to it
 * @param {nlobjSubList} sublist - nlobjSubList object to insert
 * @param {String} nextsub - The internal ID name of the sublist/subtab you are inserting in front of
 * @returns {nlobjSubList} nlobjSubList
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.insertSubList = function(sublist, nextsub) { };

/**
 * Inserts a subtab (nlobjTab) in front of another sublist/subtab and returns a reference to it
 * @param {String} subtab - The internal ID name of the subtab. Internal ID names must be in lowercase and contain no spaces.
 * @param {String} nextsub - The name of the sublist/subtab you are inserting in front of
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.insertSubTab = function(subtab, nextsub) { };

/**
 * Inserts a tab (nlobjTab) in front of another tab and returns a reference to it
 * @param {nlobjTab} tab - nlobjTab object to insert
 * @param {String} nexttab - The tab name for the tab you are inserting in front of
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.insertTab = function(tab, nexttab) { };

/**
 * Removes an nlobjButton object. This method can be used on custom buttons and certain built-in NetSuite buttons.
 * @param {String} name - The internal ID of the button to be removed. Internal IDs must be in lowercase and contain no spaces.
 * @returns {Void}
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.removeButton = function(name) { };

/**
 * Sets the values of multiple fields on the current form. This API can be used in beforeLoad scripts to initialize field scripts on new records or non-stored fields.
 * @param {Object} values - An object containing name/value pairs, which maps field names to field values
 * @returns {Void}
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.setFieldValues = function(values) { };

/**
 * Sets the Client SuiteScript file used for this form
 * @param {String} scriptId - String or number. The scriptId or internal ID for the global client script used to enable Client SuiteScript on this form
 * @returns {Void}
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.setScript = function(scriptId) { };

/**
 * Sets the title for this form
 * @param {String} title - The title used for this form
 * @returns {Void}
 * @memberOf nlobjForm
 * @since 2008.2
 */
nlobjForm.prototype.setTitle = function(title) { };

/**
 * @returns {Boolean} for merge duplicate records, will always returns false
 * @memberOf nlobjFuture
 * @since 2013.1
 */
nlobjFuture.prototype.isCancelled = function() { };

/**
 * @returns {Boolean} True if job has finished
 * @memberOf nlobjFuture
 * @since 2013.1
 */
nlobjFuture.prototype.isDone = function() { };

/**
 * @returns {nlobjDuplicateJobRequest} nlobjDuplicateJobRequest
 * @memberOf nlobjJobManager
 * @since 2013.1
 */
nlobjJobManager.prototype.createJobRequest = function() { };

/**
 * Use to return a nlobjFuture object. Then use the methods on the nlobFuture object to check the status of the job. Note that a call to getFuture() costs 5 governance units.
 * @returns {nlobjFuture} nlobjFuture
 * @memberOf nlobjJobManager
 * @since 2013.1
 */
nlobjJobManager.prototype.getFuture = function() { };

/**
 * Use to submit your job request. When submitting a "merge duplicates" job, the maximum size of your job can be 200 record.
 * Be aware that submitting a job places the job into the NetSuite work queue for processing. Submitting a job does not mean that the job is executed right away.
 * @param {nlobjDuplicateJobRequest} nlobjDuplicateJobRequest  [required] - The job you want to submit
 * @returns {String} The jobID is returned if the job is successfully submitted
 * @memberOf nlobjJobManager
 * @since 2013.1
 */
nlobjJobManager.prototype.submit = function(nlobjDuplicateJobRequest) { };

/**
 * Adds an nlobjButton object to the footer of the page
 * @param {String} name - The internal ID name of the button. Internal ID names must be in lowercase and contain no spaces. For example, if you add a button that appears on the UI as Update Order, the internal ID should be something equivalent to updateorder.
 * @param {String} label - The UI label used for this button
 * @param {String} script [optional] - The onclick button script function name
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.addButton = function(name, label, script) { };

/**
 * Adds an nlobjColumn object to a list and returns a reference to this column
 * @param {String} name - The internal ID name of this column. Note that internal ID names must be in lowercase and contain no spaces.
 * @param {String} type - The field type for this column
 * @param {String} label - The UI label for this column
 * @param {String} align [optional] - The layout justification for this column. Possible values include:
 * <br> - center
 * <br> - right
 * <br> - left (default)
 * @returns {nlobjColumn} nlobjColumn
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.addColumn = function(name, type, label, align) { };

/**
 * Adds an Edit or Edit/View column to Portlets (created with the nlobjPortlet object) and Suitelet and Portlet lists (created with the nlobjList object). Note that the Edit or Edit/View column will be added to the left of a previously existing column.
 * <br>This figure shows Edit|View links added to a Portlet. These links appear to the left of the Due Date column.
 * @param {nlobjColumn} column - An nlobjColumn object to the left of which the Edit/View column will be added
 * @param {Boolean} showView [optional] - If true then an Edit/View column will be added. Otherwise only an Edit column will be added.
 * @param {Boolean} showHrefCol [optional] - If set, this value must be included in row data provided for the list and will be used to determine whether the URL for this link is clickable (specify T for clickable, F for non-clickable)
 * @returns {nlobjColumn} nlobjColumn
 * @memberOf nlobjList
 * @since 2008.1
 */
nlobjList.prototype.addEditColumn = function(column, showView, showHrefCol) { };

/**
 * Adds a navigation cross-link to the list page
 * @param {String} type - The type of navbar link to add. Use any of the following types:
 * <br> - breadcrumb - appears on top-left corner after system bread crumbs
 * <br> - crosslink - appears on top-right corner
 * @param {String} title - The UI text displayed in the link
 * @param {String} url - The URL used for this link
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.addPageLink = function(type, title, url) { };

/**
 * Adds a row (Array of name/value pairs or nlobjSearchResult) to this portlet.
 * @param {nlobjSearchResult} row - Object or nlobjSearchResult. An object containing name/value pairs containing the values for corresponding nlobjColumn objects in this list or an nlobjSearchResult. Note that several special fields: recordtype, id, and fieldname_display (UI display value for select fields) are automatically added for each search result.
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.addRow = function(row) { };

/**
 * Adds multiple rows (Array of nlobjSearchResult objects or name/value pair Arrays) to a portlet.
 * @param {Object[]} rows - An Array of objects containing name/value pairs containing column values for multiple rows or an Array of nlobjSearchResult objects containing the results of a search with columns matching the columns on the list.
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.addRows = function(rows) { };

/**
 * Sets the Client SuiteScript used for this page.
 * @param {String} scriptId - String or number. ScriptId or internal ID for global client script used to enable Client SuiteScript on page
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.setScript = function(scriptId) { };

/**
 * Sets the display style for this list
 * @param {String} style - The display style value. Use any of the following styles:
 * <br> - grid
 * <br> - report
 * <br> - plain
 * <br> - normal
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.setStyle = function(style) { };

/**
 * Sets the title for this list
 * @param {String} title - The title for a list
 * @returns {Void}
 * @memberOf nlobjList
 * @since 2008.2
 */
nlobjList.prototype.setTitle = function(title) { };

/**
 * Sets the logged-in user's email address to a new one.
 * @param {String} currentPassword  [required] - The current password of the logged-in user. If a valid value is not specified, an error will be thrown.
 * @param {String} newEmail  [required] - The new email address for the logged-in user. If a valid value is not specified, an error will be thrown.
 * @param {Boolean} justThisAccount  [optional] - If not set, this argument defaults to true. If set to true, the email address change is applied only to roles within the current account. If set to false, the email address change is applied to all accounts and roles.
 * @returns {Void}
 * @memberOf nlobjLogin
 * @since 2012.2
 */
nlobjLogin.prototype.changeEmail = function(currentPassword, newEmail, justThisAccount) { };

/**
 * Sets the logged-in user's password to a new one.
 * @param {String} currentPassword  [required] - The current password of the logged-in user. If a valid value is not specified, an error will be thrown.
 * @param {String} newPassword  [required] - The new password for the logged-in user. If a valid value is not specified, an error will be thrown.
 * @returns {Void}
 * @memberOf nlobjLogin
 * @since 2012.2
 */
nlobjLogin.prototype.changePassword = function(currentPassword, newPassword) { };

/**
 * Get the column alias.
 * @returns {String} The column alias.
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.getAlias = function() { };

/**
 * Get the column label.
 * @returns {String} Column label
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.getLabel = function() { };

/**
 * Get the parent column.
 * @returns {nlobjPivotColumn} nlobjPivotColumn - Null if it does not exist
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.getParent = function() { };

/**
 * Get the summary line.
 * @returns {nlobjPivotColumn} nlobjPivotColumn - Summary line if it exists, otherwise null
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.getSummaryLine = function() { };

/**
 * Get the value of the column.
 * @returns {Object} The value of this column
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.getValue = function() { };

/**
 * Get any defined children columns.
 * @returns {nlobjPivotColumn[]} nlobjPivotColumn[] - Null if no children columns exist
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.getVisibleChildren = function() { };

/**
 * Checks if the column is hidden.
 * @returns {Boolean} True if the column is hidden
 * @memberOf nlobjPivotColumn
 * @since 2012.2
 */
nlobjPivotColumn.prototype.isHidden = function() { };

/**
 * Get the row alias.
 * @returns {String} The row alias.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.getAlias = function() { };

/**
 * Get the children rows if there are any.
 * @returns {nlobjPivotRow[]} nlobjPivotRow[] - Null if the row is a detail line or if there are no children.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.getChildren = function() { };

/**
 * Get the row label.
 * @returns {String} The row label.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.getLabel = function() { };

/**
 * Get the parent row if it exists.
 * @returns {nlobjPivotRow} nlobjPivotRow - Null if the row does not exist.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.getParent = function() { };

/**
 * Get the summary line from the report.
 * @returns {nlobjPivotRow} nlobjPivotRow - Null if the row is a detail line.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.getSummaryLine = function() { };

/**
 * Get the value of the row/column combination.
 * @param {nlobjPivotColumn} pivotColumn - The pivot column.
 * @returns {Object} The value of the row/column combination, or null if isDetailLine returns false.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.getValue = function(pivotColumn) { };

/**
 * Check if the row is a detail line.
 * @returns {Boolean} True if the row is a detail line.
 * @memberOf nlobjPivotRow
 * @since 2012.2
 */
nlobjPivotRow.prototype.isDetailLine = function() { };

/**
 * Get the column hierarchy.
 * @returns {nlobjPivotColumn} nlobjPivotColumn
 * @memberOf nlobjPivotTable
 * @since 2012.2
 */
nlobjPivotTable.prototype.getColumnHierarchy = function() { };

/**
 * Get the row hierarchy.
 * @returns {nlobjPivotRow} nlobjPivotRow
 * @memberOf nlobjPivotTable
 * @since 2012.2
 */
nlobjPivotTable.prototype.getRowHierarchy = function() { };

/**
 * Get the pivot table object from the report definition.Note: This is a blocking call and it will wait until the report definition execution has finished. Using isReady() is recommended to check execution state if blocking is unacceptable.
 * @returns {nlobjPivotTable} nlobjPivotTable
 * @memberOf nlobjPivotTableHandle
 * @since 2012.2
 */
nlobjPivotTableHandle.prototype.getPivotTable = function() { };

/**
 * Returns the completion status flag of the report definition execution.
 * @returns {Boolean} True if the execution has finished.
 * @memberOf nlobjPivotTableHandle
 * @since 2012.2
 */
nlobjPivotTableHandle.prototype.isReady = function() { };

/**
 * Adds an nlobjColumn object to a list and returns a reference to this column. Note that this API is only available if the portlet type is a LIST type.
 * @param {String} name - The internal ID name of this column. Internal ID names must be in lowercase and contain no spaces.
 * @param {String} type - The field type for this column
 * @param {String} label - The UI label for this column
 * @param {String} just [optional] - The layout justification for this column. Use any of the following layout types:
 * <br> - center
 * <br> - right
 * <br> - left - (default)
 * @returns {nlobjColumn} nlobjColumn
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.addColumn = function(name, type, label, just) { };

/**
 * Adds an Edit or Edit|View column to LIST portlets (see figure). This method can also be used with nlobjList when creating Suitelet lists and portlet lists. Note that the Edit or Edit|View column will be added to the left of a previously existing column.
 * <br>The following figure shows Edit|View links added to a portlet. These links appear to the left of the Due Date column.
 * @param {nlobjColumn} column - An nlobjColumn object to the left of which the Edit|View column will be added
 * @param {Boolean} showView [optional] - If true then an Edit|View column will be added. Otherwise only an Edit column will be added.
 * @param {String} showHrefCol [optional] - If set, this value must be included in row data provided for the list and will be used to determine whether the URL for this link is clickable (specify T for clickable, F for non-clickable)
 * @returns {nlobjColumn} nlobjColumn
 * @memberOf nlobjPortlet
 * @since 2008.1
 */
nlobjPortlet.prototype.addEditColumn = function(column, showView, showHrefCol) { };

/**
 * Adds an nlobjField object to a portlet and returns a reference to it.
 * <br>This API is only available if the portlet type is FORM.
 * @param {String} name - The internal ID name of this field. Internal ID names must be in lowercase and contain no spaces.
 * @param {String} type - The field type for this field. Use any of the following fields types:
 * <br> - text
 * <br> - email
 * <br> - phone
 * <br> - date
 * <br> - currency
 * <br> - float
 * <br> - integer
 * <br> - checkbox
 * <br> - select
 * <br> - url
 * <br> - timeofday
 * <br> - textarea
 * <br> - percent
 * @param {String} label - The UI label for this field
 * @param {String} source [optional] - String or number. The internalId or scriptId of the source list for this field if it's a select (List/Record) field, or radio value for radio fields.
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.addField = function(name, type, label, source) { };

/**
 * Adds a line (containing text or simple HTML) with optional indenting and URL to a LINKS portlet.
 * <br>This API is only available if the portlet type is LINKS.
 * @param {String} text - Content written to this line (can contain simple HTML formatting)
 * @param {String} url [optional] - URL if this line should be clickable (if NULL then line will not be clickable)
 * @param {Number} indent [optional] - Indent level used for this line. Valid values are 0 to 5.
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.addLine = function(text, url, indent) { };

/**
 * Adds a row (nlobjSearchResult) or Array of name/value pairs) to a LIST portlet.
 * <br>This API is only available if the portlet type is LIST.
 * @param {nlobjSearchResult} row - Object or nlobjSearchResult. An object containing name/value pairs containing the values for corresponding nlobjColumn objects in this list or an nlobjSearchResult. Note that several special fields: recordtype, id, and fieldname_display (display value for select fields) are automatically added for each search result.
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.addRow = function(row) { };

/**
 * Adds multiple rows (Array of nlobjSearchResult objects or name/value pair Arrays) to a LIST portlet.
 * <br>This API is only available if the portlet type is LIST.
 * @param {Object[]} rows - An Array of objects containing name/value pairs containing column values for multiple rows or an Array of nlobjSearchResult objects containing the results of a search with columns matching the columns on the list.
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.addRows = function(rows) { };

/**
 * Sets the entire content of an HTML portlet (content will be placed inside <TD>...</TD> tags).
 * <br>This API is only available if the portlet type is HTML.
 * @param {String} html - Raw HTML containing the contents of an HTML portlet. The content must start and end with a TD tag.
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.setHtml = function(html) { };

/**
 * Sets the regular interval when a FORM portlet automatically refreshes itself.
 * <br>This API is only available if the portlet type is FORM.
 * @param {Number} n - Number of seconds. In production mode, this value must be at least 60 seconds. An error is raised if this value is less than zero, and in production if it is less than 60.
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2011.1
 */
nlobjPortlet.prototype.setRefreshInterval = function(n) { };

/**
 * Sets the client-side script for a FORM portlet. For example, you can use this method to call a script to implement client-side validation, dynamically calculate field totals, and change data based on the value of another field. Note that you can only set one script. Setting another script implicitly removes the previous script.
 * <br>This API is only available if the portlet type is FORM.
 * @param {String} scriptId - String or number. The script internalId or custom scriptId of a record-level client script. Scripts of this type are deployed globally and run against an entire record type. For more information, see Form-level and Record-level Client Scripts.
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2011.1
 */
nlobjPortlet.prototype.setScript = function(scriptId) { };

/**
 * Adds a SUBMIT button with an optional custom label to this FORM portlet.
 * <br>This API is only available if the portlet type is a FORM type.
 * @param {String} url - The URL that the FORM will be POST-ed to when the user clicks this submit button
 * @param {String} label [optional] - The UI label used for displaying this button. If a value is not specified, the default value is Save.
 * @param {String} target [optional] - The target attribute of the portlet's FORM element, if it is different from the portlet's own embedded iframe. Supported values include standard HTML target attributes such as '_top', '_parent', and '_blank', frame names, and the special NetSuite-specific identifier '_hidden'.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.setSubmitButton = function(url, label, target) { };

/**
 * Sets the portlet title
 * @param {String} title - The title used for this portlet
 * @returns {Void}
 * @memberOf nlobjPortlet
 * @since 2008.2
 */
nlobjPortlet.prototype.setTitle = function(title) { };

/**
 * Use this method to commit the current line in a sublist.
 * @param {String} group - The sublist internal ID
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.commitLineItem = function(group) { };

/**
 * Returns a nlobjSubrecord object. Use this API to create a subrecord from a sublist field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * <br>Also see Working with Subrecords in SuiteScript for general information on working with subrecords in NetSuite.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.createCurrentLineItemSubrecord = function(subListType, fldName) { };

/**
 * Returns a nlobjSubrecord object. Use this API to create a subrecord from a body field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.createSubrecord = function(fldName) { };

/**
 * Returns a nlobjSubrecord object. Use this API to edit a subrecord from a sublist field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.editCurrentLineItemSubrecord = function(subListType, fldName) { };

/**
 * Returns a nlobjSubrecord object. Use this API to edit a subrecord from a body field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.editSubrecord = function(fldName) { };

/**
 * Use this method to return the line number of a particular price in a given column. If the value is present on multiple lines, it will return the line item of the first line that contains the value.
 * <br>Use this API on a matrix sublists only.
 * <br>Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field
 * @param {Number} column - The column number for this field. Column numbers start at 1, not 0.
 * @param {String} val - The value of the field
 * @returns {Number} The line number (as an integer) of a specified matrix field
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.findLineItemMatrixValue = function(group, fldName, column, val) { };

/**
 * Use this API to return the line number for the first occurrence of a field value in a sublist column. This API can be used on any sublist type that supports SuiteScript (editor, inline editor, and list sublists).
 * @param {String} group - The sublist internal ID
 * @param {String} fldName - The field internal ID
 * @param {String} value - The value of the field
 * @returns {Number} The line number (as an integer) of a specific sublist field
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.findLineItemValue = function(group, fldName, value) { };

/**
 * Returns a normal keyed array of all the fields on a record. Note that the number of fields returned will differ when you call getAllFields() on the edit of a record vs. on the xedit of a record. For details, see these topics:
 * <br>- Inline Editing and nlapiGetNewRecord()
 * <br>- Inline Editing and nlapiGetOldRecord()
 * <br>- What's the Difference Between xedit and edit User Event Types?
 * @returns {String[]} String[] of all field names on the record
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.getAllFields = function() { };

/**
 * Returns an array of all the field names of a sublist on this record
 * @param {String} group - The sublist internal ID
 * @returns {String[]} String[] of sublist field names
 * @memberOf nlobjRecord
 * @since 2008.2
 */
nlobjRecord.prototype.getAllLineItemFields = function(group) { };

/**
 * Returns the value of a datetime field on the currently selected line of a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then returned. If timeZone is not passed in, the datetime value is returned in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. This field ID must point to a datetime formatted field.
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table. If this argument is not supplied, the time zone will default to the time zone set in user preferences.
 * @returns {String} The string value of a datetime field on the currently selected line.
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
nlobjRecord.prototype.getCurrentLineItemDateTimeValue = function(type, fieldId, timeZone) { };

/**
 * Use this API to get the value of the currently selected matrix field. This API should be used on matrix sublists only.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field being set.
 * @param {Number} column - The column number for this field. Column numbers start at 1, not 0.
 * @returns {String} The string value of a field on the currently selected line in a matrix sublist. Returns null if the field does not exist.
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getCurrentLineItemMatrixValue = function(group, fldName, column) { };

/**
 * Returns the values of a multiselect sublist field on the currently selected line. One example of a multiselect sublist field is the Serial Numbers field on the Items sublist.
 * This function is not supported in client SuiteScript. It is meant to be used in user event scripts.
 * @param {String} type - The sublist internal ID (for example, use addressbook as the ID for the Address sublist). In the NetSuite Help Center, see for a list of sublists that support SuiteScript, sublist internal IDs, and sublist field IDs.
 * @param {String} fldnam - The name of the multiselect field
 * @returns {Array} An array of string values for the multiselect sublist field
 * @since 2012.1
 */
nlobjRecord.prototype.getCurrentLineItemValues = function(type, fldnam) { };

/**
 * Returns the value of a datetime field. If timeZone is passed in, the datetime value is converted to that time zone and then returned. If timeZone is not passed in, the datetime value is returned in the default time zone.
 * @param {String} fieldId — The internal field ID. This field ID must point to a datetime formatted field.
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {String} The string value of a datetime field.
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
nlobjRecord.prototype.getDateTimeValue = function(fieldId, timeZone) { };

/**
 * Returns field metadata for a field
 * @param {String} fldName - The internal ID of the field
 * @returns {nlobjField} The nlobjField object
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.getField = function(fldName) { };

/**
 * Returns the UI display value for a select field. This method is supported on select fields only.
 * <br>Restriction: only supported for select fields
 * @param {String} name - The internal ID of the field
 * @returns {String} String UI display value corresponding to the current selection for a select field. Returns null if field does not exist on the record or if the field is restricted.
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.getFieldText = function(name) { };

/**
 * Returns the UI display values for a multi-select field. This method is supported on multi-select fields only.
 * <br>Restriction: only supported for multi-select fields
 * @param {String} name - The internal ID of the multiselect field
 * @returns {String[]} String[] - Returns the selected text values of a multi-select field
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.getFieldTexts = function(name) { };

/**
 * Returns the value of a field.
 * <br>Note that NetSuite recommends you read the topic Getting Field Values in SuiteScript, which addresses the rare instances in which the value returned by this API is inconsistent.
 * @param {String} name - The internal ID of the field whose value is being returned.
 * @returns {String} The internal ID (string) value for the field
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.getFieldValue = function(name) { };

/**
 * Returns a read-only array of multi-select field values
 * @param {String} name - The name of the field whose value is being returned
 * @returns {String[]} String[] of field IDs. Returns null if field is not on the record.
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.getFieldValues = function(name) { };

/**
 * Use this method to get the internal ID of a record or NULL for new records.
 * @returns {Number} Integer value of the record ID
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.getId = function() { };

/**
 * Returns the number of lines on a sublist
 * <br>Important: The first line number on a sublist is 1 (not 0).
 * @param {String} group - The sublist internal ID
 * @returns {Number} The integer value of the number of line items on a sublist
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getLineItemCount = function(group) { };

/**
 * Returns the value of a datetime field on a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then returned. If timeZone is not passed in, the datetime value is returned in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {Number} lineNum — The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {String} The string value of a datetime field on a sublist.
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
nlobjRecord.prototype.getLineItemDateTimeValue = function(type, fieldId, lineNum, timeZone) { };

/**
 * Returns field metadata for a line item (sublist) field
 * @param {String} group - The sublist internal ID
 * @param {String} fldName - The internal ID of the line item field
 * @param {Number} line - The line number this field is on. Note the first line number on a sublist is 1 (not 0). Only settable for sublists of type list.
 * @returns {nlobjField} An nlobjField object
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.getLineItemField = function(group, fldName, line) { };

/**
 * Use this API to obtain metadata for a field that appears in a matrix sublist.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the field (line) whose value you want returned.
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {Number} column - The column number for this field. Column numbers start at 1, not 0.
 * @returns {nlobjField} An nlobjField object representing this sublist field. Returns null if the field you have specified does not exist.
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getLineItemMatrixField = function(group, fldName, line, column) { };

/**
 * Use this API to get the value of a matrix field that appears on a specific line in a specific column. This API can be used only in the context of a matrix sublist.
 * <br>Note: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field whose value you want returned.
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {Number} column - The column number for this field. Column numbers start at 1 (not 0).
 * @returns {String} The string value of the matrix field
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getLineItemMatrixValue = function(group, fldName, line, column) { };

/**
 * Returns the display name of a select field (based on its current selection) in a sublist
 * @param {String} group - The sublist internal ID
 * @param {String} fldName - The name of the field/line item being set
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} String - The string UI display value corresponding to the current selection for a line item select field. Returns null if field does not exist on the record or the field is restricted.
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.getLineItemText = function(group, fldName, line) { };

/**
 * Returns the value of a sublist line item field.
 * <br>Note that NetSuite recommends you read the topic Getting Field Values in SuiteScript, which addresses the rare instances in which the value returned by this API is inconsistent.
 * <br>Tip: Normally custom transaction column fields that are not checked to show on a custom form are not available to get/setLineItemValue APIs. However, if you set them to show, but then set the label to empty, they will be available on the form but will not appear on the sublist. Note this does not apply to fields that are marked as Hidden on the custom field definition. These fields are always available on every form.
 * @param {String} group - The sublist internal ID
 * @param {String} name - The name of the sublist field whose value is being returned
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} The string value of the sublist field name
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.getLineItemValue = function(group, name, line) { };

/**
 * Returns the values of a multiselect sublist field on a selected line. One example of a multiselect sublist field is the Serial Numbers field on the Items sublist.
 * <br>This function is not supported in client SuiteScript. It is meant to be used in user event scripts.
 * @param {String} group - The sublist internal ID
 * @param {String} name - The internal ID of the multiselect field
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String[]} An array of string values for the multiselect sublist field
 * @memberOf nlobjRecord
 * @since 2012.1
 */
nlobjRecord.prototype.getLineItemValues = function(group, name, line) { };

/**
 * Use this API in a matrix sublist to get the number of columns for a specific matrix field.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>Note: The first column in a matrix is 1, not 0.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The field internal ID of the matrix field.
 * @returns {Number} The integer value for the number of columns of a specified matrix field
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getMatrixCount = function(group, fldName) { };

/**
 * Use this API to get field metadata for a matrix "header" field in a matrix sublist.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>For example, if the Quantity Pricing feature is enabled in your account, you will see the Qty fields at the top of the pricing matrix. The Qty fields are considered to be the header fields in the pricing matrix.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix header field.
 * @param {Number} column - The column number for this field. Column numbers start at 1 (not 0).
 * @returns {nlobjField} nlobjField object
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getMatrixField = function(group, fldName, column) { };

/**
 * Use this API to get the value of a matrix "header" field in a matrix sublist.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>For example, if the Quantity Pricing feature is enabled in your account, you will see the Qty fields at the top of the pricing matrix. The Qty fields are considered to be the header fields in the pricing matrix.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix header field.
 * @param {Number} column - The column number for this field. Column numbers start at 1 (not 0).
 * @returns {String} The string value of a matrix header field
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.getMatrixValue = function(group, fldName, column) { };

/**
 * Returns the record type (for example assemblyunbuild would be returned for the Assembly Unbuild record type; salesorder would be returned for the Sales Order record type).
 * @returns {String} The string value of the record name internal ID
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.getRecordType = function() { };

/**
 * Inserts a new line into a sublist. This function is only supported for edit sublists (inlineeditor, editor). Note, however, this API will work on list sublists that have been added via the UI object nlobjSubList
 * @param {String} group - The sublist internal ID
 * @param {Number} line - Line index at which to insert the line. Note that in sublists, the first line number is 1 (not 0). If the number is greater than the number of lines on the sublist, an error is returned.
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.insertLineItem = function(group, line) { };

/**
 * Returns a nlobjSubrecord object. Use this API to remove a subrecord from a sublist field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.removeCurrentLineItemSubrecord = function(subListType, fldName) { };

/**
 * Use this method to remove an existing line from a sublist.
 * @param {String} subListType - The sublist internal ID
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.removeLineItem = function(subListType, line) { };

/**
 * Returns a nlobjSubrecord object. Use this API to remove a subrecord from a body field on the parent record.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.removeSubrecord = function(fldName) { };

/**
 * Use this method to select an existing line in a sublist.
 * @param {String} group - The sublist internal ID
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.selectLineItem = function(group, line) { };

/**
 * Use this method to insert and select a new line in a sublist.
 * @param {String} group - The sublist internal ID
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.selectNewLineItem = function(group) { };

/**
 * Sets the value of a datetime field on the currently selected line of a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then set. If timeZone is not passed in, the datetime value is set in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {String} dateTime — The date and time in format mm/dd/yyyy hh:mm:ss am|pm (for example, '09/25/2013 06:00:01 am').
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {Void}
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
nlobjRecord.prototype.setCurrentLineItemDateTimeValue = function(type, fieldId, dateTime, timeZone) { };

/**
 * Use this API to set the value of a given matrix sublist field. Also note that it should be used on matrix sublists only.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The internal ID of the matrix field.
 * @param {Number} column - The column number for this field. Column numbers start at 1 (not 0).
 * @param {String} value - String or number. The value the field is being set to.
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.setCurrentLineItemMatrixValue = function(group, fldName, column, value) { };

/**
 * Use this method to set the value of a sublist line item field.
 * @param {String} group - The sublist internal ID
 * @param {String} name - The name of the field being set
 * @param {String} value - The value the field is being set to. Note: Check box fields take the values of T or F, not true or false.
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.setCurrentLineItemValue = function(group, name, value) { };

/**
 * Sets the value of a datetime field. If timeZone is passed in, the datetime value is converted to that time zone and then set. If timeZone is not passed in, the datetime value is set in the default time zone.
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {String} dateTime — The date and time in format mm/dd/yyyy hh:mm:ss am|pm (for example, '09/25/2013 06:00:01 am').
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {Void}
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
nlobjRecord.prototype.setDateTimeValue = function(fieldId, dateTime, timeZone) { };

/**
 * Sets the value of a select field using its corresponding display value
 * <br>Restriction: only supported for select fields
 * @param {String} name - The internal ID of the field being set
 * @param {String} text - The display value corresponding to the value the field is being set to
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.setFieldText = function(name, text) { };

/**
 * Sets the values for a multiselect field from their display values
 * <br>Restriction: only supported for multi-select fields
 * @param {String} name - The internal ID of the field being set
 * @param {String[]} texts - The display values corresponding to the values the field is being set to
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.1
 */
nlobjRecord.prototype.setFieldTexts = function(name, texts) { };

/**
 * Sets the value of a field
 * @param {String} name - The name of the field being set
 * @param {String} value - The value the field is being set to
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.setFieldValue = function(name, value) { };

/**
 * Sets the value of a multi-select field
 * @param {String} name - The name of the field being set
 * @param {String[]} value - String array containing field values
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.setFieldValues = function(name, value) { };

/**
 * Sets the value of a datetime field on a sublist. If timeZone is passed in, the datetime value is converted to that time zone and then set. If timeZone is not passed in, the datetime value is set in the default time zone.
 * @param {String} type — The internal sublist ID
 * @param {String} fieldId — The internal field ID. The field ID passed in must point to a datetime formatted field.
 * @param {Number} lineNum — The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {String} dateTime — The date and time in format mm/dd/yyyy hh:mm:ss am|pm (for example, '09/25/2013 06:00:01 am').
 * @param {String} timeZone [optional] — (String, Number) If a string is passed in, it must match one of the Olson Values listed in the table (values are case-insensitive). If an integer is passed in, it must match one of the Key values listed in the table.
 * @returns {Void}
 * @throws SSS_INVALID_ARG_TYPE
 * @since 2013.2
 */
nlobjRecord.prototype.setLineItemDateTimeValue = function(type, fieldId, lineNum, dateTime, timeZone) { };

/**
 * Sets the value of a sublist line item.
 * <br>Tip: Normally custom transaction column fields that are not checked to show on a custom form are not available to get/setLineItemValue APIs. However, if you set them to show, but then set the label to empty, they will be available on the form but will not appear on the sublist. Note this does not apply to fields that are marked as Hidden on the custom field definition. These fields are always available on every form.
 * @param {String} group - The sublist internal ID
 * @param {String} name - The name of the field being set
 * @param {Number} line - The line number for this field. Note the first line in a sublist is 1 (not 0).
 * @param {String} value - The value the field is being set to. If a valid value is not specified an error will be thrown.
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2008.1
 */
nlobjRecord.prototype.setLineItemValue = function(group, name, line, value) { };

/**
 * This API is used to set a header field in a matrix sublist. Also note that this API should be used on matrix sublists only.
 * <br>Important: Currently the Pricing sublist is the only matrix sublist type that supports SuiteScript.
 * <br>In the case of the Pricing sublist, this API is used to set the quantity levels that appear in the Qty fields. Note that you should use this API only if you have the Quanity Pricing feature enabled in your account, as these header fields appear only if this feature is enabled.
 * @param {String} group - The sublist internal ID.
 * @param {String} fldName - The name of the field being set.
 * @param {Number} column - The column number for this field. Column numbers start at 1 (not 0).
 * @param {String} value - The value the field is being set to. Note: Check box fields take the values of T or F, not true or false.
 * @returns {Void}
 * @memberOf nlobjRecord
 * @since 2009.2
 */
nlobjRecord.prototype.setMatrixValue = function(group, fldName, column, value) { };

/**
 * Returns a nlobjSubrecord object. Use this API to view a subrecord from a sublist field on the parent record. Calling this API analogous to doing a "get" on a subrecord, however, the nlobjSubrecord object returned is in read-only mode. Therefore, an error is thrown if you attempt to edit a subrecord returned by this API.
 * <br>You can call this API when you want your script to read the nlobjSubrecord object of the current sublist line you are on.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.viewCurrentLineItemSubrecord = function(subListType, fldName) { };

/**
 * Returns a nlobjSubrecord object. Use this API to view a subrecord from a sublist field on the parent record. Calling this API analogous to doing a "get" on a subrecord, however, the nlobjSubrecord object returned is in read-only mode. Therefore, an error is thrown if you attempt to edit a subrecord returned by this function.
 * <br>You can call this API when you want to read the value of a line you are not currently on. For example, if you are editing line 2, you can call this API on line 1 to get the value of line 1.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} subListType - The sublist internal ID on the parent record (for example, use item as the ID for the Items sublist).
 * @param {String} fldName - The internal ID of the "subrecord field" on the sublist of the parent record (for example, inventorydetail as the ID for the Inventory Details sublist field).
 * @param {Number} linenum - The line number for the sublist field. Note the first line number on a sublist is 1 (not 0).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.viewLineItemSubrecord = function(subListType, fldName, linenum) { };

/**
 * Returns a nlobjSubrecord object. Use this API to view a subrecord from a body field on the parent record. Calling this API analogous to doing a "get" on a subrecord, however, the nlobjSubrecord object returned is in read-only mode. Therefore, an error is thrown if you attempt to edit a subrecord returned by this function.
 * <br>This API is currently used only in the context of the Advanced Bin / Numbered Inventory feature.
 * @param {String} fldName - The internal ID of the "subrecord field" on the body of the parent record (for example, inventorydetail as the ID for the Inventory Details body field).
 * @returns {nlobjSubrecord} nlobjSubrecord
 * @memberOf nlobjRecord
 * @since 2011.2
 */
nlobjRecord.prototype.viewSubrecord = function(fldName) { };

/**
 * Get the formula for this column
 * @returns {String} Formula or null if it does not exist.
 * @memberOf nlobjReportColumn
 */
nlobjReportColumn.prototype.getFormula = function() { };

/**
 * Get the parent reference of this column.
 * @returns {nlobjReportColumnHierarchy} The parent reference to the nlobjReportColumnHierarchy object.
 * @memberOf nlobjReportColumn
 */
nlobjReportColumn.prototype.getParent = function() { };

/**
 * Returns the measure flag
 * @returns {Boolean} True if the column is flagged as a measure.
 * @memberOf nlobjReportColumn
 * @since 2012.2
 */
nlobjReportColumn.prototype.isMeasure = function() { };

/**
 * Get the children reference of this column hierarchy.
 * @returns {nlobjReportColumnHierarchy} The child reference to the nlobjReportColumnHierarchy object.
 * @memberOf nlobjReportColumnHierarchy
 * @since 2012.2
 */
nlobjReportColumnHierarchy.prototype.getChildren = function() { };

/**
 * Get the parent reference of this column hierarchy.
 * @returns {nlobjReportColumnHierarchy} Either the parent reference to the nlobjReportColumnHierarchy object or null.
 * @memberOf nlobjReportColumnHierarchy
 * @since 2012.2
 */
nlobjReportColumnHierarchy.prototype.getParent = function() { };

/**
 * Add a column to the report definition.
 * @param {String} alias - The column alias.
 * @param {Boolean} isMeasure - A value of true means that the column is flagged as a measure.
 * @param {String} label - The column label that will be displayed on the report.
 * @param {nlobjReportColumnHierarchy} parent [optional] - The reference to the parent column in the hierarchy. If null, then this column will not be associated with a parent column.
 * @param {String} format - The data type that this column represents.
 * @param {String} formula [optional] - A string which describes a mathematical formula in the format of "F(x,y,z) = mathematical function", where x,y,z are previously defined aliases from addRowHierarchy, addColumnHierarchy, or addColumn calls.
 * @returns {nlobjReportColumn} The reference to the nlobjReportColumn object.
 * @memberOf nlobjReportDefinition
 * @since 2012.2
 */
nlobjReportDefinition.prototype.addColumn = function(alias, isMeasure, label, parent, format, formula) { };

/**
 * Add a column hierarchy to the report definition.
 * @param {String} alias - The column alias.
 * @param {String} label - The column label that will be displayed on the report.
 * @param {nlobjReportColumnHierarchy} parent [optional] - The reference of the parent column in the hierarchy. If null, then this column will be the root (top level) column.
 * @param {String} format - The data type that this column represents.
 * @returns {nlobjReportColumnHierarchy} The reference to the nlobjReportColumnHierarchy object.
 * @memberOf nlobjReportDefinition
 * @since 2012.2
 */
nlobjReportDefinition.prototype.addColumnHierarchy = function(alias, label, parent, format) { };

/**
 * Add a row hierarchy to the report definition.
 * @param {String} alias - The row alias.
 * @param {String} label - The row label that will be displayed on the report.
 * @param {String} format - The data type that this row represents.
 * @returns {nlobjReportRowHierarchy} The reference to the nlobjReportRowHierarchy object.
 * @memberOf nlobjReportDefinition
 * @since 2012.2
 */
nlobjReportDefinition.prototype.addRowHierarchy = function(alias, label, format) { };

/**
 * Attaches a search as a data source to the report definition.
 * @param {String} searchType - The type of records to search.
 * @param {String} id [optional] - The internal id (as a string) if you are using a saved search as a data source.
 * @param {nlobjSearchFilter[]} filters - The array of search filters.
 * @param {nlobjSearchColumn[]} columns - The array of search columns.
 * @param {Object} map - The mapping of rows/columns of the search to the report.
 * @returns {Void}
 * @memberOf nlobjReportDefinition
 * @since 2012.2
 */
nlobjReportDefinition.prototype.addSearchDatasource = function(searchType, id, filters, columns, map) { };

/**
 * Creates the form for rendering from the report definition.
 * @param {nlobjReportForm} form [optional] - The form object created with nlapiCreateReportForm.
 * @returns {nlobjPivotTableHandle} nlobjPivotTableHandle - The identifier of the pivot table handle, or nlobjReportForm.
 * @memberOf nlobjReportDefinition
 * @since 2012.2
 */
nlobjReportDefinition.prototype.executeReport = function(form) { };

/**
 * Sets the title of the report definition.
 * @param {String} title [optional] - The name of the report definition.
 * @returns {Void}
 * @memberOf nlobjReportDefinition
 * @since 2012.2
 */
nlobjReportDefinition.prototype.setTitle = function(title) { };

/**
 * nlobjReportForm object
 * @returns {Void}
 * @memberOf nlobjReportForm
 */
nlobjReportForm.prototype.constructor = function() { };

/**
 * Get the child reference of this row hierarchy.
 * @returns {nlobjReportRowHierarchy} The child reference to the nlobjReportRowHierarchy object.
 * @memberOf nlobjReportRowHierarchy
 * @since 2012.2
 */
nlobjReportRowHierarchy.prototype.getChild = function() { };

/**
 * Get the parent reference of this row hierarchy.
 * @returns {nlobjReportRowHierarchy} Either the parent reference to the nlobjReportRowHierarchy object or null.
 * @memberOf nlobjReportRowHierarchy
 * @since 2012.2
 */
nlobjReportRowHierarchy.prototype.getParent = function() { };

/**
 * Returns an Object containing all the request headers and their values.
 * @returns {String[]} String[] of header names
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getAllHeaders = function() { };

/**
 * Returns an Object containing all the request parameters and their values
 * @returns {String[]} String[] of parameter field names
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getAllParameters = function() { };

/**
 * Returns the body of the POST request
 * @returns {String} The string value of the request body
 * @memberOf nlobjRequest
 * @since 2008.1
 */
nlobjRequest.prototype.getBody = function() { };

/**
 * Returns a file added through the nlobjForm.addField(name, type, label, sourceOrRadio, tab) method. When adding a file field type, you will set the type parameter of 'file'.
 * @param {String} name = The name used in nlobjForm.addField.
 * @returns {nlobjFile} The nlobjFile object.
 * @memberOf nlobjRequest
 * @since 2010.1
 */
nlobjRequest.prototype.getFile = function(name) { };

/**
 * Returns the value of a header in the request
 * @param {String} name - The name of the header
 * @returns {String} The request header as a string
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getHeader = function(name) { };

/**
 * Returns the number of lines in a sublist
 * <br>Important: The first line number on a sublist is 1 (not 0).
 * @param {String} group - The sublist internal ID
 * @returns {Number} The integer value of the number of line items in a sublist
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getLineItemCount = function(group) { };

/**
 * Returns the value of a sublist line item.
 * <br>Tip: Normally custom transaction column fields that are not checked to show on a custom form are not available to get/setLineItemValue APIs. However, if you set them to show, but then set the label to empty, they will be available on the form but will not appear on the sublist. Note this does not apply to fields that are marked as Hidden on the custom field definition. These fields are always available on every form.
 * @param {String} group - The sublist internal ID
 * @param {String} name - The name of the field whose value is returned
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} The string value of the line item
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getLineItemValue = function(group, name, line) { };

/**
 * Returns the METHOD of the request.
 * @returns {String} The string value of the request type. Request types include GET or POST.
 * @memberOf nlobjRequest
 * @since 2008.1
 */
nlobjRequest.prototype.getMethod = function() { };

/**
 * Returns the value of the request parameter
 * @param {String} name - The name of the request parameter whose value is returned
 * @returns {String} The string value of the request parameter
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getParameter = function(name) { };

/**
 * Returns the values of a request parameter as an Array
 * @param {String} name - The name of the request parameter whose value is returned
 * @returns {String[]} String[] of parameter values
 * @memberOf nlobjRequest
 * @since 2008.2
 */
nlobjRequest.prototype.getParameterValues = function(name) { };

/**
 * Returns the full URL of the request
 * @returns {String} The string value of the request URL
 * @memberOf nlobjRequest
 * @since 2008.1
 */
nlobjRequest.prototype.getURL = function() { };

var nlobjResponse = {};
nlobjResponse.prototype.CACHE_DURATION_SHORT='';
nlobjResponse.prototype.CACHE_DURATION_LONG='';

/**
 * Adds a header to the response. If this header has already been set, this will add a new header to the response. Note that all user-defined headers must be prefixed with Custom-Header otherwise an SSS_INVALID_ARG error will be thrown ()
 * @param {String} name - The name of the header
 * @param {String} value - The value used to set header
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.addHeader = function(name, value) { };

/**
 * Returns an Array containing all the headers returned in the response. Only available in the return value of a call to nlapiRequestURL(url, postdata, headers, callback).
 * @returns {String[]} String[] of headers
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.getAllHeaders = function() { };

/**
 * Returns the body returned by the server. Only available in the return value of a call to nlapiRequestURL(url, postdata, headers, callback).
 * @returns {String} The string value of the body
 * @memberOf nlobjResponse
 */
nlobjResponse.prototype.getBody = function() { };

/**
 * Returns the response code returned by the server. Only available in the return value of a call to nlapiRequestURL(url, postdata, headers, callback).
 * @returns {String} The string value of the response code
 * @memberOf nlobjResponse
 */
nlobjResponse.prototype.getCode = function() { };

/**
 * Returns the nlobjError thrown during request. Only available in the return value of call to nlapiRequestURL in Client SuiteScript.
 * @returns {nlobjError} nlobjError
 * @memberOf nlobjResponse
 */
nlobjResponse.prototype.getError = function() { };

/**
 * Returns the value for a header returned in the response. Only available in the return value of a call to nlapiRequestURL(url, postdata, headers, callback).
 * @param {String} name - The header name
 * @returns {String} The string value of the header
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.getHeader = function(name) { };

/**
 * Returns an Array containing all the values for a header returned in the response. This is only available in the return value of a call to nlapiRequestURL.
 * @param {String} name   - The header name
 * @returns {String[]} String[] of header values
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.getHeaders = function(name) { };

/**
 * Sets the redirect URL by resolving to a NetSuite resource. Note that all parameters must be prefixed with custparam otherwise an SSS_INVALID_ARG error will be thrown.
 * <br>Also note that all URLs must be internal unless the Suitelet is being executed in an "Available without Login" context. If this is the case, then within the "Available without Login" (externally available) Suitelet, you can set the type parameter to EXTERNAL and the identifier parameter to the external URL.
 * @param {String} type - The base type for this resource
 * <br> - RECORD - Record Type
 * <br> - TASKLINK - Task Link
 * <br> - SUITELET - Suitelet
 * <br> - EXTERNAL - Custom URL (external) and only available for external Suitelets (i.e. available without login)
 * @param {String} identifier - The primary id for this resource (record type ID for RECORD, scriptId for SUITELET, taskId for tasklink, url for EXTERNAL)
 * @param {String} id [optional] - The secondary id for this resource (record type ID for RECORD, deploymentId for SUITELET)
 * @param {Boolean} editmode [optional] - For RECORD calls, this determines whether to return a URL for the record in edit mode or view mode. If set to true, returns the URL to an existing record in edit mode, otherwise the record is returned in view mode. Important: The values for this parameter can be true or false, not T or F.
 * @param {Object} parameters [optional] - An associative array of additional URL parameters as name/value pairs
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.sendRedirect = function(type, identifier, id, editmode, parameters) { };

/**
 * Sets CDN caching in a generalized, coarse way (caching for a shorter period of time or a longer period of time). There is no ability to invalidate individual assets, so CDN falls into one of two categories:
 *  <br>- This asset may change frequently, so cache it just long enough to protect the servers from load storms (on the order of minutes)
 *  <br>- This asset is not expected to change frequently, so cache it as long as possible. Important: This method is not accessible through a Suitelet. It must be accessed in the context of a shopping SSP.
 * @param {String} type  [required]- Constant value to represent the caching duration:
 * <br> - CACHE_DURATION_SHORT
 * <br> - CACHE_DURATION_LONG
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2013.1
 */
nlobjResponse.prototype.setCDNCacheable = function(type) { };

/**
 * Sets the content type for the custom responses (and an optional file name for binary output). This API is available in Suitelet scripts only.
 * @param {String} type - The content/file type.
 * @param {String} name [optional] - Set the name of the file being downloaded (for example 'foobar.pdf')
 * @param {String} disposition [optional] - Content disposition to use for file downloads. Available values are inline or attachment. If a value is not specified, the parameter will default to attachment. What this means is that instead of a new browser (or Acrobat) launching and rendering the content, you will instead be asked if you want to download and Save the file.
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.setContentType = function(type, name, disposition) { };

/**
 * Allows developers to set character encoding on nlobjResponse content. The default encoding type is UTF-8. Available encoding types are:
 * <br>- UTF-8
 * <br>- windows-1252
 * <br>- ISO-8859-1
 * <br>- GB18030
 * <br>- GB2312
 * <br>- SHIFT_JIS
 * <br>- MacRoman
 * @param {String} type - The type of encoding for the response.
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2013.1
 */
nlobjResponse.prototype.setEncoding = function(type) { };

/**
 * Sets the value of a response header. Note that all user-defined headers must be prefixed with Custom-Header otherwise an SSS_INVALID_ARG or SSS_INVALID_HEADER error will be thrown.
 * <br>Important: This method is available only in Suitelets.
 * @param {String} name - The name of the header
 * @param {String} value - The value used to set header
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.setHeader = function(name, value) { };

/**
 * Write information (text/xml/html) to the response
 * @param {String} output - String or Document object being written
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.write = function(output) { };

/**
 * Write line information (text/xml/html) to the response
 * @param {String} output - String being written
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.writeLine = function(output) { };

/**
 * Generates a page using a page element object (nlobjForm or nlobjList)
 * @param {nlobjForm} pageobject - nlobjForm or nlobjList object. Standalone page object.
 * @returns {Void}
 * @memberOf nlobjResponse
 * @since 2008.2
 */
nlobjResponse.prototype.writePage = function(pageobject) { };

/**
 * Adds a single return column to the search. Note that existing columns on the search are not changed.
 * @param {nlobjSearchColumn} column - The nlobjSearchColumn you want added to the search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.addColumn = function(column) { };

/**
 * Adds multiple return columns to the search. Note that existing columns on the search are not changed.
 * @param {nlobjSearchColumn[]} columns - The nlobjSearchColumn[] you want added to the search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.addColumns = function(columns) { };

/**
 * Adds a single search filter. Note that existing filters on the search are not changed.Note: This method does not accept a search filter expression (Object[]) as parameter. Only a single search filter (nlobjSearchFilter) is accepted.
 * @param {nlobjSearchFilter} filter - The nlobjSearchFilter you want added to the search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.addFilter = function(filter) { };

/**
 * Adds a search filter list. Note that existing filters on the search are not changed.Note: This method does not accept a search filter expression (Object[]) as parameter. Only a search filter list (nlobjSearchFilter[]) is accepted.
 * @param {nlobjSearchFilter[]} filters - The list (array) of zero or more nlobjSearchFilter you want added to the search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.addFilters = function(filters) { };

/**
 * Deletes a given saved search that was created through scripting or through the UI.
 * <br>If you have created a saved search through the UI, you can load the search using nlapiLoadSearch(type, id) and then call deleteSearch() to delete it.
 * <br>In scripting if you have created a search using nlapiCreateSearch(type, filters, columns) and saved the search using the nlobjSearch.saveSearch(title, scriptId), you can then load the search and call deleteSearch() to delete it.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.deleteSearch = function() { };

/**
 * Gets the search return columns for the search.
 * @returns {nlobjSearchColumn[]} nlobjSearchColumn[]
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.getColumns = function() { };

/**
 * Gets the filter expression for the search.
 * @returns {Object[]} Filter expression
 * @memberOf nlobjSearch
 * @since 2012.2
 */
nlobjSearch.prototype.getFilterExpression = function() { };

/**
 * Gets the filters for the search.Note: This method does not return a search filter expression (Object[]). Only a search filter list (nlobjSearchFilter[]) is returned. If you want to get a search filter expression, see getFilterExpression().
 * @returns {nlobjSearchFilter[]} nlobjSearchFilter[]
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.getFilters = function() { };

/**
 * Gets the internal ID of the search. The internal ID is available only when the search is either loaded using nlapiLoadSearch(type, id) or has been saved using nlobjSearch.saveSearch(title, scriptId).
 * <br>If this is an ad-hoc search (created with nlapiCreateSearch(type, filters, columns)), this method will return null.
 * @returns {String} The search ID as a string. Typical return values will be something like 55 or 234 or 87. You will not receive a value such as customsearch_mysearch. Any ID prefixed with customsearch is considered a script ID, not the search's internal system ID.
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.getId = function() { };

/**
 * Gets whether the nlobjSearch has been set as public search.
 * @returns {Boolean} Returns true if the search is public. Returns false if it is not.
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.getIsPublic = function() { };

/**
 * Gets the script ID of the search. The script ID is available only when the search is either loaded using nlapiLoadSearch(type, id) or has been saved using nlobjSearch.saveSearch(title, scriptId).
 * <br>If this is an ad-hoc search (created with nlapiCreateSearch(type, filters, columns)), this method will return null.
 * @returns {String} The script ID of the search as a string. Typical return values will be something like customsearch_mysearch or customsearchnewinvoices. You will not receive values such as 55 or 234 or 87. These are considered internal system IDs assigned by NetSuite when you first save the search.
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.getScriptId = function() { };

/**
 * Returns the record type that the search was based on. This method is helpful when you have the internal ID of the search, but do not know the record type the search was based on.
 * @returns {String} The internal ID name of the record type as a string. For example, if the search was on a Customer record, customer will be returned; if the search was on the Sales Order record type, salesorder will be returned.
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.getSearchType = function() { };

/**
 * Runs an ad-hoc search, returning the results. Be aware that calling this method does NOT save the search. Using this method in conjunction with nlapiCreateSearch(type, filters, columns) allows you to create and run ad-hoc searches that are never saved to the database, much like nlapiSearchRecord(...).
 * <br>Note that this method returns the nlobjSearchResultSet object, which provides you with more flexibility when working with or iterating through your search results. Therefore, you may also want to use runSearch() in conjunction with nlapiLoadSearch(...). By doing so you can load an existing saved search, call runSearch(), and then (if you choose):
 * <br>- retrieve a slice of the search results from anywhere in the result list
 * <br>- paginate through the search results.
 * @returns {nlobjSearchResultSet} nlobjSearchResultSet
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.runSearch = function() { };

/**
 * Saves the search created by nlapiCreateSearch(type, filters, columns).Important: Loading a search and saving it with a different title and/or script ID does not create a new search. It only modifies the title and/or script ID for the existing search.
 * <br>API Governance: 5
 * @param {String} title [optional] - The title you want to give the saved search. Note that title is required when saving a new search, but optional when saving a search that was loaded using nlapiLoadSearch(type, id) or has already been saved by calling saveSearch(title, scriptId) before.
 * @param {String} searchId [optional] - The ID you want to assign to the saved search. All saved search script IDs must be prefixed with customsearch, for example:
 * <br> - 'customsearch_my_new_search'
 * <br> - 'customsearchmynewsearch'
 * @returns {String} The internal ID of the search as a string.
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.saveSearch = function(title, searchId) { };

/**
 * Sets the return columns for this search, overwriting any prior columns. If null is passed in it is treated as if it were an empty array and removes any existing columns on the search.
 * @param {nlobjSearchColumn[]} columns - The nlobjSearchColumn[] you want to set in the search. Passing in null or [] removes all columns from the search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.setColumns = function(columns) { };

/**
 * Sets the search filter expression, overwriting any prior filters. If null is passed in, it is treated as if it was an empty array and removes any existing filters on this search.
 * @param {Object[]} filterExpression The filter expression you want to set in the search. Passing in null or [] removes all filters from the search. A search filter expression is a JavaScript string array of zero or more elements. Each element is one of the following:
 * <br> - Operator - either 'NOT', 'AND', or 'OR'
 * <br> - Filter term
 * <br> - Nested search filter expression
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.2
 */
nlobjSearch.prototype.setFilterExpression = function(filterExpression) { };

/**
 * Sets the filters for this search, overwriting any prior filters. If null is passed in it is treated as if it were an empty array and removes any existing filters on this search.Note: This method does not accept a search filter expression (Object[]) as parameter. Only a search filter list (nlobjSearchFilter[]) is accepted. If you want to set a search filter expression, see setFilterExpression(filterExpression).
 * @param {nlobjSearchFilter[]} filters - The nlobjSearchFilter[] you want to set in the search. Passing in null or [] removes all filters from the search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.setFilters = function(filters) { };

/**
 * Sets whether the search is public or private. By default, all searches created through nlapiCreateSearch(type, filters, columns) are private.
 * @param {Boolean} type - Set to true to designate the search as a public search. Set to false to designate the search as a private search.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.setIsPublic = function(type) { };

/**
 * Acts like nlapiSetRedirectURL(type, identifier, id, editmode, parameters) but redirects end users to a populated search definition page. You can use this method with any kind of search that is held in the nlobjSearch object. This could be:
 * <br>- an existing saved search,
 * <br>- an ad-hoc search that you are building in SuiteScript, or
 * <br>- a search you have loaded and then modified (using addFilter, setFilters, addFilters, addColumn, addColumns, or setColumns) but do not save.
 * <br>Note that this method does not return a URL. It works by loading a search into the session, and then redirecting to a URL that loads the search definition page.
 * <br>This method is supported in afterSubmit user event scripts and in client scripts.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.setRedirectURLToSearch = function() { };

/**
 * Acts like nlapiSetRedirectURL(type, identifier, id, editmode, parameters) but redirects end users to a search results page. You can use this method with any kind of search that is held in the nlobjSearch object. This could be:
 * <br>- an existing saved search,
 * <br>- an ad-hoc search that you are building in SuiteScript, or
 * <br>- a search you have loaded and then modified (using addFilter, setFilters, addFilters, addColumn, addColumns, or setColumns) but do not save.
 * <br>Note that this method does not return a URL. It works by loading a search into the session, and then redirecting to a URL that loads the search results.
 * <br>This method is supported in afterSubmit user event scripts and in client scripts.
 * @returns {Void}
 * @memberOf nlobjSearch
 * @since 2012.1
 */
nlobjSearch.prototype.setRedirectURLToSearchResults = function() { };

//required declaration for code completion to work for "new" syntax
var nlobjSearchColumn = function(name, join, summary) { };

/**
 * Primary object used to encapsulate search return columns.
 * <br>Note that the columns argument in nlapiSearchRecord(type, id, filters, columns) returns a reference to the nlobjSearchColumn object. With the object reference returned, you can then use any of the following nlobSearchColumn methods against your search column results.
 * @param {String} fldName   - The search return column name
 * @param {String} recJoin   - The join id for this search return column
 * @param {String} fldSummary   - The summary type for this column
 * <br> - group
 * <br> - sum
 * <br> - count
 * <br> - avg
 * <br> - min
 * <br> - max
 * @returns {nlobjSearchColumn} nlobjSearchColumn
 * @memberOf nlobjSearchColumn
 * @since 2007.0
 */
nlobjSearchColumn.prototype.constructor = function(fldName, recJoin, fldSummary) { };

/**
 * @returns {String} Returns the formula used for this column as a string
 * @memberOf nlobjSearchColumn
 * @since 2009.1
 */
nlobjSearchColumn.prototype.getFormula = function() { };

/**
 * @returns {String} The function used in this search column as a string
 * @memberOf nlobjSearchColumn
 * @since 2009.1
 */
nlobjSearchColumn.prototype.getFunction = function() { };

/**
 * Returns join id for this search column
 * @returns {String} The join id as a string
 * @memberOf nlobjSearchColumn
 * @since 2008.1
 */
nlobjSearchColumn.prototype.getJoin = function() { };

/**
 * Returns the label used for the search column. Note that ONLY custom labels can be returned using this method.
 * @returns {String} The custom label used for this column as a string
 * @memberOf nlobjSearchColumn
 * @since 2009.1
 */
nlobjSearchColumn.prototype.getLabel = function() { };

/**
 * @returns {String} The name of the search column as a string
 * @memberOf nlobjSearchColumn
 * @since 2008.1
 */
nlobjSearchColumn.prototype.getName = function() { };

/**
 * Returns the sort direction for this column
 * @returns {String}
 * @memberOf nlobjSearchColumn
 * @since 2011.1
 */
nlobjSearchColumn.prototype.getSort = function() { };

/**
 * Returns the summary type (avg, group, sum, count) for this search column.
 * @returns {String} The summary type as a string
 * @memberOf nlobjSearchColumn
 * @since 2008.1
 */
nlobjSearchColumn.prototype.getSummary = function() { };

/**
 * Set the formula used for this column. Name of the column can either be formulatext, formulanumeric, formuladatetime, formulapercent, or formulacurrency.
 * @param {String} formula - The formula used for this column
 * @returns {nlobjSearchColumn} nlobjSearchColumn
 * @memberOf nlobjSearchColumn
 * @since 2011.1
 */
nlobjSearchColumn.prototype.setFormula = function(formula) { };

/**
 * Sets the special function used for this column.
 * @param {String} functionid - Special function used for this column. The following is a list of supported functions and their internal IDs:
 * @returns {nlobjSearchColumn} nlobjSearchColumn
 * @memberOf nlobjSearchColumn
 * @since 2011.1
 */
nlobjSearchColumn.prototype.setFunction = function(functionid) { };

/**
 * Set the label used for this column.
 * @param {String} label - The label used for this column
 * @returns {nlobjSearchColumn} nlobjSearchColumn
 * @memberOf nlobjSearchColumn
 * @since 2011.1
 */
nlobjSearchColumn.prototype.setLabel = function(label) { };

/**
 * Returns nlobjSearchColumn sorted in either ascending or descending order.
 * @param {Boolean} order [optional] - If not set, defaults to false, which returns column data in ascending order. If set to true, data is returned in descending order.
 * @returns {nlobjSearchColumn} nlobjSearchColumn
 * @memberOf nlobjSearchColumn
 * @since 2010.1
 */
nlobjSearchColumn.prototype.setSort = function(order) { };

/**
 * Returns the search column for which the minimal or maximal value should be found when returning the nlobjSearchColumn value.
 * <br>For example, can be set to find the most recent or earliest date, or the largest or smallest amount for a record, and then the nlobjSearchColumn value for that record is returned.
 * <br>Can only be used when min or max is passed as the summary parameter in the nlobjSearchColumn constructor.
 * @param {String} fldName   - The name of the search column for which the minimal or maximal value should be found
 * @param {String} recJoin   - The join id for this search column
 * @returns {nlobjSearchColumn} nlobjSearchColumn
 * @memberOf nlobjSearchColumn
 * @since 2012.1
 */
nlobjSearchColumn.prototype.setWhenOrderedBy = function(fldName, recJoin) { };

//required declaration for code completion to work for "new" syntax
var nlobjSearchFilter = function(name, join, operator, value1, value2) { };

/**
 * Primary object used to encapsulate search filters.
 * <br>When searching on checkbox fields, use the is operator with a T or F value to search for checked or unchecked fields, respectively.
 * <br>To search for a "none of null" value, meaning do not show results without a value for the specified field, use the &#064;NONE&#064; filter. For example,searchFilters[0] = new nlobjSearchFilter('class', null, 'noneof', '&#064;NONE&#064;');
 * <br>Note that the filters argument in nlapiSearchRecord(type, id, filters, columns) returns a reference to nlobjSearchFilter. With the object reference returned, you can then use any of the following nlobSearchFilter methods to filter your results.
 * @param {String} fldName   - The internal ID of the search field. For example, if one of your filtering criterion is Quantity Available, you will set the value of name to quantityavailable, which is the search field ID for Quantity Available.
 * @param {String} recJoin   - If you are executing a joined search, the join id used for the search field specified in the name parameter. The join id is the internal ID of the record type the search field appears on.
 * @param {String} operator   - The search operator used for this search field. See the list of possible operator values:
 * @param {String} value1   - String, date, array or number. A filter value or special date field value or Array of values for select/multiselect fields or an integer value.
 * @param {String} value2   - String or date. A secondary filter value or special date field value for between/within style operators * lastbusinessweek. See the following list of possible values:
 * @returns {nlobjSearchFilter} nlobjSearchFilter
 * @memberOf nlobjSearchFilter
 * @since 2007.0
 */
nlobjSearchFilter.prototype.constructor = function(fldName, recJoin, operator, value1, value2) { };

/**
 * Returns the formula used for this filter
 * @returns {String} The formula used for this filter
 * @memberOf nlobjSearchFilter
 * @since 2011.1
 */
nlobjSearchFilter.prototype.getFormula = function() { };

/**
 * Returns the join id for this search filter
 * @returns {String} The string value of the search join
 * @memberOf nlobjSearchFilter
 * @since 2008.1
 */
nlobjSearchFilter.prototype.getJoin = function() { };

/**
 * Returns the name for this search filter
 * @returns {String} The string value of the search filter
 * @memberOf nlobjSearchFilter
 * @since 2007.0
 */
nlobjSearchFilter.prototype.getName = function() { };

/**
 * Returns the filter operator that was used
 * @returns {String} The string value of the search operator
 * @memberOf nlobjSearchFilter
 * @since 2008.2
 */
nlobjSearchFilter.prototype.getOperator = function() { };

/**
 * Returns the summary type used for this filter
 * @returns {String} The summary type used for this filter
 * @memberOf nlobjSearchFilter
 * @since 2011.1
 */
nlobjSearchFilter.prototype.getSummaryType = function() { };

/**
 * Sets the formula used for this filter. Name of the filter can either be formulatext, formulanumeric, formuladatetime, formulapercent, or formulacurrency.
 * @param {String} formula - The formula used for this filter
 * @returns {nlobjSearchFilter} nlobjSearchFilter
 * @memberOf nlobjSearchFilter
 * @since 2011.1
 */
nlobjSearchFilter.prototype.setFormula = function(formula) { };

/**
 * Sets the summary type used for this filter. Filter name must correspond to a search column if it is to be used as a summary filter.
 * @param {String} summary - The summary type used for this filter. In your script, use one of the following summary type IDs:
 * @returns {nlobjSearchFilter} nlobjSearchFilter
 * @memberOf nlobjSearchFilter
 * @since 2011.1
 */
nlobjSearchFilter.prototype.setSummaryType = function(summary) { };

/**
 * Returns an array of nlobjSearchColumn objects containing all the columns returned in a specified search
 * @returns {nlobjSearchColumn[]} nlobjSearchColumn[]
 * @memberOf nlobjSearchResult
 * @since 2009.2
 */
nlobjSearchResult.prototype.getAllColumns = function() { };

/**
 * Returns the internal ID for the returned record
 * @returns {Number} The record internal ID as an integer
 * @memberOf nlobjSearchResult
 */
nlobjSearchResult.prototype.getId = function() { };

/**
 * Returns the record type for the returned record
 * @returns {String} The name of the record type as a string - for example, customer, assemblyitem, contact, or projecttask
 * @memberOf nlobjSearchResult
 */
nlobjSearchResult.prototype.getRecordType = function() { };

/**
 * return the text value of this return column if it's a select field.
 * @param {String} name  the name of the search column
 * @param {String} join  the join ID for the search column
 * @param {String} summary  summary type specified for this column
 * @returns {String}
 * @memberOf nlobjSearchResult
 * @since 2008.1
 */
nlobjSearchResult.prototype.getText = function(name, join, summary) { };

/**
 * return the value for a return column specified by name, join ID, and summary type.
 * @param {String} name  the name of the search column
 * @param {String} join  the join ID for the search column
 * @param {String} summary  summary type specified for this column
 * @returns {String}
 * @memberOf nlobjSearchResult
 * @since 2008.1
 */
nlobjSearchResult.prototype.getValue = function(name, join, summary) { };

/**
 * Calls the developer-defined callback function for every result in this set. There is a limit of 4000 rows in the result set returned in forEachResult().
 * <br>Your callback function must have the following signature:
 * <br>boolean callback(nlobjSearchResult result);
 * <br>Note that the work done in the context of the callback function counts towards the governance of the script that called it. For example, if the callback function is running in the context of a scheduled script, which has a 10,000 unit governance limit, you must be sure the amount of processing within the callback function does not put the entire script at risk of exceeding scheduled script governance limits.
 * <br>API Governance: 10
 * @param {Function} callback - A JavaScript function. This may be defined as a separate named function, or it may be an anonymous inline function.
 * @returns {Void}
 * @memberOf nlobjSearchResultSet
 * @since 2012.1
 */
nlobjSearchResultSet.prototype.forEachResult = function(callback) { };

/**
 * Returns a list of nlobjSearchColumn objects for this result set. This list contains one nlobjSearchColumn object for each result column in the nlobjSearchResult objects returned by this search.
 * @returns {nlobjSearchColumn[]} nlobjSearchColumn[]
 * @memberOf nlobjSearchResultSet
 * @since 2012.1
 */
nlobjSearchResultSet.prototype.getColumns = function() { };

/**
 * Retrieve a slice of the search result. The start parameter is the inclusive index of the first result to return. The end parameter is the exclusive index of the last result to return. For example, getResults(0, 10) retrieves 10 search results, at index 0 through index 9. Unlimited rows in the result are supported, however you can only return 1,000 at at time based on the index values.
 * <br>If there are fewer results available than requested, then the array will contain fewer than end - start entries. For example, if there are only 25 search results, then getResults(20, 30) will return an array of 5 nlobjSearchResult objects.
 * <br>API Governance: 10
 * @param {Number} start - The index number of the first result to return, inclusive.
 * @param {Number} end - The index number of the last result to return, exclusive.
 * @returns {nlobjSearchResult[]} nlobjSearchResult[]
 * @memberOf nlobjSearchResultSet
 * @since 2012.1
 */
nlobjSearchResultSet.prototype.getResults = function(start, end) { };

/**
 * Use this method to get the internal ID of a select option. For example, on a select field called Colors, a call to this method might return 1, 2, 3 (to represent the internal IDs for options that appear in a drop-down field as Red, White, Blue).
 * @returns {Number} The integer value of a select option, for example, 1, 2, 3.
 * @memberOf nlobjSelectOption
 * @since 2009.2
 */
nlobjSelectOption.prototype.getId = function() { };

/**
 * Use this method to get the UI display label of a select option. For example, on a select field called Colors, a call to this method might return Red, White, Blue.
 * @returns {String} The UI display label of a select option
 * @memberOf nlobjSelectOption
 * @since 2009.2
 */
nlobjSelectOption.prototype.getText = function() { };

/**
 * Adds a button to a sublist
 * @param {String} name - The internal ID name of the button. Internal ID names must be in lowercase and contain no spaces.
 * @param {String} label - The UI label for the button
 * @param {String} script [optional] - The onclick script function name
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.addButton = function(name, label, script) { };

/**
 * Adds a field (column) to a sublist
 * @param {String} name - The internal ID name of the field. Internal ID names must be in lowercase and contain no spaces.
 * @param {String} type - The field type for this field. Use any of the following types:
 * <br> - text
 * <br> - email
 * <br> - phone
 * <br> - date
 * <br> - currency
 * <br> - float
 * <br> - integer
 * <br> - checkbox
 * <br> - select
 * <br> - url
 * <br> - image - Important: This field type is available only for fields appearing on list/staticlist sublists. You cannot specify an image field on a form.
 * <br> - timeofday
 * <br> - textarea
 * <br> - percent
 * <br> - radio - only supported for sublists of type list
 * @param {String} label - The UI label for this field
 * @param {String} source [optional] - String or number. The internalId or scriptId of the source list for this field if it's a select (List/Record) field.
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.addField = function(name, type, label, source) { };

/**
 * Adds a "Mark All" and an "Unmark All" button to a sublist. Only valid on scriptable sublists of type LIST. Requires a check box column to exist on the form, which will be automatically checked/unchecked depending on what the end user does.
 * @returns {Void}
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.addMarkAllButtons = function() { };

/**
 * Adds a Refresh button to sublists of type list or staticlist to auto-refresh the sublist if its contents are dynamic. In this case, the sublist is refreshed without having to reload the contents of the entire page.
 * @returns {nlobjButton} nlobjButton
 * @memberOf nlobjSubList
 * @since 2009.1
 */
nlobjSubList.prototype.addRefreshButton = function() { };

/**
 * Returns the number of lines on a sublist
 * <br>Important: The first line number on a sublist is 1 (not 0).
 * @param {String} group - The sublist internal ID
 * @returns {Number} The integer value of the number of line items on a sublist
 * @memberOf nlobjSubList
 * @since 2010.1
 */
nlobjSubList.prototype.getLineItemCount = function(group) { };

/**
 * Returns string value of a sublist field. Note that you cannot set default line item values when the line is not in edit mode.Note: Normally custom transaction column fields that are not checked to show on a custom form are not available to get/setLineItemValue APIs. However, if you set them to show, but then set the label to empty, they will be available on the form but will not appear on the sublist. Note this does not apply to fields that are marked as Hidden on the custom field definition. These fields are always available on every form.
 * @param {String} group
 * @param {String} fldName - The internal ID of the field (line item) whose value is being returned
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @returns {String} The string value of a sublist line item field
 * @memberOf nlobjSubList
 * @since 2010.1
 */
nlobjSubList.prototype.getLineItemValue = function(group, fldName, line) { };

/**
 * Designates a particular column as the totalling column, which is used to calculate and display a running total for the sublist
 * @param {String} field - The internal ID name of the field on this sublist used to calculate running total
 * @returns {Void}
 * @memberOf nlobjSubList
 */
nlobjSubList.prototype.setAmountField = function(field) { };

/**
 * Sets the display style for this sublist. This method is only supported on scripted or staticlist sublists via the UI Object API.
 * @param {String} type - The display type for this sublist. Use either of the following two values:
 * <br> - hidden
 * <br> - normal - (default)
 * @returns {Void}
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.setDisplayType = function(type) { };

/**
 * Adds inline help text to this sublist. This method is only supported on sublists via the UI Object API.
 * @param {String} help - Inline help text used for this sublist
 * @returns {Void}
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.setHelpText = function(help) { };

/**
 * Sets the label for this sublist. This method is only supported on sublists via the UI Object API.
 * @param {String} label - The UI label for this sublist
 * @returns {Void}
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.setLabel = function(label) { };

/**
 * Sets the value of a cell in a sublist field.
 * @param {String} name - The internal ID name of the line item field being set
 * @param {Number} line - The line number for this field. Note the first line number on a sublist is 1 (not 0).
 * @param {String} value - The value the field is being set to
 * @returns {Void}
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.setLineItemValue = function(name, line, value) { };

/**
 * Sets values for multiple lines (Array of nlobjSearchResult objects or name/value pair Arrays) in a sublist.
 * @param {Object[]} values - An Array of Arrays containing name/value pairs containing column values for multiple rows or an Array of nlobjSearchResult objects containing the results of a search with columns matching the fields on the sublist. Note that several special fields: recordtype,id,and fieldname_display (UI display value for select fields) are automatically added for each search result.
 * @returns {Void}
 * @memberOf nlobjSubList
 * @since 2008.2
 */
nlobjSubList.prototype.setLineItemValues = function(values) { };

/**
 * Use this method to designate that a certain field on a sublist must contain a unique value. This method is available on inlineeditor and editor sublists only.
 * @param {String} name - The internal ID of the sublist field that you want to make unique
 * @returns {nlobjField} nlobjField
 * @memberOf nlobjSubList
 * @since 2009.2
 */
nlobjSubList.prototype.setUniqueField = function(name) { };

/**
 * Use this method to cancel the current processing of the subrecord and revert subrecord data to the last committed change (submitted in the last commit() call).
 * <br>Note that you will not be able to do any additional write or read operations on the subrecord instance after you have canceled it. You must reload the subrecord from the parent to write any additional data to the subrecord.
 * @returns {Void}
 * @memberOf nlobjSubrecord
 * @since 2011.2
 */
nlobjSubrecord.prototype.cancel = function() { };

/**
 * Use this method to commit the subrecord to the parent record. See Saving Subrecords Using SuiteScript for additional information on saving subrecords.
 * @returns {Void}
 * @memberOf nlobjSubrecord
 * @since 2011.2
 */
nlobjSubrecord.prototype.commit = function() { };

/**
 * Use this method to commit the current line in a subrecord.
 * @param {String} group - The subrecord internal ID
 * @returns {Void}
 * @memberOf nlobjSubrecord
 */
nlobjSubrecord.prototype.commitLineItem = function(group) { };

/**
 * Returns the value of a sublist field on the currently selected line
 * @param {String} group - The subrecord internal ID
 * @param {String} name - The name of the field being set
 * @returns {Void}
 * @memberOf nlobjSubrecord
 */
nlobjSubrecord.prototype.getCurrentLineItemValue = function(group, name) { };

/**
 * Use this method to insert and select a new line in a subrcord.
 * @param {String} group - The subrecord internal ID
 * @param {Number} line - The line number for this field. Note the first line number on a subrecord is 1 (not 0).
 * @returns {Void}
 * @memberOf nlobjSubrecord
 */
nlobjSubrecord.prototype.selectLineItem = function(group, line) { };

/**
 * Use this method to insert and select a new line in a subrecord.
 * @param {String} group - The subrecord internal ID
 * @returns {Void}
 * @memberOf nlobjSubrecord
 */
nlobjSubrecord.prototype.selectNewLineItem = function(group) { };

/**
 * Use this method to set the value of a subrecord line item field.
 * @param {String} group - The subrecord internal ID
 * @param {String} name - The name of the field being set
 * @param {String} value - The value the field is being set to. Note: Check box fields take the values of T or F, not true or false.
 * @returns {Void}
 * @memberOf nlobjSubrecord
 */
nlobjSubrecord.prototype.setCurrentLineItemValue = function(group, name, value) { };

/**
 * Sets the inline help used for this tab or subtab
 * @param {String} help - Inline help used for this tab or subtab
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjTab
 * @since 2008.2
 */
nlobjTab.prototype.setHelpText = function(help) { };

/**
 * Sets the tab UI label
 * @param {String} label - The UI label used for this tab or subtab
 * @returns {nlobjTab} nlobjTab
 * @memberOf nlobjTab
 * @since 2008.2
 */
nlobjTab.prototype.setLabel = function(label) { };
