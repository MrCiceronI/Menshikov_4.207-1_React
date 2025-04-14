// src/components/Header/Header.jsx
// Импорт необходимых библиотек и компонентов
import React from 'react';
// Компоненты Material-UI для создания интерфейса
import { 
  AppBar, // Верхняя навигационная панель
  Toolbar, // Контейнер для элементов внутри AppBar
  Typography, // Текст с заданными стилями
  IconButton, // Кнопка с иконкой
  Box, // Блочный контейнер для компоновки
  useMediaQuery, // Хук для медиазапросов
  Button // Кнопка
} from '@mui/material';
// Иконки из Material-UI
import MenuIcon from '@mui/icons-material/Menu'; // Иконка меню
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Иконка темной темы
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Иконка светлой темы
// Кастомный контекст темы
import { useTheme } from '../../context/ThemeContext';
// Компонент профиля пользователя
import UserProfile from '../User/UserProfile';
// Redux хуки для работы с состоянием
import { useSelector } from 'react-redux';
// Компонент для навигации
import { Link } from 'react-router-dom';

// Компонент Header принимает пропс onMenuToggle для управления боковым меню
const Header = ({ onMenuToggle }) => {
  // Получаем данные о текущей теме и функцию для ее переключения
  const { isDarkMode, toggleTheme } = useTheme();
  // Проверяем, авторизован ли пользователь через Redux
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  // Получаем объект темы для доступа к breakpoints
  const { theme } = useTheme();
  // Определяем, является ли устройство мобильным (ширина меньше 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    // AppBar - верхняя панель с динамическим цветом фона в зависимости от темы
    <AppBar 
      position="static" // Фиксированное позиционирование
      className="header" // CSS класс
      style={{
        backgroundColor: isDarkMode ? '#1e1e1e' : '#1976d2' // Цвет фона зависит от темы
      }}
    >
      {/* Toolbar - контейнер для содержимого AppBar */}
      <Toolbar>
        {/* Кнопка меню (отображается всегда) */}
        <IconButton
          edge="start" // Выравнивание к началу
          color="inherit" // Наследует цвет от родителя
          aria-label="menu" // Доступное описание
          onClick={onMenuToggle} // Обработчик клика (передан из родителя)
        >
          <MenuIcon /> {/* Иконка меню */}
        </IconButton>

        {/* Заголовок/логотип приложения */}
        <Typography 
          variant={isMobile ? "h6" : "h5"} // Размер шрифта зависит от устройства
          component={Link} // Рендерится как ссылка
          to="/" // Ссылка на главную страницу
          sx={{ 
            flexGrow: 1, // Занимает все доступное пространство
            textDecoration: 'none', // Убирает подчеркивание
            color: 'inherit' // Наследует цвет текста
          }}
        >
          Лабораторные работы по React
        </Typography>

        {/* Блок с навигацией (отображается только на десктопе) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Кнопка "О себе" */}
            <Button 
              component={Link} // Рендерится как ссылка
              to="/about" // Ссылка на страницу "О себе"
              color="inherit" // Наследует цвет
            >
              О себе
            </Button>
          </Box>
        )}

        {/* Кнопка переключения темы */}
        <IconButton 
          color="inherit" // Наследует цвет
          onClick={toggleTheme} // Обработчик переключения темы
          sx={{ ml: 2 }} // Отступ слева
        >
          {/* Показываем соответствующую иконку в зависимости от темы */}
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        
        {/* Компонент профиля пользователя (отображается если пользователь авторизован) */}
        {isLoggedIn && <UserProfile />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;