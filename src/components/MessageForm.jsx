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

const handleSubmit = ({
  currentChannelId, loggedIn, sendMessage,
}) => (values, { resetForm, setErrors, setSubmitting }) => {
  const message = {
    user: loggedIn.username,
    channelId: currentChannelId,
    text: values.message,
  };

  sendMessage({
    message, resetForm, setErrors, setSubmitting,
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
  const { sendMessage } = useContext(ApiContext);
  const { loggedIn } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: { message: '' },
    status: false,
    validationSchema,
    onSubmit: handleSubmit({ loggedIn, currentChannelId, sendMessage }),
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
            {formik.isSubmitting ? Spinner('process.sending', t) : t('mainPage.send')}
          </Button>
        </InputGroup>
        <FormGroup className="text-danger">{formik.errors.message}</FormGroup>
      </Form>
    </FormGroup>
  );
};
export default MessageForm;
