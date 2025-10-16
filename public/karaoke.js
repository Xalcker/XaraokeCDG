import { CDGPlayer } from './js/cdgplayer.js';

document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos del DOM ---
  const welcomeModal = document.getElementById("welcome-modal");
  const startBtn = document.getElementById("start-btn");
  const mainContainer = document.querySelector(".main-container");
  const nowPlayingContent = document.getElementById("now-playing-content");
  const upNextContent = document.getElementById("up-next-content");
  const songQueueContainer = document.getElementById("songQueue");
  const qrCodeImg = document.getElementById("qrCode");
  const roomCodeDisplay = document.getElementById("room-code");

  // --- Variables de Estado Globales ---
  let cdgplayer = null;
  let isPlaying = false;
  let currentlyPlayingFile = null;
  let currentQueue = [];
  let ws;
  let roomId = null;
  let lastTimeUpdate = 0;
  let trackLength = "0:00";
  let trackLengthInSeconds = 0;
  let lastKnownTimeInSeconds = 0;

  function toSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  // --- FUNCIONES DEL REPRODUCTOR ---
  function initializePlayer() {
    if (cdgplayer) return;

    cdgplayer = new CDGPlayer('#cdg_wrapper');

    // Listener para la propiedad 'isPlaying' - El centro de la lógica de reproducción.
    cdgplayer.props.on('isPlaying', (newIsPlayingState) => {
      // Comprobamos si el estado ha cambiado de 'reproduciendo' a 'detenido'
      if (isPlaying && !newIsPlayingState) {
        console.log('El reproductor se ha detenido.');

        // Comprobamos si se detuvo porque la canción terminó
        if (trackLengthInSeconds > 0 && Math.abs(trackLengthInSeconds - lastKnownTimeInSeconds) <= 3) {
          console.log('Se confirma el final de la canción, pidiendo la siguiente.');

          currentlyPlayingFile = null;
          document.querySelector('#cdg_wrapper').classList.add('titleImage');

          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "playNext" }));
          }
        }
      }
      // Actualizamos nuestra variable de estado global
      isPlaying = newIsPlayingState;
    });

    cdgplayer.props.on('trackLength', (val) => {
      trackLength = val;
      trackLengthInSeconds = toSeconds(val);
      renderNowPlaying();
    });

    cdgplayer.props.on('timePlayed', (timePlayedStr) => {
      lastKnownTimeInSeconds = toSeconds(timePlayedStr);

      const now = Date.now();
      if (now - lastTimeUpdate > 1000) {
        lastTimeUpdate = now;
        if (ws?.readyState === WebSocket.OPEN && trackLengthInSeconds > 0) {
          ws.send(JSON.stringify({
            type: "timeUpdate",
            payload: {
              currentTime: lastKnownTimeInSeconds,
              duration: trackLengthInSeconds,
              song: currentQueue.length > 0 ? currentQueue[0].song : null,
            },
          }));
        }
      }
    });

    cdgplayer.props.on('status', (val) => {
      if (val === 'File Loaded') {
        console.log('Archivo cargado, iniciando...');
        cdgplayer.start();
      }
    });
  }

  async function playSong(songFilename) {
    trackLength = "0:00";
    trackLengthInSeconds = 0;
    lastKnownTimeInSeconds = 0;
    renderNowPlaying();

    document.querySelector('#cdg_wrapper').classList.remove('titleImage');
    try {
      const apiUrlResponse = await fetch(`/api/song-url?song=${encodeURIComponent(songFilename)}`);
      if (!apiUrlResponse.ok) {
        const errorInfo = await apiUrlResponse.json();
        throw new Error(`Error de API: ${errorInfo.error || apiUrlResponse.statusText}`);
      }
      const songData = await apiUrlResponse.json();
      const songUrl = songData.url;

      const fileResponse = await fetch(songUrl);
      if (!fileResponse.ok) {
        throw new Error(`Fallo al descargar el archivo: ${fileResponse.statusText}`);
      }

      const fileData = await fileResponse.arrayBuffer();
      currentlyPlayingFile = songFilename;
      cdgplayer.load(fileData);

    } catch (error) {
      console.error('Error en la función playSong:', error);
      alert('No se pudo cargar la canción. Revisa la consola.');
      currentlyPlayingFile = null;
      document.querySelector('#cdg_wrapper').classList.add('titleImage');
    }
  }

  // --- LÓGICA DE LA APLICACIÓN Y WEBSOCKETS ---
  startBtn.addEventListener("click", async () => {
    welcomeModal.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    initializePlayer();
    try {
      const response = await fetch("/api/rooms", { method: "POST" });
      const data = await response.json();
      roomId = data.roomId;
      roomCodeDisplay.textContent = roomId;
      connectWebSocket();
      initializeQR();
    } catch (error) {
      console.error("No se pudo crear la sala:", error);
      alert("Error al crear la sala. Por favor, refresca la página.");
    }
  });

  function connectWebSocket() {
    if (!roomId) return;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${protocol}://${window.location.host}?sala=${roomId}`);
    ws.onopen = () => console.log(`Host conectado a la sala: ${roomId}`);
    ws.onclose = () => setTimeout(connectWebSocket, 3000);
    ws.onerror = (err) => console.error("Error de WebSocket en Host:", err);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "queueUpdate") {
        currentQueue = message.payload;
        renderAllSections();
        checkAndPlayNext();
      }
      if (message.type === "controlAction") {
        handleControlAction(message.payload);
      }
    };
  }

  async function initializeQR() {
    if (!roomId) return;
    try {
      const qrRes = await fetch(`/api/qr?sala=${roomId}`);
      const qrData = await qrRes.json();
      qrCodeImg.src = qrData.qrUrl;
    } catch (error) {
      console.error("Error durante la inicialización del QR:", error);
    }
  }

  function checkAndPlayNext() {
    if (currentQueue.length === 0) {
      currentlyPlayingFile = null;
      return;
    }
    const nextSongInQueue = currentQueue[0].song;
    if (nextSongInQueue !== currentlyPlayingFile) {
      playSong(nextSongInQueue);
    }
  }

  function handleControlAction(payload) {
    if (!cdgplayer) return;
    switch (payload.action) {
      case "playPause":
        cdgplayer.togglePlay();
        break;
      case "skip":
        document.querySelector('#cdg_wrapper').classList.add('titleImage');
        cdgplayer.stop();
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "playNext" }));
        }
        break;
    }
  }

  // --- Funciones de Renderizado ---
  function renderAllSections() {
    renderNowPlaying();
    renderUpNext();
    renderUpcomingQueue();
  }

  function formatSongTitleForDisplay(fullFilename) {
    if (!fullFilename) return { artist: "(Desconocido)", songTitle: "Vacío" };
    const parts = fullFilename.replace(".zip", "").split(" - ");
    if (parts.length >= 2) {
      return {
        artist: `(${parts[0].trim()})`,
        songTitle: parts.slice(1).join(" - ").trim()
      };
    }
    return {
      artist: "(Desconocido)",
      songTitle: fullFilename.replace(".zip", "")
    };
  }

  function renderNowPlaying() {
    const nowPlaying = currentQueue.length > 0 ? currentQueue[0] : null;
    if (nowPlaying) {
      const { artist, songTitle } = formatSongTitleForDisplay(nowPlaying.song);
      const durationText =
        (currentlyPlayingFile === nowPlaying.song && trackLength !== "0:00")
          ? `Duración: ${trackLength}`
          : "";
      nowPlayingContent.innerHTML = `
        <div class="info-card-title">${songTitle}</div>
        <div class="info-card-subtitle">${artist}</div>
        <div class="info-card-user">por ${nowPlaying.name}</div>
        <div class="info-card-subtitle" id="song-duration">${durationText}</div> 
      `;
    } else {
      nowPlayingContent.innerHTML = '<div class="info-card-title">La cola está vacía</div>';
    }
  }

  function renderUpNext() {
    const upNext = currentQueue.length > 1 ? currentQueue[1] : null;
    if (upNext) {
      const { artist, songTitle } = formatSongTitleForDisplay(upNext.song);
      upNextContent.innerHTML = `
        <div class="info-card-title">${songTitle}</div>
        <div class="info-card-subtitle">${artist}</div>
        <div class="info-card-user">por ${upNext.name}</div>
      `;
    } else {
      upNextContent.innerHTML = '<div class="info-card-title">Nadie en espera</div>';
    }
  }

  function renderUpcomingQueue() {
    const upcoming = currentQueue.slice(2, 7);

    // Si no hay canciones próximas, muestra el mensaje y termina.
    if (upcoming.length === 0) {
      if (currentQueue.length <= 2) {
        songQueueContainer.innerHTML = '<div class="queue-item">No hay más canciones en cola.</div>';
      } else {
        songQueueContainer.innerHTML = ""; // Limpia si hay más de 7 canciones en total
      }
      return;
    }

    // 1. Construye el HTML para todos los elementos como un array de strings.
    const queueHtml = upcoming.map(item => {
      const { artist, songTitle } = formatSongTitleForDisplay(item.song);
      return `
      <div class="queue-item">
        <span class="song-name">${songTitle}</span>
        <span class="artist-name">${artist}</span>
        <span class="user-name">por ${item.name}</span>
      </div>
    `;
    }).join(''); // 2. Une todos los strings en uno solo.

    // 3. Actualiza el DOM una sola vez.
    songQueueContainer.innerHTML = queueHtml;
  }
});