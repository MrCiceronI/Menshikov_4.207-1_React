// components/Layout/Layout.jsx
// Импорт необходимых зависимостей
import { useTheme } from '../../context/ThemeContext'; // Хук для доступа к контексту темы
import { 
  CssBaseline, // Компонент для сброса и нормализации CSS
  ThemeProvider as MuiThemeProvider, // Провайдер темы Material-UI
  createTheme // Функция создания кастомной темы
} from '@mui/material'; // Импорт из Material-UI

// Компонент Layout - обертка для всего приложения
const Layout = ({ children }) => { // Принимает дочерние элементы через props.children
  // Получаем текущий режим темы (темный/светлый) из контекста
  const { darkMode } = useTheme();
  
  // Создаем тему Material-UI на основе текущего режима
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Устанавливаем режим палитры
      // В darkMode будет использоваться темная палитра Material-UI
      // В противном случае - светлая
    },
  });

  // Возвращаем JSX разметку
  return (
    // Оборачиваем приложение в ThemeProvider Material-UI
    // Это делает тему доступной для всех дочерних компонентов
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline нормализует стили across browsers */}
      <CssBaseline />
      {/* Основной контейнер приложения */}
      <div className="layout">
        {children} {/* Рендерим переданные дочерние компоненты */}
      </div>
    </MuiThemeProvider>
  );
};

// Экспортируем компонент для использования
export default Layout;