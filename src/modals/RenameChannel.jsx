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
import ApiContext from '../context/ApiContext.jsx';

const { minLength, maxLength } = itemsLength;

const generateRename = ({
  close, currentChannalId, renameChannel,
}) => (value, { setSubmitting }) => {
  const name = value.channelName.trim();
  const id = currentChannalId;

  renameChannel({
    id, close, name, setSubmitting,
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
  const { renameChannel } = useContext(ApiContext);
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
    onSubmit: generateRename({ close, currentChannalId, renameChannel }),
  });

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
              isInvalid={formik.errors.channelName}
            />
          </InputGroup>
        </Form>
        <FormGroup className="text-danger">{formik.errors.channelName}</FormGroup>
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
