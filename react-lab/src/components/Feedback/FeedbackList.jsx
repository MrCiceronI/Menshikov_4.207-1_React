// src/components/Feedback/FeedbackList.jsx
// Импорт необходимых зависимостей
import React from 'react';
import { useSelector } from 'react-redux'; // Хук для доступа к Redux store
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper 
} from '@mui/material'; // Компоненты Material-UI

const FeedbackList = () => {
  // Получаем массив отзывов из Redux store
  // Используем селектор для доступа к state.auth.feedbacks
  const feedbacks = useSelector(state => state.auth.feedbacks);

  return (
    // Компонент Paper создает карточку с тенями для визуального выделения
    <Paper sx={{ 
      mt: 3, // margin-top: 24px (3 * 8px)
      p: 2   // padding: 16px (2 * 8px)
    }}>
      {/* Заголовок секции */}
      <Typography variant="h5" gutterBottom>Отзывы</Typography>
      
      {/* Условный рендеринг в зависимости от наличия отзывов */}
      {feedbacks.length === 0 ? (
        // Если отзывов нет - выводим сообщение
        <Typography>Пока нет отзывов</Typography>
      ) : (
        // Если отзывы есть - рендерим список
        <List>
          {/* Маппим массив отзывов в компоненты ListItem */}
          {feedbacks.map((feedback, index) => (
            // Каждый элемент списка должен иметь уникальный key
            <ListItem key={index}>
              <ListItemText
                primary={feedback.message} // Основной текст - сообщение
                secondary={`Автор: ${feedback.author}, Дата: ${feedback.date}`} 
                // Вторичный текст - автор и дата
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default FeedbackList;