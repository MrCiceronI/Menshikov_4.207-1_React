// src/components/Auth/RegisterForm.jsx
// Импорт необходимых библиотек и компонентов
import React, { useCallback } from 'react'; // React и хук useCallback
import { useForm } from 'react-hook-form'; // Хук для работы с формами
import { TextField, Button, Box, Typography } from '@mui/material'; // UI компоненты Material-UI

// Компонент формы регистрации
const RegisterForm = () => {
  // Использование хука useForm для управления формой:
  // - register: для регистрации полей ввода
  // - handleSubmit: обработчик отправки формы
  // - errors: объект с ошибками валидации
  // - watch: функция для отслеживания значений полей (используется для проверки совпадения паролей)
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  // Обработчик отправки формы, мемоизированный с помощью useCallback
  const onSubmit = useCallback((data) => {
    console.log('Регистрация:', data); // Логирование данных формы
    // Здесь будет логика регистрации (например, запрос к API)
  }, []); // Пустой массив зависимостей - функция создается один раз

  // Рендер формы регистрации
  return (
    // Box - контейнер из Material-UI, используемый как form
    // onSubmit - обработчик отправки, обернутый в handleSubmit
    // sx - стили (margin-top: 3)
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      {/* Заголовок формы */}
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      
      {/* Поле для ввода имени */}
      <TextField
        label="Имя"
        fullWidth // Растягивается на всю ширину
        margin="normal" // Стандартные отступы
        // Регистрация поля с валидацией:
        // required - обязательное поле
        {...register('name', { required: 'Имя обязательно' })}
        error={!!errors.name} // Показывать ошибку, если есть
        helperText={errors.name?.message} // Текст ошибки
      />
      
      {/* Поле для ввода email */}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        // Регистрация поля с валидацией:
        // required - обязательное поле
        // pattern - проверка формата email через regex
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
        type="password" // Скрытый ввод
        fullWidth
        margin="normal"
        // Регистрация поля с валидацией:
        // required - обязательное поле
        // minLength - минимальная длина 6 символов
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
        // Кастомная валидация - проверка совпадения с полем password
        // с использованием функции watch для отслеживания значения password
        {...register('confirmPassword', {
          validate: value => 
            value === watch('password') || 'Пароли не совпадают'
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      
      {/* Кнопка отправки формы */}
      <Button 
        type="submit" // Тип кнопки - submit
        variant="contained" // Стиль Material-UI
        sx={{ mt: 2 }} // Стиль - margin-top: 2
      >
        Зарегистрироваться
      </Button>
    </Box>
  );
};

// Экспорт компонента по умолчанию
export default RegisterForm;