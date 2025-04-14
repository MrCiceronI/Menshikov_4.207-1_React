// src/App.js
// Основные импорты React и сторонних библиотек
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Клиентская маршрутизация
import { Provider } from 'react-redux'; // Обертка для предоставления Redux store
import { ThemeProvider } from './context/ThemeContext'; // Провайдер темы (dark/light)
import { store } from './store/store'; // Корневой Redux store приложения
import { useLoginState } from './hooks/useLoginState'; // Кастомный хук для проверки авторизации
import './App.css'; // Глобальные CSS-стили

// Импорт компонентов
import Header from './components/Header/Header'; // Шапка приложения
import Menu from './components/Menu/Menu'; // Боковое меню
import Content from './components/Content/Content'; // Основной контент
import Footer from './components/Footer/Footer'; // Подвал
import AuthPage from './pages/AuthPage'; // Страница авторизации
import FeedbackPage from './pages/FeedbackPage'; // Страница отзывов
import ProfilePage from './pages/ProfilePage'; // Страница профиля

/**
 * Компонент AppContent - ядро приложения
 * Управляет:
 * - Состоянием бокового меню (открыто/закрыто)
 * - Проверкой авторизации пользователя
 * - Маршрутизацией между страницами
 */
const AppContent = () => {
  // Состояние для управления видимостью бокового меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Проверка статуса авторизации через кастомный хук
  const isLoggedIn = useLoginState();

  // Переключатель состояния меню
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Если пользователь не авторизован, показываем страницу входа
  if (!isLoggedIn) {
    return <AuthPage />;
  }

  // Основной layout для авторизованных пользователей
  return (
    <Router> {/* Обеспечивает клиентскую маршрутизацию */}
      <div className="app">
        {/* Шапка приложения с кнопкой бургер-меню */}
        <Header onMenuToggle={toggleMenu} />
        
        {/* Боковое навигационное меню */}
        <Menu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
        
        {/* Конфигурация маршрутов приложения */}
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Content />} />
          
          {/* Динамический маршрут для лабораторных работ */}
          <Route path="/lab/:id" element={<Content />} />
          
          {/* Страница обратной связи */}
          <Route path="/feedback" element={<FeedbackPage />} />
          
          {/* Страница профиля пользователя */}
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        
        {/* Подвал приложения */}
        <Footer />
      </div>
    </Router>
  );
};

/**
 * Корневой компонент App
 * Обеспечивает:
 * - Доступ к Redux store во всем приложении
 * - Поддержку темы (темный/светлый режим)
 * - Инициализацию основного контента
 */
function App() {
  return (
    // Предоставляет Redux store дочерним компонентам
    <Provider store={store}>
      {/* Обеспечивает доступ к теме во всем приложении */}
      <ThemeProvider>
        {/* Основной компонент с логикой приложения */}
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;