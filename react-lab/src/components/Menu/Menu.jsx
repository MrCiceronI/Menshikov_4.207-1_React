// src/components/Menu/Menu.jsx
import React from 'react';
import './Menu.css'; // Стили компонента меню
import { 
  Drawer, // Компонент выдвижной панели
  List, // Контейнер для списка элементов
  ListItem, // Элемент списка
  ListItemIcon, // Контейнер для иконки элемента
  ListItemText // Текст элемента
} from '@mui/material'; // Импорт компонентов Material-UI
import { Home, Code } from '@mui/icons-material'; // Импорт иконок
import { Link } from 'react-router-dom'; // Компонент для навигации
import { useTheme } from '../../context/ThemeContext'; // Контекст темы

// Компонент бокового меню
const Menu = ({ isOpen, onClose }) => { // Принимает пропсы:
                                        // isOpen - состояние меню (открыто/закрыто)
                                        // onClose - функция закрытия меню
  const { isDarkMode } = useTheme(); // Получаем текущую тему

  // Массив лабораторных работ
  const labs = [
    { id: 1, title: "Лабораторная 1", icon: <Code /> },
    { id: 2, title: "Лабораторная 2", icon: <Code /> },
    // ... остальные лабораторные
    { id: 9, title: "Лабораторная 9", icon: <Code /> }
  ];

  return (
    // Drawer - выдвижная панель меню
    <Drawer 
      open={isOpen} // Управление видимостью (из пропсов)
      onClose={onClose} // Обработчик закрытия (из пропсов)
      PaperProps={{ // Стилизация внутренней части Drawer
        style: {
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон по теме
          color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста по теме
        }
      }}
    >
      {/* List - контейнер для элементов меню */}
      <List>
        {/* Пункт меню "Главная" */}
        <ListItem 
          button // Делаем элемент кликабельным
          component={Link} // Используем как ссылку
          to="/" // Ссылка на главную
          onClick={onClose} // Закрываем меню при клике
          style={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет текста
        >
          <ListItemIcon>
            <Home style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
          </ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>

        {/* Динамическое создание пунктов меню для лабораторных */}
        {labs.map((lab) => (
          <ListItem 
            button
            component={Link}
            to={`/lab/${lab.id}`} // Ссылка на лабораторную
            key={lab.id} // Уникальный ключ
            onClick={onClose} // Закрытие меню при клике
            style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
          >
            <ListItemIcon>
              <Code style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            </ListItemIcon>
            <ListItemText primary={lab.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Menu;