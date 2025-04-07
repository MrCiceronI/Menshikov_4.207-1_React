// Импорт необходимых библиотек и компонентов
import React from 'react'; // Основная библиотека React
import './Footer.css'; // Файл стилей для этого компонента
import { Box, Typography } from '@mui/material'; // Компоненты Material-UI для оформления

// Компонент Footer (подвал сайта)
const Footer = () => {
  // Возвращаем JSX для рендеринга подвала
  return (
    /*
      Компонент Box - это базовый контейнер Material-UI
      Здесь он используется как обертка для содержимого подвала
      К нему применяется CSS-класс 'footer' для дополнительного стилирования
    */
    <Box className="footer">
      {/*
        Компонент Typography для текста с определенными свойствами:
        - variant="body2" - стиль текста (меньший чем body1)
        - color="textSecondary" - цвет текста (вторичный, обычно серый)
        - align="center" - выравнивание по центру
      */}
      {/* Текст копирайта */}
      <Typography variant="body2" color="textSecondary" align="center">
        © 2025 Лабораторные работы по React
      </Typography>
    </Box>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default Footer;