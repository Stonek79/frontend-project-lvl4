import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FormControl, InputGroup, Modal, Spinner,
} from 'react-bootstrap';

import { darkMode, itemsLength } from '../constants.js';
import ApiContext from '../context/ApiContext.jsx';
import { setCurrentChannelId } from '../slices/channelSlice.js';
import ThemeContext from '../context/ThemeContext.jsx';

const { minLength, maxLength } = itemsLength;
const { light } = darkMode;

const CreateChannel = ({ close, channelsNames, dispatch }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { addChannel } = useContext(ApiContext);

  const formik = useFormik({
    initialValues: { channelName: '' },
    validateOnChange: false,
    validationSchema: Yup.object({
      channelName: Yup.string().trim()
        .min(minLength, 'errors.length')
        .max(maxLength, 'errors.length')
        .notOneOf(channelsNames, 'errors.uniq')
        .required('errors.required'),
    }),
    onSubmit: async (initialValues, { setErrors }) => {
      const name = initialValues.channelName.trim();
      try {
        const res = await addChannel({ name });
        const { id } = res.data;
        dispatch(setCurrentChannelId({ id }));
        close();
      } catch (err) {
        console.log(err);
        setErrors({ channelName: t(err.message === 'errors.netError' ? 'errors.netError' : 'errors.someError') });
      }
    },
  });

  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.select();
  }, [textInput]);

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
        <Button aria-label="Close" variant="secondary" className={`btn-close bg-${theme === light ? '' : light}`} onClick={close} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              ref={textInput}
              name="channelName"
              data-testid="add-channel"
              required
              placeholder={t('placeholders.addChannel')}
              maxLength={20}
              value={formik.values.channelName}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              isInvalid={formik.errors.channelName}
            />
            <Form.Control.Feedback type="invalid">{t(formik.errors.channelName)}</Form.Control.Feedback>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          type="cancel"
          variant="secondary"
          onClick={close}
          disabled={formik.isSubmitting}
        >
          {t('modals.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" role="status" />
              <span className="ms-2">{t('process.sending')}</span>
            </>
          ) : t('modals.send')}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default CreateChannel;
