# Proyecto Full-Stack Web3 con Sistema de Puntos

Este es un proyecto full-stack que demuestra la interacción entre un frontend moderno, un backend de alto rendimiento y un contrato inteligente en la blockchain. El proyecto está estructurado como un monorepo gestionado con NPM Workspaces.

## Arquitectura

El proyecto se divide en tres componentes principales:

-   `frontend/`: Una aplicación de React construida con Vite que interactúa con el backend y permite a los usuarios conectar su wallet y solicitar puntos.
-   `backend-rust/`: Un servidor API construido en Rust con Actix Web. Actúa como intermediario seguro para realizar operaciones en la blockchain que requieren una clave privada (como mintear puntos).
-   `contracts_project/`: Un proyecto de Hardhat que contiene el contrato inteligente `PointsToken.sol`, responsable de la lógica de los puntos en la blockchain.
-   `packages/contracts-abi/`: Un paquete interno que comparte el ABI del contrato para asegurar la consistencia entre el frontend y el backend.

## Cómo Empezar

### Prerrequisitos

-   Node.js (v18 o superior)
-   Rust y Cargo
-   Una wallet de navegador como MetaMask

### 1. Instalación

Gracias a NPM Workspaces, solo necesitas ejecutar un comando en la raíz del proyecto para instalar todas las dependencias de JavaScript:

```bash
npm install
```

### 2. Configuración de Entorno

Cada paquete requiere su propio archivo de configuración `.env`. Asegúrate de crearlos y llenarlos según los archivos de ejemplo (`.env.example` si existieran):

-   **`contracts_project/.env`**:
    -   `AMOY_RPC_URL`: URL del nodo RPC.
    -   `DEPLOYER_PRIVATE_KEY`: Clave privada para desplegar el contrato.
-   **`backend-rust/.env`**:
    -   `AMOY_RPC_URL`: La misma URL del nodo RPC.
    -   `DEPLOYER_PRIVATE_KEY`: La misma clave privada (debe tener rol de minter).
    -   `CONTRACT_ADDRESS`: La dirección del contrato una vez desplegado.
-   **`frontend/.env`**:
    -   `VITE_CONTRACT_ADDRESS`: La misma dirección del contrato desplegado.

### 3. Desplegar el Contrato

Desde la raíz del proyecto, ejecuta el script de despliegue:

```bash
npm run contracts -- deploy
```

Copia la dirección del contrato desplegado y pégala en los archivos `.env` del backend y del frontend.

## Cómo Ejecutar la Aplicación

Necesitarás tres terminales separadas para ejecutar todos los servicios.

### Terminal 1: Iniciar el Backend

```bash
cd backend-rust
cargo run
```
El servidor se iniciará en `http://localhost:3001`.

### Terminal 2: Iniciar el Frontend

Desde la **raíz** del proyecto:
```bash
npm run frontend
```
La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

### Terminal 3: Comandos de Hardhat (Opcional)

Para interactuar con Hardhat (compilar, testear, etc.), usa los scripts desde la **raíz**:
```bash
# Para compilar
npm run contracts -- compile

# Para correr tests
npm run contracts -- test
