/*******************************************************
 * Name:		EPW Suitelet for passing document library structure to Wine Library page
 * Script Type:	Script
 * Version:		1.3
 * Date:		21 July 2011 - 28th July 2011
 * Author:		Stephen Boot, FHL
 *******************************************************/

var debug = request.getParameter('debug'); // Set this to any value during development. In production, do not use
var rootId = 625; // Root ID of top-level folder

// Node class
function Node(id, title, isFolder, href, childArray)
{
	this.id = id;
	this.title = title;
	this.isFolder = isFolder;
	this.href = href;
	this.childArray = childArray; // Array of child nodes
  
	this.getHtml = function()
	{
		var classNames = 'doc-node';
		
		if (this.isFolder)
		{
			classNames += ' doc-folder';
			this.href = 'javascript:docOpenFolder(' + this.id + ');';
		}
		else 
		{
			classNames += ' doc-file';
		}
		
		return '<div id="f' + this.id + '" class="' + classNames + '"><a href="' + this.href + '">' + parseName(this.title) + '</a></div>\n';
	};

	return true;
}

// Suitelet Default Function
function getLibHomeDocs()
{
	if (debug != null)
	{
		// DOCTYPE, html, head, body
		response.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n');
		response.write('<html>\n<head>\n<style type="text/css">.doc-node{width:170px;clear:left;float:left;}.doc-children{clear:right;float:left;}</style>\n</head>\n<body>\n');
	}
	
	
	var rootNode = new Node(rootId, '/', true, '', getChildrenOfFolder(rootId));
	writeNode(rootNode, 0);
	
	if (debug != null) 
	{
	 	// End body, html
		response.write('</body>\n</html>');
	}
}

// Outputs node children
function writeNode(node, level)
{
	for (var i = 0; i < node.childArray.length; i++)
	{
		response.write(node.childArray[i].getHtml());
		
		if (node.childArray[i].isFolder) 
		{
			response.write('<div id="c' + node.childArray[i].id + '" class="doc-children doc-level-' + level + '">\n');
			
			node.childArray[i].childArray = getChildrenOfFolder(node.childArray[i].id);
			writeNode(node.childArray[i], level+1);
			
			response.write('</div>\n');
		}
	}
}

// Returns array of folder children as Node objects
function getChildrenOfFolder(folderId)
{
	var results = [];
	
	// Get folders
	var folderFilters = [];
	var folderColumns = [];
	
	folderFilters[0] = new nlobjSearchFilter('parent', null, 'anyOf', folderId);
	folderFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', false);
	
	folderColumns[0] = new nlobjSearchColumn('internalid');
	folderColumns[1] = new nlobjSearchColumn('name');
	
	var folderSearch = nlapiSearchRecord('folder', null, folderFilters, folderColumns);
	
	for (var i = 0; folderSearch != null && i < folderSearch.length; i++) 
	{
		var folder = folderSearch[i];
		var folderNode = new Node(folder.getId(), folder.getValue('name'), true, '', []);
		results.push(folderNode);
	}
	
	// Get files
	var fileFilters = [];
	var fileColumns = [];
	
	/* *** A "bug" in NetSuite (at version 2011.1) means that this brings back all child files 
	 * of folder RECURSIVELY, rather than the files directly inside it. Therefore, we need to 
	 * bring back the folder in an nlobjSearchColumn so that we can double-check we have a file 
	 * in the CURRENT folder only. 
	 */
	fileFilters[0] = new nlobjSearchFilter('folder', null, 'anyOf', folderId); // ***
	fileFilters[1] = new nlobjSearchFilter('availableWithoutLogin', null, 'is', true);
	fileFilters[2] = new nlobjSearchFilter('isAvailable', null, 'is', true);
	
	fileColumns[0] = new nlobjSearchColumn('internalid');
	fileColumns[1] = new nlobjSearchColumn('name');
	fileColumns[2] = new nlobjSearchColumn('url');
	fileColumns[3] = new nlobjSearchColumn('folder'); // ***
	
	var fileSearch = nlapiSearchRecord('file', null, fileFilters, fileColumns);
	
	for (var i = 0; fileSearch != null && i < fileSearch.length; i++) 
	{
		var file = fileSearch[i];
		if (file.getValue('folder') == folderId) // ***
		{
			var fileNode = new Node(file.getId(), file.getValue('name'), false, file.getValue('url'), []);
			results.push(fileNode);
		}
	}
	
	// Sort the array alphabetically by Node title
	var tempArray = [];
	for (var i = 0; i < results.length; i++)
	{
		tempArray.push(results[i].title + '/' + i);
	}
	
	tempArray.sort();
	
	var resultArray = [];
	for (var i = 0; i < tempArray.length; i++)
	{
		var pos = tempArray[i].indexOf('/');
		var seqNo = parseInt(tempArray[i].substr(pos+1, tempArray[i].length-pos));
		resultArray.push(results[seqNo]);
	}
	
	return resultArray;
}

// Parse name
function parseName(title)
{
	// Remove sort-by prefixes
	var strPos = title.indexOf('_');
	if (strPos >= 0)
	{
		title = title.substr(strPos+1, title.length-strPos);
	}
	
	// Remove file extensions
	strPos = title.lastIndexOf('.pdf');
	if (strPos >= 0)
	{
		title = title.substr(0, strPos);
	}
	
	return title;
}
