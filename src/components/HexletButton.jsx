import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HexletButton = () => {
  console.log('HexletButton 1');
  const { t } = useTranslation();

  console.log('HexletButton 2');
  return (
    <Navbar.Brand
      className="mr-auto"
      as={Link}
      to="/"
    >
      {t('hexletChat')}
    </Navbar.Brand>
  );
};

export default HexletButton;
