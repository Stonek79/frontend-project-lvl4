import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import axios from 'axios';
import * as Yup from 'yup';
import routes from '../routes';
import { charactersLength, locales } from '../constants';

const { min, max } = charactersLength;
const {
  netError, notOneOf, minMessage, maxMessage, required,
} = locales;

const generateSubmit = ({ close }) => async (value, { setErrors, setSubmitting }) => {
  const { channelsPath } = routes;

  try {
    setSubmitting(true);
    await axios.post(channelsPath(), {
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

const CreateChannel = ({ close, channels }) => {
  const channelsNames = channels.map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema(channelsNames),
    onSubmit: generateSubmit({ close }),
  });

  const isError = formik.errors.channelName === netError;
  const textInput = useRef();
  useEffect(() => {
    textInput.current.select();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              isInvalid={isError}
              ref={textInput}
              name="channelName"
              required
              value={formik.values.channelName}
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
