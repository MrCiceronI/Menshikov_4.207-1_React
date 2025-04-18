// src/components/BottomMenu/BottomMenu.jsx
import React from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Home as HomeIcon,
  Feedback as FeedbackIcon,
  Person as ProfileIcon,
  Info as AboutIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

const BottomMenu = () => {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  if (!isMobile) return null;

  const routes = [
    { path: '/', label: 'Главная', icon: <HomeIcon /> },
    { path: '/feedback', label: 'Отзывы', icon: <FeedbackIcon /> },
    { path: '/profile', label: 'Профиль', icon: <ProfileIcon /> },
    { path: '/about', label: 'О себе', icon: <AboutIcon /> },
    ...(isAdmin ? [{ path: '/admin', label: 'Админ', icon: <AdminIcon /> }] : [])
  ];

  const currentRouteIndex = routes.findIndex(route => 
    location.pathname === route.path || 
    location.pathname.startsWith(route.path + '/')
  );

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff'
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentRouteIndex >= 0 ? currentRouteIndex : 0}
        sx={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          '& .Mui-selected': {
            color: isDarkMode ? '#90caf9' : '#1976d2'
          }
        }}
      >
        {routes.map((route, index) => (
          <BottomNavigationAction
            key={index}
            label={route.label}
            icon={route.icon}
            component={Link}
            to={route.path}
            sx={{
              color: isDarkMode ? '#ffffff' : '#000000',
              minWidth: 'auto',
              padding: '6px 8px'
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomMenu;