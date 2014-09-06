/*
*   Given a set of search parameters, do a call to the Yelp API
*   and return the resulting Food Picker JS object.
*/
var questionTree = function(limit, radius, lat, long_) {
    var data = {limit: limit,
                radius: radius,
                lat: lat,
                'long' : long_};
    var ret;

    $.getJSON("http://localhost:5000/request", 
        data, function(result) {
            console.log('hello');
        
            ret = questionNode(result.businesses);
            console.log(ret);
        });
    return ret;
};

/*
*   Given a chunk of a Food Picker JS object, create one node of
*   the binary decision tree.
*/
function questionNode(candidates) {
    var totalCount = candidates.length;

    var flag;
    var question;
    var yes = [];
    var no = [];

    if (totalCount == 1) {
        console.log('poop');
        return {
            flag: '',
            question: '',
            yes: null,
            no: null,
            candidates: candidates
        }
    }

    var table = {};
    for (var i = 0; i < totalCount; i++) {
        updateTable(table, candidates[i]);
    }

    var sameCount = true
    for (var key in table) {
        sameCount = sameCount && (table[key] == totalCount);
    }

    if (sameCount) {

        flag = 'name';

        var nameRand = (Math.random() * totalCount) | 0;
        console.log(candidates);
        console.log(nameRand);
        question = candidates[nameRand].name;

        yes = [candidates[nameRand]];
        for (var j = 0; j < totalCount; j++) {
            if (j != nameRand) {
                no.push(candidates[j]);
            }
        }

    } else {
    
        flag = 'category';
    
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
    
        var categoryRand = (Math.random() * categoryList.length) | 0;
        question = categoryList[categoryRand];
    
        for (var k = 0; k < totalCount; k++) {
            if (containsCategory(question, candidates[k])) {
                yes.push(candidates[k]);
            } else {
                no.push(candidates[k]);
            }
        }
    }

    return {
        question: question,
        yes: questionNode(yes),
        no: questionNode(no),
        candidates: candidates
    };

};

function updateTable(table, candidate) {
    for (var i = 0; i < candidate.categories.length; i++) {
        var categoryName = candidate.categories[i][0];
        if (table.hasOwnProperty(categoryName)) {
            table[categoryName] += 1;    
        } else {
            table[categoryName] = 1;
        }
    }
};

function containsCategory(questionCategory, candidate) {
    for (var i = 0; i < candidate.categories.length; i++) {
        var categoryName = candidate.categories[i][0];
        if (categoryName == questionCategory) {
            return true
        }
    }

    return false;
};

questionTree(10, 10, 37.77493, -122.419415);
