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
    this.state = {notes: [], ds: null}
  }

  componentDidMount(){
    loop((note)=>{
      console.log(note);
      this.setState({notes: [...this.state.notes, note]})
    });
  }






  render(){
    var WIDTH = 1920;
    var HEIGHT = 1080;

    function setup(p5, canvasParentRef) {
      p5.createCanvas(WIDTH , HEIGHT).parent(canvasParentRef);
      p5.fill(40, 200, 40);
    }

    function draw(p5, notes) {
      // notes.forEach((note)=>{
      //   var y = Math.ceil(Math.random() * HEIGHT);
      //   var x = Math.ceil(Math.random() * WIDTH);
      //   let from = p5.color(255, 255, 0);
      //   let to = p5.color(0, 255, 255);
      //   var color = p5.lerpColor(from, to, (note.pitch - 36)/(96 - 36)); // organ notes
      //   p5.fill(color);
      //   p5.ellipse(x, y, 80, 80);
      // });
    }

    return <div className="App">
              <header className="App-header">
                <Sketch
                setup={(p5, canvasParentRef) => {
                  setup(p5, canvasParentRef)
                  this.setState({ds: new PenroseLSystem(p5)});
                  //please, play around with the following line
                  this.state.ds.simulate(5);
                }}
                 draw={(p5) => {
                  draw(p5, this.state.notes);
                  this.setState({notes: []});
                  if(this.state.ds){
                    this.state.ds.render();
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
