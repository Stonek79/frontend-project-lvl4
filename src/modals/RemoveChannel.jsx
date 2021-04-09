import React from 'react';
import axios from 'axios';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import routes from '../routes';
import { locales } from '../constants';

const { netError } = locales;
const generateRemove = (close, currentId) => async (values, { setSubmitting, setErrors }) => {
  const { channelPath } = routes;

  try {
    setSubmitting(true);
    await axios.delete(channelPath(currentId));
    setSubmitting(false);
    close();
  } catch (err) {
    console.log(err);
    setSubmitting(false);
    setErrors({ channelInfo: netError });
  }
};

const RemoveChannel = ({ close }) => {
  const currentId = useSelector((state) => state.modals.channelId);
  const formik = useFormik({
    initialValues: {
      channelInfo: '',
    },
    onSubmit: generateRemove(close, currentId),
  });

  const isError = formik.errors.channelInfo === netError;

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Removing channel</Modal.Title>
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
                Removing...
              </>
            )
            : 'Yes'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveChannel;
