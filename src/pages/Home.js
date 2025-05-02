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
      <FooterContent label={"소프트웨어 업데이트 시작하기"} onClick={handleCubeClick}/>
    </div>
  );
}

export default Home;