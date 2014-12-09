/*******************************************************
 * Name:		JavaScript for enforcing unique passwords
 * Script Type:	JavaScript
 * Version:		1.0.0 - 03/07/2012 - Initial release - SB
 * 				1.0.1 - 13/08/2012 - Added support for Change Password page - SB
 * 				1.0.2 - 24/10/2012 - Added code to populate Brand field on registration form - SB
 * 				1.0.3 - 31/10/2012 - Different IDs for My Account in Sandbox/Production - SB
 * 				1.0.4 - 28/11/2012 - Production only My Account IDs after Sandbox refresh - SB
 * 										Added myAccountPageId set from brand-specific.js - SB
 * 				1.0.5 - 30/11/2012 - Check for duplicate customer login upon registration - SB
 * 				1.0.6 - 13/12/2012 - Add check to see if we are on real My Account page - SB
 * 				1.0.7 - 20/12/2012 - Support for NetSuite timeout password box - SB
 * 				1.0.8 - 03/04/2013 - Add help text - SB
 * 				1.0.9 - 20/06/2013 - Registration salutation - SB
 * 				1.1.0 - 23/06/2013 - Text replacement and tidy registration form - SB
 * 				1.1.1 - 24/06/2013 - Hide Partner Code and other tidy-ups - SB
 * 				1.1.2 - 25/06/2013 - Split Name field into First/Last - SB
 * 				1.1.3 - 28/06/2013 - Default email checkbox to ticked - SB
 * 				1.1.4 - 12/07/2013 - Remove VAT field from address input - SB
 * 				1.1.5 - 16/07/2013 - Login/Password flow - SB
 * 				1.1.6 - 16/07/2013 - Change Password page mods - SB
 * 
 * Author:		S.Boot
 *******************************************************/

//var unqSitePrefix = [brand-specific.js];
//var myAccountPageId = [brand-specific.js];
var regCheckURL = '/app/site/hosting/scriptlet.nl?script=116&deploy=1&compid=3322617&h=39cebdda22b0a20563fb';
var customerExists = true;

//1.0.7 - Monkey-patch showTimeout from NLTimeoutTimer.jsp as the iframe is not in the DOM at runtime
var oldShowTimeout = null;

$(document).ready(function(){
	
	if (typeof(showTimeout) != 'undefined')
	{
		oldShowTimeout = showTimeout;
		
		showTimeout = function(){
			oldShowTimeout();
			
			var passwordFunction = function(){
				$('#timeout_passwd').hide()
					.after('<input id="timeout_passwdinput" type="password" class="input" size="15" onblur="document.getElementById(\'timeout_passwd\').value=\'' + unqSitePrefix + '\' + this.value;" onkeyup="timeout_button.disabled = (value.length == 0);" onkeypress="if (getEventKeypress(event) == 13) {document.getElementById(\'timeout_button\').onclick();}">');
			};
			
			setTimeout(passwordFunction, 1000);
		};
	}

	// Register
	$('#newcust #pwd').hide().after('<input id="pwdinput" type="password" class="inputreq" size="20" maxlength="20" onblur="document.getElementById(\'pwd\').value=\'' + unqSitePrefix + '\' + this.value;">');
	$('#newcust #newpwd2').hide().after('<input id="newpwd2input" type="password" class="inputreq" size="20" maxlength="20" onblur="document.getElementById(\'newpwd2\').value=\'' + unqSitePrefix + '\' + this.value;">');
	
	// Login
	$('#retpwd').hide().after('<input id="retpwdinput" type="password" class="inputreq" size="20" maxlength="20" onblur="document.getElementById(\'retpwd\').value=\'' + unqSitePrefix + '\' + this.value;">');
	
	// Change Password
	$('#changepassword input[name="newpassword"]').hide().after('<input id="newpasswordinput" type="password" class="inputreq" size="41" maxlength="20" onblur="document.changepassword.newpassword.value=\'' + unqSitePrefix + '\' + this.value;">');
	$('#changepassword input[name="newpassword2"]').hide().after('<input id="newpassword2input" type="password" class="inputreq" size="41" maxlength="20" onblur="document.changepassword.newpassword2.value=\'' + unqSitePrefix + '\' + this.value;">');
	
	// 1.0.3 Change Password (Customer Center)
	$('#currentpassword').hide().after('<input id="currentpasswordinput" type="password" class="inputreq" size="30" maxlength="30" onblur="document.getElementById(\'currentpassword\').value=\'' + unqSitePrefix + '\' + this.value;">');
	$('#password').hide().after('<input id="passwordinput" type="password" class="inputreq" size="16" maxlength="16" onblur="document.getElementById(\'password\').value=\'' + unqSitePrefix + '\' + this.value;">');
	$('#password2').hide().after('<input id="password2input" type="password" class="inputreq" size="16" maxlength="16" onblur="document.getElementById(\'password2\').value=\'' + unqSitePrefix + '\' + this.value;">');
	
	// 1.0.2 - Populate Brand field on registration form
	$('#custentity_mrf_cust_brand option:selected').attr('value', brandId);
	
	// 1.0.3 If customer ends up on NS My Account page, redirect to new My Account page
	if (window.location.href.indexOf('/app/center/card.nl') >= 0 ||
		(window.location.href.indexOf('/app/center/nlvisitor.nl') >= 0 && 
			$('#handle_portlet_-519').length > 0)) // 1.0.6
	{
		$('.effectStatic').hide();
		window.location.href = '/s.nl?id=' + myAccountPageId + '&it=I&c=' + getTestDriveNum() + '&n=' + siteId;
	}
	
	// 1.0.5 - Duplicate Registration check
	if ($('#newcust').length > 0) // If #newcust form exists, we're on the Registration page
	{
		// 1.0.8 Show help text
		$('.helptext').show();
		
		// Attach event on submitter button click
		$('#submitter').removeAttr('onclick');
		$('#submitter').click(function(){
			// Call regCheck Suitelet
			$.get(regCheckURL + '&brand=' + brandId + '&email=' + encodeURIComponent($('#email').val()), function(data, textStatus, jqXHR){
				// If customer exists, warn
				if (customerExists)
				{
					alert('An account associated with your email address already exists in our system.\n' +
						'We will send you an email with instructions to set or reset your password.\n' + // 1.1.5
						'Please contact Customer Services if you require further assistance.');
					// 1.1.5 - Send password
					//document.forms['login'].elements['forgotPasswd'].value='T';
					$('#login').append('<input type="hidden" name="forgotPasswd" value="T">');
					$('#login').append('<input type="hidden" id="retemail" name="retemail">');
					$('#retemail').val($('#email').val());
					document.forms['login'].action='/app/site/backend/passwordretrieval.nl';
					document.forms['login'].submit();
				}
				// Else continue with normal registration
				else
				{
					// The code below comes from original #submitter onclick event
					document.forms['newcust'].elements['new'].value = 'T';
					
					if(document.forms['newcust'].confirmSpinLock.value == 1 && checkmandatoryfields())
					{
						document.forms['newcust'].confirmSpinLock.value = 0;
						document.forms['newcust'].submit();
					}
					
					return false;
				}
			});
		});
		
		// 1.1.1 - Salutation field now drop-down
		var salutationRow = $('#custentity_salutation_fs').parent().parent().detach();
		$('#name_fs').parent().parent().before(salutationRow);
		
		// 1.1.0 - Tidy up registration form
		$('input[name="createaccount"]').after('<div id="paymethnote"><h3>' + TXT_REGWELCOME + '</h3></div>');
		
		// 1.1.2 - Split name field
		$('#name_fs_lbl a').html(TXT_FIRSTNAME);
		$('#name')
			.hide()
			.after('<input id="firstname" type="text" maxlength="83" size="40" class="inputreq">');
		$('#name_fs_lbl').parent().parent().after('<tr><td align="right" valign="baseline" nowrap="" class="smalltextnolink"><span class="labelSpanEdit smalltextnolink" style="white-space: wrap;"><img src="/images/chiles/pageTitle/required.png" title="Required Field" class="required_icon"><a onmouseout="this.className=\'smalltextnolink\'; " onmouseover="this.className=\'smalltextnolink\'; return true;" class="smalltextnolink">' + TXT_LASTNAME + '</a>&nbsp;</span></td><td valign="baseline" nowrap=""><span class="effectStatic" style="white-space: nowrap"><input type="text" id="lastname" maxlength="83" size="40" class="inputreq"></span></td></tr>');
		
		// On change, concatenate into Name field
		$('#firstname,#lastname').change(function(){
			if ($('#firstname').val() != '' &&
				$('#lastname').val() != '')
			{
				$('#name').val($('#firstname').val() + ' ' + $('#lastname').val());
			}
			else
			{
				$('#name').val('');
			}
		});
		
		$('#custentity_acceptemailothercompanies_fs')
			.css('white-space', 'normal')
			.append(TXT_ACCEPTEMAILOTHERCOMPANIES);
		$('#custentity_acceptmailothercompanies_fs')
			.css('white-space', 'normal')
			.append(TXT_ACCEPTMAILOTHERCOMPANIES);
		$('#custentity_nofurthercatalogues_fs')
			.css('white-space', 'normal')
			.append(TXT_NOFURTHERCATALOGUES);
		
		$('#custentity_acceptemailothercompanies_fs_lbl').html($('#custentity_acceptemailothercompanies_fs_inp').detach());
		$('#custentity_acceptmailothercompanies_fs_lbl').html($('#custentity_acceptmailothercompanies_fs_inp').detach());
		$('#custentity_nofurthercatalogues_fs_lbl').html($('#custentity_nofurthercatalogues_fs_inp').detach());
		
		// 1.1.1 - Hide partner code and associated text
		$('#regPartner_fs').parent().parent().hide().next().hide();
		
		// 1.1.3 - Default email checkbox to ticked
		nsCheckbox($('#emailsubscribe_fs_inp'), true);
	}
	
	// Login Page
	if ($('#retpwd').length > 0)
	{
		// 1.1.5 - Login Banner
		$('.greytitle:last').parent().after('<tr><td><div id="paymethnote"><h3>' + TXT_LOGINWELCOME + '</h3></div></td></tr>');
		
		// Add password reset email link
		$('.tcs-label').after('<a style="margin-left:100px;" class="tcs-label" onclick="if(checkemailvalue(document.forms[\'login\'].elements[\'retemail\'].value, true)) {document.forms[\'login\'].elements[\'forgotPasswd\'].value=\'T\'; document.forms[\'login\'].action=\'/app/site/backend/passwordretrieval.nl\';document.forms[\'login\'].submit();}" href="#">Click here to reset password</a>');
	}
	
	// 1.0.8 Payment page
	if ($('#paymethhider').length > 0)
	{
		// Show help text
		$('.helptext').show();
		
		// Hide default breadcrumbs
		$('#nlcrumbtrail').hide();
		
		// Align field labels left
		$('#paymethhider tr').attr('align', '');
		$('#paymethhider td').attr('align', '');
		
		// Make submit have arrows
		$('#submitter').val('Continue >>');
		$('#tbl_submitter').parent().css('height', '40px');
	}
	
	// 1.1.4 Address page
	if ($('#addr1').length > 0)
	{
		// Remove VAT field
		$('#sVat_fs').parent().parent().hide();
	}
	
	// 1.1.6 Change Password page
	if ($('#tr_requirements').length > 0)
	{
		$('#tr_requirements').parent().parent().parent().hide();
		$('#strength_fs').parent().parent().hide();
	}
});

/**
 * Set NetSuite checkbox value
 * NB: Use the standard NetSuite NLCheckboxOnClick(spanTag) for toggling checkboxes
 * @param checkbox
 * @param value
 */
function nsCheckbox(checkbox, value)
{
	$(checkbox).prop('checked', value);
	
	if (value)
	{
		$(checkbox).parent().removeClass('checkbox_unck');
		$(checkbox).parent().addClass('checkbox_ck');
	}
	else
	{
		$(checkbox).parent().removeClass('checkbox_ck');
		$(checkbox).parent().addClass('checkbox_unck');
	}
}