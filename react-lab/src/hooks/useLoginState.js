// src/hooks/useLoginState.js
// Импорт хука useSelector из библиотеки react-redux
// useSelector позволяет извлекать данные из Redux-хранилища
import { useSelector } from 'react-redux';

/**
 * Кастомный хук для получения состояния авторизации пользователя
 * 
 * Этот хук предоставляет простой способ проверки, авторизован ли пользователь,
 * без необходимости повторного написания селектора в разных компонентах
 * 
 * @returns {boolean} Возвращает true если пользователь авторизован, false если нет
 */
export const useLoginState = () => {
  // Использование useSelector для получения значения isLoggedIn из Redux-хранилища
  // Селектор получает состояние auth и возвращает поле isLoggedIn
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  
  // Возвращение значения авторизации
  return isLoggedIn;
};