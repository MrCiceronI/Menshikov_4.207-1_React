// src/components/Feedback/FeedbackList.jsx
// Импорт необходимых библиотек и компонентов
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux хуки
import { deleteFeedback } from '../../store/authSlice'; // Экшен для удаления отзыва
// Компоненты Material-UI
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper,
  IconButton,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Иконка удаления
import { useTheme } from '../../context/ThemeContext'; // Контекст темы

const FeedbackList = () => {
  const dispatch = useDispatch(); // Хук для отправки экшенов
  // Получаем данные из Redux хранилища:
  // feedbacks - список отзывов
  // user - данные текущего пользователя
  const { feedbacks, user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  // Обработчик удаления отзыва
  const handleDelete = (id) => {
    dispatch(deleteFeedback(id)); // Отправляем экшен удаления
  };

  const { isDarkMode } = useTheme(); // Получаем текущую тему

  return (
    // Paper - контейнер с тенью
    <Paper sx={{ 
      mt: 3, // Отступ сверху
      p: 2, // Внутренние отступы
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон по теме
      color: isDarkMode ? '#ffffff' : '#000000' // Цвет текста по теме
    }}>
      {/* Заголовок списка */}
      <Typography 
        variant="h5" 
        gutterBottom // Отступ снизу
        sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет по теме
      >
        Отзывы
      </Typography>
      
      {/* Условный рендеринг: если отзывов нет */}
      {feedbacks.length === 0 ? (
        <Typography>Пока нет отзывов</Typography>
      ) : (
        // Список отзывов
        <List>
          {feedbacks.map((feedback, index) => (
            <React.Fragment key={feedback.id || index}>
              {/* Элемент списка с отзывом */}
              <ListItem sx={{ 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5', // Фон по теме
                '&:hover': { // Эффект при наведении
                  backgroundColor: isDarkMode ? '#3d3d3d' : '#eeeeee'
                }
              }}>
                {/* Текст отзыва */}
                <ListItemText
                  primary={feedback.message} // Основной текст (сообщение)
                  secondary={`Автор: ${feedback.author}, Дата: ${feedback.date}`} // Подпись
                  primaryTypographyProps={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет текста
                  secondaryTypographyProps={{ color: isDarkMode ? '#b0b0b0' : '#555555' }} // Цвет подписи
                />
                {/* Кнопка удаления (показывается только автору или админу) */}
                {(user?.id === feedback.userId || user?.email === feedback.author || isAdmin) && (
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" // Выравнивание по правому краю
                      aria-label="delete" // Доступность
                      onClick={() => handleDelete(feedback.id)} // Обработчик клика
                      sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет иконки
                    >
                      <DeleteIcon /> {/* Иконка корзины */}
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {/* Разделитель между элементами (кроме последнего) */}
              {index < feedbacks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default FeedbackList;