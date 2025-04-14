// src/components/Menu/Menu.jsx
// Импорт React и необходимых зависимостей
import React from 'react';
import './Menu.css'; // Локальные стили компонента

// Импорт компонентов Material-UI
import { 
  Drawer,       // Боковая выдвижная панель
  List,         // Контейнер для списка
  ListItem,     // Элемент списка
  ListItemIcon, // Обертка для иконки
  ListItemText  // Текст элемента
} from '@mui/material';

// Импорт иконок из Material-UI
import { Home, Code } from '@mui/icons-material';
import FeedbackIcon from '@mui/icons-material/Feedback';

// Импорт компонентов маршрутизации и контекста
import { Link } from 'react-router-dom'; // Для навигации между страницами
import { useTheme } from '../../context/ThemeContext'; // Доступ к теме приложения
import { useSelector } from 'react-redux'; // Доступ к Redux store

/**
 * Компонент бокового меню приложения
 * 
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Флаг открытого состояния меню
 * @param {Function} props.onClose - Функция закрытия меню
 * @returns {JSX.Element} - Возвращает JSX разметку меню
 */
const Menu = ({ isOpen, onClose }) => {
  // Получаем текущую тему из контекста
  const { isDarkMode } = useTheme();
  
  // Проверяем статус авторизации пользователя
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  // Массив лабораторных работ с иконками
  const labs = [
    { id: 1, title: "Лабораторная 1", icon: <Code /> },
    { id: 2, title: "Лабораторная 2", icon: <Code /> },
    { id: 3, title: "Лабораторная 3", icon: <Code /> },
    { id: 4, title: "Лабораторная 4", icon: <Code /> },
    { id: 5, title: "Лабораторная 5", icon: <Code /> },
    { id: 6, title: "Лабораторная 6", icon: <Code /> },
    { id: 7, title: "Лабораторная 7", icon: <Code /> },
    { id: 8, title: "Лабораторная 8", icon: <Code /> },
    { id: 9, title: "Лабораторная 9", icon: <Code /> }
  ];

  return (
    /**
     * Компонент Drawer создает боковую панель
     * PaperProps позволяет кастомизировать стили панели
     */
    <Drawer 
      open={isOpen}       // Управление видимостью
      onClose={onClose}   // Обработчик закрытия
      PaperProps={{
        style: {
          // Динамические стили в зависимости от темы
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
          width: 250 // Фиксированная ширина меню
        }
      }}
    >
      {/* Контейнер для элементов меню */}
      <List>
        {/* Пункт меню "Главная" */}
        <ListItem 
          button           // Делает элемент кликабельным
          component={Link} // Используем как ссылку
          to="/"          // Ссылка на главную
          onClick={onClose} // Закрываем меню при клике
          style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
        >
          <ListItemIcon>
            <Home style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
          </ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>

        {/* Условный рендеринг для авторизованных пользователей */}
        {isLoggedIn && (
          <ListItem 
            button
            component={Link}
            to="/feedback"
            onClick={onClose}
            style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
          >
            <ListItemIcon>
              <FeedbackIcon style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            </ListItemIcon>
            <ListItemText primary="Обратная связь" />
          </ListItem>
        )}

        {/* Динамическое создание пунктов меню для лабораторных */}
        {labs.map((lab) => (
          <ListItem 
            button
            component={Link}
            to={`/lab/${lab.id}`}
            key={lab.id} // Уникальный ключ для React
            onClick={onClose}
            style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
          >
            <ListItemIcon
              style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
            >
              {lab.icon}
            </ListItemIcon>
            <ListItemText primary={lab.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Menu;