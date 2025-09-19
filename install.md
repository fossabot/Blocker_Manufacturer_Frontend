# Installation and Execution Guide

This document provides detailed instructions on how to set up and run the **Blocker Manufacturer Frontend**.

##  Prerequisites

Before you begin, ensure you have the following software installed:
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher (usually comes with Node.js)
- **Docker**: (Optional, for container-based execution)
- **Docker Compose**: (Optional, for container-based execution)

---

## Initial Configuration (Required)

This frontend application needs to connect to the `Blocker_Manufacturer_Backend` server to function correctly. You must specify the backend server's address in an environment variable file.

1.  **Create a `.env` file** in the root directory of the project.
    ```bash
    touch .env
    ```

2.  **Open the `.env` file** and add the following line. You need to enter the address of your running backend server.
    - If the backend is running on your local machine, the address will typically be `http://localhost:8000`.

    ```env
    REACT_APP_API_BASE_URL=http://localhost:8000
    ```
    > **Warning**: This step is mandatory. If the `.env` file is not configured correctly, the application will not be able to communicate with the server.

---

## 🚀 Method 1: Running with `npm` (Standard)

This is the standard method for running the application in a development environment.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HSU-Blocker/Blocker_Manufacturer_Frontend.git
    cd Blocker_Manufacturer_Frontend
    ```

2.  **Install dependencies:**
    This command reads the `package.json` file and installs all the necessary libraries into the `node_modules` directory.
    ```bash
    npm install
    ```

3.  **Start the development server:**
    This command starts the React development server.
    ```bash
    npm start
    ```

4.  **Access the application:**
    Once the server is running, you can access the application in your web browser at [http://localhost:3000](http://localhost:3000).

---

## Method 2: Running with `Docker Compose` (Containerized)

Using Docker Compose is a convenient way to run the application in an isolated containerized environment. This method also requires the `.env` file configuration as described above.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HSU-Blocker/Blocker_Manufacturer_Frontend.git
    cd Blocker_Manufacturer_Frontend
    ```

2.  **Ensure `.env` file is configured:**
    Make sure you have created and configured the `.env` file as instructed in the "Initial Configuration" section. The Docker container will use this file.

3.  **Build and start the container:**
    This single command reads the `docker-compose.yml` file, builds the Docker image, and starts the container in the background.
    ```bash
    docker-compose up --build -d
    ```

4.  **Access the application:**
    You can access the containerized application in your web browser at [http://localhost](http://localhost) (it maps to port 80 by default).

### Useful Docker Compose Commands
- **To stop the application:**
  ```bash
  docker-compose down
  ```
- **To view logs:**
  ```bash
  docker-compose logs -f
  ```