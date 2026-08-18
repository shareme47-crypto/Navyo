// NAYVO Super Admin & Master Platform Governance Console (Nayvo Param)

class NayvoAdminEngine {
  constructor() {
    this.container = null;
    this.reports = [];
    this.activeTab = 'governance'; // 'governance', 'moderation', 'privacy_audit', 'telemetry'
  }

  init(containerElement) {
    this.container = containerElement;
    this.reports = NayvoState.state.adminReports || [];
    this.render();
  }

  render() {
    if (!this.container) return;
    const auth = NayvoState.state.masterAuthority;

    this.container.innerHTML = `
      <div class="admin-dashboard-container">
        <!-- Master Authority Banner -->
        <div class="admin-header-badge" style="background: linear-gradient(135deg, rgba(255, 138, 0, 0.2), rgba(0, 180, 216, 0.15)); border-color: var(--accent-saffron);">
          <div class="admin-shield-icon">👑</div>
          <div class="admin-title-wrap">
            <h2>Nayvo Param • Platform Owner & Super Admin Master Console</h2>
            <p>Supreme authority, zero-data-sharing enforcement, emergency killswitches, and Indian DPDP Act 2023 compliance</p>
          </div>
          <div style="margin-left: auto; text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Platform Status</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--accent-green);">● ${auth.platformStatus}</div>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div style="display: flex; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <button class="chart-tab-btn ${this.activeTab === 'governance' ? 'active' : ''}" onclick="NayvoAdmin.switchTab('governance')">⚡ Master Authority & Killswitches</button>
          <button class="chart-tab-btn ${this.activeTab === 'moderation' ? 'active' : ''}" onclick="NayvoAdmin.switchTab('moderation')">🛡️ Content Moderation Queue (${this.reports.length})</button>
          <button class="chart-tab-btn ${this.activeTab === 'privacy_audit' ? 'active' : ''}" onclick="NayvoAdmin.switchTab('privacy_audit')">🔒 Privacy Shield & Zero-Tracker Audit</button>
          <button class="chart-tab-btn ${this.activeTab === 'telemetry' ? 'active' : ''}" onclick="NayvoAdmin.switchTab('telemetry')">📡 Edge Node Telemetry</button>
        </div>

        <div id="admin-tab-content-viewport">
          <!-- Injected dynamically based on active tab -->
        </div>
      </div>
    `;

    this.renderTabContent();
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render();
  }

  renderTabContent() {
    const vp = document.getElementById('admin-tab-content-viewport');
    if (!vp) return;

    switch (this.activeTab) {
      case 'governance':
        this.renderGovernance(vp);
        break;
      case 'moderation':
        this.renderModeration(vp);
        break;
      case 'privacy_audit':
        this.renderPrivacyAudit(vp);
        break;
      case 'telemetry':
        this.renderTelemetry(vp);
        break;
    }
  }

  // 1. Master Authority & Emergency Controls
  renderGovernance(vp) {
    const auth = NayvoState.state.masterAuthority;
    vp.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        <!-- Emergency Mode Controls -->
        <div class="kpi-card" style="gap: 14px;">
          <h3 style="font-size: 16px; font-weight: 800; color: #fff;">🚨 Owner Emergency Controls</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">Only the Platform Owner holds the cryptographic authority to execute platform-wide actions.</p>
          
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
            <button class="action-btn-secondary" style="color: ${auth.platformStatus === 'OPERATIONAL' ? 'var(--accent-green)' : 'inherit'};" onclick="NayvoState.setPlatformStatus('OPERATIONAL'); NayvoAdmin.render();">
              🟢 Set Platform: 100% Operational
            </button>
            <button class="action-btn-secondary" style="color: var(--accent-saffron);" onclick="NayvoState.setPlatformStatus('UPLOADS_PAUSED'); NayvoAdmin.render();">
              ⏸️ Pause All Video Uploads (Maintenance Mode)
            </button>
            <button class="action-btn-secondary" style="color: var(--accent-red);" onclick="NayvoState.setPlatformStatus('EMERGENCY_LOCKDOWN'); NayvoAdmin.render();">
              🔒 Read-Only Lockdown (Block New Comments & Edits)
            </button>
          </div>
        </div>

        <!-- Global Broadcast Alert -->
        <div class="kpi-card" style="gap: 14px;">
          <h3 style="font-size: 16px; font-weight: 800; color: #fff;">📢 Global Broadcast Banner</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">Push an urgent notification or celebration message to every user worldwide.</p>
          
          <input type="text" class="modal-input" id="admin-broadcast-msg" placeholder="e.g. Welcome to NAYVO! Sovereign 4K streaming live worldwide." value="${auth.globalBroadcastMessage || ''}">
          <div style="display: flex; gap: 10px;">
            <button class="action-btn-pill" onclick="NayvoAdmin.publishBroadcast()">SEND BROADCAST</button>
            <button class="action-btn-secondary" onclick="NayvoState.setGlobalBroadcast(''); NayvoAdmin.render();">Clear</button>
          </div>
        </div>
      </div>

      <!-- Legal Disclaimers & Grievance Officer Portal -->
      <div class="mod-queue-card" style="margin-top: 24px;">
        <h3 style="font-size: 16px; font-weight: 800;">📜 Grievance Officer & Statutory Disclaimers</h3>
        <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.5;">
          Appointed under <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>:
        </p>
        <div style="background: var(--bg-card); padding: 14px; border-radius: var(--radius-md); font-size: 13px; color: var(--text-primary); margin-top: 10px; border: 1px solid var(--border-subtle);">
          <div><strong>Designated Grievance Officer:</strong> Chief Legal & Safety Counsel, NAYVO Platform</div>
          <div><strong>Email:</strong> grievance@nayvo.in | <strong>Redressal Window:</strong> 24 to 48 Hours</div>
          <div><strong>Safe Harbor Certification:</strong> Active under Section 79, IT Act 2000</div>
        </div>
      </div>
    `;
  }

  publishBroadcast() {
    const msg = document.getElementById('admin-broadcast-msg').value;
    NayvoState.setGlobalBroadcast(msg);
    alert('📢 Global Broadcast published to all Nayvo viewers worldwide!');
    this.render();
  }

  // 2. Moderation Queue
  renderModeration(vp) {
    vp.innerHTML = `
      <div class="mod-queue-card">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-size: 18px; font-weight: 800;">Pending Review Queue (${this.reports.length})</h3>
          <span style="font-size: 12px; color: var(--text-secondary);">Automated AI Vision & Audio Heuristics</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;" id="mod-reports-list">
          ${this.reports.length === 0 ? '<p style="color: var(--text-muted); padding: 20px 0;">All reports resolved! No pending violations.</p>' : ''}
          ${this.reports.map(rep => `
            <div class="mod-report-item" id="rep-item-${rep.id}">
              <div class="mod-video-meta">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80" class="mod-thumb" alt="Thumb">
                <div class="mod-details">
                  <strong style="font-size: 14px;">${rep.videoTitle}</strong>
                  <span style="font-size: 12px; color: var(--text-muted);">${rep.channelName} • Reported ${rep.date}</span>
                  <span class="mod-reason-tag">⚠️ ${rep.reporterReason}</span>
                </div>
              </div>

              <div style="text-align: right; margin-right: 16px;">
                <div style="font-size: 11.5px; color: var(--text-muted);">AI Safety Score</div>
                <div style="font-size: 16px; font-weight: 800; color: var(--accent-green);">${rep.aiSafetyScore}% Safe</div>
              </div>

              <div class="mod-actions-group">
                <button class="mod-btn-action mod-btn-dismiss" onclick="NayvoAdmin.dismissReport('${rep.id}')">Dismiss</button>
                <button class="mod-btn-action mod-btn-strike" onclick="NayvoAdmin.strikeChannel('${rep.id}')">Issue Warning</button>
                <button class="mod-btn-action mod-btn-takedown" onclick="NayvoAdmin.takeDownVideo('${rep.id}')">Take Down</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. Privacy Shield & Zero-Tracker Audit
  renderPrivacyAudit(vp) {
    vp.innerHTML = `
      <div class="mod-queue-card">
        <h3 style="font-size: 18px; font-weight: 800; color: var(--accent-green);">🔒 Zero Third-Party Tracker Audit (100% Clean)</h3>
        <p style="font-size: 13.5px; color: var(--text-secondary);">
          NAYVO adheres to strict data isolation principles. No user identity, browsing habits, or video views are ever transmitted to ad brokers.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 16px;">
          <div style="padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-lg); border: 1px solid rgba(16, 185, 129, 0.3);">
            <strong style="color: var(--accent-green); font-size: 15px;">✓ Zero Third-Party Pixels</strong>
            <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 4px;">0 Facebook Pixels, 0 Google Ad Tags, 0 Data Brokers</p>
          </div>

          <div style="padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-lg); border: 1px solid rgba(16, 185, 129, 0.3);">
            <strong style="color: var(--accent-green); font-size: 15px;">✓ Indian DPDP Act 2023</strong>
            <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 4px;">Full data localization & citizen consent architecture</p>
          </div>

          <div style="padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-lg); border: 1px solid rgba(16, 185, 129, 0.3);">
            <strong style="color: var(--accent-green); font-size: 15px;">✓ Global GDPR Portability</strong>
            <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 4px;">One-click data export & permanent account purge</p>
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; gap: 12px;">
          <button class="action-btn-pill" onclick="NayvoState.exportAllUserData()">📥 Export Compliance User Data Bundle</button>
        </div>
      </div>
    `;
  }

  // 4. Edge Telemetry
  renderTelemetry(vp) {
    vp.innerHTML = `
      <div class="system-telemetry-grid">
        <div class="telemetry-node-card">
          <span class="node-name">Mumbai Edge (BOM-01)</span>
          <div class="node-status-row">
            <span>99.99% Up</span>
            <span style="font-size: 12px; color: var(--accent-teal);">12ms</span>
          </div>
        </div>

        <div class="telemetry-node-card">
          <span class="node-name">Bengaluru Edge (BLR-02)</span>
          <div class="node-status-row">
            <span>100% Up</span>
            <span style="font-size: 12px; color: var(--accent-teal);">9ms</span>
          </div>
        </div>

        <div class="telemetry-node-card">
          <span class="node-name">Delhi NCR Edge (DEL-01)</span>
          <div class="node-status-row">
            <span>99.98% Up</span>
            <span style="font-size: 12px; color: var(--accent-teal);">14ms</span>
          </div>
        </div>

        <div class="telemetry-node-card">
          <span class="node-name">Hyderabad Edge (HYD-01)</span>
          <div class="node-status-row">
            <span>100% Up</span>
            <span style="font-size: 12px; color: var(--accent-teal);">11ms</span>
          </div>
        </div>
      </div>
    `;
  }

  dismissReport(reportId) {
    this.reports = this.reports.filter(r => r.id !== reportId);
    NayvoState.state.adminReports = this.reports;
    NayvoState.save();
    this.render();
  }

  strikeChannel(reportId) {
    alert(`Warning & Compliance notice sent to channel for report ${reportId}`);
    this.dismissReport(reportId);
  }

  takeDownVideo(reportId) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      NayvoState.state.videos = NayvoState.state.videos.filter(v => v.id !== report.videoId);
      alert(`Video "${report.videoTitle}" removed from Nayvo platform.`);
    }
    this.dismissReport(reportId);
  }
}

window.NayvoAdmin = new NayvoAdminEngine();
window.MayaviAdmin = window.NayvoAdmin; // Backward compatibility alias
