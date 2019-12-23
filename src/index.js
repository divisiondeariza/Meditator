import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import logo from './logo.svg';
import loop  from './improviser'

class Meditator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {chords: []};
  }

  componentDidMount(){
    loop();
  }






  render(){


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
                    </header>
                  </div>

            }
          }


ReactDOM.render(<Meditator/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
