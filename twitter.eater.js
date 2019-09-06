
const
  redis             = require('redis'),               // node_redis to manage the redis connection
  client            = redis.createClient(),
  Twitter           = require('twitter-lite'),
  creds             = require('./creds.js');
  tclient           = new Twitter({
    consumer_key: creds.consumer_key,
    consumer_secret: creds.consumer_secret,
    access_token_key: creds.access_token_key,
    access_token_secret: creds.access_token_secret
  }),
  maxCount          = 25,                             // adding 25 images, stop steeam at 25
  searchWord        = 'trump';                        // hard code search word

let count = 0;
let stream;

stream = tclient.stream('statuses/filter', {track: searchWord})
    .on('data', tw => {             
        "use strict";
        count += 1;
        client.xadd('tweets',                         // add to the stream `tweets`
            '*',                                      // at the latest sequence
            'icon',tw.user.profile_image_url,         // stream field `icon`
            function(err) {
                if (err) { throw err; }               // handle any errors - a production service would need better error handling.
            }
        );
        if (count > maxCount) {stream.destroy()};
    })
    .on('error', function (err) {          
        "use strict";
        console.error('Twitter Error', err);       
    });                           
                                             