// src/components/Auth/RegisterForm.jsx
// Импорт необходимых библиотек и компонентов
import React from 'react';
import { useForm } from 'react-hook-form'; // Хук для управления формой
import { useDispatch, useSelector } from 'react-redux'; // Хуки Redux
import { registerUser } from '../../store/authSlice'; // Экшен для регистрации
// Компоненты Material-UI для UI
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const RegisterForm = () => {
  // Инициализация хука useForm:
  // register - для регистрации полей формы
  // handleSubmit - обработчик отправки формы
  // errors - объект ошибок валидации
  // watch - функция для отслеживания значений полей
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  // Хук useDispatch для отправки действий в Redux
  const dispatch = useDispatch();
  
  // Получаем состояние загрузки и ошибки из Redux хранилища
  const { loading, error } = useSelector(state => state.auth);

  // Обработчик отправки формы
  const onSubmit = (data) => {
    // Диспатчим действие регистрации с данными формы
    dispatch(registerUser({ ...data, role: 'user' })); // По умолчанию роль 'user'
  };

  // Рендер компонента
  return (
    // Box как форма с обработчиком onSubmit
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      {/* Заголовок формы */}
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      
      {/* Блок для отображения ошибок из Redux */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Поле для ввода имени */}
      <TextField
        label="Имя"
        fullWidth
        margin="normal"
        // Регистрация поля с валидацией на обязательность
        {...register('name', { required: 'Имя обязательно' })}
        error={!!errors.name} // Показывать ошибку если есть
        helperText={errors.name?.message} // Текст ошибки
      />
      
      {/* Поле для ввода email */}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        // Регистрация поля с валидацией:
        // - обязательное поле
        // - проверка формата email через regex
        {...register('email', { 
          required: 'Email обязателен',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Некорректный email'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      
      {/* Поле для ввода пароля */}
      <TextField
        label="Пароль"
        type="password" // Скрытие вводимых символов
        fullWidth
        margin="normal"
        // Валидация:
        // - обязательное поле
        // - минимальная длина 6 символов
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
      
      {/* Поле для подтверждения пароля */}
      <TextField
        label="Подтвердите пароль"
        type="password"
        fullWidth
        margin="normal"
        // Кастомная валидация - сравнение с полем password
        {...register('confirmPassword', {
          validate: value => 
            value === watch('password') || 'Пароли не совпадают'
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      
      {/* Кнопка отправки формы */}
      <Button 
        type="submit" 
        variant="contained" // Стиль кнопки
        disabled={loading} // Блокировка при загрузке
        sx={{ mt: 2 }} // Стиль - отступ сверху
      >
        {/* Меняем текст при загрузке */}
        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
      </Button>
    </Box>
  );
};

export default RegisterForm;