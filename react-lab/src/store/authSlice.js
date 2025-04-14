// src/store/authSlice.js
// Импорт необходимых функций из Redux Toolkit для создания слайса и асинхронных действий
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // HTTP-клиент для запросов к API

// Базовый URL API сервера
const API_URL = 'http://localhost:3001';

// Асинхронные действия (thunks) ===============================================

/**
 * Действие для входа пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 */
export const loginUser = createAsyncThunk(
  'auth/login', // Уникальное имя типа действия
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Ищем пользователя по email (GET /users?email=...)
      const { data } = await axios.get(`${API_URL}/users?email=${email}`);
      
      // Проверяем:
      // 1. Найден ли пользователь (data.length > 0)
      // 2. Совпадает ли пароль
      if (data.length === 0 || data[0].password !== password) {
        throw new Error('Invalid credentials'); // Неверные учетные данные
      }
      return data[0]; // Возвращаем данные пользователя
    } catch (error) {
      // Передаем ошибку в состояние Redux
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Действие для регистрации нового пользователя
 * @param {object} userData - Данные нового пользователя
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Создаем нового пользователя (POST /users)
      const { data } = await axios.post(`${API_URL}/users`, userData);
      return data; // Возвращаем созданного пользователя
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Действие для обновления профиля пользователя
 * @param {number} id - ID пользователя
 * @param {object} userData - Новые данные пользователя
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, ...userData }, { rejectWithValue, getState }) => {
    try {
      // Получаем текущего пользователя из Redux состояния
      const currentUser = getState().auth.user;
      
      // Объединяем данные:
      // 1. Берем текущие данные пользователя
      // 2. Добавляем новые данные
      // 3. Если пароль не указан, оставляем старый
      const updatedData = {
        ...currentUser,
        ...userData,
        password: userData.password || currentUser.password
      };

      // Обновляем пользователя (PUT /users/:id)
      const { data } = await axios.put(`${API_URL}/users/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Действия для работы с отзывами ==============================================

/**
 * Получение списка отзывов
 */
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

/**
 * Добавление нового отзыва
 * @param {object} feedbackData - Данные отзыва
 */
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

/**
 * Удаление отзыва
 * @param {number} id - ID отзыва для удаления
 */
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

// Создание слайса аутентификации ==============================================

const authSlice = createSlice({
  name: 'auth', // Уникальное имя слайса
  initialState: { // Начальное состояние
    isLoggedIn: !!localStorage.getItem('auth'), // Флаг авторизации (проверяем localStorage)
    user: JSON.parse(localStorage.getItem('auth')) || null, // Данные пользователя
    feedbacks: [],    // Список отзывов
    loading: false,   // Флаг загрузки (показываем спиннер)
    error: null       // Ошибки (показываем пользователю)
  },
  reducers: {
    // Действие для выхода из системы
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('auth'); // Очищаем данные авторизации
    }
  },
  // Обработчики асинхронных действий
  extraReducers: (builder) => {
    builder
      // Обработчики для loginUser --------------------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;  // Показываем загрузку
        state.error = null;   // Сбрасываем ошибки
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Сохраняем ошибку
      })
      
      // Обработчики для registerUser -----------------------
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
      
      // Обработчики для других действий --------------------
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Обновляем данные пользователя
        state.user = action.payload;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        // Заполняем список отзывов
        state.feedbacks = action.payload;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        // Добавляем новый отзыв в список
        state.feedbacks.push(action.payload);
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        // Удаляем отзыв по ID (фильтруем массив)
        state.feedbacks = state.feedbacks.filter(f => f.id !== action.payload);
      });
  }
});

// Экспорт =====================================================================

// Экспортируем действие logout (для вызова в компонентах)
export const { logout } = authSlice.actions;
// Экспортируем редьюсер (для подключения в store)
export default authSlice.reducer;