import React, { useState } from 'react';
import HeaderContent from '../components/HeaderContent/HeaderContent';
import ProgressFooterContent from '../components/FooterContent/ProgressFooterContent';
import BackgroundContent from '../components/Background/BackgroundContent';
import AccessPolicyContent from '../components/DeployUpdateContent/AccessPolicyContent';
import { useNavigate } from 'react-router-dom';

function AccessPolicy() {
  const navigate = useNavigate();

    // AccessPolicyContent 컴포넌트로부터 받을 값들을 저장할 state
    const [allInputValues, setAllInputValues] = useState({
        modelName: [],
        serialNumber: [],
        manufactureDate: [],
        optionType: [],
      });

    // DynamicInputLists로부터 최신 값들을 받을 콜백 함수
    const handleInputChange = (values) => {
        setAllInputValues(values); // 받은 최신 값 객체로 state 업데이트
        console.log('부모에서 수신한 모든 입력 값:', values);
        // 이제 여기서 받은 'values' 객체 (예: { modelName: ['값1', '값2'], serialNumber: ['abc'], ... })
        // 를 사용하여 원하는 로직을 수행할 수 있습니다. (예: 데이터 저장, 유효성 검사 등)
    };

  const handleCubeClick = () => {
    navigate('/');
  }

  const handleBackClick = () => {
    navigate('/setting');
  }

  return (
    <div>
        <HeaderContent title={"3. Access Control Policy Settings"} onBackClick={handleBackClick}/>
          <BackgroundContent>
            <AccessPolicyContent onValuesChange={handleInputChange} />
          </BackgroundContent>
        <ProgressFooterContent label={"3. Access Control Policy Settings"} onClick={handleCubeClick}/>
    </div>
  );
}

export default AccessPolicy;