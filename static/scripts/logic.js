/*
    Given a set of search parameters, do a call to the Yelp API
    and return the resulting Food Picker JS object.
*/
var fpObj = function(limit, radius, lat, long_) {
    var poo = 0;
    var data = {limit: limit,
                radius: radius,
                lat: lat,
                'long' : long_};

    $.getJSON("http://localhost:5000/request", 
        data, function() {
            console.log('hello');
            // poo = result;
            // console.log(result);
        });
    // return poo;
};

/*
    Given a Food Picker JS object, generate a binary decision tree
    that contains the questions being used by Food Picker.
*/
var questionTree = function(fpObj) {

};

/*
    Given a chunk of a Food Picker JS object, create one node of
    the binary decision tree.
*/
var questionNode = function(fpObjRemaining) {

};

fpObj(10, 10, 37.77493, -122.419415);