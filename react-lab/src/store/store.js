// src/store/store.js
// Импорт функции configureStore из Redux Toolkit
// configureStore упрощает создание Redux-хранилища с хорошими настройками по умолчанию
import { configureStore } from '@reduxjs/toolkit';

// Импорт редьюсеров из отдельных слайсов
import counterReducer from './counterSlice'; // Редьюсер для счетчика (пример)
import authReducer from './authSlice';      // Редьюсер для аутентификации

// Создание и экспорт Redux-хранилища
export const store = configureStore({
  // Объект reducer, который объединяет все редьюсеры приложения
  reducer: {
    counter: counterReducer, // Состояние счетчика будет доступно под ключом 'counter'
    auth: authReducer        // Состояние аутентификации под ключом 'auth'
  }
});