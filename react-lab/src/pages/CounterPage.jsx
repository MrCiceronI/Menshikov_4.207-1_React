// src/pages/AuthPage.jsx
import { useState, useEffect } from 'react'; // Импорт хуков React
import { useSelector, useDispatch } from 'react-redux'; // Redux хуки
// Импорт экшенов из слайса счетчика
import { increment, decrement, incrementByAmount } from '../redux/counterSlice';

const CounterPage = () => {
  // Получаем текущее значение счетчика из Redux store
  const count = useSelector(state => state.counter.value);
  // Получаем функцию dispatch для отправки экшенов
  const dispatch = useDispatch();
  // Локальное состояние для ввода количества
  const [amount, setAmount] = useState(2);

  // Эффект для отслеживания монтирования/размонтирования компонента
  useEffect(() => {
    console.log('CounterPage mounted'); // При монтировании
    return () => console.log('CounterPage unmounted'); // При размонтировании
  }, []); // Пустой массив зависимостей = только на mount/unmount

  return (
    <div>
      {/* Заголовок с текущим значением счетчика */}
      <h2>Counter: {count}</h2>
      
      {/* Кнопка увеличения на 1 */}
      <button onClick={() => dispatch(increment())}>
        Increment
      </button>
      
      {/* Кнопка уменьшения на 1 */}
      <button onClick={() => dispatch(decrement())}>
        Decrement
      </button>
      
      {/* Блок для увеличения на произвольное значение */}
      <div>
        {/* Поле ввода числа */}
        <input 
          type="number" 
          value={amount} 
          onChange={e => setAmount(Number(e.target.value))} 
        />
        {/* Кнопка увеличения на введенное значение */}
        <button onClick={() => dispatch(incrementByAmount(amount))}>
          Increment by {amount}
        </button>
      </div>
    </div>
  );
};

export default CounterPage;