// src/components/Feedback/FeedbackForm.jsx
// Импорт необходимых библиотек и компонентов
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Хук для управления формой
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки
import { addFeedback, fetchFeedbacks } from '../../store/authSlice'; // Экшены для работы с отзывами
// Компоненты Material-UI
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import { useTheme } from '../../context/ThemeContext'; // Контекст темы

const FeedbackForm = () => {
  // Инициализация хука useForm:
  // register - регистрация полей формы
  // handleSubmit - обработчик отправки
  // errors - объект ошибок валидации
  // reset - функция сброса формы
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const dispatch = useDispatch(); // Хук для отправки экшенов
  // Получаем состояние из Redux:
  // user - данные текущего пользователя
  // loading - состояние загрузки
  // error - ошибки
  const { user, loading, error } = useSelector(state => state.auth);
  const { isDarkMode } = useTheme(); // Получаем текущую тему

  // Эффект для загрузки отзывов при монтировании компонента
  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Обработчик отправки формы
  const onSubmit = (data) => {
    // Формируем объект отзыва:
    // - данные из формы
    // - автор (email пользователя или "Аноним")
    // - текущая дата
    // - ID пользователя (если авторизован)
    const feedback = {
      ...data,
      author: user?.email || 'Аноним',
      date: new Date().toLocaleString(),
      userId: user?.id
    };
    dispatch(addFeedback(feedback)); // Отправляем отзыв
    reset(); // Сбрасываем форму после отправки
  };

  return (
    // Paper - контейнер с тенью
    <Paper
      elevation={3} // Уровень тени
      sx={{
        p: 3, // Внутренние отступы
        mb: 3, // Внешний отступ снизу
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон по теме
        color: isDarkMode ? '#ffffff' : '#000000' // Цвет текста по теме
      }}
    >
      {/* Форма для отправки отзыва */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Заголовок формы */}
        <Typography 
          variant="h5" 
          gutterBottom // Отступ снизу
          sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет по теме
        >
          Обратная связь
        </Typography>
        
        {/* Блок для отображения ошибок */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, // Отступ снизу
              backgroundColor: isDarkMode ? '#d32f2f' : '#fdecea' // Фон по теме
            }}
          >
            {error}
          </Alert>
        )}

        {/* Поле для ввода имени */}
        <TextField
          label="Ваше имя"
          fullWidth // На всю ширину
          margin="normal" // Стандартные отступы
          {...register('author', { required: 'Имя обязательно' })} // Валидация
          defaultValue={user?.email || ''} // Значение по умолчанию (email пользователя)
          error={!!errors.author} // Показать ошибку если есть
          helperText={errors.author?.message} // Текст ошибки
          sx={{
            // Стили для разных состояний в темной/светлой теме
            '& .MuiInputBase-root': {
              color: isDarkMode ? '#ffffff' : '#000000',
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#ffffff' : '#000000',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDarkMode ? '#555' : '#ccc',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#777' : '#999',
              },
            },
            '& .MuiFormHelperText-root': {
              color: isDarkMode ? '#b0b0b0' : '#555',
            }
          }}
        />
        
        {/* Поле для ввода сообщения */}
        <TextField
          label="Сообщение"
          fullWidth
          multiline // Многострочное поле
          rows={4} // Количество видимых строк
          margin="normal"
          {...register('message', { 
            required: 'Сообщение обязательно',
            minLength: { // Минимальная длина сообщения
              value: 10,
              message: 'Сообщение должно быть не менее 10 символов'
            }
          })}
          error={!!errors.message}
          helperText={errors.message?.message}
          sx={{
            // Аналогичные стили для темной/светлой темы
            '& .MuiInputBase-root': {
              color: isDarkMode ? '#ffffff' : '#000000',
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#ffffff' : '#000000',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDarkMode ? '#555' : '#ccc',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#777' : '#999',
              },
            },
            '& .MuiFormHelperText-root': {
              color: isDarkMode ? '#b0b0b0' : '#555',
            }
          }}
        />
        
        {/* Кнопка отправки */}
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} // Блокировка при загрузке
          sx={{ 
            mt: 2, // Отступ сверху
            backgroundColor: isDarkMode ? '#1976d2' : '#1976d2', // Цвет фона
            color: '#ffffff', // Цвет текста
            '&:hover': { // Стиль при наведении
              backgroundColor: isDarkMode ? '#1565c0' : '#1565c0'
            }
          }}
        >
          {/* Меняем текст при загрузке */}
          {loading ? 'Отправка...' : 'Отправить'}
        </Button>
      </Box>
    </Paper>
  );
};

export default FeedbackForm;