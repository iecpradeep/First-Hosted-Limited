function validateLine( type, name )
{

	var custId = nlapiGetFieldValue('entity');

	if(custId!=null && custId!='')
	{

		var custCat = nlapiLookupField('customer', custId, "category");

		if(custCat=='1')
		{

			var lineQty = parseFloat( nlapiGetCurrentLineItemValue( type, 'quantity' ) );
			var minQty = parseFloat( nlapiGetCurrentLineItemValue( type, 'custcol_bb1_trademinqty' ) );

			//divide one by the other and see if there is a remainder	
			if((lineQty/minQty-parseInt(lineQty/minQty))>0)
			{

				alert('The Qty ordered is not a multiple of the Trade boxed qty for this item.');
				return true;

			}
			else
			{
				return true;
			}		

		}
		else
		{
			return true;
		}
	}
	else
	{
		alert('Please select a customer before adding an item');
		return false;	
	}

}