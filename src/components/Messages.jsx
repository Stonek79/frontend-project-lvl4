
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import routes from '../routes';
import axios from 'axios';

const messageList = (messages, currentChannelId) => messages
  .filter((message) => message.channelId === currentChannelId)
  .map(({ user, text, id }) => <div key ={id} className="text-break"><b>{user}</b>: {text}</div>);

const Messages = ({ messages, currentChannelId, user }) => {

  const generateSubmit = (user, channelId) => async (value) => {
    const { channelMessagesPath } = routes;
    const message = { user, text: value.body };
  
    try {
      await axios.post(channelMessagesPath(channelId), {
        data: {
          channelId,
          attributes: message,
        },
      });
      formik.resetForm();
    } catch (err) {
      formik.values.feedback = { state: 'is-invalid', message: err.message };
    }
  };

  const formik = useFormik({
    initialValues: {
      body: '',
      feedback: {
        state: '',
        message: '',
      },
    },
      onSubmit: generateSubmit(user, currentChannelId)
    });

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
                  className={`mr-2 form-control ${formik.values.feedback.state}`}
                  ref={textInput}
                  name="body"
                  required
                  value={formik.values.body}
                  onChange={formik.handleChange}
                />
                <button aria-label="submit" type="submit" className="btn btn-primary">Submit</button>
                <div className="d-block invalid-feedback">{formik.values.feedback.message}</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Messages;