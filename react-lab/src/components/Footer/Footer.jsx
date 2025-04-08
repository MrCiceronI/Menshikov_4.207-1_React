// src/components/Footer/Footer.jsx
// Импорт необходимых библиотек и модулей
import React from 'react'; // Базовый импорт React
import './Footer.css'; // Стили компонента Footer
import { Box, Typography } from '@mui/material'; // Компоненты Material-UI
import { useTheme } from '../../context/ThemeContext'; // Контекст темы (темный/светлый режим)

// Компонент Footer - подвал сайта
const Footer = () => {
  // Получаем текущую тему (темный/светлый режим) из контекста
  const { isDarkMode } = useTheme();

  // Возвращаем JSX для рендеринга
  return (
    // Компонент Box из Material-UI - базовый контейнер
    <Box 
      className="footer" // CSS класс для дополнительного стилирования
      // Динамический стиль фона в зависимости от темы
      style={{ 
        backgroundColor: isDarkMode ? '#1e1e1e' : '#1976d2' 
        // Темный режим: темно-серый (#1e1e1e)
        // Светлый режим: синий Material-UI primary color (#1976d2)
      }}
    >
      {/* Компонент Typography для текста */}
      <Typography 
        variant="body2" // Вариант текста - мелкий (body2)
        color="textSecondary" // Цвет текста (переопределяется ниже)
        align="center" // Выравнивание по центру
        // Динамический цвет текста (в данном случае всегда белый)
        style={{ 
          color: isDarkMode ? '#ffffff' : '#ffffff' 
          // Заметка: здесь цвет всегда белый, независимо от темы
        }}
      >
        {/* Текст копирайта */}
        © 2025 Лабораторные работы по React
      </Typography>
    </Box>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Footer;