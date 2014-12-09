/*************************************************************************************
 * Name:		Web Store Address Finder
 * Script Type:	Client JavaScript
 *
 * Version:		1.0.0 - ??/??/???? - Initial version - PCA
 * 				1.0.1 - 04/01/2013 - Support 'zipcode' field in addition to 'zip' - SB
 * 				1.0.2 - 03/05/2013 - CompanyName field supported when using UK data - SB
 * 				1.0.3 - 20/05/2013 - Move postcode field above address - SB
 * 				1.0.4 - 26/06/2013 - Call onchange event on CompanyField to store value - SB
 * 				1.0.5 - 04/07/2013 - Fix for apparent intermittent street/housenumber search - SB
 * 				1.0.6 - 16/07/2013 - Custom Support Case fields - SB
 *
 * Author:		S. Boot
 * 
 * Purpose:		Finds addresses from postcodes. Originally from Bundle 2214
 * 
 * Script: 		WebStoreFinder.js
 * Deploy: 		
 * 
 *************************************************************************************/

var pcaSettings;
var pcaWebFinder;

function pcaInitialise()
{
    if (window.loadcomplete == null || !window.loadcomplete )
    {
        setTimeout("pcaInitialise()", 100);
        return;
    }
    
    // 1.0.1
    //try {document.getElementById('zip').id;} catch (e) {return;}
    if (document.getElementById('zip') || 
    		document.getElementById('zipcode') ||
    		document.getElementById('custevent_zip'))
    {
    	pcaSettings = new getPcaSettings();
        pcaWebFinder = new pcaAddressFinder();
        
        // 1.0.3
        var firstAddressRow = $('#zip').parent().parent().parent().siblings(':first-child');
        var postcodeRow = $('#zip').parent().parent().parent().remove();
        $(firstAddressRow).before(postcodeRow);
    }
}

function getPcaSettings()
{
	this.AccountCode = pcaAccountCode;
	this.LicenseKey = pcaLicenseKey;
	this.Username = "";
	this.BaseUrl = "https://services.postcodeanywhere.co.uk";

	try
	{
	    this.UseUKData = pcaUseUKData;
	}
	catch (e)
	{
	    this.UseUKData = false;
	}
}

function pcaAddressFinder()
{
	this.Line1Field;
	this.Line2Field;
	this.CityField;
	this.ZipField;
	this.StateField;
	this.StateSelect;
	this.CountrySelect;
	this.CompanyField;
	
	this.AutoComplete;
	this.SearchButon;
	
	this.AddressFields;
    this.AddressData;  
    this.AddressCount; 
    this.DataSource;
	this.StreetList;
	
	this.blnDataLoaded = false;
	
	this.strLastSearch;

	this.findFields = function()
	{
		// 1.0.1
		if (document.getElementById('zip'))
		{
		    this.Line1Field = document.getElementById('addr1');
		    this.Line2Field = document.getElementById('addr2');
		    this.CityField = document.getElementById('city');
		    this.PostcodeField = document.getElementById('zip');
		    this.StateField = document.getElementById('state');
		    this.StateSelect = document.getElementById('dropdownstate');
		    this.CountrySelect = document.getElementById('country');
		    this.CompanyField = document.getElementById('addressee_input');
		    this.AutoComplete = new pcaWebAutoComplete(this.Line2Field);
		    this.SearchButton = document.createElement("input");
		    this.SearchButton.type = "button";
		    this.SearchButton.style.cssText = "font-size:11px;padding:0 6px;height:19px;margin:0 6px;font-weight:bold;cursor:pointer;";
		    this.SearchButton.value = "Lookup Address";
		    this.PostcodeField.parentNode.appendChild(this.SearchButton);
		}
		else if(document.getElementById('zipcode'))
		{
			// 1.0.2 - create phantom input to satisfy code
		    //this.CompanyField = document.getElementById('addressee_input');
			this.CompanyField = document.createElement("input");
			this.CompanyField.type = 'hidden';
			this.CompanyField.onchange = function(){};
			
			this.Line1Field = document.getElementById('address1');
		    this.Line2Field = document.getElementById('address2');
		    this.Line3Field = document.getElementById('address3');
		    this.CityField = document.getElementById('city');
		    this.PostcodeField = document.getElementById('zipcode');
		    this.StateField = document.getElementById('state');
		    this.StateSelect = document.getElementById('dropdownstate');
		    this.CountrySelect = document.getElementById('country');
		    this.AutoComplete = new pcaWebAutoComplete(this.Line2Field);
		    this.SearchButton = document.createElement("input");
		    this.SearchButton.type = "button";
		    this.SearchButton.style.cssText = "font-size:11px;padding:0 6px;height:19px;margin:0 6px;font-weight:bold;cursor:pointer;";
		    this.SearchButton.value = "Lookup Address";
		    this.PostcodeField.parentNode.appendChild(this.SearchButton);
		}
		else if(document.getElementById('custevent_zip'))
		{
			// 1.0.2 - create phantom input to satisfy code
		    //this.CompanyField = document.getElementById('addressee_input');
			this.CompanyField = document.createElement("input");
			this.CompanyField.type = 'hidden';
			this.CompanyField.onchange = function(){};
			
			this.Line1Field = document.getElementById('custevent_addr1');
		    this.Line2Field = document.getElementById('custevent_addr2');
		    this.CityField = document.getElementById('custevent_city');
		    this.PostcodeField = document.getElementById('custevent_zip');
		    this.StateField = document.getElementById('custevent_state');
		    this.StateSelect = document.getElementById('dropdownstate');
		    this.CountrySelect = document.getElementById('custevent_country');
		    this.AutoComplete = new pcaWebAutoComplete(this.Line2Field);
		    this.SearchButton = document.createElement("input");
		    this.SearchButton.type = "button";
		    this.SearchButton.style.cssText = "font-size:11px;padding:0 6px;height:19px;margin:0 6px;font-weight:bold;cursor:pointer;";
		    this.SearchButton.value = "Lookup Address";
		    this.PostcodeField.parentNode.appendChild(this.SearchButton);
		}
	};
	
	this.setEvents = function()
	{
		this.SearchButton.onclick = function() {pcaWebFinder.Lookup();};
		this.AutoComplete.search.onkeyup = function () {pcaWebFinder.FilterStreets(false);};
		this.AutoComplete.frame.onmousedown = function (event) {if(pcaWebFinder.AutoComplete.allowDrag){pcaWebFinder.AutoComplete.startMove(getMouseX(event),getMouseY(event));document.onmousemove = function(event){pcaWebFinder.AutoComplete.move(getMouseX(event),getMouseY(event));};};};
		this.AutoComplete.frame.onmouseup = function () {document.onmousemove = pcaWebFinder.AutoComplete.oldmovefunction;};
		this.AutoComplete.search.onmouseover = function () {pcaWebFinder.AutoComplete.allowDrag = false;};
		this.AutoComplete.list.onmouseover = function () {pcaWebFinder.AutoComplete.allowDrag = false;};
		this.AutoComplete.search.onmouseout = function () {pcaWebFinder.AutoComplete.allowDrag = true;};
		this.AutoComplete.list.onmouseout = function () {pcaWebFinder.AutoComplete.allowDrag = true;};
	};
	
	this.setStateFromText = function(value)
	{
		if (this.StateSelect) // 1.0.1
		{
		    for (var i=0; i<this.StateSelect.options.length; i++)
		    {
		        if ((this.StateSelect.options[i].text == value) || (this.StateSelect.options[i].value == value))
		        {
		            this.StateSelect.selectedIndex = i;
		        }
		    }
		}
	};
	
	this.Lookup = function()
	{
		if (this.CountrySelect) // 1.0.1
		{
		    if (this.CountrySelect.value == "")
		    {
		        alert("Please select a country");
		        return;    
		    }
		}
		else
		{
			this.CountrySelect = document.createElement("input");
			this.CountrySelect.value = "GB";
		}
		
		// 1.0.5 - Moved outside of IF statement
		if ((this.CountrySelect.value == "GB") && (pcaSettings.UseUKData))
		{
			this.FetchBegin();
		}
		else
		{
			this.FetchStreetsBegin();
		}
	};

	this.FetchBegin = function()
    {
        var scriptTag = document.getElementById("pcaScript");
        var headTag = document.getElementsByTagName("head").item(0);
        var strUrl = "";

        if (this.PostcodeField.value!="")
        {
            this.AutoComplete.show();
        
			if (this.PostcodeField.value!=this.strLastSearch)
			{
				//Save the search
				this.strLastSearch = this.PostcodeField.value;
	        
				//Build the url
				strUrl = pcaSettings.BaseUrl + "/inline2.aspx?";
				strUrl += "&action=fetch";
				strUrl += "&options=all_results";
				strUrl += "&style=raw";
				strUrl += "&postcode=" + escape(this.PostcodeField.value);
				strUrl += "&account_code=" + escape(pcaSettings.AccountCode);
				strUrl += "&license_key=" + escape(pcaSettings.LicenseKey);
				strUrl += "&machine_id=" + escape(pcaSettings.UserName);
				strUrl += "&callback=pcaWebFinder.FetchEnd";

				//Make the request
				if (scriptTag) 
				{
					try
					{
						headTag.removeChild(scriptTag);
					}
					catch (e)
					{
						//Ignore
					}
				}
				scriptTag = document.createElement("script");
				scriptTag.src = strUrl;
				scriptTag.type = "text/javascript";
				scriptTag.id = "pcaScript";
				headTag.appendChild(scriptTag);			
			}
        }
    };
    
    this.FetchEnd = function ()
    {
		var intFields=0;
		var intField=0;

        //Test for an error
        if (pcaIsError)
        {
            //Show the error message
            //alert(pcaErrorMessage);
        }
        else
        {
            //Check if there were any items found
            if (pcaRecordCount==0)
            {
                //alert("Sorry, no matching items found");
            }
            else
            {
                var intCounter;
                
                //Create the new array to level the diacritics
                this.StreetList = new Array(pcaRecordCount);
                intFields = this.ArrayLength(pcaFields);

                //Expand the results
                for (intCounter=0; intCounter<pcaRecordCount; intCounter++)
                {
                    if (intCounter>0)
                    {
						//Expand the data where required
						for (intField=0;intField<intFields;intField++)
						{
							if (pcaData[intCounter][intField]=="=") 
							{
								pcaData[intCounter][intField]=pcaData[intCounter-1][intField];
							}
						}
                    }                        
                        
                    this.AddressFields = pcaFields;
                    this.AddressData = pcaData;  
                    this.AddressCount = pcaRecordCount; 
                    this.DataSource = "UK";             
                    this.StreetList[intCounter]= this.AddressData[intCounter][this.AddressFields["organisation_name"]].toUpperCase() + " " + this.AddressData[intCounter][this.AddressFields["line1"]].toUpperCase();
                }
                
                //Notify completion
                this.blnDataLoaded = true;
                
                //Fill City and State now
		        this.CityField.value=this.AddressData[0][this.AddressFields["post_town"]];
		        this.PostcodeField.value=this.AddressData[0][this.AddressFields["postcode"]];
		        this.StateField.value=this.AddressData[0][this.AddressFields["county"]];
		        this.setStateFromText(this.AddressData[0][this.AddressFields["county"]]);
                
                //Show streets
                this.AutoComplete.clear();
                this.FilterStreets(true);
            }
        }
    };
	
	this.FetchStreetsBegin = function()
    {
        var scriptTag = document.getElementById("pcaScript");
        var headTag = document.getElementsByTagName("head").item(0);
        var strUrl = "";

        if (this.PostcodeField.value!="")
        {
            this.AutoComplete.show();
        
			if (this.strLastSearch != this.PostcodeField.value+this.CountrySelect.value)
			{
				//Save the last search
				this.strLastSearch = this.PostcodeField.value+this.CountrySelect.value;
			
				//Build the url
				strUrl = pcaSettings.BaseUrl + "/inline2.aspx?";
				strUrl += "&action=international";
				strUrl += "&type=fetch_streets";
				strUrl += "&postcode=" + escape(this.PostcodeField.value);
				strUrl += "&country=" + escape(this.CountrySelect.value);
				strUrl += "&account_code=" + escape(pcaSettings.AccountCode);
				strUrl += "&license_key=" + escape(pcaSettings.LicenseKey);
				strUrl += "&callback=pcaWebFinder.FetchStreetsEnd";

				//Make the request
				if (scriptTag) 
				{
					try
					{
						headTag.removeChild(scriptTag);
					}
					catch (e)
					{
						//Ignore
					}
				}
				scriptTag = document.createElement("script");
				scriptTag.src = strUrl;
				scriptTag.type = "text/javascript";
				scriptTag.id = "pcaScript";
				headTag.appendChild(scriptTag);
			}
        }
    };


    this.FetchStreetsEnd = function()
    {
		var intFields=0;
		var intField=0;

        //Test for an error
        if (pcaIsError)
        {
            //Show the error message
            //alert(pcaErrorMessage);
        }
        else
        {
            //Check if there were any items found
            if (pcaRecordCount!=0)
            {
                var intCounter;
                
                //Create the new array to level the diacritics
                this.StreetList = new Array(pcaRecordCount);
                intFields = this.ArrayLength(pcaFields);

                //Level the diacritics and expand the results
                for (intCounter=0; intCounter<pcaRecordCount; intCounter++)
                {
                    if (intCounter>0)
                    {
						//Expand the data where required
						for (intField=0;intField<intFields;intField++)
						{
							if (pcaData[intCounter][intField]=="=") 
							{
								pcaData[intCounter][intField]=pcaData[intCounter-1][intField];
							}
						}
                    }     
                    this.AddressFields = pcaFields;
                    this.AddressData = pcaData;  
                    this.AddressCount = pcaRecordCount;  
                    this.DataSource = "International";            
                    this.StreetList[intCounter]=this.RemoveDiacritics(this.AddressData[intCounter][this.AddressFields["street"]]);
                    this.StreetList[intCounter]=this.Synonym(this.StreetList[intCounter]);
                }
                    
                //Notify completion
                this.blnDataLoaded = true;
                
                //Fill City and State now
		        this.CityField.value=this.AddressData[0][this.AddressFields["city"]];
		        this.PostcodeField.value=this.PostcodeField.value.toUpperCase();
		        this.StateField.value=this.AddressData[0][this.AddressFields["state"]];
		        this.setStateFromText(this.AddressData[0][this.AddressFields["state"]]);
                    
                //Show streets
                this.AutoComplete.clear();
                this.FilterStreets(true);
            }
        }
    };
	
	this.FilterStreets = function(ShowAll)
	{
		var strHtml = new this.StringBuffer();
		var strFilter="";
		var intItems=0;
		var intCounter=0;
		var intLastMatch=0;
		var strLocation="";

		//Remove the diacritics for the filter
		strFilter = this.RemoveDiacritics(this.AutoComplete.search.value);
			
		//Change synonyms
		strFilter = trim(this.Synonym(strFilter));
		
		//If someone just entered a building number still show all streets
		if (strFilter=="" && !ShowAll)
		{
		    return;
		}

		if (this.blnDataLoaded)
		{
			//Draw the autocomplete items
			strHtml.append("<div style='height:279px;overflow:auto;border-left:solid 1px #aaaaaa; border-right:solid 1px #aaaaaa; background-color:#fafafa'>");	
			for (intCounter=0; intCounter<this.AddressCount; intCounter++)
			{
				if((strFilter!="" && this.StreetList[intCounter].indexOf(strFilter) >= 0) || (ShowAll && this.StreetList.length >= 0))
				{
					strHtml.append("<div style='padding:5px; border-bottom:solid 1px #aaaaaa; background-color:#fafafa' onmouseover=\"this.style.backgroundColor='#f0f0f0';\" onmouseout=\"this.style.backgroundColor='#fafafa';\">");	
					strHtml.append("<a style='font-size:10' href='javascript:pcaWebFinder.SelectItem(" + intCounter + ")'>");
					
					if (this.DataSource == "International")
					{
					    strHtml.append("<b>" + this.AddressData[intCounter][this.AddressFields["street"]] + "</b><br>");
					    strLocation="";
					    if (this.AddressData[intCounter][this.AddressFields["district"]]!="") strLocation += ", " + this.AddressData[intCounter][this.AddressFields["district"]];
					    if (this.AddressData[intCounter][this.AddressFields["city"]]!="") strLocation += ", " + this.AddressData[intCounter][this.AddressFields["city"]];
					    if (this.AddressData[intCounter][this.AddressFields["state"]]!="") strLocation += ", " + this.AddressData[intCounter][this.AddressFields["state"]];
					}
					
					if (this.DataSource == "UK")
					{
					    if (this.AddressData[intCounter][this.AddressFields["organisation_name"]]=="")
					    {
						    strHtml.append("<b>" + this.AddressData[intCounter][this.AddressFields["line1"]] + "</b><br>");
					    }
					    else
					    {
						    strHtml.append("<b>" + this.AddressData[intCounter][this.AddressFields["organisation_name"]] + "<br>" + this.AddressData[intCounter][this.AddressFields["line1"]] + "</b><br>");
					    }
					    strLocation="";
					    if (this.AddressData[intCounter][this.AddressFields["double_dependent_locality"]]!="") strLocation += ", " + this.AddressData[intCounter][pthis.AddressFields["double_dependent_locality"]];
					    if (this.AddressData[intCounter][this.AddressFields["dependent_locality"]]!="") strLocation += ", " + this.AddressData[intCounter][this.AddressFields["dependent_locality"]];
					    if (this.AddressData[intCounter][this.AddressFields["post_town"]]!="") strLocation += ", " + this.AddressData[intCounter][this.AddressFields["post_town"]];
					}
					
					strHtml.append(strLocation.substring(2,strLocation.length));
					strHtml.append("</a>");	
					strHtml.append("</div>");	
					intLastMatch = intCounter;
					intItems += 1;
				}
			}
			//Add the branding
			strHtml.append("</div>");
			strHtml.append("<div style='height:20px;font-family:arial;font-size:7pt;color:#aaaaaa;border:solid 1px #aaaaaa; background-color:#ffffff;'>");
			
			var accuracy;
			this.DataSource == "UK" ? accuracy = "Premise Level" : accuracy = "Street Level";
			
			strHtml.append("<div style='float:left;padding-left:5px;padding-top:4px;'>" + intItems + " item(s) " + accuracy + "</div>");
			strHtml.append("<div style='float:right;padding-right:5px;padding-top:4px;color:darkblue'><b>Postcode</b>Anywhere</div>");
			strHtml.append("</div>");
			
			if (intItems==1 && !ShowAll && this.blnAutoSelect)
			{
			    this.blnAutoSelect = false;
                this.AutoComplete.hide();
				this.SelectItem(intLastMatch);
			}
			else
			{
                this.AutoComplete.draw(strHtml.toString());
			}
		}	
	};

	this.SelectItem = function(item) {
	    if (this.DataSource == "UK") {
	        this.CompanyField.value = this.AddressData[item][this.AddressFields["organisation_name"]];
	        this.CompanyField.onchange(); // 1.0.4
	        // 1.0.2
	        if (this.Line3Field)
	        {
		        if (this.AddressData[item][this.AddressFields["organisation_name"]] != "")
		        {
		        	this.Line1Field.value = this.AddressData[item][this.AddressFields["organisation_name"]];
		        	this.Line2Field.value = this.AddressData[item][this.AddressFields["line1"]];
		        	this.Line3Field.value = this.AddressData[item][this.AddressFields["line2"]];
		        }
		        else
		        {
		        	this.Line1Field.value = this.AddressData[item][this.AddressFields["line1"]];
		        	this.Line2Field.value = this.AddressData[item][this.AddressFields["line2"]];
		        	this.Line3Field.value = '';
		        }
	        }
	        else
	        {
	        	if (this.AddressData[item][this.AddressFields["organisation_name"]] != "")
		        {
	        		this.Line1Field.value = this.Line1Field.value = this.AddressData[item][this.AddressFields["organisation_name"]] + 
	        			', ' + this.AddressData[item][this.AddressFields["line1"]];
		        	this.Line2Field.value = this.AddressData[item][this.AddressFields["line2"]];
		        }
	        	else
	        	{
		        	this.Line1Field.value = this.AddressData[item][this.AddressFields["line1"]];
		        	this.Line2Field.value = this.AddressData[item][this.AddressFields["line2"]];
	        	}
	        }
	        if (this.AddressData[item][this.AddressFields["line3"]] != "")
	            this.Line2Field.value += ", " + this.AddressData[item][this.AddressFields["line3"]];
	        if (this.AddressData[item][this.AddressFields["line4"]] != "")
	            this.Line2Field.value += ", " + this.AddressData[item][this.AddressFields["line4"]];
	        if (this.AddressData[item][this.AddressFields["line5"]] != "")
	            this.Line2Field.value += ", " + this.AddressData[item][this.AddressFields["line5"]];

	        this.CityField.value = this.AddressData[item][this.AddressFields["post_town"]];
	        this.StateField.value = this.AddressData[item][this.AddressFields["county"]];
	        this.setStateFromText(this.AddressData[0][this.AddressFields["county"]]);
	    }
	    else {
	        this.Line1Field.value = this.AddressData[item][this.AddressFields["street"]];
	        this.Line2Field.value = this.AddressData[item][this.AddressFields["district"]];
	        this.CityField.value = this.AddressData[item][this.AddressFields["city"]];
	        this.StateField.value = this.AddressData[item][this.AddressFields["state"]];
	        this.setStateFromText(this.AddressData[0][this.AddressFields["state"]]);
	    }

	    //Hide the control
	    this.AutoComplete.hide();
	    this.Line1Field.onchange();
	};

	this.RemoveDiacritics = function(what)
    {
        var strResult="";
        var strChar="";
        for (var i=0; i<what.length;i++)
        {
            strChar = what.substring(i, i+1).toUpperCase();
            if ("ÀÁÂÃàáâã".indexOf(strChar)>=0)
                            strResult+="A";
            else if ("Åå".indexOf(strChar)>=0) 
                            strResult+="AA";
            else if ("ÆæÄä".indexOf(strChar)>=0) 
                            strResult+="AE";
            else if ("Çç".indexOf(strChar)>=0) 
                            strResult+="C";
            else if ("Čč".indexOf(strChar)>=0) 
                            strResult+="CH";
            else if ("đĐ".indexOf(strChar)>=0) 
                            strResult+="DJ";
            else if ("ÈÉÊËèéêë".indexOf(strChar)>=0) 
                            strResult+="E";
            else if ("ÌÍÏìíîï".indexOf(strChar)>=0) 
                            strResult+="I";
            else if ("Ññ".indexOf(strChar)>=0) 
                            strResult+="N";
            else if ("ÒÓÔÕOòóôõo".indexOf(strChar)>=0) 
                            strResult+="O";
            else if ("ŒœØøÖö".indexOf(strChar)>=0) 
                            strResult+="OE";
            else if ("Šš".indexOf(strChar)>=0) 
                            strResult+="SH";
            else if ("ß".indexOf(strChar)>=0) 
                            strResult+="SS";
            else if ("ÙÚÛUùúûu".indexOf(strChar)>=0) 
                            strResult+="U";
            else if ("Üü".indexOf(strChar)>=0) 
                            strResult+="UE";
            else if ("ŸÝýÿ".indexOf(strChar)>=0) 
                            strResult+="Y";
            else if ("Žž".indexOf(strChar)>=0) 
                            strResult+="ZH";
            else if ("-".indexOf(strChar)>=0)
				            strResult+=" ";
			else if (".,".indexOf(strChar)>=0)
				            strResult+="";
            else
            	strResult+=strChar;
        }
        return strResult;
    };

	this.Synonym = function(what)
	{
		var strStreet = " " + what.toUpperCase();
		
		strStreet = strStreet.replace(" N "," NORTH ");
		strStreet = strStreet.replace(" NE "," NORTH EAST ");
		strStreet = strStreet.replace(" NORTHEAST "," NORTH EAST ");
		strStreet = strStreet.replace(" NW "," NORTH WEST ");
		strStreet = strStreet.replace(" NORTHWEST "," NORTH WEST ");
		strStreet = strStreet.replace(" S "," SOUTH ");
		strStreet = strStreet.replace(" SE "," SOUTH EAST ");
		strStreet = strStreet.replace(" SOUTHEAST "," SOUTH EAST ");
		strStreet = strStreet.replace(" SW "," SOUTH WEST ");
		strStreet = strStreet.replace(" SOUTHWEST "," SOUTH WEST ");
		strStreet = strStreet.replace(" E "," EAST ");
		strStreet = strStreet.replace(" W "," WEST ");
		strStreet = strStreet.replace(" ST "," SAINT ");

		return strStreet;
	};

	this.getPosition = function(obj)
	{
		var curleft = curtop = 0;
		while (obj && obj.tagName !="BODY")
		{
			curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return [curleft,curtop];
	};
	
	this.IsStreetBeforeBuilding = function()
	{
		if (this.CountrySelect.value=="AND"||this.CountrySelect.value=="CAN"||this.CountrySelect.value=="FRA"||this.CountrySelect.value=="GBR"||this.CountrySelect.value=="LUX"||this.CountrySelect.value=="USA") 
			return false;
		else
			return true;
	};
	
	this.ArrayLength = function(what)
	{
		var intItems=0;
		var strKey;

		for (strKey in what)
		{
			intItems+=1;
		}
		
		return intItems;
	};
	
	this.ArrayKey = function(what, index)
	{
		var intItems=0;
		var key;
		
		for (strKey in what)
		{
			if (intItems==index)
			{
				return strKey;
			}
			intItems+=1;
		}
		
		return -1;
	};
	
	this.StringBuffer = function()
	{ 
		this.buffer = []; 
		this.append = function(what)
		{
			this.buffer.push(what); 
		};
		this.toString = function()
		{
			return this.buffer.join(""); 
		};
	};
	
	this.StartsWithNumber = function(what)
	{
		var strFirst = "";
		var strLast = "";
		
		//Get the 1st word
		if (what.indexOf(" ") > 0)
		{
			strFirst = what.substring(0,what.indexOf(" "));
			strLast = what.substring(what.indexOf(" "), what.length);
			return this.IsNumeric(strFirst);
		}
		else
		{
			return false;
		}
	};

	this.GetBuildingNumber = function(what)
	{
		//Return the first word if present
		if (what.indexOf(" ") > 0)
		{
			return what.substring(0,what.indexOf(" "));
		}
		else
		{
			return "";
		}
	};

	this.GetStreet = function(what)
	{
		//Return everything after the first word
		if (what.indexOf(" ") > 0)
		{
			return what.substring(what.indexOf(" "), what.length);
		}
		else
		{
			return "";
		}
	};

	this.IsNumeric = function(what)
	{
		var objValidChars = "0123456789.-/";
		var blnResult=true;
		var strCharacter;

		for (var i = 0; i < what.length && blnResult == true; i++) 
		{ 
			strCharacter = what.charAt(i); 
			if (objValidChars.indexOf(strCharacter) == -1) 
			{
				blnResult = false;
			}
		}
		return blnResult;
	};
	
	this.findFields();
	this.setEvents();
}

function pcaWebAutoComplete(ParentControl)
{
    //Variables for movable panel
    this.x = 400;
    this.y = 250;
    this.dx = 0;
    this.dy = 0;
    this.allowDrag = true;
    this.oldmovefunction = document.onmousemove;

    //Elements
    this.frame;
    this.list;
    this.search;
    this.back;
    
    //Initialise Elements
	this.frame = document.createElement("div");
	this.frame.style.position = "absolute";
	this.frame.style.height = "350px";
	this.frame.style.width = "400px";
	this.frame.style.zIndex = "99";
	this.frame.style.top = this.y + "px";
	this.frame.style.left = this.x + "px";
	this.frame.style.backgroundColor = "#D2D2C8";
	this.frame.style.border = "solid";
	this.frame.style.borderWidth = "thin";
	this.frame.style.borderColor = "#999999";
	this.frame.style.display = "none";
	document.getElementsByTagName("body").item(0).appendChild(this.frame);
	
	var searchLabel = document.createElement("span");
	searchLabel.innerHTML = "<label for='pcaFilterSearch'>Search</label>&nbsp";
	searchLabel.style.position = "absolute";
	searchLabel.style.top = "20px";
	searchLabel.style.left = "5px";
	searchLabel.style.fontSize = "9";
	this.frame.appendChild(searchLabel);
	
	this.search = document.createElement("input");
	this.search.type = "text";
	this.id = "pcaFilterSearch";
	this.search.style.width = "350px";
	this.search.style.zIndex = "100";
	this.search.style.fontSize = "10";
	searchLabel.appendChild(this.search);
	
	var closeLink = document.createElement("span");
	closeLink.innerHTML = "X";
	closeLink.style.fontSize = "9";
	closeLink.onclick = function () {pcaWebFinder.AutoComplete.hide();};
	closeLink.style.position = "absolute";
	closeLink.style.top = "3";
	closeLink.style.left = "387";
	this.frame.appendChild(closeLink);
	

	this.list = document.createElement("div");
	this.list.className = "pcaautocomplete"; // Conflicts with SLI search
	this.list.style.position = "absolute";
	this.list.style.height = "300px";
	this.list.style.width = "390px";
	this.list.style.top = "45px";
	this.list.style.left = "5px";
	this.list.style.zIndex = "100";
	this.list.style.backgroundColor = "#FFFFFF";
	this.frame.appendChild(this.list);
	
	//Load iframe for ie6 to fix dropdown display bug
    if (parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6)
    {
        this.back = document.createElement("iframe");
        this.back.src = "https://www.postcodeanywhere.co.uk/blank.htm";
        this.back.style.position = "absolute";
		this.back.style.height = this.frame.style.height;
		this.back.style.width = this.frame.style.width;
		this.back.style.top = this.frame.style.top;
		this.back.style.left = this.frame.style.left;
        this.back.style.zIndex = "98";
        this.back.style.display = "none";
        document.getElementsByTagName("body").item(0).appendChild(this.back);
    }
    
    this.hide = function ()
	{
	    this.frame.style.display = "none";
	    
	    if (parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6)
	    {
	        this.back.style.display = "none";
	    }
	};
	
	this.show = function ()
	{
	    this.frame.style.display = "";
	    
	    if (parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6)
	    {
	        this.back.style.display = "";
	    }
	};
	
	this.isVisible = function()
	{
	    return this.frame.style.display == "" ? true : false;
	};
	
	this.draw = function (html)
	{
        this.list.innerHTML = html;
        this.show();
        this.search.focus();
	};
	
	this.clear = function()
	{
		this.search.value = "";	
	};
	
	this.startMove = function(x,y)
	{
	    this.dx = x - this.x;
	    this.dy = y - this.y;
	};
	
	this.move = function(x,y)
	{
	    this.x = x - this.dx;
	    this.y = y - this.dy;
	    
	    this.frame.style.left = this.x + "px";
	    this.frame.style.top = this.y + "px";
	
	    if (parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6)
	    {
		    this.back.style.left = this.x + "px";
		    this.back.style.top = this.y + "px";
		}
	};
}

pcaInitialise();