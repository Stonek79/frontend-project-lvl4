import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { charactersLength } from '../constants';
import locales from '../locales/locales';
import { addMessageAsync } from '../slices/messageSlice';

const { messageMax } = charactersLength;
const { number: { max }, mixed: { netError } } = locales;

const handleSubmit = ({
  user, currentChannelId, dispatch, t,
}) => async (values, { setErrors, resetForm }) => {
  const message = { user, text: values.message };
  try {
    await dispatch(addMessageAsync({ channelId: currentChannelId, message }))
      .then(unwrapResult);
    resetForm();
  } catch (err) {
    setErrors({ message: t(`errors.${netError}`) });
  }
};

const Spinner = (name, t) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { t(name) }
  </>
);

const MessageForm = ({ user, currentChannelId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    message: Yup.string().trim()
      .max(messageMax, t(`errors.${max}`)(messageMax))
      .required(''),
  });

  Yup.setLocale(locales);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema,
    onSubmit: handleSubmit({
      user, currentChannelId, dispatch, t,
    }),
  });
  const isError = formik.errors.message === t(`errors.${netError}`);

  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.focus();
  });

  return (
    <FormGroup className="mt-auto">
      <Form onSubmit={formik.handleSubmit}>
        <InputGroup noValidate>
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
            {formik.isSubmitting ? Spinner('buttons.process.sending', t) : t('buttons.send')}
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
