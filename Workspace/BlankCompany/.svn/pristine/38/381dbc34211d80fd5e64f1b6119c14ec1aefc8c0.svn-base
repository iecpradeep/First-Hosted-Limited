
function rollBackPageInit()
{
	initPayroll();
}

function rollBackFieldChanged(type, fieldname, linenum)
{

}
	
function rollBackSave()
{
    var	returnBool = confirm("Are you sure you want to roll back. This will REMOVE ALL data entered after the step you roll back to");

    // lets display the candybar for progress
    if(returnBool)
    {
        Ext.MessageBox.show({
            title : 'Pay Run Rollback',
            msg: 'Payrun data is currently rolling back, please be patient and do not refresh or close this page.',
            wait:true
        });
    }

    return returnBool;
}










