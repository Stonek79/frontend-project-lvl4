/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';
import axios from 'axios';
import { FormGroup, FormText } from 'react-bootstrap';
import routes from '../routes';
import Context from '../Context.js';
import MessageForm from './MessageForm.jsx';

const handleSubmit = (name, channelId) => async (values, { setStatus, setErrors, resetForm }) => {
  const { channelMessagesPath } = routes;
  const message = { user: name, text: values.body };
  try {
    setStatus('Sending...');
    await axios.post(channelMessagesPath(channelId), {
      data: {
        channelId,
        attributes: message,
      },
    });
    setStatus('done');
    resetForm();
  } catch (err) {
    console.log(err);
    setStatus('done');
    setErrors({ body: 'Network error' });
  }
};

const Message = ({ user, text, id }) => (
  <FormText key={id} className="text-break">
    <b>{user}</b>
    {': '}
    {text}
  </FormText>
);

const MessageBox = () => {
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector((state) => state.messages.messages);
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
        handleSubmit={handleSubmit}
      />
    </FormGroup>
  );
};

export default MessageBox;
