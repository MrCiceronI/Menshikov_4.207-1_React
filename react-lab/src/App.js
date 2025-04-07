// Импорт необходимых библиотек и компонентов
import React, { useState } from 'react'; // React и хук состояния
import './App.css'; // Основные стили приложения
import Header from './components/Header/Header'; // Компонент шапки
import Menu from './components/Menu/Menu'; // Компонент бокового меню
import Content from './components/Content/Content'; // Основное содержимое
import Footer from './components/Footer/Footer'; // Компонент подвала

// Главный компонент приложения
function App() {
  /*
    Состояния компонента:
    - isMenuOpen: boolean - открыто ли боковое меню (по умолчанию false)
    - selectedLab: number|null - ID выбранной лабораторной работы (null - главная)
  */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  // Функция для переключения состояния меню
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Обработчик выбора лабораторной работы
  const handleLabSelect = (labId) => {
    setSelectedLab(labId); // Устанавливаем выбранную лабораторную
    setIsMenuOpen(false); // Закрываем меню после выбора
  };

  // Рендер главного компонента
  return (
    /*
      Основной контейнер приложения с классом 'app'
      Включает все основные компоненты:
      - Header (шапка)
      - Menu (боковое меню)
      - Content (основное содержимое)
      - Footer (подвал)
    */
    <div className="app">
      {/*
        Компонент Header (шапка)
        Пропсы:
        - onMenuToggle: функция для переключения меню (принимает toggleMenu)
      */}
      <Header onMenuToggle={toggleMenu} />

      {/*
        Компонент Menu (боковое меню)
        Пропсы:
        - isOpen: состояние меню (открыто/закрыто)
        - onClose: функция для закрытия меню
        - onLabSelect: обработчик выбора лабораторной работы
      */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onLabSelect={handleLabSelect}
      />

      {/*
        Компонент Content (основное содержимое)
        Пропс:
        - labId: ID выбранной лабораторной работы (null для главной)
      */}
      <Content labId={selectedLab} />

      {/* Компонент Footer (подвал) без пропсов */}
      <Footer />
    </div>
  );
}

// Экспортируем компонент для использования как корневой
export default App;