import AddNewChannel from './AddNewChannel.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const modals = {
  adding: AddNewChannel,
  removing: Remove,
  renaming: Rename,
};

export default (modalName) => modals[modalName];
