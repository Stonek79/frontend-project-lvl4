/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, ButtonGroup, Dropdown,
} from 'react-bootstrap';

const ChannelItem = ({
  name,
  removable,
  btnClass,
  handleRemoveButton,
  handleRenameButton,
  handleChangeChannel,
}) => (!removable
  ? (
    <li className="nav-item">
      <Button
        variant={btnClass ? 'primary' : 'light'}
        style={{ width: '95%', margin: '5px' }}
        className="text-left"
        onClick={handleChangeChannel}
      >
        {name}
      </Button>
    </li>
  )
  : (
    <li className="nav-item">
      <Dropdown style={{ width: '95%', margin: '5px' }} as={ButtonGroup}>
        <Button
          style={{ width: '85%' }}
          variant={btnClass ? 'primary' : 'light'}
          className="text-left"
          onClick={handleChangeChannel}
        >
          {name}
        </Button>
        <Dropdown.Toggle split variant={btnClass ? 'primary' : 'light'} style={{ width: '15%' }} />
        <Dropdown.Menu variant={btnClass ? 'primary' : 'light'} className="flex-grow-0" title="">
          <Dropdown.Item onClick={handleRemoveButton}>Remove</Dropdown.Item>
          <Dropdown.Item onClick={handleRenameButton}>Rename</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  ));

export default ChannelItem;
