// NAYVO Custom Video Player, Eco-Streaming & Interactive Transcript Engine

class NayvoPlayer {
  constructor() {
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.ambientCanvas = null;
    this.ambientCtx = null;
    
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 1845;
    this.volume = 0.85;
    this.isMuted = false;
    this.playbackRate = 1.0;
    this.currentQuality = '1080p';
    this.subtitlesEnabled = false;
    this.ambientEnabled = true;
    this.isTheaterMode = false;
    this.isMiniPlayer = false;
    this.isLooping = false;
    
    this.currentVideo = null;
    this.animationFrameId = null;
    this.progressInterval = null;
  }

  init(containerElement, videoData) {
    this.container = containerElement;
    this.currentVideo = videoData;
    this.duration = videoData.duration || 1800;
    this.currentTime = 0;
    this.isPlaying = false;
    
    this.renderPlayerDOM();
    this.setupCanvases();
    this.bindEvents();
    this.bindKeyboardShortcuts();
    
    // Auto-record history
    NayvoState.recordHistory(videoData.id, 0);
  }

  renderPlayerDOM() {
    if (!this.container) return;
    
    const isLive = this.currentVideo.isLive;
    const durationDisplay = isLive ? 'LIVE' : this.formatTime(this.duration);
    const isEco = NayvoState.state.ecoMode;

    this.container.innerHTML = `
      <div class="player-ambient-glow" id="player-ambient-glow" style="display: ${this.ambientEnabled ? 'block' : 'none'};">
        <canvas class="player-ambient-canvas" id="player-ambient-canvas"></canvas>
      </div>

      <!-- Eco Mode Active Badge -->
      <div class="player-eco-badge" id="player-eco-indicator" style="display: ${isEco ? 'flex' : 'none'};">
        <span>🌱 Eco-Streaming Active</span>
        <span>• 45% Energy Saved</span>
      </div>

      <div class="player-surface" id="player-surface">
        <canvas class="player-canvas-mock" id="player-main-canvas"></canvas>
      </div>

      <div class="player-center-action" id="player-center-indicator">▶</div>

      <div class="player-controls-overlay" id="player-controls-overlay">
        ${!isLive ? `
          <div class="player-scrubber-container" id="player-scrubber">
            <div class="player-scrubber-track">
              <div class="player-buffer-bar" id="player-buffer-bar" style="width: 45%;"></div>
              <div class="player-played-bar" id="player-played-bar" style="width: 0%;"></div>
              <div class="player-scrubber-thumb" id="player-scrubber-thumb" style="left: 0%;"></div>
              <!-- Chapter Markers -->
              ${(this.currentVideo.chapters || []).map(ch => `
                <div class="chapter-marker" style="left: ${(ch.time / this.duration) * 100}%;" title="${ch.title}"></div>
              `).join('')}
            </div>
            <div class="scrubber-hover-preview" id="scrubber-preview">00:00</div>
          </div>
        ` : ''}

        <div class="player-bottom-bar">
          <div class="player-controls-left">
            <button class="player-btn" id="btn-play-pause" title="Play/Pause (Space / K)">▶</button>
            <button class="player-btn" id="btn-next-track" title="Next Video">⏭</button>
            
            <div class="volume-control-wrap">
              <button class="player-btn" id="btn-volume-toggle" title="Mute/Unmute (M)">🔊</button>
              <input type="range" class="volume-slider" id="player-volume-slider" min="0" max="1" step="0.05" value="${this.volume}">
            </div>

            <div class="player-time-display">
              <span id="player-current-time">0:00</span> / <span>${durationDisplay}</span>
            </div>
          </div>

          <div class="player-controls-right">
            <!-- Eco Toggle -->
            <button class="player-btn ${isEco ? 'active' : ''}" id="btn-player-eco" title="Green Streaming Eco-Mode">🌱</button>
            
            <!-- Loop Video -->
            <button class="player-btn ${this.isLooping ? 'active' : ''}" id="btn-player-loop" title="Loop Video">🔁</button>
            
            <!-- Transcript Toggle -->
            <button class="player-btn" id="btn-player-transcript" title="Transcript & Chapters">📝</button>

            <!-- Subtitles -->
            <button class="player-btn ${this.subtitlesEnabled ? 'active' : ''}" id="btn-subtitles" title="Subtitles (C)">CC</button>
            
            <!-- Settings Menu -->
            <button class="player-btn" id="btn-player-settings" title="Settings">⚙️</button>
            
            <!-- Theater, Mini & Fullscreen -->
            <button class="player-btn" id="btn-theater-mode" title="Theater Mode (T)">🗖</button>
            <button class="player-btn" id="btn-mini-player" title="Miniplayer (I)">⧉</button>
            <button class="player-btn" id="btn-fullscreen" title="Fullscreen (F)">⛶</button>
          </div>
        </div>

        <!-- Settings Popover Menu -->
        <div class="player-settings-popover" id="player-settings-popover">
          <div class="settings-menu-item" id="opt-speed">
            <span>Playback Speed</span>
            <span class="settings-item-value" id="val-speed">${this.playbackRate}x</span>
          </div>
          <div class="settings-menu-item" id="opt-quality">
            <span>Quality & Codec</span>
            <span class="settings-item-value" id="val-quality">${this.currentQuality} (AV1)</span>
          </div>
          <div class="settings-menu-item" id="opt-ambient">
            <span>Ambient Lighting</span>
            <span class="settings-item-value" id="val-ambient">${this.ambientEnabled ? 'On' : 'Off'}</span>
          </div>
          <div class="settings-menu-item" id="opt-shortcuts-btn">
            <span>Keyboard Shortcuts</span>
            <span class="settings-item-value">Shift + ?</span>
          </div>
        </div>
      </div>
    `;
  }

  setupCanvases() {
    this.canvas = document.getElementById('player-main-canvas');
    this.ambientCanvas = document.getElementById('player-ambient-canvas');
    
    if (this.canvas) {
      this.canvas.width = 1280;
      this.canvas.height = 720;
      this.ctx = this.canvas.getContext('2d');
    }

    if (this.ambientCanvas) {
      this.ambientCanvas.width = 320;
      this.ambientCanvas.height = 180;
      this.ambientCtx = this.ambientCanvas.getContext('2d');
    }

    this.drawInitialFrame();
  }

  drawInitialFrame() {
    if (!this.ctx || !this.currentVideo) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.currentVideo.thumbnail;
    img.onload = () => {
      if (this.ctx) {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        if (this.ambientCtx && this.ambientEnabled) {
          this.ambientCtx.drawImage(img, 0, 0, this.ambientCanvas.width, this.ambientCanvas.height);
        }
      }
    };
  }

  startVisualPlayback() {
    let frame = 0;
    const isEco = NayvoState.state.ecoMode;
    const frameSkip = isEco ? 2 : 1;

    const renderLoop = () => {
      if (!this.isPlaying) return;
      frame++;
      
      if (frame % frameSkip === 0 && this.ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        const grad = this.ctx.createLinearGradient(0, 0, w, h);
        const hue = (frame * 0.4) % 360;
        grad.addColorStop(0, `hsl(${hue}, 40%, 11%)`);
        grad.addColorStop(0.5, `hsl(${(hue + 45) % 360}, 45%, 7%)`);
        grad.addColorStop(1, `hsl(${(hue + 90) % 360}, 40%, 14%)`);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, w, h);

        // Animated audio waveform
        this.ctx.save();
        this.ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.65)`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        for (let x = 0; x < w; x += 10) {
          const y = h / 2 + Math.sin((x + frame * 2.5) * 0.015) * 55 * Math.sin(frame * 0.02) + Math.cos(x * 0.005) * 25;
          if (x === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.restore();

        // Watermark & Quality badge
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 22px Outfit, sans-serif';
        this.ctx.fillText(this.currentVideo.title.substring(0, 48) + '...', 40, 50);
        
        this.ctx.fillStyle = isEco ? '#10b981' : '#ff8a00';
        this.ctx.font = '600 13px Outfit, sans-serif';
        this.ctx.fillText(`NAYVO STREAM • ${isEco ? '🌱 GREEN ECO STREAM (AV1)' : '4K ULTRA HD'} • 60 FPS`, 40, 78);

        if (this.ambientCtx && this.ambientEnabled) {
          this.ambientCtx.drawImage(this.canvas, 0, 0, this.ambientCanvas.width, this.ambientCanvas.height);
        }
      }

      this.animationFrameId = requestAnimationFrame(renderLoop);
    };

    this.animationFrameId = requestAnimationFrame(renderLoop);
  }

  bindEvents() {
    const playBtn = document.getElementById('btn-play-pause');
    const surface = document.getElementById('player-surface');
    const scrubber = document.getElementById('player-scrubber');
    const volumeSlider = document.getElementById('player-volume-slider');
    const volumeBtn = document.getElementById('btn-volume-toggle');
    const settingsBtn = document.getElementById('btn-player-settings');
    const theaterBtn = document.getElementById('btn-theater-mode');
    const miniBtn = document.getElementById('btn-mini-player');
    const fullscreenBtn = document.getElementById('btn-fullscreen');
    const ccBtn = document.getElementById('btn-subtitles');
    const ecoBtn = document.getElementById('btn-player-eco');
    const loopBtn = document.getElementById('btn-player-loop');
    const transcriptBtn = document.getElementById('btn-player-transcript');

    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
    if (surface) surface.addEventListener('click', () => this.togglePlay());

    if (scrubber) {
      scrubber.addEventListener('click', (e) => {
        const rect = scrubber.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        this.seek(pct * this.duration);
      });
    }

    if (ecoBtn) {
      ecoBtn.addEventListener('click', () => {
        const isEco = NayvoState.toggleEcoMode();
        ecoBtn.classList.toggle('active', isEco);
        const ind = document.getElementById('player-eco-indicator');
        if (ind) ind.style.display = isEco ? 'flex' : 'none';
        alert(isEco ? '🌱 Eco-Streaming activated! Consuming 45% less power.' : 'Standard Ultra-HD playback enabled.');
      });
    }

    if (loopBtn) {
      loopBtn.addEventListener('click', () => {
        this.isLooping = !this.isLooping;
        loopBtn.classList.toggle('active', this.isLooping);
        alert(this.isLooping ? '🔁 Loop Video enabled' : 'Loop disabled');
      });
    }

    if (transcriptBtn) {
      transcriptBtn.addEventListener('click', () => {
        const drawer = document.getElementById('watch-transcript-drawer');
        if (drawer) drawer.classList.toggle('open');
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => this.setVolume(parseFloat(e.target.value)));
    }
    if (volumeBtn) volumeBtn.addEventListener('click', () => this.toggleMute());

    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        const pop = document.getElementById('player-settings-popover');
        if (pop) pop.classList.toggle('open');
      });
    }

    const shortcutOpt = document.getElementById('opt-shortcuts-btn');
    if (shortcutOpt) {
      shortcutOpt.addEventListener('click', () => {
        const pop = document.getElementById('player-settings-popover');
        if (pop) pop.classList.remove('open');
        const modal = document.getElementById('modal-keyboard-shortcuts');
        if (modal) modal.classList.add('open');
      });
    }

    if (theaterBtn) theaterBtn.addEventListener('click', () => this.toggleTheaterMode());
    if (miniBtn) miniBtn.addEventListener('click', () => this.toggleMiniPlayer());
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    
    if (ccBtn) {
      ccBtn.addEventListener('click', () => {
        this.subtitlesEnabled = !this.subtitlesEnabled;
        ccBtn.classList.toggle('active', this.subtitlesEnabled);
      });
    }
  }

  bindKeyboardShortcuts() {
    this.keyHandler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        const modal = document.getElementById('modal-keyboard-shortcuts');
        if (modal) modal.classList.toggle('open');
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          this.togglePlay();
          break;
        case 'j':
          this.seek(this.currentTime - 10);
          break;
        case 'l':
          this.seek(this.currentTime + 10);
          break;
        case 'm':
          this.toggleMute();
          break;
        case 'f':
          this.toggleFullscreen();
          break;
        case 't':
          this.toggleTheaterMode();
          break;
        case 'i':
          this.toggleMiniPlayer();
          break;
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const playBtn = document.getElementById('btn-play-pause');
    const indicator = document.getElementById('player-center-indicator');
    
    if (playBtn) playBtn.textContent = this.isPlaying ? '⏸' : '▶';

    if (indicator) {
      indicator.textContent = this.isPlaying ? '▶' : '⏸';
      indicator.classList.add('show-anim');
      setTimeout(() => indicator.classList.remove('show-anim'), 350);
    }

    if (this.isPlaying) {
      this.container.classList.remove('paused');
      this.startVisualPlayback();
      this.startProgressTicker();
    } else {
      this.container.classList.add('paused');
      cancelAnimationFrame(this.animationFrameId);
      clearInterval(this.progressInterval);
    }
  }

  startProgressTicker() {
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPlaying) {
        if (this.currentTime < this.duration) {
          this.currentTime += 1 * this.playbackRate;
          this.updateScrubber();
          NayvoState.incrementCarbonSaved(0.8);
        } else if (this.isLooping) {
          this.seek(0);
        }
      }
    }, 1000);
  }

  seek(seconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.updateScrubber();
    NayvoState.recordHistory(this.currentVideo.id, this.currentTime / this.duration);
  }

  updateScrubber() {
    const playedBar = document.getElementById('player-played-bar');
    const thumb = document.getElementById('player-scrubber-thumb');
    const timeDisplay = document.getElementById('player-current-time');
    
    const pct = (this.currentTime / this.duration) * 100;
    if (playedBar) playedBar.style.width = `${pct}%`;
    if (thumb) thumb.style.left = `${pct}%`;
    if (timeDisplay) timeDisplay.textContent = this.formatTime(this.currentTime);

    // Sync Transcript Highlight
    const transcriptItems = document.querySelectorAll('.transcript-line-item');
    transcriptItems.forEach(item => {
      const lineTime = parseInt(item.getAttribute('data-time'), 10);
      if (this.currentTime >= lineTime && this.currentTime < lineTime + 45) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  setVolume(val) {
    this.volume = val;
    this.isMuted = val === 0;
    const volBtn = document.getElementById('btn-volume-toggle');
    if (volBtn) volBtn.textContent = this.isMuted ? '🔇' : (val > 0.5 ? '🔊' : '🔉');
  }

  toggleMute() {
    if (this.isMuted) this.setVolume(0.85);
    else this.setVolume(0);
  }

  toggleTheaterMode() {
    this.isTheaterMode = !this.isTheaterMode;
    if (this.container) this.container.classList.toggle('theater-mode', this.isTheaterMode);
  }

  toggleMiniPlayer() {
    this.isMiniPlayer = !this.isMiniPlayer;
    let miniEl = document.getElementById('global-mini-player');
    if (this.isMiniPlayer) {
      if (!miniEl) {
        miniEl = document.createElement('div');
        miniEl.id = 'global-mini-player';
        miniEl.className = 'mini-player-container active';
        miniEl.innerHTML = `
          <div class="mini-player-close-btn" id="close-mini-player">✕</div>
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 13px; background: #0b101d; padding: 12px;">
            ${this.currentVideo.title}
          </div>
        `;
        document.body.appendChild(miniEl);
        document.getElementById('close-mini-player').addEventListener('click', () => {
          miniEl.classList.remove('active');
          this.isMiniPlayer = false;
        });
      } else {
        miniEl.classList.add('active');
      }
    } else if (miniEl) {
      miniEl.classList.remove('active');
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  }

  formatTime(totalSeconds) {
    const s = Math.floor(totalSeconds % 60);
    const m = Math.floor((totalSeconds / 60) % 60);
    const h = Math.floor(totalSeconds / 3600);
    const sStr = s < 10 ? '0' + s : s;
    if (h > 0) {
      const mStr = m < 10 ? '0' + m : m;
      return `${h}:${mStr}:${sStr}`;
    }
    return `${m}:${sStr}`;
  }

  destroy() {
    this.isPlaying = false;
    cancelAnimationFrame(this.animationFrameId);
    clearInterval(this.progressInterval);
    if (this.keyHandler) window.removeEventListener('keydown', this.keyHandler);
  }
}

window.NayvoPlayerEngine = new NayvoPlayer();
window.MayaviPlayerEngine = window.NayvoPlayerEngine; // Backward compatibility alias
