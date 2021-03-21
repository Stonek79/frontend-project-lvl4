import React from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import routes from '../routes';
import { useSelector } from 'react-redux';


const generateRemove = (closeModal, currentId, dispatch) => async () => {
  const { channelPath } = routes;
  await axios.delete(channelPath(currentId));
  dispatch(closeModal());
};

const Remove = (props) => {
  const { closeModal, isOpen, dispatch } = props;

  const currentId = useSelector(state => state.modal.channelId);
  const removeChannel = generateRemove(closeModal, currentId, dispatch);
  
  return (
      <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Remove this channel?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(closeModal())}>Close</Button>
          <Button variant="primary" onClick={removeChannel}>Remove</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default Remove;