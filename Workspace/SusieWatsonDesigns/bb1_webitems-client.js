function Item_FieldChanged(type, name, linenum) {
 
 var context = nlapiGetContext();
 
 switch (name) {
  case "storedisplayname":
   ValidateFieldLength("storedisplayname", context.getSetting("SCRIPT", "custscript_bb1_wi_storename_maxchars")); break;
  case "storedescription":
   ValidateFieldLength("storedescription", context.getSetting("SCRIPT", "custscript_bb1_wi_description_maxchars")); break;
 }
 
}

function ValidateFieldLength(field, length) {

 if (!(length > 0)) return;
 
 var val = nlapiGetFieldValue(field);
 
 val = val.replace(/<[^>]*>?/g, "").replace(/\s+/g, " ");
 
 if (val.length > length) {
  alert("You have exceeded the maximum number of characters for this field. Please shorten this field by " + (val.length - length) + " characters so that it fits the space available on the web store item pages.");
 }
 
}
