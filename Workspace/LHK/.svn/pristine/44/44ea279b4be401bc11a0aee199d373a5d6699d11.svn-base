function uselhkfx(type, name)
{
 	if(name == 'custbody_lhkexchangerate')
	{
 		var lhkfxrate = parseFloat(nlapiGetFieldValue('custbody_lhkexchangerate'));
		var sysfxrate = (1/lhkfxrate);
		//sysfxrate = nlapiFormatCurrency(sysfxrate);
		alert(sysfxrate);
		nlapiSetFieldValue('exchangerate', sysfxrate, true, true);
	}
	return true;
}