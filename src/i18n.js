import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './resources/resources.js';

const i18n = i18next.createInstance();

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
