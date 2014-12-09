/**
 * 
 * @returns
 * 
 *  1.1.2 - This function adds a button to any part of a form
 *  Client Script
 * 
 */
function addButton()
{
    this.SearchButton = document.createElement("input");
    this.SearchButton.type = "button";
    this.SearchButton.style.cssText = "font-size:11px;padding:0 6px;height:19px;margin:0 6px;font-weight:bold;cursor:pointer;";
    this.SearchButton.value = "Call";
    
    getFormElement(document.forms['main_form'], "comments").parentNode.appendChild(this.SearchButton);
}