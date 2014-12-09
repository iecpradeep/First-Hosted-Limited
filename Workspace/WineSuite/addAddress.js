function addShipping() {
	var custid = nlapiGetRecordId();
	
	try {
		var customer = nlapiLoadRecord('lead', custid);
	} catch(e){ return; }

	var custentity_bil_address1 = customer.getFieldValue('custentity_bil_address1');
	var custentity_bil_fullname_bill = customer.getFieldValue('custentity_bil_fullname_bill');
	var custentity_shippingtype = customer.getFieldValue('custentity_shippingtype');
	var custentity_shippingmethod = customer.getFieldValue('custentity_shippingmethod');
	var custentity1 = customer.getFieldValue('custentity1');
	var custentity1Text = customer.getFieldText('custentity1');
	var custentity_warehousename = customer.getFieldValue('custentity_warehousename');
	var altphone = customer.getFieldValue('altphone');
	
	if( custid != undefined && custid != null && custid != '' && custentity_bil_fullname_bill && custentity_bil_fullname_bill!="") {
		customer.setFieldValue('entitystatus',13);
		customer.setFieldValue('terms','1');
		customer.setFieldValue('creditlimit','1000');
		customer.setFieldValue('custentity_cust_source','9');
		customer.setFieldValue('emailtransactions','F');
		
		customer.setFieldValue('shippingitem',custentity_shippingmethod);
		if(custentity_shippingtype == 2) {
			for(var a = 1; a <= customer.getLineItemCount('addressbook'); a++) {
				if(customer.getLineItemValue('addressbook', 'defaultbilling', a) == "T") {
					customer.selectLineItem('addressbook', a);
					customer.setCurrentLineItemValue('addressbook', 'defaultshipping', "T");
					customer.setCurrentLineItemValue('addressbook', 'addressee', customer.getFieldValue('custentity_bil_fullname_bill'));
					customer.commitLineItem('addressbook');
				}
			}
			
		} else if(custid != undefined && custid != null && custid != '' && custentity_bil_address1 && custentity_bil_address1!="")	{
			
			customer.selectNewLineItem('addressbook');
			customer.setCurrentLineItemValue('addressbook', 'addr1', customer.getFieldValue('custentity_bil_address1'));
			customer.setCurrentLineItemValue('addressbook', 'addr2', customer.getFieldValue('custentity_bil_address2'));
			customer.setCurrentLineItemValue('addressbook', 'addressee',  customer.getFieldValue('custentity_bil_fullname_ship'));
			customer.setCurrentLineItemValue('addressbook', 'city', customer.getFieldValue('custentity_bil_city'));
			customer.setCurrentLineItemValue('addressbook', 'state',  customer.getFieldValue('custentity_bil_state'));
			customer.setCurrentLineItemValue('addressbook', 'country', cCodes[customer.getFieldText('custentity_bil_country')]);
	
			var zip = customer.getFieldValue('custentity_bil_zip');
			
			if(zip == undefined || zip == null) zip = '';
	
			customer.setCurrentLineItemValue('addressbook', 'zip', zip);
	
			var phone = customer.getFieldValue('custentity_bil_phone');
	
			if(phone == undefined || phone == null)	phone =  customer.getFieldValue('phone');
	
			customer.setCurrentLineItemValue('addressbook', 'phone', phone);
			customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
			customer.commitLineItem('addressbook');
	
			for(var a = 1; a <= customer.getLineItemCount('addressbook'); a++) {
				if(customer.getLineItemValue('addressbook', 'defaultbilling', a) == "T") {
					customer.selectLineItem('addressbook', a);
					//if(altphone)
					//customer.setCurrentLineItemValue('addressbook', 'phone', altphone);
					customer.setCurrentLineItemValue('addressbook', 'addressee', customer.getFieldValue('custentity_bil_fullname_bill'));
					customer.commitLineItem('addressbook');
				}
			}
	
			
			
		}
		
		
		try {
				nlapiSubmitRecord(customer, true,true);
				if(custentity_shippingtype == 2 && custentity1) {
					var customerbonddetails = nlapiCreateRecord("customrecord_custbonddetails");
					customerbonddetails.setFieldValue("name",custentity1Text);
					customerbonddetails.setFieldValue("custrecord_bondwarehouse",custentity1);
					customerbonddetails.setFieldValue("custrecord_customername",custid);
					customerbonddetails.setFieldValue("custrecord2",custentity_warehousename);
					nlapiSubmitRecord(customerbonddetails);
				}
			} catch(e){ nlapiLogExecution('ERROR', 'customer error', e); }
	
	}
}

function jobTitleContact()
{

			
		email=nlapiGetFieldValue('email');

		var filters1 = new Array();
		filters1[0] = new nlobjSearchFilter ('email', null, 'is', email);
		
		var columns1 = new Array();
		columns1[0] = new nlobjSearchColumn('custentity_contact_title');						
		
		var searchResults1 = nlapiSearchRecord('customer', null, filters1, columns1);
		if(searchResults1 != null)
		{
			for(var i=0; i < searchResults1.length ;i++)
			{
				var jobtitle = 	searchResults1[i].getValue('custentity_contact_title');	
			}
		}	
				
		nlapiSetFieldValue('title', jobtitle);
	
}

var cCodes = new Array();
cCodes['Afghanistan'] = 'AF';
cCodes['Albania'] = 'AL';
cCodes['Algeria'] = 'DZ';
cCodes['American Samoa'] = 'AS';
cCodes['Andorra'] = 'AD';
cCodes['Angola'] = 'AO';
cCodes['Anguilla'] = 'AI';
cCodes['Antarctica'] = 'AQ';
cCodes['Antigua and Barbuda'] = 'AG';
cCodes['Argentina'] = 'AR';
cCodes['Armenia'] = 'AM';
cCodes['Aruba'] = 'AW';
cCodes['Australia'] = 'AU';
cCodes['Austria'] = 'AT';
cCodes['Azerbaijan'] = 'AZ';
cCodes['Bahamas'] = 'BS';
cCodes['Bahrain'] = 'BH';
cCodes['Bangladesh'] = 'BD';
cCodes['Barbados'] = 'BB';
cCodes['Belarus'] = 'BY';
cCodes['Belgium'] = 'BE';
cCodes['Belize'] = 'BZ';
cCodes['Benin'] = 'BJ';
cCodes['Bermuda'] = 'BM';
cCodes['Bhutan'] = 'BT';
cCodes['Bolivia'] = 'BO';
cCodes['Bosnia and Herzegovina'] = 'BA';
cCodes['Botswana'] = 'BW';
cCodes['Bouvet Island'] = 'BV';
cCodes['Brazil'] = 'BR';
cCodes['British Indian Ocean Territory'] = 'IO';
cCodes['Brunei Darussalam'] = 'BN';
cCodes['Bulgaria'] = 'BG';
cCodes['Burkina Faso'] = 'BF';
cCodes['Burundi'] = 'BI';
cCodes['Cambodia'] = 'KH';
cCodes['Cameroon'] = 'CM';
cCodes['Canada'] = 'CA';
cCodes['Cap Verde'] = 'CV';
cCodes['Cayman Islands'] = 'KY';
cCodes['Central African Republic'] = 'CF';
cCodes['Chad'] = 'TD';
cCodes['Chile'] = 'CL';
cCodes['China'] = 'CN';
cCodes['Christmas Island'] = 'CX';
cCodes['Cocos (Keeling) Islands'] = 'CC';
cCodes['Colombia'] = 'CO';
cCodes['Comoros'] = 'KM';
cCodes['Congo, Democratic People\'s Republic'] = 'CD';
cCodes['Congo, Republic of'] = 'CG';
cCodes['Cook Islands'] = 'CK';
cCodes['Costa Rica'] = 'CR';
cCodes['Cote d\'Ivoire'] = 'CI';
cCodes['Croatia/Hrvatska'] = 'HR';
cCodes['Cuba'] = 'CU';
cCodes['Cyprus'] = 'CY';
cCodes['Czech Republic'] = 'CZ';
cCodes['Denmark'] = 'DK';
cCodes['Djibouti'] = 'DJ';
cCodes['Dominica'] = 'DM';
cCodes['Dominican Republic'] = 'DO';
cCodes['East Timor'] = 'TP';
cCodes['Ecuador'] = 'EC';
cCodes['Egypt'] = 'EG';
cCodes['El Salvador'] = 'SV';
cCodes['Equatorial Guinea'] = 'GQ';
cCodes['Eritrea'] = 'ER';
cCodes['Estonia'] = 'EE';
cCodes['Ethiopia'] = 'ET';
cCodes['Falkland Islands (Malvina)'] = 'FK';
cCodes['Faroe Islands'] = 'FO';
cCodes['Fiji'] = 'FJ';
cCodes['Finland'] = 'FI';
cCodes['France'] = 'FR';
cCodes['French Guiana'] = 'GF';
cCodes['French Polynesia'] = 'PF';
cCodes['French Southern Territories'] = 'TF';
cCodes['Gabon'] = 'GA';
cCodes['Gambia'] = 'GM';
cCodes['Georgia'] = 'GE';
cCodes['Germany'] = 'DE';
cCodes['Ghana'] = 'GH';
cCodes['Gibraltar'] = 'GI';
cCodes['Greece'] = 'GR';
cCodes['Greenland'] = 'GL';
cCodes['Grenada'] = 'GD';
cCodes['Guadeloupe'] = 'GP';
cCodes['Guam'] = 'GU';
cCodes['Guatemala'] = 'GT';
cCodes['Guernsey'] = 'GG';
cCodes['Guinea'] = 'GN';
cCodes['Guinea-Bissau'] = 'GW';
cCodes['Guyana'] = 'GY';
cCodes['Haiti'] = 'HT';
cCodes['Heard and McDonald Islands'] = 'HM';
cCodes['Holy See (City Vatican State)'] = 'VA';
cCodes['Honduras'] = 'HN';
cCodes['Hong Kong'] = 'HK';
cCodes['Hungary'] = 'HU';
cCodes['Iceland'] = 'IS';
cCodes['India'] = 'IN';
cCodes['Indonesia'] = 'ID';
cCodes['Iran (Islamic Republic of)'] = 'IR';
cCodes['Iraq'] = 'IQ';
cCodes['Ireland'] = 'IE';
cCodes['Isle of Man'] = 'IM';
cCodes['Israel'] = 'IL';
cCodes['Italy'] = 'IT';
cCodes['Jamaica'] = 'JM';
cCodes['Japan'] = 'JP';
cCodes['Jersey'] = 'JE';
cCodes['Jordan'] = 'JO';
cCodes['Kazakhstan'] = 'KZ';
cCodes['Kenya'] = 'KE';
cCodes['Kiribati'] = 'KI';
cCodes['Korea, Democratic People\'s Republic'] = 'KP';
cCodes['Korea, Republic of'] = 'KR';
cCodes['Kuwait'] = 'KW';
cCodes['Kyrgyzstan'] = 'KG';
cCodes['Lao People\'s Democratic Republic'] = 'LA';
cCodes['Latvia'] = 'LV';
cCodes['Lebanon'] = 'LB';
cCodes['Lesotho'] = 'LS';
cCodes['Liberia'] = 'LR';
cCodes['Libyan Arab Jamahiriya'] = 'LY';
cCodes['Liechtenstein'] = 'LI';
cCodes['Lithuania'] = 'LT';
cCodes['Luxembourg'] = 'LU';
cCodes['Macau'] = 'MO';
cCodes['Macedonia'] = 'MK';
cCodes['Madagascar'] = 'MG';
cCodes['Malawi'] = 'MW';
cCodes['Malaysia'] = 'MY';
cCodes['Maldives'] = 'MV';
cCodes['Mali'] = 'ML';
cCodes['Malta'] = 'MT';
cCodes['Marshall Islands'] = 'MH';
cCodes['Martinique'] = 'MQ';
cCodes['Mauritania'] = 'MR';
cCodes['Mauritius'] = 'MU';
cCodes['Mayotte'] = 'YT';
cCodes['Mexico'] = 'MX';
cCodes['Micronesia, Federal State of'] = 'FM';
cCodes['Moldova, Republic of'] = 'MD';
cCodes['Monaco'] = 'MC';
cCodes['Mongolia'] = 'MN';
cCodes['Montenegro'] = 'ME';
cCodes['Montserrat'] = 'MS';
cCodes['Morocco'] = 'MA';
cCodes['Mozambique'] = 'MZ';
cCodes['Myanmar'] = 'MM';
cCodes['Namibia'] = 'NA';
cCodes['Nauru'] = 'NR';
cCodes['Nepal'] = 'NP';
cCodes['Netherlands'] = 'NL';
cCodes['Netherlands Antilles'] = 'AN';
cCodes['New Caledonia'] = 'NC';
cCodes['New Zealand'] = 'NZ';
cCodes['Nicaragua'] = 'NI';
cCodes['Niger'] = 'NE';
cCodes['Nigeria'] = 'NG';
cCodes['Niue'] = 'NU';
cCodes['Norfolk Island'] = 'NF';
cCodes['Northern Mariana Islands'] = 'MP';
cCodes['Norway'] = 'NO';
cCodes['Oman'] = 'OM';
cCodes['Pakistan'] = 'PK';
cCodes['Palau'] = 'PW';
cCodes['Palestinian Territories'] = 'PS';
cCodes['Panama'] = 'PA';
cCodes['Papua New Guinea'] = 'PG';
cCodes['Paraguay'] = 'PY';
cCodes['Peru'] = 'PE';
cCodes['Philippines'] = 'PH';
cCodes['Pitcairn Island'] = 'PN';
cCodes['Poland'] = 'PL';
cCodes['Portugal'] = 'PT';
cCodes['Puerto Rico'] = 'PR';
cCodes['Qatar'] = 'QA';
cCodes['Reunion Island'] = 'RE';
cCodes['Romania'] = 'RO';
cCodes['Russian Federation'] = 'RU';
cCodes['Rwanda'] = 'RW';
cCodes['Saint Barthelemy'] = 'BL';
cCodes['Saint Kitts and Nevis'] = 'KN';
cCodes['Saint Lucia'] = 'LC';
cCodes['Saint Martin'] = 'MF';
cCodes['Saint Vincent and the Grenadines'] = 'VC';
cCodes['San Marino'] = 'SM';
cCodes['Sao Tome and Principe'] = 'ST';
cCodes['Saudi Arabia'] = 'SA';
cCodes['Senegal'] = 'SN';
cCodes['Serbia'] = 'CS';
cCodes['Seychelles'] = 'SC';
cCodes['Sierra Leone'] = 'SL';
cCodes['Singapore'] = 'SG';
cCodes['Slovak Republic'] = 'SK';
cCodes['Slovenia'] = 'SI';
cCodes['Solomon Islands'] = 'SB';
cCodes['Somalia'] = 'SO';
cCodes['South Africa'] = 'ZA';
cCodes['South Georgia'] = 'GS';
cCodes['Spain'] = 'ES';
cCodes['Sri Lanka'] = 'LK';
cCodes['St. Helena'] = 'SH';
cCodes['St. Pierre and Miquelon'] = 'PM';
cCodes['Sudan'] = 'SD';
cCodes['Suriname'] = 'SR';
cCodes['Svalbard and Jan Mayen Islands'] = 'SJ';
cCodes['Swaziland'] = 'SZ';
cCodes['Sweden'] = 'SE';
cCodes['Switzerland'] = 'CH';
cCodes['Syrian Arab Republic'] = 'SY';
cCodes['Taiwan'] = 'TW';
cCodes['Tajikistan'] = 'TJ';
cCodes['Tanzania'] = 'TZ';
cCodes['Thailand'] = 'TH';
cCodes['Togo'] = 'TG';
cCodes['Tokelau'] = 'TK';
cCodes['Tonga'] = 'TO';
cCodes['Trinidad and Tobago'] = 'TT';
cCodes['Tunisia'] = 'TN';
cCodes['Turkey'] = 'TR';
cCodes['Turkmenistan'] = 'TM';
cCodes['Turks and Caicos Islands'] = 'TC';
cCodes['Tuvalu'] = 'TV';
cCodes['Uganda'] = 'UG';
cCodes['Ukraine'] = 'UA';
cCodes['United Arab Emirates'] = 'AE';
cCodes['United Kingdom (GB)'] = 'GB';
cCodes['United States'] = 'US';
cCodes['Uruguay'] = 'UY';
cCodes['US Minor Outlying Islands'] = 'UM';
cCodes['Uzbekistan'] = 'UZ';
cCodes['Vanuatu'] = 'VU';
cCodes['Venezuela'] = 'VE';
cCodes['Vietnam'] = 'VN';
cCodes['Virgin Islands (British)'] = 'VG';
cCodes['Virgin Islands (USA)'] = 'VI';
cCodes['Wallis and Futuna Islands'] = 'WF';
cCodes['Western Sahara'] = 'EH';
cCodes['Western Samoa'] = 'WS';
cCodes['Yemen'] = 'YE';
cCodes['Zambia'] = 'ZM';
cCodes['Zimbabwe'] = 'ZW';