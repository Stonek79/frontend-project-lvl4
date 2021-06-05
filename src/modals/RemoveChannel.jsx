import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button, FormGroup, Modal, Spinner,
} from 'react-bootstrap';

import ApiContext from '../context/ApiContext.jsx';
import ThemeContext from '../context/ThemeContext.jsx';
import { darkMode } from '../constants.js';

const RemoveChannel = ({ close, channelId }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
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
      <Modal.Header>
        <Modal.Title>{t('modals.remChannel')}</Modal.Title>
        <Button
          aria-label="Close"
          variant="secondary"
          className={`btn-close bg-${theme === darkMode.light ? '' : darkMode.light}`}
          onClick={close}
        />
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
          {formik.isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" role="status" />
              <span className="ms-2">{t('process.removing')}</span>
            </>
          ) : t('modals.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
