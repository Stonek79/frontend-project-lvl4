import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { FormControl, FormGroup, Modal } from 'react-bootstrap';
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
  
  const textInput = useRef(null);
  
  useEffect(() => {
    textInput.current.focus();
  }, [textInput]);
  
  return (
    <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Add</Modal.Title>
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

export default Add;

// проблема с автофокусом, не работает