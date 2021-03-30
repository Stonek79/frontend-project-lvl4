import React from 'react';
import axios from 'axios';
import { Button, FormGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import routes from '../routes';
import { addChannelId } from '../slices/channelSlice';

const generateRemove = ({
  closeModal, currentId, dispatch, currentChannelId,
}) => async (values, { setStatus }) => {
  const { channelPath } = routes;

  try {
    setStatus('Removing in process');
    await axios.delete(channelPath(currentId));
    dispatch(closeModal());
    if (currentChannelId > 3) {
      dispatch(addChannelId(1));
    }
    setStatus('done');
  } catch (err) {
    setStatus(`Sorry, some ${err.message}, try later`);
  }
};

const Remove = (props) => {
  const { closeModal, isOpen, dispatch } = props;

  const currentId = useSelector((state) => state.modal.channelId);
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: generateRemove({
      closeModal, currentId, dispatch, currentChannelId,
    }),
  });

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>Remove this channel?</b></p>
        <FormGroup className="text-danger">{formik.status}</FormGroup>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" type="cancel" onClick={() => dispatch(closeModal())} disabled={formik.isSubmitting}>Cancel</Button>
        <Button variant="danger" type="submit" onClick={formik.handleSubmit} disabled={formik.isSubmitting}>
          {formik.status === 'Removing in process'
            ? (
              <span className="spinner-border spinner-border" role="status" aria-hidden="true" />
            )
            : 'Remove'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Remove;
