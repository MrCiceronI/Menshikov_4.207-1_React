// Импорт React для создания компонента
import React from 'react';
// Импорт хука useForm из react-hook-form для управления формой
import { useForm } from 'react-hook-form';
// Импорт компонентов Material-UI для UI формы
import { 
  TextField, // Поле ввода
  Button, // Кнопка
  Box, // Контейнер для компоновки
  Typography, // Текст
  Alert, // Уведомление об ошибке
  Paper, // Контейнер с тенью
  CircularProgress // Индикатор загрузки
} from '@mui/material';
// Импорт кастомного хука для получения состояния темы
import { useTheme } from '../../context/ThemeContext';
// Импорт хука для доступа к состоянию Redux
import { useSelector } from 'react-redux';
// Импорт RTK Query мутации для добавления отзыва
import { useAddNewFeedbackMutation } from '../../store/apiSlice';

// Компонент FeedbackForm отображает форму для отправки отзывов
const FeedbackForm = () => {
  // Извлечение методов и состояния формы из useForm
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  // Получение состояния темы (темный/светлый режим)
  const { isDarkMode } = useTheme();
  // Получение данных пользователя из Redux store
  const { user } = useSelector(state => state.auth);
  
  // Использование RTK Query мутации для отправки отзыва
  const [addFeedback, { isLoading, isError, error }] = useAddNewFeedbackMutation();

  // Обработчик отправки формы
  const onSubmit = async (data) => {
    // Формирование объекта отзыва
    const feedback = {
      ...data, // Данные из формы (author, message)
      author: user?.email || 'Аноним', // Email пользователя или 'Аноним'
      date: new Date().toLocaleString(), // Текущая дата и время
      userId: user?.id // ID пользователя (если есть)
    };
    
    try {
      // Отправка отзыва через мутацию
      await addFeedback(feedback).unwrap();
      // Сброс формы после успешной отправки
      reset();
    } catch (err) {
      // Логирование ошибки в консоль
      console.error('Failed to add feedback:', err);
    }
  };

  // Рендеринг компонента
  return (
    // Контейнер формы с тенью и адаптивным фоном
    <Paper
      elevation={3} // Тень для визуального выделения
      sx={{
        p: 3, // Внутренние отступы
        mb: 3, // Внешний отступ снизу
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона
        color: isDarkMode ? '#ffffff' : '#000000' // Цвет текста
      }}
    >
      {/* Форма с обработчиком отправки */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Заголовок формы */}
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
        >
          Обратная связь
          {/* Индикатор загрузки при отправке */}
          {isLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </Typography>
        
        {/* Уведомление об ошибке при отправке */}
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.data?.message || 'Ошибка при отправке отзыва'}
          </Alert>
        )}

        {/* Поле для имени автора */}
        <TextField
          label="Ваше имя" // Метка поля
          fullWidth // Полная ширина
          margin="normal" // Отступы
          {...register('author', { required: 'Имя обязательно' })} // Регистрация поля с валидацией
          defaultValue={user?.email || ''} // Значение по умолчанию (email пользователя)
          error={!!errors.author} // Отображение ошибки
          helperText={errors.author?.message} // Текст ошибки
          sx={{
            // Стили для темной/светлой темы
            '& .MuiInputBase-root': {
              color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста ввода
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#ffffff' : '#000000', // Цвет метки
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDarkMode ? '#555' : '#ccc', // Цвет границы
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#777' : '#999', // Цвет границы при наведении
              },
            },
            '& .MuiFormHelperText-root': {
              color: isDarkMode ? '#b0b0b0' : '#555', // Цвет текста ошибки
            }
          }}
        />
        
        {/* Поле для сообщения */}
        <TextField
          label="Сообщение" // Метка поля
          fullWidth // Полная ширина
          multiline // Многострочный ввод
          rows={4} // Количество строк
          margin="normal" // Отступы
          {...register('message', { 
            required: 'Сообщение обязательно', // Обязательное поле
            minLength: {
              value: 10,
              message: 'Сообщение должно быть не менее 10 символов' // Минимальная длина
            }
          })} // Регистрация поля с валидацией
          error={!!errors.message} // Отображение ошибки
          helperText={errors.message?.message} // Текст ошибки
          sx={{
            // Стили для темной/светлой темы (аналогично полю author)
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
        
        {/* Кнопка отправки формы */}
        <Button 
          type="submit" // Тип кнопки для отправки формы
          variant="contained" // Стиль кнопки (заполненная)
          disabled={isLoading} // Отключение во время загрузки
          sx={{ 
            mt: 2, // Отступ сверху
            backgroundColor: isDarkMode ? '#1976d2' : '#1976d2', // Цвет фона
            color: '#ffffff', // Цвет текста
            '&:hover': { backgroundColor: isDarkMode ? '#1565c0' : '#1565c0' } // Цвет при наведении
          }}
        >
          {/* Текст кнопки меняется в зависимости от состояния загрузки */}
          {isLoading ? 'Отправка...' : 'Отправить'}
        </Button>
      </Box>
    </Paper>
  );
};

// Экспорт компонента по умолчанию
export default FeedbackForm;