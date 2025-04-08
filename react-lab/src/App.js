// src/App.js
import React, { useState } from 'react'; // Импорт React и хука состояния
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Импорт компонентов маршрутизации
import { Provider } from 'react-redux'; // Провайдер Redux хранилища
import './App.css'; // Основные стили приложения

// Импорт компонентов
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';

// Импорт провайдеров контекста и хранилища
import { ThemeProvider } from './context/ThemeContext';
import { store } from './store/store';

function App() {
  // Состояние для управления видимостью бокового меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Функция переключения состояния меню
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    // Провайдер Redux хранилища (делает store доступным во всем приложении)
    <Provider store={store}>
      {/* Провайдер темы (темный/светлый режим) */}
      <ThemeProvider>
        {/* Компонент маршрутизации (React Router) */}
        <Router>
          {/* Основной контейнер приложения */}
          <div className="app">
            {/* Шапка приложения с кнопкой меню */}
            <Header onMenuToggle={toggleMenu} />
            
            {/* Боковое меню */}
            <Menu 
              isOpen={isMenuOpen} // Передаем состояние видимости
              onClose={() => setIsMenuOpen(false)} // Функция закрытия
            />
            
            {/* Конфигурация маршрутов */}
            <Routes>
              {/* Главная страница */}
              <Route path="/" element={<Content />} />
              {/* Страницы лабораторных работ (динамический параметр :id) */}
              <Route path="/lab/:id" element={<Content />} />
            </Routes>
            
            {/* Подвал приложения */}
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;