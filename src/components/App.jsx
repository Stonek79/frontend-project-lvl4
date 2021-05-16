/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react';
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

const getAuthHeader = () => {
  const userLoginData = JSON.parse(localStorage.getItem('userLoginData'));
  if (userLoginData && userLoginData.token) {
    return { authorization: { Authorization: `Bearer ${userLoginData.token}` } };
  }

  return {};
};

const AuthProvider = ({ children }) => {
  const getStorageUserData = localStorage.getItem('userLoginData');
  const userData = getStorageUserData ? JSON.parse(getStorageUserData) : false;
  const [loggedIn, setLoggedIn] = useState(userData);

  const logIn = ({ token, username }) => {
    localStorage.setItem('userLoginData', JSON.stringify({ token, username }));
    setLoggedIn({ token, username });
  };

  const logOut = () => {
    localStorage.removeItem('userLoginData');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      getAuthHeader, loggedIn, logIn, logOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRout = ({ children, ...props }) => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <Route
      {...props}
      render={() => (
        loggedIn ? (children) : (<Redirect to={routes.login()} />)
      )}
    />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar />

        <Switch>
          <Route path={routes.login()}>
            <LoginPage />
          </Route>
          <Route path={routes.signup()}>
            <SignupPage />
          </Route>
          <PrivateRout exact path={routes.mainpage()}>
            <ChatPage />
          </PrivateRout>
        </Switch>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
