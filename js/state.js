// NAYVO Reactive State Store & Persistence Layer with Super Admin Authority & Privacy Shield

class NayvoStateStore {
  constructor() {
    this.storageKey = 'nayvo_app_state_v4';
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...this.getDefaultState(),
          ...parsed,
          videos: this.mergeVideos(parsed.videos),
          channels: { ...NAYVO_DATA.channels, ...(parsed.channels || {}) }
        };
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return this.getDefaultState();
  }

  mergeVideos(savedVideos) {
    const seedVideos = [...NAYVO_DATA.videos];
    if (!savedVideos || !Array.isArray(savedVideos)) return seedVideos;
    const userUploaded = savedVideos.filter(sv => sv.isUserUploaded);
    return [...seedVideos, ...userUploaded];
  }

  getDefaultState() {
    return {
      currentUser: {
        id: 'usr-owner-root',
        name: 'Platform Owner (Master Authority)',
        handle: '@nayvo_master',
        email: 'founder@nayvo.in',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        channelId: 'ch-tech-bharat',
        role: 'SUPER_ADMIN',
        isSuperAdmin: true,
        isCreator: true,
        joinedDate: 'Jan 2024'
      },
      currentView: 'home',
      currentVideoId: 'vid-free-001',
      currentShortIndex: 0,
      currentChannelId: 'ch-open-vault',
      currentPlaylistId: 'pl-free-movies',
      activeCategory: 'all',
      searchQuery: '',
      theme: localStorage.getItem('nayvo_theme') || 'dark',
      
      // Master Governance & Emergency Controls (Platform Owner Authority)
      masterAuthority: {
        platformStatus: 'OPERATIONAL', // 'OPERATIONAL', 'EMERGENCY_LOCKDOWN', 'UPLOADS_PAUSED'
        zeroDataSharingEnforced: true,
        allowUserRegistration: true,
        aiPreModeration: true,
        globalBroadcastMessage: ''
      },

      // Security & Privacy Shield Settings
      securitySettings: {
        zeroThirdPartyTrackers: true,
        twoFactorAuthEnabled: true,
        incognitoMode: false,
        endToEndEncryption: true,
        clientDataSovereignty: 'INDIA_RESTRICTED', // Compliant with DPDP Act 2023
        sessionTimeoutMinutes: 60
      },

      // Green Streaming
      ecoMode: localStorage.getItem('nayvo_eco_mode') === 'true' || true,
      carbonSavedGrams: 520,

      // Subscriptions & Interactions
      subscriptions: ['ch-open-vault', 'ch-tech-bharat', 'ch-isro-pulse', 'ch-ragas-beats'],
      subscriptionNotificationSettings: {
        'ch-open-vault': 'all',
        'ch-tech-bharat': 'all',
        'ch-isro-pulse': 'all',
        'ch-ragas-beats': 'personalized'
      },
      likedVideoIds: ['vid-free-001', 'vid-001'],
      dislikedVideoIds: [],
      watchHistory: [
        { videoId: 'vid-free-001', watchedAt: Date.now() - 1800000, progress: 0.8 },
        { videoId: 'vid-001', watchedAt: Date.now() - 3600000, progress: 0.65 }
      ],
      watchLaterIds: ['vid-free-002', 'vid-004'],
      userPlaylists: [
        {
          id: 'pl-my-favorites',
          title: 'My Favorite Free Films & Tech',
          description: 'Curated gems on Nayvo',
          author: 'Platform Owner',
          privacy: 'public',
          videoIds: ['vid-free-001', 'vid-001', 'vid-002'],
          updatedAt: 'Yesterday'
        }
      ],
      
      userClips: [
        { id: 'clip-1', videoId: 'vid-free-001', title: 'Epic Mountain Flight Scene', startTime: 45, endTime: 75, createdAt: '1 day ago' }
      ],
      
      pollVotes: {},
      comments: { ...NAYVO_DATA.comments },
      videos: [...NAYVO_DATA.videos],
      shorts: [...NAYVO_DATA.shorts],
      channels: { ...NAYVO_DATA.channels },
      
      notifications: [
        {
          id: 'notif-security',
          title: '🛡️ Nayvo Security & Privacy Shield Active',
          text: 'Zero data sharing active. 100% of your activity is private and stored under Indian DPDP Act 2023.',
          time: 'Just now',
          read: false,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          videoId: 'vid-free-001'
        },
        {
          id: 'notif-open-vault',
          title: 'Nayvo Open Vault released Sintel (4K CC-BY)',
          text: 'Enjoy 100% free open-source cinema with no ads or copyright claims!',
          time: '1 hour ago',
          read: false,
          avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&auto=format&fit=crop&q=80',
          videoId: 'vid-free-001'
        }
      ],
      
      superChatHistory: [],
      adminReports: [...NAYVO_DATA.adminReports]
    };
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('nayvo_state_changed', { detail: this.state }));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // Security XSS Sanitizer Helper
  sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  // Master Authority Emergency Controls
  setPlatformStatus(status) {
    this.state.masterAuthority.platformStatus = status;
    this.save();
  }

  setGlobalBroadcast(message) {
    this.state.masterAuthority.globalBroadcastMessage = message;
    this.save();
  }

  toggleTwoFactorAuth() {
    this.state.securitySettings.twoFactorAuthEnabled = !this.state.securitySettings.twoFactorAuthEnabled;
    this.save();
    return this.state.securitySettings.twoFactorAuthEnabled;
  }

  toggleIncognitoMode() {
    this.state.securitySettings.incognitoMode = !this.state.securitySettings.incognitoMode;
    this.save();
    return this.state.securitySettings.incognitoMode;
  }

  exportAllUserData() {
    const exportBundle = {
      exportDate: new Date().toISOString(),
      platform: 'NAYVO Sovereign Video Platform',
      compliance: 'Indian DPDP Act 2023 & Global GDPR Article 20',
      user: this.state.currentUser,
      subscriptions: this.state.subscriptions,
      watchHistory: this.state.watchHistory,
      likedVideos: this.state.likedVideoIds,
      playlists: this.state.userPlaylists,
      uploadedVideos: this.state.videos.filter(v => v.isUserUploaded)
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nayvo_user_data_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  toggleEcoMode() {
    this.state.ecoMode = !this.state.ecoMode;
    localStorage.setItem('nayvo_eco_mode', this.state.ecoMode);
    this.save();
    return this.state.ecoMode;
  }

  incrementCarbonSaved(grams = 1.2) {
    if (this.state.ecoMode) {
      this.state.carbonSavedGrams = Math.round((this.state.carbonSavedGrams + grams) * 10) / 10;
      this.save();
    }
  }

  createClip(videoId, title, startTime, endTime) {
    const clip = {
      id: 'clip-' + Date.now(),
      videoId,
      title: this.sanitizeHTML(title.trim()) || 'Untitled Nayvo Clip',
      startTime,
      endTime,
      createdAt: 'Just now'
    };
    this.state.userClips.unshift(clip);
    this.save();
    return clip;
  }

  voteInPoll(postId, optionId) {
    if (!this.state.pollVotes[postId]) {
      this.state.pollVotes[postId] = optionId;
      this.save();
      return true;
    }
    return false;
  }

  toggleSubscribe(channelId) {
    const subs = this.state.subscriptions;
    const index = subs.indexOf(channelId);
    const channel = this.state.channels[channelId];
    
    if (index >= 0) {
      subs.splice(index, 1);
      if (channel) channel.subscribers = Math.max(0, channel.subscribers - 1);
    } else {
      subs.push(channelId);
      if (channel) channel.subscribers = (channel.subscribers || 0) + 1;
    }
    this.save();
    return index < 0;
  }

  isSubscribed(channelId) {
    return this.state.subscriptions.includes(channelId);
  }

  toggleLikeVideo(videoId) {
    const liked = this.state.likedVideoIds;
    const disliked = this.state.dislikedVideoIds;
    const video = this.state.videos.find(v => v.id === videoId);
    
    const likedIndex = liked.indexOf(videoId);
    const dislikedIndex = disliked.indexOf(videoId);

    if (dislikedIndex >= 0) disliked.splice(dislikedIndex, 1);

    if (likedIndex >= 0) {
      liked.splice(likedIndex, 1);
      if (video) video.likes = Math.max(0, (video.likes || 0) - 1);
    } else {
      liked.push(videoId);
      if (video) video.likes = (video.likes || 0) + 1;
    }
    this.save();
  }

  toggleDislikeVideo(videoId) {
    const liked = this.state.likedVideoIds;
    const disliked = this.state.dislikedVideoIds;
    const video = this.state.videos.find(v => v.id === videoId);
    
    const likedIndex = liked.indexOf(videoId);
    const dislikedIndex = disliked.indexOf(videoId);

    if (likedIndex >= 0) liked.splice(likedIndex, 1);

    if (dislikedIndex >= 0) {
      disliked.splice(dislikedIndex, 1);
    } else {
      disliked.push(videoId);
    }
    this.save();
  }

  toggleWatchLater(videoId) {
    const wl = this.state.watchLaterIds;
    const idx = wl.indexOf(videoId);
    if (idx >= 0) wl.splice(idx, 1);
    else wl.unshift(videoId);
    this.save();
    return idx < 0;
  }

  recordHistory(videoId, progress = 0) {
    if (this.state.securitySettings.incognitoMode) return;
    let hist = this.state.watchHistory;
    hist = hist.filter(h => h.videoId !== videoId);
    hist.unshift({
      videoId,
      watchedAt: Date.now(),
      progress: Math.min(1, Math.max(0, progress))
    });
    this.state.watchHistory = hist.slice(0, 50);
    this.save();
  }

  clearHistory() {
    this.state.watchHistory = [];
    this.save();
  }

  addComment(videoId, text) {
    if (!text || !text.trim()) return null;
    if (!this.state.comments[videoId]) this.state.comments[videoId] = [];
    const newComment = {
      id: 'c-' + Date.now(),
      authorName: this.sanitizeHTML(this.state.currentUser.name),
      authorHandle: this.sanitizeHTML(this.state.currentUser.handle),
      authorAvatar: this.state.currentUser.avatar,
      text: this.sanitizeHTML(text.trim()),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      isHearted: false,
      isPinned: false,
      replies: []
    };
    this.state.comments[videoId].unshift(newComment);
    this.save();
    return newComment;
  }

  addReply(videoId, commentId, text) {
    if (!text || !text.trim()) return null;
    const list = this.state.comments[videoId];
    if (!list) return null;
    const parent = list.find(c => c.id === commentId);
    if (!parent) return null;
    if (!parent.replies) parent.replies = [];
    const newReply = {
      id: 'r-' + Date.now(),
      authorName: this.sanitizeHTML(this.state.currentUser.name),
      authorHandle: this.sanitizeHTML(this.state.currentUser.handle),
      authorAvatar: this.state.currentUser.avatar,
      text: this.sanitizeHTML(text.trim()),
      timestamp: 'Just now',
      likes: 0
    };
    parent.replies.push(newReply);
    this.save();
    return newReply;
  }

  uploadNewVideo(videoData) {
    if (this.state.masterAuthority.platformStatus === 'UPLOADS_PAUSED') {
      alert('⚠️ Uploads are currently paused by the Super Admin authority for maintenance.');
      return null;
    }

    const newId = 'vid-user-' + Date.now();
    const newVideo = {
      id: newId,
      title: this.sanitizeHTML(videoData.title || 'Untitled Nayvo Video'),
      description: this.sanitizeHTML(videoData.description || ''),
      channelId: this.state.currentUser.channelId || 'ch-tech-bharat',
      category: videoData.category || 'tech',
      thumbnail: videoData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      duration: videoData.duration || 480,
      durationStr: videoData.durationStr || '8:00',
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadTime: 'Just now',
      uploadedTimestamp: Date.now(),
      isLive: false,
      isUserUploaded: true,
      visibility: videoData.visibility || 'public',
      quality: '4K Ultra HD',
      subtitlesAvailable: ['en', 'hi']
    };
    this.state.videos.unshift(newVideo);
    this.save();
    return newVideo;
  }

  createPlaylist(title) {
    const newPl = {
      id: 'pl-usr-' + Date.now(),
      title: this.sanitizeHTML(title.trim()),
      description: 'Created by ' + this.state.currentUser.name,
      author: this.state.currentUser.name,
      privacy: 'public',
      videoIds: [],
      updatedAt: 'Just now'
    };
    this.state.userPlaylists.unshift(newPl);
    this.save();
    return newPl;
  }

  addVideoToPlaylist(playlistId, videoId) {
    const pl = this.state.userPlaylists.find(p => p.id === playlistId);
    if (pl && !pl.videoIds.includes(videoId)) {
      pl.videoIds.push(videoId);
      this.save();
    }
  }

  removeVideoFromPlaylist(playlistId, videoId) {
    const pl = this.state.userPlaylists.find(p => p.id === playlistId);
    if (pl) {
      pl.videoIds = pl.videoIds.filter(id => id !== videoId);
      this.save();
    }
  }

  sendSuperChat(videoId, amount, message) {
    const item = {
      id: 'sc-' + Date.now(),
      videoId,
      amount: parseInt(amount, 10),
      message: this.sanitizeHTML(message),
      senderName: this.state.currentUser.name,
      senderAvatar: this.state.currentUser.avatar,
      timestamp: 'Just now'
    };
    this.state.superChatHistory.unshift(item);
    this.save();
    return item;
  }

  setTheme(themeName) {
    this.state.theme = themeName;
    localStorage.setItem('nayvo_theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    this.save();
  }
}

window.NayvoState = new NayvoStateStore();
window.MayaviState = window.NayvoState; // Backward compatibility alias
