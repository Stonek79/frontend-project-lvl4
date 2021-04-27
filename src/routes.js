// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  signupPath: () => [host, prefix, 'signup'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'),
  currentData: () => [host, prefix, 'data'].join('/'),
};
