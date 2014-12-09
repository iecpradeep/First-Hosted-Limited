function CompleteOrder(){
    if (nlapiGetRole() == '3') 
    {
        if (confirm('Administrator detected.\n\nPress OK to run the test code. Press Cancel to NOT run it.\n\nIF THIS IS NOT A TEST SALES ORDER, DO NOT RUN THIS CODE!')) 
        {
            //alert('Test code running...');
            var TheTransactionID = 0;
            TheTransactionID = nlapiGetFieldValue('tranid');
            if (TheTransactionID == 'To Be Generated') 
            {
                alert('You cannot run this script on New SalesOrders.\n\nYou must first create it, then go back in to the SalesOrder in Edit mode.');
                return false;
            }
            else 
            {
                alert('CreateFulfill with TxID: ' + TheTransactionID +'\nCreate nlapiTransform() with ID:null\nCreate Invoice with ID:null');
                alert('FulFill, Bill, Receive Payment, Close Sales Order.');
            }
        }
        else 
        {
            alert('Test code *NOT* run.');
        }
    }
    else 
    {
        alert('This is a test button. Please do not press me as I only do things when an Administrator presses me.');
    }
    return true;
}


