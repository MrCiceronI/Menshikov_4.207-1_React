// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      p: 2
    }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 500, p: 3 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="fullWidth"
        >
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>
        
        <Box sx={{ mt: 3 }}>
          {tabIndex === 0 ? <LoginForm /> : <RegisterForm />}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;