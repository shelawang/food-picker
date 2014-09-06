/*
    Given a set of search parameters, do a call to the Yelp API
    and return the resulting Food Picker JS object.
* @return object containing query information
*/
var fpObj = function(limit, radius, lat, long_, cat) {
  var data;
    data = {limit: limit,
            radius: radius,
            lat: lat,
            'long' : long_};

  //we have a category filter
  if (arguments.length === 5) {
    data.cat = cat;

  }
    var hooplah;

    $.getJSON("http://localhost:5000/request", 
        data, function(result) {
            console.log('hello');
            console.log(result);
            // hooplah = questionTree(result);
                // console.log(hooplah);

        });
    // return hooplah;
};

/*
    Given a Food Picker JS object, generate a binary decision tree
    that contains the questions being used by Food Picker.
*/
function questionTree(fpObj) {
    return questionNode(fpObj.businesses);
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

/*
    Given a chunk of a Food Picker JS object, create one node of
    the binary decision tree.
*/
function questionNode(candidates) {
    var totalCount = candidates.length;

    if (totalCount == 0) {
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
        if (diff < minDiff) {
            minDiff = diff;
            categoryList = [key]
        }
        if (diff == minDiff) {
            categoryList.push(key)
        }
    }

    var rand = (Math.random() * categoryList.length) | 0;
    var category = categoryList[rand];

    var yes = [];
    var no = [];
    for (var j = 0; j < totalCount; j++) {
        if (containsCategory(category, candidates[j])) {
            yes.push(candidates[j]);
        } else {
            no.push(candidates[j]);
        }
    }

    console.log('yes');
    console.log(yes.length);
    console.log('no');
    console.log(no.length);

    return {
        category: category,
        yes: questionNode(yes),
        no: questionNode(no),
        candidates: candidates
    };

};
fpObj(10, 10, 37.77493, -122.419415, 'vegetarian');


