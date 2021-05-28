/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import ModalComponent from './Modal.jsx';
import { updateChannels } from '../slices/channelSlice.js';

const ChatBox = () => (
  <div className="row flex-grow-1 h-75 pb-3">
    <ChannelBox />
    <MessageBox />
    <ModalComponent />
  </div>
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
  const [hasData, setData] = useState(false);

  useEffect(() => {
    const mounted = { state: false };

    const getChatData = async () => {
      if (!mounted.state) {
        setData(true);
        dispatch(updateChannels());
      }
    };

    getChatData();

    return () => mounted.state = true;
  }, []);

  return (hasData && ChatBox()) || Spinner(t('process.loading'));
};

export default MainPage;
