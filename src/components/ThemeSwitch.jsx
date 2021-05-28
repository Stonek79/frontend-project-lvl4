import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ThemeSwitch = ({ storeKey = 'ThemeSwitch' }) => {
  const [theme, setTheme] = useState(localStorage.getItem(storeKey) === 'light' || 'dark');

  useEffect(() => {
    localStorage.setItem(storeKey, theme);
  }, [theme, storeKey]);

  const { t } = useTranslation();

  const darkModeSwitch = () => {
    document.body.classList.toggle('dark-theme');
    setTheme((mode) => (mode === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button className="d-flex ml-2" variant={theme === 'light' ? 'primary' : 'dark'} onClick={darkModeSwitch}>
      {' '}
      <span>{(theme === 'dark' ? <>🌜</> : <>🌞</>)}</span>
    </Button>
  );
};

export default ThemeSwitch;
