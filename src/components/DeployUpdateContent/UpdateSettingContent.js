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

  // 가격 입력 필드 변경 핸들러 (쉼표 자동 추가 기능 포함)
  const handlePriceChange = (event) => {
    const rawValue = event.target.value; // 사용자가 입력한 원본 값

    // 1. 입력 값에서 숫자(0-9)를 제외한 모든 문자(쉼표 포함)를 제거합니다.
    const cleanValue = rawValue.replace(/\D/g, '');

    // 2. 정리된 값이 비어있으면 price state를 빈 문자열로 설정하고 함수를 종료합니다.
    if (cleanValue === '') {
      setPrice('');
      return;
    }

    // 3. 정리된 문자열을 숫자로 변환합니다.
    const numberValue = Number(cleanValue);

    // 4. 숫자로 변환된 값이 유효한지 확인합니다 (isNaN은 숫자가 아닐 때 true 반환)
    // (쉼표 제거 후 숫자만 남았으므로 isNaN이 true일 경우는 거의 없지만 안전을 위해)
    if (isNaN(numberValue)) {
      console.warn("가격 입력에 유효하지 않은 문자가 포함되었습니다:", rawValue);
      // 유효하지 않은 입력은 무시하거나 이전 값으로 되돌리는 등의 처리를 할 수 있습니다.
      // 여기서는 state 업데이트를 하지 않아 잘못된 입력은 반영되지 않도록 합니다.
      return;
    }


    // 5. 숫자를 지역 설정에 맞게 문자열로 포맷합니다 (쉼표 자동 추가).
    // 'en-US' 로케일은 숫자에 쉼표를 사용하는 표준적인 방식입니다.
    // minimumFractionDigits: 0, maximumFractionDigits: 0 은 소수점 없이 정수만 포맷하도록 합니다.
    const formattedValue = numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // 6. 포맷된 문자열로 price state를 업데이트합니다.
    setPrice(formattedValue);
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