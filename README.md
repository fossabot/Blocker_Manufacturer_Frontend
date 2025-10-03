# Blocker Manufacturer Frontend

## Overview

This repository is the **Manufacturer Frontend** for the [HSU-Blocker](https://github.com/HSU-Blocker) blockchain-based IoT software update platform. This web application empowers manufacturers to freely distribute and manage software updates for their IoT devices. Key features include the ability to set an update's name, price, and access policy. Manufacturers can also view a list of previously deployed updates with the option to delete them. To enhance understanding of the deployment process onto the blockchain network, the application includes a 3D animated visualization feature.

- **Service Role:** Manufacturer dashboard for update distribution and monitoring
- **Deployment URLs:**
  (Note: These are live previews deployed to help users easily understand the project. The intended use is to run the code locally.)
  - Main server: [http://blocker.o-r.kr](http://blocker.o-r.kr)
  - Vercel: [https://blocker-industry-1kqcrsw6j-3duck1s-projects.vercel.app/](https://blocker-industry-1kqcrsw6j-3duck1s-projects.vercel.app/)


### Home Screen
<img src="https://github.com/user-attachments/assets/6a7aa79d-63e6-41f3-a977-0d562c5646f8" />
The initial screen when accessing the website. It provides navigation to key sections such as Deploy, Update Monitoring, and About Us.

### Update Access Policy Configuration
<img src="https://github.com/user-attachments/assets/69b90301-c7ef-4aa5-85b9-f2aee1d46f71" />
After uploading an update file, the manufacturer configures its access policy. This allows the manufacturer to freely define the rules and conditions for the update.

### Update Monitoring
<img src="https://github.com/user-attachments/assets/f9a37c23-d531-4734-a88f-4a39f24d5ed5" />
This section allows manufacturers to view details of previously deployed updates, such as their name, IPFS hash, and version. Updates can also be deleted from this list.

### Update Deployment Visualization
<img src="https://github.com/user-attachments/assets/b1e83948-0e5a-4865-b9f5-79eae5d0b4eb" />
A 3D animated visualization showing how the manufacturer's uploaded update file is encrypted and which resulting files are uploaded to the blockchain and the IPFS network.


---

## Development Environment

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FHSU-Blocker%2FBlocker_Manufacturer_Frontend.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FHSU-Blocker%2FBlocker_Manufacturer_Frontend?ref=badge_shield)
(v16+ recommended)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) (optional)
- ![VSCode](https://img.shields.io/badge/Visual_Studio_Code-007ACC?style=flat&logo=visualstudiocode&logoColor=white)

## Technology Stack

- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) UI framework
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) Routing
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) HTTP communication
- ![three.js](https://img.shields.io/badge/three.js-000000?style=flat&logo=three.js&logoColor=white) 3D visualization

---


## Installation

See [install.md](./install.md) for detailed installation and usage instructions.

---


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


---

## License

This project is licensed under the Apache 2.0 License. See [LICENSE](./LICENSE) for details.

---


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FHSU-Blocker%2FBlocker_Manufacturer_Frontend.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FHSU-Blocker%2FBlocker_Manufacturer_Frontend?ref=badge_large)

## Contribution

Contributions and questions are always welcome through Issues and Pull Requests.
For detailed contribution guidelines, please refer to the [Contribution Guide](./CONTRIBUTING.md).


---
For more information about the overall project, visit the [HSU-Blocker GitHub organization](https://github.com/HSU-Blocker).