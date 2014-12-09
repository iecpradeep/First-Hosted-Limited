function setBankAccount()
{
	var currencyid = nlapiGetFieldValue('currency');
		if(currencyid == 1) //GBP
			{
				nlapiSetFieldValue('account', '235');
			}
		if(currencyid == 2) //USD
			{
				nlapiSetFieldValue('account', '234');
			}	
		if(currencyid == 4) //EUR
			{
				nlapiSetFieldValue('account', '233');
			}
		if(currencyid == 5) //CHF
			{
				nlapiSetFieldValue('account', '231');
			}
		if(currencyid == 6) //HKD
			{
				nlapiSetFieldValue('account', '232');
			}	
	return true;
}