// NAYVO Shorts Vertical Feed & Reel Player Engine

class NayvoShortsEngine {
  constructor() {
    this.container = null;
    this.currentIndex = 0;
    this.shorts = [];
    this.isScrolling = false;
    this.touchStartY = 0;
  }

  init(containerElement, initialIndex = 0) {
    this.container = containerElement;
    this.shorts = NayvoState.state.shorts || [];
    this.currentIndex = Math.max(0, Math.min(this.shorts.length - 1, initialIndex));
    
    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="shorts-feed-viewport" id="shorts-viewport">
        ${this.shorts.map((short, idx) => this.buildShortSlideHTML(short, idx)).join('')}
      </div>
    `;

    this.scrollToShort(this.currentIndex, false);
  }

  buildShortSlideHTML(short, index) {
    const channel = NayvoState.state.channels[short.channelId] || { name: 'Creator', avatar: '' };
    const isSubscribed = NayvoState.isSubscribed(short.channelId);
    const isLiked = NayvoState.state.likedVideoIds.includes(short.id);

    return `
      <div class="short-slide-card" id="short-slide-${index}" data-index="${index}">
        <div class="short-media-wrapper">
          <img src="${short.videoUrl}" class="short-media-bg" alt="${short.title}">
          <div class="short-center-pulse">▶</div>

          <div class="short-overlay-info">
            <div class="short-creator-row">
              <img src="${channel.avatar}" class="short-creator-avatar" alt="${channel.name}">
              <span class="short-creator-name">${channel.name}</span>
              <button class="short-sub-btn ${isSubscribed ? 'subscribed' : ''}" onclick="NayvoShorts.toggleSub('${short.channelId}', ${index})">
                ${isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div class="short-title-text">${short.title}</div>
            
            <div class="short-audio-track">
              <span>🎵</span>
              <div class="short-audio-marquee">${short.soundTitle || 'Original Audio'}</div>
            </div>
          </div>
        </div>

        <div class="short-action-rail">
          <div class="short-action-pill ${isLiked ? 'active' : ''}" onclick="NayvoShorts.toggleLike('${short.id}', ${index})">
            <div class="short-rail-icon">👍</div>
            <span class="short-rail-label">${NayvoI18n.formatViews(short.likes)}</span>
          </div>

          <div class="short-action-pill" onclick="NayvoShorts.openComments('${short.id}')">
            <div class="short-rail-icon">💬</div>
            <span class="short-rail-label">${short.commentsCount || 0}</span>
          </div>

          <div class="short-action-pill" onclick="NayvoApp.openShareModal('${short.id}', true)">
            <div class="short-rail-icon">↗</div>
            <span class="short-rail-label">Share</span>
          </div>

          <div class="short-action-pill" onclick="NayvoApp.openUpaharModal('${short.id}')">
            <div class="short-rail-icon" style="color: var(--accent-saffron);">🎁</div>
            <span class="short-rail-label">Tip</span>
          </div>

          <div class="short-action-disc">
            <img src="${channel.avatar}" alt="Sound">
          </div>
        </div>
      </div>
    `;
  }

  scrollToShort(index, smooth = true) {
    const target = document.getElementById(`short-slide-${index}`);
    if (target) {
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      this.currentIndex = index;
      NayvoState.state.currentShortIndex = index;
    }
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (NayvoState.state.currentView !== 'shorts') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.nextShort();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.prevShort();
      }
    });

    if (this.container) {
      this.container.addEventListener('wheel', (e) => {
        if (this.isScrolling) return;
        this.isScrolling = true;
        
        if (e.deltaY > 30) this.nextShort();
        else if (e.deltaY < -30) this.prevShort();

        setTimeout(() => { this.isScrolling = false; }, 400);
      }, { passive: true });

      this.container.addEventListener('touchstart', (e) => {
        this.touchStartY = e.touches[0].clientY;
      }, { passive: true });

      this.container.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = this.touchStartY - touchEndY;
        if (Math.abs(diff) > 50) {
          if (diff > 0) this.nextShort();
          else this.prevShort();
        }
      }, { passive: true });
    }
  }

  nextShort() {
    if (this.currentIndex < this.shorts.length - 1) {
      this.scrollToShort(this.currentIndex + 1);
    }
  }

  prevShort() {
    if (this.currentIndex > 0) {
      this.scrollToShort(this.currentIndex - 1);
    }
  }

  toggleSub(channelId, index) {
    NayvoState.toggleSubscribe(channelId);
    this.render();
  }

  toggleLike(shortId, index) {
    NayvoState.toggleLikeVideo(shortId);
    this.render();
  }

  openComments(shortId) {
    alert(`Comments for short ${shortId}`);
  }
}

window.NayvoShorts = new NayvoShortsEngine();
window.MayaviShorts = window.NayvoShorts; // Backward compatibility alias
