function fieldchange(type, name) {
  if (name == 'shipdate') {shipdatechanged()}
}



function shipdatechanged() {

  // get today's date
  todaysdate = new Date()

  // get value of 'Ship Date'
  shipdatevalue = nlapiGetFieldValue('shipdate');

  // decipher 'Ship Date' - based on MM/DD/YYYY
  var shipdateparts = shipdatevalue.split('/');
  shipdate = new Date(shipdateparts[2],parseInt(shipdateparts[0])-1,shipdateparts[1],23,59,59);
  shipday = shipdate.getDay();

  // check is shipdate is in the past
  if (shipdate <= todaysdate) {
    alert(shipdatevalue+" is in the past.");
    return;
  }

  // check is shipdate is today, and it's too late to ship (after 2:00)
  if (shipdate.getYear() == todaysdate.getYear() && shipdate.getMonth() == todaysdate.getMonth() && shipdate.getDate() == todaysdate.getDate() && todaysdate.getHours() >= 14) {
    alert("You have selected Same-Day Shipping after 2:00 PM.");
    return;
  }

  // check if shipdate is Sunday
  if (shipday == 0){
    alert(shipdatevalue+" is a Sunday.");
  }

  // check if shipdate is Saturday
  else if (shipday == 6){
    alert(shipdatevalue+" is a Saturday.");
  }
  else {}

}



/**
 * Name: getFolderIdByName
 * Purpose: Retrieves the folder ID of the first folder with the passed in name. Is not
 * 		case sensitive.
 * @params name - name of folder(not case sensitive)
 * @returns internal id of folder
 */
getFolderIdByName = function(name)
{
	var folder = nlapiSearchRecord('folder', null, new nlobjSearchFilter('name', null, 'is', name), null);
	if (folder == null) return null;
	return folder[0].getId();
};
		
/**
 * Name:	insertBase64File
 * Purpose:	inserts a file created from the passed in base 64 data. This file is added to the folder
 * 		specified. If the folder does not exist, it is created.
 * @params folderName - Name of folder
 * @params fileName - Name of file
 * @params fileType - Type of file
 * @params data - Base 64 encoded file contents
 * @params returnFile - optional, if true returns the file object, defaults to false and returns file id
 * @returns {}nlobjFile if returnFile is true, else returns file id
 */
insertBase64File = function(folderName, fileName, fileType, data, returnFile)
{
	//Get the folder id or create if needed
	var folderId = getFolderIdByName(folderName);
	if (folderId == null)
	{
		var folder = nlapiCreateRecord('folder');
		folder.setFieldValue('name', folderName);
		folderId = nlapiSubmitRecord(folder);
	};
	
	//Create the file
	var file = nlapiCreateFile(fileName, fileType, data);
	file.setFolder(folderId);
	//Add the file to the cabinet
	var fileId = nlapiSubmitFile(file);
	
	if (returnFile == undefined) returnFile = false;
	
	if (returnFile)
	{
		//return the submitted file
		//If we return the file object that we submitted, it does not have the Id, url, or some other properties set.
		//So we have to load the file object back in and return it.
		return nlapiLoadFile(fileId);
	}
	else
	{
		//Return the id
		return fileId;
	}
};



function searchBuild(recordType, fils, cols)
{
	
    //takes a record type id, array of filter arrays and array of column arrays
    //returns a searchresultobject
    var filters = new Array();
    var columns = new Array();
    
    if(fils)
    {
        for(f=0; f<fils.length; f++)
        {
            filters[f] = new nlobjSearchFilter( 
                fils[f][0], //record type
                fils[f][1], //join
                fils[f][2], //operator
                fils[f][3]);//comparison value
        }
    }
    if(cols)
    {
        for(c=0; c<cols.length; c++)
        {
            columns[c] = new nlobjSearchColumn(
                cols[c]); //column name
        } 
    }
    return searchResults = nlapiSearchRecord(recordType, null, filters, columns);
}


