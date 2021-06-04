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
import { darkMode, localStarageKeys } from '../constants.js';

const { chatPagePath, loginPagePath, signupPagePath } = routes;
const { themeMode, loggedUserData } = localStarageKeys;
const { dark, darkTheme, light } = darkMode;

const getAuthHeader = () => {
  const loggedUser = JSON.parse(localStorage.getItem(loggedUserData));
  return loggedUser?.token
    ? { Authorization: `Bearer ${loggedUser.token}` } : {};
};

const primaryThemeMode = () => localStorage.getItem(themeMode);
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(primaryThemeMode() ?? light);

  useEffect(() => {
    localStorage.setItem(themeMode, theme);
    if (theme === light) {
      return document.body.classList.remove(darkTheme);
    }
    return document.body.classList.add(darkTheme);
  }, [theme]);

  const switchTheme = () => setTheme(() => (theme === light ? dark : light));

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem(loggedUserData));
  const [user, setUser] = useState(userData ? { username: userData.username } : null);

  const logIn = (loggedUser) => {
    localStorage.setItem(loggedUserData, JSON.stringify(loggedUser));
    setUser({ username: loggedUser.username });
  };

  const logOut = () => {
    localStorage.removeItem(loggedUserData);
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
        ? children : (<Redirect to={{ pathname: loginPagePath(), state: { from: location } }} />))}
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
            <Route path={loginPagePath()}>
              <LoginPage />
            </Route>
            <Route path={signupPagePath()}>
              <SignupPage />
            </Route>
            <PrivateRoute exact path={chatPagePath()}>
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
