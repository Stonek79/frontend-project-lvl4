import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { getChannelId } from '../slices/modalSlice.js';
import { charactersLength } from '../constants.js';
import useAuth from '../context/Auth.jsx';

const { minLength, maxLength } = charactersLength;

const generateRename = ({
  auth,
  close,
  currentChannalId,
  t,
}) => (value, { setErrors }) => {
  const name = value.channelName.trim();
  const id = currentChannalId;
  auth.socket.emit('renameChannel', { id, name }, (r) => {
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

const RenameChannel = ({ close, channels }) => {
  const auth = useAuth();
  const { t } = useTranslation();

  const validationSchema = (channelsNames) => Yup.object({
    channelName: Yup.string().trim()
      .min(minLength, t('errors.length'))
      .max(maxLength, t('errors.length'))
      .notOneOf(channelsNames, t('errors.uniq'))
      .required(t('errors.required')),
  });

  const channelsNames = channels.map((ch) => ch.name);

  const channelId = useSelector(getChannelId);
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
    onSubmit: generateRename({
      auth, close, currentChannalId, t,
    }),
  });

  const isError = formik.errors.channelName === t('errors.netError');
  const textInput = useRef();
  useEffect(() => {
    textInput.current.select();
  }, [textInput]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renChannel')}</Modal.Title>
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

export default RenameChannel;
