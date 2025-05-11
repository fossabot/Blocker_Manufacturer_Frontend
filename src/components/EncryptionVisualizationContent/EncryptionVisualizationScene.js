import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // GLTFLoader 임포트

// 저장해둔 초기 카메라 위치
const initialCameraPosition = { x: 82.12719941938396, y: 38.76360863760963, z: -52.008197438481346 };

const EncryptionVisualizationScene = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera());
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const isMounted = useRef(true);
  const animationFrameId = useRef(null);

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

    // 큐브 클러스터 생성 (모델에서 왼쪽으로 멀리, 더 높게)
    const cubeClusterGeometry = new THREE.BoxGeometry(5, 5, 5); // 큐브 크기
    const cubeClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색
    for (let i = 0; i < 20; i++) {
      const cube = new THREE.Mesh(cubeClusterGeometry, cubeClusterMaterial);
      cube.position.set(
        Math.random() * 20 + 200, // x: -40 ~ -20 (모델보다 왼쪽으로)
        Math.random() * 20 + 40, // y: 20 ~ 40 (더 높게)
        Math.random() * 20 + 100 // z: -10 ~ 10
      );
      sceneRef.current.add(cube);
    }

    // 구 클러스터 생성 (모델에서 오른쪽으로 멀리, 더 높게)
    const sphereClusterGeometry = new THREE.SphereGeometry(3, 32, 32); // 구 크기
    const sphereClusterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 흰색
    for (let i = 0; i < 20; i++) {
      const sphere = new THREE.Mesh(sphereClusterGeometry, sphereClusterMaterial);
      sphere.position.set(
        Math.random() * 20 + 200, // x: 60 ~ 80 (모델보다 오른쪽으로)
        Math.random() * 20 + 40, // y: 20 ~ 40 (더 높게)
        Math.random() * 20 - 10 // z: -10 ~ 10
      );
      sceneRef.current.add(sphere);
    }

    // 애니메이션 루프 (GLTF에 애니메이션이 있다면 여기서 처리)
    const animate = () => {
      if (!isMounted.current) return;
      animationFrameId.current = requestAnimationFrame(animate);
      controlsRef.current?.update();
      currentRenderer?.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!isMounted.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      currentRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 클린업
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