import React from 'react';
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import FileUploadContent from '../components/DeployUpdateContent/FileUploadContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import { useNavigate } from 'react-router-dom';

// App.js로부터 onFileSelected 콜백 함수 (파일 객체 전달용)와
// uploadedFileName (현재 파일명 상태)를 prop으로 받습니다.
function FileUpload({ onFileSelected, uploadedFileName }) { // prop 변경 및 추가
  const navigate = useNavigate();

  // FileUploadContent로부터 파일 객체가 선택되면 호출될 핸들러.
  // 이 핸들러는 App.js로부터 받은 onFileSelected prop을 그대로 호출합니다.
  // handleFileChange 함수는 FileUploadContent 내부로 이동했습니다.

  const handleCubeClick = () => {
    // 다음 페이지로 이동
    navigate('/setting');
  }

  const handleBackClick = () => {
    // 이전 페이지로 이동
    navigate('/'); // 홈으로 이동
  }

  return (
    <div>
      <HeaderContent title={"Preparing Update File"} onBackClick={handleBackClick} />
      <BackgroundContent>
        {/* FileUploadContent에 파일 객체 선택 핸들러와 현재 파일명 상태 prop으로 전달 */}
        {/* FileUploadContent는 이제 자체 state 대신 이 핸들러를 호출하고 currentFileName prop을 표시합니다. */}
        <FileUploadContent
          onFileSelected={onFileSelected} // <-- App.js로부터 받은 핸들러 그대로 전달
          currentFileName={uploadedFileName} // <-- App.js로부터 받은 파일명 상태 전달
        />
      </BackgroundContent>
      <ProgressFooterContent label={"Preparing Update File"} onClick={handleCubeClick} instructionText={"위 버튼을 눌러 설정으로 가기"}/>
    </div>
  );
}

export default FileUpload;