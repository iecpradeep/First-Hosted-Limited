/*******************************************************
 * Name:		JavaScript for quick order form
 * Script Type:	Script
 * Version:		1.0.0 - 21/05/2012 - SB
 * 				1.1.0 - 07/07/2012 - SB
 * 				1.1.1 - 22/10/2012 - Add n=1 for site ID - SB
 * 									 Error checking - SB
 * 				1.1.2 - 11/11/2012 - Brand specific - SB
 * 				1.1.3 - 09/01/2013 - Add brand parameter - SB
 * 
 * Author:		S.Boot
 *******************************************************/

var scriptUrl = '/app/site/hosting/scriptlet.nl?script=15&deploy=1&compid=3322617&h=1d3905783d821038c85d';
var addToCartUrl = '/app/site/backend/intl/additemtocart.nl?c=3322617&n=';

function quickOrder()
{
	var errorMsg = '';
	var urlString = '';
	
	$('.infocontainer input[type=submit]')
		.attr('disabled', 'disabled')
		.attr('value', 'PLEASE WAIT...')
		.css('background-color', '#f00');
	
	// For each code with a valid quantity, call the Suitelet that will add to basket
	for (var i = 1; i <= 20; i++)
	{
		if ($('#code'+i).val() !== '' && parseInt($('#qty'+i).val()) > 0)
		{
			$.ajax({url:scriptUrl + '&itemid=' + encodeURIComponent($('#code'+i).val()) + '&brand=' + brandId,
				dataType: 'html',
				async: false,
				success: function(data, textStatus, jqXHR){
					if (data)
					{
						urlString += parseInt(data).toString() + ',' + parseInt($('#qty'+i).val()).toString() + ';';
					}
					else
					{
						if (errorMsg)
						{
							errorMsg += ', ';
						}
						errorMsg += $('#code'+i).val();
					}
				}
			});
		}
	}
	
	if (errorMsg)
	{
		alert('Sorry, the following codes were not valid:\n' + errorMsg);
	}
	
	window.location.href = addToCartUrl + siteId + '&buyid=multi&multi=' + urlString;
}