import * as mm from '@magenta/music';
import { sampler } from './samplers'
import Tone from 'tone'

const loop = (drawCallback)=>{

          // Number of steps to play each chord.
          const STEPS_PER_QUARTER = 2;
          const CHORDS_PER_BAR = 1/2;
          const STEPS_PER_CHORD = STEPS_PER_QUARTER * 4 / CHORDS_PER_BAR;
          const STEPS_PER_SECOND = Tone.Transport.bpm.value * STEPS_PER_QUARTER / 60;


          // Number of times to repeat chord progression.
          const NUM_REPS = 1;
          const model = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

          // Current chords being played.
          var chords = ["C", "Am", "F", "G"];
          const STEPS_PER_PROG = chords.length * STEPS_PER_CHORD;
          var seq = {
            quantizationInfo: {stepsPerQuarter: STEPS_PER_QUARTER},
            notes: [],
            totalQuantizedSteps: 1
          };

          const updateSeq = (contSeq) => {

                // Add the continuation to the original.
                console.log("updating");
                contSeq.notes.forEach((note) => {
                  //note.quantizedStartStep += seq.totalQuantizedSteps % STEPS_PER_PROG;
                  //note.quantizedEndStep += seq.totalQuantizedSteps % STEPS_PER_PROG;
                  note.quantizedStartStep += 1;
                  note.quantizedEndStep += 1;
                  note.instrument = 0;
                  //seq.notes.push(note);
                });


                for (var i=0; i<NUM_REPS; i++) {

                  chords.forEach((chord, j)=>{
                    // Add bass
                    const root = mm.chords.ChordSymbols.root(chord);
                    contSeq.notes.push({
                      pitch: 36 + root,
                      quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                      quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD,
                      instrument: 1
                    });

                    // Add Chords
                    mm.chords.ChordSymbols.pitches(chord).forEach((pitch, k)=>{
                      contSeq.notes.push({
                        pitch: 48 + pitch,
                        quantizedStartStep: i*STEPS_PER_PROG + j*STEPS_PER_CHORD,
                        quantizedEndStep: i*STEPS_PER_PROG + (j+1)*STEPS_PER_CHORD,
                        instrument: 2
                      });
                    })

                  })

                }

                // Set total sequence length.
                contSeq.totalQuantizedSteps = STEPS_PER_PROG;
                seq = contSeq;
              }


          // Sample over chord progression.
          const generate = () => {

            console.log("model start co generate")
            fetch('http://localhost:3001/')
                .then(response => response.json())
                .then(data => {
                  data.totalQuantizedSteps = parseInt(data.totalQuantizedSteps);
                  data.notes.forEach((note) =>{
                    note.quantizedStartStep = parseInt(note.quantizedStartStep);
                    note.quantizedEndStep = parseInt(note.quantizedEndStep);
                  })
                  updateSeq(data);
                });

            // const model_promise = new Promise((resolve, reject) => {
            //   model.continueSequence(seq, ( NUM_REPS * STEPS_PER_PROG ) - 1, 1, chords).then(updateSeq);
            // });
            //
            // model_promise.then(()=>{})


          }


          const playSeq = (time) =>{
            var currentStep = Math.floor( time * STEPS_PER_SECOND ) % STEPS_PER_PROG;

            if(!seq.notes || currentStep === 0){
              generate();
            }

            seq.notes.filter((note) => note.quantizedStartStep === currentStep)
                     .forEach((note) => {
                       Tone.Draw.schedule(() =>{
                         drawCallback(note);
                       }, time);
                       let freq = Tone.Frequency(note.pitch, 'midi');
                       let duration = (note.quantizedEndStep  - note.quantizedStartStep)  / STEPS_PER_SECOND;
                       sampler.triggerAttackRelease(freq, duration);
                     })
          }
          Tone.Transport.scheduleRepeat(playSeq, "8n");
          Tone.Transport.start();

          // model.initialize().then(()=>{
          //   // Tone.Transport.scheduleRepeat((time)=>{
          //   //   var anticipateGenerator = Tone.Draw.schedule(generate, time);
          //   //   anticipateGenerator.anticipation = 5;
          //   // }, STEPS_PER_PROG/STEPS_PER_SECOND);
          //
          //
          // });
}

export default loop;
