import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import routes from '../routes';
import { charactersLength, locales } from '../constants';

const { min, max } = charactersLength;
const {
  netError, notOneOf, minMessage, maxMessage, required,
} = locales;

const generateRename = (close, channelId) => async (value, { setSubmitting, setErrors }) => {
  const { channelPath } = routes;

  try {
    setSubmitting(true);
    await axios.patch(channelPath(channelId), {
      data: {
        attributes: {
          name: value.channelName.trim(),
        },
      },
    });
    setSubmitting(false);
    close();
  } catch (err) {
    console.log(err);
    setSubmitting(false);
    setErrors({ channelName: netError });
  }
};

const validationSchema = (channelsNames) => Yup.object({
  channelName: Yup.string()
    .min(min, minMessage(min))
    .max(max, maxMessage(max))
    .notOneOf(channelsNames, notOneOf)
    .required(required),
});

const RenameChannel = ({ close, channels }) => {
  const channelsNames = channels.map((ch) => ch.name);

  const channelId = useSelector((state) => state.modals.channelId);
  const currentChannal = channels.find((channel) => channel.id === channelId);
  const currentChannalId = currentChannal.id;
  const { name } = currentChannal;

  const formik = useFormik({
    initialValues: {
      channelName: name,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema(channelsNames),
    onSubmit: generateRename(close, currentChannalId),
  });

  const isError = formik.errors.channelName === netError;
  const textInput = useRef();
  useEffect(() => {
    textInput.current.select();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Renaming channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              isInvalid={isError}
              ref={textInput}
              name="channelName"
              required
              value={formik.values.channelName.trim()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              maxLength={18}
            />
          </InputGroup>
        </Form>
        <FormGroup
          className={isError ? 'text-danger' : 'text-info'}
        >
          {formik.errors.channelName}
        </FormGroup>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          variant="secondary"
          type="cancel"
          onClick={close}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formik.handleSubmit}
        >
          {formik.isSubmitting
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
