// src/components/Content/Content.jsx
// Импорт необходимых библиотек и модулей
import React, { useEffect } from 'react'; // Базовые хуки React
import { useParams } from 'react-router-dom'; // Хук для получения параметров URL
import { useSelector, useDispatch } from 'react-redux'; // Redux хуки для работы с состоянием
import { increment, decrement } from '../../store/counterSlice'; // Redux actions
import './Content.css'; // Стили компонента
import { Paper, Typography, Button } from '@mui/material'; // Компоненты Material-UI
import { useTheme } from '../../context/ThemeContext'; // Контекст темы (темный/светлый режим)

// Импорт компонентов лабораторных работ (каждый представляет отдельную лабораторную работу)
import Lab1 from '../../Labs/Lab1';
import Lab2 from '../../Labs/Lab2';
import Lab3 from '../../Labs/Lab3';
import Lab4 from '../../Labs/Lab4';
import Lab5 from '../../Labs/Lab5';
import Lab6 from '../../Labs/Lab6';
import Lab7 from '../../Labs/Lab7';
import Lab8 from '../../Labs/Lab8';
import Lab9 from '../../Labs/Lab9';

// Основной компонент Content - отображает контент в зависимости от выбранной лабораторной работы
const Content = () => {
  // Получаем параметр 'id' из URL с помощью хука useParams
  const { id } = useParams();
  // Преобразуем id в число (если он существует), иначе null
  const labId = id ? parseInt(id) : null;
  // Получаем текущую тему (темный/светлый режим) из контекста
  const { isDarkMode } = useTheme();
  
  // Получаем текущее значение счетчика из Redux store
  const count = useSelector((state) => state.counter.value);
  // Получаем функцию dispatch для отправки actions в Redux store
  const dispatch = useDispatch();

  // Эффект, который срабатывает при изменении labId
  useEffect(() => {
    console.log(`Выбрана лабораторная работа ${labId}`); // Логирование выбранной работы
  }, [labId]); // Зависимость - labId (эффект сработает при его изменении)

  // Объект, который сопоставляет идентификаторы лабораторных работ с их компонентами
  // Это позволяет динамически выбирать нужный компонент на основе labId
  const labContent = {
    1: <Lab1/>, // При labId = 1 будет отображен компонент Lab1
    2: <Lab2/>, // И так далее для каждой лабораторной работы
    3: <Lab3/>,
    4: <Lab4/>,
    5: <Lab5/>,
    6: <Lab6/>,
    7: <Lab7/>,
    8: <Lab8/>,
    9: <Lab9/>
  };

  // Возвращаем JSX для рендеринга
  return (
    // Компонент Paper из Material-UI - создает "бумажный" эффект с тенью
    <Paper 
      elevation={3} // Уровень тени
      className="content" // CSS класс
      // Динамические стили в зависимости от темы
      style={{ 
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Темный/светлый фон
        color: isDarkMode ? '#ffffff' : '#000000' // Темный/светлый текст
      }}
    >
      {/* Заголовок - показывает номер лабораторной работы или "Главная страница" */}
      <Typography variant="h4" gutterBottom>
        {labId ? `Лабораторная работа ${labId}` : "Главная страница"}
      </Typography>
      
      {/* Основное содержимое - отображает компонент лабораторной работы или сообщение */}
      <Typography variant="body1">
        {labId 
          ? labContent[labId] || "Лабораторная работа не найдена" // Показываем компонент или сообщение об ошибке
          : "Выберите лабораторную работу из меню" // Сообщение, если лабораторная не выбрана
        }
      </Typography>

      {/* Пример использования Redux - блок с счетчиком */}
      <div style={{ marginTop: '20px' }}>
        {/* Отображаем текущее значение счетчика */}
        <Typography variant="h6">Redux счётчик: {count}</Typography>
        {/* Кнопка для увеличения счетчика */}
        <Button 
          variant="contained" 
          onClick={() => dispatch(increment())} // Отправляем action increment
          style={{ marginRight: '10px' }}
        >
          Увеличить (Redux)
        </Button>
        {/* Кнопка для уменьшения счетчика */}
        <Button 
          variant="contained" 
          onClick={() => dispatch(decrement())} // Отправляем action decrement
        >
          Уменьшить (Redux)
        </Button>
      </div>
    </Paper>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Content;