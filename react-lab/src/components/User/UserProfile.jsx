// src/components/User/UserProfile.jsx
// Импорт необходимых зависимостей
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки
import { logout } from '../../store/authSlice'; // Экшен для выхода
// Компоненты Material-UI
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Avatar,
  ListItemText
} from '@mui/material';
import { useState } from 'react'; // Хук состояния
import { useTheme } from '../../context/ThemeContext'; // Контекст темы
import { Link } from 'react-router-dom'; // Компонент для навигации

const UserProfile = () => {
  // Redux хуки для работы с хранилищем
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user); // Данные пользователя
  
  // Состояние для управления выпадающим меню
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl); // Флаг открытия меню
  
  // Получаем текущую тему
  const { isDarkMode } = useTheme();

  // Обработчик открытия меню
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Устанавливаем якорь для меню
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    setAnchorEl(null); // Сбрасываем якорь
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logout()); // Диспатч экшена выхода
    handleClose(); // Закрываем меню
  };

  return (
    <>
      {/* Кнопка-аватар пользователя */}
      <IconButton 
        onClick={handleClick}
        aria-controls="user-menu" // ID меню для доступности
        aria-haspopup="true" // Указывает, что есть выпадающее меню
        aria-expanded={open ? 'true' : undefined} // Состояние меню для доступности
        sx={{ ml: 1 }} // Стиль - отступ слева
      >
        {/* Аватар с первой буквой email пользователя */}
        <Avatar>
          {user?.email?.charAt(0).toUpperCase() || 'U'} {/* Заглавная буква или 'U' */}
        </Avatar>
      </IconButton>
      
      {/* Выпадающее меню пользователя */}
      <Menu
        anchorEl={anchorEl} // Элемент, к которому привязано меню
        open={open} // Флаг видимости
        onClose={handleClose} // Обработчик закрытия
        MenuListProps={{
          'aria-labelledby': 'user-button', // Для доступности
        }}
        PaperProps={{
          style: {
            // Стили меню в зависимости от темы
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          }
        }}
      >
        {/* Заголовок меню с email пользователя */}
        <MenuItem disabled> {/* Не кликабельный элемент */}
          <Typography variant="body2">
            {user?.email || 'Пользователь'}
          </Typography>
        </MenuItem>

        {/* Пункт меню для перехода в профиль */}
        <MenuItem 
          component={Link} 
          to="/profile" 
          onClick={handleClose}
        >
          <ListItemText>Профиль</ListItemText>
        </MenuItem>

        {/* Пункт меню для выхода */}
        <MenuItem onClick={handleLogout}>
          <ListItemText>Выйти</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;