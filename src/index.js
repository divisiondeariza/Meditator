import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import logo from './logo.svg';
import loop  from './improviser'
import Sketch from 'react-p5'

class Meditator extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    loop((note)=>{
      console.log(note.pitch)
    });
  }






  render(){
    function setup() {

    }

    function draw(p5) {
      p5.ellipse(60, 50, 80, 80);
    }

    return <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Musiquita relajante para vos.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gózalo;
                </a>
                <Sketch setup={(p5, canvasParentRef) => setup(p5, canvasParentRef)} draw={(p5) => draw(p5, this.props.notes)} />
              </header>
            </div>

      }
    }


ReactDOM.render(<Meditator/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
