import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import {
  Button, Form, FormGroup, FormControl, FormLabel, Card,
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
    <div className="container-fluid flex-grow-1">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-xl-8 col-xxl-6">
          <Card id="logIn" className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div><img src="https://izent.ru/i/ps/2016/02/1454982615.jpg" width="300" height="300" alt="Boommmm" /></div>
              <Form className="w-50" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">{t('login.logIn')}</h1>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    ref={nameInput}
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    autoComplete="username"
                    required
                    placeholder={t('login.nickname')}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={formik.touched.password && Boolean(formik.errors.password)}
                  />
                  <FormLabel htmlFor="username">{t('login.nickname')}</FormLabel>
                </FormGroup>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    autoComplete="current-password"
                    required
                    placeholder={t('login.password')}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={formik.touched.password && Boolean(formik.errors.password)}
                  />
                  <FormLabel htmlFor="password">{t('login.password')}</FormLabel>
                  <FormGroup className="text-danger">{t(formik.errors.password)}</FormGroup>
                </FormGroup>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('login.logIn')}</Button>
              </Form>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex flex-column align-items-center">
                <span className="small mb-2">{t('login.noAccount')}</span>
                <NavLink to={routes.signupPagePath()}>{t('login.signup')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
