function Clearparent()
{

	nlapiSetFieldValue('parent',null,false);
	NLMultiButton_doAction('multibutton_submitter','submitter');
	
}
