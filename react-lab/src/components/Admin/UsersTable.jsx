// Импорт необходимых хуков и компонентов из React
import React, { useMemo, useCallback, useEffect, useRef } from 'react';
// Импорт хуков для работы с таблицей и сортировкой из библиотеки react-table
import { useTable, useSortBy } from 'react-table';
// Импорт хуков для работы с Redux (диспетчер и селектор состояния)
import { useDispatch, useSelector } from 'react-redux';
// Импорт асинхронных действий из authSlice для работы с пользователями
import { updateUserRole, fetchUsersPaginated, blockUser } from '../../store/authSlice';
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
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
// Импорт иконки для кнопки меню действий
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Импорт хука для получения темы из кастомного контекста
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
// Импорт провайдера и бэкенда для поддержки drag-and-drop функциональности
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// Импорт кастомного компонента для заголовков колонок с поддержкой drag-and-drop
import DraggableColumnHeader from './DraggableColumnHeader';

// Определение функционального компонента UsersTable
const UsersTable = () => {
  // Получаем функцию dispatch для отправки действий в Redux
  const dispatch = useDispatch();
  // Извлекаем данные пользователей, пагинацию и флаг загрузки из состояния Redux
  const { 
    users, // Массив пользователей
    usersPagination, // Данные пагинации (currentPage, totalPages, totalItems, perPage)
    loadingUsers // Флаг, указывающий на загрузку данных
  } = useSelector(state => state.auth);
  
  // Получаем значение темной темы из кастомного контекста
  const { isDarkMode } = useCustomTheme();
  // Получаем объект темы Material-UI
  const theme = useTheme();
  // Проверяем, является ли устройство мобильным (ширина экрана < 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Создаем реф для контейнера таблицы (для отслеживания скролла)
  const tableContainerRef = useRef(null);
  // Создаем реф для флага загрузки (чтобы избежать множественных запросов)
  const loadingRef = useRef(false);

  // Состояние для управления меню действий (якорь и выбранный пользователь)
  const [anchorEl, setAnchorEl] = React.useState(null); // Элемент, к которому привязано меню
  const [selectedUser, setSelectedUser] = React.useState(null); // Выбранный пользователь
  const open = Boolean(anchorEl); // Флаг, открыт ли выпадающий список

  // Загрузка первой страницы пользователей при монтировании компонента
  useEffect(() => {
    // Отправляем действие для получения пользователей (страница 1)
    dispatch(fetchUsersPaginated(1));
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
      usersPagination.currentPage < usersPagination.totalPages
    ) {
      // Устанавливаем флаг загрузки
      loadingRef.current = true;
      // Запрашиваем следующую страницу пользователей
      dispatch(fetchUsersPaginated(usersPagination.currentPage + 1))
        .finally(() => {
          // Сбрасываем флаг загрузки после завершения запроса
          loadingRef.current = false;
        });
    }
  }, [dispatch, usersPagination]);

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
  const handleClick = (event, user) => {
    // Сохраняем выбранного пользователя
    setSelectedUser(user);
    // Устанавливаем якорь для меню
    setAnchorEl(event.currentTarget);
  };

  // Обработчик закрытия меню
  const handleClose = () => {
    // Сбрасываем якорь, закрывая меню
    setAnchorEl(null);
  };

  // Обработчик изменения роли пользователя
  const handleRoleChange = (role) => {
    // Отправляем действие для обновления роли выбранного пользователя
    dispatch(updateUserRole({ id: selectedUser.id, role }));
    // Закрываем меню
    handleClose();
  };

  // Обработчик блокировки/разблокировки пользователя
  const handleBlockUser = () => {
    // Отправляем действие для изменения статуса блокировки
    dispatch(blockUser({ id: selectedUser.id, isBlocked: !selectedUser.isBlocked }));
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
      Header: 'Имя', 
      accessor: 'name', 
      width: 150 
    },
    { 
      Header: 'Email', 
      accessor: 'email', 
      width: 200 
    },
    { 
      Header: 'Роль',
      accessor: 'role', 
      width: 100,
      // Кастомная отрисовка ячейки для выделения администраторов
      Cell: ({ value }) => (
        <Typography color={value === 'admin' ? 'primary' : 'inherit'}>
          {value}
        </Typography>
      )
    },
    {
      Header: 'Статус',
      accessor: 'isBlocked',
      width: 100,
      // Кастомная отрисовка ячейки для отображения статуса
      Cell: ({ value }) => (
        <Typography color={'inherit'}>
          {value ? 'Заблокирован' : 'Активен'}
        </Typography>
      )
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
          aria-controls="user-menu"
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
  const memoizedData = useMemo(() => users, [users]);

  // Инициализация таблицы с использованием react-table
  const {
    getTableProps, // Пропсы для всей таблицы
    getTableBodyProps, // Пропсы для тела таблицы
    headerGroups, // Группы заголовков
    rows, // Строки данных
    prepareRow // Функция для подготовки строки к рендерингу
  } = useTable(
    {
      columns: memoizedColumns, // Колонки таблицы
      data: memoizedData, // Данные таблицы
      initialState: {
        sortBy: [{ id: 'id', desc: false }] // Начальная сортировка по ID (по возрастанию)
      }
    },
    useSortBy // Подключаем хук для сортировки
  );

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
            maxWidth: '100vw', // Ограничиваем ширину
            overflowX: 'auto', // Горизонтальный скролл при необходимости
            '&::-webkit-scrollbar': {
              height: '6px' // Стилизация полосы прокрутки
            },
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', // Фон в зависимости от темы
            borderRadius: '3px' // Скругление углов
          }}
        >
          {/* Таблица Material-UI */}
          <Table 
            {...getTableProps()} // Пропсы от react-table
            stickyHeader // Фиксированный заголовок
            size="small" // Компактный размер ячеек
            sx={{ minWidth: 'max-content' }} // Минимальная ширина таблицы
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
                        color: isDarkMode ? '#ffffff' : '#000000', // Цвет текста
                        backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5', // Фон заголовка
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
              
              {/* Индикатор загрузки при подгрузке данных */}
              {loadingUsers && (
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
            Страница {usersPagination.currentPage} из {usersPagination.totalPages} • 
            Всего пользователей: {usersPagination.totalItems}
          </Typography>
        </Box>

        {/* Меню действий для пользователя */}
        <Menu
          id="user-menu"
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
          <MenuItem onClick={() => handleRoleChange('admin')}>
            Сделать администратором
          </MenuItem>
          <MenuItem onClick={() => handleRoleChange('user')}>
            Сделать пользователем
          </MenuItem>
          <MenuItem onClick={handleBlockUser}>
            {selectedUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}
          </MenuItem>
        </Menu>
      </Box>
    </DndProvider>
  );
};

// Экспортируем компонент по умолчанию
export default UsersTable;