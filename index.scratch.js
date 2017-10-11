var Twit = require("twit");
var fs = require("fs");
var request = require("request");
var vision = require("@google-cloud/vision")({
  projectId: "johnbot-182518",
  keyFilename: "./private/keyfile.json"
});
var Canvas = require('canvas');

console.log(vision);

require("dotenv").config();

var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

function downloadPhoto(url, replyToName, tweetId) {
  var paramaters = {
    url: url,
    encoding: "binary"
  };
  request.get(paramaters, function(err, response, body) {
    var filename = "photo" + Date.now() + ".jpg";
    fs.writeFile(filename, body, "binary", function(err) {
      console.log("Downloaded Photo.");
      analyzePhoto(filename, replyToName, tweetId);
    });
  });
}

function analyzePhoto(filename, replyToName, tweetId) {
  vision.faceDetection(filename, function(err, faces) {
    console.log("faces", faces);
  });
}

//  analyzePhoto('photo1507730364223.jpg', '@journey4John', 'blah');

function detectFaces(inputFile, callback) {
  // Make a call to the Vision API to detect the faces
  const request = { source: { filename: inputFile } };
  vision
    .faceDetection(request)
    .then(results => {
      const faces = results[0].faceAnnotations;
      var numFaces = faces.length;
      console.log("Found " + numFaces + (numFaces === 1 ? " face" : " faces"));
      callback(null, faces);
    })
    .catch(err => {
      console.error("ERROR:", err);
      callback(err);
    });
}

var inputFile = "photo1507730364223.jpg";
detectFaces(inputFile, function(err, faces) {
  if (err) {
    console.error(err);
  }
  console.log("detectFaces response, ", faces);
  highlightFaces(inputFile, faces, 'face.png', Canvas, function(err){
    if(err){
      console.error(err);
    }
  })
});

function highlightFaces (inputFile, faces, outputFile, Canvas, callback) {
  fs.readFile(inputFile, (err, image) => {
    if (err) {
      return callback(err);
    }

    var Image = Canvas.Image;
    // Open the original image into a canvas
    var img = new Image();
    img.src = image;
    var canvas = new Canvas(img.width, img.height);
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);

    // Now draw boxes around all the faces
    context.strokeStyle = 'rgba(0,255,0,0.8)';
    context.lineWidth = '5';

    faces.forEach((face) => {
      context.beginPath();
      let origX = 0;
      let origY = 0;
      face.boundingPoly.vertices.forEach((bounds, i) => {
        if (i === 0) {
          origX = bounds.x;
          origY = bounds.y;
        }
        context.lineTo(bounds.x, bounds.y);
      });
      context.lineTo(origX, origY);
      context.stroke();
    });

    // Write the result to a file
    console.log('Writing to file ' + outputFile);
    var writeStream = fs.createWriteStream(outputFile);
    var pngStream = canvas.pngStream();

    pngStream.on('data', (chunk) => {
      writeStream.write(chunk);
    });
    pngStream.on('error', console.log);
    pngStream.on('end', callback);
  });
}

/*
var stream = bot.stream("statuses/filter", { track: "@journey4john" });

stream.on("connecting", function(response) {
  console.log("Connecting....");
});

stream.on("connected", function(response) {
  console.log("Connected");
});

stream.on("error", function(err) {
  console.log(err);
});

stream.on("tweet", function(tweet) {
  console.log("Checking Tweet.");
  if (tweet.entities.media) {
    downloadPhoto(tweet.entities.media[0].media_url, tweet.user.screen_name, tweet.id_str);
  }
});
*/