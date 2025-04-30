// Импорт функций createApi и fetchBaseQuery из RTK Query для создания API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Создание API с помощью createApi
export const apiSlice = createApi({
  // Уникальный путь для редьюсера в Redux store
  reducerPath: 'api',
  // Настройка базового запроса с использованием fetchBaseQuery
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }), // Базовый URL сервера
  // Определение конечных точек (endpoints) для запросов и мутаций
  endpoints: (builder) => ({
    // Запрос для получения пользователей с пагинацией
    getUsersPaginated: builder.query({
      // Функция, формирующая параметры запроса
      query: (page = 1) => ({
        url: '/users', // Эндпоинт для пользователей
        params: { _page: page, _limit: 20 }, // Параметры пагинации
      }),
      // Преобразование ответа сервера
      transformResponse: (response, meta, page) => {
        // Извлечение общего количества элементов из заголовка X-Total-Count
        const totalItems = Number(meta.response.headers.get('X-Total-Count')) || response.length;
        const perPage = 20; // Количество элементов на страницу
        return {
          users: response, // Массив пользователей
          pagination: {
            currentPage: page, // Текущая страница
            totalPages: Math.ceil(totalItems / perPage), // Общее количество страниц
            totalItems, // Общее количество элементов
            perPage, // Элементов на страницу
          },
        };
      },
    }),
    // Запрос для получения отзывов с пагинацией
    getFeedbacksPaginated: builder.query({
      // Функция, формирующая параметры запроса
      query: (page = 1) => ({
        url: '/feedbacks', // Эндпоинт для отзывов
        params: { _page: page, _limit: 20 }, // Параметры пагинации
      }),
      // Преобразование ответа сервера
      transformResponse: (response, meta, page) => {
        // Извлечение общего количества элементов из заголовка X-Total-Count
        const totalItems = Number(meta.response.headers.get('X-Total-Count')) || response.length;
        const perPage = 20; // Количество элементов на страницу
        return {
          feedbacks: response, // Массив отзывов
          pagination: {
            currentPage: page, // Текущая страница
            totalPages: Math.ceil(totalItems / perPage), // Общее количество страниц
            totalItems, // Общее количество элементов
            perPage, // Элементов на страницу
          },
        };
      },
    }),
    // Запрос для получения полного списка отзывов
    getFeedbacksList: builder.query({
      // Функция, формирующая запрос
      query: () => '/feedbacks', // Эндпоинт для всех отзывов
      // Тег для автоматической инвалидации кэша
      providesTags: ['Feedbacks'],
    }),
    // Мутация для добавления нового отзыва
    addNewFeedback: builder.mutation({
      // Функция, формирующая запрос
      query: (feedback) => ({
        url: '/feedbacks', // Эндпоинт для отзывов
        method: 'POST', // Метод запроса
        body: feedback, // Данные отзыва
      }),
      // Инвалидация кэша для обновления списка отзывов
      invalidatesTags: ['Feedbacks'],
    }),
    // Мутация для удаления отзыва
    deleteFeedback: builder.mutation({
      // Функция, формирующая запрос
      query: (id) => ({
        url: `/feedbacks/${id}`, // Эндпоинт для конкретного отзыва
        method: 'DELETE', // Метод запроса
      }),
      // Инвалидация кэша для обновления списка отзывов
      invalidatesTags: ['Feedbacks'],
    }),
  }),
});

// Экспорт хуков, сгенерированных RTK Query для использования в компонентах
export const { 
  useGetUsersPaginatedQuery, 
  useGetFeedbacksPaginatedQuery, 
  useGetFeedbacksListQuery, 
  useAddNewFeedbackMutation, 
  useDeleteFeedbackMutation 
} = apiSlice;