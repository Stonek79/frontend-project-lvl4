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

const { chatPagePath, loginPagePath, signupPagePath } = routes;

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
      user, logIn, logOut,
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
      render={({ location }) => {
        const { from } = location.state || { from: { pathname: loginPagePath() } };
        return (user ? (children) : (<Redirect to={from} />));
      }}
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
