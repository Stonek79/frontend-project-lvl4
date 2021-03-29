/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import cn from 'classnames';
import axios from 'axios';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormText,
  InputGroup,
} from 'react-bootstrap';
import routes from '../routes';

const messageList = ({ user, text, id }) => (
  <FormText key={id} className="text-break">
    <b>{user}</b>
    :
    {' '}
    {text}
  </FormText>
);

const generateSubmit = (name, channelId) => async (values, { setStatus, resetForm }) => {
  const { channelMessagesPath } = routes;
  const message = { user: name, text: values.body };

  try {
    await axios.post(channelMessagesPath(channelId), {
      data: {
        channelId,
        attributes: message,
      },
    });
    resetForm();
  } catch (err) {
    setStatus(err.message);
  }
};

const Messages = ({ messages, currentChannelId, user }) => {
  const currentMessages = messages
    .filter((message) => message.channelId === currentChannelId);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: generateSubmit(user, currentChannelId),
  });

  const className = cn({ 'is-invalid': formik.status });
  const textInput = useRef(null);
  useEffect(() => {
    const messageBox = document.getElementById('message-box');
    messageBox.scrollTo(0, messageBox.scrollHeight);
    textInput.current.focus();
  });

  return (
    <Form className="col h-100" onSubmit={formik.handleSubmit}>
      <FormGroup className="d-flex flex-column h-100">
        <FormGroup id="message-box" className="chat-messages overflow-auto mb-3">
          {currentMessages.map(messageList)}
        </FormGroup>
        <InputGroup noValidate className="mt-auto">
          <FormControl
            className={className}
            ref={textInput}
            name="body"
            required
            value={formik.values.body}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            maxLength={1000}
          />
          <Button variant="primary" type="submit" style={{ marginLeft: '8px' }} disabled={formik.isSubmitting}>Submit</Button>
        </InputGroup>
        <FormGroup className="text-danger">{formik.status}</FormGroup>
      </FormGroup>
    </Form>
  );
};

export default Messages;
