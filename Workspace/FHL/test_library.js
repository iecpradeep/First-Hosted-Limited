function libraryTest(type, name, linenum)
{
	if (name == 'custentity_memo')
	{
		var id = nlapiGetRecordId();
		var memo = '';
		
		memo = genericSearch('customer', 'internalid', id);
		
		alert(memo);
	}
}