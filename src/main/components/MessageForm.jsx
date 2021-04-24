import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import locales from '../../locales/locales.js';
import { charactersLength } from '../../constants.js';
import useAuth from '../../validation/context/Auth.jsx';

const { messageMax } = charactersLength;

const handleSubmit = ({
  auth, currentChannelId, t,
}) => async (values, { setSubmitting, setErrors, resetForm }) => {
  const { socket, loggedIn: { user } } = auth;
  const message = { user, channelId: currentChannelId, text: values.message };
  setTimeout(() => {
    setSubmitting(true);
  }, 1);
  await socket.emit('newMessage', message, (r) => {
    if (r.status === 'ok') {
      return resetForm();
    }
    return setErrors({ message: t('errors.netError') });
  });
};

const Spinner = (name, t) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { t(name) }
  </>
);

const MessageForm = ({ currentChannelId }) => {
  const auth = useAuth();
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    message: Yup.string().trim()
      .max(messageMax)
      .required(''),
  });

  Yup.setLocale(locales);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema,
    onSubmit: handleSubmit({
      auth, currentChannelId, t,
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
            isInvalid={isError}
            ref={textInput}
            name="message"
            required
            value={formik.values.message}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            maxLength={400}
          />
          <Button
            variant="primary"
            type="submit"
            className="ml-2"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? Spinner('process.sending', t) : t('mainPage.send')}
          </Button>
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