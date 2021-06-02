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

const { chatPagePath, loginPagePath, signupPagePath } = routes;

const getAuthHeader = () => {
  const userLoginData = JSON.parse(localStorage.getItem('userLoginData'));
  return userLoginData?.token
    ? { Authorization: `Bearer ${userLoginData.token}` } : {};
};

const storeKey = 'ThemeSwitch';
const primaryStoreKey = localStorage.getItem(storeKey);
const ThemePrivider = ({ children }) => {
  const [theme, setTheme] = useState(primaryStoreKey ?? 'light');

  useEffect(() => {
    localStorage.setItem(storeKey, theme);
    if (theme === 'light') {
      return document.body.classList.remove('dark-theme');
    }
    return document.body.classList.add('dark-theme');
  }, [theme, storeKey]);

  const switchTheme = () => setTheme(() => (theme === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('userLoginData'));
  const [user, setUser] = useState(userData ? { username: userData.username } : null);

  const logIn = (userLoginData) => {
    localStorage.setItem('userLoginData', JSON.stringify(userLoginData));
    setUser({ username: userLoginData.username });
  };

  const logOut = () => {
    localStorage.removeItem('userLoginData');
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
    <ThemePrivider>
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
    </ThemePrivider>
  </AuthProvider>
);

export default App;
