import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Modal } from 'react-bootstrap';

import ApiContext from '../context/ApiContext.jsx';

const Spinner = (name) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { name }
  </>
);

const RemoveChannel = ({ close, channelId }) => {
  const { t } = useTranslation();
  const { removeChannel } = useContext(ApiContext);

  const formik = useFormik({
    initialValues: { channelInfo: '' },
    onSubmit: async (initialValues, { setErrors }) => {
      const id = channelId;
      try {
        await removeChannel({ id });
        close();
      } catch (err) {
        console.log(err);
        setErrors({ channelInfo: t(err.message === 'errors.netError' ? 'errors.netError' : 'errors.someError') });
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-danger">
        <p><b>{t('modals.confirm')}</b></p>
        <FormGroup className="text-danger">{formik.errors.channelInfo}</FormGroup>
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
          {formik.isSubmitting ? Spinner(t('process.removing')) : t('modals.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
