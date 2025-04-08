// src/components/Button/Button.jsx
// Импорт файла стилей для компонента Button
// Этот файл содержит CSS-классы, которые будут использоваться для стилизации кнопки
import './Button.css';

// Объявление функционального компонента Button
// Компонент принимает три пропса (props) через деструктуризацию:
// - children: содержимое кнопки (текст или другие элементы)
// - onClick: функция, вызываемая при клике на кнопку
// - variant: вариант стилизации кнопки (по умолчанию 'primary')
const Button = ({ children, onClick, variant = 'primary' }) => {
  // Возвращаем JSX разметку кнопки
  return (
    // Элемент button с динамически формируемым классом
    // Класс формируется из базового 'button' и переданного variant
    // Например, если variant='secondary', класс будет 'button secondary'
    <button 
      className={`button ${variant}`}
      // Обработчик события клика, который вызывает переданную функцию onClick
      onClick={onClick}
    >
      {/* children - содержимое, которое будет отображаться внутри кнопки */}
      {children}
    </button>
  );
};

// Экспорт компонента Button по умолчанию
// Это позволяет импортировать компонент в других файлах как import Button from './Button'
export default Button;