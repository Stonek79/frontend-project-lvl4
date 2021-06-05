const darkMode = {
  dark: 'dark',
  darkThemeStyle: 'dark-theme',
  light: 'light',
  lightThemeBtnPic: '🌜',
  darkThemeBtnPic: '🌞',
  white: 'white',
};

const inputItemsLength = {
  maxLength: 20,
  messageMax: 400,
  minLength: 3,
  minPassLength: 6,
};

const localStorageKeys = {
  themeMode: 'themeMode',
  loggedUserData: 'loggedUserData',
};

const modalTypes = {
  add: 'adding',
  remove: 'removing',
  rename: 'renaming',
};

const socketActions = {
  connect: 'connect',
  newChannel: 'newChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
  newMessage: 'newMessage',
};

export {
  darkMode,
  inputItemsLength,
  localStorageKeys,
  modalTypes,
  socketActions,
};
