function onLoad()
{
	try 
	{
		nlapiSetFieldValue('purchasetaxcode',6,false,false);
		nlapiSetFieldValue('salestaxcode',6,false,false);
		//nlapiSetFieldValue('unitstype',1,false,false);
	
	}
	catch (e) 
	{
		alert(e);
		
	}
	
}

function onChange(type, name)
{
	if (name == 'displayname')
		{
			var displayname = nlapiGetFieldValue('displayname');

			if (displayname != null && displayname != '')
				{
					nlapiSetFieldValue('purchasedescription',displayname,false,false);
					nlapiSetFieldValue('salesdescription',displayname,false,false);
					nlapiSetFieldValue('custitem_search_aux',displayname,false,false);
				}


		}
		
	if (name == 'custitem_btlsize')
		{
			var bottlesize = nlapiGetFieldValue('custitem_btlsize');

			if (bottlesize == 12)
				{
					nlapiSetFieldValue('unitstype',12,false,false);
				}
			if (bottlesize == 9)
				{
					nlapiSetFieldValue('unitstype',9,false,false);
				}
			if (bottlesize == 2)
				{
					nlapiSetFieldValue('unitstype',1,false,false);
				}
			if (bottlesize == 1)
				{
					nlapiSetFieldValue('unitstype',2,false,false);
				}
			if (bottlesize == 7)
				{
					nlapiSetFieldValue('unitstype',7,false,false);
				}
			if (bottlesize == 6)
				{
					nlapiSetFieldValue('unitstype',6,false,false);
				}
			if (bottlesize == 5)
				{
					nlapiSetFieldValue('unitstype',5,false,false);
				}
			if (bottlesize == 3)
				{
					nlapiSetFieldValue('unitstype',3,false,false);
				}
			if (bottlesize == 11)
				{
					nlapiSetFieldValue('unitstype',11,false,false);
				}
			if (bottlesize == 10)
				{
					nlapiSetFieldValue('unitstype',10,false,false);
				}
			if (bottlesize == 8)
				{
					nlapiSetFieldValue('unitstype',8,false,false);
				}
			if (bottlesize == 4)
				{
					nlapiSetFieldValue('unitstype',4,false,false);
				}
				
		}

}