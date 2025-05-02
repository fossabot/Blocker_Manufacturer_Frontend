// src/pages/Home.js
import React from 'react';
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import FileUploadContent from '../components/DeployUpdateContent/FileUploadContent';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleCubeClick = () => {
    navigate('/upload');
  }

  return (
    <div>
        <HeaderContent title={"1. Preparing Update File"}/>
        <FileUploadContent />
        <ProgressFooterContent label={"1. Preparing Update File"} onClick={handleCubeClick}/>
    </div>
  );
}

export default Home;