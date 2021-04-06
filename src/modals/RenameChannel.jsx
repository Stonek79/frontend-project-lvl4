import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, Modal,
} from 'react-bootstrap';
import cn from 'classnames';
import axios from 'axios';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import routes from '../routes';

const generateRename = (close, channelId) => async (value, { setStatus, setErrors }) => {
  const { channelPath } = routes;

  try {
    setStatus('Renaming...');
    await axios.patch(channelPath(channelId), {
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

const RenameChannel = ({ close, channels }) => {
  const channelsNames = channels.map((ch) => ch.name);

  const channelId = useSelector((state) => state.modals.channelId);
  const currentChannal = channels.find((channel) => channel.id === channelId);
  const currentChannalId = currentChannal.id;
  const { name } = currentChannal;

  const formik = useFormik({
    initialValues: {
      body: name,
    },
    validationSchema: validate(channelsNames),
    onSubmit: generateRename(close, currentChannalId),
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
        <Modal.Title>Renaming channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
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
          </FormGroup>
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
          {formik.status === 'Renaming...'
            ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                Renaming...
              </>
            )
            : 'Confirm'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RenameChannel;
