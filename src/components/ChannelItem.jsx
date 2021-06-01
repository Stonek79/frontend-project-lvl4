import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, ButtonGroup, Dropdown,
} from 'react-bootstrap';

const ChannelItem = ({
  handleRemoveChannel,
  handleRenameChannel,
  handleChangeChannel,
  variant,
  channel,
}) => {
  const { t } = useTranslation();
  const { name, removable } = channel;

  return (
    <li className="nav-item">
      {
        !removable
          ? (
            <Button
              variant={variant}
              className="w-100 px-1 rounded-0 text-start"
              onClick={handleChangeChannel}
            >
              <span className="me-2">
                {'>'}
              </span>
              {name}
            </Button>
          )
          : (
            <Dropdown className="d-flex" as={ButtonGroup}>
              <Button
                variant={variant}
                className="w-100 px-1 rounded-0 text-start"
                onClick={handleChangeChannel}
              >
                <span className="me-2">
                  {'>'}
                </span>
                {name}
              </Button>
              <Dropdown.Toggle split variant={variant} className="flex-grow-0 text-left" />
              <Dropdown.Menu variant={variant} title="">
                <Dropdown.Item onClick={handleRemoveChannel}>{t('channels.remove')}</Dropdown.Item>
                <Dropdown.Item onClick={handleRenameChannel}>{t('channels.rename')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
      }
    </li>
  );
};

export default ChannelItem;
