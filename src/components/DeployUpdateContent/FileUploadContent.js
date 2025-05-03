// src/components/DeployUpdateContent/FileUploadContent.js
import React, { useRef } from 'react'; // useState 임포트 삭제
import styles from './FileUploadContent.module.css';

// 부모로부터 onFileSelected 콜백 함수 (파일 객체 전달용)와
// currentFileName (현재 표시할 파일명)를 prop으로 받습니다.
function FileUploadContent({ onFileSelected, currentFileName }) { // prop 이름 변경 및 추가
  // 숨겨진 파일 입력(input) 요소에 접근하기 위한 ref
  const fileInputRef = useRef(null);

  // "업로드" 버튼 클릭 시 실행될 함수
  const handleButtonClick = () => {
    // 숨겨진 file input의 클릭 이벤트를 발생시킵니다.
    fileInputRef.current.click();
  };

  // 파일 선택 창에서 파일 선택 시 실행될 함수
  const handleFileChange = (event) => {
    // 선택된 파일 목록 중 첫 번째 파일을 가져옵니다. (단일 파일 선택 가정)
    const file = event.target.files[0];
    if (file) {
      // 부모로부터 받은 콜백 함수를 호출하여 파일 객체 자체를 전달합니다.
      if (onFileSelected) { // onFileSelected prop이 있는지 확인
        console.log("FileUploadContent: Calling onFileSelected with file:", file);
        onFileSelected(file); // <-- 파일 객체 전달
      }
      console.log('선택된 파일:', file);
      // 실제 파일 업로드 로직은 보통 여기에 추가하지 않습니다.
    } else {
      // 파일 선택이 취소되면 부모에게 null을 전달합니다.
      if (onFileSelected) {
        console.log("FileUploadContent: Calling onFileSelected with: null");
        onFileSelected(null); // <-- null 전달 (선택 취소)
      }
    }
    // 같은 파일 재선택 시 onChange 이벤트가 다시 발생하도록 input 값 초기화 (선택 사항)
    event.target.value = null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        {/* "파일" 텍스트와 파일명 영역 */}
        <div className={styles.fileInfo}>
          <span className={styles.fileLabel}>File</span>
          <span className={styles.verticalLine}></span> {/* 세로선 */}
          {/* 파일명은 이제 부모 state에 저장되고, 부모로부터 prop으로 받아와 표시합니다. */}
          {currentFileName && ( // <-- prop으로 받은 파일명 표시
            <span className={styles.uploadedFileName}>
              {currentFileName} {/* <-- prop 값 사용 */}
            </span>
          )}
        </div>
        {/* 오른쪽의 흰 바와 업로드 버튼 영역 */}
        <div className={styles.uploadSection}>
          {/* 커스텀 "업로드" 버튼 */}
          <button className={styles.uploadButton} onClick={handleButtonClick}>Upload</button>
          {/* 숨겨진 파일 입력(input) 요소 */}
          <input type="file" // 파일 선택 input
            ref={fileInputRef} // ref를 사용하여 요소에 접근
            onChange={handleFileChange} // 파일 선택 시 이벤트 처리
            className={styles.hiddenFileInput} // CSS로 숨김 처리
          />
        </div>
      </div>
      {/* 하단 가로선 */}
      <div className={styles.horizontalLine}></div>
    </div>
  );
}

export default FileUploadContent;