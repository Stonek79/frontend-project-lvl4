import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import MainPage from './MainPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import AuthContext from '../context/AuthContext.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const LogOutButton = () => {
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

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
          <LogOutButton />
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
