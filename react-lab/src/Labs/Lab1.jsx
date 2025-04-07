import React from 'react';
import './Lab.css';

const Lab1 = () => {
  return (
    <div className="lab-content">
      <ul>
        <li>Реализовать скрипт, который уведомит о полной загрузке страницы</li>
        <li>Реализовать кнопку-счетчик (+1) с использованием button onclick</li>
        <li>Реализовать кнопку-счетчик (-1) с использованием event listener</li>
        <li>Реализовать форму аутентификации:
          <ul>
            <li>Очистка данных формы</li>
            <li>Отправка данных с listener submit</li>
            <li>Валидация (login=="admin" & pass=="admin")</li>
            <li>Сохранение данных в localStorage</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Lab1;