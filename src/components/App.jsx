/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import Navbar from './Navbar.jsx';
import SignupPage from './SignupPage.jsx';
import routes from '../routes.js';

const { chatPagePath, loginPagePath, signupPagePath } = routes;

const getAuthHeader = () => {
  const userLoginData = JSON.parse(localStorage.getItem('userLoginData'));
  return userLoginData?.token
    ? { Authorization: `Bearer ${userLoginData.token}` } : {};
};

const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('userLoginData'));
  const [user, setUser] = useState(userData ? userData.username : false);

  const logIn = (userLoginData) => {
    localStorage.setItem('userLoginData', JSON.stringify(userLoginData));
    setUser(userLoginData.username);
  };

  const logOut = () => {
    localStorage.removeItem('userLoginData');
    setUser(false);
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
  const location = useLocation();
  const { from } = location.state || { from: { pathname: loginPagePath() } };

  return (
    <Route
      {...props}
      render={() => (
        user ? (children) : (<Redirect to={from} />)
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
  </AuthProvider>
);

export default App;
