import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button, Card, Form, FormControl, FormGroup, FormLabel,
} from 'react-bootstrap';

import routes from '../routes.js';
import AuthContext from '../context/AuthContext.jsx';
import { itemsLength } from '../constants';
import signup from '../../assets/images/signup.jpg';
import ThemeContext from '../context/ThemeContext.jsx';

const { minLength, minPassLength, maxLength } = itemsLength;

const SignupPage = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { logIn } = useContext(AuthContext);
  const history = useHistory();

  const nameInput = useRef();
  useEffect(() => {
    nameInput.current.focus();
  }, [nameInput]);

  const validationSchema = Yup.object({
    username: Yup.string().trim()
      .min(minLength, 'errors.length')
      .max(maxLength, 'errors.length')
      .required('errors.required'),
    password: Yup.string().trim()
      .min(minPassLength, 'errors.passMin')
      .max(maxLength, 'errors.passMax')
      .required('errors.required'),
    passwordConfirm: Yup.string().trim()
      .oneOf([Yup.ref('password'), null], 'errors.confirm')
      .min(minPassLength, 'errors.passMin')
      .required('errors.required'),
  });

  const getError = (e) => {
    if (e.response.status === 409) {
      return 'errors.exist';
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
      passwordConfirm: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit: async (value, { setErrors }) => {
      const { chatPagePath, signupPath } = routes;
      try {
        const { username, password } = value;
        const { data } = await axios.post(signupPath(), { username, password });
        logIn(data);
        history.push(chatPagePath());
      } catch (err) {
        console.log(err);
        nameInput.current.select();
        setErrors({ username: ' ', password: ' ', passwordConfirm: getError(err) });
      }
    },
  });

  return (
    <div className="container-fluid flex-grow-1">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-xl-8 col-xxl-6">
          <Card id="signUp" className={`shadow-sm bg-${theme === 'light' ? '' : 'dark'}`}>
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={signup} width="300" height="300" alt="Boommm" />
              </div>
              <Form className="w-50" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">{t('register.registry')}</h1>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    ref={nameInput}
                    type="text"
                    id="username"
                    name="username"
                    className={`${theme === 'light' ? '' : 'bg-dark text-white'}`}
                    autoComplete="username"
                    placeholder={t('register.username')}
                    required
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={formik.touched.username && Boolean(formik.errors.username)}
                  />
                  <FormLabel className="form-label" htmlFor="username">{t('register.username')}</FormLabel>
                  <Form.Control.Feedback type="invalid">
                    {formik.touched.username
                      && Boolean(formik.errors.username)
                      && t(formik.errors.username)}
                  </Form.Control.Feedback>
                </FormGroup>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    type="password"
                    id="password"
                    name="password"
                    className={`${theme === 'light' ? '' : 'bg-dark text-white'}`}
                    autoComplete="current-password"
                    placeholder={t('register.password')}
                    required
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={formik.touched.password && Boolean(formik.errors.password)}
                  />
                  <FormLabel className="form-label" htmlFor="password">{t('register.password')}</FormLabel>
                  <Form.Control.Feedback type="invalid">
                    {formik.touched.password
                      && Boolean(formik.errors.password)
                      && t(formik.errors.password)}
                  </Form.Control.Feedback>
                </FormGroup>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    className={`${theme === 'light' ? '' : 'bg-dark text-white'}`}
                    autoComplete="password-confirm"
                    placeholder={t('register.confirm')}
                    required
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.passwordConfirm}
                    isInvalid={
                      formik.touched.passwordConfirm
                      && Boolean(formik.errors.passwordConfirm)
                    }
                  />
                  <FormLabel className="form-label" htmlFor="passwordConfirm">{t('register.confirm')}</FormLabel>
                  <Form.Control.Feedback type="invalid">
                    {formik.touched.passwordConfirm
                      && Boolean(formik.errors.passwordConfirm)
                      && t(formik.errors.passwordConfirm)}
                  </Form.Control.Feedback>
                </FormGroup>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('register.toSignup')}</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
