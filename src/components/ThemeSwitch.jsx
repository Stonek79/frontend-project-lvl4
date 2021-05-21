import React, {
  useRef, useEffect, useState,
} from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ThemeSwitch = ({ preserveRasters = true, storeKey = 'ThemeSwitch' }) => {
  const cssString = `
        html { filter: invert(100%); background: #fefefe; }
      `;
  const rasterCss = 'img:not([src*=".svg"]), video, [style*="url("] { filter: invert(100%) }';

  const isDeclarationSupported = (property, value) => {
    const prop = `${property}:`;
    const el = document.createElement('test');
    const mStyle = el.style;
    el.style.cssText = prop + value;
    return mStyle[property];
  };

  const supported = useRef(!!isDeclarationSupported('filter', 'invert(100%)'));

  const [css, setCss] = useState(cssString);
  const [active, setActive] = useState(localStorage.getItem(storeKey) === 'true' || false);

  useEffect(() => {
    if (preserveRasters) {
      setCss(`${cssString} ${rasterCss}`);
    }
    return () => {
      setCss(cssString);
    };
  }, [preserveRasters]);

  useEffect(() => {
    localStorage.setItem(storeKey, active);
  }, [active, storeKey]);

  const { t } = useTranslation();

  const toggle = () => setActive((a) => !a);

  return (
    supported.current && (
      <>
        <Button aria-pressed={active} className="d-flex ml-2" variant="dark" onClick={toggle}>
          {' '}
          <span aria-hidden="true">{t(active ? 'theme.light' : 'theme.dark')}</span>
        </Button>
        <style media={active ? 'screen' : 'none'}>
          {active ? css.trim() : css}
        </style>
      </>
    )
  );
};

export default ThemeSwitch;
