/* eslint-disable no-return-assign */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';

import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import ModalComponent from './Modal.jsx';
import { updateChannels } from '../slices/channelSlice.js';
import ApiContext from '../context/ApiContext.jsx';

const ChatBox = () => (
  <Container className="flex-grow-1 my-4 overflow-hidden rounded shadow">
    <div className="row h-100 bg-white">
      <ChannelBox />
      <MessageBox />
      <ModalComponent />
    </div>
  </Container>
);

const Spinner = (info) => (
  <>
    <span role="status" className="spinner-grow text-primary" />
    { info }
  </>
);

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { reconnect } = useContext(ApiContext);
  const [hasData, setData] = useState(false);

  useEffect(() => {
    const mounted = { state: false };

    const getChatData = async () => {
      if (!mounted.state) {
        setData(true);
        dispatch(updateChannels());
      }
    };

    reconnect();
    getChatData();

    return () => mounted.state = true;
  }, []);

  return (hasData && ChatBox()) || Spinner(t('process.loading'));
};

export default MainPage;
