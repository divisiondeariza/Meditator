import * as mm from '@magenta/music';
import {sampler, echoedSampler, bassSampler, bassLowSampler} from './samplers'
import Tone from 'tone'

const loop = ()=>{

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
          var chords = ["C", "Am", "F", "G"];
          const STEPS_PER_PROG = chords.length * STEPS_PER_CHORD;
          var seq;

          const updateSeq = (contSeq) => {

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
                console.log(Tone.Transport.bpm.value);
                Tone.Transport.start();
                // play();
              }


          // Sample over chord progression.
          const generate = () => {

            // Prime with root note of the first chord.
            seq = {
              quantizationInfo: {stepsPerQuarter: STEPS_PER_QUARTER},
              notes: [],
              totalQuantizedSteps: 1
            };

            model.continueSequence(seq, ( NUM_REPS * STEPS_PER_PROG ) - 1, 1, chords)
              .then(updateSeq)
          }


          const playSeq = (time) =>{
            var stepsPerCycle = STEPS_PER_CHORD * chords.length;
            var stepsPerSecond = Tone.Transport.bpm.value * STEPS_PER_QUARTER / 60;
            var currentStep = Math.floor( time * stepsPerSecond ) % stepsPerCycle;
            seq.notes.filter((note) => note.quantizedStartStep == currentStep)
                     .forEach((note) => {
                       let freq = Tone.Frequency(note.pitch, 'midi');
                       let duration = (note.quantizedEndStep  - note.quantizedStartStep)  / stepsPerSecond;
                       sampler.triggerAttackRelease(freq, duration);
                     })
            console.log(currentStep);
          }

          Tone.Transport.scheduleRepeat(playSeq, "8n");

          model.initialize().then(generate);
}

export default loop;
