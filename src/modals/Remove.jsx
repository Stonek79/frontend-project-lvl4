import React from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
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
  const deleteChannel = generateRemove(closeModal, currentId, dispatch);
  
  return (
      <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Remove this channel?</h5>
          <div className="d-flex justify-content-between">
            <input className="btn btn-secondary" type="button" onClick={() => dispatch(closeModal())} value="Cancel" />
            <input className="btn btn-primary" type="submit" value="Submit" onClick={deleteChannel} />
          </div>
        </Modal.Body>
      </Modal>
  );
};

export default Remove;