import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FormControl, FormGroup, InputGroup,
} from 'react-bootstrap';

import { itemsLength } from '../constants.js';
import AppContext from '../context/AppContext.jsx';

const { messageMax } = itemsLength;

const handleSubmit = ({
  currentChannelId,
  getAuthHeader,
  socket,
  t,
}) => (
  values,
  { setErrors, setSubmitting, resetForm },
) => {
  const { username } = getAuthHeader();
  const message = {
    user: username,
    channelId: currentChannelId,
    text: values.message,
  };

  if (socket.connected === false) {
    setSubmitting(false);
    setErrors({ message: t('errors.netError') });
    return;
  }

  const timerId = setTimeout(() => {
    setSubmitting(false);
    setErrors({ message: t('errors.netError') });
  }, 3000);
  socket.emit('newMessage', message, (r) => {
    if (r.status === 'ok') {
      clearTimeout(timerId);
      resetForm();
    }
  });
};

const validationSchema = Yup.object({
  message: Yup.string().trim()
    .max(messageMax)
    .required(''),
});

const Spinner = (name, t) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { t(name) }
  </>
);

const MessageForm = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const { getAuthHeader, socket } = useContext(AppContext);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    status: false,
    validationSchema,
    onSubmit: handleSubmit({
      getAuthHeader, currentChannelId, socket, t,
    }),
  });

  const isError = formik.errors.message === t('errors.netError');

  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.focus();
  });

  return (
    <FormGroup className="mt-auto">
      <Form onSubmit={formik.handleSubmit}>
        <InputGroup>
          <FormControl
            ref={textInput}
            name="message"
            data-testid="new-message"
            required
            maxLength={400}
            value={formik.values.message}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            isInvalid={isError}
          />
          {/* <Button
            type="submit"
            variant="primary"
            className="ml-2"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? Spinner('process.sending', t) : t('mainPage.send')}
          </Button> */}
        </InputGroup>
        <FormGroup
          className={isError ? 'text-danger' : 'text-info'}
        >
          {formik.errors.message}
        </FormGroup>
      </Form>
    </FormGroup>
  );
};
export default MessageForm;
