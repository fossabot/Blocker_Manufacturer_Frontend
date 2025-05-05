// src/pages/AccessPolicy.js
import React from 'react'; // useState 임포트 삭제
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import AccessPolicyContent from '../components/DeployUpdateContent/AccessPolicyContent'; // 컴포넌트 임포트 확인
import { useNavigate } from 'react-router-dom';

// App.js로부터 onPolicyConditionsChange 콜백 함수와 현재 정책 조건 상태를 prop으로 받습니다.
function AccessPolicy({ onPolicyConditionsChange, policyConditions }) { // <-- policyConditions prop 추가
  const navigate = useNavigate();

  // AccessPolicyContent 컴포넌트로부터 받을 값들을 저장할 state는 이제 App.js에서 관리하므로 삭제합니다.
  // const [allInputValues, setAllInputValues] = useState({...}); // <-- 이 줄을 삭제합니다.

  // AccessPolicyContent로부터 최신 값들을 받을 콜백 함수 (App.js에서 받은 prop을 바로 사용)
  const handlePolicyChange = (values) => {
    console.log('AccessPolicyPage: Policy conditions changed:', values);
    // setAllInputValues(values); // <-- 이 줄을 삭제합니다. 로컬 state 업데이트 대신 부모 prop 호출
    onPolicyConditionsChange(values); // <-- App.js로 정책 조건 값 전달
  };

  const handleCubeClick = () => {
    // 다음 페이지로 이동
    navigate('/summary');
  }

  const handleBackClick = () => {
    // 이전 페이지로 이동
    navigate('/setting');
  }

  return (
    <div>
      <HeaderContent title={"Access Control Policy Settings"} onBackClick={handleBackClick} />
      <BackgroundContent>
        {/* AccessPolicyContent에 정책 조건 값 변경 핸들러 prop으로 전달 */}
        {/* AccessPolicyContent가 렌더링될 때 App.js의 현재 정책 조건 상태를 초기값으로 받도록 prop으로 전달 */}
        <AccessPolicyContent
          onValuesChange={handlePolicyChange} // <-- prop 이름 그대로 사용
          initialValues={policyConditions} // <-- App.js에서 받은 정책 조건 상태를 initialValues prop으로 전달
        />
      </BackgroundContent>
      <ProgressFooterContent label={"Access Control Policy Settings"} onClick={handleCubeClick} />
    </div>
  );
}

export default AccessPolicy;