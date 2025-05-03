import React, { useState } from 'react'; // useState 유지 (필요시)
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import DeploymentSummaryContent from '../components/DeployUpdateContent/DeploymentSummaryContent'; // 컴포넌트 임포트명 확인
import { useNavigate } from 'react-router-dom';

// App.js로부터 모든 취합된 데이터(deploymentData)를 prop으로 받습니다.
function DeploymentSummary({ deploymentData }) { // prop 추가
  const navigate = useNavigate();

  const handleDeployClick = () => { // 배포 버튼 클릭 핸들러
    console.log("배포 시작!", deploymentData);
    // 실제 배포 로직 구현 (예: API 호출)
    alert("배포를 시작합니다!"); // 예시 알림
    // 배포 후 다음 페이지로 이동 또는 상태 업데이트
    navigate('/'); // 예시: 홈으로 이동
  }

  const handleCubeClick = () => {
    navigate('/');
  }

  const handleBackClick = () => {
    navigate('/access');
  }

  return (
    <div>
      <HeaderContent title={"4. Deployment Summary"} onBackClick={handleBackClick} /> {/* 타이틀 수정 */}
      <BackgroundContent>
        {/* DeploymentSummaryContent 컴포넌트에 취합된 데이터와 배포 핸들러 전달 */}
        <DeploymentSummaryContent deploymentData={deploymentData} onDeployClick={handleDeployClick} /> {/* prop 전달 */}
      </BackgroundContent>
      {/* ProgressFooterContent는 상태 전달 필요 없을 수 있음 */}
      <ProgressFooterContent label={"4. Deployment Summary"}  onClick={handleCubeClick} />
    </div>
  );
}

export default DeploymentSummary;