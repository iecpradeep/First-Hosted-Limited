function delPORes()
{
	var searchresults = nlapiSearchRecord('customrecord_fhl_po_reservation_list', null, null, null);
	for ( var i = 0; searchresults != null && i < searchresults.length; i++ ) 
	{
		var searchresult = searchresults[ i ];
		nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId();
	}
alert('Done!!');
return true;
}