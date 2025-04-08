// src/contexts/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Создаем контекст для темы
const ThemeContext = createContext();

// 2. Провайдер темы - компонент высшего порядка
export const ThemeProvider = ({ children }) => {
  // 3. Состояние темы с ленивой инициализацией
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Проверяем сохранённую тему в localStorage при инициализации
    const savedTheme = localStorage.getItem('theme');
    // Если тема сохранена, возвращаем true для 'dark', иначе false (светлая тема по умолчанию)
    return savedTheme ? savedTheme === 'dark' : false;
  });

  // 4. Функция переключения темы
  const toggleTheme = () => {
    // Инвертируем текущее состояние темы
    setIsDarkMode(prev => !prev);
  };

  // 5. Эффект для применения изменений темы
  useEffect(() => {
    // Получаем корневой элемент HTML
    const root = document.documentElement;
    
    if (isDarkMode) {
      // Добавляем класс для темной темы
      root.classList.add('dark');
      root.classList.remove('light');
      // Сохраняем выбор в localStorage
      localStorage.setItem('theme', 'dark');
    } else {
      // Добавляем класс для светлой темы
      root.classList.add('light');
      root.classList.remove('dark');
      // Сохраняем выбор в localStorage
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]); // Зависимость - при изменении isDarkMode

  // 6. Возвращаем провайдер контекста
  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkMode,  // Текущее состояние темы
        toggleTheme  // Функция переключения
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// 7. Кастомный хук для удобного доступа к контексту
export const useTheme = () => useContext(ThemeContext);