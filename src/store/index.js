import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import candidateReducer from './candidateSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidates']
};

const persistedReducer = persistReducer(persistConfig, candidateReducer);

export const store = configureStore({
  reducer: {
    candidates: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
