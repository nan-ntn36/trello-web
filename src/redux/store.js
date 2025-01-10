import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';
import { activeCardReducer } from './activeCard/activeCardSlice';
import { notificationsReducer } from './notifications/notificationsSlice';

// cấu hinh redux-persist
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootPersistConfig = {
  key: 'root', // key của persist do chúng ta chỉ định cư mặt định là root
  storage: storage, //biến storage ở trên lưu vào localstorage
  whiteList: ['user'], // định nghĩa các slice dữ liệu được phép duy trì qua mõi lần f5
  // blackList:['user'] ngược lại white list
};

// Combine các reducer trong dự an chúng ta
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
});

//thực hien persist reducer
const persistReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistReducers,
  // fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
