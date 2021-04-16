import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import charactersLength from '../constants';
import locales from '../locales/locales';
import { fetchCreateChannel } from '../slices/services';

const { minLength, maxLength } = charactersLength;
const { number: { max, min }, mixed: { netError, notOneOf, required } } = locales;

const generateSubmit = ({
  close,
  dispatch,
  t,
}) => async (value, { setErrors }) => {
  const res = await dispatch(fetchCreateChannel(value.channelName.trim()));

  return res.error ? setErrors({ channelName: t(`errors.${netError}`) }) : close();
};

const spinnerComponent = (name, t) => (
  <>
    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
    { t(name) }
  </>
);
const CreateChannel = ({ close, channels }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = (channelsNames) => Yup.object({
    channelName: Yup.string().trim()
      .min(minLength, t(`errors.${min}`)(minLength))
      .max(maxLength, t(`errors.${max}`)(maxLength))
      .notOneOf(channelsNames, t(`errors.${notOneOf}`))
      .required(required),
  });
  const channelsNames = channels.map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      channelName: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema(channelsNames),
    onSubmit: generateSubmit({ close, dispatch, t }),
  });

  const isError = formik.errors.channelName === t(`errors.${netError}`);
  const textInput = useRef();
  useEffect(() => {
    textInput.current.select();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('titles.createChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              isInvalid={isError}
              ref={textInput}
              name="channelName"
              required
              value={formik.values.channelName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              maxLength={17}
            />
          </InputGroup>
        </Form>
        <FormGroup
          className={isError ? 'text-danger' : 'text-info'}
        >
          {formik.errors.channelName}
        </FormGroup>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          variant="secondary"
          type="cancel"
          onClick={close}
          disabled={formik.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? spinnerComponent('buttons.process.creating', t) : t('buttons.create')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default CreateChannel;
