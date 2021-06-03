/* eslint-disable no-return-assign */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Spinner } from 'react-bootstrap';

import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import ApiContext from '../context/ApiContext.jsx';
import AuthContext from '../context/AuthContext.jsx';
import ThemeContext from '../context/ThemeContext.jsx';

const ChatBox = (theme) => (
  <Container className="h-100 flex-grow overflow-hidden my-4 rounded shadow">
    <div className={theme === 'light' ? 'row h-100 bg-white' : 'row h-100 text-light bg-dark'}>
      <ChannelBox />
      <MessageBox />
    </div>
  </Container>
);

const MainPage = () => {
  const { t } = useTranslation();
  const { getStoreData } = useContext(ApiContext);
  const { getAuthHeader, logOut } = useContext(AuthContext);
  const [hasData, setDataInfo] = useState(false);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    const mounted = { state: false };

    const getChatData = () => {
      if (!mounted.state) {
        setDataInfo(true);
        getStoreData({ getAuthHeader, logOut });
      }
    };

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
