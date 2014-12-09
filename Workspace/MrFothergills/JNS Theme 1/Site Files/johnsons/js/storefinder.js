//var pcaStoreFinderKey = [brand-specific.js];
var pcaStoreFinderOrigin = function(){return $('#postcode').val();};
var pcaStoreFinderMaximumItems = 6;
var pcaStoreFinderMaximumRadius = 0;
var pcaStoreFinderMaximumTime = 0;
var pcaStoreFinderDistanceType = 'StraightLine';
//var pcaStoreFinderLocationLists = [brand-specific.js];

function kmToMiles(km){
 return km * 0.621371192;
}
function locateStore(){
 StoreFinder_Interactive_RetrieveNearest_v1_10(pcaStoreFinderKey, pcaStoreFinderOrigin, pcaStoreFinderMaximumItems, pcaStoreFinderMaximumRadius, pcaStoreFinderMaximumTime, pcaStoreFinderDistanceType, pcaStoreFinderLocationLists);
}
function StoreFinder_Interactive_RetrieveNearest_v1_10(Key, Origin, MaximumItems, MaximumRadius, MaximumTime, DistanceType, LocationLists) {
    $.getJSON("http://services.postcodeanywhere.co.uk/StoreFinder/Interactive/RetrieveNearest/v1.10/json2.ws?callbackFunction=?",
    {
        Key: Key,
        Origin: Origin,
        MaximumItems: MaximumItems,
        MaximumRadius: MaximumRadius,
        MaximumTime: MaximumTime,
        DistanceType: DistanceType,
        LocationLists: LocationLists
    },
    function (data) {
        // Test for an error
        if (data.length == 1 && typeof(data[0].Error) != "undefined") {
            // Show the error message
            alert(data[0].Description);
        }
        else {
            // Check if there were any items found
            if (data.length == 0)
                alert("Sorry, there were no results");
            else {
                var i = 0;
                $('#pcastorelocatoroutput td').each(function(){
                    $(this).html('<p><b>' + kmToMiles(data[i].Distance).toFixed(1) + ' miles</b><br>' + data[i].Name + '<br>' + data[i].Description + '</p>');
                    i++;
                });
                // PUT YOUR CODE HERE
                //FYI: The output is a JS object (e.g. data[0].YourId), the keys being:
                //YourId
                //Name
                //Description
                //Distance
                //Time
                //Easting
                //Northing
                //Latitude
                //Longitude
            }
        }
    });
}
