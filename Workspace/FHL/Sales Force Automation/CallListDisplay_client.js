

function windowOpener(windowUri,windowWidth,windowHeight)
{
    var windowName = "PopUp";
    var centerWidth = (window.screen.width - windowWidth) / 2;
    var centerHeight = (window.screen.height - windowHeight) / 2;

    newWindow = window.open(windowUri, windowName, 'resizable=1,width=' + windowWidth +
        ',height=' + windowHeight +
        ',left=' + centerWidth +
        ',top=' + centerHeight +
        ',scrollbars=1');

    newWindow.focus();
    return newWindow.name;

} //function

function reloadCallListDisplay() 
{

    var suiteletURL = nlapiResolveURL('SUITELET','customscript_calllistdisplay','1');
    window.location = suiteletURL;

}