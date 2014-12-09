// JavaScript Document
function exchangeRateCalculator(params) {

	var targetCurrency = params.getParameter('tcur');
	var amount = params.getParameter('amt')
	try {
		var exchangeRate = 1;
		if(targetCurrency != "")
		{
			exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
		}
		
		amount = amount * exchangeRate;
	} catch(e) {}
	
	return amount;
}