var Twit = require("twit");
var Tabletop = require("tabletop");

require("dotenv").config();

var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

//var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1jiG2gtEbYcltAkR84nYGMZbuC09Aysef4nJyJfjR7VU/pubhtml';
var  spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1mXw73cif2QLvELWTfFJL_0rMgnmwpywGgZzOW1Denbk/edit?usp=sharing';


var spreadsheetUrlBroken = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-b9W2Yv6QdYT5sPlISZ2e2Ris-0XOZd8quemPavO-g0dEVNEz344Oe2SnN0rT6yGC1uuI1Jk9VIMo/pubhtml';

//console.log(spreadsheetUrlBroken.match(/[\\/][d][\\/][e][\\/]/g));

Tabletop.init({
  key: spreadsheetUrl,
  callback: function(data, tabletop){
    data.forEach(function(row){
      var status = `${row.URL} is a useful resource for ${row.Subject} #javascript #coding`;
      var allowPost = true;
      console.log(status);
      if(allowPost === true) {
        bot.post(
          "statuses/update",
          {
            status:status
          },
          function (err, data, response) {
            if (err) {
              console.error(err);
            } else {
              console.log(`${data}`);
            }
          }
        );
      }
    });
  },
  simpleSheet: true
});
