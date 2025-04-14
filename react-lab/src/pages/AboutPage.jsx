// src/pages/AboutPage.jsx
// Импорт необходимых библиотек и компонентов
import React from 'react';
// Компоненты Material-UI для создания интерфейса
import { 
  Container, // Контейнер с ограниченной шириной
  Typography, // Текст с заданными стилями
  Box, // Блочный контейнер для компоновки
  Paper, // Компонент-обертка с эффектом "бумаги"
  Avatar // Компонент для отображения аватара
} from '@mui/material';
// Кастомный контекст темы
import { useTheme } from '../context/ThemeContext';

// Компонент страницы "О себе"
const AboutPage = () => {
  // Получаем информацию о текущей теме
  const { isDarkMode } = useTheme();

  return (
    // Основной контейнер страницы с максимальной шириной 'md' и вертикальными отступами
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Блок-обертка в стиле бумаги с тенью */}
      <Paper 
        elevation={3} // Уровень тени
        sx={{ 
          p: 4, // Внутренние отступы
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон зависит от темы
          color: isDarkMode ? '#ffffff' : '#000000' // Цвет текста зависит от темы
        }}
      >
        {/* Контейнер для заголовка и аватара с центрированием */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 4 // Отступ снизу
        }}>
          {/* Аватар пользователя */}
          <Avatar 
            src="/path/to/avatar.jpg" // Путь к изображению аватара
            sx={{ width: 150, height: 150, mb: 2 }} // Размеры и отступ
          />
          {/* Заголовок страницы */}
          <Typography variant="h4" component="h1" gutterBottom>
            О себе
          </Typography>
        </Box>

        {/* Основной текст страницы */}
        <Typography variant="body1" paragraph>
          Привет! Меня зовут Сергей Меньшиков 4.207-1, я разработчик этого приложения.
        </Typography>
        
        {/* Второй абзац текста */}
        <Typography variant="body1" paragraph>
          Это приложение создано для демонстрации лабораторных работ по React и включает в себя:
        </Typography>
        
        {/* Список возможностей приложения */}
        <ul>
          <li><Typography variant="body1">Систему авторизации</Typography></li>
          <li><Typography variant="body1">Темную и светлую тему</Typography></li>
          <li><Typography variant="body1">Обратную связь</Typography></li>
          <li><Typography variant="body1">Адаптивный интерфейс</Typography></li>
        </ul>
      </Paper>
    </Container>
  );
};

export default AboutPage;