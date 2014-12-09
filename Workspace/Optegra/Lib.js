/**
 * @author alaurito
 */

/**
 * Revision History:
 * 
 * Date        Fixed Issue    Broken in QA Bundle     Issue Fix Summary
 * =============================================================================================
 * 2012/03/08  217041         GPM Beta - 1.19.2       Support edition control
 * 2012/04/18  218410         1.21                    Use list of native formats in source code
 *                                                    to get the allowed formats for an account
 *             219964         1.21                    Calls the Generic Payments Configuration
 *                                                    Loader suitelet to get the account country
 *                                                    and country code-country name map
 * 2012/04/23  220254         1.21.1                  Include custom formats in allowed format
 *                                                    list when license is valid (injection from
 *                                                    previous fix)
 */

var _2663;

if (!_2663) 
    _2663 = {};

_2663.AllowedFormatsByEdition = {
    'US' : ['US', 'CA'],
    'AU' : ['AU', 'NZ'],
    'CA' : ['CA', 'US'],
    'JP' : ['JP'],
    'GB' : ['GB'],
    'BE' : ['BE'],
    'FR' : ['FR'],
    'DE' : ['DE'],
    'ES' : ['ES'],
    'IT' : ['IT'],
    'NL' : ['NL'],
    'ZA' : ['ZA'],
    'SG' : ['SG'],
    'NZ' : ['NZ', 'AU']
};

_2663.PaymentFileTypes = {
    'EFT' : '1',
    'DD' : '2',
    'Positive Pay' : '3'
};

_2663.NativeFormats = [
    { 
        name: 'ABA', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'ACH - CCD/PPD', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'ACH - CTX (Free Text)', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'AEB - Norma 34', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'BACS', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'BNZ', 
        type: _2663.PaymentFileTypes['EFT']
    },
    { 
        name: 'BoA/ML', 
        type: _2663.PaymentFileTypes['Positive Pay'] 
    },
    { 
        name: 'CBI Collections', 
        type: _2663.PaymentFileTypes['DD'] 
    },
    { 
        name: 'CBI Payments', 
        type: _2663.PaymentFileTypes['EFT']
    },
    { 
        name: 'CFONB', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'CIRI-FBF', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'DBS - IDEAL', 
        type: [_2663.PaymentFileTypes['EFT'], _2663.PaymentFileTypes['DD']] 
    },
    { 
        name: 'DTAUS', 
        type: [_2663.PaymentFileTypes['EFT'], _2663.PaymentFileTypes['DD']] 
    },
    { 
        name: 'Equens - Clieop', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'RBC', 
        type: ['Positive Pay'] 
    },
    { 
        name: 'Standard Bank', 
        type: _2663.PaymentFileTypes['EFT'] 
    },
    { 
        name: 'UoB - BIB-IBG', 
        type: [_2663.PaymentFileTypes['EFT'], _2663.PaymentFileTypes['DD']] 
    },
    { 
        name: 'Zengin', 
        type: _2663.PaymentFileTypes['EFT'] 
    }
];


_2663.EditionControl = function() {
    function isLicensed() {
        var result = true;
        
        // get license parameters
        var licenseParams = (new _2663.LicenseFields()).GetLatestLicenseFieldsParameters();
        nlapiLogExecution('debug', '[ep] EditionControl:isLicensed', 'last updated: ' + licenseParams.timestamp);
        
        var licenseValidator = new _2663.LicenseValidator(); 
        var isValidLicense = licenseValidator.CheckValidLicense(licenseParams);
        var isWithinPeriod = licenseValidator.CheckLicenseWithinPeriod(licenseParams);
        // if license is valid
        if (isValidLicense == false) {
            nlapiLogExecution('error', '[ep] EditionControl:isLicensed', 'The license key that you have provided is not valid. Please re-install the Electronic Payments License Update to update your license.');
            result = false;
        }
        else if (isWithinPeriod == false) {
            nlapiLogExecution('error', '[ep] EditionControl:isLicensed', 'Your license has expired. Please re-install the Electronic Payments License Update to update your license.');
            result = false;
        }

        return result;
    }
    
    this.IsLicensed = isLicensed;
};

_2663.LicenseFields = function() {
    function update(licenseParams) {
        var id;
        if (licenseParams && licenseParams.timestamp && licenseParams.licensekey) {
            try {
                var existingLicenseParams = getLatestLicenseFieldsParameters();
                id = existingLicenseParams.id;
                if (id) {
                    nlapiLogExecution('debug', '[ep] LicenseFields:update', 'existing preference internal id: ' + id);
                    // update fields
                    nlapiSubmitField('customrecord_ep_preference', id, ['custrecord_ep_last_updated', 'custrecord_ep_license_key'], [licenseParams.timestamp, licenseParams.licensekey], false);
                } 
                else {
                    // create if does not exist
                    var licenseRecord = nlapiCreateRecord('customrecord_ep_preference', {recordmode: 'dynamic'});
                    licenseRecord.setFieldValue('custrecord_ep_last_updated', licenseParams.timestamp);
                    licenseRecord.setFieldValue('custrecord_ep_license_key', licenseParams.licensekey);
                    id = nlapiSubmitRecord(licenseRecord);
                }
                nlapiLogExecution('debug', '[ep] LicenseFields:update', 'new preference internal id: ' + id);
            }
            catch(ex) {
                nlapiLogExecution('error', '[ep] LicenseFields:update', 'An error occurred while updating the license fields: ' + ex.getCode() + '\n' + ex.getDetails());
                throw nlapiCreateError('IPM_LICENSE_UPDATE_ERROR', 'An error occurred while updating the license fields: ' + ex.getCode() + '\n' + ex.getDetails(), true);
            }
        }
        return id;
    }
    
    function getLatestLicenseFieldsParameters() {
        var licenseParams = {};
        var columns = [];
        columns.push(new nlobjSearchColumn('custrecord_ep_last_updated').setSort(true));
        columns.push(new nlobjSearchColumn('custrecord_ep_license_key'));
        var searchRes = nlapiSearchRecord('customrecord_ep_preference', null, null, columns);
        if (searchRes) {
            licenseParams.id = searchRes[0].getId();
            licenseParams.timestamp = searchRes[0].getValue('custrecord_ep_last_updated');
            licenseParams.licensekey = searchRes[0].getValue('custrecord_ep_license_key');
        }
        return licenseParams;
    }
    
    this.Update = update;
    this.GetLatestLicenseFieldsParameters = getLatestLicenseFieldsParameters;
};

_2663.LicenseValidator = function() {
    function checkValidLicense(licenseParams) {
        var result = true;
        if (licenseParams && licenseParams.timestamp && licenseParams.licensekey) {
            // check if valid license
            nlapiLogExecution('debug', '[ep] LicenseValidator:checkValidLicense', 'timestamp: ' + licenseParams.timestamp + ', licensekey: ' + licenseParams.licensekey);
            var expectedLicenseKey = (new _2663.LicenseKeyCreatorEP()).BuildLicenseKey(licenseParams.timestamp);
            nlapiLogExecution('debug', '[ep] LicenseValidator:checkValidLicense', 'expected licensekey: ' + expectedLicenseKey);
            if (expectedLicenseKey != licenseParams.licensekey) {
                result = false;
            }
        }
        else {
            result = false;
        }
        return result;
    }
    
    function checkLicenseWithinPeriod(licenseParams) {
        var result = true;
        if (licenseParams && licenseParams.timestamp && licenseParams.licensekey) {
            nlapiLogExecution('debug', '[ep] LicenseValidator:checkLicenseWithinPeriod', 'timestamp: ' + licenseParams.timestamp + ', licensekey: ' + licenseParams.licensekey);
            // check if date is within 30 days
            var currDateMs = (new Date()).getTime();
            var timestampDate = parseDateFromPlaintext(licenseParams.timestamp);
            if (timestampDate) {
                nlapiLogExecution('debug', '[ep] LicenseValidator:checkLicenseWithinPeriod', 'parsed date: ' + timestampDate);
                var timestampMs = timestampDate.getTime();
                var maxAllowedDaysMs = 30 * 24 * 60 * 60 * 1000; // 30 days * 24 hours + 60 mins + 60 secs + 1000 ms
                var dayDiff = (currDateMs - timestampMs);
                nlapiLogExecution('debug', '[ep] LicenseValidator:checkLicenseWithinPeriod', 'day diff: ' + dayDiff + ', max allowed: ' + maxAllowedDaysMs);
                if (dayDiff > maxAllowedDaysMs) {
                    result = false;
                }
            }
            else {
                result = false;
            }
        }
        else {
            result = false;
        }
        return result;
    }
    
    function parseDateFromPlaintext(timestamp) {
        var date;
        if (timestamp && timestamp.length == 12) {
            timestamp = new String(timestamp);
            var year = timestamp.substring(0, 4);
            var month = parseInt(timestamp.substring(4, 6), 10) - 1;
            var date = timestamp.substring(6, 8);
            date = new Date(year, month, date, 23, 59); // consider midnight as end of day
        }
        return date;
    }
    
    this.CheckValidLicense = checkValidLicense;
    this.CheckLicenseWithinPeriod = checkLicenseWithinPeriod;
};

_2663.LicenseKeyCreatorEP = function() {
    function buildPlainTextDate(date) {
        var plainTextDate;
        if (date) {
            var yearStr = new String(date.getFullYear());
            var monthStr = new String(date.getMonth() + 1);
            var dateStr = new String(date.getDate());
            var hourStr = new String(date.getHours());
            var minuteStr = new String(date.getMinutes());
            monthStr = monthStr.length == 2 ? monthStr : '0' + monthStr;
            dateStr = dateStr.length == 2 ? dateStr : '0' + dateStr;
            hourStr = hourStr.length == 2 ? hourStr : '0' + hourStr ;
            minuteStr = minuteStr.length == 2 ? minuteStr : '0' + minuteStr ;
            plainTextDate = yearStr + monthStr + dateStr + hourStr + minuteStr;
        }
        nlapiLogExecution('debug', '[ep] LicenseKeyCreatorEP:buildTimestampInPlainText', plainTextDate);
        return plainTextDate;
    }
    
    function buildLicenseKey(timestamp) {
        var licenseKey;
        if (timestamp) {
            var cipherText = timestamp + nlapiGetContext().getCompany();
            licenseKey = nlapiEncrypt(cipherText, 'aes', getSharedKey());
        }
        nlapiLogExecution('debug', '[ep] LicenseKeyCreatorEP:buildLicenseKey', licenseKey);
        return licenseKey;
    }

    function getSharedKey() {
        var key = nlapiEncrypt('e' + nlapiGetContext().getCompany() + 'p', 'aes');
        return key;
    }

    this.BuildPlainTextDate = buildPlainTextDate;
    this.BuildLicenseKey = buildLicenseKey;
};

_2663.FormatRestrictor = function() {
    /**
     * Returns whether a given format record is editable based on the license availability.
     * Format type:
     * - Positive Pay - return all regardless of license
     * - EFT and DD - return only those allowed for edition
     * 
     * @param formatRecord
     * @returns {Boolean}
     */
    function isEditableFormat(formatRecord) {
        var result = false;
        var isLicensed = (new _2663.EditionControl()).IsLicensed();
        nlapiLogExecution('debug', '[ep] FormatRestrictor:isEditableFormat', 'licensed: ' + isLicensed);
        if (formatRecord) {
            var type = formatRecord.getFieldText('custrecord_2663_payment_file_type');
            if (type == 'Positive Pay' || isLicensed == true) {
                result = true;
            }
        }
        return result;
    }
    
    /**
     * Returns the list of allowed formats based on format type and license availability.
     * Format type:
     * - Positive Pay - return all regardless of license
     * - EFT and DD - return only those allowed for edition if license is not available
     * 
     * When license is available
     * 
     * @param formatType
     * @returns {Array}
     */
    function getAllowedFormats(formatType) {
        var isLicensed = (new _2663.EditionControl()).IsLicensed();
        var allowedFormats = {}; // to contain list of file format id-name pairs
        
        if (formatType) {
            var formatTypes = {
                'EFT' : '1',
                'DD' : '2',
                'Positive Pay' : '3',
            };
            
            var filters = [];
            
            // set the flag to search to true
            // this will be set to false if there's no license/not positive pay and no formats are assigned to the account's edition
            var searchFlag = true;
            
            filters.push(new nlobjSearchFilter('custrecord_2663_payment_file_type', null, 'anyof', formatTypes[formatType]));
            filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
            nlapiLogExecution('debug', '[ep] FormatRestrictor:getAllowedFormats', 'isLicensed: ' + isLicensed);
            if (formatType != 'Positive Pay' && isLicensed == false) {
                // allow only native formats
                filters.push(new nlobjSearchFilter('custrecord_2663_native_format', null, 'is', 'T'));
                
                // filter by edition
                var configObject = getConfigurationObject();
                var editionValue = configObject.companyinformation.country;
                var allowedCountryFormats = _2663.AllowedFormatsByEdition[editionValue];
                
                nlapiLogExecution('debug', '[ep] FormatRestrictor:getAllowedFormats', 'edition: value-' + editionValue);

                if (allowedCountryFormats) {
                    // --- workaround for country field values ---
                    // get countryIdMap from company info and custom field
                    // match based on the country text in order to get the country id's to used in filter
                    var companyInfoCountryIdMap = configObject.countryIdMap;
                    var customFieldCountryIdMap = createCountryIdMapFromCustomField();
                    var countryIds = [];
                    for (var i = 0; i < allowedCountryFormats.length; i++) {
                        var countryName = companyInfoCountryIdMap[allowedCountryFormats[i]];
                        nlapiLogExecution('debug', '[ep] FormatRestrictor:getAllowedFormats', 'allowed country: value-' + allowedCountryFormats[i] + ',text-' + countryName);
                        var countryId = customFieldCountryIdMap[countryName];
                        nlapiLogExecution('debug', '[ep] FormatRestrictor:getAllowedFormats', 'allowed country: id-' + countryId);
                        countryIds.push(countryId);
                    }
                    filters.push(new nlobjSearchFilter('custrecord_2663_format_country', null, 'anyof', countryIds));
                }
                else {
                    nlapiLogExecution('debug', '[ep] FormatRestrictor:getAllowedFormats', 'No formats for edition: ' + editionValue);
                    searchFlag = false;
                }
            }
            
            var columns = [];
            columns.push(new nlobjSearchColumn('name').setSort());
            
            if (searchFlag == true) {
                var searchResults = nlapiSearchRecord('customrecord_2663_payment_file_format', null, filters, columns);  // 20 points
                
                if (searchResults) {
                    // get all the format names to only include those formats in the source code
                    var nativeFormatNameList = getNativeFormatNames();
                    
                    for (var i = 0; i < searchResults.length; i++) {
                        if (isLicensed == true || nativeFormatNameList.indexOf(searchResults[i].getValue('name')) != -1) {
                            allowedFormats[searchResults[i].getId()] = searchResults[i].getValue('name');
                        }
                        else {
                            nlapiLogExecution('debug', '[ep] FormatRestrictor:getAllowedFormats', 'Invalid native format: ' + searchResults[i].getValue('name'));
                        }
                    }
                }
            }
        }
        
        return allowedFormats;
    }
    
    /**
     * Returns map of country id's with their text values based on the custom country field.
     * Country Id is in numeric format.
     * Map: key = country name, value = country id
     * 
     * @returns {___anonymous5238_5239}
     */
    function createCountryIdMapFromCustomField() {
        var countryMap = {};
        
        var dummyFormat = nlapiCreateRecord('customrecord_2663_payment_file_format', {recordmode: 'dynamic'});  // 2 points
        var fld = dummyFormat.getField('custrecord_2663_format_country');
        var countries = fld.getSelectOptions();

        if (countries) {
            for (var i = 0; i < countries.length; i++) {
                countryMap[countries[i].text] = countries[i].id;
            }
        }

        return countryMap;
    }

    /**
     * Returns a list of the native formats as listed in the source code (prevents usage of imported formats) 
     * @returns {Array}
     */
    function getNativeFormatNames() {
        var nativeFormatNameList = []; 
        for (var i = 0; i < _2663.NativeFormats.length; i++) {
            nativeFormatNameList.push(_2663.NativeFormats[i].name);
        }
        return nativeFormatNameList;
    }
    
    /**
     * Wraps the call to the nlapiLoadConfiguration object and returns the result account country and country map
     * @returns {___anonymous17253_17254}
     */
    function getConfigurationObject() {
        var companyInfoConfigurationObject = {};
        try {
            nlapiLogExecution('debug', '[ep] FormatRestrictor:getConfigurationObject', 'Retrieving configuration object');
            var adminFieldsUrl = nlapiResolveURL('SUITELET', 'customscript_ep_admin_data_loader_s', 'customdeploy_ep_admin_data_loader_s', true);
            var adminFields = nlapiRequestURL(adminFieldsUrl);
            var adminFieldsResult = adminFields.getBody();
            companyInfoConfigurationObject = JSON.parse(adminFieldsResult);
        }
        catch(ex) {
            nlapiLogExecution('error', '[ep] FormatRestrictor:getConfigurationObject', 'Error occurred while loading the configuration: ' + ex.getCode() + '\n' + ex.getDetails());
        }
        return companyInfoConfigurationObject;
    }
    

    this.IsEditableFormat = isEditableFormat;
    this.GetAllowedFormats = getAllowedFormats;
};

