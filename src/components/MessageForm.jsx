import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Spinner,
} from 'react-bootstrap';

import { itemsLength } from '../constants.js';
import ApiContext from '../context/ApiContext.jsx';
import AuthContext from '../context/AuthContext.jsx';
import { getCurrentChannel } from '../slices/channelSlice.js';

const { messageMax } = itemsLength;

const MessageForm = () => {
  const { t } = useTranslation();
  const { sendMessage } = useContext(ApiContext);
  const { user } = useContext(AuthContext);
  const textInput = useRef(null);
  const currentChannelId = useSelector(getCurrentChannel);

  const { username } = user;
  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: Yup.object({
      message: Yup.string().trim()
        .max(messageMax)
        .required(t('errors.required')),
    }),
    onSubmit: async (initialValues, { resetForm, setErrors }) => {
      const message = {
        user: username,
        channelId: currentChannelId.id,
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
    <FormGroup className="border-top mt-auto py-3 px-5">
      <Form noValidate onSubmit={formik.handleSubmit}>
        <InputGroup>
          <FormControl
            ref={textInput}
            name="message"
            required
            data-testid="new-message"
            placeholder={t('process.addMessage')}
            maxLength={400}
            value={formik.values.message}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.message}
          />
          <Button
            type="submit"
            variant="outline-secondary"
            className="ml-2"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" role="status" />
                <span className="ms-2">{t('process.sending')}</span>
              </>
            ) : <b>{t('mainPage.send')}</b>}
          </Button>
          <Form.Control.Feedback type="invalid">{t(formik.errors.message)}</Form.Control.Feedback>
        </InputGroup>
      </Form>
    </FormGroup>
  );
};
export default MessageForm;
