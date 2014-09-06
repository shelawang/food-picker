from flask import Flask, request

import argparse
import json
import pprint
import sys
import urllib
import urllib2

import oauth2

app = Flask(__name__)

CONSUMER_KEY = 'H85zQotPvyaafxY-wFjJOg'
CONSUMER_SECRET = 'LRROlUpL-TLVMA25NztXm6gVnHE'
TOKEN = 'Awp8bAxSd7p_dntg10i9jQEYGqIB1gdo'
TOKEN_SECRET = 'TBE0BGBLhDKprgT-Lt8LvJU5mkQ'

@app.route('/request')
def request():
    
    host = 'api.yelp.com'
    path = '/v2/search'

    limit = request.args.get('limit')
    radius = request.args.get('radius')
    lat = request.args.get('lat')
    long_ = request.args.get('long')

    url_params = {
        'limit': limit,
        'radius_filter': radius,
        'location': lat + ',' + long_
    }

    encoded_params = urllib.urlencode(url_params)  
    
    url = 'http://{0}{1}?{2}'.format(host, path, encoded_params)

    consumer = oauth2.Consumer(CONSUMER_KEY, CONSUMER_SECRET)
    oauth_request = oauth2.Request('GET', url, {})
    oauth_request.update(
        {
            'oauth_nonce': oauth2.generate_nonce(),
            'oauth_timestamp': oauth2.generate_timestamp(),
            'oauth_token': TOKEN,
            'oauth_consumer_key': CONSUMER_KEY
        }
    )
    token = oauth2.Token(TOKEN, TOKEN_SECRET)
    oauth_request.sign_request(oauth2.SignatureMethod_HMAC_SHA1(), consumer, token)
    signed_url = oauth_request.to_url()

    print 'Querying {0} ...'.format(url)

    conn = urllib2.urlopen(signed_url, None)
    try:
        response = str(json.loads(conn.read()))
    finally:
        conn.close()

    return response

if __name__ == '__main__':
    app.run(debug=True)
