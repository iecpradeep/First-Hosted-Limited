/**
* @fileOverview
* @name Innov.UE.LHK.VendorBill.js
* @author Innov - Eli Beltran
* 07-25-2012
* Added function: 'beforeLoad'
*	Set the Exchange Rate based on the stored value of Exchange Rate (static) (custom field on PO)
*/

var log = new Log('DEBUG');

var beforeLoad = function(type, form, request){
	if(type == 'create' || type == 'edit')
	{
		var purchaseOrderId = request.getParameter('id');
		log.write('Purchase Order ID: ' + purchaseOrderId);
		if(!isBlank(purchaseOrderId))
		{
			var exchangeRateFromPO = nlapiLookupField('purchaseorder', purchaseOrderId, 'custbody_exchange_rate_static');
			log.write('Exchange Rate from PO: ' + exchangeRateFromPO);
			nlapiSetFieldValue('exchangerate', exchangeRateFromPO);
		}
	}
}