// NAYVO 4-Step Video Upload & Publishing Wizard

class NayvoUploadEngine {
  constructor() {
    this.currentStep = 1;
    this.videoDraft = {
      title: '',
      description: '',
      category: 'tech',
      visibility: 'public',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      durationStr: '12:30',
      duration: 750,
      fileName: ''
    };
  }

  open() {
    this.currentStep = 1;
    this.videoDraft = {
      title: '',
      description: '',
      category: 'tech',
      visibility: 'public',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      durationStr: '12:30',
      duration: 750,
      fileName: ''
    };
    
    const modal = document.getElementById('modal-upload-wizard');
    if (modal) {
      modal.classList.add('open');
      this.renderStep();
    }
  }

  close() {
    const modal = document.getElementById('modal-upload-wizard');
    if (modal) modal.classList.remove('open');
  }

  renderStep() {
    this.updateStepperHeader();
    const body = document.getElementById('upload-wizard-body');
    const footer = document.getElementById('upload-wizard-footer');
    if (!body || !footer) return;

    switch (this.currentStep) {
      case 1:
        this.renderStep1(body, footer);
        break;
      case 2:
        this.renderStep2(body, footer);
        break;
      case 3:
        this.renderStep3(body, footer);
        break;
      case 4:
        this.renderStep4(body, footer);
        break;
    }
  }

  updateStepperHeader() {
    for (let i = 1; i <= 4; i++) {
      const node = document.getElementById(`step-node-${i}`);
      if (node) {
        node.classList.toggle('active', i === this.currentStep);
        node.classList.toggle('completed', i < this.currentStep);
      }
    }
  }

  // Step 1: Upload File
  renderStep1(body, footer) {
    body.innerHTML = `
      <div class="drag-drop-zone" id="upload-drop-zone">
        <div class="upload-icon-circle">📹</div>
        <h3 style="font-size: 18px; font-weight: 800;">Drag and drop video files to upload</h3>
        <p style="color: var(--text-secondary); font-size: 13.5px;">
          Your videos will be private until you publish them. Supports MP4, MOV, WebM (up to 4K 60fps).
        </p>
        <button class="action-btn-pill" id="btn-select-file" style="margin-top: 10px;">SELECT FILES</button>
        <input type="file" id="real-file-input" accept="video/*" style="display: none;">
      </div>
    `;

    footer.innerHTML = `
      <div style="font-size: 12px; color: var(--text-muted); margin-right: auto;">
        By submitting, you agree to Nayvo's Terms of Service and Community Guidelines.
      </div>
    `;

    const dropZone = document.getElementById('upload-drop-zone');
    const selectBtn = document.getElementById('btn-select-file');
    const fileInput = document.getElementById('real-file-input');

    const handleFile = (name) => {
      this.videoDraft.fileName = name;
      this.videoDraft.title = name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      this.currentStep = 2;
      this.renderStep();
    };

    if (selectBtn && fileInput) {
      selectBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleFile(e.target.files[0].name);
      });
    }

    if (dropZone) {
      dropZone.addEventListener('click', () => {
        handleFile('Mastering_Sovereign_Cloud_Architecture_4K.mp4');
      });
    }
  }

  // Step 2: Video Details
  renderStep2(body, footer) {
    body.innerHTML = `
      <div class="modal-form-group">
        <label class="modal-label">Title (required)</label>
        <input type="text" class="modal-input" id="draft-title-input" value="${this.videoDraft.title}" placeholder="Add a title that describes your video">
      </div>

      <div class="modal-form-group">
        <label class="modal-label">Description</label>
        <textarea class="modal-input modal-textarea" id="draft-desc-input" placeholder="Tell viewers about your video (add timestamps, links, etc.)">${this.videoDraft.description}</textarea>
      </div>

      <div class="modal-form-group">
        <label class="modal-label">Thumbnail</label>
        <div class="thumbnail-options-grid">
          <div class="thumb-preview-card selected" onclick="NayvoUpload.selectThumb(this, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80')">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" alt="Thumb 1">
          </div>
          <div class="thumb-preview-card" onclick="NayvoUpload.selectThumb(this, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80')">
            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80" alt="Thumb 2">
          </div>
          <div class="thumb-preview-card" onclick="NayvoUpload.selectThumb(this, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80')">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" alt="Thumb 3">
          </div>
        </div>
      </div>

      <div class="modal-form-group">
        <label class="modal-label">Category</label>
        <select class="modal-input" id="draft-category-select">
          <option value="tech">Technology & AI</option>
          <option value="cinema">Cinema & Movies</option>
          <option value="music">Music & Audio</option>
          <option value="sports">Cricket & Sports</option>
          <option value="learning">Education & Learning</option>
          <option value="openVault">Open Vault (Free CC-BY Media)</option>
        </select>
      </div>
    `;

    footer.innerHTML = `
      <button class="action-btn-secondary" onclick="NayvoUpload.prevStep()">Back</button>
      <button class="action-btn-pill" onclick="NayvoUpload.nextStepFrom2()">Next: Video Elements →</button>
    `;
  }

  selectThumb(el, url) {
    document.querySelectorAll('.thumb-preview-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    this.videoDraft.thumbnail = url;
  }

  nextStepFrom2() {
    this.videoDraft.title = document.getElementById('draft-title-input').value;
    this.videoDraft.description = document.getElementById('draft-desc-input').value;
    this.videoDraft.category = document.getElementById('draft-category-select').value;
    this.currentStep = 3;
    this.renderStep();
  }

  // Step 3: Elements & AI Safety Checks
  renderStep3(body, footer) {
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: var(--bg-card); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
          <div>
            <strong style="font-size: 14.5px;">Add Subtitles / Captions</strong>
            <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">Automated multilingual captions in Hindi, Tamil, Telugu & English</p>
          </div>
          <button class="action-btn-secondary" style="font-size: 12px;">+ Add Captions</button>
        </div>

        <div style="background: var(--bg-card); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
          <div>
            <strong style="font-size: 14.5px;">Add End Screen & Cards</strong>
            <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">Promote related videos, playlists, or your channel</p>
          </div>
          <button class="action-btn-secondary" style="font-size: 12px;">+ Add Cards</button>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-green); padding: 16px; border-radius: var(--radius-lg);">
          <strong style="color: var(--accent-green); font-size: 14px; display: flex; align-items: center; gap: 6px;">
            <span>✓</span> Nayvo Raksha AI Copyright & Safety Checks: Passed
          </strong>
          <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">
            No copyright claims or community guideline violations detected. Safe for monetization.
          </p>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="action-btn-secondary" onclick="NayvoUpload.prevStep()">Back</button>
      <button class="action-btn-pill" onclick="NayvoUpload.currentStep = 4; NayvoUpload.renderStep();">Next: Visibility →</button>
    `;
  }

  // Step 4: Visibility & Publish
  renderStep4(body, footer) {
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h3 style="font-size: 16px; font-weight: 800;">Choose visibility setting</h3>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label style="display: flex; gap: 12px; padding: 14px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); cursor: pointer;">
            <input type="radio" name="visibility" value="public" checked onchange="NayvoUpload.videoDraft.visibility = 'public'">
            <div>
              <strong style="font-size: 14px;">Public</strong>
              <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">Everyone can see and discover your video on Nayvo</p>
            </div>
          </label>

          <label style="display: flex; gap: 12px; padding: 14px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); cursor: pointer;">
            <input type="radio" name="visibility" value="unlisted" onchange="NayvoUpload.videoDraft.visibility = 'unlisted'">
            <div>
              <strong style="font-size: 14px;">Unlisted</strong>
              <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">Anyone with the video link can watch</p>
            </div>
          </label>

          <label style="display: flex; gap: 12px; padding: 14px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); cursor: pointer;">
            <input type="radio" name="visibility" value="private" onchange="NayvoUpload.videoDraft.visibility = 'private'">
            <div>
              <strong style="font-size: 14px;">Private</strong>
              <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">Only you can see this video</p>
            </div>
          </label>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="action-btn-secondary" onclick="NayvoUpload.prevStep()">Back</button>
      <button class="action-btn-pill" id="btn-publish-final" onclick="NayvoUpload.publish()">PUBLISH VIDEO</button>
    `;
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  }

  publish() {
    const newVideo = NayvoState.uploadNewVideo(this.videoDraft);
    this.close();
    if (newVideo) {
      alert(`🎉 Video published successfully! "${newVideo.title}" is now live on Nayvo.`);
      NayvoApp.navigateTo('watch', { videoId: newVideo.id });
    }
  }
}

window.NayvoUpload = new NayvoUploadEngine();
window.MayaviUpload = window.NayvoUpload; // Backward compatibility alias
