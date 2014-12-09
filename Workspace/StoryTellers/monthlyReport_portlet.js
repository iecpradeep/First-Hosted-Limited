/********************************************************************
 * Name: monthlySpreadSheet_portlet.js
 * Script Type: Portlet
 *
 * Version: 1.0.0 – 26/11/2012 – 1st release - PAL
 * 
 * Author: First Hosted Limited
 *
 * Purpose: A Portlet to display all of the Custom Record Set Data
 * 
 * Script: The script record id – custscript_xxx
 * Deploy: The script deployment record id – customdeploy_xxx
 *
 * Notes: This script is NOT linked to a form, and never will be
 *
 * Library: n/a
 ********************************************************************/

//declare global variables

var content = "";		//Inline HTML Portlet Content
var cssCode = "";				//Inline CSS Portlet Stylesheet
var context = nlapiGetContext();

//[TODO] - Pass this as a parameter
var refreshLink = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=66&deploy=5';





/*****************************************************
 * monthlyReport (Monthly)
 * 
 * @param {Object} portlet
 * @param {Object} column
 *****************************************************/
function monthlyReport(portlet, column)
{ 


	//Call the initialiseVariables() subroutine to set all of the content we will be using
	initialiseVariables();

	//Set the Portlet  Title 
	portlet.setTitle('The Storytellers Monthly Report');




	//#############################################################################################################

	content = replaceHeaderInformation(content);
	
	content = replaceDateRangeActualsData(content);
	content = replaceDateRangeBudgetData(content);
	content = replaceDateRangeVarianceData(content);
	content = replaceDateRangeVarianceDataPercent(content);

	content = replaceDateRangeBudgetTypeData(content);
	content = replaceDateRangeBudgetTypeVarianceData(content);
	content = replaceDateRangeBudgetTypeVarianceDataPercent(content);

	content = replaceDateRangeLastYearData(content);
	content = replaceDateRangeLastYearChangeData(content);
	content = replaceDateRangeLastYearChangeDataPercent(content);
	
	content = replaceYTDActualsData(content);
	content = replaceYTDBudgetData(content);
	content = replaceYTDVarianceData(content);
	content = replaceYTDVarianceDataPercent(content);

	content = replaceYTDBudgetTypeData(content);
	content = replaceYTDBudgetTypeVarianceData(content);
	content = replaceYTDBudgetTypeVarianceDataPercent(content);

	content = replaceYTDLastYearData(content);
	content = replaceYTDLastYearChangeData(content);
	content = replaceYTDLastYearChangeDataPercent(content);

	//#############################################################################################################

	//After we have processed all of the Data, set the Portlet to display it
	portlet.setHtml( content );
	return true;


}


/*****************************************************
 * 
 * Sub routine to initialise the variables used within this script
 * 
 *****************************************************/
function initialiseVariables()
{
	//CSS style definitions
	cssCode = 'tr{mso-height-source:auto}col{mso-width-source:auto}br{mso-data-placement:same-cell}.style852{background:#DCE6F1;mso-pattern:black none;color:black;font-size:12.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Calibri,sans-serif;mso-font-charset:0;mso-style-name:\"20% - Accent1\";mso-style-id:30}.style773{background:#EBF1DE;mso-pattern:black none;color:black;font-size:12.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Calibri,sans-serif;mso-font-charset:0;mso-style-name:\"20% - Accent3\";mso-style-id:38}.style0{mso-number-format:General;text-align:general;vertical-align:bottom;white-space:nowrap;mso-rotate:0;mso-background-source:auto;mso-pattern:auto;color:windowtext;font-size:10.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Verdana;mso-generic-font-family:auto;mso-font-charset:0;border:none;mso-protection:locked visible;mso-style-name:Normal;mso-style-id:0}.style16{mso-number-format:0%;mso-style-name:Percent;mso-style-id:5}td{mso-style-parent:style0;padding-top:1px;padding-right:1px;padding-left:1px;mso-ignore:padding;color:windowtext;font-size:10.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Verdana;mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:General;text-align:general;vertical-align:bottom;border:none;mso-background-source:auto;mso-pattern:auto;mso-protection:locked visible;white-space:nowrap;mso-rotate:0}.xl65{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0}.xl66{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\"}.xl67{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;padding-left:12px;mso-char-indent-count:1}.xl68{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";vertical-align:middle}.xl69{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0}.xl70{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"_\\(* \\#\\,\\#\\#0_\\)\\;_\\(* \\\\\\(\\#\\,\\#\\#0\\\\\\)\\;_\\(* \\0022-\\0022_\\)\\;_\\(\\@_\\)\"}.xl71{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\"}.xl72{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl73{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\"}.xl74{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl75{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl76{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\"}.xl77{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\"}.xl78{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl79{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;padding-left:12px;mso-char-indent-count:1}.xl80{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext}.xl81{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl82{mso-style-parent:style16;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl83{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl84{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\"}.xl85{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0\\.0\"}.xl86{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl87{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle}.xl88{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";text-align:right;vertical-align:middle}.xl89{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle}.xl90{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";vertical-align:middle}.xl91{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:Standard;vertical-align:middle}.xl92{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl93{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";text-align:right;vertical-align:middle}.xl94{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl95{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:0%;text-align:right;vertical-align:middle}.xl96{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl97{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";text-align:right;vertical-align:middle}.xl98{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:right;vertical-align:middle}.xl99{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl100{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl101{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl102{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\"}.xl103{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#EBF1DE;mso-pattern:black none}.xl104{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#EBF1DE;mso-pattern:black none}.xl105{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl106{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl107{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#DCE6F1;mso-pattern:black none}.xl108{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl109{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl110{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#DCE6F1;mso-pattern:black none}.xl111{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl112{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl113{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;background:#D9D9D9;mso-pattern:black none}.xl114{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";background:#D9D9D9;mso-pattern:black none}.xl115{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl116{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right}.xl117{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl118{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"_\\(* \\#\\,\\#\\#0_\\)\\;_\\(* \\\\\\(\\#\\,\\#\\#0\\\\\\)\\;_\\(* \\0022-\\0022_\\)\\;_\\(\\@_\\)\";text-align:right}.xl119{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\";text-align:right}.xl120{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;background:#D9D9D9;mso-pattern:black none}.xl121{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:right}.xl122{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl123{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_\\)\\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl124{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00000\\;\\[Red\\]\\#\\,\\#\\#0\\.00000\";vertical-align:middle}.xl125{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl126{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl127{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl128{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl129{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl130{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl131{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl132{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl133{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext}.xl134{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl135{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl136{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl137{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl138{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl139{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl140{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl141{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";background:#D9D9D9;mso-pattern:black none}.xl142{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:.5pt solid silver;border-left:none}.xl143{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl144{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\#\\,\\#\\#0\\.00\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl145{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl146{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:0%}.xl147{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl148{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl149{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl150{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl151{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle}.xl152{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl153{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle}.xl154{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl155{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl156{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:right;vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl157{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl158{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl159{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl160{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl161{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl162{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl163{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl164{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl165{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl166{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl167{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl168{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl169{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl170{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl171{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl172{mso-style-parent:style773;color:red;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl173{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl174{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl175{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl176{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none}.xl177{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl178{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl179{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl180{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl181{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl182{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl183{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl184{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl185{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl186{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl187{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl188{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl189{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl190{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl191{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"mmm\\\\-yy\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl192{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"mmm\\\\-yy\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl193{mso-style-parent:style0;color:white;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl194{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl195{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl196{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl197{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl198{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl199{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl200{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl201{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl202{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl203{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl204{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl205{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl206{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl207{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0\\.0%\\;\\\\\\(0\\.0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl208{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl209{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl210{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl211{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl212{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl213{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl214{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl215{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl216{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl217{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl218{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl219{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl220{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl221{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl222{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl223{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl224{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl225{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl226{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl227{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl228{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl229{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl230{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl231{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl232{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl233{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl234{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl235{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl236{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl237{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl238{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl239{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:right;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl240{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl241{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl242{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl243{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl244{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl245{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl246{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl247{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl248{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl249{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl250{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl251{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:right;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:1.0pt solid windowtext}.xl252{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:1.0pt solid windowtext}.xl253{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl254{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl255{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl256{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl257{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl258{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl259{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl260{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl261{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl262{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl263{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}';

	//Set the content to start witht he CSS definitions
	content = '<style type="text/css">' + cssCode + '</style>';
	
	content += '<p>Get Context Usage remaining: ' + context.getRemainingUsage() + '. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Refresh this data by clicking <a href="';
	content += refreshLink;
	content += '">here</a></p>';


	//Set the HTML Table with hash tag placeholders within it
	//Main header rows
	content += "<table border=0 cellpadding=0 cellspacing=0 width=2386 style='border-collapse: collapse;table-layout:fixed;width:1793pt'> <col class=xl86 width=58 style='mso-width-source:userset;mso-width-alt:1856; width:44pt'> <col class=xl86 width=226 style='mso-width-source:userset;mso-width-alt:7232; width:170pt'> <col class=xl86 width=105 style='mso-width-source:userset;mso-width-alt:3360; width:79pt'> <col class=xl86 width=86 style='mso-width-source:userset;mso-width-alt:2752; width:65pt'> <col class=xl86 width=96 style='mso-width-source:userset;mso-width-alt:3072; width:72pt'> <col class=xl86 width=85 style='mso-width-source:userset;mso-width-alt:2720; width:64pt'> <col class=xl86 width=101 style='mso-width-source:userset;mso-width-alt:3232; width:76pt'> <col class=xl86 width=96 style='mso-width-source:userset;mso-width-alt:3072; width:72pt'> <col class=xl86 width=77 style='mso-width-source:userset;mso-width-alt:2464; width:58pt'> <col class=xl86 width=105 style='mso-width-source:userset;mso-width-alt:3360; width:79pt'> <col class=xl86 width=103 style='mso-width-source:userset;mso-width-alt:3296; width:77pt'> <col class=xl86 width=99 style='mso-width-source:userset;mso-width-alt:3168; width:74pt'> <col class=xl86 width=110 style='mso-width-source:userset;mso-width-alt:3520; width:83pt'> <col class=xl86 width=86 style='mso-width-source:userset;mso-width-alt:2752; width:65pt'> <col class=xl86 width=103 style='mso-width-source:userset;mso-width-alt:3296; width:77pt'> <col class=xl86 width=86 style='mso-width-source:userset;mso-width-alt:2752; width:65pt'> <col class=xl86 width=93 style='mso-width-source:userset;mso-width-alt:2976; width:70pt'> <col class=xl86 width=96 style='mso-width-source:userset;mso-width-alt:3072; width:72pt'> <col class=xl86 width=85 style='mso-width-source:userset;mso-width-alt:2720; width:64pt'> <col class=xl86 width=105 style='mso-width-source:userset;mso-width-alt:3360; width:79pt'> <col class=xl86 width=103 span=2 style='mso-width-source:userset;mso-width-alt: 3296;width:77pt'><col class=xl86 width=179 style='width:134pt'>"; 
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 width=58 style='height:21.95pt;width:44pt'></td>  <td class=xl100 width=226 style='width:170pt'></td>  <td class=xl100 width=105 style='width:79pt'></td>  <td class=xl100 width=86 style='width:65pt'></td>  <td class=xl100 width=96 style='width:72pt'></td>  <td class=xl100 width=85 style='width:64pt'></td>  <td class=xl100 width=101 style='width:76pt'></td>  <td class=xl100 width=96 style='width:72pt'></td>  <td class=xl100 width=77 style='width:58pt'></td>  <td class=xl100 width=105 style='width:79pt'></td>  <td class=xl100 width=103 style='width:77pt'></td>  <td class=xl100 width=99 style='width:74pt'></td>  <td class=xl100 width=110 style='width:83pt'></td>  <td class=xl100 width=86 style='width:65pt'></td>  <td class=xl100 width=103 style='width:77pt'></td>  <td class=xl100 width=86 style='width:65pt'></td>  <td class=xl100 width=93 style='width:70pt'></td>  <td class=xl100 width=96 style='width:72pt'></td>  <td class=xl100 width=85 style='width:64pt'></td>  <td class=xl100 width=105 style='width:79pt'></td>  <td class=xl100 width=103 style='width:77pt'></td>  <td class=xl100 width=103 style='width:77pt'></td>  <td class=xl100 width=179 style='width:134pt'></td> </tr>";	
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl101 colspan=2 style='mso-ignore:colspan'><a name='Print_Area'>THE  STORYTELLERS LIMITED</a></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td> </tr>";
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl101 colspan=4 style='mso-ignore:colspan'>MANAGEMENT ACCOUNTS  ##SUMMARYDATERANGE##</td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td> </tr>";
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td> </tr>";
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td>  <td class=xl100></td> </tr>";
	
	//profit and loss header row
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl194>Profit and Loss</td>  <td colspan=10 class=xl177 style='border-right:1.0pt solid black;border-left:  none'>##DATERANGENAME##</td>  <td colspan=10 class=xl177 style='border-right:1.0pt solid black;border-left:  none'>##YEARTODATENAME##</td>  <td class=xl100></td> </tr>"; 
	//budget name row
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl195>£000s</td>  <td class=xl188 style='border-left:none'>Actual</td>  <td class=xl238>Budget</td>  <td class=xl189>Variance</td>  <td class=xl239><span style='mso-spacerun:yes'> </span>%</td>  <td class=xl238 style='border-left:none'>##BUDGETNAME##</td>  <td class=xl189>Variance</td>  <td class=xl239>%</td>  <td class=xl189>Last Year</td>  <td class=xl189>Change<span style='mso-spacerun:yes'> </span></td>  <td class=xl190>%</td>  <td class=xl191 style='border-left:none'>Actual</td>  <td class=xl238>Budget</td>  <td class=xl189>Variance<span style='mso-spacerun:yes'> </span></td>  <td class=xl239>%</td>  <td class=xl238 style='border-left:none'>##BUDGETNAME##</td>  <td class=xl189>Variance</td>  <td class=xl239>%</td>  <td class=xl192>Last Year</td>  <td class=xl189>Change<span style='mso-spacerun:yes'> </span></td>  <td class=xl193>%</td>  <td class=xl100></td> </tr>"; 
	//Row 8
	content += "<tr class=xl101 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl101 style='height:21.95pt'></td>  <td class=xl160>Revenue</td>  <td class=xl178>##C8##</td>  <td class=xl109>##D8##</td>  <td class=xl107>##E8##</td>  <td class=xl206>##F8##</td>  <td class=xl108>##G8##</td>  <td class=xl103>##H8##</td>  <td class=xl222>##I8##</td>  <td class=xl149>##J8##</td>  <td class=xl149>##K8##</td>  <td class=xl161>##L8##</td>  <td class=xl178 style='border-left:none'>##M8##</td>  <td class=xl109>##N8##</td>  <td class=xl107>##O8##</td>  <td class=xl206>##P8##</td>  <td class=xl108>##Q8##</td>  <td class=xl103>##R8##</td>  <td class=xl222>##S8##</td>  <td class=xl149>##T8##</td>  <td class=xl149>##U8##</td>  <td class=xl161>##V8##</td>  <td class=xl101></td> </tr>"; 
	//Row 9
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Programme fees</td>  <td class=xl179>##C9##</td>  <td class=xl109>##D9##</td>  <td class=xl107>##E9##</td>  <td class=xl206>##F9##</td>  <td class=xl108>##G9##</td>  <td class=xl103>##H9##</td>  <td class=xl222>##I9##</td>  <td class=xl106>##J9##</td>  <td class=xl106>##K9##</td>  <td class=xl163>##L9##</td>  <td class=xl179 style='border-left:none'>##M9##</td>  <td class=xl109>##N9##</td>  <td class=xl107>##O9##</td>  <td class=xl206>##P9##</td>  <td class=xl108>##Q9##</td>  <td class=xl103>##R9##</td>  <td class=xl222>##S9##</td>  <td class=xl106>##T9##</td>  <td class=xl106>##U9##</td>  <td class=xl163>##V9##</td>  <td class=xl105></td> </tr>"; 
	//Row 10
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Film &amp; production</td>  <td class=xl179>##C10##</td>  <td class=xl109>##D10##</td>  <td class=xl107>##E10##</td>  <td class=xl206>##F10##</td>  <td class=xl108>##G10##</td>  <td class=xl103>##H10##</td>  <td class=xl223>##I10##</td>  <td class=xl106>##J10##</td>  <td class=xl106>##K10##</td>  <td class=xl163>##L10##</td>  <td class=xl179 style='border-left:none'>##M10##</td>  <td class=xl109>##N10##</td>  <td class=xl107>##O10##</td>  <td class=xl206>##P10##</td>  <td class=xl108>##Q10##</td>  <td class=xl103>##R10##</td>  <td class=xl222>##S10##</td>  <td class=xl106>##T10##</td>  <td class=xl106>##U10##</td>  <td class=xl163>##V10##</td>  <td class=xl124></td> </tr>"; 
	//Row 11
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>StoryWeb</td>  <td class=xl179>##C11##</td>  <td class=xl109>##D11##</td>  <td class=xl107>##E11##</td>  <td class=xl206>##F11##</td>  <td class=xl108>##G11##</td>  <td class=xl103>##H11##</td>  <td class=xl223>##I11##</td>  <td class=xl106>##J11##</td>  <td class=xl106>##K11##</td>  <td class=xl163>##L11##</td>  <td class=xl179 style='border-left:none'>##M11##</td>  <td class=xl109>##N11##</td>  <td class=xl107>##O11##</td>  <td class=xl206>##P11##</td>  <td class=xl108>##Q11##</td>  <td class=xl103>##R11##</td>  <td class=xl222>##S11##</td>  <td class=xl106>##T11##</td>  <td class=xl106>##U11##</td>  <td class=xl163>##V11##</td>  <td class=xl105></td> </tr>"; 
	//Row 12
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>TS workshops</td>  <td class=xl179>##C12##</td>  <td class=xl109>##D12##</td>  <td class=xl107>##E12##</td>  <td class=xl206>##F12##</td>  <td class=xl108>##G12##</td>  <td class=xl103>##H12##</td>  <td class=xl223>##I12##</td>  <td class=xl106>##J12##</td>  <td class=xl106>##K12##</td>  <td class=xl163>##L12##</td>  <td class=xl179 style='border-left:none'>##M12##</td>  <td class=xl109>##N12##</td>  <td class=xl107>##O12##</td>  <td class=xl206>##P12##</td>  <td class=xl108>##Q12##</td>  <td class=xl103>##R12##</td>  <td class=xl222>##S12##</td>  <td class=xl106>##T12##</td>  <td class=xl106>##U12##</td>  <td class=xl163>##V12##</td>  <td class=xl105></td> </tr>"; 
	//Row 13
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Lavery Room</td>  <td class=xl179>##C13##</td>  <td class=xl109>##D13##</td>  <td class=xl107>##E13##</td>  <td class=xl206>##F13##</td>  <td class=xl108>##G13##</td>  <td class=xl103>##H13##</td>  <td class=xl223>##I13##</td>  <td class=xl106>##J13##</td>  <td class=xl106>##K13##</td>  <td class=xl163>##L13##</td>  <td class=xl179 style='border-left:none'>##M13##</td>  <td class=xl109>##N13##</td>  <td class=xl107>##O13##</td>  <td class=xl206>##P13##</td>  <td class=xl108>##Q13##</td>  <td class=xl103>##R13##</td>  <td class=xl222>##S13##</td>  <td class=xl106>##T13##</td>  <td class=xl106>##U13##</td>  <td class=xl163>##V13##</td>  <td class=xl105></td> </tr>"; 
	//Row 14
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Travel<span style='mso-spacerun:yes'> </span></td>  <td class=xl179>##C14##</td>  <td class=xl109>##D14##</td>  <td class=xl107>##E14##</td>  <td class=xl206>##F14##</td>  <td class=xl108>##G14##</td>  <td class=xl103>##H14##</td>  <td class=xl223>##I14##</td>  <td class=xl106>##J14##</td>  <td class=xl106>##K14##</td>  <td class=xl163>##L14##</td>  <td class=xl179 style='border-left:none'>##M14##</td>  <td class=xl109>##N14##</td>  <td class=xl107>##O14##</td>  <td class=xl206>##P14##</td>  <td class=xl108>##Q14##</td>  <td class=xl103>##R14##</td>  <td class=xl222>##S14##</td>  <td class=xl106>##T14##</td>  <td class=xl106>##U14##</td>  <td class=xl163>##V14##</td>  <td class=xl105></td> </tr>"; 
	//Row 15
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Currency</td>  <td class=xl179>##C15##</td>  <td class=xl109>##D15##</td>  <td class=xl107>##E15##</td>  <td class=xl206>##F15##</td>  <td class=xl108>##G15##</td>  <td class=xl103>##H15##</td>  <td class=xl223>##I15##</td>  <td class=xl106>##J15##</td>  <td class=xl106>##K15##</td>  <td class=xl163>##L15##</td>  <td class=xl179 style='border-left:none'>##M15##</td>  <td class=xl109>##N15##</td>  <td class=xl107>##O15##</td>  <td class=xl206>##P15##</td>  <td class=xl108>##Q15##</td>  <td class=xl103>##R15##</td>  <td class=xl222>##S15##</td>  <td class=xl106>##T15##</td>  <td class=xl106>##U15##</td>  <td class=xl163>##V15##</td>  <td class=xl105></td> </tr>"; 
	//Row 16
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl164>% Growth</td>  <td class=xl180>##C16##</td>  <td class=xl207>##D16##</td>  <td class=xl107>##E16##</td>  <td class=xl206>##F16##</td>  <td class=xl108>##G16##</td>  <td class=xl103>##H16##</td>  <td class=xl223>##I16##</td>  <td class=xl106>##J16##</td>  <td class=xl106>##K16##</td>  <td class=xl163>##L16##</td>  <td class=xl180 style='border-left:none'>##M16##</td>  <td class=xl109>##N16##</td>  <td class=xl107>##O16##</td>  <td class=xl206>##P16##</td>  <td class=xl108>##Q16##</td>  <td class=xl103>##R16##</td>  <td class=xl222>##S16##</td>  <td class=xl106>##T16##</td>  <td class=xl106>##U16##</td>  <td class=xl163>##V16##</td>  <td class=xl100></td> </tr>"; 
	//Row 17
	content += "<tr class=xl101 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl101 style='height:21.95pt'></td>  <td class=xl240>Cost of sales</td>  <td class=xl241>##C17##</td>  <td class=xl242>##D17##</td>  <td class=xl243>##E17##</td>  <td class=xl244>##F17##</td>  <td class=xl245 style='border-left:none'>##G17##</td>  <td class=xl246>##H17##</td>  <td class=xl247>##I17##</td>  <td class=xl248>##J17##</td>  <td class=xl248>##K17##</td>  <td class=xl249>##L17##</td>  <td class=xl241 style='border-left:none'>##M17##</td>  <td class=xl242>##N17##</td>  <td class=xl243>##O17##</td>  <td class=xl244>##P17##</td>  <td class=xl245 style='border-left:none'>##Q17##</td>  <td class=xl246>##R17##</td>  <td class=xl250>##S17##</td>  <td class=xl248>##T17##</td>  <td class=xl248>##U17##</td>  <td class=xl249>##V17##</td>  <td class=xl101></td> </tr>"; 
	//Row 18
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Programme fees</td>  <td class=xl179>##C18##</td>  <td class=xl109>##D18##</td>  <td class=xl107>##E18##</td>  <td class=xl206>##F18##</td>  <td class=xl108>##G18##</td>  <td class=xl103>##H18##</td>  <td class=xl223>##I18##</td>  <td class=xl106>##J18##</td>  <td class=xl106>##K18##</td>  <td class=xl163>##L18##</td>  <td class=xl179 style='border-left:none'>##M18##</td>  <td class=xl109>##N18##</td>  <td class=xl107>##O18##</td>  <td class=xl206>##P18##</td>  <td class=xl108>##Q18##</td>  <td class=xl103>##R18##</td>  <td class=xl222>##S18##</td>  <td class=xl106>##T18##</td>  <td class=xl106>##U18##</td>  <td class=xl163>##V18##</td>  <td class=xl105></td> </tr>"; 
	//Row 19
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Film &amp; production</td>  <td class=xl179>##C19##</td>  <td class=xl109>##D19##</td>  <td class=xl107>##E19##</td>  <td class=xl206>##F19##</td>  <td class=xl108>##G19##</td>  <td class=xl103>##H19##</td>  <td class=xl223>##I19##</td>  <td class=xl106>##J19##</td>  <td class=xl106>##K19##</td>  <td class=xl163>##L19##</td>  <td class=xl179 style='border-left:none'>##M19##</td>  <td class=xl109>##N19##</td>  <td class=xl107>##O19##</td>  <td class=xl206>##P19##</td>  <td class=xl108>##Q19##</td>  <td class=xl103>##R19##</td>  <td class=xl222>##S19##</td>  <td class=xl106>##T19##</td>  <td class=xl106>##U19##</td>  <td class=xl163>##V19##</td>  <td class=xl105></td> </tr>"; 
	//Row 20
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>StoryWeb</td>  <td class=xl179>##C20##</td>  <td class=xl109>##D20##</td>  <td class=xl107>##E20##</td>  <td class=xl206>##F20##</td>  <td class=xl108>##G20##</td>  <td class=xl103>##H20##</td>  <td class=xl223>##I20##</td>  <td class=xl106>##J20##</td>  <td class=xl106>##K20##</td>  <td class=xl163>##L20##</td>  <td class=xl179 style='border-left:none'>##M20##</td>  <td class=xl109>##N20##</td>  <td class=xl107>##O20##</td>  <td class=xl206>##P20##</td>  <td class=xl108>##Q20##</td>  <td class=xl103>##R20##</td>  <td class=xl222>##S20##</td>  <td class=xl106>##T20##</td>  <td class=xl106>##U20##</td>  <td class=xl163>##V20##</td>  <td class=xl105></td> </tr>"; 
	//Row 21
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>TS workshops</td>  <td class=xl179>##C21##</td>  <td class=xl109>##D21##</td>  <td class=xl107>##E21##</td>  <td class=xl206>##F21##</td>  <td class=xl108>##G21##</td>  <td class=xl103>##H21##</td>  <td class=xl223>##I21##</td>  <td class=xl106>##J21##</td>  <td class=xl106>##K21##</td>  <td class=xl163>##L21##</td>  <td class=xl179 style='border-left:none'>##M21##</td>  <td class=xl109>##N21##</td>  <td class=xl107>##O21##</td>  <td class=xl206>##P21##</td>  <td class=xl108>##Q21##</td>  <td class=xl103>##R21##</td>  <td class=xl223>##S21##</td>  <td class=xl106>##T21##</td>  <td class=xl106>##U21##</td>  <td class=xl163>##V21##</td>  <td class=xl105></td> </tr>"; 
	//Row 22
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Lavery Room</td>  <td class=xl179>##C22##</td>  <td class=xl109>##D22##</td>  <td class=xl107>##E22##</td>  <td class=xl206>##F22##</td>  <td class=xl108>##G22##</td>  <td class=xl103>##H22##</td>  <td class=xl223>##I22##</td>  <td class=xl106>##J22##</td>  <td class=xl106>##K22##</td>  <td class=xl163>##L22##</td>  <td class=xl179 style='border-left:none'>##M22##</td>  <td class=xl109>##N22##</td>  <td class=xl107>##O22##</td>  <td class=xl206>##P22##</td>  <td class=xl108>##Q22##</td>  <td class=xl103>##R22##</td>  <td class=xl223>##S22##</td>  <td class=xl106>##T22##</td>  <td class=xl106>##U22##</td>  <td class=xl163>##V22##</td>  <td class=xl105></td> </tr>"; 
	//Row 23
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Travel<span style='mso-spacerun:yes'> </span></td>  <td class=xl179>##C23##</td>  <td class=xl109>##D23##</td>  <td class=xl107>##E23##</td>  <td class=xl206>##F23##</td>  <td class=xl108>##G23##</td>  <td class=xl103>##H23##</td>  <td class=xl223>##I23##</td>  <td class=xl106>##J23##</td>  <td class=xl106>##K23##</td>  <td class=xl163>##L23##</td>  <td class=xl179 style='border-left:none'>##M23##</td>  <td class=xl109>##N23##</td>  <td class=xl107>##O23##</td>  <td class=xl206>##P23##</td>  <td class=xl108>##Q23##</td>  <td class=xl103>##R23##</td>  <td class=xl222>##S23##</td>  <td class=xl106>##T23##</td>  <td class=xl106>##U23##</td>  <td class=xl163>##V23##</td>  <td class=xl105></td> </tr>"; 
	//Row 24
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl162>Currency</td>  <td class=xl179>##C24##</td>  <td class=xl109>##D24##</td>  <td class=xl107>##E24##</td>  <td class=xl206>##F24##</td>  <td class=xl108>##G24##</td>  <td class=xl103>##H24##</td>  <td class=xl223>##I24##</td>  <td class=xl106>##J24##</td>  <td class=xl106>##K24##</td>  <td class=xl163>##L24##</td>  <td class=xl179 style='border-left:none'>##M24##</td>  <td class=xl109>##N24##</td>  <td class=xl107>##O24##</td>  <td class=xl206>##P24##</td>  <td class=xl108>##Q24##</td>  <td class=xl103>##R24##</td>  <td class=xl222>##S24##</td>  <td class=xl106>##T24##</td>  <td class=xl106>##U24##</td>  <td class=xl163>##V24##</td>  <td class=xl105></td> </tr>"; 
	//Row 25
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl251>% Revenue</td>  <td class=xl252>##C25##</td>  <td class=xl253>##D25##</td>  <td class=xl254>##E25##</td>  <td class=xl255>##F25##</td>  <td class=xl256 style='border-left:none'>##G25##</td>  <td class=xl257>##H25##</td>  <td class=xl258>##I25##</td>  <td class=xl259>##J25##</td>  <td class=xl260>##K25##</td>  <td class=xl261>##L25##</td>  <td class=xl252 style='border-left:none'>##M25##</td>  <td class=xl253>##N25##</td>  <td class=xl254>##O25##</td>  <td class=xl255>##P25##</td>  <td class=xl256 style='border-left:none'>##Q25##</td>  <td class=xl257>##R25##</td>  <td class=xl258>##S25##</td>  <td class=xl259>##T25##</td>  <td class=xl260>##U25##</td>  <td class=xl261>##V25##</td>  <td class=xl100></td> </tr>"; 
	//Row 26
	content += "<tr class=xl101 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl101 style='height:21.95pt'></td>  <td class=xl160>Gross profit</td>  <td class=xl178>##C26##</td>  <td class=xl109>##D26##</td>  <td class=xl107>##E26##</td>  <td class=xl206>##F26##</td>  <td class=xl108>##G26##</td>  <td class=xl103>##H26##</td>  <td class=xl222>##I26##</td>  <td class=xl149>##J26##</td>  <td class=xl149>##K26##</td>  <td class=xl161>##L26##</td>  <td class=xl178 style='border-left:none'>##M26##</td>  <td class=xl109>##N26##</td>  <td class=xl107>##O26##</td>  <td class=xl206>##P26##</td>  <td class=xl108>##Q26##</td>  <td class=xl103>##R26##</td>  <td class=xl222>##S26##</td>  <td class=xl149>##T26##</td>  <td class=xl149>##U26##</td>  <td class=xl161>##V26##</td>  <td class=xl101></td> </tr>"; 
	//Row 27
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>% Revenue</td>  <td class=xl181>##C27##</td>  <td class=xl111>##D27##</td>  <td class=xl110>##E27##</td>  <td class=xl208>##F27##</td>  <td class=xl112>##G27##</td>  <td class=xl104>##H27##</td>  <td class=xl224>##I27##</td>  <td class=xl151>##J27##</td>  <td class=xl106>##K27##</td>  <td class=xl163>##L27##</td>  <td class=xl181 style='border-left:none'>##M27##</td>  <td class=xl111>##N27##</td>  <td class=xl110>##O27##</td>  <td class=xl208>##P27##</td>  <td class=xl112>##Q27##</td>  <td class=xl104>##R27##</td>  <td class=xl224>##S27##</td>  <td class=xl151>##T27##</td>  <td class=xl106>##U27##</td>  <td class=xl163>##V27##</td>  <td class=xl105></td> </tr>"; 
	//Row 28
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>% Growth</td>  <td class=xl181>##C28##</td>  <td class=xl209>##D28##</td>  <td class=xl110>##E28##</td>  <td class=xl208>##F28##</td>  <td class=xl225>##G28##</td>  <td class=xl104>##H28##</td>  <td class=xl224>##I28##</td>  <td class=xl106>##J28##</td>  <td class=xl106>##K28##</td>  <td class=xl163>##L28##</td>  <td class=xl181 style='border-left:none'>##M28##</td>  <td class=xl209>##N28##</td>  <td class=xl110>##O28##</td>  <td class=xl208>##P28##</td>  <td class=xl225>##Q28##</td>  <td class=xl104>##R28##</td>  <td class=xl224>##S28##</td>  <td class=xl106>##T28##</td>  <td class=xl106>##U28##</td>  <td class=xl163>##V28##</td>  <td class=xl105></td> </tr>"; 
	//Row 29
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>Headcount</td>  <td class=xl182>##C29##</td>  <td class=xl148>##D29##</td>  <td class=xl110>##E29##</td>  <td class=xl208>##F29##</td>  <td class=xl147>##G29##</td>  <td class=xl104>##H29##</td>  <td class=xl224>##I29##</td>  <td class=xl152>##J29##</td>  <td class=xl106>##K29##</td>  <td class=xl163>##L29##</td>  <td class=xl182 style='border-left:none'>##M29##</td>  <td class=xl148>##N29##</td>  <td class=xl110>##O29##</td>  <td class=xl208>##P29##</td>  <td class=xl147>##Q29##</td>  <td class=xl104>##R29##</td>  <td class=xl224>##S29##</td>  <td class=xl152>##T29##</td>  <td class=xl106>##U29##</td>  <td class=xl163>##V29##</td>  <td class=xl105></td> </tr>"; 
	//Row 30
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>Efficiency</td>  <td class=xl183>##C30##</td>  <td class=xl210>##D30##</td>  <td class=xl110>##E30##</td>  <td class=xl208>##F30##</td>  <td class=xl226>##G30##</td>  <td class=xl104>##H30##</td>  <td class=xl224>##I30##</td>  <td class=xl153>##J30##</td>  <td class=xl106>##K30##</td>  <td class=xl163>##L30##</td>  <td class=xl183 style='border-left:none'>##M30##</td>  <td class=xl210>##N30##</td>  <td class=xl110>##O30##</td>  <td class=xl208>##P30##</td>  <td class=xl226>##Q30##</td>  <td class=xl104>##R30##</td>  <td class=xl224>##S30##</td>  <td class=xl153>##T30##</td>  <td class=xl106>##U30##</td>  <td class=xl163>##V30##</td>  <td class=xl105></td> </tr> ";
	//Row 31
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>GP/Head</td>  <td class=xl184>##C31##</td>  <td class=xl211>##D31##</td>  <td class=xl110>##E31##</td>  <td class=xl208>##F31##</td>  <td class=xl227>##G31##</td>  <td class=xl104>##H31##</td>  <td class=xl224>##I31##</td>  <td class=xl154>##J31##</td>  <td class=xl106>##K31##</td>  <td class=xl163>##L31##</td>  <td class=xl184 style='border-left:none'>##M31##</td>  <td class=xl211>##N31##</td>  <td class=xl110>##O31##</td>  <td class=xl208>##P31##</td>  <td class=xl227>##Q31##</td>  <td class=xl104>##R31##</td>  <td class=xl224>##S31##</td>  <td class=xl154>##T31##</td>  <td class=xl106>##U31##</td>  <td class=xl163>##V31##</td>  <td class=xl105></td> </tr>"; 
	//Row 32
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>Contribution per head</td>  <td class=xl184>##C32##</td>  <td class=xl211>##D32##</td>  <td class=xl110>##E32##</td>  <td class=xl208>##F32##</td>  <td class=xl227>##G32##</td>  <td class=xl104>##H32##</td>  <td class=xl224>##I32##</td>  <td class=xl154>##J32##</td>  <td class=xl106>##K32##</td>  <td class=xl163>##L32##</td>  <td class=xl184 style='border-left:none'>##M32##</td>  <td class=xl211>##N32##</td>  <td class=xl110>##O32##</td>  <td class=xl208>##P32##</td>  <td class=xl227>##Q32##</td>  <td class=xl104>##R32##</td>  <td class=xl224>##S32##</td>  <td class=xl154>##T32##</td>  <td class=xl106>##U32##</td>  <td class=xl163>##V32##</td>  <td class=xl105></td> </tr>"; 
	//Row 33
	content += "<tr class=xl105 height=8 style='mso-height-source:userset;height:6.0pt'>  <td height=8 class=xl105 style='height:6.0pt'></td>  <td class=xl167>&nbsp;</td>  <td class=xl185>&nbsp;</td>  <td class=xl212>&nbsp;</td>  <td class=xl155>&nbsp;</td>  <td class=xl213>&nbsp;</td>  <td class=xl228>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl229>&nbsp;</td>  <td class=xl156>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl168>&nbsp;</td>  <td class=xl185 style='border-left:none'>&nbsp;</td>  <td class=xl212>&nbsp;</td>  <td class=xl155>&nbsp;</td>  <td class=xl213>&nbsp;</td>  <td class=xl228>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl229>&nbsp;</td>  <td class=xl156>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl168>&nbsp;</td>  <td class=xl105></td> </tr>"; 
	//Row 34
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl196>Employment costs</td>  <td class=xl197>##C34##</td>  <td class=xl214>##D34##</td>  <td class=xl198>##E34##</td>  <td class=xl215>##F34##</td>  <td class=xl230 style='border-left:none'>##G34##</td>  <td class=xl199>##H34##</td>  <td class=xl231>##I34##</td>  <td class=xl200>##J34##</td>  <td class=xl200>##K34##</td>  <td class=xl201>##L34##</td>  <td class=xl197 style='border-left:none'>##M34##</td>  <td class=xl214>##N34##</td>  <td class=xl198>##O34##</td>  <td class=xl215>##P34##</td>  <td class=xl230 style='border-left:none'>##Q34##</td>  <td class=xl199>##R34##</td>  <td class=xl231>##S34##</td>  <td class=xl200>##T34##</td>  <td class=xl200>##U34##</td>  <td class=xl201>##V34##</td>  <td class=xl100></td> </tr>"; 
	//Row 35
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>% GP</td>  <td class=xl181>##C35##</td>  <td class=xl111>##D35##</td>  <td class=xl110>##E35##</td>  <td class=xl208>##F35##</td>  <td class=xl112>##G35##</td>  <td class=xl104>##H35##</td>  <td class=xl224>##I35##</td>  <td class=xl151>##J35##</td>  <td class=xl106>##K35##</td>  <td class=xl163>##L35##</td>  <td class=xl181 style='border-left:none'>##M35##</td>  <td class=xl111>##N35##</td>  <td class=xl110>##O35##</td>  <td class=xl208>##P35##</td>  <td class=xl112>##Q35##</td>  <td class=xl104>##R35##</td>  <td class=xl224>##S35##</td>  <td class=xl151>##T35##</td>  <td class=xl106>##U35##</td>  <td class=xl163>##V35##</td>  <td class=xl105></td> </tr>"; 
	//Row 36
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl169>Employment costs per head</td>  <td class=xl202>##C36##</td>  <td class=xl216>##D36##</td>  <td class=xl203>##E36##</td>  <td class=xl217>##F36##</td>  <td class=xl232 style='border-left:none'>##G36##</td>  <td class=xl204>##H36##</td>  <td class=xl233>##I36##</td>  <td class=xl205>##J36##</td>  <td class=xl174>##K36##</td>  <td class=xl176>##L36##</td>  <td class=xl202 style='border-left:none'>##M36##</td>  <td class=xl216>##N36##</td>  <td class=xl203>##O36##</td>  <td class=xl217>##P36##</td>  <td class=xl232 style='border-left:none'>##Q36##</td>  <td class=xl204>##R36##</td>  <td class=xl233>##S36##</td>  <td class=xl205>##T36##</td>  <td class=xl174>##U36##</td>  <td class=xl176>##V36##</td>  <td class=xl105></td> </tr>"; 
	//Row 37
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl196 style='border-top:none'>Property costs</td>  <td class=xl197 style='border-top:none'>##C37##</td>  <td class=xl214 style='border-top:none'>##D37##</td>  <td class=xl198>##E37##</td>  <td class=xl215 style='border-top:none'>##F37##</td>  <td class=xl230 style='border-top:none;border-left:none'>##G37##</td>  <td class=xl199>##H37##</td>  <td class=xl231 style='border-top:none'>##I37##</td>  <td class=xl200>##J37##</td>  <td class=xl200>##K37##</td>  <td class=xl201 style='border-top:none'>##L37##</td>  <td class=xl197 style='border-top:none;border-left:none'>##M37##</td>  <td class=xl214 style='border-top:none'>##N37##</td>  <td class=xl198>##O37##</td>  <td class=xl215 style='border-top:none'>##P37##</td>  <td class=xl230 style='border-top:none;border-left:none'>##Q37##</td>  <td class=xl199>##R37##</td>  <td class=xl231 style='border-top:none'>##S37##</td>  <td class=xl200>##T37##</td>  <td class=xl200>##U37##</td>  <td class=xl201 style='border-top:none'>##V37##</td>  <td class=xl100></td> </tr>"; 
	//Row 38
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl169>% GP</td>  <td class=xl187>##C38##</td>  <td class=xl218>##D38##</td>  <td class=xl203>##E38##</td>  <td class=xl217>##F38##</td>  <td class=xl234 style='border-left:none'>##G38##</td>  <td class=xl204>##H38##</td>  <td class=xl233>##I38##</td>  <td class=xl175>##J38##</td>  <td class=xl174>##K38##</td>  <td class=xl176>##L38##</td>  <td class=xl187 style='border-left:none'>##M38##</td>  <td class=xl218>##N38##</td>  <td class=xl203>##O38##</td>  <td class=xl217>##P38##</td>  <td class=xl234 style='border-left:none'>##Q38##</td>  <td class=xl204>##R38##</td>  <td class=xl233>##S38##</td>  <td class=xl175>##T38##</td>  <td class=xl174>##U38##</td>  <td class=xl176>##V38##</td>  <td class=xl105></td> </tr>"; 
	//Row 39
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl196 style='border-top:none'>Administrative costs</td>  <td class=xl197 style='border-top:none'>##C39##</td>  <td class=xl214 style='border-top:none'>##D39##</td>  <td class=xl198>##E39##</td>  <td class=xl215 style='border-top:none'>##F39##</td>  <td class=xl230 style='border-top:none;border-left:none'>##G39##</td>  <td class=xl199>##H39##</td>  <td class=xl231 style='border-top:none'>##I39##</td>  <td class=xl200>##J39##</td>  <td class=xl200>##K39##</td>  <td class=xl201 style='border-top:none'>##L39##</td>  <td class=xl197 style='border-top:none;border-left:none'>##M39##</td>  <td class=xl214 style='border-top:none'>##N39##</td>  <td class=xl198>##O39##</td>  <td class=xl215 style='border-top:none'>##P39##</td>  <td class=xl230 style='border-top:none;border-left:none'>##Q39##</td>  <td class=xl199>##R39##</td>  <td class=xl231 style='border-top:none'>##S39##</td>  <td class=xl200>##T39##</td>  <td class=xl200>##U39##</td>  <td class=xl201 style='border-top:none'>##V39##</td>  <td class=xl100></td> </tr>"; 
	//Row 40
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl169>% GP</td>  <td class=xl187>##C40##</td>  <td class=xl218>##D40##</td>  <td class=xl203>##E40##</td>  <td class=xl217>##F40##</td>  <td class=xl234 style='border-left:none'>##G40##</td>  <td class=xl204>##H40##</td>  <td class=xl233>##I40##</td>  <td class=xl175>##J40##</td>  <td class=xl174>##K40##</td>  <td class=xl176>##L40##</td>  <td class=xl187 style='border-left:none'>##M40##</td>  <td class=xl218>##N40##</td>  <td class=xl203>##O40##</td>  <td class=xl217>##P40##</td>  <td class=xl234 style='border-left:none'>##Q40##</td>  <td class=xl204>##R40##</td>  <td class=xl233>##S40##</td>  <td class=xl175>##T40##</td>  <td class=xl174>##U40##</td>  <td class=xl176>##V40##</td>  <td class=xl105></td> </tr>"; 
	//Row 41
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl196 style='border-top:none'>Professional fees</td>  <td class=xl197 style='border-top:none'>##C41##</td>  <td class=xl214 style='border-top:none'>##D41##</td>  <td class=xl198>##E41##</td>  <td class=xl215 style='border-top:none'>##F41##</td>  <td class=xl230 style='border-top:none;border-left:none'>##G41##</td>  <td class=xl199>##H41##</td>  <td class=xl231 style='border-top:none'>##I41##</td>  <td class=xl200>##J41##</td>  <td class=xl200>##K41##</td>  <td class=xl201 style='border-top:none'>##L41##</td>  <td class=xl197 style='border-top:none;border-left:none'>##M41##</td>  <td class=xl214 style='border-top:none'>##N41##</td>  <td class=xl198>##O41##</td>  <td class=xl215 style='border-top:none'>##P41##</td>  <td class=xl230 style='border-top:none;border-left:none'>##Q41##</td>  <td class=xl199>##R41##</td>  <td class=xl231 style='border-top:none'>##S41##</td>  <td class=xl200>##T41##</td>  <td class=xl200>##U41##</td>  <td class=xl201 style='border-top:none'>##V41##</td>  <td class=xl100></td> </tr>"; 
	//Row 42
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl169>% GP</td>  <td class=xl187>##C42##</td>  <td class=xl218>##D42##</td>  <td class=xl203>##E42##</td>  <td class=xl217>##F42##</td>  <td class=xl234 style='border-left:none'>##G42##</td>  <td class=xl204>##H42##</td>  <td class=xl233>##I42##</td>  <td class=xl175>##J42##</td>  <td class=xl174>##K42##</td>  <td class=xl176>##L42##</td>  <td class=xl187 style='border-left:none'>##M42##</td>  <td class=xl218>##N42##</td>  <td class=xl203>##O42##</td>  <td class=xl217>##P42##</td>  <td class=xl234 style='border-left:none'>##Q42##</td>  <td class=xl204>##R42##</td>  <td class=xl233>##S42##</td>  <td class=xl175>##T42##</td>  <td class=xl174>##U42##</td>  <td class=xl176>##V42##</td>  <td class=xl105></td> </tr>"; 
	//Row 43
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl160>Total expenses</td>  <td class=xl186>##C43##</td>  <td class=xl109>##D43##</td>  <td class=xl107>##E43##</td>  <td class=xl206>##F43##</td>  <td class=xl108>##G43##</td>  <td class=xl103>##H43##</td>  <td class=xl222>##I43##</td>  <td class=xl150>##J43##</td>  <td class=xl150>##K43##</td>  <td class=xl165>##L43##</td>  <td class=xl186 style='border-left:none'>##M43##</td>  <td class=xl109>##N43##</td>  <td class=xl107>##O43##</td>  <td class=xl206>##P43##</td>  <td class=xl108>##Q43##</td>  <td class=xl103>##R43##</td>  <td class=xl222>##S43##</td>  <td class=xl150>##T43##</td>  <td class=xl150>##U43##</td>  <td class=xl165>##V43##</td>  <td class=xl100></td> </tr>"; 
	//Row 44
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl166>% GP</td>  <td class=xl181>##C44##</td>  <td class=xl111>##D44##</td>  <td class=xl110>##E44##</td>  <td class=xl208>##F44##</td>  <td class=xl112>##G44##</td>  <td class=xl104>##H44##</td>  <td class=xl224>##I44##</td>  <td class=xl151>##J44##</td>  <td class=xl106>##K44##</td>  <td class=xl163>##L44##</td>  <td class=xl181 style='border-left:none'>##M44##</td>  <td class=xl111>##N44##</td>  <td class=xl110>##O44##</td>  <td class=xl208>##P44##</td>  <td class=xl112>##Q44##</td>  <td class=xl104>##R44##</td>  <td class=xl224>##S44##</td>  <td class=xl151>##T44##</td>  <td class=xl106>##U44##</td>  <td class=xl163>##V44##</td>  <td class=xl105></td> </tr>"; 
	//Row 45
	content += "<tr class=xl105 height=6 style='mso-height-source:userset;height:4.5pt'>  <td height=6 class=xl105 style='height:4.5pt'></td>  <td class=xl167>&nbsp;</td>  <td class=xl185>&nbsp;</td>  <td class=xl212>&nbsp;</td>  <td class=xl155>&nbsp;</td>  <td class=xl213>&nbsp;</td>  <td class=xl228>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl229>&nbsp;</td>  <td class=xl156>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl168>&nbsp;</td>  <td class=xl185 style='border-left:none'>&nbsp;</td>  <td class=xl212>&nbsp;</td>  <td class=xl155>&nbsp;</td>  <td class=xl213>&nbsp;</td>  <td class=xl228>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl229>&nbsp;</td>  <td class=xl156>&nbsp;</td>  <td class=xl157>&nbsp;</td>  <td class=xl168>&nbsp;</td>  <td class=xl105></td> </tr>"; 
	//Row 46
	content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl100 style='height:21.95pt'></td>  <td class=xl160>EBITDA</td>  <td class=xl186>##C46##</td>  <td class=xl109>##D46##</td>  <td class=xl107>##E46##</td>  <td class=xl206>##F46##</td>  <td class=xl108>##G46##</td>  <td class=xl103>##H46##</td>  <td class=xl222>##I46##</td>  <td class=xl150>##J46##</td>  <td class=xl150>##K46##</td>  <td class=xl165>##L46##</td>  <td class=xl186 style='border-left:none'>##M46##</td>  <td class=xl109>##N46##</td>  <td class=xl107>##O46##</td>  <td class=xl206>##P46##</td>  <td class=xl108>##Q46##</td>  <td class=xl103>##R46##</td>  <td class=xl222>##S46##</td>  <td class=xl150>##T46##</td>  <td class=xl150>##U46##</td>  <td class=xl165>##V46##</td>  <td class=xl100></td> </tr>"; 
	//Row 47
	content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'>  <td height=29 class=xl105 style='height:21.95pt'></td>  <td class=xl169>% GP</td>  <td class=xl187>##C47##</td>  <td class=xl219>##D47##</td>  <td class=xl220>##E47##</td>  <td class=xl221>##F47##</td>  <td class=xl235 style='border-left:none'>##G47##</td>  <td class=xl236>##H47##</td>  <td class=xl237>##I47##</td>  <td class=xl172>##J47##</td>  <td class=xl173>##K47##</td>  <td class=xl176>##L47##</td>  <td class=xl187 style='border-left:none'>##M47##</td>  <td class=xl218>##N47##</td>  <td class=xl170>##O47##</td>  <td class=xl262>##P47##</td>  <td class=xl234 style='border-left:none'>##Q47##</td>  <td class=xl171>##R47##</td>  <td class=xl263>##S47##</td>  <td class=xl175>##T47##</td>  <td class=xl173>##U47##</td>  <td class=xl176>##V47##</td>  <td class=xl105></td> </tr>"; 
	//Row 48
	content += "<tr height=21 style='mso-height-source:userset;height:15.95pt'>  <td height=21 class=xl86 style='height:15.95pt'></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl68></td>  <td class=xl86></td>  <td class=xl92></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl92></td>  <td class=xl86></td> </tr>"; 
	//Row 49
	content += "<tr height=0 style='display:none;mso-height-source:userset;mso-height-alt:  319'>  <td class=xl86></td>  <td class=xl94>Checks</td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl86></td>  <td class=xl92></td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl123 align=center>#VALUE!</td>  <td class=xl86></td>  <td class=xl92></td>  <td class=xl86></td> </tr>  <td height=21 class=xl86 style='height:15.95pt'></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td>  <td class=xl86></td> </tr></table>";

	


}

/****************************************************
 * replaceHeaderInformation
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 ****************************************************/
function replaceHeaderInformation(sourceContent)
{
	sourceContent = replaceAll(sourceContent, '##DATERANGENAME##', yearToDateName);
	sourceContent = replaceAll(sourceContent, '##SUMMARYDATERANGE##', summaryDateRange);
	sourceContent = replaceAll(sourceContent, '##BUDGETNAME##', budgetName);
	sourceContent = replaceAll(sourceContent, '##YEARTODATENAME##', year);

	return sourceContent;
}









/*****************************************************
 * replaceDateRangeActualsData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeActualsData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}

/*****************************************************
 * replaceDateRangeBudgetData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeBudgetData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeVarianceData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeVarianceData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeVarianceDataPercent
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeVarianceDataPercent(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeBudgetTypeData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeBudgetTypeData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeBudgetTypeVarianceData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeBudgetTypeVarianceData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeBudgetTypeVarianceDataPercent
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeBudgetTypeVarianceDataPercent(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeLastYearData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeLastYearData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeLastYearChangeData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeLastYearChangeData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceDateRangeLastYearChangeDataPercent
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceDateRangeLastYearChangeDataPercent(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceYTDActualsData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceYTDActualsData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceYTDBudgetData
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceYTDBudgetData(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}
/*****************************************************
 * replaceSkeletonCode
 * 
 * @param {String} sourceContent 
 * 
 *****************************************************/
function replaceSkeletonCode(sourceContent)
{
	try
	{
		sourceContent = replaceAll(sourceContent, '##TAG##', yearToDateName);


	}
	catch(e)
	{
		//Error
		nlapiLogExecution('ERROR', 'FName Error', e.message);
	}

	return sourceContent;
}








/*****************************************************
 * replaceAll - A function which uses Regular Expressions to replace all
 * instances of the given text in the input string
 * 
 * @governance 0.
 * 
 * @param inputString - The source string you wish to replace the text FROM 
 * @param stringToReplace - The text you wish to REPLACE
 * @param stringToReplaceWith - The text you wish to REPLACE IT WITH
 * @returns {String}	-	The inputString, with all text replaced
 * 
 *****************************************************/

function replaceAll(inputString,stringToReplace,stringToReplaceWith)
{
	var retVal = "";
	var regExReplace = null;
	var caseSensitive = "gi";	//force case insensitive
	
	regExReplace=new RegExp(stringToReplace,caseSensitive);
	retVal = inputString.replace(regExReplace, stringToReplaceWith);
	
	return retVal;
}

