// src/pages/Home.js
import React from 'react';
import { MainContent } from '../components/MainContent/MainContent';
import Navigation from '../components/Navigation/Navigation';
import FooterContent from '../components/FooterContent/FooterContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleCubeClick = () => {
    navigate('/upload');
  }

  return (
    <div>
      <Navigation />
      <BackgroundContent>
        <MainContent />
      </BackgroundContent>      
      <FooterContent label={"Software Update Start!!"} onClick={handleCubeClick} instructionText={"Click the button above to start deployment"}/>
    </div>
  );
}

export default Home;