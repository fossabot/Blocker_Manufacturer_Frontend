# Blocker Manufacturer Frontend

## 📂 프로젝트 구조

```
Blocker_Manufacturer_Frontend/
│
├── public/                     # 정적 파일
│   ├── index.html              # 메인 HTML 파일
│   ├── manifest.json           # 웹 앱 매니페스트
│   └── robots.txt              # 크롤러 접근 제한 파일
│
├── src/                        # 소스 코드
│   ├── api/                    # API 서비스 모듈
│   │   ├── api.js              # API 유틸리티
│   │   └── uploadService.js    # 파일 업로드 API 서비스
│   │
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   ├── Background/         # 배경 관련 컴포넌트
│   │   ├── DeployUpdateContent/ # 배포 관련 컴포넌트
│   │   ├── FooterContent/      # 푸터 컴포넌트
│   │   ├── HeaderContent/      # 헤더 컴포넌트
│   │   ├── MainContent/        # 메인 콘텐츠 컴포넌트
│   │   ├── MonitoringConent/   # 업데이트 모니터링 컴포넌트
│   │   └── Navigation/         # 네비게이션 바 컴포넌트
│   │
│   ├── pages/                  # 페이지 단위 컴포넌트
│   │   ├── AccessPolicy.js     # 접근 정책 페이지
│   │   ├── DeploymentComplete.js # 배포 완료 페이지
│   │   ├── DeploymentSummary.js  # 배포 요약 페이지
│   │   ├── FileUpload.js       # 파일 업로드 페이지
│   │   ├── Home.js             # 홈 페이지
│   │   ├── UpdateMonitoring.js # 업데이트 모니터링 페이지
│   │   └── UpdateSetting.js    # 업데이트 설정 페이지
│   │
│   ├── App.js                  # 메인 React 컴포넌트
│   ├── index.js                # React 앱 진입점
│   ├── config.js               # 설정 파일
│   ├── reportWebVitals.js      # 성능 보고
│   └── setupTests.js           # 테스트 설정
│
├── Dockerfile                  # Docker 설정
├── docker-compose.yml          # Docker Compose 설정
├── .env                        # 환경 변수 파일
├── .gitignore                  # Git 무시 규칙
├── .dockerignore               # Docker 무시 규칙
├── package.json                # 프로젝트 의존성 및 스크립트
├── package-lock.json           # 의존성 잠금 파일
└── README.md                   # 프로젝트 설명
```

---

## 🚀 주요 기능

- **React 프론트엔드**: React로 구축된 동적이고 반응형 UI.
- **API 통합**: 백엔드와 통신하여 파일 업로드, 모니터링, 배포 기능 제공.
- **Docker 지원**: Docker 및 Docker Compose를 사용하여 손쉽게 배포 가능.
- **재사용 가능한 컴포넌트**: 확장성을 고려한 모듈식 UI 컴포넌트.
- **환경 변수 설정**: `.env` 파일을 통해 환경별 변수 관리.

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
