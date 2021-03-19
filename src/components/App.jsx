// @ts-check

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Channels from './Channels';
import Messages from './Messages';

const ChatBox = () => {
  const channels = useSelector(state => state.chat.channels);
  const currentChannelId = useSelector(state => state.chat.currentChannelId);
  const modalInfo = useSelector((state) => state.modal);
  const messages = useSelector(state => state.chat.messages);
  const dispatch = useDispatch();

  return (
    <div className="row h-100 pb-3">
      <Channels
        channels={channels}
        currentChannelId={currentChannelId}
        modalInfo={modalInfo}
        dispatch={dispatch}
      />
      <Messages
        messages={messages}
        currentChannelId={currentChannelId}
        dispatch={dispatch}
       />
    </div>
  );
};

export default ChatBox;
