var colours = [
    ['#FA696B', '#F25255'],
    ['#69BEFA', '#8ACEFF'],
    ['#B7F7C1', '#B0E8AB'],
    ['#FFB347', '#F29F41'],
    ['#36a564', '#5eb783'],
    ['#F1E05C', '#f3e67c']
];

var curInterval;

var tree;
var curTreeNode;

function startCounter() {
    var TIME = 4;
    var count = TIME;
    curInterval = setInterval(function() {
        if (count > 0) {
            $('.cur .p-bar').css('width', 0);
            $('#counter').css('opacity', 1);
            $('#counter').text(count);
            count--;
        }
        else {
            // randomly select
            var rand = Math.random() * 1 | 0;
            if (rand == 0) {
                curTreeNode = curTreeNode.yes;
            }
            else {
                curTreeNode = curTreeNode.no;
            }
            clearInterval(curInterval);
            next();
            count = TIME;
        }
    }, 1000)
}

function next() {
    addQ();
}

function showEnd(restaurant) {
    clearInterval(curInterval);

    $('body').append(end({
        name: restaurant.name,
        rating: 1,
        phone: restaurant.phone,
        address: restaurant.location.address[0],
        zip: restaurant.location.postal_code
    }));

    $('#again').on('click', function() {
        $('#end').remove();
        start();
    });
    $('#stats').on('click', function() {
        $('body').append(map());
        initialize(tree);
    });

    $('.top').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
        function() {
            $("#question").remove();
        }
    );
    transition();
}

function addQ() {
    if (curTreeNode.candidates.length == 1) {
        showEnd(curTreeNode.candidates[0]);
        return;
    }
    $('body')
        .append(question({q1: curTreeNode.question, q2: "No " + curTreeNode.question}));


    // Change the colour
    var rand = Math.random() * colours.length | 0;
    var colour = colours[rand];

    var top = $(".old .top");
    var bottom = $(".old .bottom");

    top.css('background-color', colour[0]);
    bottom.css('background-color', colour[1]);

    // Resize top and bottom to take up half height
    var $window = $(window);
    winHeight = $window.height();

    top.height(winHeight/2);
    bottom.height(winHeight/2);

    $(window).resize(function(){
        winHeight = $window.height();

        top.height(winHeight/2);
        bottom.height(winHeight/2);
    });


    // Listeners
    top.on('click', function() {
        clearInterval(curInterval);
        curTreeNode.answer = "yes";
        curTreeNode = curTreeNode.yes;
        next();
    });

    bottom.on('click', function() {
        clearInterval(curInterval);
        curTreeNode.answer = "no";
        curTreeNode = curTreeNode.no;
        next();
    });

    top.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
        function() {

            $('.cur').remove();
            $('.old').addClass('cur').removeClass('old');
        }
    );

    transition();
    startCounter();
}

// Do a random transition to the next question
function transition() {
    var $window = $(window);
    winWidth = $window.width();
    var rand = Math.random() * 3 | 0;

    $('.cur #counter').fadeOut(400);
    $('.cur .p-bar').fadeOut(400);

    if (rand == 0) {
        $('.cur .top').css('left', winWidth);
        $('.cur .bottom').css('left', -winWidth);
    }
    else if (rand == 1) {
        $('.cur .top').css('left', -winWidth);
        $('.cur .bottom').css('left', winWidth);
    }
    else if (rand == 2) {
        $('.cur .top').css('top', -winWidth);
        $('.cur .bottom').css('bottom', -winWidth);
    }
}

var question = Handlebars.compile($("#question-temp").html());
var main = Handlebars.compile($("#main-temp").html());
var end = Handlebars.compile($("#end-temp").html());
var add = Handlebars.compile($("#add-temp").html());

var map = Handlebars.compile($("#map-temp").html());

function showMain() {
    $('body').append(main);
    $('#start').on('click', function() {
        $('#main').remove();
        start();
    });
}

function start() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            tree = questionTree(16, 5, position.coords.latitude, position.coords.longitude);
            curTreeNode = tree;
            addQ();

            $('.old').removeClass('old').addClass('cur');
        });
    }
    else {
        alert("No location support");
    }


    // Music
    // var mp3 = document.createElement("audio");
    // mp3.setAttribute('src', 'runamok.mp3');
    // mp3.load();
    // document.documentElement.appendChild(mp3);
    // mp3.play();
}

// function isIOS() {
//     var userAgent = window.navigator.userAgent.toLowerCase();
//     return /iphone|ipad|ipod/.test( userAgent );
// };

// function isStandalone() {
//     return ( isIOS() && window.navigator.standalone );
// };

// window.onload = function () {
//     if( isStandalone() || !isIOS() ) { //either ios+standalone or not ios
//         //start app
//         alert('derp');
//     } else {
//         //display add to homescreen page
//         alert('add to homescreen');
//     };
// };

$(document).ready(function() {
    showMain();
});

document.ontouchmove = function(event){
    event.preventDefault();
}
