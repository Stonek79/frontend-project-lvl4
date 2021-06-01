/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';
import { Col, FormGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import MessageForm from './MessageForm.jsx';
import { getCurrentChannelMessages } from '../slices/messageSlice.js';
import { getCurrentChannel } from '../slices/channelSlice.js';

const Message = ({ user, text, id }) => (
  <div key={id} className="text-break mb-2">
    <b>{user}</b>
    {': '}
    {text}
  </div>
);

const MessageBox = () => {
  const { t } = useTranslation();
  const messages = useSelector(getCurrentChannelMessages);
  const currentChannel = useSelector(getCurrentChannel);

  const name = currentChannel && currentChannel.name;
  const messagesLength = messages.length;

  useEffect(() => {
    scroll.scrollToBottom({
      containerId: 'message-box', smooth: false, duration: 0,
    });
  }, [messages]);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div id="messageBox" className="mb-4 p-3 shadow-sm small">
          <p className="m-0">
            {'> '}
            <b>{name}</b>
          </p>
          <span className="text-muted">{t('counts.key', { count: messagesLength })}</span>
        </div>
        <FormGroup id="message-box" className="chat-messages overflow-auto px-5">
          {messages.map(Message)}
        </FormGroup>
        <MessageForm />
      </div>
    </Col>
  );
};

export default MessageBox;
