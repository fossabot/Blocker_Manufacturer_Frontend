import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // GLTFLoader 임포트

// 저장해둔 초기 카메라 위치
const initialCameraPosition = { x: 82.12719941938396, y: 38.76360863760963, z: -52.008197438481346 };

const NUM_SIGNALS = 20; // 생성할 전기 신호 개수 (큐브/구 각각 10개)
const SIGNAL_SPEED = 1;
const SIGNAL_SIZE = 0.7;
const SIGNAL_COLOR = 0xffff00;
const SIGNAL_EMISSIVE = 0xffff00;

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

  useEffect(() => {
    isMounted.current = true;

    // 초기화
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current.background = new THREE.Color(0x111111); // 짙은 회색

    // Renderer 설정
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    const currentRenderer = rendererRef.current;
    currentRenderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(currentRenderer.domElement);

    // 카메라 및 컨트롤 설정
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    // 저장된 위치로 카메라 초기화
    cameraRef.current.position.set(
      initialCameraPosition.x,
      initialCameraPosition.y,
      initialCameraPosition.z
    );

    controlsRef.current = new OrbitControls(cameraRef.current, currentRenderer.domElement);
    controlsRef.current.enableDamping = true;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 100, 0);
    sceneRef.current.add(directionalLight);

    // GLTF 로더
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/resources/models/city_test.glb', // GLB 파일 경로
      (gltf) => {
        if (!isMounted.current) return;

        console.log('Loaded GLB Object:', gltf);

        const model = gltf.scene; // 로드된 GLTF 씬
        model.scale.set(0.001, 0.001, 0.001); // 필요에 따라 스케일 조정

        // 모든 메쉬의 재질 색상을 하얀색으로 변경
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

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        cameraRef.current.position.copy(center).add(new THREE.Vector3(0, 50, 100));
        controlsRef.current.target.copy(center);
        cameraRef.current.lookAt(center);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('GLTF load error:', error);
      }
    );

    // 큐브 클러스터 생성 (모델에서 왼쪽으로 멀리, 더 높게 - 위치 고정!)
    const cubeClusterGeometry = new THREE.BoxGeometry(5, 5, 5); // 큐브 크기
    const cubeClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색
    let cubeClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) { // 10개 큐브
      const x = Math.random() * 20 + 200;
      const y = Math.random() * 20 + 40;
      const z = Math.random() * 20 + 100;
      const cubePosition = new THREE.Vector3(x, y, z);
      cubeClusterTotal.add(cubePosition);
      const cube = new THREE.Mesh(cubeClusterGeometry, cubeClusterMaterial);
      cube.position.copy(cubePosition);
      sceneRef.current.add(cube);
      cubeClusterRef.current.push(cube);
    }
    cubeClusterCenter.copy(cubeClusterTotal).divideScalar(cubeClusterRef.current.length);

    // 구 클러스터 생성 (모델에서 오른쪽으로 멀리, 더 높게 - 위치 고정!!)
    const sphereClusterGeometry = new THREE.SphereGeometry(3, 32, 32); // 구 크기
    const sphereClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색
    let sphereClusterTotal = new THREE.Vector3();
    for (let i = 0; i < 10; i++) { // 10개 구
      const x = Math.random() * 20 + 200;
      const y = Math.random() * 20 + 40;
      const z = Math.random() * 20 - 10;
      const spherePosition = new THREE.Vector3(x, y, z);
      sphereClusterTotal.add(spherePosition);
      const sphere = new THREE.Mesh(sphereClusterGeometry, sphereClusterMaterial);
      sphere.position.copy(spherePosition);
      sceneRef.current.add(sphere);
      sphereClusterRef.current.push(sphere);
    }
    sphereClusterCenter.copy(sphereClusterTotal).divideScalar(sphereClusterRef.current.length);

    // 전기 신호 생성 및 초기화 (큐브/구 각각 10개)
    const signalGeometry = new THREE.SphereGeometry(SIGNAL_SIZE, 16, 16);
    const signalMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 });
    for (let i = 0; i < NUM_SIGNALS; i++) {
      const signal = new THREE.Mesh(signalGeometry, signalMaterial);
      signal.position.copy(centerPosition);
      sceneRef.current.add(signal);
      signalRefs.current.push({
        mesh: signal,
        target: null,
        state: 'moving_to_center_cluster', // moving_to_center, moving_to_cluster, moving_to_center_again
        clusterType: i < NUM_SIGNALS / 2 ? 'cube' : 'sphere', // 처음 절반은 큐브, 나머지는 구
      });
    }

    // 애니메이션 루프 (클러스터 위치 변경 없음!!!)
    const animate = () => {
      if (!isMounted.current) return;
      animationFrameId.current = requestAnimationFrame(animate);
      controlsRef.current?.update();

      // 전기 신호 애니메이션
      signalRefs.current.forEach((signalInfo) => {
        const { mesh, target, state, clusterType } = signalInfo;
        const currentPosition = new THREE.Vector3().copy(mesh.position);
        let targetPosition = new THREE.Vector3();

        if (state === 'moving_to_center_cluster') {
          targetPosition = clusterType === 'cube' ? cubeClusterCenter : sphereClusterCenter;
          const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition).normalize();
          mesh.position.add(direction.multiplyScalar(SIGNAL_SPEED));
          if (currentPosition.distanceTo(targetPosition) < SIGNAL_SPEED * 1.5) {
            signalInfo.state = 'moving_to_center_again';
            signalInfo.target = centerPosition;
          }
        } else if (state === 'moving_to_center_again') {
          if (target) {
            const direction = new THREE.Vector3().subVectors(target, currentPosition).normalize();
            mesh.position.add(direction.multiplyScalar(SIGNAL_SPEED));
            if (currentPosition.distanceTo(target) < SIGNAL_SPEED * 1.5) {
              signalInfo.state = 'moving_to_center_cluster';
              signalInfo.target = null;
              mesh.position.copy(centerPosition);
            }
          } else {
            signalInfo.target = centerPosition;
            signalInfo.state = 'moving_to_center_cluster';
            mesh.position.copy(centerPosition);
          }
        }
      });

      currentRenderer?.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // 리사이즈 핸들러 (위치 변경 없음!!!)
    const handleResize = () => {
      if (!isMounted.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      currentRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 클린업 (위치 변경 없음!!!)
    return () => {
      isMounted.current = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);

      controlsRef.current?.dispose();
      if (currentRenderer) {
        currentRenderer.dispose();
        if (currentRenderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(currentRenderer.domElement);
        }
      }
      sceneRef.current.clear();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default EncryptionVisualizationScene;