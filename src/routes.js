// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  currentData: () => [host, prefix, 'data'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'),
  signupPath: () => [host, prefix, 'signup'].join('/'),

  // вопрос о необходимости вот этих роутов:
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelsPath: () => [host, prefix, 'channels'].join('/'),
};
