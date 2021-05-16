import React, { useContext } from 'react';
import { Navbar as NavbarBootstrap, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import routes from '../routes.js';

const HexletButton = () => {
  const { t } = useTranslation();

  return (
    <NavbarBootstrap.Brand className="mr-auto" as={Link} to={routes.mainpage()}>
      {t('hexletChat')}
    </NavbarBootstrap.Brand>
  );
};

const LogOutButton = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  return (
    auth.loggedIn
      && (
      <Button onClick={auth.logOut} as={Link} to={routes.login()}>
        {t('mainPage.logOut')}
      </Button>
      )
  );
};

const Navbar = () => (
  <NavbarBootstrap className="mb-3 bg-light expand-lg">
    <HexletButton />
    <LogOutButton />
  </NavbarBootstrap>
);

export default Navbar;
