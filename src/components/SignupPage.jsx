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

const SignupPage = () => {
  const { t } = useTranslation();
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
        const { data } = await axios.post(signupPath(), value);
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
    <div className="row justify-content-center pt-5">
      <div className="col-sm-4">
        <Form className="p-3" onSubmit={formik.handleSubmit}>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="username">{t('register.username')}</FormLabel>
            <FormControl
              ref={nameInput}
              type="text"
              id="username"
              name="username"
              className="form-control"
              autoComplete="username"
              placeholder={t('placeholders.nickMin')}
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.username}
              isInvalid={formik.touched.username && Boolean(formik.errors.username)}
            />
            <FormGroup className="text-danger small">
              {formik.touched.username
              && Boolean(formik.errors.username)
              && t(formik.errors.username)}
            </FormGroup>
          </FormGroup>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="password">{t('register.password')}</FormLabel>
            <FormControl
              type="password"
              id="password"
              name="password"
              className="form-control"
              autoComplete="current-password"
              placeholder={t('placeholders.passMin')}
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              isInvalid={formik.touched.password && Boolean(formik.errors.password)}
            />
            <FormGroup className="text-danger small">
              {formik.touched.password
              && Boolean(formik.errors.password)
              && t(formik.errors.password)}
            </FormGroup>
          </FormGroup>
          <FormGroup className="form-group">
            <FormLabel className="form-label" htmlFor="passwordConfirm">{t('register.confirm')}</FormLabel>
            <FormControl
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              className="form-control"
              autoComplete="password-confirm"
              placeholder={t('placeholders.passConfirm')}
              required
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
              isInvalid={formik.touched.passwordConfirm && Boolean(formik.errors.passwordConfirm)}
            />
            <FormGroup className="text-danger small">
              {formik.touched.passwordConfirm
              && Boolean(formik.errors.passwordConfirm)
              && t(formik.errors.passwordConfirm)}
            </FormGroup>
          </FormGroup>
          <Button type="submit" className="w-100 mb-3" variant="outline-primary">{t('register.toSignup')}</Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
