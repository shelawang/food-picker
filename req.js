console.log('poop');
var oauth = OAuth({
    consumer: {
        public: 'D_JlSCNIKvjpJmpr9rl4TQ',
        secret: 'pzQlZmIGppUctcdx43ycXwp4uGc'
    },

    signature_method: 'HMAC-SHA1'
});

var request_data = {
    url: 'http://api.yelp.com/v2/search?term=cream+puffs&location=San+Francisco',
    method: 'POST',
    data: {
        status: 'faq!'
    }
};

var token = {
    public: 'LlBmdceivg1QCFZOPo8PsGapF7iDN9uT',
    secret: '5QmbdShacxjSEDYrwXU55DLx_bM'
};

oauth.authorize(request_data, token);

$.ajax({
    url: request_data.url,
    type: request_data.method,
    data: oauth.authorize(request_data, token)
}).done(function(data) {
    //process your data here
    alert('poo');
});