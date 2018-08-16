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

// const database = firebase.database();
// const user = database.ref('user');

class UserMessage extends React.Component {
  constructor(){
    super()
    this.state = { username: "", message: "", showComponent: false, selectedQuestionValue: ''}
  }

  // componentDidMount() {
  //   let firebaseAvatar;
  //   let firebaseUsername;
  //   let firebaseMessage;

  //   let promise1 = new Promise((resolve, reject) => {
  //     user.on('value', function(snapshot) {
  //       console.log('user value,', snapshot.val());
  //       firebaseAvatar = snapshot.val().avatar;
  //       resolve(firebaseAvatar);
  //     });
  //   });

  //   let promise2 = new Promise((resolve, reject) => {
  //     user.on('value', function(snapshot) {
  //       firebaseUsername = snapshot.val().username;
  //       resolve(firebaseUsername);
  //     });
  //   });

  //   let promise3 = new Promise((resolve, reject) => {
  //     user.on('value', function(snapshot) {
  //       firebaseMessage = snapshot.val().message;
  //       resolve(firebaseMessage);
  //     });
  //   });

  //   Promise.all([promise1, promise2, promise3]).then(values => {
  //     this.setState({avatar: values[0], username: values[1], message: values[2]})
  //     console.log(values);
  //   });

  //   setTimeout(() => {
  //     this.setState({showComponent: true});
  //   }, 3000)

  // }

  renderRadioWithLabel(qValue) {
    var isChecked = qValue.qid === Number(this.props.selectedQuestionValue);
    console.log('this.props.selectedQuestionValue,', this.props.selectedQuestionValue)
    console.log('setQuesValue function,', this.props.setQuesValue)
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
