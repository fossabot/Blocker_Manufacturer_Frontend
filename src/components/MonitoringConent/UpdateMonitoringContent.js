import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UpdateMonitoringContent.module.css';

function UpdateMonitoringContent({ onClose }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setItems([...data].reverse()); // 전체 데이터를 역순으로 저장
      setTotalPages(Math.max(1, Math.ceil(data.length / 5)));
    } catch (err) {
      console.error('Failed to fetch updates:', err);
      setError('Failed to load the update list. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleRemoveItem = async (uid) => {
    if (!window.confirm('Cancel this update?')) return;

    console.log(`Cancelling update with uid: ${uid}`);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!apiBaseUrl) {
      alert('API URL is not set. Please check your environment variables.');
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/manufacturer/cancel`,
        { uid },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
        }
      );

      if (response.data.success) {
        console.log(`Successfully cancelled update with uid: ${uid}, tx_hash: ${response.data.tx_hash}`);
        setItems(prevItems => {
          const newItems = prevItems.filter(item => item.uid !== uid);
          setTotalPages(Math.max(1, Math.ceil(newItems.length / 5)));
          if (newItems.length > 0 && currentPage * 5 >= newItems.length) {
            setCurrentPage(Math.max(0, currentPage - 1));
          }
          return newItems;
        });
      } else {
        throw new Error(response.data.error || 'Failed to cancel update.');
      }
    } catch (err) {
      console.error('Failed to cancel update:', err);
      alert(`Failed to cancel update: ${err.message || 'Unknown error'}`);
      fetchItems();
    }
  };

  const visibleItems = items.slice(currentPage * 5, (currentPage * 5) + 5);
  const displayItems = visibleItems.length < 5 ? [...visibleItems, ...Array(5 - visibleItems.length).fill({})] : visibleItems;

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
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
            <span>삭제</span>
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
                  <span>
                    {item.uid && (
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(item.uid)}
                      >
                        X
                      </button>
                    )}
                  </span>
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