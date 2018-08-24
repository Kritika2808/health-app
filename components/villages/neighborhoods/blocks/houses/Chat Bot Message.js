import React from 'react';
import ReactDOM from 'react-dom';
// import * as firebase from "firebase";

// const database = firebase.database();
// const bot = database.ref('bot');

class ChatBotMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {avatar: "", username: "", message: "", article: "", showComponent: false}
  }

  componentDidMount() {
    this.props.synthVoice(this.props.qTitle)
    // this.props.synthVoice(this.props.qTitle).then(() => {
    //   console.log('bot called');
    // }); // coming twice, check later
  }

  render() {
    // const showComponent = this.state.showComponent;
    const showComponent = true;
    // this.props.synthVoice(this.props.qTitle);
    return (
      <div>
        {showComponent ? (
          //render component
          <div className="bot-message">
          {/* <div> */}
            {/* <div style={{background: this.state.avatar}} className="bot-avatar"></div> */}
            <div className="username">{this.props.username}</div>
            <div className="message">{this.props.qTitle}</div>
            {/* <a href={this.state.article}>
              <span className="article">{this.state.article}</span>
            </a> */}
          </div>
        ) : (
          //render nothing
          <div></div>
        )}
      </div>
    )
  }
}

module.exports = ChatBotMessage;
