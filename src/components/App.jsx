import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';

import MainPage from './MainPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import authContext from '../context/index.jsx';

const AuthProvider = ({ children }) => {
  const url = window.location.origin;
  const socket = io(url);
  const [loggedIn, setLoggedIn] = useState({ isLogged: false, user: '' });

  const logIn = (status, name) => setLoggedIn({ isLogged: status, user: name });
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn({ isLogged: false, user: '' });
  };

  return (
    <authContext.Provider value={{
      loggedIn, logIn, logOut, socket,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const OutButton = () => {
  const auth = useContext(authContext);
  const { t } = useTranslation();

  return (
    auth.loggedIn.isLogged
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

const HexletButton = () => {
  const { t } = useTranslation();
  return (
    <Navbar.Brand
      className="mr-auto"
      as={Link}
      to="/"
    >
      {t('hexletChat')}
    </Navbar.Brand>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar className="mb-3 bg-light expand-lg">
          <HexletButton />
          <OutButton />
        </Navbar>

        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
