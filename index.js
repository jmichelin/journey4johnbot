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
bot.get(
  "followers/ids",
  {
    screenname: "Journey4John",
    cursor: -1,
    count: 20
  },
  function(err, data, response) {
    if (err) {
      console.error(err);
    } else {
      //console.log(data.ids);
      //console.log(data.next_cursor);
    }
  }
);

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

getBotTimeline();

bot.post("statuses/retweet/:id", { id: '' }, function(err, data, response) {
  if (err) {
    console.error(err);
  } else {
    console.log(`${data.text} was retweeted`);
  }
});

bot.post("statuses/unretweet/:id", { id: '' }, function(err, data, response) {
  if (err) {
    console.error(err);
  } else {
    console.log(`${data.text} was retweeted`);
  }
});
