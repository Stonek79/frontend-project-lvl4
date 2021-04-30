import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';

import { getChannelId } from '../slices/modalSlice.js';
import AppContext from '../context/AppContext.jsx';

const generateRemove = ({
  socket,
  close,
  currentChannalId,
  t,
}) => (values, { setErrors, setSubmitting }) => {
  const name = values.channelName.trim();
  const id = currentChannalId;
  socket.emit('renameChannel', { id, name }, (r) => {
    const timerId = setTimeout(() => {
      setSubmitting(false);
      setErrors({ channelName: t('errors.netError') });
    }, 3000);
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
  const { socket } = useContext(AppContext);
  const { t } = useTranslation();

  const currentChannalId = useSelector(getChannelId);
  const formik = useFormik({
    initialValues: {
      channelInfo: '',
    },
    onSubmit: generateRemove({
      socket, close, currentChannalId, t,
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
          {formik.isSubmitting ? Spinner('process.removing', t) : t('modals.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
