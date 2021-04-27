import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button, Form, FormControl, FormGroup, FormLabel,
} from 'react-bootstrap';

import routes from '../routes.js';
import AuthContext from '../context/AuthContext.jsx';
import { itemsLength } from '../constants';

const { minLength, minPassLength, maxLength } = itemsLength;
const generateSignup = ({ history, logIn, t }) => async (value, { setErrors }) => {
  const { signupPath } = routes;
  try {
    const { data } = await axios.post(signupPath(), value);
    const { token, username } = data;
    localStorage.setItem('userId', JSON.stringify({ token, username }));
    logIn();
    history.push('/');
  } catch (err) {
    setErrors({ passwordConfirm: t('errors.exist') });
  }
};
const validationSchema = (t) => Yup.object({
  username: Yup.string().trim()
    .min(minLength, t('errors.length'))
    .max(maxLength, t('errors.length'))
    .required(t('errors.required')),
  password: Yup.string().trim()
    .min(minPassLength, t('errors.passMin'))
    .max(maxLength, t('errors.passMax'))
    .required(t('errors.required')),
  passwordConfirm: Yup.string().trim()
    .oneOf([Yup.ref('password'), null], t('errors.confirm'))
    .required(t('errors.required')),
});

const SignupPage = () => {
  const { t } = useTranslation();
  const { logIn } = useContext(AuthContext);
  const history = useHistory();

  const nameInput = useRef();
  useEffect(() => {
    nameInput.current.focus();
  }, [nameInput]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    // validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: validationSchema(t),
    onSubmit: generateSignup({ history, logIn, t }),
  });

  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-4">
        <Form className="p-3" onSubmit={formik.handleSubmit}>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="username">{t('register.username')}</FormLabel>
            <FormControl
              isInvalid={formik.errors.username}
              ref={nameInput}
              placeholder={t('placeholders.nickMin')}
              name="username"
              required
              id="username"
              className="form-control"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            <FormGroup className="text-danger small">{formik.errors.username}</FormGroup>
          </FormGroup>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="password">{t('register.password')}</FormLabel>
            <FormControl
              isInvalid={formik.errors.password}
              placeholder={t('placeholders.passMin')}
              name="password"
              autoComplete="current-password"
              required
              id="password"
              className="form-control"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <FormGroup className="text-danger small">{formik.errors.password}</FormGroup>
          </FormGroup>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="password">{t('register.confirm')}</FormLabel>
            <FormControl
              isInvalid={formik.errors.passwordConfirm}
              placeholder={t('placeholders.passConfirm')}
              name="passwordConfirm"
              autoComplete="password-confirm"
              required
              id="passwordConfirm"
              className="form-control"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
            />
            <FormGroup className="text-danger small">{formik.errors.passwordConfirm}</FormGroup>
          </FormGroup>
          <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('register.toSignup')}</Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
