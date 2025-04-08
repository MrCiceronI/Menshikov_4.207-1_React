// src/components/Header/Header.jsx
// Импорт необходимых библиотек и модулей
import React from 'react'; // Базовый импорт React
import './Header.css'; // Стили компонента Header
// Импорт компонентов Material-UI
import { 
  AppBar, // Компонент верхней панели приложения
  Toolbar, // Контейнер для элементов панели
  Typography, // Компонент для текста
  IconButton // Кнопка с иконкой
} from '@mui/material';
// Импорт иконок из Material-UI
import MenuIcon from '@mui/icons-material/Menu'; // Иконка меню (гамбургер)
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Иконка "темная тема"
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Иконка "светлая тема"
import { useTheme } from '../../context/ThemeContext'; // Контекст темы
import UserProfile from '../User/UserProfile';
import { useSelector } from 'react-redux';

// Компонент Header - шапка приложения
const Header = ({ onMenuToggle }) => { // Принимает пропс onMenuToggle для управления меню
  // Получаем текущую тему и функцию для её переключения из контекста
  const { isDarkMode, toggleTheme } = useTheme();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  // Возвращаем JSX для рендеринга
  return (
    // AppBar - верхняя навигационная панель
    <AppBar 
      position="static" // Фиксированное позиционирование
      className="header" // CSS класс для дополнительного стилирования
      // Динамический цвет фона в зависимости от темы
      style={{ 
        backgroundColor: isDarkMode ? '#1e1e1e' : '#1976d2' 
        // Темный режим: темно-серый (#1e1e1e)
        // Светлый режим: синий Material-UI primary color (#1976d2)
      }}
    >
      {/* Toolbar - контейнер для элементов панели */}
      <Toolbar>
        {/* Кнопка меню (гамбургер) */}
        <IconButton
          edge="start" // Выравнивание к началу панели
          color="inherit" // Наследует цвет от родителя
          aria-label="menu" // Доступное описание для screen readers
          onClick={onMenuToggle} // Обработчик клика из пропсов
        >
          <MenuIcon /> {/* Иконка меню */}
        </IconButton>

        {/* Заголовок приложения */}
        <Typography 
          variant="h6" // Вариант текста - заголовок 6 уровня
          component="div" // Рендерится как div
          sx={{ flexGrow: 1 }} // Занимает все доступное пространство
        >
          Лабораторные работы по React
        </Typography>

        {/* Кнопка переключения темы */}
        <IconButton 
          color="inherit" // Наследует цвет от родителя
          onClick={toggleTheme} // Обработчик переключения темы
        >
          {/* Условный рендеринг иконки в зависимости от темы */}
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          {/* Темный режим: иконка солнца (светлая тема) */}
          {/* Светлый режим: иконка луны (темная тема) */}
        </IconButton>
        {isLoggedIn && <UserProfile />}
      </Toolbar>
    </AppBar>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Header;