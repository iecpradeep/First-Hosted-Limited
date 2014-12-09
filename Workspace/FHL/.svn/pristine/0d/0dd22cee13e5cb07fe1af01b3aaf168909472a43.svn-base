/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function soPromotions(request, response)
{
    var salesOrder = null;
    var salesOrderID = 0;
    
    salesOrder = nlapiCreateRecord('salesorder');
    
    salesOrder.setFieldValue('entity', 518);
    salesOrder.setFieldValue('location', 1);
    salesOrder.setFieldValue('promocode', 12);
    salesOrder.setFieldValue('memo', 'SuiteScript Promotion Test');
    
    salesOrder.selectNewLineItem('item');
    salesOrder.setCurrentLineItemValue('item', 'item', 111);
    salesOrder.commitLineItem('item');
    
    salesOrderID = nlapiSubmitRecord(salesOrder);
    nlapiLogExecution('DEBUG', 'Sales order created', salesOrderID); 
}
