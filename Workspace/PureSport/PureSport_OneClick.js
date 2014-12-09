/*******************************************************
* 
* Name:           Pure Sport OneClickFulfilment AKA "MegaButton"
* Script Type:   JavaScript
* Version:        1.3.000
* Date:            November 2011 - January 2012
* Author:         Pete Lewis, First Hosted Limited.
* 
*******************************************************/

function CompleteOrder(type)
{
	var SalesOrderID = nlapiGetRecordId();
	var FulfilmentID = 0;
	var InvoiceID = 0;
	var PaymentID = 0;
	
	var SalesOrderRecord = '';
	var FulfilmentRecord = '';
	var InvoiceRecord = '';
	var PaymentRecord = '';
	
	var AttentionDesc = '';
	var ToMegaFulfil = '';
	var BeenFulfilled = true;
	var TranDate = '';
	
	
	if(type == 'delete')
	{
		nlapiLogExecution('DEBUG', 'MegaFulil','The Transaction is Deleted, thus does not need to be altered.');
		return true;
	}
	
	try
	{
		SalesOrderRecord = nlapiLoadRecord('salesorder', SalesOrderID);
		ToMegaFulfil =  SalesOrderRecord.getFieldValue('custbody_megafulfil');
		TranDate = SalesOrderRecord.getFieldValue('trandate');
				
		if(SalesOrderRecord.getFieldValue('custbody_megafulfildate') == null)
		{
			BeenFulfilled = false;		
		}
		nlapiSubmitRecord(SalesOrderRecord);
	}
	catch(RcdErr)
	{
		nlapiLogExecution('ERROR', 'MegaFulfil Error', RcdErr.message + ', Type initiated: ' + type);
	}
	
	if(ToMegaFulfil == 'T')
	{
		
		if(BeenFulfilled == true)
		{
			SalesOrderRecord = nlapiLoadRecord('salesorder', SalesOrderID);
			SalesOrderRecord.setFieldValue('custbody_megafulfil', 'F');
			AttentionDesc = SalesOrderRecord.getFieldValue('custbody_attention_description') + '\nMegaFulfil: This Sales Order has already been Fulfilled.';
			SalesOrderRecord.setFieldValue('custbody_attention_description', AttentionDesc);
			SalesOrderRecord.setFieldValue('custbody_attention', 'T');
			nlapiSubmitRecord(SalesOrderRecord);
			return true;
		}
		
		try
		{
			FulfilmentRecord = nlapiTransformRecord('salesorder',SalesOrderID ,'itemfulfillment',null);
			FulfilmentRecord.setFieldValue('trandate', TranDate);
			FulfilmentRecord.setFieldValue('postingperiod', GetAccountingPeriod(TranDate));
	    	FulfilmentID = nlapiSubmitRecord(FulfilmentRecord, true); 
			//nlapiSetFieldValue('custbody_mb_fulfilmentid', FulfilmentID,false, false);
		}
		catch(FulfilOrderError)
		{
			SalesOrderRecord = nlapiLoadRecord('salesorder', SalesOrderID);
			AttentionDesc = SalesOrderRecord.getFieldValue('custbody_attention_description') + '\nMegaFulfil: ' + FulfilOrderError.message;
			SalesOrderRecord.setFieldValue('custbody_attention_description', AttentionDesc);
			SalesOrderRecord.setFieldValue('custbody_attention', 'T');
			nlapiSubmitRecord(SalesOrderRecord,false, false);
			return false;
		}
		
		try
		{
			InvoiceRecord = nlapiTransformRecord('salesorder',SalesOrderID ,'invoice',null);
			InvoiceRecord.setFieldValue('trandate', TranDate);
			InvoiceRecord.setFieldValue('postingperiod', GetAccountingPeriod(TranDate));
	    	InvoiceID = nlapiSubmitRecord(InvoiceRecord, true); 
			//nlapiSetFieldValue('custbody_mb_invoiceid', InvoiceID);
		}
		catch(InvoiceError)
		{
			SalesOrderRecord = nlapiLoadRecord('salesorder', SalesOrderID);
			AttentionDesc = SalesOrderRecord.getFieldValue('custbody_attention_description') + '\nMegaFulfil: ' + InvoiceError.message;
			SalesOrderRecord.setFieldValue('custbody_attention_description', AttentionDesc);
			SalesOrderRecord.setFieldValue('custbody_attention', 'T');
			nlapiSubmitRecord(SalesOrderRecord,false, false);
			return false;
		}
		
		try
		{
			PaymentRecord = nlapiTransformRecord('invoice',InvoiceID ,'customerpayment',null);
			PaymentRecord.setFieldValue('trandate', TranDate);
			PaymentRecord.setFieldValue('postingperiod', GetAccountingPeriod(TranDate));
	    	PaymentID = nlapiSubmitRecord(PaymentRecord, true); 
			//nlapiSetFieldValue('custbody_mb_paymentid', PaymentID);
		}
		catch(PaymentError)
		{
			SalesOrderRecord = nlapiLoadRecord('salesorder', SalesOrderID);
			AttentionDesc = SalesOrderRecord.getFieldValue('custbody_attention_description') + '\nMegaFulfil: ' + PaymentError.message;
			SalesOrderRecord.setFieldValue('custbody_attention_description', AttentionDesc);
			SalesOrderRecord.setFieldValue('custbody_attention', 'T');
			nlapiSubmitRecord(SalesOrderRecord,false, false);
			return false;
		}
		
		try
		{
			var SalesOrderRecord = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		
			SalesOrderRecord.setFieldValue('custbody_mb_fulfilmentid', FulfilmentID);
			SalesOrderRecord.setFieldValue('custbody_mb_invoiceid', InvoiceID);
			SalesOrderRecord.setFieldValue('custbody_mb_paymentid', PaymentID);
			SalesOrderRecord.setFieldValue('custbody_megafulfil', 'F');
			SalesOrderRecord.setFieldValue('custbody_mb_postingperiod', GetAccountingPeriod(TranDate));
			SalesOrderRecord.setFieldValue('custbody_megafulfildate', nlapiDateToString(new Date()));		
		
			nlapiSubmitRecord(SalesOrderRecord, false, false);
		}
		catch(SaveError)
		{
			nlapiLogExecution('ERROR', 'MegaFulfil Save Error', SaveError.message);			
		}
	}
    return true;
}

function OnFieldChanged(type, name, linenum)
{
	
	
	try 
	{
		
		var TheValue = nlapiGetFieldValue(name);
		var TheText = nlapiGetFieldText(name);
		
			alert(GetAccountingPeriod(TheValue));
			alert('type: ' + type + '\nName : ' + name + '\nLine num : ' + linenum + '\nText: ' + TheText + '\nValue: ' + TheValue);
	}
	 catch (e) 
	{
		alert('On Field Changed Error.\n' + e);
	}
}

function GetAccountingPeriod(TranDate)
{
	try
	{
		//alert('TranDate: ' + TranDate);
		var AccountingPeriodID = 0;	
		
		//accountingperiod
		var PeriodFilter = new Array();
		PeriodFilter[0] = new nlobjSearchFilter('startdate', null, 'onorafter', GetFirstOfMonth(TranDate));		//Must be this start date
		PeriodFilter[1] = new nlobjSearchFilter('enddate', null, 'onorbefore', GetLastOfMonth(TranDate));	//Must be this end date
		
		var PeriodColumn = new Array();
		PeriodColumn[0] = new nlobjSearchColumn('internalid');	//We need the InternalID
		PeriodColumn[1] = new nlobjSearchColumn('periodname');	//And the Period Name...
		PeriodColumn[2] = new nlobjSearchColumn('startdate');	//And the Start Date...
		PeriodColumn[3] = new nlobjSearchColumn('enddate');	//And the End Date...
		PeriodColumn[4] = PeriodColumn[0].setSort();	//Sort the columns...
		
		var PeriodResult = nlapiSearchRecord('accountingperiod', null, PeriodFilter, PeriodColumn);
		
		if(PeriodResult.length == 1)
		{
			//alert('PeriodResult = ' + PeriodResult.length + '\nPeriod Name: ' + PeriodResult[0].getValue('periodname') + '\nInternal ID of Period: ' + PeriodResult[0].getValue('internalid'));
			AccountingPeriodID = PeriodResult[0].getValue('internalid');
			
			return AccountingPeriodID;
		}
		else
		{
			nlapiLogExecution('ERROR', 'Accounting Period Error', 'Search Results length is : ' + PeriodResult.length);
			return false;
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Accounting Period Error', 'Error is : ' + e.message);
		return false;
	}
}

function GetFirstOfMonth(TranDate)
{
	try
	{
		var StartDate = '';
		var TheDate = TranDate.split('/');
		
		StartDate = '1/' + TheDate[1] + '/' + TheDate[2];		
		return StartDate;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'GetFirstOfMonth Error', e.message);
		return false;
	}

}

function GetLastOfMonth(TranDate)
{
	try
	{
		var EndDate = '';
		var TheDate = TranDate.split('/');
		
		EndDate = DaysInMonth(TheDate[1],TheDate[2]) + '/' + TheDate[1] + '/' + TheDate[2];	
		return EndDate;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'GetLastOfMonth Error', e.message);
		return false;
	}
}


function DaysInMonth(month,year) 
{
	var m = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	if (month != 2) return m[month - 1];
	if (year%4 != 0) return m[1];
	if (year%100 == 0 && year%400 != 0) return m[1];
	return m[1] + 1;
}
