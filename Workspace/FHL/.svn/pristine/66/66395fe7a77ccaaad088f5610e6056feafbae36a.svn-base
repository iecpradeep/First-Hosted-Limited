// Public Variables
var bTesting = 'T';

function check_status()
{
	
	var verifier;
	var veto;
	var so_status = nlapiGetFieldValue('custbody19');
	var count = nlapiGetLineItemCount('item');

	if (so_status == 1)
	{

		for (var x=1 ; x<= count ;x++)
		{

			var site_check = nlapiGetLineItemValue('item','custcol6', x);
			var veto_check = nlapiGetLineItemValue('item','custcol7', x);
		
			if (site_check == 'T')
			{
				verifier = nlapiGetLineItemValue('item','custcolfhl_verifier', x);
			}
		
			if (veto_check == 'T')
			{
				veto = nlapiGetLineItemValue('item','custcolfhl_verifier', x);
			}
		
		}

		if ((verifier == '') || (veto == ''))
		{
			alert('You must select both a Verifier and a Veto Reviewer before you can create the Purchase Orders and the Job!');
		}
		else
		{
			nlapiSetFieldValue('custbody19',2,false);
		//	create_po();
			create_pos_and_jobs();
		}
	}
	else
	{
		alert('Purchase Orders and the Job has already been created for this Order!');
	}
}

// New System for handling Parent/Child Sites

//
// create_pos_and_jobs
//
function create_pos_and_jobs()
{

	// Create and Initialise Variables
	
	// General Variables
	var count = nlapiGetLineItemCount('item');
	var scheme = nlapiGetFieldValue('custbody20');
	var item_veri;
	var item_veto;
	var item;
	var site_visit = 'F';
	var veto_review = 'F';
	var job_creation = 'F';
	var training_item = 'F';
	
	// P/O & Job Variables
	var verifier;
	var reviewer;
	var miles;
	var car_em;
	var job_id;
	var doc_link;
	var veri_po_id;
	var veto_po_id;
	var sales_order = nlapiGetFieldValue('tranid');
	var visit_item;
	var visit_qty;
	var visit_skills;
	var visit_country;
	var visit_job_value;
	var visit_booking_con;
	var visit_booking_ddi;
	var visit_booking_mobile;
	var visit_booking_email;
	var visit_description;
	var visit_shipaddress;
	var visit_target_date;
	var veto_item;
	var veto_qty;	
	var veto_job_value;
	var visit_client;
	var supplier;
	var supplier2;

	doc_link = get_document(scheme);
			
	// loop thru items
	// getting: item, site_visit, veto_review - per loop
	for (var x=1 ; x<= count ;x++)
	{
		// store item
		item = nlapiGetLineItemValue('item','item', x);
		// store site_visit checkbox status
		site_visit = nlapiGetLineItemValue('item','custcol6', x);
		veto_review = nlapiGetLineItemValue('item','custcol7', x);
			
		if (item == 121)
		{
			job_creation = 'T';
		}
		
		// if the item is a site visit item then
		// store the site visit details in the 
		// variables
		if (site_visit == 'T')
		{	
			item_veri = nlapiGetLineItemValue('item','item', x);
			supplier = nlapiGetLineItemValue('item','custcolfhl_verifier', x);
			verifier = get_verifier_details(nlapiGetLineItemValue('item','custcolfhl_verifier', x));
			miles = nlapiGetLineItemValue('item','custcol4', x);
			visit_qty = nlapiGetLineItemValue('item','quantity', x);
			visit_job_value = nlapiGetLineItemValue('item','custcol16', x);
			visit_target_date = nlapiGetLineItemValue('item','custcol3', x);
			car_em = get_caremissions(supplier);
			visit_skills = nlapiGetLineItemValue('item','custcol13', x);
			visit_booking_con = nlapiGetLineItemValue('item','custcol9', x);
			visit_booking_ddi = nlapiGetLineItemValue('item','custcol10', x);
			visit_booking_mobile = nlapiGetLineItemValue('item','custcol11', x);
			visit_booking_email = nlapiGetLineItemValue('item','custcol12', x);
			visit_description = nlapiGetLineItemValue('item','description', x);
			visit_shipaddress = nlapiGetLineItemValue('item','custcol14', x);
			visit_client = nlapiGetLineItemValue('item','custcol15', x);

		}
				
			
		
		// if the item is a veto review item then
		// store the veta review details in the 
		// variables
		if (veto_review == 'T')
		{
			item_veto = nlapiGetLineItemValue('item','item', x);
			supplier2 = nlapiGetLineItemValue('item','custcolfhl_verifier', x);
			reviewer = get_verifier_details(nlapiGetLineItemValue('item','custcolfhl_verifier', x));
			visit_description = nlapiGetLineItemValue('item','description', x);
			visit_client = nlapiGetLineItemValue('item','custcol15', x);
			veto_qty = nlapiGetLineItemValue('item','quantity', x);
			veto_job_value = nlapiGetLineItemValue('item','custcol1', x);
			visit_target_date = nlapiGetLineItemValue('item','custcol3', x);
		}
		
		// if the item is a job creation item then
		// a job record needs to be created 
		if (job_creation == 'T')
		{
			// create site visit purchase order		
			veri_po_id = create_veri_po(verifier,supplier,miles,training_item,item_veri,visit_qty,visit_job_value,visit_target_date,sales_order,doc_link,scheme,visit_skills,visit_booking_con,visit_booking_ddi,visit_booking_mobile,visit_booking_email,visit_description,visit_shipaddress,visit_client);
			veri_po_id = nlapiLookupField('purchaseorder',veri_po_id, 'tranid');

			// create veto review purchase order
			veto_po_id = create_veto_po(reviewer,supplier2,item_veto,veto_qty,veto_job_value,visit_target_date,sales_order,scheme,visit_description,visit_client);
			veto_po_id = nlapiLookupField('purchaseorder',veto_po_id, 'tranid');
				
			// create the job
			job_id = new_task(visit_client,visit_shipaddress,visit_booking_con,supplier,supplier2,visit_target_date,visit_qty,veto_qty,sales_order,miles,car_em,scheme,veri_po_id)
			
			// update the log?
			log_details(Date(),sales_order,job_id,veri_po_id,veto_po_id,nlapiGetUser());
			
			// reset the variables
			job_creation = 'F';
			training_item = 'F';
			job_id = 0;
			veri_po_id = 0;
			veto_po_id = 0;
			miles = 0;
			car_em = 0;
			visit_skills = '';
			visit_booking_con = '';
			visit_booking_ddi = '';
			visit_booking_mobile = '';
			visit_booking_email = '';
	
		}
		
	}
	
	alert('Purchase Orders and Jobs have now been generated');

	if (confirm('This Order will now be saved - OK?') == true)
	{
		NLMultiButton_doAction('multibutton_submitter','submitter')
	}
	
}

//
// create_veri_po
//
function create_veri_po(verifier,supplier,miles,training,item,qty,value,target,sales_order,doc_link,scheme,visit_skills,visit_booking_con,visit_booking_ddi,visit_booking_mobile,visit_booking_email,visit_description,visit_shipaddress,visit_client)
{
	var price;
	var rateformiles;
	var veri_vat_reg;
	var veri_ec;
	
	// create purchase order - verifier
	// populate the purchase order based on the variables
	var record = nlapiCreateRecord('purchaseorder');
	record.setFieldValue('entity', verifier );
	record.setFieldValue('custbodyfhl_po_client',visit_client);
	record.setFieldValue('custbodyfhl_po_book',visit_booking_con);
	record.setFieldValue('custbody11',visit_booking_ddi);
	record.setFieldValue('custbody12',visit_booking_mobile);
	record.setFieldValue('custbody13',visit_booking_email);
	record.setFieldValue('custbody15',visit_shipaddress);
	record.setFieldValue('duedate',target);
	record.setFieldValue('custbody1',sales_order);
	record.setFieldValue('custbody21',doc_link);
	record.setFieldValue('custbody20',scheme);
	record.setFieldValue('custbody28',visit_skills);
	if (training == 'F')
	{
		price = get_dayrate(supplier);
	}
	else
	{
		price = 0;
	}

	veri_vat_reg = nlapiLookupField('vendor',verifier, 'custentityvatregistered');
	veri_ec = nlapiLookupField('vendor',verifier, 'custentitysupplierec');
		
	if ((veri_vat_reg == 'T') && (veri_ec == 'F'))
	{
		record.setLineItemValue('item','taxcode',1,4);
	}
	if ((veri_vat_reg == 'T') && (veri_ec == 'T'))
	{
		record.setLineItemValue('item','taxcode',1,7);
	}
	if ((veri_vat_reg == 'F') && (veri_ec == 'F'))
	{	
		record.setLineItemValue('item','taxcode',1,126);
	}
	if ((veri_vat_reg == 'F') && (veri_ec == 'T'))
	{
		record.setLineItemValue('item','taxcode',1,125);
	}
	
	record.setLineItemValue('item', 'item', 1, item);
	record.setLineItemValue('item', 'quantity', 1, qty);
	record.setLineItemValue('item', 'rate', 1, price);


	if (miles > 0)
	{
		rateformiles = get_milesrate(supplier);
		record.setLineItemValue('item', 'item', 2, 113);
		record.setLineItemValue('item', 'quantity', 2, miles);
		record.setLineItemValue('item', 'rate', 2, rateformiles);
	}
	
	try
	{
		var id = nlapiSubmitRecord(record, true);
	}
	catch(e)
	{
		alert('An Error Has Been Generated: ' + e.description);
		error_handler('create_veri_po',"An error has occured when generating the Verifier Purchase Order!","N/A","N/A",nlapiGetUser());
	}
	
	if (confirm('An email will now be sent to the Verifier - OK?') == true)
	{
		veri_email = get_email(supplier);
		email_subject = 'You have been assigned a new Job, please check your Subcontractor Centre!';
		nlapiSendEmail( -5, veri_email, 'New Job', email_subject , null, null, null );
	}
	
	return id;
}




// tax codes
// 4 - T1 - Standard Rate UK
// 7 - T3 - Out of Scope
// 126 - T8 - EC Standard
// 125 - T7 - EC Zero

// record.setLineItemValue('item','taxcode',1,7);




//
// create_veto_po
//
function create_veto_po(reviewer,supplier,item,qty,value,target,sales_order,scheme,visit_description,visit_client)
{


	// create purchase order - reviewer
	// populate the purchase order based on the variables
	var record = nlapiCreateRecord('purchaseorder');
	record.setFieldValue('entity', reviewer );
	record.setFieldValue('custbodyfhl_po_client',visit_client);
	record.setFieldValue('duedate',target);
	record.setFieldValue('custbody1',sales_order);
	record.setFieldValue('custbody20',scheme);
	

	price = get_dayrate(supplier);


	record.setLineItemValue('item', 'item', 1, item);
	record.setLineItemValue('item', 'quantity', 1, qty);
	record.setLineItemValue('item', 'rate', 1, price);
	
	try
	{
		var id = nlapiSubmitRecord(record, true);
	}
	catch(e)
	{
		alert('An Error Has Been Generated: ' + e.description);
		error_handler('create_veto_po',"An error has occured when generating the Veto Review Purchase Order!","N/A","N/A",nlapiGetUser());
	}
	return id;
}

//
// create_job
//
function create_job(site,address,contact,nap,per,reg,veri,veta,datedue,sitedur,vetodur,sales_ord,miles,car_em,scheme,emi,po_num)
{
	var record = nlapiCreateRecord('customrecord25');
	
	record.setFieldValue('custrecord3',site);
	record.setFieldValue('custrecord4',address);
	record.setFieldValue('custrecord5',contact);
	record.setFieldValue('custrecord6',nap);
	record.setFieldValue('custrecord7',per);
	record.setFieldValue('custrecord8',reg);
	record.setFieldValue('custrecord9',veri);
	record.setFieldValue('custrecord10',datedue);
	record.setFieldValue('custrecord19',veta);
	record.setFieldValue('custrecord93',sitedur);
	record.setFieldValue('custrecord94',vetodur);
	record.setFieldValue('custrecord99',sales_ord);
	record.setFieldValue('custrecord114',miles);
	record.setFieldValue('custrecord113',car_em);
	record.setFieldValue('custrecord130',scheme);
	record.setFieldValue('custrecord126',emi);
	record.setFieldValue('custrecord142',po_num);
	id = nlapiSubmitRecord(record,true);
	alert('Job Created');
	return id;
}

//
// get_verifier_details
//
function get_verifier_details(supplier1)
{
	switch(supplier1)
	{
	case '3656':
  		supplier2 = 3655;
  	break;    
	case '3093':
  		supplier2 = 3070;
  	break;   
	case '3113':
  		supplier2 = 3062;
  	break;   
	case '3658':
  		supplier2 = 3657;
  	break;   
	case '3648':
  		supplier2 = 3076;
  	break;   
	case '3096':
  		supplier2 = 3068;
  	break;   
	case '3156':
  		supplier2 = 3074;
  	break;   
	case '3652':
  		supplier2 = 3079;
  	break;   
	case '3137':
  		supplier2 = 3033;
  	break;   
	case '3112':
  		supplier2 = 3060;
  	break;   
	case '3651':
  		supplier2 = 3059;
  	break;   
	case '3650':
  		supplier2 = 3035;
  	break;   
	case '3649':
  		supplier2 = 3072;
  	break;   
	case '3152':
  		supplier2 = 3064;
  	break;   
	case '3090':
  		supplier2 = 3066;
  	break;   
	case '3162':
  		supplier2 = 3077;
  	break;   
	default:
		alert('An Error has Occurred! (' + supplier1 + ')');
		error_handler("get_verifier_details","Invalid Supplier ID - Possible a new verifier has been added","supplier1",supplier1,nlapiGetUser());
	}
	return supplier2;
}


function error_handler(sFunction,sErrordesc,sField,sValue,sUser)
{

}

function log_details(dDate,iSO,iJob,iPO_veri,iPO_veto,sUser)
{

}

function get_document(scheme)
{
	var document_link;

	if (scheme == 1)
	{
		document_link = nlapiGetFieldText('custbody25');
	}
	
	if (scheme == 2)
	{
		document_link = nlapiGetFieldText('custbody22');
	}
	
	if (scheme == 3)
	{
		document_link = nlapiGetFieldText('custbody23');
	}
	
	if (scheme == 4 || scheme == 5)
	{
		document_link = nlapiGetFieldText('custbody24');
	}
	
	if (scheme == 6)
	{
		document_link = nlapiGetFieldText('custbody26');
	}
	
	if (scheme == 7)
	{
		document_link = nlapiGetFieldText('custbody27');
	}

	return document_link;
}

function vat_reg(verifier)
{
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );
	
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'custentityvatregistered' );
	
	var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );
	
	for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
	{
		var searchresult = searchresults[ i ];
		var veri_vat = searchresult.getValue( 'custentityvatregistered' );
	}
	
	return veri_vat;
}

function get_email(verifier)
{
	var veri_email;
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );
	
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'email' );
	
	var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );
	
	for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
	{
		var searchresult = searchresults[ i ];
		var veri_email = searchresult.getValue( 'email' );
	}
	
	return veri_email;
}

function get_milesrate(verifier)
{
	var milesrate;

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'custentity27' );
	

	var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

	for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
	{		
		var searchresult = searchresults[ i ];
		var milesrate = searchresult.getValue( 'custentity27' );
	}

 return milesrate;
}

function get_dayrate(verifier)
{
	var dayrate;

	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'custentity26' );

	var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );
	for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
	{		
		var searchresult = searchresults[ i ];
		var dayrate = searchresult.getValue( 'custentity26' );
	}

 return dayrate;
}

function get_caremissions(verifier)
{
	var car_emissions;
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'custentityco2emissions' );
	

	var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

	for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
	{		
		var searchresult = searchresults[ i ];
		var car_emissions = searchresult.getValue( 'custentityco2emissions' );
	}

 return car_emissions;
}

function check_verifier(type,name)
{

	var everything_fine;
	everything_fine = true;
	
	if (name =='custcolfhl_verifier')
	{

		var item;
		var miles;

		item = nlapiGetCurrentLineItemText('item','item');
		miles = nlapiGetCurrentLineItemValue('item','custcol4');


		var site_check = nlapiGetCurrentLineItemValue('item','custcol6');
		var veto_check = nlapiGetCurrentLineItemValue('item','custcol7');
	

		if (site_check == 'T')
		{
			var verifier;
			var scheme;
			var skill = nlapiGetCurrentLineItemValue('item','custcol13');
			verifier = nlapiGetCurrentLineItemValue('item','custcolfhl_verifier');
			scheme = nlapiGetFieldValue('custbody20');

			var itemid = nlapiGetCurrentLineItemText('item','item');
		
			var filters = new Array();
			filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

			var columns = new Array();
			columns[0] = new nlobjSearchColumn( 'entityid' );
			columns[1] = new nlobjSearchColumn( 'custentity16' );
			columns[2] = new nlobjSearchColumn( 'custentity23' );
			columns[3] = new nlobjSearchColumn( 'custentity21' );
			columns[4] = new nlobjSearchColumn( 'custentity22' );
			columns[5] = new nlobjSearchColumn( 'custentity24' );
			columns[6] = new nlobjSearchColumn( 'custentity25' );
			columns[7] = new nlobjSearchColumn( 'custentity26' );
			columns[8] = new nlobjSearchColumn( 'custentity27' );

			var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

			for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
			{		
				var searchresult = searchresults[ i ];
				var CCA = searchresult.getText( 'custentity16' );
				var euets = searchresult.getText( 'custentity23' );
				var carbon = searchresult.getText( 'custentity21' );
				var crc = searchresult.getText( 'custentity22' );
				var oiw = searchresult.getText( 'custentity24' );
				var train = searchresult.getText( 'custentity25' );
				var scheme_cca = skill;
				var scheme_euets = skill;
				var scheme_carbon = skill;
				var scheme_crc = skill;
				var scheme_oiw = skill;
				var scheme_train = skill;
				var dayrate = searchresult.getValue( 'custentity26' );
				var milesrate = searchresult.getValue( 'custentity27' );

				switch(scheme)
				{
				case '4':
					if (euets == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (euets.match(scheme_euets))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				case '2':
					if (CCA == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (CCA.match(scheme_cca))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				case '6':
					if (oiw == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (oiw.match(scheme_oiw))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				case '1':
					if (carbon == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (carbon.match(scheme_carbon))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				case '3':
					if (crc == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (crc.match(scheme_crc))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				case '7':
					if (train == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (train.match(scheme_train))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				case '5':
					if (euets == null)
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}

					if (euets.match(scheme_euets))
					{
					
					}
					else
					{
						alert('Current Verifier Does Not Have The Correct Skill Classification!');
						everything_fine = false;
					}		
				break;
				}

			}
		}
		else
		{
			var verifier;

			verifier = nlapiGetCurrentLineItemValue('item','custcolfhl_verifier');

			var itemid = nlapiGetCurrentLineItemText('item','item');
	
			var filters = new Array();
			filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

			var columns = new Array();
			columns[0] = new nlobjSearchColumn( 'custentityfhl_supp_verifiertype');
			columns[1] = new nlobjSearchColumn( 'custentity26' );
			columns[2] = new nlobjSearchColumn( 'custentity27' );

			var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

			for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
			{		
				var searchresult = searchresults[ i ];
				var type = searchresult.getValue( 'custentityfhl_supp_verifiertype' );
				if ((type != 1) && (type != 2))
				{
					alert('This verifier is not a Technical Expert or a Lead Verifier!');
					everything_fine = false;
				}
				var dayrate = searchresult.getValue( 'custentity26' );
				var milesrate = searchresult.getValue( 'custentity27' );
			}
			
		}

	get_cost(dayrate,milesrate);

	}

	if (name=='custcol4')
	{

		var verifier;
		verifier = nlapiGetCurrentLineItemValue('item','custcolfhl_verifier');
	
		var filters = new Array();
		filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

		var columns = new Array();
		columns[0] = new nlobjSearchColumn( 'entityid' );
		columns[1] = new nlobjSearchColumn( 'custentity26' );
		columns[2] = new nlobjSearchColumn( 'custentity27' );

		var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

		for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
		{		
			var searchresult = searchresults[ i ];
			var dayrate = searchresult.getValue( 'custentity26' );
			var milesrate = searchresult.getValue( 'custentity27' );
		}

		get_cost(dayrate,milesrate);
	}

	return everything_fine;
}

function get_cost(dayrate,milesrate)
{
	var jobvalue = 0;
	var description;
	var quantity = 0;
	var miles = 0;
	var milpay = 0;
	var total;

	miles = nlapiGetCurrentLineItemValue('item','custcol4');
	quantity = nlapiGetCurrentLineItemValue('item','quantity');
	description = nlapiGetCurrentLineItemValue('item','description');
	description = description + '( ' + quantity + ' days )';

	milpay = milesrate * miles;

	jobvalue = dayrate * quantity;
	
	total = jobvalue + milpay;

	//nlapiSetFieldValue('custbody4',total);
	nlapiSetCurrentLineItemValue('item','custcol16',total,false);	
	//nlapiSetFieldValue('custbody14',description);
}

function create_task(veri,veto,sales_order,car_em,po_num,siteid,add,con)
{

	//var siteid = nlapiGetFieldValue('entity');
	//var add = nlapiGetFieldValue('custbody15');
	//var con = nlapiGetFieldValue('custbodyfhl_po_book');
	//var nap = nlapiGetFieldValue('custbody16');
	//var per = nlapiGetFieldValue('custbody17');
	//var reg = nlapiGetFieldValue('custbody18');
	var due;
	var sitedur;
	var vetodur;
	var miles;
	var mile_km = 1.6093;
	var km;
	var emi = 0;
	var emi2 = 0;
	
	var car_emissions;
	var scheme = nlapiGetFieldValue('custbody20'); 
	
 	var count = nlapiGetLineItemCount('item');

	for (var x=1 ; x<= count ;x++)
	{
		var item = nlapiGetLineItemText('item','item',x);
		var task = nlapiGetLineItemValue('item','description', x);
		var resp = nlapiGetLineItemValue('item','custcolfhl_verifier', x);
		var duedate = nlapiGetLineItemValue('item','custcol3',x);
		var qty = nlapiGetLineItemValue('item','quantity',x);

		var site_check = nlapiGetLineItemValue('item','custcol6', x);
		var veto_check = nlapiGetLineItemValue('item','custcol7', x);

			due = duedate;
			sitedur = qty;
			miles = nlapiGetLineItemValue('item','custcol4', x);
			km = miles * mile_km;
			emi = (km * car_em);
			emi2 = Math.round(emi);
			vetodur = qty;
	
	}	

	new_task(siteid,add,con,veri,veto,due,sitedur,vetodur,sales_order,miles,car_em,scheme,emi2,po_num);

}


function new_task(site,address,contact,veri,veto,datedue,sitedur,vetodur,sales_ord,miles,car_em,scheme,po_num)
{

	var mile_km = 1.6093;
	var km;
	var emi = 0;
	var emi2 = 0;
	km = miles * mile_km;
	emi = (km * car_em)/1000;
	emi2 = Math.round(emi);

	var record = nlapiCreateRecord('customrecord25');
	
	record.setFieldValue('custrecord3',site);
	record.setFieldValue('custrecord4',address);
	record.setFieldValue('custrecord5',contact);
	//record.setFieldValue('custrecord6',nap);
	//record.setFieldValue('custrecord7',per);
	//record.setFieldValue('custrecord8',reg);
	record.setFieldValue('custrecord9',veri);
	record.setFieldValue('custrecord10',datedue);
	record.setFieldValue('custrecord19',veto);
	record.setFieldValue('custrecord93',sitedur);
	record.setFieldValue('custrecord94',vetodur);
	record.setFieldValue('custrecord97',veri);
	record.setFieldValue('custrecord99',sales_ord);
	record.setFieldValue('custrecord114',miles);
	record.setFieldValue('custrecord113',car_em);
	record.setFieldValue('custrecord130',scheme);
	record.setFieldValue('custrecord126',emi2);
	record.setFieldValue('custrecord142',po_num);
	try
	{
		id = nlapiSubmitRecord(record,true);
	}
	catch(e)
	{
		//alert(e.description);
	}
	alert('Job Created');
}

function ValidateLine(type)
{
	var everything_fine;
	everything_fine = true;
	
	var item;
	var miles;

	item = nlapiGetCurrentLineItemText('item','item');
	miles = nlapiGetCurrentLineItemValue('item','custcol4');

	var site_check = nlapiGetCurrentLineItemValue('item','custcol6');
	var veto_check = nlapiGetCurrentLineItemValue('item','custcol7');

	if (site_check == 'T')
	{
		var verifier;
		var scheme;
		var skill = nlapiGetCurrentLineItemValue('item','custcol13');
		verifier = nlapiGetCurrentLineItemValue('item','custcolfhl_verifier');
		scheme = nlapiGetFieldValue('custbody20');

		var itemid = nlapiGetCurrentLineItemText('item','item');
	
		var filters = new Array();
		filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

		var columns = new Array();
		columns[0] = new nlobjSearchColumn( 'entityid' );
		columns[1] = new nlobjSearchColumn( 'custentity16' );
		columns[2] = new nlobjSearchColumn( 'custentity23' );
		columns[3] = new nlobjSearchColumn( 'custentity21' );
		columns[4] = new nlobjSearchColumn( 'custentity22' );
		columns[5] = new nlobjSearchColumn( 'custentity24' );
		columns[6] = new nlobjSearchColumn( 'custentity25' );
		columns[7] = new nlobjSearchColumn( 'custentity26' );
		columns[8] = new nlobjSearchColumn( 'custentity27' );

		var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

		for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
		{		
			var searchresult = searchresults[ i ];
			var CCA = searchresult.getText( 'custentity16' );
			var euets = searchresult.getText( 'custentity23' );
			var carbon = searchresult.getText( 'custentity21' );
			var crc = searchresult.getText( 'custentity22' );
			var oiw = searchresult.getText( 'custentity24' );
			var train = searchresult.getText( 'custentity25' );
			var scheme_cca = skill;
			var scheme_euets = skill;
			var scheme_euets = skill;
			var scheme_euets = skill;
			var scheme_carbon = skill;
			var scheme_crc = skill;
			var scheme_oiw = skill;
			var scheme_train = skill;
			var dayrate = searchresult.getValue( 'custentity26' );
			var milesrate = searchresult.getValue( 'custentity27' );

			switch(scheme)
			{
			case '4':
				if (euets == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (euets.match(scheme_euets))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			case '2':
				if (CCA == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (CCA.match(scheme_cca))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			case '6':
				if (oiw == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (oiw.match(scheme_oiw))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			case '1':
				if (carbon == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (carbon.match(scheme_carbon))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			case '3':
				if (crc == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (crc.match(scheme_crc))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			case '7':
				if (train == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (train.match(scheme_train))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			case '5':
				if (euets == null)
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}

				if (euets.match(scheme_euets))
				{
				
				}
				else
				{
					alert('Current Verifier Does Not Have The Correct Skill Classification!');
					everything_fine = false;
				}		
			break;
			}


			
		}
	}
	else
	{
		if (veto_check == 'T')
		{
			var verifier;

			verifier = nlapiGetCurrentLineItemValue('item','custcolfhl_verifier');

			var itemid = nlapiGetCurrentLineItemText('item','item');
		
			var filters = new Array();
			filters[0] = new nlobjSearchFilter( 'internalid', null, 'anyOf', verifier, null );

			var columns = new Array();
			columns[0] = new nlobjSearchColumn( 'custentityfhl_supp_verifiertype');	

			var searchresults = nlapiSearchRecord( 'contact', null, filters, columns );

			for ( i = 0; searchresults != null && i < searchresults.length ; i++ )
			{		
				var searchresult = searchresults[ i ];
				var type = searchresult.getValue( 'custentityfhl_supp_verifiertype' );
				if ((type != 1) && (type != 2))
				{
					alert('This verifier is not a Technical Expert or a Lead Verifier!');
					everything_fine = false;
				}
			}
		}
		else
		{
			everything_fine = true;
		}
			
	}

	return everything_fine;
}
