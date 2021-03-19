import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';

const Buttons = ({
    name,
    removable,
    btnClass,
    handleRemoveButton,
    handleRenameButton,
    handleChangeChannel
}) => 
!removable ? 
  <Button variant={btnClass} className={`nav-link btn-block mb-2 text-left btn`} onClick={handleChangeChannel}>{name}</Button>
  :
    <Dropdown>
    <Button variant={btnClass} style={{width: "85%"}} onClick={handleChangeChannel}>{name}</Button>
    <Dropdown.Toggle split variant={btnClass} id="dropdown-split-basic" />
    <Dropdown.Menu>
        <Dropdown.Item href="#/action-1" onClick={handleRemoveButton}>Remove</Dropdown.Item>
        <Dropdown.Item href="#/action-2" onClick={handleRenameButton}>Rename</Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>

export default Buttons;

//доработать кнопку, убрать костыль с разделением