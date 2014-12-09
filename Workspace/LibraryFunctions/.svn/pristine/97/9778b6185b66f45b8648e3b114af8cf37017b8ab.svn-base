/*********************************
 * 	
 * 	QuickSort3-based JavaScript Function
 * 
 * 	Originally from http://www.vbforums.com/showthread.php?t=473677
 * 	Converted to JavaScript by Pete Lewis, First Hosted on 3rd May 2012.
 * 
 * 	Recursive Sorting function which calls itself every iteration.
 * 	EXTREMELY fast in sorting as it is based on the QuickSort3 Algorithm
 * 
 * 	The median-of-3 pivot selection algorithm takes the median of the first, middle,
 * 	and last elements of the list; however, even though this performs well on many 
 * 	real-world inputs, it is still possible to contrive a median-of-3 killer list that will 
 * 	cause dramatic slowdown of a quicksort based on this pivot selection technique.
 * 
 * 	Such inputs could potentially be exploited by an aggressor, for example by 
 * 	sending such a list to an Internet server for sorting as a denial of service attack.
 * 
 * 	The quicksort3 implementation here uses a median-of-3 technique, but instead 
 * 	of using the first, last and middle elements, three elements are chosen at random.
 * 	This has the advantage of being immune to intentional attacks, though there is 
 * 	still a possibility (however remote) of realizing the worst case scenario. 
 * test
 *********************************/
	var myArray = new Array();
	var strOutput = 'elements:\n';

function onSave()
{

	for (var i=0; i<10; i++) 
	{
		myArray[i] = String(rnd() * rnd() * rnd());
	};
	
	for (var i=0; i<10; i++) 
	{
		strOutput += "I (" + i + ") = " + String(myArray[i]) + "\n";
	}
	alert("StrOutput = \n" + strOutput);
	
	strOutput = 'elements:\n';
	
	if(confirm('Ready to sort?'))
	{
		myArray = quickSort(myArray, 0, myArray.length -1);
		for (var i=0; i<10; i++) 
		{
			strOutput += "I (" + i + ") = " + String(myArray[i]) + "\n";
		}
		alert("Sorted???\n\nStrOutput = \n" + strOutput);
	}
	else
	{
		alert('not sorting...');
	}
	return true;
}




/** Sorts the given Array using the QuickSort3 Algorithm
 * 
 * @param {Object} pvarArray The Array to sort
 * @param {Object} plngLeft The low element. Set to 0 for first pass
 * @param {Object} plngRight The high element. Set to Array.length for first pass
 */
function quickSort(pvarArray, plngLeft, plngRight)
{
    var lngFirst = 0;
    var lngLast = 0;
    var varMid = null;
    var lngIndex  = 0;
    var varSwap = null;
    var a  = 0;
    var b  = 0;
    var c  = 0;

    lngFirst = parseInt(plngLeft);
    lngLast = parseInt(plngRight);
    lngIndex = parseInt(plngRight - (plngLeft + 1));
    a = parseInt(parseInt(lngIndex * rnd) + plngLeft);
    b = parseInt(parseInt(lngIndex * rnd) + plngLeft);
    c = parseInt(parseInt(lngIndex * rnd) + plngLeft);
    if ((pvarArray[a] <= pvarArray[b]) && (pvarArray[b] <= pvarArray[c]))
	{
		lngIndex = b;
	}
	else
	{
		if ((pvarArray[b] <= pvarArray[a]) && (pvarArray[a] <= pvarArray[c]))
		{
			lngIndex = a;
		}
		else
		{
			lngIndex = c;
		}
	}
        
    varMid = pvarArray[lngIndex];
	
    do
	{
        while ((pvarArray[lngFirst] < varMid) && (lngFirst < plngRight))
		{
			 lngFirst = parseInt(lngFirst) + 1
		}
           
        while ((varMid < pvarArray[lngLast]) && (lngLast > plngLeft))
        {
			lngLast = lngLast - 1;
		}
        if(lngFirst <= lngLast)
		{
			varSwap = pvarArray[lngFirst];
			pvarArray[lngFirst] = pvarArray[lngLast];
            pvarArray[lngLast] = varSwap;
            lngFirst = lngFirst + 1;
            lngLast = lngLast - 1;
		}
    }

    while(lngFirst < lngLast)
	
    if ((lngLast - plngLeft) < (plngRight - lngFirst))
	{
		if(plngLeft < lngLast)
		{
			pvarArray = quickSort(pvarArray, parseInt(plngLeft), parseInt(lngLast));
		}  
        if(lngFirst < plngRight)
		{
			pvarArray = quickSort(pvarArray, parseInt(lngFirst), parseInt(plngRight));
		} 
	} 
	else
	{
		if(lngFirst < plngRight)
		{
			pvarArray = quickSort(pvarArray, parseInt(lngFirst), parseInt(plngRight));
		}  
        if(plngLeft < lngLast)
		{
			pvarArray = quickSort(pvarArray, parseInt(plngLeft), parseInt(lngLast));
		}   
	}
	return pvarArray;
}


function rnd() 
{ 
  var rndnum = Math.random() * 10; 
  rndnum = Math.ceil (rndnum); 
  return rndnum 
} 