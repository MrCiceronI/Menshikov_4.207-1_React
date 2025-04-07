// Импорт необходимых библиотек и компонентов
import React from 'react'; // Основная библиотека React
import './Content.css'; // Стили для этого компонента
import { Paper, Typography } from '@mui/material'; // Компоненты Material-UI для оформления

// Импорт компонентов лабораторных работ
import Lab1 from '../../Labs/Lab1';
import Lab2 from '../../Labs/Lab2';
import Lab3 from '../../Labs/Lab3';
import Lab4 from '../../Labs/Lab4';
import Lab5 from '../../Labs/Lab5';
import Lab6 from '../../Labs/Lab6';
import Lab7 from '../../Labs/Lab7';
import Lab8 from '../../Labs/Lab8';
import Lab9 from '../../Labs/Lab9';

// Основной компонент Content
const Content = ({ labId }) => {
  // Объект, сопоставляющий идентификаторы лабораторных работ с их компонентами
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
    <Paper elevation={3} className="content">
      {/* Заголовок лабораторной работы */}
      <Typography variant="h4" gutterBottom>
        Лабораторная работа {labId}
      </Typography>
      
      {/* Содержимое лабораторной работы или сообщение по умолчанию */}
      <Typography variant="body1">
        {labContent[labId] || "Выберите лабораторную работу из меню"}
        {/* 
          Отображаем компонент лабораторной работы по переданному labId
          Если labId нет в объекте labContent (или он undefined/null),
          отобразится текст "Выберите лабораторную работу из меню"
        */}
      </Typography>
    </Paper>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Content;