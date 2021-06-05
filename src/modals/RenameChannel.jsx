import React, { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FormControl, InputGroup, Modal, Spinner,
} from 'react-bootstrap';

import { darkMode, inputItemsLength } from '../constants.js';
import ApiContext from '../context/ApiContext.jsx';
import ThemeContext from '../context/ThemeContext.jsx';

const RenameChannel = ({
  close, channelId, channels, channelsNames,
}) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { renameChannel } = useContext(ApiContext);

  const { name } = channels.find((ch) => ch.id === channelId);

  const formik = useFormik({
    initialValues: { channelName: name },
    validateOnChange: false,
    validationSchema: Yup.object({
      channelName: Yup.string().trim()
        .min(inputItemsLength.minLength, 'errors.length')
        .max(inputItemsLength.maxLength, 'errors.length')
        .notOneOf(channelsNames, 'errors.uniq')
        .required('errors.required'),
    }),
    onSubmit: async (initialValues, { setErrors }) => {
      const newName = initialValues.channelName.trim();
      try {
        await renameChannel({ id: channelId, name: newName });
        close();
      } catch (err) {
        console.log(err);
        setErrors({ channelName: t(err.message === 'errors.netError' ? 'errors.netError' : 'errors.someError') });
      }
    },
  });

  const textInput = useRef();
  useEffect(() => {
    textInput.current.select();
  }, [textInput]);

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('modals.renChannel')}</Modal.Title>
        <Button
          aria-label="Close"
          variant="secondary"
          className={`btn-close bg-${theme === darkMode.light ? '' : darkMode.light}`}
          onClick={close}
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              ref={textInput}
              data-testid="rename-channel"
              name="channelName"
              required
              maxLength={14}
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

export default RenameChannel;
