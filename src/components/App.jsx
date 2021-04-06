// @ts-check

import React from 'react';
import ModalComponent from './Modal.jsx';
import ChannelBox from './ChannelBox';
import MessageBox from './MessageBox';

const App = () => (
  <div className="row h-100 pb-3">
    <ChannelBox />
    <MessageBox />
    <ModalComponent />
  </div>
);

export default App;
