import React, { useContext } from 'react';
import {
  Navbar as NavbarBootstrap, Button, Container, Nav,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import routes from '../routes.js';
import ThemeSwitch from './ThemeSwitch.jsx';

const { chatPagePath } = routes;

const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  return (
    <NavbarBootstrap className="shadow-sm bg-white navbar-expand-lg">
      <Container>
        <NavbarBootstrap.Brand className="mr-auto" as={Link} to={chatPagePath()}>
          {t('hexletChat')}
        </NavbarBootstrap.Brand>
        <Nav>
          {auth.user && (<Button variant="outline-primary" onClick={auth.logOut}>{t('mainPage.logOut')}</Button>)}
          <ThemeSwitch />
        </Nav>
      </Container>
    </NavbarBootstrap>
  );
};

export default Navbar;
