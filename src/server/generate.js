const MusicRNN = require('@magenta/music/node/music_rnn');
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());


// These hacks below are needed because the library uses performance and fetch which
// exist in browsers but not in node. We are working on simplifying this!
const globalAny = global;
globalAny.performance = Date;
globalAny.fetch = require('node-fetch');

const model = new MusicRNN.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
(async function(){
  await model.initialize();
})();


app.get('/', function (req, res) {
  var sequence = {
    quantizationInfo: {stepsPerQuarter: 4},
    notes: [],
    totalQuantizedSteps: 1
  };
  model.continueSequence(sequence, 64, 1, ["C", "Am", "F", "G"])
        .then((seq)=>{
          res.send(seq);
        });
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
