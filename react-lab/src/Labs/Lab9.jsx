import React from 'react';
import './Lab.css';

const Lab9 = () => {
  return (
    <div className="lab-content">
      <ul>
        <li>Написать тест для компонента кнопки</li>
        <li>Провести рефакторинг страницы со списком данных с сервера. Переписать запрос к backend через rtk-query(useGetPostsQuery).</li>
        <li>Используя isError, isLoading, isFetching отрисовать спиннер загрузки, сообщение об ошибке и результат успешного запроса</li>
        <li>* "Ленивые" импорты. Разбить приложение на Chunks (не обязательно)</li>
        <li>Результат работы разместить на github отдельным коммитом.</li>
        <li>Ссылку на репозиторий приложить к заданию</li>
      </ul>
    </div>
  );
};

export default Lab9;