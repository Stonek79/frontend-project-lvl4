import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, InputGroup, Modal,
} from 'react-bootstrap';
import axios from 'axios';
import routes from '../routes';

const generateSubmit = ({ closeModal, dispatch, channels }) => async (value, { setStatus }) => {
  const { channelsPath } = routes;
  const cNames = channels.map((ch) => ch.name);
  if (cNames.includes(value.body)) {
    setStatus('Channel name already exist. Choose anothe channel name.');
  } else {
    await axios.post(channelsPath(), {
      data: {
        attributes: {
          name: value.body.trim(),
        },
      },
    });
    dispatch(closeModal());
  }
};

const AddNewChannel = (props) => {
  const { closeModal, isOpen, dispatch } = props;

  const formik = useFormik({ initialValues: { body: '' }, onSubmit: generateSubmit(props) });

  const textInput = useRef();
  useEffect(() => {
    setTimeout(() => {
      textInput.current.select();
    }, 1);
  }, [textInput]);

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>AddNewChannel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup noValidate className="mt-auto">
            <FormControl
              ref={textInput}
              name="body"
              required
              value={formik.values.body}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              maxLength={20}
            />
          </InputGroup>
        </Form>
        <FormGroup className="text-danger">{formik.status}</FormGroup>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" type="cancel" onClick={() => dispatch(closeModal())}>Cancel</Button>
        <Button variant="primary" type="submit" onClick={formik.handleSubmit} disabled={!formik.values.body.trim()}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewChannel;
