// Импорт зависимостей из React для управления состоянием, эффектами и мемоизацией
import React, { useMemo, useEffect, useCallback, useRef, useState } from 'react';
// Импорт хуков react-table для создания таблицы с сортировкой
import { useTable, useSortBy } from 'react-table';
// Импорт хука useDispatch из react-redux для отправки действий
import { useDispatch } from 'react-redux';
// Импорт действия deleteFeedback из среза authSlice
import { deleteFeedback } from '../../store/authSlice';
// Импорт компонентов Material-UI для создания UI таблицы и меню
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
  useTheme,
} from '@mui/material';
// Импорт иконки для кнопки контекстного меню
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Импорт кастомного хука useTheme для получения состояния темы
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
// Импорт провайдера и бэкенда для поддержки перетаскивания столбцов
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// Импорт компонента для перетаскиваемых заголовков столбцов
import DraggableColumnHeader from './DraggableColumnHeader';
// Импорт хука RTK Query для получения данных отзывов
import { useGetFeedbacksPaginatedQuery } from '../../store/apiSlice';

// Компонент FeedbacksTable отображает таблицу отзывов с поддержкой сортировки, перетаскивания столбцов, пагинации и удаления записей
const FeedbacksTable = () => {
  // Хук для отправки действий в Redux store
  const dispatch = useDispatch();
  // Получение состояния темы (темный/светлый режим) из кастомного контекста
  const { isDarkMode } = useCustomTheme();
  // Хук для доступа к теме Material-UI
  const theme = useTheme();
  // Проверка, является ли устройство мобильным (экран меньше точки 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Ссылка на DOM-элемент контейнера таблицы для отслеживания прокрутки
  const tableContainerRef = useRef(null);
  // Флаг для предотвращения множественных запросов при бесконечной прокрутке
  const loadingRef = useRef(false);

  // Состояние для управления контекстным меню
  const [anchorEl, setAnchorEl] = useState(null); // Элемент, к которому привязано меню
  const [selectedFeedback, setSelectedFeedback] = useState(null); // Выбранный отзыв для действий
  // Флаг открытия контекстного меню
  const open = Boolean(anchorEl);
  // Состояние текущей страницы для пагинации
  const [page, setPage] = useState(1);

  // Использование RTK Query для получения данных отзывов с пагинацией
  const {
    data: feedbacksData, // Данные, возвращаемые запросом (массив отзывов и пагинация)
    isLoading, // Флаг начальной загрузки данных
    isFetching, // Флаг выполнения запроса (включая последующие страницы)
    isError, // Флаг ошибки запроса
    error, // Объект ошибки, если запрос завершился неудачно
  } = useGetFeedbacksPaginatedQuery(page);

  // Мемоизация массива отзывов для предотвращения лишних рендеров
  const feedbacks = useMemo(() => feedbacksData?.feedbacks || [], [feedbacksData]);
  // Мемоизация объекта пагинации с дефолтными значениями
  const feedbacksPagination = useMemo(
    () => feedbacksData?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 20,
    },
    [feedbacksData]
  );

  // Функция обработки прокрутки для реализации бесконечной прокрутки
  const handleScroll = useCallback(() => {
    // Проверка, что контейнер существует и нет активных запросов
    if (!tableContainerRef.current || loadingRef.current || isFetching) return;

    // Извлечение параметров прокрутки
    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    // Проверка, достиг ли пользователь нижней части таблицы (с запасом 100px)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    // Если пользователь внизу и есть еще страницы, увеличиваем номер страницы
    if (isNearBottom && page < feedbacksPagination.totalPages) {
      loadingRef.current = true; // Установка флага загрузки
      setPage((prev) => prev + 1); // Увеличение номера страницы
    }
  }, [page, feedbacksPagination.totalPages, isFetching]);

  // Эффект для добавления и удаления обработчика прокрутки
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      // Добавление обработчика прокрутки
      container.addEventListener('scroll', handleScroll);
      // Очистка обработчика при размонтировании компонента
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Эффект для сброса флага загрузки после завершения запроса
  useEffect(() => {
    if (!isFetching) {
      loadingRef.current = false; // Сброс флага после завершения загрузки
    }
  }, [isFetching]);

  // Обработчик клика по кнопке действий для открытия контекстного меню
  const handleClick = (event, feedback) => {
    setSelectedFeedback(feedback); // Сохранение выбранного отзыва
    setAnchorEl(event.currentTarget); // Установка якоря для меню
  };

  // Закрытие контекстного меню
  const handleClose = () => {
    setAnchorEl(null); // Сброс якоря меню
  };

  // Обработчик удаления отзыва
  const handleDelete = () => {
    dispatch(deleteFeedback(selectedFeedback.id)); // Отправка действия удаления
    handleClose(); // Закрытие меню
  };

  // Состояние столбцов таблицы
  const [columns, setColumns] = useState([
    { Header: 'ID', accessor: 'id', width: 50 }, // Столбец ID
    { Header: 'Автор', accessor: 'author', width: 150 }, // Столбец автора
    { Header: 'Сообщение', accessor: 'message', width: 300 }, // Столбец сообщения
    { Header: 'Дата', accessor: 'date', width: 150 }, // Столбец даты
    {
      Header: 'Действия',
      accessor: 'actions',
      disableSortBy: true, // Отключение сортировки для столбца
      Cell: ({ row }) => (
        // Кнопка для вызова контекстного меню
        <IconButton
          color="inherit"
          aria-label="more"
          aria-controls="feedback-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e, row.original)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
      width: 80,
    },
  ]);

  // Функция для изменения порядка столбцов при перетаскивании
  const reorderColumns = (draggedId, targetId) => {
    // Поиск индексов перетаскиваемого и целевого столбцов
    const draggedIndex = columns.findIndex((col) => col.accessor === draggedId);
    const targetIndex = columns.findIndex((col) => col.accessor === targetId);
    // Если один из столбцов не найден, прерываем выполнение
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Создание нового массива столбцов
    const newColumns = [...columns];
    // Удаление перетаскиваемого столбца и вставка его на новое место
    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, removed);
    // Обновление состояния столбцов
    setColumns(newColumns);
  };

  // Мемоизация столбцов и данных для предотвращения лишних рендеров
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => feedbacks, [feedbacks]);

  // Настройка таблицы с использованием react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: memoizedColumns, // Мемоированные столбцы
      data: memoizedData, // Мемоированные данные
      initialState: { sortBy: [{ id: 'id', desc: true }] }, // Начальная сортировка по ID (убывание)
    },
    useSortBy // Подключение хука сортировки
  );

  // Условный рендеринг в зависимости от состояния загрузки и данных
  if (isLoading && feedbacks.length === 0) return <CircularProgress />; // Индикатор начальной загрузки
  if (isError) return <Alert severity="error">{error?.data?.message || 'Ошибка загрузки отзывов'}</Alert>; // Сообщение об ошибке
  if (feedbacks.length === 0 && !isLoading) return <Typography>Нет отзывов</Typography>; // Сообщение, если данные отсутствуют

  // Основной рендеринг компонента
  return (
    // Провайдер для поддержки перетаскивания столбцов
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        {/* Контейнер таблицы с вертикальной и горизонтальной прокруткой */}
        <TableContainer
          ref={tableContainerRef}
          component={Paper}
          sx={{
            maxHeight: 'calc(100vh - 200px)', // Ограничение высоты для прокрутки
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона в зависимости от темы
            overflowX: 'auto', // Горизонтальная прокрутка
            '&::-webkit-scrollbar': { height: '6px' }, // Стилизация полосы прокрутки
          }}
        >
          {/* Таблица с фиксированным заголовком */}
          <Table {...getTableProps()} size="small" stickyHeader>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // Компонент для перетаскиваемых заголовков
                    <DraggableColumnHeader
                      key={column.id}
                      column={column}
                      reorderColumns={reorderColumns}
                      sx={{
                        backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5', // Цвет фона заголовка
                        color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
                        fontWeight: 'bold', // Жирный шрифт
                        minWidth: column.width, // Минимальная ширина столбца
                        // Фиксация столбца ID на мобильных устройствах
                        position: column.Header === 'ID' && isMobile ? 'sticky' : null,
                        left: column.Header === 'ID' && isMobile ? 0 : null,
                        zIndex: column.Header === 'ID' && isMobile ? 1 : null,
                      }}
                    />
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row); // Подготовка строки для рендеринга
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <TableCell
                        {...cell.getCellProps()}
                        sx={{
                          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона ячейки
                          color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
                          minWidth: cell.column.width, // Минимальная ширина ячейки
                          // Фиксация столбца ID на мобильных устройствах
                          position: cell.column.Header === 'ID' && isMobile ? 'sticky' : null,
                          left: cell.column.Header === 'ID' && isMobile ? 0 : null,
                          zIndex: cell.column.Header === 'ID' && isMobile ? 1 : null,
                        }}
                      >
                        {cell.render('Cell')} {/* Рендеринг содержимого ячейки */}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {/* Индикатор загрузки при подгрузке новых данных */}
              {isFetching && feedbacks.length > 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Отображение информации о пагинации */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
            color: isDarkMode ? '#ffffff' : '#000000',
          }}
        >
          <Typography variant="body2">
            Страница {feedbacksPagination.currentPage} из {feedbacksPagination.totalPages} • Всего
            отзывов: {feedbacksPagination.totalItems}
          </Typography>
        </Box>
        {/* Контекстное меню для действий с отзывом */}
        <Menu
          id="feedback-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона меню
              color: isDarkMode ? '#ffffff' : '#111111', // Цвет текста
            },
          }}
        >
          <MenuItem onClick={handleDelete}>Удалить</MenuItem>
        </Menu>
      </Box>
    </DndProvider>
  );
};

// Экспорт компонента по умолчанию
export default FeedbacksTable;