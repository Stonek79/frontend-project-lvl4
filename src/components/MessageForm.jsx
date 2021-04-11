import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import charactersLength from '../constants';
import routes from '../routes';
import locales from '../locales/locales';

const { messageMax } = charactersLength;
const { number: { max }, mixed: { netError } } = locales;

const handleSubmit = (name, channelId, t) => async (values, {
  setSubmitting, setErrors, resetForm,
}) => {
  const { channelMessagesPath } = routes;
  const message = { user: name, text: values.message };
  try {
    setSubmitting(true);
    await axios.post(channelMessagesPath(channelId), {
      data: {
        channelId,
        attributes: message,
      },
    });
    setSubmitting(false);
    resetForm();
  } catch (err) {
    console.log(err);
    setSubmitting(false);
    setErrors({ message: t(`errors.${netError}`) });
  }
};

const MessageForm = ({ user, currentChannelId }) => {
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
    onSubmit: handleSubmit(user, currentChannelId, t),
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
            {formik.isSubmitting
              ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                  {t('buttons.sending')}
                </>
              )
              : t('buttons.send')}
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
