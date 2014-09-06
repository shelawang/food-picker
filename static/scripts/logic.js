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
    return 0;
};

/*
    Given a chunk of a Food Picker JS object, create one node of
    the binary decision tree.
*/
var questionNode = function(candidates) {

    var totalCount = candidates.length;

    if totalCount == 0 {
        return null
    }

    var table = {};
    for (var i = 0; i < totalCount; i++) {
        updateTable(table, candidates[i]);
    }

    var categoryList = [];
    var minDiff = totalCount;
    for (var key in table) {
        var diff = Math.abs(table[key] - totalCount / 2);
        if diff < minDiff {
            minDiff = diff;
            categoryList = [key]
        }
        if diff == minDiff {
            categoryList.push(key)
        }
    }

    var rand = (Math.random() * categoryList.length) | 0;
    var category = categoryList[rand];


};

fpObj(10, 10, 37.77493, -122.419415);

    var yes = [];
    var no = [];
    for (var j = 0; j < totalCount; j++) {
        if containsCategory(category, candidates[j]) {
            yes.push(candidates[j]);
        } else {
            no.push(candidates[j]);
        }
    }

    return {
        category: category,
        yes: yes,
        no: no,
        candidates: candidates
    }
};

var updateTable = function(table, candidate) {
    for (var i = 0; i < candidate.categories.length; i++) {
        var categoryName = candidate.categories[i][0];
        if (table.hasOwnProperty(categoryName)) {
            table[categoryName] += 1;    
        } else {
            table[categoryName] = 1;
        }
    }
};

var containsCategory = function(questionCategory, candidate) {
    for (var i = 0; i < candidate.categories.length; i++) {
        var categoryName = candidate.categories[i][0];
        if (categoryName == questionCategory) {
            return true
        }
    }

    return false;
};
