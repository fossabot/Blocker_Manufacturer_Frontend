// src/pages/DeploymentComplete.js
import React, { useState } from 'react'; // useState는 이 컴포넌트에서 사용하지 않아도 됩니다.
import CompleteHeaderContent from '../components/HeaderContent/CompleteHeaderContent';
import CompleteFooterContent from '../components/FooterContent/CompleteFooterContent'; // 이 푸터가 필요한지 확인 필요
import BackgroundContent from '../components/Background/BackgroundContent';
import DeploymentCompleteContent from '../components/DeployUpdateContent/DeploymentCompleteContent'; // 수정된 컴포넌트 임포트
import { useNavigate } from 'react-router-dom';

// 이 컴포넌트는 배포 완료 페이지 역할을 합니다.
// App.js 라우팅에서 /complete 또는 유사한 경로로 연결될 것입니다.
function DeploymentComplete() {
    const navigate = useNavigate();

    // '홈으로' 버튼 클릭 시 실행될 핸들러
    const handleHomeNavigation = () => {
        console.log("Navigate to Home");
        navigate('/'); // 홈 경로로 이동
    };

    // '업데이트 현황' 버튼 클릭 시 실행될 핸들러
    const handleUpdateStatusNavigation = () => {
        console.log("Navigate to Update Status");
        navigate('/monitoring'); // 업데이트 현황 경로로 이동 (App.js에 이 경로가 정의되어 있어야 함)
    };

    // ProgressFooterContent에 사용되는 핸들러 (예시로 남겨둡니다)
    const handleCubeClick = () => {
        navigate('/');
    };

    // 뒤로가기 핸들러 (이 페이지에서는 보통 필요 없습니다만, 예시로 남겨둡니다)
    const handleBackClick = () => {
        // navigate('/access'); // 배포 완료 후에는 보통 이전 단계로 돌아가지 않습니다.
        console.log("Back button clicked on Complete page - typically disabled or navigates elsewhere.");
        // 필요에 따라 navigate('/'); 또는 다른 로직 수행
    };

    return (
        <div>
            {/* 배포 완료 페이지의 헤더 */}
            {/* 이 페이지에서는 보통 뒤로가기 버튼이 없거나 동작이 다릅니다. */}
            {/* title을 "배포 완료" 등으로 변경하는 것이 더 자연스럽습니다. */}
            <CompleteHeaderContent title={"Software Update Deployment Complete!"} onBackClick={handleBackClick} />

            <BackgroundContent>
                {/* DeploymentCompleteContent 컴포넌트를 렌더링하고, */}
                {/* 위에서 정의한 네비게이션 핸들러 함수들을 prop으로 전달합니다. */}
                <DeploymentCompleteContent
                    onHomeClick={handleHomeNavigation}
                    onUpdateStatusClick={handleUpdateStatusNavigation}
                />
            </BackgroundContent>

            {/* 배포 완료 페이지에서 ProgressFooterContent가 필요한지 확인하세요. */}
            {/* 보통 완료 페이지에서는 다른 종류의 푸터나 푸터가 없을 수 있습니다. */}
            {/* label을 "배포 완료" 등으로 변경하고, onClick 동작도 확인 필요 */}
            <CompleteFooterContent label={"Software Update Deployment Complete!"} onClick={handleCubeClick} instructionText={"위 버튼을 눌러 홈으로 가기"}/>
        </div>
    );
}

export default DeploymentComplete;