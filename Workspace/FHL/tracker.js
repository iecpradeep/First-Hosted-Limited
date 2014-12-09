function field_changed(type,name)
{

	switch(name)
	{
		case 'custrecord12':
  			nlapiSetFieldValue('custrecord13',return_date(),false);
  		break;
 		case 'custrecord74':
  			nlapiSetFieldValue('custrecord14',return_date(),false);
  		break;
  		case 'custrecord75':
  			nlapiSetFieldValue('custrecord15',return_date(),false);
  		break;
  		case 'custrecord76':
  			nlapiSetFieldValue('custrecord16',return_date(),false);
  		break;
  		case 'custrecord77':
  			nlapiSetFieldValue('custrecord17',return_date(),false);
  		break;
  		case 'custrecord85':
  			nlapiSetFieldValue('custrecord18',return_date(),false);
  		break;
  		case 'custrecord78':
  			nlapiSetFieldValue('custrecord37',return_date(),false);
  		break;
  		case 'custrecord79':
  			nlapiSetFieldValue('custrecord50',return_date(),false);
  		break;
  		case 'custrecord80':
  			nlapiSetFieldValue('custrecord51',return_date(),false);
  		break;
  		case 'custrecord81':
  			nlapiSetFieldValue('custrecord56',return_date(),false);
  		break;
  		case 'custrecord82':
  			nlapiSetFieldValue('custrecord57',return_date(),false);
  		break;
  		case 'custrecord83':
  			nlapiSetFieldValue('custrecord58',return_date(),false);
  		break;
  		case 'custrecord62':
  			nlapiSetFieldValue('custrecord73',return_date(),false);
  			nlapiSetFieldValue('custrecord59','T',false);
  		break;
  		case 'custrecord84':
  			nlapiSetFieldValue('custrecord63',return_date(),false);
  		break;
  		case 'custrecord89':
  			nlapiSetFieldValue('custrecord90',return_date(),false);
  		break;
  		case 'custrecord127':
  			if (nlapiGetFieldValue('custrecord127') == 'T')
  			{
  				get_latest_emissions();
  			}
  		break;
  		case 'custrecord115':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord115'),1);
  			nlapiSetFieldValue('custrecord121',emm,false);
  			update_co2_total();
  		break;
  		case 'custrecord116':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord116'),2);
  			nlapiSetFieldValue('custrecord122',emm,false);
  			update_co2_total();
  		break;
   		case 'custrecord117':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord117'),3);
  			nlapiSetFieldValue('custrecord123',emm,false);
  			update_co2_total();
  		break;
    	case 'custrecord118':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord118'),4);
  			nlapiSetFieldValue('custrecord124',emm,false);
  			update_co2_total();
  		break;
  		case 'custrecord119':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord119'),5);
  			nlapiSetFieldValue('custrecord125',emm,false);
  			update_co2_total();
  		break;
  		case 'custrecord114':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord114'),6);
  			nlapiSetFieldValue('custrecord126',emm,false);
  			update_co2_total();
  		break;
  		case 'custrecord129':
  			var emm = calc_emissions(nlapiGetFieldValue('custrecord114'),6);
  			nlapiSetFieldValue('custrecord126',emm,false);
  			update_co2_total();
  		break;  		
  	}	
	
	check_final();
  	
}

function update_co2_total()
{
	var em_dom = parseFloat(nlapiGetFieldValue('custrecord121'));
	var em_short = parseFloat(nlapiGetFieldValue('custrecord122'));
	var em_long = parseFloat(nlapiGetFieldValue('custrecord123'));
	var em_hire = parseFloat(nlapiGetFieldValue('custrecord124'));
	var em_rail = parseFloat(nlapiGetFieldValue('custrecord125'));
	var em_own = parseFloat(nlapiGetFieldValue('custrecord126'));
	
	if (isNaN(em_dom))
	{
		em_dom = 0;
	}	
	if (isNaN(em_short))
	{
		em_short = 0;
	}
	if (isNaN(em_long))
	{
		em_long = 0;
	}	
	if (isNaN(em_hire))
	{
		em_hire = 0;
	}
	if (isNaN(em_rail))
	{
		em_rail = 0;
	}	
	if (isNaN(em_own))
	{
		em_own = 0;
	}
	
	var total = em_dom + em_short + em_long + em_hire + em_rail + em_own;
	var total2 = Math.round(total);
	nlapiSetFieldValue('custrecord128',total2,false);
}

function calc_emissions(mileage,type)
{
	var mile_km = 1.6093;
	var emissions = 0;
	var emissions2 = 0;
	
	var km;
	var emi;
	
	km = mileage * mile_km;
	
	switch(type)
	{
		case 1:
			var dom = nlapiGetFieldValue('custrecord107');
			var uplift = nlapiGetFieldValue('custrecord110');
			emissions = (km * dom) * uplift;
			emissions2 = Math.round(emissions);
		break;
		case 2:
			var dom = nlapiGetFieldValue('custrecord108');
			var uplift = nlapiGetFieldValue('custrecord110');
			emissions = (km * dom) * uplift;
			emissions2 = Math.round(emissions);
		break;
		case 3:
			var dom = nlapiGetFieldValue('custrecord109');
			var uplift = nlapiGetFieldValue('custrecord110');
			emissions = (km * dom) * uplift;
			emissions2 = Math.round(emissions);
		break;
		case 4:
			var dom = nlapiGetFieldValue('custrecord111');
			emissions = (km * dom);
			emissions2 = Math.round(emissions);
		break;
		case 5:
			var dom = nlapiGetFieldValue('custrecord112');
			emissions = (km * dom);
			emissions2 = Math.round(emissions);
		break;
		case 6:
			var dom = nlapiGetFieldValue('custrecord113');
			emissions = (km * dom * 0.001);
			emissions2 = Math.round(emissions);
		break;	
	}

	return emissions2;
}

function get_latest_emissions()
{
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'name');
	columns[1] = new nlobjSearchColumn( 'custrecord106');

	var searchresults = nlapiSearchRecord( 'customrecord32', null, null, columns );

	for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
	{		
		var searchresult = searchresults[ i ];
		var tname = searchresult.getValue( 'name' );
		var temm = searchresult.getValue( 'custrecord106' );
		
		switch(tname)
		{
			case 'Domestic Flight':
  				nlapiSetFieldValue('custrecord107',temm,false);
  			break;
  			case 'Hire Car':
  				nlapiSetFieldValue('custrecord111',temm,false);
  			break;
  			case 'Long Haul Flight':
  				nlapiSetFieldValue('custrecord109',temm,false);
  			break;
  			case 'Rail':
  				nlapiSetFieldValue('custrecord112',temm,false);
  			break;
  			case 'Short Haul Flight':
  				nlapiSetFieldValue('custrecord108',temm,false);
  			break;
  			case 'Uplift Factor':
  				nlapiSetFieldValue('custrecord110',temm,false);
  			break;		
		}
		
		
	}
}

function check_final()
{
	var vetotype = nlapiGetFieldValue('custrecord35');
	var vetotonnes = nlapiGetFieldValue('custrecord36');
	var vetodate = nlapiGetFieldValue('custrecord37');
  	var regquery = nlapiGetFieldValue('custrecord62');
  	var regtype = nlapiGetFieldValue('custrecord88');
  	var regtonnes = nlapiGetFieldValue('custrecord87');
  	var regdate = nlapiGetFieldValue('custrecord73');
  	var opinup = nlapiGetFieldValue('custrecord64');
  	var opintype = nlapiGetFieldValue('custrecord67');
  	var opintonnes = nlapiGetFieldValue('custrecord69');
  	var opindate = nlapiGetFieldValue('custrecord68');
  	var finaltype = nlapiGetFieldValue('custrecord70');
  	var finaltonnes = nlapiGetFieldValue('custrecord71');
  	var finaldate = nlapiGetFieldValue('custrecord72');
  	
	if (regquery == 'F' && opinup == 'F')
	{
		finaltype = vetotype;
		finaltonnes = vetotonnes;
		finaldate = vetodate;
	}
	else
	{
	
		if(opinup == 'T')
		{
			finaltype = opintype;
			finaltonnes = opintonnes;
			finaldate = opindate;
		}
		else
		{
			finaltype = regtype;
			finaltonnes = regtonnes;
			finaldate = regdate;
		}
	
	}
  
	nlapiSetFieldValue('custrecord70',finaltype,false);
	nlapiSetFieldValue('custrecord71',finaltonnes,false);
	nlapiSetFieldValue('custrecord72',finaldate,false);  	
  	
  	
}

function return_date()
{

	var date_next_full = nlapiStringToDate(nlapiGetFieldValue('custrecord86'));
	var todays_date = padout(date_next_full.getDate()) + '/' + padout(date_next_full.getMonth() +1) + '/' + y2k(date_next_full.getYear());

	return todays_date;
}

function y2k(number) { return (number < 1000) ? number + 1900 : number; }
function padout(number) { return (number < 10) ? '0' + number : number; }

