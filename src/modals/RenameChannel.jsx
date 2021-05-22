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

const Spinner = (name) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { name }
  </>
);

const RenameChannel = ({ close, channels }) => {
  const { t } = useTranslation();
  const { renameChannel } = useContext(ApiContext);
  const channelId = useSelector(getChannelId);

  const channelsNames = channels.map((ch) => ch.name);
  const currentChannel = channels.find((channel) => channel.id === channelId);
  const currentChannelName = currentChannel.name;
  const { id } = currentChannel;

  const formik = useFormik({
    initialValues: { channelName: currentChannelName },
    validateOnChange: false,
    validationSchema: Yup.object({
      channelName: Yup.string().trim()
        .min(minLength, 'errors.length')
        .max(maxLength, 'errors.length')
        .notOneOf(channelsNames, 'errors.uniq')
        .required('errors.required'),
    }),
    onSubmit: (initialValues, { setErrors, setSubmitting }) => {
      const name = initialValues.channelName.trim();

      try {
        renameChannel({ id, name }, (r) => r);
        close();
      } catch (err) {
        console.log(err);
        setErrors({ channelName: t(err.message === 'errors.netError' ? 'errors.netError' : 'errors.someError') });
        setTimeout(() => setSubmitting(false), 3000);
      }
    },
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

export default RenameChannel;
