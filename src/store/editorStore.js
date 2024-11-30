import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoFile: null,
  startTime: 0,
  endTime: 0,
  overlays: [],
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setVideoFile: (state, action) => {
      state.videoFile = action.payload;
    },
    setTrimTimes: (state, action) => {
      const { start, end } = action.payload;
      state.startTime = start;
      state.endTime = end;
    },
    addOverlay: (state, action) => {
      state.overlays.push(action.payload);
    },
    updateOverlay: (state, action) => {
      const { id, changes } = action.payload;
      const overlay = state.overlays.find((o) => o.id === id);
      if (overlay) {
        Object.assign(overlay, changes);
      }
    },
    removeOverlay: (state, action) => {
      const { id } = action.payload;
      state.overlays = state.overlays.filter((o) => o.id !== id);
    },
    resetState: () => initialState, 
  },
});

export const {
  setVideoFile,
  setTrimTimes,
  addOverlay,
  updateOverlay,
  removeOverlay,
  resetState, 
} = editorSlice.actions;

export default editorSlice.reducer;
