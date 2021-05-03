import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, ButtonGroup, Dropdown,
} from 'react-bootstrap';

const ChannelItem = ({
  handleRemoveChannel,
  handleRenameChannel,
  handleChangeChannel,
  isPrimary,
  name,
  removable,
}) => {
  const { t } = useTranslation();
  const variant = isPrimary ? 'primary' : 'light';

  return (
    !removable
      ? (
        <li className="nav-item">
          <Button
            variant={variant}
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
              variant={variant}
              className="flex-grow-1 text-left nav-link"
              onClick={handleChangeChannel}
            >
              {name}
            </Button>
            <Dropdown.Toggle split variant={variant} className="flex-grow-0 text-left nav-link" />
            <Dropdown.Menu variant={variant} title="">
              <Dropdown.Item onClick={handleRemoveChannel}>{t('channels.remove')}</Dropdown.Item>
              <Dropdown.Item onClick={handleRenameChannel}>{t('channels.rename')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      )
  );
};

export default ChannelItem;
