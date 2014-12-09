function updateactualprice()
{


var commrate = nlapiGetCurrentLineItemValue('item','custcolnscommrate');
var displayprice = nlapiGetCurrentLineItemValue('item','custcoldisplayprice');
var newvalue = displayprice * commrate;

nlapiSetCurrentLineItemValue('item', 'rate', newvalue);



}