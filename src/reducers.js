import { createSlice } from "@reduxjs/toolkit";

const chatReducers = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: '',
  },
  reducers: {
    addChannel(state, action) {
      state.channels.push(action.payload);
    },
  
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  
    addChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
  },
})

export default chatReducers.reducer;
export const { addChannel, addMessage, addChannelId } = chatReducers.actions;
