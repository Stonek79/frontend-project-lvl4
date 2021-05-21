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

const LoginPage = () => {
  const { t } = useTranslation();
  const { logIn } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();
  const nameInput = useRef(null);

  useEffect(() => {
    nameInput.current.focus();
  }, [nameInput]);

  const getError = (e) => {
    if (e.response.status === 401) {
      return 'errors.logError';
    }
    if (e.response.statusText === 'Network Error') {
      return 'errors.netError';
    }
    return 'errors.someError';
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validateOnChange: false,
    onSubmit: async (value, { setErrors }) => {
      const { chatPagePath, loginPath } = routes;
      try {
        const { data } = await axios.post(loginPath(), value);
        logIn(data);
        const { from } = location.state || { from: { pathname: chatPagePath() } };
        history.replace(from);
      } catch (err) {
        console.log(err.response);
        nameInput.current.select();
        setErrors({ password: getError(err) });
      }
    },
  });

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
              isInvalid={formik.touched.password && Boolean(formik.errors.password)}
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
              isInvalid={formik.touched.password && Boolean(formik.errors.password)}
            />
            <FormGroup className="text-danger">{t(formik.errors.password)}</FormGroup>
          </FormGroup>
          <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('login.logIn')}</Button>
          <div className="d-flex flex-column align-items-center">
            <span className="small mb-2">{t('login.noAccount')}</span>
            <NavLink to={routes.signupPagePath()}>{t('login.signup')}</NavLink>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
