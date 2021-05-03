import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Modal } from 'react-bootstrap';

import { getChannelId } from '../slices/modalSlice.js';
import AppContext from '../context/AppContext.jsx';

const generateRemove = ({
  close,
  currentChannalId,
  socket,
  t,
}) => (values, { setErrors, setSubmitting }) => {
  const id = currentChannalId;

  if (socket.connected === false) {
    setSubmitting(false);
    setErrors({ channelInfo: t('errors.netError') });
    return;
  }

  const timerId = setTimeout(() => {
    setSubmitting(false);
    setErrors({ channelInfo: t('errors.netError') });
  }, 3000);
  socket.emit('removeChannel', { id }, (r) => {
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

const RemoveChannel = ({ close }) => {
  const { t } = useTranslation();
  const { socket } = useContext(AppContext);

  const currentChannalId = useSelector(getChannelId);
  const formik = useFormik({
    initialValues: {
      channelInfo: '',
    },
    onSubmit: generateRemove({
      close, currentChannalId, socket, t,
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
          type="cancel"
          variant="secondary"
          onClick={close}
          disabled={formik.isSubmitting}
        >
          {t('modals.cancel')}
        </Button>
        <Button
          type="submit"
          variant="danger"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? Spinner('process.removing', t) : t('modals.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
