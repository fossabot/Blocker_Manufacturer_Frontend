// src/components/DeploymentSummary/DeploymentSummary.js
import React from 'react';
import styles from './DeploymentSummaryContent.module.css';

// 부모로부터 배포 관련 데이터(deploymentData)와 배포 버튼 클릭 핸들러(onDeployClick)를 prop으로 받습니다.
const DeploymentSummary = ({ deploymentData, onDeployClick }) => {
  // deploymentData prop에서 필요한 정보들을 구조 분해 할당으로 추출합니다.
  // 이 객체의 구조는 부모 컴포넌트에서 데이터를 어떻게 취합하는지에 따라 달라집니다.
  // 여기서는 예시 구조를 가정합니다.
  const { uploadedFileName, updateName, price, description, policyConditions } = deploymentData || {}; // deploymentData가 없을 경우 대비

  // policyConditions가 올바른 객체 형태인지 확인합니다.
  const validPolicyConditions = policyConditions && typeof policyConditions === 'object';

  // Policy Conditions 섹션에서 사용할 항목 라벨 (AccessPolicyContent와 동일하게)
  const policyLabels = {
    modelName: 'Medel Name',
    serialNumber: 'Serial Number',
    manufactureDate: 'Manufacture Date',
    optionType: 'Option Type',
  };


  return (
    <div className={styles.container}>
      {/* 업데이트 파일 정보 섹션 */}
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
         <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Description:</span>
          {/* 설명 표시 (여러 줄 입력 고려) */}
          <div className={styles.descriptionValue}>{description || 'N/A'}</div>
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

       {/* 구분선 */}
      <div className={styles.dividingLine}></div>

      {/* 배포 결정 버튼 영역 */}
      <div className={styles.buttonContainer}>
        {/* 배포 버튼 (클릭 시 onDeployClick 함수 호출) */}
        <button className={styles.deployButton} onClick={onDeployClick}>
          Deploy
        </button>
      </div>
    </div>
  );
};

export default DeploymentSummary;