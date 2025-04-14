// src/store/authSlice.js
// Импорт необходимых функций из Redux Toolkit и axios для HTTP-запросов
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Базовый URL API
const API_URL = 'http://localhost:3001';

// Асинхронные действия (thunks)

// Действие для входа пользователя
export const loginUser = createAsyncThunk(
  'auth/login', // Уникальное имя действия
  async ({ email, password }, { rejectWithValue }) => { // Параметры: email и password
    try {
      // Запрос пользователя по email
      const { data } = await axios.get(`${API_URL}/users?email=${email}`);
      
      // Проверка существования пользователя и соответствия пароля
      if (data.length === 0 || data[0].password !== password) {
        throw new Error('Invalid credentials');
      }
      return data[0]; // Возвращаем данные пользователя при успехе
    } catch (error) {
      // Возвращаем ошибку через rejectWithValue
      return rejectWithValue(error.message);
    }
  }
);

// Действие для регистрации нового пользователя
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // POST-запрос для создания нового пользователя
      const { data } = await axios.post(`${API_URL}/users`, userData);
      return data; // Возвращаем созданного пользователя
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Действие для обновления профиля пользователя
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, ...userData }, { rejectWithValue, getState }) => {
    try {
      // Получаем текущего пользователя из состояния Redux
      const currentUser = getState().auth.user;
      
      // Объединяем данные, сохраняя старый пароль если новый не предоставлен
      const updatedData = {
        ...currentUser,
        ...userData,
        password: userData.password || currentUser.password
      };

      // PUT-запрос для обновления пользователя
      const { data } = await axios.put(`${API_URL}/users/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Действие для получения списка отзывов
export const fetchFeedbacks = createAsyncThunk(
  'auth/fetchFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/feedbacks`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Действие для добавления отзыва
export const addFeedback = createAsyncThunk(
  'auth/addFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/feedbacks`, feedbackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Действие для удаления отзыва
export const deleteFeedback = createAsyncThunk(
  'auth/deleteFeedback',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/feedbacks/${id}`);
      return id; // Возвращаем ID удаленного отзыва
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Создание слайса (slice) для управления состоянием аутентификации
const authSlice = createSlice({
  name: 'auth', // Имя слайса
  initialState: { // Начальное состояние
    isLoggedIn: false, // Флаг авторизации
    user: null,       // Данные пользователя
    feedbacks: [],    // Список отзывов
    loading: false,   // Флаг загрузки
    error: null       // Ошибки
  },
  reducers: {
    // Действие для выхода пользователя
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('auth'); // Очищаем localStorage
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        localStorage.setItem('auth', JSON.stringify(action.payload)); // Сохраняем в localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработчики для registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработчики для других действий
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.feedbacks.push(action.payload);
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        // Удаляем отзыв по ID
        state.feedbacks = state.feedbacks.filter(f => f.id !== action.payload);
      });
  }
});

// Экспорт действия logout и редьюсера
export const { logout } = authSlice.actions;
export default authSlice.reducer;