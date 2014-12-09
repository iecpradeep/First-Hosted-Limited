/*******************************************************
 * Name:		JavaScript for enforcing unique passwords
 * Script Type:	JavaScript
 * Version:		1.0.0 - 03/07/2012 - Initial release - SB
 * 				1.0.1 - 13/08/2012 - Added support for Change Password page - SB
 * 				1.0.2 - 24/10/2012 - Added code to populate Brand field on registration form - SB
 * 				1.0.3 - 31/10/2012 - Different IDs for My Account in Sandbox/Production - SB
 * 
 * Author:		S.Boot
 *******************************************************/

//var unqSitePrefix = [brand-specific.js];

$(document).ready(function(){
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
		window.location.href.indexOf('/app/center/nlvisitor.nl') >= 0)
	{
		if (isSandbox())
		{
			window.location.href = '/s.nl?id=68&it=I&c=' + getTestDriveNum() + '&n=' + siteId;
		}
		else
		{
			window.location.href = '/s.nl?id=190&it=I&c=' + getTestDriveNum() + '&n=' + siteId;
		}
	}
});
