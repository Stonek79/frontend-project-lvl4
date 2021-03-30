import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Button, Form, FormControl, FormGroup, Modal,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import routes from '../routes';

const generateRename = ({
  closeModal,
  dispatch,
  channels,
}, channelId) => async (value, { setStatus }) => {
  const { channelPath } = routes;
  const cNames = channels.map((ch) => ch.name);

  try {
    if (cNames.includes(value.body)) {
      setStatus('Channel name already exist. Choose anothe channel name.');
    } else {
      setStatus('Renaming in process');
      await axios.patch(channelPath(channelId), {
        data: {
          attributes: {
            name: value.body.trim(),
          },
        },
      });
      setStatus('done');
      dispatch(closeModal());
    }
  } catch (err) {
    setStatus(`Sorry, some ${err.message}, try later`);
  }
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
              disabled={formik.isSubmitting}
              maxLength={20}
            />
          </FormGroup>
        </Form>
        <FormGroup className="text-danger">{formik.status}</FormGroup>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" type="cancel" onClick={() => dispatch(closeModal())} disabled={formik.isSubmitting}>Cancel</Button>
        <Button variant="primary" type="submit" onClick={formik.handleSubmit} disabled={!formik.values.body.trim() || formik.isSubmitting}>
          {formik.status === 'Renaming in process'
            ? (
              <span className="spinner-border spinner-border" role="status" aria-hidden="true" />
            )
            : 'Rename channel'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Rename;
