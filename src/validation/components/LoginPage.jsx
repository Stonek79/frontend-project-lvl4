import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormGroup, FormControl, FormLabel,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../context/Auth.jsx';
import routes from '../../routes.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const auth = useAuth();
  const nameInput = useRef(null);

  useEffect(() => {
    nameInput.current.focus();
  }, [nameInput]);

  const generateSubmit = () => async (value, { setErrors }) => {
    const { loginPath } = routes;
    try {
      const { token, username } = await axios.post(loginPath(), value);
      localStorage.setItem('userId', JSON.stringify({ token, username }));
      auth.logIn(true, username);
      console.log(auth, 'login');
      history.push('/');
    } catch (err) {
      console.log(err);
      setErrors({ password: t('errors.logError') });
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: generateSubmit(),
  });

  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-4">
        <Form className="p-3" onSubmit={formik.handleSubmit}>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="username">{t('login.nickname')}</FormLabel>
            <FormControl
              ref={nameInput}
              name="username"
              autoComplete="username"
              required
              id="username"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </FormGroup>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="password">{t('login.password')}</FormLabel>
            <FormControl
              name="password"
              autoComplete="current-password"
              required
              id="password"
              className="form-control"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <FormGroup className="text-danger">{formik.errors.password}</FormGroup>
          </FormGroup>
          <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('login.logIn')}</Button>
          <div className="d-flex flex-column align-items-center">
            <span className="small mb-2">{t('login.noAccount')}</span>
            <a href="/signup">{t('login.signup')}</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
