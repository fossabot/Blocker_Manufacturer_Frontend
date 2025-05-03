import React from 'react';
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import UpdateSettingContent from '../components/DeployUpdateContent/UpdateSettingContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import { useNavigate } from 'react-router-dom';

function UpdateSetting() {
  const navigate = useNavigate();

  const handleCubeClick = () => {
    navigate('/access');
  }

  const handleBackClick = () => {
    navigate('/upload');
  }

  return (
    <div>
        <HeaderContent title={"2. Update Settings"} onBackClick={handleBackClick}/>
        <BackgroundContent>
        <UpdateSettingContent />
        </BackgroundContent>
        <ProgressFooterContent label={"2. Update Settings"} onClick={handleCubeClick}/>
    </div>
  );
}

export default UpdateSetting;