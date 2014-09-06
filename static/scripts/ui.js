var colours = [
    ['#FA696B', '#F25255'],
    ['#69BEFA', '#8ACEFF'],
    ['#B7F7C1', '#B0E8AB'],
    ['#FFB347', '#F29F41'],
    ['#F56991', '#FC84A6']
]

function startCounter() {
    var TIME = 3;
    var count = TIME;
    setInterval(function() {
        if (count > 0) {
            $('.cur .p-bar').css('width', '100%');
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

function addQ() {
    $('body').append(question({q1: 'foo', q2: 'bar'}));

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

var question = Handlebars.compile($("#entry-template").html());

$(document).ready(function() {
    addQ();
    $('.old').removeClass('old').addClass('cur');

    startCounter();

    // Music
    var mp3 = document.createElement("audio");
    mp3.setAttribute('src', 'runamok.mp3');
    mp3.load();
    document.documentElement.appendChild(mp3);
    mp3.play();
});