function getArrayOfProducers(params)
{
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	
	nlapiLogExecution('DEBUG', 'Start', '');
	
	var prodCat = params.getParameter('cat');
	
	var filters = [];
	var columns = [];
	
	filters[0] = new nlobjSearchFilter('internalId', null, 'is', prodCat);
	
	columns[0] = new nlobjSearchColumn('fullName');
	
	var searchResults = nlapiSearchRecord('sitecategory', null, filters, columns);
	var fullName = '';
	
	if(searchResults != null)
	{
		fullName = searchResults[0].getValue(columns[0]);
	}
	
	// Children
	filters = [];
	columns = [];
	
	filters[0] = new nlobjSearchFilter('externalIdString', null, 'contains', '');
	
	columns[0] = new nlobjSearchColumn('name');
	columns[1] = new nlobjSearchColumn('urlComponent');
	columns[2] = new nlobjSearchColumn('fullName');
	
	searchResults = nlapiSearchRecord('sitecategory', null, filters, columns);
	var script = 'var producers=[';
	var firstResult = true;
	
	if(searchResults != null)
	{
		for (var i = 0; i < searchResults.length; i++)
		{
			if (searchResults[i].getValue(columns[2]).search(fullName) > -1 && 
				searchResults[i].getValue(columns[2]) != fullName)
			{
				if (!firstResult)
				{
					script += ',';
				}
				script += "['" + searchResults[i].getValue(columns[0]).replace("'", "\\'") + "','" + searchResults[i].getValue(columns[1]).replace("'", "\\'") + "']";
				firstResult = false;
			}
		}
	}
	
	script += '];';

	response.write(script);
}