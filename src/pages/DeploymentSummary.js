// src/pages/DeploymentSummary.js // (Assuming this is your page component)
import React, { useState } from 'react'; // useState 유지 (필요시)
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import DeploymentSummaryContent from '../components/DeployUpdateContent/DeploymentSummaryContent';
import { useNavigate } from 'react-router-dom';

// App.js로부터 모든 취합된 데이터(deploymentData)를 prop으로 받습니다.
function DeploymentSummary({ deploymentData }) { // prop 추가
  const navigate = useNavigate();

  // 배포 버튼 클릭 핸들러 - 자식로부터 skipDetails 상태를 인자로 받습니다.
  const handleDeployClick = (shouldSkipDetails) => { // <-- 인자로 skipDetails 받기
    console.log("배포 시작!");
    console.log("Skip Details Checkbox State:", shouldSkipDetails); // <-- 받은 상태 확인

    // ***** 여기에 자식의 체크박스 상태에 따라 다른 로직을 수행합니다 *****
    if (shouldSkipDetails) {
      console.log("상세 설명을 건너뛰고 배포를 진행합니다.");
      // 상세 설명을 건너뛰는 배포 로직 또는 API 호출
      alert("배포를 시작합니다! (상세 설명 건너뜀)");
      // 예: callApi('/deploy-quick', deploymentData);
      navigate('/complete')
    } else {
      console.log("상세 설명을 포함하여 배포를 진행합니다.");
      // 상세 설명을 포함하는 배포 로직 또는 API 호출
      alert("배포를 시작합니다! (상세 설명 포함)");
      // 예: callApi('/deploy-full', deploymentData);
      navigate('/complete');
    }
    // *******************************************************************


    // 배포 후 다음 페이지로 이동 또는 상태 업데이트
    // navigate('/'); // 예시: 홈으로 이동 - 실제 배포 완료 후 이동하도록 수정
  }

  const handleCubeClick = () => {
    navigate('/summary');
  }

  const handleBackClick = () => {
    navigate('/access');
  }

  return (
    <div>
      <HeaderContent title={"Deployment Summary"} onBackClick={handleBackClick} /> {/* 타이틀 수정 */}
      <BackgroundContent>
        {/* DeploymentSummaryContent 컴포넌트에 취합된 데이터와 배포 핸들러 전달 */}
        {/* onDeployClick prop에 handleDeployClick 함수를 전달합니다. */}
        <DeploymentSummaryContent deploymentData={deploymentData} onDeployClick={handleDeployClick} /> {/* prop 전달 */}
      </BackgroundContent>
      {/* ProgressFooterContent는 상태 전달 필요 없을 수 있음 */}
      <ProgressFooterContent label={"Deployment Summary"}  onClick={handleCubeClick} />
    </div>
  );
}

export default DeploymentSummary;