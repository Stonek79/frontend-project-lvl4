import React from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import renderModal from '../modals/ModalRender';
import { openModal } from '../slices/modalSlice.js';
import { addChannelId } from '../slices/channelSlice.js';
import ChannelItem from './ChannelItem';

const handleAddButton = (dispatch) => () => dispatch(openModal({ type: 'adding' }));
const handleRemoveButton = (dispatch, id) => () => dispatch(openModal({ type: 'removing', id }));
const handleRenameButton = (dispatch, id) => () => dispatch(openModal({ type: 'renaming', id }));
const handleChangeChannel = (dispatch, id) => () => dispatch(addChannelId(id));

const Channels = ({
  channels, isPrimary, modalInfo, dispatch,
}) => {
  const madeButton = ({
    id, name, removable,
  }) => (
    <li key={id} className="nav-item">
      <ChannelItem
        name={name}
        removable={removable}
        btnClass={isPrimary(id)}
        handleRemoveButton={handleRemoveButton(dispatch, id)}
        handleRenameButton={handleRenameButton(dispatch, id)}
        handleChangeChannel={handleChangeChannel(dispatch, id)}
      />
    </li>
  );

  return (
    <>
      <Form className="col-3 border-right">
        <FormGroup className="d-flex mb-2">
          <span><b>Channels</b></span>
          <Button
            type="button"
            variant="light"
            className="ml-auto p-1"
            onClick={handleAddButton(dispatch)}
          >
            +
          </Button>
          {renderModal(modalInfo, dispatch, channels)}
        </FormGroup>
        <FormGroup style={{ overflow: 'auto' }}>
          <ul className="nav flex-column nav-pills nav-fill">
            {channels.map(madeButton)}
          </ul>
        </FormGroup>
      </Form>
    </>
  );
};

export default Channels;
