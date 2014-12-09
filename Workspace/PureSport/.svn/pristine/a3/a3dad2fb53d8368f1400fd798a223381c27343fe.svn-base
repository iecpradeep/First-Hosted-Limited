
/*******************************************************
 * Name:             Pure Rugby Price Inc VAT script
 * Script Type:     User Event
 * Version:          1.2.0
 * Date:              13th February 2012
 * Author:           Peter Lewis, First Hosted Limited.
 *******************************************************/



/*********
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 */


function OnFieldChanged(type, name, linenum)
{
	
	
	try {
			//alert('type: ' + type + '\nName : ' + name + '\nLine num : ' + linenum);
		
		if((name =='price') && (linenum == '1'))
		{
			//alert('Tax code: ' + nlapiGetFieldValue('salestaxcode'));
			
		//	var DoCalc = nlapiGetFieldValue('pricesincludetax');
			
		//	if(DoCalc == 'T')
			//	{
					var OriginalPrice = nlapiGetLineItemMatrixValue('price', 'price', 1, 1);
					var NewPrice = 0; // parseFloat(OriginalPrice) * 1.2;
					var TaxCode = nlapiGetFieldValue('salestaxcode');
					var IncludesTax = nlapiGetFieldValue('pricesincludetax');
					//6000 = 20%
					//6 = 17.5%
					
					
					if(IncludesTax == 'T')
						{
						switch(TaxCode.toString()) {
						case '':
							alert('You must select a Sales Tax Code before entering a price.');
							return false;
							break;
						case '6':
						case '6000':
						default:
							NewPrice = parseFloat(OriginalPrice);
							break;
					}
						
						}
					else
						{
						switch(TaxCode.toString()) {
						case '':
							alert('You must select a Sales Tax Code before entering a price.');
							return false;
							break;
						case '6':
						//17.5%
							NewPrice = parseFloat(OriginalPrice) * 1.175;
							break;
						case '6000':
						//20%
							NewPrice = parseFloat(OriginalPrice) * 1.2;
							break;
						default:
							NewPrice = parseFloat(OriginalPrice);
							break;
					}
						
						}
			
					var roundedNumber = roundNumber(NewPrice,2);
					//alert('The new price inc Tax : ' + roundedNumber);
					
					nlapiSetFieldValue('custitem_priceincludingtax', roundedNumber, false, false);
				//}
			

		}
	}
	 catch (e) 
	{
		alert('Error whilst attempting to calculate the Price Including Tax.\n' + e);
	}


	

}


function roundNumber(num, dec) 
{
  var result = String(Math.round(num*Math.pow(10,dec))/Math.pow(10,dec));
  if(result.indexOf('.')<0) {result+= '.';}
  while(result.length- result.indexOf('.')<=dec) {result+= '0';}
  return result;
}