import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import cn from 'classnames';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes';

const generateSubmit = ({ closeModal, dispatch }) => async (value, { setStatus, setErrors }) => {
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
    dispatch(closeModal());
  } catch (err) {
    console.log(err);
    setStatus('done');
    setErrors({ body: 'Net error' });
  }
};

const CreateChannel = (props) => {
  const {
    closeModal, isOpen, dispatch, channels,
  } = props;
  const channelsNames = channels.map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: Yup.object({
      body: Yup.string()
        .max(17, 'Must be 17 characters or less')
        .notOneOf(channelsNames, 'Channel name already exist.')
        .required(),
    }),
    onSubmit: generateSubmit(props),
  });

  const inputClassName = cn({ 'is-invalid': formik.errors.body === 'Net error' });
  const feedbackClassName = cn({
    'text-danger': formik.errors.body === 'Net error',
    'text-info': formik.errors.body !== 'Net error',
  });

  const textInput = useRef();
  useEffect(() => {
    setTimeout(() => {
      textInput.current.select();
    }, 1);
  }, [textInput]);

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
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
              value={formik.values.body}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              placeholder="Channel name: max length 17 characters"
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
          onClick={() => dispatch(closeModal())}
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
            || (formik.errors.body && formik.errors.body !== 'Net error')
          }
        >
          {formik.status === 'Adding...'
            ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Creating...
              </>
            )
            : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChannel;
