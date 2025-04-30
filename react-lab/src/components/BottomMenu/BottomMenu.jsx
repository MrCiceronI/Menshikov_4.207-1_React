// Импорт React для создания компонента
import React from 'react';
// Импорт компонентов Material-UI для создания нижнего навигационного меню
import { 
  BottomNavigation, // Компонент нижней навигации
  BottomNavigationAction, // Элемент действия в навигации
  Paper, // Компонент для создания контейнера с тенью
  useMediaQuery, // Хук для проверки размеров экрана
  useTheme // Хук для доступа к теме Material-UI
} from '@mui/material';
// Импорт иконок Material-UI для пунктов меню
import { 
  Home as HomeIcon, // Иконка для главной страницы
  Feedback as FeedbackIcon, // Иконка для отзывов
  Person as ProfileIcon, // Иконка для профиля
  Info as AboutIcon, // Иконка для страницы "О себе"
  AdminPanelSettings as AdminIcon // Иконка для админ-панели
} from '@mui/icons-material';
// Импорт хуков для работы с маршрутизацией
import { Link, useLocation } from 'react-router-dom';
// Импорт хука для доступа к состоянию Redux
import { useSelector } from 'react-redux';
// Импорт кастомного хука для получения состояния темы
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

// Компонент BottomMenu отображает нижнее навигационное меню для мобильных устройств
const BottomMenu = () => {
  // Получение темы Material-UI
  const theme = useTheme();
  // Получение состояния темы (темный/светлый режим) из кастомного контекста
  const { isDarkMode } = useCustomTheme();
  // Проверка, является ли устройство мобильным (экран меньше точки 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Получение текущего маршрута из react-router-dom
  const location = useLocation();
  // Получение данных пользователя из Redux store
  const { user } = useSelector(state => state.auth);
  // Проверка, является ли пользователь администратором
  const isAdmin = user?.role === 'admin';

  // Если устройство не мобильное, компонент не рендерится
  if (!isMobile) return null;

  // Определение маршрутов для навигации
  const routes = [
    { path: '/', label: 'Главная', icon: <HomeIcon /> }, // Главная страница
    { path: '/feedback', label: 'Отзывы', icon: <FeedbackIcon /> }, // Страница отзывов
    { path: '/profile', label: 'Профиль', icon: <ProfileIcon /> }, // Страница профиля
    { path: '/about', label: 'О себе', icon: <AboutIcon /> }, // Страница "О себе"
    // Условное добавление маршрута админ-панели для администраторов
    ...(isAdmin ? [{ path: '/admin', label: 'Админ', icon: <AdminIcon /> }] : [])
  ];

  // Определение индекса текущего маршрута
  const currentRouteIndex = routes.findIndex(route => 
    location.pathname === route.path || // Точное совпадение пути
    location.pathname.startsWith(route.path + '/') // Совпадение для вложенных маршрутов
  );

  // Рендеринг компонента
  return (
    // Контейнер для нижнего меню с фиксированным позиционированием
    <Paper 
      sx={{ 
        position: 'fixed', // Фиксация внизу экрана
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, // Высокий z-index для отображения поверх других элементов
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' // Цвет фона в зависимости от темы
      }} 
      elevation={3} // Тень для визуального выделения
    >
      {/* Нижняя навигационная панель */}
      <BottomNavigation
        showLabels // Отображение текстовых меток
        value={currentRouteIndex >= 0 ? currentRouteIndex : 0} // Текущий активный пункт
        sx={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона панели
          '& .Mui-selected': { // Стили для выбранного пункта
            color: isDarkMode ? '#90caf9' : '#1976d2' // Цвет выбранного пункта
          }
        }}
      >
        {/* Рендеринг пунктов навигации */}
        {routes.map((route, index) => (
          <BottomNavigationAction
            key={index} // Уникальный ключ для каждого пункта
            label={route.label} // Текстовая метка
            icon={route.icon} // Иконка пункта
            component={Link} // Компонент Link для маршрутизации
            to={route.path} // Путь маршрута
            sx={{
              color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста и иконки
              minWidth: 'auto', // Минимальная ширина для компактности
              padding: '6px 8px' // Отступы для компактного отображения
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

// Экспорт компонента по умолчанию
export default BottomMenu;