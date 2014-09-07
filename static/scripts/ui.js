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
    var TIME = 3;
    var count = TIME;
    curInterval = setInterval(function() {
        if (count > 0) {
            $('.cur .p-bar').css('width', 0);
            $('#counter').css('opacity', 1);
            $('#counter').text(count);
            count--;
        }
        else {
            next();
            count = TIME;
        }
    }, 1000)
}

function next() {
    addQ();
    transition();
}

function showEnd(restaurant) {
    $('body').append(end({restaurant: restaurant}));
}

function addQ() {
    if (curTreeNode.candidates.length == 1) {
        showEnd(curTreeNode.candidates[0].name);
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
        curTreeNode = curTreeNode.yes;
        next();
        startCounter();
    });

    bottom.on('click', function() {
        clearInterval(curInterval);
        curTreeNode = curTreeNode.no;
        next();
        startCounter();
    });

    top.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
        function() {
            $('.cur').remove();
            $('.old').addClass('cur').removeClass('old');
        }
    );
}

// Do a random transition to the next question
function transition() {
    var $window = $(window);
    winWidth = $window.width();
    var rand = Math.random() * 3 | 0;

    $('#counter').fadeOut(400);
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

function showMain() {
    $('body').append(main);


}

function start() {
    addQ();
    $('.old').removeClass('old').addClass('cur');

    startCounter();

    // Music
    var mp3 = document.createElement("audio");
    mp3.setAttribute('src', 'runamok.mp3');
    mp3.load();
    document.documentElement.appendChild(mp3);
    mp3.play();
}

$(document).ready(function() {
    // showMain();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            tree = questionTree(10, 10, position.coords.latitude, position.coords.longitude);
            curTreeNode = tree;
            start();
        });
    }
    else {
        alert("No location support");
    }
});

document.ontouchmove = function(event){
    event.preventDefault();
}