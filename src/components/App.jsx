// @ts-check

import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Context from '../Context.js';
import Modals from './Modas.jsx';

import Channels from './Channels';
import Messages from './Messages';

const App = () => {
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const modalInfo = useSelector((state) => state.modals);
  const messages = useSelector((state) => state.messages.messages);
  const { user } = useContext(Context);
  const dispatch = useDispatch();
  const isPrimary = (id) => currentChannelId === id;

  return (
    <div className="row h-100 pb-3">
      <Channels
        channels={channels}
        isPrimary={isPrimary}
        dispatch={dispatch}
      />
      <Messages
        user={user}
        messages={messages}
        currentChannelId={currentChannelId}
      />
      <Modals
        modalInfo={modalInfo}
        dispatch={dispatch}
        channels={channels}
      />
    </div>
  );
};

export default App;
