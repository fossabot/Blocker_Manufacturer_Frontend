// src/pages/Home.js
import React from 'react';
import MainContent from '../components/MainContent/MainContent';
import Navigation from '../components/Navigation/Navigation';
import FooterContent from '../components/FooterContent/FooterContent';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleCubeClick = () => {
    navigate('/upload');
  }

  return (
    <div>
      <Navigation />
      <MainContent />
      <FooterContent label={"Software Update Start!!"} onClick={handleCubeClick}/>
    </div>
  );
}

export default Home;