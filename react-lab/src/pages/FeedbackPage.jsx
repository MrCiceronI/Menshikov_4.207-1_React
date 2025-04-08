// src/pages/FeedbackPage.jsx
// Импорт основных зависимостей
import React from 'react';
import { Container } from '@mui/material'; // Контейнер для ограничения ширины контента

// Импорт компонентов обратной связи
import FeedbackForm from '../components/Feedback/FeedbackForm'; // Форма отправки фидбэка
import FeedbackList from '../components/Feedback/FeedbackList'; // Список отзывов

/**
 * Страница обратной связи
 * 
 * Объединяет:
 * - Форму для отправки нового отзыва
 * - Список существующих отзывов
 * 
 * Особенности:
 * - Использует Material-UI Container для адаптивного макета
 * - Имеет вертикальные отступы (padding) для лучшего визуального восприятия
 */
const FeedbackPage = () => {
  return (
    // Контейнер с максимальной шириной 'md' (960px по умолчанию в Material-UI)
    // Вертикальные отступы: py: 4 (32px в theme.spacing)
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 4, // padding-top и padding-bottom
        minHeight: 'calc(100vh - 128px)' // Минимальная высота (можно адаптировать под ваш layout)
      }}
    >
      {/* Компонент формы для отправки отзыва */}
      <FeedbackForm />
      
      {/* Компонент списка существующих отзывов */}
      <FeedbackList />
    </Container>
  );
};

export default FeedbackPage;