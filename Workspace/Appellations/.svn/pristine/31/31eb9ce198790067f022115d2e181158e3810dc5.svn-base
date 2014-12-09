// JavaScript Document
function searchSuggestion(params) {
	
	try{
	filters = params.getParameter('filters');
	values = params.getParameter('values');
	found = "";
	var BreakException= {};

	var fileObj = nlapiLoadFile(229);
	var data = fileObj.getValue();
	var lines = data.split("\n");
				var count = lines.length;
				var found = false;
				try {
				nlapiLogExecution('DEBUG', 'count', count);	
				lines.forEach(function(line){
				  // setTimeout(function () {
						speller.train(line);
						count--;
						if (count == 0) {					
							 found =  writeKeywordSuggestion(filters, values);
						}
				//	});
					
					if(found) {
						nlapiLogExecution('DEBUG', 'found', found);	
						throw BreakException;

						
					}
					
					if(found) {
						nlapiLogExecution('DEBUG', 'c', found);	
						
					}
					
				 });
				
				} catch(e) {
					if (e!==BreakException) throw e;
				}

	response.write(found);

	}catch(e){response.write("");}
}


function writeKeywordSuggestion(filters, values)
 {
	//var filters = getVars('filters');
	//var values = getVars('values');
	if(filters != null)
	{
		var arrFilters = filters.split("*");
        var arrValues = values.split("*");
		if(arrValues[0] && (arrFilters[0] == 'keywords' || arrFilters[0] == 'searchkeywords'))
		{
			var keyword = arrValues[0];		
			var correctWord = speller.correct(keyword);	
		   
			if(keyword != correctWord)
			{
				 
				return correctWord;
			}
		}
	}
	
	return false;
 }
