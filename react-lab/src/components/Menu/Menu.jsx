// Импорт необходимых библиотек и компонентов
import React from 'react'; // Основная библиотека React
import './Menu.css'; // Файл стилей для этого компонента
import { 
  Drawer, // Компонент выдвижной панели (бокового меню)
  List, // Контейнер для списка элементов
  ListItem, // Элемент списка
  ListItemIcon, // Контейнер для иконки элемента списка
  ListItemText // Текстовое содержимое элемента списка
} from '@mui/material'; // Компоненты Material-UI
import { Home, Code } from '@mui/icons-material'; // Иконки из коллекции Material-UI

// Компонент Menu (боковое меню)
const Menu = ({ isOpen, onClose, onLabSelect }) => {
  /*
    Пропсы:
    - isOpen: boolean - определяет, открыто ли меню
    - onClose: function - вызывается при закрытии меню
    - onLabSelect: function(id) - вызывается при выборе лабораторной работы
  */

  // Массив лабораторных работ
  const labs = [
    { id: 1, title: "Лабораторная 1", icon: <Code /> },
    { id: 2, title: "Лабораторная 2", icon: <Code /> },
    { id: 3, title: "Лабораторная 3", icon: <Code /> },
    { id: 4, title: "Лабораторная 4", icon: <Code /> },
    { id: 5, title: "Лабораторная 5", icon: <Code /> },
    { id: 6, title: "Лабораторная 6", icon: <Code /> },
    { id: 7, title: "Лабораторная 7", icon: <Code /> },
    { id: 8, title: "Лабораторная 8", icon: <Code /> },
    { id: 9, title: "Лабораторная 9", icon: <Code /> },
  ];

  return (
    /*
      Drawer - компонент выдвижной панели
      Свойства:
      - open: управляет видимостью (получает значение из пропса isOpen)
      - onClose: обработчик закрытия (вызывает пропс onClose)
    */
    <Drawer open={isOpen} onClose={onClose}>
      {/* List - контейнер для элементов меню */}
      <List>
        {/*
          Пункт меню "Главная страница"
          - button: делает элемент кликабельным
          - onClick: при клике вызывает onLabSelect(null) для возврата на главную
        */}
        <ListItem button onClick={() => onLabSelect(null)}>
          <ListItemIcon><Home /></ListItemIcon> {/* Иконка дома */}
          <ListItemText primary="Главная" /> {/* Текст пункта меню */}
        </ListItem>

        {/*
          Динамическое создание пунктов меню для лабораторных работ
          Используем map для преобразования массива labs в элементы ListItem
        */}
        {labs.map((lab) => (
          <ListItem 
            button // Делаем элемент кликабельным
            key={lab.id} // Уникальный ключ для React (обязательно при использовании map)
            onClick={() => onLabSelect(lab.id)} // Обработчик выбора лабораторной
          >
            <ListItemIcon>{lab.icon}</ListItemIcon> {/* Иконка лабораторной */}
            <ListItemText primary={lab.title} /> {/* Название лабораторной */}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Menu;