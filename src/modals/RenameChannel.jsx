import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';

import { getChannelId } from '../slices/modalSlice.js';
import { itemsLength } from '../constants.js';
import AppContext from '../context/AppContext.jsx';

const { minLength, maxLength } = itemsLength;

const generateRename = ({
  close,
  currentChannalId,
  socket,
  t,
}) => (value, { setErrors, setSubmitting }) => {
  const name = value.channelName.trim();
  const id = currentChannalId;

  if (socket.connected === false) {
    setSubmitting(false);
    setErrors({ channelName: t('errors.netError') });
    return;
  }

  const timerId = setTimeout(() => {
    setSubmitting(false);
    setErrors({ channelName: t('errors.netError') });
  }, 3000);
  socket.emit('renameChannel', { id, name }, (r) => {
    if (r.status === 'ok') {
      clearTimeout(timerId);
      close();
    }
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

const RenameChannel = ({ close, channels }) => {
  const { t } = useTranslation();
  const { socket } = useContext(AppContext);
  const channelId = useSelector(getChannelId);

  const channelsNames = channels
    .map((ch) => ch.name);
  const currentChannel = channels
    .find((channel) => channel.id === channelId);
  const { name } = currentChannel;
  const currentChannalId = currentChannel.id;

  const formik = useFormik({
    initialValues: {
      channelName: name,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: validationSchema({ channelsNames, t }),
    onSubmit: generateRename({
      close, currentChannalId, socket, t,
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
              ref={textInput}
              data-testid="rename-channel"
              name="channelName"
              required
              maxLength={20}
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              isInvalid={isError}
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
          {formik.isSubmitting ? Spinner('process.sending', t) : t('modals.send')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RenameChannel;
