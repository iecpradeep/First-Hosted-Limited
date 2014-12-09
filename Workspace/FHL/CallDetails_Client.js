function manageContact(stMode) 
{
    if (stMode) 
    {
        var stWindowLocation = window.location;
        var stCleanedUrl = stWindowLocation.toString().replace(/#(.*)/,''); 
        var objPostData = {
            'custpage_tmcall_id' : nlapiGetFieldValue('custpage_tmcall_id'),
            'custpage_stage' : 'contact_'+stMode,
            'custpage_co' : nlapiGetFieldValue('custpage_tab1_company'),
            'custpage_tab3_cn' : nlapiGetFieldValue('custpage_tab3_cn'),
            'custpage_tab3_ct' : nlapiGetFieldValue('custpage_tab3_ct'),
            'custpage_tab3_cp' : nlapiGetFieldValue('custpage_tab3_cp'),
            'custpage_tab3_ce' : nlapiGetFieldValue('custpage_tab3_ce'),
            'custpage_tab3_cid' : nlapiGetFieldValue('custpage_tab3_cid')
            };
        var responseObj = nlapiRequestURL(stCleanedUrl,objPostData);
        var stResponseBody = responseObj.getBody();

        var bReloadPage = false;

        if (stResponseBody == 'contact_created') 
        {
            alert('A New Contact has been created'); 
            bReloadPage = true;
        }
        else if (stResponseBody == 'contact_edited') 
        {
            alert('The selected contact has been updated'); 
            bReloadPage = true;
        }

        else if (stResponseBody == 'contact_changed') 
        {
            alert('The selected contact is now the default contact'); 
            bReloadPage = true;
        }
        else 
        {
            alert('Unable to process contact'); 
        }

        if (bReloadPage) 
        {
            window.ischanged = false;
            window.location = stCleanedUrl; // refresh page
        }
    }
}