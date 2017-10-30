var Twit = require("twit");
var tracery = require('tracery-grammar');

require("dotenv").config();

var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

// var grammar = tracery.createGrammar({
//   'character': ['Jango Fett', 'Sebulba', 'Adi Gallia'],
//   'place': ['Tund', 'the Scimitar', 'Jakku', 'the flight deck', 'Tashi Station', 'Slave 1'],
//   'object': ['DL-44', 'protocol droid', 'light saber'],
//   'setJob': [
//     '[job:bounty hunter][actions: blasted a hole, narrowly escaped, betrayed]',
//     '[job:junker][actions: cheat, lie, skim off the top, barter with]',
//     '[job:imperial officer][actions: halt, asks for papers, misses badly with blaster]'
//   ],
//   'story': ['#protagonist# the #job# went to the space dock every day. Usually they #actions#.'],
//   'origin': ['#[#setJob][protagonist:#character#][story#']
// });
var grammar = tracery.createGrammar({
  'character': ['Karl', 'Aida', 'Hans'],
  'place': ['cafe', 'WeWork', 'stand up desk'],
  'object': ['laptop', 'coffee', 'dry erase marker'],
  'setPronouns': [
    '[they:they][them:them][their:their][theirs:theirs]',
    '[they:she][them:her][their:her][theirs:hers]',
    '[they:he][them:him][their:his][theirs:his]'
  ],
  'setJob': [
    '[job:frontend dev][actions:fiddled with css,wrote a react component]',
    '[job:backend dev][actions:relished his regex,wrote a node module]',
    '[job:scrum master][actions:burned down a chart,played poker]'
  ],
  'story': ['#protagonist# the #job# went to the #place# every day. Usually #they# #actions#. And finally #they# picked up #their# #object#.'],
  'origin': ['#[#setPronouns#][#setJob#][protagonist:#character#]story#']
});
// #object.a# adds a or an
// #object.s# pluralizes

grammar.addModifiers(tracery.baseEngModifiers);

var story = grammar.flatten('#origin#');

console.log('The Story\n', story);

// bot.post(
//   "statuses/update",
//   {status: story},
//   function (err, data, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`${data} has been tweeted.`);
//     }
//   }
// );