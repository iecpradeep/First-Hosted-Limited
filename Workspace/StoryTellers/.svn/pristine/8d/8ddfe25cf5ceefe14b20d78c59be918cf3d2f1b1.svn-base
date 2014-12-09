/********************************************************************
 * Name: monthlySpreadSheet_portlet.js
 * Script Type: Portlet
 *
 * Version: 1.0.0 – 26/11/2012 – 1st release - PAL
 * 
 * Author: First Hosted Limited
 *
 * Purpose: A Portlet to replicate the management spreadsheet monthly report
 * 
 * Script: The script record id – custscript_xxx
 * Deploy: The script deployment record id – customdeploy_xxx
 *
 * Notes: This script is NOT linked to a form, and never will be
 *
 * ###################################################################################
 * Please note that in order for this file to make sense, you MUST have the Storytellers Management Account Spread Sheet to hand.
 * ###################################################################################
 *
 * Library: n/a
 ********************************************************************/

//declare global variables

var content = "";				//Inline HTML Portlet Content
var cssCode = "";				//Inline CSS Portlet Stylesheet
var context = nlapiGetContext();
var errorMessage = "";

//[TODO] - Pass this as a parameter
var refreshLink = 'https://system.netsuite.com/app/common/scripting/scriptrecord.nl?id=1&scripttype=73&e=T';

var headCountColumns = new Array();

var today = null;
var currentMonth = '';
var currentYear = 0;
var currentDate= 0;
var currentFullDate = '';

var revProgrammeFees = 0;
var revFilmProduction = 0;
var revStoryWeb = 0;
var revTsWorkshops = 0;
var revLaveryRoom = 0;
var revTravel = 0;
var revCurrency = 0;
var cosFreelanceStaff = 0;
var cosFreelanceStaffDelivery = 0;
var cosExternalDesign = 0;
var cosSalesCommission = 0;
var cosFilmVideo = 0;
var cosStoryWeb = 0;
var cosPrinting = 0;
var cosTsWorkshops = 0;
var cosLaveryRoom = 0;
var cosTravel = 0;
var cosOther = 0;
var employmentCosts = 0;
var propertyCosts = 0;
var adminCosts = 0;
var professionalFees = 0;
var monthlyGroup ='';
var amount = 0;
var revTotalAmount = 0;
var cosTotalAmount =0;
var cosRevenuePercentage = 0;
var grossProfit = 0;
var grossProfitRevenuePercentage =0;
var totalExpenses = 0;
var EBITDA =0;
var headCount = 0; 
var budgetName ='';
var salSalaries = 0;
var salErs = 0;
var salFreelanceStaff = 0;
var salRedandancy = 0;
var salCpd = 0;
var salNonRechargable = 0 ;
var salITCharge = 0;
var salProfService = 0;
var salStaffEntertain = 0;
var spaRent = 0;
var spaRates= 0;
var spaWaterRates = 0;
var spaOfficeCleaning = 0;
var spaInsurance = 0;
var spaRepairs = 0;
var spaRelocation = 0;
var ovePrint = 0;
var oveRevised = 0;
var oveTelephoneSystem = 0;
var oveTelephoneCalls = 0;
var oveHeat = 0;
var oveInsurances = 0;
var oveClientEntertain = 0;
var oveITCosts = 0;
var oveITRecovery = 0;
var oveCompanyMeeting = 0;
var oveDevCosts = 0;
var ovePromotion = 0;
var oveAwards = 0;
var oveForums = 0;
var oveMarketing = 0;
var oveSales = 0;
var oveUSSales = 0;
var oveBankCharges = 0;
var oveRecruitment = 0;
var oveSunryOffice = 0;
var profAudit = 0;
var profAccounting = 0;
var profLegal = 0;
var profOther = 0;
var operatingProfit = 0;
//var salITCharge = 0;

var searchColInternalId = '';
var rollingThreeMonthsActualsColumns = new Array();
var rollingThreeMonthsBudgetsMainColumns = new Array();
var rollingThreeMonthsBudgetsSecondColumns = new Array();
var searchColumns = new Array();

var E8 = 0;
var E9 = 0;
var E10 = 0;
var E11 = 0;
var E12 = 0;
var E13 = 0;
var E14 = 0;
var E18 = 0;
var E19 = 0;
var E20 = 0;
var E21 = 0;
var E22 = 0;
var E23 = 0;
var E24 = 0;
var E25 = 0;
var E26 = 0;
var E27 = 0;
var E28 = 0;
var E31 = 0;
var E32 = 0;
var E34 = 0;
var E35 = 0;
var E36 = 0;
var E37 = 0;
var E38 = 0;
var E39 = 0;
var E42 = 0;
var E43 = 0;
var E44 = 0;
var E46 = 0;
var E47 = 0;
var E48 = 0;
var E51 = 0;
var E52 = 0;
var E53 = 0;
var E54 = 0;
var E55 = 0;
var E56 = 0;
var E57 = 0;
var E58 = 0;
var E59 = 0;
var E60 = 0;
var E61 = 0;
var E62 = 0;
var E63 = 0;
var E64 = 0;
var E65 = 0;
var E66 = 0;
var E67 = 0;
var E68 = 0;
var E69 = 0;
var E70 = 0;
var E73 = 0;
var E74 = 0;
var E75 = 0;
var E76 = 0;
var E78 = 0;
var E80 = 0;
var E82 = 0;
var E83 = 0;
var E84 = 0;
var E85 = 0;
var E86 = 0;
var E87 = 0;
var E88 = 0;
var E89 = 0;


var F8 = 0;
var F9 = 0;
var F10 = 0;
var F11 = 0;
var F12 = 0;
var F13 = 0;
var F14 = 0;
var F18 = 0;
var F19 = 0;
var F20 = 0;
var F21 = 0;
var F22 = 0;
var F23 = 0;
var F24 = 0;
var F25 = 0;
var F26 = 0;
var F27 = 0;
var F28 = 0;
var F31 = 0;
var F32 = 0;
var F34 = 0;
var F35 = 0;
var F36 = 0;
var F37 = 0;
var F38 = 0;
var F39 = 0;
var F42 = 0;
var F43 = 0;
var F44 = 0;
var F46 = 0;
var F47 = 0;
var F48 = 0;
var F51 = 0;
var F52 = 0;
var F53 = 0;
var F54 = 0;
var F55 = 0;
var F56 = 0;
var F57 = 0;
var F58 = 0;
var F59 = 0;
var F60 = 0;
var F61 = 0;
var F62 = 0;
var F63 = 0;
var F64 = 0;
var F65 = 0;
var F66 = 0;
var F67 = 0;
var F68 = 0;
var F69 = 0;
var F70 = 0;
var F73 = 0;
var F74 = 0;
var F75 = 0;
var F76 = 0;
var F78 = 0;
var F80 = 0;
var F82 = 0;
var F83 = 0;
var F84 = 0;
var F85 = 0;
var F86 = 0;
var F87 = 0;
var F88 = 0;
var F89 = 0;


var G8 = 0;
var G9 = 0;
var G10 = 0;
var G11 = 0;
var G12 = 0;
var G13 = 0;
var G14 = 0;
var G18 = 0;
var G19 = 0;
var G20 = 0;
var G21 = 0;
var G22 = 0;
var G23 = 0;
var G24 = 0;
var G25 = 0;
var G26 = 0;
var G27 = 0;
var G28 = 0;
var G31 = 0;
var G32 = 0;
var G34 = 0;
var G35 = 0;
var G36 = 0;
var G37 = 0;
var G38 = 0;
var G39 = 0;
var G42 = 0;
var G43 = 0;
var G44 = 0;
var G46 = 0;
var G47 = 0;
var G48 = 0;
var G51 = 0;
var G52 = 0;
var G53 = 0;
var G54 = 0;
var G55 = 0;
var G56 = 0;
var G57 = 0;
var G58 = 0;
var G59 = 0;
var G60 = 0;
var G61 = 0;
var G62 = 0;
var G63 = 0;
var G64 = 0;
var G65 = 0;
var G66 = 0;
var G67 = 0;
var G68 = 0;
var G69 = 0;
var G70 = 0;
var G73 = 0;
var G74 = 0;
var G75 = 0;
var G76 = 0;
var G78 = 0;
var G80 = 0;
var G82 = 0;
var G83 = 0;
var G84 = 0;
var G85 = 0;
var G86 = 0;
var G87 = 0;
var G88 = 0;


var H8 = 0;
var H9 = 0;
var H10 = 0;
var H11 = 0;
var H12 = 0;
var H13 = 0;
var H14 = 0;
var H18 = 0;
var H19 = 0;
var H20 = 0;
var H21 = 0;
var H22 = 0;
var H23 = 0;
var H24 = 0;
var H25 = 0;
var H26 = 0;
var H27 = 0;
var H28 = 0;
var H31 = 0;
var H32 = 0;
var H34 = 0;
var H35 = 0;
var H36 = 0;
var H37 = 0;
var H38 = 0;
var H39 = 0;
var H42 = 0;
var H43 = 0;
var H44 = 0;
var H46 = 0;
var H47 = 0;
var H48 = 0;
var H51 = 0;
var H52 = 0;
var H53 = 0;
var H54 = 0;
var H55 = 0;
var H56 = 0;
var H57 = 0;
var H58 = 0;
var H59 = 0;
var H60 = 0;
var H61 = 0;
var H62 = 0;
var H63 = 0;
var H64 = 0;
var H65 = 0;
var H66 = 0;
var H67 = 0;
var H68 = 0;
var H69 = 0;
var H70 = 0;
var H73 = 0;
var H74 = 0;
var H75 = 0;
var H76 = 0;
var H78 = 0;
var H80 = 0;
var H82 = 0;
var H83 = 0;
var H84 = 0;
var H85 = 0;
var H86 = 0;
var H87 = 0;
var H88 = 0;
var H89 = 0;
var H89 = 0;

var I8 = 0;
var I9 = 0;
var I10 = 0;
var I11 = 0;
var I12 = 0;
var I13 = 0;
var I14 = 0;
var I18 = 0;
var I19 = 0;
var I20 = 0;
var I21 = 0;
var I22 = 0;
var I23 = 0;
var I24 = 0;
var I25 = 0;
var I26 = 0;
var I27 = 0;
var I28 = 0;
var I31 = 0;
var I32 = 0;
var I34 = 0;
var I35 = 0;
var I36 = 0;
var I37 = 0;
var I38 = 0;
var I39 = 0;
var I42 = 0;
var I43 = 0;
var I44 = 0;
var I46 = 0;
var I47 = 0;
var I48 = 0;
var I51 = 0;
var I52 = 0;
var I53 = 0;
var I54 = 0;
var I55 = 0;
var I56 = 0;
var I57 = 0;
var I58 = 0;
var I59 = 0;
var I60 = 0;
var I61 = 0;
var I62 = 0;
var I63 = 0;
var I64 = 0;
var I65 = 0;
var I66 = 0;
var I67 = 0;
var I68 = 0;
var I69 = 0;
var I70 = 0;
var I73 = 0;
var I74 = 0;
var I75 = 0;
var I76 = 0;
var I78 = 0;
var I80 = 0;
var I82 = 0;
var I83 = 0;
var I84 = 0;
var I85 = 0;
var I86 = 0;
var I87 = 0;
var I88 = 0;
var I89 = 0;

var J8 = 0;
var J9 = 0;
var J10 = 0;
var J11 = 0;
var J12 = 0;
var J13 = 0;
var J14 = 0;
var J18 = 0;
var J19 = 0;
var J20 = 0;
var J21 = 0;
var J22 = 0;
var J23 = 0;
var J24 = 0;
var J25 = 0;
var J26 = 0;
var J27 = 0;
var J28 = 0;
var J31 = 0;
var J32 = 0;
var J34 = 0;
var J35 = 0;
var J36 = 0;
var J37 = 0;
var J38 = 0;
var J39 = 0;
var J42 = 0;
var J43 = 0;
var J44 = 0;
var J46 = 0;
var J47 = 0;
var J48 = 0;
var J51 = 0;
var J52 = 0;
var J53 = 0;
var J54 = 0;
var J55 = 0;
var J56 = 0;
var J57 = 0;
var J58 = 0;
var J59 = 0;
var J60 = 0;
var J61 = 0;
var J62 = 0;
var J63 = 0;
var J64 = 0;
var J65 = 0;
var J66 = 0;
var J67 = 0;
var J68 = 0;
var J69 = 0;
var J70 = 0;
var J73 = 0;
var J74 = 0;
var J75 = 0;
var J76 = 0;
var J78 = 0;
var J80 = 0;
var J82 = 0;
var J83 = 0;
var J84 = 0;
var J85 = 0;
var J86 = 0;
var J87 = 0;
var J88 = 0;
var J89 = 0;

var K8 = 0;
var K9 = 0;
var K10 = 0;
var K11 = 0;
var K12 = 0;
var K13 = 0;
var K14 = 0;
var K18 = 0;
var K19 = 0;
var K20 = 0;
var K21 = 0;
var K22 = 0;
var K23 = 0;
var K24 = 0;
var K25 = 0;
var K26 = 0;
var K27 = 0;
var K28 = 0;
var K31 = 0;
var K32 = 0;
var K34 = 0;
var K35 = 0;
var K36 = 0;
var K37 = 0;
var K38 = 0;
var K39 = 0;
var K42 = 0;
var K43 = 0;
var K44 = 0;
var K46 = 0;
var K47 = 0;
var K48 = 0;
var K51 = 0;
var K52 = 0;
var K53 = 0;
var K54 = 0;
var K55 = 0;
var K56 = 0;
var K57 = 0;
var K58 = 0;
var K59 = 0;
var K60 = 0;
var K61 = 0;
var K62 = 0;
var K63 = 0;
var K64 = 0;
var K65 = 0;
var K66 = 0;
var K67 = 0;
var K68 = 0;
var K69 = 0;
var K70 = 0;
var K73 = 0;
var K74 = 0;
var K75 = 0;
var K76 = 0;
var K78 = 0;
var K80 = 0;
var K82 = 0;
var K83 = 0;
var K84 = 0;
var K85 = 0;
var K86 = 0;
var K87 = 0;
var K88 = 0;
var K89 = 0;

var L8 = 0;
var L9 = 0;
var L10 = 0;
var L11 = 0;
var L12 = 0;
var L13 = 0;
var L14 = 0;
var L18 = 0;
var L19 = 0;
var L20 = 0;
var L21 = 0;
var L22 = 0;
var L23 = 0;
var L24 = 0;
var L25 = 0;
var L26 = 0;
var L27 = 0;
var L28 = 0;
var L31 = 0;
var L32 = 0;
var L34 = 0;
var L35 = 0;
var L36 = 0;
var L37 = 0;
var L38 = 0;
var L39 = 0;
var L42 = 0;
var L43 = 0;
var L44 = 0;
var L46 = 0;
var L47 = 0;
var L48 = 0;
var L51 = 0;
var L52 = 0;
var L53 = 0;
var L54 = 0;
var L55 = 0;
var L56 = 0;
var L57 = 0;
var L58 = 0;
var L59 = 0;
var L60 = 0;
var L61 = 0;
var L62 = 0;
var L63 = 0;
var L64 = 0;
var L65 = 0;
var L66 = 0;
var L67 = 0;
var L68 = 0;
var L69 = 0;
var L70 = 0;
var L73 = 0;
var L74 = 0;
var L75 = 0;
var L76 = 0;
var L78 = 0;
var L80 = 0;
var L82 = 0;
var L83 = 0;
var L84 = 0;
var L85 = 0;
var L86 = 0;
var L87 = 0;
var L88 = 0;
var L89 = 0;

var M8 = 0;
var M9 = 0;
var M10 = 0;
var M11 = 0;
var M12 = 0;
var M13 = 0;
var M14 = 0;
var M18 = 0;
var M19 = 0;
var M20 = 0;
var M21 = 0;
var M22 = 0;
var M23 = 0;
var M24 = 0;
var M25 = 0;
var M26 = 0;
var M27 = 0;
var M28 = 0;
var M31 = 0;
var M32 = 0;
var M34 = 0;
var M35 = 0;
var M36 = 0;
var M37 = 0;
var M38 = 0;
var M39 = 0;
var M42 = 0;
var M43 = 0;
var M44 = 0;
var M46 = 0;
var M47 = 0;
var M48 = 0;
var M51 = 0;
var M52 = 0;
var M53 = 0;
var M54 = 0;
var M55 = 0;
var M56 = 0;
var M57 = 0;
var M58 = 0;
var M59 = 0;
var M60 = 0;
var M61 = 0;
var M62 = 0;
var M63 = 0;
var M64 = 0;
var M65 = 0;
var M66 = 0;
var M67 = 0;
var M68 = 0;
var M69 = 0;
var M70 = 0;
var M73 = 0;
var M74 = 0;
var M75 = 0;
var M76 = 0;
var M78 = 0;
var M80 = 0;
var M82 = 0;
var M83 = 0;
var M84 = 0;
var M85 = 0;
var M86 = 0;
var M87 = 0;
var M88 = 0;
var M89 = 0;

var N8 = 0;
var N9 = 0;
var N10 = 0;
var N11 = 0;
var N12 = 0;
var N13 = 0;
var N14 = 0;
var N18 = 0;
var N19 = 0;
var N20 = 0;
var N21 = 0;
var N22 = 0;
var N23 = 0;
var N24 = 0;
var N25 = 0;
var N26 = 0;
var N27 = 0;
var N28 = 0;
var N31 = 0;
var N32 = 0;
var N34 = 0;
var N35 = 0;
var N36 = 0;
var N37 = 0;
var N38 = 0;
var N39 = 0;
var N42 = 0;
var N43 = 0;
var N44 = 0;
var N46 = 0;
var N47 = 0;
var N48 = 0;
var N51 = 0;
var N52 = 0;
var N53 = 0;
var N54 = 0;
var N55 = 0;
var N56 = 0;
var N57 = 0;
var N58 = 0;
var N59 = 0;
var N60 = 0;
var N61 = 0;
var N62 = 0;
var N63 = 0;
var N64 = 0;
var N65 = 0;
var N66 = 0;
var N67 = 0;
var N68 = 0;
var N69 = 0;
var N70 = 0;
var N73 = 0;
var N74 = 0;
var N75 = 0;
var N76 = 0;
var N78 = 0;
var N80 = 0;
var N82 = 0;
var N83 = 0;
var N84 = 0;
var N85 = 0;
var N86 = 0;
var N87 = 0;
var N88 = 0;
var N89 = 0;

var P8 = 0;
var P9 = 0;
var P10 = 0;
var P11 = 0;
var P12 = 0;
var P13 = 0;
var P14 = 0;
var P18 = 0;
var P19 = 0;
var P20 = 0;
var P21 = 0;
var P22 = 0;
var P23 = 0;
var P24 = 0;
var P25 = 0;
var P26 = 0;
var P27 = 0;
var P28 = 0;
var P31 = 0;
var P32 = 0;
var P34 = 0;
var P35 = 0;
var P36 = 0;
var P37 = 0;
var P38 = 0;
var P39 = 0;
var P42 = 0;
var P43 = 0;
var P44 = 0;
var P46 = 0;
var P47 = 0;
var P48 = 0;
var P51 = 0;
var P52 = 0;
var P53 = 0;
var P54 = 0;
var P55 = 0;
var P56 = 0;
var P57 = 0;
var P58 = 0;
var P59 = 0;
var P60 = 0;
var P61 = 0;
var P62 = 0;
var P63 = 0;
var P64 = 0;
var P65 = 0;
var P66 = 0;
var P67 = 0;
var P68 = 0;
var P69 = 0;
var P70 = 0;
var P73 = 0;
var P74 = 0;
var P75 = 0;
var P76 = 0;
var P78 = 0;
var P80 = 0;
var P82 = 0;
var P83 = 0;
var P84 = 0;
var P85 = 0;
var P86 = 0;
var P87 = 0;
var P88 = 0;
var P89 = 0;

var Q8 = 0;
var Q9 = 0;
var Q10 = 0;
var Q11 = 0;
var Q12 = 0;
var Q13 = 0;
var Q14 = 0;
var Q18 = 0;
var Q19 = 0;
var Q20 = 0;
var Q21 = 0;
var Q22 = 0;
var Q23 = 0;
var Q24 = 0;
var Q25 = 0;
var Q26 = 0;
var Q27 = 0;
var Q28 = 0;
var Q31 = 0;
var Q32 = 0;
var Q34 = 0;
var Q35 = 0;
var Q36 = 0;
var Q37 = 0;
var Q38 = 0;
var Q39 = 0;
var Q42 = 0;
var Q43 = 0;
var Q44 = 0;
var Q46 = 0;
var Q47 = 0;
var Q48 = 0;
var Q51 = 0;
var Q52 = 0;
var Q53 = 0;
var Q54 = 0;
var Q55 = 0;
var Q56 = 0;
var Q57 = 0;
var Q58 = 0;
var Q59 = 0;
var Q60 = 0;
var Q61 = 0;
var Q62 = 0;
var Q63 = 0;
var Q64 = 0;
var Q65 = 0;
var Q66 = 0;
var Q67 = 0;
var Q68 = 0;
var Q69 = 0;
var Q70 = 0;
var Q73 = 0;
var Q74 = 0;
var Q75 = 0;
var Q76 = 0;
var Q78 = 0;
var Q80 = 0;
var Q82 = 0;
var Q83 = 0;
var Q84 = 0;
var Q85 = 0;
var Q86 = 0;
var Q87 = 0;
var Q88 = 0;
var Q89 = 0;

var R8 = 0;
var R9 = 0;
var R10 = 0;
var R11 = 0;
var R12 = 0;
var R13 = 0;
var R14 = 0;
var R18 = 0;
var R19 = 0;
var R20 = 0;
var R21 = 0;
var R22 = 0;
var R23 = 0;
var R24 = 0;
var R25 = 0;
var R26 = 0;
var R27 = 0;
var R28 = 0;
var R31 = 0;
var R32 = 0;
var R34 = 0;
var R35 = 0;
var R36 = 0;
var R37 = 0;
var R38 = 0;
var R39 = 0;
var R42 = 0;
var R43 = 0;
var R44 = 0;
var R46 = 0;
var R47 = 0;
var R48 = 0;
var R51 = 0;
var R52 = 0;
var R53 = 0;
var R54 = 0;
var R55 = 0;
var R56 = 0;
var R57 = 0;
var R58 = 0;
var R59 = 0;
var R60 = 0;
var R61 = 0;
var R62 = 0;
var R63 = 0;
var R64 = 0;
var R65 = 0;
var R66 = 0;
var R67 = 0;
var R68 = 0;
var R69 = 0;
var R70 = 0;
var R73 = 0;
var R74 = 0;
var R75 = 0;
var R76 = 0;
var R78 = 0;
var R80 = 0;
var R82 = 0;
var R83 = 0;
var R84 = 0;
var R85 = 0;
var R86 = 0;
var R87 = 0;
var R88 = 0;
var R89 = 0;

var S8 = 0;
var S9 = 0;
var S10 = 0;
var S11 = 0;
var S12 = 0;
var S13 = 0;
var S14 = 0;
var S18 = 0;
var S19 = 0;
var S20 = 0;
var S21 = 0;
var S22 = 0;
var S23 = 0;
var S24 = 0;
var S25 = 0;
var S26 = 0;
var S27 = 0;
var S28 = 0;
var S31 = 0;
var S32 = 0;
var S34 = 0;
var S35 = 0;
var S36 = 0;
var S37 = 0;
var S38 = 0;
var S39 = 0;
var S42 = 0;
var S43 = 0;
var S44 = 0;
var S46 = 0;
var S47 = 0;
var S48 = 0;
var S51 = 0;
var S52 = 0;
var S53 = 0;
var S54 = 0;
var S55 = 0;
var S56 = 0;
var S57 = 0;
var S58 = 0;
var S59 = 0;
var S60 = 0;
var S61 = 0;
var S62 = 0;
var S63 = 0;
var S64 = 0;
var S65 = 0;
var S66 = 0;
var S67 = 0;
var S68 = 0;
var S69 = 0;
var S70 = 0;
var S73 = 0;
var S74 = 0;
var S75 = 0;
var S76 = 0;
var S78 = 0;
var S80 = 0;
var S82 = 0;
var S83 = 0;
var S84 = 0;
var S85 = 0;
var S86 = 0;
var S87 = 0;
var S88 = 0;
var S89 = 0;

var T8 = 0;
var T9 = 0;
var T10 = 0;
var T11 = 0;
var T12 = 0;
var T13 = 0;
var T14 = 0;
var T18 = 0;
var T19 = 0;
var T20 = 0;
var T21 = 0;
var T22 = 0;
var T23 = 0;
var T24 = 0;
var T25 = 0;
var T26 = 0;
var T27 = 0;
var T28 = 0;
var T31 = 0;
var T32 = 0;
var T34 = 0;
var T35 = 0;
var T36 = 0;
var T37 = 0;
var T38 = 0;
var T39 = 0;
var T42 = 0;
var T43 = 0;
var T44 = 0;
var T46 = 0;
var T47 = 0;
var T48 = 0;
var T51 = 0;
var T52 = 0;
var T53 = 0;
var T54 = 0;
var T55 = 0;
var T56 = 0;
var T57 = 0;
var T58 = 0;
var T59 = 0;
var T60 = 0;
var T61 = 0;
var T62 = 0;
var T63 = 0;
var T64 = 0;
var T65 = 0;
var T66 = 0;
var T67 = 0;
var T68 = 0;
var T69 = 0;
var T70 = 0;
var T73 = 0;
var T74 = 0;
var T75 = 0;
var T76 = 0;
var T78 = 0;
var T80 = 0;
var T82 = 0;
var T83 = 0;
var T84 = 0;
var T85 = 0;
var T86 = 0;
var T87 = 0;
var T88 = 0;
var T89 = 0;

var U8 = 0;
var U9 = 0;
var U10 = 0;
var U11 = 0;
var U12 = 0;
var U13 = 0;
var U14 = 0;
var U18 = 0;
var U19 = 0;
var U20 = 0;
var U21 = 0;
var U22 = 0;
var U23 = 0;
var U24 = 0;
var U25 = 0;
var U26 = 0;
var U27 = 0;
var U28 = 0;
var U31 = 0;
var U32 = 0;
var U34 = 0;
var U35 = 0;
var U36 = 0;
var U37 = 0;
var U38 = 0;
var U39 = 0;
var U42 = 0;
var U43 = 0;
var U44 = 0;
var U46 = 0;
var U47 = 0;
var U48 = 0;
var U51 = 0;
var U52 = 0;
var U53 = 0;
var U54 = 0;
var U55 = 0;
var U56 = 0;
var U57 = 0;
var U58 = 0;
var U59 = 0;
var U60 = 0;
var U61 = 0;
var U62 = 0;
var U63 = 0;
var U64 = 0;
var U65 = 0;
var U66 = 0;
var U67 = 0;
var U68 = 0;
var U69 = 0;
var U70 = 0;
var U73 = 0;
var U74 = 0;
var U75 = 0;
var U76 = 0;
var U78 = 0;
var U80 = 0;
var U82 = 0;
var U83 = 0;
var U84 = 0;
var U85 = 0;
var U86 = 0;
var U87 = 0;
var U88 = 0;
var U89 = 0;

var V8 = 0;
var V9 = 0;
var V10 = 0;
var V11 = 0;
var V12 = 0;
var V13 = 0;
var V14 = 0;
var V18 = 0;
var V19 = 0;
var V20 = 0;
var V21 = 0;
var V22 = 0;
var V23 = 0;
var V24 = 0;
var V25 = 0;
var V26 = 0;
var V27 = 0;
var V28 = 0;
var V31 = 0;
var V32 = 0;
var V34 = 0;
var V35 = 0;
var V36 = 0;
var V37 = 0;
var V38 = 0;
var V39 = 0;
var V42 = 0;
var V43 = 0;
var V44 = 0;
var V46 = 0;
var V47 = 0;
var V48 = 0;
var V51 = 0;
var V52 = 0;
var V53 = 0;
var V54 = 0;
var V55 = 0;
var V56 = 0;
var V57 = 0;
var V58 = 0;
var V59 = 0;
var V60 = 0;
var V61 = 0;
var V62 = 0;
var V63 = 0;
var V64 = 0;
var V65 = 0;
var V66 = 0;
var V67 = 0;
var V68 = 0;
var V69 = 0;
var V70 = 0;
var V73 = 0;
var V74 = 0;
var V75 = 0;
var V76 = 0;
var V78 = 0;
var V80 = 0;
var V82 = 0;
var V83 = 0;
var V84 = 0;
var V85 = 0;
var V86 = 0;
var V87 = 0;
var V88 = 0;
var V89 = 0;

var W8 = 0;
var W9 = 0;
var W10 = 0;
var W11 = 0;
var W12 = 0;
var W13 = 0;
var W14 = 0;
var W18 = 0;
var W19 = 0;
var W20 = 0;
var W21 = 0;
var W22 = 0;
var W23 = 0;
var W24 = 0;
var W25 = 0;
var W26 = 0;
var W27 = 0;
var W28 = 0;
var W31 = 0;
var W32 = 0;
var W34 = 0;
var W35 = 0;
var W36 = 0;
var W37 = 0;
var W38 = 0;
var W39 = 0;
var W42 = 0;
var W43 = 0;
var W44 = 0;
var W46 = 0;
var W47 = 0;
var W48 = 0;
var W51 = 0;
var W52 = 0;
var W53 = 0;
var W54 = 0;
var W55 = 0;
var W56 = 0;
var W57 = 0;
var W58 = 0;
var W59 = 0;
var W60 = 0;
var W61 = 0;
var W62 = 0;
var W63 = 0;
var W64 = 0;
var W65 = 0;
var W66 = 0;
var W67 = 0;
var W68 = 0;
var W69 = 0;
var W70 = 0;
var W73 = 0;
var W74 = 0;
var W75 = 0;
var W76 = 0;
var W78 = 0;
var W80 = 0;
var W82 = 0;
var W83 = 0;
var W84 = 0;
var W85 = 0;
var W86 = 0;
var W87 = 0;
var W88 = 0;
var W89 = 0;

var X8 = 0;
var X9 = 0;
var X10 = 0;
var X11 = 0;
var X12 = 0;
var X13 = 0;
var X14 = 0;
var X18 = 0;
var X19 = 0;
var X20 = 0;
var X21 = 0;
var X22 = 0;
var X23 = 0;
var X24 = 0;
var X25 = 0;
var X26 = 0;
var X27 = 0;
var X28 = 0;
var X31 = 0;
var X32 = 0;
var X34 = 0;
var X35 = 0;
var X36 = 0;
var X37 = 0;
var X38 = 0;
var X39 = 0;
var X42 = 0;
var X43 = 0;
var X44 = 0;
var X46 = 0;
var X47 = 0;
var X48 = 0;
var X51 = 0;
var X52 = 0;
var X53 = 0;
var X54 = 0;
var X55 = 0;
var X56 = 0;
var X57 = 0;
var X58 = 0;
var X59 = 0;
var X60 = 0;
var X61 = 0;
var X62 = 0;
var X63 = 0;
var X64 = 0;
var X65 = 0;
var X66 = 0;
var X67 = 0;
var X68 = 0;
var X69 = 0;
var X70 = 0;
var X73 = 0;
var X74 = 0;
var X75 = 0;
var X76 = 0;
var X78 = 0;
var X80 = 0;
var X82 = 0;
var X83 = 0;
var X84 = 0;
var X85 = 0;
var X86 = 0;
var X87 = 0;
var X88 = 0;
var X89 = 0;

var Y8 = 0;
var Y9 = 0;
var Y10 = 0;
var Y11 = 0;
var Y12 = 0;
var Y13 = 0;
var Y14 = 0;
var Y18 = 0;
var Y19 = 0;
var Y20 = 0;
var Y21 = 0;
var Y22 = 0;
var Y23 = 0;
var Y24 = 0;
var Y25 = 0;
var Y26 = 0;
var Y27 = 0;
var Y28 = 0;
var Y31 = 0;
var Y32 = 0;
var Y34 = 0;
var Y35 = 0;
var Y36 = 0;
var Y37 = 0;
var Y38 = 0;
var Y39 = 0;
var Y42 = 0;
var Y43 = 0;
var Y44 = 0;
var Y46 = 0;
var Y47 = 0;
var Y48 = 0;
var Y51 = 0;
var Y52 = 0;
var Y53 = 0;
var Y54 = 0;
var Y55 = 0;
var Y56 = 0;
var Y57 = 0;
var Y58 = 0;
var Y59 = 0;
var Y60 = 0;
var Y61 = 0;
var Y62 = 0;
var Y63 = 0;
var Y64 = 0;
var Y65 = 0;
var Y66 = 0;
var Y67 = 0;
var Y68 = 0;
var Y69 = 0;
var Y70 = 0;
var Y73 = 0;
var Y74 = 0;
var Y75 = 0;
var Y76 = 0;
var Y78 = 0;
var Y80 = 0;
var Y82 = 0;
var Y83 = 0;
var Y84 = 0;
var Y85 = 0;
var Y86 = 0;
var Y87 = 0;
var Y88 = 0;
var Y89 = 0;



/*****************************************************
 * monthlyReport (Monthly)
 * 
 * @param {Object} portlet
 * @param {Object} column
 *****************************************************/
function monthlySpreadsheet(portlet, column)
{ 
	//Call the initialiseVariables() subroutine to set all of the content we will be using
	initialiseVariables();

	//Set the Portlet  Title 
	portlet.setTitle('The Storytellers Monthly Report');

	content += '<p>Get Context Usage remaining: ' + context.getRemainingUsage() + '. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Refresh this data by clicking <a href="' + refreshLink + '">here</a></p>';

	
	content = replaceHeaderInformation(content);

	content = replaceDateRangeActualsData(content);
	content = replaceDateRangeBudgetsData(content);
	content = replaceDateRangeVarianceData(content);
	content = replaceDateRangeVarianceDataPercent(content);

	content = replaceDateRangeBudgetTypeData(content);
	content = replaceDateRangeBudgetTypeVarianceData(content);
	content = replaceDateRangeBudgetTypeVarianceDataPercent(content);

	content = replaceDateRangeLastYearData(content);
	content = replaceDateRangeLastYearChangeData(content);
	content = replaceDateRangeLastYearChangeDataPercent(content);

	content = replaceYearToDateActualsData(content);

	content = replaceYearToDateBudgetsData(content);
	content = replaceYearToDateVarianceData(content);
	content = replaceYearToDateVarianceDataPercent(content);

	content = replaceYearToDateBudgetTypeData(content);
	content = replaceYearToDateBudgetTypeVarianceData(content);
	content = replaceYearToDateBudgetTypeVarianceDataPercent(content);

	content = replaceYearToDateLastYearData(content);
	content = replaceYearToDateLastYearChangeData(content);
	content = replaceYearToDateLastYearChangeDataPercent(content);

//	if(errorMessage.length > 1)
//	var messagelength = errorMessage.length
//	{
//		content = '<script type="text/javascript">alert(\'' + errorMessage.encodeHTML() + '\');</script>';
//	}

		//content = '<script type="text/javascript">alert();</script>';
		
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
	var currentMonthName = '';
	cssCode = 'tr{mso-height-source:auto}col{mso-width-source:auto}br{mso-data-placement:same-cell}.style852{background:#DCE6F1;mso-pattern:black none;color:black;font-size:12.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Calibri,sans-serif;mso-font-charset:0;mso-style-name:\"20% - Accent1\";mso-style-id:30}.style773{background:#EBF1DE;mso-pattern:black none;color:black;font-size:12.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Calibri,sans-serif;mso-font-charset:0;mso-style-name:\"20% - Accent3\";mso-style-id:38}.style0{mso-number-format:General;text-align:general;vertical-align:bottom;white-space:nowrap;mso-rotate:0;mso-background-source:auto;mso-pattern:auto;color:windowtext;font-size:10.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Verdana;mso-generic-font-family:auto;mso-font-charset:0;border:none;mso-protection:locked visible;mso-style-name:Normal;mso-style-id:0}.style16{mso-number-format:0%;mso-style-name:Percent;mso-style-id:5}td{mso-style-parent:style0;padding-top:1px;padding-right:1px;padding-left:1px;mso-ignore:padding;color:windowtext;font-size:10.0pt;font-weight:400;font-style:normal;text-decoration:none;font-family:Verdana;mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:General;text-align:general;vertical-align:bottom;border:none;mso-background-source:auto;mso-pattern:auto;mso-protection:locked visible;white-space:nowrap;mso-rotate:0}.xl65{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0}.xl66{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\"}.xl67{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;padding-left:12px;mso-char-indent-count:1}.xl68{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";vertical-align:middle}.xl69{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0}.xl70{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"_\\(* \\#\\,\\#\\#0_\\)\\;_\\(* \\\\\\(\\#\\,\\#\\#0\\\\\\)\\;_\\(* \\0022-\\0022_\\)\\;_\\(\\@_\\)\"}.xl71{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\"}.xl72{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl73{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\"}.xl74{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl75{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl76{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\"}.xl77{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\"}.xl78{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl79{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;padding-left:12px;mso-char-indent-count:1}.xl80{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext}.xl81{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl82{mso-style-parent:style16;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl83{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl84{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\"}.xl85{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0\\.0\"}.xl86{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl87{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl88{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";text-align:left;vertical-align:middle}.xl89{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl90{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";vertical-align:middle}.xl91{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:Standard;vertical-align:middle}.xl92{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl93{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";;vertical-align:middle}.xl94{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl95{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:0%;text-align:left;vertical-align:middle}.xl96{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle}.xl97{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\[Red\\]\\\\\\(0\\\\\\)%\";text-align:left;vertical-align:middle}.xl98{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle}.xl99{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl100{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl101{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl102{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\"}.xl103{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#EBF1DE;mso-pattern:black none}.xl104{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#EBF1DE;mso-pattern:black none}.xl105{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle}.xl106{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl107{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#DCE6F1;mso-pattern:black none}.xl108{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl109{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl110{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#DCE6F1;mso-pattern:black none}.xl111{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl112{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl113{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;background:#D9D9D9;mso-pattern:black none}.xl114{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";background:#D9D9D9;mso-pattern:black none}.xl115{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl116{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left}.xl117{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl118{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"_\\(* \\#\\,\\#\\#0_\\)\\;_\\(* \\\\\\(\\#\\,\\#\\#0\\\\\\)\\;_\\(* \\0022-\\0022_\\)\\;_\\(\\@_\\)\";text-align:left}.xl119{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\";text-align:left}.xl120{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;background:#D9D9D9;mso-pattern:black none}.xl121{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left}.xl122{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl123{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_\\)\\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl124{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00000\\;\\[Red\\]\\#\\,\\#\\#0\\.00000\";vertical-align:middle}.xl125{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl126{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl127{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:center;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl128{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl129{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl130{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl131{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl132{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl133{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext}.xl134{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl135{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl136{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl137{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl138{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl139{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#D9D9D9;mso-pattern:black none}.xl140{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl141{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\\\-\\#\\,\\#\\#0\\.00\";background:#D9D9D9;mso-pattern:black none}.xl142{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:.5pt solid silver;border-left:none}.xl143{mso-style-parent:style0;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\\\\\)\";border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none}.xl144{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.00\\;\\[Red\\]\\#\\,\\#\\#0\\.00\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl145{mso-style-parent:style0;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext}.xl146{mso-style-parent:style16;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:0%}.xl147{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl148{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl149{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl150{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle}.xl151{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle}.xl152{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl153{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle}.xl154{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle}.xl155{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl156{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl157{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;background:#605B7D;mso-pattern:black none}.xl158{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl159{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl160{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl161{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl162{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl163{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl164{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl165{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl166{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl167{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl168{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl169{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl170{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl171{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl172{mso-style-parent:style773;color:red;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl173{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl174{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl175{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl176{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none}.xl177{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:center;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl178{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl179{mso-style-parent:style0;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl180{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl181{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl182{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl183{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl184{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl185{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl186{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl187{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl188{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl189{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl190{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl191{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"mmm\\\\-yy\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl192{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"mmm\\\\-yy\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl193{mso-style-parent:style0;color:white;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl194{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl195{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl196{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl197{mso-style-parent:style0;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl198{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl199{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl200{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl201{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl202{mso-style-parent:style0;color:#666699;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:1.0pt solid windowtext}.xl203{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl204{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl205{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:none}.xl206{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl207{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0\\.0%\\;\\\\\\(0\\.0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl208{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl209{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl210{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl211{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl212{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl213{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl214{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl215{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl216{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl217{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl218{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl219{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl220{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl221{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl222{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl223{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl224{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl225{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl226{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\\.00\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl227{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl228{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl229{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#605B7D;mso-pattern:black none}.xl230{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl231{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl232{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\0022£\\0022\\#\\,\\#\\#0\";text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl233{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl234{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl235{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl236{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl237{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl238{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:none;border-bottom:1.0pt solid windowtext;border-left:.5pt solid windowtext;background:#605B7D;mso-pattern:black none}.xl239{mso-style-parent:style0;color:white;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:1.0pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#605B7D;mso-pattern:black none}.xl240{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl241{mso-style-parent:style0;font-size:12.0pt;font-weight:700;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:1.0pt solid windowtext}.xl242{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl243{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl244{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl245{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl246{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl247{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";text-align:left;vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl248{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:none;border-bottom:none;border-left:none}.xl249{mso-style-parent:style773;color:black;font-size:12.0pt;font-weight:700;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:1.0pt solid windowtext;border-bottom:none;border-left:none}.xl250{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:.5pt solid windowtext;border-right:.5pt solid windowtext;border-bottom:none;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl251{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;text-align:left;vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:1.0pt solid windowtext}.xl252{mso-style-parent:style0;color:#666699;font-size:12.0pt;font-style:italic;font-family:\"Univers 55\";mso-generic-font-family:auto;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:1.0pt solid windowtext}.xl253{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#DCE6F1;mso-pattern:black none}.xl254{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl255{mso-style-parent:style852;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl256{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:.5pt solid windowtext;background:#EBF1DE;mso-pattern:black none}.xl257{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl258{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}.xl259{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"0%\\;\\\\\\(0\\\\\\)%\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl260{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:none;border-bottom:.5pt solid windowtext;border-left:none}.xl261{mso-style-parent:style773;color:black;font-size:12.0pt;font-family:Calibri,sans-serif;mso-font-charset:0;mso-number-format:\"\\#\\,\\#\\#0\\.0_ \\;\\[Red\\]\\\\\\(\\#\\,\\#\\#0\\.0\\\\\\)\";vertical-align:middle;border-top:none;border-right:1.0pt solid windowtext;border-bottom:.5pt solid windowtext;border-left:none}.xl262{mso-style-parent:style852;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#DCE6F1;mso-pattern:black none}.xl263{mso-style-parent:style773;color:black;font-style:italic;font-family:Calibri,sans-serif;mso-font-charset:0;vertical-align:middle;border-top:none;border-right:.5pt solid windowtext;border-bottom:1.0pt solid windowtext;border-left:none;background:#EBF1DE;mso-pattern:black none}';
	content = '<style type="text/css">' + cssCode + '</style>';

	today = new Date();
	currentMonth = today.getMonth()+1;
	currentDate = today.getDate();
	currentYear = today.getFullYear();
	currentMonthName = getMonthName(currentMonth);

	currentFullDate = currentDate + ' ' + currentMonthName + ' ' +currentYear ;

	//Set the HTML Table with hash tag placeholders within it
	//Please note that in order for this file to make sense, you MUST have the Storytellers Management Account Spread Sheet in hand.
	content += "<table border=0 cellpadding=0 cellspacing=0 width=1899 style='border-collapse: collapse;table-layout:fixed;width:1431pt'> <col class=xl65 width=496 style='mso-width-source:userset;mso-width-alt:15872; width:372pt'> <col class=xl65 width=13 style='mso-width-source:userset;mso-width-alt:416; width:10pt'> <col class=xl65 width=13 style='mso-width-source:userset;mso-width-alt:416;width:10pt'> <col class=xl65 width=17 style='mso-width-source:userset;mso-width-alt:544;width:13pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'> <col class=xl70 width=60 style='mso-width-source:userset;mso-width-alt:1920;width:45pt'> <col class=xl71 width=64 style='mso-width-source:userset;mso-width-alt:2048;width:48pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'> <col class=xl65 width=126 style='mso-width-source:userset;mso-width-alt:4032;width:95pt'> <col class=xl113 width=64 style='mso-width-source:userset;mso-width-alt:2048;width:48pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'> <col class=xl66 width=57 style='mso-width-source:userset;mso-width-alt:1824;width:43pt'> <col class=xl65 width=60 style='mso-width-source:userset;mso-width-alt:1920;width:45pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'> <col class=xl65 width=30 style='mso-width-source:userset;mso-width-alt:960;width:23pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'> <col class=xl65 width=59 style='mso-width-source:userset;mso-width-alt:1888;width:44pt'> <col class=xl65 width=64 style='mso-width-source:userset;mso-width-alt:2048;width:48pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856 width:44pt'> <col class=xl65 width=126 style='mso-width-source:userset;mso-width-alt:4032;width:95pt'> <col class=xl113 width=64 style='mso-width-source:userset;mso-width-alt:2048;width:48pt'> <col class=xl65 width=58 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'> <col class=xl65 width=62 style='mso-width-source:userset;mso-width-alt:1984;width:47pt'> <col class=xl65 width=60 style='mso-width-source:userset;mso-width-alt:1920;width:45pt'> <col class=xl65 width=58 span=2 style='mso-width-source:userset;mso-width-alt:1856;width:44pt'>";
	content += "<tr height=17 style='height:12.75pt'><td height=17 class=xl65 width=496 style='height:12.75pt;width:372pt'></td> <td class=xl65 width=13 style='width:10pt'></td><td class=xl65 width=13 style='width:10pt'></td> <td class=xl65 width=17 style='width:13pt'></td>  <td class=xl65 width=58 style='width:44pt'></td>  <td class=xl70 width=60 style='width:45pt'></td>  <td class=xl71 width=64 style='width:48pt'></td>  <td class=xl65 width=58 style='width:44pt'></td>  <td class=xl65 width=126 style='width:95pt'></td>  <td class=xl65 width=64 style='width:48pt'></td>  <td class=xl65 width=58 style='width:44pt'></td>  <td class=xl66 width=57 style='width:43pt'></td>  <td class=xl65 width=60 style='width:45pt'></td>  <td class=xl65 width=58 style='width:44pt'></td>  <td class=xl65 width=30 style='width:23pt'></td>  <td class=xl65 width=58 style='width:44pt'></td>  <td class=xl65 width=59 style='width:44pt'></td>  <td class=xl65 width=64 style='width:48pt'></td><td class=xl65 width=58 style='width:44pt'></td>  <td class=xl65 width=126 style='width:95pt'></td>  <td class=xl65 width=64 style='width:48pt'></td>  <td class=xl65 width=58 style='width:44pt'></td>  <td class=xl65 width=62 style='width:47pt'></td>  <td class=xl65 width=60 style='width:45pt'></td>  <td class=xl65 width=58 style='width:44pt'></td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl69 style='height:12.75pt'>THE STORYTELLERS LIMITED</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl70></td>  <td class=xl71></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl66></td>  <td class=xl65></td>  <td class=xl65></td> <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td></tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl69 style='height:12.75pt'>MANAGEMENT ACCOUNTS MONTHLY REPORT - ##MONTHLYDATERANGE##</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl70></td>  <td class=xl71></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl66></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl65 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl70></td>  <td class=xl71></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl66></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td> </tr>";
	content += "<tr class=xl69 height=17 style='height:12.75pt'>  <td height=17 class=xl69 style='height:12.75pt'></td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl69></td>  <td colspan=10 class=xl125 style='border-right:.5pt solid black'>##DATERANGENAME##</td>  <td class=xl69></td>  <td colspan=10 class=xl128 style='border-right:.5pt solid black'>Year -to -Date</td> </tr>";
	content += "<tr class=xl116 height=17 style='height:12.75pt'>  <td height=17 class=xl116 style='height:12.75pt'></td>  <td class=xl116></td>  <td class=xl116></td>  <td class=xl116></td>  <td class=xl117>Actual</td>  <td class=xl118><span style='mso-spacerun:yes'></span>Budget<span style='mso-spacerun:yes'></span></td>  <td class=xl119>Variance</td>  <td class=xl116>%</td>  <td class=xl116>##BUDGETNAME##</td>  <td class=xl120>Variance</td>  <td class=xl116>%</td>  <td class=xl121>PY</td>  <td class=xl116>Change<span style='mso-spacerun:yes'></span></td>  <td class=xl122>%</td>  <td class=xl116></td>  <td class=xl117>Actual</td>  <td class=xl116>Budget</td>  <td class=xl116>Variance</td>  <td class=xl116>%</td>  <td class=xl116>##BUDGETNAME##</td>  <td class=xl120>Variance</td>  <td class=xl116>%</td>  <td class=xl116>PY</td>  <td class=xl116>Change<span style='mso-spacerun:yes'></span></td><td class=xl122>%</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl65 style='height:12.75pt'></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl72>&nbsp;</td>  <td class=xl70></td>  <td class=xl71></td>  <td class=xl73></td>  <td class=xl73></td><td class=xl73></td>  <td class=xl73></td>  <td class=xl66></td>  <td class=xl66></td>  <td class=xl74>&nbsp;</td>  <td class=xl65></td>  <td class=xl72>&nbsp;</td>  <td class=xl65></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl74>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl68 style='height:12.75pt'>PROGRAMME FEES</td>  <td class=xl65></td><td class=xl65></td>  <td class=xl76></td>  <td class=xl75>##E8##</td>  <td class=xl76>##F8##</td><td class=xl76>##G8##</td>  <td class=xl76>##H8##</td>  <td class=xl76>##I8##</td>  <td class=xl114>##J8##</td><td class=xl76>##K8##</td>  <td class=xl76>##L8##</td>  <td class=xl76>##M8##</td>  <td class=xl131>##N8##</td>  <td class=xl65></td>  <td class=xl75>##P8##</td>  <td class=xl76>##Q8##</td>  <td class=xl76>##R8##</td><td class=xl76>##S8##</td>  <td class=xl76>##T8##</td>  <td class=xl114>##U8##</td>  <td class=xl76>##V8##</td>  <td class=xl76>##W8##</td>  <td class=xl76>##X8##</td><td class=xl131>##Y8##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Film &amp; production</td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E9##</td>  <td class=xl76>##F9##</td>  <td class=xl76>##G9##</td>  <td class=xl76>##H9##</td>  <td class=xl76>##I9##</td><td class=xl114>##J9##</td>  <td class=xl76>##K9##</td>  <td class=xl76>##L9##</td>  <td class=xl76>##M9##</td>  <td class=xl131>##N9##</td>  <td class=xl65></td>  <td class=xl75>##P9##</td>  <td class=xl76>##Q9##</td><td class=xl76>##R9##</td>  <td class=xl76>##S9##</td>  <td class=xl76>##T9##</td>  <td class=xl114>##U9##</td>  <td class=xl76>##V9##</td>  <td class=xl76>##W9##</td>  <td class=xl76>##X9##</td>  <td class=xl131>##Y9##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>StoryWeb</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E10##</td>  <td class=xl76>##F10##</td>  <td class=xl76>##G10##</td>  <td class=xl76>##H10##</td>  <td class=xl76>##I10##</td>  <td class=xl114>##J10##</td>  <td class=xl76>##K10##</td>  <td class=xl76>##L10##</td>  <td class=xl76>##M10##</td><td class=xl131>##N10##</td>  <td class=xl65></td>  <td class=xl75>##P10##</td>  <td class=xl76>##Q10##</td>  <td class=xl76>##R10##</td>  <td class=xl76>##S10##</td>  <td class=xl76>##T10##</td>  <td class=xl114>##U10##</td>  <td class=xl76>##V10##</td>  <td class=xl76>##W10##</td>  <td class=xl76>##X10##</td>  <td class=xl131>##Y10##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>TS Workshops</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E11##</td><td class=xl76>##F11##</td>  <td class=xl76>##G11##</td>  <td class=xl76>##H11##</td>  <td class=xl76>##I11##</td>  <td class=xl114>##J11##</td>  <td class=xl76>##K11##</td>  <td class=xl76>##L11##</td>  <td class=xl76>##M11##</td>  <td class=xl131>##N11##</td><td class=xl65></td>  <td class=xl75>##P11##</td>  <td class=xl76>##Q11##</td>  <td class=xl76>##R11##</td>  <td class=xl76>##S11##</td>  <td class=xl76>##T11##</td>  <td class=xl114>##U11##</td>  <td class=xl76>##V11##</td><td class=xl76>##W11##</td>  <td class=xl76>##X11##</td>  <td class=xl131>##Y11##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Lavery room</td><td class=xl65></td>  <td class=xl65></td>  <td class=xl76></td><td class=xl75>##E12##</td>  <td class=xl76>##F12##</td>  <td class=xl76>##G12##</td>  <td class=xl76>##H12##</td>  <td class=xl76>##I12##</td> <td class=xl114>##J12##</td><td class=xl76>##K12##</td>  <td class=xl76>##L12##</td> <td class=xl76>##M12##</td>  <td class=xl131>##N12##</td>  <td class=xl65></td>  <td class=xl75>##P12##</td>  <td class=xl76>##Q12##</td>  <td class=xl76>##R12##</td>  <td class=xl76>##S12##</td>  <td class=xl76>##T12##</td><td class=xl114>##U12##</td>  <td class=xl76>##V12##</td>  <td class=xl76>##W12##</td>  <td class=xl76>##X12##</td>  <td class=xl131>##Y12##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Travel</td><td class=xl65></td>  <td class=xl65></td>  <td class=xl76></td>  <td class=xl75>##E13##</td>  <td class=xl76>##F13##</td>  <td class=xl76>##G13##</td><td class=xl76>##H13##</td>  <td class=xl76>##I13##</td>  <td class=xl114>##J13##</td>  <td class=xl76>##K13##</td>  <td class=xl76>##L13##</td>  <td class=xl76>##M13##</td><td class=xl131>##N13##</td>  <td class=xl65></td>  <td class=xl75>##P13##</td>  <td class=xl76>##Q13##</td><td class=xl76>##R13##</td>  <td class=xl76>##S13##</td>  <td class=xl76>##T13##</td>  <td class=xl114>##U13##</td><td class=xl76>##V13##</td>  <td class=xl76>##W13##</td>  <td class=xl76>##X13##</td>  <td class=xl131>##Y13##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Currency</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E14##</td>  <td class=xl76>##F14##</td>  <td class=xl76>##G14##</td>  <td class=xl76>##H14##</td>  <td class=xl76>##I14##</td>  <td class=xl114>##J14##</td>  <td class=xl76>##K14##</td><td class=xl76>##L14##</td>  <td class=xl76>##M14##</td>  <td class=xl131>##N14##</td>  <td class=xl65></td>  <td class=xl75>##P14##</td>  <td class=xl76>##Q14##</td>  <td class=xl76>##R14##</td>  <td class=xl76>##S14##</td>  <td class=xl76>##T14##</td>  <td class=xl114>##U14##</td><td class=xl76>##V14##</td>  <td class=xl76>##W14##</td>  <td class=xl76>##X14##</td>  <td class=xl131>##Y14##</td> </tr>";
	content += "<tr height=21 style='height:15.75pt'>  <td height=21 class=xl102 style='height:15.75pt'></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td><td class=xl77></td>  <td class=xl76></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td><td class=xl76></td>  <td class=xl77></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td><td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td><td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td><td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td><td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl90 style='height:12.75pt'>COST OF SALES<span style='mso-spacerun:yes'></span></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl73></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl131>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td><td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td><td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Freelance staff</td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E18##</td>  <td class=xl76>##F18##</td>  <td class=xl76>##G18##</td>  <td class=xl76>##H18##</td>  <td class=xl76>##I18##</td><td class=xl114>##J18##</td>  <td class=xl76>##K18##</td>  <td class=xl76>##L18##</td>  <td class=xl76>##M18##</td><td class=xl131>##N18##</td>  <td class=xl65></td>  <td class=xl75>##P18##</td>  <td class=xl76>##Q18##</td>  <td class=xl76>##R18##</td>  <td class=xl76>##S18##</td><td class=xl76>##T18##</td>  <td class=xl114>##U18##</td>  <td class=xl76>##V18##</td>  <td class=xl76>##W18##</td><td class=xl76>##X18##</td>  <td class=xl131>##Y18##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Freelance staff -Delivery</td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E19##</td>  <td class=xl76>##F19##</td>  <td class=xl76>##G19##</td>  <td class=xl76>##H19##</td>  <td class=xl76>##I19##</td>  <td class=xl114>##J19##</td>  <td class=xl76>##K19##</td>  <td class=xl76>##L19##</td>  <td class=xl76>##M19##</td>  <td class=xl131>##N19##</td><td class=xl65></td>  <td class=xl75>##P19##</td>  <td class=xl76>##Q19##</td>  <td class=xl76>##R19##</td>  <td class=xl76>##S19##</td>  <td class=xl76>##T19##</td>  <td class=xl114>##U19##</td>  <td class=xl76>##V19##</td>  <td class=xl76>##W19##</td>  <td class=xl76>##X19##</td>  <td class=xl131>##Y19##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>External design -Storyfactory</td>  <td class=xl65></td><td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E20##</td>  <td class=xl76>##F20##</td>  <td class=xl76>##G20##</td>  <td class=xl76>##H20##</td><td class=xl76>##I20##</td>  <td class=xl114>##J20##</td>  <td class=xl76>##K20##</td>  <td class=xl76>##L20##</td><td class=xl76>##M20##</td>  <td class=xl131>##N20##</td>  <td class=xl65></td>  <td class=xl75>##P20##</td><td class=xl76>##Q20##</td>  <td class=xl76>##R20##</td>  <td class=xl76>##S20##</td>  <td class=xl76>##T20##</td><td class=xl114>##U20##</td>  <td class=xl76>##V20##</td>  <td class=xl76>##W20##</td>  <td class=xl76>##X20##</td><td class=xl131>##Y20##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Sales Commission</td><td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E21##</td>  <td class=xl76>##F21##</td>  <td class=xl76>##G21##</td>  <td class=xl76>##H21##</td>  <td class=xl76>##I21##</td>  <td class=xl114>##J21##</td><td class=xl76>##K21##</td>  <td class=xl76>##L21##</td>  <td class=xl76>##M21##</td>  <td class=xl131>##N21##</td>  <td class=xl65></td>  <td class=xl75>##P21##</td>  <td class=xl76>##Q21##</td><td class=xl76>##R21##</td>  <td class=xl76>##S21##</td>  <td class=xl76>##T21##</td>  <td class=xl114>##U21##</td><td class=xl76>##V21##</td>  <td class=xl76>##W21##</td>  <td class=xl76>##X21##</td>  <td class=xl131>##Y21##</td></tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Storyweb</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E22##</td>  <td class=xl76>##F22##</td>  <td class=xl76>##G22##</td>  <td class=xl76>##H22##</td>  <td class=xl76>##I22##</td>  <td class=xl114>##J22##</td>  <td class=xl76>##K22##</td>  <td class=xl76>##L22##</td>  <td class=xl76>##M22##</td>  <td class=xl131>##N22##</td>  <td class=xl65></td>  <td class=xl75>##P22##</td>  <td class=xl76>##Q22##</td>  <td class=xl76>##R22##</td>  <td class=xl76>##S22##</td>  <td class=xl76>##T22##</td>  <td class=xl114>##U22##</td>  <td class=xl76>##V22##</td>  <td class=xl76>##W22##</td>  <td class=xl76>##X22##</td>  <td class=xl131>##Y22##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Printing</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E23##</td>  <td class=xl76>##F23##</td>  <td class=xl76>##G23##</td>  <td class=xl76>##H23##</td>  <td class=xl76>##I23##</td>  <td class=xl114>##J23##</td>  <td class=xl76>##K23##</td>  <td class=xl76>##L23##</td>  <td class=xl76>##M23##</td>  <td class=xl131>##N23##</td>  <td class=xl65></td>  <td class=xl75>##P23##</td>  <td class=xl76>##Q23##</td>  <td class=xl76>##R23##</td>  <td class=xl76>##S23##</td>  <td class=xl76>##T23##</td>  <td class=xl114>##U23##</td>  <td class=xl76>##V23##</td>  <td class=xl76>##W23##</td>  <td class=xl76>##X23##</td>  <td class=xl131>##Y23##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Film/video</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E24##</td>  <td class=xl76>##F24##</td>  <td class=xl76>##G24##</td>  <td class=xl76>##H24##</td>  <td class=xl76>##I24##</td>  <td class=xl114>##J24##</td>  <td class=xl76>##K24##</td>  <td class=xl76>##L24##</td>  <td class=xl76>##M24##</td>  <td class=xl131>##N24##</td>  <td class=xl65></td>  <td class=xl75>##P24##</td>  <td class=xl76>##Q24##</td>  <td class=xl76>##R24##</td>  <td class=xl76>##S24##</td>  <td class=xl76>##T24##</td>  <td class=xl114>##U24##</td>  <td class=xl76>##V24##</td>  <td class=xl76>##W24##</td>  <td class=xl76>##X24##</td>  <td class=xl131>##Y24##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Other</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E25##</td>  <td class=xl76>##F25##</td>  <td class=xl76>##G25##</td>  <td class=xl76>##H25##</td>  <td class=xl76>##I25##</td>  <td class=xl114>##J25##</td>  <td class=xl76>##K25##</td>  <td class=xl76>##L25##</td>  <td class=xl76>##M25##</td>  <td class=xl131>##N25##</td>  <td class=xl65></td>  <td class=xl75>##P25##</td>  <td class=xl76>##Q25##</td>  <td class=xl76>##R25##</td>  <td class=xl76>##S25##</td>  <td class=xl76>##T25##</td>  <td class=xl114>##U25##</td>  <td class=xl76>##V25##</td>  <td class=xl76>##W25##</td>  <td class=xl76>##X25##</td>  <td class=xl131>##Y25##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>TS Workshops</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E26##</td>  <td class=xl76>##F26##</td>  <td class=xl76>##G26##</td>  <td class=xl76>##H26##</td>  <td class=xl76>##I26##</td>  <td class=xl114>##J26##</td>  <td class=xl76>##K26##</td>  <td class=xl76>##L26##</td>  <td class=xl76>##M26##</td>  <td class=xl131>##N26##</td>  <td class=xl65></td>  <td class=xl75>##P26##</td>  <td class=xl76>##Q26##</td>  <td class=xl76>##R26##</td>  <td class=xl76>##S26##</td>  <td class=xl76>##T26##</td>  <td class=xl114>##U26##</td>  <td class=xl76>##V26##</td>  <td class=xl76>##W26##</td>  <td class=xl76>##X26##</td>  <td class=xl131>##Y26##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Lavery Room</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E27##</td>  <td class=xl76>##F27##</td>  <td class=xl76>##G27##</td>  <td class=xl76>##H27##</td>  <td class=xl76>##I27##</td>  <td class=xl114>##J27##</td>  <td class=xl76>##K27##</td>  <td class=xl76>##L27##</td>  <td class=xl76>##M27##</td>  <td class=xl131>##N27##</td>  <td class=xl65></td>  <td class=xl75>##P27##</td>  <td class=xl76>##Q27##</td>  <td class=xl76>##R27##</td>  <td class=xl76>##S27##</td>  <td class=xl76>##T27##</td>  <td class=xl114>##U27##</td>  <td class=xl76>##V27##</td>  <td class=xl76>##W27##</td>  <td class=xl76>##X27##</td>  <td class=xl131>##Y27##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Travel</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E28##</td>  <td class=xl76>##F28##</td>  <td class=xl76>##G28##</td>  <td class=xl76>##H28##</td>  <td class=xl76>##I28##</td>  <td class=xl114>##J28##</td>  <td class=xl76>##K28##</td>  <td class=xl76>##L28##</td>  <td class=xl76>##M28##</td>  <td class=xl131>##N28##</td>  <td class=xl65></td>  <td class=xl75>##P28##</td>  <td class=xl76>##Q28##</td>  <td class=xl76>##R28##</td>  <td class=xl76>##S28##</td>  <td class=xl76>##T28##</td>  <td class=xl114>##U28##</td>  <td class=xl76>##V28##</td>  <td class=xl76>##W28##</td>  <td class=xl76>##X28##</td>  <td class=xl131>##Y28##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl144>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl90 style='height:12.75pt'>SALARY COSTS</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Salaries</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E31##</td>  <td class=xl76>##F31##</td>  <td class=xl76>##G31##</td>  <td class=xl76>##H31##</td>  <td class=xl76>##I31##</td>  <td class=xl114>##J31##</td>  <td class=xl76>##K31##</td>  <td class=xl76>##L31##</td>  <td class=xl76>##M31##</td>  <td class=xl131>##N31##</td>  <td class=xl65></td>  <td class=xl75>##P31##</td>  <td class=xl76>##Q31##</td>  <td class=xl76>##R31##</td>  <td class=xl76>##S31##</td>  <td class=xl76>##T31##</td>  <td class=xl114>##U31##</td>  <td class=xl76>##V31##</td>  <td class=xl76>##W31##</td>  <td class=xl76>##X31##</td>  <td class=xl131>##Y31##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Er's NIC &amp; Pension Contributions</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E32##</td>  <td class=xl76>##F32##</td>  <td class=xl76>##G32##</td>  <td class=xl76>##H32##</td>  <td class=xl76>##I32##</td>  <td class=xl114>##J32##</td>  <td class=xl76>##K32##</td>  <td class=xl76>##L32##</td>  <td class=xl76>##M32##</td>  <td class=xl131>##N32##</td>  <td class=xl65></td>  <td class=xl75>##P32##</td>  <td class=xl76>##Q32##</td>  <td class=xl76>##R32##</td>  <td class=xl76>##S32##</td>  <td class=xl76>##T32##</td>  <td class=xl114>##U32##</td>  <td class=xl76>##V32##</td>  <td class=xl76>##W32##</td>  <td class=xl76>##X32##</td>  <td class=xl131>##Y32##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Freelance Staff</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E33##</td>  <td class=xl76>##F33##</td>  <td class=xl76>##G33##</td>  <td class=xl76>##H33##</td>  <td class=xl76>##I33##</td>  <td class=xl114>##J33##</td>  <td class=xl76>##K33##</td>  <td class=xl76>##L33##</td>  <td class=xl76>##M33##</td>  <td class=xl131>##N33##</td>  <td class=xl65></td>  <td class=xl75>##P33##</td>  <td class=xl76>##Q33##</td>  <td class=xl76>##R33##</td>  <td class=xl76>##S33##</td>  <td class=xl76>##T33##</td>  <td class=xl114>##U33##</td>  <td class=xl76>##V33##</td>  <td class=xl76>##W33##</td>  <td class=xl76>##X33##</td>  <td class=xl131>##Y33##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Redundancy</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E34##</td>  <td class=xl76>##F34##</td>  <td class=xl76>##G34##</td>  <td class=xl76>##H34##</td>  <td class=xl76>##I34##</td>  <td class=xl114>##J34##</td>  <td class=xl76>##K34##</td>  <td class=xl76>##L34##</td>  <td class=xl76>##M34##</td>  <td class=xl131>##N34##</td>  <td class=xl65></td>  <td class=xl75>##P34##</td>  <td class=xl76>##Q34##</td>  <td class=xl76>##R34##</td>  <td class=xl76>##S34##</td>  <td class=xl76>##T34##</td>  <td class=xl114>##U34##</td>  <td class=xl76>##V34##</td>  <td class=xl76>##W34##</td>  <td class=xl76>##X34##</td>  <td class=xl131>##Y34##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>CPD</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E35##</td>  <td class=xl76>##F35##</td>  <td class=xl76>##G35##</td>  <td class=xl76>##H35##</td>  <td class=xl76>##I35##</td>  <td class=xl114>##J35##</td>  <td class=xl76>##K35##</td>  <td class=xl76>##L35##</td>  <td class=xl76>##M35##</td>  <td class=xl131>##N35##</td>  <td class=xl65></td>  <td class=xl75>##P35##</td>  <td class=xl76>##Q35##</td>  <td class=xl76>##R35##</td>  <td class=xl76>##S35##</td>  <td class=xl76>##T35##</td>  <td class=xl114>##U35##</td>  <td class=xl76>##V35##</td>  <td class=xl76>##W35##</td>  <td class=xl76>##X35##</td>  <td class=xl131>##Y35##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Non-rechargeable travel/subs/expenses<span style='mso-spacerun:yes'></span></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E36##</td>  <td class=xl76>##F36##</td>  <td class=xl76>##G36##</td>  <td class=xl76>##H36##</td>  <td class=xl76>##I36##</td>  <td class=xl114>##J36##</td>  <td class=xl76>##K36##</td>  <td class=xl76>##L36##</td>  <td class=xl76>##M36##</td>  <td class=xl131>##N36##</td>  <td class=xl65></td>  <td class=xl75>##P36##</td>  <td class=xl76>##Q36##</td>  <td class=xl76>##R36##</td>  <td class=xl76>##S36##</td>  <td class=xl76>##T36##</td>  <td class=xl114>##U36##</td>  <td class=xl76>##V36##</td>  <td class=xl76>##W36##</td>  <td class=xl76>##X36##</td>  <td class=xl131>##Y36##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>IT Charge</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E37##</td>  <td class=xl76>##F37##</td>  <td class=xl76>##G37##</td>  <td class=xl76>##H37##</td>  <td class=xl76>##I37##</td>  <td class=xl114>##J37##</td>  <td class=xl76>##K37##</td>  <td class=xl76>##L37##</td>  <td class=xl76>##M37##</td>  <td class=xl131>##N37##</td>  <td class=xl65></td>  <td class=xl75>##P37##</td>  <td class=xl76>##Q37##</td>  <td class=xl76>##R37##</td>  <td class=xl76>##S37##</td>  <td class=xl76>##T37##</td>  <td class=xl114>##U37##</td>  <td class=xl76>##V37##</td>  <td class=xl76>##W37##</td>  <td class=xl76>##X37##</td>  <td class=xl131>##Y37##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Professional Services</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E38##</td>  <td class=xl76>##F38##</td>  <td class=xl76>##G38##</td>  <td class=xl76>##H38##</td>  <td class=xl76>##I38##</td>  <td class=xl114>##J38##</td>  <td class=xl76>##K38##</td>  <td class=xl76>##L38##</td>  <td class=xl76>##M38##</td>  <td class=xl131>##N38##</td>  <td class=xl65></td>  <td class=xl75>##P38##</td>  <td class=xl76>##Q38##</td>  <td class=xl76>##R38##</td>  <td class=xl76>##S38##</td>  <td class=xl76>##T38##</td>  <td class=xl114>##U38##</td>  <td class=xl76>##V38##</td>  <td class=xl76>##W38##</td>  <td class=xl76>##X38##</td>  <td class=xl131>##Y38##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Staff entertaining</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E39##</td>  <td class=xl76>##F39##</td>  <td class=xl76>##G39##</td>  <td class=xl76>##H39##</td>  <td class=xl76>##I39##</td>  <td class=xl114>##J39##</td>  <td class=xl76>##K39##</td>  <td class=xl76>##L39##</td>  <td class=xl76>##M39##</td>  <td class=xl131>##N39##</td>  <td class=xl65></td>  <td class=xl75>##P39##</td>  <td class=xl76>##Q39##</td>  <td class=xl76>##R39##</td>  <td class=xl76>##S39##</td>  <td class=xl76>##T39##</td>  <td class=xl114>##U39##</td>  <td class=xl76>##V39##</td>  <td class=xl76>##W39##</td>  <td class=xl76>##X39##</td>  <td class=xl131>##Y39##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl79 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl90 style='height:12.75pt'>SPACE</td>  <td class=xl65></td> <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl65></td>  <td class=xl73></td>  <t class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'><span style='mso-spacerun:yes'></span>Rent</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E42##</td>  <td class=xl76>##F42##</td>  <td class=xl76>##G42##</td>  <td class=xl76>##H42##</td>  <td class=xl76>##I42##</td>  <td class=xl114>##J42##</td>  <td class=xl76>##K42##</td>  <td class=xl76>##L42##</td>  <td class=xl76>##M42##</td>  <td class=xl131>##N42##</td>  <td class=xl65></td>  <td class=xl75>##P42##</td>  <td class=xl76>##Q42##</td>  <td class=xl76>##R42##</td>  <td class=xl76>##S42##</td>  <td class=xl76>##T42##</td>  <td class=xl114>##U42##</td>  <td class=xl76>##V42##</td>  <td class=xl76>##W42##</td>  <td class=xl76>##X42##</td>  <td class=xl131>##Y42##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'><span style='mso-spacerun:yes'></span>Rates</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E43##</td>  <td class=xl76>##F43##</td>  <td class=xl76>##G43##</td>  <td class=xl76>##H43##</td>  <td class=xl76>##I43##</td>  <td class=xl114>##J43##</td>  <td class=xl76>##K43##</td>  <td class=xl76>##L43##</td>  <td class=xl76>##M43##</td>  <td class=xl131>##N43##</td>  <td class=xl65></td>  <td class=xl75>##P43##</td>  <td class=xl76>##Q43##</td>  <td class=xl76>##R43##</td>  <td class=xl76>##S43##</td>  <td class=xl76>##T43##</td>  <td class=xl114>##U43##</td>  <td class=xl76>##V43##</td>  <td class=xl76>##W43##</td>  <td class=xl76>##X43##</td>  <td class=xl131>##Y43##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'><span style='mso-spacerun:yes'></span>Water rates</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E44##</td>  <td class=xl76>##F44##</td>  <td class=xl76>##G44##</td>  <td class=xl76>##H44##</td>  <td class=xl76>##I44##</td>  <td class=xl114>##J44##</td>  <td class=xl76>##K44##</td>  <td class=xl76>##L44##</td>  <td class=xl76>##M44##</td>  <td class=xl131>##N44##</td>  <td class=xl65></td>  <td class=xl75>##P44##</td>  <td class=xl76>##Q44##</td>  <td class=xl76>##R44##</td>  <td class=xl76>##S44##</td>  <td class=xl76>##T44##</td>  <td class=xl114>##U44##</td>  <td class=xl76>##V44##</td>  <td class=xl76>##W44##</td>  <td class=xl76>##X44##</td>  <td class=xl131>##Y44##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Office Cleaning etc.</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E45##</td>  <td class=xl76>##F45##</td>  <td class=xl76>##G45##</td>  <td class=xl76>##H45##</td>  <td class=xl76>##I45##</td>  <td class=xl114>##J45##</td>  <td class=xl76>##K45##</td>  <td class=xl76>##L45##</td>  <td class=xl76>##M45##</td>  <td class=xl131>##N45##</td>  <td class=xl65></td>  <td class=xl75>##P45##</td>  <td class=xl76>##Q45##</td>  <td class=xl76>##R45##</td>  <td class=xl76>##S45##</td>  <td class=xl76>##T45##</td>  <td class=xl114>##U45##</td>  <td class=xl76>##V45##</td>  <td class=xl76>##W45##</td>  <td class=xl76>##X45##</td>  <td class=xl131>##Y45##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Insurance and estate charge</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E46##</td>  <td class=xl76>##F46##</td>  <td class=xl76>##G46##</td>  <td class=xl76>##H46##</td>  <td class=xl76>##I46##</td>  <td class=xl114>##J46##</td>  <td class=xl76>##K46##</td>  <td class=xl76>##L46##</td>  <td class=xl76>##M46##</td>  <td class=xl131>##N46##</td>  <td class=xl65></td>  <td class=xl75>##P46##</td>  <td class=xl76>##Q46##</td>  <td class=xl76>##R46##</td>  <td class=xl76>##S46##</td>  <td class=xl76>##T46##</td>  <td class=xl114>##U46##</td>  <td class=xl76>##V46##</td>  <td class=xl76>##W46##</td>  <td class=xl76>##X46##</td>  <td class=xl131>##Y46##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Repairs and Maintenance</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E47##</td>  <td class=xl76>##F47##</td>  <td class=xl76>##G47##</td>  <td class=xl76>##H47##</td>  <td class=xl76>##I47##</td>  <td class=xl114>##J47##</td>  <td class=xl76>##K47##</td>  <td class=xl76>##L47##</td>  <td class=xl76>##M47##</td>  <td class=xl131>##N47##</td>  <td class=xl65></td>  <td class=xl75>##P47##</td>  <td class=xl76>##Q47##</td>  <td class=xl76>##R47##</td>  <td class=xl76>##S47##</td>  <td class=xl76>##T47##</td>  <td class=xl114>##U47##</td>  <td class=xl76>##V47##</td>  <td class=xl76>##W47##</td>  <td class=xl76>##X47##</td>  <td class=xl131>##Y47##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Relocation Costs</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E48##</td>  <td class=xl76>##F48##</td>  <td class=xl76>##G48##</td>  <td class=xl76>##H48##</td>  <td class=xl76>##I48##</td>  <td class=xl114>##J48##</td>  <td class=xl76>##K48##</td>  <td class=xl76>##L48##</td>  <td class=xl76>##M48##</td>  <td class=xl131>##N48##</td>  <td class=xl65></td>  <td class=xl75>##P48##</td>  <td class=xl76>##Q48##</td>  <td class=xl76>##R48##</td>  <td class=xl76>##S48##</td>  <td class=xl76>##T48##</td>  <td class=xl114>##U48##</td>  <td class=xl76>##V48##</td>  <td class=xl76>##W48##</td>  <td class=xl76>##X48##</td>  <td class=xl131>##Y48##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl68 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl90 style='height:12.75pt'>OVERHEADS</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Print, post and stationery</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E51##</td>  <td class=xl76>##F51##</td>  <td class=xl76>##G51##</td>  <td class=xl76>##H51##</td>  <td class=xl76>##I51##</td>  <td class=xl114>##J51##</td>  <td class=xl76>##K51##</td>  <td class=xl76>##L51##</td>  <td class=xl76>##M51##</td>  <td class=xl131>##N51##</td>  <td class=xl65></td>  <td class=xl75>##P51##</td>  <td class=xl76>##Q51##</td>  <td class=xl76>##R51##</td>  <td class=xl76>##S51##</td>  <td class=xl76>##T51##</td>  <td class=xl114>##U51##</td>  <td class=xl76>##V51##</td>  <td class=xl76>##W51##</td>  <td class=xl76>##X51##</td>  <td class=xl131>##Y51##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Revised Internet Leased Line</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E52##</td>  <td class=xl76>##F52##</td>  <td class=xl76>##G52##</td>  <td class=xl76>##H52##</td>  <td class=xl76>##I52##</td>  <td class=xl114>##J52##</td>  <td class=xl76>##K52##</td>  <td class=xl76>##L52##</td>  <td class=xl76>##M52##</td>  <td class=xl131>##N52##</td>  <td class=xl65></td>  <td class=xl75>##P52##</td>  <td class=xl76>##Q52##</td>  <td class=xl76>##R52##</td>  <td class=xl76>##S52##</td>  <td class=xl76>##T52##</td>  <td class=xl114>##U52##</td>  <td class=xl76>##V52##</td>  <td class=xl76>##W52##</td>  <td class=xl76>##X52##</td>  <td class=xl131>##Y52##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Telephone System Leasing</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E53##</td>  <td class=xl76>##F53##</td>  <td class=xl76>##G53##</td>  <td class=xl76>##H53##</td>  <td class=xl76>##I53##</td>  <td class=xl114>##J53##</td>  <td class=xl76>##K53##</td>  <td class=xl76>##L53##</td>  <td class=xl76>##M53##</td>  <td class=xl131>##N53##</td>  <td class=xl65></td>  <td class=xl75>##P53##</td>  <td class=xl76>##Q53##</td>  <td class=xl76>##R53##</td>  <td class=xl76>##S53##</td>  <td class=xl76>##T53##</td>  <td class=xl114>##U53##</td>  <td class=xl76>##V53##</td>  <td class=xl76>##W53##</td>  <td class=xl76>##X53##</td>  <td class=xl131>##Y53##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Telephone Calls<span style='mso-spacerun:yes'></span></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E54##</td>  <td class=xl76>##F54##</td>  <td class=xl76>##G54##</td>  <td class=xl76>##H54##</td>  <td class=xl76>##I54##</td>  <td class=xl114>##J54##</td>  <td class=xl76>##K54##</td>  <td class=xl76>##L54##</td>  <td class=xl76>##M54##</td>  <td class=xl131>##N54##</td>  <td class=xl65></td>  <td class=xl75>##P54##</td>  <td class=xl76>##Q54##</td>  <td class=xl76>##R54##</td>  <td class=xl76>##S54##</td>  <td class=xl76>##T54##</td>  <td class=xl114>##U54##</td>  <td class=xl76>##V54##</td>  <td class=xl76>##W54##</td>  <td class=xl76>##X54##</td>  <td class=xl131>##Y54##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Heat and light</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E55##</td>  <td class=xl76>##F55##</td>  <td class=xl76>##G55##</td>  <td class=xl76>##H55##</td>  <td class=xl76>##I55##</td>  <td class=xl114>##J55##</td>  <td class=xl76>##K55##</td>  <td class=xl76>##L55##</td>  <td class=xl76>##M55##</td>  <td class=xl131>##N55##</td>  <td class=xl65></td>  <td class=xl75>##P55##</td>  <td class=xl76>##Q55##</td>  <td class=xl76>##R55##</td>  <td class=xl76>##S55##</td>  <td class=xl76>##T55##</td>  <td class=xl114>##U55##</td>  <td class=xl76>##V55##</td>  <td class=xl76>##W55##</td>  <td class=xl76>##X55##</td>  <td class=xl131>##Y55##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Insurances</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E56##</td>  <td class=xl76>##F56##</td>  <td class=xl76>##G56##</td>  <td class=xl76>##H56##</td>  <td class=xl76>##I56##</td>  <td class=xl114>##J56##</td>  <td class=xl76>##K56##</td>  <td class=xl76>##L56##</td>  <td class=xl76>##M56##</td>  <td class=xl131>##N56##</td>  <td class=xl65></td>  <td class=xl75>##P56##</td>  <td class=xl76>##Q56##</td>  <td class=xl76>##R56##</td>  <td class=xl76>##S56##</td>  <td class=xl76>##T56##</td>  <td class=xl114>##U56##</td>  <td class=xl76>##V56##</td>  <td class=xl76>##W56##</td>  <td class=xl76>##X56##</td>  <td class=xl131>##Y56##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Client entertaining</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E57##</td>  <td class=xl76>##F57##</td>  <td class=xl76>##G57##</td>  <td class=xl76>##H57##</td>  <td class=xl76>##I57##</td>  <td class=xl114>##J57##</td>  <td class=xl76>##K57##</td>  <td class=xl76>##L57##</td>  <td class=xl76>##M57##</td>  <td class=xl131>##N57##</td>  <td class=xl65></td>  <td class=xl75>##P57##</td>  <td class=xl76>##Q57##</td>  <td class=xl76>##R57##</td>  <td class=xl76>##S57##</td>  <td class=xl76>##T57##</td>  <td class=xl114>##U57##</td>  <td class=xl76>##V57##</td>  <td class=xl76>##W57##</td>  <td class=xl76>##X57##</td>  <td class=xl131>##Y57##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>IT costs</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E58##</td>  <td class=xl76>##F58##</td>  <td class=xl76>##G58##</td>  <td class=xl76>##H58##</td>  <td class=xl76>##I58##</td>  <td class=xl114>##J58##</td>  <td class=xl76>##K58##</td>  <td class=xl76>##L58##</td>  <td class=xl76>##M58##</td>  <td class=xl131>##N58##</td>  <td class=xl65></td>  <td class=xl75>##P58##</td>  <td class=xl76>##Q58##</td>  <td class=xl76>##R58##</td>  <td class=xl76>##S58##</td>  <td class=xl76>##T58##</td>  <td class=xl114>##U58##</td>  <td class=xl76>##V58##</td>  <td class=xl76>##W58##</td>  <td class=xl76>##X58##</td>  <td class=xl131>##Y58##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>IT recovery</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E59##</td>  <td class=xl76>##F59##</td>  <td class=xl76>##G59##</td>  <td class=xl76>##H59##</td>  <td class=xl76>##I59##</td>  <td class=xl114>##J59##</td>  <td class=xl76>##K59##</td>  <td class=xl76>##L59##</td>  <td class=xl76>##M59##</td>  <td class=xl131>##N59##</td>  <td class=xl65></td>  <td class=xl75>##P59##</td>  <td class=xl76>##Q59##</td>  <td class=xl76>##R59##</td>  <td class=xl76>##S59##</td>  <td class=xl76>##T59##</td>  <td class=xl114>##U59##</td>  <td class=xl76>##V59##</td>  <td class=xl76>##W59##</td>  <td class=xl76>##X59##</td>  <td class=xl131>##Y59##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Company Meeting</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E60##</td>  <td class=xl76>##F60##</td>  <td class=xl76>##G60##</td>  <td class=xl76>##H60##</td>  <td class=xl76>##I60##</td>  <td class=xl114>##J60##</td>  <td class=xl76>##K60##</td>  <td class=xl76>##L60##</td>  <td class=xl76>##M60##</td>  <td class=xl131>##N60##</td>  <td class=xl65></td>  <td class=xl75>##P60##</td>  <td class=xl76>##Q60##</td>  <td class=xl76>##R60##</td>  <td class=xl76>##S60##</td>  <td class=xl76>##T60##</td>  <td class=xl114>##U60##</td>  <td class=xl76>##V60##</td>  <td class=xl76>##W60##</td>  <td class=xl76>##X60##</td>  <td class=xl131>##Y60##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Development Costs</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E61##</td>  <td class=xl76>##F61##</td>  <td class=xl76>##G61##</td>    <td class=xl76>##H61##</td> <td class=xl76>##I61##</td>  <td class=xl114>##J61##</td>  <td class=xl131>##K61##</td>  <td class=xl65>##L61##</td> <td class=xl76>##M61##</td> <td class=xl131>##N61##</td>  <td class=xl65></td> <td class=xl75>##P61##</td>  <td class=xl76>##Q61##</td>  <td class=xl76>##R61##</td>  <td class=xl76>##S61##</td>  <td class=xl76>##T61##</td>  <td class=xl114>##U61##</td>  <td class=xl76>##V61##</td>  <td class=xl76>##W61##</td>  <td class=xl76>##X61##</td>  <td class=xl131>##Y61##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Promotion</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E62##</td>  <td class=xl76>##F62##</td>  <td class=xl76>##G62##</td>  <td class=xl76>##H62##</td>  <td class=xl76>##I62##</td>  <td class=xl114>##J62##</td>  <td class=xl76>##K62##</td>  <td class=xl76>##L62##</td>  <td class=xl76>##M62##</td>  <td class=xl131>##N62##</td>  <td class=xl65></td>  <td class=xl75>##P62##</td>  <td class=xl76>##Q62##</td>  <td class=xl76>##R62##</td>  <td class=xl76>##S62##</td>  <td class=xl76>##T62##</td>  <td class=xl114>##U62##</td>  <td class=xl76>##V62##</td>  <td class=xl76>##W62##</td>  <td class=xl76>##X62##</td>  <td class=xl131>##Y62##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Awards &amp; Subscriptions</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E63##</td>  <td class=xl76>##F63##</td>  <td class=xl76>##G63##</td>  <td class=xl76>##H63##</td>  <td class=xl76>##I63##</td>  <td class=xl114>##J63##</td>  <td class=xl76>##K63##</td>  <td class=xl76>##L63##</td>  <td class=xl76>##M63##</td>  <td class=xl131>##N63##</td>  <td class=xl65></td>  <td class=xl75>##P63##</td>  <td class=xl76>##Q63##</td>  <td class=xl76>##R63##</td>  <td class=xl76>##S63##</td>  <td class=xl76>##T63##</td>  <td class=xl114>##U63##</td>  <td class=xl76>##V63##</td>  <td class=xl76>##W63##</td>  <td class=xl76>##X63##</td>  <td class=xl131>##Y63##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Forums &amp; Conferences</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E64##</td>  <td class=xl76>##F64##</td>  <td class=xl76>##G64##</td>  <td class=xl76>##H64##</td>  <td class=xl76>##I64##</td>  <td class=xl114>##J64##</td>  <td class=xl76>##K64##</td>  <td class=xl76>##L64##</td>  <td class=xl76>##M64##</td>  <td class=xl131>##N64##</td>  <td class=xl65></td>  <td class=xl75>##P64##</td>  <td class=xl76>##Q64##</td>  <td class=xl76>##R64##</td>  <td class=xl76>##S64##</td>  <td class=xl76>##T64##</td>  <td class=xl114>##U64##</td>  <td class=xl76>##V64##</td>  <td class=xl76>##W64##</td>  <td class=xl76>##X64##</td>  <td class=xl131>##Y64##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Marketing</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E65##</td>  <td class=xl76>##F65##</td>  <td class=xl76>##G65##</td>  <td class=xl76>##H65##</td>  <td class=xl76>##I65##</td>  <td class=xl114>##J65##</td>  <td class=xl76>##K65##</td>  <td class=xl76>##L65##</td>  <td class=xl76>##M65##</td>  <td class=xl131>##N65##</td>  <td class=xl65></td>  <td class=xl75>##P65##</td>  <td class=xl76>##Q65##</td>  <td class=xl76>##R65##</td>  <td class=xl76>##S65##</td>  <td class=xl76>##T65##</td>  <td class=xl114>##U65##</td>  <td class=xl76>##V65##</td>  <td class=xl76>##W65##</td>  <td class=xl76>##X65##</td>  <td class=xl131>##Y65##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Sales Activities</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E66##</td>  <td class=xl76>##F66##</td>  <td class=xl76>##G66##</td>  <td class=xl76>##H66##</td>  <td class=xl76>##I66##</td>  <td class=xl114>##J66##</td>  <td class=xl76>##K66##</td>  <td class=xl76>##L66##</td>  <td class=xl76>##M66##</td>  <td class=xl131>##N66##</td>  <td class=xl65></td>  <td class=xl75>##P66##</td>  <td class=xl76>##Q66##</td>  <td class=xl76>##R66##</td>  <td class=xl76>##S66##</td>  <td class=xl76>##T66##</td>  <td class=xl114>##U66##</td>  <td class=xl76>##V66##</td>  <td class=xl76>##W66##</td>  <td class=xl76>##X66##</td>  <td class=xl131>##Y66##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>US Sales</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E67##</td>  <td class=xl76>##F67##</td>  <td class=xl76>##G67##</td>  <td class=xl76>##H67##</td>  <td class=xl76>##I67##</td>  <td class=xl114>##J67##</td>  <td class=xl76>##K67##</td>  <td class=xl76>##L67##</td>  <td class=xl76>##M67##</td>  <td class=xl131>##N67##</td>  <td class=xl65></td>  <td class=xl75>##P67##</td>  <td class=xl76>##Q67##</td>  <td class=xl76>##R67##</td>  <td class=xl76>##S67##</td>  <td class=xl76>##T67##</td>  <td class=xl114>##U67##</td>  <td class=xl76>##V67##</td>  <td class=xl76>##W67##</td>  <td class=xl76>##X67##</td>  <td class=xl131>##Y67##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Bank Charges</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E68##</td>  <td class=xl76>##F68##</td>  <td class=xl76>##G68##</td>  <td class=xl76>##H68##</td>  <td class=xl76>##I68##</td>  <td class=xl114>##J68##</td>  <td class=xl76>##K68##</td>  <td class=xl76>##L68##</td>  <td class=xl76>##M68##</td>  <td class=xl131>##N68##</td>  <td class=xl65></td>  <td class=xl75>##P68##</td>  <td class=xl76>##Q68##</td><td class=xl76>##R68##</td>  <td class=xl76>##S68##</td>  <td class=xl76>##T68##</td>  <td class=xl114>##U68##</td>  <td class=xl76>##V68##</td>  <td class=xl76>##W68##</td>  <td class=xl76>##X68##</td>  <td class=xl131>##Y68##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Recruitment</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E69##</td>  <td class=xl76>##F69##</td>  <td class=xl76>##G69##</td>  <td class=xl76>##H69##</td>  <td class=xl76>##I69##</td>  <td class=xl114>##J69##</td>  <td class=xl76>##K69##</td>  <td class=xl76>##L69##</td>  <td class=xl76>##M69##</td>  <td class=xl131>##N69##</td>  <td class=xl65></td>  <td class=xl75>##P69##</td>  <td class=xl76>##Q69##</td> <td class=xl76>##R69##</td>  <td class=xl76>##S69##</td>  <td class=xl76>##T69##</td>  <td class=xl114>##U69##</td>  <td class=xl76>##V69##</td>  <td class=xl76>##W69##</td>  <td class=xl76>##X69##</td>  <td class=xl131>##Y69##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Sunry Office Costs</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E70##</td>  <td class=xl76>##F70##</td>  <td class=xl76>##G70##</td>  <td class=xl76>##H70##</td>  <td class=xl76>##I70##</td>  <td class=xl114>##J70##</td>  <td class=xl76>##K70##</td>  <td class=xl76>##L70##</td>  <td class=xl76>##M70##</td>  <td class=xl131>##N70##</td>  <td class=xl65></td>  <td class=xl75>##P70##</td>  <td class=xl76>##Q70##</td>  <td class=xl76>##R70##</td>  <td class=xl76>##S70##</td>  <td class=xl76>##T70##</td>  <td class=xl114>##U70##</td>  <td class=xl76>##V70##</td>  <td class=xl76>##W70##</td>  <td class=xl76>##X70##</td>  <td class=xl131>##Y70##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl65></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>"; 
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl79 style='height:12.75pt'>Professional Fees</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl77></td>  <td class=xl65></td>  <td class=xl73></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Audit</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E73##</td>  <td class=xl76>##F73##</td>  <td class=xl76>##G73##</td>  <td class=xl76>##H73##</td>  <td class=xl76>##I73##</td>  <td class=xl114>##J73##</td>  <td class=xl76>##K73##</td>  <td class=xl76>##L73##</td>  <td class=xl76>##M73##</td>  <td class=xl131>##N73##</td>  <td class=xl65></td>  <td class=xl75>##P73##</td>  <td class=xl76>##Q73##</td>  <td class=xl76>##R73##</td>  <td class=xl76>##S73##</td>  <td class=xl76>##T73##</td>  <td class=xl114>##U73##</td>  <td class=xl76>##V73##</td>  <td class=xl76>##W73##</td>  <td class=xl76>##X73##</td>  <td class=xl131>##Y73##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Accounting Software</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E74##</td>  <td class=xl76>##F74##</td>  <td class=xl76>##G74##</td>  <td class=xl76>##H74##</td>  <td class=xl76>##I74##</td>  <td class=xl114>##J74##</td>  <td class=xl76>##K74##</td>  <td class=xl76>##L74##</td>  <td class=xl76>##M74##</td>  <td class=xl131>##N74##</td>  <td class=xl65></td>  <td class=xl75>##P74##</td>  <td class=xl76>##Q74##</td>  <td class=xl76>##R74##</td>  <td class=xl76>##S74##</td>  <td class=xl76>##T74##</td>  <td class=xl114>##U74##</td>  <td class=xl76>##V74##</td>  <td class=xl76>##W74##</td>  <td class=xl76>##X74##</td>  <td class=xl131>##Y74##</td> </tr>"; content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Legal</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E75##</td>  <td class=xl76>##F75##</td>  <td class=xl76>##G75##</td>  <td class=xl76>##H75##</td>  <td class=xl76>##I75##</td>  <td class=xl114>##J75##</td>  <td class=xl76>##K75##</td>  <td class=xl76>##L75##</td>  <td class=xl76>##M75##</td>  <td class=xl131>##N75##</td>  <td class=xl65></td>  <td class=xl75>##P75##</td>  <td class=xl76>##Q75##</td>  <td class=xl76>##R75##</td>  <td class=xl76>##S75##</td>  <td class=xl76>##T75##</td>  <td class=xl114>##U75##</td>  <td class=xl76>##V75##</td>  <td class=xl76>##W75##</td>  <td class=xl76>##X75##</td>  <td class=xl131>##Y75##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Other</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E76##</td>  <td class=xl76>##F76##</td>  <td class=xl76>##G76##</td>  <td class=xl76>##H76##</td>  <td class=xl76>##I76##</td>  <td class=xl114>##J76##</td>  <td class=xl76>##K76##</td>  <td class=xl76>##L76##</td>  <td class=xl76>##M76##</td>  <td class=xl131>##N76##</td>  <td class=xl65></td>  <td class=xl75>##P76##</td>  <td class=xl76>##Q76##</td>  <td class=xl76>##R76##</td>  <td class=xl76>##S76##</td>  <td class=xl76>##T76##</td>  <td class=xl114>##U76##</td>  <td class=xl76>##V76##</td>  <td class=xl76>##W76##</td>  <td class=xl76>##X76##</td>  <td class=xl131>##Y76##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>&nbsp;</td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl78>&nbsp;</td>  <td class=xl65></td>  <td class=xl145>&nbsp;</td>  <td class=xl65></td>  <td class=xl76></td>  <td class=xl77></td>  <td class=xl76></td>  <td class=xl76><span style='mso-spacerun:yes'></span></td>  <td class=xl77><span style='mso-spacerun:yes'></span></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl74>&nbsp;</td> </tr>";
	content += "<tr class=xl69 height=17 style='height:12.75pt'>  <td height=17 class=xl79 style='height:12.75pt'>Operating Profit</td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl80>##E78##</td>  <td class=xl81>##F78##</td>  <td class=xl81>##G78##</td>  <td class=xl81>##H78##</td>  <td class=xl81>##I78##</td>  <td class=xl115>##J78##</td>  <td class=xl81>##K78##</td>  <td class=xl81>##L78##</td>  <td class=xl81>##M78##</td>  <td class=xl132>##N78##</td>  <td class=xl69></td>  <td class=xl80>##P78##</td>  <td class=xl81>##Q78##</td>  <td class=xl81>##R78##</td>  <td class=xl81>##S78##</td>  <td class=xl81>##T78##</td>  <td class=xl135>##U78##</td>  <td class=xl81>##V78##</td>  <td class=xl81>##W78##</td>  <td class=xl81>##X78##</td>  <td class=xl82>##Y78##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Check</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl76>##E80##</td>  <td class=xl76>##F80##</td>  <td class=xl76>##G80##</td>  <td class=xl76>##H80##</td>  <td class=xl76>##I80##</td>  <td class=xl114>##J80##</td>  <td class=xl76>##K80##</td>  <td class=xl76>##L80##</td>  <td class=xl76>##M80##</td>  <td class=xl76>##N80##</td>  <td class=xl65></td>  <td class=xl76>##P80##</td>  <td class=xl76>##Q80##</td> <td class=xl76>##R80##</td>  <td class=xl76>##S80##</td>  <td class=xl76>##T80##</td>  <td class=xl114>##U80##</td>  <td class=xl76>##V80##</td>  <td class=xl76>##W80##</td>  <td class=xl76>##X80##</td>  <td class=xl76>##Y80##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl76></td>  <td class=xl76></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td> </tr>"; content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Turnover</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl137>##E82##</td>  <td class=xl138>##F82##</td>  <td class=xl138>##G82##</td>  <td class=xl138>##H82##</td>  <td class=xl138>##I82##</td>  <td class=xl139>##J82##</td>  <td class=xl138>##K82##</td>  <td class=xl138>##L82##</td>  <td class=xl138>##M82##</td>  <td class=xl140>##N82##</td>  <td class=xl65></td>  <td class=xl137>##P82##</td>  <td class=xl138>##Q82##</td>  <td class=xl138>##R82##</td>  <td class=xl138>##S82##</td>  <td class=xl138>##T82##</td>  <td class=xl139>##U82##</td>  <td class=xl138>##V82##</td>  <td class=xl138>##W82##</td> <td class=xl138>##X82##</td><td class=xl142>##Y82##</td></tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Cost of sales</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E83##</td>  <td class=xl76>##F83##</td>  <td class=xl76>##G83##</td>  <td class=xl76>##H83##</td>  <td class=xl76>##I83##</td>  <td class=xl114>##J83##</td>  <td class=xl76>##K83##</td>  <td class=xl76>##L83##</td>  <td class=xl76>##M83##</td>  <td class=xl131>##N83##</td>  <td class=xl65></td>  <td class=xl75>##P83##</td>  <td class=xl76>##Q83##</td>  <td class=xl76>##R83##</td>  <td class=xl76>##S83##</td>  <td class=xl76>##T83##</td>  <td class=xl114>##U83##</td>  <td class=xl76>##V83##</td>  <td class=xl76>##W83##</td>  <td class=xl76>##X83##</td>  <td class=xl131>##Y83##</td> </tr>";
	content += "<tr class=xl69 height=17 style='height:12.75pt'>  <td height=17 class=xl79 style='height:12.75pt'>Gross profit</td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl75>##E84##</td>  <td class=xl76>##F84##</td>  <td class=xl76>##G84##</td>  <td class=xl76>##H84##</td>  <td class=xl76>##I84##</td>  <td class=xl114>##J84##</td>  <td class=xl76>##K84##</td>  <td class=xl76>##L84##</td>  <td class=xl76>##M84##</td>  <td class=xl131>##N84##</td>  <td class=xl69></td>  <td class=xl83>##P84##</td>  <td class=xl84>##Q84##</td>  <td class=xl84>##R84##</td>  <td class=xl84>##S84##</td>  <td class=xl84>##T84##</td>  <td class=xl141>##U84##</td>  <td class=xl84>##V84##</td>  <td class=xl84>##W84##</td>  <td class=xl84>##X84##</td>  <td class=xl143>##Y84##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Staff costs</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E85##</td>  <td class=xl76>##F85##</td>  <td class=xl76>##G85##</td>  <td class=xl76>##H85##</td>  <td class=xl76>##I85##</td>  <td class=xl114>##J85##</td>  <td class=xl76>##K85##</td>  <td class=xl76>##L85##</td>  <td class=xl76>##M85##</td>  <td class=xl131>##N85##</td>  <td class=xl65></td>  <td class=xl75>##P85##</td>  <td class=xl76>##Q85##</td>  <td class=xl76>##R85##</td>  <td class=xl76>##S85##</td>  <td class=xl76>##T85##</td>  <td class=xl114>##U85##</td>  <td class=xl76>##V85##</td>  <td class=xl76>##W85##</td>  <td class=xl76>##X85##</td>  <td class=xl131>##Y85##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Space</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E86##</td>  <td class=xl76>##F86##</td>  <td class=xl76>##G86##</td>  <td class=xl76>##H86##</td>  <td class=xl76>##I86##</td>  <td class=xl114>##J86##</td>  <td class=xl76>##K86##</td>  <td class=xl76>##L86##</td>  <td class=xl76>##M86##</td>  <td class=xl131>##N86##</td>  <td class=xl65></td>  <td class=xl75>##P86##</td>  <td class=xl76>##Q86##</td>  <td class=xl76>##R86##</td>  <td class=xl76>##S86##</td>  <td class=xl76>##T86##</td>  <td class=xl114>##U86##</td>  <td class=xl76>##V86##</td>  <td class=xl76>##W86##</td>  <td class=xl76>##X86##</td>  <td class=xl131>##Y86##</td> </tr>"; 
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Adminstrative costs</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E87##</td>  <td class=xl76>##F87##</td>  <td class=xl76>##G87##</td>  <td class=xl76>##H87##</td>  <td class=xl76>##I87##</td>  <td class=xl114>##J87##</td>  <td class=xl76>##K87##</td>  <td class=xl76>##L87##</td>  <td class=xl76>##M87##</td>  <td class=xl131>##N87##</td>  <td class=xl65></td>  <td class=xl75>##P87##</td>  <td class=xl76>##Q87##</td>  <td class=xl76>##R87##</td>  <td class=xl76>##S87##</td>  <td class=xl76>##T87##</td>  <td class=xl114>##U87##</td>  <td class=xl76>##V87##</td>  <td class=xl76>##W87##</td>  <td class=xl76>##X87##</td>  <td class=xl131>##Y87##</td> </tr>";
	content += "<tr height=17 style='height:12.75pt'>  <td height=17 class=xl67 style='height:12.75pt'>Professional Fees</td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl65></td>  <td class=xl75>##E88##</td>  <td class=xl76>##F88##</td>  <td class=xl76>##G88##</td>  <td class=xl76>##H88##</td>  <td class=xl76>##I88##</td>  <td class=xl114>##J88##</td>  <td class=xl76>##K88##</td>  <td class=xl76>##L88##</td>  <td class=xl76>##M88##</td>  <td class=xl131>##N88##</td>  <td class=xl65></td>  <td class=xl75>##P88##</td>  <td class=xl76>##Q88##</td>  <td class=xl76>##R88##</td>  <td class=xl76>##S88##</td>  <td class=xl76>##T88##</td>  <td class=xl114>##U88##</td>  <td class=xl76>##V88##</td>  <td class=xl76>##W88##</td>  <td class=xl76>##X88##</td>  <td class=xl131>##Y88##</td> </tr>";
	content += "<tr class=xl69 height=17 style='height:12.75pt'>  <td height=17 class=xl79 style='height:12.75pt'>Profit before interest, tax, and d'pcn</td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl69></td>  <td class=xl133>##E89##</td>  <td class=xl134>##F89##</td>  <td class=xl134>##G89##</td>  <td class=xl134>##H89##</td>  <td class=xl134>##I89##</td>  <td class=xl135>##J89##</td>  <td class=xl134>##K89##</td>  <td class=xl134>##L89##</td>  <td class=xl134>##M89##</td>  <td class=xl136>##N89##</td>  <td class=xl69></td>  <td class=xl133>##P89##</td>  <td class=xl134>##Q89##</td>  <td class=xl134>##R89##</td>  <td class=xl134>##S89##</td>  <td class=xl134>##T89##</td>  <td class=xl135>##U89##</td>  <td class=xl134>##V89##</td>  <td class=xl134>##W89##</td>  <td class=xl134>##X89##</td>  <td class=xl136>##Y89##</td> </tr></table>";

	
}


/****************************************************
 * replaceHeaderInformation - replacing the header information
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 ****************************************************/
function replaceHeaderInformation(sourceContent)
{
	var dateRangeStart = '';
	var dateRangeEnd = '';
	var dateRangeStartMonth = '';
	var dateRangeEnddMonth = '';
	var monthlyDateRange = '';
	var dateRangeName = '';

	//setting 'monthlydaterange'
	monthlyDateRange = currentFullDate; 

	//setting 'daterangename'
	dateRangeStart = (currentMonth -2);							//to get the last three months
	dateRangeStartMonth = getMonthName(dateRangeStart); 
	dateRangeEnd = currentMonth; 
	dateRangeEnddMonth = getMonthName(dateRangeEnd);
	dateRangeName = dateRangeStartMonth + ' - ' + dateRangeEnddMonth ;

	//setting budgetName
	if(currentMonth > 7 && currentMonth < 12 )
	{
		budgetName ='RF1';
	}
	else if(currentMonth <8 && currentMonth >3)
	{
		budgetName = 'Main';
	}
	else
	{
		budgetName = 'RF2';
	}

	//Replacing the data
	sourceContent = replaceAll(sourceContent, '##MONTHLYDATERANGE##', monthlyDateRange);
	sourceContent = replaceAll(sourceContent, '##DATERANGENAME##', dateRangeName);
	sourceContent = replaceAll(sourceContent, '##BUDGETNAME##', budgetName);

	return sourceContent;
}



/***********************************************************************************************************
 * replaceDateRangeActualsData - replacing the actuals data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceDateRangeActualsData(sourceContent)
{
	//declaring local variables
	var dateRangeActuals = new Array();

	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

	//getting the appropriate search results
	dateRangeActuals = getSearchResults('custrecord_rolling_three_months_actuals');

	if(dateRangeActuals !=null)
	{ 

		calculateData(dateRangeActuals);

		//assigning the values for the variables compared to the 'management spreadsheet' cells
		E8 = revProgrammeFees;
		E9 = revFilmProduction;
		E10 = revStoryWeb;
		E11 = revTsWorkshops;
		E12 = revLaveryRoom;
		E13 = revTravel;
		E14 = revCurrency;
	
		E18 = cosFreelanceStaff;
		E19 = cosFreelanceStaffDelivery;
		E20 = cosExternalDesign;
		E21 = cosSalesCommission;
		E22 = cosStoryWeb;
		E23 = cosPrinting;
		E24 = cosFilmVideo;
		E25 = cosOther;
		E26 = cosTsWorkshops;
		E27 = cosLaveryRoom;
		E28 = cosTravel;
		
		E31 = salSalaries;
		E32 = salErs;
		E33 = salFreelanceStaff;
		E34 = salRedandancy;
		E35 = salCpd;		
		E36 = salNonRechargable;
		E37 = salITCharge;
		E38 = salProfService;
		E39 = salStaffEntertain;
			
		E42 = spaRent;
		E43 = spaRates;
		E44 = spaWaterRates; 
		E45 = spaOfficeCleaning;
		E46 = spaInsurance;
		E47 = spaRepairs;
		E48 = spaRelocation;
		
		E51 = ovePrint;
		E52 = oveRevised;
		E53 = oveTelephoneSystem;
		E54 = oveTelephoneCalls;
		E55 = oveHeat;
		E56 = oveInsurances;
		E57 = oveClientEntertain;
		E58 = oveITCosts;
		E59 = oveITRecovery;
		E60 = oveCompanyMeeting;
		E61 = oveDevCosts;
		E62 = ovePromotion;
		E63 = oveAwards;
		E64 = oveForums;
		E65 = oveMarketing;
		E66 = oveSales;
		E67 = oveUSSales;
		E68 = oveBankCharges;
		E69 = oveRecruitment;
		E70 = oveSunryOffice;
		
		E73 = profAudit;
		E74 = profAccounting;
		E75 = profLegal;
		E76 = profOther;
		
		E78 = operatingProfit;
	
		//E80 = 
		
		E82 = parseFloat(revTotalAmount/1000).toFixed(2);
		E83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		E84 = parseFloat(grossProfit/1000).toFixed(2);
		E85 = parseFloat(employmentCosts/1000).toFixed(2); 
		E86 = parseFloat(propertyCosts/1000).toFixed(2);
		E87 = parseFloat(adminCosts/1000).toFixed(2);
		E88 = parseFloat(professionalFees/1000).toFixed(2);
		E89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##E8##', E8);
	sourceContent= replaceAll(sourceContent, '##E9##', E9);
	sourceContent= replaceAll(sourceContent, '##E10##', E10);
	sourceContent= replaceAll(sourceContent, '##E11##', E11);
	sourceContent= replaceAll(sourceContent, '##E12##', E12);
	sourceContent= replaceAll(sourceContent, '##E13##', E13);
	sourceContent= replaceAll(sourceContent, '##E14##', E14);

	sourceContent= replaceAll(sourceContent, '##E18##', E18);
	sourceContent= replaceAll(sourceContent, '##E19##', E19);
	sourceContent= replaceAll(sourceContent, '##E20##', E20);
	sourceContent= replaceAll(sourceContent, '##E21##', E21);
	sourceContent= replaceAll(sourceContent, '##E22##', E22);
	sourceContent= replaceAll(sourceContent, '##E23##', E23);
	sourceContent= replaceAll(sourceContent, '##E24##', E24);
	sourceContent= replaceAll(sourceContent, '##E25##', E25);
	sourceContent= replaceAll(sourceContent, '##E26##', E26);
	sourceContent= replaceAll(sourceContent, '##E27##', E27);
	sourceContent= replaceAll(sourceContent, '##E28##', E28);
	
	sourceContent= replaceAll(sourceContent, '##E31##', E31);
	sourceContent= replaceAll(sourceContent, '##E32##', E32);
	sourceContent= replaceAll(sourceContent, '##E33##', E33);
	sourceContent= replaceAll(sourceContent, '##E34##', E34);
	sourceContent= replaceAll(sourceContent, '##E35##', E35);
	sourceContent= replaceAll(sourceContent, '##E36##', E36);
	sourceContent= replaceAll(sourceContent, '##E37##', E37);
	sourceContent= replaceAll(sourceContent, '##E38##', E38);
	sourceContent= replaceAll(sourceContent, '##E39##', E39);

	sourceContent= replaceAll(sourceContent, '##E42##', E42);
	sourceContent= replaceAll(sourceContent, '##E43##', E43);
	sourceContent= replaceAll(sourceContent, '##E44##', E44);
	sourceContent= replaceAll(sourceContent, '##E45##', E45);
	sourceContent= replaceAll(sourceContent, '##E46##', E46);
	sourceContent= replaceAll(sourceContent, '##E47##', E47);
	sourceContent= replaceAll(sourceContent, '##E48##', E48);

	sourceContent= replaceAll(sourceContent, '##E51##', E51);
	sourceContent= replaceAll(sourceContent, '##E52##', E52);
	sourceContent= replaceAll(sourceContent, '##E53##', E53);
	sourceContent= replaceAll(sourceContent, '##E54##', E54);
	sourceContent= replaceAll(sourceContent, '##E55##', E55);
	sourceContent= replaceAll(sourceContent, '##E56##', E56);
	sourceContent= replaceAll(sourceContent, '##E57##', E57);
	sourceContent= replaceAll(sourceContent, '##E58##', E58);
	sourceContent= replaceAll(sourceContent, '##E59##', E59);
	sourceContent= replaceAll(sourceContent, '##E60##', E60);
	sourceContent= replaceAll(sourceContent, '##E61##', E61);
	sourceContent= replaceAll(sourceContent, '##E62##', E62);
	sourceContent= replaceAll(sourceContent, '##E63##', E63);
	sourceContent= replaceAll(sourceContent, '##E64##', E64);
	sourceContent= replaceAll(sourceContent, '##E65##', E65);
	sourceContent= replaceAll(sourceContent, '##E66##', E66);
	sourceContent= replaceAll(sourceContent, '##E67##', E67);
	sourceContent= replaceAll(sourceContent, '##E68##', E68);
	sourceContent= replaceAll(sourceContent, '##E69##', E69);
	sourceContent= replaceAll(sourceContent, '##E70##', E70);
	
	sourceContent= replaceAll(sourceContent, '##E73##', E73);
	sourceContent= replaceAll(sourceContent, '##E74##', E74);
	sourceContent= replaceAll(sourceContent, '##E75##', E75);
	sourceContent= replaceAll(sourceContent, '##E76##', E76);
	
	sourceContent= replaceAll(sourceContent, '##E78##', E78);
	
	sourceContent= replaceAll(sourceContent, '##E80##', E80);
	
	sourceContent= replaceAll(sourceContent, '##E82##', E82);
	sourceContent= replaceAll(sourceContent, '##E83##', E83);
	sourceContent= replaceAll(sourceContent, '##E84##', E84);
	sourceContent= replaceAll(sourceContent, '##E85##', E85);
	sourceContent= replaceAll(sourceContent, '##E86##', E86);
	sourceContent= replaceAll(sourceContent, '##E87##', E87);
	sourceContent= replaceAll(sourceContent, '##E88##', E88);
	sourceContent= replaceAll(sourceContent, '##E89##', E89);
	
	return sourceContent;

}


/***********************************************************************************************************
 * replaceDateRangeBudgetsData - replacing the budgets data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *
 **********************************************************************************************************/
function replaceDateRangeBudgetsData(sourceContent)
{
	//declaring local variables
	var dateRangeBudgets = new Array();

	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

	//getting the appropriate search results
	dateRangeBudgets = getSearchResults('custrecord_rolling_months_budgets_main');

	if(dateRangeBudgets !=null)
	{ 

		calculateData(dateRangeBudgets);

		F8 = revProgrammeFees;
		F9 = revFilmProduction;
		F10 = revStoryWeb;
		F11 = revTsWorkshops;
		F12 = revLaveryRoom;
		F13 = revTravel;
		F14 = revCurrency;
	
		F18 = cosFreelanceStaff;
		F19 = cosFreelanceStaffDelivery;
		F20 = cosExternalDesign;
		F21 = cosSalesCommission;
		F22 = cosStoryWeb;
		F23 = cosPrinting;
		F24 = cosFilmVideo;
		F25 = cosOther;
		F26 = cosTsWorkshops;
		F27 = cosLaveryRoom;
		F28 = cosTravel;
		
		F31 = salSalaries;
		F32 = salErs;
		F33 = salFreelanceStaff;
		F34 = salRedandancy;
		F35 = salCpd;		
		F36 = salNonRechargable;
		F37 = salITCharge;
		F38 = salProfService;
		F39 = salStaffEntertain;
			
		F42 = spaRent;
		F43 = spaRates;
		F44 = spaWaterRates; 
		F45 = spaOfficeCleaning;
		F46 = spaInsurance;
		F47 = spaRepairs;
		F48 = spaRelocation;
		
		F51 = ovePrint;
		F52 = oveRevised;
		F53 = oveTelephoneSystem;
		F54 = oveTelephoneCalls;
		F55 = oveHeat;
		F56 = oveInsurances;
		F57 = oveClientEntertain;
		F58 = oveITCosts;
		F59 = oveITRecovery;
		F60 = oveCompanyMeeting;
		F61 = oveDevCosts;
		F62 = ovePromotion;
		F63 = oveAwards;
		F64 = oveForums;
		F65 = oveMarketing;
		F66 = oveSales;
		F67 = oveUSSales;
		F68 = oveBankCharges;
		F69 = oveRecruitment;
		F70 = oveSunryOffice;
		
		F73 = profAudit;
		F74 = profAccounting;
		F75 = profLegal;
		F76 = profOther;
		
		F78 = operatingProfit;
	
		//F80 = 
		
		F82 = parseFloat(revTotalAmount/1000).toFixed(2);
		F83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		F84 = parseFloat(grossProfit/1000).toFixed(2);
		F85 = parseFloat(employmentCosts/1000).toFixed(2); 
		F86 = parseFloat(propertyCosts/1000).toFixed(2);
		F87 = parseFloat(adminCosts/1000).toFixed(2);
		F88 = parseFloat(professionalFees/1000).toFixed(2);
		F89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##F8##', F8);
	sourceContent= replaceAll(sourceContent, '##F9##', F9);
	sourceContent= replaceAll(sourceContent, '##F10##', F10);
	sourceContent= replaceAll(sourceContent, '##F11##', F11);
	sourceContent= replaceAll(sourceContent, '##F12##', F12);
	sourceContent= replaceAll(sourceContent, '##F13##', F13);
	sourceContent= replaceAll(sourceContent, '##F14##', F14);

	sourceContent= replaceAll(sourceContent, '##F18##', F18);
	sourceContent= replaceAll(sourceContent, '##F19##', F19);
	sourceContent= replaceAll(sourceContent, '##F20##', F20);
	sourceContent= replaceAll(sourceContent, '##F21##', F21);
	sourceContent= replaceAll(sourceContent, '##F22##', F22);
	sourceContent= replaceAll(sourceContent, '##F23##', F23);
	sourceContent= replaceAll(sourceContent, '##F24##', F24);
	sourceContent= replaceAll(sourceContent, '##F25##', F25);
	sourceContent= replaceAll(sourceContent, '##F26##', F26);
	sourceContent= replaceAll(sourceContent, '##F27##', F27);
	sourceContent= replaceAll(sourceContent, '##F28##', F28);
	
	sourceContent= replaceAll(sourceContent, '##F31##', F31);
	sourceContent= replaceAll(sourceContent, '##F32##', F32);
	sourceContent= replaceAll(sourceContent, '##F33##', F33);
	sourceContent= replaceAll(sourceContent, '##F34##', F34);
	sourceContent= replaceAll(sourceContent, '##F35##', F35);
	sourceContent= replaceAll(sourceContent, '##F36##', F36);
	sourceContent= replaceAll(sourceContent, '##F37##', F37);
	sourceContent= replaceAll(sourceContent, '##F38##', F38);
	sourceContent= replaceAll(sourceContent, '##F39##', F39);

	sourceContent= replaceAll(sourceContent, '##F42##', F42);
	sourceContent= replaceAll(sourceContent, '##F43##', F43);
	sourceContent= replaceAll(sourceContent, '##F44##', F44);
	sourceContent= replaceAll(sourceContent, '##F45##', F45);
	sourceContent= replaceAll(sourceContent, '##F46##', F46);
	sourceContent= replaceAll(sourceContent, '##F47##', F47);
	sourceContent= replaceAll(sourceContent, '##F48##', F48);

	sourceContent= replaceAll(sourceContent, '##F51##', F51);
	sourceContent= replaceAll(sourceContent, '##F52##', F52);
	sourceContent= replaceAll(sourceContent, '##F53##', F53);
	sourceContent= replaceAll(sourceContent, '##F54##', F54);
	sourceContent= replaceAll(sourceContent, '##F55##', F55);
	sourceContent= replaceAll(sourceContent, '##F56##', F56);
	sourceContent= replaceAll(sourceContent, '##F57##', F57);
	sourceContent= replaceAll(sourceContent, '##F58##', F58);
	sourceContent= replaceAll(sourceContent, '##F59##', F59);
	sourceContent= replaceAll(sourceContent, '##F60##', F60);
	sourceContent= replaceAll(sourceContent, '##F61##', F61);
	sourceContent= replaceAll(sourceContent, '##F62##', F62);
	sourceContent= replaceAll(sourceContent, '##F63##', F63);
	sourceContent= replaceAll(sourceContent, '##F64##', F64);
	sourceContent= replaceAll(sourceContent, '##F65##', F65);
	sourceContent= replaceAll(sourceContent, '##F66##', F66);
	sourceContent= replaceAll(sourceContent, '##F67##', F67);
	sourceContent= replaceAll(sourceContent, '##F68##', F68);
	sourceContent= replaceAll(sourceContent, '##F69##', F69);
	sourceContent= replaceAll(sourceContent, '##F70##', F70);
	
	sourceContent= replaceAll(sourceContent, '##F73##', F73);
	sourceContent= replaceAll(sourceContent, '##F74##', F74);
	sourceContent= replaceAll(sourceContent, '##F75##', F75);
	sourceContent= replaceAll(sourceContent, '##F76##', F76);
	
	sourceContent= replaceAll(sourceContent, '##F78##', F78);
	
	sourceContent= replaceAll(sourceContent, '##F80##', F80);
	
	sourceContent= replaceAll(sourceContent, '##F82##', F82);
	sourceContent= replaceAll(sourceContent, '##F83##', F83);
	sourceContent= replaceAll(sourceContent, '##F84##', F84);
	sourceContent= replaceAll(sourceContent, '##F85##', F85);
	sourceContent= replaceAll(sourceContent, '##F86##', F86);
	sourceContent= replaceAll(sourceContent, '##F87##', F87);
	sourceContent= replaceAll(sourceContent, '##F88##', F88);
	sourceContent= replaceAll(sourceContent, '##F89##', F89);

	return sourceContent;

}


/***********************************************************************************************************
 * replaceDateRangeVarianceData - replacing the variance data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceDateRangeVarianceData(sourceContent)
{
	G8 = parseFloat(E8 - F8).toFixed(2);
	G9 = parseFloat(E9 - F9).toFixed(2);
	G10 = parseFloat(E10 - F10).toFixed(2);
	G11 = parseFloat(E11 - F11).toFixed(2);
	G12 = parseFloat(E12 - F12).toFixed(2);
	G13 = parseFloat(E13 - F13).toFixed(2);
	G14 = parseFloat(E14 - F14).toFixed(2);

	G18 = parseFloat(F18 - E18).toFixed(2);
	G19 = parseFloat(F19 - E19).toFixed(2);
	G20 = parseFloat(F20 - E20).toFixed(2);
	G21 = parseFloat(F21 - E21).toFixed(2);
	G22 = parseFloat(F22 - E22).toFixed(2);
	G23 = parseFloat(F23 - E23).toFixed(2);
	G24 = parseFloat(F24 - E24).toFixed(2);
	G25 = parseFloat(F25 - E25).toFixed(2);
	G26 = parseFloat(F26 - E26).toFixed(2);
	G27 = parseFloat(F27 - E27).toFixed(2);
	G28 = parseFloat(F28 - E28).toFixed(2);
	
	G31 = parseFloat(F31 - E31).toFixed(2);
	G32 = parseFloat(F32 - E32).toFixed(2);
	G33 = parseFloat(F33 - E33).toFixed(2);
	G34 = parseFloat(F34 - E34).toFixed(2);
	G35 = parseFloat(F35 - E35).toFixed(2);
	G36 = parseFloat(F36 - E36).toFixed(2);
	G37 = parseFloat(F37 - E37).toFixed(2);
	G38 = parseFloat(F38 - E38).toFixed(2);
	G39 = parseFloat(F39 - E39).toFixed(2);
	
	G42 = parseFloat(F42 - E42).toFixed(2);
	G43 = parseFloat(F43 - E43).toFixed(2);
	G44 = parseFloat(F44 - E44).toFixed(2);
	G45 = parseFloat(F45 - E45).toFixed(2);
	G46 = parseFloat(F46 - E46).toFixed(2);
	G47 = parseFloat(F47 - E47).toFixed(2);
	G48 = parseFloat(F48 - E48).toFixed(2);
	
	G51 = parseFloat(F51 - E51).toFixed(2);
	G52 = parseFloat(F52 - E52).toFixed(2);
	G53 = parseFloat(F53 - E53).toFixed(2);
	G54 = parseFloat(F54 - E54).toFixed(2);
	G55 = parseFloat(F55 - E55).toFixed(2);
	G56 = parseFloat(F56 - E56).toFixed(2);
	G57 = parseFloat(F57 - E57).toFixed(2);
	G58 = parseFloat(F58 - E58).toFixed(2);
	G59 = parseFloat(F59 - E59).toFixed(2);
	G60 = parseFloat(F60 - E60).toFixed(2);
	G61 = parseFloat(F61 - E61).toFixed(2);
	G62 = parseFloat(F62 - E62).toFixed(2);
	G63 = parseFloat(F63 - E63).toFixed(2);
	G64 = parseFloat(F64 - E64).toFixed(2);
	G65 = parseFloat(F65 - E65).toFixed(2);
	G66 = parseFloat(F66 - E66).toFixed(2);
	G67 = parseFloat(F67 - E67).toFixed(2);
	G68 = parseFloat(F68 - E68).toFixed(2);
	G69 = parseFloat(F69 - E69).toFixed(2);
	G70 = parseFloat(F70 - E70).toFixed(2);
	
	G73 = parseFloat(F73 - E73).toFixed(2);
	G74 = parseFloat(F74 - E74).toFixed(2);
	G75 = parseFloat(F75 - E75).toFixed(2);
	G76 = parseFloat(F76 - E76).toFixed(2);
	
	//G78 =
	//G80 = 
	G82 = parseFloat(E82 - F82).toFixed(2);
	G83 = parseFloat(F83 - E83).toFixed(2);
	G84 = parseFloat(E84 - F84).toFixed(2);
	G85 = parseFloat(F85 - E85).toFixed(2);
	//G86 = 
	//G87 = 
	G88 = parseFloat(F88 - E88).toFixed(2);
	G89 = parseFloat(E89 - F89).toFixed(2);

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##G8##', G8);
	sourceContent= replaceAll(sourceContent, '##G9##', G9);
	sourceContent= replaceAll(sourceContent, '##G10##', G10);
	sourceContent= replaceAll(sourceContent, '##G11##', G11);
	sourceContent= replaceAll(sourceContent, '##G12##', G12);
	sourceContent= replaceAll(sourceContent, '##G13##', G13);
	sourceContent= replaceAll(sourceContent, '##G14##', G14);

	sourceContent= replaceAll(sourceContent, '##G18##', G18);
	sourceContent= replaceAll(sourceContent, '##G19##', G19);
	sourceContent= replaceAll(sourceContent, '##G20##', G20);
	sourceContent= replaceAll(sourceContent, '##G21##', G21);
	sourceContent= replaceAll(sourceContent, '##G22##', G22);
	sourceContent= replaceAll(sourceContent, '##G23##', G23);
	sourceContent= replaceAll(sourceContent, '##G24##', G24);
	sourceContent= replaceAll(sourceContent, '##G25##', G25);
	sourceContent= replaceAll(sourceContent, '##G26##', G26);
	sourceContent= replaceAll(sourceContent, '##G27##', G27);
	sourceContent= replaceAll(sourceContent, '##G28##', G28);
	
	sourceContent= replaceAll(sourceContent, '##G31##', G31);
	sourceContent= replaceAll(sourceContent, '##G32##', G32);
	sourceContent= replaceAll(sourceContent, '##G33##', G33);
	sourceContent= replaceAll(sourceContent, '##G34##', G34);
	sourceContent= replaceAll(sourceContent, '##G35##', G35);
	sourceContent= replaceAll(sourceContent, '##G36##', G36);
	sourceContent= replaceAll(sourceContent, '##G37##', G37);
	sourceContent= replaceAll(sourceContent, '##G38##', G38);
	sourceContent= replaceAll(sourceContent, '##G39##', G39);

	sourceContent= replaceAll(sourceContent, '##G42##', G42);
	sourceContent= replaceAll(sourceContent, '##G43##', G43);
	sourceContent= replaceAll(sourceContent, '##G44##', G44);
	sourceContent= replaceAll(sourceContent, '##G45##', G45);
	sourceContent= replaceAll(sourceContent, '##G46##', G46);
	sourceContent= replaceAll(sourceContent, '##G47##', G47);
	sourceContent= replaceAll(sourceContent, '##G48##', G48);

	sourceContent= replaceAll(sourceContent, '##G51##', G51);
	sourceContent= replaceAll(sourceContent, '##G52##', G52);
	sourceContent= replaceAll(sourceContent, '##G53##', G53);
	sourceContent= replaceAll(sourceContent, '##G54##', G54);
	sourceContent= replaceAll(sourceContent, '##G55##', G55);
	sourceContent= replaceAll(sourceContent, '##G56##', G56);
	sourceContent= replaceAll(sourceContent, '##G57##', G57);
	sourceContent= replaceAll(sourceContent, '##G58##', G58);
	sourceContent= replaceAll(sourceContent, '##G59##', G59);
	sourceContent= replaceAll(sourceContent, '##G60##', G60);
	sourceContent= replaceAll(sourceContent, '##G61##', G61);
	sourceContent= replaceAll(sourceContent, '##G62##', G62);
	sourceContent= replaceAll(sourceContent, '##G63##', G63);
	sourceContent= replaceAll(sourceContent, '##G64##', G64);
	sourceContent= replaceAll(sourceContent, '##G65##', G65);
	sourceContent= replaceAll(sourceContent, '##G66##', G66);
	sourceContent= replaceAll(sourceContent, '##G67##', G67);
	sourceContent= replaceAll(sourceContent, '##G68##', G68);
	sourceContent= replaceAll(sourceContent, '##G69##', G69);
	sourceContent= replaceAll(sourceContent, '##G70##', G70);
	
	sourceContent= replaceAll(sourceContent, '##G73##', G73);
	sourceContent= replaceAll(sourceContent, '##G74##', G74);
	sourceContent= replaceAll(sourceContent, '##G75##', G75);
	sourceContent= replaceAll(sourceContent, '##G76##', G76);
	
	//sourceContent= replaceAll(sourceContent, '##G78##', G78);
	
	//sourceContent= replaceAll(sourceContent, '##G80##', G80);
	
	sourceContent= replaceAll(sourceContent, '##G82##', G82);
	sourceContent= replaceAll(sourceContent, '##G83##', G83);
	sourceContent= replaceAll(sourceContent, '##G84##', G84);
	sourceContent= replaceAll(sourceContent, '##G85##', G85);
	//sourceContent= replaceAll(sourceContent, '##G86##', G86);
	//sourceContent= replaceAll(sourceContent, '##G87##', G87);
	sourceContent= replaceAll(sourceContent, '##G88##', G88);
	sourceContent= replaceAll(sourceContent, '##G89##', G89);

	return sourceContent;

}


/***********************************************************************************************************
 * replaceDateRangeVarianceDataPercent - replacing the variance percentage data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceDateRangeVarianceDataPercent(sourceContent)
{
	H8 = divisionByZeroCheck(G8,F8);
	H9 = divisionByZeroCheck(G9,F9);
	H10 = divisionByZeroCheck(G10,F10);
	H11 = divisionByZeroCheck(G11,F11);
	H12 = divisionByZeroCheck(G12,F12);
	H13 = divisionByZeroCheck(G13,F13);
	H14 = divisionByZeroCheck(G14,F14);
	
	H18 = divisionByZeroCheck(G18,F18);
	H19 = divisionByZeroCheck(G19,F19);
	H20 = divisionByZeroCheck(G20,F20);
	H21 = divisionByZeroCheck(G21,F21);
	H22 = divisionByZeroCheck(G22,F22);
	H23 = divisionByZeroCheck(G23,F23);
	H24 = divisionByZeroCheck(G24,F24);
	H25 = divisionByZeroCheck(G25,F25);
	H26 = divisionByZeroCheck(G26,F26);
	H27 = divisionByZeroCheck(G27,F27);
	H28 = divisionByZeroCheck(G28,F28);
	
	H31 = divisionByZeroCheck(G31,F31);
	H32 = divisionByZeroCheck(G32,F32);
	H33 = divisionByZeroCheck(G33,F33);
	H34 = divisionByZeroCheck(G34,F34);
	H35 = divisionByZeroCheck(G35,F35);
	H36 = divisionByZeroCheck(G36,F36);
	H37 = divisionByZeroCheck(G37,F37);
	H38 = divisionByZeroCheck(G38,F38);
	H39 = divisionByZeroCheck(G39,F39);
	
	H42 = divisionByZeroCheck(G42,F42);
	H43 = divisionByZeroCheck(G43,F43);
	H44 = divisionByZeroCheck(G44,F44);
	H45 = divisionByZeroCheck(G45,F45);
	H46 = divisionByZeroCheck(G46,F46);
	H47 = divisionByZeroCheck(G47,F47);
	H48 = divisionByZeroCheck(G48,F48);
	
	H51 = divisionByZeroCheck(G51,F51);
	H52 = divisionByZeroCheck(G52,F52);
	H53 = divisionByZeroCheck(G53,F53);
	H54 = divisionByZeroCheck(G54,F54);
	H55 = divisionByZeroCheck(G55,F55);
	H56 = divisionByZeroCheck(G56,F56);
	H57 = divisionByZeroCheck(G57,F57);
	H58 = divisionByZeroCheck(G58,F58);
	H59 = divisionByZeroCheck(G59,F59);
	H60 = divisionByZeroCheck(G60,F60);
	H61 = divisionByZeroCheck(G61,F61);
	H62 = divisionByZeroCheck(G62,F62);
	H63 = divisionByZeroCheck(G63,F63);
	H64 = divisionByZeroCheck(G64,F64);
	H65 = divisionByZeroCheck(G65,F65);
	H66 = divisionByZeroCheck(G66,F66);
	H67 = divisionByZeroCheck(G67,F67);
	H68 = divisionByZeroCheck(G68,F68);
	H69 = divisionByZeroCheck(G69,F69);
	H70 = divisionByZeroCheck(G70,F70);
	
	H73 = divisionByZeroCheck(G73,F73);
	H74 = divisionByZeroCheck(G74,F74);
	H75 = divisionByZeroCheck(G75,F75);
	H76 = divisionByZeroCheck(G76,F76);
	
	H78 = divisionByZeroCheck(G78,F78);
	
	H82 = parseFloat(divisionByZeroCheck(G82,F82) * 100).toFixed(2);
	H83 = parseFloat(divisionByZeroCheck(G83,F83) * 100).toFixed(2);
	H84 = parseFloat(divisionByZeroCheck(G84,F84) * 100).toFixed(2);
	H85 = parseFloat(divisionByZeroCheck(G85,F85) * 100).toFixed(2);
	H86 = parseFloat(divisionByZeroCheck(G86,F86) * 100).toFixed(2);
	H87 = parseFloat(divisionByZeroCheck(G87,F87) * 100).toFixed(2);
	H88 = parseFloat(divisionByZeroCheck(G88,F88) * 100).toFixed(2);
	H89 = parseFloat(divisionByZeroCheck(G89,F89) * 100).toFixed(2);
	
	

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##H8##', H8);
	sourceContent= replaceAll(sourceContent, '##H9##', H9);
	sourceContent= replaceAll(sourceContent, '##H10##', H10);
	sourceContent= replaceAll(sourceContent, '##H11##', H11);
	sourceContent= replaceAll(sourceContent, '##H12##', H12);
	sourceContent= replaceAll(sourceContent, '##H13##', H13);
	sourceContent= replaceAll(sourceContent, '##H14##', H14);

	sourceContent= replaceAll(sourceContent, '##H18##', H18);
	sourceContent= replaceAll(sourceContent, '##H19##', H19);
	sourceContent= replaceAll(sourceContent, '##H20##', H20);
	sourceContent= replaceAll(sourceContent, '##H21##', H21);
	sourceContent= replaceAll(sourceContent, '##H22##', H22);
	sourceContent= replaceAll(sourceContent, '##H23##', H23);
	sourceContent= replaceAll(sourceContent, '##H24##', H24);
	sourceContent= replaceAll(sourceContent, '##H25##', H25);
	sourceContent= replaceAll(sourceContent, '##H26##', H26);
	sourceContent= replaceAll(sourceContent, '##H27##', H27);
	sourceContent= replaceAll(sourceContent, '##H28##', H28);
	
	sourceContent= replaceAll(sourceContent, '##H31##', H31);
	sourceContent= replaceAll(sourceContent, '##H32##', H32);
	sourceContent= replaceAll(sourceContent, '##H33##', H33);
	sourceContent= replaceAll(sourceContent, '##H34##', H34);
	sourceContent= replaceAll(sourceContent, '##H35##', H35);
	sourceContent= replaceAll(sourceContent, '##H36##', H36);
	sourceContent= replaceAll(sourceContent, '##H37##', H37);
	sourceContent= replaceAll(sourceContent, '##H38##', H38);
	sourceContent= replaceAll(sourceContent, '##H39##', H39);

	sourceContent= replaceAll(sourceContent, '##H42##', H42);
	sourceContent= replaceAll(sourceContent, '##H43##', H43);
	sourceContent= replaceAll(sourceContent, '##H44##', H44);
	sourceContent= replaceAll(sourceContent, '##H45##', H45);
	sourceContent= replaceAll(sourceContent, '##H46##', H46);
	sourceContent= replaceAll(sourceContent, '##H47##', H47);
	sourceContent= replaceAll(sourceContent, '##H48##', H48);

	sourceContent= replaceAll(sourceContent, '##H51##', H51);
	sourceContent= replaceAll(sourceContent, '##H52##', H52);
	sourceContent= replaceAll(sourceContent, '##H53##', H53);
	sourceContent= replaceAll(sourceContent, '##H54##', H54);
	sourceContent= replaceAll(sourceContent, '##H55##', H55);
	sourceContent= replaceAll(sourceContent, '##H56##', H56);
	sourceContent= replaceAll(sourceContent, '##H57##', H57);
	sourceContent= replaceAll(sourceContent, '##H58##', H58);
	sourceContent= replaceAll(sourceContent, '##H59##', H59);
	sourceContent= replaceAll(sourceContent, '##H60##', H60);
	sourceContent= replaceAll(sourceContent, '##H61##', H61);
	sourceContent= replaceAll(sourceContent, '##H62##', H62);
	sourceContent= replaceAll(sourceContent, '##H63##', H63);
	sourceContent= replaceAll(sourceContent, '##H64##', H64);
	sourceContent= replaceAll(sourceContent, '##H65##', H65);
	sourceContent= replaceAll(sourceContent, '##H66##', H66);
	sourceContent= replaceAll(sourceContent, '##H67##', H67);
	sourceContent= replaceAll(sourceContent, '##H68##', H68);
	sourceContent= replaceAll(sourceContent, '##H69##', H69);
	sourceContent= replaceAll(sourceContent, '##H70##', H70);
	
	sourceContent= replaceAll(sourceContent, '##H73##', H73);
	sourceContent= replaceAll(sourceContent, '##H74##', H74);
	sourceContent= replaceAll(sourceContent, '##H75##', H75);
	sourceContent= replaceAll(sourceContent, '##H76##', H76);
	
	//sourceContent= replaceAll(sourceContent, '##H78##', H78);
	
	//sourceContent= replaceAll(sourceContent, '##H80##', H80);
	
	sourceContent= replaceAll(sourceContent, '##H82##', H82);
	sourceContent= replaceAll(sourceContent, '##H83##', H83);
	sourceContent= replaceAll(sourceContent, '##H84##', H84);
	sourceContent= replaceAll(sourceContent, '##H85##', H85);
	//sourceContent= replaceAll(sourceContent, '##H86##', H86);
	//sourceContent= replaceAll(sourceContent, '##H87##', H87);
	sourceContent= replaceAll(sourceContent, '##H88##', H88);
	sourceContent= replaceAll(sourceContent, '##H89##', H89);

	return sourceContent;

}

/***********************************************************************************************************
 * replaceDateRangeBudgetTypeData - replacing the 'budgetType' data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceDateRangeBudgetTypeData(sourceContent)
{	 
	//declaring local variables
	var dateRangeBudgetsSecond = new Array();
	
	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

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
	dateRangeBudgetsSecond = getSearchResults(searchColInternalId);

	if(dateRangeBudgetsSecond !=null)
	{ 

		calculateData(dateRangeBudgetsSecond);

		I8 = revProgrammeFees;
		I9 = revFilmProduction;
		I10 = revStoryWeb;
		I11 = revTsWorkshops;
		I12 = revLaveryRoom;
		I13 = revTravel;
		I14 = revCurrency;
	
		I18 = cosFreelanceStaff;
		I19 = cosFreelanceStaffDelivery;
		I20 = cosExternalDesign;
		I21 = cosSalesCommission;
		I22 = cosStoryWeb;
		I23 = cosPrinting;
		I24 = cosFilmVideo;
		I25 = cosOther;
		I26 = cosTsWorkshops;
		I27 = cosLaveryRoom;
		I28 = cosTravel;
		
		I31 = salSalaries;
		I32 = salErs;
		I33 = salFreelanceStaff;
		I34 = salRedandancy;
		I35 = salCpd;		
		I36 = salNonRechargable;
		I37 = salITCharge;
		I38 = salProfService;
		I39 = salStaffEntertain;
			
		I42 = spaRent;
		I43 = spaRates;
		I44 = spaWaterRates; 
		I45 = spaOfficeCleaning;
		I46 = spaInsurance;
		I47 = spaRepairs;
		I48 = spaRelocation;
		
		I51 = ovePrint;
		I52 = oveRevised;
		I53 = oveTelephoneSystem;
		I54 = oveTelephoneCalls;
		I55 = oveHeat;
		I56 = oveInsurances;
		I57 = oveClientEntertain;
		I58 = oveITCosts;
		I59 = oveITRecovery;
		I60 = oveCompanyMeeting;
		I61 = oveDevCosts;
		I62 = ovePromotion;
		I63 = oveAwards;
		I64 = oveForums;
		I65 = oveMarketing;
		I66 = oveSales;
		I67 = oveUSSales;
		I68 = oveBankCharges;
		I69 = oveRecruitment;
		I70 = oveSunryOffice;
		
		I73 = profAudit;
		I74 = profAccounting;
		I75 = profLegal;
		I76 = profOther;
		
		I78 = operatingProfit;
	
		//I80 = 
		
		I82 = parseFloat(revTotalAmount/1000).toFixed(2);
		I83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		I84 = parseFloat(grossProfit/1000).toFixed(2);
		I85 = parseFloat(employmentCosts/1000).toFixed(2); 
		I86 = parseFloat(propertyCosts/1000).toFixed(2);
		I87 = parseFloat(adminCosts/1000).toFixed(2);
		I88 = parseFloat(professionalFees/1000).toFixed(2);
		I89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##I8##', I8);
	sourceContent= replaceAll(sourceContent, '##I9##', I9);
	sourceContent= replaceAll(sourceContent, '##I10##', I10);
	sourceContent= replaceAll(sourceContent, '##I11##', I11);
	sourceContent= replaceAll(sourceContent, '##I12##', I12);
	sourceContent= replaceAll(sourceContent, '##I13##', I13);
	sourceContent= replaceAll(sourceContent, '##I14##', I14);

	sourceContent= replaceAll(sourceContent, '##I18##', I18);
	sourceContent= replaceAll(sourceContent, '##I19##', I19);
	sourceContent= replaceAll(sourceContent, '##I20##', I20);
	sourceContent= replaceAll(sourceContent, '##I21##', I21);
	sourceContent= replaceAll(sourceContent, '##I22##', I22);
	sourceContent= replaceAll(sourceContent, '##I23##', I23);
	sourceContent= replaceAll(sourceContent, '##I24##', I24);
	sourceContent= replaceAll(sourceContent, '##I25##', I25);
	sourceContent= replaceAll(sourceContent, '##I26##', I26);
	sourceContent= replaceAll(sourceContent, '##I27##', I27);
	sourceContent= replaceAll(sourceContent, '##I28##', I28);
	
	sourceContent= replaceAll(sourceContent, '##I31##', I31);
	sourceContent= replaceAll(sourceContent, '##I32##', I32);
	sourceContent= replaceAll(sourceContent, '##I33##', I33);
	sourceContent= replaceAll(sourceContent, '##I34##', I34);
	sourceContent= replaceAll(sourceContent, '##I35##', I35);
	sourceContent= replaceAll(sourceContent, '##I36##', I36);
	sourceContent= replaceAll(sourceContent, '##I37##', I37);
	sourceContent= replaceAll(sourceContent, '##I38##', I38);
	sourceContent= replaceAll(sourceContent, '##I39##', I39);

	sourceContent= replaceAll(sourceContent, '##I42##', I42);
	sourceContent= replaceAll(sourceContent, '##I43##', I43);
	sourceContent= replaceAll(sourceContent, '##I44##', I44);
	sourceContent= replaceAll(sourceContent, '##I45##', I45);
	sourceContent= replaceAll(sourceContent, '##I46##', I46);
	sourceContent= replaceAll(sourceContent, '##I47##', I47);
	sourceContent= replaceAll(sourceContent, '##I48##', I48);

	sourceContent= replaceAll(sourceContent, '##I51##', I51);
	sourceContent= replaceAll(sourceContent, '##I52##', I52);
	sourceContent= replaceAll(sourceContent, '##I53##', I53);
	sourceContent= replaceAll(sourceContent, '##I54##', I54);
	sourceContent= replaceAll(sourceContent, '##I55##', I55);
	sourceContent= replaceAll(sourceContent, '##I56##', I56);
	sourceContent= replaceAll(sourceContent, '##I57##', I57);
	sourceContent= replaceAll(sourceContent, '##I58##', I58);
	sourceContent= replaceAll(sourceContent, '##I59##', I59);
	sourceContent= replaceAll(sourceContent, '##I60##', I60);
	sourceContent= replaceAll(sourceContent, '##I61##', I61);
	sourceContent= replaceAll(sourceContent, '##I62##', I62);
	sourceContent= replaceAll(sourceContent, '##I63##', I63);
	sourceContent= replaceAll(sourceContent, '##I64##', I64);
	sourceContent= replaceAll(sourceContent, '##I65##', I65);
	sourceContent= replaceAll(sourceContent, '##I66##', I66);
	sourceContent= replaceAll(sourceContent, '##I67##', I67);
	sourceContent= replaceAll(sourceContent, '##I68##', I68);
	sourceContent= replaceAll(sourceContent, '##I69##', I69);
	sourceContent= replaceAll(sourceContent, '##I70##', I70);
	
	sourceContent= replaceAll(sourceContent, '##I73##', I73);
	sourceContent= replaceAll(sourceContent, '##I74##', I74);
	sourceContent= replaceAll(sourceContent, '##I75##', I75);
	sourceContent= replaceAll(sourceContent, '##I76##', I76);
	
	sourceContent= replaceAll(sourceContent, '##I78##', I78);
	
	sourceContent= replaceAll(sourceContent, '##I80##', I80);
	
	sourceContent= replaceAll(sourceContent, '##I82##', I82);
	sourceContent= replaceAll(sourceContent, '##I83##', I83);
	sourceContent= replaceAll(sourceContent, '##I84##', I84);
	sourceContent= replaceAll(sourceContent, '##I85##', I85);
	sourceContent= replaceAll(sourceContent, '##I86##', I86);
	sourceContent= replaceAll(sourceContent, '##I87##', I87);
	sourceContent= replaceAll(sourceContent, '##I88##', I88);
	sourceContent= replaceAll(sourceContent, '##I89##', I89);
	
	return sourceContent;

}



/***********************************************************************************************************
 * replaceDateRangeBudgetTypeVarianceData - replacing the budget Type variance data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *
 **********************************************************************************************************/
function replaceDateRangeBudgetTypeVarianceData(sourceContent)
{
	J8 = parseFloat(E8 - I8).toFixed(2);
	J9 = parseFloat(E9 - I9).toFixed(2);
	J10 = parseFloat(E10 - I10).toFixed(2);
	J11 = parseFloat(E11 - I11).toFixed(2);
	J12 = parseFloat(E12 - I12).toFixed(2);
	J13 = parseFloat(E13 - I13).toFixed(2);
	J14 = parseFloat(E14 - I14).toFixed(2);

	J18 = parseFloat(I18 - E18).toFixed(2);
	J19 = parseFloat(I19 - E19).toFixed(2);
	J20 = parseFloat(I20 - E20).toFixed(2);
	J21 = parseFloat(I21 - E21).toFixed(2);
	J22 = parseFloat(I22 - E22).toFixed(2);
	J23 = parseFloat(I23 - E23).toFixed(2);
	J24 = parseFloat(I24 - E24).toFixed(2);
	J25 = parseFloat(I25 - E25).toFixed(2);
	J26 = parseFloat(I26 - E26).toFixed(2);
	J27 = parseFloat(I27 - E27).toFixed(2);
	J28 = parseFloat(I28 - E28).toFixed(2);
	
	J31 = parseFloat(I31 - E31).toFixed(2);
	J32 = parseFloat(I32 - E32).toFixed(2);
	J33 = parseFloat(I33 - E33).toFixed(2);
	J34 = parseFloat(I34 - E34).toFixed(2);
	J35 = parseFloat(I35 - E35).toFixed(2);
	J36 = parseFloat(I36 - E36).toFixed(2);
	J37 = parseFloat(I37 - E37).toFixed(2);
	J38 = parseFloat(I38 - E38).toFixed(2);
	J39 = parseFloat(I39 - E39).toFixed(2);
	
	J42 = parseFloat(I42 - E42).toFixed(2);
	J43 = parseFloat(I43 - E43).toFixed(2);
	J44 = parseFloat(I44 - E44).toFixed(2);
	J45 = parseFloat(I45 - E45).toFixed(2);
	J46 = parseFloat(I46 - E46).toFixed(2);
	J47 = parseFloat(I47 - E47).toFixed(2);
	J48 = parseFloat(I48 - E48).toFixed(2);
	
	J51 = parseFloat(I51 - E51).toFixed(2);
	J52 = parseFloat(I52 - E52).toFixed(2);
	J53 = parseFloat(I53 - E53).toFixed(2);
	J54 = parseFloat(I54 - E54).toFixed(2);
	J55 = parseFloat(I55 - E55).toFixed(2);
	J56 = parseFloat(I56 - E56).toFixed(2);
	J57 = parseFloat(I57 - E57).toFixed(2);
	J58 = parseFloat(I58 - E58).toFixed(2);
	J59 = parseFloat(I59 - E59).toFixed(2);
	J60 = parseFloat(I60 - E60).toFixed(2);
	J61 = parseFloat(I61 - E61).toFixed(2);
	J62 = parseFloat(I62 - E62).toFixed(2);
	J63 = parseFloat(I63 - E63).toFixed(2);
	J64 = parseFloat(I64 - E64).toFixed(2);
	J65 = parseFloat(I65 - E65).toFixed(2);
	J66 = parseFloat(I66 - E66).toFixed(2);
	J67 = parseFloat(I67 - E67).toFixed(2);
	J68 = parseFloat(I68 - E68).toFixed(2);
	J69 = parseFloat(I69 - E69).toFixed(2);
	J70 = parseFloat(I70 - E70).toFixed(2);
	
	J73 = parseFloat(I73 - E73).toFixed(2);
	J74 = parseFloat(I74 - E74).toFixed(2);
	J75 = parseFloat(I75 - E75).toFixed(2);
	J76 = parseFloat(I76 - E76).toFixed(2);
	
	//J78 =
	//J80 = 
	J82 = parseFloat(E82 - I82).toFixed(2);
	J83 = parseFloat(I83 - E83).toFixed(2);
	J84 = parseFloat(E84 - I84).toFixed(2);
	J85 = parseFloat(I85 - E85).toFixed(2);
	//J86 = 
	//J87 = 
	J88 = parseFloat(I88 - E88).toFixed(2);
	J89 = parseFloat(E89 - I89).toFixed(2);

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##J8##', J8);
	sourceContent= replaceAll(sourceContent, '##J9##', J9);
	sourceContent= replaceAll(sourceContent, '##J10##', J10);
	sourceContent= replaceAll(sourceContent, '##J11##', J11);
	sourceContent= replaceAll(sourceContent, '##J12##', J12);
	sourceContent= replaceAll(sourceContent, '##J13##', J13);
	sourceContent= replaceAll(sourceContent, '##J14##', J14);

	sourceContent= replaceAll(sourceContent, '##J18##', J18);
	sourceContent= replaceAll(sourceContent, '##J19##', J19);
	sourceContent= replaceAll(sourceContent, '##J20##', J20);
	sourceContent= replaceAll(sourceContent, '##J21##', J21);
	sourceContent= replaceAll(sourceContent, '##J22##', J22);
	sourceContent= replaceAll(sourceContent, '##J23##', J23);
	sourceContent= replaceAll(sourceContent, '##J24##', J24);
	sourceContent= replaceAll(sourceContent, '##J25##', J25);
	sourceContent= replaceAll(sourceContent, '##J26##', J26);
	sourceContent= replaceAll(sourceContent, '##J27##', J27);
	sourceContent= replaceAll(sourceContent, '##J28##', J28);
	
	sourceContent= replaceAll(sourceContent, '##J31##', J31);
	sourceContent= replaceAll(sourceContent, '##J32##', J32);
	sourceContent= replaceAll(sourceContent, '##J33##', J33);
	sourceContent= replaceAll(sourceContent, '##J34##', J34);
	sourceContent= replaceAll(sourceContent, '##J35##', J35);
	sourceContent= replaceAll(sourceContent, '##J36##', J36);
	sourceContent= replaceAll(sourceContent, '##J37##', J37);
	sourceContent= replaceAll(sourceContent, '##J38##', J38);
	sourceContent= replaceAll(sourceContent, '##J39##', J39);

	sourceContent= replaceAll(sourceContent, '##J42##', J42);
	sourceContent= replaceAll(sourceContent, '##J43##', J43);
	sourceContent= replaceAll(sourceContent, '##J44##', J44);
	sourceContent= replaceAll(sourceContent, '##J45##', J45);
	sourceContent= replaceAll(sourceContent, '##J46##', J46);
	sourceContent= replaceAll(sourceContent, '##J47##', J47);
	sourceContent= replaceAll(sourceContent, '##J48##', J48);

	sourceContent= replaceAll(sourceContent, '##J51##', J51);
	sourceContent= replaceAll(sourceContent, '##J52##', J52);
	sourceContent= replaceAll(sourceContent, '##J53##', J53);
	sourceContent= replaceAll(sourceContent, '##J54##', J54);
	sourceContent= replaceAll(sourceContent, '##J55##', J55);
	sourceContent= replaceAll(sourceContent, '##J56##', J56);
	sourceContent= replaceAll(sourceContent, '##J57##', J57);
	sourceContent= replaceAll(sourceContent, '##J58##', J58);
	sourceContent= replaceAll(sourceContent, '##J59##', J59);
	sourceContent= replaceAll(sourceContent, '##J60##', J60);
	sourceContent= replaceAll(sourceContent, '##J61##', J61);
	sourceContent= replaceAll(sourceContent, '##J62##', J62);
	sourceContent= replaceAll(sourceContent, '##J63##', J63);
	sourceContent= replaceAll(sourceContent, '##J64##', J64);
	sourceContent= replaceAll(sourceContent, '##J65##', J65);
	sourceContent= replaceAll(sourceContent, '##J66##', J66);
	sourceContent= replaceAll(sourceContent, '##J67##', J67);
	sourceContent= replaceAll(sourceContent, '##J68##', J68);
	sourceContent= replaceAll(sourceContent, '##J69##', J69);
	sourceContent= replaceAll(sourceContent, '##J70##', J70);
	
	sourceContent= replaceAll(sourceContent, '##J73##', J73);
	sourceContent= replaceAll(sourceContent, '##J74##', J74);
	sourceContent= replaceAll(sourceContent, '##J75##', J75);
	sourceContent= replaceAll(sourceContent, '##J76##', J76);
	
	//sourceContent= replaceAll(sourceContent, '##J78##', J78);
	
	//sourceContent= replaceAll(sourceContent, '##J80##', J80);
	
	sourceContent= replaceAll(sourceContent, '##J82##', J82);
	sourceContent= replaceAll(sourceContent, '##J83##', J83);
	sourceContent= replaceAll(sourceContent, '##J84##', J84);
	sourceContent= replaceAll(sourceContent, '##J85##', J85);
	//sourceContent= replaceAll(sourceContent, '##J86##', J86);
	//sourceContent= replaceAll(sourceContent, '##J87##', J87);
	sourceContent= replaceAll(sourceContent, '##J88##', J88);
	sourceContent= replaceAll(sourceContent, '##J89##', J89);

	return sourceContent;

}



/***********************************************************************************************************
 * replaceDateRangeBudgetTypeVarianceDataPercent - replacing the budget type variance percentage data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *
 **********************************************************************************************************/
function replaceDateRangeBudgetTypeVarianceDataPercent(sourceContent)
{
	K8 = divisionByZeroCheck(J8,I8);
	K9 = divisionByZeroCheck(J9,I9);
	K10 = divisionByZeroCheck(J10,I10);
	K11 = divisionByZeroCheck(J11,I11);
	K12 = divisionByZeroCheck(J12,I12);
	K13 = divisionByZeroCheck(J13,I13);
	K14 = divisionByZeroCheck(J14,I14);
	
	K18 = divisionByZeroCheck(J18,I18);
	K19 = divisionByZeroCheck(J19,I19);
	K20 = divisionByZeroCheck(J20,I20);
	K21 = divisionByZeroCheck(J21,I21);
	K22 = divisionByZeroCheck(J22,I22);
	K23 = divisionByZeroCheck(J23,I23);
	K24 = divisionByZeroCheck(J24,I24);
	K25 = divisionByZeroCheck(J25,I25);
	K26 = divisionByZeroCheck(J26,I26);
	K27 = divisionByZeroCheck(J27,I27);
	K28 = divisionByZeroCheck(J28,I28);
	
	K31 = divisionByZeroCheck(J31,I31);
	K32 = divisionByZeroCheck(J32,I32);
	K33 = divisionByZeroCheck(J33,I33);
	K34 = divisionByZeroCheck(J34,I34);
	K35 = divisionByZeroCheck(J35,I35);
	K36 = divisionByZeroCheck(J36,I36);
	K37 = divisionByZeroCheck(J37,I37);
	K38 = divisionByZeroCheck(J38,I38);
	K39 = divisionByZeroCheck(J39,I39);
	
	K42 = divisionByZeroCheck(J42,I42);
	K43 = divisionByZeroCheck(J43,I43);
	K44 = divisionByZeroCheck(J44,I44);
	K45 = divisionByZeroCheck(J45,I45);
	K46 = divisionByZeroCheck(J46,I46);
	K47 = divisionByZeroCheck(J47,I47);
	K48 = divisionByZeroCheck(J48,I48);
	
	K51 = divisionByZeroCheck(J51,I51);
	K52 = divisionByZeroCheck(J52,I52);
	K53 = divisionByZeroCheck(J53,I53);
	K54 = divisionByZeroCheck(J54,I54);
	K55 = divisionByZeroCheck(J55,I55);
	K56 = divisionByZeroCheck(J56,I56);
	K57 = divisionByZeroCheck(J57,I57);
	K58 = divisionByZeroCheck(J58,I58);
	K59 = divisionByZeroCheck(J59,I59);
	K60 = divisionByZeroCheck(J60,I60);
	K61 = divisionByZeroCheck(J61,I61);
	K62 = divisionByZeroCheck(J62,I62);
	K63 = divisionByZeroCheck(J63,I63);
	K64 = divisionByZeroCheck(J64,I64);
	K65 = divisionByZeroCheck(J65,I65);
	K66 = divisionByZeroCheck(J66,I66);
	K67 = divisionByZeroCheck(J67,I67);
	K68 = divisionByZeroCheck(J68,I68);
	K69 = divisionByZeroCheck(J69,I69);
	K70 = divisionByZeroCheck(J70,I70);
	
	K73 = divisionByZeroCheck(J73,I73);
	K74 = divisionByZeroCheck(J74,I74);
	K75 = divisionByZeroCheck(J75,I75);
	K76 = divisionByZeroCheck(J76,I76);
	
	K78 = divisionByZeroCheck(J78,I78);
	
	K82 = parseFloat(divisionByZeroCheck(J82,I82) * 100).toFixed(2);
	K83 = parseFloat(divisionByZeroCheck(J83,I83) * 100).toFixed(2);
	K84 = parseFloat(divisionByZeroCheck(J84,I84) * 100).toFixed(2);
	K85 = parseFloat(divisionByZeroCheck(J85,I85) * 100).toFixed(2);
	K86 = parseFloat(divisionByZeroCheck(J86,I86) * 100).toFixed(2);
	K87 = parseFloat(divisionByZeroCheck(J87,I87) * 100).toFixed(2);
	K88 = parseFloat(divisionByZeroCheck(J88,I88) * 100).toFixed(2);
	K89 = parseFloat(divisionByZeroCheck(J89,I89) * 100).toFixed(2);
	
	

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##K8##', K8);
	sourceContent= replaceAll(sourceContent, '##K9##', K9);
	sourceContent= replaceAll(sourceContent, '##K10##', K10);
	sourceContent= replaceAll(sourceContent, '##K11##', K11);
	sourceContent= replaceAll(sourceContent, '##K12##', K12);
	sourceContent= replaceAll(sourceContent, '##K13##', K13);
	sourceContent= replaceAll(sourceContent, '##K14##', K14);

	sourceContent= replaceAll(sourceContent, '##K18##', K18);
	sourceContent= replaceAll(sourceContent, '##K19##', K19);
	sourceContent= replaceAll(sourceContent, '##K20##', K20);
	sourceContent= replaceAll(sourceContent, '##K21##', K21);
	sourceContent= replaceAll(sourceContent, '##K22##', K22);
	sourceContent= replaceAll(sourceContent, '##K23##', K23);
	sourceContent= replaceAll(sourceContent, '##K24##', K24);
	sourceContent= replaceAll(sourceContent, '##K25##', K25);
	sourceContent= replaceAll(sourceContent, '##K26##', K26);
	sourceContent= replaceAll(sourceContent, '##K27##', K27);
	sourceContent= replaceAll(sourceContent, '##K28##', K28);
	
	sourceContent= replaceAll(sourceContent, '##K31##', K31);
	sourceContent= replaceAll(sourceContent, '##K32##', K32);
	sourceContent= replaceAll(sourceContent, '##K33##', K33);
	sourceContent= replaceAll(sourceContent, '##K34##', K34);
	sourceContent= replaceAll(sourceContent, '##K35##', K35);
	sourceContent= replaceAll(sourceContent, '##K36##', K36);
	sourceContent= replaceAll(sourceContent, '##K37##', K37);
	sourceContent= replaceAll(sourceContent, '##K38##', K38);
	sourceContent= replaceAll(sourceContent, '##K39##', K39);

	sourceContent= replaceAll(sourceContent, '##K42##', K42);
	sourceContent= replaceAll(sourceContent, '##K43##', K43);
	sourceContent= replaceAll(sourceContent, '##K44##', K44);
	sourceContent= replaceAll(sourceContent, '##K45##', K45);
	sourceContent= replaceAll(sourceContent, '##K46##', K46);
	sourceContent= replaceAll(sourceContent, '##K47##', K47);
	sourceContent= replaceAll(sourceContent, '##K48##', K48);

	sourceContent= replaceAll(sourceContent, '##K51##', K51);
	sourceContent= replaceAll(sourceContent, '##K52##', K52);
	sourceContent= replaceAll(sourceContent, '##K53##', K53);
	sourceContent= replaceAll(sourceContent, '##K54##', K54);
	sourceContent= replaceAll(sourceContent, '##K55##', K55);
	sourceContent= replaceAll(sourceContent, '##K56##', K56);
	sourceContent= replaceAll(sourceContent, '##K57##', K57);
	sourceContent= replaceAll(sourceContent, '##K58##', K58);
	sourceContent= replaceAll(sourceContent, '##K59##', K59);
	sourceContent= replaceAll(sourceContent, '##K60##', K60);
	sourceContent= replaceAll(sourceContent, '##K61##', K61);
	sourceContent= replaceAll(sourceContent, '##K62##', K62);
	sourceContent= replaceAll(sourceContent, '##K63##', K63);
	sourceContent= replaceAll(sourceContent, '##K64##', K64);
	sourceContent= replaceAll(sourceContent, '##K65##', K65);
	sourceContent= replaceAll(sourceContent, '##K66##', K66);
	sourceContent= replaceAll(sourceContent, '##K67##', K67);
	sourceContent= replaceAll(sourceContent, '##K68##', K68);
	sourceContent= replaceAll(sourceContent, '##K69##', K69);
	sourceContent= replaceAll(sourceContent, '##K70##', K70);
	
	sourceContent= replaceAll(sourceContent, '##K73##', K73);
	sourceContent= replaceAll(sourceContent, '##K74##', K74);
	sourceContent= replaceAll(sourceContent, '##K75##', K75);
	sourceContent= replaceAll(sourceContent, '##K76##', K76);
	
	//sourceContent= replaceAll(sourceContent, '##K78##', K78);
	
	//sourceContent= replaceAll(sourceContent, '##K80##', K80);
	
	sourceContent= replaceAll(sourceContent, '##K82##', K82);
	sourceContent= replaceAll(sourceContent, '##K83##', K83);
	sourceContent= replaceAll(sourceContent, '##K84##', K84);
	sourceContent= replaceAll(sourceContent, '##K85##', K85);
	//sourceContent= replaceAll(sourceContent, '##K86##', K86);
	//sourceContent= replaceAll(sourceContent, '##K87##', K87);
	sourceContent= replaceAll(sourceContent, '##K88##', K88);
	sourceContent= replaceAll(sourceContent, '##K89##', K89);
	return sourceContent;

}

/***********************************************************************************************************
 * replaceDateRangeLastYearData - replacing the LastYear data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceDateRangeLastYearData(sourceContent)
{
	//declaring local variables
	var dateRangeLastYear = new Array();

	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

	//getting the appropriate search results
	dateRangeLastYear = getSearchResults('custrecord_py_rolling_months_actuals');

	if(dateRangeLastYear !=null)
	{ 

		calculateData(dateRangeLastYear);

		L8 = revProgrammeFees;
		L9 = revFilmProduction;
		L10 = revStoryWeb;
		L11 = revTsWorkshops;
		L12 = revLaveryRoom;
		L13 = revTravel;
		L14 = revCurrency;
	
		L18 = cosFreelanceStaff;
		L19 = cosFreelanceStaffDelivery;
		L20 = cosExternalDesign;
		L21 = cosSalesCommission;
		L22 = cosStoryWeb;
		L23 = cosPrinting;
		L24 = cosFilmVideo;
		L25 = cosOther;
		L26 = cosTsWorkshops;
		L27 = cosLaveryRoom;
		L28 = cosTravel;
		
		L31 = salSalaries;
		L32 = salErs;
		L33 = salFreelanceStaff;
		L34 = salRedandancy;
		L35 = salCpd;		
		L36 = salNonRechargable;
		L37 = salITCharge;
		L38 = salProfService;
		L39 = salStaffEntertain;
			
		L42 = spaRent;
		L43 = spaRates;
		L44 = spaWaterRates; 
		L45 = spaOfficeCleaning;
		L46 = spaInsurance;
		L47 = spaRepairs;
		L48 = spaRelocation;
		
		L51 = ovePrint;
		L52 = oveRevised;
		L53 = oveTelephoneSystem;
		L54 = oveTelephoneCalls;
		L55 = oveHeat;
		L56 = oveInsurances;
		L57 = oveClientEntertain;
		L58 = oveITCosts;
		L59 = oveITRecovery;
		L60 = oveCompanyMeeting;
		L61 = oveDevCosts;
		L62 = ovePromotion;
		L63 = oveAwards;
		L64 = oveForums;
		L65 = oveMarketing;
		L66 = oveSales;
		L67 = oveUSSales;
		L68 = oveBankCharges;
		L69 = oveRecruitment;
		L70 = oveSunryOffice;
		
		L73 = profAudit;
		L74 = profAccounting;
		L75 = profLegal;
		L76 = profOther;
		
		L78 = operatingProfit;
	
		//L80 = 
		
		L82 = parseFloat(revTotalAmount/1000).toFixed(2);
		L83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		L84 = parseFloat(grossProfit/1000).toFixed(2);
		L85 = parseFloat(employmentCosts/1000).toFixed(2); 
		L86 = parseFloat(propertyCosts/1000).toFixed(2);
		L87 = parseFloat(adminCosts/1000).toFixed(2);
		L88 = parseFloat(professionalFees/1000).toFixed(2);
		L89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##L8##', L8);
	sourceContent= replaceAll(sourceContent, '##L9##', L9);
	sourceContent= replaceAll(sourceContent, '##L10##', L10);
	sourceContent= replaceAll(sourceContent, '##L11##', L11);
	sourceContent= replaceAll(sourceContent, '##L12##', L12);
	sourceContent= replaceAll(sourceContent, '##L13##', L13);
	sourceContent= replaceAll(sourceContent, '##L14##', L14);

	sourceContent= replaceAll(sourceContent, '##L18##', L18);
	sourceContent= replaceAll(sourceContent, '##L19##', L19);
	sourceContent= replaceAll(sourceContent, '##L20##', L20);
	sourceContent= replaceAll(sourceContent, '##L21##', L21);
	sourceContent= replaceAll(sourceContent, '##L22##', L22);
	sourceContent= replaceAll(sourceContent, '##L23##', L23);
	sourceContent= replaceAll(sourceContent, '##L24##', L24);
	sourceContent= replaceAll(sourceContent, '##L25##', L25);
	sourceContent= replaceAll(sourceContent, '##L26##', L26);
	sourceContent= replaceAll(sourceContent, '##L27##', L27);
	sourceContent= replaceAll(sourceContent, '##L28##', L28);
	
	sourceContent= replaceAll(sourceContent, '##L31##', L31);
	sourceContent= replaceAll(sourceContent, '##L32##', L32);
	sourceContent= replaceAll(sourceContent, '##L33##', L33);
	sourceContent= replaceAll(sourceContent, '##L34##', L34);
	sourceContent= replaceAll(sourceContent, '##L35##', L35);
	sourceContent= replaceAll(sourceContent, '##L36##', L36);
	sourceContent= replaceAll(sourceContent, '##L37##', L37);
	sourceContent= replaceAll(sourceContent, '##L38##', L38);
	sourceContent= replaceAll(sourceContent, '##L39##', L39);

	sourceContent= replaceAll(sourceContent, '##L42##', L42);
	sourceContent= replaceAll(sourceContent, '##L43##', L43);
	sourceContent= replaceAll(sourceContent, '##L44##', L44);
	sourceContent= replaceAll(sourceContent, '##L45##', L45);
	sourceContent= replaceAll(sourceContent, '##L46##', L46);
	sourceContent= replaceAll(sourceContent, '##L47##', L47);
	sourceContent= replaceAll(sourceContent, '##L48##', L48);

	sourceContent= replaceAll(sourceContent, '##L51##', L51);
	sourceContent= replaceAll(sourceContent, '##L52##', L52);
	sourceContent= replaceAll(sourceContent, '##L53##', L53);
	sourceContent= replaceAll(sourceContent, '##L54##', L54);
	sourceContent= replaceAll(sourceContent, '##L55##', L55);
	sourceContent= replaceAll(sourceContent, '##L56##', L56);
	sourceContent= replaceAll(sourceContent, '##L57##', L57);
	sourceContent= replaceAll(sourceContent, '##L58##', L58);
	sourceContent= replaceAll(sourceContent, '##L59##', L59);
	sourceContent= replaceAll(sourceContent, '##L60##', L60);
	sourceContent= replaceAll(sourceContent, '##L61##', L61);
	sourceContent= replaceAll(sourceContent, '##L62##', L62);
	sourceContent= replaceAll(sourceContent, '##L63##', L63);
	sourceContent= replaceAll(sourceContent, '##L64##', L64);
	sourceContent= replaceAll(sourceContent, '##L65##', L65);
	sourceContent= replaceAll(sourceContent, '##L66##', L66);
	sourceContent= replaceAll(sourceContent, '##L67##', L67);
	sourceContent= replaceAll(sourceContent, '##L68##', L68);
	sourceContent= replaceAll(sourceContent, '##L69##', L69);
	sourceContent= replaceAll(sourceContent, '##L70##', L70);
	
	sourceContent= replaceAll(sourceContent, '##L73##', L73);
	sourceContent= replaceAll(sourceContent, '##L74##', L74);
	sourceContent= replaceAll(sourceContent, '##L75##', L75);
	sourceContent= replaceAll(sourceContent, '##L76##', L76);
	
	sourceContent= replaceAll(sourceContent, '##L78##', L78);
	
	sourceContent= replaceAll(sourceContent, '##L80##', L80);
	
	sourceContent= replaceAll(sourceContent, '##L82##', L82);
	sourceContent= replaceAll(sourceContent, '##L83##', L83);
	sourceContent= replaceAll(sourceContent, '##L84##', L84);
	sourceContent= replaceAll(sourceContent, '##L85##', L85);
	sourceContent= replaceAll(sourceContent, '##L86##', L86);
	sourceContent= replaceAll(sourceContent, '##L87##', L87);
	sourceContent= replaceAll(sourceContent, '##L88##', L88);
	sourceContent= replaceAll(sourceContent, '##L89##', L89);

	return sourceContent;

}


/***********************************************************************************************************
 * replaceDateRangeLastYearChangeData - replacing the last Year change data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *
 **********************************************************************************************************/
function replaceDateRangeLastYearChangeData(sourceContent)
{
	M8 = parseFloat(E8 - L8).toFixed(2);
	M9 = parseFloat(E9 - L9).toFixed(2);
	M10 = parseFloat(E10 - L10).toFixed(2);
	M11 = parseFloat(E11 - L11).toFixed(2);
	M12 = parseFloat(E12 - L12).toFixed(2);
	M13 = parseFloat(E13 - L13).toFixed(2);
	M14 = parseFloat(E14 - L14).toFixed(2);

	M18 = parseFloat(L18 - E18).toFixed(2);
	M19 = parseFloat(L19 - E19).toFixed(2);
	M20 = parseFloat(L20 - E20).toFixed(2);
	M21 = parseFloat(L21 - E21).toFixed(2);
	M22 = parseFloat(L22 - E22).toFixed(2);
	M23 = parseFloat(L23 - E23).toFixed(2);
	M24 = parseFloat(L24 - E24).toFixed(2);
	M25 = parseFloat(L25 - E25).toFixed(2);
	M26 = parseFloat(L26 - E26).toFixed(2);
	M27 = parseFloat(L27 - E27).toFixed(2);
	M28 = parseFloat(L28 - E28).toFixed(2);
	
	M31 = parseFloat(L31 - E31).toFixed(2);
	M32 = parseFloat(L32 - E32).toFixed(2);
	M33 = parseFloat(L33 - E33).toFixed(2);
	M34 = parseFloat(L34 - E34).toFixed(2);
	M35 = parseFloat(L35 - E35).toFixed(2);
	M36 = parseFloat(L36 - E36).toFixed(2);
	M37 = parseFloat(L37 - E37).toFixed(2);
	M38 = parseFloat(L38 - E38).toFixed(2);
	M39 = parseFloat(L39 - E39).toFixed(2);
	
	M42 = parseFloat(L42 - E42).toFixed(2);
	M43 = parseFloat(L43 - E43).toFixed(2);
	M44 = parseFloat(L44 - E44).toFixed(2);
	M45 = parseFloat(L45 - E45).toFixed(2);
	M46 = parseFloat(L46 - E46).toFixed(2);
	M47 = parseFloat(L47 - E47).toFixed(2);
	M48 = parseFloat(L48 - E48).toFixed(2);
	
	M51 = parseFloat(L51 - E51).toFixed(2);
	M52 = parseFloat(L52 - E52).toFixed(2);
	M53 = parseFloat(L53 - E53).toFixed(2);
	M54 = parseFloat(L54 - E54).toFixed(2);
	M55 = parseFloat(L55 - E55).toFixed(2);
	M56 = parseFloat(L56 - E56).toFixed(2);
	M57 = parseFloat(L57 - E57).toFixed(2);
	M58 = parseFloat(L58 - E58).toFixed(2);
	M59 = parseFloat(L59 - E59).toFixed(2);
	M60 = parseFloat(L60 - E60).toFixed(2);
	M61 = parseFloat(L61 - E61).toFixed(2);
	M62 = parseFloat(L62 - E62).toFixed(2);
	M63 = parseFloat(L63 - E63).toFixed(2);
	M64 = parseFloat(L64 - E64).toFixed(2);
	M65 = parseFloat(L65 - E65).toFixed(2);
	M66 = parseFloat(L66 - E66).toFixed(2);
	M67 = parseFloat(L67 - E67).toFixed(2);
	M68 = parseFloat(L68 - E68).toFixed(2);
	M69 = parseFloat(L69 - E69).toFixed(2);
	M70 = parseFloat(L70 - E70).toFixed(2);
	
	M73 = parseFloat(L73 - E73).toFixed(2);
	M74 = parseFloat(L74 - E74).toFixed(2);
	M75 = parseFloat(L75 - E75).toFixed(2);
	M76 = parseFloat(L76 - E76).toFixed(2);
	
	//M78 =
	//M80 = 
	M82 = parseFloat(E82 - L82).toFixed(2);
	M83 = parseFloat(L83 - E83).toFixed(2);
	M84 = parseFloat(E84 - L84).toFixed(2);
	M85 = parseFloat(L85 - E85).toFixed(2);
	//M86 = 
	//M87 = 
	M88 = parseFloat(L88 - E88).toFixed(2);
	M89 = parseFloat(E89 - L89).toFixed(2);

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##M8##', M8);
	sourceContent= replaceAll(sourceContent, '##M9##', M9);
	sourceContent= replaceAll(sourceContent, '##M10##', M10);
	sourceContent= replaceAll(sourceContent, '##M11##', M11);
	sourceContent= replaceAll(sourceContent, '##M12##', M12);
	sourceContent= replaceAll(sourceContent, '##M13##', M13);
	sourceContent= replaceAll(sourceContent, '##M14##', M14);

	sourceContent= replaceAll(sourceContent, '##M18##', M18);
	sourceContent= replaceAll(sourceContent, '##M19##', M19);
	sourceContent= replaceAll(sourceContent, '##M20##', M20);
	sourceContent= replaceAll(sourceContent, '##M21##', M21);
	sourceContent= replaceAll(sourceContent, '##M22##', M22);
	sourceContent= replaceAll(sourceContent, '##M23##', M23);
	sourceContent= replaceAll(sourceContent, '##M24##', M24);
	sourceContent= replaceAll(sourceContent, '##M25##', M25);
	sourceContent= replaceAll(sourceContent, '##M26##', M26);
	sourceContent= replaceAll(sourceContent, '##M27##', M27);
	sourceContent= replaceAll(sourceContent, '##M28##', M28);
	
	sourceContent= replaceAll(sourceContent, '##M31##', M31);
	sourceContent= replaceAll(sourceContent, '##M32##', M32);
	sourceContent= replaceAll(sourceContent, '##M33##', M33);
	sourceContent= replaceAll(sourceContent, '##M34##', M34);
	sourceContent= replaceAll(sourceContent, '##M35##', M35);
	sourceContent= replaceAll(sourceContent, '##M36##', M36);
	sourceContent= replaceAll(sourceContent, '##M37##', M37);
	sourceContent= replaceAll(sourceContent, '##M38##', M38);
	sourceContent= replaceAll(sourceContent, '##M39##', M39);

	sourceContent= replaceAll(sourceContent, '##M42##', M42);
	sourceContent= replaceAll(sourceContent, '##M43##', M43);
	sourceContent= replaceAll(sourceContent, '##M44##', M44);
	sourceContent= replaceAll(sourceContent, '##M45##', M45);
	sourceContent= replaceAll(sourceContent, '##M46##', M46);
	sourceContent= replaceAll(sourceContent, '##M47##', M47);
	sourceContent= replaceAll(sourceContent, '##M48##', M48);

	sourceContent= replaceAll(sourceContent, '##M51##', M51);
	sourceContent= replaceAll(sourceContent, '##M52##', M52);
	sourceContent= replaceAll(sourceContent, '##M53##', M53);
	sourceContent= replaceAll(sourceContent, '##M54##', M54);
	sourceContent= replaceAll(sourceContent, '##M55##', M55);
	sourceContent= replaceAll(sourceContent, '##M56##', M56);
	sourceContent= replaceAll(sourceContent, '##M57##', M57);
	sourceContent= replaceAll(sourceContent, '##M58##', M58);
	sourceContent= replaceAll(sourceContent, '##M59##', M59);
	sourceContent= replaceAll(sourceContent, '##M60##', M60);
	sourceContent= replaceAll(sourceContent, '##M61##', M61);
	sourceContent= replaceAll(sourceContent, '##M62##', M62);
	sourceContent= replaceAll(sourceContent, '##M63##', M63);
	sourceContent= replaceAll(sourceContent, '##M64##', M64);
	sourceContent= replaceAll(sourceContent, '##M65##', M65);
	sourceContent= replaceAll(sourceContent, '##M66##', M66);
	sourceContent= replaceAll(sourceContent, '##M67##', M67);
	sourceContent= replaceAll(sourceContent, '##M68##', M68);
	sourceContent= replaceAll(sourceContent, '##M69##', M69);
	sourceContent= replaceAll(sourceContent, '##M70##', M70);
	
	sourceContent= replaceAll(sourceContent, '##M73##', M73);
	sourceContent= replaceAll(sourceContent, '##M74##', M74);
	sourceContent= replaceAll(sourceContent, '##M75##', M75);
	sourceContent= replaceAll(sourceContent, '##M76##', M76);
	
	//sourceContent= replaceAll(sourceContent, '##M78##', M78);
	
	//sourceContent= replaceAll(sourceContent, '##M80##', M80);
	
	sourceContent= replaceAll(sourceContent, '##M82##', M82);
	sourceContent= replaceAll(sourceContent, '##M83##', M83);
	sourceContent= replaceAll(sourceContent, '##M84##', M84);
	sourceContent= replaceAll(sourceContent, '##M85##', M85);
	//sourceContent= replaceAll(sourceContent, '##M86##', M86);
	//sourceContent= replaceAll(sourceContent, '##M87##', M87);
	sourceContent= replaceAll(sourceContent, '##M88##', M88);
	sourceContent= replaceAll(sourceContent, '##M89##', M89);

	return sourceContent;

}



/***********************************************************************************************************
 * replaceDateRangeLastYearChangeDataPercent - replacing the last year change percentage data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *
 **********************************************************************************************************/
function replaceDateRangeLastYearChangeDataPercent(sourceContent)
{
	N8 = divisionByZeroCheck(M8,L8);
	N9 = divisionByZeroCheck(M9,L9);
	N10 = divisionByZeroCheck(M10,L10);
	N11 = divisionByZeroCheck(M11,L11);
	N12 = divisionByZeroCheck(M12,L12);
	N13 = divisionByZeroCheck(M13,L13);
	N14 = divisionByZeroCheck(M14,L14);
	
	N18 = divisionByZeroCheck(M18,L18);
	N19 = divisionByZeroCheck(M19,L19);
	N20 = divisionByZeroCheck(M20,L20);
	N21 = divisionByZeroCheck(M21,L21);
	N22 = divisionByZeroCheck(M22,L22);
	N23 = divisionByZeroCheck(M23,L23);
	N24 = divisionByZeroCheck(M24,L24);
	N25 = divisionByZeroCheck(M25,L25);
	N26 = divisionByZeroCheck(M26,L26);
	N27 = divisionByZeroCheck(M27,L27);
	N28 = divisionByZeroCheck(M28,L28);
	
	N31 = divisionByZeroCheck(M31,L31);
	N32 = divisionByZeroCheck(M32,L32);
	N33 = divisionByZeroCheck(M33,L33);
	N34 = divisionByZeroCheck(M34,L34);
	N35 = divisionByZeroCheck(M35,L35);
	N36 = divisionByZeroCheck(M36,L36);
	N37 = divisionByZeroCheck(M37,L37);
	N38 = divisionByZeroCheck(M38,L38);
	N39 = divisionByZeroCheck(M39,L39);
	
	N42 = divisionByZeroCheck(M42,L42);
	N43 = divisionByZeroCheck(M43,L43);
	N44 = divisionByZeroCheck(M44,L44);
	N45 = divisionByZeroCheck(M45,L45);
	N46 = divisionByZeroCheck(M46,L46);
	N47 = divisionByZeroCheck(M47,L47);
	N48 = divisionByZeroCheck(M48,L48);
	
	N51 = divisionByZeroCheck(M51,L51);
	N52 = divisionByZeroCheck(M52,L52);
	N53 = divisionByZeroCheck(M53,L53);
	N54 = divisionByZeroCheck(M54,L54);
	N55 = divisionByZeroCheck(M55,L55);
	N56 = divisionByZeroCheck(M56,L56);
	N57 = divisionByZeroCheck(M57,L57);
	N58 = divisionByZeroCheck(M58,L58);
	N59 = divisionByZeroCheck(M59,L59);
	N60 = divisionByZeroCheck(M60,L60);
	N61 = divisionByZeroCheck(M61,L61);
	N62 = divisionByZeroCheck(M62,L62);
	N63 = divisionByZeroCheck(M63,L63);
	N64 = divisionByZeroCheck(M64,L64);
	N65 = divisionByZeroCheck(M65,L65);
	N66 = divisionByZeroCheck(M66,L66);
	N67 = divisionByZeroCheck(M67,L67);
	N68 = divisionByZeroCheck(M68,L68);
	N69 = divisionByZeroCheck(M69,L69);
	N70 = divisionByZeroCheck(M70,L70);
	
	N73 = divisionByZeroCheck(M73,L73);
	N74 = divisionByZeroCheck(M74,L74);
	N75 = divisionByZeroCheck(M75,L75);
	N76 = divisionByZeroCheck(M76,L76);
	
	N78 = divisionByZeroCheck(M78,L78);
	
	N82 = parseFloat(divisionByZeroCheck(M82,L82) * 100).toFixed(2);
	N83 = parseFloat(divisionByZeroCheck(M83,L83) * 100).toFixed(2);
	N84 = parseFloat(divisionByZeroCheck(M84,L84) * 100).toFixed(2);
	N85 = parseFloat(divisionByZeroCheck(M85,L85) * 100).toFixed(2);
	N86 = parseFloat(divisionByZeroCheck(M86,L86) * 100).toFixed(2);
	N87 = parseFloat(divisionByZeroCheck(M87,L87) * 100).toFixed(2);
	N88 = parseFloat(divisionByZeroCheck(M88,L88) * 100).toFixed(2);
	N89 = parseFloat(divisionByZeroCheck(M89,L89) * 100).toFixed(2);
	
	

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##N8##', N8);
	sourceContent= replaceAll(sourceContent, '##N9##', N9);
	sourceContent= replaceAll(sourceContent, '##N10##', N10);
	sourceContent= replaceAll(sourceContent, '##N11##', N11);
	sourceContent= replaceAll(sourceContent, '##N12##', N12);
	sourceContent= replaceAll(sourceContent, '##N13##', N13);
	sourceContent= replaceAll(sourceContent, '##N14##', N14);

	sourceContent= replaceAll(sourceContent, '##N18##', N18);
	sourceContent= replaceAll(sourceContent, '##N19##', N19);
	sourceContent= replaceAll(sourceContent, '##N20##', N20);
	sourceContent= replaceAll(sourceContent, '##N21##', N21);
	sourceContent= replaceAll(sourceContent, '##N22##', N22);
	sourceContent= replaceAll(sourceContent, '##N23##', N23);
	sourceContent= replaceAll(sourceContent, '##N24##', N24);
	sourceContent= replaceAll(sourceContent, '##N25##', N25);
	sourceContent= replaceAll(sourceContent, '##N26##', N26);
	sourceContent= replaceAll(sourceContent, '##N27##', N27);
	sourceContent= replaceAll(sourceContent, '##N28##', N28);
	
	sourceContent= replaceAll(sourceContent, '##N31##', N31);
	sourceContent= replaceAll(sourceContent, '##N32##', N32);
	sourceContent= replaceAll(sourceContent, '##N33##', N33);
	sourceContent= replaceAll(sourceContent, '##N34##', N34);
	sourceContent= replaceAll(sourceContent, '##N35##', N35);
	sourceContent= replaceAll(sourceContent, '##N36##', N36);
	sourceContent= replaceAll(sourceContent, '##N37##', N37);
	sourceContent= replaceAll(sourceContent, '##N38##', N38);
	sourceContent= replaceAll(sourceContent, '##N39##', N39);

	sourceContent= replaceAll(sourceContent, '##N42##', N42);
	sourceContent= replaceAll(sourceContent, '##N43##', N43);
	sourceContent= replaceAll(sourceContent, '##N44##', N44);
	sourceContent= replaceAll(sourceContent, '##N45##', N45);
	sourceContent= replaceAll(sourceContent, '##N46##', N46);
	sourceContent= replaceAll(sourceContent, '##N47##', N47);
	sourceContent= replaceAll(sourceContent, '##N48##', N48);

	sourceContent= replaceAll(sourceContent, '##N51##', N51);
	sourceContent= replaceAll(sourceContent, '##N52##', N52);
	sourceContent= replaceAll(sourceContent, '##N53##', N53);
	sourceContent= replaceAll(sourceContent, '##N54##', N54);
	sourceContent= replaceAll(sourceContent, '##N55##', N55);
	sourceContent= replaceAll(sourceContent, '##N56##', N56);
	sourceContent= replaceAll(sourceContent, '##N57##', N57);
	sourceContent= replaceAll(sourceContent, '##N58##', N58);
	sourceContent= replaceAll(sourceContent, '##N59##', N59);
	sourceContent= replaceAll(sourceContent, '##N60##', N60);
	sourceContent= replaceAll(sourceContent, '##N61##', N61);
	sourceContent= replaceAll(sourceContent, '##N62##', N62);
	sourceContent= replaceAll(sourceContent, '##N63##', N63);
	sourceContent= replaceAll(sourceContent, '##N64##', N64);
	sourceContent= replaceAll(sourceContent, '##N65##', N65);
	sourceContent= replaceAll(sourceContent, '##N66##', N66);
	sourceContent= replaceAll(sourceContent, '##N67##', N67);
	sourceContent= replaceAll(sourceContent, '##N68##', N68);
	sourceContent= replaceAll(sourceContent, '##N69##', N69);
	sourceContent= replaceAll(sourceContent, '##N70##', N70);
	
	sourceContent= replaceAll(sourceContent, '##N73##', N73);
	sourceContent= replaceAll(sourceContent, '##N74##', N74);
	sourceContent= replaceAll(sourceContent, '##N75##', N75);
	sourceContent= replaceAll(sourceContent, '##N76##', N76);
	
	//sourceContent= replaceAll(sourceContent, '##N78##', N78);
	
	//sourceContent= replaceAll(sourceContent, '##N80##', N80);
	
	sourceContent= replaceAll(sourceContent, '##N82##', N82);
	sourceContent= replaceAll(sourceContent, '##N83##', N83);
	sourceContent= replaceAll(sourceContent, '##N84##', N84);
	sourceContent= replaceAll(sourceContent, '##N85##', N85);
	//sourceContent= replaceAll(sourceContent, '##N86##', N86);
	//sourceContent= replaceAll(sourceContent, '##N87##', N87);
	sourceContent= replaceAll(sourceContent, '##N88##', N88);
	sourceContent= replaceAll(sourceContent, '##N89##', N89);

	return sourceContent;

}


/***********************************************************************************************************
 * replaceYearToDateActualsData - replacing the year-to-date actuals data 
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateActualsData(sourceContent)
{
	//declaring local variables
	var yearToDateActuals = new Array();

	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

	//getting the appropriate search results
	yearToDateActuals = getSearchResults('custrecord_year_to_date_actuals');

	if(yearToDateActuals !=null)
	{ 
		calculateData(yearToDateActuals);
		P8 = revProgrammeFees;
		P9 = revFilmProduction;
		P10 = revStoryWeb;
		P11 = revTsWorkshops;
		P12 = revLaveryRoom;
		P13 = revTravel;
		P14 = revCurrency;
	
		P18 = cosFreelanceStaff;
		P19 = cosFreelanceStaffDelivery;
		P20 = cosExternalDesign;
		P21 = cosSalesCommission;
		P22 = cosStoryWeb;
		P23 = cosPrinting;
		P24 = cosFilmVideo;
		P25 = cosOther;
		P26 = cosTsWorkshops;
		P27 = cosLaveryRoom;
		P28 = cosTravel;
		
		P31 = salSalaries;
		P32 = salErs;
		P33 = salFreelanceStaff;
		P34 = salRedandancy;
		P35 = salCpd;		
		P36 = salNonRechargable;
		P37 = salITCharge;
		P38 = salProfService;
		P39 = salStaffEntertain;
			
		P42 = spaRent;
		P43 = spaRates;
		P44 = spaWaterRates; 
		P45 = spaOfficeCleaning;
		P46 = spaInsurance;
		P47 = spaRepairs;
		P48 = spaRelocation;
		
		P51 = ovePrint;
		P52 = oveRevised;
		P53 = oveTelephoneSystem;
		P54 = oveTelephoneCalls;
		P55 = oveHeat;
		P56 = oveInsurances;
		P57 = oveClientEntertain;
		P58 = oveITCosts;
		P59 = oveITRecovery;
		P60 = oveCompanyMeeting;
		P61 = oveDevCosts;
		P62 = ovePromotion;
		P63 = oveAwards;
		P64 = oveForums;
		P65 = oveMarketing;
		P66 = oveSales;
		P67 = oveUSSales;
		P68 = oveBankCharges;
		P69 = oveRecruitment;
		P70 = oveSunryOffice;
		
		P73 = profAudit;
		P74 = profAccounting;
		P75 = profLegal;
		P76 = profOther;
		
		P78 = operatingProfit;
	
		//P80 = 
		
		P82 = parseFloat(revTotalAmount/1000).toFixed(2);
		P83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		P84 = parseFloat(grossProfit/1000).toFixed(2);
		P85 = parseFloat(employmentCosts/1000).toFixed(2); 
		P86 = parseFloat(propertyCosts/1000).toFixed(2);
		P87 = parseFloat(adminCosts/1000).toFixed(2);
		P88 = parseFloat(professionalFees/1000).toFixed(2);
		P89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##P8##', P8);
	sourceContent= replaceAll(sourceContent, '##P9##', P9);
	sourceContent= replaceAll(sourceContent, '##P10##', P10);
	sourceContent= replaceAll(sourceContent, '##P11##', P11);
	sourceContent= replaceAll(sourceContent, '##P12##', P12);
	sourceContent= replaceAll(sourceContent, '##P13##', P13);
	sourceContent= replaceAll(sourceContent, '##P14##', P14);

	sourceContent= replaceAll(sourceContent, '##P18##', P18);
	sourceContent= replaceAll(sourceContent, '##P19##', P19);
	sourceContent= replaceAll(sourceContent, '##P20##', P20);
	sourceContent= replaceAll(sourceContent, '##P21##', P21);
	sourceContent= replaceAll(sourceContent, '##P22##', P22);
	sourceContent= replaceAll(sourceContent, '##P23##', P23);
	sourceContent= replaceAll(sourceContent, '##P24##', P24);
	sourceContent= replaceAll(sourceContent, '##P25##', P25);
	sourceContent= replaceAll(sourceContent, '##P26##', P26);
	sourceContent= replaceAll(sourceContent, '##P27##', P27);
	sourceContent= replaceAll(sourceContent, '##P28##', P28);
	
	sourceContent= replaceAll(sourceContent, '##P31##', P31);
	sourceContent= replaceAll(sourceContent, '##P32##', P32);
	sourceContent= replaceAll(sourceContent, '##P33##', P33);
	sourceContent= replaceAll(sourceContent, '##P34##', P34);
	sourceContent= replaceAll(sourceContent, '##P35##', P35);
	sourceContent= replaceAll(sourceContent, '##P36##', P36);
	sourceContent= replaceAll(sourceContent, '##P37##', P37);
	sourceContent= replaceAll(sourceContent, '##P38##', P38);
	sourceContent= replaceAll(sourceContent, '##P39##', P39);

	sourceContent= replaceAll(sourceContent, '##P42##', P42);
	sourceContent= replaceAll(sourceContent, '##P43##', P43);
	sourceContent= replaceAll(sourceContent, '##P44##', P44);
	sourceContent= replaceAll(sourceContent, '##P45##', P45);
	sourceContent= replaceAll(sourceContent, '##P46##', P46);
	sourceContent= replaceAll(sourceContent, '##P47##', P47);
	sourceContent= replaceAll(sourceContent, '##P48##', P48);

	sourceContent= replaceAll(sourceContent, '##P51##', P51);
	sourceContent= replaceAll(sourceContent, '##P52##', P52);
	sourceContent= replaceAll(sourceContent, '##P53##', P53);
	sourceContent= replaceAll(sourceContent, '##P54##', P54);
	sourceContent= replaceAll(sourceContent, '##P55##', P55);
	sourceContent= replaceAll(sourceContent, '##P56##', P56);
	sourceContent= replaceAll(sourceContent, '##P57##', P57);
	sourceContent= replaceAll(sourceContent, '##P58##', P58);
	sourceContent= replaceAll(sourceContent, '##P59##', P59);
	sourceContent= replaceAll(sourceContent, '##P60##', P60);
	sourceContent= replaceAll(sourceContent, '##P61##', P61);
	sourceContent= replaceAll(sourceContent, '##P62##', P62);
	sourceContent= replaceAll(sourceContent, '##P63##', P63);
	sourceContent= replaceAll(sourceContent, '##P64##', P64);
	sourceContent= replaceAll(sourceContent, '##P65##', P65);
	sourceContent= replaceAll(sourceContent, '##P66##', P66);
	sourceContent= replaceAll(sourceContent, '##P67##', P67);
	sourceContent= replaceAll(sourceContent, '##P68##', P68);
	sourceContent= replaceAll(sourceContent, '##P69##', P69);
	sourceContent= replaceAll(sourceContent, '##P70##', P70);
	
	sourceContent= replaceAll(sourceContent, '##P73##', P73);
	sourceContent= replaceAll(sourceContent, '##P74##', P74);
	sourceContent= replaceAll(sourceContent, '##P75##', P75);
	sourceContent= replaceAll(sourceContent, '##P76##', P76);
	
	sourceContent= replaceAll(sourceContent, '##P78##', P78);
	
	sourceContent= replaceAll(sourceContent, '##P80##', P80);
	
	sourceContent= replaceAll(sourceContent, '##P82##', P82);
	sourceContent= replaceAll(sourceContent, '##P83##', P83);
	sourceContent= replaceAll(sourceContent, '##P84##', P84);
	sourceContent= replaceAll(sourceContent, '##P85##', P85);
	sourceContent= replaceAll(sourceContent, '##P86##', P86);
	sourceContent= replaceAll(sourceContent, '##P87##', P87);
	sourceContent= replaceAll(sourceContent, '##P88##', P88);
	sourceContent= replaceAll(sourceContent, '##P89##', P89);

	return sourceContent;

}


/***********************************************************************************************************
 * replaceYearToDateBudgetsData - replacing the year-to-date budgets data 
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateBudgetsData(sourceContent)
{
	//declaring local variables

	var yearToDateBudgets = new Array();


	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

	//getting the appropriate search results
	yearToDateBudgets = getSearchResults('custrecord_year_to_date_budgets_main');

	if(yearToDateBudgets !=null)
	{ 
		calculateData(yearToDateBudgets);

		Q8 = revProgrammeFees;
		Q9 = revFilmProduction;
		Q10 = revStoryWeb;
		Q11 = revTsWorkshops;
		Q12 = revLaveryRoom;
		Q13 = revTravel;
		Q14 = revCurrency;
	
		Q18 = cosFreelanceStaff;
		Q19 = cosFreelanceStaffDelivery;
		Q20 = cosExternalDesign;
		Q21 = cosSalesCommission;
		Q22 = cosStoryWeb;
		Q23 = cosPrinting;
		Q24 = cosFilmVideo;
		Q25 = cosOther;
		Q26 = cosTsWorkshops;
		Q27 = cosLaveryRoom;
		Q28 = cosTravel;
		
		Q31 = salSalaries;
		Q32 = salErs;
		Q33 = salFreelanceStaff;
		Q34 = salRedandancy;
		Q35 = salCpd;		
		Q36 = salNonRechargable;
		Q37 = salITCharge;
		Q38 = salProfService;
		Q39 = salStaffEntertain;
			
		Q42 = spaRent;
		Q43 = spaRates;
		Q44 = spaWaterRates; 
		Q45 = spaOfficeCleaning;
		Q46 = spaInsurance;
		Q47 = spaRepairs;
		Q48 = spaRelocation;
		
		Q51 = ovePrint;
		Q52 = oveRevised;
		Q53 = oveTelephoneSystem;
		Q54 = oveTelephoneCalls;
		Q55 = oveHeat;
		Q56 = oveInsurances;
		Q57 = oveClientEntertain;
		Q58 = oveITCosts;
		Q59 = oveITRecovery;
		Q60 = oveCompanyMeeting;
		Q61 = oveDevCosts;
		Q62 = ovePromotion;
		Q63 = oveAwards;
		Q64 = oveForums;
		Q65 = oveMarketing;
		Q66 = oveSales;
		Q67 = oveUSSales;
		Q68 = oveBankCharges;
		Q69 = oveRecruitment;
		Q70 = oveSunryOffice;
		
		Q73 = profAudit;
		Q74 = profAccounting;
		Q75 = profLegal;
		Q76 = profOther;
		
		Q78 = operatingProfit;
	
		//Q80 = 
		
		Q82 = parseFloat(revTotalAmount/1000).toFixed(2);
		Q83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		Q84 = parseFloat(grossProfit/1000).toFixed(2);
		Q85 = parseFloat(employmentCosts/1000).toFixed(2); 
		Q86 = parseFloat(propertyCosts/1000).toFixed(2);
		Q87 = parseFloat(adminCosts/1000).toFixed(2);
		Q88 = parseFloat(professionalFees/1000).toFixed(2);
		Q89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##Q8##', Q8);
	sourceContent= replaceAll(sourceContent, '##Q9##', Q9);
	sourceContent= replaceAll(sourceContent, '##Q10##', Q10);
	sourceContent= replaceAll(sourceContent, '##Q11##', Q11);
	sourceContent= replaceAll(sourceContent, '##Q12##', Q12);
	sourceContent= replaceAll(sourceContent, '##Q13##', Q13);
	sourceContent= replaceAll(sourceContent, '##Q14##', Q14);

	sourceContent= replaceAll(sourceContent, '##Q18##', Q18);
	sourceContent= replaceAll(sourceContent, '##Q19##', Q19);
	sourceContent= replaceAll(sourceContent, '##Q20##', Q20);
	sourceContent= replaceAll(sourceContent, '##Q21##', Q21);
	sourceContent= replaceAll(sourceContent, '##Q22##', Q22);
	sourceContent= replaceAll(sourceContent, '##Q23##', Q23);
	sourceContent= replaceAll(sourceContent, '##Q24##', Q24);
	sourceContent= replaceAll(sourceContent, '##Q25##', Q25);
	sourceContent= replaceAll(sourceContent, '##Q26##', Q26);
	sourceContent= replaceAll(sourceContent, '##Q27##', Q27);
	sourceContent= replaceAll(sourceContent, '##Q28##', Q28);
	
	sourceContent= replaceAll(sourceContent, '##Q31##', Q31);
	sourceContent= replaceAll(sourceContent, '##Q32##', Q32);
	sourceContent= replaceAll(sourceContent, '##Q33##', Q33);
	sourceContent= replaceAll(sourceContent, '##Q34##', Q34);
	sourceContent= replaceAll(sourceContent, '##Q35##', Q35);
	sourceContent= replaceAll(sourceContent, '##Q36##', Q36);
	sourceContent= replaceAll(sourceContent, '##Q37##', Q37);
	sourceContent= replaceAll(sourceContent, '##Q38##', Q38);
	sourceContent= replaceAll(sourceContent, '##Q39##', Q39);

	sourceContent= replaceAll(sourceContent, '##Q42##', Q42);
	sourceContent= replaceAll(sourceContent, '##Q43##', Q43);
	sourceContent= replaceAll(sourceContent, '##Q44##', Q44);
	sourceContent= replaceAll(sourceContent, '##Q45##', Q45);
	sourceContent= replaceAll(sourceContent, '##Q46##', Q46);
	sourceContent= replaceAll(sourceContent, '##Q47##', Q47);
	sourceContent= replaceAll(sourceContent, '##Q48##', Q48);

	sourceContent= replaceAll(sourceContent, '##Q51##', Q51);
	sourceContent= replaceAll(sourceContent, '##Q52##', Q52);
	sourceContent= replaceAll(sourceContent, '##Q53##', Q53);
	sourceContent= replaceAll(sourceContent, '##Q54##', Q54);
	sourceContent= replaceAll(sourceContent, '##Q55##', Q55);
	sourceContent= replaceAll(sourceContent, '##Q56##', Q56);
	sourceContent= replaceAll(sourceContent, '##Q57##', Q57);
	sourceContent= replaceAll(sourceContent, '##Q58##', Q58);
	sourceContent= replaceAll(sourceContent, '##Q59##', Q59);
	sourceContent= replaceAll(sourceContent, '##Q60##', Q60);
	sourceContent= replaceAll(sourceContent, '##Q61##', Q61);
	sourceContent= replaceAll(sourceContent, '##Q62##', Q62);
	sourceContent= replaceAll(sourceContent, '##Q63##', Q63);
	sourceContent= replaceAll(sourceContent, '##Q64##', Q64);
	sourceContent= replaceAll(sourceContent, '##Q65##', Q65);
	sourceContent= replaceAll(sourceContent, '##Q66##', Q66);
	sourceContent= replaceAll(sourceContent, '##Q67##', Q67);
	sourceContent= replaceAll(sourceContent, '##Q68##', Q68);
	sourceContent= replaceAll(sourceContent, '##Q69##', Q69);
	sourceContent= replaceAll(sourceContent, '##Q70##', Q70);
	
	sourceContent= replaceAll(sourceContent, '##Q73##', Q73);
	sourceContent= replaceAll(sourceContent, '##Q74##', Q74);
	sourceContent= replaceAll(sourceContent, '##Q75##', Q75);
	sourceContent= replaceAll(sourceContent, '##Q76##', Q76);
	
	sourceContent= replaceAll(sourceContent, '##Q78##', Q78);
	
	sourceContent= replaceAll(sourceContent, '##Q80##', Q80);
	
	sourceContent= replaceAll(sourceContent, '##Q82##', Q82);
	sourceContent= replaceAll(sourceContent, '##Q83##', Q83);
	sourceContent= replaceAll(sourceContent, '##Q84##', Q84);
	sourceContent= replaceAll(sourceContent, '##Q85##', Q85);
	sourceContent= replaceAll(sourceContent, '##Q86##', Q86);
	sourceContent= replaceAll(sourceContent, '##Q87##', Q87);
	sourceContent= replaceAll(sourceContent, '##Q88##', Q88);
	sourceContent= replaceAll(sourceContent, '##Q89##', Q89);

	return sourceContent;

}

/***********************************************************************************************************
 * replaceYearToDateVarianceData - replacing the year to date variance data 
 * 
 * @param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateVarianceData(sourceContent)
{
	R8 = parseFloat(Q8 - P8).toFixed(2);
	R9 = parseFloat(Q9 - P9).toFixed(2);
	R10 = parseFloat(Q10 - P10).toFixed(2);
	R11 = parseFloat(Q11 - P11).toFixed(2);
	R12 = parseFloat(Q12 - P12).toFixed(2);
	R13 = parseFloat(Q13 - P13).toFixed(2);
	R14 = parseFloat(Q14 - P14).toFixed(2);

	R18 = parseFloat(Q18 - P18).toFixed(2);
	R19 = parseFloat(Q19 - P19).toFixed(2);
	R20 = parseFloat(Q20 - P20).toFixed(2);
	R21 = parseFloat(Q21 - P21).toFixed(2);
	R22 = parseFloat(Q22 - P22).toFixed(2);
	R23 = parseFloat(Q23 - P23).toFixed(2);
	R24 = parseFloat(Q24 - P24).toFixed(2);
	R25 = parseFloat(Q25 - P25).toFixed(2);
	R26 = parseFloat(Q26 - P26).toFixed(2);
	R27 = parseFloat(Q27 - P27).toFixed(2);
	R28 = parseFloat(Q28 - P28).toFixed(2);
	
	R31 = parseFloat(Q31 - P31).toFixed(2);
	R32 = parseFloat(Q32 - P32).toFixed(2);
	R33 = parseFloat(Q33 - P33).toFixed(2);
	R34 = parseFloat(Q34 - P34).toFixed(2);
	R35 = parseFloat(Q35 - P35).toFixed(2);
	R36 = parseFloat(Q36 - P36).toFixed(2);
	R37 = parseFloat(Q37 - P37).toFixed(2);
	R38 = parseFloat(Q38 - P38).toFixed(2);
	R39 = parseFloat(Q39 - P39).toFixed(2);
	
	R42 = parseFloat(Q42 - P42).toFixed(2);
	R43 = parseFloat(Q43 - P43).toFixed(2);
	R44 = parseFloat(Q44 - P44).toFixed(2);
	R45 = parseFloat(Q45 - P45).toFixed(2);
	R46 = parseFloat(Q46 - P46).toFixed(2);
	R47 = parseFloat(Q47 - P47).toFixed(2);
	R48 = parseFloat(Q48 - P48).toFixed(2);
	
	R51 = parseFloat(Q51 - P51).toFixed(2);
	R52 = parseFloat(Q52 - P52).toFixed(2);
	R53 = parseFloat(Q53 - P53).toFixed(2);
	R54 = parseFloat(Q54 - P54).toFixed(2);
	R55 = parseFloat(Q55 - P55).toFixed(2);
	R56 = parseFloat(Q56 - P56).toFixed(2);
	R57 = parseFloat(Q57 - P57).toFixed(2);
	R58 = parseFloat(Q58 - P58).toFixed(2);
	R59 = parseFloat(Q59 - P59).toFixed(2);
	R60 = parseFloat(Q60 - P60).toFixed(2);
	R61 = parseFloat(Q61 - P61).toFixed(2);
	R62 = parseFloat(Q62 - P62).toFixed(2);
	R63 = parseFloat(Q63 - P63).toFixed(2);
	R64 = parseFloat(Q64 - P64).toFixed(2);
	R65 = parseFloat(Q65 - P65).toFixed(2);
	R66 = parseFloat(Q66 - P66).toFixed(2);
	R67 = parseFloat(Q67 - P67).toFixed(2);
	R68 = parseFloat(Q68 - P68).toFixed(2);
	R69 = parseFloat(Q69 - P69).toFixed(2);
	R70 = parseFloat(Q70 - P70).toFixed(2);
	
	R73 = parseFloat(Q73 - P73).toFixed(2);
	R74 = parseFloat(Q74 - P74).toFixed(2);
	R75 = parseFloat(Q75 - P75).toFixed(2);
	R76 = parseFloat(Q76 - P76).toFixed(2);
	
	//R78 =
	//R80 = 
	R82 = parseFloat(Q82 - P82).toFixed(2);
	R83 = parseFloat(Q83 - P83).toFixed(2);
	R84 = parseFloat(Q84 - P84).toFixed(2);
	R85 = parseFloat(Q85 - P85).toFixed(2);
	//R86 = 
	//R87 = 
	R88 = parseFloat(Q88 - P88).toFixed(2);
	R89 = parseFloat(Q89 - P89).toFixed(2);

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##R8##', R8);
	sourceContent= replaceAll(sourceContent, '##R9##', R9);
	sourceContent= replaceAll(sourceContent, '##R10##', R10);
	sourceContent= replaceAll(sourceContent, '##R11##', R11);
	sourceContent= replaceAll(sourceContent, '##R12##', R12);
	sourceContent= replaceAll(sourceContent, '##R13##', R13);
	sourceContent= replaceAll(sourceContent, '##R14##', R14);

	sourceContent= replaceAll(sourceContent, '##R18##', R18);
	sourceContent= replaceAll(sourceContent, '##R19##', R19);
	sourceContent= replaceAll(sourceContent, '##R20##', R20);
	sourceContent= replaceAll(sourceContent, '##R21##', R21);
	sourceContent= replaceAll(sourceContent, '##R22##', R22);
	sourceContent= replaceAll(sourceContent, '##R23##', R23);
	sourceContent= replaceAll(sourceContent, '##R24##', R24);
	sourceContent= replaceAll(sourceContent, '##R25##', R25);
	sourceContent= replaceAll(sourceContent, '##R26##', R26);
	sourceContent= replaceAll(sourceContent, '##R27##', R27);
	sourceContent= replaceAll(sourceContent, '##R28##', R28);
	
	sourceContent= replaceAll(sourceContent, '##R31##', R31);
	sourceContent= replaceAll(sourceContent, '##R32##', R32);
	sourceContent= replaceAll(sourceContent, '##R33##', R33);
	sourceContent= replaceAll(sourceContent, '##R34##', R34);
	sourceContent= replaceAll(sourceContent, '##R35##', R35);
	sourceContent= replaceAll(sourceContent, '##R36##', R36);
	sourceContent= replaceAll(sourceContent, '##R37##', R37);
	sourceContent= replaceAll(sourceContent, '##R38##', R38);
	sourceContent= replaceAll(sourceContent, '##R39##', R39);

	sourceContent= replaceAll(sourceContent, '##R42##', R42);
	sourceContent= replaceAll(sourceContent, '##R43##', R43);
	sourceContent= replaceAll(sourceContent, '##R44##', R44);
	sourceContent= replaceAll(sourceContent, '##R45##', R45);
	sourceContent= replaceAll(sourceContent, '##R46##', R46);
	sourceContent= replaceAll(sourceContent, '##R47##', R47);
	sourceContent= replaceAll(sourceContent, '##R48##', R48);

	sourceContent= replaceAll(sourceContent, '##R51##', R51);
	sourceContent= replaceAll(sourceContent, '##R52##', R52);
	sourceContent= replaceAll(sourceContent, '##R53##', R53);
	sourceContent= replaceAll(sourceContent, '##R54##', R54);
	sourceContent= replaceAll(sourceContent, '##R55##', R55);
	sourceContent= replaceAll(sourceContent, '##R56##', R56);
	sourceContent= replaceAll(sourceContent, '##R57##', R57);
	sourceContent= replaceAll(sourceContent, '##R58##', R58);
	sourceContent= replaceAll(sourceContent, '##R59##', R59);
	sourceContent= replaceAll(sourceContent, '##R60##', R60);
	sourceContent= replaceAll(sourceContent, '##R61##', R61);
	sourceContent= replaceAll(sourceContent, '##R62##', R62);
	sourceContent= replaceAll(sourceContent, '##R63##', R63);
	sourceContent= replaceAll(sourceContent, '##R64##', R64);
	sourceContent= replaceAll(sourceContent, '##R65##', R65);
	sourceContent= replaceAll(sourceContent, '##R66##', R66);
	sourceContent= replaceAll(sourceContent, '##R67##', R67);
	sourceContent= replaceAll(sourceContent, '##R68##', R68);
	sourceContent= replaceAll(sourceContent, '##R69##', R69);
	sourceContent= replaceAll(sourceContent, '##R70##', R70);
	
	sourceContent= replaceAll(sourceContent, '##R73##', R73);
	sourceContent= replaceAll(sourceContent, '##R74##', R74);
	sourceContent= replaceAll(sourceContent, '##R75##', R75);
	sourceContent= replaceAll(sourceContent, '##R76##', R76);
	
	//sourceContent= replaceAll(sourceContent, '##R78##', R78);
	
	//sourceContent= replaceAll(sourceContent, '##R80##', R80);
	
	sourceContent= replaceAll(sourceContent, '##R82##', R82);
	sourceContent= replaceAll(sourceContent, '##R83##', R83);
	sourceContent= replaceAll(sourceContent, '##R84##', R84);
	sourceContent= replaceAll(sourceContent, '##R85##', R85);
	//sourceContent= replaceAll(sourceContent, '##R86##', R86);
	//sourceContent= replaceAll(sourceContent, '##R87##', R87);
	sourceContent= replaceAll(sourceContent, '##R88##', R88);
	sourceContent= replaceAll(sourceContent, '##R89##', R89);

	return sourceContent;

}



/***********************************************************************************************************
 * replaceYearToDateVarianceDataPercent - replacing the year to date variance percentage data in the date range (ex: September - November)
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateVarianceDataPercent(sourceContent)
{
	S8 = divisionByZeroCheck(R8,Q8);
	S9 = divisionByZeroCheck(R9,Q9);
	S10 = divisionByZeroCheck(R10,Q10);
	S11 = divisionByZeroCheck(R11,Q11);
	S12 = divisionByZeroCheck(R12,Q12);
	S13 = divisionByZeroCheck(R13,Q13);
	S14 = divisionByZeroCheck(R14,Q14);
	
	S18 = divisionByZeroCheck(R18,Q18);
	S19 = divisionByZeroCheck(R19,Q19);
	S20 = divisionByZeroCheck(R20,Q20);
	S21 = divisionByZeroCheck(R21,Q21);
	S22 = divisionByZeroCheck(R22,Q22);
	S23 = divisionByZeroCheck(R23,Q23);
	S24 = divisionByZeroCheck(R24,Q24);
	S25 = divisionByZeroCheck(R25,Q25);
	S26 = divisionByZeroCheck(R26,Q26);
	S27 = divisionByZeroCheck(R27,Q27);
	S28 = divisionByZeroCheck(R28,Q28);
	
	S31 = divisionByZeroCheck(R31,Q31);
	S32 = divisionByZeroCheck(R32,Q32);
	S33 = divisionByZeroCheck(R33,Q33);
	S34 = divisionByZeroCheck(R34,Q34);
	S35 = divisionByZeroCheck(R35,Q35);
	S36 = divisionByZeroCheck(R36,Q36);
	S37 = divisionByZeroCheck(R37,Q37);
	S38 = divisionByZeroCheck(R38,Q38);
	S39 = divisionByZeroCheck(R39,Q39);
	
	S42 = divisionByZeroCheck(R42,Q42);
	S43 = divisionByZeroCheck(R43,Q43);
	S44 = divisionByZeroCheck(R44,Q44);
	S45 = divisionByZeroCheck(R45,Q45);
	S46 = divisionByZeroCheck(R46,Q46);
	S47 = divisionByZeroCheck(R47,Q47);
	S48 = divisionByZeroCheck(R48,Q48);
	
	S51 = divisionByZeroCheck(R51,Q51);
	S52 = divisionByZeroCheck(R52,Q52);
	S53 = divisionByZeroCheck(R53,Q53);
	S54 = divisionByZeroCheck(R54,Q54);
	S55 = divisionByZeroCheck(R55,Q55);
	S56 = divisionByZeroCheck(R56,Q56);
	S57 = divisionByZeroCheck(R57,Q57);
	S58 = divisionByZeroCheck(R58,Q58);
	S59 = divisionByZeroCheck(R59,Q59);
	S60 = divisionByZeroCheck(R60,Q60);
	S61 = divisionByZeroCheck(R61,Q61);
	S62 = divisionByZeroCheck(R62,Q62);
	S63 = divisionByZeroCheck(R63,Q63);
	S64 = divisionByZeroCheck(R64,Q64);
	S65 = divisionByZeroCheck(R65,Q65);
	S66 = divisionByZeroCheck(R66,Q66);
	S67 = divisionByZeroCheck(R67,Q67);
	S68 = divisionByZeroCheck(R68,Q68);
	S69 = divisionByZeroCheck(R69,Q69);
	S70 = divisionByZeroCheck(R70,Q70);
	
	S73 = divisionByZeroCheck(R73,Q73);
	S74 = divisionByZeroCheck(R74,Q74);
	S75 = divisionByZeroCheck(R75,Q75);
	S76 = divisionByZeroCheck(R76,Q76);
	
	S78 = divisionByZeroCheck(R78,Q78);
	
	S82 = parseFloat(divisionByZeroCheck(R82,Q82) * 100).toFixed(2);
	S83 = parseFloat(divisionByZeroCheck(R83,Q83) * 100).toFixed(2);
	S84 = parseFloat(divisionByZeroCheck(R84,Q84) * 100).toFixed(2);
	S85 = parseFloat(divisionByZeroCheck(R85,Q85) * 100).toFixed(2);
	S86 = parseFloat(divisionByZeroCheck(R86,Q86) * 100).toFixed(2);
	S87 = parseFloat(divisionByZeroCheck(R87,Q87) * 100).toFixed(2);
	S88 = parseFloat(divisionByZeroCheck(R88,Q88) * 100).toFixed(2);
	S89 = parseFloat(divisionByZeroCheck(R89,Q89) * 100).toFixed(2);
	
	

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##S8##', S8);
	sourceContent= replaceAll(sourceContent, '##S9##', S9);
	sourceContent= replaceAll(sourceContent, '##S10##', S10);
	sourceContent= replaceAll(sourceContent, '##S11##', S11);
	sourceContent= replaceAll(sourceContent, '##S12##', S12);
	sourceContent= replaceAll(sourceContent, '##S13##', S13);
	sourceContent= replaceAll(sourceContent, '##S14##', S14);

	sourceContent= replaceAll(sourceContent, '##S18##', S18);
	sourceContent= replaceAll(sourceContent, '##S19##', S19);
	sourceContent= replaceAll(sourceContent, '##S20##', S20);
	sourceContent= replaceAll(sourceContent, '##S21##', S21);
	sourceContent= replaceAll(sourceContent, '##S22##', S22);
	sourceContent= replaceAll(sourceContent, '##S23##', S23);
	sourceContent= replaceAll(sourceContent, '##S24##', S24);
	sourceContent= replaceAll(sourceContent, '##S25##', S25);
	sourceContent= replaceAll(sourceContent, '##S26##', S26);
	sourceContent= replaceAll(sourceContent, '##S27##', S27);
	sourceContent= replaceAll(sourceContent, '##S28##', S28);
	
	sourceContent= replaceAll(sourceContent, '##S31##', S31);
	sourceContent= replaceAll(sourceContent, '##S32##', S32);
	sourceContent= replaceAll(sourceContent, '##S33##', S33);
	sourceContent= replaceAll(sourceContent, '##S34##', S34);
	sourceContent= replaceAll(sourceContent, '##S35##', S35);
	sourceContent= replaceAll(sourceContent, '##S36##', S36);
	sourceContent= replaceAll(sourceContent, '##S37##', S37);
	sourceContent= replaceAll(sourceContent, '##S38##', S38);
	sourceContent= replaceAll(sourceContent, '##S39##', S39);

	sourceContent= replaceAll(sourceContent, '##S42##', S42);
	sourceContent= replaceAll(sourceContent, '##S43##', S43);
	sourceContent= replaceAll(sourceContent, '##S44##', S44);
	sourceContent= replaceAll(sourceContent, '##S45##', S45);
	sourceContent= replaceAll(sourceContent, '##S46##', S46);
	sourceContent= replaceAll(sourceContent, '##S47##', S47);
	sourceContent= replaceAll(sourceContent, '##S48##', S48);

	sourceContent= replaceAll(sourceContent, '##S51##', S51);
	sourceContent= replaceAll(sourceContent, '##S52##', S52);
	sourceContent= replaceAll(sourceContent, '##S53##', S53);
	sourceContent= replaceAll(sourceContent, '##S54##', S54);
	sourceContent= replaceAll(sourceContent, '##S55##', S55);
	sourceContent= replaceAll(sourceContent, '##S56##', S56);
	sourceContent= replaceAll(sourceContent, '##S57##', S57);
	sourceContent= replaceAll(sourceContent, '##S58##', S58);
	sourceContent= replaceAll(sourceContent, '##S59##', S59);
	sourceContent= replaceAll(sourceContent, '##S60##', S60);
	sourceContent= replaceAll(sourceContent, '##S61##', S61);
	sourceContent= replaceAll(sourceContent, '##S62##', S62);
	sourceContent= replaceAll(sourceContent, '##S63##', S63);
	sourceContent= replaceAll(sourceContent, '##S64##', S64);
	sourceContent= replaceAll(sourceContent, '##S65##', S65);
	sourceContent= replaceAll(sourceContent, '##S66##', S66);
	sourceContent= replaceAll(sourceContent, '##S67##', S67);
	sourceContent= replaceAll(sourceContent, '##S68##', S68);
	sourceContent= replaceAll(sourceContent, '##S69##', S69);
	sourceContent= replaceAll(sourceContent, '##S70##', S70);
	
	sourceContent= replaceAll(sourceContent, '##S73##', S73);
	sourceContent= replaceAll(sourceContent, '##S74##', S74);
	sourceContent= replaceAll(sourceContent, '##S75##', S75);
	sourceContent= replaceAll(sourceContent, '##S76##', S76);
	
	//sourceContent= replaceAll(sourceContent, '##S78##', S78);
	
	//sourceContent= replaceAll(sourceContent, '##S80##', S80);
	
	sourceContent= replaceAll(sourceContent, '##S82##', S82);
	sourceContent= replaceAll(sourceContent, '##S83##', S83);
	sourceContent= replaceAll(sourceContent, '##S84##', S84);
	sourceContent= replaceAll(sourceContent, '##S85##', S85);
	//sourceContent= replaceAll(sourceContent, '##S86##', S86);
	//sourceContent= replaceAll(sourceContent, '##S87##', S87);
	sourceContent= replaceAll(sourceContent, '##S88##', S88);
	sourceContent= replaceAll(sourceContent, '##S89##', S89);

	return sourceContent;

}

/***********************************************************************************************************
 * replaceYearToDateBudgetTypeData - replacing the 'budgetType' data in the 'Year-to-date' section
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateBudgetTypeData(sourceContent)
{	 
	//declaring local variables
	var yearToDateBudgetsSecond = new Array();

	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

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
	yearToDateBudgetsSecond = getSearchResults(searchColInternalId);

	if(yearToDateBudgetsSecond !=null)
	{ 
		calculateData(yearToDateBudgetsSecond);

		T8 = revProgrammeFees;
		T9 = revFilmProduction;
		T10 = revStoryWeb;
		T11 = revTsWorkshops;
		T12 = revLaveryRoom;
		T13 = revTravel;
		T14 = revCurrency;
	
		T18 = cosFreelanceStaff;
		T19 = cosFreelanceStaffDelivery;
		T20 = cosExternalDesign;
		T21 = cosSalesCommission;
		T22 = cosStoryWeb;
		T23 = cosPrinting;
		T24 = cosFilmVideo;
		T25 = cosOther;
		T26 = cosTsWorkshops;
		T27 = cosLaveryRoom;
		T28 = cosTravel;
		
		T31 = salSalaries;
		T32 = salErs;
		T33 = salFreelanceStaff;
		T34 = salRedandancy;
		T35 = salCpd;		
		T36 = salNonRechargable;
		T37 = salITCharge;
		T38 = salProfService;
		T39 = salStaffEntertain;
			
		T42 = spaRent;
		T43 = spaRates;
		T44 = spaWaterRates; 
		T45 = spaOfficeCleaning;
		T46 = spaInsurance;
		T47 = spaRepairs;
		T48 = spaRelocation;
		
		T51 = ovePrint;
		T52 = oveRevised;
		T53 = oveTelephoneSystem;
		T54 = oveTelephoneCalls;
		T55 = oveHeat;
		T56 = oveInsurances;
		T57 = oveClientEntertain;
		T58 = oveITCosts;
		T59 = oveITRecovery;
		T60 = oveCompanyMeeting;
		T61 = oveDevCosts;
		T62 = ovePromotion;
		T63 = oveAwards;
		T64 = oveForums;
		T65 = oveMarketing;
		T66 = oveSales;
		T67 = oveUSSales;
		T68 = oveBankCharges;
		T69 = oveRecruitment;
		T70 = oveSunryOffice;
		
		T73 = profAudit;
		T74 = profAccounting;
		T75 = profLegal;
		T76 = profOther;
		
		T78 = operatingProfit;
	
		//T80 = 
		
		T82 = parseFloat(revTotalAmount/1000).toFixed(2);
		T83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		T84 = parseFloat(grossProfit/1000).toFixed(2);
		T85 = parseFloat(employmentCosts/1000).toFixed(2); 
		T86 = parseFloat(propertyCosts/1000).toFixed(2);
		T87 = parseFloat(adminCosts/1000).toFixed(2);
		T88 = parseFloat(professionalFees/1000).toFixed(2);
		T89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##T8##', T8);
	sourceContent= replaceAll(sourceContent, '##T9##', T9);
	sourceContent= replaceAll(sourceContent, '##T10##', T10);
	sourceContent= replaceAll(sourceContent, '##T11##', T11);
	sourceContent= replaceAll(sourceContent, '##T12##', T12);
	sourceContent= replaceAll(sourceContent, '##T13##', T13);
	sourceContent= replaceAll(sourceContent, '##T14##', T14);

	sourceContent= replaceAll(sourceContent, '##T18##', T18);
	sourceContent= replaceAll(sourceContent, '##T19##', T19);
	sourceContent= replaceAll(sourceContent, '##T20##', T20);
	sourceContent= replaceAll(sourceContent, '##T21##', T21);
	sourceContent= replaceAll(sourceContent, '##T22##', T22);
	sourceContent= replaceAll(sourceContent, '##T23##', T23);
	sourceContent= replaceAll(sourceContent, '##T24##', T24);
	sourceContent= replaceAll(sourceContent, '##T25##', T25);
	sourceContent= replaceAll(sourceContent, '##T26##', T26);
	sourceContent= replaceAll(sourceContent, '##T27##', T27);
	sourceContent= replaceAll(sourceContent, '##T28##', T28);
	
	sourceContent= replaceAll(sourceContent, '##T31##', T31);
	sourceContent= replaceAll(sourceContent, '##T32##', T32);
	sourceContent= replaceAll(sourceContent, '##T33##', T33);
	sourceContent= replaceAll(sourceContent, '##T34##', T34);
	sourceContent= replaceAll(sourceContent, '##T35##', T35);
	sourceContent= replaceAll(sourceContent, '##T36##', T36);
	sourceContent= replaceAll(sourceContent, '##T37##', T37);
	sourceContent= replaceAll(sourceContent, '##T38##', T38);
	sourceContent= replaceAll(sourceContent, '##T39##', T39);

	sourceContent= replaceAll(sourceContent, '##T42##', T42);
	sourceContent= replaceAll(sourceContent, '##T43##', T43);
	sourceContent= replaceAll(sourceContent, '##T44##', T44);
	sourceContent= replaceAll(sourceContent, '##T45##', T45);
	sourceContent= replaceAll(sourceContent, '##T46##', T46);
	sourceContent= replaceAll(sourceContent, '##T47##', T47);
	sourceContent= replaceAll(sourceContent, '##T48##', T48);

	sourceContent= replaceAll(sourceContent, '##T51##', T51);
	sourceContent= replaceAll(sourceContent, '##T52##', T52);
	sourceContent= replaceAll(sourceContent, '##T53##', T53);
	sourceContent= replaceAll(sourceContent, '##T54##', T54);
	sourceContent= replaceAll(sourceContent, '##T55##', T55);
	sourceContent= replaceAll(sourceContent, '##T56##', T56);
	sourceContent= replaceAll(sourceContent, '##T57##', T57);
	sourceContent= replaceAll(sourceContent, '##T58##', T58);
	sourceContent= replaceAll(sourceContent, '##T59##', T59);
	sourceContent= replaceAll(sourceContent, '##T60##', T60);
	sourceContent= replaceAll(sourceContent, '##T61##', T61);
	sourceContent= replaceAll(sourceContent, '##T62##', T62);
	sourceContent= replaceAll(sourceContent, '##T63##', T63);
	sourceContent= replaceAll(sourceContent, '##T64##', T64);
	sourceContent= replaceAll(sourceContent, '##T65##', T65);
	sourceContent= replaceAll(sourceContent, '##T66##', T66);
	sourceContent= replaceAll(sourceContent, '##T67##', T67);
	sourceContent= replaceAll(sourceContent, '##T68##', T68);
	sourceContent= replaceAll(sourceContent, '##T69##', T69);
	sourceContent= replaceAll(sourceContent, '##T70##', T70);
	
	sourceContent= replaceAll(sourceContent, '##T73##', T73);
	sourceContent= replaceAll(sourceContent, '##T74##', T74);
	sourceContent= replaceAll(sourceContent, '##T75##', T75);
	sourceContent= replaceAll(sourceContent, '##T76##', T76);
	
	sourceContent= replaceAll(sourceContent, '##T78##', T78);
	
	sourceContent= replaceAll(sourceContent, '##T80##', T80);
	
	sourceContent= replaceAll(sourceContent, '##T82##', T82);
	sourceContent= replaceAll(sourceContent, '##T83##', T83);
	sourceContent= replaceAll(sourceContent, '##T84##', T84);
	sourceContent= replaceAll(sourceContent, '##T85##', T85);
	sourceContent= replaceAll(sourceContent, '##T86##', T86);
	sourceContent= replaceAll(sourceContent, '##T87##', T87);
	sourceContent= replaceAll(sourceContent, '##T88##', T88);
	sourceContent= replaceAll(sourceContent, '##T89##', T89);

	return sourceContent;

}

/***********************************************************************************************************
 * replaceYearToDateBudgetTypeVarianceData - replacing year to date budget type variance data 
 * 
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateBudgetTypeVarianceData(sourceContent)
{
	U8 = parseFloat(T8 - P8).toFixed(2);
	U9 = parseFloat(T9 - P9).toFixed(2);
	U10 = parseFloat(T10 - P10).toFixed(2);
	U11 = parseFloat(T11 - P11).toFixed(2);
	U12 = parseFloat(T12 - P12).toFixed(2);
	U13 = parseFloat(T13 - P13).toFixed(2);
	U14 = parseFloat(T14 - P14).toFixed(2);

	U18 = parseFloat(T18 - P18).toFixed(2);
	U19 = parseFloat(T19 - P19).toFixed(2);
	U20 = parseFloat(T20 - P20).toFixed(2);
	U21 = parseFloat(T21 - P21).toFixed(2);
	U22 = parseFloat(T22 - P22).toFixed(2);
	U23 = parseFloat(T23 - P23).toFixed(2);
	U24 = parseFloat(T24 - P24).toFixed(2);
	U25 = parseFloat(T25 - P25).toFixed(2);
	U26 = parseFloat(T26 - P26).toFixed(2);
	U27 = parseFloat(T27 - P27).toFixed(2);
	U28 = parseFloat(T28 - P28).toFixed(2);
	
	U31 = parseFloat(T31 - P31).toFixed(2);
	U32 = parseFloat(T32 - P32).toFixed(2);
	U33 = parseFloat(T33 - P33).toFixed(2);
	U34 = parseFloat(T34 - P34).toFixed(2);
	U35 = parseFloat(T35 - P35).toFixed(2);
	U36 = parseFloat(T36 - P36).toFixed(2);
	U37 = parseFloat(T37 - P37).toFixed(2);
	U38 = parseFloat(T38 - P38).toFixed(2);
	U39 = parseFloat(T39 - P39).toFixed(2);
	
	U42 = parseFloat(T42 - P42).toFixed(2);
	U43 = parseFloat(T43 - P43).toFixed(2);
	U44 = parseFloat(T44 - P44).toFixed(2);
	U45 = parseFloat(T45 - P45).toFixed(2);
	U46 = parseFloat(T46 - P46).toFixed(2);
	U47 = parseFloat(T47 - P47).toFixed(2);
	U48 = parseFloat(T48 - P48).toFixed(2);
	
	U51 = parseFloat(T51 - P51).toFixed(2);
	U52 = parseFloat(T52 - P52).toFixed(2);
	U53 = parseFloat(T53 - P53).toFixed(2);
	U54 = parseFloat(T54 - P54).toFixed(2);
	U55 = parseFloat(T55 - P55).toFixed(2);
	U56 = parseFloat(T56 - P56).toFixed(2);
	U57 = parseFloat(T57 - P57).toFixed(2);
	U58 = parseFloat(T58 - P58).toFixed(2);
	U59 = parseFloat(T59 - P59).toFixed(2);
	U60 = parseFloat(T60 - P60).toFixed(2);
	U61 = parseFloat(T61 - P61).toFixed(2);
	U62 = parseFloat(T62 - P62).toFixed(2);
	U63 = parseFloat(T63 - P63).toFixed(2);
	U64 = parseFloat(T64 - P64).toFixed(2);
	U65 = parseFloat(T65 - P65).toFixed(2);
	U66 = parseFloat(T66 - P66).toFixed(2);
	U67 = parseFloat(T67 - P67).toFixed(2);
	U68 = parseFloat(T68 - P68).toFixed(2);
	U69 = parseFloat(T69 - P69).toFixed(2);
	U70 = parseFloat(T70 - P70).toFixed(2);
	
	U73 = parseFloat(T73 - P73).toFixed(2);
	U74 = parseFloat(T74 - P74).toFixed(2);
	U75 = parseFloat(T75 - P75).toFixed(2);
	U76 = parseFloat(T76 - P76).toFixed(2);
	
	//U78 =
	//U80 = 
	U82 = parseFloat(T82 - P82).toFixed(2);
	U83 = parseFloat(T83 - P83).toFixed(2);
	U84 = parseFloat(T84 - P84).toFixed(2);
	U85 = parseFloat(T85 - P85).toFixed(2);
	//U86 = 
	//U87 = 
	U88 = parseFloat(T88 - P88).toFixed(2);
	U89 = parseFloat(T89 - P89).toFixed(2);

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##U8##', U8);
	sourceContent= replaceAll(sourceContent, '##U9##', U9);
	sourceContent= replaceAll(sourceContent, '##U10##', U10);
	sourceContent= replaceAll(sourceContent, '##U11##', U11);
	sourceContent= replaceAll(sourceContent, '##U12##', U12);
	sourceContent= replaceAll(sourceContent, '##U13##', U13);
	sourceContent= replaceAll(sourceContent, '##U14##', U14);

	sourceContent= replaceAll(sourceContent, '##U18##', U18);
	sourceContent= replaceAll(sourceContent, '##U19##', U19);
	sourceContent= replaceAll(sourceContent, '##U20##', U20);
	sourceContent= replaceAll(sourceContent, '##U21##', U21);
	sourceContent= replaceAll(sourceContent, '##U22##', U22);
	sourceContent= replaceAll(sourceContent, '##U23##', U23);
	sourceContent= replaceAll(sourceContent, '##U24##', U24);
	sourceContent= replaceAll(sourceContent, '##U25##', U25);
	sourceContent= replaceAll(sourceContent, '##U26##', U26);
	sourceContent= replaceAll(sourceContent, '##U27##', U27);
	sourceContent= replaceAll(sourceContent, '##U28##', U28);
	
	sourceContent= replaceAll(sourceContent, '##U31##', U31);
	sourceContent= replaceAll(sourceContent, '##U32##', U32);
	sourceContent= replaceAll(sourceContent, '##U33##', U33);
	sourceContent= replaceAll(sourceContent, '##U34##', U34);
	sourceContent= replaceAll(sourceContent, '##U35##', U35);
	sourceContent= replaceAll(sourceContent, '##U36##', U36);
	sourceContent= replaceAll(sourceContent, '##U37##', U37);
	sourceContent= replaceAll(sourceContent, '##U38##', U38);
	sourceContent= replaceAll(sourceContent, '##U39##', U39);

	sourceContent= replaceAll(sourceContent, '##U42##', U42);
	sourceContent= replaceAll(sourceContent, '##U43##', U43);
	sourceContent= replaceAll(sourceContent, '##U44##', U44);
	sourceContent= replaceAll(sourceContent, '##U45##', U45);
	sourceContent= replaceAll(sourceContent, '##U46##', U46);
	sourceContent= replaceAll(sourceContent, '##U47##', U47);
	sourceContent= replaceAll(sourceContent, '##U48##', U48);

	sourceContent= replaceAll(sourceContent, '##U51##', U51);
	sourceContent= replaceAll(sourceContent, '##U52##', U52);
	sourceContent= replaceAll(sourceContent, '##U53##', U53);
	sourceContent= replaceAll(sourceContent, '##U54##', U54);
	sourceContent= replaceAll(sourceContent, '##U55##', U55);
	sourceContent= replaceAll(sourceContent, '##U56##', U56);
	sourceContent= replaceAll(sourceContent, '##U57##', U57);
	sourceContent= replaceAll(sourceContent, '##U58##', U58);
	sourceContent= replaceAll(sourceContent, '##U59##', U59);
	sourceContent= replaceAll(sourceContent, '##U60##', U60);
	sourceContent= replaceAll(sourceContent, '##U61##', U61);
	sourceContent= replaceAll(sourceContent, '##U62##', U62);
	sourceContent= replaceAll(sourceContent, '##U63##', U63);
	sourceContent= replaceAll(sourceContent, '##U64##', U64);
	sourceContent= replaceAll(sourceContent, '##U65##', U65);
	sourceContent= replaceAll(sourceContent, '##U66##', U66);
	sourceContent= replaceAll(sourceContent, '##U67##', U67);
	sourceContent= replaceAll(sourceContent, '##U68##', U68);
	sourceContent= replaceAll(sourceContent, '##U69##', U69);
	sourceContent= replaceAll(sourceContent, '##U70##', U70);
	
	sourceContent= replaceAll(sourceContent, '##U73##', U73);
	sourceContent= replaceAll(sourceContent, '##U74##', U74);
	sourceContent= replaceAll(sourceContent, '##U75##', U75);
	sourceContent= replaceAll(sourceContent, '##U76##', U76);
	
	//sourceContent= replaceAll(sourceContent, '##U78##', U78);
	
	//sourceContent= replaceAll(sourceContent, '##U80##', U80);
	
	sourceContent= replaceAll(sourceContent, '##U82##', U82);
	sourceContent= replaceAll(sourceContent, '##U83##', U83);
	sourceContent= replaceAll(sourceContent, '##U84##', U84);
	sourceContent= replaceAll(sourceContent, '##U85##', U85);
	//sourceContent= replaceAll(sourceContent, '##U86##', U86);
	//sourceContent= replaceAll(sourceContent, '##U87##', U87);
	sourceContent= replaceAll(sourceContent, '##U88##', U88);
	sourceContent= replaceAll(sourceContent, '##U89##', U89);

	return sourceContent;

}



/***********************************************************************************************************
 * replaceYearToDateBudgetTypeVarianceDataPercent - replacing the year to date budget type variance percentage data 
 * 
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateBudgetTypeVarianceDataPercent(sourceContent)
{
	V8 = divisionByZeroCheck(U8,T8);
	V9 = divisionByZeroCheck(U9,T9);
	V10 = divisionByZeroCheck(U10,T10);
	V11 = divisionByZeroCheck(U11,T11);
	V12 = divisionByZeroCheck(U12,T12);
	V13 = divisionByZeroCheck(U13,T13);
	V14 = divisionByZeroCheck(U14,T14);
	
	V18 = divisionByZeroCheck(U18,T18);
	V19 = divisionByZeroCheck(U19,T19);
	V20 = divisionByZeroCheck(U20,T20);
	V21 = divisionByZeroCheck(U21,T21);
	V22 = divisionByZeroCheck(U22,T22);
	V23 = divisionByZeroCheck(U23,T23);
	V24 = divisionByZeroCheck(U24,T24);
	V25 = divisionByZeroCheck(U25,T25);
	V26 = divisionByZeroCheck(U26,T26);
	V27 = divisionByZeroCheck(U27,T27);
	V28 = divisionByZeroCheck(U28,T28);
	
	V31 = divisionByZeroCheck(U31,T31);
	V32 = divisionByZeroCheck(U32,T32);
	V33 = divisionByZeroCheck(U33,T33);
	V34 = divisionByZeroCheck(U34,T34);
	V35 = divisionByZeroCheck(U35,T35);
	V36 = divisionByZeroCheck(U36,T36);
	V37 = divisionByZeroCheck(U37,T37);
	V38 = divisionByZeroCheck(U38,T38);
	V39 = divisionByZeroCheck(U39,T39);
	
	V42 = divisionByZeroCheck(U42,T42);
	V43 = divisionByZeroCheck(U43,T43);
	V44 = divisionByZeroCheck(U44,T44);
	V45 = divisionByZeroCheck(U45,T45);
	V46 = divisionByZeroCheck(U46,T46);
	V47 = divisionByZeroCheck(U47,T47);
	V48 = divisionByZeroCheck(U48,T48);
	
	V51 = divisionByZeroCheck(U51,T51);
	V52 = divisionByZeroCheck(U52,T52);
	V53 = divisionByZeroCheck(U53,T53);
	V54 = divisionByZeroCheck(U54,T54);
	V55 = divisionByZeroCheck(U55,T55);
	V56 = divisionByZeroCheck(U56,T56);
	V57 = divisionByZeroCheck(U57,T57);
	V58 = divisionByZeroCheck(U58,T58);
	V59 = divisionByZeroCheck(U59,T59);
	V60 = divisionByZeroCheck(U60,T60);
	V61 = divisionByZeroCheck(U61,T61);
	V62 = divisionByZeroCheck(U62,T62);
	V63 = divisionByZeroCheck(U63,T63);
	V64 = divisionByZeroCheck(U64,T64);
	V65 = divisionByZeroCheck(U65,T65);
	V66 = divisionByZeroCheck(U66,T66);
	V67 = divisionByZeroCheck(U67,T67);
	V68 = divisionByZeroCheck(U68,T68);
	V69 = divisionByZeroCheck(U69,T69);
	V70 = divisionByZeroCheck(U70,T70);
	
	V73 = divisionByZeroCheck(U73,T73);
	V74 = divisionByZeroCheck(U74,T74);
	V75 = divisionByZeroCheck(U75,T75);
	V76 = divisionByZeroCheck(U76,T76);
	
	V78 = divisionByZeroCheck(U78,T78);
	
	V82 = parseFloat(divisionByZeroCheck(U82,T82) * 100).toFixed(2);
	V83 = parseFloat(divisionByZeroCheck(U83,T83) * 100).toFixed(2);
	V84 = parseFloat(divisionByZeroCheck(U84,T84) * 100).toFixed(2);
	V85 = parseFloat(divisionByZeroCheck(U85,T85) * 100).toFixed(2);
	V86 = parseFloat(divisionByZeroCheck(U86,T86) * 100).toFixed(2);
	V87 = parseFloat(divisionByZeroCheck(U87,T87) * 100).toFixed(2);
	V88 = parseFloat(divisionByZeroCheck(U88,T88) * 100).toFixed(2);
	V89 = parseFloat(divisionByZeroCheck(U89,T89) * 100).toFixed(2);
	
	

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##V8##', V8);
	sourceContent= replaceAll(sourceContent, '##V9##', V9);
	sourceContent= replaceAll(sourceContent, '##V10##', V10);
	sourceContent= replaceAll(sourceContent, '##V11##', V11);
	sourceContent= replaceAll(sourceContent, '##V12##', V12);
	sourceContent= replaceAll(sourceContent, '##V13##', V13);
	sourceContent= replaceAll(sourceContent, '##V14##', V14);

	sourceContent= replaceAll(sourceContent, '##V18##', V18);
	sourceContent= replaceAll(sourceContent, '##V19##', V19);
	sourceContent= replaceAll(sourceContent, '##V20##', V20);
	sourceContent= replaceAll(sourceContent, '##V21##', V21);
	sourceContent= replaceAll(sourceContent, '##V22##', V22);
	sourceContent= replaceAll(sourceContent, '##V23##', V23);
	sourceContent= replaceAll(sourceContent, '##V24##', V24);
	sourceContent= replaceAll(sourceContent, '##V25##', V25);
	sourceContent= replaceAll(sourceContent, '##V26##', V26);
	sourceContent= replaceAll(sourceContent, '##V27##', V27);
	sourceContent= replaceAll(sourceContent, '##V28##', V28);
	
	sourceContent= replaceAll(sourceContent, '##V31##', V31);
	sourceContent= replaceAll(sourceContent, '##V32##', V32);
	sourceContent= replaceAll(sourceContent, '##V33##', V33);
	sourceContent= replaceAll(sourceContent, '##V34##', V34);
	sourceContent= replaceAll(sourceContent, '##V35##', V35);
	sourceContent= replaceAll(sourceContent, '##V36##', V36);
	sourceContent= replaceAll(sourceContent, '##V37##', V37);
	sourceContent= replaceAll(sourceContent, '##V38##', V38);
	sourceContent= replaceAll(sourceContent, '##V39##', V39);

	sourceContent= replaceAll(sourceContent, '##V42##', V42);
	sourceContent= replaceAll(sourceContent, '##V43##', V43);
	sourceContent= replaceAll(sourceContent, '##V44##', V44);
	sourceContent= replaceAll(sourceContent, '##V45##', V45);
	sourceContent= replaceAll(sourceContent, '##V46##', V46);
	sourceContent= replaceAll(sourceContent, '##V47##', V47);
	sourceContent= replaceAll(sourceContent, '##V48##', V48);

	sourceContent= replaceAll(sourceContent, '##V51##', V51);
	sourceContent= replaceAll(sourceContent, '##V52##', V52);
	sourceContent= replaceAll(sourceContent, '##V53##', V53);
	sourceContent= replaceAll(sourceContent, '##V54##', V54);
	sourceContent= replaceAll(sourceContent, '##V55##', V55);
	sourceContent= replaceAll(sourceContent, '##V56##', V56);
	sourceContent= replaceAll(sourceContent, '##V57##', V57);
	sourceContent= replaceAll(sourceContent, '##V58##', V58);
	sourceContent= replaceAll(sourceContent, '##V59##', V59);
	sourceContent= replaceAll(sourceContent, '##V60##', V60);
	sourceContent= replaceAll(sourceContent, '##V61##', V61);
	sourceContent= replaceAll(sourceContent, '##V62##', V62);
	sourceContent= replaceAll(sourceContent, '##V63##', V63);
	sourceContent= replaceAll(sourceContent, '##V64##', V64);
	sourceContent= replaceAll(sourceContent, '##V65##', V65);
	sourceContent= replaceAll(sourceContent, '##V66##', V66);
	sourceContent= replaceAll(sourceContent, '##V67##', V67);
	sourceContent= replaceAll(sourceContent, '##V68##', V68);
	sourceContent= replaceAll(sourceContent, '##V69##', V69);
	sourceContent= replaceAll(sourceContent, '##V70##', V70);
	
	sourceContent= replaceAll(sourceContent, '##V73##', V73);
	sourceContent= replaceAll(sourceContent, '##V74##', V74);
	sourceContent= replaceAll(sourceContent, '##V75##', V75);
	sourceContent= replaceAll(sourceContent, '##V76##', V76);
	
	//sourceContent= replaceAll(sourceContent, '##V78##', V78);
	
	//sourceContent= replaceAll(sourceContent, '##V80##', V80);
	
	sourceContent= replaceAll(sourceContent, '##V82##', V82);
	sourceContent= replaceAll(sourceContent, '##V83##', V83);
	sourceContent= replaceAll(sourceContent, '##V84##', V84);
	sourceContent= replaceAll(sourceContent, '##V85##', V85);
	//sourceContent= replaceAll(sourceContent, '##V86##', V86);
	//sourceContent= replaceAll(sourceContent, '##V87##', V87);
	sourceContent= replaceAll(sourceContent, '##V88##', V88);
	sourceContent= replaceAll(sourceContent, '##V89##', V89);

	return sourceContent;

}


/***********************************************************************************************************
 * replaceYearToDateLastYearData - replacing the 'Last Year' data in the 'Year-to-date' section
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateLastYearData(sourceContent)
{	 
	//declaring local variables
	var yearToDateLastYear = new Array();


	//calling a function to re-initialize the global variables
	reInitializingGlobalVariables();

	//getting the appropriate search results - prior year actuals
	yearToDateLastYear = getSearchResults('custrecord_prior_year_actuals');

	if(yearToDateLastYear !=null)
	{ 
		calculateData(yearToDateLastYear);

		W8 = revProgrammeFees;
		W9 = revFilmProduction;
		W10 = revStoryWeb;
		W11 = revTsWorkshops;
		W12 = revLaveryRoom;
		W13 = revTravel;
		W14 = revCurrency;
	
		W18 = cosFreelanceStaff;
		W19 = cosFreelanceStaffDelivery;
		W20 = cosExternalDesign;
		W21 = cosSalesCommission;
		W22 = cosStoryWeb;
		W23 = cosPrinting;
		W24 = cosFilmVideo;
		W25 = cosOther;
		W26 = cosTsWorkshops;
		W27 = cosLaveryRoom;
		W28 = cosTravel;
		
		W31 = salSalaries;
		W32 = salErs;
		W33 = salFreelanceStaff;
		W34 = salRedandancy;
		W35 = salCpd;		
		W36 = salNonRechargable;
		W37 = salITCharge;
		W38 = salProfService;
		W39 = salStaffEntertain;
			
		W42 = spaRent;
		W43 = spaRates;
		W44 = spaWaterRates; 
		W45 = spaOfficeCleaning;
		W46 = spaInsurance;
		W47 = spaRepairs;
		W48 = spaRelocation;
		
		W51 = ovePrint;
		W52 = oveRevised;
		W53 = oveTelephoneSystem;
		W54 = oveTelephoneCalls;
		W55 = oveHeat;
		W56 = oveInsurances;
		W57 = oveClientEntertain;
		W58 = oveITCosts;
		W59 = oveITRecovery;
		W60 = oveCompanyMeeting;
		W61 = oveDevCosts;
		W62 = ovePromotion;
		W63 = oveAwards;
		W64 = oveForums;
		W65 = oveMarketing;
		W66 = oveSales;
		W67 = oveUSSales;
		W68 = oveBankCharges;
		W69 = oveRecruitment;
		W70 = oveSunryOffice;
		
		W73 = profAudit;
		W74 = profAccounting;
		W75 = profLegal;
		W76 = profOther;
		
		W78 = operatingProfit;
	
		//W80 = 
		
		W82 = parseFloat(revTotalAmount/1000).toFixed(2);
		W83 = parseFloat(cosTotalAmount/1000).toFixed(2);
		W84 = parseFloat(grossProfit/1000).toFixed(2);
		W85 = parseFloat(employmentCosts/1000).toFixed(2); 
		W86 = parseFloat(propertyCosts/1000).toFixed(2);
		W87 = parseFloat(adminCosts/1000).toFixed(2);
		W88 = parseFloat(professionalFees/1000).toFixed(2);
		W89 = parseFloat(EBITDA).toFixed(2);
	}
	
	//Replacing the data displayed as html in the portlet
	sourceContent= replaceAll(sourceContent, '##W8##', W8);
	sourceContent= replaceAll(sourceContent, '##W9##', W9);
	sourceContent= replaceAll(sourceContent, '##W10##', W10);
	sourceContent= replaceAll(sourceContent, '##W11##', W11);
	sourceContent= replaceAll(sourceContent, '##W12##', W12);
	sourceContent= replaceAll(sourceContent, '##W13##', W13);
	sourceContent= replaceAll(sourceContent, '##W14##', W14);

	sourceContent= replaceAll(sourceContent, '##W18##', W18);
	sourceContent= replaceAll(sourceContent, '##W19##', W19);
	sourceContent= replaceAll(sourceContent, '##W20##', W20);
	sourceContent= replaceAll(sourceContent, '##W21##', W21);
	sourceContent= replaceAll(sourceContent, '##W22##', W22);
	sourceContent= replaceAll(sourceContent, '##W23##', W23);
	sourceContent= replaceAll(sourceContent, '##W24##', W24);
	sourceContent= replaceAll(sourceContent, '##W25##', W25);
	sourceContent= replaceAll(sourceContent, '##W26##', W26);
	sourceContent= replaceAll(sourceContent, '##W27##', W27);
	sourceContent= replaceAll(sourceContent, '##W28##', W28);
	
	sourceContent= replaceAll(sourceContent, '##W31##', W31);
	sourceContent= replaceAll(sourceContent, '##W32##', W32);
	sourceContent= replaceAll(sourceContent, '##W33##', W33);
	sourceContent= replaceAll(sourceContent, '##W34##', W34);
	sourceContent= replaceAll(sourceContent, '##W35##', W35);
	sourceContent= replaceAll(sourceContent, '##W36##', W36);
	sourceContent= replaceAll(sourceContent, '##W37##', W37);
	sourceContent= replaceAll(sourceContent, '##W38##', W38);
	sourceContent= replaceAll(sourceContent, '##W39##', W39);

	sourceContent= replaceAll(sourceContent, '##W42##', W42);
	sourceContent= replaceAll(sourceContent, '##W43##', W43);
	sourceContent= replaceAll(sourceContent, '##W44##', W44);
	sourceContent= replaceAll(sourceContent, '##W45##', W45);
	sourceContent= replaceAll(sourceContent, '##W46##', W46);
	sourceContent= replaceAll(sourceContent, '##W47##', W47);
	sourceContent= replaceAll(sourceContent, '##W48##', W48);

	sourceContent= replaceAll(sourceContent, '##W51##', W51);
	sourceContent= replaceAll(sourceContent, '##W52##', W52);
	sourceContent= replaceAll(sourceContent, '##W53##', W53);
	sourceContent= replaceAll(sourceContent, '##W54##', W54);
	sourceContent= replaceAll(sourceContent, '##W55##', W55);
	sourceContent= replaceAll(sourceContent, '##W56##', W56);
	sourceContent= replaceAll(sourceContent, '##W57##', W57);
	sourceContent= replaceAll(sourceContent, '##W58##', W58);
	sourceContent= replaceAll(sourceContent, '##W59##', W59);
	sourceContent= replaceAll(sourceContent, '##W60##', W60);
	sourceContent= replaceAll(sourceContent, '##W61##', W61);
	sourceContent= replaceAll(sourceContent, '##W62##', W62);
	sourceContent= replaceAll(sourceContent, '##W63##', W63);
	sourceContent= replaceAll(sourceContent, '##W64##', W64);
	sourceContent= replaceAll(sourceContent, '##W65##', W65);
	sourceContent= replaceAll(sourceContent, '##W66##', W66);
	sourceContent= replaceAll(sourceContent, '##W67##', W67);
	sourceContent= replaceAll(sourceContent, '##W68##', W68);
	sourceContent= replaceAll(sourceContent, '##W69##', W69);
	sourceContent= replaceAll(sourceContent, '##W70##', W70);
	
	sourceContent= replaceAll(sourceContent, '##W73##', W73);
	sourceContent= replaceAll(sourceContent, '##W74##', W74);
	sourceContent= replaceAll(sourceContent, '##W75##', W75);
	sourceContent= replaceAll(sourceContent, '##W76##', W76);
	
	sourceContent= replaceAll(sourceContent, '##W78##', W78);
	
	sourceContent= replaceAll(sourceContent, '##W80##', W80);
	
	sourceContent= replaceAll(sourceContent, '##W82##', W82);
	sourceContent= replaceAll(sourceContent, '##W83##', W83);
	sourceContent= replaceAll(sourceContent, '##W84##', W84);
	sourceContent= replaceAll(sourceContent, '##W85##', W85);
	sourceContent= replaceAll(sourceContent, '##W86##', W86);
	sourceContent= replaceAll(sourceContent, '##W87##', W87);
	sourceContent= replaceAll(sourceContent, '##W88##', W88);
	sourceContent= replaceAll(sourceContent, '##W89##', W89);

	return sourceContent;

}

/***********************************************************************************************************
 * replaceYearToDateLastYearChangeData - replacing the year to date last year variance data 
 * 
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateLastYearChangeData(sourceContent)
{
	X8 = parseFloat(P8 - W8).toFixed(2);
	X9 = parseFloat(P9 - W9).toFixed(2);
	X10 = parseFloat(P10 - W10).toFixed(2);
	X11 = parseFloat(P11 - W11).toFixed(2);
	X12 = parseFloat(P12 - W12).toFixed(2);
	X13 = parseFloat(P13 - W13).toFixed(2);
	X14 = parseFloat(P14 - W14).toFixed(2);

	X18 = parseFloat(W18 - P18).toFixed(2);
	X19 = parseFloat(W19 - P19).toFixed(2);
	X20 = parseFloat(W20 - P20).toFixed(2);
	X21 = parseFloat(W21 - P21).toFixed(2);
	X22 = parseFloat(W22 - P22).toFixed(2);
	X23 = parseFloat(W23 - P23).toFixed(2);
	X24 = parseFloat(W24 - P24).toFixed(2);
	X25 = parseFloat(W25 - P25).toFixed(2);
	X26 = parseFloat(W26 - P26).toFixed(2);
	X27 = parseFloat(W27 - P27).toFixed(2);
	X28 = parseFloat(W28 - P28).toFixed(2);
	
	X31 = parseFloat(W31 - P31).toFixed(2);
	X32 = parseFloat(W32 - P32).toFixed(2);
	X33 = parseFloat(W33 - P33).toFixed(2);
	X34 = parseFloat(W34 - P34).toFixed(2);
	X35 = parseFloat(W35 - P35).toFixed(2);
	X36 = parseFloat(W36 - P36).toFixed(2);
	X37 = parseFloat(W37 - P37).toFixed(2);
	X38 = parseFloat(W38 - P38).toFixed(2);
	X39 = parseFloat(W39 - P39).toFixed(2);
	
	X42 = parseFloat(W42 - P42).toFixed(2);
	X43 = parseFloat(W43 - P43).toFixed(2);
	X44 = parseFloat(W44 - P44).toFixed(2);
	X45 = parseFloat(W45 - P45).toFixed(2);
	X46 = parseFloat(W46 - P46).toFixed(2);
	X47 = parseFloat(W47 - P47).toFixed(2);
	X48 = parseFloat(W48 - P48).toFixed(2);
	
	X51 = parseFloat(W51 - P51).toFixed(2);
	X52 = parseFloat(W52 - P52).toFixed(2);
	X53 = parseFloat(W53 - P53).toFixed(2);
	X54 = parseFloat(W54 - P54).toFixed(2);
	X55 = parseFloat(W55 - P55).toFixed(2);
	X56 = parseFloat(W56 - P56).toFixed(2);
	X57 = parseFloat(W57 - P57).toFixed(2);
	X58 = parseFloat(W58 - P58).toFixed(2);
	X59 = parseFloat(W59 - P59).toFixed(2);
	X60 = parseFloat(W60 - P60).toFixed(2);
	X61 = parseFloat(W61 - P61).toFixed(2);
	X62 = parseFloat(W62 - P62).toFixed(2);
	X63 = parseFloat(W63 - P63).toFixed(2);
	X64 = parseFloat(W64 - P64).toFixed(2);
	X65 = parseFloat(W65 - P65).toFixed(2);
	X66 = parseFloat(W66 - P66).toFixed(2);
	X67 = parseFloat(W67 - P67).toFixed(2);
	X68 = parseFloat(W68 - P68).toFixed(2);
	X69 = parseFloat(W69 - P69).toFixed(2);
	X70 = parseFloat(W70 - P70).toFixed(2);
	
	X73 = parseFloat(W73 - P73).toFixed(2);
	X74 = parseFloat(W74 - P74).toFixed(2);
	X75 = parseFloat(W75 - P75).toFixed(2);
	X76 = parseFloat(W76 - P76).toFixed(2);
	
	//X78 =
	//X80 = 
	X82 = parseFloat(P82 - W82).toFixed(2);
	X83 = parseFloat(W83 - P83).toFixed(2);
	X84 = parseFloat(P84 - W84).toFixed(2);
	X85 = parseFloat(W85 - P85).toFixed(2);
	//X86 = 
	//X87 = 
	X88 = parseFloat(W88 - P88).toFixed(2);
	X89 = parseFloat(P89 - W89).toFixed(2);


	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##X8##', X8);
	sourceContent= replaceAll(sourceContent, '##X9##', X9);
	sourceContent= replaceAll(sourceContent, '##X10##', X10);
	sourceContent= replaceAll(sourceContent, '##X11##', X11);
	sourceContent= replaceAll(sourceContent, '##X12##', X12);
	sourceContent= replaceAll(sourceContent, '##X13##', X13);
	sourceContent= replaceAll(sourceContent, '##X14##', X14);

	sourceContent= replaceAll(sourceContent, '##X18##', X18);
	sourceContent= replaceAll(sourceContent, '##X19##', X19);
	sourceContent= replaceAll(sourceContent, '##X20##', X20);
	sourceContent= replaceAll(sourceContent, '##X21##', X21);
	sourceContent= replaceAll(sourceContent, '##X22##', X22);
	sourceContent= replaceAll(sourceContent, '##X23##', X23);
	sourceContent= replaceAll(sourceContent, '##X24##', X24);
	sourceContent= replaceAll(sourceContent, '##X25##', X25);
	sourceContent= replaceAll(sourceContent, '##X26##', X26);
	sourceContent= replaceAll(sourceContent, '##X27##', X27);
	sourceContent= replaceAll(sourceContent, '##X28##', X28);
	
	sourceContent= replaceAll(sourceContent, '##X31##', X31);
	sourceContent= replaceAll(sourceContent, '##X32##', X32);
	sourceContent= replaceAll(sourceContent, '##X33##', X33);
	sourceContent= replaceAll(sourceContent, '##X34##', X34);
	sourceContent= replaceAll(sourceContent, '##X35##', X35);
	sourceContent= replaceAll(sourceContent, '##X36##', X36);
	sourceContent= replaceAll(sourceContent, '##X37##', X37);
	sourceContent= replaceAll(sourceContent, '##X38##', X38);
	sourceContent= replaceAll(sourceContent, '##X39##', X39);

	sourceContent= replaceAll(sourceContent, '##X42##', X42);
	sourceContent= replaceAll(sourceContent, '##X43##', X43);
	sourceContent= replaceAll(sourceContent, '##X44##', X44);
	sourceContent= replaceAll(sourceContent, '##X45##', X45);
	sourceContent= replaceAll(sourceContent, '##X46##', X46);
	sourceContent= replaceAll(sourceContent, '##X47##', X47);
	sourceContent= replaceAll(sourceContent, '##X48##', X48);

	sourceContent= replaceAll(sourceContent, '##X51##', X51);
	sourceContent= replaceAll(sourceContent, '##X52##', X52);
	sourceContent= replaceAll(sourceContent, '##X53##', X53);
	sourceContent= replaceAll(sourceContent, '##X54##', X54);
	sourceContent= replaceAll(sourceContent, '##X55##', X55);
	sourceContent= replaceAll(sourceContent, '##X56##', X56);
	sourceContent= replaceAll(sourceContent, '##X57##', X57);
	sourceContent= replaceAll(sourceContent, '##X58##', X58);
	sourceContent= replaceAll(sourceContent, '##X59##', X59);
	sourceContent= replaceAll(sourceContent, '##X60##', X60);
	sourceContent= replaceAll(sourceContent, '##X61##', X61);
	sourceContent= replaceAll(sourceContent, '##X62##', X62);
	sourceContent= replaceAll(sourceContent, '##X63##', X63);
	sourceContent= replaceAll(sourceContent, '##X64##', X64);
	sourceContent= replaceAll(sourceContent, '##X65##', X65);
	sourceContent= replaceAll(sourceContent, '##X66##', X66);
	sourceContent= replaceAll(sourceContent, '##X67##', X67);
	sourceContent= replaceAll(sourceContent, '##X68##', X68);
	sourceContent= replaceAll(sourceContent, '##X69##', X69);
	sourceContent= replaceAll(sourceContent, '##X70##', X70);
	
	sourceContent= replaceAll(sourceContent, '##X73##', X73);
	sourceContent= replaceAll(sourceContent, '##X74##', X74);
	sourceContent= replaceAll(sourceContent, '##X75##', X75);
	sourceContent= replaceAll(sourceContent, '##X76##', X76);
	
	//sourceContent= replaceAll(sourceContent, '##X78##', X78);
	
	//sourceContent= replaceAll(sourceContent, '##X80##', X80);
	
	sourceContent= replaceAll(sourceContent, '##X82##', X82);
	sourceContent= replaceAll(sourceContent, '##X83##', X83);
	sourceContent= replaceAll(sourceContent, '##X84##', X84);
	sourceContent= replaceAll(sourceContent, '##X85##', X85);
	//sourceContent= replaceAll(sourceContent, '##X86##', X86);
	//sourceContent= replaceAll(sourceContent, '##X87##', X87);
	sourceContent= replaceAll(sourceContent, '##X88##', X88);
	sourceContent= replaceAll(sourceContent, '##X89##', X89);

	return sourceContent;

}



/***********************************************************************************************************
 * replaceYearToDateLastYearChangeDataPercent - replacing the year to date last year change percentage data
 *
 *@param {String} sourceContent - The HTML Code you wish to replace the data in
 *@return {String} sourceContent - The HTML with the data replaced
 **********************************************************************************************************/
function replaceYearToDateLastYearChangeDataPercent(sourceContent)
{
	Y8 = divisionByZeroCheck(X8,W8);
	Y9 = divisionByZeroCheck(X9,W9);
	Y10 = divisionByZeroCheck(X10,W10);
	Y11 = divisionByZeroCheck(X11,W11);
	Y12 = divisionByZeroCheck(X12,W12);
	Y13 = divisionByZeroCheck(X13,W13);
	Y14 = divisionByZeroCheck(X14,W14);
	
	Y18 = divisionByZeroCheck(X18,W18);
	Y19 = divisionByZeroCheck(X19,W19);
	Y20 = divisionByZeroCheck(X20,W20);
	Y21 = divisionByZeroCheck(X21,W21);
	Y22 = divisionByZeroCheck(X22,W22);
	Y23 = divisionByZeroCheck(X23,W23);
	Y24 = divisionByZeroCheck(X24,W24);
	Y25 = divisionByZeroCheck(X25,W25);
	Y26 = divisionByZeroCheck(X26,W26);
	Y27 = divisionByZeroCheck(X27,W27);
	Y28 = divisionByZeroCheck(X28,W28);
	
	Y31 = divisionByZeroCheck(X31,W31);
	Y32 = divisionByZeroCheck(X32,W32);
	Y33 = divisionByZeroCheck(X33,W33);
	Y34 = divisionByZeroCheck(X34,W34);
	Y35 = divisionByZeroCheck(X35,W35);
	Y36 = divisionByZeroCheck(X36,W36);
	Y37 = divisionByZeroCheck(X37,W37);
	Y38 = divisionByZeroCheck(X38,W38);
	Y39 = divisionByZeroCheck(X39,W39);
	
	Y42 = divisionByZeroCheck(X42,W42);
	Y43 = divisionByZeroCheck(X43,W43);
	Y44 = divisionByZeroCheck(X44,W44);
	Y45 = divisionByZeroCheck(X45,W45);
	Y46 = divisionByZeroCheck(X46,W46);
	Y47 = divisionByZeroCheck(X47,W47);
	Y48 = divisionByZeroCheck(X48,W48);
	
	Y51 = divisionByZeroCheck(X51,W51);
	Y52 = divisionByZeroCheck(X52,W52);
	Y53 = divisionByZeroCheck(X53,W53);
	Y54 = divisionByZeroCheck(X54,W54);
	Y55 = divisionByZeroCheck(X55,W55);
	Y56 = divisionByZeroCheck(X56,W56);
	Y57 = divisionByZeroCheck(X57,W57);
	Y58 = divisionByZeroCheck(X58,W58);
	Y59 = divisionByZeroCheck(X59,W59);
	Y60 = divisionByZeroCheck(X60,W60);
	Y61 = divisionByZeroCheck(X61,W61);
	Y62 = divisionByZeroCheck(X62,W62);
	Y63 = divisionByZeroCheck(X63,W63);
	Y64 = divisionByZeroCheck(X64,W64);
	Y65 = divisionByZeroCheck(X65,W65);
	Y66 = divisionByZeroCheck(X66,W66);
	Y67 = divisionByZeroCheck(X67,W67);
	Y68 = divisionByZeroCheck(X68,W68);
	Y69 = divisionByZeroCheck(X69,W69);
	Y70 = divisionByZeroCheck(X70,W70);
	
	Y73 = divisionByZeroCheck(X73,W73);
	Y74 = divisionByZeroCheck(X74,W74);
	Y75 = divisionByZeroCheck(X75,W75);
	Y76 = divisionByZeroCheck(X76,W76);
	
	Y78 = divisionByZeroCheck(X78,W78);
	
	Y82 = parseFloat(divisionByZeroCheck(X82,W82) * 100).toFixed(2);
	Y83 = parseFloat(divisionByZeroCheck(X83,W83) * 100).toFixed(2);
	Y84 = parseFloat(divisionByZeroCheck(X84,W84) * 100).toFixed(2);
	Y85 = parseFloat(divisionByZeroCheck(X85,W85) * 100).toFixed(2);
	Y86 = parseFloat(divisionByZeroCheck(X86,W86) * 100).toFixed(2);
	Y87 = parseFloat(divisionByZeroCheck(X87,W87) * 100).toFixed(2);
	Y88 = parseFloat(divisionByZeroCheck(X88,W88) * 100).toFixed(2);
	Y89 = parseFloat(divisionByZeroCheck(X89,W89) * 100).toFixed(2);
	
	

	//Replacing the data according to the 'management spreadsheet' - monthly tab
	sourceContent= replaceAll(sourceContent, '##Y8##', Y8);
	sourceContent= replaceAll(sourceContent, '##Y9##', Y9);
	sourceContent= replaceAll(sourceContent, '##Y10##', Y10);
	sourceContent= replaceAll(sourceContent, '##Y11##', Y11);
	sourceContent= replaceAll(sourceContent, '##Y12##', Y12);
	sourceContent= replaceAll(sourceContent, '##Y13##', Y13);
	sourceContent= replaceAll(sourceContent, '##Y14##', Y14);

	sourceContent= replaceAll(sourceContent, '##Y18##', Y18);
	sourceContent= replaceAll(sourceContent, '##Y19##', Y19);
	sourceContent= replaceAll(sourceContent, '##Y20##', Y20);
	sourceContent= replaceAll(sourceContent, '##Y21##', Y21);
	sourceContent= replaceAll(sourceContent, '##Y22##', Y22);
	sourceContent= replaceAll(sourceContent, '##Y23##', Y23);
	sourceContent= replaceAll(sourceContent, '##Y24##', Y24);
	sourceContent= replaceAll(sourceContent, '##Y25##', Y25);
	sourceContent= replaceAll(sourceContent, '##Y26##', Y26);
	sourceContent= replaceAll(sourceContent, '##Y27##', Y27);
	sourceContent= replaceAll(sourceContent, '##Y28##', Y28);
	
	sourceContent= replaceAll(sourceContent, '##Y31##', Y31);
	sourceContent= replaceAll(sourceContent, '##Y32##', Y32);
	sourceContent= replaceAll(sourceContent, '##Y33##', Y33);
	sourceContent= replaceAll(sourceContent, '##Y34##', Y34);
	sourceContent= replaceAll(sourceContent, '##Y35##', Y35);
	sourceContent= replaceAll(sourceContent, '##Y36##', Y36);
	sourceContent= replaceAll(sourceContent, '##Y37##', Y37);
	sourceContent= replaceAll(sourceContent, '##Y38##', Y38);
	sourceContent= replaceAll(sourceContent, '##Y39##', Y39);

	sourceContent= replaceAll(sourceContent, '##Y42##', Y42);
	sourceContent= replaceAll(sourceContent, '##Y43##', Y43);
	sourceContent= replaceAll(sourceContent, '##Y44##', Y44);
	sourceContent= replaceAll(sourceContent, '##Y45##', Y45);
	sourceContent= replaceAll(sourceContent, '##Y46##', Y46);
	sourceContent= replaceAll(sourceContent, '##Y47##', Y47);
	sourceContent= replaceAll(sourceContent, '##Y48##', Y48);

	sourceContent= replaceAll(sourceContent, '##Y51##', Y51);
	sourceContent= replaceAll(sourceContent, '##Y52##', Y52);
	sourceContent= replaceAll(sourceContent, '##Y53##', Y53);
	sourceContent= replaceAll(sourceContent, '##Y54##', Y54);
	sourceContent= replaceAll(sourceContent, '##Y55##', Y55);
	sourceContent= replaceAll(sourceContent, '##Y56##', Y56);
	sourceContent= replaceAll(sourceContent, '##Y57##', Y57);
	sourceContent= replaceAll(sourceContent, '##Y58##', Y58);
	sourceContent= replaceAll(sourceContent, '##Y59##', Y59);
	sourceContent= replaceAll(sourceContent, '##Y60##', Y60);
	sourceContent= replaceAll(sourceContent, '##Y61##', Y61);
	sourceContent= replaceAll(sourceContent, '##Y62##', Y62);
	sourceContent= replaceAll(sourceContent, '##Y63##', Y63);
	sourceContent= replaceAll(sourceContent, '##Y64##', Y64);
	sourceContent= replaceAll(sourceContent, '##Y65##', Y65);
	sourceContent= replaceAll(sourceContent, '##Y66##', Y66);
	sourceContent= replaceAll(sourceContent, '##Y67##', Y67);
	sourceContent= replaceAll(sourceContent, '##Y68##', Y68);
	sourceContent= replaceAll(sourceContent, '##Y69##', Y69);
	sourceContent= replaceAll(sourceContent, '##Y70##', Y70);
	
	sourceContent= replaceAll(sourceContent, '##Y73##', Y73);
	sourceContent= replaceAll(sourceContent, '##Y74##', Y74);
	sourceContent= replaceAll(sourceContent, '##Y75##', Y75);
	sourceContent= replaceAll(sourceContent, '##Y76##', Y76);
	
	//sourceContent= replaceAll(sourceContent, '##Y78##', Y78);
	
	//sourceContent= replaceAll(sourceContent, '##Y80##', Y80);
	
	sourceContent= replaceAll(sourceContent, '##Y82##', Y82);
	sourceContent= replaceAll(sourceContent, '##Y83##', Y83);
	sourceContent= replaceAll(sourceContent, '##Y84##', Y84);
	sourceContent= replaceAll(sourceContent, '##Y85##', Y85);
	//sourceContent= replaceAll(sourceContent, '##Y86##', Y86);
	//sourceContent= replaceAll(sourceContent, '##Y87##', Y87);
	sourceContent= replaceAll(sourceContent, '##Y88##', Y88);
	sourceContent= replaceAll(sourceContent, '##Y89##', Y89);	
	return sourceContent;

}



/***********************************************************************************************************
 * reInitializingGlobalVariables - re -initializing the global variables 
 *
 **********************************************************************************************************/
function reInitializingGlobalVariables()
{
	
	 revProgrammeFees = 0;
	 revFilmProduction = 0;
	 revStoryWeb = 0;
	 revTsWorkshops = 0;
	 revLaveryRoom = 0;
	 revTravel = 0;
	 revCurrency = 0;
	 cosFreelanceStaff = 0;
	 cosFreelanceStaffDelivery = 0;
	 cosExternalDesign = 0;
	 cosSalesCommission = 0;
	 cosFilmVideo = 0;
	 cosStoryWeb = 0;
	 cosPrinting = 0;
	 cosTsWorkshops = 0;
	 cosLaveryRoom = 0;
	 cosTravel = 0;
	 cosOther = 0;
	 employmentCosts = 0;
	 propertyCosts = 0;
	 adminCosts = 0;
	 professionalFees = 0;
	 monthlyGroup ='';
	 amount = 0;
	 revTotalAmount = 0;
	 cosTotalAmount =0;
	 cosRevenuePercentage = 0;
	 grossProfit = 0;
	 grossProfitRevenuePercentage =0;
	 totalExpenses = 0;
	 EBITDA =0;
	 headCount = 0; 
	 salSalaries = 0;
	 salErs = 0;
	 salFreelanceStaff = 0;
	 salRedandancy = 0;
	 salCpd = 0;
	 salNonRechargable = 0 ;
	 salITCharge = 0;
	 salProfService = 0;
	 salStaffEntertain = 0;
	 spaRent = 0;
	 spaRates= 0;
	 spaWaterRates = 0;
	 spaOfficeCleaning = 0;
	 spaInsurance = 0;
	 spaRepairs = 0;
	 spaRelocation = 0;
	 ovePrint = 0;
	 oveRevised = 0;
	 oveTelephoneSystem = 0;
	 oveTelephoneCalls = 0;
	 oveHeat = 0;
	 oveInsurances = 0;
	 oveClientEntertain = 0;
	 oveITCosts = 0;
	 oveITRecovery = 0;
	 oveCompanyMeeting = 0;
	 oveDevCosts = 0;
	 ovePromotion = 0;
	 oveAwards = 0;
	 oveForums = 0;
	 oveMarketing = 0;
	 oveSales = 0;
	 oveUSSales = 0;
	 oveBankCharges = 0;
	 oveRecruitment = 0;
	 oveSunryOffice = 0;
	 profAudit = 0;
	 profAccounting = 0;
	 profLegal = 0;
	 profOther = 0;
	 operatingProfit = 0;

	 searchColInternalId = '';
}


/***********************************************************************************************************
 * calculateData - calculating and assigning the data to appropriate variables
 * 
 *@param searchResultsArray - the array with the appropriate search results data
 *[TODO] - editing
 **********************************************************************************************************/
function calculateData(searchResultsArray)
{	var summaryGroupType = '';
	var summaryGroup ='';
	errorMessage += '\nIn Calc Data!';
	for(var index =0  ; index < searchResultsArray.length ; index++)
	{

		monthlyGroup = searchResultsArray[index].getText(searchColumns[1]);
		summaryGroup = searchResultsArray[index].getText(searchColumns[2]);
		summaryGroupType = summaryGroup.substring(0, 3);
		
		amount = searchResultsArray[index].getValue(searchColumns[0]);
		amount = Math.abs(amount); 												//Getting only the positive values
		

		//if amount is null then convert it in to a float (if not do this,then when we calculating the total it gives NaN as '' will regarded as a string )
		if(amount == '')
		{
			amount = '0.00';
		}

		
		//checking the summaryGroup to calculate the totals
		if(summaryGroupType=='Rev')
		{
			revTotalAmount = revTotalAmount + parseFloat(amount);

		}
		else if(summaryGroupType =='COS')
		{
			cosTotalAmount = cosTotalAmount + parseFloat(amount);
		}
		else if(summaryGroup == 'Employment Costs')
		{
			employmentCosts = parseFloat(amount).toFixed(2);
		}
		else if(summaryGroup == 'Property Costs')
		{
			propertyCosts = parseFloat(amount).toFixed(2);
		}
		else if(summaryGroup == 'Administrative Costs')
		{
			adminCosts = parseFloat(amount).toFixed(2);
		}
		else if(summaryGroup == 'Professional Fees')
		{
			professionalFees = parseFloat(amount).toFixed(2);
		}

		
		//checking the monthlyGroup to make the calculations
		switch(monthlyGroup)
		{
			case('Rev: Programme Fees'):
				revProgrammeFees = parseFloat(amount).toFixed(2);
			break;

		case('Rev: Film & production'):
				revFilmProduction = parseFloat(amount).toFixed(2);
		break;

		case('Rev: StoryWeb'):
			revStoryWeb = parseFloat(amount).toFixed(2);
		break;

		case('Rev: TS Workshops'):
			revTsWorkshops = parseFloat(amount).toFixed(2);
		break;

		case('Rev: Lavery room'):
			revLaveryRoom = parseFloat(amount).toFixed(2);
		break;

		case('Rev: Travel'):
			revTravel = parseFloat(amount).toFixed(2);
		break;

		case('Rev: Currency'):
			revCurrency = parseFloat(amount).toFixed(2);
		break;

		
		
		case('Cos: Freelance staff'):
			cosFreelanceStaff  = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Freelance staff -Delivery'):
			cosFreelanceStaffDelivery = parseFloat(amount).toFixed(2);
		break;

		case('Cos: External design - Storyfactory'):
			cosExternalDesign  = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Sales Commission'):
			cosSalesCommission = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Storyweb'):
			cosStoryWeb = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Printing'):
			cosPrinting = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Film/video'):
			cosFilmVideo = parseFloat(amount).toFixed(2);
		break;

		case('Cos: TS Workshops'):
			cosTsWorkshops = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Lavery Room'):
			cosLaveryRoom = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Other'):
			cosOther = parseFloat(amount).toFixed(2);
		break;

		case('Cos: Travel'):
			cosTravel = parseFloat(amount).toFixed(2);
		break;

		
		
		case('Sal: Salaries'):
			salSalaries  = parseFloat(amount).toFixed(2);
		break;
		
		case('Sal: Er\'s NIC & Pension Contributions'):
			salErs = parseFloat(amount).toFixed(3);
		break;
		
		case('Sal: Freelance Staff'):
			salFreelanceStaff = parseFloat(amount).toFixed(2);
		break;
		
		case('Sal: Redundancy'):
			salRedandancy = parseFloat(amount).toFixed(2);
		break;
		
		case('Sal: CPD'):
			salCpd = parseFloat(amount).toFixed(2);
		break;
		
		case('Sal: Non-rechargeable travel/subs/expenses'):
			salNonRechargable = parseFloat(amount).toFixed(2);
		break;
		
		case('Sal: IT Charge'):
			salITCharge = parseFloat(amount).toFixed(2);
		break;
		
		case('Sal: Professional Services'):

			salProfService = parseFloat(amount).toFixed(2);
		
		
		//content+="<script type=\"text/javascript\">alert('Professional Services');</script>";
		
		errorMessage += '\nSalProfService: ' + amount.toString();
		
		break;
		
		case('Sal: Staff entertaining'):
			salStaffEntertain = parseFloat(amount).toFixed(2);
		break;
		
		
		
		case('Spa: Rent'):
			spaRent = parseFloat(amount).toFixed(2);
		break;
		
		case('Spa: Rates'):
			spaRates = parseFloat(amount).toFixed(2);
		break;
		
		case('Spa: Water rates'):
			spaWaterRates = parseFloat(amount).toFixed(2);
		break;
		
		case('Spa: Office Cleaning etc.'):
			spaOfficeCleaning = parseFloat(amount).toFixed(2);
		break;
		
		case('Spa: Insurance and estate charge'):
			spaInsurance = parseFloat(amount).toFixed(2);
		break;
		
		case('Spa: Repairs and Maintenance'):
			spaRepairs = parseFloat(amount).toFixed(2);
		break;
		
		case('Spa: Reallocation Costs'):
			spaRelocation = parseFloat(amount).toFixed(2);
		break;
		
		
		
		case('Ove: Print, post and stationery'):
			ovePrint = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Revised Internet Leased Line'):
			oveRevised = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Telephone System Leasing'):
			oveTelephoneSystem = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Telephone Calls'):
			oveTelephoneCalls = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Heat and Light'):
			oveHeat = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Insurances'):
			oveInsurances = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Client Entertaining'):
			oveClientEntertain = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: IT Costs'):
			oveITCosts = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: IT Recovery'):
			oveITRecovery = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Company Meeting'):
			oveCompanyMeeting = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Development Costs'):
			oveDevCosts = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Promotion'):
			ovePromotion = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Awards and Subscriptions'):
			oveAwards = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Forums and Conferences'):
			oveForums = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Marketing'):
			oveMarketing = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Sales Activities'):
			oveSales = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: US Sales'):
			oveUSSales = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Bank Charges'):
			oveBankCharges = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Recruitment'):
			oveRecruitment = parseFloat(amount).toFixed(2);
		break;
		
		case('Ove: Sunry Office Costs'):
			oveSunryOffice = parseFloat(amount).toFixed(2);
		break;
		
		
		
		case('Pro: Audit'):
			profAudit = parseFloat(amount).toFixed(2);
		break;
		
		case('Pro: Accounting Software'):
			profAccounting = parseFloat(amount).toFixed(2);
		break;
		
		case('Pro: Legal'):
			profLegal = parseFloat(amount).toFixed(2);
		break;
		
		case('Pro: Other'):
			profOther = parseFloat(amount).toFixed(2);
		break;
		
		case('Head Count '):
			headCount = parseFloat(amount).toFixed(2);
		break;
		
		
		default :
			//alert('default tripped:\nAmount: ' + amount + '\nMonthlyGroup: ' + monthlyGroup);
			errorMessage += '\ndefault: ' + amount.toString();
			break;
		}

	}

	grossProfit = revTotalAmount - cosTotalAmount ;

	//To avoid the 'division by 0' error
	if(revTotalAmount != 0)
	{
		cosRevenuePercentage = (cosTotalAmount / revTotalAmount) * 100;
		grossProfitRevenuePercentage = (grossProfit / revTotalAmount) * 100;
	}
	//Math.abs is for getting the absolute value regardless of the sign (otherwise the calculation doesn't work properly)
	totalExpenses =  employmentCosts  + propertyCosts + adminCosts + professionalFees; 
	operatingProfit = revTotalAmount - (cosTotalAmount +  totalExpenses);
	EBITDA = parseFloat(grossProfit/1000) - parseFloat(totalExpenses/1000);


}



/*************************************************************************************
 * getSearchResults function - to get the search results from the custom record : budgets and actuals, according to the data passing
 * 
 *************************************************************************************/
function getSearchResults(seachColumnInternalId)
{
	var searchResults = null;

	searchColumns[0] = new nlobjSearchColumn(seachColumnInternalId, null, 'sum');
	searchColumns[1] = new nlobjSearchColumn('custrecord_ba_mon_reporting_group', null, 'group');
	searchColumns[2] = new nlobjSearchColumn('custrecord_ba_sum_reporting_group', null, 'group');

	searchResults = nlapiSearchRecord('customrecord_budgets_and_actuals', null, null, searchColumns);
	
	return searchResults;
}








