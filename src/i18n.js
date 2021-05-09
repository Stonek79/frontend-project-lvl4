import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './resources/resources.js';

i18next
  .use(initReactI18next)
  .init({
    lng: 'ru',
    debug: false,
    resources,
  });

export default i18next;
