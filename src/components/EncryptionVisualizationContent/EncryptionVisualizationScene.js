import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { useNavigate, useLocation } from 'react-router-dom';

// 저장해둔 초기 카메라 위치
const initialCameraPosition = { x: -80, y: -25, z: 65 };
const initialTarget = { x: 100, y: 30, z: 50 };

const CAMERA_ANIMATION_DURATION = 1000; // ms
const ANIMATION_DELAY = 500; // ms, 모든 단계 사이 딜레이

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
  const cameraAnimationRef = useRef(null);
  const keycardRef = useRef(null);
  const fileRef = useRef(null);
  const policyRef = useRef(null);
  const [isKeycardVisible, setIsKeycardVisible] = useState(false);
  const [isFileVisible, setIsFileVisible] = useState(false);
  const [isMovingToOrigin, setIsMovingToOrigin] = useState(false);
  const [isCubeVisible, setIsCubeVisible] = useState(false);
  const [isClusterMoving, setIsClusterMoving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUploadComplete, setShowUploadComplete] = useState(false);
  const [uploadCompleteOpacity, setUploadCompleteOpacity] = useState(0);
  const [isAbeAnimating, setIsAbeAnimating] = useState(false);
  const [, setKeycardAppearProgress] = useState(0);
  const [, setIsAbeMovingToOrigin] = useState(false);
  const [, setIsAbeGroupMoving] = useState(false);
  const labelRendererRef = useRef(null);
  const cubeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleExit = () => {
    if (location.state?.from === 'deployment') {
      navigate('/complete');
    } else {
      navigate('/');
    }
  };

  // policy 모델 등장 완료 후에만 이동 애니메이션을 시작하도록 상태 추가
  const [isPolicyFullyVisible, setIsPolicyFullyVisible] = useState(false);

  // CP-ABE 업로드 완료 메시지 상태 추가
  const [showAbeUploadComplete, setShowAbeUploadComplete] = useState(false);
  const [abeUploadCompleteOpacity, setAbeUploadCompleteOpacity] = useState(0);

  // 큐브에서 인증서 모델이 나오는 애니메이션용 상태
  const certificateRef = useRef(null);

  // === CP-ABE 정책 등장 후 인증서 등장 애니메이션 ===
  const [isAbeCertificateEmerging, setIsAbeCertificateEmerging] = useState(false);

  // === CP-ABE 업로드 애니메이션 단계 ===
  const [abeStep, setAbeStep] = useState(0); // 0: idle, 1: keycard, 2: policy, 3: cert, 4: groupMove, 5: cube, 6: clusterMove

  // 추가: 인증서 가시성 및 이동 상태
  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [isCertificateMoving, setIsCertificateMoving] = useState(false);

  // 업데이트 파일 업로드 애니메이션 시작
  const handleUploadClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // 초기화
    setIsKeycardVisible(false);
    setIsFileVisible(false);
    setIsMovingToOrigin(false);
    setIsCubeVisible(false);
    setIsClusterMoving(false);
    setIsCertificateVisible(false);
    setIsCertificateMoving(false);

    // 키카드, 파일, 큐브, 인증서 모델 제거
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
    if (certificateRef.current && sceneRef.current) {
      sceneRef.current.remove(certificateRef.current);
      certificateRef.current = null;
    }

    // 1. 원점 쪽으로 카메라 줌 (초기 애니메이션)
    const zoomPosition = { x: -20, y: 0, z: -10 };
    const zoomTarget = { x: 0, y: 0, z: 0 };
    animateCameraTo(zoomPosition, zoomTarget, 800);

    // 2. 단계별 애니메이션
    setTimeout(() => {
      setIsKeycardVisible(true);
      setKeycardAppearProgress(0);

      setTimeout(() => {
        setIsFileVisible(true);

        setTimeout(() => {
          setIsMovingToOrigin(true);

          setTimeout(() => {
            setIsCubeVisible(true);

            // === 대칭키 모델 점점 사라지기 ===
            if (keycardRef.current) {
              let fadeStart = null;
              // let fadeFrameId;
              const fadeDuration = 1000;
              // 투명도 적용을 위해 material.transparent = true
              keycardRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                  child.material.transparent = true;
                }
              });
              const fadeOut = (timestamp) => {
                if (!fadeStart) fadeStart = timestamp;
                const elapsed = timestamp - fadeStart;
                const t = Math.min(elapsed / fadeDuration, 1);
                keycardRef.current.traverse((child) => {
                  if (child.isMesh && child.material && typeof child.material.opacity === 'number') {
                    child.material.opacity = 1 - t;
                  }
                });
                if (t < 1) {
                  requestAnimationFrame(fadeOut);
                } else {
                  // 완전히 사라지면 씬에서 제거
                  if (sceneRef.current && keycardRef.current) {
                    sceneRef.current.remove(keycardRef.current);
                    keycardRef.current = null;
                  }
                }
              };
              requestAnimationFrame(fadeOut);
            }

            // === 인증서 등장 3초 ===
            setTimeout(() => {
              setIsCertificateVisible(true);
              // === 인증서 등장 애니메이션이 끝난 후(3초 후) z축 이동 시작 ===
              setTimeout(() => {
                setIsCertificateMoving(true);
                // === 2초간 이동 후 2초 대기 ===
                setTimeout(() => {
                  setIsClusterMoving(true);
                  setIsCertificateVisible(false);
                  setIsCertificateMoving(false);
                }, 2000); // 6초 대기
              }, 1000); // 2초간 z축 이동
            }, 100); // 3초간 등장
          }, ANIMATION_DELAY);
        }, ANIMATION_DELAY);
      }, ANIMATION_DELAY);
    }, ANIMATION_DELAY);
  };

  // keycard 모델 생성 및 애니메이션
  useEffect(() => {
    if (!isKeycardVisible) return;
    let frameId;
    let modelObj = null;
    const currentScene = sceneRef.current;
    const loader = new GLTFLoader();
    loader.load('/resources/models/key_card.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, 0, -5);
      currentScene.add(modelObj);
      keycardRef.current = modelObj;

      // 시간 기반 애니메이션
      const duration = 1000;
      let startTime = null;

      const animateAppear = (timestamp) => {
        if (!isMounted.current || !keycardRef.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scale = 0.01 * progress;
        keycardRef.current.scale.set(scale, scale, scale);

        if (progress < 1) {
          frameId = requestAnimationFrame(animateAppear);
        }
      };
      frameId = requestAnimationFrame(animateAppear);
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (modelObj && currentScene && modelObj.parent === currentScene) {
        currentScene.remove(modelObj);
      }
      keycardRef.current = null;
    };
  }, [isKeycardVisible]);

  // file 모델 생성 및 애니메이션
  useEffect(() => {
    if (!isFileVisible) return;
    let frameId;
    let modelObj = null;
    const currentScene = sceneRef.current;
    const loader = new GLTFLoader();
    loader.load('/resources/models/file.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, -1, 5);
      modelObj.rotateY(Math.PI / 2 * -1);
      currentScene.add(modelObj);
      fileRef.current = modelObj;

      // 시간 기반 애니메이션
      const duration = 1000;
      let startTime = null;

      const animateAppear = (timestamp) => {
        if (!isMounted.current || !fileRef.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scale = 0.03 * progress;
        fileRef.current.scale.set(scale, scale, scale);

        if (progress < 1) {
          frameId = requestAnimationFrame(animateAppear);
        }
      };
      frameId = requestAnimationFrame(animateAppear);
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (modelObj && currentScene && modelObj.parent === currentScene) {
        currentScene.remove(modelObj);
      }
      fileRef.current = null;
    };
  }, [isFileVisible]);

  // 큐브 모델 생성 및 애니메이션
  useEffect(() => {
    if (!isCubeVisible) return;
    let frameId;
    let modelObj = null;
    const currentScene = sceneRef.current;
    const loader = new GLTFLoader();
    loader.load('/resources/models/cube.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, 0, 0);
      currentScene.add(modelObj);
      cubeRef.current = modelObj;

      // 시간 기반 애니메이션
      const duration = 1000;
      let startTime = null;

      const animateAppear = (timestamp) => {
        if (!isMounted.current || !cubeRef.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scale = 0.2 * progress;
        cubeRef.current.scale.set(scale, scale, scale);

        if (progress < 1) {
          frameId = requestAnimationFrame(animateAppear);
        }
      };
      frameId = requestAnimationFrame(animateAppear);
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (modelObj && currentScene && modelObj.parent === currentScene) {
        currentScene.remove(modelObj);
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
    const policyAppearDelay = ANIMATION_DELAY;
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
            setIsPolicyFullyVisible(true);
          }
        };
        frameId = requestAnimationFrame(animateAppear);
      });
    }, policyAppearDelay);

    return () => {
      clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
      setIsPolicyFullyVisible(false);
      // policyRef.current는 클린업에서 일괄 제거
    };
  }, [isAbeAnimating, isKeycardVisible]);

  // 카메라 애니메이션 함수
  const animateCameraTo = (toPosition, toTarget, duration = CAMERA_ANIMATION_DURATION) => {
    if (!cameraRef.current || !controlsRef.current) return;
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
    const cubeClusterCenter = new THREE.Vector3();
    const sphereClusterCenter = new THREE.Vector3();
    isMounted.current = true;
    if (!containerRef.current) return;

    // 기존에 생성된 canvas가 있다면 모두 제거 (중복 방지)
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // 스카이박스 모델 적용
    const skyboxLoader = new GLTFLoader();
    skyboxLoader.load(
      '/resources/models/night_cityview.glb',
      (gltf) => {
        if (!isMounted.current) return;
        const skyboxScene = gltf.scene;
        skyboxScene.scale.set(4, 4, 4);
        skyboxScene.position.set(0, 200, 0);
        sceneRef.current.add(skyboxScene);
      },
      undefined,
      (error) => {
        console.error('Inside galaxy HDRI.glb load error:', error);
      }
    );

    // Scene setup
    sceneRef.current.background = new THREE.Color(0x111111);

    // building.glb 모델을 원점에 추가
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


    // 정적 모델 생성 및 배치
  const staticModels = {
    keycard: null,
    file: null,
    policy: null,
    cube: null,
  };

  // 키카드 모델
  const keycardLoader = new GLTFLoader();
  keycardLoader.load('/resources/models/key_card.glb', (gltf) => {
    if (!isMounted.current) return;
    const model = gltf.scene;
    model.scale.set(0.02, 0.02, 0.02);
    model.position.set(0, -29, 40); // 건물 아래, x = -15
    sceneRef.current.add(model);
    staticModels.keycard = model;

    // 대칭키 레이블
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = '대칭키';
    labelDiv.style.color = '#fff';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.background = 'rgba(0,0,0,0.5)';
    labelDiv.style.padding = '2px 6px';
    labelDiv.style.borderRadius = '4px';
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, -20, 40); // 모델 위쪽
    sceneRef.current.add(label);
  });

  // 파일 모델
  const fileLoader = new GLTFLoader();
  fileLoader.load('/resources/models/file.glb', (gltf) => {
    if (!isMounted.current) return;
    const model = gltf.scene;
    model.scale.set(0.04, 0.04, 0.04);
    model.position.set(0, -30, 60); // x = -5
    model.rotateY(Math.PI / 2 * -1);
    sceneRef.current.add(model);
    staticModels.file = model;

    // MotionV2 레이블
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = '업데이트 파일';
    labelDiv.style.color = '#fff';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.background = 'rgba(0,0,0,0.5)';
    labelDiv.style.padding = '2px 6px';
    labelDiv.style.borderRadius = '4px';
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, -20, 60); // 모델 위쪽
    sceneRef.current.add(label);
  });

  // 정책 모델
  const policyLoader = new GLTFLoader();
  policyLoader.load('/resources/models/policy.glb', (gltf) => {
    if (!isMounted.current) return;
    const model = gltf.scene;
    model.scale.set(20, 20, 20);
    model.position.set(0, -31, 80); // x = 5
    model.rotateY(Math.PI / 2 * -1);
    sceneRef.current.add(model);
    staticModels.policy = model;

    // 정책 레이블
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = '정책';
    labelDiv.style.color = '#fff';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.background = 'rgba(0,0,0,0.5)';
    labelDiv.style.padding = '2px 6px';
    labelDiv.style.borderRadius = '4px';
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, -20, 80); // 모델 위쪽
    sceneRef.current.add(label);
  });

  // 큐브 모델
  const cubeLoader = new GLTFLoader();
  cubeLoader.load('/resources/models/cube.glb', (gltf) => {
    if (!isMounted.current) return;
    const model = gltf.scene;
    model.scale.set(0.25, 0.25, 0.25);
    model.position.set(0, -29, 100); // x = 15
    sceneRef.current.add(model);
    staticModels.cube = model;

    // 암호화 레이블
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = '암호화';
    labelDiv.style.color = '#fff';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.background = 'rgba(0,0,0,0.5)';
    labelDiv.style.padding = '2px 6px';
    labelDiv.style.borderRadius = '4px';
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, -20, 100); // 모델 위쪽
    sceneRef.current.add(label);
  });

      // certificate.glb ECDSA 인증서 추가
    const certLoader = new GLTFLoader();
    certLoader.load('/resources/models/certificate.glb', (certGltf) => {
      if (!isMounted.current) return;
      const certModel = certGltf.scene;
      certModel.scale.set(3, 3, 3);
      certModel.position.set(0, -29, 120); // 오른쪽 옆에 배치
      certModel.rotateY(Math.PI / 2 * -1);
      sceneRef.current.add(certModel);

      // 인증서 레이블
      const certLabelDiv = document.createElement('div');
      certLabelDiv.className = 'label';
      certLabelDiv.textContent = 'SHA3 해시';
      certLabelDiv.style.color = '#fff';
      certLabelDiv.style.fontSize = '14px';
      certLabelDiv.style.fontWeight = 'bold';
      certLabelDiv.style.background = 'rgba(0,0,0,0.5)';
      certLabelDiv.style.padding = '2px 6px';
      certLabelDiv.style.borderRadius = '4px';
      const certLabel = new CSS2DObject(certLabelDiv);
      certLabel.position.set(0, -20, 120); // 인증서 위쪽
      sceneRef.current.add(certLabel);
    });

    // city 모델 추가
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/resources/models/city_test.glb',
      (gltf) => {
        if (!isMounted.current) return;
        const model = gltf.scene;
        model.scale.set(0.001, 0.001, 0.001);
        const whiteColor = new THREE.Color(0x888888);
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

    // Renderer에서 그림자 활성화
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // 바닥(plane) 추가: 그림자가 투영될 곳
    const textureLoader = new THREE.TextureLoader();
    const groundTexture = textureLoader.load('/resources/textures/night_city_topview.jpg');
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(15, 15);

    const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
    const groundMaterial = new THREE.MeshPhongMaterial({
      map: groundTexture,
      color: 0x555555,
      side: THREE.DoubleSide,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -60;
    groundMesh.receiveShadow = true;
    sceneRef.current.add(groundMesh);

    // 노란색 작은 구 추가: 도시 야경 효과
    const cityGlows = [];
    const numGlows = 1000;
    for (let i = 0; i < numGlows; i++) {
      const radius = Math.random() * 1;
      const glowGeometry = new THREE.SphereGeometry(radius, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(
        Math.random() * 2000 - 500,
        -59 + Math.random() * 2,
        Math.random() * 2000 - 500
      );
      sceneRef.current.add(glow);
      cityGlows.push({ mesh: glow, geometry: glowGeometry, material: glowMaterial });
    }

    // 큐브 클러스터
    const cubeClusterGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cubeClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let cubeClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 20 + 200;
      const y = Math.random() * 20 + 100;
      const z = Math.random() * 20 - 10;
      const cubePosition = new THREE.Vector3(x, y, z);
      cubeClusterTotal.add(cubePosition);
      const cube = new THREE.Mesh(cubeClusterGeometry, cubeClusterMaterial);
      cube.position.copy(cubePosition);
      sceneRef.current.add(cube);
      cubeClusterRef.current.push(cube);
    }
    cubeClusterCenter.copy(cubeClusterTotal).divideScalar(cubeClusterRef.current.length);

    // 구 클러스터
    const sphereClusterGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let sphereClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 20 + 200;
      const y = Math.random() * 20 + 100;
      const z = Math.random() * 20 + 100;
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

    // === CSS2DRenderer 추가 ===
    labelRendererRef.current = new CSS2DRenderer();
    labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    labelRendererRef.current.domElement.style.position = 'absolute';
    labelRendererRef.current.domElement.style.top = '0px';
    labelRendererRef.current.domElement.style.pointerEvents = 'none';
    containerRef.current.appendChild(labelRendererRef.current.domElement);

    // === 레이블 생성 ===
    // 큐브 클러스터 레이블
    const cubeLabelDiv = document.createElement('div');
    cubeLabelDiv.className = 'label';
    cubeLabelDiv.textContent = '블록체인 네트워크';
    cubeLabelDiv.style.color = '#fff';
    cubeLabelDiv.style.fontWeight = 'bold';
    cubeLabelDiv.style.background = 'rgba(0,0,0,0.5)';
    cubeLabelDiv.style.padding = '4px 10px';
    cubeLabelDiv.style.borderRadius = '8px';
    const cubeLabel = new CSS2DObject(cubeLabelDiv);
    cubeLabel.position.set(220, 160, -10);
    sceneRef.current.add(cubeLabel);

    // 구 클러스터 레이블
    const sphereLabelDiv = document.createElement('div');
    sphereLabelDiv.className = 'label';
    sphereLabelDiv.textContent = 'IPFS 저장소';
    sphereLabelDiv.style.color = '#fff';
    sphereLabelDiv.style.fontWeight = 'bold';
    sphereLabelDiv.style.background = 'rgba(0,0,0,0.5)';
    sphereLabelDiv.style.padding = '4px 10px';
    sphereLabelDiv.style.borderRadius = '8px';
    const sphereLabel = new CSS2DObject(sphereLabelDiv);
    sphereLabel.position.set(220, 160, 120);
    sceneRef.current.add(sphereLabel);

    // === 회색 직육면체(박스) 원점에 추가 ===
    const grayBoxGeometry = new THREE.BoxGeometry(2, 6, 8);
    const grayBoxMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const grayBox = new THREE.Mesh(grayBoxGeometry, grayBoxMaterial);
    grayBox.position.set(-5, -8, 0); // y=1로 바닥 위에 살짝 올림
    sceneRef.current.add(grayBox);

    // === 현대자동차 로고 모델 추가 ===
    const hyundaiLoader = new GLTFLoader();
    hyundaiLoader.load('/resources/models/hyundai_cars_logo.glb', (gltf) => {
      if (!isMounted.current) return;
      const hyundaiLogo = gltf.scene;
      hyundaiLogo.scale.set(0.1, 0.1, 0.1); // 적절한 크기로 조정
      hyundaiLogo.position.set(-6.8, -8, 0); // 박스 위에 올리기 (y=-4)
      hyundaiLogo.rotateY(Math.PI / 2 * -1); // 정면을 바라보게
      sceneRef.current.add(hyundaiLogo);
    });

    // === 현대자동차 로고 모델 추가 ===
    const NVision74Loader = new GLTFLoader();
    NVision74Loader.load('/resources/models/hyundai_cars_logo.glb', (gltf) => {
      if (!isMounted.current) return;
      const hyundaiLogo = gltf.scene;
      hyundaiLogo.scale.set(0.1, 0.1, 0.1); // 적절한 크기로 조정
      hyundaiLogo.position.set(-6.8, -8, 0); // 박스 위에 올리기 (y=-4)
      hyundaiLogo.rotateY(Math.PI / 2 * -1); // 정면을 바라보게
      sceneRef.current.add(hyundaiLogo);
    });

    // 애니메이션 루프
    const animate = () => {
      if (!isMounted.current) return;
      animationFrameId.current = requestAnimationFrame(animate);
      controlsRef.current?.update();
      rendererRef.current?.render(sceneRef.current, cameraRef.current);
      labelRendererRef.current?.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!isMounted.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const currentContainer = containerRef.current;
    const currentScene = sceneRef.current;
    // 클린업
    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
      if (cameraAnimationRef.current) cancelAnimationFrame(cameraAnimationRef.current);
      controlsRef.current?.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode === currentContainer) {
          currentContainer.removeChild(rendererRef.current.domElement);
        }
      }
      if (labelRendererRef.current) {
        if (labelRendererRef.current.domElement.parentNode === currentContainer) {
          currentContainer.removeChild(labelRendererRef.current.domElement);
        }
        labelRendererRef.current = null;
      }
      currentScene.clear();
    };
  }, []);

  // 카메라 초기 위치로 이동
  const handleCameraReset = () => {
    animateCameraTo(initialCameraPosition, initialTarget);
  };

  // 파일/키카드 모델을 원점으로 이동시키는 애니메이션
  useEffect(() => {
    if (!isMovingToOrigin) return;
    let frameId;
    const moveDuration = 1000;
    let startTime = null;

    const keycardStart = keycardRef.current ? keycardRef.current.position.clone() : null;
    const fileStart = fileRef.current ? fileRef.current.position.clone() : null;
    const keycardTarget = new THREE.Vector3(-2, 0, 0);
    const fileTarget = new THREE.Vector3(0, -2, 0);

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
    const moveDuration = 2500;
    let startTime = null;

    // 대칭키(키카드)는 클러스터로 이동하지 않고, file과 cube만 이동
    if (keycardRef.current && sceneRef.current) {
      sceneRef.current.remove(keycardRef.current);
      keycardRef.current = null;
    }
    const models = [fileRef.current, cubeRef.current].filter(Boolean);
    if (models.length === 0) return;

    const groupStartCenter = new THREE.Vector3();
    models.forEach(m => groupStartCenter.add(m.position));
    groupStartCenter.divideScalar(models.length);

    const relativePositions = models.map(m => m.position.clone().sub(groupStartCenter));

    const clusterTarget = new THREE.Vector3(
      Math.random() * 20 + 200,
      Math.random() * 20 + 100,
      Math.random() * 20 + 100
    );

    const cameraStart = cameraRef.current ? cameraRef.current.position.clone() : null;
    const cameraTarget = clusterTarget.clone().add(new THREE.Vector3(30, 10, 30));
    const controlsStart = controlsRef.current ? controlsRef.current.target.clone() : null;
    const controlsTarget = clusterTarget.clone();

    const animateMove = (timestamp) => {
      if (!isMounted.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / moveDuration, 1);

      const currentCenter = groupStartCenter.clone().lerp(clusterTarget, t);
      models.forEach((m, i) => {
        m.position.copy(currentCenter.clone().add(relativePositions[i]));
      });

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
        setIsAnimating(false);
        setIsAbeAnimating(false);

        setShowUploadComplete(true);
        setUploadCompleteOpacity(0);

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
    setAbeStep(0); // 카메라 이동부터 시작

    setIsKeycardVisible(false);
    setIsFileVisible(false);
    setIsMovingToOrigin(false);
    setIsCubeVisible(false);
    setIsClusterMoving(false);
    setIsAbeMovingToOrigin(false);
    setIsPolicyFullyVisible(false);
    setIsAbeGroupMoving(false);
    setIsAbeCertificateEmerging(false);

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
    if (certificateRef.current && sceneRef.current) {
      sceneRef.current.remove(certificateRef.current);
      certificateRef.current = null;
    }

    // 카메라 이동 먼저
    const zoomPosition = { x: -20, y: 0, z: -10 };
    const zoomTarget = { x: 0, y: 0, z: 0 };
    animateCameraTo(zoomPosition, zoomTarget, 800);
    setTimeout(() => setAbeStep(1), 800); // 카메라 이동 후 다음 단계
  };

  // 단계별 애니메이션 순차 실행
  useEffect(() => {
    if (!isAbeAnimating) return;
    if (abeStep === 1) {
      // 키카드, 정책 등장 및 위치 지정
      const positions = [
        { x: 0, y: 0, z: -1.5 }, // keycard
        { x: 0, y: -2, z: 0 },   // policy
      ];
      setIsKeycardVisible(true);
      setKeycardAppearProgress(0);
      if (keycardRef.current) keycardRef.current.position.set(positions[0].x, positions[0].y, positions[0].z);
      if (policyRef.current) policyRef.current.position.set(positions[1].x, positions[1].y, positions[1].z);
      const t = setTimeout(() => setAbeStep(2), ANIMATION_DELAY);
      return () => clearTimeout(t);
    }
    if (abeStep === 2) {
      setIsPolicyFullyVisible(true);
      const t = setTimeout(() => setAbeStep(3), 1000);
      return () => clearTimeout(t);
    }
    if (abeStep === 3) {
      // 키카드, 정책 한 곳으로 모으기
      let frameId;
      const moveDuration = 1000;
      let startTime = null;
      const xTargets = [-1.5, 1.5]; // keycard, policy x 위치
      const models = [keycardRef.current, policyRef.current].filter(Boolean);
      if (models.length !== 2) return;
      const startPositions = models.map(m => m.position.clone());
      const targetPositions = [
        new THREE.Vector3(xTargets[0], 0, 0),
        new THREE.Vector3(xTargets[1], -2, 0),
      ];
      const animateMove = (timestamp) => {
        if (!isMounted.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / moveDuration, 1);
        models.forEach((m, i) => {
          m.position.lerpVectors(startPositions[i], targetPositions[i], t);
        });
        if (t < 1) {
          frameId = requestAnimationFrame(animateMove);
        } else {
          setAbeStep(4); // 큐브 생성
        }
      };
      frameId = requestAnimationFrame(animateMove);
      return () => { if (frameId) cancelAnimationFrame(frameId); };
    }
    if (abeStep === 4) {
      setIsCubeVisible(true);
      const t = setTimeout(() => setAbeStep(5), 1000);
      return () => clearTimeout(t);
    }
    if (abeStep === 5) {
      setIsAbeCertificateEmerging(true);
      const t = setTimeout(() => setAbeStep(6), 1500);
      return () => clearTimeout(t);
    }
    if (abeStep === 6) {
      // 네 모델(키카드, 정책, 인증서, 큐브) 클러스터로 이동
      let frameId;
      const moveDuration = 2500;
      let startTime = null;
      const models = [keycardRef.current, policyRef.current, certificateRef.current, cubeRef.current].filter(Boolean);
      if (models.length === 0) return;
      const groupStartCenter = new THREE.Vector3();
      models.forEach(m => groupStartCenter.add(m.position));
      groupStartCenter.divideScalar(models.length);
      const relativePositions = models.map(m => m.position.clone().sub(groupStartCenter));
      const clusterTarget = new THREE.Vector3(
        Math.random() * 20 + 200,
        Math.random() * 20 + 100,
        Math.random() * 20 - 10
      );
      const cameraStart = cameraRef.current ? cameraRef.current.position.clone() : null;
      const cameraTarget = clusterTarget.clone().add(new THREE.Vector3(30, 10, 30));
      const controlsStart = controlsRef.current ? controlsRef.current.target.clone() : null;
      const controlsTarget = clusterTarget.clone();
      const animateMove = (timestamp) => {
        if (!isMounted.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / moveDuration, 1);
        const currentCenter = groupStartCenter.clone().lerp(clusterTarget, t);
        models.forEach((m, i) => {
          m.position.copy(currentCenter.clone().add(relativePositions[i]));
        });
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
          setIsAbeAnimating(false);
          setShowAbeUploadComplete(true);
          setAbeUploadCompleteOpacity(0);
          let fadeInStart = null;
          const fadeInDuration = 500;
          const fadeOutDuration = 500;
          const showDuration = 1000;
          function fadeIn(ts) {
            if (!fadeInStart) fadeInStart = ts;
            const elapsed = ts - fadeInStart;
            const t = Math.min(elapsed / fadeInDuration, 1);
            setAbeUploadCompleteOpacity(t);
            if (t < 1) {
              requestAnimationFrame(fadeIn);
            } else {
              setTimeout(() => {
                let fadeOutStart = null;
                function fadeOut(ts2) {
                  if (!fadeOutStart) fadeOutStart = ts2;
                  const elapsed2 = ts2 - fadeOutStart;
                  const t2 = Math.min(elapsed2 / fadeOutDuration, 1);
                  setAbeUploadCompleteOpacity(1 - t2);
                  if (t2 < 1) {
                    requestAnimationFrame(fadeOut);
                  } else {
                    setShowAbeUploadComplete(false);
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
      return () => { if (frameId) cancelAnimationFrame(frameId); };
    }
  }, [abeStep, isAbeAnimating]);

  // policy 모델 생성 및 애니메이션 (isPolicyFullyVisible는 위에서 set)
  useEffect(() => {
    if (!isPolicyFullyVisible) return;
    let frameId;
    let modelObj = null;
    const currentScene = sceneRef.current;
    const loader = new GLTFLoader();
    loader.load('/resources/models/policy.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, -2, 4);
      modelObj.rotateY(Math.PI / 2 * -1);
      currentScene.add(modelObj);
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
        }
      };
      frameId = requestAnimationFrame(animateAppear);
    });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (modelObj && currentScene && modelObj.parent === currentScene) {
        currentScene.remove(modelObj);
      }
      policyRef.current = null;
    };
  }, [isPolicyFullyVisible]);

  // 인증서 모델 애니메이션 (CP-ABE용)
  useEffect(() => {
    if (!isAbeCertificateEmerging) return;
    let frameId;
    let modelObj = null;
    const currentScene = sceneRef.current;
    const loader = new GLTFLoader();
    loader.load('/resources/models/certificate.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(-4, 0, 0);
      modelObj.rotateY(Math.PI / 2 * -1);
      currentScene.add(modelObj);
      certificateRef.current = modelObj;
      const duration = 1000;
      let startTime = null;
      const startScale = 0;
      const endScale = 2;
      const animateEmergence = (timestamp) => {
        if (!isMounted.current || !certificateRef.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const scale = startScale + (endScale - startScale) * t;
        certificateRef.current.scale.set(scale, scale, scale);
        if (t < 1) {
          frameId = requestAnimationFrame(animateEmergence);
        }
      };
      frameId = requestAnimationFrame(animateEmergence);
    });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (certificateRef.current && currentScene) {
        currentScene.remove(certificateRef.current);
      }
      certificateRef.current = null;
    };
  }, [isAbeCertificateEmerging]);

  // 인증서 모델 생성 및 애니메이션 (업데이트 파일 업로드용)
  useEffect(() => {
    if (!isCertificateVisible) return;
    let frameId;
    let modelObj = null;
    const currentScene = sceneRef.current;
    const loader = new GLTFLoader();
    loader.load('/resources/models/certificate.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, 0, 0);
      modelObj.rotateY(Math.PI / 2 * -1);
      currentScene.add(modelObj);
      certificateRef.current = modelObj;
      const duration = 2000; // 3초 등장
      let startTime = null;
      const startScale = 0;
      const endScale = 2;
      const animateEmergence = (timestamp) => {
        if (!isMounted.current || !certificateRef.current) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const scale = startScale + (endScale - startScale) * t;
        certificateRef.current.scale.set(scale, scale, scale);
        if (t < 1) {
          frameId = requestAnimationFrame(animateEmergence);
        }
      };
      frameId = requestAnimationFrame(animateEmergence);
    });
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (certificateRef.current && currentScene) {
        currentScene.remove(certificateRef.current);
      }
      certificateRef.current = null;
    };
  }, [isCertificateVisible]);

  // 인증서 이동 애니메이션 (업데이트 파일 업로드용)
  useEffect(() => {
    if (!isCertificateMoving) return;
    let frameId;
    const moveDuration = 2000; // 2초간 z축 이동
    let startTime = null;
    const start = certificateRef.current ? certificateRef.current.position.clone() : null;
    // 목적지는 (0,0,7)
    const target = new THREE.Vector3(-4, 0, 8);
    const animateMove = (timestamp) => {
      if (!isMounted.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / moveDuration, 1);
      if (certificateRef.current && start) {
        certificateRef.current.position.lerpVectors(start, target, t);
      }
      if (t < 1) {
        frameId = requestAnimationFrame(animateMove);
      } else {
        // 이동 후 2초 대기 후 setIsClusterMoving(true)에서 제거됨
      }
    };
    frameId = requestAnimationFrame(animateMove);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isCertificateMoving]);

  // 반투명 구 추가
  useEffect(() => {
    const currentScene = sceneRef.current;
    if (!currentScene) return;

    // 첫 번째 구: (220, 120, 110)
    const sphere1Geometry = new THREE.SphereGeometry(25, 48, 48);
    const sphere1Material = new THREE.MeshBasicMaterial({
      color: 0x00bfff,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
    sphere1.position.set(210, 110, 0);
    currentScene.add(sphere1);

    // 두 번째 구: (220, 120, 0)
    const sphere2Geometry = new THREE.SphereGeometry(25, 48, 48);
    const sphere2Material = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    sphere2.position.set(210, 110, 110);
    currentScene.add(sphere2);

    return () => {
      currentScene.remove(sphere1);
      currentScene.remove(sphere2);
      sphere1.geometry.dispose();
      sphere1.material.dispose();
      sphere2.geometry.dispose();
      sphere2.material.dispose();
    };
  }, []);

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
      {/* CP-ABE 업로드 완료 메시지 */}
      {showAbeUploadComplete && (
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
            zIndex: 21,
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
              opacity: abeUploadCompleteOpacity,
              transition: 'opacity 0.2s',
            }}
          >
            CP-ABE 암호문 블록체인에 업로드 완료!
          </div>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 20,
          bottom: 20,
          zIndex: 10,
          display: 'flex',
          gap: 10,
        }}
      >
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
      {/* 오른쪽 아래 나가기 버튼 */}
      <button
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          zIndex: 100,
          padding: '14px 28px',
          fontSize: '1.1rem',
          borderRadius: '10px',
          border: 'none',
          background: '#ff5252',
          color: '#fff',
          fontWeight: 'bold',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          cursor: 'pointer',
        }}
        onClick={handleExit}
      >
        나가기
      </button>
    </div>
  );
};

export default EncryptionVisualizationScene;