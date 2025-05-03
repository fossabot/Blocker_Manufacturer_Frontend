// src/components/DynamicInputLists/AccessPolicyContent.js
import React, { useState, useEffect } from 'react';
import styles from './AccessPolicyContent.module.css';

// 부모(AccessPolicy 페이지)로부터 onValuesChange 콜백 함수 (페이지의 로컬 상태 업데이트용)와
// initialValues (초기 정책 조건 상태)를 prop으로 받습니다.
const AccessPolicyContent = ({ onValuesChange, initialValues }) => {
    // 각 유형별 입력 값들을 배열로 관리하는 로컬 state
    // initialValues prop이 제공되면 그 값으로 초기화, 없으면 기본값으로 초기화
    const [itemValues, setItemValues] = useState(initialValues || {
        modelName: [],
        serialNumber: [],
        manufactureDate: [],
        optionType: [],
    });

    // 항목(컬럼)의 헤더와 해당 데이터를 식별할 키
    const headers = ['Model Name', 'Serial Number', 'Manufacture Date', 'Option Type'];
    const keys = ['modelName', 'serialNumber', 'manufactureDate', 'optionType'];

    // NOTE: itemValues 변경 시 부모(App.js)에게 최신 값을 전달하던 useEffect는 제거합니다.
    // 이 useEffect가 무한 루프의 원인이었습니다.


    // initialValues prop이 변경될 때 로컬 state를 업데이트하는 useEffect (필요시)
    // 페이지 재방문 등으로 initialValues가 변경될 경우 로컬 상태 동기화에 사용합니다.
    useEffect(() => {
        console.log("AccessPolicyContent: initialValues prop changed, updating local state.");
        // initialValues prop이 변경될 때만 로컬 상태를 업데이트합니다.
        setItemValues(initialValues || {
            modelName: [],
            serialNumber: [],
            manufactureDate: [],
            optionType: [],
        });
    }, [initialValues]); // initialValues prop이 변경될 때만 실행


    // 특정 유형에 새로운 입력 필드(빈 값)를 추가하는 함수
    const handleAddField = (typeKey) => {
        setItemValues(prevState => {
            const updatedItemValues = {
                ...prevState, // <-- prevState 사용
                [typeKey]: [...prevState[typeKey], ''], // 빈 문자열 추가
            };
            // 로컬 상태 업데이트 후 부모(페이지 컴포넌트)에게 변경 사항 전달
            if (onValuesChange) { // <-- 부모로부터 받은 onValuesChange prop 호출
                onValuesChange(updatedItemValues);
                console.log("AccessPolicyContent: Called onValuesChange after add.", updatedItemValues);
            }
            return updatedItemValues; // setItemValues를 위해 업데이트된 상태 반환
        });
    };

    // 특정 유형(typeKey)의 특정 인덱스(index)에 해당하는 입력 필드 값 변경 시 호출될 함수
    const handleValueChange = (typeKey, index, value) => {
        setItemValues(prevState => {
            const updatedTypeValues = [...prevState[typeKey]]; // 배열 복사
            updatedTypeValues[index] = value; // 값 업데이트

            const updatedState = {
                ...prevState, // <-- prevState 사용
                [typeKey]: updatedTypeValues,
            };
            // 로컬 상태 업데이트 후 부모(페이지 컴포넌트)에게 변경 사항 전달
            if (onValuesChange) { // <-- 부모로부터 받은 onValuesChange prop 호출
                onValuesChange(updatedState);
                console.log("AccessPolicyContent: Called onValuesChange after value change.", updatedState);
            }
            return updatedState; // setItemValues를 위해 업데이트된 상태 반환
        });
    };

    // 특정 유형(typeKey)의 특정 인덱스(index)에 해당하는 입력 필드를 제거하는 함수
    const handleRemoveField = (typeKey, index) => {
        setItemValues(prevState => {
            const updatedTypeValues = prevState[typeKey].filter((_, i) => i !== index);
            const updatedState = {
                ...prevState,
                [typeKey]: updatedTypeValues,
            };
            // 로컬 상태 업데이트 후 부모(페이지 컴포넌트)에게 변경 사항 전달
            if (onValuesChange) { // <-- 부모로부터 받은 onValuesChange prop 호출
                onValuesChange(updatedState);
                console.log("AccessPolicyContent: Called onValuesChange after remove.", updatedState);
            }
            return updatedState; // setItemValues를 위해 업데이트된 상태 반환
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
                                        value={itemValues[typeKey][index]} // <-- itemValues 상태에서 직접 값을 가져옴
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
                <span className={styles.warningMessage}></span>
            </div> {/* scrollableContent 닫는 태그 */}
        </div>
    );
};

export default AccessPolicyContent;