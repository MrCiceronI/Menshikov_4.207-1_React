// src/store/authSlice.js

// Импорт необходимых функций из Redux Toolkit для создания слайса и асинхронных действий
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // HTTP-клиент для выполнения запросов к API

// Константа базового URL API сервера (используется для всех запросов)
const API_URL = 'http://localhost:3001';

// Асинхронные действия (thunks) ===============================================

/**
 * Асинхронное действие для входа пользователя в систему
 * @param {Object} credentials - Объект с данными пользователя
 * @param {string} credentials.email - Email пользователя
 * @param {string} credentials.password - Пароль пользователя
 * @returns {Promise} - Возвращает данные пользователя при успехе или ошибку при неудаче
 */
export const loginUser = createAsyncThunk(
  'auth/login', // Уникальный строковый идентификатор действия
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Выполняем GET-запрос к API для поиска пользователя по email
      const { data } = await axios.get(`${API_URL}/users?email=${email}`);
      
      // Проверяем условия:
      // 1. Существует ли пользователь (data.length > 0)
      // 2. Совпадает ли введенный пароль с паролем пользователя
      if (data.length === 0 || data[0].password !== password) {
        // Если условия не выполнены, выбрасываем ошибку
        throw new Error('Invalid credentials');
      }
      // Проверяем, не заблокирован ли пользователь
      if (data[0].isBlocked) {
        throw new Error('User is blocked');
      }
      // Возвращаем данные найденного пользователя
      return data[0];
    } catch (error) {
      // В случае ошибки возвращаем её сообщение через rejectWithValue
      // Это позволяет передать ошибку в состояние Redux
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для регистрации нового пользователя
 * @param {Object} userData - Данные нового пользователя (email, password, имя и т.д.)
 * @returns {Promise} - Возвращает данные созданного пользователя или ошибку
 */
export const registerUser = createAsyncThunk(
  'auth/register', // Уникальный идентификатор действия
  async (userData, { rejectWithValue }) => {
    try {
      // Выполняем POST-запрос для создания нового пользователя
      const { data } = await axios.post(`${API_URL}/users`, userData);
      // Возвращаем данные созданного пользователя
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для обновления профиля пользователя
 * @param {Object} params - Параметры обновления
 * @param {number} params.id - ID пользователя
 * @param {Object} params.userData - Новые данные пользователя
 * @returns {Promise} - Возвращает обновленные данные пользователя или ошибку
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, ...userData }, { rejectWithValue, getState }) => {
    try {
      // Получаем текущее состояние Redux, чтобы взять данные текущего пользователя
      const currentUser = getState().auth.user;
      
      // Формируем объект с обновленными данными:
      // - Сохраняем все текущие данные пользователя
      // - Добавляем новые данные из userData
      // - Если пароль не передан, оставляем старый пароль
      const updatedData = {
        ...currentUser,
        ...userData,
        password: userData.password || currentUser.password
      };

      // Выполняем PUT-запрос для обновления данных пользователя
      const { data } = await axios.put(`${API_URL}/users/${id}`, updatedData);
      // Возвращаем обновленные данные
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

// Действия для работы с отзывами ==============================================

/**
 * Асинхронное действие для получения списка всех отзывов
 * @returns {Promise} - Возвращает массив отзывов или ошибку
 */
export const fetchFeedbacks = createAsyncThunk(
  'auth/fetchFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      // Выполняем GET-запрос для получения всех отзывов
      const { data } = await axios.get(`${API_URL}/feedbacks`);
      // Возвращаем полученные отзывы
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для добавления нового отзыва
 * @param {Object} feedbackData - Данные отзыва (текст, автор и т.д.)
 * @returns {Promise} - Возвращает созданный отзыв или ошибку
 */
export const addFeedback = createAsyncThunk(
  'auth/addFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      // Выполняем POST-запрос для создания нового отзыва
      const { data } = await axios.post(`${API_URL}/feedbacks`, feedbackData);
      // Возвращаем созданный отзыв
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для удаления отзыва
 * @param {number} id - ID отзыва, который нужно удалить
 * @returns {Promise} - Возвращает ID удаленного отзыва или ошибку
 */
export const deleteFeedback = createAsyncThunk(
  'auth/deleteFeedback',
  async (id, { rejectWithValue }) => {
    try {
      // Выполняем DELETE-запрос для удаления отзыва
      await axios.delete(`${API_URL}/feedbacks/${id}`);
      // Возвращаем ID удаленного отзыва (для обновления состояния)
      return id;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для получения списка всех пользователей
 * @returns {Promise} - Возвращает массив пользователей или ошибку
 */
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Выполняем GET-запрос для получения всех пользователей
      const { data } = await axios.get(`${API_URL}/users`);
      // Возвращаем полученные данные
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для обновления роли пользователя
 * @param {Object} params - Параметры обновления
 * @param {number} params.id - ID пользователя
 * @param {string} params.role - Новая роль пользователя
 * @returns {Promise} - Возвращает обновленные данные пользователя или ошибку
 */
export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      // Выполняем PATCH-запрос для частичного обновления (меняем только роль)
      const { data } = await axios.patch(`${API_URL}/users/${id}`, { role });
      // Возвращаем обновленные данные пользователя
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для получения пользователей с пагинацией
 * @param {number} page - Номер текущей страницы
 * @returns {Promise} - Возвращает объект с пользователями и данными пагинации
 */
export const fetchUsersPaginated = createAsyncThunk(
  'auth/fetchUsersPaginated',
  async (page, { rejectWithValue }) => {
    try {
      // Задаем количество элементов на странице
      const perPage = 20;
      // Получаем всех пользователей (в данном случае без серверной пагинации)
      const allUsersResponse = await axios.get(`${API_URL}/users`);
      const totalItems = allUsersResponse.data.length;
      
      // Формируем объект с данными:
      // - Список пользователей
      // - Метаданные пагинации
      return {
        users: allUsersResponse.data,
        pagination: {
          currentPage: page, // Текущая страница
          totalPages: Math.ceil(totalItems / perPage), // Общее количество страниц
          totalItems, // Общее количество пользователей
          perPage // Элементов на странице
        }
      };
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для получения отзывов с пагинацией
 * @param {number} page - Номер текущей страницы
 * @returns {Promise} - Возвращает объект с отзывами и данными пагинации
 */
export const fetchFeedbacksPaginated = createAsyncThunk(
  'auth/fetchFeedbacksPaginated',
  async (page, { rejectWithValue }) => {
    try {
      // Задаем количество элементов на странице
      const perPage = 20;
      // Получаем все отзывы (без серверной пагинации)
      const allFeedbacksResponse = await axios.get(`${API_URL}/feedbacks`);
      const totalItems = allFeedbacksResponse.data.length;
      
      // Формируем объект с данными:
      // - Список отзывов
      // - Метаданные пагинации
      return {
        feedbacks: allFeedbacksResponse.data,
        pagination: {
          currentPage: page, // Текущая страница
          totalPages: Math.ceil(totalItems / perPage), // Общее количество страниц
          totalItems, // Общее количество отзывов
          perPage // Элементов на странице
        }
      };
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Асинхронное действие для блокировки/разблокировки пользователя
 * @param {Object} params - Параметры
 * @param {number} params.id - ID пользователя
 * @param {boolean} params.isBlocked - Статус блокировки
 * @returns {Promise} - Возвращает обновленные данные пользователя или ошибку
 */
export const blockUser = createAsyncThunk(
  'auth/blockUser',
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try {
      // Выполняем PATCH-запрос для обновления статуса блокировки
      const { data } = await axios.patch(`${API_URL}/users/${id}`, { isBlocked });
      // Возвращаем обновленные данные пользователя
      return data;
    } catch (error) {
      // В случае ошибки возвращаем её сообщение
      return rejectWithValue(error.message);
    }
  }
);

// Создание слайса аутентификации ==============================================

// Создаем слайс для управления состоянием аутентификации
const authSlice = createSlice({
  name: 'auth', // Уникальное имя слайса
  initialState: {
    // Флаг авторизации: true, если в localStorage есть данные
    isLoggedIn: !!localStorage.getItem('auth'),
    // Данные текущего пользователя из localStorage или null
    user: JSON.parse(localStorage.getItem('auth')) || null,
    // Массив для хранения списка отзывов
    feedbacks: [],
    // Массив для хранения списка пользователей (для админ-панели)
    users: [],
    // Объект для хранения данных пагинации пользователей
    usersPagination: {
      currentPage: 1, // Текущая страница
      totalPages: 1, // Общее количество страниц
      totalItems: 0, // Общее количество пользователей
      perPage: 20 // Элементов на странице
    },
    // Объект для хранения данных пагинации отзывов
    feedbacksPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 20
    },
    // Флаг блокировки текущего пользователя
    isBlocked: false,
    // Флаг загрузки данных пользователей
    loadingUsers: false,
    // Флаг загрузки данных отзывов
    loadingFeedbacks: false,
    // Общий флаг загрузки (для авторизации, регистрации и т.д.)
    loading: false,
    // Сообщение об ошибке (если есть)
    error: null
  },
  reducers: {
    // Синхронное действие для выхода из системы
    logout: (state) => {
      // Сбрасываем флаг авторизации
      state.isLoggedIn = false;
      // Удаляем данные пользователя
      state.user = null;
      // Очищаем localStorage
      localStorage.removeItem('auth');
    }
  },
  // Обработчики асинхронных действий (extraReducers)
  extraReducers: (builder) => {
    builder
      // Обработчики для loginUser
      .addCase(loginUser.pending, (state) => {
        // Устанавливаем флаг загрузки
        state.loading = true;
        // Сбрасываем сообщение об ошибке
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // Сбрасываем флаг загрузки
        state.loading = false;
        // Устанавливаем флаг авторизации
        state.isLoggedIn = true;
        // Сохраняем данные пользователя
        state.user = action.payload;
        // Сохраняем данные в localStorage
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        // Сбрасываем флаг загрузки
        state.loading = false;
        // Сохраняем сообщение об ошибке
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
      
      // Обработчик для updateProfile
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Обновляем данные текущего пользователя
        state.user = action.payload;
        // Сохраняем обновленные данные в localStorage
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      
      // Обработчик для fetchFeedbacks
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        // Сохраняем полученные отзывы в состояние
        state.feedbacks = action.payload;
      })
      
      // Обработчик для addFeedback
      .addCase(addFeedback.fulfilled, (state, action) => {
        // Добавляем новый отзыв в массив отзывов
        state.feedbacks.push(action.payload);
      })
      
      // Обработчик для deleteFeedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        // Удаляем отзыв из массива по ID
        state.feedbacks = state.feedbacks.filter(f => f.id !== action.payload);
      })
      
      // Обработчик для fetchUsers
      .addCase(fetchUsers.fulfilled, (state, action) => {
        // Сохраняем полученных пользователей
        state.users = action.payload;
      })
      
      // Обработчик для updateUserRole
      .addCase(updateUserRole.fulfilled, (state, action) => {
        // Находим индекс пользователя в массиве
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          // Обновляем данные пользователя в массиве
          state.users[index] = action.payload;
        }
        // Если обновляется текущий пользователь, обновляем его данные
        if (state.user?.id === action.payload.id) {
          state.user = action.payload;
          localStorage.setItem('auth', JSON.stringify(action.payload));
        }
      })
      
      // Обработчики для fetchUsersPaginated
      .addCase(fetchUsersPaginated.pending, (state) => {
        // Устанавливаем флаг загрузки пользователей
        state.loadingUsers = true;
      })
      .addCase(fetchUsersPaginated.fulfilled, (state, action) => {
        // Сбрасываем флаг загрузки
        state.loadingUsers = false;
        // Обновляем список пользователей
        state.users = action.payload.users;
        // Обновляем данные пагинации
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUsersPaginated.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload;
      })
      
      // Обработчики для fetchFeedbacksPaginated
      .addCase(fetchFeedbacksPaginated.pending, (state) => {
        // Устанавливаем флаг загрузки отзывов
        state.loadingFeedbacks = true;
      })
      .addCase(fetchFeedbacksPaginated.fulfilled, (state, action) => {
        // Сбрасываем флаг загрузки
        state.loadingFeedbacks = false;
        // Обновляем список отзывов
        state.feedbacks = action.payload.feedbacks;
        // Обновляем данные пагинации
        state.feedbacksPagination = action.payload.pagination;
      })
      .addCase(fetchFeedbacksPaginated.rejected, (state, action) => {
        state.loadingFeedbacks = false;
        state.error = action.payload;
      })
      
      // Обработчик для blockUser
      .addCase(blockUser.fulfilled, (state, action) => {
        // Находим индекс пользователя в массиве
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          // Обновляем данные пользователя
          state.users[index] = action.payload;
        }
        // Если заблокирован текущий пользователь, выполняем logout
        if (state.user?.id === action.payload.id && action.payload.isBlocked) {
          state.isLoggedIn = false;
          state.user = null;
          localStorage.removeItem('auth');
        }
      });
  }
});

// Экспорт =====================================================================

// Экспортируем синхронное действие logout для использования в компонентах
export const { logout } = authSlice.actions;
// Экспортируем редьюсер слайса для подключения к Redux store
export default authSlice.reducer;