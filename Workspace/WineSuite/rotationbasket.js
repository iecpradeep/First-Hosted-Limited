function updateRotationBasket(params) {
	var rotationnum = params.getParameter("rot");
    var qty = params.getParameter("qty");
	var action = params.getParameter("action");
	nlapiLogExecution('DEBUG', 'qty', qty);
	nlapiLogExecution('DEBUG', 'action', action);

	var inbasket = nlapiLookupField('customrecord_rotation', rotationnum, 'custrecord_inbasket'); 
	if(inbasket=="") inbasket = 0;
	
	if(action == "add")
		inbasket = parseInt(inbasket) + parseInt(qty);
	else
		inbasket = parseInt(inbasket) - parseInt(qty);
	nlapiLogExecution('DEBUG', 'inbasket', inbasket);	
	if(inbasket < 0) inbasket = 0;	
	nlapiSubmitField('customrecord_rotation', rotationnum, 'custrecord_inbasket', inbasket);
}


