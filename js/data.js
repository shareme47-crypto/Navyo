// NAYVO Seed Data, Mock Media Records, Open Vault & Community Polls

const NAYVO_CATEGORIES = [
  { id: 'all', nameKey: 'home', icon: '✨' },
  { id: 'openVault', nameKey: 'openVault', icon: '🏛️' },
  { id: 'tech', nameKey: 'tech', icon: '💻' },
  { id: 'cinema', nameKey: 'cinema', icon: '🎬' },
  { id: 'music', nameKey: 'music', icon: '🎵' },
  { id: 'sports', nameKey: 'sports', icon: '🏏' },
  { id: 'learning', nameKey: 'learning', icon: '📚' },
  { id: 'gaming', nameKey: 'gaming', icon: '🎮' },
  { id: 'news', nameKey: 'news', icon: '📰' }
];

const NAYVO_DATA = {
  channels: {
    'ch-open-vault': {
      id: 'ch-open-vault',
      name: 'Nayvo Open Vault',
      handle: '@nayvo_open_vault',
      avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
      subscribers: 2840000,
      videoCount: 142,
      verified: true,
      description: 'Preserving public domain Indian cinema heritage, Creative Commons (CC-BY 3.0) 4K open films, and royalty-free scores for creators worldwide.',
      joinedDate: 'Jan 2024'
    },
    'ch-tech-bharat': {
      id: 'ch-tech-bharat',
      name: 'Tech Bharat AI',
      handle: '@techbharat_ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
      subscribers: 1450000,
      videoCount: 238,
      verified: true,
      description: 'Deep dive into Indian AI innovations, semiconductor ecosystems, sovereign cloud infrastructure, and software engineering masterclasses.',
      joinedDate: 'March 2024'
    },
    'ch-isro-pulse': {
      id: 'ch-isro-pulse',
      name: 'ISRO Frontiers & Deep Space',
      handle: '@isro_frontiers',
      avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
      subscribers: 3200000,
      videoCount: 94,
      verified: true,
      description: 'Official mission breakdowns, lunar South Pole science, cryogenic propulsion engineering, and future human spaceflight briefings.',
      joinedDate: 'Jan 2023'
    },
    'ch-ragas-beats': {
      id: 'ch-ragas-beats',
      name: 'Ragas & Beats Studio',
      handle: '@ragas_beats',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
      subscribers: 890000,
      videoCount: 165,
      verified: true,
      description: 'Classical Indian Hindustani & Carnatic scales fused with modern lo-fi, synthwave, and cinematic background scores.',
      joinedDate: 'Feb 2024'
    }
  },

  videos: [
    // Open Vault - 100% Free Creative Commons & Public Domain Media
    {
      id: 'vid-free-001',
      title: 'Sintel (4K Remastered) - Open Source Fantasy Cinema [CC-BY]',
      description: `Sintel is an independently produced open-source fantasy film created by the Blender Foundation under Creative Commons Attribution 3.0.
      
00:00 - Introduction & Snow Peak Journey
03:15 - Discovery of the Dragon Hatchling
08:45 - The Battle in the Ruins
12:30 - Revelation & Epilogue

Free to watch, stream, study, and remix worldwide on Nayvo.`,
      channelId: 'ch-open-vault',
      category: 'openVault',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      duration: 915,
      durationStr: '15:15',
      views: 3420000,
      likes: 215000,
      dislikes: 1200,
      uploadTime: '2 days ago',
      uploadedTimestamp: Date.now() - 172800000,
      isLive: false,
      quality: '4K Ultra HD',
      chapters: [
        { time: 0, title: 'Introduction' },
        { time: 195, title: 'Dragon Hatchling' },
        { time: 525, title: 'The Battle' },
        { time: 750, title: 'Revelation' }
      ],
      transcript: [
        { time: 0, text: 'The mountain wind howled across the frozen peaks of the forgotten valley.' },
        { time: 45, text: 'Sintel continued her lonely trek through the ancient dragon lands.' },
        { time: 120, text: 'A small cry echoed from beneath the frozen rocks.' },
        { time: 195, text: 'There, wounded in the snow, was Scales — the lost hatchling.' },
        { time: 350, text: 'Months passed in peaceful harmony before the great shadow descended.' },
        { time: 525, text: 'The clash echoed through the temple ruins.' }
      ]
    },
    {
      id: 'vid-free-002',
      title: 'Tears of Steel (4K Sci-Fi Visual Effects) - Open VFX Film [CC-BY]',
      description: 'Tears of Steel is an open-source science fiction film set in a dystopian future Amsterdam, released under Creative Commons Attribution 3.0. Explore cutting-edge open VFX techniques and robotic design.',
      channelId: 'ch-open-vault',
      category: 'openVault',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      duration: 730,
      durationStr: '12:10',
      views: 1850000,
      likes: 142000,
      dislikes: 800,
      uploadTime: '1 week ago',
      uploadedTimestamp: Date.now() - 604800000,
      isLive: false,
      quality: '4K Ultra HD'
    },
    {
      id: 'vid-free-003',
      title: 'Raja Harishchandra (1913 - Restored 4K) - India\'s First Feature Film [Public Domain]',
      description: 'Dadasaheb Phalke\'s historic masterpiece from 1913, digitally restored in 4K resolution. Preserved in the public domain as a national cultural treasure for cinematic study.',
      channelId: 'ch-open-vault',
      category: 'openVault',
      thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
      duration: 2400,
      durationStr: '40:00',
      views: 940000,
      likes: 88000,
      dislikes: 450,
      uploadTime: '2 weeks ago',
      uploadedTimestamp: Date.now() - 1209600000,
      isLive: false,
      quality: '4K Restored'
    },
    // Standard Platform Videos
    {
      id: 'vid-001',
      title: 'Building Sovereign Cloud Infrastructure in India: Full System Design Masterclass',
      description: `Comprehensive architectural walkthrough of building high-concurrency cloud nodes across India.
      
00:00 - Introduction & Distributed Edge Architecture
04:15 - Low-latency Indian Edge PoPs (Mumbai, Bengaluru, Delhi)
12:30 - Green Data Centers & Solar-Powered Computing
22:10 - Zero-Trust Cryptographic Security`,
      channelId: 'ch-tech-bharat',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      duration: 1845,
      durationStr: '30:45',
      views: 642000,
      likes: 48900,
      dislikes: 310,
      uploadTime: '3 hours ago',
      uploadedTimestamp: Date.now() - 10800000,
      isLive: false,
      quality: '4K Ultra HD',
      chapters: [
        { time: 0, title: 'Introduction' },
        { time: 255, title: 'Edge Architecture' },
        { time: 750, title: 'Green Data Centers' },
        { time: 1330, title: 'Zero-Trust Security' }
      ],
      transcript: [
        { time: 0, text: 'Welcome to this system design masterclass on Nayvo.' },
        { time: 60, text: 'Today we explore how to build resilient cloud architectures across India.' },
        { time: 255, text: 'Our edge nodes in Mumbai and Bengaluru achieve sub-12ms response times.' },
        { time: 500, text: 'Data sovereignty under the Indian DPDP Act 2023 is non-negotiable.' }
      ]
    },
    {
      id: 'vid-002',
      title: '🔴 LIVE: Next-Gen Cryogenic Engine Static Fire Test & Mission Telemetry',
      description: 'Live broadcast of the high-thrust cryogenic stage endurance test. Real-time telemetry, pressure gauges, and engineer commentary.',
      channelId: 'ch-isro-pulse',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1517976487585-5b87b7a69c84?w=800&auto=format&fit=crop&q=80',
      duration: 0,
      durationStr: 'LIVE',
      views: 1820000,
      likes: 194000,
      dislikes: 540,
      uploadTime: 'Streaming now',
      uploadedTimestamp: Date.now() - 3600000,
      isLive: true,
      concurrentViewers: 84500,
      quality: '1080p 60fps'
    },
    {
      id: 'vid-003',
      title: 'Raga Yaman • Indian Classical Fusion with Modern Synthwave & Lo-Fi Beats',
      description: 'Peaceful Indian classical sitar and flute compositions blended with 80s vintage analog synthesizers for deep focus and meditation.',
      channelId: 'ch-ragas-beats',
      category: 'music',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      duration: 3600,
      durationStr: '1:00:00',
      views: 1250000,
      likes: 98000,
      dislikes: 420,
      uploadTime: '1 day ago',
      uploadedTimestamp: Date.now() - 86400000,
      isLive: false,
      quality: '4K Ultra HD'
    }
  ],

  shorts: [
    {
      id: 'sh-001',
      title: 'Top 3 AI Breakthroughs happening in India right now! 🇮🇳 #TechIndia #AI',
      channelId: 'ch-tech-bharat',
      videoUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=720&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=720&auto=format&fit=crop&q=80',
      views: 890000,
      likes: 74000,
      commentsCount: 1420,
      soundTitle: 'Tech Bharat Original Audio - AI Synthesis'
    },
    {
      id: 'sh-002',
      title: 'Sitar Speedrun: 300 BPM lightning fast taan! ⚡ #ClassicalFusion',
      channelId: 'ch-ragas-beats',
      videoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=720&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=720&auto=format&fit=crop&q=80',
      views: 1200000,
      likes: 110000,
      commentsCount: 2310,
      soundTitle: 'Ragas & Beats • Yaman Taan'
    },
    {
      id: 'sh-003',
      title: 'Deep Space Telescope mirror deployment in 20 seconds! 🔭✨ #SpaceTech',
      channelId: 'ch-isro-pulse',
      videoUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=720&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=720&auto=format&fit=crop&q=80',
      views: 2400000,
      likes: 285000,
      commentsCount: 4500,
      soundTitle: 'ISRO Frontiers • Cosmic Echoes'
    }
  ],

  playlists: [
    {
      id: 'pl-free-movies',
      title: '🏛️ Nayvo Open Vault: 100% Free Open Movies & Heritage Cinema',
      description: 'Preserving open-source Creative Commons cinema and public domain gems',
      author: 'Nayvo Open Vault',
      privacy: 'public',
      videoIds: ['vid-free-001', 'vid-free-002', 'vid-free-003'],
      updatedAt: '2 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'pl-tech-masterclasses',
      title: 'Advanced System Design & Sovereign Tech In India',
      description: 'Complete roadmap for building world-class platforms',
      author: 'Tech Bharat AI',
      privacy: 'public',
      videoIds: ['vid-001', 'vid-002'],
      updatedAt: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    }
  ],

  communityPosts: [
    {
      id: 'post-001',
      channelId: 'ch-open-vault',
      text: '🏛️ Which historic restored Indian cinema monument would you like us to release next in 4K on the Nayvo Open Vault?',
      timestamp: '1 day ago',
      likes: 12400,
      poll: {
        id: 'poll-001',
        question: 'Select the next restoration release:',
        totalVotes: 38200,
        options: [
          { id: 'opt-1', label: 'Alam Ara (1931 Audio-Visual Heritage)', votes: 16800, idStr: '44%' },
          { id: 'opt-2', label: 'Keechaka Vadham (1918 Silent Epic)', votes: 12200, idStr: '32%' },
          { id: 'opt-3', label: 'Bhakta Prahlada (1932 Classic)', votes: 9200, idStr: '24%' }
        ]
      }
    }
  ],

  comments: {
    'vid-free-001': [
      {
        id: 'c-free-1',
        authorName: 'Aarav Sharma',
        authorHandle: '@aarav_codes',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        text: 'This is incredible! Having full 4K open-source films preserved on Nayvo with zero ads or copyright strikes is a huge win for creators and film lovers.',
        timestamp: '1 day ago',
        likes: 142,
        isHearted: true,
        isPinned: true,
        replies: [
          {
            id: 'r-free-1',
            authorName: 'Nayvo Open Vault',
            authorHandle: '@nayvo_open_vault',
            authorAvatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&auto=format&fit=crop&q=80',
            text: 'Thank you Aarav! More 4K Creative Commons and public domain gems coming next week.',
            timestamp: '18 hours ago',
            likes: 48
          }
        ]
      }
    ]
  },

  adminReports: [
    {
      id: 'rep-001',
      videoId: 'vid-001',
      videoTitle: 'Building Sovereign Cloud Infrastructure in India',
      channelName: 'Tech Bharat AI',
      reporterReason: 'Spam / False Tagging',
      date: '2 hours ago',
      aiSafetyScore: 99.4,
      status: 'pending'
    }
  ]
};

window.NAYVO_DATA = NAYVO_DATA;
window.MAYAVI_DATA = NAYVO_DATA; // Backward compatibility alias
window.NAYVO_CATEGORIES = NAYVO_CATEGORIES;
window.MAYAVI_CATEGORIES = NAYVO_CATEGORIES;
