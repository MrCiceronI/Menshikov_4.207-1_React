// Импорт необходимых хуков React для работы с состоянием, эффектами и оптимизацией
import React, { useMemo, useEffect, useCallback, useRef } from 'react';
// Импорт хуков библиотеки react-table для создания таблицы и сортировки
import { useTable, useSortBy } from 'react-table';
// Импорт хуков Redux для взаимодействия с хранилищем
import { useDispatch, useSelector } from 'react-redux';
// Импорт асинхронных действий из authSlice для работы с отзывами
import { deleteFeedback, fetchFeedbacksPaginated } from '../../store/authSlice';
// Импорт компонентов Material-UI для построения интерфейса
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
// Импорт иконки для кнопки меню действий
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Импорт хука для получения темы из кастомного контекста
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
// Импорт провайдера и бэкенда для поддержки drag-and-drop
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// Импорт кастомного компонента для заголовков колонок с поддержкой drag-and-drop
import DraggableColumnHeader from './DraggableColumnHeader';

// Определение функционального компонента FeedbacksTable
const FeedbacksTable = () => {
  // Получаем функцию dispatch для отправки действий в Redux
  const dispatch = useDispatch();
  // Получаем значение темной темы из кастомного контекста
  const { isDarkMode } = useCustomTheme();
  // Получаем объект темы Material-UI
  const theme = useTheme();
  // Проверяем, является ли устройство мобильным (ширина экрана < 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Извлекаем данные отзывов, пагинацию, флаг загрузки и ошибку из состояния Redux
  const { 
    feedbacks, // Массив отзывов
    feedbacksPagination, // Данные пагинации (currentPage, totalPages, totalItems, perPage)
    loadingFeedbacks, // Флаг загрузки данных
    error // Сообщение об ошибке (если есть)
  } = useSelector(state => state.auth);

  // Создаем реф для контейнера таблицы (для отслеживания скролла)
  const tableContainerRef = useRef(null);
  // Создаем реф для флага загрузки (чтобы избежать множественных запросов)
  const loadingRef = useRef(false);

  // Состояние для управления меню действий (якорь и выбранный отзыв)
  const [anchorEl, setAnchorEl] = React.useState(null); // Элемент, к которому привязано меню
  const [selectedFeedback, setSelectedFeedback] = React.useState(null); // Выбранный отзыв
  const open = Boolean(anchorEl); // Флаг, открыт ли выпадающий список

  // Загрузка первой страницы отзывов при монтировании компонента
  useEffect(() => {
    // Отправляем действие для получения отзывов (страница 1)
    dispatch(fetchFeedbacksPaginated(1));
  }, [dispatch]);

  // Обработчик скролла для бесконечной подгрузки данных
  const handleScroll = useCallback(() => {
    // Проверяем, существует ли контейнер и не выполняется ли уже загрузка
    if (!tableContainerRef.current || loadingRef.current) return;

    // Получаем параметры скролла контейнера
    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    // Проверяем, достиг ли пользователь почти низа таблицы (за 100px до конца)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    // Если пользователь внизу и есть еще страницы для загрузки
    if (
      isNearBottom && 
      feedbacksPagination.currentPage < feedbacksPagination.totalPages
    ) {
      // Устанавливаем флаг загрузки
      loadingRef.current = true;
      // Запрашиваем следующую страницу отзывов
      dispatch(fetchFeedbacksPaginated(feedbacksPagination.currentPage + 1))
        .finally(() => {
          // Сбрасываем флаг загрузки после завершения запроса
          loadingRef.current = false;
        });
    }
  }, [dispatch, feedbacksPagination]);

  // Добавляем и убираем обработчик скролла при монтировании/размонтировании
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      // Добавляем обработчик события скролла
      container.addEventListener('scroll', handleScroll);
      // Удаляем обработчик при размонтировании компонента
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Обработчик клика по кнопке действий (открытие меню)
  const handleClick = (event, feedback) => {
    // Сохраняем выбранный отзыв
    setSelectedFeedback(feedback);
    // Устанавливаем якорь для меню
    setAnchorEl(event.currentTarget);
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    // Сбрасываем якорь, закрывая меню
    setAnchorEl(null);
  };

  // Обработчик удаления отзыва
  const handleDelete = () => {
    // Отправляем действие для удаления выбранного отзыва
    dispatch(deleteFeedback(selectedFeedback.id));
    // Закрываем меню
    handleClose();
  };

  // Состояние для хранения конфигурации колонок таблицы
  const [columns, setColumns] = React.useState([
    { 
      Header: 'ID', // Заголовок колонки
      accessor: 'id', // Ключ для доступа к данным
      width: 50 // Ширина колонки
    },
    { 
      Header: 'Автор', 
      accessor: 'author', 
      width: 150 
    },
    { 
      Header: 'Сообщение', 
      accessor: 'message', 
      width: 300 
    },
    { 
      Header: 'Дата', 
      accessor: 'date', 
      width: 150 
    },
    { 
      Header: 'Действия', 
      accessor: 'actions', 
      disableSortBy: true, // Отключаем сортировку для этой колонки
      // Кастомная отрисовка ячейки с кнопкой меню
      Cell: ({ row }) => (
        <IconButton
          color={'inherit'}
          aria-label="more"
          aria-controls="feedback-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e, row.original)} // Открываем меню при клике
        >
          <MoreVertIcon />
        </IconButton>
      ),
      width: 80 
    }
  ]);

  // Функция для перестановки колонок при drag-and-drop
  const reorderColumns = (draggedId, targetId) => {
    // Находим индексы перемещаемой и целевой колонок
    const draggedIndex = columns.findIndex(col => col.accessor === draggedId);
    const targetIndex = columns.findIndex(col => col.accessor === targetId);
    
    // Проверяем, найдены ли индексы
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Создаем новый массив колонок
    const newColumns = [...columns];
    // Удаляем перемещаемую колонку
    const [removed] = newColumns.splice(draggedIndex, 1);
    // Вставляем её в новую позицию
    newColumns.splice(targetIndex, 0, removed);
    
    // Обновляем состояние колонок
    setColumns(newColumns);
  };

  // Мемоизация колонок и данных для оптимизации производительности
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => feedbacks || [], [feedbacks]);

  // Инициализация таблицы с использованием react-table
  const {
    getTableProps, // Пропсы для всей таблицы
    getTableBodyProps, // Пропсы для тела таблицы
    headerGroups, // Группы заголовков
    rows, // Строки данных
    prepareRow, // Функция для подготовки строки к рендерингу
  } = useTable(
    {
      columns: memoizedColumns, // Колонки таблицы
      data: memoizedData, // Данные таблицы
      initialState: {
        sortBy: [{ id: 'id', desc: true }] // Начальная сортировка по ID (по убыванию)
      }
    },
    useSortBy // Подключаем хук для сортировки
  );

  // Обработка состояний до рендеринга таблицы
  // Если идет загрузка и нет отзывов, показываем индикатор загрузки
  if (loadingFeedbacks && feedbacks.length === 0) return <CircularProgress />;
  // Если есть ошибка, показываем уведомление об ошибке
  if (error) return <Alert severity="error">{error}</Alert>;
  // Если нет отзывов, показываем сообщение
  if (!feedbacks || feedbacks.length === 0) return <Typography>Нет отзывов</Typography>;

  // Рендеринг компонента
  return (
    // Оборачиваем таблицу в провайдер drag-and-drop
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        {/* Контейнер таблицы с поддержкой скролла */}
        <TableContainer 
          ref={tableContainerRef} // Реф для отслеживания скролла
          component={Paper} // Используем Paper для стилизации
          sx={{
            maxHeight: 'calc(100vh - 200px)', // Ограничиваем высоту таблицы
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон в зависимости от темы
            overflowX: 'auto', // Горизонтальный скролл при необходимости
            '&::-webkit-scrollbar': {
              height: '6px' // Стилизация полосы прокрутки
            }
          }}
        >
          {/* Таблица Material-UI */}
          <Table 
            {...getTableProps()} // Пропсы от react-table
            size="small" // Компактный размер ячеек
            stickyHeader // Фиксированный заголовок
          >
            {/* Заголовок таблицы */}
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    // Кастомный компонент для заголовков с поддержкой drag-and-drop
                    <DraggableColumnHeader 
                      key={column.id}
                      column={column}
                      reorderColumns={reorderColumns} // Функция для перестановки колонок
                      sx={{
                        backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5', // Фон заголовка
                        color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
                        fontWeight: 'bold', // Жирный шрифт
                        minWidth: column.width, // Минимальная ширина колонки
                        // Фиксация колонки ID на мобильных устройствах
                        position: column.Header === 'ID' && isMobile ? 'sticky' : null,
                        left: column.Header === 'ID' && isMobile ? 0 : null,
                        zIndex: column.Header === 'ID' && isMobile ? 1 : null
                      }}
                    />
                  ))}
                </TableRow>
              ))}
            </TableHead>
            {/* Тело таблицы */}
            <TableBody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row); // Подготавливаем строку для рендеринга
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <TableCell 
                        {...cell.getCellProps()}
                        sx={{
                          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон ячейки
                          color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
                          minWidth: cell.column.width, // Минимальная ширина
                          // Фиксация колонки ID на мобильных устройствах
                          position: cell.column.Header === 'ID' && isMobile ? 'sticky' : null,
                          left: cell.column.Header === 'ID' && isMobile ? 0 : null,
                          zIndex: cell.column.Header === 'ID' && isMobile ? 1 : null
                        }}
                      >
                        {cell.render('Cell')} {/* Рендерим содержимое ячейки */}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              
              {/* Индикатор загрузки при подгрузке новых данных */}
              {loadingFeedbacks && feedbacks.length > 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress size={24} /> {/* Спиннер загрузки */}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Информация о пагинации */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1, // Отступ сверху
          color: isDarkMode ? '#ffffff' : '#000000' // Цвет текста
        }}>
          <Typography variant="body2">
            Страница {feedbacksPagination.currentPage} из {feedbacksPagination.totalPages} • 
            Всего отзывов: {feedbacksPagination.totalItems}
          </Typography>
        </Box>

        {/* Меню действий для отзыва */}
        <Menu
          id="feedback-menu"
          anchorEl={anchorEl} // Элемент, к которому привязано меню
          open={open} // Флаг открытия
          onClose={handleClose} // Обработчик закрытия
          PaperProps={{
            style: {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон меню
              color: isDarkMode ? '#ffffff' : '#111111' // Цвет текста
            }
          }}
        >
          <MenuItem onClick={handleDelete}>Удалить</MenuItem>
        </Menu>
      </Box>
    </DndProvider>
  );
};

// Экспортируем компонент по умолчанию
export default FeedbacksTable;