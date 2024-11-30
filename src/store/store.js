import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorStore';

const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});

export default store;
