import React from 'react';
import {
  Button, Form, FormGroup, FormLabel, ListGroup,
} from 'react-bootstrap';
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
      <Form className="col-3 h-100">
        <FormGroup className="d-flex mb-2">
          <FormLabel><b>Channels</b></FormLabel>
          <Button
            type="button"
            variant="outline-primary"
            className="ml-auto p-1"
            onClick={handleAddButton(dispatch)}
          >
            <b>+</b>
          </Button>
          {renderModal(modalInfo, dispatch, channels)}
        </FormGroup>
        <FormGroup className="h-100 overflow-auto">
          <ListGroup className="nav">
            {channels.map(madeButton)}
          </ListGroup>
        </FormGroup>
      </Form>
    </>
  );
};

export default Channels;
