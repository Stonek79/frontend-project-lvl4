import React from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import routes from '../routes';
import { getChannelId } from '../slices/modalSlice';
import locales from '../locales/locales';

const { mixed: { netError } } = locales;

const generateRemove = ({
  close, currentId, t,
}) => async (values, { setSubmitting, setErrors }) => {
  const { channelPath } = routes;

  try {
    setSubmitting(true);
    await axios.delete(channelPath(currentId));
    setSubmitting(false);
    close();
  } catch (err) {
    console.log(err);
    setSubmitting(false);
    setErrors({ channelInfo: t(`errors.${netError}`) });
  }
};

const RemoveChannel = ({ close }) => {
  const { t } = useTranslation();

  const currentId = useSelector(getChannelId);
  const formik = useFormik({
    initialValues: {
      channelInfo: '',
    },
    onSubmit: generateRemove({ close, currentId, t }),
  });

  const isError = formik.errors.channelInfo === t(`errors.${netError}`);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('titles.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-danger">
        <p><b>Are you really want to remove this channel?</b></p>
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
          Cancel
        </Button>
        <Button
          variant="danger"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                {t('buttons.process.removing')}
              </>
            )
            : t('buttons.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
