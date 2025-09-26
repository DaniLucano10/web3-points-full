# Backend en Rust (Actix Web)

Este backend sirve como intermediario entre el frontend y el contrato inteligente `PointsToken` desplegado en la blockchain. Está construido con [Actix Web](https://actix.rs/), un framework de alto rendimiento para crear aplicaciones web en Rust.

## Funcionalidades Principales

El servidor expone una API REST con dos endpoints principales:

1.  **`POST /mint`**:
    -   Permite a un usuario solicitar puntos.
    -   Recibe una dirección de usuario y una cantidad en el cuerpo de la solicitud.
    -   Llama a la función `mintPoints` del contrato inteligente para acuñar nuevos puntos a esa dirección.
    -   Devuelve el hash de la transacción y el nuevo balance de puntos del usuario.

2.  **`GET /balance/:user`**:
    -   Consulta el balance de puntos de un usuario específico.
    -   Recibe la dirección del usuario como parte de la URL.
    -   Llama a la función `balanceOf` del contrato inteligente.
    -   Devuelve el balance actual de puntos.

## Configuración

El backend requiere las siguientes variables de entorno, que deben ser definidas en un archivo `.env` en la raíz de este directorio (`backend-rust/.env`):

-   `AMOY_RPC_URL`: La URL del nodo RPC para la red de prueba (ej. Amoy).
-   `DEPLOYER_PRIVATE_KEY`: La clave privada de la cuenta que tiene permisos para mintear puntos en el contrato.
-   `CONTRACT_ADDRESS`: La dirección del contrato `PointsToken` desplegado.

## Cómo Ejecutarlo

1.  Asegúrate de tener Rust y Cargo instalados.
2.  Crea y configura el archivo `.env` con las variables mencionadas.
3.  Desde el directorio `backend-rust`, ejecuta el siguiente comando para iniciar el servidor:
    ```bash
    cargo run
    ```
4.  El servidor se iniciará en `http://localhost:3001`.
