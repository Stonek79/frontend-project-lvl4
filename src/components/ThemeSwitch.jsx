import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ThemeSwitch = ({ storeKey = 'ThemeSwitch' }) => {
  const [active, setActive] = useState(localStorage.getItem(storeKey) === 'true' || false);

  useEffect(() => {
    localStorage.setItem(storeKey, active);
  }, [active, storeKey]);

  const { t } = useTranslation();

  const darkModeSwitcher = () => {
    document.body.classList.toggle('dark-theme');
    setActive((a) => !a);
  };
  return (
    <>
      <Button className="d-flex ml-2" variant={active ? 'light' : 'dark'} onClick={darkModeSwitcher}>
        {' '}
        <span>{t(active ? 'theme.light' : 'theme.dark')}</span>
      </Button>
    </>
  );
};

export default ThemeSwitch;
