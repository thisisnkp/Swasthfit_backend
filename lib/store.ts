import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import gymOwnerReducer from './features/auth/gymOwnerSlice';

const rootReducer = combineReducers({
  owner: gymOwnerReducer,
});

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = configureStore({
    reducer: {
      owner: persistedReducer,
      
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, 
      }),
  })

 

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
export const persistor = persistStore(makeStore);
