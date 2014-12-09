// JavaScript Document
/*Accepts a Javascript Date object as the parameter;
  outputs an RFC822-formatted datetime string. */
  function GetRFC822Date(oDate)
  {
    var aMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    
    var aDays = new Array( "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    var dtm = new String();
			
    dtm = aDays[oDate.getDay()] + ", ";
    dtm += padWithZero(oDate.getDate()) + " ";
    dtm += aMonths[oDate.getMonth()] + " ";
    dtm += oDate.getFullYear() + " ";
    dtm += padWithZero(oDate.getHours()) + ":";
    dtm += padWithZero(oDate.getMinutes()) + ":";
    dtm += padWithZero(oDate.getSeconds()) + " " ;
    dtm += getTZOString(oDate.getTimezoneOffset());
    return dtm;
  }
  //Pads numbers with a preceding 0 if the number is less than 10.
  function padWithZero(val)
  {
    if (parseInt(val) < 10)
    {
      return "0" + val;
    }
    return val;
  }

  /* accepts the client's time zone offset from GMT in minutes as a parameter.
  returns the timezone offset in the format [+|-}DDDD */
  function getTZOString(timezoneOffset)
  {
    var hours = Math.floor(timezoneOffset/60);
    var modMin = Math.abs(timezoneOffset%60);
    var s = new String();
    s += (hours > 0) ? "-" : "+";
    var absHours = Math.abs(hours)
    s += (absHours < 10) ? "0" + absHours :absHours;
    s += ((modMin == 0) ? "00" : modMin);
    return(s);
  }
  
  
function SCHD_createrssxml() {
	
	/*
		TYPES:
			1	- WHATS NEW
			2 	- LATEST OFFERS
	*/
	var type = nlapiGetContext().getSetting('SCRIPT', 'custscript_type');
	var pubdate =  new Date();
	pubdate = GetRFC822Date(pubdate);
	var xmlcontents = '<?xml version="1.0"?>';
	xmlcontents += '<rss version="2.0">';
	xmlcontents += '<channel>';
	var xmltitle = "whatsnewrss";
	
	if(type == 1) {
		xmlcontents += '<title>What\'s New</title>';
		xmlcontents += '<link>http://shopping.netsuite.com/s.nl/c.1336541/it.I/id.8/.f</link>';
		xmlcontents += '<description>Here at LHK we are regularly on the lookout for new and interesting wines. Whether it\'s a Grand Cru Bordeaux, an exciting Villages Burgundy or a new release from one of our favourite New World producers, there\'s regularly something new that could be of interest to even the most hesitant of buyers!</description>';
	
		var options = new Object(); 
		options.filters = new Array(); // Array of search filters (NS)	
		options.filters.push(new nlobjSearchFilter("custitem_whatsnew", null, 'is', "T"));
		var mySearch=38	
		var itemsList = nlapiSearchRecord('item', mySearch, options.filters) // make search
		var previd = 0;
		if(itemsList != null && itemsList != undefined)
		{
			for(var i = itemsList.length - 1; i >= 0; i--) {
				var columns = itemsList[i].getAllColumns();
				
				if(previd == itemsList[i].getValue(columns[0])) continue;
				previd = itemsList[i].getValue(columns[0]);
				title = nlapiEscapeXML(itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ', ' + itemsList[i].getText(columns[14])));
				links = nlapiEscapeXML(itemsList[i].getValue(columns[18]));
				desc = itemsList[i].getValue(columns[32]);
				datecreated = GetRFC822Date(nlapiStringToDate(itemsList[i].getValue(columns[33])));
				//nlapiLogExecution('ERROR', 'desc',desc);
				if(desc)
					desc = nlapiEscapeXML(desc.replace(/(<([^>]+)>)/ig,""));
				xmlcontents += '<item>';
				xmlcontents += '<title>'+title+'</title>';
				xmlcontents += '<link>'+links+'</link>';
				xmlcontents += '<description>'+desc+'</description>';
				xmlcontents += '<pubDate>'+datecreated+'</pubDate>';
				//xmlcontents += '<guid>'+links+'</guid>';
			 	xmlcontents += '</item>';
			}
		}
	} else {
		xmltitle = "latestoffers";
		xmlcontents += '<title>Latest Offers</title>';
		xmlcontents += '<link>http://shopping.netsuite.com/s.nl/c.1336541/sc.15/category.-115/it.C/.f</link>';
		xmlcontents += '<description>As part of our efforts to continually offer something a little different along with striving to offer wines at very competitive prices, we scour the globe hunting down new deals which we can pass on to our customers. Here at LHK we believe that special offers are only worth advertising when they are indeed special. Therefore, below is a selection of our latest special offers - updated regularly, typically varied in terms of both style and origin of the wine and hopefully always something a bit special! Latest additions to our special offers will also be available via our RSS feed, so sign up using the quicklink on the left and ensure you\'re always kept up to date on what\'s new and exciting.</description>';		
		var itemsList = nlapiSearchRecord('sitecategory', 198,null)
		if(itemsList) {
			for(var i = 0; i < itemsList.length; i++) {
				var columns = itemsList[i].getAllColumns();
				title = nlapiEscapeXML(itemsList[i].getValue(columns[1]));
				links = "http://shopping.netsuite.com/s.nl/c.1336541/sc.15/category."+itemsList[i].getValue(columns[0])+"/.f"
				desc = itemsList[i].getValue(columns[4]);
				/*datecreated = GetRFC822Date(nlapiStringToDate(itemsList[i].getValue(columns[5])));*/
				//nlapiLogExecution('ERROR', 'desc',desc);
				if(desc)
					desc = nlapiEscapeXML(desc.replace(/(<([^>]+)>)/ig,""));
				xmlcontents += '<item>';
				xmlcontents += '<title>'+title+'</title>';
				xmlcontents += '<link>'+links+'</link>';
				xmlcontents += '<description>'+desc+'</description>';
				/*xmlcontents += '<pubDate>'+datecreated+'</pubDate>';*/
				//xmlcontents += '<guid>'+links+'</guid>';
				xmlcontents += '</item>';
			}
		}
	}
	xmlcontents += '</channel>';
	xmlcontents += '</rss>';
	var file = nlapiCreateFile(xmltitle	+'.xml', 'XMLDOC',xmlcontents);
	file.setFolder("1810");

	nlapiSubmitFile(file);
	
}

function SLT_getRSS(){
	var type = nlapiGetContext().getSetting('SCRIPT', 'custscript_xmltype');
	nlapiLogExecution('ERROR', 'type'," type:"+ type);
	var pubdate =  new Date();
	pubdate = GetRFC822Date(pubdate);
	var xmlcontents = '<?xml version="1.0"?>';
	xmlcontents += '<rss version="2.0">';
	xmlcontents += '<channel>';
	var xmltitle = "whatsnewrss";
	
	if(type == 1) {
		xmlcontents += '<title>What\'s New</title>';
		xmlcontents += '<link>http://shopping.netsuite.com/s.nl/c.1336541/it.I/id.8/.f</link>';
		xmlcontents += '<description>Here at LHK we are regularly on the lookout for new and interesting wines. Whether it\'s a Grand Cru Bordeaux, an exciting Villages Burgundy or a new release from one of our favourite New World producers, there\'s regularly something new that could be of interest to even the most hesitant of buyers!</description>';
	
		var options = new Object(); 
		options.filters = new Array(); // Array of search filters (NS)	
		options.filters.push(new nlobjSearchFilter("custitem_whatsnew", null, 'is', "T"));
		var mySearch=38	
		var itemsList = nlapiSearchRecord('item', mySearch, options.filters) // make search
		var previd = 0;
		if(itemsList != null && itemsList != undefined)
		{
			for(var i = itemsList.length - 1; i >= 0; i--) {
				var columns = itemsList[i].getAllColumns();
				
				if(previd == itemsList[i].getValue(columns[0])) continue;
				previd = itemsList[i].getValue(columns[0]);
				title = nlapiEscapeXML(itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ', ' + itemsList[i].getText(columns[14])));
				links = nlapiEscapeXML(itemsList[i].getValue(columns[18]));
				desc = itemsList[i].getValue(columns[32]);
				datecreated = GetRFC822Date(nlapiStringToDate(itemsList[i].getValue(columns[33])));
				//nlapiLogExecution('ERROR', 'desc',desc);
				if(desc)
					desc = nlapiEscapeXML(desc.replace(/(<([^>]+)>)/ig,""));
				xmlcontents += '<item>';
				//xmlcontents += '<title>'+title+'</title>';
				xmlcontents += '<title>'+title+'</title>';
				xmlcontents += '<link>'+links+'</link>';
				xmlcontents += '<description>'+desc+'</description>';
				xmlcontents += '<pubDate>'+datecreated+'</pubDate>';
				//xmlcontents += '<guid>'+links+'</guid>';
			 	xmlcontents += '</item>';
			}
		}
	} else {
		xmlcontents += '<title>Latest Offers</title>';
		xmlcontents += '<link>http://shopping.netsuite.com/s.nl/c.1336541/sc.15/category.-115/it.C/.f</link>';
		xmlcontents += '<description>As part of our efforts to continually offer something a little different along with striving to offer wines at very competitive prices, we scour the globe hunting down new deals which we can pass on to our customers. Here at LHK we believe that special offers are only worth advertising when they are indeed special. Therefore, below is a selection of our latest special offers - updated regularly, typically varied in terms of both style and origin of the wine and hopefully always something a bit special! Latest additions to our special offers will also be available via our RSS feed, so sign up using the quicklink on the left and ensure you\'re always kept up to date on what\'s new and exciting.</description>';		
		var itemsList = nlapiSearchRecord('sitecategory', 198,null)
		if(itemsList) {
			for(var i = 0; i < itemsList.length; i++) {
				var columns = itemsList[i].getAllColumns();
				title = nlapiEscapeXML(itemsList[i].getValue(columns[1]));
				links = "http://shopping.netsuite.com/s.nl/c.1336541/sc.15/category."+itemsList[i].getValue(columns[0])+"/.f"
				desc = itemsList[i].getValue(columns[4]);
				/*datecreated = GetRFC822Date(nlapiStringToDate(itemsList[i].getValue(columns[5])));*/
				//nlapiLogExecution('ERROR', 'desc',desc);
				if(desc)
					desc = nlapiEscapeXML(desc.replace(/(<([^>]+)>)/ig,""));
				xmlcontents += '<item>';
				xmlcontents += '<title>'+title+'</title>';
				xmlcontents += '<link>'+links+'</link>';
				xmlcontents += '<description>'+desc+'</description>';
				/*xmlcontents += '<pubDate>'+datecreated+'</pubDate>';*/
				//xmlcontents += '<guid>'+links+'</guid>';
				xmlcontents += '</item>';
			}
		}
	}
	xmlcontents += '</channel>';
	xmlcontents += '</rss>';
	var file = nlapiCreateFile(xmltitle	+'.xml', 'XMLDOC',nlapiXMLToString(nlapiStringToXML(xmlcontents)));
	//file.setFolder("1810");
	//nlapiSubmitFile(file);
// Create File
//var file = nlapiCreateFile('searchresults.xml', 'XMLDOC', xml);

// You can either write result on the same page
response.setContentType(file.getType());
response.write(file.getValue());  	
}