// src/App.js
// Основные импорты React и сторонних библиотек
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Навигация
import { Provider } from 'react-redux'; // Redux Provider
import { ThemeProvider } from './context/ThemeContext'; // Провайдер темы
import { store } from './store/store'; // Redux store
import { useLoginState } from './hooks/useLoginState'; // Кастомный хук авторизации
import './App.css'; // Глобальные стили

// Импорт компонентов
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';
import AuthPage from './pages/AuthPage';
import FeedbackPage from './pages/FeedbackPage';

/**
 * Основной компонент контента приложения
 * Управляет:
 * - Состоянием бокового меню
 * - Проверкой авторизации
 * - Маршрутизацией
 */
const AppContent = () => {
  // Состояние открытия/закрытия бокового меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Проверка статуса авторизации через кастомный хук
  const isLoggedIn = useLoginState();

  // Функция переключения состояния меню
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Если пользователь не авторизован, показываем страницу авторизации
  if (!isLoggedIn) {
    return <AuthPage />;
  }

  // Основная разметка для авторизованного пользователя
  return (
    <Router>
      <div className="app">
        {/* Шапка приложения с кнопкой меню */}
        <Header onMenuToggle={toggleMenu} />
        
        {/* Боковое меню */}
        <Menu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
        
        {/* Конфигурация маршрутов */}
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Content />} />
          
          {/* Страница лабораторной работы (динамический параметр :id) */}
          <Route path="/lab/:id" element={<Content />} />
          
          {/* Страница обратной связи */}
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
        
        {/* Подвал приложения */}
        <Footer />
      </div>
    </Router>
  );
};

/**
 * Корневой компонент приложения
 * Обеспечивает:
 * - Redux хранилище
 * - Контекст темы
 */
function App() {
  return (
    // Провайдер Redux хранилища (делает store доступным во всем приложении)
    <Provider store={store}>
      {/* Провайдер темы (темный/светлый режим) */}
      <ThemeProvider>
        {/* Основной контент приложения */}
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;