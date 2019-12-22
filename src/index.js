import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as mm from '@magenta/music';

class Meditator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  render(){

    // Number of steps to play each chord.
    const STEPS_PER_QUARTER = 2;
    const CHORDS_PER_BAR = 1/2;
    const STEPS_PER_CHORD = STEPS_PER_QUARTER * 4 / CHORDS_PER_BAR;


    // Number of times to repeat chord progression.
    const NUM_REPS = 1;
    const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    const init_model = async ({model}) => {
      return await model.initialize();
    }

    const sfUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
    const player = new mm.SoundFontPlayer(sfUrl);
    var playing;

    // Current chords being played.
    var currentChords = undefined;
    var seq;

    // Sample over chord progression.
    const generate = () => {
      console.log("generating");
      currentChords = ["C", "Am", "F", "G"];
      console.log(currentChords);
      const chords = currentChords;
      const STEPS_PER_PROG = chords.length * STEPS_PER_CHORD;

      // Prime with root note of the first chord.
      seq = {
        quantizationInfo: {stepsPerQuarter: STEPS_PER_QUARTER},
        notes: [],
        totalQuantizedSteps: 1
      };

      model.continueSequence(seq, ( NUM_REPS * STEPS_PER_PROG ) - 1, 1, chords)
        .then((contSeq) => {

          // Add the continuation to the original.
          contSeq.notes.forEach((note) => {
            note.quantizedStartStep += 1;
            note.quantizedEndStep += 1;
            note.instrument = 0;
            seq.notes.push(note);
          });


          for (var i=0; i<NUM_REPS; i++) {

            chords.forEach((chord, j)=>{
              // Add bass
              const root = mm.chords.ChordSymbols.root(chord);
              seq.notes.push({
                instrument: 1,
                program: 0,
                pitch: 36 + root,
                quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
              });

              // Add Chords
              mm.chords.ChordSymbols.pitches(chord).forEach((pitch, k)=>{
                seq.notes.push({
                  instrument: 2,
                  program: 0,
                  pitch: 48 + pitch,
                  quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                  quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD
                });
              })

            })

          }

          // Set total sequence length.
          seq.totalQuantizedSteps = STEPS_PER_PROG * NUM_REPS;
          console.log(seq);
          play();
        })
        console.log("done");

    }

    const playOnce = () => {
      if(seq){
        player.start(seq, 120).then(() => {
          playing = false;
        });
      }
    }

    const play = () => {
      playing = true;
      mm.Player.tone.context.resume();
      player.stop();
      playOnce();
    }

     model.initialize().then(generate);



    return   <div className="container">Nuestros hermanos Estadounidenses, Alemanes y Taiwaneses nos han hecho entrar
             en la era de la tecnología digital a tal punto que lo único que tenés que
             hacer es poner el dedo y apretar un botón...
             </div>
  }
}


ReactDOM.render(<Meditator/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
