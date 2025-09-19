# Blocker Manufacturer Frontend


<table>
  <tr>
    <td><img width="500" height="250" src="https://github.com/user-attachments/assets/b9aeac84-ceb9-4d2f-bda7-06174e1e72cd" /></td>
    <td><img width="500" height="250" src="https://github.com/user-attachments/assets/69b90301-c7ef-4aa5-85b9-f2aee1d46f71" /></td>
  </tr>
  <tr>
    <td><img width="500" height="250" src="https://github.com/user-attachments/assets/f9a37c23-d531-4734-a88f-4a39f24d5ed5" /></td>
    <td><img width="500" height="250" src="https://github.com/user-attachments/assets/b1e83948-0e5a-4865-b9f5-79eae5d0b4eb" /></td>
  </tr>
</table>


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

# Blocker Manufacturer Frontend

## Overview

This repository provides the **Manufacturer Frontend** for the [HSU-Blocker](https://github.com/HSU-Blocker) blockchain-based IoT software update platform.  
The frontend enables manufacturers to register new software updates, monitor update deployments, and manage update policies for connected IoT devices.

- **Service Role:** Manufacturer web dashboard for update management and monitoring
- **Main Features:**
   - Register and manage software updates on the blockchain
   - Monitor update deployment status across devices
   - Manage access policies and update packages
- **Frontend Preview:**  
   ![Frontend Screenshot](./public/logo192.png) <!-- Replace with actual screenshot if available -->
- **Backend API Endpoint:**  
   `https://your-server-address/api` <!-- Replace with actual server address -->

## Development Environment

- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
- ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) (v16+ recommended)
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
- ![VSCode](https://img.shields.io/badge/Visual_Studio_Code-007ACC?style=flat&logo=visualstudiocode&logoColor=white)

## Technology Stack

- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) Frontend UI framework
- ![Web3](https://img.shields.io/badge/Web3-F16822?style=flat&logo=web3dotjs&logoColor=white) Blockchain interaction
- ![REST API](https://img.shields.io/badge/REST_API-6DB33F?style=flat&logo=swagger&logoColor=white) Backend communication
- ![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=flat&logo=ipfs&logoColor=white) Distributed file storage
- ![AES-256](https://img.shields.io/badge/AES--256-006699?style=flat&logo=databricks&logoColor=white) Secure file encryption
- ![SHA3-256](https://img.shields.io/badge/SHA3--256-117A65?style=flat&logo=datadog&logoColor=white) File integrity verification
- ![WebSocket](https://img.shields.io/badge/WebSocket-008080?style=flat&logo=socketdotio&logoColor=white) Real-time event monitoring

## Directory Structure

```
Blocker_Manufacturer_Frontend/
├── public/
│   ├── index.html
│   ├── logo192.png
│   ├── resources/
│   │   └── models/
│   │       └── ... (3D models)
│   │   └── textures/
│   │       └── ... (images)
├── src/
│   ├── api/
│   │   ├── api.js
│   │   └── uploadService.js
│   ├── assets/
│   ├── components/
│   │   └── ... (UI components)
│   ├── pages/
│   │   └── ... (page components)
│   ├── App.js
│   ├── index.js
│   └── ... (styles, configs)
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── install.md
```

## Getting Started

See [INSTALL.md](./install.md) for detailed installation and usage instructions.

## License Information

- See the [Wiki License List](https://github.com/HSU-Blocker/Blocker_Manufacturer_Frontend/wiki/License-List) for all third-party licenses used in this repository.

## Repository License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

Contributions and questions are welcome via Issues and Pull Requests.  
For more information about the overall project, visit the [HSU-Blocker GitHub organization](https://github.com/HSU-Blocker).

---

