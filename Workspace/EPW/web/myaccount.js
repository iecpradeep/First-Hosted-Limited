var docLocation = '' + document.location;
if (docLocation.search(/center\/card.nl/i) > -1) {
	document.location = 'http://www.edwardparkerwines.com/My-Account';
}
if (docLocation.search(/center\/nlvisitor.nl/i) > -1) {
	document.location = 'http://www.edwardparkerwines.com/My-Account';
}

$(function(){

	if (docLocation.search(/custprofile.nl/i) > -1) {
		$('#paymentmethodtable').hide();
	}
	
	if ($('.checkoutprogresstext').text()) {
		if ($('.checkoutprogresstext b').text() == 'Shipping') {
			document.forms.checkout.submit();
		}
		else
		{
			$('.checkoutprogresstext').html($('.checkoutprogresstext').html().replace('Shipping &nbsp; » &nbsp;', ''));
		}
	}

	$('.pt_head').hide();
	$('.pt_end').hide();
	$('.pt_body').css({border:'0'});
	$('.bntLT').hide();
	$('.bntLB').hide();
	$('.bntRT').hide();
	$('.bntRB').hide();
	$('.bntBgB').removeClass('bntBgB').addClass('nlbutton');
});