// src/store/store.js
// Импорт функции configureStore из Redux Toolkit
// configureStore упрощает создание Redux-хранилища с хорошими настройками по умолчанию
import { configureStore } from '@reduxjs/toolkit';

// Импорт редьюсеров из отдельных слайсов
import { apiSlice } from './apiSlice';
import authReducer from './authSlice';      // Редьюсер для аутентификации

// Создание и экспорт Redux-хранилища
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});