// Импорт зависимостей из React для управления состоянием, эффектами и мемоизацией
import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
// Импорт хуков react-table для создания таблицы с сортировкой
import { useTable, useSortBy } from 'react-table';
// Импорт хука useDispatch из react-redux для отправки действий
import { useDispatch } from 'react-redux';
// Импорт действий для изменения роли и блокировки пользователя
import { updateUserRole, blockUser } from '../../store/authSlice';
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
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
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
// Импорт хука RTK Query для получения данных пользователей
import { useGetUsersPaginatedQuery } from '../../store/apiSlice';

// Компонент UsersTable отображает таблицу пользователей с поддержкой сортировки, перетаскивания столбцов, пагинации, изменения ролей и блокировки
const UsersTable = () => {
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
  const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь для действий
  // Флаг открытия контекстного меню
  const open = Boolean(anchorEl);
  // Состояние текущей страницы для пагинации
  const [page, setPage] = useState(1);

  // Использование RTK Query для получения данных пользователей с пагинацией
  const {
    data: usersData, // Данные, возвращаемые запросом (массив пользователей и пагинация)
    isLoading, // Флаг начальной загрузки данных
    isFetching, // Флаг выполнения запроса (включая последующие страницы)
    isError, // Флаг ошибки запроса
    error, // Объект ошибки, если запрос завершился неудачно
  } = useGetUsersPaginatedQuery(page);

  // Мемоизация массива пользователей для предотвращения лишних рендеров
  const users = useMemo(() => usersData?.users || [], [usersData]);
  // Мемоизация объекта пагинации с дефолтными значениями
  const usersPagination = useMemo(
    () => usersData?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 20,
    },
    [usersData]
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
    if (isNearBottom && page < usersPagination.totalPages) {
      loadingRef.current = true; // Установка флага загрузки
      setPage((prev) => prev + 1); // Увеличение номера страницы
    }
  }, [page, usersPagination.totalPages, isFetching]);

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
  const handleClick = (event, user) => {
    setSelectedUser(user); // Сохранение выбранного пользователя
    setAnchorEl(event.currentTarget); // Установка якоря для меню
  };

  // Закрытие контекстного меню
  const handleClose = () => {
    setAnchorEl(null); // Сброс якоря меню
  };

  // Обработчик изменения роли пользователя
  const handleRoleChange = (role) => {
    dispatch(updateUserRole({ id: selectedUser.id, role })); // Отправка действия изменения роли
    handleClose(); // Закрытие меню
  };

  // Обработчик блокировки/разблокировки пользователя
  const handleBlockUser = () => {
    dispatch(blockUser({ id: selectedUser.id, isBlocked: !selectedUser.isBlocked })); // Отправка действия блокировки
    handleClose(); // Закрытие меню
  };

  // Состояние столбцов таблицы
  const [columns, setColumns] = useState([
    { Header: 'ID', accessor: 'id', width: 50 }, // Столбец ID
    { Header: 'Имя', accessor: 'name', width: 150 }, // Столбец имени
    { Header: 'Email', accessor: 'email', width: 200 }, // Столбец email
    {
      Header: 'Роль',
      accessor: 'role',
      width: 100,
      // Кастомное отображение роли с цветом для администратора
      Cell: ({ value }) => (
        <Typography color={value === 'admin' ? 'primary' : 'inherit'}>
          {value}
        </Typography>
      ),
    },
    {
      Header: 'Статус',
      accessor: 'isBlocked',
      width: 100,
      // Отображение статуса (Заблокирован/Активен)
      Cell: ({ value }) => (
        <Typography color={'inherit'}>{value ? 'Заблокирован' : 'Активен'}</Typography>
      ),
    },
    {
      Header: 'Действия',
      accessor: 'actions',
      disableSortBy: true, // Отключение сортировки для столбца
      Cell: ({ row }) => (
        // Кнопка для вызова контекстного меню
        <IconButton
          color="inherit"
          aria-label="more"
          aria-controls="user-menu"
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
  const memoizedData = useMemo(() => users, [users]);

  // Настройка таблицы с использованием react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: memoizedColumns, // Мемоированные столбцы
      data: memoizedData, // Мемоированные данные
      initialState: { sortBy: [{ id: 'id', desc: false }] }, // Начальная сортировка по ID (возрастание)
    },
    useSortBy // Подключение хука сортировки
  );

  // Условный рендеринг в зависимости от состояния загрузки и данных
  if (isLoading && users.length === 0) {
    return <CircularProgress />; // Индикатор начальной загрузки
  }

  if (isError) {
    return <Alert severity="error">{error?.data?.message || 'Ошибка загрузки пользователей'}</Alert>; // Сообщение об ошибке
  }

  if (users.length === 0 && !isLoading) {
    return <Typography>Нет пользователей</Typography>; // Сообщение, если данные отсутствуют
  }

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
            maxWidth: '100vw', // Ограничение ширины
            overflowX: 'auto', // Горизонтальная прокрутка
            '&::-webkit-scrollbar': { height: '6px' }, // Стилизация полосы прокрутки
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Цвет фона
            borderRadius: '3px', // Закругленные углы
          }}
        >
          {/* Таблица с фиксированным заголовком */}
          <Table {...getTableProps()} stickyHeader size="small" sx={{ minWidth: 'max-content' }}>
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
                        color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
                        backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5', // Цвет фона заголовка
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
              {isFetching && users.length > 0 && (
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
            Страница {usersPagination.currentPage} из {usersPagination.totalPages} • Всего
            пользователей: {usersPagination.totalItems}
          </Typography>
        </Box>
        {/* Контекстное меню для действий с пользователем */}
        <Menu
          id="user-menu"
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
          <MenuItem onClick={() => handleRoleChange('admin')}>Сделать администратором</MenuItem>
          <MenuItem onClick={() => handleRoleChange('user')}>Сделать пользователем</MenuItem>
          <MenuItem onClick={handleBlockUser}>
            {selectedUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}
          </MenuItem>
        </Menu>
      </Box>
    </DndProvider>
  );
};

// Экспорт компонента по умолчанию
export default UsersTable;