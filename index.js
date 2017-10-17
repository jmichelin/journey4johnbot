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

var grammar = tracery.createGrammar({
  'character': ['Finis Valorum', 'Bail Prestor Organa', 'Jango Fett', 'Sebulba', 'Adi Gallia'],
  'action': ['force push', 'jetpack', 'charge', 'blast'],
  'place': ['Tund', 'the Scimitar', 'Jakku', 'the flight deck', 'Tashi Station', 'Slave 1'],
  'object': ['DL-44', 'protocol droid', 'light saber'],
  'origin': ['#character.capitalize# #action.ed# #character.capitalize# on #place# to get some #object.s#.']
});
// #object.a# adds a or an
// #object.s# pluralizes

grammar.addModifiers(tracery.baseEngModifiers);

var story = grammar.flatten('#origin#');

console.log(story);