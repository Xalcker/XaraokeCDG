# XaraokeCDG 🎤🎶

Un reproductor de karaoke interactivo basado en la web, construido con Node.js y WebSockets. Los usuarios pueden explorar una biblioteca de canciones y añadir colaborativamente canciones a una cola en tiempo real desde sus dispositivos móviles usando un código QR.

---
## ✨ Características

* **Catálogo Basado en Archivos:** Las canciones (archivos CDG+MP3 en formato .zip) se gestionan simplemente colocándolas en una carpeta.
* **Control Remoto en Tiempo Real:** La interfaz del reproductor y los controles remotos se sincronizan instantáneamente usando WebSockets.
* **Conexión por QR:** Escanea un código QR en la pantalla principal para abrir la interfaz remota en cualquier teléfono, sin necesidad de instalar una app.
* **Explorador de Canciones Alfabético:** Navega por la biblioteca de canciones de forma intuitiva, filtrando por artista y luego seleccionando la canción.
* **Cola de Reproducción Compartida:** Múltiples usuarios pueden ver y añadir canciones a la misma cola de reproducción en tiempo real.
* **Controles de Reproducción:** Los controles remotos pueden pausar, reanudar y saltar canciones.
* **Notificaciones Inteligentes:** El control remoto vibra y suena para avisar al usuario cuando su canción está a punto de empezar.
* **Salas Virtuales:** Soporte de salas virtuales con colas independientes.

---
## 🛠️ Stack Tecnológico

* **Backend:** Node.js, Express, WebSockets (`ws`)
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), CDGPlayer.js
* **Dependencias Clave:** `express`, `ws`, `qrcode`

---
## 🚀 Cómo Empezar

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Pre-requisitos

* Node.js (v16 o superior)
* npm

### Instalación

1.  **Copia todos los archivos** del proyecto en un nuevo directorio.

2.  **Crea la estructura de carpetas** para tu contenido. Dentro del directorio principal, crea una carpeta llamada `public`, y dentro de ella, otra llamada `CDG`. La estructura debe ser:
    ```
    /tu-proyecto
    |-- /public
    |   |-- /CDG
    |   |-- index.html
    |   |-- style.css
    |   |-- etc...
    |-- server.js
    |-- package.json
    ```

3.  **Añade tus canciones de karaoke** a la carpeta `/public/CDG`. Los archivos deben seguir un formato estricto:
    * Deben ser archivos `.zip`.
    * Cada `.zip` debe contener un archivo `.cdg` y un archivo `.mp3` con **exactamente el mismo nombre**.
    * El nombre del archivo `.zip` debe seguir el formato: `Artista - Título de la Canción.zip`.

4.  **Abre una terminal** en el directorio del proyecto e instala las dependencias:
    ```bash
    npm install
    ```
5.  **Inicia el servidor:**
    ```bash
    npm start
    ```
6.  Abre tu navegador y ve a `http://localhost:3000` (o la IP local que muestre la consola).

---
## 💡 Cómo Usar

1.  Abre la aplicación en un navegador en tu computadora o TV (el **Host**).
2.  Escanea el código QR con la cámara de tu teléfono para abrir el **Control Remoto**.
3.  Introduce tu nombre en la interfaz remota.
4.  Usa el explorador alfabético para encontrar tu canción favorita y añadirla a la cola.
5.  La cola se actualizará en la pantalla principal y en todos los remotos conectados.
6.  ¡Espera tu turno y canta!