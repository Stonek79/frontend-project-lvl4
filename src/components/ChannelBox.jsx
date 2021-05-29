import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Col, FormGroup, FormLabel, Nav,
} from 'react-bootstrap';

import ChannelItem from './ChannelItem.jsx';
import { openModal } from '../slices/modalSlice.js';
import { modalTypes } from '../constants.js';
import {
  setCurrentChannelId, getChannels, getCurrentChannelId,
} from '../slices/channelSlice.js';

const { add, remove, rename } = modalTypes;

const handleAddChannel = (dispatch) => () => dispatch(openModal({ type: add }));
const handleRemoveChannel = (dispatch, id) => () => dispatch(openModal({ type: remove, id }));
const handleRenameChannel = (dispatch, id) => () => dispatch(openModal({ type: rename, id }));
const handleChangeChannel = (dispatch, id) => () => dispatch(setCurrentChannelId({ id }));

const ChannelBox = () => {
  const { t } = useTranslation();
  const channels = useSelector(getChannels);
  const currentChannelId = useSelector(getCurrentChannelId);
  const dispatch = useDispatch();

  return (
    <Col id="channelBox" className="col-2 px-0 pt-5 border-end bg-light">
      <FormGroup className="d-flex justify-content-between mb-2 px-4">
        <FormLabel>{t('channels.channels')}</FormLabel>
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          onClick={handleAddChannel(dispatch)}
        >
          <span className="lg m-0">+</span>
        </Button>
      </FormGroup>
      <Nav className="flex-column nav-pills nav-fill">
        {channels.map((channel) => {
          const { id, name, removable } = channel;
          return (
            <ChannelItem
              key={id}
              name={name}
              removable={removable}
              isCurrent={currentChannelId === id}
              handleRemoveChannel={handleRemoveChannel(dispatch, id)}
              handleRenameChannel={handleRenameChannel(dispatch, id)}
              handleChangeChannel={handleChangeChannel(dispatch, id)}
            />
          );
        })}
      </Nav>
    </Col>
  );
};

export default ChannelBox;
