function getReviews(params)
{

	var id = params.getParameter('id');
	var typw = params.getParameter('id');
	rec = loadItem(id);
	getrevfrom = rec.getFieldValue('custitem1');
	
	if(getrevfrom) id = getrevfrom;
	
	var html="";
	
	var columns = new Array();

	columns.push(new nlobjSearchColumn('custrecord_review_publication'));
	columns.push(new nlobjSearchColumn('custrecord_review_reviewer'));
	columns.push(new nlobjSearchColumn('custrecord_review_details'));
	columns.push(new nlobjSearchColumn('custrecord_review_date'));
	columns.push(new nlobjSearchColumn('custrecord_review_drink'));
	columns.push(new nlobjSearchColumn('custrecord_review_score'));



	var filters = new Array();
	filters[0]= new nlobjSearchFilter('custrecord_review_wine', null, 'is', id); 

	var search = nlapiSearchRecord('customrecord_review',null,filters, columns);
	if(search && search.length)
	{
		
		if(getrevfrom) {
			score = nlapiLookupField('item',id, 'custitem_scoreshown', true);	
			html +='<span id="fromscore" style="display:none;">'+score+'</span>';
		}
		
		html +='<div class="description_modules" style="clear:both"><h2 class="tasting-notes">Tasting Notes</h2><p>Select reviewer to view tasting notes</p><table cellpadding="0" cellspacing="0" width="100%"><tr class="tasting-table-title"><td class="reviewer-title">Reviewer</td><td class="score-title">Score</td><td class="review-title">Review</td></tr>';
		html +='<tr id="rvwstd" style="display:none;"><td class="rvw-er"><span class="rvw-name"></span></td><td class="rvw-score"></td><td class="rvw-details"><span class="testing-notes-review"></span><span class="testing-notes-drink"></span><br clear="all" /></td></tr>';

		
		for ( var i = 0; i < search.length; i++ )
		{
			var searchresult = search[i];
			var id = searchresult.getValue('internalid');
			var publication = searchresult.getText('custrecord_review_publication');
			var reviewer = searchresult.getText('custrecord_review_reviewer');
			var details = searchresult.getValue('custrecord_review_details');
			var reviewDate = searchresult.getValue('custrecord_review_date')
			var reviewDrink = searchresult.getValue('custrecord_review_drink');
			var reviewScore = searchresult.getValue('custrecord_review_score');
			
			firstr = (i==0)?'<td class="rvw-details" rowspan="'+search.length+'"><span class="testing-notes-review" style="color:#414042"><strong >'+reviewer+'</strong></span><span class="testing-notes-drink"><strong>Drink:</strong> '+reviewDrink+'</span><br clear="all" /><p>'+details+'</p><p style="text-align:right">' +reviewDate+'</p></td>':'';
			
			selected = (i==0)?'selectedreview':'';
			
			bolds = (i==0)?' bold ':'';
				
			
			html +='<tr id="rvw-'+i+'"><td class="rvw-er '+ selected+'" ><span class="rvw-name" onclick="moveme(\'rvw-'+i+'\')"><strong>'+reviewer+'</strong></span><span class="rvw-name">'+publication+'</span></td><td class="rvw-score '+ selected+ bolds+'" >'+ reviewScore +'<div  id="rvw-details-'+i+'" style="display:none;"><span class="testing-notes-review" style="color:#8E194D"><strong>'+reviewer+'</strong></span><span class="testing-notes-drink"><strong>Drink:</strong> '+reviewDrink+'</span><br clear="all" /><p>'+details+'</p><p style="text-align:right">' +reviewDate+'</p></div></td>'+firstr+'</tr>';
			
			/*var searchuserreviews = nlapiSearchRecord('customrecord_review',null,new nlobjSearchFilter('custrecord_review_reviewer', null, 'is', searchresult.getValue('custrecord_review_reviewer')), columns);
			
			if(searchuserreviews && searchuserreviews.length) {
				for ( var j = 0; j < searchuserreviews.length; j++ ) {
					if(searchresult.getId() != searchuserreviews[j].getId())
						html +='<tr class="rvw-'+i+'" style="display:none;"><td class="rvw-score">'+ searchuserreviews[j].getValue('custrecord_review_score') +'</td><td class="rvw-details" style="display:none;"><span class="testing-notes-review"><strong>'+searchuserreviews[j].getText('custrecord_review_reviewer')+'</strong></span><span class="testing-notes-drink"><strong>Drink:</strong> '+searchuserreviews[j].getValue('custrecord_review_drink')+', ' +nlapiStringToDate(searchuserreviews[j].getValue('custrecord_review_date')).format('F Y')+'</span><br clear="all" /><p>'+searchuserreviews[j].getValue('custrecord_review_details')+'</p></td></tr>';
				}
			}*/
			//html=html+"<span> Publication:" + publication + " Reviewer:" + reviewer + " Details:" + details + "  Date:" + reviewDate + "  Drink:" + reviewDrink + "  Score:" + reviewScore + "<br/><br/>";
		}
		html += '</table></div>';
	}
	response.write(html)	
}


Date.prototype.format=function(format){var returnStr='';var replace=Date.replaceChars;for(var i=0;i<format.length;i++){var curChar=format.charAt(i);if(i-1>=0&&format.charAt(i-1)=="\\"){returnStr+=curChar;}else if(replace[curChar]){returnStr+=replace[curChar].call(this);}else if(curChar!="\\"){returnStr+=curChar;}}return returnStr;};Date.replaceChars={shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],longMonths:['January','February','March','April','May','June','July','August','September','October','November','December'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],longDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d:function(){return(this.getDate()<10?'0':'')+this.getDate();},D:function(){return Date.replaceChars.shortDays[this.getDay()];},j:function(){return this.getDate();},l:function(){return Date.replaceChars.longDays[this.getDay()];},N:function(){return this.getDay()+1;},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')));},w:function(){return this.getDay();},z:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((this-d)/86400000);},W:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((((this-d)/86400000)+d.getDay()+1)/7);},F:function(){return Date.replaceChars.longMonths[this.getMonth()];},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+1);},M:function(){return Date.replaceChars.shortMonths[this.getMonth()];},n:function(){return this.getMonth()+1;},t:function(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).getDate()},L:function(){var year=this.getFullYear();return(year%400==0||(year%100!=0&&year%4==0));},o:function(){var d=new Date(this.valueOf());d.setDate(d.getDate()-((this.getDay()+6)%7)+3);return d.getFullYear();},Y:function(){return this.getFullYear();},y:function(){return(''+this.getFullYear()).substr(2);},a:function(){return this.getHours()<12?'am':'pm';},A:function(){return this.getHours()<12?'AM':'PM';},B:function(){return Math.floor((((this.getUTCHours()+1)%24)+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1000/24);},g:function(){return this.getHours()%12||12;},G:function(){return this.getHours();},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12);},H:function(){return(this.getHours()<10?'0':'')+this.getHours();},i:function(){return(this.getMinutes()<10?'0':'')+this.getMinutes();},s:function(){return(this.getSeconds()<10?'0':'')+this.getSeconds();},u:function(){var m=this.getMilliseconds();return(m<10?'00':(m<100?'0':''))+m;},e:function(){return"Not Yet Supported";},I:function(){return"Not Yet Supported";},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00';},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':00';},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result;},Z:function(){return-this.getTimezoneOffset()*60;},c:function(){return this.format("Y-m-d\\TH:i:sP");},r:function(){return this.toString();},U:function(){return this.getTime()/1000;}};


function loadItem(itemId) {
        try {   
                itemRecord = nlapiLoadRecord('inventoryitem', itemId);
        } catch(SSS_RECORD_TYPE_MISMATCH) {   
				try {   
						itemRecord = nlapiLoadRecord('kititem', itemId);
				} catch(SSS_RECORD_TYPE_MISMATCH) { 		
						try {   
								itemRecord = nlapiLoadRecord('noninventoryitem', itemId);
						} catch(SSS_RECORD_TYPE_MISMATCH) {     
								try {
										itemRecord = nlapiLoadRecord('discountitem', itemId);
								} catch(SSS_RECORD_TYPE_MISMATCH) {
										try {
												itemRecord = nlapiLoadRecord('assemblyitem', itemId);
										} catch(SSS_RECORD_TYPE_MISMATCH) {
												try {
													itemRecord = nlapiLoadRecord('serviceitem', itemId);
												} catch(SSS_RECORD_TYPE_MISMATCH) {
														try {
															itemRecord = nlapiLoadRecord('descriptionitem', itemId);
														} catch(e) {
																return "";
														}
												}
										}
								}
						}
				}
        }

        return itemRecord;
}