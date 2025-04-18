// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './store/store';
import { useLoginState } from './hooks/useLoginState';
import './App.css';

// Компоненты
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';
import AuthPage from './pages/AuthPage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminFeedbacksPage from './pages/AdminFeedbacksPage';
import BottomMenu from './components/BottomMenu/BottomMenu';

// Route компоненты
import ProtectedRoute from './components/Routes/ProtectedRoute';
import AdminRoute from './components/Routes/AdminRoute';

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useLoginState();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (!isLoggedIn) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="app">
        <Header onMenuToggle={toggleMenu} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        <Routes>
          {/* Для всех пользователей */}
          <Route path="/" element={<Content />} />
          <Route path="/lab/:id" element={<Content />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Только для залогиненных */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Только для админов */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Footer />
        <BottomMenu />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;