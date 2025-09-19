# Install & Run

This document describes how to install and run the Blocker Manufacturer Frontend repository.

Prerequisites
- Node.js 18+ (recommended) and npm
- Optional: Docker and docker-compose if you want to run in a container

Local (developer) install

1. Clone the repo:

   git clone <repo-url>
   cd Blocker_Manufacturer_Frontend

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm start
```

App will be available at http://localhost:3000 by default.

Run with Docker (optional)

1. Build image:

```bash
docker build -t blocker-frontend .
```

2. Run container:

```bash
docker run -p 3000:3000 blocker-frontend
```

Notes
- If you run into issues with missing packages, ensure `package.json` contains the expected dependencies and run `npm install` again.
- For a full license inventory including transitive dependencies, run:

```bash
npx license-checker --json > licenses.json
```
