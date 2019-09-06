#  Image Recognition with Redis Streams, RedisAI and NodeJS

**NOTE: Twitter Developer Credentials are needed to run this app. For information on getting credentials, go to https://developer.twitter.com/en/apply-for-access.html 

This is a demo using Redis data structure, Streams, and RedisAI to identify images. 

Twitter.eater.js gets profile icon images from a specific twitter stream, stores them in Redis Streams.

Server.node.js reads the image from Redis Streams, processes them, predicts and assigns a predictive label to them.

Output should be the image url, the predicted index ID and label (as indicated in imagenet_classes.json.)

This is a technology demo, not a reference architecture nor an example of best practices. While it might be possible to create a usable production system out of the ideas presented, it is not hardened in any way.


## Setup

To setup the demo, you will need Node.js, NPM and your Redis connection information. 

First, install node packages:
```
$ npm install
```

Second, start the Twitter eater, (in the future, the `terms` argument is the keyword on which the demo will run - it works best with something high volume like politics, sports, etc.) Right now it is hard coded with "trump" as search word:
```
$ node twitter.eater.js
```

Third, edit creds.js to include your credentials (consumer_key, consumer_secret, access_token_key, access_token_secret):


Fourth, start server.node.js which streams to browser client:
```
$ node server.node.js
```

In the console, verify the image url, index ID and label of prediction.

## License

Copyright 2019 Kim Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
