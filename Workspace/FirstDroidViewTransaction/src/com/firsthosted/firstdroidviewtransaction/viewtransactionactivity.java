package com.firsthosted.firstdroidviewtransaction;

import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.os.Bundle;
import android.app.Activity;
import android.app.AlertDialog;
import android.view.Gravity;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup.LayoutParams;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;


public class viewtransactionactivity extends Activity 
{

	public String XMLString = "<transaction><body><transactionid>121</transactionid><customerid>123</customerid><customername>Meg Newson</customername><typename>SalesOrder</typename><typeid>12</typeid>	<date>21/11/2013</date><duedate>21/11/2013</duedate><salesrepid>14</salesrepid><salesrepname>Bumblebee McPharterson</salesrepname><paymentmethodid>233</paymentmethodid><paymentmethodname>Payment on Account</paymentmethodname><paymenttermsid>2</paymenttermsid><paymenttermsname>Due on receipt</paymenttermsname><currencyid></currencyid><currencyname></currencyname><transactiontotal></transactiontotal><billaddress><billline1></billline1><billline2></billline2><billline3></billline3><billline4></billline4><billpostcode></billpostcode></billaddress><shipaddress><shipline1></shipline1><shipline2></shipline2><shipline3></shipline3><shipline4></shipline4><shippostcode></shippostcode></shipaddress></body><items><item><itemid></itemid><itemname></itemname><itemdesc></itemdesc><itemprice></itemprice><itemqty></itemqty></item><item><itemid></itemid><itemname></itemname><itemdesc></itemdesc><itemprice></itemprice><itemqty></itemqty></item></items></transaction>";

	//declaring variables
	public String custName, saleType, salesRep, payMethod, currencyName, billLine1, billLine2, billLine3, billLine4, billPostCode, shipLine1, shipLine2, shipLine3, shipLine4, shipPostCode;
	public String tranId, trantotal, custId, slTypeId, slsRepId, payMethId, currencyId, date;

	//arraylist used to store item(s) id/name/description/price/quantity
	public ArrayList<String> itemDetails = new ArrayList<String>();

	//TextViews to be modified
	TextView transactionType;
	TextView customer;
	TextView slsRepName;
	TextView transactionTotal;
	TextView paymentMethod;


	@Override
	protected void onCreate(Bundle savedInstanceState) 
	{
		try
		{
			super.onCreate(savedInstanceState);
			setContentView(R.layout.activity_view_transaction);
			initialiseVariables();

		}
		catch(Exception e)
		{
			errorHandler("onCreate", e.getMessage().toString());
		}
	}
	
	public void initialiseVariables()
	{
		
		try
		{
			//TextViews to be modified
			transactionType = (TextView)findViewById(R.id.tvTranType);
			customer = (TextView)findViewById(R.id.tvCustomer);
			slsRepName = (TextView)findViewById(R.id.tvSalesRep);
			transactionTotal = (TextView)findViewById(R.id.tvTotal);
			paymentMethod = (TextView)findViewById(R.id.tvPayMethLbl);
		}
		catch(Exception e)
		{
			errorHandler("initialiseVariables", e.getMessage().toString());
			
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) 
	{
		try
		{
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.view_transaction, menu);
		
		}
		catch(Exception e)
		{
			errorHandler("onCreateOptionsMenu", e.getMessage().toString());
		}
		return true;
	}

	//used to convert test string to XML doc
	public static Document stringToDom(String xmlSource) throws SAXException, ParserConfigurationException, IOException 
	{
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		return builder.parse(new InputSource(new StringReader(xmlSource)));
	}

	public void ReadFile() throws ParserConfigurationException, SAXException, IOException
	{
		//importing test XML document
		//File xmlDoc = new File("/Users/First Hosted Ltd/Android Workspace/FirstDroidViewTransaction/assets/sampletransaction.xml");

		//instantiate document builder...
		//DocumentBuilderFactory dbFac = DocumentBuilderFactory.newInstance();
		//DocumentBuilder dbBuild = dbFac.newDocumentBuilder();

		//...parse the document
		Document doc;
		NodeList nList;

		try
		{


			doc =  stringToDom(XMLString);//dbBuild.parse(xmlDoc);
			doc.getDocumentElement().normalize();
			nList = doc.getElementsByTagName("transaction");


			for(int i = 0; i < nList.getLength(); i++)
			{
				Node node = nList.item(i);

				//get node values and set them into variables
				if(node.getNodeType() == Node.ELEMENT_NODE)
				{
					Element nElement = (Element) node;

					tranId = nElement.getElementsByTagName("transactionid").item(0).getTextContent();
					custId = nElement.getElementsByTagName("customerid").item(0).getTextContent();
					custName = nElement.getElementsByTagName("customerName").item(0).getTextContent();
					saleType = nElement.getElementsByTagName("typename").item(0).getTextContent();
					slTypeId = nElement.getElementsByTagName("typeid").item(0).getTextContent();
					date = nElement.getElementsByTagName("date").item(0).getTextContent();
					slsRepId = nElement.getElementsByTagName("salesrepid").item(0).getTextContent();
					salesRep = nElement.getElementsByTagName("salesrepname").item(0).getTextContent();
					payMethId = nElement.getElementsByTagName("paymethodid").item(0).getTextContent();
					payMethod = nElement.getElementsByTagName("paymethodname").item(0).getTextContent();
					currencyId = nElement.getElementsByTagName("currencyid").item(0).getTextContent();
					currencyName = nElement.getElementsByTagName("currencyname").item(0).getTextContent();
					trantotal = nElement.getElementsByTagName("transactiontotal").item(0).getTextContent();

					billLine1 = nElement.getElementsByTagName("billline1").item(0).getTextContent();
					billLine2 = nElement.getElementsByTagName("billline2").item(0).getTextContent();
					billLine3 = nElement.getElementsByTagName("billline3").item(0).getTextContent();
					billLine4 = nElement.getElementsByTagName("billline4").item(0).getTextContent();
					billPostCode = nElement.getElementsByTagName("billpostcode").item(0).getTextContent();

					shipLine1 = nElement.getElementsByTagName("shipline1").item(0).getTextContent();
					shipLine2 = nElement.getElementsByTagName("shipline2").item(0).getTextContent();
					shipLine3 = nElement.getElementsByTagName("shipline3").item(0).getTextContent();
					shipLine4 = nElement.getElementsByTagName("shipline4").item(0).getTextContent();
					shipPostCode = nElement.getElementsByTagName("shippostcode").item(0).getTextContent();

					//add the multiple item details into an arraylist
					//itemDetails.add(nElement.getElementsByTagName("itemid").item(0).getTextContent());
					itemDetails.add(nElement.getElementsByTagName("itemname").item(0).getTextContent());
					//itemDetails.add(nElement.getElementsByTagName("itemdesc").item(0).getTextContent());
					itemDetails.add(nElement.getElementsByTagName("itemprice").item(0).getTextContent());
					itemDetails.add(nElement.getElementsByTagName("itemqty").item(0).getTextContent());	
				}
			}

		}
		catch(Exception e)
		{
			errorHandler("setValues", e.getMessage().toString());
		}


	}

	public void setValues()
	{
		int count = 0;


		try
		{

			//set the visible values
			transactionType.setText(saleType);
			transactionTotal.setText("Total: " + trantotal);
			slsRepName.setText("Sales Rep: " + salesRep);
			customer.setText("Customer: " + custName);
			paymentMethod.setText(payMethod);


			//iterate through the item(s)
			for(String s : itemDetails)
			{

				//set parameters for table
				TableLayout tblItems = (TableLayout)findViewById(R.id.tlItems);
				TableRow plusRow = new TableRow(this);
				plusRow.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT));
				TextView plusTextView = new TextView(this);
				plusTextView.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, 0));

				//when count reaches a number divisible by 3, this means that all details for one item are finished, so add a new row for next item.
				if(count%3 == 0)
				{
					tblItems.addView(plusRow);
				}

				plusTextView.setText(s);
				plusRow.addView(plusTextView);

				count++;
			}

		}
		catch(Exception e)
		{
			errorHandler("setValues", e.getMessage().toString());
		}

	}


	//******************************************************
	// generic error handler
	//******************************************************

	private void errorHandler(String r, String m)
	{

		messageBox("Error", m);
	}

	//******************************************************
	// message box
	//******************************************************

	public void messageBox(String title, String message)
	{


		try
		{

			AlertDialog.Builder popupBuilder = new AlertDialog.Builder(this);
			TextView myMsg = new TextView(this);
			myMsg.setText(message);
			myMsg.setGravity(Gravity.CENTER_HORIZONTAL);
			popupBuilder.setView(myMsg);

		}
		catch(Exception e)
		{
			errorHandler("messageBox", e.getMessage().toString());
		}



	}

	public void ok(View view)
	{
		//OK button. Close the application when clicked
		this.finish();
	}

}
