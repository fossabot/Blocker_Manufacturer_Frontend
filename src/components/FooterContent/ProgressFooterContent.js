import React from 'react';
import styles from './ProgressFooterContent.module.css';

const FooterContent = ({ label, onClick }) => {
  return (
    <div className={styles.container}>
      {/* 라벨 */}
      {label && <div className={styles.label}>{label}</div>}

      {/* 가로 바 (트랙) */}
      <div className={styles.barTrack}>
        {/* 정육면체 버튼 */}
        {/* 버튼 역할을 할 div 또는 button 태그 사용 */}
        <div className={styles.cubeButton} onClick={onClick}>
          {/* 정육면체 각 면 (CSS transform으로 3D 형태 구현) */}
          {/* 간단하게 상단, 앞면, 오른쪽 면만 보이도록 구현 */}
          <div className={styles.cubeFaceTop}></div>
          <div className={styles.cubeFaceFront}></div>
          <div className={styles.cubeFaceRight}></div>
          <div className={styles.cubeFaceLeft}></div> {/* 왼쪽 면 추가 */}
          <div className={styles.cubeFaceBack}></div> {/* 뒷면 추가 */}
          <div className={styles.cubeFaceBottom}></div> {/* 하단 면 추가 */}
          {/* 필요하다면 다른 면도 추가 (왼쪽, 뒷면, 하단) */}
        </div>
      </div>
    </div>
  );
};

export default FooterContent;