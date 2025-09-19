# Blocker Manufacturer Frontend

## 📂 프로젝트 구조

```
Blocker_Manufacturer_Frontend/
│
├── public/                         # 정적 파일 및 리소스
│   ├── index.html                  # 메인 HTML 파일
│   ├── manifest.json               # 웹 앱 매니페스트
│   ├── robots.txt                  # 크롤러 접근 제한 파일
│   ├── favicon.ico                 # 파비콘
│   ├── block.ico                   # 추가 아이콘
│   ├── logo192.png                 # 앱 아이콘
│   ├── logo512.png                 # 앱 아이콘
│   └── resources/                  # 3D 모델 및 텍스처 리소스
│       ├── models/                 # GLB/FBX 등 3D 모델 파일
│       └── textures/               # 이미지 텍스처 파일
│
├── src/                            # 소스 코드
│   ├── api/                        # API 서비스 모듈
│   │   ├── api.js                  # API 유틸리티
│   │   └── uploadService.js        # 파일 업로드 API 서비스
│   ├── assets/                     # 이미지 등 정적 에셋
│   │   └── N74.jpg
│   ├── components/                 # 재사용 가능한 UI 컴포넌트
│   │   ├── Background/             # 배경 관련 컴포넌트
│   │   ├── DeployUpdateContent/    # 배포/업데이트 관련 컴포넌트
│   │   ├── EncryptionVisualizationContent/ # 암호화 시각화 컴포넌트
│   │   ├── FooterContent/          # 푸터 컴포넌트
│   │   ├── HeaderContent/          # 헤더 컴포넌트
│   │   ├── MainContent/            # 메인 콘텐츠 컴포넌트
│   │   ├── MonitoringConent/       # 업데이트 모니터링 컴포넌트
│   │   └── Navigation/             # 네비게이션 바 컴포넌트
│   ├── pages/                      # 페이지 단위 컴포넌트
│   │   ├── AccessPolicy.js         # 접근 정책 페이지
│   │   ├── DeploymentComplete.js   # 배포 완료 페이지
│   │   ├── DeploymentSummary.js    # 배포 요약 페이지
│   │   ├── FileUpload.js           # 파일 업로드 페이지
│   │   ├── Home.js                 # 홈 페이지
│   │   ├── UpdateMonitoring.js     # 업데이트 모니터링 페이지
│   │   └── UpdateSetting.js        # 업데이트 설정 페이지
│   ├── App.js                      # 메인 React 컴포넌트
│   ├── App.css                     # 메인 스타일
│   ├── App.test.js                 # App 테스트
│   ├── config.js                   # 설정 파일
│   ├── index.js                    # React 앱 진입점
│   ├── index.css                   # 전역 스타일
│   ├── logo.svg                    # 로고
│   ├── reportWebVitals.js          # 성능 보고
│   └── setupTests.js               # 테스트 설정
│
├── Dockerfile                      # Docker 설정
├── docker-compose.yml              # Docker Compose 설정
├── .env                            # 환경 변수 파일
├── .gitignore                      # Git 무시 규칙
├── .dockerignore                   # Docker 무시 규칙
├── package.json                    # 프로젝트 의존성 및 스크립트
├── package-lock.json               # 의존성 잠금 파일
└── README.md                       # 프로젝트 설명
```

## 개요

간단한 프론트엔드 애플리케이션으로, 기기(또는 소프트웨어) 배포/업데이트 관련 UI와 3D 시각화를 포함합니다. 이 리포지토리는 React 기반으로 작성되었으며, 로컬 개발 및 Docker 기반 실행을 지원합니다.

## 1) 레포별 서비스 개요

- 서비스 이름: Blocker Manufacturer Frontend
- 역할: 제조사(또는 관리자) 측의 배포/업데이트 관리와 상태 모니터링 UI 제공. 일부 화면에서 3D 모델 시각화를 사용.

## 2) 레포지토리 별 개발 환경

- Node.js 18+ 및 npm
- 개발 서버: Create React App (react-scripts)
- 권장 에디터: VS Code
- Optional: Docker (Dockerfile 및 docker-compose.yml 포함)

## 3) 레포지토리 별 사용 기술

- React (컴포넌트 기반 UI)
- React Router (`react-router-dom`) - 라우팅
- Axios - HTTP 통신
- three.js - 3D 렌더링
- 테스트: Testing Library 계열 (`@testing-library/react`, `@testing-library/jest-dom`, 등)
- 웹 성능 측정: `web-vitals`

## 4) 폴더 구조

```
Blocker_Manufacturer_Frontend/
├── public/                 # 정적 파일, 3D 모델과 텍스처
│   ├── resources/
│   │   ├── models/         # 여러 .glb/.fbx 3D 모델 파일
│   │   └── textures/
├── src/                    # 애플리케이션 소스
│   ├── api/                # axios 기반 API 래퍼
│   ├── components/         # 재사용 컴포넌트
│   ├── pages/              # 라우팅 페이지 컴포넌트
│   ├── assets/             # 이미지 등 자산
│   ├── index.js
│   └── App.js
├── Dockerfile
├── docker-compose.yml
├── package.json
├── install.md              # 실행/설치 가이드 (이 프로젝트)
└── LICENSES.md             # 사용된 외부 라이선스 목록
```

## 5) 실행 방법

- 프로젝트별 install 가이드는 `install.md` 파일을 참고하세요.
- 요약: 로컬에서 `npm install` 후 `npm start`로 개발 서버 실행. Docker 사용 시 Dockerfile 참조.

자세한 설치/실행 명령은: `install.md`

## 6) 사용한 라이선스 목록 (Wiki)

- 프로젝트에서 직접 사용한 주요 오픈소스 라이브러리의 라이선스는 `LICENSES.md` 파일에 정리되어 있습니다. (트랜스티브 의존성까지 포함하려면 `license-checker` 실행 권장)

## 7) 해당 레포지토리 라이선스

- 이 리포지토리에 적용할 라이선스가 별도 지정되어 있지 않다면, 라이선스 파일을 추가하세요. 예: `LICENSE`에 MIT 또는 원하는 라이선스를 넣어 공개/배포 정책을 명확히 하시기 바랍니다.

---

추가로 원하시면 `LICENSE` 파일을 생성해 드리고, `package.json`의 dependencies를 정리해서 `npm install`로 곧바로 실행 가능한 상태로 만들어 드리겠습니다.


---

## 🚀 주요 기능

- **React 프론트엔드**: React로 구축된 동적이고 반응형 UI.
- **API 통합**: 백엔드와 통신하여 파일 업로드, 모니터링, 배포 기능 제공.
- **Docker 지원**: Docker 및 Docker Compose를 사용하여 손쉽게 배포 가능.
- **재사용 가능한 컴포넌트**: 확장성을 고려한 모듈식 UI 컴포넌트.
- **환경 변수 설정**: `.env` 파일을 통해 환경별 변수 관리.

---

## 🌍 배포 및 서버 주소

- **제조사 서버 주소**: [http://blocker.o-r.kr](http://blocker.o-r.kr)
- **Vercel 배포 주소**: [https://blocker-industry-1kqcrsw6j-3duck1s-projects.vercel.app/](https://blocker-industry-1kqcrsw6j-3duck1s-projects.vercel.app/)
- **Vercel Inspect**: [https://vercel.com/3duck1s-projects/blocker-industry/C7YedDjwdeUbDPShcUjs2XAWMK1v](https://vercel.com/3duck1s-projects/blocker-industry/C7YedDjwdeUbDPShcUjs2XAWMK1v)

---

## 🛠️ 설치 및 실행 방법

### 사전 준비
- Node.js (v18 이상)
- Docker 및 Docker Compose (컨테이너 배포 시 선택)

### 설치
1. 레포지토리 클론:
   ```bash
   git clone https://github.com/your-repo/Blocker_Manufacturer_Frontend.git
   cd Blocker_Manufacturer_Frontend
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 환경 변수 설정:
   - `.env` 파일을 업데이트하여 적절한 값을 설정 (예: `REACT_APP_API_BASE_URL`).

### 로컬 실행
개발 서버 시작:
```bash
npm start
```
앱에 접속: `http://localhost:3000`

### Docker 배포
1. Docker 컨테이너 빌드 및 실행:
   ```bash
   docker-compose up --build
   ```
2. 앱에 접속: `http://localhost`

---

## 📚 폴더/컴포넌트 상세 설명

### `src/api/`
- **`api.js`**: API 호출을 위한 유틸리티 함수.
- **`uploadService.js`**: 파일 업로드 관련 API 호출 처리.

### `src/components/`
- **`Background/`**: 배경 관련 UI 컴포넌트.
- **`DeployUpdateContent/`**: 배포 및 업데이트 관련 기능 제공.
- **`EncryptionVisualizationContent/`**: 암호화 시각화를 위한 컴포넌트.
- **`FooterContent/`**: 푸터 UI 컴포넌트.
- **`HeaderContent/`**: 헤더 UI 컴포넌트.
- **`MainContent/`**: 메인 콘텐츠 영역 컴포넌트.
- **`MonitoringConent/`**: 업데이트 모니터링 관련 컴포넌트.
- **`Navigation/`**: 네비게이션 바 컴포넌트.

### `src/pages/`
- **`AccessPolicy.js`**: 접근 정책 설정 페이지.
- **`DeploymentComplete.js`**: 배포 완료 상태를 표시하는 페이지.
- **`DeploymentSummary.js`**: 배포 요약 정보를 표시하는 페이지.
- **`FileUpload.js`**: 파일 업로드를 처리하는 페이지.
- **`Home.js`**: 메인 홈 페이지.
- **`UpdateMonitoring.js`**: 업데이트 상태를 모니터링하는 페이지.
- **`UpdateSetting.js`**: 업데이트 설정 페이지.

---

## 🐳 Docker 설정

### Dockerfile
- **베이스 이미지**: Node.js 18 (Alpine).
- **작업 디렉토리**: `/app`.
- **노출 포트**: `3000`.

### docker-compose.yml
- 호스트 포트 `80`을 컨테이너 포트 `3000`에 매핑.
- 프로젝트 디렉토리를 컨테이너의 `/app`에 마운트.

---

## 🌐 환경 변수

### `.env`
- **`REACT_APP_API_BASE_URL`**: 백엔드 API의 기본 URL.

---

## 📊 성능 모니터링

- **`reportWebVitals.js`**: 앱 성능 측정 및 보고.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---
