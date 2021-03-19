
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import routes from '../routes';
import axios from 'axios';
import user from '../Cookie';

const messageList = (messages, currentChannelId) => messages
  .filter((message) => message.channelId === currentChannelId)
  .map(({ user, text, id }) => <div key ={id} className="text-break"><b>{user}</b>: {text}</div>);

const Messages = ({ messages, currentChannelId }) => {

  const generateSubmit = (user, channelId) => async (value) => {
    const { channelPath } = routes;
    const message = { user, text: value.body };
  
    await axios.post(channelPath(channelId) + '/messages', {
      data: {
        channelId,
        attributes: message,
      },
    });
  
    formik.resetForm();
  };

  const formik = useFormik({ initialValues: { body: '' }, onSubmit: generateSubmit(user, currentChannelId) });

  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.focus();
  });

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {messageList(messages, currentChannelId)}
          </div>
        <div className="mt-auto">
          <form className="" onSubmit={formik.handleSubmit} >
            <div className="form-group">
              <div className="input-group">
                <input
                  className="mr-2 form-control"
                  aria-label="body"
                  ref={textInput}
                  name="body"
                  required
                  value={formik.values.body}
                  onChange={formik.handleChange}
                />
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

export default Messages;