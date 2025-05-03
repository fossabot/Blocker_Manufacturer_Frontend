// src/components/UpdateForm/UpdateForm.js
import React, { useState } from 'react';
import styles from './UpdateSettingContent.module.css';

function UpdateForm() {
  // 각 입력 필드의 값을 관리할 state
  const [updateName, setUpdateName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // 입력 값 변경 핸들러 함수들
  const handleUpdateNameChange = (event) => {
    setUpdateName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    // 전체 레이아웃을 위한 컨테이너 (Flexbox를 사용하여 왼쪽/오른쪽 컬럼으로 나눔)
    // 이 컨테이너의 너비와 위치는 부모 요소에 의해 결정될 수 있습니다.
    <div className={styles.container}>
      {/* 왼쪽 컬럼 */}
      <div className={styles.leftColumn}>
        {/* 업데이트 명 입력 그룹 */}
        <div className={styles.inputGroup}>
          <label htmlFor="updateName" className={styles.label}>Update Name</label>
          <input
            type="text"
            id="updateName"
            // 기본 input 스타일과 아래쪽 테두리 스타일 적용
            className={`${styles.input} ${styles.bottomBorderInput}`}
            value={updateName}
            onChange={handleUpdateNameChange}
          />
        </div>
        {/* 가격 입력 그룹 */}
        <div className={styles.inputGroup}>
          <label htmlFor="price" className={styles.label}>Price</label>
          {/* 가격 입력 필드와 ETH 단위를 감싸는 컨테이너 */}
          <div className={styles.priceInputContainer}>
            <input
              type="text"
              id="price"
              // 기본 input 스타일, 아래쪽 테두리 스타일, 가격 입력 필드 전용 스타일 적용
              className={`${styles.input} ${styles.bottomBorderInput} ${styles.priceInput}`}
              value={price}
              onChange={handlePriceChange}
            />
            {/* ETH 단위 텍스트 */}
            <span className={styles.priceUnit}>ETH</span>
          </div>
        </div>
      </div>
      {/* 오른쪽 컬럼 */}
      <div className={styles.rightColumn}>
        {/* 업데이트 설명 입력 그룹 */}
        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>Update Description</label>
          {/* 여러 줄 입력을 위한 textarea */}
          <textarea
            id="description"
            // 기본 textarea 스타일과 위/아래쪽 테두리 스타일 적용
             className={`${styles.textarea} ${styles.topBottomBorderInput}`}
            value={description}
            onChange={handleDescriptionChange}
            rows="6" // 보여줄 줄 수 (필요에 따라 조정)
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default UpdateForm;