// Импорт функции создания слайса из Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Создание слайса (slice) для функционала счетчика
export const counterSlice = createSlice({
  name: 'counter', // Уникальное имя слайса (используется в префиксе экшенов)
  
  // Начальное состояние
  initialState: {
    value: 0, // Начальное значение счетчика
  },
  
  // Объект редьюсеров (функций изменения состояния)
  reducers: {
    // Редьюсер для увеличения на 1
    increment: (state) => {
      state.value += 1; // Redux Toolkit использует Immer, поэтому можно мутировать состояние
    },
    
    // Редьюсер для уменьшения на 1
    decrement: (state) => {
      state.value -= 1;
    },
    
    // Редьюсер для увеличения на произвольное значение
    incrementByAmount: (state, action) => {
      // action.payload содержит переданное значение
      state.value += action.payload;
    },
  },
});

// Экспорт сгенерированных action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Экспорт редьюсера по умолчанию
export default counterSlice.reducer;