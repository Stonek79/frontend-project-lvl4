/* eslint-disable functional/no-let */
/* eslint-disable arrow-body-style */
/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import ModalComponent from './Modal.jsx';
import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import AppContext from '../context/AppContext.jsx';
import routes from '../routes.js';

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

  const { currentData } = routes;
  const { authorization } = getAuthHeader();

  const getChatData = async (mounted) => {
    const { data } = await axios.get(currentData(), { headers: authorization });
    if (!mounted) {
      setData(true);
      return updateCurrentStore(data);
    }
  };

  useEffect(() => {
    let mounted = false;
    getChatData(mounted);
    return () => {
      return mounted = true;
    };
  });

  return <>{(hasData && ChatBox()) || Spinner(t)}</>;
};

export default MainPage;
