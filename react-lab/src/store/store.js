// src/store/store.js

// Импорт функции configureStore из Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Импорт редьюсера счетчика
import counterReducer from './counterSlice';

// Создание и экспорт Redux-хранилища
export const store = configureStore({
  // Объект редьюсеров, где:
  // ключ - имя ветки состояния (counter)
  // значение - редьюсер, управляющий этой веткой
  reducer: {
    counter: counterReducer,
  },
  
  // Redux Toolkit автоматически добавляет:
  // 1. Redux DevTools Extension
  // 2. Middleware (включая redux-thunk)
  // 3. Проверку на случайные мутации состояния
  // 4. Сериализацию данных
});

/*
 * Получающаяся структура состояния:
 * {
 *   counter: {
 *     value: 0
 *   }
 * }
 */