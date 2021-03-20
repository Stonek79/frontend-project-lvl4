import React from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

const Buttons = ({
    name,
    removable,
    btnClass,
    handleRemoveButton,
    handleRenameButton,
    handleChangeChannel
}) => 
!removable ? 
  <Button 
    variant={btnClass}
    style={{width: "100%", margin: "5px"}}
    className={`text-left`}
    onClick={handleChangeChannel}>
    {name}
  </Button>
  :
    <ButtonGroup style={{width: "100%"}} className={"d-flex mb-2 dropdown btn-group"}>
        <Button variant={btnClass} className={`flex-grow-1 text-left`} onClick={handleChangeChannel}>{name}</Button>

        <DropdownButton variant={btnClass} className={`flex-grow-0`} title="">
            <Dropdown.Item href="#/remove"  onClick={handleRemoveButton}>Remove</Dropdown.Item>
            <Dropdown.Item href="#/rename"  onClick={handleRenameButton}>Rename</Dropdown.Item>
        </DropdownButton>
    </ButtonGroup>

export default Buttons;
