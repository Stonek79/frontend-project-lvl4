const darkMode = {
  dark: 'dark',
  darkTheme: 'dark-theme',
  light: 'light',
  lightThemeBtnPic: '🌜',
  darkThemeBtnPic: '🌞',
  white: 'white',
};

const itemsLength = {
  maxLength: 20,
  messageMax: 400,
  minLength: 3,
  minPassLength: 6,
};

const localStarageKeys = {
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
  itemsLength,
  localStarageKeys,
  modalTypes,
  socketActions,
};
