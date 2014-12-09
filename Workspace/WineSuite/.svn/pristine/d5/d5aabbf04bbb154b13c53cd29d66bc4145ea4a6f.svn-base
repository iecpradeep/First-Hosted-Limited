function formatCurrency(num) {
num = num.toString().replace(/\$|\,/g,'');
if(isNaN(num))
num = "0";
sign = (num == (num = Math.abs(num)));
num = Math.floor(num*100+0.50000000001);
cents = num%100;
num = Math.floor(num/100).toString();
if(cents<10)
cents = "0" + cents;
for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
num = num.substring(0,num.length-(4*i+3))+','+
num.substring(num.length-(4*i+3));
return (((sign)?'':'-') + num + '.' + cents);
}




//llama a la busqueda de items
function getWhatsNewItems(params)
{
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	if(moneySymbol == 1)
	{
		moneySymbol = '&pound;';
		if(targetCurrency == "")
		{
			targetCurrency = 'GBP';
		}
	}
	if(moneySymbol == 2)
	{
		moneySymbol = '&#36;';
		if(targetCurrency == "")
		{
			targetCurrency = 'USD';
		}
	}
	if(moneySymbol == 3)
	{
		moneySymbol = '&euro;';
		if(targetCurrency == "")
		{
			targetCurrency = 'EUR';
		}
	}
	if(moneySymbol == 4)
	{
		moneySymbol = 'sFr.';
		if(targetCurrency == "")
		{
			targetCurrency = 'CHF';
		}
	}
	if(moneySymbol == 5)
	{
		moneySymbol = 'HK$';
		if(targetCurrency == "")
		{
			targetCurrency = 'HKD';
		}
	}
	var exchangeRate = 0;
	if(targetCurrency != "")
	{
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	
	
	content = "";
	//content = '<div class="content">';
	//content += '<div class="slide"><img src="/site/images/lhk-wines.jpg" /></div>';
	
	content += '<div class="news">';
	content += '<div class="title"><a href="http://shopping.netsuite.com/s.nl/c.1336541/it.I/id.8/.f" style="color:#8E194D;text-decoration:none;" >What&rsquo;s New?</a> <img src="/site/images/little-bullet.jpg" /> <span><a href="http://shopping.netsuite.com/s.nl/c.1336541/it.I/id.8/.f" style="color:#8E194D;text-decoration:none;">View our latest releases here</a></span></div>';
	content += '<div class="news-contet">';
	
	//var filters = new Array();	
	var itemsList = nlapiSearchRecord('item', 54);// Make the search
	var c = new Array();
	c.push(new nlobjSearchColumn('custrecord_review_reviewer'));
	c.push(new nlobjSearchColumn('custrecord_review_details'));
	c.push(new nlobjSearchColumn('custrecord_review_score'));

	if(itemsList != null && itemsList != undefined)
	{		
		for(var i = 0; i < 4 && i < itemsList.length; i++) {
			var columns = itemsList[i].getAllColumns();
		
			var filters = new Array();		
			filters[0]= new nlobjSearchFilter('custrecord_review_wine', null, 'is',  itemsList[i].getValue(columns[11])); 
		
			var searchrev = nlapiSearchRecord('customrecord_review',null,filters, c);
			if(!searchrev &&  itemsList[i].getValue(columns[13])) {
				filters[0]= new nlobjSearchFilter('custrecord_review_wine', null, 'is',  itemsList[i].getValue(columns[13])); 
				searchrev = nlapiSearchRecord('customrecord_review',null,filters, c);
				
			}
			
			if(searchrev && searchrev.length > 1)
			{
					searchrev.sort(
						function(a,b){ 
							aval = a.getValue('custrecord_review_score');
							if(a.getValue('custrecord_review_score').indexOf("-"))
								aval = a.getValue('custrecord_review_score').substring(a.getValue('custrecord_review_score').indexOf("-")+1);
								
							if(b.getValue('custrecord_review_score').indexOf("-"))
								bval = b.getValue('custrecord_review_score').substring(b.getValue('custrecord_review_score').indexOf("-")+1);
								
							return parseInt(bval,10) - parseInt(aval,10);
						}
					);
			}
			
			
			
			content += '<div class="cell">';
			if(itemsList[i].getValue(columns[12]) != "")
			{				
				img = itemsList[i].getValue(columns[12]);
				content += '<div class="imga" ><a href="'+itemsList[i].getValue(columns[10])+'"><img border="0" src="' + img + '" width="159" height="170" /></a></div>';
					
			}
			else
			{
				content += '<div class="imga" ><a href="'+itemsList[i].getValue(columns[10])+'"><img border="0" src="/core/media/media.nl?id=90&c=1336541&h=32445535e21bfc895cec"/></a></div>';
			}			
			
			price = itemsList[i].getValue(columns[3]);
			
			descs = itemsList[i].getValue(columns[7]);

			var uom = itemsList[i].getValue(columns[6])
		
			var multiple = 1;			
			
			if(uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
			
			}
			if(exchangeRate != 0)
			{
				price =  parseFloat(price) * exchangeRate;
			}	
			newprice = parseFloat(price)*parseFloat(multiple);

			if(descs) {
				var maxLength = 85; // maximum number of characters to extract
	
				//trim the string to the maximum length
				trimstring = descs.replace(/(<([^>]+)>)/ig,"").substr(0, maxLength);
	
				//re-trim if we are in the middle of a word
				desc = trimstring;
				if(descs.length > 85)
					desc = trimstring.substr(0, Math.min(trimstring.length, trimstring.lastIndexOf(" ")));
				
				if(descs.length >  desc.length) {
						desc += '...';
				}

			} else {
				desc = 	"";
			}
			content += '<div class="cell-text">';
			content += '<div class="title"><a href="'+itemsList[i].getValue(columns[10])+'" style="color:#8E194D;text-decoration:none;" >' + itemsList[i].getValue(columns[0]) + '</a></div>';
			content += '<div class="desc">' + desc + '</div>';
			if(searchrev && searchrev[0]) {
				maxRev = 55;
				reviews = searchrev[0].getValue('custrecord_review_details');
				trimrev = reviews.substr(0, maxRev);
				review = trimrev;
				if(reviews.length > 55)
					review = trimrev.substr(0, Math.min(trimrev.length, trimrev.lastIndexOf(" ")));
				if(reviews.length >  review.length) {
						review += '...';
				}
				content += '<div class="text"><b>'+searchrev[0].getText('custrecord_review_reviewer')+ '/Score:&nbsp;'+ searchrev[0].getValue('custrecord_review_score') + '</b><br>' + review+'</div>';
				
			}
			content += '<div class="price-buy">';
			if(multiple > 1) {			
				content += '<div class="price">' + moneySymbol + formatCurrency(Math.round(newprice))+' per case of '+multiple+ '&nbsp;</div>';		
			} else {
				content += '<div class="price">' + moneySymbol + formatCurrency(Math.round(newprice))+' per '+uom.split(" ")[0]+' &nbsp;</div>';
			}
			content += '</div>';
			content += '<div class="buy"><a href="' + itemsList[i].getValue(columns[10]) + '" class="call-to-action_button-whatsnew" >BUY NOW</a></div>';
			content += '</div>';
			content += '</div>';
		}
	}
	content += '</div>';
	
	content += '</div>';
	content += '<div class="content-footer">';
	content += '<div class="email2">';
	content += '<div class="title2">Email Sign Up</div>';
	content += '<div class="desc">Sign up to receive exclusive discounts and promotions by e-mail</div>';
    content += '<div class="form">';
    content += '<input type="text" class="typename" value="Name:" id="cname" onBlur="setDefault(this);" onFocus="clearDefault(this);" />';
	content += '<input onBlur="if (this.checkvalid == true) {this.isvalid=validate_field(this,\'email\',false,false);} if (this.isvalid == false) { selectAndFocusField(this); return this.isvalid;}setDefault(this);" id="email" maxlength="300" style="; ime-mode:disabled" onChange="setWindowChanged(window, true);this.isvalid=validate_field(this,\'email\',true,false);this.checkvalid=false;if (this.isvalid) {if (window.isinited && this.isvalid) checkemailaccess(-1); else window.warnemailaccess=false;;}if (!this.isvalid) { selectAndFocusField(this);}return this.isvalid;" name="email" class="typemail" onFocus="clearDefault(this);if (this.isvalid == true || this.isvalid == false) this.checkvalid=true;" type="text" size="-1" value="E-mail:">';
	content += '<br><input type="button" class="submit-email" id="signupbtn" />';	
    content += '</div>';
	content += '</div>';
	content += '<div id="exchangeRateValue" style="display:none">' + exchangeRate + '</div>'
		
	response.write(content);		
}



