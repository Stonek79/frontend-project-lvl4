import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, ListGroup } from 'react-bootstrap';

import ChannelItem from './ChannelItem.jsx';
import { openModal } from '../slices/modalSlice.js';
import { modalTypes } from '../constants.js';
import {
  setCurrentChannelId, getChannels, getCurrentChannel,
} from '../slices/channelSlice.js';
import ThemeContext from '../context/ThemeContext.jsx';

const handleAddChannel = (dispatch) => () => dispatch(openModal({ type: modalTypes.add }));
const handleRemoveChannel = (dispatch, id) => () => dispatch(openModal({
  type: modalTypes.remove, id,
}));
const handleRenameChannel = (dispatch, id) => () => dispatch(openModal({
  type: modalTypes.rename, id,
}));
const handleChangeChannel = (dispatch, id) => () => dispatch(setCurrentChannelId({ id }));

const ChannelBox = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const channels = useSelector(getChannels);
  const currentChannel = useSelector(getCurrentChannel);
  const dispatch = useDispatch();

  return (
    <div id="channelBox" className="d-flex flex-column h-100 col-3 pt-4 py-4">
      <FormGroup className="d-flex justify-content-between mb-3 px-4">
        <span className="mb-0 fs-4">{t('channels.channels')}</span>
        <Button
          type="button"
          variant="outline-primary"
          className="py-0 btn-sm"
          onClick={handleAddChannel(dispatch)}
        >
          <span className="fs-5">+</span>
        </Button>
      </FormGroup>
      <FormGroup id="channelsList" className="h-100 pb-3 pe-1 overflow-auto">
        <ListGroup className="nav">
          {channels.map((channel) => {
            const { id } = channel;
            const variant = currentChannel && currentChannel.id === id ? 'secondary' : theme;
            return (
              <ChannelItem
                key={id}
                channel={channel}
                variant={variant}
                handleRemoveChannel={handleRemoveChannel(dispatch, id)}
                handleRenameChannel={handleRenameChannel(dispatch, id)}
                handleChangeChannel={handleChangeChannel(dispatch, id)}
              />
            );
          })}
        </ListGroup>
      </FormGroup>
    </div>
  );
};

export default ChannelBox;
