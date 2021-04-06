import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import cn from 'classnames';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes';

const generateSubmit = ({ close }) => async (value, { setStatus, setErrors }) => {
  const { channelsPath } = routes;

  try {
    setStatus('Adding...');
    await axios.post(channelsPath(), {
      data: {
        attributes: {
          name: value.body.trim(),
        },
      },
    });
    setStatus('done');
    close();
  } catch (err) {
    console.log(err);
    setStatus('done');
    setErrors({ body: 'Network error' });
  }
};

const validate = (channelsNames) => Yup.object({
  body: Yup.string()
    .min(3, 'Must be at least 3 characters & no space')
    .max(17, 'Must be 17 characters or less')
    .notOneOf(channelsNames, 'Channel name already exist.')
    .required(''),
});

const CreateChannel = ({ close, channels }) => {
  const channelsNames = channels.map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: validate(channelsNames),
    onSubmit: generateSubmit({ close }),
  });

  const inputClassName = cn({
    'is-invalid': formik.errors.body === 'Network error',
  });
  const feedbackClassName = cn({
    'text-danger': formik.errors.body === 'Network error',
    'text-info': formik.errors.body !== 'Network error',
  });

  const textInput = useRef();
  useEffect(() => {
    setTimeout(() => {
      textInput.current.select();
    }, 1);
  }, [textInput]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              className={inputClassName}
              ref={textInput}
              name="body"
              required
              value={formik.values.body.trim()}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              maxLength={18}
            />
          </InputGroup>
        </Form>
        <FormGroup className={feedbackClassName}>{formik.errors.body}</FormGroup>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button
          variant="secondary"
          type="cancel"
          onClick={() => close()}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={
            formik.isSubmitting
            || !formik.values.body.trim()
            || (formik.errors.body && formik.errors.body !== 'Network error')
          }
        >
          {formik.status === 'Adding...'
            ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                Creating...
              </>
            )
            : 'Create'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default CreateChannel;
