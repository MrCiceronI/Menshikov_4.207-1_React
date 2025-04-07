import React from 'react';
import './Header.css';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuToggle }) => {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Лабораторные работы по React
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;