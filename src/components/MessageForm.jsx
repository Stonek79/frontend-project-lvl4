import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import cn from 'classnames';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';

const validationSchema = Yup.object({
  body: Yup.string()
    .max(400, 'Must be 400 characters or less')
    .required(''),
});

const MessageForm = ({
  user, handleSubmit, currentChannelId,
}) => {
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    onSubmit: handleSubmit(user, currentChannelId),
  });

  const inputClassName = cn({
    'is-invalid': formik.errors.body === 'Network error',
  });
  const feedbackClassName = cn({
    'text-danger': formik.errors.body === 'Network error',
    'text-info': formik.errors.body !== 'Network error',
  });

  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.focus();
  });

  return (
    <FormGroup className="mt-auto">
      <Form onSubmit={formik.handleSubmit}>
        <InputGroup noValidate>
          <FormControl
            className={inputClassName}
            ref={textInput}
            name="body"
            required
            value={formik.values.body}
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
            || !formik.values.body.trim()
            || (formik.errors.body && formik.errors.body !== 'Network error')
          }
          >
            {formik.status === 'Sending...'
              ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                  Sending...
                </>
              )
              : 'Send message'}
          </Button>
        </InputGroup>
        <FormGroup className={feedbackClassName}>{formik.errors.body}</FormGroup>
      </Form>
    </FormGroup>
  );
};
export default MessageForm;
