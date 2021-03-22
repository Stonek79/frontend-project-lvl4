import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Form, FormControl, FormGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import routes from '../routes';

const generateSubmit = ({ closeModal, dispatch }) => async (value) => {
  const { channelsPath } = routes;
  await axios.post(channelsPath(), {
    data: {
      attributes: {
        name: value.body,
      },
    },
  });
  dispatch(closeModal());
};

const Add = (props) => {
  const { closeModal, isOpen, dispatch } = props;

  const formik = useFormik({ initialValues: { body: '' }, onSubmit: generateSubmit(props) });
  
  const textInput = useRef();
  useEffect(() => {
    setTimeout(() => {
      textInput.current.select();
    }, 1)
  }, [textInput]);
  
  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
      <Modal.Footer>
        <Button variant="secondary" type="cancel" onClick={() => dispatch(closeModal())}>Cancel</Button>
        <Button variant="primary" type="submit" onClick={formik.handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Add;
