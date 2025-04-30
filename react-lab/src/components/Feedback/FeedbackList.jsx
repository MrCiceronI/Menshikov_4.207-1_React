// Импорт React для создания компонента и использования React.Fragment
import React from 'react';
// Импорт компонентов Material-UI для создания UI списка
import { 
  List, // Список
  ListItem, // Элемент списка
  ListItemText, // Текст элемента списка
  Typography, // Текст
  Paper, // Контейнер с тенью
  IconButton, // Кнопка с иконкой
  ListItemSecondaryAction, // Вторичное действие в элементе списка
  Divider, // Разделитель
  Alert, // Уведомление об ошибке
  CircularProgress // Индикатор загрузки
} from '@mui/material';
// Импорт иконки удаления
import DeleteIcon from '@mui/icons-material/Delete';
// Импорт кастомного хука для получения состояния темы
import { useTheme } from '../../context/ThemeContext';
// Импорт хука для доступа к состоянию Redux
import { useSelector } from 'react-redux';
// Импорт RTK Query хуков для получения списка отзывов и удаления отзыва
import { 
  useGetFeedbacksListQuery,
  useDeleteFeedbackMutation 
} from '../../store/apiSlice';

// Компонент FeedbackList отображает список отзывов с возможностью удаления
const FeedbackList = () => {
  // Получение состояния темы (темный/светлый режим)
  const { isDarkMode } = useTheme();
  // Получение данных пользователя из Redux store
  const { user } = useSelector(state => state.auth);
  // Проверка, является ли пользователь администратором
  const isAdmin = user?.role === 'admin';
  
  // Использование RTK Query для получения списка отзывов
  const {
    data: feedbacks = [], // Список отзывов (по умолчанию пустой массив)
    isLoading, // Флаг начальной загрузки
    isError, // Флаг ошибки
    error, // Объект ошибки
    isFetching // Флаг выполнения запроса (например, при обновлении)
  } = useGetFeedbacksListQuery();
  
  // Использование RTK Query мутации для удаления отзыва
  const [deleteFeedback] = useDeleteFeedbackMutation();

  // Обработчик удаления отзыва
  const handleDelete = async (id) => {
    try {
      // Выполнение мутации удаления
      await deleteFeedback(id).unwrap();
    } catch (err) {
      // Логирование ошибки в консоль
      console.error('Failed to delete feedback:', err);
    }
  };

  // Условный рендеринг для состояний загрузки и ошибки
  if (isLoading) return <CircularProgress />; // Индикатор начальной загрузки
  if (isError) return <Alert error={error.toString()} />; // Уведомление об ошибке

  // Основной рендеринг компонента
  return (
    // Контейнер списка с тенью и адаптивным фоном
    <Paper sx={{ 
      mt: 3, // Отступ сверху
      p: 2, // Внутренние отступы
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона
      color: isDarkMode ? '#ffffff' : '#000000' // Цвет текста
    }}>
      {/* Заголовок списка */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
      >
        Отзывы
        {/* Индикатор загрузки при обновлении данных */}
        {isFetching && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Typography>
      
      {/* Условное отображение в зависимости от наличия отзывов */}
      {feedbacks.length === 0 ? (
        // Сообщение, если отзывы отсутствуют
        <Typography>Пока нет отзывов</Typography>
      ) : (
        // Список отзывов
        <List>
          {feedbacks.map((feedback, index) => (
            // Fragment для группировки элемента списка и разделителя
            <React.Fragment key={feedback.id || index}>
              {/* Элемент списка с отзывом */}
              <ListItem sx={{ 
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5', // Цвет фона элемента
                '&:hover': {
                  backgroundColor: isDarkMode ? '#3d3d3d' : '#eeeeee' // Цвет при наведении
                }
              }}>
                {/* Текст отзыва и метаданные */}
                <ListItemText
                  primary={feedback.message} // Основной текст (сообщение отзыва)
                  secondary={`Автор: ${feedback.author}, Дата: ${feedback.date}`} // Вторичный текст (автор и дата)
                  primaryTypographyProps={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет основного текста
                  secondaryTypographyProps={{ color: isDarkMode ? '#b0b0b0' : '#555555' }} // Цвет вторичного текста
                />
                {/* Кнопка удаления для автора отзыва, пользователя или администратора */}
                {(user?.id === feedback.userId || user?.email === feedback.author || isAdmin) && (
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" // Позиция кнопки (справа)
                      aria-label="delete" // Метка для доступности
                      onClick={() => handleDelete(feedback.id)} // Обработчик удаления
                      sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} // Цвет иконки
                    >
                      <DeleteIcon /> {/* Иконка удаления */}
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {/* Разделитель между элементами списка (кроме последнего) */}
              {index < feedbacks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

// Экспорт компонента по умолчанию
export default FeedbackList;