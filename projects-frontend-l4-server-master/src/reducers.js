import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: '',
};

export const addChannel = createAction('ADD_CHANNEL');
export const addMessage = createAction('ADD_MESSAGE');
export const addChannelId = createAction('SET_ID');

export default createReducer(initialState, {
  [addChannel]: (state, action) => {
      console.log(state);
    state.channels.push(action.payload);
  },

  [addMessage]: (state, action) => {
    state.messages.push(action.payload);
  },

  [addChannelId]: (state, action) => {
    state.currentChannelId = action.payload;
  },
})
