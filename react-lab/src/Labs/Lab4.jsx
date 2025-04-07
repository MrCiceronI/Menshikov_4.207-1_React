import React from 'react';
import './Lab.css';

const Lab4 = () => {
  return (
    <div className="lab-content">
      <ul>
        <li>Реализовать изменение темы (день/ночь) используя Context</li>
        <li>useState и useEffect - простые примеры</li>
        <ul><li>useEffect на монтировании и размонтировании страницы</li></ul>
        <li>Внедрить в проект react-router</li>
        <ul>
          <li>В меню проекта реализовать ссылки переходы </li>
          <li>В Content реализовать обработчик роутов</li>
        </ul>
        <li>Внедрить в проект redux</li>
        <ul>
        <li>Реализовать несколько action и reducer, например increment/ decrement счетчика</li>
        </ul>
      </ul>
    </div>
  );
};

export default Lab4;