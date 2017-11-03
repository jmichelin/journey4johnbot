var Twit = require("twit");
var rita = require("rita");
var midi = require("jsmidgen");
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var ffmpegPath = require("@ffmpeg-installer/ffmpeg");
var ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfmpegPath(ffmpegPath.path);

require("dotenv").config();

var bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});
var botUserName = "@journey4john";

var imgFileName = path.join(process.cwd(), "black.jpg");
var midiFileName = path.join(process.cwd(), "output.mid");
var waveFileName = path.join(process.cwd(), "output.wav");
var videoFileName = path.join(process.cwd(), "output.mp4");

function hasNoStopwords(token) {
  var stopwords = ["@", "RT", "http"];
  return stopwords.every(function(sw) {
    return !token.includes(sw);
  });
}

function isNotPunctuation(token) {
  return !rita.RiTa.isPunctuation(token);
}

function cleanText(text) {
  return text.split(" ").filter(hasNoStopwords).join(" ").trim();
}

function getPartsOfSpeech(text) {
  return rita.RiTa.getPosTags(text);
}

function compose(taggedTweet, track) {
  var notes = taggedTweet.map(function(tag) {
    if (tag.includes("nn") || tag.includes("i")) {
      return "e4";
    }
    if (tag.includes("vb")) {
      return "g4";
    }
    return "c4";
  });
  notes.forEach(function(note) {
    track.addNote(0, note, 128); // channel, note string, duration 128 = 1/4 note
  });
  return track;
}

function createMidiFile(tweet, midiFileName, cb) {
  var file = new midi.File();
  var track = new midi.Track();
  file.addTrack(track);
  var cleanedText = rita.RiTa.tokenize(tweet.text);
  var taggedTweet = getPartsOfSpeech(cleanedText);
  compose(taggedTweet, track);
  fs.writeFile(midiFileName, file.toBytes(), { encoding: "binary" }, cb);
}

function convertMidiToWav(midiFileName, waveFileName, cb) {
  var command = `timidity --output-24bit -A120 ${midiFileName} -Ow -o ${waveFileName}`;
  child_process.exec(command, {}, function(err, stdout, stderr) {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

function createVideo(imageFileName, waveFileName, videoFileName, cb) {
  ffmpeg()
    .on("end", function() {
      cb(null);
    })
    .on("error", function(err, stdout, stderror) {
      cb(err);
    })
    .input(imageFileName)
    .inputFPS(1 / 6)
    .input(waveFileName)
    .output(videoFileName)
    .outputFPS(30)
    .run();
}

function createMedia(tweet, imgFileName, midiFileName, waveFileName, videoFileName, cb) {
  createMidiFile(tweet, midiFileName, function(err, result) {
    if (err) {
      console.error("Error: ", err);
    } else {
      convertMidiToWav(midiFileName, waveFileName, function(err) {
        if (err) {
          console.error("Error: ", err);
        } else {
          console.log("Midi Converted");
          createVideo(imgFileName, waveFileName, videoFileName, cb);
        }
      });
    }
  });
}

function deleteWav(waveFileName, cb) {
  console.log('Wav file has been deleted');
  var command = `rm ${waveFileName}`;
  child_process.exec(command, {}, function(err, stdout, stderr) {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

function postStatus(params) {
  bot.post(
    "statuses/update",
    params,
    function (err, data, response) {
      if (err) {
        console.error(err);
      } else {
        console.log(`${data}`);
      }
    }
  );
}

function uploadMedia(tweet, videoFileName) {
  bot.postMediaChunked(
    {
      file_path: videoFileName
    },
    function(err, data, response) {
      if (err) {
        console.error("Error: ", err);
      } else {
        console.log(data);
        var stat = tweet.text.split(botUserName).join(" ").trim();
        var params = {
          status: `@${tweet.user.screen_name} ${stat}`,
          in_reply_to_status_id: tweet.id_str,
          media_ids: data.media_id_string
        };
        postStatus(params);
      }
    }
  );
}

console.log('About to stream!');

var stream = bot.stream("statuses/filter", { track: botUserName });

stream.on('connecting', function(response){
  console.log('connecting...');
});

stream.on('connected', function(response){
  console.log('connected!');
});

stream.on('error', function(err){
  console.log(err);
});

stream.on("tweet", function(tweet) {
  if (tweet.text.length > 0) {
    createMedia(tweet, imgFileName, midiFileName, waveFileName, videoFileName, function(err) {
      if (err) {
        console.error("Error: ", err);
      } else {
        console.log("Media Created");
        deleteWav(waveFileName, function(err) {
          if (err) {
            console.error("Error: ", err);
          } else {
            uploadMedia(tweet, videoFileName);
          }
        });
      }
    });
  }
});
