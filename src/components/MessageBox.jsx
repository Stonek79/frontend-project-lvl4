/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';
import { FormGroup, FormText } from 'react-bootstrap';
import Context from '../Context.jsx';
import MessageForm from './MessageForm.jsx';
import { getCurrentChannelId } from '../slices/channelSlice.js';
import { getMessages } from '../slices/messageSlice.js';

const Message = ({ user, text, id }) => (
  <FormText key={id} className="text-break">
    <b>{user}</b>
    {': '}
    {text}
  </FormText>
);

const MessageBox = () => {
  const currentChannelId = useSelector(getCurrentChannelId);
  const messages = useSelector(getMessages);
  const { user } = useContext(Context);
  const currentMessages = messages
    .filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    scroll.scrollToBottom({
      containerId: 'message-box', smooth: false, duration: 0,
    });
  }, [messages, currentChannelId]);

  return (
    <FormGroup className="col d-flex flex-column h-100">
      <FormGroup id="message-box" className="chat-messages overflow-auto mb-3">
        {currentMessages.map(Message)}
      </FormGroup>
      <MessageForm
        user={user}
        currentChannelId={currentChannelId}
      />
    </FormGroup>
  );
};

export default MessageBox;
