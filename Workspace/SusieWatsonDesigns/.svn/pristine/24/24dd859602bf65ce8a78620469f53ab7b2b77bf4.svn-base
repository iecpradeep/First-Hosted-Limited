/*************************************************************************************
 * Name:		fhl.matrixWasNowPrice.suitelet.js
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 10/07/2013 - Initial revision - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		To generate JSON to bring back required fields for Matrix Items
 * 
 * Script: 		customscript_fhl_matrix_wasnow
 * Deploy: 		customdeploy_fhl_matrix_wasnow
 * 
 * Notes:		
 * 
 * Library: 	fhl.library.js
 *************************************************************************************/

/**
 * Main function
 */
function main(request, response)
{
	try
	{
		var responseJSON = new Array();
		var parentIntIdString = ''; // Comma-delimited list of IDs of matrix items on Category List page
		var parentArray = new Array(); // Hold info for each Matrix parent Item
		var childResults = null;
		var matrixParents = new Array();
		var jsonpCallback = request.getParameter('callback');

		// Get internal IDs of all parent items from HTTP request
		parentIntIdString = request.getParameter('items');
		parentArray = parentIntIdString.split(',');
		
		// Populate parent matrix items
		matrixParents = populateMatrixParents(parentArray);

		// Search for child matrix items
		childResults = searchMatrixChildren(matrixParents);

		if (childResults)
		{
			// Populate child matrix item array with search data
			matrixParents = populateMatrixChildren(matrixParents, childResults);
			
			for (var i = 0; i < matrixParents.length; i++)
			{
				responseJSON.push(matrixParents[i].toJSON());
			}
		}
		
		// Output the JSON response
		if (jsonpCallback)
		{
			// JSONP
			response.write(jsonpCallback + '(' + JSON.stringify(responseJSON) + ');');
		}
		else
		{
			// JSON
			response.write(JSON.stringify(responseJSON));
		}
	}
	catch(e)
	{
		errHandler('main', e);
	}
}

/**
 * Matrix Parent Item Class
 */
function MatrixItem(internalId, itemOptions, childItems)
{
	this.internalId = internalId;
	this.itemOptions = itemOptions;
	this.childItems = childItems;
	
	// Export to JSON
	this.toJSON = function(){
		var json = null;
		var childJSON = new Array();
		
		for (var i = 0; i < this.childItems.length; i++)
		{
			childJSON.push(this.childItems[i].toJSON());
		}
		
		json = {'internalId': this.internalId,
				'itemOptions': itemOptions,
				'childItems': childJSON};
		
		return json;
	};
}

/**
 * Matrix Child Item Class with required field values
 */
function MatrixChildItem(internalId, itemOptions, wasPrice)
{
	this.internalId = internalId;
	this.itemOptions = itemOptions;
	this.wasPrice = wasPrice;
	
	// Export to JSON
	this.toJSON = function(){
		var json = {'internalId': this.internalId,
				'itemOptions': this.itemOptions,
				'wasPrice': this.wasPrice};
		return json;
	};
}

/**
 * Search for required child matrix items
 * @param matrixItemArray
 * @returns nlobjSearchResult
 */
function searchMatrixChildren(matrixParents)
{
	try
	{
		var filters = new Array();
		var columns = new Array();
		var searchResults = null;
		var matrixColumns = new Array();
		var parentArray = new Array();
		
		columns[0] = new nlobjSearchColumn('parent');
		columns[1] = columns[0].setSort();
		columns[2] = new nlobjSearchColumn('custitem_bb1_wasprice');
		
		// Find item options to add to search results
		for (var i = 0; i < matrixParents.length; i++)
		{
			parentArray.push(matrixParents[i].internalId);
			
			for (var j = 0; j < matrixParents[i].itemOptions.length; j++)
			{
				// De-dupe columns
				var push = true;
				
				for (var k = 0; k < matrixColumns.length; k++)
				{
					if (matrixParents[i].itemOptions[j] == matrixColumns[k])
					{
						push = false;
					}
				}
				
				if (push)
				{
					var option = matrixParents[i].itemOptions[j];
					option = option.toLowerCase();
					option = option.replace(/^custcol_/, 'custitem_');
					matrixColumns.push(option);
				}
			}
		}
		
		// Add matrix item options to search results
		for (var i = 0; i < matrixColumns.length; i++)
		{
			columns[columns.length] = new nlobjSearchColumn(matrixColumns[i]);
		}
		
		// Filters
		filters[0] = new nlobjSearchFilter('parent', null, 'anyOf', parentArray);

		searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);

		return searchResults;
	}
	catch(e)
	{
		errHandler('searchMatrixChildren', e);
	}
}

/**
 * Populate parent matrix items
 * @param parentArray
 */
function populateMatrixParents(parentArray)
{
	try
	{
		var matrixParents = new Array();
		
		for (var i = 0; i < parentArray.length; i++)
		{
			var item = null;
			var itemOptions = new Array();
			
			// Get array of applicable matrix item options
			item = nlapiLoadRecord('inventoryitem', parentArray[i]);
			itemOptions = item.getFieldValues('itemoptions');
			
			if (itemOptions)
			{
				for (var j = 0; j < itemOptions.length; j++)
				{
					itemOptions[j] = itemOptions[j].toLowerCase();
				}
			}
			else
			{
				itemOptions = new Array();
			}
			
			matrixParents.push(new MatrixItem(parentArray[i], itemOptions, new Array()));
		}
		
		return matrixParents;
	}
	catch(e)
	{
		errHandler('populateMatrixParents', e);
	}
}

/**
 * Populate child matrix item array with search data
 * @param childResults
 */
function populateMatrixChildren(matrixParents, childResults)
{
	try
	{
		var matrixItems = matrixParents;

		// Loop over children and put them in object
		for (var i = 0; i < childResults.length; i++)
		{
			var internalId = childResults[i].getId();
			var wasPrice = childResults[i].getValue('custitem_bb1_wasprice');
			var currentParent = null;
			var matrixChild = null;
			var itemOptions = new Array();
			
			// Find its parent item object
			for (var j = 0; j < matrixItems.length; j++)
			{
				if (childResults[i].getValue('parent') == matrixItems[j].internalId)
				{
					currentParent = matrixItems[j];
				}
			}
			
			// Get item options
			for (var j = 0; j < currentParent.itemOptions.length; j++)
			{
				var option = currentParent.itemOptions[j];
				option = option.toLowerCase();
				
				itemOptions.push(option + ':' + childResults[i].getValue(option.replace(/^custcol_/, 'custitem_')));
			}
			
			matrixChild = new MatrixChildItem(internalId, itemOptions, wasPrice);
			
			// Add to child array
			currentParent.childItems.push(matrixChild);
		}
		
		return matrixItems;
	}
	catch(e)
	{
		errHandler('populateMatrixChildren', e);
	}
}
