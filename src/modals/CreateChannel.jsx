import React, { useContext, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';

import { itemsLength } from '../constants.js';
import AppContext from '../context/AppContext.jsx';

const { minLength, maxLength } = itemsLength;

const generateSubmit = ({
  socket, close, t,
}) => (value, { setErrors }) => {
  socket.emit('newChannel', { name: value.channelName.trim() }, (r) => {
    if (r.status === 'ok') {
      return close();
    }
    return setErrors({ message: t('errors.netError') });
  });
};

const Spinner = (name, t) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { t(name) }
  </>
);

const validationSchema = ({ channelsNames, t }) => Yup.object({
  channelName: Yup.string().trim()
    .min(minLength, t('errors.length'))
    .max(maxLength, t('errors.length'))
    .notOneOf(channelsNames, t('errors.uniq'))
    .required(t('errors.required')),
});

const CreateChannel = ({ close, channels }) => {
  const { socket } = useContext(AppContext);
  const { t } = useTranslation();

  const channelsNames = channels.map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema({ channelsNames, t }),
    onSubmit: generateSubmit({
      socket, close, t,
    }),
  });

  const isError = formik.errors.channelName === t('errors.netError');
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
              isInvalid={isError}
              ref={textInput}
              name="channelName"
              required
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              maxLength={20}
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
          {t('modals.cancel')}
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? Spinner('process.sending', t) : t('modals.send')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default CreateChannel;
