import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UpdateMonitoringContent.module.css';

function UpdateMonitoringContent({ onClose }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);

      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      if (!apiBaseUrl) {
        setError('API URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/api/manufacturer/updates`, {
          headers: {
            'accept': 'application/json',
          },
        });
        const data = response.data.updates || [];
        setItems(data);
        setTotalPages(Math.max(1, Math.ceil(data.length / 5)));
      } catch (err) {
        console.error('Failed to fetch updates:', err);
        setError('업데이트 목록을 불러오지 못했습니다. 나중에 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const visibleItems = items.slice(currentPage * 5, (currentPage * 5) + 5);
  const displayItems = visibleItems.length < 5 ? [...visibleItems, ...Array(5 - visibleItems.length).fill({})] : visibleItems;

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.header}>
            <span>업데이트 명</span>
            <span>IPFS 해시</span>
            <span>설명</span>
            <span>가격</span>
            <span>버전</span>
          </div>
          <hr className={styles.divider} />
          <div className={styles.itemList}>
            {displayItems.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemDetails}>
                  <span>{item.uid || '-'}</span>
                  <span>{item.ipfs_hash || '-'}</span>
                  <span>{item.description || '-'}</span>
                  <span>{item.price ? `${item.price} ETH` : '-'}</span>
                  <span>{item.version || '-'}</span>
                </div>
              </div>
            ))}
          </div>
          <hr className={styles.divider} />
          <div className={styles.pagination}>
            <button className={styles.arrow} onClick={handlePrev} disabled={currentPage === 0}>
              ←
            </button>
            <span className={styles.pageInfo}>{currentPage + 1}/{totalPages}</span>
            <button className={styles.arrow} onClick={handleNext} disabled={currentPage >= totalPages - 1}>
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UpdateMonitoringContent;