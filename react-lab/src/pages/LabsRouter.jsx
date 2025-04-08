// Импорт необходимых компонентов из react-router-dom
import { Routes, Route } from 'react-router-dom';

// Импорт компонентов лабораторных работ
import Lab1 from '../Labs/Lab1';
import Lab2 from '../Labs/Lab2';
import Lab3 from '../Labs/Lab3';
import Lab4 from '../Labs/Lab4';
import Lab5 from '../Labs/Lab5';
import Lab6 from '../Labs/Lab6';
import Lab7 from '../Labs/Lab7';
import Lab8 from '../Labs/Lab8';
import Lab9 from '../Labs/Lab9';

// Компонент маршрутизации для лабораторных работ
const LabsRouter = () => {
  return (
    // Компонент Routes - обертка для всех маршрутов
    <Routes>
      {/* 
        Каждый Route определяет соответствие между:
        - path: путь в URL
        - element: компонент для отображения
      */}
      <Route path="lab1" element={<Lab1 />} />
      <Route path="lab2" element={<Lab2 />} />
      <Route path="lab3" element={<Lab3 />} />
      <Route path="lab4" element={<Lab4 />} />
      <Route path="lab5" element={<Lab5 />} />
      <Route path="lab6" element={<Lab6 />} />
      <Route path="lab7" element={<Lab7 />} />
      <Route path="lab8" element={<Lab8 />} />
      <Route path="lab9" element={<Lab9 />} />
    </Routes>
  );
};

export default LabsRouter;