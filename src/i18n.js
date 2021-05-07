import i18n from 'i18next';

import resources from './resources/resources.js';

i18n
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
