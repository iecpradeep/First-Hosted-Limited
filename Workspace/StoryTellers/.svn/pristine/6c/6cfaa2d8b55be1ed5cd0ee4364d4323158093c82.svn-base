/********************************************************************
 * Name: summarySpreadSheet_portlet.js
 * Script Type: Portlet
 *
 * Version: 1.0.0 - 16/11/2012 - 1st release - PAL
 * 			1.0.5 - 10/12/2012 - Workings up until 10th December 2012 - AS
 * 			1.1.0 - 12/12/2012 - Code refactoring - PAL
 * 			1.2.0 - 13/12/2012 - Code now works, but it's ugly. Created Library to push functions into - PAL
 *  		1.3.0 - 14/12/2012 - Changing from 800 variables to 1 2D array
 *  							 - Removed most of the functions
 *  							 - Looping through Array instead of every single variable
 *  							 - Moved many functions to the Library- PAL
 *  		1.4.0 - 15/12/2012 - cell format array, and handling - PAL
 *  		1.5.0 - 16/12/2012 - Divide Cell by Cell by Cell Name functionality
 *  		1.5.1 - 17/12/2012 - Updating calculations DW
 *  		1.5.2 -	18/12/2012 - Updating calculations DW
 *  		1.6.0 - 2/1/2013 - Account Group Changes PAL
 *  		1.6.1 - 2/1/2013 - adding cellAccountGroupArray	array - AS		
 *  		1.6.2 - 10/1/2013 - changing some calculations and variables as a result of the errors found while testing - AS					 - 
 *	 		1.6.3 - 11/01/2013 - changing the 'RF' to display as Reforecast and added BUDGETNUMBER instead of BUDGETNAME - AS
 *  		1.6.4 - 11/01/2013 - changing the font size and the color of the 'Refresh data' link - AS
 *  		1.6.5 - 07/02/2013 - changing the date range start month (by adding dateRangeStartFullDate = nlapiAddMonths(today, -2); and dateRangeStart = dateRangeStartFullDate.getMonth() + 1;) - AS
 * Author: First Hosted Limited
 *
 * Purpose: A Portlet to replicate the management spreadsheet summary report
 * 
 * Script: customscript_summaryspreadsheet  
 * Deploy: customdeploy_summaryspreadsheet  
 *
 * Notes: This script is NOT linked to a form
 * 
 * ###################################################################################
 * Please note that in order for this file to make sense, you MUST have the Storytellers Management Account Spread Sheet to hand.
 * ###################################################################################
 *
 * Library:TSManagementLibrary.js
 ********************************************************************/

//declare global variables
var portletTitle = 'Storytellers Summary Spreadsheet';
var content = '';													//Inline HTML Portlet Content
var cssCode = '';													//Inline CSS Portlet Stylesheet
var context = nlapiGetContext();
var refreshLink = '/app/site/hosting/scriptlet.nl?script=73&deploy=1';

//Array of Cells, with 4 'columns' in
var cellArray = new Array(6);
var nameColumn = 0;													//name - e.g. D2
var tagColumn = 1;													//tag - e.g. ##D2##
var valueColumn = 2;												//value - e.g. 24
var typeColumn = 3;													//type - e.g. p
var linkColumn = 4;													//hyperlink - e.g. '/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_ACCOUNTTYPE=OthAsset&style=NORMAL&report=&grid=&searchid=85'
var accountGroupColumn = 5;											//account group

var calculatedCell = '';

var headCountColumns = new Array();

//These are the Cells which need to be formatted to Percent
var cellsFormatPercent = new Array('C16','C25','C27','C28','C35','C38','C40','C42','C44','C47','D25','D27','D35','D38','D40','D42','D44','D47','F8','F9','F10','F11','F12','F13','F14','F15','F16','F17','F18','F19','F20','F21','F22','F23','F24','F25','F26','F27','F28','F29','F30','F31','F32','F34','F35','F36','F37','F38','F39','F40','F41','F42','F43','F44','F46','F47','G25','G27','G35','G38','G40','G42','G44','G47','I8','I9','I10','I11','I12','I13','I14','I15','I16','I17','I18','I19','I20','I21','I22','I23','I24','I25','I26','I27','I28','I29','I30','I31','I32','I34','I35','I36','I37','I38','I39','I40','I41','I42','I43','I44','I46','I47','J25','J27','J35','J38','J40','J44','J42','J47','L8','L9','L10','L11','L12','L13','L14','L15','L16','L17','L18','L19','L20','L21','L22','L23','L24','L25','L26','L27','L28','L29','L30','L31','L32','L34','L35','L36','L37','L38','L39','L40','L41','L42','L43','L44','L46','L47','M16','M25','M27','M28','M35','M38','M40','M44','M42','M47','N25','N27','N35','N38','N40','N42','N44','N47','P8','P9','P10','P11','P12','P13','P14','P15','P16','P17','P18','P19','P20','P21','P22','P23','P24','P25','P26','P27','P28','P29','P30','P31','P32','P34','P35','P36','P37','P38','P39','P40','P41','P42','P43','P44','P46','P47','Q25','Q27','Q35','Q38','Q40','Q42','Q44','Q47','S8','S9','S10','S11','S12','S13','S14','S15','S16','S17','S18','S19','S20','S21','S22','S23','S24','S25','S26','S27','S28','S29','S30','S31','S32','S34','S35','S36','S37','S38','S39','S40','S41','S42','S43','S44','S46','S47','T25','T27','T35','T38','T40','T42','T44','T47','V8','V9','V10','V11','V12','V13','V14','V15','V16','V17','V18','V19','V20','V21','V22','V23','V24','V25','V26','V27','V28','V29','V30','V31','V32','V34','V35','V36','V37','V38','V39','V40','V41','V42','V43','V44','V46','V47');

//These are the Cells which need to be formatted to Numeric
var cellsFormatNumeric = new Array('C8','C9','C10','C11','C12','C13','C14','C15', 'C17','C18','C19','C20','C21','C22','C23','C24','C26','C29','C30','C31','C32','C34','C36','C37','C39','C41','C43','C46','D8','D9','D10','D11','D12','D13','D14','D15','D16','D17','D18','D19','D20','D21','D22','D23','D24','D26','D28','D29','D30','D31','D32','D34','D36','D37','D39','D41','D43','D46','E8','E9','E10','E11','E12','E13','E14','E15','E16','E17','E18','E19','E20','E21','E22','E23','E24','E25','E26','E27','E28','E29','E30','E31','E32','E34','E35','E36','E37','E38','E39','E40','E41','E42','E43','E44','E46','E47','G8','G9','G10','G11','G12','G13','G14','G15','G16','G17','G18','G19','G20','G21','G22','G23','G24','G26','G28','G29','G30','G31','G32','G34','G36','G37','G39','G41','G43','G46','H8','H9','H10','H11','H12','H13','H14','H15','H16','H17','H18','H19','H20','H21','H22','H23','H24','H25','H26','H27','H28','H29','H30','H31','H32','H34','H35','H36','H37','H38','H39','H40','H41','H42','H43','H44','H46','H47','J8','J9','J10','J11','J12','J13','J14','J15','J16','J17','J18','J19','J20','J21','J22','J23','J24','J26','J28','J29','J30','J31','J32','J34','J36','J37','J39','J41','J43','J46','K8','K9','K10','K11','K12','K13','K14','K15','K16','K17','K18','K19','K20','K21','K22','K23','K24','K25','K26','K27','K28','K29','K30','K31','K32','K34','K35','K36','K37','K38','K39','K40','K41','K42','K43','K44','K46','K47','M8','M9','M10','M11','M12','M13','M14','M15','M17','M18','M19','M20','M21','M22','M23','M24','M26','M29','M30','M31','M32','M34','M36','M37','M39','M41','M43','M46','N8','N9','N10','N11','N12','N13','N14','N15','N16','N17','N18','N19','N20','N21','N22','N23','N24','N26','N28','N29','N30','N31','N32','N34','N36','N37','N39','N41','N43','N46','O8','O9','O10','O11','O12','O13','O14','O15','O16','O17','O18','O19','O20','O21','O22','O23','O24','O25','O26','O27','O28','O29','O30','O31','O32','O34','O35','O36','O37','O38','O39','O40','O41','O42','O43','O44','O46','O47','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q26','Q28','Q29','Q30','Q31','Q32','Q34','Q36','Q37','Q39','Q41','Q43','Q46','R8','R9','R10','R11','R12','R13','R14','R15','R16','R17','R18','R19','R20','R21','R22','R23','R24','R25','R26','R27','R28','R29','R30','R31','R32','R34','R35','R36','R37','R38','R39','R40','R41','R42','R43','R44','R46','R47','T8','T9','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19','T20','T21','T22','T23','T24','T26','T28','T29','T30','T31','T32','T34','T36','T37','T39','T41','T43','T46','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U19','U20','U21','U22','U23','U24','U25','U26','U27','U28','U29','U30','U31','U32','U34','U35','U36','U37','U38','U39','U40','U41','U42','U43','U44','U46','U47');

// 1.6.1 - adding cellAccountGroupArray	array 
var cellAccountGroupArray = new Array(19);
cellAccountGroupArray[0] = new Array('C9', 'D9','E9','F9','G9','H9','I9','J9','K9','L9','M9','N9','O9','P9','Q9','R9','S9','T9','U9','V9');							//Account Group Internal Id = 1 (Rev : Programme fees)
cellAccountGroupArray[1] = new Array('C10', 'D10','E10','F10','G10','H10','I10','J10','K10','L10','M10','N10','O10','P10','Q10','R10','S10','T10','U10','V10');		//Account Group Internal Id = 2 (Rev: Film & Production)
cellAccountGroupArray[2] = new Array('C11', 'D11','E11','F11','G11','H11','I11','J11','K11','L11','M11','N11','O11','P11','Q11','R11','S11','T11','U11','V11');		//Account Group Internal Id = 3 (Rev: StoryWeb)
cellAccountGroupArray[3] = new Array('C12', 'D12','E12','F12','G12','H12','I12','J12','K12','L12','M12','N12','O12','P12','Q12','R12','S12','T12','U12','V12');		//Account Group Internal Id = 4 (Rev: TS workshops)
cellAccountGroupArray[4] = new Array('C13', 'D13','E13','F13','G13','H13','I13','J13','K13','L13','M13','N13','O13','P13','Q13','R13','S13','T13','U13','V13');		//Account Group Internal Id = 5 (Rev: Lavery Room)
cellAccountGroupArray[5] = new Array('C14', 'D14','E14','F14','G14','H14','I14','J14','K14','L14','M14','N14','O14','P14','Q14','R14','S14','T14','U14','V14');		//Account Group Internal Id = 6 (Rev: Travel)
cellAccountGroupArray[6] = new Array('C15', 'D15','E15','F15','G15','H15','I15','J15','K15','L15','M15','N15','O15','P15','Q15','R15','S15','T15','U15','V15');		//Account Group Internal Id = 7 (Rev: Currency)
cellAccountGroupArray[7] = new Array('C18', 'D18','E18','F18','G18','H18','I18','J18','K18','L18','M18','N18','O18','P18','Q18','R18','S18','T18','U18','V18');		//Account Group Internal Id = 8 (COS: Programme fees)
cellAccountGroupArray[8] = new Array('C19', 'D19','E19','F19','G19','H19','I19','J19','K19','L19','M19','N19','O19','P19','Q19','R19','S19','T19','U19','V19');		//Account Group Internal Id = 9 (COS: Film & Production)
cellAccountGroupArray[9] = new Array('C20', 'D20','E20','F20','G20','H20','I20','J20','K20','L20','M20','N20','O20','P20','Q20','R20','S20','T20','U20','V20');		//Account Group Internal Id = 10 (COS: StoryWeb)
cellAccountGroupArray[10] = new Array('C21', 'D21','E21','F21','G21','H21','I21','J21','K21','L21','M21','N21','O21','P21','Q21','R21','S21','T21','U21','V21');	//Account Group Internal Id = 11 (COS: TS workshops)
cellAccountGroupArray[11] = new Array('C22', 'D22','E22','F22','G22','H22','I22','J22','K22','L22','M22','N22','O22','P22','Q22','R22','S22','T22','U22','V22');	//Account Group Internal Id = 12 (COS: Lavery Room)
cellAccountGroupArray[12] = new Array('C23', 'D23','E23','F23','G23','H23','I23','J23','K23','L23','M23','N23','O23','P23','Q23','R23','S23','T23','U23','V23');	//Account Group Internal Id = 13 (COS: Travel)
cellAccountGroupArray[13] = new Array('C24', 'D24','E24','F24','G24','H24','I24','J24','K24','L24','M24','N24','O24','P24','Q24','R24','S24','T24','U24','V24');	//Account Group Internal Id = 14 (COS: Currency)
cellAccountGroupArray[14] = new Array('C34', 'D34','E34','F34','G34','H34','I34','J34','K34','L34','M34','N34','O34','P34','Q34','R34','S34','T34','U34','V34');	//Account Group Internal Id = 15 (Employment Costs)
cellAccountGroupArray[15] = new Array('C37', 'D37','E37','F37','G37','H37','I37','J37','K37','L37','M37','N37','O37','P37','Q37','R37','S37','T37','U37','V37');	//Account Group Internal Id = 16 (Property Costs)
cellAccountGroupArray[16] = new Array('C39', 'D39','E39','F39','G39','H39','I39','J39','K39','L39','M39','N39','O39','P39','Q39','R39','S39','T39','U39','V39');	//Account Group Internal Id = 17 (Administrative Costs)
cellAccountGroupArray[17] = new Array('C41', 'D41','E41','F41','G41','H41','I41','J41','K41','L41','M41','N41','O41','P41','Q41','R41','S41','T41','U41','V41');	//Account Group Internal Id = 18 (Professional Fees)
cellAccountGroupArray[18] = new Array('C29', 'D29','E29','F29','G29','H29','I29','J29','K29','L29','M29','N29','O29','P29','Q29','R29','S29','T29','U29','V29');	//Account Group Internal Id = 19 (Head Count)

var revProgrammeFees = 0;
var revFilmProduction = 0;
var revStoryWeb = 0;
var revTsWorkshops = 0;
var revLaveryRoom = 0;
var revTravel = 0;
var revCurrency = 0;
var cosProgrammingFees = 0;
var cosFilmProduction = 0;
var cosStoryWeb = 0;
var cosTsWorkshops = 0;
var cosLaveryRoom = 0;
var cosTravel = 0;
var cosCurrency = 0;
var employmentCosts = 0;
var propertyCosts = 0;
var adminCosts = 0;
var professionalFees = 0;
var summaryGroup = '';
var amount = 0;
var revTotalAmount = 0;
var cosTotalAmount = 0;
var cosRevenuePercentage = 0;
var grossProfit = 0;
var grossProfitRevenuePercentage = 0;
var summaryGroupType = '';
var totalExpenses = 0;
var EBITDA = 0;
var headCount = 0; 

var dateRangeStart = '';
var dateRangeEnd = '';
var dateRangeStartMonth = '';
var dateRangeEnddMonth = '';
var summaryDateRange = '';
var dateRangeName = '';

var searchColInternalId = '';
var rollingThreeMonthsActualsColumns = new Array();
var rollingThreeMonthsBudgetsMainColumns = new Array();
var rollingThreeMonthsBudgetsSecondColumns = new Array();
var searchColumns = new Array();

var dateRangeActuals = new Array();
var dateRangeBudgets = new Array();
var dateRangeBudgetsSecond = new Array();
var dateRangeLastYear = new Array();
var yearToDateActuals = new Array();
var yearToDateBudgets = new Array();
var yearToDateBudgetsSecond = new Array();
var yearToDateLastYear = new Array();

var resultedValue = 0;
var positiveGrossProfit = 0;
var positiveCellValue = 0;

/*****************************************************
 * summarySpreadSheet (summary tab)
 * 
 * @param {Object} Portlet Object
 * @param {Object} Column Object
 * 
 *****************************************************/
function summarySpreadSheet(portlet, column)
{ 
	//Main Control Block
	try
	{
		portlet.setTitle(portletTitle);

		//fill the cellArray with cell references, tags and required format
		populateWorksheetData();

		initialiseVariables();
		replaceHeaderInformation();								//Replace the Header Information

		initialiseGlobalVariables();
		generateDateRangeActualsData();							//Column C
		
		initialiseGlobalVariables();
		generateDateRangeBudgetsData();							//Column D
		generateDateRangeVarianceData();						//Column E
		generateDateRangeVarianceDataPercent();					//Column F
		
		initialiseGlobalVariables();
		generateDateRangeBudgetTypeData();						//Column G
		generateDateRangeBudgetTypeVarianceData();				//Column H
		generateDateRangeBudgetTypeVarianceDataPercent();		//Column I
		
		initialiseGlobalVariables();
		generateDateRangeLastYearData();						//Column J
		generateDateRangeLastYearChangeData();					//Column K
		generateDateRangeLastYearChangeDataPercent();			//Column L
	
		initialiseGlobalVariables();
		generateYearToDateActualsData();						//Column M
		
		initialiseGlobalVariables();
		generateYearToDateBudgetsData();						//Column N
		generateYearToDateVarianceData();						//Column O
		generateYearToDateVarianceDataPercent();				//Column P
		
		initialiseGlobalVariables();
		generateYearToDateBudgetTypeData();						//Column Q
		generateYearToDateBudgetTypeVarianceData();				//Column R
		generateYearToDateBudgetTypeVarianceDataPercent();		//Column S
		
		initialiseGlobalVariables();
		generateYearToDateLastYearData();						//Column T
		generateYearToDateLastYearChangeData();					//Column U
		generateYearToDateLastYearChangeDataPercent();			//Column V
		
		generateComplexCalculationData();						//Complex Calculations
			
		outputCellArrayToWorksheet();							//replace all cells in the array
		portlet.setHtml(content);								//Display the HTML in a Portlet
	}
	catch(e)
	{
		errHandler('summarySpreadsheet', e);
	}
}



/*****************************************************
 * 
 * function to initialize the variables used within this script
 * 
 *****************************************************/
function initialiseVariables()
{
	try
	{
		//1.6.4 - 11/01/2013 - changing the font size and the color of the 'Refresh data' link - AS
		//content += '<p>Get Context Usage remaining: ' + context.getRemainingUsage() + '. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Refresh this data by clicking <a href="' + refreshLink + '" target="_blank">here</a></p>';
		content += '<font color = "red" size = "5"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Before you proceed, refresh this data by clicking <a href="' + refreshLink + '" target="_blank"><font color = "red">here</a></p> </font>';

		cssCode = 'tr{mso-height-source:auto}col{mso-width-source:auto}br{mso-data-placement:same-cell}.style852{background:#DCE6F1;mso-pattern:black none;color:black;font-size:12.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Calibri,sans-serif;mso-font-charset:0;mso-style-name:\"20% - Accent1\";mso-style-id:30}.style773{background:#EBF1DE;mso-pattern:black none;color:black;font-size:12.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Calibri,sans-serif;mso-font-charset:0;mso-style-name:\"20% - Accent3\";mso-style-id:38}.style0{mso-number-format:General;text-align:general;vertical-align:bottom;white-space:nowrap;mso-rotate:0;mso-background-source:auto;mso-pattern:auto;color:windowtext;font-size:10.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Verdana;mso-generic-font-family:auto;mso-font-charset:0;border:none;mso-protection:locked visible;mso-style-name:Normal;mso-style-id:0}.style16{mso-number-format:0%;mso-style-name:Percent;mso-style-id:5}td{mso-style-parent:style0;padding-top:1px;padding-right:1px;padding-left:1px;mso-ignore:padding;color:windowtext;font-size:10.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Verdana;mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:General;text-align:general;vertical-align:bottom;border:none;mso-background-source:auto;mso-pattern:auto;mso-protection:locked visible;white-space:nowrap;mso-rotate:0}.xl65{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0}.xl66{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\"}.xl67{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;padding-left:12px;mso-char-indent-count:1}.xl68{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";vertical-align:middle}.xl69{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0}.xl70{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"_\\(* \\#\\,\\#\\#0_\\)\\;_\\(* \\\\\\(\\#\\,\\#\\#0\\\\\\)\\;_\\(* \\0022-\\0022_\\)\\;_\\(\\@_\\)\"}.xl71{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\"}.xl72{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl73{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\"}.xl74{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl75{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl76{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\"}.xl77{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\"}.xl78{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl79{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;padding-left:12px;mso-char-indent-count:1}.xl80{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext}.xl81{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl82{mso-style-parent:style16;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl83{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl84{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\"}.xl85{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0\\.0\"}.xl86{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl87{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl88{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";text-align:left;vertical-align:middle}.xl89{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl90{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";vertical-align:middle}.xl91{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:Standard;vertical-align:middle}.xl92{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl93{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";;vertical-align:middle}.xl94{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl95{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:0%;text-align:left;vertical-align:middle}.xl96{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl97{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";text-align:left;vertical-align:middle}.xl98{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle}.xl99{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl100{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl101{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl102{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\"}.xl103{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#EBF1DE;mso-pattern:black none}.xl104{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#EBF1DE;mso-pattern:black none}.xl105{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl106{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl107{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#DCE6F1;mso-pattern:black none}.xl108{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl109{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl110{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#DCE6F1;mso-pattern:black none}.xl111{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl112{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl113{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;background:#D9D9D9;mso-pattern:black none}.xl114{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";background:#D9D9D9;mso-pattern:black none}.xl115{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl116{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left}.xl117{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl118{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"_\\(* \\#\\,\\#\\#0_\\)\\;_\\(* \\\\\\(\\#\\,\\#\\#0\\\\\\)\\;_\\(* \\0022-\\0022_\\)\\;_\\(\\@_\\)\";text-align:left}.xl119{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\";text-align:left}.xl120{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;background:#D9D9D9;mso-pattern:black none}.xl121{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left}.xl122{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl123{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_\\)\\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl124{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00000\\;\\[Red\\]\\#\\,\\#\\#0\\.00000\";vertical-align:middle}.xl125{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl126{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl127{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl128{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl129{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl130{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl131{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl132{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl133{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext}.xl134{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl135{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl136{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl137{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl138{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl139{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl140{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl141{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";background:#D9D9D9;mso-pattern:black none}.xl142{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:.5pt solid silver;border-left:none}.xl143{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl144{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\#\\,\\#\\#0\\.00\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl145{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl146{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:0%}.xl147{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl148{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl149{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl150{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl151{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle}.xl152{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl153{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle}.xl154{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl155{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl156{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl157{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl158{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl159{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl160{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl161{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl162{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl163{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl164{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl165{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl166{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl167{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl168{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl169{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl170{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl171{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl172{mso-style-parent:style773;color:red;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl173{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl174{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl175{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl176{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none}.xl177{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl178{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl179{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl180{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl181{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl182{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl183{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl184{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl185{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl186{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl187{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl188{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl189{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl190{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl191{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"mmm\\\\-yy\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl192{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"mmm\\\\-yy\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl193{mso-style-parent:style0;color:white;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl194{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl195{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl196{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl197{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl198{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl199{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl200{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl201{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl202{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl203{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl204{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl205{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl206{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl207{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0\\.0%\\;\\\\\\(0\\.0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl208{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl209{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl210{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl211{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl212{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl213{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl214{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl215{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl216{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl217{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl218{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl219{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl220{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl221{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl222{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl223{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl224{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl225{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl226{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl227{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl228{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl229{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl230{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl231{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl232{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022�\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl233{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl234{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl235{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl236{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl237{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl238{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl239{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl240{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl241{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl242{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl243{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl244{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl245{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl246{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl247{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl248{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl249{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl250{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl251{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:1.0pt solid windowtext}.xl252{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:1.0pt solid windowtext}.xl253{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl254{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl255{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl256{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl257{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl258{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl259{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl260{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl261{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl262{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl263{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}';
		content += '<style type="text/css">' + cssCode + '</style>';

		//calling the initialiseDates function to initialize the dates using in the script
		initialiseDates();
		
		 //1.6.3 - 11/01/2013 - changing the 'RF' to display as Reforecast and added BUDGETNUMBER instead of BUDGETNAME
		//Set the HTML Table with hash tag placeholders within it
		//Please note that in order for this file to make sense, you MUST have the Storytellers Management Account Spread Sheet in hand.
		content += "<table border=0 cellpadding=0 cellspacing=0 width=2386 style='border-collapse: collapse;table-layout:fixed;width:1793pt'> <col class=xl86 width=58 style='mso-width-source:userset;mso-width-alt:1856; width:44pt'> <col class=xl86 width=226 style='mso-width-source:userset;mso-width-alt:7232; width:170pt'> <col class=xl86 width=105 style='mso-width-source:userset;mso-width-alt:3360; width:79pt'> <col class=xl86 width=86 style='mso-width-source:userset;mso-width-alt:2752; width:65pt'> <col class=xl86 width=96 style='mso-width-source:userset;mso-width-alt:3072; width:72pt'> <col class=xl86 width=85 style='mso-width-source:userset;mso-width-alt:2720; width:64pt'> <col class=xl86 width=101 style='mso-width-source:userset;mso-width-alt:3232; width:76pt'> <col class=xl86 width=96 style='mso-width-source:userset;mso-width-alt:3072; width:72pt'> <col class=xl86 width=77 style='mso-width-source:userset;mso-width-alt:2464; width:58pt'> <col class=xl86 width=105 style='mso-width-source:userset;mso-width-alt:3360; width:79pt'> <col class=xl86 width=103 style='mso-width-source:userset;mso-width-alt:3296; width:77pt'> <col class=xl86 width=99 style='mso-width-source:userset;mso-width-alt:3168; width:74pt'> <col class=xl86 width=110 style='mso-width-source:userset;mso-width-alt:3520; width:83pt'> <col class=xl86 width=86 style='mso-width-source:userset;mso-width-alt:2752; width:65pt'> <col class=xl86 width=103 style='mso-width-source:userset;mso-width-alt:3296; width:77pt'> <col class=xl86 width=86 style='mso-width-source:userset;mso-width-alt:2752; width:65pt'> <col class=xl86 width=93 style='mso-width-source:userset;mso-width-alt:2976; width:70pt'> <col class=xl86 width=96 style='mso-width-source:userset;mso-width-alt:3072; width:72pt'> <col class=xl86 width=85 style='mso-width-source:userset;mso-width-alt:2720; width:64pt'> <col class=xl86 width=105 style='mso-width-source:userset;mso-width-alt:3360; width:79pt'> <col class=xl86 width=103 span=2 style='mso-width-source:userset;mso-width-alt: 3296;width:77pt'><col class=xl86 width=179 style='width:134pt'>";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 width=58 style='height:21.95pt;width:44pt'></td> <td class=xl100 width=226 style='width:170pt'></td> <td class=xl100 width=105 style='width:79pt'></td> <td class=xl100 width=86 style='width:65pt'></td> <td class=xl100 width=96 style='width:72pt'></td> <td class=xl100 width=85 style='width:64pt'></td> <td class=xl100 width=101 style='width:76pt'></td> <td class=xl100 width=96 style='width:72pt'></td> <td class=xl100 width=77 style='width:58pt'></td> <td class=xl100 width=105 style='width:79pt'></td> <td class=xl100 width=103 style='width:77pt'></td> <td class=xl100 width=99 style='width:74pt'></td> <td class=xl100 width=110 style='width:83pt'></td> <td class=xl100 width=86 style='width:65pt'></td> <td class=xl100 width=103 style='width:77pt'></td> <td class=xl100 width=86 style='width:65pt'></td> <td class=xl100 width=93 style='width:70pt'></td> <td class=xl100 width=96 style='width:72pt'></td> <td class=xl100 width=85 style='width:64pt'></td> <td class=xl100 width=105 style='width:79pt'></td> <td class=xl100 width=103 style='width:77pt'></td> <td class=xl100 width=103 style='width:77pt'></td> <td class=xl100 width=179 style='width:134pt'></td> </tr>";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl101 colspan=2 style='mso-ignore:colspan'><a name='Print_Area'>THE  STORYTELLERS LIMITED</a></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> </tr>";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl101 colspan=4 style='mso-ignore:colspan'>MANAGEMENT ACCOUNTS  ##SUMMARYDATERANGE##</td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> </tr>";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> </tr>";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> <td class=xl100></td> </tr>"; 
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl194>Profit and Loss</td> <td colspan=10 class=xl177 style='border-right:1.0pt solid black;border-left:  none'>##DATERANGENAME##</td> <td colspan=10 class=xl177 style='border-right:1.0pt solid black;border-left:  none'>Year-to-Date</td> <td class=xl100></td> </tr>"; 
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl195>&pound;000s</td> <td class=xl188 style='border-left:none'>Actual</td> <td class=xl238>Budget</td> <td class=xl189>Variance</td> <td class=xl239><span style='mso-spacerun:yes'></span>%</td> <td class=xl238 style='border-left:none'> Reforecast ##BUDGETNUMBER##</td> <td class=xl189>Variance</td> <td class=xl239>%</td> <td class=xl189>Last Year</td> <td class=xl189>Change<span style='mso-spacerun:yes'></span></td> <td class=xl190>%</td> <td class=xl191 style='border-left:none'>Actual</td> <td class=xl238>Budget</td> <td class=xl189>Variance<span style='mso-spacerun:yes'></span></td> <td class=xl239>%</td> <td class=xl238 style='border-left:none'> Reforecast ##BUDGETNUMBER##</td> <td class=xl189>Variance</td> <td class=xl239>%</td> <td class=xl192>Last Year</td> <td class=xl189>Change<span style='mso-spacerun:yes'></span></td> <td class=xl193>%</td> <td class=xl100></td> </tr>";
		content += "<tr class=xl101 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl101 style='height:21.95pt'></td> <td class=xl160>Revenue</td> <td class=xl178>##C8##</td> <td class=xl109>##D8##</td> <td class=xl107>##E8##</td> <td class=xl206>##F8##</td> <td class=xl108>##G8##</td> <td class=xl103>##H8##</td> <td class=xl222>##I8##</td> <td class=xl149>##J8##</td> <td class=xl149>##K8##</td> <td class=xl161>##L8##</td> <td class=xl178 style='border-left:none'>##M8##</td> <td class=xl109>##N8##</td> <td class=xl107>##O8##</td> <td class=xl206>##P8##</td> <td class=xl108>##Q8##</td> <td class=xl103>##R8##</td> <td class=xl222>##S8##</td> <td class=xl149>##T8##</td> <td class=xl149>##U8##</td> <td class=xl161>##V8##</td> <td class=xl101></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Programme fees</td> <td class=xl179>##C9##</td> <td class=xl109>##D9##</td> <td class=xl107>##E9##</td> <td class=xl206>##F9##</td> <td class=xl108>##G9##</td> <td class=xl103>##H9##</td> <td class=xl222>##I9##</td> <td class=xl106>##J9##</td> <td class=xl106>##K9##</td> <td class=xl163>##L9##</td> <td class=xl179 style='border-left:none'>##M9##</td> <td class=xl109>##N9##</td> <td class=xl107>##O9##</td> <td class=xl206>##P9##</td> <td class=xl108>##Q9##</td> <td class=xl103>##R9##</td> <td class=xl222>##S9##</td> <td class=xl106>##T9##</td> <td class=xl106>##U9##</td> <td class=xl163>##V9##</td> <td class=xl105></td> </tr>"; 
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Film &amp; production</td> <td class=xl179>##C10##</td> <td class=xl109>##D10##</td> <td class=xl107>##E10##</td> <td class=xl206>##F10##</td> <td class=xl108>##G10##</td> <td class=xl103>##H10##</td> <td class=xl223>##I10##</td> <td class=xl106>##J10##</td> <td class=xl106>##K10##</td> <td class=xl163>##L10##</td> <td class=xl179 style='border-left:none'>##M10##</td> <td class=xl109>##N10##</td> <td class=xl107>##O10##</td> <td class=xl206>##P10##</td> <td class=xl108>##Q10##</td> <td class=xl103>##R10##</td> <td class=xl222>##S10##</td> <td class=xl106>##T10##</td> <td class=xl106>##U10##</td> <td class=xl163>##V10##</td> <td class=xl124></td> </tr>"; 
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>StoryWeb</td> <td class=xl179>##C11##</td> <td class=xl109>##D11##</td> <td class=xl107>##E11##</td> <td class=xl206>##F11##</td> <td class=xl108>##G11##</td> <td class=xl103>##H11##</td> <td class=xl223>##I11##</td> <td class=xl106>##J11##</td> <td class=xl106>##K11##</td> <td class=xl163>##L11##</td> <td class=xl179 style='border-left:none'>##M11##</td> <td class=xl109>##N11##</td> <td class=xl107>##O11##</td> <td class=xl206>##P11##</td> <td class=xl108>##Q11##</td> <td class=xl103>##R11##</td> <td class=xl222>##S11##</td> <td class=xl106>##T11##</td> <td class=xl106>##U11##</td> <td class=xl163>##V11##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>TS workshops</td> <td class=xl179>##C12##</td> <td class=xl109>##D12##</td> <td class=xl107>##E12##</td> <td class=xl206>##F12##</td> <td class=xl108>##G12##</td> <td class=xl103>##H12##</td> <td class=xl223>##I12##</td> <td class=xl106>##J12##</td> <td class=xl106>##K12##</td> <td class=xl163>##L12##</td> <td class=xl179 style='border-left:none'>##M12##</td> <td class=xl109>##N12##</td> <td class=xl107>##O12##</td> <td class=xl206>##P12##</td> <td class=xl108>##Q12##</td> <td class=xl103>##R12##</td> <td class=xl222>##S12##</td> <td class=xl106>##T12##</td> <td class=xl106>##U12##</td> <td class=xl163>##V12##</td> <td class=xl105></td> </tr>"; 
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Lavery Room</td> <td class=xl179>##C13##</td> <td class=xl109>##D13##</td> <td class=xl107>##E13##</td> <td class=xl206>##F13##</td> <td class=xl108>##G13##</td> <td class=xl103>##H13##</td> <td class=xl223>##I13##</td> <td class=xl106>##J13##</td> <td class=xl106>##K13##</td> <td class=xl163>##L13##</td> <td class=xl179 style='border-left:none'>##M13##</td> <td class=xl109>##N13##</td> <td class=xl107>##O13##</td> <td class=xl206>##P13##</td> <td class=xl108>##Q13##</td> <td class=xl103>##R13##</td> <td class=xl222>##S13##</td> <td class=xl106>##T13##</td> <td class=xl106>##U13##</td> <td class=xl163>##V13##</td> <td class=xl105></td> </tr>"; 
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Travel<span style='mso-spacerun:yes'></span></td> <td class=xl179>##C14##</td> <td class=xl109>##D14##</td> <td class=xl107>##E14##</td> <td class=xl206>##F14##</td> <td class=xl108>##G14##</td> <td class=xl103>##H14##</td> <td class=xl223>##I14##</td> <td class=xl106>##J14##</td> <td class=xl106>##K14##</td> <td class=xl163>##L14##</td> <td class=xl179 style='border-left:none'>##M14##</td> <td class=xl109>##N14##</td> <td class=xl107>##O14##</td> <td class=xl206>##P14##</td> <td class=xl108>##Q14##</td> <td class=xl103>##R14##</td> <td class=xl222>##S14##</td> <td class=xl106>##T14##</td> <td class=xl106>##U14##</td> <td class=xl163>##V14##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Currency</td> <td class=xl179>##C15##</td> <td class=xl109>##D15##</td> <td class=xl107>##E15##</td> <td class=xl206>##F15##</td> <td class=xl108>##G15##</td> <td class=xl103>##H15##</td> <td class=xl223>##I15##</td> <td class=xl106>##J15##</td> <td class=xl106>##K15##</td> <td class=xl163>##L15##</td> <td class=xl179 style='border-left:none'>##M15##</td> <td class=xl109>##N15##</td> <td class=xl107>##O15##</td> <td class=xl206>##P15##</td> <td class=xl108>##Q15##</td> <td class=xl103>##R15##</td> <td class=xl222>##S15##</td> <td class=xl106>##T15##</td> <td class=xl106>##U15##</td> <td class=xl163>##V15##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl164>% Growth</td> <td class=xl180>##C16##</td> <td class=xl207></td> <td class=xl107></td> <td class=xl206></td> <td class=xl108></td> <td class=xl103></td> <td class=xl223></td> <td class=xl106></td> <td class=xl106></td> <td class=xl163></td> <td class=xl180 style='border-left:none'>##M16##</td> <td class=xl109></td> <td class=xl107></td> <td class=xl206></td> <td class=xl108></td> <td class=xl103></td> <td class=xl222></td> <td class=xl106></td> <td class=xl106></td> <td class=xl163></td> <td class=xl100></td> </tr>"; 
		content += "<tr class=xl101 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl101 style='height:21.95pt'></td> <td class=xl240>Cost of sales</td> <td class=xl241>##C17##</td> <td class=xl242>##D17##</td> <td class=xl243>##E17##</td> <td class=xl244>##F17##</td> <td class=xl245 style='border-left:none'>##G17##</td> <td class=xl246>##H17##</td> <td class=xl247>##I17##</td> <td class=xl248>##J17##</td> <td class=xl248>##K17##</td> <td class=xl249>##L17##</td> <td class=xl241 style='border-left:none'>##M17##</td> <td class=xl242>##N17##</td> <td class=xl243>##O17##</td> <td class=xl244>##P17##</td> <td class=xl245 style='border-left:none'>##Q17##</td> <td class=xl246>##R17##</td> <td class=xl250>##S17##</td> <td class=xl248>##T17##</td> <td class=xl248>##U17##</td> <td class=xl249>##V17##</td> <td class=xl101></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Programme fees</td> <td class=xl179>##C18##</td> <td class=xl109>##D18##</td> <td class=xl107>##E18##</td> <td class=xl206>##F18##</td> <td class=xl108>##G18##</td> <td class=xl103>##H18##</td> <td class=xl223>##I18##</td> <td class=xl106>##J18##</td> <td class=xl106>##K18##</td> <td class=xl163>##L18##</td> <td class=xl179 style='border-left:none'>##M18##</td> <td class=xl109>##N18##</td> <td class=xl107>##O18##</td> <td class=xl206>##P18##</td> <td class=xl108>##Q18##</td> <td class=xl103>##R18##</td> <td class=xl222>##S18##</td> <td class=xl106>##T18##</td> <td class=xl106>##U18##</td> <td class=xl163>##V18##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Film &amp; production</td> <td class=xl179>##C19##</td> <td class=xl109>##D19##</td> <td class=xl107>##E19##</td> <td class=xl206>##F19##</td> <td class=xl108>##G19##</td> <td class=xl103>##H19##</td> <td class=xl223>##I19##</td> <td class=xl106>##J19##</td> <td class=xl106>##K19##</td> <td class=xl163>##L19##</td> <td class=xl179 style='border-left:none'>##M19##</td> <td class=xl109>##N19##</td> <td class=xl107>##O19##</td> <td class=xl206>##P19##</td> <td class=xl108>##Q19##</td> <td class=xl103>##R19##</td> <td class=xl222>##S19##</td> <td class=xl106>##T19##</td> <td class=xl106>##U19##</td> <td class=xl163>##V19##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>StoryWeb</td> <td class=xl179>##C20##</td> <td class=xl109>##D20##</td> <td class=xl107>##E20##</td> <td class=xl206>##F20##</td> <td class=xl108>##G20##</td> <td class=xl103>##H20##</td> <td class=xl223>##I20##</td> <td class=xl106>##J20##</td> <td class=xl106>##K20##</td> <td class=xl163>##L20##</td> <td class=xl179 style='border-left:none'>##M20##</td> <td class=xl109>##N20##</td> <td class=xl107>##O20##</td> <td class=xl206>##P20##</td> <td class=xl108>##Q20##</td> <td class=xl103>##R20##</td> <td class=xl222>##S20##</td> <td class=xl106>##T20##</td> <td class=xl106>##U20##</td> <td class=xl163>##V20##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>TS workshops</td> <td class=xl179>##C21##</td> <td class=xl109>##D21##</td> <td class=xl107>##E21##</td> <td class=xl206>##F21##</td> <td class=xl108>##G21##</td> <td class=xl103>##H21##</td> <td class=xl223>##I21##</td> <td class=xl106>##J21##</td> <td class=xl106>##K21##</td> <td class=xl163>##L21##</td> <td class=xl179 style='border-left:none'>##M21##</td> <td class=xl109>##N21##</td> <td class=xl107>##O21##</td> <td class=xl206>##P21##</td> <td class=xl108>##Q21##</td> <td class=xl103>##R21##</td> <td class=xl223>##S21##</td> <td class=xl106>##T21##</td> <td class=xl106>##U21##</td> <td class=xl163>##V21##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Lavery Room</td> <td class=xl179>##C22##</td> <td class=xl109>##D22##</td> <td class=xl107>##E22##</td> <td class=xl206>##F22##</td> <td class=xl108>##G22##</td> <td class=xl103>##H22##</td> <td class=xl223>##I22##</td> <td class=xl106>##J22##</td> <td class=xl106>##K22##</td> <td class=xl163>##L22##</td> <td class=xl179 style='border-left:none'>##M22##</td> <td class=xl109>##N22##</td> <td class=xl107>##O22##</td> <td class=xl206>##P22##</td> <td class=xl108>##Q22##</td> <td class=xl103>##R22##</td> <td class=xl223>##S22##</td> <td class=xl106>##T22##</td> <td class=xl106>##U22##</td> <td class=xl163>##V22##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Travel<span style='mso-spacerun:yes'></span></td> <td class=xl179>##C23##</td> <td class=xl109>##D23##</td> <td class=xl107>##E23##</td> <td class=xl206>##F23##</td> <td class=xl108>##G23##</td> <td class=xl103>##H23##</td> <td class=xl223>##I23##</td> <td class=xl106>##J23##</td> <td class=xl106>##K23##</td> <td class=xl163>##L23##</td> <td class=xl179 style='border-left:none'>##M23##</td> <td class=xl109>##N23##</td> <td class=xl107>##O23##</td> <td class=xl206>##P23##</td> <td class=xl108>##Q23##</td> <td class=xl103>##R23##</td> <td class=xl222>##S23##</td> <td class=xl106>##T23##</td> <td class=xl106>##U23##</td> <td class=xl163>##V23##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl162>Currency</td> <td class=xl179>##C24##</td> <td class=xl109>##D24##</td> <td class=xl107>##E24##</td> <td class=xl206>##F24##</td> <td class=xl108>##G24##</td> <td class=xl103>##H24##</td> <td class=xl223>##I24##</td> <td class=xl106>##J24##</td> <td class=xl106>##K24##</td> <td class=xl163>##L24##</td> <td class=xl179 style='border-left:none'>##M24##</td> <td class=xl109>##N24##</td> <td class=xl107>##O24##</td> <td class=xl206>##P24##</td> <td class=xl108>##Q24##</td> <td class=xl103>##R24##</td> <td class=xl222>##S24##</td> <td class=xl106>##T24##</td> <td class=xl106>##U24##</td> <td class=xl163>##V24##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl251>% Revenue</td> <td class=xl252>##C25##</td> <td class=xl253>##D25##</td> <td class=xl254>##E25##</td> <td class=xl255>##F25##</td> <td class=xl256 style='border-left:none'>##G25##</td> <td class=xl257>##H25##</td> <td class=xl258>##I25##</td> <td class=xl259>##J25##</td> <td class=xl260>##K25##</td> <td class=xl261>##L25##</td> <td class=xl252 style='border-left:none'>##M25##</td> <td class=xl253>##N25##</td> <td class=xl254>##O25##</td> <td class=xl255>##P25##</td> <td class=xl256 style='border-left:none'>##Q25##</td> <td class=xl257>##R25##</td> <td class=xl258>##S25##</td> <td class=xl259>##T25##</td> <td class=xl260>##U25##</td> <td class=xl261>##V25##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl101 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl101 style='height:21.95pt'></td> <td class=xl160>Gross profit</td> <td class=xl178>##C26##</td> <td class=xl109>##D26##</td> <td class=xl107>##E26##</td> <td class=xl206>##F26##</td> <td class=xl108>##G26##</td> <td class=xl103>##H26##</td> <td class=xl222>##I26##</td> <td class=xl149>##J26##</td> <td class=xl149>##K26##</td> <td class=xl161>##L26##</td> <td class=xl178 style='border-left:none'>##M26##</td> <td class=xl109>##N26##</td> <td class=xl107>##O26##</td> <td class=xl206>##P26##</td> <td class=xl108>##Q26##</td> <td class=xl103>##R26##</td> <td class=xl222>##S26##</td> <td class=xl149>##T26##</td> <td class=xl149>##U26##</td> <td class=xl161>##V26##</td> <td class=xl101></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>% Revenue</td> <td class=xl181>##C27##</td> <td class=xl111>##D27##</td> <td class=xl110>##E27##</td> <td class=xl208>##F27##</td> <td class=xl112>##G27##</td> <td class=xl104>##H27##</td> <td class=xl224>##I27##</td> <td class=xl151>##J27##</td> <td class=xl106>##K27##</td> <td class=xl163>##L27##</td> <td class=xl181 style='border-left:none'>##M27##</td> <td class=xl111>##N27##</td> <td class=xl110>##O27##</td> <td class=xl208>##P27##</td> <td class=xl112>##Q27##</td> <td class=xl104>##R27##</td> <td class=xl224>##S27##</td> <td class=xl151>##T27##</td> <td class=xl106>##U27##</td> <td class=xl163>##V27##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>% Growth</td> <td class=xl181>##C28##</td> <td class=xl209>##D28##</td> <td class=xl110>##E28##</td> <td class=xl208>##F28##</td> <td class=xl225>##G28##</td> <td class=xl104>##H28##</td> <td class=xl224>##I28##</td> <td class=xl106>##J28##</td> <td class=xl106>##K28##</td> <td class=xl163>##L28##</td> <td class=xl181 style='border-left:none'>##M28##</td> <td class=xl209>##N28##</td> <td class=xl110>##O28##</td> <td class=xl208>##P28##</td> <td class=xl225>##Q28##</td> <td class=xl104>##R28##</td> <td class=xl224>##S28##</td> <td class=xl106>##T28##</td> <td class=xl106>##U28##</td> <td class=xl163>##V28##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>Headcount</td> <td class=xl182>##C29##</td> <td class=xl148>##D29##</td> <td class=xl110>##E29##</td> <td class=xl208>##F29##</td> <td class=xl147>##G29##</td> <td class=xl104>##H29##</td> <td class=xl224>##I29##</td> <td class=xl152>##J29##</td> <td class=xl106>##K29##</td> <td class=xl163>##L29##</td> <td class=xl182 style='border-left:none'>##M29##</td> <td class=xl148>##N29##</td> <td class=xl110>##O29##</td> <td class=xl208>##P29##</td> <td class=xl147>##Q29##</td> <td class=xl104>##R29##</td> <td class=xl224>##S29##</td> <td class=xl152>##T29##</td> <td class=xl106>##U29##</td> <td class=xl163>##V29##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>Efficiency</td> <td class=xl183>##C30##</td> <td class=xl210>##D30##</td> <td class=xl110>##E30##</td> <td class=xl208>##F30##</td> <td class=xl226>##G30##</td> <td class=xl104>##H30##</td> <td class=xl224>##I30##</td> <td class=xl153>##J30##</td> <td class=xl106>##K30##</td> <td class=xl163>##L30##</td> <td class=xl183 style='border-left:none'>##M30##</td> <td class=xl210>##N30##</td> <td class=xl110>##O30##</td> <td class=xl208>##P30##</td> <td class=xl226>##Q30##</td> <td class=xl104>##R30##</td> <td class=xl224>##S30##</td> <td class=xl153>##T30##</td> <td class=xl106>##U30##</td> <td class=xl163>##V30##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>GP/Head</td> <td class=xl184>##C31##</td> <td class=xl211>##D31##</td> <td class=xl110>##E31##</td> <td class=xl208>##F31##</td> <td class=xl227>##G31##</td> <td class=xl104>##H31##</td> <td class=xl224>##I31##</td> <td class=xl154>##J31##</td> <td class=xl106>##K31##</td> <td class=xl163>##L31##</td> <td class=xl184 style='border-left:none'>##M31##</td> <td class=xl211>##N31##</td> <td class=xl110>##O31##</td> <td class=xl208>##P31##</td> <td class=xl227>##Q31##</td> <td class=xl104>##R31##</td> <td class=xl224>##S31##</td> <td class=xl154>##T31##</td> <td class=xl106>##U31##</td> <td class=xl163>##V31##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>Contribution per head</td> <td class=xl184>##C32##</td> <td class=xl211>##D32##</td> <td class=xl110>##E32##</td> <td class=xl208>##F32##</td> <td class=xl227>##G32##</td> <td class=xl104>##H32##</td> <td class=xl224>##I32##</td> <td class=xl154>##J32##</td> <td class=xl106>##K32##</td> <td class=xl163>##L32##</td> <td class=xl184 style='border-left:none'>##M32##</td> <td class=xl211>##N32##</td> <td class=xl110>##O32##</td> <td class=xl208>##P32##</td> <td class=xl227>##Q32##</td> <td class=xl104>##R32##</td> <td class=xl224>##S32##</td> <td class=xl154>##T32##</td> <td class=xl106>##U32##</td> <td class=xl163>##V32##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=8 style='mso-height-source:userset;height:6.0pt'> <td height=8 class=xl105 style='height:6.0pt'></td> <td class=xl167>&nbsp;</td> <td class=xl185>&nbsp;</td> <td class=xl212>&nbsp;</td> <td class=xl155>&nbsp;</td> <td class=xl213>&nbsp;</td> <td class=xl228>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl229>&nbsp;</td> <td class=xl156>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl168>&nbsp;</td> <td class=xl185 style='border-left:none'>&nbsp;</td> <td class=xl212>&nbsp;</td> <td class=xl155>&nbsp;</td> <td class=xl213>&nbsp;</td> <td class=xl228>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl229>&nbsp;</td> <td class=xl156>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl168>&nbsp;</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl196>Employment costs</td> <td class=xl197>##C34##</td> <td class=xl214>##D34##</td> <td class=xl198>##E34##</td> <td class=xl215>##F34##</td> <td class=xl230 style='border-left:none'>##G34##</td> <td class=xl199>##H34##</td> <td class=xl231>##I34##</td> <td class=xl200>##J34##</td> <td class=xl200>##K34##</td> <td class=xl201>##L34##</td> <td class=xl197 style='border-left:none'>##M34##</td> <td class=xl214>##N34##</td> <td class=xl198>##O34##</td> <td class=xl215>##P34##</td> <td class=xl230 style='border-left:none'>##Q34##</td> <td class=xl199>##R34##</td> <td class=xl231>##S34##</td> <td class=xl200>##T34##</td> <td class=xl200>##U34##</td> <td class=xl201>##V34##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>% GP</td> <td class=xl181>##C35##</td> <td class=xl111>##D35##</td> <td class=xl110>##E35##</td> <td class=xl208>##F35##</td> <td class=xl112>##G35##</td> <td class=xl104>##H35##</td> <td class=xl224>##I35##</td> <td class=xl151>##J35##</td> <td class=xl106>##K35##</td> <td class=xl163>##L35##</td> <td class=xl181 style='border-left:none'>##M35##</td> <td class=xl111>##N35##</td> <td class=xl110>##O35##</td> <td class=xl208>##P35##</td> <td class=xl112>##Q35##</td> <td class=xl104>##R35##</td> <td class=xl224>##S35##</td> <td class=xl151>##T35##</td> <td class=xl106>##U35##</td> <td class=xl163>##V35##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl169>Employment costs per head</td> <td class=xl202>##C36##</td> <td class=xl216>##D36##</td> <td class=xl203>##E36##</td> <td class=xl217>##F36##</td> <td class=xl232 style='border-left:none'>##G36##</td> <td class=xl204>##H36##</td> <td class=xl233>##I36##</td> <td class=xl205>##J36##</td> <td class=xl174>##K36##</td> <td class=xl176>##L36##</td> <td class=xl202 style='border-left:none'>##M36##</td> <td class=xl216>##N36##</td> <td class=xl203>##O36##</td> <td class=xl217>##P36##</td> <td class=xl232 style='border-left:none'>##Q36##</td> <td class=xl204>##R36##</td> <td class=xl233>##S36##</td> <td class=xl205>##T36##</td> <td class=xl174>##U36##</td> <td class=xl176>##V36##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl196 style='border-top:none'>Property costs</td> <td class=xl197 style='border-top:none'>##C37##</td> <td class=xl214 style='border-top:none'>##D37##</td> <td class=xl198>##E37##</td> <td class=xl215 style='border-top:none'>##F37##</td> <td class=xl230 style='border-top:none;border-left:none'>##G37##</td> <td class=xl199>##H37##</td> <td class=xl231 style='border-top:none'>##I37##</td> <td class=xl200>##J37##</td> <td class=xl200>##K37##</td> <td class=xl201 style='border-top:none'>##L37##</td> <td class=xl197 style='border-top:none;border-left:none'>##M37##</td> <td class=xl214 style='border-top:none'>##N37##</td> <td class=xl198>##O37##</td> <td class=xl215 style='border-top:none'>##P37##</td> <td class=xl230 style='border-top:none;border-left:none'>##Q37##</td> <td class=xl199>##R37##</td> <td class=xl231 style='border-top:none'>##S37##</td> <td class=xl200>##T37##</td> <td class=xl200>##U37##</td> <td class=xl201 style='border-top:none'>##V37##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl169>% GP</td> <td class=xl187>##C38##</td> <td class=xl218>##D38##</td> <td class=xl203>##E38##</td> <td class=xl217>##F38##</td> <td class=xl234 style='border-left:none'>##G38##</td> <td class=xl204>##H38##</td> <td class=xl233>##I38##</td> <td class=xl175>##J38##</td> <td class=xl174>##K38##</td> <td class=xl176>##L38##</td> <td class=xl187 style='border-left:none'>##M38##</td> <td class=xl218>##N38##</td> <td class=xl203>##O38##</td> <td class=xl217>##P38##</td> <td class=xl234 style='border-left:none'>##Q38##</td> <td class=xl204>##R38##</td> <td class=xl233>##S38##</td> <td class=xl175>##T38##</td> <td class=xl174>##U38##</td> <td class=xl176>##V38##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl196 style='border-top:none'>Administrative costs</td> <td class=xl197 style='border-top:none'>##C39##</td> <td class=xl214 style='border-top:none'>##D39##</td> <td class=xl198>##E39##</td> <td class=xl215 style='border-top:none'>##F39##</td> <td class=xl230 style='border-top:none;border-left:none'>##G39##</td> <td class=xl199>##H39##</td> <td class=xl231 style='border-top:none'>##I39##</td> <td class=xl200>##J39##</td> <td class=xl200>##K39##</td> <td class=xl201 style='border-top:none'>##L39##</td> <td class=xl197 style='border-top:none;border-left:none'>##M39##</td> <td class=xl214 style='border-top:none'>##N39##</td> <td class=xl198>##O39##</td> <td class=xl215 style='border-top:none'>##P39##</td> <td class=xl230 style='border-top:none;border-left:none'>##Q39##</td> <td class=xl199>##R39##</td> <td class=xl231 style='border-top:none'>##S39##</td> <td class=xl200>##T39##</td> <td class=xl200>##U39##</td> <td class=xl201 style='border-top:none'>##V39##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl169>% GP</td> <td class=xl187>##C40##</td> <td class=xl218>##D40##</td> <td class=xl203>##E40##</td> <td class=xl217>##F40##</td> <td class=xl234 style='border-left:none'>##G40##</td> <td class=xl204>##H40##</td> <td class=xl233>##I40##</td> <td class=xl175>##J40##</td> <td class=xl174>##K40##</td> <td class=xl176>##L40##</td> <td class=xl187 style='border-left:none'>##M40##</td> <td class=xl218>##N40##</td> <td class=xl203>##O40##</td> <td class=xl217>##P40##</td> <td class=xl234 style='border-left:none'>##Q40##</td> <td class=xl204>##R40##</td> <td class=xl233>##S40##</td> <td class=xl175>##T40##</td> <td class=xl174>##U40##</td> <td class=xl176>##V40##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl196 style='border-top:none'>Professional fees</td> <td class=xl197 style='border-top:none'>##C41##</td> <td class=xl214 style='border-top:none'>##D41##</td> <td class=xl198>##E41##</td> <td class=xl215 style='border-top:none'>##F41##</td> <td class=xl230 style='border-top:none;border-left:none'>##G41##</td> <td class=xl199>##H41##</td> <td class=xl231 style='border-top:none'>##I41##</td> <td class=xl200>##J41##</td> <td class=xl200>##K41##</td> <td class=xl201 style='border-top:none'>##L41##</td> <td class=xl197 style='border-top:none;border-left:none'>##M41##</td> <td class=xl214 style='border-top:none'>##N41##</td> <td class=xl198>##O41##</td> <td class=xl215 style='border-top:none'>##P41##</td> <td class=xl230 style='border-top:none;border-left:none'>##Q41##</td> <td class=xl199>##R41##</td> <td class=xl231 style='border-top:none'>##S41##</td> <td class=xl200>##T41##</td> <td class=xl200>##U41##</td> <td class=xl201 style='border-top:none'>##V41##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl169>% GP</td> <td class=xl187>##C42##</td> <td class=xl218>##D42##</td> <td class=xl203>##E42##</td> <td class=xl217>##F42##</td> <td class=xl234 style='border-left:none'>##G42##</td> <td class=xl204>##H42##</td> <td class=xl233>##I42##</td> <td class=xl175>##J42##</td> <td class=xl174>##K42##</td> <td class=xl176>##L42##</td> <td class=xl187 style='border-left:none'>##M42##</td> <td class=xl218>##N42##</td> <td class=xl203>##O42##</td> <td class=xl217>##P42##</td> <td class=xl234 style='border-left:none'>##Q42##</td> <td class=xl204>##R42##</td> <td class=xl233>##S42##</td> <td class=xl175>##T42##</td> <td class=xl174>##U42##</td> <td class=xl176>##V42##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl160>Total expenses</td> <td class=xl186>##C43##</td> <td class=xl109>##D43##</td> <td class=xl107>##E43##</td> <td class=xl206>##F43##</td> <td class=xl108>##G43##</td> <td class=xl103>##H43##</td> <td class=xl222>##I43##</td> <td class=xl150>##J43##</td> <td class=xl150>##K43##</td> <td class=xl165>##L43##</td> <td class=xl186 style='border-left:none'>##M43##</td> <td class=xl109>##N43##</td> <td class=xl107>##O43##</td> <td class=xl206>##P43##</td> <td class=xl108>##Q43##</td> <td class=xl103>##R43##</td> <td class=xl222>##S43##</td> <td class=xl150>##T43##</td> <td class=xl150>##U43##</td> <td class=xl165>##V43##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl166>% GP</td> <td class=xl181>##C44##</td> <td class=xl111>##D44##</td> <td class=xl110>##E44##</td> <td class=xl208>##F44##</td> <td class=xl112>##G44##</td> <td class=xl104>##H44##</td> <td class=xl224>##I44##</td> <td class=xl151>##J44##</td> <td class=xl106>##K44##</td> <td class=xl163>##L44##</td> <td class=xl181 style='border-left:none'>##M44##</td> <td class=xl111>##N44##</td> <td class=xl110>##O44##</td> <td class=xl208>##P44##</td> <td class=xl112>##Q44##</td> <td class=xl104>##R44##</td> <td class=xl224>##S44##</td> <td class=xl151>##T44##</td> <td class=xl106>##U44##</td> <td class=xl163>##V44##</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl105 height=6 style='mso-height-source:userset;height:4.5pt'> <td height=6 class=xl105 style='height:4.5pt'></td> <td class=xl167>&nbsp;</td> <td class=xl185>&nbsp;</td> <td class=xl212>&nbsp;</td> <td class=xl155>&nbsp;</td> <td class=xl213>&nbsp;</td> <td class=xl228>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl229>&nbsp;</td> <td class=xl156>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl168>&nbsp;</td> <td class=xl185 style='border-left:none'>&nbsp;</td> <td class=xl212>&nbsp;</td> <td class=xl155>&nbsp;</td> <td class=xl213>&nbsp;</td> <td class=xl228>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl229>&nbsp;</td> <td class=xl156>&nbsp;</td> <td class=xl157>&nbsp;</td> <td class=xl168>&nbsp;</td> <td class=xl105></td> </tr> ";
		content += "<tr class=xl100 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl100 style='height:21.95pt'></td> <td class=xl160>EBITDA</td> <td class=xl186>##C46##</td> <td class=xl109>##D46##</td> <td class=xl107>##E46##</td> <td class=xl206>##F46##</td> <td class=xl108>##G46##</td> <td class=xl103>##H46##</td> <td class=xl222>##I46##</td> <td class=xl150>##J46##</td> <td class=xl150>##K46##</td> <td class=xl165>##L46##</td> <td class=xl186 style='border-left:none'>##M46##</td> <td class=xl109>##N46##</td> <td class=xl107>##O46##</td> <td class=xl206>##P46##</td> <td class=xl108>##Q46##</td> <td class=xl103>##R46##</td> <td class=xl222>##S46##</td> <td class=xl150>##T46##</td> <td class=xl150>##U46##</td> <td class=xl165>##V46##</td> <td class=xl100></td> </tr> ";
		content += "<tr class=xl105 height=29 style='mso-height-source:userset;height:21.95pt'> <td height=29 class=xl105 style='height:21.95pt'></td> <td class=xl169>% GP</td> <td class=xl187>##C47##</td> <td class=xl219>##D47##</td> <td class=xl220>##E47##</td> <td class=xl221>##F47##</td> <td class=xl235 style='border-left:none'>##G47##</td> <td class=xl236>##H47##</td> <td class=xl237>##I47##</td> <td class=xl172>##J47##</td> <td class=xl173>##K47##</td> <td class=xl176>##L47##</td> <td class=xl187 style='border-left:none'>##M47##</td> <td class=xl218>##N47##</td> <td class=xl170>##O47##</td> <td class=xl262>##P47##</td> <td class=xl234 style='border-left:none'>##Q47##</td> <td class=xl171>##R47##</td> <td class=xl263>##S47##</td> <td class=xl175>##T47##</td> <td class=xl173>##U47##</td> <td class=xl176>##V47##</td> <td class=xl105></td> </tr> ";
		content += "<tr height=21 style='mso-height-source:userset;height:15.95pt'> <td height=21 class=xl86 style='height:15.95pt'></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl68></td> <td class=xl86></td> <td class=xl92></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl92></td> <td class=xl86></td> </tr> ";
		content += "<tr height=0 style='display:none;mso-height-source:userset;mso-height-alt:  319'> <td class=xl86></td> <td class=xl94>Checks</td> <td class=xl123 align=center>#VALUE!</td> <td class=xl123 align=center>#VALUE!</td> <td class=xl86></td> <td class=xl86></td> <td class=xl123 align=center>#VALUE!</td> <td class=xl86></td> <td class=xl86></td> <td class=xl123 align=center>#VALUE!</td> <td class=xl86></td> <td class=xl92></td> <td class=xl123 align=center>#VALUE!</td> <td class=xl123 align=center>#VALUE!</td> <td class=xl86></td> <td class=xl86></td> <td class=xl123 align=center>#VALUE!</td> <td class=xl86></td> <td class=xl86></td> <td class=xl123 align=center>#VALUE!</td> <td class=xl86></td> <td class=xl92></td> <td class=xl86></td> </tr> <td height=21 class=xl86 style='height:15.95pt'></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> <td class=xl86></td> </tr></table>";
	}
	catch(e)
	{
		errHandler('initialiseVariables', e);
	}
}


/****************************************************
 * replaceHeaderInformation - replacing the header information
 *
 * 1.6.3 - 11/01/2013 - changingn the 'RF' to display as Reforecast and added BUDGETNUMBER instead of BUDGETNAME
 * 
 * version 1.6.5 - 07/02/2013 - changing the date range start month (by adding dateRangeStartFullDate = nlapiAddMonths(today, -2); 	and dateRangeStart = dateRangeStartFullDate.getMonth() + 1;)
  ****************************************************/
function replaceHeaderInformation()
{
	var budgetNumber = '';
	var dateRangeStartFullDate = null;
	
	try
	{
		//getting the number of budget type (example 2 in RF2)
		budgetNumber = budgetName.substring(2, 3);
		//setting 'summarydaterange'
		summaryDateRange = currentFullDate; 

		//setting 'daterangename'. version 1.6.5 
		dateRangeStartFullDate = nlapiAddMonths(today, -2); 							//to get the starting date of rolling three months
		dateRangeStart = dateRangeStartFullDate.getMonth() + 1;							//get the month (returns as an int starting from 0)
		dateRangeStartMonth = getMonthName(dateRangeStart); 
		dateRangeEnd = currentMonth; 
		dateRangeEnddMonth = getMonthName(dateRangeEnd);
		dateRangeName = dateRangeStartMonth + ' - ' + dateRangeEnddMonth ;

		//Replace the tag with data data
		replaceContentTag('##SUMMARYDATERANGE##', summaryDateRange, '');
		replaceContentTag('##DATERANGENAME##', dateRangeName, '');
		
		replaceContentTag('##BUDGETNUMBER##', budgetNumber, '');

	}
	catch(e)
	{
		errHandler('replaceHeaderInformation', e);
	}
}


//Column C
/***********************************************************************************************************
 * generateDateRangeActualsData - replacing the actuals data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeActualsData()
{
	try
	{
		//getting the appropriate search results
		dateRangeActuals = searchSpreadsheetData('custrecord_rolling_three_months_actuals');

		if(dateRangeActuals !=null)
		{ 
			calculateData(dateRangeActuals);
		
			//assigning the values for the variables compared to the 'management spreadsheet' cells
			setCellValueByCellName('C8', revTotalAmount);
			divideCellByNameWithAmount('C8', 1000);
					
			setCellValueByCellName('C9', revProgrammeFees);
			setCellValueByCellName('C10', revFilmProduction);
			setCellValueByCellName('C11', revStoryWeb);
			setCellValueByCellName('C12', revTsWorkshops);			
			setCellValueByCellName('C13', revLaveryRoom);			
			setCellValueByCellName('C14', revTravel);			
			setCellValueByCellName('C15', revCurrency);

			setCellValueByCellName('C17', cosTotalAmount);
			divideCellByNameWithAmount('C17', 1000);

			setCellValueByCellName('C18', cosProgrammingFees);			
			setCellValueByCellName('C19', cosFilmProduction);			
			setCellValueByCellName('C20', cosStoryWeb);			
			setCellValueByCellName('C21', cosTsWorkshops);			
			setCellValueByCellName('C22', cosLaveryRoom);			
			setCellValueByCellName('C23', cosTravel);
			setCellValueByCellName('C24', cosCurrency);

			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('C25',calculatedCell);
					
			setCellValueByCellName('C26',grossProfit); 
			divideCellByNameWithAmount('C26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);

			setCellValueByCellName('C27',calculatedCell); 
			setCellValueByCellName('C29', headCount);
			setCellValueByCellName('C34', employmentCosts);
			setCellValueByCellName('C37', propertyCosts);			
			setCellValueByCellName('C39', adminCosts);			
			setCellValueByCellName('C41', professionalFees);

			calculatedCell = parseFloat(totalExpenses).toFixed(2);
			setCellValueByCellName('C43', calculatedCell); 

			setCellValueByCellName('C46', EBITDA); 

			if(isCellBlank('C34') == false)
			{	
				resultedValue = getCellValueByName('C34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'C30');
			}
			
			if(isCellBlank('C26') == false)
			{
				divideTwoCellsByNamesInToCell('C39', 'C26', 'C40');
				divideTwoCellsByNamesInToCell('C41', 'C26', 'C42');

				divideTwoCellsByNamesInToCell('C34', 'C26', 'C35');
		
				divideTwoCellsByNamesInToCell('C37', 'C26', 'C38');
				divideTwoCellsByNamesInToCell('C43', 'C26', 'C44');
				
				//passing the C46's value to positive value
				positiveCellValue = getCellValueByName('C46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('C26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'C47');
				multiplyCellByValue('C47', 100);
			}
			
			if(isCellBlank('C29') == false)
			{
				resultedValue = getCellValueByName('C29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'C31');
				multiplyCellByValue('C31', 1000);

				resultedValue = getCellValueByName('C34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'C32');
				resultedValue = divideTwoCellsByNames('C32','C29');
				setCellValueByCellName('C32', resultedValue);
				multiplyCellByValue('C32', 1000);
				
				resultedValue = divideTwoCellsByNames('C34','C29');
				setCellValueByCellName('C36', resultedValue);
				multiplyCellByValue('C36', 1000);
			}
		}
		else
		{
			setCellValueByCellName('C8', '');

		}
	}
	catch(e)
	{
		errHandler('generateDateRangeActualsData', e);
	}
}

//Column D
/***********************************************************************************************************
 * generateDateRangeBudgetsData - Generating the budgets data in the date range (ex: September - November)
 *
 *
 **********************************************************************************************************/
function generateDateRangeBudgetsData()
{
	try
	{
		//getting the appropriate search results
		dateRangeBudgets = searchSpreadsheetData('custrecord_rolling_months_budgets_main');

		if(dateRangeBudgets !=null)
		{ 
			calculateData(dateRangeBudgets);

			setCellValueByCellName('D8', revTotalAmount);
			divideCellByNameWithAmount('D8', 1000);

			setCellValueByCellName('D9',revProgrammeFees);
			setCellValueByCellName('D10',revFilmProduction);
			setCellValueByCellName('D11',revStoryWeb);
			setCellValueByCellName('D12',revTsWorkshops);
			setCellValueByCellName('D13',revLaveryRoom);
			setCellValueByCellName('D14',revTravel);
			setCellValueByCellName('D15', revCurrency);
			setCellValueByCellName('D17',parseFloat(cosTotalAmount/1000));
			setCellValueByCellName('D18',cosProgrammingFees);
			setCellValueByCellName('D19',cosFilmProduction);
			setCellValueByCellName('D20', cosStoryWeb);
			setCellValueByCellName('D21', cosTsWorkshops);
			setCellValueByCellName('D22', cosLaveryRoom);
			setCellValueByCellName('D23', cosTravel);
			setCellValueByCellName('D24',cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('D25',calculatedCell);
		
			setCellValueByCellName('D26',grossProfit); 
			divideCellByNameWithAmount('D26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);
			setCellValueByCellName('D27',calculatedCell); 
		
			setCellValueByCellName('D29', headCount);
			setCellValueByCellName('D34', employmentCosts);
			setCellValueByCellName('D43', parseFloat(totalExpenses));
			setCellValueByCellName('D39', adminCosts);
			setCellValueByCellName('D41', professionalFees);
			setCellValueByCellName('D37', propertyCosts);
			setCellValueByCellName('D46', EBITDA);

			//to ignore the 'division by 0' error
			if(isCellBlank('D34') == false)
			{
				
				resultedValue = getCellValueByName('D34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'D30');
			}
				
			//to ignore the 'division by 0' error
			if(isCellBlank('D26') == false)
			{
				divideTwoCellsByNamesInToCell('D34', 'D26', 'D35');
				divideTwoCellsByNamesInToCell('D37', 'D26', 'D38');
				divideTwoCellsByNamesInToCell('D39', 'D26', 'D40');
				divideTwoCellsByNamesInToCell('D41', 'D26', 'D42');
				divideTwoCellsByNamesInToCell('D43', 'D26', 'D44');
				
				//passing the D46's value to positive value
				positiveCellValue = getCellValueByName('D46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('D26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'D47');
				multiplyCellByValue('D47', 100);
			}

			if(isCellBlank('D29') == false)
			{
				resultedValue = getCellValueByName('D29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'D31');
				multiplyCellByValue('D31', 1000);

				resultedValue = getCellValueByName('D34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'D32');
				resultedValue = divideTwoCellsByNames('D32','D29');
				setCellValueByCellName('D32', resultedValue);
				multiplyCellByValue('D32', 1000);
	
				resultedValue = divideTwoCellsByNames('D34','D29');
				setCellValueByCellName('D36', resultedValue);
				multiplyCellByValue('D36', 1000);
			
			}
		}	 	
	}
	catch(e)
	{
		errHandler('generateDateRangeBudgetsData', e);
	}
}


//column E
/***********************************************************************************************************
 * replaceDateRangeVarianceData - replacing the variance data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeVarianceData()
{
	try
	{
		subtractCellWithAnotherCellByCellNameInToCell('C8', 'D8', 'E8');
		subtractCellWithAnotherCellByCellNameInToCell('C9', 'D9', 'E9');
		subtractCellWithAnotherCellByCellNameInToCell('C10', 'D10', 'E10');
		subtractCellWithAnotherCellByCellNameInToCell('C11', 'D11', 'E11');
		subtractCellWithAnotherCellByCellNameInToCell('C12', 'D12', 'E12');
		subtractCellWithAnotherCellByCellNameInToCell('C13', 'D13', 'E13');
		subtractCellWithAnotherCellByCellNameInToCell('C14', 'D14', 'E14');
		subtractCellWithAnotherCellByCellNameInToCell('C15', 'D15', 'E15');
		
		subtractCellWithAnotherCellByCellNameInToCell('D17', 'C17', 'E17');
		subtractCellWithAnotherCellByCellNameInToCell('D18', 'C18', 'E18');
		subtractCellWithAnotherCellByCellNameInToCell('D19', 'C19', 'E19');
		subtractCellWithAnotherCellByCellNameInToCell('D20', 'C20', 'E20');
		subtractCellWithAnotherCellByCellNameInToCell('D21', 'C21', 'E21');
		subtractCellWithAnotherCellByCellNameInToCell('D22', 'C22', 'E22');
		subtractCellWithAnotherCellByCellNameInToCell('D23', 'C23', 'E23');
		subtractCellWithAnotherCellByCellNameInToCell('D24', 'C24', 'E24');
		
		subtractCellWithAnotherCellByCellNameInToCell('C26', 'D26', 'E26');
		
		subtractCellWithAnotherCellByCellNameInToCell('D34', 'C34', 'E34');
		subtractCellWithAnotherCellByCellNameInToCell('D37', 'C37', 'E37');
		subtractCellWithAnotherCellByCellNameInToCell('D39', 'C39', 'E39');
		subtractCellWithAnotherCellByCellNameInToCell('D41', 'C41', 'E41');
		subtractCellWithAnotherCellByCellNameInToCell('D43', 'C43', 'E43');
		
		subtractCellWithAnotherCellByCellNameInToCell('C46', 'D46', 'E46');
	}
	catch(e)
	{
		errHandler('generateDateRangeVarianceData', e);
	}
}


//column F
/***********************************************************************************************************
 * replaceDateRangeVarianceDataPercent - replacing the variance percentage data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeVarianceDataPercent()
{
	try
	{
		divideTwoCellsByNamesInToCell('E8', 'D8', 'F8');
		divideTwoCellsByNamesInToCell('E9', 'D9', 'F9');
		divideTwoCellsByNamesInToCell('E10', 'D10', 'F10');
		divideTwoCellsByNamesInToCell('E11', 'D11', 'F11');
		divideTwoCellsByNamesInToCell('E12', 'D12', 'F12');
		divideTwoCellsByNamesInToCell('E13', 'D13', 'F13');
		divideTwoCellsByNamesInToCell('E14', 'D14', 'F14');
		divideTwoCellsByNamesInToCell('E15', 'D15', 'F15');
		divideTwoCellsByNamesInToCell('E17', 'D17', 'F17');
		divideTwoCellsByNamesInToCell('E18', 'D18', 'F18');
		divideTwoCellsByNamesInToCell('E19', 'D19', 'F19');
		divideTwoCellsByNamesInToCell('E20', 'D20', 'F20');
		divideTwoCellsByNamesInToCell('E21', 'D21', 'F21');
		divideTwoCellsByNamesInToCell('E22', 'E22', 'F22');
		divideTwoCellsByNamesInToCell('E23', 'D23', 'F23');
		divideTwoCellsByNamesInToCell('E24', 'D24', 'F24');
		divideTwoCellsByNamesInToCell('E26', 'D26', 'F26');
		divideTwoCellsByNamesInToCell('E34', 'D34', 'F34');
		divideTwoCellsByNamesInToCell('E37', 'D37', 'F37');
		divideTwoCellsByNamesInToCell('E39', 'D39', 'F39');
		divideTwoCellsByNamesInToCell('E41', 'D41', 'F41');
		divideTwoCellsByNamesInToCell('E43', 'D43', 'F43');
		divideTwoCellsByNamesInToCell('E46', 'D46', 'F46');
	
	}
	catch(e)
	{
		errHandler('generateDateRangeVarianceDataPercent', e);
	}
}


//Column G
/***********************************************************************************************************
 * generateDateRangeBudgetTypeData - replacing the 'budgetType' data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeBudgetTypeData()
{	 
	try
	{
		//getting the appropriate search results by the budget type : Main, RF1 or RF2
		if(budgetName == 'Main')
		{
			searchColInternalId = 'custrecord_rolling_months_budgets_main';
		}
		else if(budgetName == 'RF1')
		{
			searchColInternalId = 'custrecord_rolling_months_budgets_rf1';
		}
		else if(budgetName == 'RF2')
		{
			searchColInternalId = 'custrecord_rolling_months_budgets_rf2';
		}

		//getting the appropriate search results
		dateRangeBudgetsSecond = searchSpreadsheetData(searchColInternalId);

		if(dateRangeBudgetsSecond !=null)
		{ 
			calculateData(dateRangeBudgetsSecond);

			setCellValueByCellName('G8', revTotalAmount);
			divideCellByNameWithAmount('G8', 1000);
			
			setCellValueByCellName('G9', revProgrammeFees);
			setCellValueByCellName('G10', revFilmProduction);
			setCellValueByCellName('G11', revStoryWeb);
			setCellValueByCellName('G12', revTsWorkshops);
			setCellValueByCellName('G13', revLaveryRoom);
			setCellValueByCellName('G14', revTravel);
			setCellValueByCellName('G15', revCurrency);

			setCellValueByCellName('G17', cosTotalAmount);
			divideCellByNameWithAmount('G17', 1000);

			setCellValueByCellName('G18', cosProgrammingFees);
			setCellValueByCellName('G19', cosFilmProduction);
			setCellValueByCellName('G20', cosStoryWeb);
			setCellValueByCellName('G21', cosTsWorkshops);
			setCellValueByCellName('G22', cosLaveryRoom);
			setCellValueByCellName('G23', cosTravel);
			setCellValueByCellName('G24', cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('G25',calculatedCell);
		
			setCellValueByCellName('G26', grossProfit);
			divideCellByNameWithAmount('G26', 1000);
			
			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);
			setCellValueByCellName('G27',calculatedCell); 
		
			setCellValueByCellName('G29', headCount);
			setCellValueByCellName('G37', propertyCosts);
			setCellValueByCellName('G34', employmentCosts);
			setCellValueByCellName('G43', totalExpenses);
			
			setCellValueByCellName('G39', adminCosts);
			setCellValueByCellName('G41', professionalFees);
			
			setCellValueByCellName('G46', EBITDA);
		
			if(isCellBlank('G34') == false)
			{
				resultedValue = getCellValueByName('G34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'G30');
			}

			if(isCellBlank('G26') == false)
			{
				divideTwoCellsByNamesInToCell('G34', 'G26', 'G35');
				divideTwoCellsByNamesInToCell('G37', 'G26', 'G38');
				divideTwoCellsByNamesInToCell('G39', 'G26', 'G40');
				divideTwoCellsByNamesInToCell('G41', 'G26', 'G42');
				divideTwoCellsByNamesInToCell('G43', 'G26', 'G44');
				
				//passing the G46's value to positive value
				positiveCellValue = getCellValueByName('G46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('G26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'G47');
				multiplyCellByValue('G47', 100);
			}

			if(isCellBlank('G29') == false)
			{
				resultedValue = getCellValueByName('G29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'G31');
				multiplyCellByValue('G31', 1000);

				resultedValue = getCellValueByName('G34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'G32');
				
				resultedValue = divideTwoCellsByNames('G32','G29');
				setCellValueByCellName('G32', resultedValue);
				multiplyCellByValue('G32', 1000);
				
				resultedValue = divideTwoCellsByNames('G34','G29');
				setCellValueByCellName('G36', resultedValue);
				multiplyCellByValue('G36', 1000);
			
			}
		}	 	
	}
	catch(e)
	{
		errHandler('generateDateRangeBudgetTypeData', e);
	}
}


//Column H
/***********************************************************************************************************
 * generateDateRangeBudgetTypeVarianceData - replacing the budget Type variance data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeBudgetTypeVarianceData()
{

	try
	{
		subtractCellWithAnotherCellByCellNameInToCell('C8', 'G8', 'H8');	
		subtractCellWithAnotherCellByCellNameInToCell('C9', 'G9', 'H9');
		subtractCellWithAnotherCellByCellNameInToCell('C10', 'G10', 'H10');		
		subtractCellWithAnotherCellByCellNameInToCell('C11', 'G11', 'H11');		
		subtractCellWithAnotherCellByCellNameInToCell('C12', 'G12', 'H12');		
		subtractCellWithAnotherCellByCellNameInToCell('C13', 'G13', 'H13');		
		subtractCellWithAnotherCellByCellNameInToCell('C14', 'G14', 'H14');		
		subtractCellWithAnotherCellByCellNameInToCell('C15', 'G15', 'H15');		
		
		subtractCellWithAnotherCellByCellNameInToCell('G17', 'C17', 'H17');		
		subtractCellWithAnotherCellByCellNameInToCell('G18', 'C18', 'H18');		
		subtractCellWithAnotherCellByCellNameInToCell('G19', 'C19', 'H19');		
		subtractCellWithAnotherCellByCellNameInToCell('G20', 'C20', 'H20');		
		subtractCellWithAnotherCellByCellNameInToCell('G21', 'C21', 'H21');		
		subtractCellWithAnotherCellByCellNameInToCell('G22', 'C22', 'H22');		
		subtractCellWithAnotherCellByCellNameInToCell('G23', 'C23', 'H23');		
		subtractCellWithAnotherCellByCellNameInToCell('G24', 'C24', 'H24');	
		
		subtractCellWithAnotherCellByCellNameInToCell('C26', 'G26', 'H26');	
		
		subtractCellWithAnotherCellByCellNameInToCell('G34', 'C34', 'H34');		
		subtractCellWithAnotherCellByCellNameInToCell('G37', 'C37', 'H37');		
		subtractCellWithAnotherCellByCellNameInToCell('G39', 'C39', 'H39');		
		subtractCellWithAnotherCellByCellNameInToCell('G41', 'C41', 'H41');		
		subtractCellWithAnotherCellByCellNameInToCell('G43', 'C43', 'H43');
		
		positiveCellValue = getCellValueByName('C46');
		positiveCellValue = Math.abs(positiveCellValue);
		resultedValue = getCellValueByName('G46');
		subtractAmountWithAmountInToCell(positiveCellValue, resultedValue, 'H46');
		
	}
	catch(e)
	{
		errHandler('generateDateRangeBudgetTypeVarianceData', e);
	}

}


//Column I
/***********************************************************************************************************
 * generateDateRangeBudgetTypeVarianceDataPercent - replacing the budget type variance percentage data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeBudgetTypeVarianceDataPercent()
{
	try
	{
		divideTwoCellsByNamesInToCell('H8', 'G8', 'I8');		
		divideTwoCellsByNamesInToCell('H9', 'G9', 'I9');		
		divideTwoCellsByNamesInToCell('H10', 'G10', 'I10');		
		divideTwoCellsByNamesInToCell('H11', 'G11', 'I11');		
		divideTwoCellsByNamesInToCell('H12', 'G12', 'I12');		
		divideTwoCellsByNamesInToCell('H13', 'G13', 'I13');		
		divideTwoCellsByNamesInToCell('H14', 'G14', 'I14');		
		divideTwoCellsByNamesInToCell('H15', 'G15', 'I15');		
		divideTwoCellsByNamesInToCell('H17', 'G17', 'I17');		
		divideTwoCellsByNamesInToCell('H18', 'G18', 'I18');		
		divideTwoCellsByNamesInToCell('H19', 'G19', 'I19');		
		divideTwoCellsByNamesInToCell('H20', 'G20', 'I20');		
		divideTwoCellsByNamesInToCell('H21', 'G21', 'I21');		
		divideTwoCellsByNamesInToCell('H22', 'G22', 'I22');		
		divideTwoCellsByNamesInToCell('H23', 'G23', 'I23');		
		divideTwoCellsByNamesInToCell('H24', 'G24', 'I24');		
		divideTwoCellsByNamesInToCell('H26', 'G26', 'I26');		
		divideTwoCellsByNamesInToCell('H34', 'G34', 'I34');		
		divideTwoCellsByNamesInToCell('H37', 'G37', 'I37');		
		divideTwoCellsByNamesInToCell('H39', 'G39', 'I39');		
		divideTwoCellsByNamesInToCell('H41', 'G41', 'I41');		
		divideTwoCellsByNamesInToCell('H43', 'G43', 'I43');		
		
		positiveCellValue = getCellValueByName('H46');
		positiveCellValue = Math.abs(positiveCellValue);
		resultedValue = getCellValueByName('G46');
		divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'I46');
		multiplyCellByValue('I46', 100);
		
	}
	catch(e)
	{
		errHandler('generateDateRangeBudgetTypeVarianceDataPercent', e);	
	}
}

//Column J
/***********************************************************************************************************
 * generateDateRangeLastYearData - replacing the LastYear data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeLastYearData()
{
	try
	{
		//getting the appropriate search results
		dateRangeLastYear = searchSpreadsheetData('custrecord_py_rolling_months_actuals');

		if(dateRangeLastYear !=null)
		{ 
			calculateData(dateRangeLastYear);
			setCellValueByCellName('J8', revTotalAmount);
			divideCellByNameWithAmount('J8', 1000);

			setCellValueByCellName('J9', revProgrammeFees);
			setCellValueByCellName('J10', revFilmProduction);
			setCellValueByCellName('J11', revStoryWeb);
			setCellValueByCellName('J12', revTsWorkshops);
			setCellValueByCellName('J13', revLaveryRoom);
			setCellValueByCellName('J14', revTravel);
			setCellValueByCellName('J15', revCurrency);
			setCellValueByCellName('J17', parseFloat(cosTotalAmount/1000));
			setCellValueByCellName('J18', cosProgrammingFees);
			setCellValueByCellName('J19', cosFilmProduction);
			setCellValueByCellName('J20', cosStoryWeb);
			setCellValueByCellName('J21', cosTsWorkshops);
			setCellValueByCellName('J22', cosLaveryRoom);
			setCellValueByCellName('J23', cosTravel);
			setCellValueByCellName('J24', cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('J25',calculatedCell);
	
			setCellValueByCellName('J26', grossProfit);
			divideCellByNameWithAmount('J26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);
			setCellValueByCellName('J27',calculatedCell); 
		
			setCellValueByCellName('J29', headCount);
			setCellValueByCellName('J34', employmentCosts);

			if(isCellBlank('J34') == false)
			{
				resultedValue = getCellValueByName('J34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'J30');
			}

			setCellValueByCellName('J37', propertyCosts);
			setCellValueByCellName('J39', adminCosts);
			setCellValueByCellName('J41', professionalFees);
			setCellValueByCellName('J43', totalExpenses);
			setCellValueByCellName('J46', EBITDA);

			if(isCellBlank('J26') == false)
			{
				divideTwoCellsByNamesInToCell('J39', 'J26', 'J40');
				divideTwoCellsByNamesInToCell('J41', 'J26', 'J42');
				divideTwoCellsByNamesInToCell('J34', 'J26', 'J35');
				divideTwoCellsByNamesInToCell('J37', 'J26', 'J38');
				divideTwoCellsByNamesInToCell('J43', 'J26', 'J44');
				
				//passing the J46's value to positive value
				positiveCellValue = getCellValueByName('J46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('J26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'J47');
				multiplyCellByValue('J47', 100);
			}

			if(isCellBlank('J29') == false)
			{
				resultedValue = getCellValueByName('J29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'J31');
				multiplyCellByValue('J31', 1000);

				resultedValue = getCellValueByName('J34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'J32');
				
				resultedValue = divideTwoCellsByNames('J32','J29');
				setCellValueByCellName('J32', resultedValue);
				multiplyCellByValue('J32', 1000);
				
				resultedValue = divideTwoCellsByNames('J34','J29');
				setCellValueByCellName('J36', resultedValue);
				multiplyCellByValue('J36', 1000);
			}

		}
	}
	catch(e)
	{
		errHandler('generateDateRangeLastYearData', e);	
	}
}


//Column K
/***********************************************************************************************************
 * generateDateRangeLastYearChangeData - replacing the last Year change data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeLastYearChangeData()
{
	try
	{
		subtractCellWithAnotherCellByCellNameInToCell('C8', 'J8', 'K8');
		subtractCellWithAnotherCellByCellNameInToCell('C9', 'J9', 'K9');
		subtractCellWithAnotherCellByCellNameInToCell('C10', 'J10', 'K10');
		subtractCellWithAnotherCellByCellNameInToCell('C11', 'J11', 'K11');
		subtractCellWithAnotherCellByCellNameInToCell('C12', 'J12', 'K12');
		subtractCellWithAnotherCellByCellNameInToCell('C13', 'J13', 'K13');
		subtractCellWithAnotherCellByCellNameInToCell('C14', 'J14', 'K14');
		subtractCellWithAnotherCellByCellNameInToCell('C15', 'J15', 'K15');
		
		subtractCellWithAnotherCellByCellNameInToCell('J17', 'C17', 'K17');
		subtractCellWithAnotherCellByCellNameInToCell('J18', 'C18', 'K18');
		subtractCellWithAnotherCellByCellNameInToCell('J19', 'C19', 'K19');
		subtractCellWithAnotherCellByCellNameInToCell('J20', 'C20', 'K20');
		subtractCellWithAnotherCellByCellNameInToCell('J21', 'C21', 'K21');
		subtractCellWithAnotherCellByCellNameInToCell('J22', 'C22', 'K22');
		subtractCellWithAnotherCellByCellNameInToCell('J23', 'C23', 'K23');
		subtractCellWithAnotherCellByCellNameInToCell('J24', 'C24', 'K24');
		
		subtractCellWithAnotherCellByCellNameInToCell('C26', 'J26', 'K26');
		
		subtractCellWithAnotherCellByCellNameInToCell('J34', 'C34', 'K34');
		subtractCellWithAnotherCellByCellNameInToCell('J37', 'C37', 'K37');
		subtractCellWithAnotherCellByCellNameInToCell('J39', 'C39', 'K39');
		subtractCellWithAnotherCellByCellNameInToCell('J41', 'C41', 'K41');
		subtractCellWithAnotherCellByCellNameInToCell('J43', 'C43', 'K43');
		
		subtractCellWithAnotherCellByCellNameInToCell('C46', 'J46', 'K46');
	}
	catch(e)
	{
		errHandler('generateDateRangeLastYearChangeData', e);
	}
}



//Column L
/***********************************************************************************************************
 * generateDateRangeLastYearChangeDataPercent - replacing the last year change percentage data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateDateRangeLastYearChangeDataPercent()
{
	try
	{
		divideTwoCellsByNamesInToCell('K8', 'J8', 'L8');
		divideTwoCellsByNamesInToCell('K9', 'J9', 'L9');
		divideTwoCellsByNamesInToCell('K10', 'J10', 'L10');
		divideTwoCellsByNamesInToCell('K11', 'J11', 'L11');
		divideTwoCellsByNamesInToCell('K12', 'J12', 'L12');
		divideTwoCellsByNamesInToCell('K13', 'J13', 'L13');
		divideTwoCellsByNamesInToCell('K14', 'J14', 'L14');
		divideTwoCellsByNamesInToCell('K15', 'J15', 'L15');
		divideTwoCellsByNamesInToCell('K17', 'J17', 'L17');
		divideTwoCellsByNamesInToCell('K18', 'J18', 'L18');
		divideTwoCellsByNamesInToCell('K19', 'J19', 'L19');
		divideTwoCellsByNamesInToCell('K20', 'J20', 'L20');
		divideTwoCellsByNamesInToCell('K21', 'J21', 'L21');
		divideTwoCellsByNamesInToCell('K22', 'J22', 'L22');
		divideTwoCellsByNamesInToCell('K23', 'J23', 'L23');
		divideTwoCellsByNamesInToCell('K24', 'J24', 'L24');
		divideTwoCellsByNamesInToCell('K26', 'J26', 'L26');
		divideTwoCellsByNamesInToCell('K34', 'J34', 'L34');
		divideTwoCellsByNamesInToCell('K37', 'J37', 'L37');
		divideTwoCellsByNamesInToCell('K39', 'J39', 'L39');
		divideTwoCellsByNamesInToCell('K41', 'J41', 'L41');
		divideTwoCellsByNamesInToCell('K43', 'J43', 'L43');
		
		positiveCellValue = getCellValueByName('K46');
		positiveCellValue = Math.abs(positiveCellValue);
		resultedValue = getCellValueByName('J46');
		divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'L46');
		multiplyCellByValue('L46', 100);
	}
	catch(e)
	{
		errHandler('generateDateRangeLastYearChangeDataPercent', e);
	}
}


//Column M
/***********************************************************************************************************
 * generateYearToDateActualsData - replacing the year-to-date actuals data 
 *
 **********************************************************************************************************/
function generateYearToDateActualsData()
{
	try
	{
		//getting the appropriate search results
		yearToDateActuals = searchSpreadsheetData('custrecord_year_to_date_actuals');

		if(yearToDateActuals !=null)
		{ 
			calculateData(yearToDateActuals);

			setCellValueByCellName('M8', revTotalAmount);
			divideCellByNameWithAmount('M8', 1000);
			setCellValueByCellName('M9', revProgrammeFees);
			setCellValueByCellName('M10', revFilmProduction);
			setCellValueByCellName('M11', revStoryWeb);
			setCellValueByCellName('M12', revTsWorkshops);
			setCellValueByCellName('M13', revLaveryRoom);
			setCellValueByCellName('M14', revTravel);
			setCellValueByCellName('M15', revCurrency);

			setCellValueByCellName('M17', cosTotalAmount);
			divideCellByNameWithAmount('M17', 1000);

			setCellValueByCellName('M18', cosProgrammingFees);
			setCellValueByCellName('M19', cosFilmProduction);
			setCellValueByCellName('M20', cosStoryWeb);
			setCellValueByCellName('M21', cosTsWorkshops);
			setCellValueByCellName('M22', cosLaveryRoom);
			setCellValueByCellName('M23', cosTravel);
			setCellValueByCellName('M24', cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('M25',calculatedCell);

			setCellValueByCellName('M26', grossProfit);
			divideCellByNameWithAmount('M26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);

			setCellValueByCellName('M27',calculatedCell); 
		
			setCellValueByCellName('M29', headCount);
			setCellValueByCellName('M34', employmentCosts);

			if(isCellBlank('M34') == false)
			{
				resultedValue = getCellValueByName('M34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'M30');
			}

			setCellValueByCellName('M37', propertyCosts);
			setCellValueByCellName('M39', adminCosts);
			setCellValueByCellName('M41', professionalFees);
			setCellValueByCellName('M43', totalExpenses);
			setCellValueByCellName('M46', EBITDA);

			if(isCellBlank('M26') == false)
			{
				divideTwoCellsByNamesInToCell('M39', 'M26', 'M40');
				divideTwoCellsByNamesInToCell('M41', 'M26', 'M42');
				divideTwoCellsByNamesInToCell('M34', 'M26', 'M35');
				divideTwoCellsByNamesInToCell('M37', 'M26', 'M38');
				divideTwoCellsByNamesInToCell('M43', 'M26', 'M44');
				
				//passing the M46's value to positive value
				positiveCellValue = getCellValueByName('M46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('M26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'M47');
				multiplyCellByValue('M47', 100);
			}

			if(isCellBlank('M29') == false)
			{
				resultedValue = getCellValueByName('M29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'M31');
				multiplyCellByValue('M31', 1000);
	
				resultedValue = getCellValueByName('M34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'M32');
				resultedValue = divideTwoCellsByNames('M32','M29');
				setCellValueByCellName('M32', resultedValue);
				multiplyCellByValue('M32', 1000);

				resultedValue = divideTwoCellsByNames('M34','M29');
				setCellValueByCellName('M36', resultedValue);
				multiplyCellByValue('M36', 1000);
			
			}
		}
	}
	catch(e)
	{
		errHandler('generateYearToDateActualsData', e);
	}
}


//Column N
/***********************************************************************************************************
 * generateYearToDateBudgetsData - Gerneate the year-to-date budgets data 
 *
 **********************************************************************************************************/
function generateYearToDateBudgetsData()
{
	try
	{

		//getting the appropriate search results
		yearToDateBudgets = searchSpreadsheetData('custrecord_year_to_date_budgets_main');

		if(yearToDateBudgets !=null)
		{ 
			calculateData(yearToDateBudgets);

			setCellValueByCellName('N8', revTotalAmount);
			divideCellByNameWithAmount('N8', 1000);
			setCellValueByCellName('N9', revProgrammeFees);
			setCellValueByCellName('N10', revFilmProduction);
			setCellValueByCellName('N11', revStoryWeb);
			setCellValueByCellName('N12', revTsWorkshops);
			setCellValueByCellName('N13', revLaveryRoom);
			setCellValueByCellName('N14', revTravel);
			setCellValueByCellName('N15', revCurrency);

			setCellValueByCellName('N17', cosTotalAmount);
			divideCellByNameWithAmount('N17', 1000);

			setCellValueByCellName('N18', cosProgrammingFees);
			setCellValueByCellName('N19', cosFilmProduction);
			setCellValueByCellName('N20', cosStoryWeb);
			setCellValueByCellName('N21', cosTsWorkshops);
			setCellValueByCellName('N22', cosLaveryRoom);
			setCellValueByCellName('N23', cosTravel);
			setCellValueByCellName('N24', cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('N25',calculatedCell);
		
			setCellValueByCellName('N26', grossProfit);
			divideCellByNameWithAmount('N26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);
			setCellValueByCellName('N27',calculatedCell); 
		
			setCellValueByCellName('N29', headCount); 
			setCellValueByCellName('N34', employmentCosts);

			if(isCellBlank('N34') == false)
			{
				resultedValue = getCellValueByName('N34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'N30');
			}

			setCellValueByCellName('N37', propertyCosts);
			setCellValueByCellName('N39', adminCosts);
			setCellValueByCellName('N41', professionalFees);
			setCellValueByCellName('N43', totalExpenses);
			setCellValueByCellName('N46', EBITDA);

			if(isCellBlank('N26') == false)
			{
				divideTwoCellsByNamesInToCell('N39', 'N26', 'N40');
				divideTwoCellsByNamesInToCell('N41', 'N26', 'N42');
				divideTwoCellsByNamesInToCell('N34', 'N26', 'N35');
				divideTwoCellsByNamesInToCell('N37', 'N26', 'N38');
				divideTwoCellsByNamesInToCell('N43', 'N26', 'N44');
				
				//passing the C46's value to positive value
				positiveCellValue = getCellValueByName('N46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('N26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'N47');
				multiplyCellByValue('N47', 100);
			}

			if(isCellBlank('N29') == false)
			{
				resultedValue = getCellValueByName('N29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'N31');
				multiplyCellByValue('N31', 1000);
				
				resultedValue = getCellValueByName('N34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'N32');
				resultedValue = divideTwoCellsByNames('N32','N29');
				setCellValueByCellName('N32', resultedValue);
				multiplyCellByValue('N32', 1000);
				
				resultedValue = divideTwoCellsByNames('N34','N29');
				setCellValueByCellName('N36', resultedValue);
				multiplyCellByValue('N36', 1000);

			}
		}
	}
	catch(e)
	{
		errHandler('generateYearToDateBudgetsData', e);
	}

}

//Column O
/***********************************************************************************************************
 * generateYearToDateVarianceData - replacing the year to date variance data 
 * 
 **********************************************************************************************************/
function generateYearToDateVarianceData()
{
	try
	{
		subtractCellWithAnotherCellByCellNameInToCell('M8', 'N8', 'O8');
		subtractCellWithAnotherCellByCellNameInToCell('M9', 'N9', 'O9');
		subtractCellWithAnotherCellByCellNameInToCell('M10', 'N10', 'O10');
		subtractCellWithAnotherCellByCellNameInToCell('M11', 'N11', 'O11');
		subtractCellWithAnotherCellByCellNameInToCell('M12', 'N12', 'O12');
		subtractCellWithAnotherCellByCellNameInToCell('M13', 'N13', 'O13');
		subtractCellWithAnotherCellByCellNameInToCell('M14', 'N14', 'O14');
		subtractCellWithAnotherCellByCellNameInToCell('M15', 'N15', 'O15');
		
		subtractCellWithAnotherCellByCellNameInToCell('N17', 'M17', 'O17');
		subtractCellWithAnotherCellByCellNameInToCell('N18', 'M18', 'O18');
		subtractCellWithAnotherCellByCellNameInToCell('N19', 'M19', 'O19');
		subtractCellWithAnotherCellByCellNameInToCell('N20', 'M20', 'O20');
		subtractCellWithAnotherCellByCellNameInToCell('N21', 'M21', 'O21');
		subtractCellWithAnotherCellByCellNameInToCell('N22', 'M22', 'O22');
		subtractCellWithAnotherCellByCellNameInToCell('N23', 'M23', 'O23');
		subtractCellWithAnotherCellByCellNameInToCell('N24', 'M24', 'O24');
		
		subtractCellWithAnotherCellByCellNameInToCell('M26', 'N26', 'O26');
		
		subtractCellWithAnotherCellByCellNameInToCell('N34', 'M34', 'O34');
		subtractCellWithAnotherCellByCellNameInToCell('N37', 'M37', 'O37');
		subtractCellWithAnotherCellByCellNameInToCell('N39', 'M39', 'O39');
		subtractCellWithAnotherCellByCellNameInToCell('N41', 'M41', 'O41');
		subtractCellWithAnotherCellByCellNameInToCell('N43', 'M43', 'O43');
		
		subtractCellWithAnotherCellByCellNameInToCell('M46', 'N46', 'O46');
	}
	catch(e)
	{
		errHandler('generateYearToDateVarianceData', e);
	}
}


//Column P
/***********************************************************************************************************
 * generateYearToDateVarianceDataPercent - replacing the year to date variance percentage data in the date range (ex: September - November)
 *
 **********************************************************************************************************/
function generateYearToDateVarianceDataPercent()
{
	try
	{
		divideTwoCellsByNamesInToCell('O8', 'N8', 'P8');
		divideTwoCellsByNamesInToCell('O9', 'N9', 'P9');
		divideTwoCellsByNamesInToCell('O10', 'N10', 'P10');
		divideTwoCellsByNamesInToCell('O11', 'N11', 'P11');
		divideTwoCellsByNamesInToCell('O12', 'N12', 'P12');
		divideTwoCellsByNamesInToCell('O13', 'N13', 'P13');
		divideTwoCellsByNamesInToCell('O14', 'N14', 'P14');
		divideTwoCellsByNamesInToCell('O15', 'N15', 'P15');
		divideTwoCellsByNamesInToCell('O17', 'N17', 'P17');
		divideTwoCellsByNamesInToCell('O18', 'N18', 'P18');
		divideTwoCellsByNamesInToCell('O19', 'N19', 'P19');
		divideTwoCellsByNamesInToCell('O20', 'N20', 'P20');
		divideTwoCellsByNamesInToCell('O21', 'N21', 'P21');
		divideTwoCellsByNamesInToCell('O22', 'N22', 'P22');
		divideTwoCellsByNamesInToCell('O23', 'N23', 'P23');
		divideTwoCellsByNamesInToCell('O24', 'N24', 'P24');;
		divideTwoCellsByNamesInToCell('O26', 'N26', 'P26');
		divideTwoCellsByNamesInToCell('O34', 'N34', 'P34');
		divideTwoCellsByNamesInToCell('O37', 'N37', 'P37');
		divideTwoCellsByNamesInToCell('O39', 'N39', 'P39');
		divideTwoCellsByNamesInToCell('O41', 'N41', 'P41');
		divideTwoCellsByNamesInToCell('O43', 'N43', 'P43');
		divideTwoCellsByNamesInToCell('O46', 'N46', 'P46');
	}
	catch(e)
	{
		errHandler('generateYearToDateVarianceDataPercent', e);
	}
}


//Column Q
/***********************************************************************************************************
 * generateYearToDateBudgetTypeData - replacing the 'budgetType' data in the 'Year-to-date' section
 *
 **********************************************************************************************************/
function generateYearToDateBudgetTypeData()
{	 
	try
	{
		//getting the appropriate search results by the budget type : Main, RF1 or RF2
		if(budgetName == 'Main')
		{
			searchColInternalId = 'custrecord_year_to_date_budgets_main';
		}
		else if(budgetName == 'RF1')
		{
			searchColInternalId = 'custrecord_year_to_date_budgets_rf1';
		}
		else if(budgetName == 'RF2')
		{
			searchColInternalId = 'custrecord_year_to_date_budgets_rf2';
		}

		//getting the appropriate search results
		yearToDateBudgetsSecond = searchSpreadsheetData(searchColInternalId);

		if(yearToDateBudgetsSecond !=null)
		{ 
			calculateData(yearToDateBudgetsSecond);

			setCellValueByCellName('Q8', revTotalAmount);
			divideCellByNameWithAmount('Q8', 1000);

			setCellValueByCellName('Q9', revProgrammeFees);
			setCellValueByCellName('Q10', revFilmProduction);
			setCellValueByCellName('Q11', revStoryWeb);
			setCellValueByCellName('Q12', revTsWorkshops);
			setCellValueByCellName('Q13', revLaveryRoom);
			setCellValueByCellName('Q14', revTravel);
			setCellValueByCellName('Q15', revCurrency);

			setCellValueByCellName('Q17', cosTotalAmount);
			divideCellByNameWithAmount('Q17', 1000);

			setCellValueByCellName('Q18', cosProgrammingFees);
			setCellValueByCellName('Q19', cosFilmProduction);
			setCellValueByCellName('Q20', cosStoryWeb);
			setCellValueByCellName('Q21', cosTsWorkshops);
			setCellValueByCellName('Q22', cosLaveryRoom);
			setCellValueByCellName('Q23', cosTravel);
			setCellValueByCellName('Q24', cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('Q25',calculatedCell);
		
			setCellValueByCellName('Q26', grossProfit);
			divideCellByNameWithAmount('Q26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);
			setCellValueByCellName('Q27',calculatedCell); 
		
			setCellValueByCellName('Q29', headCount);
			setCellValueByCellName('Q34', employmentCosts);
			setCellValueByCellName('Q43', totalExpenses);
			setCellValueByCellName('Q39', adminCosts);
			setCellValueByCellName('Q41', professionalFees); 
			setCellValueByCellName('Q37', propertyCosts);
			setCellValueByCellName('Q46', EBITDA);

			//to ignore the 'division by 0' error
			if(isCellBlank('Q34') == false) 
			{
				resultedValue = getCellValueByName('Q34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'Q30');
			}

			//to ignore the 'division by 0' error
			if(isCellBlank('Q26') == false)
			{
				divideTwoCellsByNamesInToCell('Q34', 'Q26', 'Q35');
				divideTwoCellsByNamesInToCell('Q37', 'Q26', 'Q38');
				divideTwoCellsByNamesInToCell('Q39', 'Q26', 'Q40');
				divideTwoCellsByNamesInToCell('Q41', 'Q26', 'Q42');
				divideTwoCellsByNamesInToCell('Q43', 'Q26', 'Q44');
				
				//passing the Q46's value to positive value
				positiveCellValue = getCellValueByName('Q46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('Q26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'Q47');
				multiplyCellByValue('Q47', 100);
			}

			if(isCellBlank('Q29') == false)
			{
				resultedValue = getCellValueByName('Q29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'Q31');
				multiplyCellByValue('Q31', 1000);
				
				resultedValue = getCellValueByName('Q34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'Q32');
				
				resultedValue = divideTwoCellsByNames('Q32','Q29');
				setCellValueByCellName('Q32', resultedValue);
				multiplyCellByValue('Q32', 1000);

				resultedValue = divideTwoCellsByNames('Q34','Q29');
				setCellValueByCellName('Q36', resultedValue);
				multiplyCellByValue('Q36', 1000);
			
			}
		}	 	
	}
	catch(e)
	{
		errHandler('generateYearToDateBudgetTypeData', e);
	}
}


//Column R
/***********************************************************************************************************
 * generateYearToDateBudgetTypeVarianceData - replacing year to date budget type variance data 
 * 
 **********************************************************************************************************/
function generateYearToDateBudgetTypeVarianceData()
{
	try
	{
		subtractCellWithAnotherCellByCellNameInToCell('M8', 'Q8', 'R8');
		subtractCellWithAnotherCellByCellNameInToCell('M9', 'Q9', 'R9');
		subtractCellWithAnotherCellByCellNameInToCell('M10', 'Q10', 'R10');
		subtractCellWithAnotherCellByCellNameInToCell('M11', 'Q11', 'R11');
		subtractCellWithAnotherCellByCellNameInToCell('M12', 'Q12', 'R12');
		subtractCellWithAnotherCellByCellNameInToCell('M13', 'Q13', 'R13');
		subtractCellWithAnotherCellByCellNameInToCell('M14', 'Q14', 'R14');
		subtractCellWithAnotherCellByCellNameInToCell('M15', 'Q15', 'R15');
		
		subtractCellWithAnotherCellByCellNameInToCell('Q17', 'M17', 'R17');
		subtractCellWithAnotherCellByCellNameInToCell('Q18', 'M18', 'R18');
		subtractCellWithAnotherCellByCellNameInToCell('Q19', 'M19', 'R19');
		subtractCellWithAnotherCellByCellNameInToCell('Q20', 'M20', 'R20');
		subtractCellWithAnotherCellByCellNameInToCell('Q21', 'M21', 'R21');
		subtractCellWithAnotherCellByCellNameInToCell('Q22', 'M22', 'R22');
		subtractCellWithAnotherCellByCellNameInToCell('Q22', 'M23', 'R23');
		subtractCellWithAnotherCellByCellNameInToCell('Q24', 'M24', 'R24');
		
		subtractCellWithAnotherCellByCellNameInToCell('M26', 'Q26', 'R26');
		
		subtractCellWithAnotherCellByCellNameInToCell('Q34', 'M34', 'R34');
		subtractCellWithAnotherCellByCellNameInToCell('Q37', 'M37', 'R37');
		subtractCellWithAnotherCellByCellNameInToCell('Q39', 'M39', 'R39');
		subtractCellWithAnotherCellByCellNameInToCell('Q41', 'M41', 'R41');		 
		subtractCellWithAnotherCellByCellNameInToCell('Q43', 'M43', 'R43');
		
		positiveCellValue = getCellValueByName('M46');
		positiveCellValue = Math.abs(positiveCellValue);
		resultedValue = getCellValueByName('Q46');
		subtractAmountWithAmountInToCell(positiveCellValue, resultedValue, 'R46');
			
	}
	catch(e)
	{
		errHandler('generateYearToDateBudgetTypeVarianceData', e);
	}
}


//Column S
/***********************************************************************************************************
 * generateYearToDateBudgetTypeVarianceDataPercent - replacing the year to date budget type variance percentage data 
 * 
 **********************************************************************************************************/
function generateYearToDateBudgetTypeVarianceDataPercent()
{
	try
	{
		divideTwoCellsByNamesInToCell('R8', 'Q8', 'S8');
		divideTwoCellsByNamesInToCell('R9', 'Q9', 'S9');
		divideTwoCellsByNamesInToCell('R10', 'Q10', 'S10');
		divideTwoCellsByNamesInToCell('R11', 'Q11', 'S11');
		divideTwoCellsByNamesInToCell('R12', 'Q12', 'S12');
		divideTwoCellsByNamesInToCell('R13', 'Q13', 'S13');
		divideTwoCellsByNamesInToCell('R14', 'Q14', 'S14');
		divideTwoCellsByNamesInToCell('R15', 'Q15', 'S15');
		divideTwoCellsByNamesInToCell('R17', 'Q17', 'S17');
		divideTwoCellsByNamesInToCell('R18', 'Q18', 'S18');
		divideTwoCellsByNamesInToCell('R19', 'Q19', 'S19');
		divideTwoCellsByNamesInToCell('R20', 'Q20', 'S20');
		divideTwoCellsByNamesInToCell('R21', 'Q21', 'S21');
		divideTwoCellsByNamesInToCell('R22', 'Q22', 'S22');
		divideTwoCellsByNamesInToCell('R23', 'Q23', 'S23');
		divideTwoCellsByNamesInToCell('R24', 'Q24', 'S24');
		divideTwoCellsByNamesInToCell('R26', 'Q26', 'S26');
		divideTwoCellsByNamesInToCell('R34', 'Q34', 'S34');
		divideTwoCellsByNamesInToCell('R37', 'Q37', 'S37');
		divideTwoCellsByNamesInToCell('R39', 'Q39', 'S39');
		divideTwoCellsByNamesInToCell('R41', 'Q41', 'S41');
		divideTwoCellsByNamesInToCell('R43', 'Q43', 'S43');
		
		positiveCellValue = getCellValueByName('R46');
		positiveCellValue = Math.abs(positiveCellValue);
		resultedValue = getCellValueByName('Q46');
		divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'S46');
		multiplyCellByValue('S46', 100);
	
	}
	catch(e)
	{
		errHandler('generateYearToDateBudgetTypeVarianceDataPercent', e);
	}
}


//Column T
/***********************************************************************************************************
 * generateYearToDateLastYearData - replacing the 'Last Year' data in the 'Year-to-date' section
 *
 **********************************************************************************************************/
function generateYearToDateLastYearData()
{	 
	try
	{
		//getting the appropriate search results - prior year actuals
		yearToDateLastYear = searchSpreadsheetData('custrecord_prior_year_actuals');

		if(yearToDateLastYear !=null)
		{ 
			calculateData(yearToDateLastYear);

			setCellValueByCellName('T8', revTotalAmount);
			divideCellByNameWithAmount('T8', 1000);

			setCellValueByCellName('T9', revProgrammeFees);
			setCellValueByCellName('T10', revFilmProduction);
			setCellValueByCellName('T11', revStoryWeb);
			setCellValueByCellName('T12', revTsWorkshops);
			setCellValueByCellName('T13', revLaveryRoom);
			setCellValueByCellName('T14', revTravel);
			setCellValueByCellName('T15', revCurrency);

			setCellValueByCellName('T17', cosTotalAmount);
			divideCellByNameWithAmount('T17', 1000);

			setCellValueByCellName('T18', cosProgrammingFees);
			setCellValueByCellName('T19', cosFilmProduction);
			setCellValueByCellName('T20', cosStoryWeb);
			setCellValueByCellName('T21', cosTsWorkshops);
			setCellValueByCellName('T22', cosLaveryRoom);
			setCellValueByCellName('T23', cosTravel);
			setCellValueByCellName('T24', cosCurrency);
			
			calculatedCell = parseFloat(cosRevenuePercentage).toFixed(2);
			setCellValueByCellName('T25',calculatedCell);
		
			setCellValueByCellName('T26', grossProfit);
			divideCellByNameWithAmount('T26', 1000);

			calculatedCell = parseFloat(grossProfitRevenuePercentage).toFixed(2);
			setCellValueByCellName('T27',calculatedCell); 
		
			setCellValueByCellName('T29', headCount);
			setCellValueByCellName('T34', employmentCosts);
			setCellValueByCellName('T43', totalExpenses);
			setCellValueByCellName('T39', adminCosts);
			setCellValueByCellName('T41', professionalFees);
			setCellValueByCellName('T46', EBITDA);
			setCellValueByCellName('T37', propertyCosts);

			//to ignore the 'division by 0' error
			if(isCellBlank('T34') == false)
			{
				resultedValue = getCellValueByName('T34');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'T30');
			
			}

			//to ignore the 'division by 0' error
			if(isCellBlank('T26') == false)
			{
				divideTwoCellsByNamesInToCell('T34', 'T26', 'T35');
				divideTwoCellsByNamesInToCell('T37', 'T26', 'T38');
				divideTwoCellsByNamesInToCell('T39', 'T26', 'T40');
				divideTwoCellsByNamesInToCell('T41', 'T26', 'T42');
				divideTwoCellsByNamesInToCell('T43', 'T26', 'T44');
				
				//passing the T46's value to positive value
				positiveCellValue = getCellValueByName('T46');
				positiveCellValue = Math.abs(positiveCellValue);
				resultedValue = getCellValueByName('T26');
				divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'T47');
				multiplyCellByValue('T47', 100);
				
			}

			if(isCellBlank('T29') == false)
			{
				resultedValue = getCellValueByName('T29');
				divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'T31');
				multiplyCellByValue('T31', 1000);
				
				resultedValue = getCellValueByName('T34');
				subtractAmountWithAmountInToCell(positiveGrossProfit,resultedValue, 'T32');
				
				resultedValue = divideTwoCellsByNames('T32','T29');
				setCellValueByCellName('T32', resultedValue);
				multiplyCellByValue('T32', 1000);
			
				resultedValue = divideTwoCellsByNames('T34','T29');
				setCellValueByCellName('T36', resultedValue);
				multiplyCellByValue('T36', 1000);
			
			}
		}	 	
	}
	catch(e)
	{
		errHandler('generateYearToDateLastYearData', e);
	}
}


//Column U
/***********************************************************************************************************
 * generateYearToDateLastYearChangeData - replacing the year to date last year variance data 
 * 
 **********************************************************************************************************/
function generateYearToDateLastYearChangeData()
{
	try
	{
		subtractCellWithAnotherCellByCellNameInToCell('M8', 'T8', 'U8');
		subtractCellWithAnotherCellByCellNameInToCell('M9', 'T9', 'U9');
		subtractCellWithAnotherCellByCellNameInToCell('M10', 'T10', 'U10');
		subtractCellWithAnotherCellByCellNameInToCell('M11', 'T11', 'U11');
		subtractCellWithAnotherCellByCellNameInToCell('M12', 'T12', 'U12');
		subtractCellWithAnotherCellByCellNameInToCell('M13', 'T13', 'U13');
		subtractCellWithAnotherCellByCellNameInToCell('M14', 'T14', 'U14');
		subtractCellWithAnotherCellByCellNameInToCell('M15', 'T15', 'U15');
		
		subtractCellWithAnotherCellByCellNameInToCell('T17', 'M17', 'U17');
		subtractCellWithAnotherCellByCellNameInToCell('T18', 'M18', 'U18');
		subtractCellWithAnotherCellByCellNameInToCell('T19', 'M19', 'U19');
		subtractCellWithAnotherCellByCellNameInToCell('T20', 'M20', 'U20');
		subtractCellWithAnotherCellByCellNameInToCell('T21', 'M21', 'U21');
		subtractCellWithAnotherCellByCellNameInToCell('T22', 'M22', 'U22');
		subtractCellWithAnotherCellByCellNameInToCell('T23', 'M23', 'U23');
		subtractCellWithAnotherCellByCellNameInToCell('T24', 'M24', 'U24');
		
		subtractCellWithAnotherCellByCellNameInToCell('M26', 'T26', 'U26');
		
		subtractCellWithAnotherCellByCellNameInToCell('T34', 'M34', 'U34');
		subtractCellWithAnotherCellByCellNameInToCell('T37', 'M37', 'U37');
		subtractCellWithAnotherCellByCellNameInToCell('T39', 'M39', 'U39');
		subtractCellWithAnotherCellByCellNameInToCell('T41', 'M41', 'U41');
		subtractCellWithAnotherCellByCellNameInToCell('T43', 'M43', 'U43');
		
		subtractCellWithAnotherCellByCellNameInToCell('M46', 'T46', 'U46');
	}
	catch(e)
	{
		errHandler('generateYearToDateLastYearChangeData', e);
	}
}


//Column V
/***********************************************************************************************************
 * generateYearToDateLastYearChangeDataPercent - replacing the year to date last year change percentage data
 *
 **********************************************************************************************************/
function generateYearToDateLastYearChangeDataPercent()
{
	try
	{
		divideTwoCellsByNamesInToCell('U8', 'T8', 'V8');
		divideTwoCellsByNamesInToCell('U9', 'T9', 'V9');
		divideTwoCellsByNamesInToCell('U10', 'T10', 'V10');
		divideTwoCellsByNamesInToCell('U11', 'T11', 'V11');
		divideTwoCellsByNamesInToCell('U12', 'T12', 'V12');
		divideTwoCellsByNamesInToCell('U13', 'T13', 'V13');
		divideTwoCellsByNamesInToCell('U14', 'T14', 'V14');
		divideTwoCellsByNamesInToCell('U15', 'T15', 'V15');
		divideTwoCellsByNamesInToCell('U17', 'T17', 'V17');
		divideTwoCellsByNamesInToCell('U18', 'T18', 'V18');
		divideTwoCellsByNamesInToCell('U19', 'T19', 'V19');
		divideTwoCellsByNamesInToCell('U20', 'T20', 'V20');
		divideTwoCellsByNamesInToCell('U21', 'T21', 'V21');
		divideTwoCellsByNamesInToCell('U22', 'T22', 'V22');
		divideTwoCellsByNamesInToCell('U23', 'T23', 'V23');
		divideTwoCellsByNamesInToCell('U24', 'T24', 'V24');
		divideTwoCellsByNamesInToCell('U26', 'T26', 'V26');
		divideTwoCellsByNamesInToCell('U34', 'T34', 'V34');
		divideTwoCellsByNamesInToCell('U37', 'T37', 'V37');
		divideTwoCellsByNamesInToCell('U39', 'T39', 'V39');
		divideTwoCellsByNamesInToCell('U41', 'T41', 'V41');
		divideTwoCellsByNamesInToCell('U43', 'T43', 'V43');
		
		positiveCellValue = getCellValueByName('U46');
		positiveCellValue = Math.abs(positiveCellValue);
		resultedValue = getCellValueByName('T46');
		divideAmountByAmountInToCell(positiveCellValue, resultedValue, 'V46');
		multiplyCellByValue('V46', 100);
	
	}
	catch(e)
	{
		errHandler('generateYearToDateLastYearChangeDataPercent', e);
	}
}


/***********************************************************************************************************
 * generateComplexCalculationData - replacing the rows with complex calculations
 *
 **********************************************************************************************************/
function generateComplexCalculationData()
{	
	try
	{
		divideTwoCellsByNamesInToCell('C8', 'J8', 'C16');
		subtractCellByCellName('C16', 100);
		divideCellByNameWithAmount('C16', 100);
		multiplyCellByValue('C16', 100);

		divideTwoCellsByNamesInToCell('M8', 'T8', 'M16');
		subtractCellByCellName('M16', 100);
		divideCellByNameWithAmount('M16', 100);
		multiplyCellByValue('M16', 100);

		resultedValue = getCellValueByName('J26');
		divideAmountByAmountInToCell(positiveGrossProfit, resultedValue, 'C28');
		subtractCellByCellName('C28', 100);
		divideCellByNameWithAmount('C28', 100);
		multiplyCellByValue('C28', 100);

		divideTwoCellsByNamesInToCell('M26', 'T26', 'M28');
		subtractCellByCellName('M28', 100);
		divideCellByNameWithAmount('M28', 100);
		multiplyCellByValue('M28', 100);

	}
	catch(e)
	{
		errHandler('generateComplexCalculationData', e);
	}
}


/***********************************************************************************************************
 * initialiseGlobalVariables - re -initializing the global variables 
 *
 **********************************************************************************************************/
function initialiseGlobalVariables()
{
	try
	{
		//defaulting the search columns
		searchColumns[0] = new nlobjSearchColumn('custrecord_rolling_months_budgets_main', null, 'sum');
		searchColumns[1] = new nlobjSearchColumn('custrecord_ba_sum_reporting_group', null, 'group');

		summaryGroup ='';
		amount = 0;
		revTotalAmount = 0;
		cosTotalAmount = 0;
		cosRevenuePercentage = 0;
		grossProfit = 0;
		grossProfitRevenuePercentage = 0;
		summaryGroupType = '';
		totalExpenses = 0;
		EBITDA = 0;
		revProgrammeFees = 0;
		revFilmProduction = 0;
		revStoryWeb = 0;
		revTsWorkshops = 0;
		revLaveryRoom = 0;
		revTravel = 0;
		revCurrency = 0;
		cosProgrammingFees = 0;
		cosFilmProduction = 0;
		cosStoryWeb = 0;
		cosTsWorkshops = 0;
		cosLaveryRoom = 0;
		cosTravel = 0;
		cosCurrency = 0;
		employmentCosts = 0;
		propertyCosts = 0;
		adminCosts = 0;
		professionalFees = 0;

		searchColInternalId = '';
	}
	catch(e)
	{
		errHandler('initialiseGlobalVariables', e);
	}
}



/***********************************************************************************************************
 * calculateData - calculating and assigning the data to appropriate variables
 * 
 *@param searchResultsArray - the array with the appropriate search results data
 *
 **********************************************************************************************************/
function calculateData(searchResultsArray,text)
{	

	try
	{
		if(searchResultsArray != null)
		{
			for(var index = 0; index < searchResultsArray.length; index++)
			{
				summaryGroup = searchResultsArray[index].getText(searchColumns[1]);
				amount = searchResultsArray[index].getValue(searchColumns[0]);
				amount = Math.abs(amount); 												//Getting only the positive values
				summaryGroupType = summaryGroup.substring(0, 3);

				//if amount is null then convert it in to a float (if not do this,then when we calculating the total it gives NaN as '' will regarded as a string )
				if(amount == '')
				{
					amount = 0; 
				}
				
				//calculate the total depending on the summary group
				if(summaryGroupType == 'Rev')
				{
					revTotalAmount = revTotalAmount + parseFloat(amount);
				}
				else if(summaryGroupType =='COS')
				{
					cosTotalAmount = cosTotalAmount + parseFloat(amount);
				}

				//calculate the main values depending on the summary group
				calculateMainValues();
			}
			
			//calculating the gross profit
			grossProfit = Math.abs(revTotalAmount) - cosTotalAmount;
			grossProfit = parseFloat(grossProfit).toFixed(2);

			positiveGrossProfit = Math.abs(grossProfit);						//getting the positive value
			
			//To avoid the 'division by 0' error
			if(revTotalAmount != 0)
			{
				cosRevenuePercentage = (cosTotalAmount / revTotalAmount) * 100;
				grossProfitRevenuePercentage = (positiveGrossProfit / revTotalAmount) * 100;
			}
			
			//Math.abs is for getting the absolute value regardless oof the sign (otherwise the calculation doesn't work properly)
			totalExpenses =  (Math.abs(employmentCosts)  + Math.abs(propertyCosts) + Math.abs(adminCosts) + Math.abs(professionalFees)); 

			//calculate the EBITDA
			positiveGrossProfit = (positiveGrossProfit/1000);						
			positiveGrossProfit = parseFloat(positiveGrossProfit);
			totalExpenses = parseFloat(totalExpenses);
			EBITDA = positiveGrossProfit - totalExpenses;
			EBITDA = parseFloat(EBITDA);
			EBITDA = EBITDA.toFixed(2);
		}
	}
	catch(e)
	{
		errHandler('calculateData', e);
	}
}



/***********************************************************************************************************
 * calculateMainValues - calculating the main values depending on the summary group
 * 
 *@param searchResultsArray - the array with the appropriate search results data
 *
 **********************************************************************************************************/
function calculateMainValues()
{
	try
	{
		//calculate the other values depending on the summary group
		switch(summaryGroup)
		{
			case('Rev: Programme fees'):
				revProgrammeFees = parseFloat(amount/1000);
				revProgrammeFees = revProgrammeFees.toFixed(2);
				break;

			case('Rev: Film & Production'):
				revFilmProduction = parseFloat(amount/1000);
				revFilmProduction = revFilmProduction.toFixed(2);
				break;

			case('Rev: StoryWeb'):
				revStoryWeb = parseFloat(amount/1000);
				revStoryWeb = revStoryWeb.toFixed(2);
				break;

			case('Rev: TS workshops'):
				revTsWorkshops = parseFloat(amount/1000);
				revTsWorkshops = revTsWorkshops.toFixed(2);
				break;
			
			case('Rev: Lavery Room'):
				revLaveryRoom = parseFloat(amount/1000);
				revLaveryRoom = revLaveryRoom.toFixed(2);
				break;

			case('Rev: Travel'):
				revTravel = parseFloat(amount/1000);
				revTravel = revTravel.toFixed(2);
				break;

			case('Rev: Currency'):
				revCurrency = parseFloat(amount/1000);
				revCurrency = revCurrency.toFixed(2);
				break;

			case('COS: Programme fees'):
				cosProgrammingFees = parseFloat(amount/1000);
				cosProgrammingFees = cosProgrammingFees.toFixed(2);
				break;

			case('COS: Film & Production'):
				cosFilmProduction = parseFloat(amount/1000);
				cosFilmProduction = cosFilmProduction.toFixed(2);
				break;

			case('COS: StoryWeb'):
				cosStoryWeb = parseFloat(amount/1000);
				cosStoryWeb	= cosStoryWeb.toFixed(2);
				break;

			case('COS: TS workshops'):
				cosTsWorkshops = parseFloat(amount/1000);
				cosTsWorkshops = cosTsWorkshops.toFixed(2);
				break;

			case('COS: Lavery Room'):
				cosLaveryRoom = parseFloat(amount/1000);
				cosLaveryRoom = cosLaveryRoom.toFixed(2);
				
				break;

			case('COS: Travel'):
				cosTravel = parseFloat(amount/1000);
				cosTravel = cosTravel.toFixed(2);
				break;

			case('COS: Currency'):
				cosCurrency = parseFloat(amount/1000);
				cosCurrency = cosCurrency.toFixed(2);
				break;

			case('Employment Costs'):
				employmentCosts = parseFloat(amount/1000);
				employmentCosts = employmentCosts.toFixed(2);
				break;

			case('Property Costs'):
				propertyCosts = parseFloat(amount/1000);
				propertyCosts = propertyCosts.toFixed(2);
				break;

			case('Administrative Costs'):
				adminCosts = parseFloat(amount/1000);
				adminCosts = adminCosts.toFixed(2);
				break;

			case('Professional Fees'):
				professionalFees = parseFloat(amount/1000);
				professionalFees = professionalFees.toFixed(2);
				break;

			case('Head Count'):
				headCount = parseFloat(amount);
				headCount = headCount.toFixed(0);
				break;

			default :
				break;
		}
	
	}
	catch(e)
	{
		errHandler('calculateMainValues', e);
	}
}


/*************************************************************************************
 * searchSpreadsheetData - function to get the search results from the custom record : budgets and actuals, according to the data passing
 * 
 * @param searchColumnInternalId - InternalID of the column you wish to SUM
 * 
 * @returns nlobjSearchResult[]
 * 
 *************************************************************************************/
function searchSpreadsheetData(seachColumnInternalId)
{
	var searchResults = null;

	try
	{
		searchColumns[0] = new nlobjSearchColumn(seachColumnInternalId, null, 'sum');
		searchColumns[1] = new nlobjSearchColumn('custrecord_ba_sum_reporting_group', null, 'group');

		searchResults = nlapiSearchRecord('customrecord_budgets_and_actuals', null, null, searchColumns);
	}
	catch(e)
	{
		errHandler('searchSpreadsheetData', e);
	}
	return searchResults;
}



