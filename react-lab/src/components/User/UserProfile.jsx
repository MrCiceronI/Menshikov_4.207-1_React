// src/components/User/UserProfile.jsx
// Импорт необходимых зависимостей
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки для управления состоянием
import { logout } from '../../store/authSlice'; // Action creator для выхода из системы
// Компоненты Material-UI
import { 
  IconButton, // Кнопка с иконкой
  Menu, // Выпадающее меню
  MenuItem, // Пункт меню
  Typography, // Текст с оформлением
  Avatar, // Компонент аватара
  ListItemText // Текст внутри пункта меню
} from '@mui/material';
import { useState } from 'react'; // Хук состояния React
import { useTheme } from '../../context/ThemeContext'; // Кастомный контекст темы
import { Link } from 'react-router-dom'; // Компонент для клиентской маршрутизации

const UserProfile = () => {
  // Redux хуки
  const dispatch = useDispatch(); // Для отправки actions
  const user = useSelector(state => state.auth.user); // Получаем данные пользователя из хранилища
  
  // Состояние для управления выпадающим меню
  const [anchorEl, setAnchorEl] = useState(null); // Элемент-якорь для меню
  const open = Boolean(anchorEl); // Флаг открытия меню (преобразуем в boolean)
  
  // Получаем текущую тему из контекста
  const { isDarkMode } = useTheme();

  // Обработчик открытия меню по клику на аватар
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Устанавливаем элемент-якорь
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    setAnchorEl(null); // Сбрасываем элемент-якорь
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logout()); // Отправляем action выхода
    handleClose(); // Закрываем меню
  };

  return (
    /* Фрагмент (не создает дополнительного DOM-элемента) */
    <>
      {/* Кнопка с аватаром пользователя */}
      <IconButton 
        onClick={handleClick} // Обработчик клика
        aria-controls="user-menu" // Связь с меню для a11y
        aria-haspopup="true" // Указывает наличие выпадающего меню
        aria-expanded={open ? 'true' : undefined} // Состояние раскрытия для a11y
        sx={{ ml: 1 }} // Стиль - отступ слева 1 единица
      >
        {/* Аватар пользователя с первой буквой email */}
        <Avatar>
          {user?.email?.charAt(0).toUpperCase() || 'U'} {/* Берем первую букву email или 'U' */}
        </Avatar>
      </IconButton>
      
      {/* Выпадающее меню пользователя */}
      <Menu
        anchorEl={anchorEl} // Элемент, к которому привязывается меню
        open={open} // Флаг видимости меню
        onClose={handleClose} // Обработчик закрытия
        MenuListProps={{
          'aria-labelledby': 'user-button', // Для доступности (ARIA)
        }}
        PaperProps={{
          style: {
            // Адаптивные стили в зависимости от темы
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          }
        }}
      >
        {/* Заголовок меню (неактивный пункт) */}
        <MenuItem disabled> {/* disabled делает пункт неинтерактивным */}
          <Typography variant="body2"> {/* Мелкий текст */}
            {user?.email || 'Пользователь'} {/* Email или заглушка */}
          </Typography>
        </MenuItem>

        {/* Пункт меню "Профиль" */}
        <MenuItem 
          component={Link} // Рендерим как ссылку
          to="/profile" // Целевой маршрут
          onClick={handleClose} // Закрываем меню при клике
        >
          <ListItemText>Профиль</ListItemText> {/* Текст пункта */}
        </MenuItem>

        {/* Пункт меню "Выйти" */}
        <MenuItem onClick={handleLogout}>
          <ListItemText>Выйти</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;