// NAYVO Creator Studio, Analytics Charts & Live Control Room Engine

class NayvoStudioEngine {
  constructor() {
    this.container = null;
    this.activeTab = 'dashboard'; // 'dashboard', 'content', 'analytics', 'live', 'monetization', 'audio'
    this.chartCanvas = null;
    this.chartCtx = null;
  }

  init(containerElement) {
    this.container = containerElement;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="studio-container">
        <!-- Studio Sidebar Navigation -->
        <aside class="studio-sidebar">
          <div class="studio-brand-header">
            <div class="studio-brand-logo">N</div>
            <div class="studio-brand-text">
              <strong>Nayvo Studio</strong>
              <span>Creator Command</span>
            </div>
          </div>

          <nav class="studio-nav-list">
            <div class="studio-nav-item ${this.activeTab === 'dashboard' ? 'active' : ''}" onclick="NayvoStudio.switchTab('dashboard')">
              <span class="studio-nav-icon">📊</span>
              <span>Dashboard</span>
            </div>
            <div class="studio-nav-item ${this.activeTab === 'content' ? 'active' : ''}" onclick="NayvoStudio.switchTab('content')">
              <span class="studio-nav-icon">🎬</span>
              <span>Content Manager</span>
            </div>
            <div class="studio-nav-item ${this.activeTab === 'analytics' ? 'active' : ''}" onclick="NayvoStudio.switchTab('analytics')">
              <span class="studio-nav-icon">📈</span>
              <span>Analytics</span>
            </div>
            <div class="studio-nav-item ${this.activeTab === 'live' ? 'active' : ''}" onclick="NayvoStudio.switchTab('live')">
              <span class="studio-nav-icon">🔴</span>
              <span>Live Control Room</span>
            </div>
            <div class="studio-nav-item ${this.activeTab === 'monetization' ? 'active' : ''}" onclick="NayvoStudio.switchTab('monetization')">
              <span class="studio-nav-icon">💰</span>
              <span>Earn & Srijan</span>
            </div>
            <div class="studio-nav-item ${this.activeTab === 'audio' ? 'active' : ''}" onclick="NayvoStudio.switchTab('audio')">
              <span class="studio-nav-icon">🎵</span>
              <span>Audio Library</span>
            </div>
          </nav>

          <div style="margin-top: auto; padding: 16px; border-top: 1px solid var(--border-subtle);">
            <button class="action-btn-secondary" style="width: 100%; justify-content: center; font-size: 13px;" onclick="NayvoApp.navigateTo('home')">
              ← Return to Nayvo
            </button>
          </div>
        </aside>

        <!-- Studio Main Viewport -->
        <main class="studio-main-viewport" id="studio-viewport-content">
          <!-- Injected dynamically based on active tab -->
        </main>
      </div>
    `;

    this.renderTabContent();
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render();
  }

  renderTabContent() {
    const vp = document.getElementById('studio-viewport-content');
    if (!vp) return;

    switch (this.activeTab) {
      case 'dashboard':
        this.renderDashboard(vp);
        break;
      case 'content':
        this.renderContent(vp);
        break;
      case 'analytics':
        this.renderAnalytics(vp);
        break;
      case 'live':
        this.renderLiveControl(vp);
        break;
      case 'monetization':
        this.renderMonetization(vp);
        break;
      case 'audio':
        this.renderAudioLibrary(vp);
        break;
    }
  }

  // 1. Dashboard Tab
  renderDashboard(vp) {
    vp.innerHTML = `
      <div style="max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800;">Channel Dashboard</h1>
            <p style="color: var(--text-secondary); font-size: 13.5px; margin-top: 2px;">Tech Bharat AI (@techbharat_ai) • 28-Day Overview</p>
          </div>
          <button class="action-btn-pill" onclick="NayvoUpload.open()">+ UPLOAD VIDEO</button>
        </div>

        <!-- 4 KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-title">Total Views (Last 28 Days)</span>
            <span class="kpi-value">4.2M</span>
            <span class="kpi-delta delta-pos">↑ +18.4% vs previous 28 days</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-title">Watch Time (Hours)</span>
            <span class="kpi-value">284.5K</span>
            <span class="kpi-delta delta-pos">↑ +24.1% vs previous 28 days</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-title">Subscribers</span>
            <span class="kpi-value">1.45M</span>
            <span class="kpi-delta delta-pos">↑ +42.8K this month</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-title">Estimated Revenue</span>
            <span class="kpi-value">₹3,42,800</span>
            <span class="kpi-delta delta-pos">↑ +14.2% (UPI / Direct Bank)</span>
          </div>
        </div>

        <!-- Latest Video Performance -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 20px; display: flex; gap: 24px; flex-wrap: wrap;">
          <div style="width: 320px; aspect-ratio: 16/9; border-radius: var(--radius-lg); overflow: hidden; position: relative; flex-shrink: 0;">
            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--accent-saffron);">LATEST VIDEO PUBLISHED</div>
            <h2 style="font-size: 18px; font-weight: 800;">Building Sovereign Cloud Infrastructure in India: Full System Design Masterclass</h2>
            <div style="display: flex; gap: 24px; margin-top: 12px; font-size: 14px;">
              <div><strong>Views:</strong> 642,000</div>
              <div><strong>Likes:</strong> 48,900 (99.2%)</div>
              <div><strong>Comments:</strong> 1,240</div>
            </div>
            <div style="display: flex; gap: 12px; margin-top: 12px;">
              <button class="action-btn-pill" onclick="NayvoStudio.switchTab('analytics')">GO TO VIDEO ANALYTICS</button>
              <button class="action-btn-secondary" onclick="NayvoApp.navigateTo('watch', { videoId: 'vid-001' })">VIEW ON NAYVO</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Content Manager Tab
  renderContent(vp) {
    const videos = NayvoState.state.videos;

    vp.innerHTML = `
      <div style="max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h1 style="font-size: 24px; font-weight: 800;">Channel Content</h1>
          <button class="action-btn-pill" onclick="NayvoUpload.open()">+ UPLOAD</button>
        </div>

        <div class="content-table-wrapper">
          <table class="content-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Visibility</th>
                <th>Monetization</th>
                <th>Date</th>
                <th>Views</th>
                <th>Comments</th>
                <th>Likes</th>
              </tr>
            </thead>
            <tbody>
              ${videos.map(v => `
                <tr>
                  <td>
                    <div class="content-cell-video" onclick="NayvoApp.navigateTo('watch', { videoId: '${v.id}' })">
                      <img src="${v.thumbnail}" class="content-cell-thumb" alt="Thumbnail">
                      <div class="content-cell-meta">
                        <strong class="content-cell-title">${v.title}</strong>
                        <span class="content-cell-desc">${v.description.substring(0, 60)}...</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="visibility-badge vis-public">Public</span>
                  </td>
                  <td>
                    <span class="monetization-on">₹ Active</span>
                  </td>
                  <td style="color: var(--text-secondary);">${v.uploadTime}</td>
                  <td style="font-weight: 700;">${NayvoI18n.formatViews(v.views)}</td>
                  <td>${(NayvoState.state.comments[v.id] || []).length}</td>
                  <td>${NayvoI18n.formatViews(v.likes)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. Analytics Tab with Custom Canvas Chart
  renderAnalytics(vp) {
    vp.innerHTML = `
      <div style="max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
        <h1 style="font-size: 24px; font-weight: 800;">Channel Analytics</h1>

        <div class="analytics-chart-container">
          <div class="chart-header-row">
            <div>
              <h3 style="font-size: 16px; font-weight: 800;">Audience Velocity & Retention</h3>
              <p style="font-size: 12.5px; color: var(--text-secondary);">Daily views across Indian metropolitan & tier-2/3 regions</p>
            </div>
            <div class="chart-tab-group">
              <button class="chart-tab-btn active">Views</button>
              <button class="chart-tab-btn">Watch Time</button>
              <button class="chart-tab-btn">Revenue (₹)</button>
            </div>
          </div>

          <div class="chart-canvas-wrap">
            <canvas id="studio-analytics-canvas" style="width: 100%; height: 260px;"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => this.drawAnalyticsChart(), 50);
  }

  drawAnalyticsChart() {
    const canvas = document.getElementById('studio-analytics-canvas');
    if (!canvas) return;

    canvas.width = canvas.parentElement.clientWidth || 900;
    canvas.height = 260;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const dataPoints = [45, 62, 58, 80, 75, 95, 110, 105, 130, 125, 140, 165, 155, 180, 210, 195, 230, 260, 280, 310];
    const maxVal = 350;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h - 30; y += 45) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255, 138, 0, 0.45)');
    grad.addColorStop(1, 'rgba(255, 138, 0, 0.0)');

    ctx.beginPath();
    const stepX = (w - 60) / (dataPoints.length - 1);
    dataPoints.forEach((val, i) => {
      const x = 40 + i * stepX;
      const y = h - 30 - (val / maxVal) * (h - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineTo(40 + (dataPoints.length - 1) * stepX, h - 30);
    ctx.lineTo(40, h - 30);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    dataPoints.forEach((val, i) => {
      const x = 40 + i * stepX;
      const y = h - 30 - (val / maxVal) * (h - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#ff8a00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Data points circles
    dataPoints.forEach((val, i) => {
      const x = 40 + i * stepX;
      const y = h - 30 - (val / maxVal) * (h - 60);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#ff8a00';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // 4. Live Control Room
  renderLiveControl(vp) {
    vp.innerHTML = `
      <div class="live-control-grid">
        <div class="live-preview-box">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h3 style="font-size: 16px; font-weight: 800;">Stream Broadcast Preview</h3>
            <span class="visibility-badge vis-public" style="background: rgba(255, 51, 75, 0.2); color: var(--accent-red);">OFFLINE</span>
          </div>

          <div class="live-stream-card" style="margin-top: 14px;">
            <div style="font-size: 32px;">📡</div>
            <p style="font-weight: 700;">Connect streaming software (OBS Studio / vMix / Streamlabs)</p>
            <p style="font-size: 12px; color: var(--text-secondary); max-width: 420px; text-align: center;">
              Send your video feed to Nayvo's high-speed RTMP ingestion endpoint to start broadcasting.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
            <div class="modal-form-group">
              <label class="modal-label">RTMP Ingest Server URL</label>
              <input type="text" class="modal-input" value="rtmp://live-ingest.nayvo.in/live" readonly>
            </div>

            <div class="modal-form-group">
              <label class="modal-label">Stream Key (Keep secret)</label>
              <div style="display: flex; gap: 8px;">
                <input type="password" class="modal-input" value="live_nayvo_sec_993810293847" id="stream-key-val" readonly>
                <button class="action-btn-pill" onclick="alert('Stream key copied to clipboard!')">Copy</button>
              </div>
            </div>
          </div>
        </div>

        <div class="live-chat-monitor">
          <div class="live-chat-header">
            <span>🔴 Live Chat Monitor</span>
            <span style="font-size: 11px; color: var(--text-muted);">Auto-Moderation Active</span>
          </div>

          <div class="live-chat-messages" id="live-monitor-messages">
            <div class="chat-msg-row">
              <strong style="color: var(--accent-teal);">Rohit Verma:</strong>
              <span>Audio and video sync looks crystal clear! 🚀</span>
            </div>
            <div class="chat-msg-row">
              <strong style="color: var(--accent-saffron);">Pooja K:</strong>
              <span>Greetings from Hyderabad! Excited for the live session.</span>
            </div>
          </div>

          <div style="padding: 12px; border-top: 1px solid var(--border-subtle); display: flex; gap: 8px;">
            <input type="text" class="modal-input" placeholder="Send message as Creator..." id="live-chat-input">
            <button class="action-btn-pill" onclick="NayvoStudio.sendLiveMsg()">Send</button>
          </div>
        </div>
      </div>
    `;
  }

  sendLiveMsg() {
    const input = document.getElementById('live-chat-input');
    const container = document.getElementById('live-monitor-messages');
    if (input && container && input.value.trim()) {
      const div = document.createElement('div');
      div.className = 'chat-msg-row';
      div.innerHTML = `<strong style="color: var(--accent-saffron);">Tech Bharat AI (Host):</strong> <span>${input.value.trim()}</span>`;
      container.appendChild(div);
      input.value = '';
      container.scrollTop = container.scrollHeight;
    }
  }

  // 5. Monetization Tab (Nayvo Srijan)
  renderMonetization(vp) {
    vp.innerHTML = `
      <div style="max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800;">Nayvo Srijan • Creator Partner Program</h1>
            <p style="color: var(--text-secondary); font-size: 13.5px;">Monetize through video ads, Upahar SuperChat tipping, and Kala Club memberships.</p>
          </div>
          <div style="padding: 6px 14px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--accent-green); border-radius: var(--radius-full); font-weight: 800; color: var(--accent-green); font-size: 13px;">
            ✓ PARTNER STATUS: ACTIVE
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-title">Subscribers Threshold</span>
            <span class="kpi-value">1.45M / 1,000</span>
            <span class="kpi-delta delta-pos">✓ 100% Completed</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-title">Public Watch Hours</span>
            <span class="kpi-value">284.5K / 4,000 hrs</span>
            <span class="kpi-delta delta-pos">✓ 100% Completed</span>
          </div>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 24px;">
          <h3 style="font-size: 18px; font-weight: 800;">Payout Preferences (Direct Bank / UPI)</h3>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Zero intermediary deduction. Fast monthly creator disbursements.</p>
          <div style="margin-top: 16px; display: flex; gap: 16px; align-items: center;">
            <input type="text" class="modal-input" value="techbharat@upi" readonly style="max-width: 320px;">
            <button class="action-btn-secondary">Update UPI ID</button>
          </div>
        </div>
      </div>
    `;
  }

  // 6. Royalty-Free Audio Library
  renderAudioLibrary(vp) {
    vp.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        <h1 style="font-size: 24px; font-weight: 800;">Royalty-Free Audio Library</h1>
        <p style="color: var(--text-secondary); font-size: 13.5px;">Free background scores, ambient lo-fi, sitar rhythms, and sound effects for your Nayvo videos.</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${[
            { title: 'Peaceful Monsoon Sitar', genre: 'Classical Fusion', duration: '3:45', mood: 'Calm' },
            { title: 'Cyberpunk Bengaluru Synthwave', genre: 'Electronic', duration: '4:10', mood: 'Energetic' },
            { title: 'Vedic Dawn Flute Meditation', genre: 'Ambient', duration: '5:20', mood: 'Relaxing' },
            { title: 'ISRO Deep Space Echoes', genre: 'Cinematic', duration: '3:15', mood: 'Inspiring' }
          ].map(track => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
              <div style="display: flex; align-items: center; gap: 14px;">
                <button class="player-btn" style="background: var(--bg-card);" onclick="alert('Playing track preview: ${track.title}')">▶</button>
                <div>
                  <strong style="font-size: 14px;">${track.title}</strong>
                  <div style="font-size: 12px; color: var(--text-secondary);">${track.genre} • ${track.mood}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-size: 13px; color: var(--text-muted);">${track.duration}</span>
                <button class="action-btn-secondary" style="font-size: 12px;" onclick="alert('Track added to your video audio draft!')">⬇️ Use in Video</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.NayvoStudio = new NayvoStudioEngine();
window.MayaviStudio = window.NayvoStudio; // Backward compatibility alias
