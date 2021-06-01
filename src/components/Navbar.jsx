import React, { useContext } from 'react';
import {
  Navbar as NavbarBootstrap, Button, Container, Nav,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import ThemeContext from '../context/ThemeContext.jsx';
import routes from '../routes.js';

const { chatPagePath } = routes;

const Navbar = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { theme, switchTheme } = useContext(ThemeContext);

  return (
    <NavbarBootstrap id="nav" className={`shadow-sm navbar-expand-lg bg-${theme === 'light' ? 'white' : 'dark'}`}>
      <Container>
        <NavbarBootstrap.Brand className={`mr-auto text-${theme === 'light' ? 'dark' : 'white'}`} as={Link} to={chatPagePath()}>
          {t('hexletChat')}
        </NavbarBootstrap.Brand>
        <Nav>
          {auth.user && (<Button variant="outline-primary" onClick={auth.logOut}>{t('mainPage.logOut')}</Button>)}
          <Button className="d-flex ms-2" variant={theme === 'light' ? 'outline-primary' : 'outline-dark'} onClick={switchTheme}>
            {' '}
            <span>{(theme === 'light' ? <>🌜</> : <>🌞</>)}</span>
          </Button>
        </Nav>
      </Container>
    </NavbarBootstrap>
  );
};

export default Navbar;
