import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Button, Form, FormControl, FormGroup, InputGroup,
} from 'react-bootstrap';

import { itemsLength } from '../constants.js';
import ApiContext from '../context/ApiContext.jsx';
import AuthContext from '../context/AuthContext.jsx';
import { getCurrentChannelId } from '../slices/channelSlice.js';

const { messageMax } = itemsLength;

const Spinner = (name) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { name }
  </>
);

const MessageForm = () => {
  const { t } = useTranslation();
  const { sendMessage } = useContext(ApiContext);
  const { user } = useContext(AuthContext);
  const textInput = useRef(null);
  const currentChannelId = useSelector(getCurrentChannelId);

  const { username } = user;
  const formik = useFormik({
    initialValues: { message: '' },
    status: false,
    validationSchema: Yup.object({
      message: Yup.string().trim()
        .max(messageMax)
        .required(''),
    }),
    onSubmit: async (initialValues, { resetForm, setErrors }) => {
      const message = {
        user: username,
        channelId: currentChannelId,
        text: initialValues.message,
      };

      try {
        await sendMessage(message);
        resetForm();
      } catch (err) {
        console.log(err);
        setErrors({ message: t(err.message === 'errors.netError' ? 'errors.netError' : 'errors.someError') });
      }
    },
  });

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
