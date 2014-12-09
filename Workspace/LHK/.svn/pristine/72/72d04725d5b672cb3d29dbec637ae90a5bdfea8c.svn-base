



function updateLinesOnSale(poLineNumber, reservationID)
{
			//write the values for the Reservation record back to the Invoice Line Number.  Set the costestimate type to Custom.  
			// Accessed and used by Reservation suitelet
			// Created by Toby Davidson	
			
			nlapiSelectLineItem('item', poLineNumber); 
			nlapiSetCurrentLineItemValue('item','custcol_lotreservcation',reservationID,true, true);
			nlapiSetCurrentLineItemText('item','costestimatetype','Custom',true, true);
			nlapiCommitLineItem('item');
return true;
}




//Library Functions
function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}