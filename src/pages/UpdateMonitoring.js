import React from 'react';
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import FileUploadContent from '../components/DeployUpdateContent/FileUploadContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import { useNavigate } from 'react-router-dom';
import UpdateMonitoringContent from '../components/MonitoringConent/UpdateMonitoringContent';

// App.js로부터 onFileSelected 콜백 함수 (파일 객체 전달용)와
// uploadedFileName (현재 파일명 상태)를 prop으로 받습니다.
function UpdateMonitoring() { // prop 변경 및 추가
  const navigate = useNavigate();

  const handleCubeClick = () => {
    navigate('/');
  }

  const handleBackClick = () => {
    navigate('/'); 
  }

  return (
    <div>
      <HeaderContent title={"Update Monitoring"} onBackClick={handleBackClick} />
      <BackgroundContent>
        <UpdateMonitoringContent />
      </BackgroundContent>
    </div>
  );
}

export default UpdateMonitoring;