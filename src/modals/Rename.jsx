import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, Modal,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import routes from '../routes';

const generateRename = ({ closeModal, dispatch }, channelId) => async (value) => {
  const { channelPath } = routes;

  await axios.patch(channelPath(channelId), {
    data: {
      attributes: {
        name: value.body,
      },
    },
  });
  dispatch(closeModal());
};

const Rename = (props) => {
  const { closeModal, isOpen, dispatch } = props;

  const channelId = useSelector((state) => state.modal.channelId);
  const channels = useSelector((state) => state.chat.channels);
  const currentChannal = channels.find((channel) => channel.id === channelId);
  const currentChannalId = currentChannal.id;

  const formik = useFormik({
    initialValues: {
      body: currentChannal.name,
    },
    onSubmit: generateRename(props, currentChannalId),
  });

  const textInput = useRef();
  useEffect(() => {
    setTimeout(() => {
      textInput.current.select();
    }, 1);
  }, [textInput]);

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={textInput}
              name="body"
              required
              value={formik.values.body}
              onChange={formik.handleChange}
              maxLength={20}
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" type="cancel" onClick={() => dispatch(closeModal())}>Cancel</Button>
        <Button variant="primary" type="submit" onClick={formik.handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Rename;
