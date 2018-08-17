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
            selectedQuestionValue: '',
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
                selectedQuestionValue: '',
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
            selectedQuestionValue: '',
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
  }

  setQuestionVal(event, questionId) {
    console.log('hey I am clicked')
    console.log('event.target.value,', event.target.value);
    console.log('parent question id,', questionId);
    const newCopy = Object.assign({}, this.state.chatMessageVal);
    if(questionId === 0 && event.target && event.target.value) { // that means parent level
      
      newCopy.selectedQuestionValue = event.target.value; // selectedQuestionId

      const nextChatMessage = this.findNextChatMessage(event.target.value, questionId);
      console.log('new copy is---,', newCopy)
      const updatedChatMsgArr = this.createChatArr(newCopy);
      return this.setState({
        chatMessageVal: newCopy,
        chatBlocksArr: [...this.state.chatBlocksArr, nextChatMessage]
      });
    } else if(event.target && event.target.value) { // that means not a root element
      // set selected value in a child question
      if(newCopy.childQuestions.length) {
        
        // newCopy.childQuestions.map((childQuestion) => {
        //   if(newCopy.qid === Number(questionId) && childQuestion.qid === event.target.value) {
        //     newCopy.selectedQuestionValue = event.target.value;
        //   }
        // })
      }
    }
  };

  setSelectedValueInChildQues(parentObj, selectedQuestionId, parentQuestionId) {
    var quesSelected = false;
    parentObj.childQuestions.every((childQuestion) => {
      if(parentObj.qid === Number(parentQuestionId) && childQuestion.qid === selectedQuestionId) {
        parentObj.selectedQuestionValue = selectedQuestionId;
        return false;
      }
      if (childQuestion.childQuestions.length) {
        const setChildObj = this.setSelectedValueInChildQues(childQuestion, selectedQuestionId, parentQuestionId);
        childQuestion = setChildObj;
      }
    })
    return parentObj;
  }
  // arr.every((item) => {
  //   if(item.a == 1 || item.a == 3) {
  //     item.a--;
  //     return true;
  //   } else {
  //     item.a++;
  //     return false;
  //   }
  // })

  createChatArr(updatedChatMsgObj) {
    const chatArr = [updatedChatMsgObj]; // for root questions
    updatedChatMsgObj.childQuestions.map((childQuestion) => {

    })
  }

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
            console.log('chatBlock,', chatBlock)
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
