import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 저장해둔 초기 카메라 위치
const initialCameraPosition = { x: -50, y: 0, z: -15 };
const initialTarget = { x: 100, y: 30, z: 50 };

const CAMERA_ANIMATION_DURATION = 1000; // ms

const EncryptionVisualizationScene = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera());
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const isMounted = useRef(true);
  const animationFrameId = useRef(null);
  const cubeClusterRef = useRef([]);
  const sphereClusterRef = useRef([]);
  const centerPosition = new THREE.Vector3(0, 0, 0); // 센터 포지션 변수
  const cubeClusterCenter = new THREE.Vector3();
  const sphereClusterCenter = new THREE.Vector3();
  const signalRefs = useRef([]);
  const cameraAnimationRef = useRef(null);
  const keycardRef = useRef(null);
  const fileRef = useRef(null);
  const policyRef = useRef(null);
  const [isKeycardVisible, setIsKeycardVisible] = useState(false);
  const [isFileVisible, setIsFileVisible] = useState(false);
  const [isMovingToOrigin, setIsMovingToOrigin] = useState(false);
  const [isCubeVisible, setIsCubeVisible] = useState(false);
  const [isClusterMoving, setIsClusterMoving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 중 여부
  const [showUploadComplete, setShowUploadComplete] = useState(false);
  const [uploadCompleteOpacity, setUploadCompleteOpacity] = useState(0);
  const [isAbeAnimating, setIsAbeAnimating] = useState(false);
  const [isAbeMovingToOrigin, setIsAbeMovingToOrigin] = useState(false);
  const cubeRef = useRef(null);

  // keycard 애니메이션용 상태
  const [keycardAppearProgress, setKeycardAppearProgress] = useState(0);

  // policy 모델 등장 완료 후에만 이동 애니메이션을 시작하도록 상태 추가
  const [isPolicyFullyVisible, setIsPolicyFullyVisible] = useState(false);

  // keycard 생성 및 애니메이션 함수
  const handleUploadClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // 초기화
    setIsKeycardVisible(false);
    setIsFileVisible(false);
    setIsMovingToOrigin(false);
    setIsCubeVisible(false);
    setIsClusterMoving(false);

    // 키카드, 파일, 큐브 모델 제거
    if (keycardRef.current && sceneRef.current) {
      sceneRef.current.remove(keycardRef.current);
      keycardRef.current = null;
    }
    if (fileRef.current && sceneRef.current) {
      sceneRef.current.remove(fileRef.current);
      fileRef.current = null;
    }
    if (cubeRef.current && sceneRef.current) {
      sceneRef.current.remove(cubeRef.current);
      cubeRef.current = null;
    }

    // 1. 원점 쪽으로 카메라 줌 (초기 애니메이션)
    const zoomPosition = { x: -20, y: 0, z: -10 };
    const zoomTarget = { x: 0, y: 0, z: 0 };
    animateCameraTo(zoomPosition, zoomTarget, 800);

    // 2. 약간의 딜레이 후 애니메이션 시작
    setTimeout(() => {
      setIsKeycardVisible(true);
      setKeycardAppearProgress(0);

      setTimeout(() => {
        setIsFileVisible(true);

        setTimeout(() => {
          setIsMovingToOrigin(true);

          setTimeout(() => {
            setIsCubeVisible(true);

            setTimeout(() => {
              setIsClusterMoving(true);
            }, 1000 + 300); // 큐브 등장 1초 + 0.3초 딜레이
          }, 1000 + 300); // 이동 1초 + 0.3초 딜레이
        }, 1000 + 300); // file 등장 1초 + 0.3초 딜레이
      }, 1000 + 300); // keycard 등장 1초 + 0.3초 딜레이
    }, 800);
  };

  // keycard 모델 생성 및 애니메이션
  useEffect(() => {
  if (!isKeycardVisible) return;
  let frameId;
  let modelObj = null;
  const loader = new GLTFLoader();
  loader.load('/resources/models/key_card.glb', (gltf) => {
    if (!isMounted.current) return;
    modelObj = gltf.scene;
    modelObj.scale.set(0, 0, 0); // 초기 스케일 0
    modelObj.position.set(0, 0, -5);
    sceneRef.current.add(modelObj);
    keycardRef.current = modelObj;

    // 시간 기반 애니메이션
    const duration = 1000; // 1초 동안 애니메이션
    let startTime = null;

    const animateAppear = (timestamp) => {
      if (!isMounted.current || !keycardRef.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0에서 1까지 진행
      const scale = 0.01 * progress; // 스케일 0에서 0.01로
      keycardRef.current.scale.set(scale, scale, scale);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateAppear);
      }
    };
    frameId = requestAnimationFrame(animateAppear);
  });

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (modelObj && sceneRef.current && modelObj.parent === sceneRef.current) {
      sceneRef.current.remove(modelObj);
    }
    keycardRef.current = null;
  };
}, [isKeycardVisible]);

  // file 모델 생성 및 애니메이션
  useEffect(() => {
  if (!isFileVisible) return;
  let frameId;
  let modelObj = null;
  const loader = new GLTFLoader();
  loader.load('/resources/models/file.glb', (gltf) => {
    if (!isMounted.current) return;
    modelObj = gltf.scene;
    modelObj.scale.set(0, 0, 0); // 초기 스케일 0
    modelObj.position.set(0, -1, 5);
    modelObj.rotateY(Math.PI / 2 * -1)
    sceneRef.current.add(modelObj);
    fileRef.current = modelObj;

    // 시간 기반 애니메이션
    const duration = 1000; // 1초 동안 애니메이션
    let startTime = null;

    const animateAppear = (timestamp) => {
      if (!isMounted.current || !fileRef.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0에서 1까지 진행
      const scale = 0.03 * progress; // 스케일 0에서 0.05로
      fileRef.current.scale.set(scale, scale, scale);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateAppear);
      }
    };
    frameId = requestAnimationFrame(animateAppear);
  });

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (modelObj && sceneRef.current && modelObj.parent === sceneRef.current) {
      sceneRef.current.remove(modelObj);
    }
    fileRef.current = null;
  };
}, [isFileVisible]);

  // 큐브 모델 생성 및 애니메이션
  useEffect(() => {
  if (!isCubeVisible) return;
  let frameId;
  let modelObj = null;
  const loader = new GLTFLoader();
  loader.load('/resources/models/cube.glb', (gltf) => {
    if (!isMounted.current) return;
    modelObj = gltf.scene;
    modelObj.scale.set(0, 0, 0); // 초기 스케일 0
    modelObj.position.set(0, 0, 0); // 원점
    sceneRef.current.add(modelObj);
    cubeRef.current = modelObj;

    // 시간 기반 애니메이션
    const duration = 1000; // 1초 동안 애니메이션
    let startTime = null;

    const animateAppear = (timestamp) => {
      if (!isMounted.current || !cubeRef.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0에서 1까지 진행
      const scale = 0.2 * progress; // 스케일 0에서 0.3으로
      cubeRef.current.scale.set(scale, scale, scale);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateAppear);
      }
    };
    frameId = requestAnimationFrame(animateAppear);
  });

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (modelObj && sceneRef.current && modelObj.parent === sceneRef.current) {
      sceneRef.current.remove(modelObj);
    }
    cubeRef.current = null;
  };
}, [isCubeVisible]);

  // policy 모델 생성 및 애니메이션
  useEffect(() => {
  if (!isAbeAnimating) return;
  if (!isKeycardVisible) return;
  let frameId;
  let modelObj = null;
  const loader = new GLTFLoader();
  const timeoutId = setTimeout(() => {
    loader.load('/resources/models/policy.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, -2, 4);
      modelObj.rotateY(Math.PI / 2 * -1);
      sceneRef.current.add(modelObj);
      policyRef.current = modelObj;

      const duration = 1000;
      let startTime = null;
      const animateAppear = (timestamp) => {
        if (!isMounted.current || !policyRef.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scale = 14 * progress;
        policyRef.current.scale.set(scale, scale, scale);
        if (progress < 1) {
          frameId = requestAnimationFrame(animateAppear);
        } else {
          // policy 모델이 완전히 나타난 후 상태 변경
          setIsPolicyFullyVisible(true);
        }
      };
      frameId = requestAnimationFrame(animateAppear);
    });
  }, 1000);

  return () => {
    clearTimeout(timeoutId);
    if (frameId) cancelAnimationFrame(frameId);
    setIsPolicyFullyVisible(false);
    // ❗️문제의 원인: 아래 코드가 항상 실행됨
    // if (modelObj && sceneRef.current && modelObj.parent === sceneRef.current) {
    //   sceneRef.current.remove(modelObj);
    // }
    // policyRef.current = null;
  };
}, [isAbeAnimating, isKeycardVisible]);

  // 카메라 애니메이션 함수
  const animateCameraTo = (toPosition, toTarget, duration = CAMERA_ANIMATION_DURATION) => {
    if (!cameraRef.current || !controlsRef.current) return;
    // 시작점
    const fromPos = cameraRef.current.position.clone();
    const fromTarget = controlsRef.current.target.clone();
    const toPos = new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z);
    const toTgt = new THREE.Vector3(toTarget.x, toTarget.y, toTarget.z);

    let start = null;
    if (cameraAnimationRef.current) cancelAnimationFrame(cameraAnimationRef.current);

    function animateCameraStep(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);

      // 보간
      cameraRef.current.position.lerpVectors(fromPos, toPos, t);
      controlsRef.current.target.lerpVectors(fromTarget, toTgt, t);
      controlsRef.current.update();

      if (t < 1) {
        cameraAnimationRef.current = requestAnimationFrame(animateCameraStep);
      }
    }
    cameraAnimationRef.current = requestAnimationFrame(animateCameraStep);
  };

  useEffect(() => {
    isMounted.current = true;

    // 초기화
    if (!containerRef.current) return;

    // 기존에 생성된 canvas가 있다면 모두 제거 (중복 방지)
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // === GLB 스카이돔(스카이박스) 모델 적용 ===
    const skyboxLoader = new GLTFLoader();
    skyboxLoader.load(
      '/resources/models/Inside galaxy HDRI.glb',
      (gltf) => {
        if (!isMounted.current) return;
        const skyboxScene = gltf.scene;
        skyboxScene.scale.set(1000, 1000, 1000);
        skyboxScene.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.BackSide;
          }
        });
        sceneRef.current.add(skyboxScene);
      },
      undefined,
      (error) => {
        console.error('Inside galaxy HDRI.glb load error:', error);
      }
    );

    // Scene setup
    sceneRef.current.background = new THREE.Color(0x111111);

    // 축 헬퍼 추가 (길이 10000, 음수/양수 모두 표시됨)
    const axesHelper = new THREE.AxesHelper(10000);
    axesHelper.position.set(0, 0, 0);
    sceneRef.current.add(axesHelper);

    // building.glb 모델을 원점에 추가 (원래 코드에 있던 부분)
    const buildingLoader = new GLTFLoader();
    buildingLoader.load(
      '/resources/models/building.glb',
      (gltf) => {
        if (!isMounted.current) return;
        const buildingModel = gltf.scene;
        buildingModel.position.set(0, -50, 0);
        buildingModel.scale.set(0.6, 0.6, 0.6);
        buildingModel.rotateY(Math.PI / 2 * -1);
        sceneRef.current.add(buildingModel);
      },
      undefined,
      (error) => {
        console.error('building.glb load error:', error);
      }
    );

    // city 모델 추가
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/resources/models/city_test.glb',
      (gltf) => {
        if (!isMounted.current) return;
        const model = gltf.scene;
        model.scale.set(0.001, 0.001, 0.001);
        const whiteColor = new THREE.Color(0xffffff);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                if (material.color) {
                  material.color.set(whiteColor);
                }
              });
            } else if (child.material.color) {
              child.material.color.set(whiteColor);
            }
          }
        });
        sceneRef.current.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('GLTF load error:', error);
      }
    );

    // === 아래 glb 모델들은 필요시 주석 해제해서 추가 가능 ===
    // key_card, cube, policy, file 등은 scene에 추가하지 않음
    // const keyLoader = new GLTFLoader();
    // keyLoader.load(
    //   '/resources/models/key_card.glb',
    //   (gltf) => {
    //     if (!isMounted.current) return;
    //     const keyModel = gltf.scene;
    //     keyModel.position.set(0, 0, 0); // 원점에 위치
    //     keyModel.scale.set(0.01, 0.01, 0.01); // 필요시 크기 조정
        
    //     sceneRef.current.add(keyModel);
    //   },
    //   undefined,
    //   (error) => {
    //     console.error('the_golden_key.glb load error:', error);
    //   }
    // );

    // // cube.glb 모델을 원점에 추가
    // const cubeLoader = new GLTFLoader();
    // keyLoader.load(
    //   '/resources/models/cube.glb',
    //   (gltf) => {
    //     if (!isMounted.current) return;
    //     const cubeModel = gltf.scene;
    //     cubeModel.position.set(0, 0, 20); // 원점에 위치
    //     cubeModel.scale.set(0.3, 0.3, 0.3); // 필요시 크기 조정
    //     sceneRef.current.add(cubeModel);
    //   },
    //   undefined,
    //   (error) => {
    //     console.error('cube.glb load error:', error);
    //   }
    // );

    // clipboard.glb 모델을 원점에 추가
    // const clipboradLoader = new GLTFLoader();
    // keyLoader.load(
    //   '/resources/models/policy.glb',
    //   (gltf) => {
    //     if (!isMounted.current) return;
    //     const policyModel = gltf.scene;
    //     policyModel.position.set(0, 0, 30); // 원점에 위치
    //     policyModel.scale.set(70, 70, 70); // 필요시 크기 조정
    //     policyModel.rotateY(Math.PI / 2 * -1); // 필요시 회전 조정
    //     sceneRef.current.add(policyModel);
    //   },
    //   undefined,
    //   (error) => {
    //     console.error('policy.glb load error:', error);
    //   }
    // );

    // clipboard.glb 모델을 원점에 추가
    // const fileLoader = new GLTFLoader();
    // keyLoader.load(
    //   '/resources/models/file.glb',
    //   (gltf) => {
    //     if (!isMounted.current) return;
    //     const fileModel = gltf.scene;
    //     fileModel.position.set(0, 0, 10); // 원점에 위치
    //     fileModel.scale.set(0.05, 0.05, 0.05); // 필요시 크기 조정
    //     fileModel.rotateY(Math.PI / 2 * -1); // 필요시 회전 조정
    //     sceneRef.current.add(fileModel);
    //   },
    //   undefined,
    //   (error) => {
    //     console.error('file.glb load error:', error);
    //   }
    // );

    // // orb.glb 모델을 추가
    // const orbLoader = new GLTFLoader();
    // orbLoader.load(
    //   '/resources/models/orb.glb',
    //   (gltf) => {
    //     if (!isMounted.current) return;
    //     const orbModel = gltf.scene;
    //     orbModel.position.set(0, 0, 10); // 원점에 위치
    //     orbModel.scale.set(1, 1, 1); // 필요에 따라 크기 조정

    //     // 하늘색 빛 효과를 위한 PointLight 추가
    //     const orbLight = new THREE.PointLight(0xadd8e6, 100, 200);
    //     orbLight.position.set(0, 0, 10);
    //     orbLight.castShadow = true; // 그림자 활성화
    //     orbLight.shadow.bias = -0.005;
    //     orbLight.shadow.mapSize.width = 1024;
    //     orbLight.shadow.mapSize.height = 1024;
    //     sceneRef.current.add(orbLight);

    //     // orbModel이 그림자를 받을 수 있도록 설정
    //     orbModel.traverse((child) => {
    //       if (child.isMesh) {
    //         child.castShadow = true;
    //         child.receiveShadow = true;
    //       }
    //     });

    //     sceneRef.current.add(orbModel);
    //   },
    //   undefined,
    //   (error) => {
    //     console.error('orb.glb load error:', error);
    //   }
    // );

    // Renderer에서 그림자 활성화
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // 바닥(plane) 추가: 그림자가 투영될 곳이 필요함
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x222233, side: THREE.DoubleSide });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -60;
    groundMesh.receiveShadow = true;
    sceneRef.current.add(groundMesh);

    // 큐브 클러스터
    const cubeClusterGeometry = new THREE.BoxGeometry(5, 5, 5); // 큐브 크기
    const cubeClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색
    let cubeClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) { // 10개 큐브
      const x = Math.random() * 20 + 200;
      const y = Math.random() * 20 + 100;
      const z = Math.random() * 20 + 100;
      const cubePosition = new THREE.Vector3(x, y, z);
      cubeClusterTotal.add(cubePosition);
      const cube = new THREE.Mesh(cubeClusterGeometry, cubeClusterMaterial);
      cube.position.copy(cubePosition);
      sceneRef.current.add(cube);
      cubeClusterRef.current.push(cube);
    }
    cubeClusterCenter.copy(cubeClusterTotal).divideScalar(cubeClusterRef.current.length);

    // 구 클러스터
    const sphereClusterGeometry = new THREE.SphereGeometry(3, 32, 32); // 구 크기
    const sphereClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색
    let sphereClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) { // 10개 구
      const x = Math.random() * 20 + 200;
      const y = Math.random() * 20 + 100;
      const z = Math.random() * 20 - 10;
      const spherePosition = new THREE.Vector3(x, y, z);
      sphereClusterTotal.add(spherePosition);
      const sphere = new THREE.Mesh(sphereClusterGeometry, sphereClusterMaterial);
      sphere.position.copy(spherePosition);
      sceneRef.current.add(sphere);
      sphereClusterRef.current.push(sphere);
    }
    sphereClusterCenter.copy(sphereClusterTotal).divideScalar(sphereClusterRef.current.length);


    // === 조명 설정 ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 100, 0);
    sceneRef.current.add(directionalLight);

    // 카메라 및 컨트롤 설정
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    cameraRef.current.position.set(
      initialCameraPosition.x,
      initialCameraPosition.y,
      initialCameraPosition.z
    );
    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.target.set(initialTarget.x, initialTarget.y, initialTarget.z);
    cameraRef.current.lookAt(0, 0, 0);

    // 애니메이션 루프
    const animate = () => {
      if (!isMounted.current) return;
      animationFrameId.current = requestAnimationFrame(animate);
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!isMounted.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
      if (cameraAnimationRef.current) cancelAnimationFrame(cameraAnimationRef.current);
      controlsRef.current?.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      sceneRef.current.clear();
    };
  }, []);

  // 버튼 클릭 핸들러
  const handleCameraReset = () => {
    animateCameraTo(initialCameraPosition, initialTarget);
  };

  // 파일/키카드 모델을 원점으로 이동시키는 애니메이션
  useEffect(() => {
    if (!isMovingToOrigin) return;
    let frameId;
    const moveDuration = 1000; // 1초
    let startTime = null;

    // 시작 위치 저장
    const keycardStart = keycardRef.current ? keycardRef.current.position.clone() : null;
    const fileStart = fileRef.current ? fileRef.current.position.clone() : null;
    // 이동 목표 위치를 다르게 지정
    const keycardTarget = new THREE.Vector3(-2, 0, 0); // 예: 원점 왼쪽
    const fileTarget = new THREE.Vector3(2, -2, 0);     // 예: 원점 오른쪽

    const animateMove = (timestamp) => {
      if (!isMounted.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / moveDuration, 1);

      if (keycardRef.current && keycardStart) {
        keycardRef.current.position.lerpVectors(keycardStart, keycardTarget, t);
      }
      if (fileRef.current && fileStart) {
        fileRef.current.position.lerpVectors(fileStart, fileTarget, t);
      }

      if (t < 1) {
        frameId = requestAnimationFrame(animateMove);
      }
    };
    frameId = requestAnimationFrame(animateMove);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isMovingToOrigin]);

  // 그룹(키카드, 파일, 큐브)을 구 클러스터의 임의 위치로 이동시키는 애니메이션
  useEffect(() => {
    if (!isClusterMoving) return;
    let frameId;
    const moveDuration = 2500; // 이동 속도 느리게 (2.5초)
    let startTime = null;

    // 그룹의 모델들
    const models = [keycardRef.current, fileRef.current, cubeRef.current].filter(Boolean);
    if (models.length === 0) return;

    // 그룹의 초기 중심점 계산
    const groupStartCenter = new THREE.Vector3();
    models.forEach(m => groupStartCenter.add(m.position));
    groupStartCenter.divideScalar(models.length);

    // 각 모델의 상대 위치(중심점 기준)
    const relativePositions = models.map(m => m.position.clone().sub(groupStartCenter));

    // 구 클러스터의 임의 위치 생성
    const clusterTarget = new THREE.Vector3(
      Math.random() * 20 + 200,
      Math.random() * 20 + 100,
      Math.random() * 20 - 10
    );

    // 카메라 이동용: 시작점과 타겟
    const cameraStart = cameraRef.current ? cameraRef.current.position.clone() : null;
    const cameraTarget = clusterTarget.clone().add(new THREE.Vector3(30, 10, 30)); // 타겟 위/뒤에서 바라보게

    const controlsStart = controlsRef.current ? controlsRef.current.target.clone() : null;
    const controlsTarget = clusterTarget.clone();

    const animateMove = (timestamp) => {
      if (!isMounted.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / moveDuration, 1);

      // 현재 그룹 중심점 위치 보간
      const currentCenter = groupStartCenter.clone().lerp(clusterTarget, t);

      // 각 모델을 그룹 내 상대 위치를 유지하며 이동
      models.forEach((m, i) => {
        m.position.copy(currentCenter.clone().add(relativePositions[i]));
      });

      // 카메라도 같이 이동
      if (cameraRef.current && cameraStart && cameraTarget) {
        cameraRef.current.position.lerpVectors(cameraStart, cameraTarget, t);
      }
      if (controlsRef.current && controlsStart && controlsTarget) {
        controlsRef.current.target.lerpVectors(controlsStart, controlsTarget, t);
        controlsRef.current.update();
      }

      if (t < 1) {
        frameId = requestAnimationFrame(animateMove);
      } else {
        // 애니메이션이 끝나면 버튼 활성화
        setIsAnimating(false);
        setIsAbeAnimating(false);

        // === 업로드 완료 메시지 표시 ===
        setShowUploadComplete(true);
        setUploadCompleteOpacity(0);

        // 페이드인
        let fadeInStart = null;
        const fadeInDuration = 500;
        const fadeOutDuration = 500;
        const showDuration = 1000;

        function fadeIn(ts) {
          if (!fadeInStart) fadeInStart = ts;
          const elapsed = ts - fadeInStart;
          const t = Math.min(elapsed / fadeInDuration, 1);
          setUploadCompleteOpacity(t);
          if (t < 1) {
            requestAnimationFrame(fadeIn);
          } else {
            // 1초 유지 후 페이드아웃
            setTimeout(() => {
              let fadeOutStart = null;
              function fadeOut(ts2) {
                if (!fadeOutStart) fadeOutStart = ts2;
                const elapsed2 = ts2 - fadeOutStart;
                const t2 = Math.min(elapsed2 / fadeOutDuration, 1);
                setUploadCompleteOpacity(1 - t2);
                if (t2 < 1) {
                  requestAnimationFrame(fadeOut);
                } else {
                  setShowUploadComplete(false);
                }
              }
              requestAnimationFrame(fadeOut);
            }, showDuration);
          }
        }
        requestAnimationFrame(fadeIn);
      }
    };
    frameId = requestAnimationFrame(animateMove);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isClusterMoving]);

  // CP-ABE 암호문 업로드 버튼 핸들러
  const handleAbeUploadClick = () => {
    if (isAbeAnimating) return;
    setIsAbeAnimating(true);

    // 초기화
    setIsKeycardVisible(false);
    setIsFileVisible(false);
    setIsMovingToOrigin(false);
    setIsCubeVisible(false);
    setIsClusterMoving(false);
    setIsAbeMovingToOrigin(false);
    setIsPolicyFullyVisible(false);

    // 키카드, 파일, 큐브, policy 모델 제거
    if (keycardRef.current && sceneRef.current) {
      sceneRef.current.remove(keycardRef.current);
      keycardRef.current = null;
    }
    if (fileRef.current && sceneRef.current) {
      sceneRef.current.remove(fileRef.current);
      fileRef.current = null;
    }
    if (cubeRef.current && sceneRef.current) {
      sceneRef.current.remove(cubeRef.current);
      cubeRef.current = null;
    }
    if (policyRef.current && sceneRef.current) {
      sceneRef.current.remove(policyRef.current);
      policyRef.current = null;
    }

    // 1. 원점 쪽으로 카메라 줌 (초기 애니메이션)
    const zoomPosition = { x: -20, y: 0, z: -10 };
    const zoomTarget = { x: 0, y: 0, z: 0 };
    animateCameraTo(zoomPosition, zoomTarget, 800);

    // 2. 약간의 딜레이 후 키카드 등장
    setTimeout(() => {
      setIsKeycardVisible(true);
      setKeycardAppearProgress(0);
      // policy는 useEffect에서 자동 등장
      // 이동 애니메이션은 policy가 완전히 나타난 후에 실행됨
    }, 800);
  };

  // CP-ABE 키카드+policy 원점 이동 애니메이션
  useEffect(() => {
    if (!isAbeMovingToOrigin) return;
    let frameId;
    const moveDuration = 1000; // 1초
    let startTime = null;

    // 시작 위치 저장
    const keycardStart = keycardRef.current ? keycardRef.current.position.clone() : null;
    const policyStart = policyRef.current ? policyRef.current.position.clone() : null;
    // 이동 목표 위치
    const keycardTarget = new THREE.Vector3(-2, 0, 0); // 원점 왼쪽
    const policyTarget = new THREE.Vector3(2, -2, 0);   // 원점 오른쪽

    const animateMove = (timestamp) => {
      if (!isMounted.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / moveDuration, 1);

      if (keycardRef.current && keycardStart) {
        keycardRef.current.position.lerpVectors(keycardStart, keycardTarget, t);
      }
      if (policyRef.current && policyStart) {
        policyRef.current.position.lerpVectors(policyStart, policyTarget, t);
      }

      if (t < 1) {
        frameId = requestAnimationFrame(animateMove);
      }
    };
    frameId = requestAnimationFrame(animateMove);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isAbeMovingToOrigin]);

  // policy가 완전히 나타난 후에만 이동 애니메이션 시작
  useEffect(() => {
    if (!isPolicyFullyVisible) return;
    // 약간의 추가 딜레이 후 이동
    const delay = 200;
    const timeout = setTimeout(() => {
      setIsAbeMovingToOrigin(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isPolicyFullyVisible]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {/* 업로드 완료 메시지 */}
      {showUploadComplete && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: '#fff',
              background: 'rgba(0,0,0,0.7)',
              padding: '32px 48px',
              borderRadius: '18px',
              boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
              opacity: uploadCompleteOpacity,
              transition: 'opacity 0.2s',
            }}
          >
            IPFS에 업데이트 파일 업로드 완료!
          </div>
        </div>
      )}
      <div style={{
        position: 'absolute',
        left: 20,
        bottom: 20,
        zIndex: 10,
        display: 'flex',
        gap: 10,
      }}>
        <button
          style={{
            padding: '10px 18px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            background: '#0046ff',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          onClick={handleCameraReset}
        >
          카메라 초기 위치로 이동
        </button>
        <button
          style={{
            padding: '10px 18px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            background: '#00b894',
            color: '#fff',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            opacity: isAnimating ? 0.5 : 1,
          }}
          onClick={handleUploadClick}
          disabled={isAnimating}
        >
          업데이트 파일 업로드
        </button>
        <button
          style={{
            padding: '10px 18px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            background: '#6c47ff',
            color: '#fff',
            cursor: isAbeAnimating ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            opacity: isAbeAnimating ? 0.5 : 1,
          }}
          onClick={handleAbeUploadClick}
          disabled={isAbeAnimating}
        >
          CP-ABE 암호문 업로드
        </button>
      </div>
    </div>
  );
};

export default EncryptionVisualizationScene;