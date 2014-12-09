/*******************************************************
 * Name: Pipeline Recalculation for Opportunities
 * Script Type: Client
 * Version: 1.0.0
 * Date: 07 Mar 2012
 * Author: Pete Lewis, FHL
 * Purpose: Recalculates pipeline total on field change and warns the user if the totals do not match
 * Checked by:		Matthew Lawrence, FHL
 *******************************************************/

function pipelineRecalc()
{
	try
	{
		//declarations
		var pipelineTotal = 0;
		var monthTotals = new Array();
		
		//get month total values
		monthTotals[0] = parseFloat(nlapiGetFieldValue('custbody_pipelineapril'));
		monthTotals[1] = parseFloat(nlapiGetFieldValue('custbody_pipelinemay'));
		monthTotals[2] = parseFloat(nlapiGetFieldValue('custbody_pipelinejune'));
		monthTotals[3] = parseFloat(nlapiGetFieldValue('custbody_pipelinejuly'));
		monthTotals[4] = parseFloat(nlapiGetFieldValue('custbody_pipelineaugust'));
		monthTotals[5] = parseFloat(nlapiGetFieldValue('custbody_pipelineseptember'));
		monthTotals[6] = parseFloat(nlapiGetFieldValue('custbody_pipelineoctober'));
		monthTotals[7] = parseFloat(nlapiGetFieldValue('custbody_pipelinenovember'));
		monthTotals[8] = parseFloat(nlapiGetFieldValue('custbody_pipelinedecember'));
		monthTotals[9] = parseFloat(nlapiGetFieldValue('custbody_pipelinejanuary'));
		monthTotals[10] = parseFloat(nlapiGetFieldValue('custbody_pipelinefebruary'));
		monthTotals[11] = parseFloat(nlapiGetFieldValue('custbody_pipelinemarch'));
		
		//cycle through and add field totals to pipeline total
		for (var i = 0; i < monthTotals.length; i++)
		{
			if(monthTotals[i] != null && monthTotals[i] != '' && isNaN(monthTotals[i]) == false)
			{
				pipelineTotal += monthTotals[i];
			}
		}	
		if(pipelineTotal != null)
		{
			nlapiSetFieldValue('custbody_pipelinetotal', pipelineTotal,false, false);
		}
		
	}
	catch(e)
	{
		alert('Error: ' + e.message);
	}

	return true;
}


// Opportunity Pipeline On Save Event

function pipelineOppOnSave()
{
	try
	{
		//get pipeline and SO totals
		var pipelineTotal = nlapiGetFieldValue('custbody_pipelinetotal');
		var opTotal = nlapiGetFieldValue('projectedtotal');
		
		//compare totals; if no match, throw error
		if (parseFloat(pipelineTotal) != parseFloat(opTotal))
		{
			alert('Please ensure the Pipeline Total matches the Projected Total before saving.\n\nThe difference is ' + String(parseFloat(pipelineTotal) - parseFloat(opTotal)));
			return false;
		}
		else
		{
			return true;
		}
	}
	catch(e)
	{
		alert('Cannot calculate the Pipeline Total');
	}

}

function OpportunityOnSave_client()
{
	try
	{
		pipelineRecalc();
		return pipelineOppOnSave();
	}
	catch(e)
	{
		alert('Error on Save Opportunity: ' + e.message);	
	}

}
	
function OpportunityFieldChanged_client(type, name, linenum)
{
	//alert('test');
	try
	{
		if(name == 'custbody_pipelineapril' ||name == 'custbody_pipelinemay' ||name == 'custbody_pipelinejune' ||name == 'custbody_pipelinejuly' ||name == 'custbody_pipelineaugust' ||name == 'custbody_pipelineseptember' ||name == 'custbody_pipelineoctober' ||name == 'custbody_pipelinenovember' ||name == 'custbody_pipelinedecember' ||name == 'custbody_pipelinejanuary' ||name == 'custbody_pipelinefebruary' ||name == 'custbody_pipelinemarch')
		{
			pipelineRecalc();
		}
	}
	catch(e)
	{
		alert('Error on Field Changed: ' + e.message);
	}

}
