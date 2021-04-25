import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { getChannelId } from '../slices/modalSlice.js';
import useAuth from '../../validation/context/Auth.jsx';

const generateRemove = ({
  auth,
  close,
  currentId,
  setLoading,
  t,
}) => (values, { setErrors }) => {
  setLoading(true);
  auth.socket.emit('removeChannel', { id: currentId }, (r) => {
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

const RemoveChannel = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { t } = useTranslation();

  const currentId = useSelector(getChannelId);
  const formik = useFormik({
    initialValues: {
      channelInfo: '',
    },
    onSubmit: generateRemove({
      auth, close, currentId, setLoading, t,
    }),
  });

  const isError = formik.errors.channelInfo === t('errors.netError');

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-danger">
        <p><b>{t('modals.confirm')}</b></p>
        <FormGroup
          className={isError ? 'text-danger' : 'text-info'}
        >
          {formik.errors.channelInfo}
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
          variant="danger"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {loading ? Spinner('process.removing', t) : t('modals.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
