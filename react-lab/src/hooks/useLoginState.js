// src/hooks/useLoginState.js

// Импортируем хук useSelector из react-redux для доступа к состоянию Redux
import { useSelector } from 'react-redux';

/**
 * Кастомный хук для проверки состояния авторизации пользователя
 * @returns {boolean} Возвращает true, если пользователь авторизован
 */
export const useLoginState = () => {
  // 1. Получаем состояние авторизации из Redux хранилища
  //    - Обращаемся к state.auth.isLoggedIn
  //    - Это "официальное" состояние, управляемое authSlice
  const isLoggedInRedux = useSelector(state => state.auth.isLoggedIn);
  
  // 2. Дополнительно проверяем наличие данных в localStorage
  //    - !! преобразует значение в boolean (true если есть данные)
  //    - Это резервная проверка на случай, если Redux состояние сбросилось
  const isLoggedInLocal = !!localStorage.getItem('auth');
  
  // 3. Возвращаем true если пользователь авторизован по ЛЮБОМУ из критериев
  //    - Используем OR (||) так как достаточно одного признака авторизации
  return isLoggedInRedux || isLoggedInLocal;
};