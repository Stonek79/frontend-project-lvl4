// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  currentData: () => [host, prefix, 'data'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'),
  signupPath: () => [host, prefix, 'signup'].join('/'),
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
  chatPagePath: () => '/',
};
