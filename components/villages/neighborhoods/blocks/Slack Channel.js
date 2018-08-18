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
  }

  componentDidMount() {
    let chatMessageVal;
    chatMessages.on('value', (chatMessageValues) => {
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
                qid: 1.1,
                selectedQuesTitle: 'We\'ll track the ID and share status via email in 24h. Does that answer your question?',
                possibleValues: [
                  {
                    qid: 1.11,
                    qval: 'Yeap',
                  },
                  {
                    qid: 1.12,
                    qval: 'Nah',
                  },
                ],
                selectedQuestionValue: '',
                childQuestions: [{
                  qid: 1.11,
                  selectedQuesTitle: 'Cool the result is 1.11!!',
                    possibleValues: [
                      
                    ],
                    selectedQuestionValue: '',
                    childQuestions: []
                },
                {
                  qid: 1.12,
                  selectedQuesTitle: 'Cool the result is 1.12!!',
                    possibleValues: [
                      
                    ],
                    selectedQuestionValue: '',
                    childQuestions: []
                }]
              },
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
                childQuestions: [{
                  qid: 1.21,
                  selectedQuesTitle: 'Cool the result is 1.21!!',
                    possibleValues: [
                      
                    ],
                    selectedQuestionValue: '',
                    childQuestions: []
                },{
                  qid: 1.22,
                  selectedQuesTitle: 'Cool the result is 1.22!!',
                    possibleValues: [
                      
                    ],
                    selectedQuestionValue: '',
                    childQuestions: []
                }]
              }
            ]
          },
          {
            qid: 3,
            selectedQuesTitle: 'Did you enter bank details for refund?',
            possibleValues: [
              {
                qid: 3.1,
                qval: 'Yayy',
              },
              {
                qid: 3.2,
                qval: 'Nayyy',
              },
            ],
            selectedQuestionValue: '',
            childQuestions: [{
              qid: 3.1,
              selectedQuesTitle: 'Cool the result is 3.1!!',
                possibleValues: [
                  
                ],
                selectedQuestionValue: '',
                childQuestions: []
            },
            {
              qid: 3.2,
              selectedQuesTitle: 'Cool the result is 3.2!!',
                possibleValues: [
                  
                ],
                selectedQuestionValue: '',
                childQuestions: []
            }]
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
    } else if(event.target && event.target.value) { // that means not a root element
      // set selected value in a child question
      if(newCopy.childQuestions.length) {
        this.setSelectedValueInChildQues(newCopy, event.target.value, questionId)
      }
    }
      const chatArr = [newCopy]; // for root question
      const updatedChatMsgArr = this.createChatArr(chatArr, newCopy);
      return this.setState({
        chatMessageVal: newCopy,
        chatBlocksArr: updatedChatMsgArr
      });
  };

  setSelectedValueInChildQues(parentObj, selectedQuestionId, parentQuestionId) {
    console.log('parent obj before setting value in setSelectedValueInChildQues,', parentObj);
    parentObj.childQuestions.every((childQuestion) => {
      if(parentObj.qid === Number(parentQuestionId) && childQuestion.qid === Number(selectedQuestionId)) {
        console.log('matched child question');
        parentObj.selectedQuestionValue = selectedQuestionId;
        return false;
      }
      if (childQuestion.childQuestions.length) {
        this.setSelectedValueInChildQues(childQuestion, selectedQuestionId, parentQuestionId);
      }
      return true;
    })
    console.log('parent obj after setting value in setSelectedValueInChildQues,', parentObj);
  }
 
  createChatArr(chatArray, updatedChatMsgObj) {
    let chatArr = chatArray;
    if(updatedChatMsgObj.childQuestions.length) {
      updatedChatMsgObj.childQuestions.every((childQuestion) => {
        console.log('child question ids,', childQuestion.qid);
        if(Number(updatedChatMsgObj.selectedQuestionValue) === Number(childQuestion.qid)) {
          console.log('yayyyyy');
          chatArr.push(childQuestion);
          if (childQuestion.childQuestions.length) {
            chatArr = this.createChatArr(chatArr, childQuestion); 
          }
          return false;
        }
        return true;
      })
    }
    return chatArr;
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
                  { chatBlock.possibleValues.length ? 
                  <ReactCSSTransitionGroup
                    transitionName="user-message"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    <UserMessage username="Kritika" qId={chatBlock.qid} qValues={chatBlock.possibleValues}
                      setQuesValue={this.setQuestionVal} selectedQuestionValue={chatBlock.selectedQuestionValue}/>
                  </ReactCSSTransitionGroup> : null }
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
