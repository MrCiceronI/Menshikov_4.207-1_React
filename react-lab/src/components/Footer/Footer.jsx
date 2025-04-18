// src/components/Footer/Footer.jsx
// Импорт необходимых библиотек и компонентов
import React from 'react';
// Компоненты Material-UI для создания интерфейса
import { 
  Box, // Блочный контейнер для компоновки
  Typography, // Текст с заданными стилями
  IconButton, // Кнопка с иконкой
  Tooltip, // Всплывающая подсказка
  useMediaQuery, // Хук для медиазапросов
  useTheme // Хук для доступа к теме MUI
} from '@mui/material';
// Кастомный контекст темы (переименован во избежание конфликта имен)
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
// Иконки из Material-UI
import FeedbackIcon from '@mui/icons-material/Feedback'; // Иконка обратной связи
import GitHubIcon from '@mui/icons-material/GitHub'; // Иконка GitHub
// Redux хуки для работы с состоянием
import { useSelector } from 'react-redux';
// Хук для навигации
import { useNavigate } from 'react-router-dom';

// Компонент подвала сайта
const Footer = () => {
  // Получаем информацию о текущей теме из кастомного контекста
  const { isDarkMode } = useCustomTheme();
  // Получаем тему Material-UI
  const theme = useTheme();
  // Определяем, является ли устройство мобильным (ширина меньше 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Проверяем, авторизован ли пользователь через Redux
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  // Хук для программной навигации
  const navigate = useNavigate();

  // Обработчик клика по кнопке обратной связи
  const handleFeedbackClick = () => {
    // Логика открытия формы обратной связи
    if (isLoggedIn) {
      navigate('/feedback'); // Перенаправляем на страницу feedback если пользователь авторизован
    }
    // Можно добавить else с обработкой случая неавторизованного пользователя
  };

  // Обработчик клика по кнопке GitHub
  const handleGitHubClick = () => {
    // Открываем репозиторий проекта в новой вкладке
    window.open('https://github.com/MrCiceronI/Menshikov_4.207-1_React', '_blank');
  };

  if (isMobile) return null;

  return (
    // Основной контейнер подвала
    <Box 
      sx={{ 
        backgroundColor: isDarkMode ? '#1e1e1e' : '#1976d2', // Фон зависит от темы
        color: '#ffffff', // Белый цвет текста
        py: 2, // Вертикальные отступы
        px: isMobile ? 1 : 4 // Горизонтальные отступы зависят от устройства
      }}
    >
      {/* Внутренний контейнер с содержимым подвала */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row', // Направление flex зависит от устройства
          justifyContent: 'space-between', // Распределение пространства между элементами
          alignItems: 'center', // Выравнивание по центру
          gap: isMobile ? 2 : 0 // Отступ между элементами
        }}
      >
        {/* Текст копирайта */}
        <Typography variant="body2">
          © 2025 Лабораторные работы по React
        </Typography>

        {/* Контейнер с кнопками действий */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Кнопка обратной связи с подсказкой */}
          <Tooltip title="Обратная связь">
            <IconButton 
              color="inherit" // Наследует цвет от родителя
              onClick={handleFeedbackClick}
            >
              <FeedbackIcon />
            </IconButton>
          </Tooltip>
          
          {/* Кнопка GitHub с подсказкой */}
          <Tooltip title="GitHub репозиторий">
            <IconButton 
              color="inherit" // Наследует цвет от родителя
              onClick={handleGitHubClick}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;