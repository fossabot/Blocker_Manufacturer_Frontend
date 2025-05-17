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
  const [isKeycardVisible, setIsKeycardVisible] = useState(false);
  const [isFileVisible, setIsFileVisible] = useState(false);

  // keycard 애니메이션용 상태
  const [keycardAppearProgress, setKeycardAppearProgress] = useState(0);

  // keycard 생성 및 애니메이션 함수
  const handleUploadClick = () => {
    if (keycardRef.current || fileRef.current) return; // 중복 방지

    // 1. 카메라를 줌인할 위치/타겟 지정 (예시: 원점 근처로 이동)
    const zoomPosition = { x: -20, y: 0, z: -10 };
    const zoomTarget = { x: 0, y: 0, z: 0 };

    // 2. 카메라 애니메이션 후 키카드 생성
    animateCameraTo(zoomPosition, zoomTarget, 800);

    // 3. 카메라 애니메이션이 끝난 뒤 키카드 생성 (딜레이)
    setTimeout(() => {
      setIsKeycardVisible(true);
      setKeycardAppearProgress(0);

      // 4. 키카드가 다 나타난 뒤 file 생성 (추가 딜레이)
      setTimeout(() => {
        setIsFileVisible(true);
      }, 1000 + 300); // 키카드 애니메이션(1초) + 0.3초 추가 딜레이
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

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
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
            cursor: isKeycardVisible ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            opacity: isKeycardVisible ? 0.5 : 1,
          }}
          onClick={handleUploadClick}
          disabled={isKeycardVisible}
        >
          업데이트 파일 업로드
        </button>
      </div>
    </div>
  );
};

export default EncryptionVisualizationScene;