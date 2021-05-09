import React, { useContext, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AuthContext from '../context/AuthContext.jsx';
import ChatPage from './ChatPage.jsx';
import HexletButton from './HexletButton.jsx';
import LoginPage from './LoginPage.jsx';
import LogOutButton from './LogOutButton.jsx';
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
    </AuthProvider>
  );
};

export default App;
