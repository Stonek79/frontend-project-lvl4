import React, { useContext } from 'react';
import { Navbar as NavbarBootstrap, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import routes from '../routes.js';
import ThemeSwitch from './ThemeSwitch.jsx';

const { chatPagePath, loginPagePath } = routes;

const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  return (
    <NavbarBootstrap className="mb-3 bg-light expand-lg">
      <NavbarBootstrap.Brand className="mr-auto" as={Link} to={chatPagePath()}>
        {t('hexletChat')}
      </NavbarBootstrap.Brand>
      <>
        {auth.user
        && (
        <Button onClick={auth.logOut} as={Link} to={loginPagePath()}>
          {t('mainPage.logOut')}
        </Button>
        )}
      </>
      <ThemeSwitch />
    </NavbarBootstrap>
  );
};

export default Navbar;
