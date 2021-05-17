import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';

import { itemsLength } from '../constants.js';
import ApiContext from '../context/ApiContext.jsx';

const { minLength, maxLength } = itemsLength;

const generateSubmit = ({ addChannel, close }) => (value, { setErrors, setSubmitting }) => {
  const name = value.channelName.trim();
  addChannel({
    close, name, setErrors, setSubmitting,
  });
};

const Spinner = (name) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { name }
  </>
);

const validationSchema = ({ channelsNames }) => Yup.object({
  channelName: Yup.string().trim()
    .min(minLength, 'errors.length')
    .max(maxLength, 'errors.length')
    .notOneOf(channelsNames, 'errors.uniq')
    .required('errors.required'),
});

const CreateChannel = ({ close, channels }) => {
  const { t } = useTranslation();
  const { addChannel } = useContext(ApiContext);

  const channelsNames = channels.map((ch) => ch.name);

  const formik = useFormik({
    initialValues: { channelName: '' },
    validateOnChange: false,
    validationSchema: validationSchema({ channelsNames }),
    onSubmit: generateSubmit({ addChannel, close }),
  });

  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.select();
  }, [textInput]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              ref={textInput}
              name="channelName"
              data-testid="add-channel"
              required
              maxLength={20}
              value={formik.values.channelName}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              isInvalid={formik.errors.channelName}
            />
          </InputGroup>
        </Form>
        <FormGroup className="text-danger">{t(formik.errors.channelName)}</FormGroup>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          type="cancel"
          variant="secondary"
          onClick={close}
          disabled={formik.isSubmitting}
        >
          {t('modals.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? Spinner(t('process.sending')) : t('modals.send')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default CreateChannel;
