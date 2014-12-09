// JavaScript Document
function showHighestReview(params) {
	var id = params.getParameter('id');
	var ret = "";
	var columns = new Array();

	columns.push(new nlobjSearchColumn('custrecord_review_publication'));
	columns.push(new nlobjSearchColumn('custrecord_review_reviewer'));
	columns.push(new nlobjSearchColumn('custrecord_review_details'));
	columns.push(new nlobjSearchColumn('custrecord_review_date'));
	columns.push(new nlobjSearchColumn('custrecord_review_drink'));
	columns.push(new nlobjSearchColumn('custrecord_review_score'));


	
	var filters = new Array();
	filters[0]= new nlobjSearchFilter('custrecord_review_wine', null, 'is', id); 

	var searchrev = nlapiSearchRecord('customrecord_review',null,filters, columns);
	if(searchrev && searchrev.length)
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
		
		if(searchrev[0]) {
			maxRev = 55;
			reviews = searchrev[0].getValue('custrecord_review_details');
			trimrev = reviews.substr(0, maxRev);
			review = trimrev;
			if(reviews.length > 55)
				review = trimrev.substr(0, Math.min(trimrev.length, trimrev.lastIndexOf(" ")));
			if(reviews.length >  review.length) {
					review += '...';
			}
				
			ret += '<div class="so1-reviewinfo">';
			ret += '<div class="so1-reviewer">'+searchrev[0].getText('custrecord_review_reviewer')+ '</div>';
			ret += '<div class="so1-score">'+ searchrev[0].getValue('custrecord_review_score') + '</div>';
			ret += '</div>';
			ret += '<div class="so1-review">' + review+'</div>';
		}
	}
	
	response.write(ret)
}