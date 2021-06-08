import React, { useContext } from 'react';
import {
  Navbar as NavbarBootstrap, Button, Container, Nav,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { darkMode } from '../constants.js';

import AuthContext from '../context/AuthContext.jsx';
import ThemeContext from '../context/ThemeContext.jsx';
import routes from '../routes.js';

const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { theme, switchTheme } = useContext(ThemeContext);

  return (
    <NavbarBootstrap id="nav" className={`shadow-sm navbar-expand-lg bg-${theme === darkMode.light ? darkMode.white : darkMode.dark}`}>
      <Container>
        <NavbarBootstrap.Brand
          className={`mr-auto text-${theme === darkMode.light ? darkMode.dark : darkMode.white}`}
          as={Link}
          to={routes.chatPagePath()}
        >
          {t('hexletChat')}
        </NavbarBootstrap.Brand>
        <Nav>
          {auth.user && (<Button variant="outline-primary" onClick={auth.logOut}>{t('mainPage.logOut')}</Button>)}
          <Button
            className="d-flex ms-2"
            variant="outline-primary"
            onClick={() => switchTheme(theme === darkMode.light ? darkMode.dark : darkMode.light)}
          >
            {' '}
            <span>
              {(theme === darkMode.light
                ? darkMode.lightThemeBtnPic : darkMode.darkThemeBtnPic)}
            </span>
          </Button>
        </Nav>
      </Container>
    </NavbarBootstrap>
  );
};

export default Navbar;
