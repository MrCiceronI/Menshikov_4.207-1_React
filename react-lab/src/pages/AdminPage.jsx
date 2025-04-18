import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Административная панель
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            component={Link}
            to="/admin/users"
            sx={{ width: '100%', maxWidth: 300 }}
          >
            Управление пользователями
          </Button>
          
          <Button
            variant="contained"
            component={Link}
            to="/admin/feedbacks"
            sx={{ width: '100%', maxWidth: 300 }}
          >
            Управление отзывами
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPage;