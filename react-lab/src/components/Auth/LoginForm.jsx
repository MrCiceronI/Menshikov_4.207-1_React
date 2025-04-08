// src/components/Auth/LoginForm.jsx
// Импорт необходимых библиотек и компонентов
// React и useCallback для мемоизации функций
import React, { useCallback } from 'react';
// Хук useForm из react-hook-form для управления формой
import { useForm } from 'react-hook-form';
// Хук useDispatch из react-redux для отправки действий в Redux store
import { useDispatch } from 'react-redux';
// Действие login из authSlice для авторизации пользователя
import { login } from '../../store/authSlice';
// Компоненты Material-UI для оформления интерфейса
import { TextField, Button, Box, Typography } from '@mui/material';

// Компонент формы авторизации
const LoginForm = () => {
  // Инициализация хука useForm:
  // register - для регистрации полей формы
  // handleSubmit - обработчик отправки формы
  // errors - объект с ошибками валидации
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Получение функции dispatch из Redux store
  const dispatch = useDispatch();

  // Обработчик отправки формы, мемоизированный с помощью useCallback
  // для оптимизации производительности
  const onSubmit = useCallback((data) => {
    // Диспатч действия login с email пользователя
    dispatch(login({ email: data.email }));
  }, [dispatch]); // Зависимость от dispatch

  // Рендер формы
  return (
    // Box - контейнер из Material-UI, здесь используется как form
    // onSubmit - обработчик отправки формы, обернутый в handleSubmit
    // sx - стили Material-UI (margin-top: 3)
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      {/* Заголовок формы */}
      <Typography variant="h5" gutterBottom>Авторизация</Typography>
      
      {/* Поле ввода email */}
      <TextField
        label="Email"
        fullWidth // Растягивается на всю ширину
        margin="normal" // Обычные отступы
        // Регистрация поля в форме с валидацией:
        // - required: обязательное поле
        // - pattern: проверка на соответствие regex email
        {...register('email', { 
          required: 'Email обязателен',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Некорректный email'
          }
        })}
        error={!!errors.email} // Показывать ошибку, если есть
        helperText={errors.email?.message} // Текст ошибки
      />
      
      {/* Поле ввода пароля */}
      <TextField
        label="Пароль"
        type="password" // Скрытый ввод пароля
        fullWidth
        margin="normal"
        // Регистрация поля с валидацией:
        // - required: обязательное поле
        // - minLength: минимальная длина 6 символов
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
        type="submit" // Тип кнопки - submit
        variant="contained" // Стиль Material-UI
        sx={{ mt: 2 }} // Стиль - margin-top: 2
      >
        Войти
      </Button>
    </Box>
  );
};

// Экспорт компонента по умолчанию
export default LoginForm;