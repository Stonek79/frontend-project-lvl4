import CreateChannel from './CreateChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const modals = {
  adding: CreateChannel,
  removing: RemoveChannel,
  renaming: RenameChannel,
};

export default (modalName) => modals[modalName];
