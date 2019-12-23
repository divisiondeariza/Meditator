import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import logo from './logo.svg';
import loop  from './improviser'
import Sketch from 'react-p5'
import PenroseLSystem from './penrose'

class Meditator extends React.Component {
  constructor(props) {
    super(props);
    this.notes = [];
  }

  componentDidMount(){
    loop((note)=>{
      this.notes.push(note);
    });
  }


  render(){
    var WIDTH = 192*5;
    var HEIGHT = 108*5;

    function setup(p5, canvasParentRef) {
      p5.createCanvas(WIDTH , HEIGHT).parent(canvasParentRef);
      p5.fill(0);
      p5.noStroke();
    }

    var snowflakes = [];

    // snowflake class
    function snowflake(p5, snowflakes) {
      // initialize coordinates
      this.posX = 0;
      this.posY = p5.random(-50, 0);
      this.initialangle = p5.random(0, 2 * p5.PI);
      this.size = p5.random(10, 20);

      // radius of snowflake spiral
      // chosen so the snowflakes are uniformly spread out in area
      this.radius = p5.sqrt(p5.random(p5.pow(p5.width / 2, 2)));

      this.update = function(time) {
        // x position follows a circle
        let w = 0.6; // angular speed
        let angle = w * time + this.initialangle;
        this.posX = p5.width / 2 + this.radius * p5.sin(angle);

        // different size snowflakes fall at slightly different y speeds
        this.posY += p5.pow(this.size, 0.5);

        // delete snowflake if past end of screen
        if (this.posY > p5.height) {
          let index = snowflakes.indexOf(this);
          snowflakes.splice(index, 1);
        }
      };

      this.display = function() {
        p5.ellipse(this.posX, this.posY, this.size);
      };
    }


    return <div className="App">
              <header className="App-header">
                <Sketch
                setup={(p5, canvasParentRef) => {
                  setup(p5, canvasParentRef)
                  this.setState({ds: new PenroseLSystem(p5)});
                  //please, play around with the following line
                  //this.state.ds.simulate(5);
                }}
                 draw={(p5) => {
                   p5.background('black');
                   let t = p5.frameCount / 60; // update time


                   //create a random number of snowflakes each frame
                   this.notes.forEach((note)=>{
                     let from = p5.color(0, 255, 0);
                     let to = p5.color(0, 0, 255);
                     var color = p5.lerpColor(from, to, (note.pitch - 36)/(96 - 36)); // organ notes
                     p5.fill(color);
                       for (let i = 0; i < p5.random(5); i++) {
                         // this.setState({snowflake: [...this.state.snowflakes, new snowflake(p5)]})
                         snowflakes.push(new snowflake(p5, snowflakes)); // append snowflake object
                       }
                   });

                   this.notes = [];

                   // if(this.state.notes){
                   //      this.state.notes.forEach(note){
                   //
                   //      }
                   //    }

                   // loop through snowflakes with a for..of loop
                   for (let flake of snowflakes) {
                     flake.update(t); // update snowflake position
                     flake.display(); // draw snowflake
                   }
                }} />
              </header>
            </div>

      }
    }


ReactDOM.render(<Meditator/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
