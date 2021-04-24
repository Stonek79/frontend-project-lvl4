import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { closeModal, getModalInfo } from '../slices/modalSlice.js';
import CreateChannel from '../modals/CreateChannel.jsx';
import RemoveChannel from '../modals/RemoveChannel.jsx';
import RenameChannel from '../modals/RenameChannel.jsx';
import { getChannels } from '../slices/channelSlice.js';
import useAuth from '../../validation/context/Auth.jsx';

const modals = {
  adding: CreateChannel,
  removing: RemoveChannel,
  renaming: RenameChannel,
};

const ModalComponent = () => {
  const modalInfo = useSelector(getModalInfo);
  const channels = useSelector(getChannels);
  const dispatch = useDispatch();
  const auth = useAuth();
  const { type, isOpen } = modalInfo;
  if (!type) {
    return null;
  }

  const close = () => dispatch(closeModal());

  const Component = modals[type];
  return (
    <Modal show={isOpen} onHide={close}>
      <Component
        auth={auth}
        close={close}
        channels={channels}
      />
    </Modal>
  );
};

export default ModalComponent;