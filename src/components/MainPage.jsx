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
  const { currentData } = routes;
  const [userData, setData] = useState('');
  const { updateCurrentStore, getAuthHeader } = useContext(AppContext);
  const history = useHistory();
  const { logIn } = useContext(AuthContext);
  const { authorization } = getAuthHeader();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authorization) {
      history.push('/login');
    } else {
      const fetch = async () => {
        const { data } = await axios.get(currentData(), { headers: authorization });
        logIn();
        setData(data);
        return updateCurrentStore(data);
      };
      fetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{userData ? ChatBox() : Spinner(t)}</>;
};

export default MainPage;
