import React from 'react';
import cn from 'classnames';
import * as actions from '../reducers';
import getModal from '../modals/index.js';
import Buttons from '../modals/Buttons';

const renderModal = (modalInfo, dispatch) => {
  const { type, isOpen } = modalInfo;
  if (!type) {
    return null;
  }

  const Component = getModal(type);
  return (
    <Component
      isOpen={isOpen}
      closeModal={actions.closeModal}
      dispatch={dispatch}
    />
  );
};

const { addChannelId, openModal } = actions;

const handleAddButton = (dispatch) => dispatch(openModal({ type: 'adding' }));
const handleRemoveButton = (dispatch, id) => dispatch(openModal({ type: 'removing', id }));
const handleRenameButton = (dispatch, id) => dispatch(openModal({ type: 'renaming', id }));
const handleChangeChannel = (dispatch, id) => dispatch(addChannelId(id));

const channelsButtons = (channels, btnClass, dispatch) => channels
  .map(({ id, name, removable }) => (
    <li
      key={id}
      className="nav-item"
    >
      <Buttons
        name={name}
        removable={removable}
        btnClass={btnClass(id)}
        handleRemoveButton={() => handleRemoveButton(dispatch, id)}
        handleRenameButton={() => handleRenameButton(dispatch, id)}
        handleChangeChannel={() => handleChangeChannel(dispatch, id)}
      />
    </li>
  ));

const Channels = ({
  channels, currentChannelId, modalInfo, dispatch,
}) => {
  const btnClass = (id) => cn({
    primary: currentChannelId === id,
    light: currentChannelId !== id,
  });

  return (
    <>
      <div className="col-3 border-right">
        <div className="d-flex mb-2">
          <span>Channels</span>
          <button type="button" className="ml-auto p-0 btn btn-link" onClick={() => handleAddButton(dispatch)}>+</button>
          {renderModal(modalInfo, dispatch)}
        </div>
        <ul className="nav flex-column nav-pills nav-fill">
          {channelsButtons(channels, btnClass, dispatch)}
        </ul>
      </div>
    </>
  );
};

export default Channels;
