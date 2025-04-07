import React from 'react';
import './Menu.css';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Code } from '@mui/icons-material';

const Menu = ({ isOpen, onClose, onLabSelect }) => {
  const labs = [
    { id: 1, title: "Лабораторная 1", icon: <Code /> },
    { id: 2, title: "Лабораторная 2", icon: <Code /> },
    { id: 3, title: "Лабораторная 3", icon: <Code /> },
    { id: 4, title: "Лабораторная 4", icon: <Code /> },
    { id: 5, title: "Лабораторная 5", icon: <Code /> },
    { id: 6, title: "Лабораторная 6", icon: <Code /> },
    { id: 7, title: "Лабораторная 7", icon: <Code /> },
    { id: 8, title: "Лабораторная 8", icon: <Code /> },
    { id: 9, title: "Лабораторная 9", icon: <Code /> },
  ];

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <List>
        <ListItem button onClick={() => onLabSelect(null)}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>
        {labs.map((lab) => (
          <ListItem 
            button 
            key={lab.id}
            onClick={() => onLabSelect(lab.id)}
          >
            <ListItemIcon>{lab.icon}</ListItemIcon>
            <ListItemText primary={lab.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Menu;