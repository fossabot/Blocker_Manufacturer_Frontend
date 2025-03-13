// components/MainContent/MainContent.js
import React, { useState } from 'react';
import styles from './MainContent.module.css';
import { UpdateService } from '../../api/uploadService';

function MainContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState(''); // 입력 상태

  const handleStart = async () => {
    if (!inputText) return; // 입력값 검증
    
    try {
      setLoading(true);
      const response = await UpdateService.uploadText(inputText);
      console.log('업로드 성공:', response);
      setInputText(''); // 성공 후 입력 초기화
    } catch (err) {
      setError(err.response?.data?.message || '서버 연결 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleLearnMore = async () => {
    const response = await UpdateService.getInfo();
    console.log('Info:', response);
  };

  const handlePreview = async () => {
    const response = await UpdateService.getPreview(123);
    console.log('Preview:', response);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>HSU Blocker</h1>
      <h2 className={styles.title}>Blockchain IoT Software Update Framework</h2>

      <div className={styles.platforms}>
        <h1>Deploying Software Update!</h1>
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter software"
          className={styles.inputField}
        />
      </div>
      
      <div className={styles.buttonGroup}>
        <button 
          onClick={handleStart}
          disabled={loading || !inputText} // 입력 없으면 비활성화
          className={styles.buttonPrimary}
        >
          {loading ? '처리 중...' : 'Deploy Update'}
        </button>
        
        <button 
          onClick={handleLearnMore}
          className={styles.buttonSecondary}
        >
          Monitoring Update
        </button>
        
        <button 
          onClick={handlePreview}
          className={styles.buttonOutline}
        >
          Learn More
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default MainContent;