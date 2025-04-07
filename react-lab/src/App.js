// Импорт CSS-стилей для основного компонента App
// Файл App.css содержит глобальные стили или стили для App-компонента
import './App.css';

// Импорт компонента Container из указанного пути
// Container - это, скорее всего, компонент-обёртка для контента
import Container from './components/Container/Container';

// Импорт компонента Button из указанного пути
import Button from './components/Button/Button';

// Импорт компонента Navigation (навигационной панели)
import Navigation from './components/Navigation/Navigation';

// Определение функционального компонента App
// Это корневой компонент приложения
function App() {
  // Обработчик клика для кнопки
  // При вызове показывает alert с сообщением 'Hello World!'
  const handleClick = () => {
    alert('Hello World!');
  };

  // Возвращаемый JSX
  return (
    // Основной div приложения с классом 'App' (стили в App.css)
    <div className="App">
      {/* Рендер компонента Navigation (навигационной панели) */}
      <Navigation />
      
      {/* Компонент Container - обёртка для основного контента */}
      <Container>
        {/* Заголовок первого уровня */}
        <h1>Hello World!</h1>
        
        {/* Параграф с приветственным текстом */}
        <p>Welcome to my React application</p>
        
        {/* Кнопка с обработчиком onClick (при клике вызовет handleClick) */}
        <Button onClick={handleClick}>Click Me</Button>
        
        {/* Кнопка с вариантом 'secondary' (другой стиль) без обработчика */}
        <Button variant="secondary">Secondary Button</Button>
      </Container>
    </div>
  );
}

// Экспорт компонента App по умолчанию
// Это главный компонент, который рендерится в index.js
export default App;