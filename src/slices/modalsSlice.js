/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const modalReducers = createSlice({
  name: 'modalsData',
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

export const { openModal, closeModal } = modalReducers.actions;
export default modalReducers.reducer;
