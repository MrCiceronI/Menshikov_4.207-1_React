// src/store/store.js
// Импорт функции configureStore из Redux Toolkit
// configureStore упрощает создание Redux-хранилища с хорошими настройками по умолчанию
import { configureStore } from '@reduxjs/toolkit';

// Импорт редьюсеров из отдельных слайсов
import counterReducer from './counterSlice'; // Редьюсер для счетчика (пример)
import authReducer from './authSlice';      // Редьюсер для аутентификации

const loadInitialState = () => {
  const authData = localStorage.getItem('auth');
  return {
    auth: {
      ...authReducer(undefined, { type: '' }), // Получаем initialState из редьюсера
      isLoggedIn: !!authData,
      user: authData ? JSON.parse(authData) : null
    }
  };
};

// Создание и экспорт Redux-хранилища
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  },
  preloadedState: loadInitialState() // Загружаем начальное состояние
});