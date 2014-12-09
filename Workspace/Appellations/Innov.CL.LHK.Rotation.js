/**
* @fileOverview
* @name Innov.CL.LHK.Rotation.js
* @author Innov - Eli Beltran
* 09-12-2012
* @version 1.0
* Deployed as Client Side Script in Rotation custom record
* @description: Add Button for Update Rotation
*/


var beforeLoad = function(type, form, request){
	
	if(type == 'view' || type == 'edit'){
		form.addButton('custpage_rotation_update', 'Rotation Update', 'update()');
	}
}
