
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import routes from '../routes';
import axios from 'axios';
import { Button, Form, FormControl, FormGroup, FormText, InputGroup } from 'react-bootstrap';

const messageList = (messages, currentChannelId) => messages
  .filter((message) => message.channelId === currentChannelId)
  .map(({ user, text, id }) => <FormText key ={id} className="text-break"><b>{user}</b>: {text}</FormText>);

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
    const messageBox = document.getElementById('message-box');
    messageBox.scrollTo(0, messageBox.scrollHeight);
    textInput.current.focus();
  });

  return (
    <Form className="col h-100" onSubmit={formik.handleSubmit} >
      <FormGroup className="d-flex flex-column h-100">
        <FormGroup id="message-box" className="chat-messages overflow-auto mb-3">
          {messageList(messages, currentChannelId)}
          </FormGroup>
        <InputGroup noValidate className={'mt-auto'}>
          <FormControl
            className={`${formik.values.feedback.state}`}
            ref={textInput}
            name="body"
            required
            value={formik.values.body}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
          >
          </FormControl>
          <Button variant="primary" type="submit" style={{marginLeft: '8px'}} disabled={formik.isSubmitting}>Submit</Button>
        </InputGroup>
        <FormGroup className={'text-danger'}>{formik.values.feedback.message}</FormGroup>
      </FormGroup>
    </Form>
  )
};

export default Messages;