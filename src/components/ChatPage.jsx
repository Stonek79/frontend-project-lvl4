/* eslint-disable no-return-assign */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import AuthContext from '../context/AuthContext.jsx';
import ChannelBox from './ChannelBox.jsx';
import MessageBox from './MessageBox.jsx';
import ModalComponent from './Modal.jsx';
import routes from '../routes.js';
import { getCurrentChannelId, updateChannels } from '../slices/channelSlice.js';

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
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { getAuthHeader } = useContext(AuthContext);
  const [hasData, setData] = useState(false);
  const id = useSelector(getCurrentChannelId);

  const { authorization } = getAuthHeader();
  const { currentData } = routes;

  const updateCurrentStore = (data, currentChannelId) => {
    const { channels, messages } = data;
    dispatch(updateChannels({ channels, currentChannelId, messages }));
  };

  useEffect(() => {
    const mounted = { state: false };

    const getChatData = async () => {
      const { data } = await axios.get(currentData(), { headers: authorization });
      if (!mounted.state) {
        setData(true);
        console.log(id, 'LOG');
        return updateCurrentStore(data, id);
      }

      return data;
    };

    getChatData();

    return () => mounted.state = true;
  }, []);

  return <>{(hasData && ChatBox()) || Spinner(t)}</>;
};

export default MainPage;
