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

    return <div className="App">
            </div>

      }
    }


ReactDOM.render(<Meditator/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
