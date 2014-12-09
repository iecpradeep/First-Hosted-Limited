// JavaScript Document
function DutyQty(params) {
	var qty = params.getParameter('qty');
	var cid = params.getParameter('cid');
	if(cid)
	nlapiSubmitField('customer', cid, 'custentity_dutyqty', qty);
	
}