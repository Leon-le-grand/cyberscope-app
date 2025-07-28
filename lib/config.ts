export const dashboardConfig = {
  app: {
    name: 'CyberScope Pro',
    version: '2.0.0',
    description: 'Professional Cybersecurity Dashboard',
    author: 'CyberScope Team'
  },
  
  api: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.cyberscope.com' : '/api',
    timeout: 30000,
    retryAttempts: 3
  },

  scanning: {
    defaultPortRange: '1-1000',
    maxConcurrentScans: 5,
    supportedScanTypes: ['port', 'vulnerability', 'comprehensive'],
    intensityLevels: ['light', 'normal', 'aggressive'],
    defaultTimeout: 30
  },

  features: {
    enableRealTimeUpdates: true,
    enableGeolocation: true,
    enableScheduledScans: true,
    enableReports: true,
    enableAPIAccess: true,
    enableAuditLogs: true,
    enableRoleBasedAccess: true
  },

  ui: {
    defaultTheme: 'dark',
    enableThemeToggle: true,
    enableAnimations: true,
    compactMode: false,
    showNotifications: true,
    autoSaveInterval: 5000 // milliseconds
  },

  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireMFA: false,
    allowedDomains: [], // Empty array means all domains allowed
    ipWhitelist: [] // Empty array means all IPs allowed
  },

  storage: {
    maxScanHistory: 100,
    maxSavedTargets: 50,
    enableLocalStorage: true,
    enableSessionStorage: true,
    autoCleanup: true,
    retentionDays: 30
  },

  notifications: {
    types: ['info', 'success', 'warning', 'error'],
    defaultDuration: 5000,
    maxVisible: 5,
    position: 'top-right',
    enableSound: false
  },

  export: {
    supportedFormats: ['json', 'csv', 'pdf', 'xml'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    compressionEnabled: true,
    includeMetadata: true
  },

  validation: {
    ipRegex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    domainRegex: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
    portRangeRegex: /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  charts: {
    defaultColors: [
      '#10b981', // green-500
      '#3b82f6', // blue-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
      '#f97316'  // orange-500
    ],
    animationDuration: 750,
    enableInteractivity: true
  },

  performance: {
    enableLazyLoading: true,
    enableVirtualization: true,
    debounceDelay: 300,
    throttleDelay: 100,
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
  },

  accessibility: {
    enableKeyboardNavigation: true,
    enableScreenReader: true,
    enableHighContrast: false,
    enableReducedMotion: false,
    fontSize: 'normal' // 'small', 'normal', 'large'
  },

  integrations: {
    slack: {
      enabled: false,
      webhookUrl: ''
    },
    teams: {
      enabled: false,
      webhookUrl: ''
    },
    discord: {
      enabled: false,
      webhookUrl: ''
    },
    email: {
      enabled: false,
      smtpHost: '',
      smtpPort: 587,
      username: '',
      password: ''
    }
  },

  monitoring: {
    enableMetrics: true,
    enableErrorReporting: true,
    enablePerformanceTracking: true,
    sampleRate: 0.1 // 10% sampling
  }
};

// Environment-specific overrides
export const getConfig = () => {
  const config = { ...dashboardConfig };
  
  if (process.env.NODE_ENV === 'development') {
    config.api.baseUrl = '/api';
    config.monitoring.enableErrorReporting = false;
    config.ui.enableAnimations = true;
  }
  
  if (process.env.NODE_ENV === 'production') {
    config.monitoring.enableMetrics = true;
    config.security.requireMFA = true;
    config.performance.enableLazyLoading = true;
  }
  
  return config;
};

// Feature flags
export const isFeatureEnabled = (feature: string): boolean => {
  const config = getConfig();
  return config.features[feature as keyof typeof config.features] || false;
};

// Validation helpers
export const validators = {
  isValidIP: (ip: string): boolean => dashboardConfig.validation.ipRegex.test(ip),
  isValidDomain: (domain: string): boolean => dashboardConfig.validation.domainRegex.test(domain),
  isValidPortRange: (range: string): boolean => dashboardConfig.validation.portRangeRegex.test(range),
  isValidEmail: (email: string): boolean => dashboardConfig.validation.emailRegex.test(email)
};

// Theme configuration
export const themeConfig = {
  dark: {
    primary: '#10b981', // green-500
    secondary: '#64748b', // slate-500
    background: '#0f172a', // slate-900
    surface: '#1e293b', // slate-800
    text: '#f8fafc', // slate-50
    textSecondary: '#94a3b8', // slate-400
    border: '#334155', // slate-700
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  light: {
    primary: '#3b82f6', // blue-500
    secondary: '#64748b', // slate-500
    background: '#f8fafc', // slate-50
    surface: '#ffffff',
    text: '#0f172a', // slate-900
    textSecondary: '#475569', // slate-600
    border: '#e2e8f0', // slate-200
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

export default dashboardConfig;
