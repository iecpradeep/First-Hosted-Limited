// JavaScript Document
function updateRotationInBasket() {
	
	var itemsList = nlapiSearchRecord('customrecord_rotation', 303) // make search
	
	if(itemsList) {
		for(var i = 0; i < itemsList.length; i++) {
			var context = nlapiGetContext();
			var usageRemaining = context.getRemainingUsage();
			if(usageRemaining > 50 && i < 900)
			{
				nlapiSubmitField('customrecord_rotation', itemsList[i].getId(), 'custrecord_inbasket' ,"0");
			} else {
					
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
					if ( status == 'QUEUED' )
           			 break;
			}
		}
		
	}
}