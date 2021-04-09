const charactersLength = {
  min: 3,
  max: 17,
  messageMax: 400,
};

const locales = {
  minMessage: (min) => `Must be at least ${min} characters`,
  maxMessage: (max) => `Must be ${max} characters or less`,
  required: 'Required fill out this field',
  netError: 'Network error',
  notOneOf: 'Channel name already exist',
};

export { charactersLength, locales };
