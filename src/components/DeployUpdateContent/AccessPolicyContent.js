// src/components/DynamicInputLists/AccessPolicyContent.js
import React, { useState, useEffect, useRef } from 'react'; // <-- useRef 임포트 추가
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

    // Ref 객체: 동적으로 생성되는 input 요소들의 참조를 저장합니다.
    // inputRefs.current는 { typeKey: [inputElement1, inputElement2, ...], ... } 형태가 됩니다.
    const inputRefs = useRef({}); // <-- useRef를 사용하여 ref 객체 생성

    // 상태: 마지막으로 추가된 input의 key와 index 정보를 저장하여 포커스 트리거에 사용합니다.
    const [lastAddedInputInfo, setLastAddedInputInfo] = useState(null); // <-- 상태 추가 { typeKey: string, index: number }


    // initialValues prop이 변경될 때 로컬 state를 업데이트하는 useEffect
    // 이 effect는 AccessPolicy 페이지가 App.js로부터 새로운 initialValues를 받을 때 실행됩니다.
    useEffect(() => {
        console.log("AccessPolicyContent: initialValues prop changed, updating local state.");
        setItemValues(initialValues || {
            modelName: [],
            serialNumber: [],
            manufactureDate: [],
            optionType: [],
        });
        // initialValues가 변경되면 마지막 추가 정보 상태를 초기화합니다.
        setLastAddedInputInfo(null);
    }, [initialValues]); // initialValues prop이 변경될 때만 실행

    // Effect: lastAddedInputInfo 상태 변화를 감지하여 새로운 input에 포커스를 설정합니다.
    // 이 effect는 handleAddField에서 setLastAddedInputInfo가 호출된 후 컴포넌트 리렌더링 시 실행됩니다.
    useEffect(() => {
        if (lastAddedInputInfo) {
            const { typeKey, index } = lastAddedInputInfo;
            // requestAnimationFrame: DOM 업데이트가 완료된 다음 프레임에서 코드를 실행하여
            // 새로 추가된 input 요소가 DOM에 확실히 존재하도록 합니다.
            requestAnimationFrame(() => {
                // inputRefs 객체에서 해당 input 요소의 참조를 가져옵니다.
                const inputElement = inputRefs.current[typeKey]?.[index];
                if (inputElement) {
                    // 요소가 존재하면 포커스를 설정합니다.
                    inputElement.focus();
                    console.log(`AccessPolicyContent: Focused input at ${typeKey}[${index}]`);
                }
                // 포커스 시도 후 lastAddedInputInfo 상태를 초기화하여 effect가 다시 불필요하게 실행되지 않도록 합니다.
                setLastAddedInputInfo(null);
            });
        }
    }, [lastAddedInputInfo]); // <-- lastAddedInputInfo 상태가 변경될 때만 실행


    // 함수: input 요소의 ref prop에 사용되어 input 요소의 참조를 inputRefs에 저장합니다.
    // React는 ref prop에 함수를 전달하면, 요소가 마운트될 때 해당 요소를 인자로 호출하고,
    // 요소가 언마운트될 때는 null을 인자로 호출합니다.
    const setInputRef = (typeKey, index, element) => {
        // 해당 typeKey에 대한 배열이 없으면 생성합니다.
        if (!inputRefs.current[typeKey]) {
            inputRefs.current[typeKey] = [];
        }
        // 요소가 존재하면 해당 index에 참조를 저장합니다.
        if (element) {
            inputRefs.current[typeKey][index] = element;
        } else {
            // 요소가 언마운트될 때 (제거될 때) 해당 index의 참조를 배열에서 제거합니다.
            // splice를 사용하면 배열의 길이가 변경되어 인덱스 관리가 다소 복잡해질 수 있지만,
            // 여기서는 간단한 구현을 위해 사용합니다. (더 견고하게 하려면 Map 등을 고려할 수 있습니다.)
            if (inputRefs.current[typeKey]) {
                inputRefs.current[typeKey].splice(index, 1);
            }
        }
    };


    // 특정 유형에 새로운 입력 필드(빈 값)를 추가하는 함수
    const handleAddField = (typeKey) => {
        setItemValues(prevState => {
            const updatedItemValues = {
                ...prevState,
                [typeKey]: [...prevState[typeKey], ''], // 빈 문자열 추가
            };
            // 새로운 항목의 index를 계산합니다 (이전 상태 기준)
            const newIndex = prevState[typeKey].length;
            // lastAddedInputInfo 상태를 업데이트하여 포커스 effect를 트리거합니다.
            setLastAddedInputInfo({ typeKey, index: newIndex }); // <-- 마지막 추가 정보 설정

            // 로컬 상태 업데이트 후 부모(페이지 컴포넌트)에게 변경 사항 전달
            if (onValuesChange) {
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
            if (onValuesChange) {
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
            // 제거될 요소의 ref를 정리합니다.
            if (inputRefs.current[typeKey]) {
                // filter로 인해 index가 변경될 수 있으므로 주의해야 합니다.
                // Map을 사용하면 index에 덜 의존적으로 관리할 수 있습니다.
                // 여기서는 간단히 해당 index의 ref를 제거합니다.
                inputRefs.current[typeKey].splice(index, 1);
            }
            // 로컬 상태 업데이트 후 부모(페이지 컴포넌트)에게 변경 사항 전달
            if (onValuesChange) {
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
                                        value={itemValues[typeKey][index]}
                                        onChange={(e) => handleValueChange(typeKey, index, e.target.value)}
                                        ref={element => setInputRef(typeKey, index, element)} // <-- ref prop에 setInputRef 함수 연결
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
            </div>
        </div>
    );
};

export default AccessPolicyContent;