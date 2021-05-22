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
import { updateChannels } from '../slices/channelSlice.js';
import ApiContext from '../context/ApiContext.jsx';
import { getChannelId } from '../slices/modalSlice.js';

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
  const id = useSelector(getChannelId);
  const { reconnectSocket } = useContext(ApiContext);
  const { getAuthHeader } = useContext(AuthContext);
  const [hasData, setData] = useState(false);

  const authorization = getAuthHeader();
  const { currentData } = routes;

  useEffect(() => {
    const mounted = { state: false };

    const getChatData = async () => {
      const { data } = await axios.get(currentData(), { headers: authorization });
      if (!mounted.state) {
        setData(true);
        dispatch(updateChannels(data));
      }
    };

    console.log(id);
    reconnectSocket(id, getChatData);

    getChatData();

    return () => mounted.state = true;
  }, []);

  return (hasData && ChatBox()) || Spinner(t('process.loading'));
};

export default MainPage;
