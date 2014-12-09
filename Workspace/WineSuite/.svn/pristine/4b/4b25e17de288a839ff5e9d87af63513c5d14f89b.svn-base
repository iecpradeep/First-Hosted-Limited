/********************************************************
 * Rotation customisation logic
 * Core functions used by user event / suitelets etc.
 * Version 1.0.0
 * 21/11/11
 */

function getRotationsforTransaction(theTranid, theTranType){ // Finds and enumnerates any rotations for a transaction
    var theRotations = new Array();
    //theRotations = null;
    var tranType = 'transaction'; //Returns all instances by default
	if (theTranType != null) tranType = theTranType;
	
    var rotationSearchFilters = new Array();
    var rotationSearchColumns = new Array();
    
    rotationSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is', theTranid);
    
    rotationSearchColumns[0] = new nlobjSearchColumn('tranid');
    rotationSearchColumns[1] = new nlobjSearchColumn('custcol_tran_rotation');
    rotationSearchColumns[2] = new nlobjSearchColumn('item');
    rotationSearchColumns[3] = new nlobjSearchColumn('custcol_tran_vintage');
    
    var rotationSearchResults = nlapiSearchRecord(tranType, 'customsearch_salesorders_by_rotation', rotationSearchFilters, rotationSearchColumns);
    
    if (rotationSearchResults) {
        for (var rec = 0; rec < rotationSearchResults.length; rec++) {
			theRotations[rec] = rotationSearchResults[rec].getValue(rotationSearchColumns[1]);
        }
    }
	
    return theRotations;
}

function getUniqueRotationsforTransaction(theTranid, theTranType){ // Finds and enumnerates any unique rotations for a transaction
    var theRotations = new Array();
	var tempItemsArray = getRotationsforTransaction(theTranid, theTranType);
    
    if (tempItemsArray.length > 0) {
		var uniqueRotations = 0;
        for (var rec = 0; rec < tempItemsArray.length; rec++) {
			var isUnique = true;
			for (var urec = 0; urec < theRotations.length; urec++) 
				if(tempItemsArray[rec] == theRotations[urec]) isUnique = false;
			if(isUnique){
				theRotations[uniqueRotations] = tempItemsArray[rec];
				uniqueRotations++;
			}	
        }
    }
	
    return theRotations;
}

function getDuplicateRotationsforTransaction(theTranid, theTranType){ // Finds and enumnerates any duplicated rotations for a transaction
    var theRotations = new Array();
    var tempItemsArray = getRotationsforTransaction(theTranid, theTranType);
    
    if (tempItemsArray.length > 0) {
        var dupedRotations = 0; //Compare every id with each other for dupes
        for (var rec = 0; rec < tempItemsArray.length; rec++) {
            var isDuped = false;
            for (var drec = 0; drec < tempItemsArray.length; drec++) {
				if (tempItemsArray[rec] == tempItemsArray[drec] && rec != drec) {
					isDuped = true;
				}
				if (isDuped) {
					var isUnique = true;
					for (var urec = 0; urec < theRotations.length; urec++) 
						if (tempItemsArray[rec] == theRotations[urec]) 
							isUnique = false;
					if (isUnique) {
						theRotations[dupedRotations] = tempItemsArray[rec];
						dupedRotations++;
					}
				}
			}
        }
    }
    
    return theRotations;
}

function getItemDuplicatesforTransaction (theTranid, theTranType){ // Returns any duped items for a transaction that could be merged
    var theItemDuplicates = new Array();
    var tranType = 'transaction'; //Returns all instances by default
	if (theTranType != null) tranType = theTranType;
	
    var rotationSearchFilters = new Array();
    var rotationSearchColumns = new Array();
    
    rotationSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is', theTranid);
    
    rotationSearchColumns[0] = new nlobjSearchColumn('tranid');
    rotationSearchColumns[1] = new nlobjSearchColumn('custcol_tran_rotation');
    rotationSearchColumns[2] = new nlobjSearchColumn('item');
    rotationSearchColumns[3] = new nlobjSearchColumn('unit');
    rotationSearchColumns[4] = new nlobjSearchColumn('pricelevel');
    rotationSearchColumns[5] = new nlobjSearchColumn('custcol_tran_vintage');
    
    var rotationSearchResults = nlapiSearchRecord(tranType, 'customsearch_salesorders_by_rotation', rotationSearchFilters, rotationSearchColumns);
    
    if (rotationSearchResults) {
		var dupedRotations = 0; //Compare every id with each other for dupes
        for (var rec = 0; rec < rotationSearchResults.length; rec++) {
            var isDuped = false;
            for (var drec = 0; drec < rotationSearchResults.length; drec++) {
				if (rotationSearchResults[rec].getValue(rotationSearchColumns[2]) == rotationSearchResults[drec].getValue(rotationSearchColumns[2]) && rec != drec) {
					isDuped = true;
				}
				if (isDuped) {
					var isUnique = true;
					for (var urec = 0; urec < rotationSearchResults.length; urec++) 
						if (rotationSearchResults[rec].getValue(rotationSearchColumns[2]) == theItemDuplicates[urec]) 
							isUnique = false;
					if (isUnique) {
						theItemDuplicates[dupedRotations] = rotationSearchResults[rec].getValue(rotationSearchColumns[2]);
						dupedRotations++;
					}
				}
			}
        }
    }
	
	return theItemDuplicates;
}
