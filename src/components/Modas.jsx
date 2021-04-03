import React from 'react';
import getModal from '../modals/index.js';
import { closeModal } from '../slices/modalsSlice';

const Modals = ({ modalInfo, dispatch, channels }) => {
  const { type, isOpen } = modalInfo;
  if (!type) {
    return null;
  }

  const Component = getModal(type);
  return (
    <Component
      isOpen={isOpen}
      closeModal={closeModal}
      dispatch={dispatch}
      channels={channels}
    />
  );
};

export default Modals;
