import React from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import routes from '../routes';
import { addChannelId } from '../slices/channelSlice';

const generateRemove = ({
  closeModal, currentId, dispatch, currentChannelId,
}) => async () => {
  const { channelPath } = routes;
  await axios.delete(channelPath(currentId));
  dispatch(closeModal());
  if (currentChannelId > 3) {
    dispatch(addChannelId(1));
  }
};

const Remove = (props) => {
  const { closeModal, isOpen, dispatch } = props;

  const currentId = useSelector((state) => state.modal.channelId);
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const removeChannel = generateRemove({
    closeModal, currentId, dispatch, currentChannelId,
  });

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>Remove this channel?</b></p>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" type="cancel" onClick={() => dispatch(closeModal())}>Cancel</Button>
        <Button variant="danger" type="submit" onClick={removeChannel}>Remove</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Remove;
