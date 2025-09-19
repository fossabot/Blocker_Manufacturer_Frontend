
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

## Overview

This repository is the **Manufacturer Frontend** for the [HSU-Blocker](https://github.com/HSU-Blocker) blockchain-based IoT software update platform. This web application allows manufacturers to distribute and manage software updates for IoT devices, including update registration, deployment monitoring, and policy management.

- **Service Role:** Manufacturer dashboard for update distribution and monitoring
- **Deployment URLs:**
  - Main server: [http://blocker.o-r.kr](http://blocker.o-r.kr)
  - Vercel: [https://blocker-industry-1kqcrsw6j-3duck1s-projects.vercel.app/](https://blocker-industry-1kqcrsw6j-3duck1s-projects.vercel.app/)

---

## Development Environment

- Node.js (v16+ recommended)
- npm
- Docker (optional, for containerized deployment)
- Visual Studio Code (recommended)

## Technology Stack

- React (UI framework)
- React Router (`react-router-dom`) for routing
- Axios for HTTP communication
- three.js for 3D visualization
- WebSocket for real-time updates

---

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

