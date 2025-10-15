import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { login, logout, authReducer, setUser } from "./slice/authSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const ENCRYPTION_KEY = 'my-secret-key';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
  };

  const rootReducer = combineReducers({
    auth: authReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  
});

export const persistor = persistStore(store);

export { login, logout, setUser };
