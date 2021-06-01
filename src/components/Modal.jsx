import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { getChannels, getChannelsNames } from '../slices/channelSlice.js';
import { closeModal, getChannelId, getModalInfo } from '../slices/modalSlice.js';
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
  const modalInfo = useSelector(getModalInfo);
  const channelId = useSelector(getChannelId);
  const channels = useSelector(getChannels);
  const channelsNames = useSelector(getChannelsNames);

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
        channelId={channelId}
        channelsNames={channelsNames}
        dispatch={dispatch}
      />
    </Modal>
  );
};

export default ModalComponent;
