function on_change(type,name)
{
	if (name=='custcol15')
	{
		var id = nlapiGetCurrentLineItemValue('item','custcol15');
		var scheme = nlapiGetFieldValue('custbody20');
		set_address(id);
		set_skills(id,scheme);
		get_booking_details(id);
		
	}
}

function get_booking_details(id)
{
    var results, columns, value, i, j;
    var column_names = [], column_joins = [];
    var sEmail;
    var sMobile;
    var sDDI;
    var sName;

	var searchresults = nlapiSearchRecord('customer', 191, null, null);
	for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
	{
		var searchresult = searchresults[ i ];
		var record = searchresult.getId( );
		if (record == id)
		{
		
					
			var columns = searchresults[i].getAllColumns();
			for(var x = 0; columns != null && x < columns.length; x++)
			{
                   column_names[x] = columns[x].getName();
                   column_joins[x] = columns[x].getJoin();
                   value = searchresult.getValue(column_names[x], column_joins[x]);
                   if (x ==  0)
                   {
 						sEmail = value;
						nlapiSetCurrentLineItemValue('item','custcol12',sEmail,false);                  
                   }
                   if (x ==  1)
                   {
 						sMobile = value;
						nlapiSetCurrentLineItemValue('item','custcol11',sMobile,false);                  
                   }
                   if (x ==  3)
                   {
 						sName = value;
						nlapiSetCurrentLineItemValue('item','custcol9',sName,false);                  
                   }
                   if (x ==  5)
                   {
 						sDDI = value;
						nlapiSetCurrentLineItemValue('item','custcol10',sDDI,false);                  
                   }
            
                   

			}
		}
	}
}

function set_address(id)
{
	var address = nlapiLookupField('customer',id, 'address')
	nlapiSetCurrentLineItemValue('item','custcol14',address,false);
}

function set_skills(id,scheme)
{
	var skills;
		
	switch(scheme)
	{
		case '1':
			skills = nlapiLookupField('customer',id, 'custentity15',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);
		break;
		case '2':
			skills = nlapiLookupField('customer',id, 'custentity10',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);		
		break;
		case '3':
			skills = nlapiLookupField('customer',id, 'custentity13',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);		
		break;
		case '4':
			skills = nlapiLookupField('customer',id, 'custentity11',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);		
		break;
		case '5':
			skills = nlapiLookupField('customer',id, 'custentity11',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);		
		break;
		case '6':
			skills = nlapiLookupField('customer',id, 'custentity12',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);		
		break;
		case '7':
			skills = nlapiLookupField('customer',id, 'custentity14',true);
			nlapiSetCurrentLineItemValue('item','custcol13',skills,false);		
		break;
		case '8':
			alert('Error: EPIB has not been defined correctly!');		
		break;
	}

}
