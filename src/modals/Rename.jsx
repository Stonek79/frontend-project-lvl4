import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { FormControl, FormGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import routes from '../routes';
import { useSelector } from 'react-redux';

const generateRename = (closeModal, channelId, dispatch) => async (value) => {
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
  const channelId = useSelector(state => state.modal.channelId);
  const channels = useSelector(state => state.chat.channels);
  const currentChannal = channels.find((channel) => channel.id === channelId);
  const currentChannalId = currentChannal.id;

  const textInput = useRef(null);

  useEffect(() => {
    textInput.current.focus();
    textInput.current.select();
  }, [textInput]);

  const formik = useFormik({
    initialValues: { body: currentChannal.name }, onSubmit: generateRename(closeModal, currentChannalId, dispatch),
  });

  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              data-testid="input-body"
              ref={textInput}
              name="body"
              required
              onBlur={formik.handleBlur}
              value={formik.values.body}
              onChange={formik.handleChange}
            />
          </FormGroup>
          <div className="d-flex justify-content-between">
            <input className="btn btn-secondary" type="button" onClick={() => dispatch(closeModal())} value="Cancel" />
            <input className="btn btn-primary" type="submit" value="Submit" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;

// проблема с автофокусом и автовыделением