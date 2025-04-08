// src/components/Feedback/FeedbackForm.jsx
// Импорт необходимых зависимостей
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form'; // Хук для управления формой
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки
import { addFeedback } from '../../store/authSlice'; // Action creator
import { TextField, Button, Box, Typography } from '@mui/material'; // UI компоненты

const FeedbackForm = () => {
  // Инициализация хука формы:
  // register - регистрация полей
  // handleSubmit - обработчик отправки
  // errors - объект ошибок валидации
  // reset - сброс формы после отправки
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const dispatch = useDispatch(); // Хук для отправки действий в Redux
  const user = useSelector(state => state.auth.user); // Получаем данные пользователя из Redux

  // Обработчик отправки формы
  const onSubmit = useCallback((data) => {
    // Формируем объект фидбэка:
    const feedback = {
      ...data, // Данные из формы
      author: user?.email || 'Аноним', // Автор (email или 'Аноним')
      date: new Date().toLocaleString() // Текущая дата в локализованном формате
    };
    
    dispatch(addFeedback(feedback)); // Отправляем фидбэк в Redux хранилище
    reset(); // Сбрасываем форму после отправки
  }, [dispatch, user, reset]); // Зависимости для useCallback

  return (
    // Форма с обработчиком onSubmit
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Обратная связь</Typography>
      
      {/* Поле для имени автора */}
      <TextField
        label="Ваше имя"
        fullWidth
        margin="normal"
        {...register('author', { required: 'Имя обязательно' })} // Валидация
        defaultValue={user?.email || ''} // Значение по умолчанию (email пользователя)
        error={!!errors.author} // Отображение ошибки
        helperText={errors.author?.message} // Текст ошибки
      />
      
      {/* Поле для сообщения */}
      <TextField
        label="Сообщение"
        fullWidth
        multiline // Многострочное поле
        rows={4} // Количество видимых строк
        margin="normal"
        {...register('message', { 
          required: 'Сообщение обязательно',
          minLength: {
            value: 10,
            message: 'Сообщение должно быть не менее 10 символов'
          }
        })}
        error={!!errors.message}
        helperText={errors.message?.message}
      />
      
      {/* Кнопка отправки */}
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 2 }} // Стиль margin-top
      >
        Отправить
      </Button>
    </Box>
  );
};

export default FeedbackForm;