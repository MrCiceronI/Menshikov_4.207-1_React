// Импорт необходимых зависимостей из библиотеки React
import React from 'react';
// Импорт хуков useDrag и useDrop из библиотеки react-dnd для реализации функционала перетаскивания
import { useDrag, useDrop } from 'react-dnd';
// Импорт компонентов Material-UI для стилизации и отображения
import { TableCell, Typography, Box } from '@mui/material';
// Импорт иконки для индикатора перетаскивания
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
// Импорт кастомного хука useTheme из контекста для получения текущей темы
import { useTheme } from '../../context/ThemeContext';

// Определение типа элемента для react-dnd, используемого при перетаскивании столбцов
const ItemTypes = {
  COLUMN: 'column',
};

// Компонент DraggableColumnHeader отвечает за отображение заголовка столбца с поддержкой перетаскивания
const DraggableColumnHeader = ({ column, reorderColumns }) => {
  // Получение состояния темы (темный/светлый режим) из кастомного контекста
  const { isDarkMode } = useTheme();

  // Хук useDrag для реализации перетаскивания заголовка столбца
  const [{ isDragging }, drag] = useDrag({
    // Тип элемента, который будет перетаскиваться
    type: ItemTypes.COLUMN,
    // Данные, передаваемые при перетаскивании (идентификатор столбца)
    item: { id: column.id },
    // Функция collect собирает информацию о состоянии перетаскивания
    collect: (monitor) => ({
      // Флаг, указывающий, перетаскивается ли элемент
      isDragging: monitor.isDragging(),
    }),
  });

  // Хук useDrop для реализации области, куда можно перетащить элемент
  const [, drop] = useDrop({
    // Тип принимаемого элемента (должен совпадать с типом перетаскиваемого)
    accept: ItemTypes.COLUMN,
    // Функция, вызываемая при успешном "сбросе" элемента в область
    drop: (item: { id: string }) => {
      // Проверка, что перетаскиваемый столбец не является текущим
      if (item.id !== column.id) {
        // Вызов функции reorderColumns для изменения порядка столбцов
        reorderColumns(item.id, column.id);
      }
    },
    // Функция collect собирает информацию о состоянии области
    collect: (monitor) => ({
      // Флаг, указывающий, находится ли перетаскиваемый элемент над областью
      isOver: monitor.isOver(),
    }),
  });

  // Рендеринг компонента
  return (
    // Ячейка таблицы, которая является одновременно перетаскиваемой и принимающей элемент
    <TableCell
      // Привязка хуков drag и drop к DOM-элементу
      ref={(node) => drag(drop(node))}
      // Получение пропсов для заголовка столбца и сортировки из react-table
      {...column.getHeaderProps(column.getSortByToggleProps())}
      // Стилизация ячейки с учетом темы и состояния перетаскивания
      sx={{
        // Цвет текста в зависимости от темы
        color: isDarkMode ? '#ffffff' : '#000000',
        // Курсор, указывающий на возможность перетаскивания
        cursor: 'move',
        // Прозрачность уменьшается, если элемент перетаскивается
        opacity: isDragging ? 0.5 : 1,
        // Наследование цвета фона от родительского элемента
        backgroundColor: 'inherit',
        // Плавный переход для изменения фона
        transition: 'background-color 0.2s ease',
        // Относительное позиционирование для корректного отображения
        position: 'relative',
      }}
    >
      {/* Контейнер для выравнивания иконки и текста */}
      <Box display="flex" alignItems="center">
        {/* Иконка индикатора перетаскивания с небольшой прозрачностью */}
        <DragIndicatorIcon sx={{ mr: 1, opacity: 0.5 }} />
        {/* Текст заголовка столбца */}
        <Typography variant="subtitle2">
          {/* Рендеринг заголовка столбца */}
          {column.render('Header')}
          {/* Отображение иконки сортировки, если столбец отсортирован */}
          {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : null}
        </Typography>
      </Box>
    </TableCell>
  );
};

// Экспорт компонента по умолчанию
export default DraggableColumnHeader;