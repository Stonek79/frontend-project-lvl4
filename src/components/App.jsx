// @ts-check

import React, { useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import cn from 'classnames';
import * as actions from '../reducers';

const Channels = () => {
  const channels = useSelector(state => state.toolkit.channels);
  const currentChannelId = useSelector(state => state.toolkit.currentChannelId);
  const dispatch = useDispatch();

  const btnClass = (id) => {
    return cn('nav-link btn-block mb-2 text-left btn', {
      'btn-primary': currentChannelId === id,
      'btn-light': currentChannelId !== id,
    })
  };

  const switchChannelHandler = (id) => useCallback(() => {
    dispatch(actions.addChannelId(id));
  }, [currentChannelId]);

  const addChannelHandler = () => {
    console.log('Need make handler');
  };

  const channelsButtoms = channels.map(({ id, name }) => <li className="nav-item" key={id}>
        <button type="button" className={btnClass(id)} onClick={switchChannelHandler(id)}>{name}</button>
    </li>);

  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <button type="button" className="ml-auto p-0 btn btn-link" onClick={addChannelHandler}>+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channelsButtoms}
      </ul>
    </div>
  );
};

const Messages = () => {
  const messages = useSelector(state => state.toolkit.messages);

  const handleUpdateChatText = () => {
    console.log('Need chat text handler');
  };

  const addMessageHandler = (e) => {
      e.preventDefault();
    console.log('Need add message handler');
  };

  const messageList = messages.map(({ user, text, id }) => <div key ={id} className="text-break"><b>{user}</b>`: ${text}`</div>);
  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {messageList}
          </div>
        <div className="mt-auto">
          <form className="" onSubmit={addMessageHandler} >
            <div className="form-group">
              <div className="input-group">
                <input name="body" aria-label="body" className="mr-2 form-control" value="" onChange={handleUpdateChatText} />
                <button aria-label="submit" type="submit" className="btn btn-primary">Submit</button>
                <div className="d-block invalid-feedback">&nbsp;</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

const ChatBox = () => {
  return (
    <div className="row h-100 pb-3">
      <Channels />
      <Messages />
    </div>
  );
};

export default ChatBox;
