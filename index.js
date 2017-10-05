var Twit = require("twit");
require("dotenv").config();

var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

// @ahandvanish

/*
Send Tweet

bot.post(
  "statuses/update",
  { status: "Thank you so much @ahandvanish for helping #twit.js this tweet!" },
  function(err, data, response) {
    if (err) {
      console.error(err);
    } else {
      console.log(`${data.text} was tweeted`);
    }
  }
);
/*
get a list of user id that follow a screenname
*/
// bot.get(
//   "followers/ids",
//   {
//     screenname: "Journey4John",
//     cursor: -1,
//     count: 20
//   },
//   function(err, data, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       //console.log(data.ids);
//       //console.log(data.next_cursor);
//     }
//   }
// );

// bot.get("followers/list", { screenname: "Journey4John" }, function(err, data, response) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(data.users.length);
//     data.users.forEach(function(user) {
//       //console.log(user.screen_name)
//     });
//     //console.log(response)
//   }
// });

function getBotTimeline() {
  bot.get("statuses/home_timeline", { count: 5 }, function(err, data, response) {
    if (err) {
      console.error("Error\n", err);
    } else {
      data.forEach(function(d) {
        console.log(d.text);
        console.log(d.user.screen_name);
        console.log(d.id_str);
        console.log("\n");
      });
      //console.log(data);
      //console.log(data.next_cursor);
    }
  });
}

//getBotTimeline();

// bot.post("statuses/retweet/:id", { id: '' }, function(err, data, response) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`${data.text} was retweeted`);
//   }
// });
//
// bot.post("statuses/unretweet/:id", { id: '' }, function(err, data, response) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`${data.text} was retweeted`);
//   }
// });

// bot.post("favorites/create", { id: "915661607648116736" }, function(err, data, response) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`${data.text} was favorited`);
//   }
// });
//
// bot.post("favorites/destroy", { id: "915661607648116736" }, function(err, data, response) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(`${data.text} was unfavorited`);
//   }
// });

//reply to a tweet
// bot.post(
//   "statuses/update",
//   {
//     status: "@Space_Station Now we can go to #mars!!",
//     in_reply_to_status_id: "915990634103820290"
//   },
//   function(err, data, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`${data.text} was retweeted`);
//     }
//   }
// );

//remove reply
// bot.post(
//   "statuses/destroy",
//   {
//     status: "@Space_Station Now we can go to #mars!!",
//     in_reply_to_status_id: "915990634103820290"
//   },
//   function(err, data, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`${data.text} was retweeted`);
//     }
//   }
// );
// twbg twbp

/*

Search types
q: 'single'
q: 'both words'
q: '"exact match"'
q: 'this OR that'
q: 'this -notThat -orNotTheOther'
q: ':( emoticons'
q: '#hashtags'
q: 'to@journey4John'
q: 'from@journey4John'
q: 'dance filter:safe' //g rated
q: 'dance filter:media' //videos and pictures
q: 'dance filter:vine' //
q: 'dance filter:images'
q: 'dance filter:links'
q: 'dance url:amazon'
q: 'dance ?' //search for questions
q: 'dance since:01/11/2017'

additional config params

result_type: recent/popular
geocode: 'lat, lng, radius' // '40.749175, -73.977369, 1mi'
lang: 'es'




 */

// bot.get(
//   "search/tweets",
//   {
//     q: '"corgi butt"',
//     count: 5
//   },
//   function(err, data, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       // console.log(data);
//       data.statuses.forEach(s => {
//         console.log(s.text);
//         console.log(s.user.screen_name);
//         console.log("\n");
//       });
//     }
//   }
// );

// random sampling of live tweets
// var stream = bot.stream('statuses/sample');

// stream.on('tweet', function(tweet){
//   console.log(tweet.text+'\n');
// });
//

//var stream = bot.stream('statuses/filter', { track: 'corgi, dog' }); //or
//var stream = bot.stream('statuses/filter', { track: 'corgi dog' }); //and
//space = logical and , logical or
// var stream = bot.stream('statuses/filter', { track: 'corgi' });

var stream = bot.stream('statuses/filter', { locations: '-74,40,-73,41'})

stream.on('tweet', function(tweet){
  console.log(tweet.text+'\n');
});