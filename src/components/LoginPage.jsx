import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import {
  Button, Form, FormGroup, FormControl, FormLabel,
} from 'react-bootstrap';

import AuthContext from '../context/AuthContext.jsx';
import routes from '../routes.js';

console.log('LoginPage enter');
// const generateSubmit = ({
//   history,
//   location,
//   logIn,
//   t,
// }) => async (value, { setErrors }) => {
//   const { loginPath } = routes;
//   try {
//     const { data } = await axios.post(loginPath(), value);
//     const { token, username } = data;
//     localStorage.setItem('userId', JSON.stringify({ token, username }));
//     logIn();
//     const { from } = location.state || { from: { pathname: '/' } };
//     history.replace(from);
//   } catch (err) {
//     console.log(err);
//     setErrors({ password: t('errors.logError') });
//   }
// };

const LoginPage = () => {
  console.log('LoginPage');
  const { t } = useTranslation();
  console.log('After useTranslation');
  const { logIn } = useContext(AuthContext);
  const history = useHistory();
  // const location = useLocation();
  const nameInput = useRef(null);

  useEffect(() => {
    nameInput.current.focus();
  }, [nameInput]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (value, { setErrors }) => {
      const { loginPath } = routes;
      try {
        const { data } = await axios.post(loginPath(), value);
        const { token, username } = data;
        localStorage.setItem('userId', JSON.stringify({ token, username }));
        logIn();
        // const { from } = location.state || { from: { pathname: '/' } };
        // history.replace(from);
        // history.push('/');
      } catch (err) {
        console.log(err);
        setErrors({ password: t('errors.logError') });
      }
    },
  });

  console.log('LoginPage return');
  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-4">
        <Form className="p-3" onSubmit={formik.handleSubmit}>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="username">{t('login.nickname')}</FormLabel>
            <FormControl
              ref={nameInput}
              type="text"
              id="username"
              name="username"
              className="form-control"
              autoComplete="username"
              required
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </FormGroup>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="password">{t('login.password')}</FormLabel>
            <FormControl
              type="password"
              id="password"
              name="password"
              className="form-control"
              autoComplete="current-password"
              required
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <FormGroup className="text-danger">{formik.errors.password}</FormGroup>
          </FormGroup>
          <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('login.logIn')}</Button>
          <div className="d-flex flex-column align-items-center">
            <span className="small mb-2">{t('login.noAccount')}</span>
            <NavLink to="/signup">{t('login.signup')}</NavLink>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
