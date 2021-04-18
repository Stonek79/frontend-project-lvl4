import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { unwrapResult } from '@reduxjs/toolkit';
import { getChannelId } from '../slices/modalSlice';
import locales from '../locales/locales';
import { removeChannelAsync } from '../slices/channelSlice';

const { mixed: { netError } } = locales;

const generateRemove = ({
  close,
  currentId,
  dispatch,
  t,
}) => async (values, { setErrors }) => {
  try {
    await dispatch(removeChannelAsync({ currentId }))
      .then(unwrapResult);
    close();
  } catch (err) {
    setErrors({ channelInfo: t(`errors.${netError}`) });
  }
};

const Spinner = (name, t) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { t(name) }
  </>
);

const RemoveChannel = ({ close }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentId = useSelector(getChannelId);
  const formik = useFormik({
    initialValues: {
      channelInfo: '',
    },
    onSubmit: generateRemove({
      close, currentId, dispatch, t,
    }),
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
          {formik.isSubmitting ? Spinner('buttons.process.removing', t) : t('buttons.remove')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
