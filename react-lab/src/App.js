// Импорт React и хуков для управления состоянием и ленивой загрузкой
import React, { useState, Suspense, lazy } from 'react';
// Импорт компонентов для маршрутизации
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Импорт провайдера для Redux
import { Provider } from 'react-redux';
// Импорт провайдера для кастомного контекста темы
import { ThemeProvider } from './context/ThemeContext';
// Импорт Redux store
import { store } from './store/store';
// Импорт кастомного хука для проверки состояния авторизации
import { useLoginState } from './hooks/useLoginState';
// Импорт глобальных стилей приложения
import './App.css';

// Ленивая загрузка компонентов для оптимизации начальной загрузки
const Header = lazy(() => import('./components/Header/Header')); // Заголовок
const Menu = lazy(() => import('./components/Menu/Menu')); // Меню
const Content = lazy(() => import('./components/Content/Content')); // Основной контент
const Footer = lazy(() => import('./components/Footer/Footer')); // Футер
const AuthPage = lazy(() => import('./pages/AuthPage')); // Страница авторизации
const FeedbackPage = lazy(() => import('./pages/FeedbackPage')); // Страница отзывов
const ProfilePage = lazy(() => import('./pages/ProfilePage')); // Страница профиля
const AboutPage = lazy(() => import('./pages/AboutPage')); // Страница "О себе"
const AdminPage = lazy(() => import('./pages/AdminPage')); // Главная страница админ-панели
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage')); // Страница управления пользователями
const AdminFeedbacksPage = lazy(() => import('./pages/AdminFeedbacksPage')); // Страница управления отзывами
const BottomMenu = lazy(() => import('./components/BottomMenu/BottomMenu')); // Нижнее меню для мобильных устройств
const ProtectedRoute = lazy(() => import('./components/Routes/ProtectedRoute')); // Защищенный маршрут для авторизованных пользователей
const AdminRoute = lazy(() => import('./components/Routes/AdminRoute')); // Защищенный маршрут для администраторов

// Компонент AppContent управляет основным содержимым приложения
const AppContent = () => {
  // Состояние для управления открытием/закрытием меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Проверка состояния авторизации с помощью кастомного хука
  const isLoggedIn = useLoginState();

  // Функция для переключения состояния меню
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Если пользователь не авторизован, отображается страница авторизации
  if (!isLoggedIn) {
    return (
      // Suspense для обработки ленивой загрузки AuthPage
      <Suspense fallback={<div>Загрузка...</div>}>
        <AuthPage />
      </Suspense>
    );
  }

  // Основной рендеринг приложения для авторизованных пользователей
  return (
    // Обертка для маршрутизации
    <Router>
      <div className="app"> {/* Корневой контейнер приложения */}
        {/* Suspense для обработки ленивой загрузки компонентов */}
        <Suspense fallback={<div>Загрузка...</div>}>
          {/* Заголовок с функцией переключения меню */}
          <Header onMenuToggle={toggleMenu} />
          {/* Меню с управлением состоянием открытия/закрытия */}
          <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          
          {/* Определение маршрутов */}
          <Routes>
            {/* Маршруты, доступные всем пользователям */}
            <Route path="/" element={<Content />} /> {/* Главная страница */}
            <Route path="/lab/:id" element={<Content />} /> {/* Страница с динамическим параметром */}
            <Route path="/about" element={<AboutPage />} /> {/* Страница "О себе" */}
            
            {/* Маршруты, доступные только авторизованным пользователям */}
            <Route element={<ProtectedRoute />}>
              <Route path="/feedback" element={<FeedbackPage />} /> {/* Страница отзывов */}
              <Route path="/profile" element={<ProfilePage />} /> {/* Страница профиля */}
            </Route>
            
            {/* Маршруты, доступные только администраторам */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} /> {/* Главная админ-панель */}
              <Route path="/admin/users" element={<AdminUsersPage />} /> {/* Управление пользователями */}
              <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} /> {/* Управление отзывами */}
            </Route>
            
            {/* Перенаправление на главную страницу для неизвестных маршрутов */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Футер приложения */}
          <Footer />
          {/* Нижнее меню для мобильных устройств */}
          <BottomMenu />
        </Suspense>  
      </div>
    </Router>
  );
};

// Корневой компонент приложения
function App() {
  return (
    // Обертка Redux store для предоставления состояния
    <Provider store={store}>
      {/* Обертка для предоставления контекста темы */}
      <ThemeProvider>
        {/* Основной контент приложения */}
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

// Экспорт компонента по умолчанию
export default App;