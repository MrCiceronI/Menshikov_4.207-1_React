// Импорт необходимых библиотек и компонентов
import React from 'react'; // Основная библиотека React
import './Header.css'; // Файл стилей для этого компонента
import { 
  AppBar, // Компонент верхней панели (шапки)
  Toolbar, // Контейнер для элементов внутри AppBar
  Typography, // Компонент для текста
  IconButton // Кнопка с иконкой
} from '@mui/material'; // Компоненты Material-UI
import MenuIcon from '@mui/icons-material/Menu'; // Иконка меню из коллекции Material-UI

// Компонент Header (шапка сайта)
const Header = ({ onMenuToggle }) => {
  /*
    Пропсы:
    - onMenuToggle: функция, вызываемая при клике на иконку меню
  */

  return (
    /*
      AppBar - компонент верхней панели (Material-UI)
      Свойства:
      - position="static": фиксированное позиционирование (можно также использовать "fixed" или "sticky")
      - className="header": применение пользовательских стилей из Header.css
    */
    <AppBar position="static" className="header">
      {/* Toolbar - контейнер для содержимого AppBar */}
      <Toolbar>
        {/*
          IconButton - кнопка с иконкой меню
          Свойства:
          - edge="start": выравнивание к началу Toolbar
          - color="inherit": наследует цвет от родителя
          - aria-label="menu": доступное описание для screen readers
          - onClick={onMenuToggle}: обработчик клика (передан из родительского компонента)
        */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
        >
          {/* Иконка меню (гамбургер) */}
          <MenuIcon />
        </IconButton>

        {/*
          Typography - компонент для заголовка
          Свойства:
          - variant="h6": стиль заголовка 6-го уровня
          - component="div": рендерится как div-элемент
          - sx={{ flexGrow: 1 }}: растягивается на все доступное пространство (Material-UI system)
        */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Лабораторные работы по React
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Header;