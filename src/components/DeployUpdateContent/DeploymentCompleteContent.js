import React from 'react';
import styles from './DeploymentCompleteContent.module.css';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 useNavigate 사용

const DeploymentCompleteContent = () => {
  const navigate = useNavigate(); // 페이지 이동 훅 사용

  // 홈으로 이동 핸들러
  const handleHomeClick = () => {
    navigate('/'); // 홈 경로로 이동 (필요에 따라 변경)
  };

  // 업데이트 현황으로 이동 핸들러
  const handleUpdateStatusClick = () => {
    navigate('/update-status'); // 업데이트 현황 경로로 이동 (필요에 따라 변경)
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽/중앙 섹션: 체크 표시 및 완료 메시지 */}
      <div className={styles.completeSection}>
        <div className={styles.checkmark}>✓</div> {/* 큰 체크 표시 */}
      </div>

      {/* 오른쪽 섹션: 내비게이션 버튼 */}
      <div className={styles.navigationSection}>
        {/* 홈으로 버튼 */}
        <button className={styles.navButton} onClick={handleHomeClick}>
          <span className={styles.buttonText}>홈으로</span>
          <span className={styles.arrow}>→</span>
        </button>
        {/* 업데이트 현황 버튼 */}
        <button className={styles.navButton} onClick={handleUpdateStatusClick}>
          <span className={styles.buttonText}>업데이트 현황</span>
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
};

export default DeploymentCompleteContent;