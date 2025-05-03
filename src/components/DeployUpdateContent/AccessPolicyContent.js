// src/components/DynamicInputLists/AccessPolicyContent.js
import React, { useState, useEffect } from 'react';
import styles from './AccessPolicyContent.module.css';

const AccessPolicyContent = ({ onValuesChange }) => {
    // 각 유형별 입력 값들을 배열로 관리하는 state
    const [itemValues, setItemValues] = useState({
        modelName: [],
        serialNumber: [],
        manufactureDate: [],
        optionType: [],
    });

    // 항목(컬럼)의 헤더와 해당 데이터를 식별할 키
    const headers = ['Model Name', 'Serial Number', 'Manufacture Date', 'Option Type'];
    const keys = ['modelName', 'serialNumber', 'manufactureDate', 'optionType'];

    // state(itemValues)가 변경될 때마다 부모에게 최신 값을 전달 (useEffect만 사용)
    useEffect(() => {
        if (onValuesChange) {
            onValuesChange(itemValues);
        }
    }, [itemValues, onValuesChange]);


    // 특정 유형에 새로운 입력 필드(빈 값)를 추가하는 함수
    const handleAddField = (typeKey) => {
        const updatedItemValues = {
            ...itemValues,
            [typeKey]: [...itemValues[typeKey], ''], // 빈 문자열 추가
        };
        setItemValues(updatedItemValues);
    };

    // 특정 유형(typeKey)의 특정 인덱스(index)에 해당하는 입력 필드 값 변경 시 호출될 함수
    const handleValueChange = (typeKey, index, value) => {
        const updatedTypeValues = [...itemValues[typeKey]]; // 배열 복사
        updatedTypeValues[index] = value; // 값 업데이트

        const updatedState = {
            ...itemValues,
            [typeKey]: updatedTypeValues,
        };
        setItemValues(updatedState);
    };

    // 특정 유형(typeKey)의 특정 인덱스(index)에 해당하는 입력 필드를 제거하는 함수
    const handleRemoveField = (typeKey, index) => {
        setItemValues(prevState => {
            const updatedTypeValues = prevState[typeKey].filter((_, i) => i !== index);
            const updatedState = {
                ...prevState,
                [typeKey]: updatedTypeValues,
            };
            return updatedState;
        });
    };


    return (
        // 컨테이너는 헤더와 스크롤 가능 영역을 세로로 배치하는 Flex 컨테이너가 됩니다.
        <div className={styles.container}>
            {/* 헤더 행: 4가지 유형의 라벨 */}
            {/* 스크롤 시 상단에 고정됩니다. */}
            <div className={styles.headerRow}>
                {headers.map(header => (
                    <div key={header} className={styles.headerCell}>{header}</div>
                ))}
            </div>

            {/* *** 스크롤 가능한 콘텐츠 영역을 감싸는 div 추가 *** */}
            {/* 이 div에 max-height와 overflow-y: auto를 적용합니다. */}
            <div className={styles.scrollableContent}>
                {/* 4가지 유형별 입력 리스트와 "+" 버튼을 담을 컨테이너 */}
                <div className={styles.inputListsContainer}>
                    {/* keys 배열을 순회하며 각 유형별 컬럼을 생성 */}
                    {keys.map(typeKey => (
                        // 각 유형의 입력 필드 리스트와 "+" 버튼을 담을 컬럼
                        <div key={typeKey} className={styles.inputListColumn}>
                            {/* 해당 유형의 배열 값을 순회하며 입력 필드를 렌더링 */}
                            {itemValues[typeKey].map((value, index) => (
                                // 각 입력 필드와 제거 버튼을 감싸는 div
                                <div key={index} className={styles.inputFieldRow}>
                                    <input
                                        type="text"
                                        className={styles.inputField}
                                        value={value}
                                        onChange={(e) => handleValueChange(typeKey, index, e.target.value)}
                                    />
                                    {/* 제거 버튼 */}
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => handleRemoveField(typeKey, index)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}

                            {/* 해당 유형에 대한 새로운 입력 필드를 추가하는 "+" 버튼 */}
                            <button className={styles.addButton} onClick={() => handleAddField(typeKey)}>
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </div> {/* scrollableContent 닫는 태그 */}
        </div>
    );
};

export default AccessPolicyContent;