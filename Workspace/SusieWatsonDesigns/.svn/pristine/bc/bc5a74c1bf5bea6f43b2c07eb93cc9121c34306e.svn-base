function PageInit() // added AG 25-1-10 at request of Susie via Stephen Saunders
{
	ClearPeriodSalesQty();
}


function ClearPeriodSalesQty() 
{
	if (nlapiGetRecordId()=="") 
	{
		nlapiSetFieldValue("custitem_bb1_periodsalesqty","");
		nlapiSetFieldValue("custitem_bb1_nextdeldate","");
		nlapiSetFieldValue("custitem_bb1_amtduein","");
	}
}