import React from 'react';
import axios from 'axios';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import cn from 'classnames';
import routes from '../routes';

const generateRemove = (close, currentId) => async (values, { setStatus, setErrors }) => {
  const { channelPath } = routes;

  try {
    setStatus('Removing...');
    await axios.delete(channelPath(currentId));
    setStatus('done');
    close();
  } catch (err) {
    console.log(err);
    setStatus('done');
    setErrors({ body: 'Network error' });
  }
};

const RemoveChannel = ({ close }) => {
  const currentId = useSelector((state) => state.modals.channelId);
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: generateRemove(close, currentId),
  });

  const feedbackClassName = cn({
    'text-danger': formik.errors.body === 'Network error',
    'text-info': formik.errors.body !== 'Network error',
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Removing channel</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-danger">
        <p><b>Are you really want to remove this channel?</b></p>
        <FormGroup className={feedbackClassName}>{formik.errors.body}</FormGroup>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button
          variant="secondary"
          type="cancel"
          onClick={() => close()}
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
          {formik.status === 'Removing...'
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
