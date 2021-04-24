import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ChatRender from '../../main/init.jsx';
import routes from '../../routes.js';
import useAuth from '../context/Auth.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return {
      username: userId.username,
      authorization: { Authorization: `Bearer ${userId.token}` },
    };
  }

  return {};
};

const Spinner = (t) => (
  <>
    <span role="status" className="spinner-grow text-primary" />
    {t('process.loading')}
  </>
);

const MainPage = () => {
  const { t } = useTranslation();
  const { currentData } = routes;
  const [chatData, setData] = useState('');
  const history = useHistory();
  const { socket, logIn } = useAuth();
  const { authorization, username } = getAuthHeader();

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      logIn(true, username);
      const getData = async () => {
        const { data } = await axios.get(currentData(), { headers: authorization });
        setData(data);
      };
      getData();
    } else {
      history.push('/login');
    }
  }, []);

  return <>{chatData ? ChatRender(chatData, socket) : Spinner(t)}</>;
};

export default MainPage;
