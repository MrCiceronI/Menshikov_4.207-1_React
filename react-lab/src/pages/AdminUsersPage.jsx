import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import UsersTable from '../components/Admin/UsersTable';

const AdminUsersPage = () => {
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
          Управление пользователями
        </Typography>
        <UsersTable />
      </Paper>
    </Container>
  );
};

export default AdminUsersPage;