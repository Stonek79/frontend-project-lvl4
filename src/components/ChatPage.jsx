/* eslint-disable no-return-assign */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import AppContext from '../context/AppContext.jsx';
import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import ModalComponent from './Modal.jsx';
import routes from '../routes.js';

console.log('ChatPage enter');
const ChatBox = () => (
  <div className="row flex-grow-1 h-75 pb-3">
    <ChannelBox />
    <MessageBox />
    <ModalComponent />
  </div>
);

const Spinner = (t) => (
  <>
    <span role="status" className="spinner-grow text-primary" />
    {t('process.loading')}
  </>
);

const MainPage = () => {
  const { t } = useTranslation();
  const {
    updateCurrentStore,
    getAuthHeader,
  } = useContext(AppContext);
  const [hasData, setData] = useState(false);

  const { authorization } = getAuthHeader();
  const { currentData } = routes;

  useEffect(() => {
    const mounted = { state: false };

    const getChatData = async () => {
      const { data } = await axios.get(currentData(), { headers: authorization });

      if (!mounted.state) {
        setData(true);
        return updateCurrentStore(data);
      }

      return data;
    };

    getChatData();

    return () => mounted.state = true;
  });

  console.log('ChatPage return');
  return <>{(hasData && ChatBox()) || Spinner(t)}</>;
};

export default MainPage;
