import React, { useState, useEffect } from 'react';
import styles from './UpdateMonitoringContent.module.css';

function UpdateMonitoring({ onClose }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const response = await fetch('/api/items');
  //     const data = await response.json();
  //     setItems(data.items || []);
  //     setTotalPages(Math.max(1, Math.ceil((data.items || []).length / 2)));
  //   };
  //   fetchItems();
  // }, []);

  // 임시로 데이터 가져오기
  useEffect(() => {
    const fetchItems = async () => {
      // 임시 데이터: 이미지에서 가져온 두 개의 업데이트 현황
      const tempData = [
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'LX2.PE.KOR.S.sdasdasdaasdsadsdsdadassasd..',
          fuelType: '79,531.92 GAS',
          ipfsNode: '192.168.1.100:8333',
          ipfsCid: 'ip4/104.236.176.4....',
          mileage: '100,000번',
        },
        {
          model: 'VI15MY.KOR.S....',
          fuelType: '122,902.01 GAS',
          ipfsNode: '192.168.1.021:8334',
          ipfsCid: 'ip4/104.236.867.2....',
          mileage: '50,000번',
        },
      ];
      setItems(tempData);
      setTotalPages(Math.max(1, Math.ceil(tempData.length / 5)));
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
      <div className={styles.header}>
        <span>업데이트 명</span>
        <span>GAS 소모량</span>
        <span>스마트 컨트랙트 노드</span>
        <span>IPFS CID</span>
        <span>결제 현황</span>
      </div>
      <hr className={styles.divider} />
      <div className={styles.itemList}>
        {displayItems.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.itemDetails}>
              <span>{item.model || '-'}</span>
              <span>{item.fuelType || '-'}</span>
              <span>{item.ipfsNode || '-'}</span>
              <span>{item.ipfsCid || '-'}</span>
              <span>{item.mileage || '-'}</span>
            </div>
          </div>
        ))}
      </div>
      <hr className={styles.divider} />
      <div className={styles.pagination}>
        <button className={styles.arrow} onClick={handlePrev}>←</button>
        <span className={styles.pageInfo}>{currentPage + 1}/{totalPages}</span>
        <button className={styles.arrow} onClick={handleNext}>→</button>
      </div>
    </div>
  );
}

export default UpdateMonitoring;