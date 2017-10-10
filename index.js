var Twit = require("twit");
var fs = require("fs");
var request = require('request');
var vision = require('@google-cloud/vision')({
  projectId: 'johnbot',
  keyFilename: './keyfile.json'
})

require("dotenv").config();


var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});
