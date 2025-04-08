// src/components/User/UserProfile.jsx
// Импорт необходимых зависимостей
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки
import { logout } from '../../store/authSlice'; // Action creator для выхода
import { IconButton, Menu, MenuItem, Typography, Avatar } from '@mui/material'; // UI компоненты
import { useState } from 'react'; // Хук состояния React

const UserProfile = () => {
  // Redux hooks
  const dispatch = useDispatch(); // Хук для отправки actions
  const user = useSelector(state => state.auth.user); // Получаем данные пользователя

  // Состояние для управления меню
  const [anchorEl, setAnchorEl] = useState(null); // Элемент-якорь для меню
  const open = Boolean(anchorEl); // Флаг открытия меню (преобразуем в boolean)

  // Обработчик клика по аватару
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Устанавливаем якорь для меню
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    setAnchorEl(null); // Сбрасываем якорь
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logout()); // Диспатч действия выхода
    handleClose(); // Закрываем меню
  };

  return (
    // Используем Fragment (<></>) для группировки элементов без лишнего DOM-узла
    <>
      {/* Кнопка с аватаром пользователя */}
      <IconButton 
        onClick={handleClick} // Обработчик открытия меню
        aria-controls="user-menu" // ARIA атрибуты для доступности
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {/* Аватар с первой буквой email пользователя */}
        <Avatar>
          {user?.email?.charAt(0).toUpperCase() || 'U'} 
          {/* Если email есть - берем первую букву, иначе 'U' */}
        </Avatar>
      </IconButton>
      
      {/* Выпадающее меню */}
      <Menu
        anchorEl={anchorEl} // Элемент, к которому привязано меню
        open={open} // Флаг видимости меню
        onClose={handleClose} // Обработчик закрытия
        MenuListProps={{
          'aria-labelledby': 'user-button', // ARIA атрибуты
        }}
      >
        {/* Заголовок меню с email пользователя (disabled - нельзя выбрать) */}
        <MenuItem disabled>
          <Typography variant="body2">
            {user?.email || 'Пользователь'}
          </Typography>
        </MenuItem>
        
        {/* Пункт меню для выхода */}
        <MenuItem onClick={handleLogout}>
          <Typography variant="body2">Выйти</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;