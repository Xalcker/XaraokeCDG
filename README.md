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
* **Notificaciones Inteligentes:** El control remoto vibra y suena para avisar al usuario cuando su canción está a punto de empezar (10 segundos antes).
* **Salas Virtuales:** Soporte de salas virtuales con códigos de 4 letras y colas independientes.
* **Detección Automática de Dispositivos:** Los dispositivos móviles son redirigidos automáticamente a la interfaz de control remoto.
* **Reproducción CDG:** Soporte completo para archivos CDG con sincronización de letras usando CDGPlayer.js.

---
## 🛠️ Stack Tecnológico

* **Backend:** Node.js, Express, WebSockets (`ws`)
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+), CDGPlayer.js
* **Dependencias Principales:** 
  * `express` (^4.19.2) - Servidor web
  * `ws` (^8.18.0) - WebSockets para comunicación en tiempo real
  * `qrcode` (^1.5.3) - Generación de códigos QR
* **Librerías CDN:**
  * JSZip - Descompresión de archivos .zip
  * JSZip-utils - Utilidades para manejo de archivos
  * jsmediatags - Lectura de metadatos de audio

---
## 🚀 Cómo Empezar

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Pre-requisitos

* Node.js (v16 o superior)
* npm (incluido con Node.js)
* Navegador web moderno con soporte para WebSockets

### Instalación

1.  **Clona o descarga** el repositorio en tu máquina local.

2.  **Crea la carpeta para las canciones:** Dentro del directorio `public`, crea una carpeta llamada `CDG`:
    ```bash
    mkdir public/CDG
    ```
    La estructura del proyecto debe ser:
    ```
    /XaraokeCDG
    |-- /public
    |   |-- /CDG              # Aquí van tus canciones
    |   |-- /js
    |   |   |-- cdgplayer.js
    |   |-- index.html
    |   |-- remote.html
    |   |-- karaoke.js
    |   |-- remote.js
    |   |-- style.css
    |   |-- notification.mp3
    |   |-- Xaraoke.svg
    |   |-- favicon.ico
    |-- server.js
    |-- package.json
    |-- README.md
    |-- .gitignore
    ```

3.  **Añade tus canciones de karaoke** a la carpeta `/public/CDG`. Los archivos deben seguir un formato estricto:
    * Deben ser archivos `.zip`
    * Cada `.zip` debe contener un archivo `.cdg` y un archivo `.mp3` con **exactamente el mismo nombre**
    * El nombre del archivo `.zip` debe seguir el formato: `Artista - Título de la Canción.zip`
    * Ejemplo: `Los Ángeles Azules - Nunca Es Suficiente.zip`

4.  **Instala las dependencias** del proyecto:
    ```bash
    npm install
    ```

5.  **Inicia el servidor:**
    ```bash
    npm start
    ```

6.  **Accede a la aplicación:**
    * Pantalla principal (Host): `http://localhost:3000`
    * O usa la IP local que se muestra en la consola para acceder desde otros dispositivos en la misma red

---
## 💡 Cómo Usar

1.  **Inicia una sesión:** Abre la aplicación en un navegador en tu computadora o TV (el **Host**) y haz clic en "Comenzar".
2.  **Obtén el código de sala:** Se generará automáticamente un código de 4 letras y un código QR.
3.  **Conecta dispositivos móviles:**
    * Escanea el código QR con la cámara de tu teléfono, o
    * Introduce manualmente el código de sala de 4 letras cuando se te solicite
4.  **Configura tu nombre:** En el control remoto, introduce tu nombre (se guardará para futuras sesiones).
5.  **Explora y añade canciones:**
    * Navega por el explorador alfabético
    * Selecciona el artista
    * Elige tu canción favorita
    * Confirma para añadirla a la cola
6.  **Controla la reproducción:**
    * Usa los botones de Play/Pausa y Saltar desde cualquier control remoto
    * La cola se sincroniza en tiempo real en todos los dispositivos
7.  **Recibe notificaciones:** Tu dispositivo vibrará y sonará 10 segundos antes de que empiece tu canción.
8.  **¡Canta!** Disfruta del karaoke con letras sincronizadas en pantalla.

---
## 🔧 Configuración Avanzada

### Variables de Entorno

Puedes configurar el puerto del servidor usando una variable de entorno:

```bash
PORT=8080 npm start
```

### Modo Producción

Para ejecutar en producción, establece la variable de entorno:

```bash
NODE_ENV=production npm start
```

En modo producción, el servidor usará HTTPS y el dominio del host para generar los códigos QR.

---
## 📁 Formato de Archivos de Canciones

Los archivos de karaoke deben cumplir con el siguiente formato:

* **Extensión:** `.zip`
* **Contenido del .zip:**
  * Un archivo `.cdg` (gráficos de karaoke)
  * Un archivo `.mp3` (audio)
  * Ambos archivos deben tener el mismo nombre base
* **Nomenclatura del archivo .zip:** `Artista - Título.zip`

**Ejemplo de estructura interna:**
```
Los Ángeles Azules - Nunca Es Suficiente.zip
  ├── Los Ángeles Azules - Nunca Es Suficiente.cdg
  └── Los Ángeles Azules - Nunca Es Suficiente.mp3
```

---
## 🐛 Solución de Problemas

### Las canciones no aparecen en el explorador
* Verifica que la carpeta `/public/CDG` existe
* Asegúrate de que los archivos siguen el formato correcto: `Artista - Título.zip`
* Revisa la consola del servidor para ver mensajes de error

### El código QR no se genera
* Verifica que el servidor esté ejecutándose correctamente
* Comprueba que no haya errores en la consola del navegador
* Asegúrate de que tu firewall no esté bloqueando las conexiones

### Los dispositivos no se conectan
* Verifica que todos los dispositivos estén en la misma red
* Usa la IP local mostrada en la consola en lugar de `localhost`
* Comprueba que el puerto 3000 (o el configurado) no esté bloqueado

### La reproducción no inicia
* Verifica que los archivos .zip contengan tanto .cdg como .mp3
* Asegúrate de que ambos archivos dentro del .zip tengan el mismo nombre
* Revisa la consola del navegador para errores de carga

---
## 📝 Licencia

ISC

---
## 👤 Autor

Xalcker

---
## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.