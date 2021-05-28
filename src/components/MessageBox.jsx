/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';
import { FormGroup, FormText } from 'react-bootstrap';

import MessageForm from './MessageForm.jsx';
import { getMessages } from '../slices/messageSlice.js';

const Message = ({ user, text, id }) => (
  <FormText key={id} className="text-break">
    <b>{user}</b>
    {': '}
    {text}
  </FormText>
);

const MessageBox = () => {
  const messages = useSelector(getMessages);

  useEffect(() => {
    scroll.scrollToBottom({
      containerId: 'message-box', smooth: false, duration: 0,
    });
  }, [messages]);

  return (
    <FormGroup className="col h-100 border-left border-light">
      <FormGroup className="d-flex flex-column h-100">
        <FormGroup id="message-box" className="chat-messages overflow-auto mb-3">
          {messages.map(Message)}
        </FormGroup>
        <MessageForm />
      </FormGroup>
    </FormGroup>
  );
};

export default MessageBox;
