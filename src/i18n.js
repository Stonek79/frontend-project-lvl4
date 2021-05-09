// @ts-check

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources/resources.js';

i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    debug: false,
    resources,
    react: {
      useSuspense: false,
      wait: false,
    },
  });

export default i18n;
