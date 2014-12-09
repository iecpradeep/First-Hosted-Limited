/*******************************************************
* Name:				VAT Number Validation Library Script
* Script Type:		Client
* Version:				1.0.0
* Date:					2 July 2012
* Author:				Pete Lewis, First Hosted Limited.
* Checked by:		
*******************************************************/



function checkVATnumber(VATNumber)
{

    //var VATnumber = "339 0727 47"; // a string containing 9 digits and possible spaces valid under the traditional algorithm
    //var VATnumber = "479 9841 65"; // another example
    //var VATnumber = "100 9094 51";  // valid number under new "9755" algorithm
    //var VATnumber = "339 0727 89"; // another example
    
    var s = VATnumber.replace(/[^0-9]/g, ""); // strip non-digits
    var VATsplit = [];
    VATsplit = s.split("");
    var checkDigits = Number(VATsplit[7] + VATsplit[8]); // two final digits as a number
    var firstDigit = VATsplit[0];
    var secondDigit = VATsplit[1];
    if ((firstDigit == 0) && (secondDigit > 0)) 
    {
        alert("That is a Reserved Number starting with 01-09 and hence invalid");
        return false;
    }
    
    var total = 0;
    for (var i = 0; i < 7; i++) 
    { // first 7 digits
        total += VATsplit[i] * (8 - i); // sum weighted cumulative total
    }
    
    // Traditional Algorithm for VAT numbers issued before 2010
    
    while (total > 0) 
    {
        total -= 97
    } // deduct 97 repeatedly until total is negative
    total = Math.abs(total); // make positive
    var valid = false;
    var nw = "";
    if (checkDigits == total) 
    {
        valid = true;
        nw = " according to the pre-2010 method";
    }
    
    // If not valid try the new method (introduced November 2009) by subtracting 55 from the mod 97 check digit if we can - else add 42
    
    if (!valid) 
    {
        total = total % 97 // modulus 97  
        if (total >= 55) 
        {
            total = total - 55
        }
        else 
        {
            total = total + 42
        }
        if (total == checkDigits) 
        {
            valid = true;
            nw = " according to the '9755' method";
        }
    }
    
    if (valid) 
    {
        alert("The VAT number " + VATnumber + " is valid " + nw);
    }
    else 
    {
        alert("The VAT number " + VATnumber + " is NOT valid");
    }
    
}




function myFieldChanged(type, name, linenum)
{
    alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
    
    checkVATnumber("339 0727 47");
}
