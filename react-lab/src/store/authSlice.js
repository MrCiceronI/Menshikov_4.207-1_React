// src/store/authSlice.js
// Импорт функции createSlice из Redux Toolkit
// createSlice автоматически генерирует action creators и action types
import { createSlice } from '@reduxjs/toolkit';

// Создание слайса (slice) для управления состоянием аутентификации
const authSlice = createSlice({
  name: 'auth', // Уникальное имя слайса (используется в префиксе action types)
  
  // Начальное состояние (initial state)
  initialState: {
    isLoggedIn: false, // Флаг авторизации пользователя
    user: null,       // Данные пользователя (null когда не авторизован)
    feedbacks: []     // Массив для хранения отзывов/фидбэков пользователя
  },
  
  // Reducers - функции-редьюсеры для изменения состояния
  reducers: {
    // Редьюсер для входа пользователя (логина)
    login: (state, action) => {
      state.isLoggedIn = true; // Устанавливаем флаг авторизации в true
      state.user = action.payload; // Сохраняем данные пользователя из action.payload
      
      // Сохраняем данные в localStorage для сохранения сессии при перезагрузке
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    
    // Редьюсер для выхода пользователя (логаута)
    logout: (state) => {
      state.isLoggedIn = false; // Сбрасываем флаг авторизации
      state.user = null;        // Очищаем данные пользователя
      
      // Удаляем данные из localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    },
    
    // Редьюсер для добавления отзыва/фидбэка
    addFeedback: (state, action) => {
      // Добавляем новый фидбэк в массив feedbacks
      state.feedbacks.push(action.payload);
    }
  }
});

// Экспорт action creators (автоматически генерируются createSlice)
export const { login, logout, addFeedback } = authSlice.actions;

// Экспорт редьюсера по умолчанию
export default authSlice.reducer;