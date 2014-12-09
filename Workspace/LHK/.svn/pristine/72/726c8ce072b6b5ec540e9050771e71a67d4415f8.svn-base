/********************************************************
 * Form Button Control
 * Enable / disable and create buttons based on record type / status etc.
 * Version 1.0.0
 * 21/11/11
 */
function controlButtons(type, form, request){
    var currentContext = nlapiGetContext();
    var role = currentContext.getRole();
    var custRec = nlapiGetNewRecord();
    var tranid = null;
    var rotations = new Array();
    var recType = null;
    
    if (custRec != null) {
        tranid = custRec.getFieldValue('tranid');
        internalid = custRec.getId();
        recType = custRec.getRecordType();
        //rotations = getDuplicateRotationsforTransaction(tranid, recType);
		rotations = getItemDuplicatesforTransaction(tranid, recType);
        //rotations = getUniqueRotationsforTransaction(tranid, recType);
        //rotations = getRotationsforTransaction(tranid, recType);
    }
    
    if (type == 'create' && currentContext.getExecutionContext() == 'userinterface') {
    }
    
    if ((type == 'edit' || type == 'view') && currentContext.getExecutionContext() == 'userinterface') {
        var buttonPrompt = recType.toTitleCase() + ' No. ' + custRec.getFieldValue('tranid');
        var saveButton = form.getButton('submitter');
        if (saveButton) 
            saveButton.setLabel('Save ' + buttonPrompt);
        var editButton = form.getButton('edit');
        if (editButton) 
            editButton.setLabel('Edit ' + buttonPrompt);
        if (rotations.length > 0) {
            var rotationslist = '';
			for (var urec = 0; urec < rotations.length; urec++) rotationslist += rotations[urec] + ' ';
            var rotationsscript = nlapiResolveURL('SUITELET', 'customscript_printrotationtransaction', 'customdeploy_printrotationtransaction') + "&custparam_tranid=" + internalid;
            var printButton = form.getButton('print');
            //if (printButton) 
            //    printButton.setDisabled(true);
            form.addButton('custpage_rotationsummary', 'Print Merged ' + buttonPrompt, "window.open('" + rotationsscript + "','_self')");
        }
    }
}

String.prototype.toTitleCase = function() {
    return this.replace(/([\w&`'��"�.@:\/\{\(\[<>_]+-? *)/g, function(match, p1, index, title) {
        if (index > 0 && title.charAt(index - 2) !== ":" &&
        	match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ \-]/i) > -1)
            return match.toLowerCase();
        if (title.substring(index - 1, index + 1).search(/['"_{(\[]/) > -1)
            return match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2);
        if (match.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || 
        	title.substring(index - 1, index + 1).search(/[\])}]/) > -1)
            return match;
        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};

