import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FormControl, FormGroup, InputGroup,
} from 'react-bootstrap';

import { itemsLength } from '../constants.js';
import ApiContext from '../context/ApiContext.jsx';
import AuthContext from '../context/AuthContext.jsx';

const { messageMax } = itemsLength;

const Spinner = (name) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { name }
  </>
);

const MessageForm = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const { sendMessage } = useContext(ApiContext);
  const { user } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: { message: '' },
    status: false,
    validationSchema: Yup.object({
      message: Yup.string().trim()
        .max(messageMax)
        .required(''),
    }),
    onSubmit: (initialValues, { resetForm, setErrors, setSubmitting }) => {
      const message = {
        user,
        channelId: currentChannelId,
        text: initialValues.message,
      };

      try {
        sendMessage(message, (r) => r);
        resetForm();
      } catch (err) {
        console.log(err);
        setErrors({ message: t(err === 'errors.netError' ? 'errors.netError' : 'errors.someError') });
        setTimeout(() => setSubmitting(false), 3000);
      }
    },
  });

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
            isInvalid={formik.errors.message}
          />
          <Button
            type="submit"
            variant="primary"
            className="ml-2"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? Spinner(t('process.sending')) : t('mainPage.send')}
          </Button>
        </InputGroup>
        <FormGroup className="text-danger">{formik.errors.message}</FormGroup>
      </Form>
    </FormGroup>
  );
};
export default MessageForm;
