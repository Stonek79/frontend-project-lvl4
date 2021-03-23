import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

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
    style={{width: "95%", margin: "5px"}}
    className={`text-left`}
    onClick={handleChangeChannel}>
    {name}
  </Button>
  :
    <Dropdown style={{width: "95%", margin: "5px"}} as={ButtonGroup}>
        <Button
          style={{width: "85%"}}
          variant={btnClass}
          className={`text-left`}
          onClick={handleChangeChannel}>
          {name}
        </Button>
      <Dropdown.Toggle split variant={btnClass} style={{width: "15%"}}/>
        <Dropdown.Menu variant={btnClass} className={`flex-grow-0`} title="">
            <Dropdown.Item href="#/remove"  onClick={handleRemoveButton}>Remove</Dropdown.Item>
            <Dropdown.Item href="#/rename"  onClick={handleRenameButton}>Rename</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

export default Buttons;
