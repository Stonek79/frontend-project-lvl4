/* eslint-disable no-return-assign */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Spinner } from 'react-bootstrap';

import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import { updateChannels } from '../slices/channelSlice.js';
import ApiContext from '../context/ApiContext.jsx';
import AuthContext from '../context/AuthContext.jsx';
import ThemeContext from '../context/ThemeContext.jsx';

const ChatBox = (theme) => (
  <Container className="h-100 flex-grow-1 overflow-hidden my-4 rounded shadow">
    <div className={theme === 'light' ? 'row h-100 bg-white' : 'row h-100 text-light bg-dark'}>
      <ChannelBox />
      <MessageBox />
    </div>
  </Container>
);

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { reconnect } = useContext(ApiContext);
  const { getAuthHeader } = useContext(AuthContext);
  const [hasData, setData] = useState(false);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    const mounted = { state: false };

    const getChatData = () => {
      if (!mounted.state) {
        setData(true);
        dispatch(updateChannels(getAuthHeader));
      }
    };

    reconnect(getAuthHeader);
    getChatData();

    return () => mounted.state = true;
  }, []);

  return (hasData && ChatBox(theme)) || (
    <>
      <Spinner animation="grow" role="status" variant="primary" />
      <span>{(t('process.loading'))}</span>
    </>
  );
};

export default MainPage;
