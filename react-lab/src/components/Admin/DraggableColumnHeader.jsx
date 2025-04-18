import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TableCell, Typography, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useTheme  } from '../../context/ThemeContext';
const ItemTypes = {
  COLUMN: 'column'
};

const DraggableColumnHeader = ({ column, reorderColumns }) => {
    const { isDarkMode } = useTheme();

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.COLUMN,
        item: { id: column.id },
        collect: monitor => ({
          isDragging: monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: ItemTypes.COLUMN,
        drop: (item: { id: string }) => {
          if (item.id !== column.id) {
            reorderColumns(item.id, column.id);
          }
        },
        collect: monitor => ({
          isOver: monitor.isOver()
        })
    });

    return (
        <TableCell
          ref={node => drag(drop(node))}
          {...column.getHeaderProps(column.getSortByToggleProps())}
          sx={{
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'move',
            opacity: isDragging ? 0.5 : 1,
            backgroundColor: 'inherit',
            transition: 'background-color 0.2s ease',
            position: 'relative',
          }}
        >
          <Box display="flex" alignItems="center">
            <DragIndicatorIcon sx={{ mr: 1, opacity: 0.5 }} />
            <Typography variant="subtitle2">
              {column.render('Header')}
              {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : null}
            </Typography>
          </Box>
        </TableCell>
      );
    };

export default DraggableColumnHeader;