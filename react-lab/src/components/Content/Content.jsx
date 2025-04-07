import React from 'react';
import './Content.css';
import { Paper, Typography } from '@mui/material';
import Lab1 from '../../Labs/Lab1';
import Lab2 from '../../Labs/Lab2';
import Lab3 from '../../Labs/Lab3';
import Lab4 from '../../Labs/Lab4';
import Lab5 from '../../Labs/Lab5';
import Lab6 from '../../Labs/Lab6';
import Lab7 from '../../Labs/Lab7';
import Lab8 from '../../Labs/Lab8';
import Lab9 from '../../Labs/Lab9';


const Content = ({ labId }) => {
  const labContent = {
    1: <Lab1/>,
    2: <Lab2/>,
    3: <Lab3/>,
    4: <Lab4/>,
    5: <Lab5/>,
    6: <Lab6/>,
    7: <Lab7/>,
    8: <Lab8/>,
    9: <Lab9/>
  };

  return (
    <Paper elevation={3} className="content">
      <Typography variant="h4" gutterBottom>
        Лабораторная работа {labId}
      </Typography>
      <Typography variant="body1">
        {labContent[labId] || "Выберите лабораторную работу из меню"}
      </Typography>
    </Paper>
  );
};

export default Content;