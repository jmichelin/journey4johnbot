var Twit = require("twit");
var fs = require("fs");
var csvParse = require("csv-parse");
var rita = require('rita');
var inputText = "I went to the car. The car went over the grocery store. Ben went bowling behind the grocery store and went off a cliff.";

require("dotenv").config();


var markov = new rita.RiMarkov(3);
markov.loadText(inputText);
var sentences = markov.generateSentences(1);

console.log(sentences);
console.log(markov.getProbability('went'));
console.log(markov.getProbabilities('went'));

var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

function getNasaPhoto() {
  var parameters = {
    url: "https://api.nasa.gov/planetary/apod",
    qs: {
      api_key: process.env.NASA_API_KEY
    },
    encoding: "binary"
  };
  request.get(parameters, function(err, response, body) {
    body = JSON.parse(body);
    saveFile(body, 'nasa.jpg');
    // saveFile("https://media3.giphy.com/media/gixQfE7XzZfpe/giphy.gif", "nasa.gif");
  });
}

function saveFile(body, fileName) {
  var file = fs.createWriteStream(fileName);
  request(body).pipe(file).on("close", function(err) {
    if (err) {
      console.error("Error", err);
    } else {
      console.log("Media Saved");
      var descriptionText = body.title
      //var descriptionText = 'Dancing Corgi Time'
      uploadMedia(descriptionText, fileName);
    }
  });
}

function uploadMedia(descriptionText, fileName) {

  var filePath = __dirname + "/" + fileName;
  bot.postMediaChunked({ file_path: filePath }, function(err, data, response) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
      var params = {
        status: descriptionText,
        media_ids: data.media_id_string
      };
      postStatus(params);
    }
  });
}


function postStatus(params){
  bot.post(
    "statuses/update",
    params,
    function (err, data, response) {
      if (err) {
        console.error(err);
      } else {
        console.log(`Status Posted`);
      }
    }
  );
}


// getNasaPhoto();
