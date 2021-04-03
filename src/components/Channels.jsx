import React from 'react';
import {
  Button, Form, FormGroup, FormLabel, ListGroup,
} from 'react-bootstrap';
import { openModal } from '../slices/modalsSlice.js';
import { addChannelId } from '../slices/channelsSlice.js';
import ChannelItem from './ChannelItem';

const handleAddButton = (dispatch) => () => dispatch(openModal({ type: 'adding' }));
const handleRemoveButton = (dispatch, id) => () => dispatch(openModal({ type: 'removing', id }));
const handleRenameButton = (dispatch, id) => () => dispatch(openModal({ type: 'renaming', id }));
const handleChangeChannel = (dispatch, id) => () => dispatch(addChannelId({ id }));

const Channels = ({
  channels, isPrimary, dispatch,
}) => {
  const madeButton = ({
    id, name, removable,
  }) => (
    <ChannelItem
      key={id}
      name={name}
      removable={removable}
      btnClass={isPrimary(id)}
      handleRemoveButton={handleRemoveButton(dispatch, id)}
      handleRenameButton={handleRenameButton(dispatch, id)}
      handleChangeChannel={handleChangeChannel(dispatch, id)}
    />
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
