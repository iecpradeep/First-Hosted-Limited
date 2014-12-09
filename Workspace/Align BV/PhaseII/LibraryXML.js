/*******************************************************
 * Name:		LibraryXML
 * Script Type:	LibraryXML
 *
 * Version:	1.0.0 - 10/02/2012 - Initial code functions - LD
 * 	
 * Parse into XML tree array, each tree element is an array element of the form :-
 * Node # : Element Name : Parent Element Node # : Number of Children : Inner XML or Data (if children == 0) 
 *
 * Author:	FHL
 * Purpose:	To share useful XML functionality
 *******************************************************/

/**
 * XML tree standard definitions for string parsing of elements and data at initialise
 */
var tagXMLstart = "&lt;";
var tagXMLend = "&gt;";
//var tagXMLstartChar = "<";
//var tagXMLendChar = ">";
var tagXMLstartChar = "&lt;";
var tagXMLendChar = "&gt;";
var tagXMLterminator = "/";
var elementXMLroot = "ROOT";
var XMLtree = new Array();
var XMLtreeSize = 0;
var XMLDocument = null;

// The indices for each array element in the tree
var XMLtreeParent = 0;
var XMLtreeElement = 1;
var XMLtreeNumberofChildren = 2;
var XMLtreeDataOrXML = 3; // Will be data if XMLtreeNumberofChildren == 0

/* XML Processing routines for an XML document converted to an array of elements
 * 
 * This primary recursive function returns an array of elements 
 * as a tree of nested arrays (branches with children nodes)
 * and data strings (leaves i.e. elements with no children).
 */
function getXMLDocument(theXML, VATAnswer)
{
	var xmlPayload = '';
	var endOrderTag = '</ORDER>';
	
	try
	{	
		//theXML = createTaggedXML(elementXMLroot, theXML);
		
		//Remove ending ORDER tag from main payload
		theXML = theXML.substring(0, theXML.indexOf(endOrderTag));
		
		//Remove line breaks from VAT answer
		VATAnswer = removeLineBreaks(VATAnswer);
		
		//Merge main payload with VAT answer and append with end ORDER tag
		xmlPayload = theXML + VATAnswer + endOrderTag;
	
		nlapiLogExecution('DEBUG', "getXMLDocument ==> ", xmlPayload);
	
		//XMLDocument = nlapiStringToXML(UNencodeXML(theXML));
		//XMLDocument = nlapiStringToXML(xmlPaytheXMLload);
		XMLDocument = nlapiStringToXML(xmlPayload);
		
		if (XMLDocument)
		{
			nlapiLogExecution('DEBUG', "XMLDocument.firstChild.nodeName ==> ", XMLDocument.firstChild.nodeName);		
		}
	}
	catch (e)
	{
		errorHandler("libraryXML: getXMLDocument", e);
	}

		// XMLDocument.nodeName + " : " + XMLDocument.getElementsByTagName('title').length);
	//return XMLDocument.childNodes;
}

function getXMLTree(theParent, theXML)
{
	var numberofChildren = 0;

	var XMLremaining = theXML;

	while (XMLremaining != '')
	{
		// Look for <element>....</element> i.e. the next start / end tag branch
		var currentElementExp = new RegExp("^" + tagXMLstart + "[A-Z]*[0-9]*" + tagXMLend, "im"); // equates to <([A-Z][A-Z0-9]*)\b[^>]*>(.*?)</\1>
		var currentElement = new String(currentElementExp.exec(XMLremaining));

		//if (debugOn)
		//	nlapiLogExecution('DEBUG', "currentElement ==> " + currentElement
		//			+ " : " + nlapiEscapeXML(currentElementExp),
		//			"XML remaining : " + XMLremaining);

		var currentElementEndExp = new RegExp(currentElement.replace(tagXMLstart, tagXMLstart + tagXMLterminator), "im");
		var currentElementEnd = new String(currentElementEndExp.exec(XMLremaining));

		// Test for <element>....</element> existence
		if (currentElementExp.test(XMLremaining)&& currentElementEndExp.test(XMLremaining))
		{
			numberofChildren++; // Increment for each child node found

			var currentElementInnerXML = XMLremaining.substring(XMLremaining.indexOf(currentElement) + currentElement.length, XMLremaining.indexOf(currentElementEnd));

			var thisElementBranch = new Array(removeTagCharacters(theParent), removeTagCharacters(currentElement), getXMLTree(currentElement, currentElementInnerXML), currentElementInnerXML);
			XMLtreeSize = XMLtree.push(thisElementBranch);
			
			// Remove the XML just parsed ...
			XMLremaining = XMLremaining.replace(currentElement, '').replace(currentElementInnerXML, '').replace(currentElementEnd, '');
		}
		else
		{
			XMLremaining = ''; // No more elements to process
		}
	}

	return numberofChildren; // If this is 0 then the calling parent will
							 // terminate i.e. at a leaf / data element
}

/*
 * Display the XML tree in execution log
 */
function logXMLTree()
{
	
	var XMLTreeHTML = "<table style='font-size: 3mm;'>";
	for ( var t = 0; t < XMLtree.length; t++)
	{
		var TreeXMLorData = XMLtree[t][3];
		if (TreeXMLorData)
		{
			if (TreeXMLorData.length > 25)
				TreeXMLorData = TreeXMLorData.slice(0, 25)
						+ " ...";
		}
		XMLTreeHTML += "<tr><td>Node: " + t + "</td><td>"
				+ XMLtree[t][0] + "</td><td>" + XMLtree[t][1]
				+ "</td><td>" + XMLtree[t][2] + "</td><td>"
				+ "</td><td>" + TreeXMLorData + "</td></tr>";
	}

	XMLTreeHTML += "</table>";
	nlapiLogExecution('DEBUG', "XMLTree Order : "
			+ orderNumber, XMLTreeHTML);
}

/*
 * Returns the tag stripped of < > /
 */
function removeTagCharacters(theXMLtag) {
	return theXMLtag.replace(tagXMLstart,'').replace(tagXMLend,'').replace(tagXMLterminator,'');
}

function createTaggedXML(theXMLtag, theInnerXML) {
	return tagXMLstartChar + theXMLtag + tagXMLendChar + theInnerXML + tagXMLstartChar + tagXMLterminator + theXMLtag + tagXMLendChar;
}

/**
 * Removes line breaks from inputted string
 * 
 * @param str
 * @returns {String}
 */
function removeLineBreaks(str)
{
	var strArr = null;
	var retVal = '';

	try
	{
		strArr = str.split('<BR>');

		if (strArr.length > 0)
		{
			for (var i = 0; i < strArr.length; i++)
			{
				retVal += strArr[i];
			}
		}
	}
	catch(e)
	{
		errorHandler("removeLineBreaks", e);
	}
	return retVal;
}

/*
 * Returns the data or XML content of first by default or nth occurence of tree record that matches element name
 */
function getXMLTreeElementDatabyName(theElementName, theIndex) {
	var theData = null;
	if (isNaN(theIndex))
		theIndex = 1;
	var currentIndex = 0;
	for ( var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeElement] == theElementName) {
			currentIndex++;
			if (currentIndex == theIndex) {
				theData = XMLtree[t][XMLtreeDataOrXML];
				break;
			}
		}
	return theData;
}

/*
 * Returns the first by default or nth occurence of tree record that matches element name
 */
function getXMLTreeElementbyName(theElementName, theIndex) {
	var theElement = new Array();
	if (isNaN(theIndex))
		theIndex = 1;
	var currentIndex = 0;
	for ( var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeElement] == theElementName) {
			currentIndex++;
			if (currentIndex == theIndex) {
				theElement = XMLtree[t];
				break;
			}
		}
	return theElement;
}

/**
 * Returns the data or XML content of first by default or nth occurence of tree record that matches element name
 * 
 * @param 	{Document}	Main XML document
 * @param	{String}	Requested element name
 * @param	{Number}	Index of requested element
 * @returns	{String} 	Requested element value
 */
function getXMLTreeElementDatabyNameNSAPIs(xmldoc, theElementName, theIndex)
{	
	var xpath = '';
	var xpathStartTag = '//*[name()="';
	var xpathEndTag = '"]';
	
	var theData = '';
	var valueArray = null;

	try
	{
		//Construct xPath expression
		xpath = xpathStartTag + theElementName + xpathEndTag;

		//If no index, return single value
		if (isNaN(theIndex))
		{
			theData = nlapiSelectValue(xmldoc, xpath);
		}
		else //If index present, return array
		{
			valueArray = nlapiSelectValues(xmldoc, xpath);
			theData = valueArray[theIndex];
		}
	}
	catch (e)
	{
		errorHandler('libraryXML: getXMLTreeElementDatabyNameNSAPIs', e);
	}
	return theData;
}

/*
 * Returns the first by default or nth occurence of tree record that matches element name
 * 
 * NOT NEEDED
 */
function getXMLTreeElementbyNameNSAPIs(xmldoc, theElementName, theIndex)
{
	var theElement = null;
	var currentIndex = 0;
	
	var xPathStartTag = '//*[name()="';
	var xPathEndTag = '"]';
	var xPathExpression = xPathStartTag + theElementName + xPathEndTag;
	
	try
	{
		if (isNaN(theIndex))
		{
			theIndex = 1;
		}

		for (var t = 0; t < XMLtree.length; t++)
		{
			if (XMLtree[t][XMLtreeElement] == theElementName)
			{
				currentIndex++;

				if (currentIndex == theIndex)
				{
					theElement = nlapiSelectNodes(orderNode, xPathExpression);
					break;
				}
			}
		}
	}
	catch (e)
	{
		errorHandler('libraryXML: getXMLTreeElementbyNameNSAPIs', e);
	}
	return theElement;
}


/*
 * Returns the array of child record(s) that matches element (parent) name
 * 
 * NOT NEEDED
 */
function getXMLTreeChildElementsbyName(theElementName) {
	var theElements = new Array();
	for (var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeParent] == theElementName) {
			theElements.push(XMLtree[t]);
		}
	return theElements;
}

/*
 * Returns the number of child record(s) that matches element (parent) name
 * 
 * NOT NEEDED
 */
function getXMLTreeChildNumberbyName(theElementName) {
	var theElementNumber = 0;
	var theElements = new Array();
	for (var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeParent] == theElementName) {
			theElements.push(XMLtree[t]);
		}
	if (theElements != null)
		theElementNumber = theElements.length;
	return theElementNumber;
}

/**
 * Returns the number of child record(s) that matches element (parent) name
 * 
 * @param	{Document}	Main XML document
 * @param	{String}	Parent element
 * @returns {Number}	Returns -1 if no child nodes found or if error occurs
 */
function getXMLTreeChildNumberbyNameNSAPIs(xmldoc, theElementName)
{
	var xpathStartTag = '//*[name()="';
	var xpathEndTag = '"]';
	var xpath = '';
	
	var childElements = new Array();
	var childElementNo = 0;
	
	try
	{
		//Construct xPath expression
		xpath = xpathStartTag + theElementName + xpathEndTag;

		//Select child elements from main XML document
		childElements = nlapiSelectNodes(xmldoc, xpath);

		//Return length of child elements array
		if (childElements != null)
		{
			childElementNo = theElements.length;
		}
		else
		{
			childElementNo = -1;
		}
	}
	catch (e)
	{
		errorHandler('libraryXML: getXMLTreeChildNumberbyNameNSAPIs', e);
		childElementNo = -1;
	}
	return childElementNo;
}