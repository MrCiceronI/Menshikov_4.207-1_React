// Импорт утилит из библиотеки тестирования React
import { render, screen, fireEvent } from '@testing-library/react';
// Импорт тестируемого компонента Button
import Button from './Button';

// Группировка тестов для компонента Button с помощью describe
describe('Button Component', () => {
  // Тест: Проверяет, что кнопка рендерится с правильным текстовым содержимым
  test('renders button with children content', () => {
    // Рендеринг компонента Button с текстом "Click Me" как children
    render(<Button>Click Me</Button>);
    // Поиск элемента с текстом "Click Me" в DOM
    const buttonElement = screen.getByText('Click Me');
    // Проверка, что элемент присутствует в документе
    expect(buttonElement).toBeInTheDocument();
  });

  // Тест: Проверяет, что кнопка по умолчанию имеет класс варианта "primary"
  test('applies primary variant class by default', () => {
    // Рендеринг компонента Button с текстом "Click Me"
    render(<Button>Click Me</Button>);
    // Поиск элемента с текстом "Click Me"
    const buttonElement = screen.getByText('Click Me');
    // Проверка, что элемент имеет классы "button primary"
    expect(buttonElement).toHaveClass('button primary');
  });

  // Тест: Проверяет, что кнопка применяет класс варианта "secondary", если он указан
  test('applies secondary variant class when specified', () => {
    // Рендеринг компонента Button с пропсом variant="secondary"
    render(<Button variant="secondary">Click Me</Button>);
    // Поиск элемента с текстом "Click Me"
    const buttonElement = screen.getByText('Click Me');
    // Проверка, что элемент имеет классы "button secondary"
    expect(buttonElement).toHaveClass('button secondary');
  });

  // Тест: Проверяет, что обработчик onClick вызывается при клике на кнопку
  test('calls onClick handler when clicked', () => {
    // Создание мок-функции для имитации обработчика onClick
    const handleClick = jest.fn();
    // Рендеринг компонента Button с пропсом onClick
    render(<Button onClick={handleClick}>Click Me</Button>);
    // Поиск элемента с текстом "Click Me"
    const buttonElement = screen.getByText('Click Me');
    // Симуляция клика по кнопке
    fireEvent.click(buttonElement);
    // Проверка, что мок-функция была вызвана один раз
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});