import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { charactersLength, locales } from '../constants';
import routes from '../routes';

const { messageMax } = charactersLength;
const { netError, maxMessage, required } = locales;

const handleSubmit = (name, channelId) => async (values, {
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
    setErrors({ message: netError });
  }
};

const validationSchema = Yup.object({
  message: Yup.string()
    .max(messageMax, maxMessage(messageMax))
    .required(''),
});

const MessageForm = ({ user, currentChannelId }) => {
  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema,
    onSubmit: handleSubmit(user, currentChannelId),
  });

  const isError = formik.errors.message === netError;

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
            maxLength={401}
          />
          <Button
            variant="primary"
            type="submit"
            className="ml-2"
            disabled={
            formik.isSubmitting
            || !formik.values.message.trim()
            || (formik.errors.message && !isError)
          }
          >
            {formik.isSubmitting
              ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                  Sending...
                </>
              )
              : 'Send message'}
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
