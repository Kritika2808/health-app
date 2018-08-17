import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col } from 'react-grid-system';
import UserMessage from './houses/User Message.js';
import ChatBotMessage from './houses/Chat Bot Message.js';
import * as firebase from "firebase";
import update from 'immutability-helper';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const database = firebase.database();
const chatMessages = database.ref('chat-messages');

class SlackChannel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chatMessageVal: '',
      chatBlocksArr:[]
    }
    this.setQuestionVal = this.setQuestionVal.bind(this);
    this.findNextChatMessage = this.findNextChatMessage.bind(this);
  }

  componentDidMount() {
    let chatMessageVal;
    chatMessages.on('value', (chatMessageValues) => {
      // chatMessageVal = chatMessageValues.val();
      // console.log('chat messages,', chatMessageVal)
      chatMessageVal = {
        qid: 0,
        childQuestions: [
          {
            qid: 1,
            selectedQuesTitle: 'Did you track shipment package number?',
            possibleValues: [
              {
                qid: 1.1,
                qval: 'Yes',
              },
              {
                qid: 1.2,
                qval: 'No',
              },
            ],
            selectedQuestionValue: {
              qid: 1.2,
              qval: 'No',
            },
            childQuestions: [
              {
                qid: 1.2,
                selectedQuesTitle: 'We\'ll track the ID and share status via email in 24h. Does that answer your question?',
                possibleValues: [
                  {
                    qid: 1.21,
                    qval: 'Yes',
                  },
                  {
                    qid: 1.22,
                    qval: 'No',
                  },
                ],
                selectedQuestionValue: {
                  qid: 1.21,
                  qval: 'Yes',
                },
                childQuestions: []
              }
            ]
          },
          {
            qid: 3,
            selectedQuesTitle: 'Did you enter bank details for refund?',
            possibleValues: [
              {
                qid: 3.1,
                qval: 'Yes',
              },
              {
                qid: 3.2,
                qval: 'No',
              },
            ],
            selectedQuestionValue: {
              qid: 3.1,
              qval: 'Yes',
            },
            childQuestions: []
          }
        ],
        selectedQuesTitle: "Chat box begins here. Type base query",
        possibleValues: [
          {
            qid: 1,
            qval: 'Problem tracking order',
          },
          {
            qid: 2,
            qval: 'Package return',
          },
          {
            qid: 3,
            qval: 'Problem with refund',
          }
        ],
        selectedQuestionValue: '',
      }
      this.setState({chatMessageVal: chatMessageVal, chatBlocksArr: [chatMessageVal]})
    })
    // let firebaseAvatar;
    // let firebaseUsername;
    // let firebaseMessage;
    // let firebaseArticle;

    // let promise1 = new Promise((resolve, reject) => {
    //   bot.on('value', function(snapshot) {
    //     firebaseAvatar = snapshot.val().avatar;
    //     resolve(firebaseAvatar);
    //   });
    // });

    // let promise2 = new Promise((resolve, reject) => {
    //   bot.on('value', function(snapshot) {
    //     firebaseUsername = snapshot.val().username;
    //     resolve(firebaseUsername);
    //   });
    // });

    // let promise3 = new Promise((resolve, reject) => {
    //   bot.on('value', function(snapshot) {
    //     firebaseMessage = snapshot.val().message;
    //     resolve(firebaseMessage);
    //   });
    // });

    // let promise4 = new Promise((resolve, reject) => {
    //   bot.on('value', function(snapshot) {
    //     firebaseArticle = snapshot.val().article;
    //     resolve(firebaseArticle);
    //   });
    // });

    // Promise.all([promise1, promise2, promise3, promise4]).then(values => {
    //   this.setState({avatar: values[0], username: values[1], message: values[2], article: values[3]})
    //   console.log(values);
    // });

    // setTimeout(() => {
    //   this.setState({showComponent: true});
    // }, 1500)
  }

  setQuestionVal(event, questionId) {
    console.log('hey I am clicked')
    console.log(event);
    console.log(questionId);
    if(questionId === 0 && event.target && event.target.value) { // that means parent level
      const newCopy = Object.assign({}, this.state.chatMessageVal);
      newCopy.selectedQuestionValue = event.target.value; // selectedQuestionId
      // this.setState({ filterStatus: [...this.state.filterStatus, newStatus] })

      const nextChatMessage = this.findNextChatMessage(event.target.value, questionId)
      return this.setState({
        chatMessageVal: newCopy,
        chatBlocksArr: [...this.state.chatBlocksArr, nextChatMessage]
      });
    } else {

    }
  };

  findNextChatMessage(selectedQuestionId, parentQuestionId) {
    console.log('findNextChatMessage is called');
    let selectedChatMsg;
    this.state.chatMessageVal.childQuestions.map((childQuestion) => {
      if ((this.state.chatMessageVal.qid === Number(parentQuestionId)) && childQuestion.qid === Number(selectedQuestionId)) {
        console.log('true')
        selectedChatMsg = childQuestion;
      }
    })
    console.log('selectedChatMsg,', selectedChatMsg)
    return selectedChatMsg;
  }

  render() {
    //Boolean flag passed down for deciding what to render
    // const messages = this.props.messages;
    return (
      <Col lg={12}>
        {/* <img className="slack-channel" src="./images/Slack Channel.svg"/> */}
        {this.state.chatBlocksArr.length ? (
          //render messages is true (demo)
          this.state.chatBlocksArr.map((chatBlock) => {
            return (
              // <ReactCSSTransitionGroup
              //   transitionName="example"
              //   transitionAppear={true}
              //   transitionAppearTimeout={3000}
              //   transitionEnterTimeout={3000}
              //   transitionLeaveTimeout={300}>
                <div style={{overflow: 'hidden'}}>
                  <ChatBotMessage username="Bot" qTitle={chatBlock.selectedQuesTitle} qId={chatBlock.qid}/>
                  <ReactCSSTransitionGroup
                    transitionName="user-message"
                    transitionAppear={true}
                    transitionAppearTimeout={2000}
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={200}>
                    <UserMessage username="Kritika" qId={chatBlock.qid} qValues={chatBlock.possibleValues}
                      setQuesValue={this.setQuestionVal} selectedQuestionValue={chatBlock.selectedQuestionValue}/>
                  </ReactCSSTransitionGroup>
                </div>
              // </ReactCSSTransitionGroup>
            );
          })
        ) : (
          //render nothing messages is false (landing page)
          <div></div>
        )}
      </Col>
    )
  }
}

module.exports = SlackChannel;
