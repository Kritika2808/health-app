import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from "firebase";

const config = {
  apiKey: 'AIzaSyDxw7f1DmNWJHvHDRkOwzFmRpQg7Dp29Gw',
  authDomain: 'my-health-app-75970.firebaseapp.com',
  databaseURL: 'https://my-health-app-75970.firebaseio.com/',
  projectId: 'my-health-app-75970',
  storageBucket: 'my-health-app-75970.appspot.com',
  messagingSenderId: '194985212288',
};

firebase.initializeApp(config);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// const database = firebase.database();
// const user = database.ref('user');

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  // socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

class UserMessage extends React.Component {
  constructor(){
    super()
    this.state = { username: "", message: "", showComponent: false, selectedQuestionValue: ''}
  }

  renderRadioWithLabel(qValue) {
    var isChecked = qValue.qid === Number(this.props.selectedQuestionValue);
    console.log('this.props.selectedQuestionValue,', this.props.selectedQuestionValue)
    console.log('this.props.qId,', this.props.qId);
    return (
      <div style={{textAlign: 'left'}}>
        <label key={qValue.qval} htmlFor={qValue.id}>
          <input className="message" id={qValue.qid} type="radio" value={qValue.qid} checked={isChecked} onClick={(e) => this.props.setQuesValue(e, this.props.qId)}/>
          {qValue.qval}
        </label>
      </div>
    );
  }

  componentDidMount() {
    this.props.qValues.map((qValue) => {
      this.props.synthVoice(qValue.qval); // coming twice, check later
    })
    recognition.start();
  }

  render() {
    // const showComponent = this.state.showComponent;
    const showComponent = true;
    console.log('qValues,', this.props.qValues);
    return (
      <div>
        {showComponent ? (
          //render component
          <div className="user-message">
            {/* <div style={{background: this.state.avatar}} className="user-avatar"></div> */}
            <div className="username">{this.props.username}</div>
            <div style={{float: 'right'}}>
            {
              this.props.qValues && this.props.qValues.map((qValue) => {
              console.log('qval value,', qValue)
              return (
                this.renderRadioWithLabel(qValue)
              )
            })
            }
            </div>
          </div>
        ) : (
          //render nothing
          <div></div>
        )}
      </div>
    )
  }
}

module.exports = UserMessage;
