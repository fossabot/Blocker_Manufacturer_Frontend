import React, { useRef, useState } from 'react';
import styles from './FileUploadContent.module.css';

function FileUploadContent() {
    // 숨겨진 파일 입력(input) 요소에 접근하기 위한 ref
    const fileInputRef = useRef(null);
    // 업로드된 파일명을 저장할 state
    const [uploadedFileName, setUploadedFileName] = useState(null);
  
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
        // 파일명이 있다면 state에 저장하여 화면에 표시합니다.
        setUploadedFileName(file.name);
        console.log('선택된 파일:', file);
        // 실제 파일 업로드 로직은 여기에 추가 (예: 서버로 파일 전송)
      } else {
        // 파일 선택이 취소되면 파일명 state를 초기화합니다.
        setUploadedFileName(null);
      }
      // 같은 파일 재선택 시 onChange 이벤트가 다시 발생하도록 input 값 초기화 (선택 사항)
      event.target.value = null;
    };

  return (
  <div className={styles.background}>
    <div className={styles.container}>
      {/* "파일" 텍스트, 파일명, 업로드 섹션을 담는 가로 행 */}
      <div className={styles.topRow}>
        {/* "파일" 텍스트와 파일명 영역 */}
        <div className={styles.fileInfo}>
          <span className={styles.fileLabel}>File</span>
          <span className={styles.verticalLine}></span> {/* 세로선 */}
          {/* 파일명이 있을 경우에만 파일명 표시 */}
          {uploadedFileName && (
            <span className={styles.uploadedFileName}>
              {uploadedFileName}
            </span>
          )}
        </div>
        {/* 오른쪽의 흰 바와 업로드 버튼 영역 */}
        <div className={styles.uploadSection}>
          {/* 커스텀 "업로드" 버튼 */}
          <button className={styles.uploadButton} onClick={handleButtonClick}>
            Upload
          </button>
          {/* 숨겨진 파일 입력(input) 요소 */}
          <input
            type="file" // 파일 선택 input
            ref={fileInputRef} // ref를 사용하여 요소에 접근
            onChange={handleFileChange} // 파일 선택 시 이벤트 처리
            className={styles.hiddenFileInput} // CSS로 숨김 처리
          />
        </div>
      </div>
      {/* 하단 가로선 */}
      <div className={styles.horizontalLine}></div>
    </div>
  </div>
  );
}

export default FileUploadContent;