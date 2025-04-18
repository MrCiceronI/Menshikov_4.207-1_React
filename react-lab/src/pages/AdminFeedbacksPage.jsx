import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import FeedbacksTable from '../components/Admin/FeedbacksTable';

const AdminFeedbacksPage = () => {
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
          Управление отзывами
        </Typography>
        <FeedbacksTable />
      </Paper>
    </Container>
  );
};

export default AdminFeedbacksPage;