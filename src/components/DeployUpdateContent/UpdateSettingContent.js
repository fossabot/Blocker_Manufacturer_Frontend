// src/components/DeployUpdateContent/UpdateSettingContent.js
import React from 'react'; // useState 불필요
import styles from './UpdateSettingContent.module.css';

// 부모로부터 현재 값들 (updateName, price, description)과 값 변경 핸들러 (onSettingsChange)를 prop으로 받습니다.
function UpdateSettingContent({ updateName, price, description, onSettingsChange }) { // <-- prop 추가
  // 각 입력 필드의 값을 관리할 state는 이제 부모에서 관리하므로 삭제합니다.
  // const [updateName, setUpdateName] = useState(''); // <-- 이 줄 삭제
  // const [price, setPrice] = useState(''); // <-- 이 줄 삭제
  // const [description, setDescription] = useState(''); // <-- 이 줄 삭제

  // 입력 값 변경 핸들러 함수들 - 부모로부터 받은 onSettingsChange prop을 호출합니다.
  const handleUpdateNameChange = (event) => {
    // setUpdateName(event.target.value); // <-- 이 줄 삭제
    // 부모에게 변경된 updateName 값과 현재 price, description 값을 함께 객체로 전달
    if (onSettingsChange) {
      onSettingsChange({
        updateName: event.target.value,
        price: price, // 현재 price prop 값을 사용
        description: description, // 현재 description prop 값을 사용
      });
    }
  };

  // 가격 입력 필드 변경 핸들러 (쉼표 자동 추가 기능 포함)
  const handlePriceChange = (event) => {
    const rawValue = event.target.value;

    const cleanValue = rawValue.replace(/\D/g, '');

    if (cleanValue === '') {
      // setPrice(''); // <-- 이 줄 삭제
      // 부모에게 price만 빈 문자열로 업데이트하도록 전달
      if (onSettingsChange) {
        onSettingsChange({
          updateName: updateName, // 현재 updateName prop 값을 사용
          price: '',
          description: description,
        });
      }
      return;
    }

    const numberValue = Number(cleanValue);

    if (isNaN(numberValue)) {
      console.warn("가격 입력에 유효하지 않은 문자가 포함되었습니다:", rawValue);
      return;
    }

    const formattedValue = numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    // setPrice(formattedValue); // <-- 이 줄 삭제
    // 부모에게 price만 포맷된 값으로 업데이트하도록 전달
    if (onSettingsChange) {
      onSettingsChange({
        updateName: updateName,
        price: formattedValue,
        description: description,
      });
    }
  };

  const handleDescriptionChange = (event) => {
    // setDescription(event.target.value); // <-- 이 줄 삭제
    // 부모에게 description만 업데이트하도록 전달
    if (onSettingsChange) {
      onSettingsChange({
        updateName: updateName,
        price: price,
        description: event.target.value,
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽 컬럼 */}
      <div className={styles.leftColumn}>
        {/* 업데이트 명 입력 그룹 */}
        <div className={styles.inputGroup}>
          <label htmlFor="updateName" className={styles.label}>Update Name</label>
          <input
            type="text"
            id="updateName"
            className={`${styles.input} ${styles.bottomBorderInput}`}
            value={updateName} // <-- value를 prop으로 받아 사용
            onChange={handleUpdateNameChange} // <-- 변경 핸들러 연결
          />
        </div>
        {/* 가격 입력 그룹 */}
        <div className={styles.inputGroup}>
          <label htmlFor="price" className={styles.label}>Price</label>
          <div className={styles.priceInputContainer}>
            <input
              type="text"
              id="price"
              className={`${styles.input} ${styles.bottomBorderInput} ${styles.priceInput}`}
              value={price} // <-- value를 prop으로 받아 사용
              onChange={handlePriceChange} // <-- 변경 핸들러 연결
            />
            <span className={styles.priceUnit}>ETH</span>
          </div>
        </div>
      </div>
      {/* 오른쪽 컬럼 */}
      <div className={styles.rightColumn}>
        {/* 업데이트 설명 입력 그룹 */}
        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>Update Description</label>
          <textarea
            id="description"
            className={`${styles.textarea} ${styles.topBottomBorderInput}`}
            value={description} // <-- value를 prop으로 받아 사용
            onChange={handleDescriptionChange} // <-- 변경 핸들러 연결
            rows="6"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

// 컴포넌트 이름도 UpdateSettingContent로 변경 (파일명과 일치)
export default UpdateSettingContent;