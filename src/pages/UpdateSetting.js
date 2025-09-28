import React from 'react'; // useState 불필요
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import UpdateSettingContent from '../components/DeployUpdateContent/UpdateSettingContent'; // 컴포넌트 임포트 확인 및 파일명 변경 가정
import BackgroundContent from '../components/Background/BackgroundContent';
import { useNavigate } from 'react-router-dom';

// App.js로부터 onUpdateSettingsChange 콜백 함수와 현재 설정 값들을 prop으로 받습니다.
function UpdateSetting({ onUpdateSettingsChange, updateName, price, description }) { // <-- 설정 값 prop 추가
  const navigate = useNavigate();

  // UpdateSettingContent로부터 설정 값이 변경될 때 호출될 핸들러
  // 이 핸들러는 App.js로부터 받은 onUpdateSettingsChange prop을 호출합니다.
  const handleSettingsChange = (settings) => {
    console.log("UpdateSettingPage: Settings changed:", settings);
    onUpdateSettingsChange(settings); // App.js로 설정 값 전달
  };


  const handleCubeClick = () => {
    navigate('/access');
  }

  const handleBackClick = () => {
    navigate('/upload');
  }

  return (
    <div>
      <HeaderContent title={"Update Settings"} onBackClick={handleBackClick} />
      <BackgroundContent>
        {/* UpdateSettingContent에 설정 값 변경 핸들러와 현재 설정 값들을 prop으로 전달 */}
        <UpdateSettingContent
          onSettingsChange={handleSettingsChange} // <-- prop 전달
          updateName={updateName} // <-- prop 전달
          price={price} // <-- prop 전달
          description={description} // <-- prop 전달
        />
      </BackgroundContent>
      <ProgressFooterContent label={"Update Settings"} onClick={handleCubeClick} instructionText={"Click the button above to go to Access Policy Settings"}/>
    </div>
  );
}

// 페이지 컴포넌트 이름에 Page 접미사를 붙여 명확하게 구분 (선택 사항)
// export default UpdateSetting;
export default UpdateSetting;