import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Form, FormGroup, FormLabel, ListGroup,
} from 'react-bootstrap';
import { openModal } from '../slices/modalSlice.js';
import { addChannelId, getChannels, getCurrentChannelId } from '../slices/channelSlice.js';
import { modalTypes } from '../constants.js';
import ChannelItem from './ChannelItem.jsx';

const { add, remove, rename } = modalTypes;

const handleAddChannel = (dispatch) => () => dispatch(openModal({ type: add }));
const handleRemoveChannel = (dispatch, id) => () => dispatch(openModal({ type: remove, id }));
const handleRenameChannel = (dispatch, id) => () => dispatch(openModal({ type: rename, id }));
const handleChangeChannel = (dispatch, id) => () => dispatch(addChannelId({ id }));

const ChannelBox = () => {
  const { t } = useTranslation();
  const currentChannelId = useSelector(getCurrentChannelId);
  const channels = useSelector(getChannels);
  const dispatch = useDispatch();

  return (
    <>
      <Form className="col-3 h-100">
        <FormGroup className="d-flex mb-2">
          <FormLabel><b>{t('channels.channels')}</b></FormLabel>
          <Button
            type="button"
            variant="outline-primary"
            className="ml-auto p-1"
            onClick={handleAddChannel(dispatch)}
          >
            <b>+</b>
          </Button>
        </FormGroup>
        <FormGroup className="h-100 overflow-auto">
          <ListGroup className="nav">
            {channels.map((channel) => {
              const { id, name, removable } = channel;
              return (
                <ChannelItem
                  key={id}
                  name={name}
                  removable={removable}
                  isPrimary={currentChannelId === id}
                  handleRemoveChannel={handleRemoveChannel(dispatch, id)}
                  handleRenameChannel={handleRenameChannel(dispatch, id)}
                  handleChangeChannel={handleChangeChannel(dispatch, id)}
                />
              );
            })}
          </ListGroup>
        </FormGroup>
      </Form>
    </>
  );
};

export default ChannelBox;
