// src/components/DeploymentSummary/DeploymentSummaryContent.js
import React, { useState } from 'react'; // <-- Import useState
import styles from './DeploymentSummaryContent.module.css';

// Policy Conditions 섹션에서 사용할 항목 라벨 (AccessPolicyContent와 동일하게)
const policyLabels = {
  modelName: 'Model Name',
  serialNumber: 'Serial Number',
  manufactureDate: 'Manufacture Date',
  optionType: 'Option Type',
};


// 부모로부터 배포 관련 데이터(deploymentData)와 배포 버튼 클릭 핸들러(onDeployClick)를 prop으로 받습니다.
// onDeployClick은 이제 체크박스 상태를 인자로 받게 됩니다.
const DeploymentSummary = ({ deploymentData, onDeployClick }) => {
  // deploymentData prop에서 필요한 정보들을 구조 분해 할당으로 추출합니다.
  const { uploadedFileName, updateName, price, description, policyConditions } = deploymentData || {}; // deploymentData가 없을 경우 대비

  // policyConditions가 올바른 객체 형태인지 확인합니다.
  const validPolicyConditions = policyConditions && typeof policyConditions === 'object';

  // 체크박스 상태 관리
  const [skipDetails, setSkipDetails] = useState(false); // <-- 체크박스 상태 추가

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (event) => {
    setSkipDetails(event.target.checked);
  };

  // 배포 버튼 클릭 핸들러 (체크박스 상태를 부모에게 전달)
  const handleDeployButtonClick = () => {
    // 부모로부터 받은 onDeployClick 함수를 호출하고, 체크박스 상태를 함께 전달합니다.
    if (onDeployClick) {
      console.log("DeploymentSummaryContent: Deploy button clicked, skipDetails:", skipDetails);
      onDeployClick(skipDetails); // <-- 체크박스 상태 전달
    }
  };


  return (
    <div className={styles.container}> {/* 메인 컨테이너: Flexbox를 사용하여 좌우 분할 */}
      {/* 왼쪽 컬럼: 정보 섹션들을 담습니다. */}
      <div className={styles.leftColumn}>
        {/* 업데이트 파일 정보 섹션 */}
        {/* <div className={styles.dividingLine}></div> <-- File Info 위에 구분선은 보통 없습니다. */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Update File Info</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>File Name:</span>
            {/* 파일명 표시 (값이 없을 경우 'N/A' 표시) */}
            <span className={styles.infoValue}>{uploadedFileName || 'N/A'}</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.dividingLine}></div>

        {/* 업데이트 상세 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Update Details</h2>
          {/* 업데이트 명 */}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Update Name:</span>
            <span className={styles.infoValue}>{updateName || 'N/A'}</span>
          </div>
          {/* 가격 */}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Price:</span>
            {/* 가격 표시 (가격이 있다면 ETH 단위와 함께 표시) */}
            <span className={styles.infoValue}>{price ? `${price} ETH` : 'N/A'}</span>
          </div>
          {/* 업데이트 설명 */}
          <div className={styles.infoRow}> {/* 라벨과 설명 값을 가로로 배치하기 위해 infoRow 사용 */}
            <span className={styles.infoLabel}>Description:</span>
            {/* 설명 표시 (여러 줄 입력 고려) */}
            <div className={styles.descriptionValue}>{description || 'N/A'}</div> {/* descriptionValue 내부 스타일로 정렬 */}
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.dividingLine}></div>

        {/* 정책 조건 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Policy Conditions</h2>
          {/* AccessPolicyContent로부터 받은 정책 조건 데이터 표시 */}
          {validPolicyConditions ? ( // 정책 조건 데이터가 유효한 경우만 렌더링
            <div className={styles.policyConditions}>
              {/* policyConditions 객체의 키(typeKey: modelName, serialNumber 등)를 순회 */}
              {Object.keys(policyConditions).map(typeKey => (
                // 각 정책 유형별 행
                <div key={typeKey} className={styles.policyType}>
                  {/* 유형 라벨 표시 (키를 읽기 쉬운 라벨로 변환) */}
                  <span className={styles.policyLabel}>
                    {policyLabels[typeKey] || typeKey} {/* 정의된 라벨 사용 또는 기본 키 표시 */}
                  </span>
                  <span className={styles.policySeparator}>:</span> {/* 구분 기호 */}
                  {/* 해당 유형에 대한 값 리스트 표시 */}
                  <div className={styles.policyValues}>
                    {policyConditions[typeKey] && policyConditions[typeKey].length > 0 ? (
                      // 해당 유형의 배열을 순회하며 각 값 표시
                      policyConditions[typeKey].map((value, index) => (
                        <span key={index} className={styles.policyValueItem}>
                          {value || 'N/A'} {/* 값이 없을 경우 'N/A' 표시 */}
                          {/* 마지막 항목이 아니면 쉼표 추가 */}
                          {index < policyConditions[typeKey].length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      // 해당 유형에 입력된 값이 없을 경우 'N/A' 표시
                      <span className={styles.policyValueItem}>N/A</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 정책 조건 데이터가 유효하지 않을 경우 메시지 표시
            <div className={styles.policyConditions}>N/A</div>
          )}
        </div>
      </div> {/* 왼쪽 컬럼 종료 */}

      {/* 오른쪽 컬럼: 배포 버튼과 체크박스를 담고 가운데 정렬합니다. */}
      <div className={styles.rightColumn}>
        {/* 배포 결정 버튼 영역 */}
        <div className={styles.buttonContainer}>
          {/* 배포 버튼 (클릭 시 onDeployClick 함수 호출) */}
          <button className={styles.deployButton} onClick={handleDeployButtonClick}> {/* <-- 로컬 핸들러 연결 */}
            Deploy
          </button>
          <div>*주의: 배포 버튼을 클릭 시 되돌릴 수 없습니다! 신중하게 선택해주세요!</div>
        </div>

        {/* 체크박스 및 설명 영역 */}
        <div className={styles.skipDetails}> {/* <-- 새로운 CSS 클래스 */}
          <input
            type="checkbox"
            id="skipDetailsCheckbox" // 라벨과 연결하기 위한 id
            checked={skipDetails} // 상태 바인딩
            onChange={handleCheckboxChange} // 변경 핸들러 연결
            className={styles.skipCheckbox} // CSS 클래스 추가
          />
          <label htmlFor="skipDetailsCheckbox" className={styles.skipLabel}> {/* <-- 라벨 연결 및 CSS 클래스 추가 */}
            자세한 설명 건너뛰기
          </label>
        </div>
      </div> {/* 오른쪽 컬럼 종료 */}

    </div> // 메인 컨테이너 종료
  );
};

export default DeploymentSummary;