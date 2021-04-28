import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AuthContext from '../context/AuthContext.jsx';
import AppContext from '../context/AppContext.jsx';
import ChatBox from './ChatBox.jsx';

const Spinner = (t) => (
  <>
    <span role="status" className="spinner-grow text-primary" />
    {t('process.loading')}
  </>
);

const MainPage = () => {
  const [isFulfilled, setFulfilledStatus] = useState(false);
  const { getCurrentStore, getAuthHeader } = useContext(AppContext);
  const history = useHistory();
  const { logIn } = useContext(AuthContext);
  const { authorization } = getAuthHeader();
  const { t } = useTranslation();

  useEffect(() => {
    const fetch = async () => {
      if (authorization) {
        const res = await getCurrentStore(1);
        setFulfilledStatus(res.meta.requestStatus);
        logIn();
      } else {
        history.push('/login');
      }
    };
    fetch();
  });

  return <>{isFulfilled ? ChatBox() : Spinner(t)}</>;
};

export default MainPage;
