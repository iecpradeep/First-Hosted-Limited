
/**
 * Example Data
 * var options = new Object(); // Object of configuration 
 * options.columns = new Array(); // Array of search columns (NS)
 * options.columnFrom = 'internalid'; // Column where the data is gone to be taked (must be at the columns array)
 * var c = new nlobjSearchColumn(options.columnFrom); 
 * c.setSort();
 * options.columns.push(c); 
 * options.columns.push(new nlobjSearchColumn('companyname'));
 * options.filters = new Array(); // Array of search filters (NS)
 * options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
 * options.columnSorted = 'internalidnumber'; // Column where the filter is gone to be applied
 * options.resultColumns = ['internalid', 'companyname']; // names for the object where the data is gone to be placed, if have less titles uses the  
 * options.restrictType = 'customer'; // If the search have diferent types, you can get the one you put here.
 * var rows = loadRows('customer', options); // Make the search
 */

/**
 * Other magic from SMart
 */
 //carga todos los items, hace una llamada recursiva para superar la restriccion de 1000 items impuesta por netsuite
function loadRows(recordType, options, saveSearchId, fromNextId){
        var defaultOptions = { columns: [], filters: [], columnSorted: '', restrictType: false, resultColumns: [] };
//nlapiLogExecution('DEBUG', 'loadRows ', fromNextId);
        if(saveSearchId == undefined)
                saveSearchId = null;

        if(options == undefined || options == null){
                options = defaultOptions;
        } else {
                for(var option in defaultOptions){
                        if(options[option] == undefined || options[option] == null)
                                options[option] = defaultOptions[option];
                }
        }

        if(fromNextId == undefined || fromNextId == null)
                fromNextId = false;

        if(fromNextId && options.columnSorted != '')
                options.filters.push(new nlobjSearchFilter(options.columnSorted, null, 'greaterthan', fromNextId));

        var search = nlapiSearchRecord(recordType, saveSearchId, options.filters);

        if(fromNextId && options.columnSorted != '')
                options.filters.pop();

        var rowsList = new Array();

        if(search){
            var lastId = '';
            var countSearch = search.length;
            for(var i = 0; i < countSearch; i++){
                var listCols = search[i].getAllColumns();
                var row =  search[i];
              /*  for(var c = 0; c < listCols.length; c++){
					if(options.resultColumns.length > 0){
                        var colName = listCols[c];
                        if(options.resultColumns[c] != undefined && options.resultColumns[c] != null){
                            colName = options.resultColumns[c];
						}
                        if(c > 0 && c < 11)
						{
							row[colName] =  (search[i].getValue(listCols[c])!=''?search[i].getText(listCols[c]):'');
						}
						else
						{
							row[colName] = search[i].getValue(listCols[c]);
						}
                    }
                }*/
                if(options.restrictType){
                    if(search[i].getRecordType() == options.restrictType)
                        rowsList.push(row);
                } else {
                    rowsList.push(row);
                }
                if(options.columnSorted != ''){
					if(saveSearchId != null)
                        lastId = search[i].getValue(listCols[0]); 
                    else
                        lastId = search[i].getValue(options.columnFrom);
				}
				//lastId = search[i].getValue(options.columnFrom);
            }
            if(countSearch == 1000 && lastId != ''){
				rowsList = rowsList.concat(loadRows(recordType, options, saveSearchId, lastId));
            }
        }
        return rowsList;
}

//arma las columnas a desplegarse y llama a la funcion que carga los items, por ultimo los escribe
function writeSearchInPage()
{
	var options = new Object(); // Object of configuration 
	options.columns = new Array(); // Array of search columns (NS)
	options.columnFrom = 'internalid'; // Column where the data is gone to be taked (must be at the columns array)
	var c = new nlobjSearchColumn(options.columnFrom); 
	c.setSort();
	options.columns.push(c); 
	//options.columns.push(new nlobjSearchColumn('name'));
	/*options.columns.push(new nlobjSearchColumn('displayname'));	
	options.columns.push(new nlobjSearchColumn('custitem_item_region'));
	options.columns.push(new nlobjSearchColumn('custitem_country'));
	options.columns.push(new nlobjSearchColumn('custitem_item_vintage'));
	options.columns.push(new nlobjSearchColumn('custitem_btlsize'));
	options.columns.push(new nlobjSearchColumn('saleunit'));
	options.columns.push(new nlobjSearchColumn('price'));*/
	options.filters = new Array(); // Array of search filters (NS)
	options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	options.columnSorted = 'internalidnumber'; // Column where the filter is gone to be applied
	options.resultColumns = ['internalid', 'name', 'custitem_item_region', 'custitem_country', 'custitem_item_vintage', 'custitem_btlsize', 'saleunit', 'price']; // names for the object where the data is gone to be placed, if have less titles uses the  
	options.restrictType = false;	
	var itemsList = loadRows('item', options,121); // Make the search
	var content = "";	
	for(var i = 0; i < itemsList.length; i++) 
	{
		var columns = itemsList[i].getAllColumns();
		try
		{
			if(itemsList[i].getValue(columns[1]).length > 1 && itemsList[i].getValue(columns[7]) != '')
			{
				if(i == 2)
				{
					nlapiLogExecution('ERROR', 'name length - name', itemsList[i].getValue(columns[1]).length + " - " + "_" + itemsList[i].getValue(columns[1]) + "_");
				}
				
				var itemPrice =  itemsList[i].getValue(columns[7])//record.getLineItemMatrixValue('price1', 'price', 1, 1);
				//nlapiLogExecution('ERROR', 'itemPrice', itemPrice);
				
				var multiple = 1;
				var uom = itemsList[i].getText(columns[6]);
  				
				if(uom && !uom.match("Case")){
					x=uom.split(" ");
					bottlesize=x[1]+" cl";	
					caseSize="";			
				}

				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
					bottlesize=x[1]+" cl";	
					caseSize=itemsList[i].getText(columns[6])
										
				}

				newprice = itemPrice * multiple;
				
				grower = "";
				if(itemsList[i].getValue(columns[8])) grower = itemsList[i].getText(columns[8]) + ' ' ;
				saleunit = "";
			    if(itemsList[i].getValue(columns[6]))saleunit = itemsList[i].getText(columns[6]);
				
				
				content += grower + itemsList[i].getText(columns[1]) + ", " + itemsList[i].getText(columns[2]) + ", " + itemsList[i].getText(columns[3]) + "|" + newprice.toFixed(2) + "|" + itemsList[i].getText(columns[4]) + "|" + itemsList[i].getText(columns[5]) + " " + saleunit + "|" +itemsList[i].getValue(columns[9])+"|http://shopping.netsuite.com/s.nl/c.1336541/it.A/id."+itemsList[i].getValue(columns[0])+"/.f\n";
			}
			//var record = nlapiLoadRecord('inventoryitem', itemsList[i].internalid);						
			//var itemPrice = record.getLineItemMatrixValue('price1', 'price', 1, 1);
			//itemPrice = itemPrice.replace('.', '');
			//content += itemsList[i].name + ", " + itemsList[i].custitem_item_region + ", " + itemsList[i].custitem_country + "|" + itemPrice + "|" + itemsList[i].custitem_item_vintage + "|" + itemsList[i].custitem_btlsize + " " + itemsList[i].saleunit + "|http://shopping.netsuite.com/s.nl/c.1336541/it.A/id."+itemsList[i].internalid+"/.f\n";
			
		}
		catch(e)
		{	
			nlapiLogExecution('ERROR', 'ERROR', e);
			/*try
			{
				//var record = nlapiLoadRecord('noninventoryitem', itemsList[i].internalid);							
				//var itemPrice = record.getLineItemMatrixValue('price1', 'price', 1, 1);
				//itemPrice = itemPrice.replace('.', '');
				//content += itemsList[i].name + ", " + itemsList[i].custitem_item_region + ", " + itemsList[i].custitem_country + "|" + itemPrice + "|" + itemsList[i].custitem_item_vintage + "|" + itemsList[i].custitem_btlsize + " " + itemsList[i].saleunit + "|http://shopping.netsuite.com/s.nl/c.1336541/it.A/id."+itemsList[i].internalid+"/.f\n";
				content += itemsList[i].name + ", " + itemsList[i].custitem_item_region + ", " + itemsList[i].custitem_country + "|" + itemsList[i].price + "|" + itemsList[i].custitem_item_vintage + "|" + itemsList[i].custitem_btlsize + " " + itemsList[i].saleunit + "|http://shopping.netsuite.com/s.nl/c.1336541/it.A/id."+itemsList[i].internalid+"/.f\n";
			}catch(e){				
				nlapiLogExecution('ERROR', 'ERROR', e);
				//content += itemsList[i].name + ", " + itemsList[i].custitem_item_region + ", " + itemsList[i].custitem_country + "| |" + itemsList[i].custitem_item_vintage + "|" + itemsList[i].custitem_btlsize + " " + itemsList[i].saleunit + "|http://shopping.netsuite.com/s.nl/c.1336541/it.A/id."+itemsList[i].internalid+"\n";
			}*/
		}
	}
	response.write(content);	
}





