import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { useNavigate } from 'react-router-dom';

// 저장해둔 초기 카메라 위치
const initialCameraPosition = { x: -70, y: -20, z: -35 };
const initialTarget = { x: 100, y: 30, z: 50 };

const CAMERA_ANIMATION_DURATION = 1000; // ms
const ANIMATION_DELAY = 3000; // ms, 모든 단계 사이 딜레이

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
  const centerPosition = new THREE.Vector3(0, 0, 0);
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUploadComplete, setShowUploadComplete] = useState(false);
  const [uploadCompleteOpacity, setUploadCompleteOpacity] = useState(0);
  const [isAbeAnimating, setIsAbeAnimating] = useState(false);
  const [isAbeMovingToOrigin, setIsAbeMovingToOrigin] = useState(false);
  const [isAbeGroupMoving, setIsAbeGroupMoving] = useState(false);
  const labelRendererRef = useRef(null);
  const cubeRef = useRef(null);
  const navigate = useNavigate();

  // keycard 애니메이션용 상태
  const [keycardAppearProgress, setKeycardAppearProgress] = useState(0);

  // policy 모델 등장 완료 후에만 이동 애니메이션을 시작하도록 상태 추가
  const [isPolicyFullyVisible, setIsPolicyFullyVisible] = useState(false);

  // CP-ABE 업로드 완료 메시지 상태 추가
  const [showAbeUploadComplete, setShowAbeUploadComplete] = useState(false);
  const [abeUploadCompleteOpacity, setAbeUploadCompleteOpacity] = useState(0);

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

            setTimeout(() => {
              setIsClusterMoving(true);
            }, ANIMATION_DELAY);
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
    const loader = new GLTFLoader();
    loader.load('/resources/models/key_card.glb', (gltf) => {
      if (!isMounted.current) return;
      modelObj = gltf.scene;
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, 0, -5);
      sceneRef.current.add(modelObj);
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
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, -1, 5);
      modelObj.rotateY(Math.PI / 2 * -1);
      sceneRef.current.add(modelObj);
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
      modelObj.scale.set(0, 0, 0);
      modelObj.position.set(0, 0, 0);
      sceneRef.current.add(modelObj);
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
    const sphereClusterGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let sphereClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) {
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
    cubeLabel.position.set(220, 170, 120);
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
    sphereLabel.position.set(220, 170, -10);
    sceneRef.current.add(sphereLabel);

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
      if (labelRendererRef.current) {
        if (labelRendererRef.current.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(labelRendererRef.current.domElement);
        }
        labelRendererRef.current = null;
      }
      sceneRef.current.clear();
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
    const fileTarget = new THREE.Vector3(2, -2, 0);

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

    const models = [keycardRef.current, fileRef.current, cubeRef.current].filter(Boolean);
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

    setIsKeycardVisible(false);
    setIsFileVisible(false);
    setIsMovingToOrigin(false);
    setIsCubeVisible(false);
    setIsClusterMoving(false);
    setIsAbeMovingToOrigin(false);
    setIsPolicyFullyVisible(false);

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

    const zoomPosition = { x: -20, y: 0, z: -10 };
    const zoomTarget = { x: 0, y: 0, z: 0 };
    animateCameraTo(zoomPosition, zoomTarget, 800);

    setTimeout(() => {
      setIsKeycardVisible(true);
      setKeycardAppearProgress(0);
    }, ANIMATION_DELAY);
  };

  // policy가 완전히 나타난 후에만 이동 애니메이션 시작
  useEffect(() => {
    if (!isPolicyFullyVisible) return;
    const timeout = setTimeout(() => {
      setIsAbeMovingToOrigin(true);
    }, ANIMATION_DELAY);
    return () => clearTimeout(timeout);
  }, [isPolicyFullyVisible]);

  // CP-ABE 키카드+policy 원점 이동 애니메이션
  useEffect(() => {
    if (!isAbeMovingToOrigin) return;
    let frameId;
    const moveDuration = 1000;
    let startTime = null;

    const keycardStart = keycardRef.current ? keycardRef.current.position.clone() : null;
    const policyStart = policyRef.current ? policyRef.current.position.clone() : null;
    const keycardTarget = new THREE.Vector3(-2, 0, 0);
    const policyTarget = new THREE.Vector3(2, -2, 0);

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
      } else {
        setTimeout(() => {
          setIsCubeVisible(true);
          setTimeout(() => {
            setIsAbeGroupMoving(true);
          }, ANIMATION_DELAY);
        }, ANIMATION_DELAY);
      }
    };
    frameId = requestAnimationFrame(animateMove);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isAbeMovingToOrigin]);

  // CP-ABE 키카드+policy+큐브를 하나의 그룹처럼 큐브 클러스터 쪽으로 이동시키는 애니메이션
  useEffect(() => {
    if (!isAbeGroupMoving) return;
    let frameId;
    const moveDuration = 2500;
    let startTime = null;

    const clusterTarget = new THREE.Vector3(
      Math.random() * 20 + 200,
      Math.random() * 20 + 100,
      Math.random() * 20 + 100
    );

    const models = [keycardRef.current, policyRef.current, cubeRef.current].filter(Boolean);
    if (models.length === 0) return;

    const groupStartCenter = new THREE.Vector3();
    models.forEach(m => groupStartCenter.add(m.position));
    groupStartCenter.divideScalar(models.length);

    const relativePositions = models.map(m => m.position.clone().sub(groupStartCenter));

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
        setIsAbeGroupMoving(false);
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

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isAbeGroupMoving]);

  // 반투명 구 추가
  useEffect(() => {
    if (!sceneRef.current) return;

    // 첫 번째 구: (220, 120, 110)
    const sphere1Geometry = new THREE.SphereGeometry(25, 48, 48);
    const sphere1Material = new THREE.MeshBasicMaterial({
      color: 0x00bfff,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
    sphere1.position.set(210, 110, 110);
    sceneRef.current.add(sphere1);

    // 두 번째 구: (220, 120, 0)
    const sphere2Geometry = new THREE.SphereGeometry(25, 48, 48);
    const sphere2Material = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    sphere2.position.set(210, 110, 0);
    sceneRef.current.add(sphere2);

    return () => {
      sceneRef.current.remove(sphere1);
      sceneRef.current.remove(sphere2);
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
        onClick={() => navigate('/complete')}
      >
        나가기
      </button>
    </div>
  );
};

export default EncryptionVisualizationScene;