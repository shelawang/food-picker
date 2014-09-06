from flask import Flask, request

import argparse
import json
import pprint
import sys
import urllib
import urllib2

import oauth2

import math

app = Flask(__name__)

CONSUMER_KEY = 'H85zQotPvyaafxY-wFjJOg'
CONSUMER_SECRET = 'LRROlUpL-TLVMA25NztXm6gVnHE'
TOKEN = 'Awp8bAxSd7p_dntg10i9jQEYGqIB1gdo'
TOKEN_SECRET = 'TBE0BGBLhDKprgT-Lt8LvJU5mkQ'

@app.route('/request')
def api_call():
    
    print('butt')

    host = 'api.yelp.com'
    path = '/v2/search'

    limit = request.args.get('limit') # limit in number of restaurants
    radius = request.args.get('radius') # radius from center in miles
    lat = request.args.get('lat') # center latitude
    long_ = request.args.get('long') # center longitude

    # test data
    # limit = '10'
    # radius = '10'
    # lat = '37.77493'
    # long_ = '-122.419415'

    delta_lat = int(radius) / 69.11
    delta_long = int(radius) / (69.11 * math.cos(float(lat)))

    sw_lat = str(float(lat) - delta_lat)
    sw_long = str(float(long_) - delta_long)
    ne_lat = str(float(lat) + delta_lat)
    ne_long = str(float(long_) + delta_long)

    term = 'food'

    encoded_params = "term={0}&bounds={1},{2}|{3},{4}".format(term, sw_lat, sw_long, ne_lat, ne_long, limit) 
    
    url = 'http://{0}{1}?{2}'.format(host, path, encoded_params)

    print url

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
    print str(response)
    return response

if __name__ == '__main__':
    app.run(debug=True)
