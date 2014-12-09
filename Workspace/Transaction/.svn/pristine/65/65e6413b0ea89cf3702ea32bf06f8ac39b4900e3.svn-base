/*****************************************************************************************
 * Name:		Transaction
 * 
 * Author:		FHL LE
 * 
 * Version:		1.0.0 - XML "header" information parsed and displayed 18/04/2013 LE
 * 				1.1.0 - Item information parsed and displayed into listview 30/04/2013 LE
 * 				1.1.1 - Cleaned up Transaction.java i.e. broken up into multiple methods 30/04/2013 JM
 * 				1.2.0 - GUI layout enhancements. Scales depending on screen size 01/05/2013 LE
 * 				
 * 
 * Purpose:		"View Transaction" page for FirstDroid
 * 
 * [TODO] - 
 *******************************************************************************************/
package com.example.transaction;


import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
//import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
//import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
//import org.xml.sax.SAXException;

import com.example.transaction.R;
import com.example.transaction.listviewAdapter;

import android.app.Activity;
import android.app.AlertDialog;
//import android.app.ListActivity;
import android.os.Bundle;
//import android.util.Log;
//import android.view.View;
//import android.widget.ArrayAdapter;
//import android.widget.ListAdapter;
import android.widget.ListView;
//import android.widget.SimpleAdapter;
//import android.widget.Spinner;
import android.widget.TextView;


public class Transaction extends Activity 
{
	//XML Document to be passed in as a string
	String XMLDoc = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><transaction><body><transactionid>121</transactionid><customerid>123</customerid><customername>Doug Walker</customername><typename>SalesOrder</typename><typeid>12</typeid><date>21/11/2013</date><duedate>21/11/2013</duedate><salesrepid>14</salesrepid><salesrepname>Louis Evans</salesrepname><paymentmethodid>233</paymentmethodid><paymentmethodname>Payment on Account</paymentmethodname><paymenttermsid>2</paymenttermsid><paymenttermsname>Due on receipt</paymenttermsname><currencyid>3</currencyid><currencyname>GBP</currencyname><transactiontotal>£24456.24</transactiontotal><billaddress><billline1>23 Fake Street</billline1><billline2>Fake Town</billline2><billline3>Fake City</billline3><billline4></billline4><billpostcode>FK4 4SF</billpostcode></billaddress><shipaddress><shipline1>23 Fake Street</shipline1><shipline2>Fake Town</shipline2><shipline3>Fake City</shipline3><shipline4></shipline4><shippostcode>FK4 4SF</shippostcode></shipaddress></body><items><item><itemid>764</itemid><itemname>Desk Lamp</itemname><itemdesc>Lamp for desks</itemdesc><itemprice>£55.65</itemprice><itemqty>1</itemqty></item><item><itemid>7654</itemid><itemname>Oak Office Desk</itemname><itemdesc>Desk made from oak wood</itemdesc><itemprice>£100.56</itemprice><itemqty>3</itemqty></item><item><itemid>3784</itemid><itemname>Apple iPhone</itemname><itemdesc>iPhone 5 64GB</itemdesc><itemprice>£649.99</itemprice><itemqty>4</itemqty></item><item><itemid>9236</itemid><itemname>Apple iPad</itemname><itemdesc>64GB WiFi and Cellular</itemdesc><itemprice>£567.99</itemprice><itemqty>10</itemqty></item><item><itemid>8473</itemid><itemname>Sony Tablet S</itemname><itemdesc>16GB WiFi only</itemdesc><itemprice>£449.99</itemprice><itemqty>1</itemqty></item><item><itemid>4237</itemid><itemname>MacBook Air</itemname><itemdesc>256GB Mid 2012</itemdesc><itemprice>£1299.99</itemprice><itemqty>15</itemqty></item><item><itemid>9233</itemid><itemname>Cisco IP Phone</itemname><itemdesc>7940 Series</itemdesc><itemprice>£99.99</itemprice><itemqty>15</itemqty></item></items></transaction>"; 

	//the names of nodes in the xml document
	static final String KEY_BODY  = "body";
	static final String KEY_CUSTNAME  = "customername";
	static final String KEY_SALETYPE  = "typename";
	static final String KEY_DATE  = "date";
	static final String KEY_SALESREP  = "salesrepname";
	static final String KEY_PAYMETHOD  = "paymentmethodname";
	static final String KEY_PAYTERMS  = "paymenttermsname";
	static final String KEY_CURRENCY  = "currencyname";
	static final String KEY_TOTAL  = "transactiontotal";
	static final String KEY_BILLLINE1  = "billline1";
	static final String KEY_BILLLINE2  = "billline2";
	static final String KEY_BILLLINE3  = "billline3";
	static final String KEY_BILLLINE4  = "billline4";
	static final String KEY_BILLPOSTCODE  = "billpostcode";
	static final String KEY_SHIPLINE1  = "shipline1";
	static final String KEY_SHIPLINE2  = "shipline2";
	static final String KEY_SHIPLINE3  = "shipline3";
	static final String KEY_SHIPLINE4  = "shipline4";
	static final String KEY_SHIPPOSTCODE  = "shippostcode";
	static final String FIRST_COLUMN  = "first";
	static final String SECOND_COLUMN  = "second";
	static final String THIRD_COLUMN  = "third";
	static final String KEY_ITEM = "item";
	static final String KEY_ITEMID = "itemid";
	static final String KEY_ITEMNAME = "itemname";
	static final String KEY_ITEMDESC = "itemdesc";
	static final String KEY_ITEMPRICE = "itemprice";
	static final String KEY_ITEMQTY = "itemqty";

	private Document xmlDocument;
	private NodeList nl;
	private Element e;
	private NodeList nList;
	private Element elmnt;


	@Override
	public void onCreate(Bundle savedInstanceState)
	{		

		super.onCreate(savedInstanceState);

		try
		{
			setFormValues();
		}
		catch(Exception err)
		{
			errorHandler("onCreate: " + err.getMessage());
		}

	}

	/************************************
	 * set the form values
	 ***********************************/

	private void setFormValues()
	{
		
		try
		{
			setContentView(R.layout.sale);
			
			setHeaderFormValues();
			setDetailFormValues();

		}
		catch(Exception err)
		{
			errorHandler(err.getMessage());
		}

	}
	
	/************************************
	 * set the form header values
	 * 
	 * 
	 * 
	 ***********************************/

	public void setHeaderFormValues()
	{
		
		TextView tvCustName, tvTranType, tvSalesRep, tvTranTotal, tvDate;
		String custName = null;
		String salesRep = null;
		String tranType = null;
		String tranTotal = null;
		String date = null;

		try
		{
			
			/**************************************************
			 * Parse and display HEADER information
			 *************************************************/
			tvCustName = (TextView)findViewById(R.id.customer);
			tvTranType = (TextView)findViewById(R.id.saletype);
			tvSalesRep = (TextView)findViewById(R.id.salesrep);
			tvTranTotal = (TextView)findViewById(R.id.trantotal);
			tvDate = (TextView)findViewById(R.id.date);

			//build the xml doc
			xmlDocument = getDomElement(XMLDoc);

			//choose tag to start looping at
			nl = xmlDocument.getElementsByTagName(KEY_BODY);

			//loop through the body section
			for(int i = 0; i < nl.getLength(); i++)
			{
				e = (Element) nl.item(i);

				//assign the node values to relevant variables
				custName = getValue(e, KEY_CUSTNAME);
				tranType = getValue(e, KEY_SALETYPE);
				salesRep = getValue(e, KEY_SALESREP);
				tranTotal = getValue(e, KEY_TOTAL);
				date = getValue(e, KEY_DATE);
			}

			//display values to screen
			tvTranType.setText(tranType);
			tvCustName.setText("Name: " + custName);
			tvSalesRep.setText("Sales Rep: " + salesRep);
			tvTranTotal.setText("Total: " + tranTotal);
			//tvPayMethod.setText(payMethod);
			tvDate.setText("Date: " + date);
			
		}
		catch(Exception err)
		{
			errorHandler("setHeaderFormValues: " + err.getMessage());
		}

	}
	
	/************************************
	 * set the form detail values 
	 * 
	 * 
	 ***********************************/

	public void setDetailFormValues()
	{
		
		ListView lview;
		String itemName = "";
		String itemPrice = "";
		String itemQuantity = "";

		try
		{
			
			/****************************************************
			 * Parse and place ITEM information into the listview
			 ******************************************************/
			nList = xmlDocument.getElementsByTagName(KEY_ITEM);

			lview = (ListView) findViewById(R.id.itemslist);    
			ArrayList<HashMap<String,String>> list = new ArrayList<HashMap<String,String>>();

			//loop item nodes
			for(int i = 0; i < nList.getLength(); i++)
			{

				HashMap<String,String> temp = new HashMap<String,String>();
				elmnt = (Element) nList.item(i);
				
				itemName = getValue(elmnt, KEY_ITEMNAME);
				itemPrice = getValue(elmnt, KEY_ITEMPRICE);
				itemQuantity = getValue(elmnt, KEY_ITEMQTY);

				temp.put(FIRST_COLUMN, itemName);
				temp.put(SECOND_COLUMN, itemPrice);
				temp.put(THIRD_COLUMN, itemQuantity);

				list.add(temp);
			}

			listviewAdapter adapter = new listviewAdapter(this, list);
			
			lview.setAdapter(adapter);
			
		}
		catch(Exception err)
		{
			errorHandler("setDetailFormValues: " + err.getMessage());
		}

	}


	/************************************
	 * BUILD THE XML DOC AND PARSE IT
	 ***********************************/
	public Document getDomElement(String xml)
	{
		Document doc = null;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

		try
		{
			//new document builder
			DocumentBuilder db = dbf.newDocumentBuilder();
			InputSource is = new InputSource();

			//new string reader for xml
			is.setCharacterStream(new StringReader(xml));

			//parse the document
			doc = db.parse(is);
		}
		catch(Exception err)
		{
			errorHandler(err.getMessage());
		}

		return doc;
	}

	/*************************
	 * GET VALUES OF THE NODES
	 ***********************/
	public String getValue(Element item, String str)
	{
		String retVal = "";
		
		try
		{
			NodeList n = item.getElementsByTagName(str);
			retVal = this.getElementValue(n.item(0));
		}
		catch(Exception err)
		{
			errorHandler("getValue: " + err.getMessage());
		}
		
		return retVal;
	}

	/*************************
	 * EXTRACT THE INFORMATION
	 **************************/
	public final String getElementValue(Node elem)
	{
		Node child;
		String retVal = "";

		try
		{
			if(elem != null)
			{
				if(elem.hasChildNodes())
				{
					for(child = elem.getFirstChild(); child != null; child = child.getNextSibling())
					{
						if(child.getNodeType() == Node.TEXT_NODE)
						{
							retVal = child.getNodeValue();
						}
					}
				}
			}

		}	
		catch(Exception err)
		{
			errorHandler("getElementValue: " + err.getMessage());
		}
		
		return retVal;
	}


	/**********************************************
	 * GENERIC ERROR HANDLER w/ ALERT DIALOG
	 **********************************************/
	public void errorHandler(String e)
	{
		AlertDialog alertDialog;
		alertDialog = new AlertDialog.Builder(this).create();
		alertDialog.setTitle("ERROR");
		alertDialog.setMessage(e);
		alertDialog.show();
	}
}

