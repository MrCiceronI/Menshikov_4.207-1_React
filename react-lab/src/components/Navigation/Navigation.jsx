// Импорт CSS-стилей для компонента Navigation
// Файл Navigation.css содержит стили, специфичные для этого компонента
import './Navigation.css';

// Импорт компонента Button из указанного пути
// Button - это повторно используемый компонент кнопки
import Button from '../Button/Button';

// Определение функционального компонента Navigation
// Это компонент без состояния (stateless), который возвращает JSX
const Navigation = () => {
  return (
    // Элемент <nav> с классом "navigation" - основной контейнер навигации
    // Класс используется для стилизации в Navigation.css
    <nav className="navigation">
      {/* Неупорядоченный список (<ul>) навигационных ссылок с классом "nav-list" */}
      <ul className="nav-list">
        {/* Элемент списка (<li>) с классом "nav-item" для каждого пункта навигации */}
        <li className="nav-item">
          {/* Ссылка (<a>) на главную страницу */}
          <a href="/">Home</a>
        </li>
        <li className="nav-item">
          {/* Ссылка на страницу "About" */}
          <a href="/about">About</a>
        </li>
        <li className="nav-item">
          {/* Ссылка на страницу "Contact" */}
          <a href="/contact">Contact</a>
        </li>
      </ul>

      {/* Контейнер div для кнопок действий с классом "nav-actions" */}
      <div className="nav-actions">
        {/* Компонент Button с вариантом "secondary" (вероятно, стиль вторичной кнопки) */}
        <Button variant="secondary">Login</Button>
        
        {/* Компонент Button по умолчанию (без указания variant) */}
        <Button>Sign Up</Button>
      </div>
    </nav>
  );
};

// Экспорт компонента Navigation по умолчанию
// Это позволяет импортировать компонент в других файлах как import Navigation from './Navigation'
export default Navigation;