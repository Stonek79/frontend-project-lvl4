import React, { Suspense, useContext, useState } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';

console.log('App 1');
const AuthProvider = ({ children }) => {
  console.log('App AuthProvider 1');
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('userId'));

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  console.log('App AuthProvider 2');
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

const HexletButton = () => {
  console.log('App HexletButton 1');
  const { t } = useTranslation();

  console.log('App HexletButton 2');
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

const MainPage = ({ children, path }) => {
  console.log('App MainPage 1');
  const { loggedIn } = useContext(AuthContext);

  console.log('App MainPage 2');
  return (
    <Route
      path={path}
      render={() => (
        loggedIn ? (children) : (<Redirect to="/login" />)
      )}
    />
  );
};

console.log('App preApp');
const App = () => {
  console.log('App return');
  return (
    <AuthProvider>
      <Suspense fallback="loading...">
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
              <MainPage path="/">
                <ChatPage />
              </MainPage>
            </Switch>
          </div>
        </Router>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
