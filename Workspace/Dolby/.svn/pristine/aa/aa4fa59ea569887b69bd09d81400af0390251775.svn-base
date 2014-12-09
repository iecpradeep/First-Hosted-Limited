/*******************************************************
 * Name:		Dolby Client Stock Req Script
 * Script Type:	Client side script
 * Version:		1.1.0
 * Date:		16th - 18th September 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/



 function myFieldChanged(type, name, linenum)
{
	 
	 if(nlapiGetUser() == '4')
		 {
		 
			var TheValue = nlapiGetFieldValue(name);
			var TheText = nlapiGetFieldText(name);
			
			if(linenum == null)
				{
				alert('FieldChanged type = ' + type + '\nname = ' + name + '\nnvalue = ' + TheValue + '\ntext = ' + TheText);
				}
			else
				{
				alert('FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
				}
			
		 
		 }
	 else
		 {
		 return true;
		 }
}
 
 
 function OnSave()
 {
	 
	 
	 
	 
 }
 
 
//Removes white spaces before and after
function trim(str)
{
	return ltrim(rtrim(str));
}
 
//Removes white spaces before
function ltrim(str) {
	var chars = "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
//Removes white spaces after
function rtrim(str) {
	var chars = "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}





