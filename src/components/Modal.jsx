import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { closeModal } from '../slices/modalSlice';
import CreateChannel from '../modals/CreateChannel.jsx';
import RemoveChannel from '../modals/RemoveChannel.jsx';
import RenameChannel from '../modals/RenameChannel.jsx';

const modals = {
  adding: CreateChannel,
  removing: RemoveChannel,
  renaming: RenameChannel,
};

const ModalComponent = () => {
  const modalInfo = useSelector((state) => state.modals);
  const channels = useSelector((state) => state.channels.channels);
  const dispatch = useDispatch();
  const { type, isOpen } = modalInfo;
  if (!type) {
    return null;
  }

  const close = () => dispatch(closeModal());

  const Component = modals[type];
  return (
    <Modal show={isOpen} onHide={close}>
      <Component
        close={close}
        channels={channels}
      />
    </Modal>
  );
};

export default ModalComponent;
