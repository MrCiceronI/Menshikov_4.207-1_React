// src/components/Auth/LoginForm.jsx
// Импорт необходимых библиотек и компонентов
// React - базовая библиотека для создания компонентов
// useForm - хук из react-hook-form для управления формой
// useDispatch и useSelector - хуки Redux для взаимодействия с хранилищем
// loginUser - экшен для авторизации пользователя
// Компоненты Material-UI для оформления интерфейса
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

// Компонент формы авторизации
const LoginForm = () => {
  // Инициализация хука useForm для управления формой:
  // register - функция для регистрации полей формы
  // handleSubmit - обработчик отправки формы
  // errors - объект с ошибками валидации
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Хук useDispatch для отправки экшенов в Redux хранилище
  const dispatch = useDispatch();
  
  // Хук useSelector для доступа к состоянию auth из Redux хранилища
  // loading - флаг процесса загрузки
  // error - сообщение об ошибке (если есть)
  const { loading, error } = useSelector(state => state.auth);

  // Функция-обработчик отправки формы
  // data - объект с данными формы (email и password)
  const onSubmit = (data) => {
    // Диспатчим экшен loginUser с данными формы
    dispatch(loginUser(data));
  };

  // Рендер компонента
  return (
    // Box - контейнер из Material-UI, здесь используется как форма
    // onSubmit - обработчик отправки формы, обернутый в handleSubmit
    // sx - стили Material-UI (margin-top: 3)
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      {/* Заголовок формы */}
      <Typography variant="h5" gutterBottom>Авторизация</Typography>
      
      {/* Блок для отображения ошибок из Redux (например, ошибка сервера) */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Поле ввода email */}
      <TextField
        label="Email"
        fullWidth  // растягивается на всю ширину
        margin="normal"  // нормальные отступы
        // Регистрация поля в форме с валидацией:
        // required - обязательное поле
        // pattern - регулярное выражение для проверки email
        {...register('email', { 
          required: 'Email обязателен',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Некорректный email'
          }
        })}
        error={!!errors.email}  // показывать ошибку, если есть
        helperText={errors.email?.message}  // текст ошибки
      />
      
      {/* Поле ввода пароля */}
      <TextField
        label="Пароль"
        type="password"  // тип поля - пароль (скрытие символов)
        fullWidth
        margin="normal"
        // Регистрация поля с валидацией:
        // required - обязательное поле
        // minLength - минимальная длина пароля
        {...register('password', { 
          required: 'Пароль обязателен',
          minLength: {
            value: 6,
            message: 'Пароль должен быть не менее 6 символов'
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      
      {/* Кнопка отправки формы */}
      <Button 
        type="submit"
        variant="contained"  // стиль кнопки
        disabled={loading}  // отключаем кнопку во время загрузки
        sx={{ mt: 2 }}  // стиль (margin-top: 2)
      >
        {/* Меняем текст кнопки в зависимости от состояния загрузки */}
        {loading ? 'Загрузка...' : 'Войти'}
      </Button>
    </Box>
  );
};

// Экспорт компонента для использования в других частях приложения
export default LoginForm;