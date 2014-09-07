var TEST_RESTAURANTS = [
    {"location": {
        "address": ["109 Dryden Rd"],
        "postal_code": "14850",
    }},
    {"location": {
        "address": ["110 Dryden Rd"],
        "postal_code": "14850",
    }},
    {"location": {
        "address": ["410 Dryden Rd"],
        "postal_code": "14850",
    }},
];

var TEST_TREE = {
    "category": "Starts with 4",
    "yes": {
        "category": "Raghav lives there",
        "yes": {
            "category": "",
            "yes": {},
            "no": {},
            "candidates": [TEST_RESTAURANTS[0]],
            "answer": "",
        },
        "no": {
            // ...
        },
        "candidates": [TEST_RESTAURANTS[0], TEST_RESTAURANTS[1]],
        "answer": "yes",
    },
    "no": {
        // ...
    },
    "candidates": TEST_RESTAURANTS,
    "answer": "yes",
};

var DEBUG = true;
var map;
var markers = [];
var steps = [];

function log(str, label) {
    if (DEBUG) {
        if (!(label === undefined)) {
            console.log(label.toUpperCase() + ':');
        }

        console.log(str);
        console.log('');
    }
}

/*
Initializes the map and sets listeners.

Arguments:
    tree - A tree whose nodes have the following fields:
              category - The category being asked
              yes - A node
              no - A node
              candidates - An array of restaurants that still considered
              answer - The option that the user picked
*/
function initialize(tree) {
    // Traverse the tree to find how many questions were asked
    numQuestions = getNumQuestions(tree);

    alert(tree);
    alert(Object.keys(tree));

    alert(tree.question);
    alert(tree.answer);
    alert(tree.yes);
    alert(tree.no);
    alert(tree.candidates);

    // Set the slider to match the number of questions
    $("#slider").attr("max", numQuestions);

    // Create markers for each restaurant address
    if (!('candidates' in tree)) {
        log('ERROR: TREE HAS NO CANDIDATES');
    }

    var restaurants = tree.candidates;
    createMarkersFromAddress(restaurants, 0);

    // Display the map
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(0.0, 0.0),

        // Turn off everything that could let the user change the map
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        draggable: false,
        keyboardShortcuts: false,
        mapTypeControl: false,
        navigationControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        scrollwheel: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    addListeners();
}

/*
Traverse the tree to find how many levels are in it.

Arguments: tree - A tree of the format shown in TEST_TREE above

Returns: An int, the number of questions that were asked based on this tree
*/
function getNumQuestions(tree) {
    count = 0;
    node = tree;

    while ('answer' in node && node.answer != "") {
        steps.push(node);
        count++;
        node = node[node.answer];
    }

    steps.push(node);
    return count;
}

/*
Create and return a google.maps.Marker object based on the address given.

Arguments:
    restaurants - An array of restaurant objects
    counter - An iterator
*/
function createMarkersFromAddress(restaurants, counter) {
    var geocoder = new google.maps.Geocoder();
    var restaurant = restaurants[counter];

    var streetAddress = restaurant.location.address;
    var zipCode = restaurant.location.postal_code;
    var address = streetAddress + " " + zipCode;

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                clickable: false,
                visible: true,
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
            restaurant.marker = marker;
        } else {
            console.log("Geocode was not successful for the following reason: "
                + status);
        }

        if (counter == restaurants.length-1) {
            // Set the new center of the map
            var bounds = new google.maps.LatLngBounds();
            for (var i=0; i < markers.length; i++) {
                bounds.extend(markers[i].getPosition());
            }
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        } else {
            createMarkersFromAddress(restaurants, counter+1);
        }
    });
}

function addListeners() {
    var oldStep = $("#slider").val();
    var instructions = $("#option1").html();

    $("#slider").on('input', function() {
        var currentStep = $("#slider").val();
        var currentNode = steps[currentStep];
        var currentCandidates = currentNode.candidates;

        var option1;
        var option2;
        var category;

        if (currentStep > 0) {
            category = steps[currentStep-1].category
            option1 = category;
            option2 = "No " + category;
        } else {
            option1 = instructions;
            option2 = "";
        }

        $("#option1").html(option1);
        $("#option2").html(option2);

        var oldNode = steps[oldStep];
        var oldCandidates = oldNode.candidates;

        var onlyOldCandidates = onlyInFirstArray(oldCandidates, currentCandidates);
        var onlyCurrentCandidates = onlyInFirstArray(currentCandidates, oldCandidates);

        // if (currentCandidates.length == 1) {
        //     currentCandidates[0].marker.setAnimation(google.maps.Animation.BOUNCE);
        // } else {
        //     currentCandidates[0].marker.setAnimation(null);
        // }

        // Set all markers in onlyCurrentCandidates to visible
        for (var i=0; i < onlyCurrentCandidates.length; i++) {
            onlyCurrentCandidates[i].marker.setVisible(true);
        }
        // Set all markers in olyOldCandidates to not visible
        for (var i=0; i < onlyOldCandidates.length; i++) {
            onlyOldCandidates[i].marker.setVisible(false);
        }

        oldStep = currentStep;
    });

    $("#restart").on('click', function() {
        // alert('This button does nothing');
    });
}

function onlyInFirstArray(a, b) {
    return a.filter(function(a) {
        return b.indexOf(a) == -1;
    });
}

// Load the map once the window has loaded
// google.maps.event.addDomListener(window, 'load',
//     function() {
//         initialize(TEST_TREE);
//     }
// );
