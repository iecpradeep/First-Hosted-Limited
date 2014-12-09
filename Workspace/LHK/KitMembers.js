function getKitMembers(params) {
	itemid = params.getParameter("id");
	var record = nlapiLoadRecord('kititem', itemid);
	var lineNum = record.getLineItemCount('member');
	var html = "";
	var content = "";
	if(lineNum > 0) {
		
		html += '<div class="kit-table-tit">This Case Contains:</div><div class="myTabletit"><div class="myTabletit1">Qty</div><div class="myTabletit2">Unit</div><div class="myTabletit3">Description</div></div>';
		html += '<table width="500" cellpadding="0" cellspacing="0" class="" id="myTable" style="border-top: 1px solid #666; ">'
		
		for( j = 1; j <= lineNum; j++) {
			
			var memid = record.getLineItemValue('member', 'item', j);
			var memdesc = record.getLineItemValue('member', 'memberdescr', j);
			var memqty = record.getLineItemValue('member', 'quantity', j);
			var memunit = record.getLineItemValue('member', 'memberunit', j);
			content = "";
			content += "<tr>";
			content += "<td class='myTableqty' style='padding:1px'>"+memqty+"</td><td class='myTableunit' style='padding:1px'>"+memunit+"</td><td class='myTabledsc' style='padding:1px'>"+memdesc+"</td>";
			content += "</tr>"
			
			
			html += content;
		}
		html += "</table>"
	}
	
	response.write(html);
}