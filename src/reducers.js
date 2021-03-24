import { combineReducers, createSlice } from "@reduxjs/toolkit";

const chatReducers = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      state.channels.push(action.payload);
    },
  
    addChannelId(state, action) {
      state.currentChannelId = action.payload;
    },

    removeChannel(state, action) {
      state.channels = state.channels.filter((ch) => ch.id !== action.payload);
    },

    renameChannel(state, action) {
      const { id, attributes: { name } } = action.payload;
      state.channels.map((channel) => channel.id === id ? channel.name = name : channel);
    }
  },
});

const messageReducers = createSlice({
  name: 'message',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },

  extraReducers: {
    [chatReducers.actions.removeChannel]: (state, action) => {
      state.messages = state.messages.filter((m) => m.channelId !== action.payload);
    },
  },
});

const modalReducers = createSlice({
  name: 'modal',
  initialState: {
    isOpen: false,
    type: null,
    channelId: null,
  },
  reducers: {
    openModal(state, action) {
      const { type, id } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.channelId = id;
    },

    closeModal(state) {
      state.isOpen = false;
      state.type = null;
      state.channelId = null;
    },
  },
});

export default combineReducers({
  chat: chatReducers.reducer,
  modal: modalReducers.reducer,
  message: messageReducers.reducer,
});

export const { 
  addChannel,
  addChannelId, 
  removeChannel, 
  renameChannel 
} = chatReducers.actions;

export const { openModal, closeModal } = modalReducers.actions;
export const { addMessage } = messageReducers.actions;