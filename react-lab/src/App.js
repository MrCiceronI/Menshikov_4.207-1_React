import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLabSelect = (labId) => {
    setSelectedLab(labId);
    setIsMenuOpen(false);
  };

  return (
    <div className="app">
      <Header onMenuToggle={toggleMenu} />
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onLabSelect={handleLabSelect}
      />
      <Content labId={selectedLab} />
      <Footer />
    </div>
  );
}

export default App;