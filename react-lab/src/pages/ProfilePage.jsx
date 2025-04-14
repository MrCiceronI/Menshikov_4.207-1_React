// src/pages/ProfilePage.jsx
// Импорт необходимых зависимостей
import React from 'react';
import { Container } from '@mui/material'; // Контейнер из Material-UI для центрирования контента
import ProfileForm from '../components/User/ProfileForm'; // Компонент формы профиля
import { useTheme } from '../context/ThemeContext'; // Контекст для работы с темой приложения

const ProfilePage = () => {
  // Получаем текущую тему из контекста
  const { isDarkMode } = useTheme();

  return (
    // Основной контейнер страницы
    <Container 
      maxWidth="md" // Максимальная ширина - medium (960px)
      sx={{ 
        py: 4, // Вертикальные отступы (padding-top и padding-bottom)
        minHeight: 'calc(100vh - 128px)', // Минимальная высота: 100% высоты viewport минус 128px
        backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' // Фон в зависимости от темы
      }}
    >
      {/* Встраиваем компонент формы профиля */}
      <ProfileForm />
    </Container>
  );
};

export default ProfilePage;