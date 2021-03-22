// @ts-check

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserNameContext } from '../init';

import Channels from './Channels';
import Messages from './Messages';

const ChatBox = () => {
  const channels = useSelector(state => state.chat.channels);
  const currentChannelId = useSelector(state => state.chat.currentChannelId);
  const modalInfo = useSelector((state) => state.modal);
  const messages = useSelector(state => state.message.messages);
  const dispatch = useDispatch();

  return (
    <div className="row h-100 pb-3">
      <Channels
        channels={channels}
        currentChannelId={currentChannelId}
        modalInfo={modalInfo}
        dispatch={dispatch}
      />
      <UserNameContext.Consumer>
        {value => <Messages
          user={value}
          messages={messages}
          currentChannelId={currentChannelId}
        />}
       </UserNameContext.Consumer>
    </div>
  );
};

export default ChatBox;
