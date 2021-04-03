/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import cn from 'classnames';
import axios from 'axios';
import * as Yup from 'yup';
import { animateScroll as scroll } from 'react-scroll';

import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormText,
  InputGroup,
} from 'react-bootstrap';
import routes from '../routes';

const Message = ({ user, text, id }) => (
  <FormText key={id} className="text-break">
    <b>{user}</b>
    :
    {' '}
    {text}
  </FormText>
);

const generateSubmit = (name, channelId) => async (values, { setStatus, setErrors, resetForm }) => {
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
    setErrors({ body: 'Net error' });
  }
};

const Messages = ({ messages, currentChannelId, user }) => {
  const currentMessages = messages
    .filter((message) => message.channelId === currentChannelId);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: Yup.object({
      body: Yup.string()
        .max(400, 'Must be 400 characters or less')
        .required(),
    }),
    onSubmit: generateSubmit(user, currentChannelId),
  });

  const inputClassName = cn({ 'is-invalid': formik.errors.body === 'Net error' });
  const feedbackClassName = cn({
    'text-danger': formik.errors.body === 'Net error',
    'text-info': formik.errors.body !== 'Net error',
  });

  const textInput = useRef(null);
  useEffect(() => {
    scroll.scrollToBottom({
      containerId: 'message-box', smooth: false,
    });
    textInput.current.focus();
  });

  return (
    <Form className="col h-100" onSubmit={formik.handleSubmit}>
      <FormGroup className="d-flex flex-column h-100">
        <FormGroup id="message-box" className="chat-messages overflow-auto mb-3">
          {currentMessages.map(Message)}
        </FormGroup>
        <InputGroup noValidate className="mt-auto">
          <FormControl
            className={inputClassName}
            ref={textInput}
            name="body"
            required
            value={formik.values.body}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            placeholder="Add message: max length 400 characters"
            maxLength={401}
          />
          <Button
            variant="primary"
            type="submit"
            style={{ marginLeft: '8px' }}
            disabled={
              formik.isSubmitting
              || !formik.values.body.trim()
              || (formik.errors.body && formik.errors.body !== 'Net error')
            }
          >
            {formik.status === 'Sending...'
              ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  Sending...
                </>
              )
              : 'Send message'}
          </Button>
        </InputGroup>
        <FormGroup className={feedbackClassName}>{formik.errors.body}</FormGroup>
      </FormGroup>
    </Form>
  );
};

export default Messages;
