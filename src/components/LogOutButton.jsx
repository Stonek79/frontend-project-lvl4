import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';

const LogOutButton = () => {
  console.log('App LogOutButton 1');
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  console.log('App LogOutButton 2');
  return (
    auth.loggedIn
      ? (
        <Button
          onClick={auth.logOut}
          as={Link}
          to="/login"
        >
          {t('mainPage.logOut')}
        </Button>
      ) : null
  );
};

export default LogOutButton;
