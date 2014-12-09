function getAdvancedSearchPage()
{
	var col = new Array();
	col[0] = new nlobjSearchColumn('name');
	col[1] = new nlobjSearchColumn('internalId');
	var colours = nlapiSearchRecord('customlistwine_colour', null, null, col);
	var regions = nlapiSearchRecord('customrecord_item_region', null, null, col);
	var appellations = nlapiSearchRecord('customrecord_item_appellation', null, null, col);
	var dutiesStatus = nlapiSearchRecord('customrecord_saletype', null, null, col);
	var acStatus = nlapiSearchRecord('customrecord_item_classification', null, null, col);
	var maturities = nlapiSearchRecord('customlist_maturities', null, null, col);
	
	col[2] = new nlobjSearchColumn('custrecord7');
	var bottleSizes = nlapiSearchRecord('customrecord_bottlesizes', null, null, col);
	  
	var content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
	content += '<html xmlns="http://www.w3.org/1999/xhtml">';
	content += '<head>';
	content += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	content += '<title>Untitled Document</title>';
	content += '<link href="http://shopping.netsuite.com/c.1336541/site/css/style_advancedSearch.css" rel="stylesheet" type="text/css" />';
	content += '</head>';
	
	content += '<body>';
	content += '<div class="content1">';
	content += '<div class="content2">';
	content += '<div class="elements-top">';
	content += '<div class="numbers-search">';
	content += '<div class="numbers-space">00000</div>';
	content += '<div class="wines-matching">Wines matching your search criteria</div>';
	content += '</div>';	
	content += '<div class="btn-results"><img id="submitSearch" src="http://shopping.netsuite.com/c.1336541/site/images/btn_show-results.jpg" alt="show results" width="118" height="23" /><div class="btn-text" id="submitSearch">Show Results</div>';
	content += '</div>';
	content += '</div>';
	
	content += '<div class="content-fields">';
	content += '<div class="content-fields-left">';
	content += '<div class="field-type1">';
	content += '<div class="field-text">Keyword(s)</div>';
	content += '<div class="field-space"><input type="text" name="keywords" id="keyword" class="inputText" /></div>';
	content += '</div>';
	
	content += '<div class="field-type2">';
	content += '<div class="field-text">Price</div>';	
	content += '<div class="field-space1"><input type="text" name="priceSince" id="priceSince" class="inputText" /></div>';
	content += '<div class="field-text1">to</div>';
	content += '<div class="field-space1"><input type="text" name="priceTo" id="priceTo" class="inputText" /></div>';
	content += '<div class="field-text1">&nbsp;&nbsp;per</div>';
	content += '<div class="field-space2"><select name="sellUnit" id="sellUnit" class="box1" >';
	content += '<option value="0"></option>';
	for(var i = 0; i < bottleSizes.length; i++)
	{		
		content += '<option value="' + bottleSizes[i].getValue('internalId') + '">' + bottleSizes[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
	content += '</div>';
	
	content += '<div class="field-type3">';	
    content += '<div class="field-text">Vintage</div>';
    content += '<div class="field-space1"><input type="text" name="vintageSince" id="vintageSince" class="inputText" /></div>';
    content += '<div class="field-text1">to</div>';
    content += '<div class="field-space1"><input type="text" name="vintageTo" id="vintageTo" class="inputText" /></div>';
    content += '</div>';
		
	content += '<div class="field-type4">';	
    content += '<div class="field-text">Region</div>';
    content += '<div class="field-space2"><select name="region" id="region" class="box1" >';
	content += '<option value="0"></option>';
	for(var i = 0; i < regions.length; i++)
	{		
		content += '<option value="' + regions[i].getValue('internalId') + '">' + regions[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
    content += '</div>';
		
	content += '<div class="field-type4">';
    content += '<div class="field-text">Colour</div>';
    content += '<div class="field-space2"><select type="text" name="colour" id="colour" class="box1" >';
	content += '<option value="0"></option>';
	for(var i = 0; i < colours.length; i++)
	{		
		content += '<option value="' + colours[i].getValue('internalId') + '">' + colours[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
    content += '</div>';
		
	content += '<div class="field-type4">';
    content += '<div class="field-text">Duty Status</div>';
    content += '<div class="field-space2"><select name="dutyStatus" id="dutyStatus" class="box1" >';
	content += '<option value="0"></option>';
	for(var i = 0; i < dutiesStatus.length; i++)
	{	
		if(dutiesStatus[i].getValue('name') == "IN BOND" || dutiesStatus[i].getValue('name') == "DUTY PAID" )
		content += '<option value="' + dutiesStatus[i].getValue('internalId') + '">' +  toTitleCase(dutiesStatus[i].getValue('name')) + '</option>';
	}
	content += '</select>'
	content += '</div>';
    content += '</div>';
	
	content += '</div>';
	
	content += '<div class="content-fields-right">';
	
	content += '<div class="field-type5">'; 
    content += '<div class="field-text">AC Status</div>';
    content += '<div class="field-space2"><select name="acStatus" id="acStatus" class="box1" >';
	content += '<option value="0"></option>';
	
	acStatus.sort(function(a,b) {
						   var array = new Array();
						   array['First Growth'] =  '1';
						   array['Second Growth'] = '2';
						   array['Third Growth'] =  '3';
						   array['Fourth Growth'] = '4';
						   array['Fifth Growth'] =  '5';
						   array['Grand Cru'] =  '6';
						    array['Premier Cru'] =  '7';
						   aname = array[a.getValue('name')];
						   if(aname == null) aname = '999' + array[a.getValue('name')];
						   
						   bname = array[b.getValue('name')];
						   if(bname == null) bname = '999' + array[b.getValue('name')];
						   
						   return aname - bname;
				});
	for(var i = 0; i < acStatus.length; i++)
	{		
		content += '<option value="' + acStatus[i].getValue('internalId') + '">' + acStatus[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
    content += '</div>';        	
	
    content += '<div class="field-type5">';
    content += '<div class="field-text">Currency</div>';
    content += '<div class="field-space2"><select name="currency" id="currency" class="box1" >';
	content += '<option value="0"></option>';
	content += '<option value="1">GBP</option>';
	content += '<option value="2">CHF</option>';
	content += '<option value="3">EUR</option>';
	content += "<option value='4'>HKD</option>";
	content += "<option value='5'>USD</option>";
	content += '</select>';
	content += '</div>';
    content += '</div>';
        
    content += '<div class="field-type5">';	
    content += '<div class="field-text">Maturity</div>';
    content += '<div class="field-space2"><select name="maturity" id="maturity" class="box1" >';
	content += '<option value="0"></option>';
	
	for(var i = 0; i < maturities.length; i++)
	{		
		content += '<option value="' + maturities[i].getValue('internalId') + '">' + maturities[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
    content += '</div>';
        
    content += '<div class="field-type5">';
    content += '<div class="field-text">Appellation</div>';
    content += '<div class="field-space2"><select name="appellation" id="appellation" class="box1" >';
	content += '<option value="0"></option>';
	for(var i = 0; i < appellations.length; i++)
	{		
		content += '<option value="' + appellations[i].getValue('internalId') + '">' + appellations[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
    content += '</div>';
    
    content += '<div class="field-type5">';
    content += '<div class="field-text">Unit Size</div>';
    content += '<div class="field-space2"><select name="unitSize" id="unitSize" class="box1" >';
	content += '<option value="0"></option>';
	bottleSizes.sort(function(a,b) {
			 return a.getValue('custrecord7') - b.getValue('custrecord7');
	});
	for(var i = 0; i < bottleSizes.length; i++)
	{		
		content += '<option value="' + bottleSizes[i].getValue('internalId') + '">' + bottleSizes[i].getValue('name') + '</option>';
	}
	content += '</select>';
	content += '</div>';
    content += '</div>';
        
    content += '<div class="field-type5">';	
    content += '<div class="field-text">Include En Primeur</div>';
    content += '<div class="field-space2"><input type="checkbox" checked="true" name="includeEnPrimeur" id="includeEnPrimeur" /></div>';
    content += '</div>';
	
	content += '</div>';

	content += '</div>';

	content += '</div>';

	content += '</div>';

	content += '</body>';
	content += '</html>';
	
	/*content += "<td>Keyword</td><td><input id='keyword' /></td>";
	content += "<td>AC Status</td><td><select id='acStatus' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < acStatus.length; i++)
	{		
		content += "<option value='" + acStatus[i].getValue('internalId') + "'>" + acStatus[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "</tr>";
	content += "<tr>";
	content += "<td>Price</td><td><input id='priceSince' /> to <input id='priceTo' /> per <select id='sellUnit' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < bottleSizes.length; i++)
	{		
		content += "<option value='" + bottleSizes[i].getValue('internalId') + "'>" + bottleSizes[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "<td>Currency</td><td><select id='currency' >";
	content += "<option value='0'></option>";
	content += "<option value='1'>GBP</option>";
	content += "<option value='2'>CHF</option>";
	content += "<option value='3'>EUR</option>";
	content += "<option value='4'>HKD</option>";
	content += "<option value='5'>USD</option>";
	content += "</select></td>";
	content += "</tr>";
	content += "<tr>";
	content += "<td>Vintage</td><td><input id='vintageSince' /> to <input id='vintageTo' /></td>";
	content += "<td>Maturity</td><td><select id='maturity' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < maturities.length; i++)
	{		
		content += "<option value='" + maturities[i].getValue('internalId') + "'>" + maturities[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "</tr>";
	content += "<tr>";
	content += "<td>Region</td>";
	content += "<td><select id='region' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < regions.length; i++)
	{		
		content += "<option value='" + regions[i].getValue('internalId') + "'>" + regions[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "<td>Appellation</td><td><select id='appellation' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < appellations.length; i++)
	{		
		content += "<option value='" + appellations[i].getValue('internalId') + "'>" + appellations[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "</tr>";
	content += "<tr>";
	content += "<td>Colour</td><td><select id='colour' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < colours.length; i++)
	{		
		content += "<option value='" + colours[i].getValue('internalId') + "'>" + colours[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "<td>Unit Size</td><td><select id='unitSize' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < bottleSizes.length; i++)
	{		
		content += "<option value='" + bottleSizes[i].getValue('internalId') + "'>" + bottleSizes[i].getValue('name') + "</option>";
	}
	content += "</select></td>";
	content += "</tr>";
	content += "<tr>";
	content += "<td>Duty Status</td><td><select id='dutyStatus' >";
	content += "<option value='0'></option>";
	for(var i = 0; i < dutiesStatus.length; i++)
	{		
		content += "<option value='" + dutiesStatus[i].getValue('internalId') + "'>" + dutiesStatus[i].getValue('name') + "</option>";
	}
	content == "</select></td>";
	content += "<td>Include En Primeur</td><td><input type='checkbox' id='includeEnPrimeur' checked='true' /></td>";
	content += "</tr>";
	content += "<tr>";
	content += "<td></td>";
	content += "<td><br/><br/><input type='submit' id='submitSearch' text='Search' /></td>";
	content += "</tr>";*/
	response.write(content);
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
