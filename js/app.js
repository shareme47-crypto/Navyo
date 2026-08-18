// NAYVO Master Application Orchestrator & Client-Side Router

class NayvoApplication {
  constructor() {
    this.currentRoute = 'home';
    this.routeParams = {};
    this.mainViewport = null;
  }

  init() {
    this.mainViewport = document.getElementById('nayvo-viewport-content') || document.getElementById('mayavi-viewport-content');
    
    // Set initial theme
    const savedTheme = NayvoState.state.theme || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Apply translations
    NayvoI18n.applyTranslations();

    // Bind Global Header & Navigation Events
    this.bindHeaderEvents();
    this.bindSidebarEvents();
    this.bindMobileNavEvents();
    this.bindModalBackdrops();

    // Listen for state changes
    window.addEventListener('nayvo_state_changed', () => this.handleStateChange());
    window.addEventListener('nayvo_lang_changed', () => {
      NayvoI18n.applyTranslations();
      this.refreshCurrentRoute();
    });

    // Handle initial route
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(hash);
  }

  navigateTo(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    NayvoState.state.currentView = route;

    // Update active state in sidebar and mobile nav
    this.updateActiveNavLinks(route);

    // Render corresponding view
    switch (route) {
      case 'home':
        this.renderHome();
        break;
      case 'open-vault':
        this.renderOpenVault();
        break;
      case 'explore':
        this.renderExplore();
        break;
      case 'trending':
        this.renderTrending();
        break;
      case 'watch':
        this.renderWatch(params.videoId || NayvoState.state.currentVideoId);
        break;
      case 'shorts':
        this.renderShorts();
        break;
      case 'subscriptions':
        this.renderSubscriptions();
        break;
      case 'channel':
        this.renderChannel(params.channelId || 'ch-open-vault');
        break;
      case 'history':
        this.renderHistory();
        break;
      case 'watch-later':
        this.renderWatchLater();
        break;
      case 'liked':
        this.renderLiked();
        break;
      case 'playlists':
        this.renderPlaylists();
        break;
      case 'search':
        this.renderSearch(params.query || NayvoState.state.searchQuery);
        break;
      case 'studio':
        this.renderStudio();
        break;
      case 'admin':
        this.renderAdmin();
        break;
      default:
        this.renderHome();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  refreshCurrentRoute() {
    this.navigateTo(this.currentRoute, this.routeParams);
  }

  updateActiveNavLinks(route) {
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const itemRoute = item.getAttribute('data-route');
      item.classList.toggle('active', itemRoute === route);
    });

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      const itemRoute = item.getAttribute('data-route');
      item.classList.toggle('active', itemRoute === route);
    });
  }

  // 1. HOME VIEW
  renderHome() {
    const activeCat = NayvoState.state.activeCategory || 'all';
    let videos = NayvoState.state.videos;
    if (activeCat !== 'all') {
      videos = videos.filter(v => v.category === activeCat);
    }
    const shorts = NayvoState.state.shorts;

    this.mainViewport.innerHTML = `
      <!-- Topic Chips Filter Bar -->
      <div class="topic-chips-bar" id="home-topic-chips">
        ${NAYVO_CATEGORIES.map(c => `
          <button class="topic-chip ${c.id === activeCat ? 'active' : ''}" data-cat="${c.id}">
            <span>${c.icon}</span>
            <span>${NayvoI18n.t(c.nameKey) || c.id}</span>
          </button>
        `).join('')}
      </div>

      <!-- Main Video Grid -->
      <div class="videos-grid" id="main-videos-grid">
        ${videos.map(v => this.buildVideoCardHTML(v)).join('')}
      </div>

      <!-- Shorts Shelf Section -->
      <div class="shorts-shelf-section">
        <div class="section-header">
          <div class="section-title">
            <span style="color: var(--accent-red);">⚡</span>
            <span>Nayvo Shorts</span>
          </div>
          <button class="action-btn-secondary" onclick="NayvoApp.navigateTo('shorts')">View All Shorts →</button>
        </div>

        <div class="shorts-shelf-grid">
          ${shorts.map((s, idx) => `
            <div class="short-card-item" onclick="NayvoApp.navigateTo('shorts', { index: ${idx} })">
              <img src="${s.thumbnail}" alt="${s.title}">
              <div class="short-card-overlay">
                <div class="short-card-title">${s.title}</div>
                <div class="short-card-views">${NayvoI18n.formatViews(s.views)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.mainViewport.querySelectorAll('.topic-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-cat');
        NayvoState.state.activeCategory = cat;
        this.renderHome();
      });
    });
  }

  // 2. OPEN VAULT / FREE MOVIES & CREATIVE COMMONS HUB
  renderOpenVault() {
    const freeVideos = NayvoState.state.videos.filter(v => v.category === 'openVault');

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div class="trending-banner" style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(16, 185, 129, 0.15)); border-color: var(--accent-teal);">
          <div>
            <h1 style="font-size: 26px; font-weight: 800;">🏛️ Nayvo Open Vault (100% Free & Creative Commons)</h1>
            <p style="color: var(--text-secondary); font-size: 14px; margin-top: 6px;">
              Zero copyright strikes, zero paywalls. Enjoy public domain historical monuments, open-source 4K films, and CC-BY music freely preserved for creators and viewers.
            </p>
          </div>
          <div style="font-size: 12px; font-weight: 800; color: var(--accent-green); background: rgba(16, 185, 129, 0.2); padding: 8px 16px; border-radius: var(--radius-full);">
            ROYALTY FREE & PUBLIC DOMAIN
          </div>
        </div>

        <h2 style="font-size: 20px; font-weight: 800; margin: 24px 0 16px;">Featured Free Movies & Heritage Films</h2>
        <div class="videos-grid">
          ${freeVideos.map(v => this.buildVideoCardHTML(v)).join('')}
        </div>
      </div>
    `;
  }

  // 3. WATCH PAGE VIEW
  renderWatch(videoId) {
    const video = NayvoState.state.videos.find(v => v.id === videoId) || NayvoState.state.videos[0];
    NayvoState.state.currentVideoId = video.id;
    const channel = NayvoState.state.channels[video.channelId] || {
      name: 'Creator', handle: '@creator', avatar: '', subscribers: 100000
    };
    const isSubscribed = NayvoState.isSubscribed(video.channelId);
    const isLiked = NayvoState.state.likedVideoIds.includes(video.id);
    const isDisliked = NayvoState.state.dislikedVideoIds.includes(video.id);
    const commentsList = NayvoState.state.comments[video.id] || [];
    const relatedVideos = NayvoState.state.videos.filter(v => v.id !== video.id);

    this.mainViewport.innerHTML = `
      <div class="watch-page-container">
        <!-- Primary Column: Player & Info -->
        <div class="watch-primary-column">
          <div class="player-wrapper" id="nayvo-player-root"></div>

          <h1 class="watch-video-title">${video.title}</h1>

          <!-- Creator & Engagement Action Bar -->
          <div class="watch-action-bar">
            <div class="creator-info-group">
              <div class="creator-avatar-link" onclick="NayvoApp.navigateTo('channel', { channelId: '${channel.id}' })" style="cursor: pointer;">
                <img src="${channel.avatar}" alt="${channel.name}">
              </div>
              <div class="creator-text-details">
                <div class="creator-channel-name" onclick="NayvoApp.navigateTo('channel', { channelId: '${channel.id}' })" style="cursor: pointer;">
                  ${channel.name}
                  ${channel.verified ? '<span class="verified-icon">✓</span>' : ''}
                </div>
                <div class="creator-sub-count">${NayvoI18n.formatSubscribers(channel.subscribers)}</div>
              </div>

              <div class="creator-buttons-group">
                <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" id="btn-watch-subscribe">
                  ${isSubscribed ? 'Subscribed 🔔' : 'Subscribe'}
                </button>
                <button class="join-membership-btn" onclick="alert('Join Kala Club for ${channel.name} to unlock exclusive badges and perks!')">Join</button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="video-actions-group">
              <div class="like-dislike-pill">
                <button class="action-pill-btn ${isLiked ? 'active' : ''}" id="btn-watch-like">
                  <span>👍</span>
                  <span id="watch-like-count">${NayvoI18n.formatViews(video.likes)}</span>
                </button>
                <div class="action-pill-divider"></div>
                <button class="action-pill-btn ${isDisliked ? 'active' : ''}" id="btn-watch-dislike">
                  <span>👎</span>
                </button>
              </div>

              <button class="action-btn-secondary upahar-superchat-btn" id="btn-watch-upahar">
                <span>🎁</span>
                <span>Upahar / Tip</span>
              </button>

              <button class="action-btn-secondary" id="btn-watch-clip">
                <span>✂️</span>
                <span>Clip</span>
              </button>

              <button class="action-btn-secondary" id="btn-watch-download">
                <span>⬇️</span>
                <span>Download</span>
              </button>

              <button class="action-btn-secondary" id="btn-watch-share">
                <span>↗</span>
                <span>Share</span>
              </button>

              <button class="action-btn-secondary" id="btn-watch-playlist">
                <span>➕</span>
                <span>Save</span>
              </button>
            </div>
          </div>

          <!-- Interactive Transcript Drawer -->
          <div class="watch-transcript-drawer" id="watch-transcript-drawer">
            <div class="transcript-header">
              <span>📝 Interactive Transcript</span>
              <button class="action-btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="document.getElementById('watch-transcript-drawer').classList.remove('open')">Close</button>
            </div>
            <div class="transcript-lines-box">
              ${(video.transcript || [
                { time: 0, text: 'Welcome to this Nayvo presentation.' },
                { time: 30, text: 'Enjoy high-speed, green-cached streaming.' }
              ]).map(line => `
                <div class="transcript-line-item" data-time="${line.time}" onclick="NayvoPlayerEngine.seek(${line.time})">
                  <span class="transcript-time-badge">${NayvoPlayerEngine.formatTime(line.time)}</span>
                  <span>${line.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Description Card -->
          <div class="watch-description-card" id="watch-desc-box">
            <div class="description-meta-header">
              <span>${NayvoI18n.formatViews(video.views)}</span>
              <span>•</span>
              <span>${video.uploadTime}</span>
              <span>•</span>
              <span style="color: var(--accent-teal);">${video.quality || '4K Ultra HD'}</span>
            </div>
            <div class="description-text-body" id="desc-text-body">
              ${this.formatDescriptionWithTimestamps(video.description)}
            </div>
            <span class="description-toggle-btn" id="desc-toggle-btn">Show more</span>
          </div>

          <!-- Comments Section -->
          <div class="watch-comments-section">
            <div class="comments-header-bar">
              <div class="comments-total-count">${commentsList.length} Comments</div>
              <div class="comments-sort-selector">
                <span>≡</span>
                <span>Sort by: Top comments</span>
              </div>
            </div>

            <!-- Add Comment Form -->
            <div class="add-comment-form">
              <img src="${NayvoState.state.currentUser.avatar}" class="user-comment-avatar" alt="You">
              <div class="comment-input-wrap">
                <textarea class="comment-input-field" id="new-comment-input" placeholder="Add a comment..."></textarea>
                <div class="comment-form-actions">
                  <button class="action-btn-secondary" id="btn-cancel-comment">Cancel</button>
                  <button class="comment-submit-btn" id="btn-submit-comment">Comment</button>
                </div>
              </div>
            </div>

            <!-- Comments List -->
            <div class="comments-list-group" id="comments-list-container">
              ${commentsList.map(c => this.buildCommentHTML(c, video.id)).join('')}
            </div>
          </div>
        </div>

        <!-- Secondary Column: Up Next & Recommendations -->
        <div class="watch-secondary-column">
          <div class="up-next-header">
            <div class="up-next-title">Up Next</div>
            <div class="autoplay-toggle-wrap">
              <span>Autoplay</span>
              <div class="toggle-switch active" id="autoplay-switch">
                <div class="toggle-switch-handle"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${relatedVideos.map(rv => `
              <div class="compact-video-card" onclick="NayvoApp.navigateTo('watch', { videoId: '${rv.id}' })">
                <div class="compact-thumbnail-wrap">
                  <img src="${rv.thumbnail}" alt="${rv.title}">
                  <span class="video-duration-badge">${rv.durationStr}</span>
                </div>
                <div class="compact-info">
                  <div class="compact-title">${rv.title}</div>
                  <div class="compact-channel">${(NayvoState.state.channels[rv.channelId] || {}).name || ''}</div>
                  <div class="compact-views">${NayvoI18n.formatViews(rv.views)} • ${rv.uploadTime}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Initialize player engine
    const playerRoot = document.getElementById('nayvo-player-root');
    NayvoPlayerEngine.init(playerRoot, video);

    this.bindWatchPageEvents(video);
  }

  bindWatchPageEvents(video) {
    const subBtn = document.getElementById('btn-watch-subscribe');
    const likeBtn = document.getElementById('btn-watch-like');
    const dislikeBtn = document.getElementById('btn-watch-dislike');
    const upaharBtn = document.getElementById('btn-watch-upahar');
    const clipBtn = document.getElementById('btn-watch-clip');
    const downloadBtn = document.getElementById('btn-watch-download');
    const shareBtn = document.getElementById('btn-watch-share');
    const playlistBtn = document.getElementById('btn-watch-playlist');
    const descBox = document.getElementById('watch-desc-box');
    const descToggle = document.getElementById('desc-toggle-btn');
    const submitCommentBtn = document.getElementById('btn-submit-comment');
    const commentInput = document.getElementById('new-comment-input');

    if (subBtn) {
      subBtn.addEventListener('click', () => {
        const isSub = NayvoState.toggleSubscribe(video.channelId);
        subBtn.classList.toggle('subscribed', isSub);
        subBtn.textContent = isSub ? 'Subscribed 🔔' : 'Subscribe';
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        NayvoState.toggleLikeVideo(video.id);
        const countSpan = document.getElementById('watch-like-count');
        const isLiked = NayvoState.state.likedVideoIds.includes(video.id);
        likeBtn.classList.toggle('active', isLiked);
        if (countSpan) countSpan.textContent = NayvoI18n.formatViews(video.likes);
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener('click', () => {
        NayvoState.toggleDislikeVideo(video.id);
        const isDisliked = NayvoState.state.dislikedVideoIds.includes(video.id);
        dislikeBtn.classList.toggle('active', isDisliked);
      });
    }

    if (upaharBtn) upaharBtn.addEventListener('click', () => this.openUpaharModal(video.id));
    if (clipBtn) clipBtn.addEventListener('click', () => this.openClipModal(video.id));
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        alert('💾 Video saved to Nayvo Offline Storage! Available without network connectivity.');
      });
    }

    if (shareBtn) shareBtn.addEventListener('click', () => this.openShareModal(video.id));
    if (playlistBtn) playlistBtn.addEventListener('click', () => this.openPlaylistModal(video.id));

    if (descBox && descToggle) {
      descBox.addEventListener('click', () => {
        descBox.classList.toggle('expanded');
        descToggle.textContent = descBox.classList.contains('expanded') ? 'Show less' : 'Show more';
      });
    }

    document.querySelectorAll('.timestamp-seek-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const sec = parseInt(link.getAttribute('data-time'), 10);
        if (!isNaN(sec)) NayvoPlayerEngine.seek(sec);
      });
    });

    if (submitCommentBtn && commentInput) {
      submitCommentBtn.addEventListener('click', () => {
        const text = commentInput.value;
        if (text && text.trim()) {
          const newComment = NayvoState.addComment(video.id, text);
          commentInput.value = '';
          const list = document.getElementById('comments-list-container');
          if (list && newComment) {
            list.insertAdjacentHTML('afterbegin', this.buildCommentHTML(newComment, video.id));
          }
        }
      });
    }
  }

  // 4. SHORTS VIEW
  renderShorts() {
    this.mainViewport.innerHTML = `<div id="shorts-engine-container"></div>`;
    const container = document.getElementById('shorts-engine-container');
    const initIdx = this.routeParams.index || 0;
    NayvoShorts.init(container, initIdx);
  }

  // 5. EXPLORE VIEW
  renderExplore() {
    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">Explore Hubs</h1>
        
        <div class="explore-grid-hub">
          ${NAYVO_CATEGORIES.filter(c => c.id !== 'all').map(c => `
            <div class="explore-category-card" onclick="NayvoApp.filterByCategory('${c.id}')">
              <span class="explore-category-icon">${c.icon}</span>
              <span class="explore-category-title">${NayvoI18n.t(c.nameKey) || c.id}</span>
            </div>
          `).join('')}
        </div>

        <h2 style="font-size: 20px; font-weight: 800; margin: 32px 0 16px;">Trending Now in India</h2>
        <div class="videos-grid">
          ${NayvoState.state.videos.slice(0, 6).map(v => this.buildVideoCardHTML(v)).join('')}
        </div>
      </div>
    `;
  }

  filterByCategory(catId) {
    NayvoState.state.activeCategory = catId;
    this.navigateTo('home');
  }

  // 6. TRENDING VIEW
  renderTrending() {
    const videos = [...NayvoState.state.videos].sort((a, b) => b.views - a.views);

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div class="trending-banner">
          <div>
            <h1 style="font-size: 24px; font-weight: 800;">🔥 Trending on Nayvo</h1>
            <p style="color: var(--text-secondary); font-size: 13.5px; margin-top: 4px;">Top videos gaining momentum across Indian languages and globally</p>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: var(--accent-saffron); background: var(--accent-saffron-glow); padding: 6px 14px; border-radius: var(--radius-full);">
            UPDATED HOURLY
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${videos.map((v, idx) => `
            <div style="display: flex; align-items: center; gap: 16px; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="NayvoApp.navigateTo('watch', { videoId: '${v.id}' })">
              <div class="trending-rank-num">#${idx + 1}</div>
              <div style="width: 220px; aspect-ratio: 16/9; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
                <img src="${v.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                <h3 style="font-size: 16px; font-weight: 700;">${v.title}</h3>
                <div style="font-size: 13px; color: var(--text-secondary);">${(NayvoState.state.channels[v.channelId] || {}).name || ''}</div>
                <div style="font-size: 12px; color: var(--text-muted);">${NayvoI18n.formatViews(v.views)} • ${v.uploadTime}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 7. SUBSCRIPTIONS VIEW
  renderSubscriptions() {
    const subChannelIds = NayvoState.state.subscriptions;
    const videos = NayvoState.state.videos.filter(v => subChannelIds.includes(v.channelId));

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">Latest from Subscriptions</h1>
        
        <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle);">
          ${subChannelIds.map(cid => {
            const ch = NayvoState.state.channels[cid] || { name: 'Channel', avatar: '' };
            return `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0;" onclick="NayvoApp.navigateTo('channel', { channelId: '${cid}' })">
                <img src="${ch.avatar}" style="width: 56px; height: 56px; border-radius: var(--radius-full); border: 2px solid var(--accent-saffron); object-fit: cover;">
                <span style="font-size: 11.5px; color: var(--text-primary); font-weight: 600; max-width: 70px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ch.name}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="videos-grid">
          ${videos.map(v => this.buildVideoCardHTML(v)).join('')}
        </div>
      </div>
    `;
  }

  // 8. CHANNEL PROFILE VIEW WITH COMMUNITY POSTS & POLLS
  renderChannel(channelId) {
    const channel = NayvoState.state.channels[channelId] || NayvoState.state.channels['ch-open-vault'];
    const isSubscribed = NayvoState.isSubscribed(channel.id);
    const videos = NayvoState.state.videos.filter(v => v.channelId === channel.id);
    const posts = NAYVO_DATA.communityPosts.filter(p => p.channelId === channel.id);

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div style="width: 100%; height: 220px; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 20px; background: var(--bg-surface);">
          <img src="${channel.banner}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 20px;">
            <img src="${channel.avatar}" style="width: 90px; height: 90px; border-radius: var(--radius-full); border: 2px solid var(--border-active); object-fit: cover;">
            <div>
              <h1 style="font-size: 24px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                ${channel.name}
                ${channel.verified ? '<span class="verified-icon">✓</span>' : ''}
              </h1>
              <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                ${channel.handle} • ${NayvoI18n.formatSubscribers(channel.subscribers)} • ${channel.videoCount || videos.length} videos
              </div>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px; max-width: 600px;">${channel.description}</p>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" onclick="NayvoApp.toggleChannelSub('${channel.id}')">
              ${isSubscribed ? 'Subscribed 🔔' : 'Subscribe'}
            </button>
            <button class="join-membership-btn" onclick="alert('Join Kala Club for exclusive perks!')">Join</button>
          </div>
        </div>

        <!-- Channel Navigation Tabs -->
        <div style="display: flex; gap: 24px; border-bottom: 1px solid var(--border-subtle); padding: 12px 0; font-weight: 700; font-size: 14px;">
          <span style="color: var(--accent-saffron); border-bottom: 2px solid var(--accent-saffron); padding-bottom: 8px; cursor: pointer;">Videos</span>
          <span style="color: var(--text-secondary); cursor: pointer;" onclick="alert('Viewing Channel Shorts')">Shorts</span>
          <span style="color: var(--text-secondary); cursor: pointer;" onclick="alert('Viewing Channel Playlists')">Playlists</span>
          <span style="color: var(--text-secondary); cursor: pointer;">Community</span>
          <span style="color: var(--text-secondary); cursor: pointer;">About</span>
        </div>

        <!-- Community Post / Poll (if any) -->
        ${posts.map(p => `
          <div style="margin-top: 20px; background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
              <img src="${channel.avatar}" style="width: 38px; height: 38px; border-radius: var(--radius-full);">
              <div>
                <strong style="font-size: 14px;">${channel.name}</strong>
                <div style="font-size: 12px; color: var(--text-muted);">${p.timestamp}</div>
              </div>
            </div>
            <p style="font-size: 14px; line-height: 1.5; color: var(--text-primary);">${p.text}</p>

            ${p.poll ? `
              <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
                <strong style="font-size: 13.5px; color: var(--text-secondary);">${p.poll.question}</strong>
                ${p.poll.options.map(opt => `
                  <div style="padding: 10px 14px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-card); display: flex; justify-content: space-between; cursor: pointer;" onclick="NayvoState.voteInPoll('${p.id}', '${opt.id}'); alert('Vote counted: ${opt.label}');">
                    <span>${opt.label}</span>
                    <strong style="color: var(--accent-saffron);">${opt.idStr}</strong>
                  </div>
                `).join('')}
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${p.poll.totalVotes.toLocaleString()} votes</div>
              </div>
            ` : ''}
          </div>
        `).join('')}

        <div class="videos-grid" style="margin-top: 24px;">
          ${videos.map(v => this.buildVideoCardHTML(v)).join('')}
        </div>
      </div>
    `;
  }

  toggleChannelSub(channelId) {
    NayvoState.toggleSubscribe(channelId);
    this.renderChannel(channelId);
  }

  // 9. HISTORY VIEW
  renderHistory() {
    const history = NayvoState.state.watchHistory;
    const historyVideos = history.map(h => {
      const v = NayvoState.state.videos.find(vid => vid.id === h.videoId);
      return v ? { ...v, progress: h.progress } : null;
    }).filter(Boolean);

    this.mainViewport.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; gap: 32px;">
        <div style="flex: 1;">
          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">Watch History (${historyVideos.length})</h1>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${historyVideos.length === 0 ? '<p style="color: var(--text-muted);">No watch history yet.</p>' : ''}
            ${historyVideos.map(v => `
              <div style="display: flex; gap: 16px; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="NayvoApp.navigateTo('watch', { videoId: '${v.id}' })">
                <div style="width: 220px; aspect-ratio: 16/9; border-radius: var(--radius-md); overflow: hidden; position: relative; flex-shrink: 0;">
                  <img src="${v.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;">
                  <span class="video-duration-badge">${v.durationStr}</span>
                  <div class="video-progress-bar"><div class="video-progress-fill" style="width: ${(v.progress || 0) * 100}%;"></div></div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                  <h3 style="font-size: 15px; font-weight: 700;">${v.title}</h3>
                  <div style="font-size: 13px; color: var(--text-secondary);">${(NayvoState.state.channels[v.channelId] || {}).name || ''}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${NayvoI18n.formatViews(v.views)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="width: 280px; flex-shrink: 0; background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-subtle); height: fit-content; display: flex; flex-direction: column; gap: 12px;">
          <h3 style="font-weight: 700; font-size: 15px;">History Controls</h3>
          <button class="action-btn-secondary" onclick="NayvoState.clearHistory(); NayvoApp.renderHistory();">🗑️ Clear all watch history</button>
          <button class="action-btn-secondary">⏸️ Pause watch history</button>
        </div>
      </div>
    `;
  }

  // 10. WATCH LATER VIEW
  renderWatchLater() {
    const wlIds = NayvoState.state.watchLaterIds;
    const videos = NayvoState.state.videos.filter(v => wlIds.includes(v.id));

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">Watch Later (${videos.length})</h1>
        <div class="videos-grid">
          ${videos.map(v => this.buildVideoCardHTML(v)).join('')}
        </div>
      </div>
    `;
  }

  // 11. LIKED VIDEOS VIEW
  renderLiked() {
    const likedIds = NayvoState.state.likedVideoIds;
    const videos = NayvoState.state.videos.filter(v => likedIds.includes(v.id));

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">Liked Videos (${videos.length})</h1>
        <div class="videos-grid">
          ${videos.map(v => this.buildVideoCardHTML(v)).join('')}
        </div>
      </div>
    `;
  }

  // 12. PLAYLISTS VIEW
  renderPlaylists() {
    const playlists = [...NayvoState.state.userPlaylists, ...NAYVO_DATA.playlists];

    this.mainViewport.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 800;">Playlists</h1>
          <button class="action-btn-pill" onclick="NayvoApp.openCreatePlaylistPrompt()">+ NEW PLAYLIST</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${playlists.map(pl => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;" onclick="NayvoApp.playPlaylist('${pl.id}')">
              <div style="width: 100%; aspect-ratio: 16/9; position: relative;">
                <img src="${pl.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 0; right: 0; background: rgba(0,0,0,0.8); padding: 4px 10px; font-size: 12px; font-weight: 700; border-top-left-radius: var(--radius-md);">
                  ▶ ${(pl.videoIds || []).length} videos
                </div>
              </div>
              <div style="padding: 14px;">
                <h3 style="font-size: 15px; font-weight: 700;">${pl.title}</h3>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${pl.author} • ${pl.privacy}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  openCreatePlaylistPrompt() {
    const title = prompt('Enter new playlist title:');
    if (title && title.trim()) {
      NayvoState.createPlaylist(title);
      this.renderPlaylists();
    }
  }

  playPlaylist(playlistId) {
    const all = [...NayvoState.state.userPlaylists, ...NAYVO_DATA.playlists];
    const pl = all.find(p => p.id === playlistId);
    if (pl && pl.videoIds && pl.videoIds.length > 0) {
      this.navigateTo('watch', { videoId: pl.videoIds[0] });
    }
  }

  // 13. SEARCH VIEW
  renderSearch(query) {
    NayvoState.state.searchQuery = query || '';
    const q = (query || '').toLowerCase().trim();
    const results = NayvoState.state.videos.filter(v => 
      v.title.toLowerCase().includes(q) || 
      v.description.toLowerCase().includes(q) || 
      v.category.toLowerCase().includes(q)
    );

    this.mainViewport.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        <h1 style="font-size: 20px; font-weight: 800; margin-bottom: 20px;">
          Search Results for "${query}" (${results.length} found)
        </h1>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${results.length === 0 ? '<p style="color: var(--text-muted);">No videos found matching your query.</p>' : ''}
          ${results.map(v => `
            <div style="display: flex; gap: 18px; background: var(--bg-surface); padding: 14px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="NayvoApp.navigateTo('watch', { videoId: '${v.id}' })">
              <div style="width: 280px; aspect-ratio: 16/9; border-radius: var(--radius-md); overflow: hidden; position: relative; flex-shrink: 0;">
                <img src="${v.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;">
                <span class="video-duration-badge">${v.durationStr}</span>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <h3 style="font-size: 16px; font-weight: 700; line-height: 1.35;">${v.title}</h3>
                <div style="font-size: 12.5px; color: var(--text-muted);">${NayvoI18n.formatViews(v.views)} • ${v.uploadTime}</div>
                <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
                  <img src="${(NayvoState.state.channels[v.channelId] || {}).avatar || ''}" style="width: 24px; height: 24px; border-radius: var(--radius-full);">
                  <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">${(NayvoState.state.channels[v.channelId] || {}).name || ''}</span>
                </div>
                <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${v.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 14. STUDIO VIEW
  renderStudio() {
    this.mainViewport.innerHTML = `<div id="studio-root-container"></div>`;
    const container = document.getElementById('studio-root-container');
    NayvoStudio.init(container);
  }

  // 15. ADMIN VIEW
  renderAdmin() {
    this.mainViewport.innerHTML = `<div id="admin-root-container"></div>`;
    const container = document.getElementById('admin-root-container');
    NayvoAdmin.init(container);
  }

  // Helper Card Builder
  buildVideoCardHTML(v) {
    const channel = NayvoState.state.channels[v.channelId] || { name: 'Channel', avatar: '', verified: false };
    const isLive = v.isLive;

    return `
      <div class="video-card" onclick="NayvoApp.navigateTo('watch', { videoId: '${v.id}' })">
        <div class="video-thumbnail-wrap">
          <img src="${v.thumbnail}" alt="${v.title}" loading="lazy">
          ${isLive ? `
            <div class="live-badge"><span>●</span> LIVE</div>
          ` : `
            <div class="video-duration-badge">${v.durationStr}</div>
          `}
          ${v.quality ? `<div class="quality-badge">${v.quality}</div>` : ''}
        </div>

        <div class="video-card-meta">
          <img src="${channel.avatar}" class="video-channel-avatar" alt="${channel.name}">
          <div class="video-info">
            <div class="video-title">${v.title}</div>
            <div class="video-channel-name">
              ${channel.name}
              ${channel.verified ? '<span class="verified-icon">✓</span>' : ''}
            </div>
            <div class="video-stats-line">
              <span>${isLive ? `${NayvoI18n.formatViews(v.concurrentViewers || 1000)} watching` : NayvoI18n.formatViews(v.views)}</span>
              <span class="stats-dot">•</span>
              <span>${v.uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  buildCommentHTML(c, videoId) {
    return `
      <div class="comment-item" id="comment-${c.id}">
        <div class="comment-avatar-wrap">
          <img src="${c.authorAvatar}" alt="${c.authorName}">
        </div>
        <div class="comment-content-wrap">
          ${c.isPinned ? `<div class="comment-pinned-badge">📌 ${NayvoI18n.t('pinnedBy')} Creator</div>` : ''}
          <div class="comment-author-line">
            <span class="comment-author-name">${c.authorName}</span>
            <span class="comment-time">${c.timestamp}</span>
          </div>
          <div class="comment-text">${c.text}</div>
          <div class="comment-actions-bar">
            <div class="comment-action-btn" onclick="NayvoApp.likeComment('${videoId}', '${c.id}')">
              <span>👍</span>
              <span>${c.likes || 0}</span>
            </div>
            <div class="comment-action-btn"><span>👎</span></div>
            ${c.isHearted ? `<div class="creator-heart-badge">❤️ Creator</div>` : ''}
            <div class="comment-action-btn" onclick="NayvoApp.toggleReplyBox('${c.id}')">Reply</div>
          </div>

          <div class="comment-replies-wrap" id="replies-wrap-${c.id}">
            ${(c.replies || []).map(r => `
              <div class="comment-item" style="gap: 10px;">
                <div class="comment-avatar-wrap">
                  <img src="${r.authorAvatar}" style="width: 28px; height: 28px; border-radius: var(--radius-full); object-fit: cover;">
                </div>
                <div class="comment-content-wrap">
                  <div class="comment-author-line">
                    <span class="comment-author-name">${r.authorName}</span>
                    <span class="comment-time">${r.timestamp}</span>
                  </div>
                  <div class="comment-text">${r.text}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  likeComment(videoId, commentId) {
    const list = NayvoState.state.comments[videoId];
    if (list) {
      const c = list.find(item => item.id === commentId);
      if (c) {
        c.likes = (c.likes || 0) + 1;
        NayvoState.save();
        this.navigateTo('watch', { videoId });
      }
    }
  }

  toggleReplyBox(commentId) {
    const replyText = prompt('Write your reply:');
    if (replyText && replyText.trim()) {
      NayvoState.addReply(NayvoState.state.currentVideoId, commentId, replyText);
      this.navigateTo('watch', { videoId: NayvoState.state.currentVideoId });
    }
  }

  formatDescriptionWithTimestamps(text) {
    if (!text) return '';
    return text.replace(/(\d{1,2}:\d{2}(?::\d{2})?)/g, (match) => {
      const parts = match.split(':').map(p => parseInt(p, 10));
      let sec = 0;
      if (parts.length === 2) sec = parts[0] * 60 + parts[1];
      else if (parts.length === 3) sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
      return `<span class="timestamp-seek-link" data-time="${sec}">${match}</span>`;
    });
  }

  // Modals Controller
  openUpaharModal(videoId) {
    const modal = document.getElementById('modal-upahar-tip');
    if (modal) {
      modal.classList.add('open');
      const sendBtn = document.getElementById('btn-send-upahar');
      const amountPills = modal.querySelectorAll('.upahar-tier-pill');
      let selectedAmt = 100;

      amountPills.forEach(pill => {
        pill.addEventListener('click', () => {
          amountPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          selectedAmt = parseInt(pill.getAttribute('data-amt'), 10);
        });
      });

      if (sendBtn) {
        sendBtn.onclick = () => {
          const msg = document.getElementById('upahar-msg-input').value;
          NayvoState.sendSuperChat(videoId, selectedAmt, msg);
          modal.classList.remove('open');
          alert(`🎉 Upahar of ₹${selectedAmt} sent successfully with your message!`);
        };
      }
    }
  }

  openClipModal(videoId) {
    const modal = document.getElementById('modal-create-clip');
    if (modal) {
      modal.classList.add('open');
      const createBtn = document.getElementById('btn-save-clip');
      if (createBtn) {
        createBtn.onclick = () => {
          const title = document.getElementById('clip-title-input').value;
          NayvoState.createClip(videoId, title, 10, 40);
          modal.classList.remove('open');
          alert('✂️ Clip created! Link copied to clipboard.');
        };
      }
    }
  }

  openShareModal(videoId, isShort = false) {
    const modal = document.getElementById('modal-share-dialog');
    if (modal) {
      modal.classList.add('open');
      const linkInput = document.getElementById('share-link-input');
      const shareUrl = `${window.location.origin}/#${isShort ? 'shorts' : 'watch'}?v=${videoId}`;
      if (linkInput) linkInput.value = shareUrl;
    }
  }

  openPlaylistModal(videoId) {
    const modal = document.getElementById('modal-save-playlist');
    if (modal) {
      modal.classList.add('open');
      const listEl = document.getElementById('playlist-checkbox-list');
      const userPlaylists = NayvoState.state.userPlaylists;
      if (listEl) {
        listEl.innerHTML = userPlaylists.map(p => `
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 6px 0;">
            <input type="checkbox" ${p.videoIds.includes(videoId) ? 'checked' : ''} onchange="NayvoApp.toggleVideoInPlaylist('${p.id}', '${videoId}', this.checked)">
            <span>${p.title}</span>
          </label>
        `).join('');
      }
    }
  }

  toggleVideoInPlaylist(playlistId, videoId, isChecked) {
    if (isChecked) NayvoState.addVideoToPlaylist(playlistId, videoId);
    else NayvoState.removeVideoFromPlaylist(playlistId, videoId);
  }

  openLanguageModal() {
    const modal = document.getElementById('modal-language-selector');
    if (modal) {
      modal.classList.add('open');
      const grid = document.getElementById('lang-grid-container');
      const curLang = NayvoI18n.getLanguage();

      if (grid) {
        grid.innerHTML = NAYVO_LANGUAGES.map(lang => `
          <div class="language-card-item ${lang.code === curLang ? 'selected' : ''}" onclick="NayvoApp.selectLanguage('${lang.code}')">
            <div class="lang-native-name">${lang.native}</div>
            <div class="lang-english-name">${lang.name} (${lang.region})</div>
          </div>
        `).join('');
      }
    }
  }

  selectLanguage(code) {
    NayvoI18n.setLanguage(code);
    const modal = document.getElementById('modal-language-selector');
    if (modal) modal.classList.remove('open');
  }

  openSettingsModal() {
    const modal = document.getElementById('modal-settings-hub');
    if (modal) {
      modal.classList.add('open');
      const carbonEl = document.getElementById('settings-carbon-saved');
      if (carbonEl) carbonEl.textContent = `${NayvoState.state.carbonSavedGrams}g CO₂`;
    }
  }

  // Header & Navigation Listeners
  bindHeaderEvents() {
    const homeLink = document.getElementById('brand-home-link');
    if (homeLink) homeLink.addEventListener('click', () => this.navigateTo('home'));

    const searchInput = document.getElementById('global-search-input');
    const searchBtn = document.getElementById('btn-global-search');
    const voiceBtn = document.getElementById('btn-voice-search');

    const handleSearch = () => {
      const q = searchInput.value;
      if (q && q.trim()) this.navigateTo('search', { query: q.trim() });
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }

    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        alert('Listening... Say something like "Deep Space Mission" or "Indian Street Food"');
        setTimeout(() => {
          if (searchInput) {
            searchInput.value = 'Free Movies Sintel';
            handleSearch();
          }
        }, 1200);
      });
    }

    const createBtn = document.getElementById('btn-create-upload');
    if (createBtn) createBtn.addEventListener('click', () => NayvoUpload.open());

    const langBtn = document.getElementById('btn-header-language');
    if (langBtn) langBtn.addEventListener('click', () => this.openLanguageModal());

    const notifBtn = document.getElementById('btn-header-notifications');
    const notifPop = document.getElementById('notifications-popover');
    if (notifBtn && notifPop) {
      notifBtn.addEventListener('click', () => {
        notifPop.classList.toggle('open');
        const badge = notifBtn.querySelector('.badge-dot');
        if (badge) badge.style.display = 'none';
      });
    }

    const menuBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('nayvo-app-sidebar') || document.getElementById('mayavi-app-sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    const userAvatarBtn = document.getElementById('btn-user-avatar');
    const profileMenu = document.getElementById('user-profile-popover');
    if (userAvatarBtn && profileMenu) {
      userAvatarBtn.addEventListener('click', () => profileMenu.classList.toggle('open'));
    }
  }

  bindSidebarEvents() {
    document.querySelectorAll('.sidebar-nav-item[data-route]').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.getAttribute('data-route');
        this.navigateTo(route);
      });
    });
  }

  bindMobileNavEvents() {
    document.querySelectorAll('.mobile-nav-item[data-route]').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.getAttribute('data-route');
        if (route === 'create') NayvoUpload.open();
        else this.navigateTo(route);
      });
    });
  }

  bindModalBackdrops() {
    document.querySelectorAll('.mayavi-modal-backdrop, .nayvo-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('open');
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.mayavi-modal-backdrop, .nayvo-modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });
  }

  handleStateChange() {
    const banner = document.getElementById('global-broadcast-banner');
    const bannerText = document.getElementById('broadcast-banner-text');
    const msg = NayvoState.state.masterAuthority.globalBroadcastMessage;
    if (banner && bannerText) {
      if (msg && msg.trim()) {
        bannerText.textContent = msg;
        banner.style.display = 'flex';
      } else {
        banner.style.display = 'none';
      }
    }
  }
}

window.NayvoApp = new NayvoApplication();
window.MayaviApp = window.NayvoApp; // Backward compatibility alias
document.addEventListener('DOMContentLoaded', () => window.NayvoApp.init());
