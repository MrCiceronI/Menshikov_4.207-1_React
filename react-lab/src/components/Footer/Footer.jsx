import React from 'react';
import './Footer.css';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box className="footer">
      <Typography variant="body2" color="textSecondary" align="center">
        © 2025 Лабораторные работы по React
      </Typography>
    </Box>
  );
};

export default Footer;