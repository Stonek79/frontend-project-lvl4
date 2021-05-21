import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { getChannels } from '../slices/channelSlice.js';
import { closeModal, getModalInfo } from '../slices/modalSlice.js';
import CreateChannel from '../modals/CreateChannel.jsx';
import RemoveChannel from '../modals/RemoveChannel.jsx';
import RenameChannel from '../modals/RenameChannel.jsx';

const modals = {
  adding: CreateChannel,
  removing: RemoveChannel,
  renaming: RenameChannel,
};

const ModalComponent = () => {
  const dispatch = useDispatch();
  const channels = useSelector(getChannels);
  const modalInfo = useSelector(getModalInfo);

  const { type, isOpen } = modalInfo;
  const close = () => dispatch(closeModal());

  if (!type) {
    return null;
  }

  const Component = modals[type];

  return (
    <Modal show={isOpen} onHide={close}>
      <Component
        close={close}
        channels={channels}
        dispatch={dispatch}
      />
    </Modal>
  );
};

export default ModalComponent;
