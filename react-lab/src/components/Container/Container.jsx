// Импорт файла стилей для компонента Container
// Файл Container.css содержит стили для класса .container,
// которые будут применены к корневому элементу компонента
import './Container.css';

// Объявление функционального компонента Container
// Компонент принимает один пропс (props) через деструктуризацию:
// - children: содержимое контейнера (любые React-элементы, компоненты или текст)
const Container = ({ children }) => {
  // Возвращаем JSX разметку контейнера
  return (
    // Элемент div с классом "container"
    // К этому элементу будут применены стили из Container.css
    <div className="container">
      {/* children - содержимое, которое будет отображаться внутри контейнера */}
      {children}
    </div>
  );
};

// Экспорт компонента Container по умолчанию
// Это позволяет импортировать компонент в других файлах как:
// import Container from './Container'
export default Container;