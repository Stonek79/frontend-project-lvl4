/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, ButtonGroup, Dropdown,
} from 'react-bootstrap';

const ChannelItem = ({
  name,
  removable,
  isPrimary,
  handleRemoveButton,
  handleRenameButton,
  handleChangeChannel,
}) => (!removable
  ? (
    <li className="nav-item">
      <Button
        variant={isPrimary ? 'primary' : 'light'}
        className="nav-link btn-block text-left mb-2"
        onClick={handleChangeChannel}
      >
        {name}
      </Button>
    </li>
  )
  : (
    <li className="nav-item">
      <Dropdown className="d-flex mb-2 text-left" as={ButtonGroup}>
        <Button
          variant={isPrimary ? 'primary' : 'light'}
          className="flex-grow-1 text-left nav-link"
          onClick={handleChangeChannel}
        >
          {name}
        </Button>
        <Dropdown.Toggle split variant={isPrimary ? 'primary' : 'light'} className="flex-grow-0 text-left nav-link" />
        <Dropdown.Menu variant={isPrimary ? 'primary' : 'light'} title="">
          <Dropdown.Item onClick={handleRemoveButton}>Remove</Dropdown.Item>
          <Dropdown.Item onClick={handleRenameButton}>Rename</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  ));

export default ChannelItem;
