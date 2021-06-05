/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import Navbar from './Navbar.jsx';
import SignupPage from './SignupPage.jsx';
import routes from '../routes.js';
import ModalComponent from './Modal.jsx';
import ThemeContext from '../context/ThemeContext.jsx';
import { darkMode, localStorageKeys } from '../constants.js';

const getAuthHeader = () => {
  const loggedUser = JSON.parse(localStorage.getItem(localStorageKeys.loggedUserData));
  return loggedUser?.token
    ? { Authorization: `Bearer ${loggedUser.token}` } : {};
};

const ThemeProvider = ({ children }) => {
  const primaryThemeMode = localStorage.getItem(localStorageKeys.themeMode);
  const [theme, setTheme] = useState(primaryThemeMode ?? darkMode.light);

  useEffect(() => {
    localStorage.setItem(localStorageKeys.themeMode, theme);
    if (theme === darkMode.light) {
      return document.body.classList.remove(darkMode.darkThemeStyle);
    }
    return document.body.classList.add(darkMode.darkThemeStyle);
  }, [theme]);

  const switchTheme = () => setTheme(() => (theme === darkMode.light
    ? darkMode.dark : darkMode.light));

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem(localStorageKeys.loggedUserData));
  const [user, setUser] = useState(userData ? { username: userData.username } : null);

  const logIn = (loggedUser) => {
    localStorage.setItem(localStorageKeys.loggedUserData, JSON.stringify(loggedUser));
    setUser({ username: loggedUser.username });
  };

  const logOut = () => {
    localStorage.removeItem(localStorageKeys.loggedUserData);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      getAuthHeader, user, logIn, logOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children, ...props }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...props}
      render={({ location }) => (user
        ? children
        : (<Redirect to={{ pathname: routes.loginPagePath(), state: { from: location } }} />))}
    />
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar />

          <Switch>
            <Route path={routes.loginPagePath()}>
              <LoginPage />
            </Route>
            <Route path={routes.signupPagePath()}>
              <SignupPage />
            </Route>
            <PrivateRoute exact path={routes.chatPagePath()}>
              <ChatPage />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
      <ModalComponent />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
