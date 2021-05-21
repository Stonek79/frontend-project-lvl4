const itemsLength = {
  maxLength: 20,
  messageMax: 400,
  minLength: 3,
  minPassLength: 6,
};

const modalTypes = {
  add: 'adding',
  remove: 'removing',
  rename: 'renaming',
};

const actions = {
  newChannel: 'newChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
  newMessage: 'newMessage',
};

export { actions, itemsLength, modalTypes };
