// src/components/User/ProfileForm.jsx
// Импорт необходимых зависимостей
import React from 'react';
import { useForm } from 'react-hook-form'; // Хук для работы с формами
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки
import { updateProfile } from '../../store/authSlice'; // Экшен для обновления профиля
// Компоненты Material-UI
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useTheme } from '../../context/ThemeContext'; // Контекст темы

const ProfileForm = () => {
  // Получаем данные текущего пользователя из Redux хранилища
  const { user } = useSelector(state => state.auth);
  
  // Инициализация формы с дефолтными значениями из профиля пользователя
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '', // Имя пользователя
      email: user?.email || '', // Email пользователя
      password: '' // Пустое поле для нового пароля
    }
  });
  
  const dispatch = useDispatch(); // Хук для отправки экшенов
  const { loading, error } = useSelector(state => state.auth); // Состояние загрузки и ошибки
  const { isDarkMode } = useTheme(); // Получаем текущую тему (темная/светлая)

  // Обработчик отправки формы
  const onSubmit = (data) => {
    // Подготавливаем данные для обновления:
    // - сохраняем все текущие данные пользователя
    // - добавляем/обновляем данные из формы
    // - если пароль не введен, сохраняем старый
    const updateData = {
      ...user,
      ...data,
      password: data.password || user.password
    };
    dispatch(updateProfile(updateData)); // Отправляем экшен обновления
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      sx={{ 
        mt: 3, // Отступ сверху
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон в зависимости от темы
        color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
        p: 3, // Внутренние отступы
        borderRadius: 1 // Скругление углов
      }}
    >
      {/* Заголовок формы */}
      <Typography variant="h5" gutterBottom>Редактирование профиля</Typography>
      
      {/* Блок для отображения ошибок (если есть) */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Поле для редактирования имени */}
      <TextField
        label="Имя"
        fullWidth // На всю ширину
        margin="normal" // Стандартные отступы
        {...register('name', { required: 'Имя обязательно' })} // Валидация на обязательность
        error={!!errors.name} // Показать ошибку если есть
        helperText={errors.name?.message} // Текст ошибки
        sx={{
          '& .MuiInputBase-input': { // Стили для текста ввода
            color: isDarkMode ? '#ffffff' : '#000000'
          },
          '& .MuiInputLabel-root': { // Стили для лейбла
            color: isDarkMode ? '#ffffff' : '#000000'
          }
        }}
      />
      
      {/* Поле для редактирования email */}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register('email', { 
          required: 'Email обязателен',
          pattern: { // Валидация формата email
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Некорректный email'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{
          '& .MuiInputBase-input': {
            color: isDarkMode ? '#ffffff' : '#000000'
          },
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#ffffff' : '#000000'
          }
        }}
      />
      
      {/* Поле для изменения пароля */}
      <TextField
        label="Новый пароль (оставьте пустым, чтобы не менять)"
        type="password" // Скрытие ввода
        fullWidth
        margin="normal"
        {...register('password')} // Без обязательной валидации
        sx={{
          '& .MuiInputBase-input': {
            color: isDarkMode ? '#ffffff' : '#000000'
          },
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#ffffff' : '#000000'
          }
        }}
      />
      
      {/* Кнопка сохранения изменений */}
      <Button 
        type="submit"
        variant="contained" // Стиль кнопки
        disabled={loading} // Блокировка при загрузке
        sx={{ 
          mt: 2, // Отступ сверху
          backgroundColor: isDarkMode ? '#1976d2' : '#1976d2', // Цвет фона
          color: '#ffffff' // Цвет текста
        }}
      >
        {/* Меняем текст при загрузке */}
        {loading ? 'Сохранение...' : 'Сохранить изменения'}
      </Button>
    </Box>
  );
};

export default ProfileForm;