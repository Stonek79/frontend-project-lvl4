import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import AppContext from '../context/AppContext.jsx';
import ChatBox from './ChatBox.jsx';
import routes from '../routes.js';

const Spinner = (t) => (
  <>
    <span role="status" className="spinner-grow text-primary" />
    {t('process.loading')}
  </>
);

const MainPage = () => {
  const history = useHistory();
  const { currentData } = routes;
  const { t } = useTranslation();
  const { logIn } = useContext(AuthContext);
  const {
    updateCurrentStore,
    getAuthHeader,
  } = useContext(AppContext);
  const [userData, setData] = useState('');
  const [mounted, setMounted] = useState(true);
  const { authorization } = getAuthHeader();

  console.log('MAIN');
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(currentData(), { headers: authorization });
      if (mounted) {
        logIn();
        setData(data);
      }
    };
    if (!authorization) {
      history.push('/login');
      return;
    } fetch();
    setMounted(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userData) {
    updateCurrentStore(userData);
    return <>{ChatBox()}</>;
  }

  return <>{Spinner(t)}</>;
};

export default MainPage;
