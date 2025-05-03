import { Routes, Route } from 'react-router-dom';
import React, { useState, useCallback } from 'react'; // useCallback 임포트
import Home from './pages/Home';
import FileUploadPage from './pages/FileUpload';
import UpdateSettingPage from './pages/UpdateSetting';
import AccessPolicyPage from './pages/AccessPolicy';
import DeploymentSummaryPage from './pages/DeploymentSummary';


function App() {
  // 애플리케이션 전체에서 공유할 모든 입력 값 상태
  const [deploymentData, setDeploymentData] = useState({
    uploadedFileName: null,
    uploadedFile: null, // <-- 파일 객체를 저장할 상태 추가
    updateName: '',
    price: '', // 포맷된 문자열로 가정
    description: '',
    policyConditions: {
      modelName: [],
      serialNumber: [],
      manufactureDate: [],
      optionType: [],
    },
  });

  // FileUpload 컴포넌트에서 파일이 선택/취소될 때 호출될 함수 (파일 객체 받음)
  // useCallback으로 감싸서 불필요한 재생성 방지
  const handleFileSelected = useCallback((file) => { // <-- 파일 객체를 인자로 받음
    console.log("App.js: File selected:", file);
    setDeploymentData(prevData => ({
      ...prevData,
      uploadedFileName: file ? file.name : null, // 파일이 있으면 이름 저장, 없으면 null
      uploadedFile: file, // <-- 파일 객체 자체 저장
    }));
  }, [setDeploymentData]); // setDeploymentData는 React에 의해 안정성이 보장되므로 의존성 배열에 포함

  // 업데이트 설정 컴포넌트에서 값이 변경될 때 호출될 함수
  // UpdateSettingContent 컴포넌트의 state 구조에 맞춰 객체 형태로 받습니다.
  // useCallback으로 감싸서 불필요한 재생성 방지
  const handleUpdateSettingsChange = useCallback((settings) => {
    console.log("App.js: Update settings changed:", settings);
    setDeploymentData(prevData => ({
      ...prevData,
      updateName: settings.updateName,
      price: settings.price,
      description: settings.description,
    }));
  }, [setDeploymentData]); // setDeploymentData를 의존성 배열에 포함

  // 접근 정책 페이지(AccessPolicyPage)에서 "큐브" 버튼 클릭 시 호출될 함수
  // 이 함수는 페이지 컴포넌트의 로컬 상태를 인자로 받습니다.
  // useCallback으로 감싸서 불필요한 재생성 방지
  // 이 함수는 deploymentData 상태를 직접 사용하지 않고 인자로 받은 conditions를 사용하므로 deploymentData는 의존성 배열에 불필려
  const handlePolicyConditionsChange = useCallback((conditions) => {
    console.log("App.js: Policy conditions changed:", conditions);
    setDeploymentData(prevData => ({
      ...prevData,
      policyConditions: conditions,
    }));
  }, [setDeploymentData]); // setDeploymentData를 의존성 배열에 포함


  // DeploymentSummary 페이지에서 배포 버튼 클릭 시 실행될 함수
  // useCallback으로 감싸서 불필요한 재생성 방지
  // 이 함수는 deploymentData 상태를 사용하므로 deploymentData를 의존성 배열에 포함
  const handleDeploy = useCallback(() => {
    console.log("App.js: Deploy button clicked with final data:", deploymentData);
    // 실제 배포 API 호출 등의 로직을 여기에 추가합니다.
    // 이제 deploymentData.uploadedFile 에 파일 객체가 들어있습니다.
    // deploymentData.updateName, deploymentData.price, deploymentData.description,
    // deploymentData.policyConditions 와 함께 서버로 전송하는 로직을 구현하면 됩니다.

    alert("배포가 시작되었습니다!");
    // 배포 완료 후 상태 초기화 또는 특정 페이지로 이동
    // setDeploymentData({ ... }); // 필요시 상태 초기화
    // navigate('/'); // 예시: 홈으로 이동 (navigate는 라우터 내에서 사용)
    // 이 부분은 페이지 컴포넌트에서 처리하는 것이 더 일반적일 수 있습니다.
  }, [deploymentData]); // deploymentData를 의존성 배열에 포함


  return (
    <div className="app-root">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />

          {/* FileUpload 페이지에 파일 객체 선택 핸들러와 현재 파일명 상태 전달 */}
          <Route
            path="/upload"
            element={<FileUploadPage onFileSelected={handleFileSelected} uploadedFileName={deploymentData.uploadedFileName} />} // prop 변경 및 추가
          />
          {/* UpdateSetting 페이지에 상태 업데이트 핸들러와 현재 설정 값들 전달 */}
          <Route
            path="/setting"
            element={<UpdateSettingPage
              onUpdateSettingsChange={handleUpdateSettingsChange}
              updateName={deploymentData.updateName}
              price={deploymentData.price}
              description={deploymentData.description}
            />}
          />
          {/* AccessPolicy 페이지에 상태 업데이트 핸들러와 현재 정책 조건 상태 전달 */}
          {/* onPolicyConditionsChange는 이제 페이지 컴포넌트가 최종적으로 App.js에 값을 전달할 때 사용 */}
          {/* policyConditions는 App.js의 현재 상태를 페이지 컴포넌트의 로컬 상태 초기화에 사용 */}
          <Route
            path="/access"
            element={<AccessPolicyPage onPolicyConditionsChange={handlePolicyConditionsChange} policyConditions={deploymentData.policyConditions} />}
          />
          {/* DeploymentSummary 페이지에 취합된 전체 데이터 전달 */}
          <Route
            path="/summary"
            element={<DeploymentSummaryPage deploymentData={deploymentData} onDeployConfirm={handleDeploy} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;