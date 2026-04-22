// web/logger.js - Central logging engine
(function() {
  'use strict';
  
  const LOGGER_VERSION = '2.0';
  const STORAGE_PREFIX = 'startech_phish_';
  
  // Log storage keys
  const KEYS = {
    ACTIVITY: STORAGE_PREFIX + 'activity_log',
    CREDENTIALS: STORAGE_PREFIX + 'credentials_log',
    ALERTS: STORAGE_PREFIX + 'alerts_log',
    DEFENSE_STATUS: STORAGE_PREFIX + 'defense_active',
    SESSION: STORAGE_PREFIX + 'session_id'
  };
  
  // Initialize logs if not exists
  function initLogs() {
    if (!localStorage.getItem(KEYS.ACTIVITY)) {
      localStorage.setItem(KEYS.ACTIVITY, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.CREDENTIALS)) {
      localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.ALERTS)) {
      localStorage.setItem(KEYS.ALERTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.SESSION)) {
      localStorage.setItem(KEYS.SESSION, generateSessionId());
    }
  }
  
  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Core logging functions
  window.PhishLogger = {
    logActivity: function(eventType, details) {
      const entry = {
        timestamp: new Date().toISOString(),
        sessionId: localStorage.getItem(KEYS.SESSION),
        eventType: eventType,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        details: details || {}
      };
      
      const logs = JSON.parse(localStorage.getItem(KEYS.ACTIVITY) || '[]');
      logs.push(entry);
      localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(logs));
      
      // Also log to console in development
      console.log('[ACTIVITY]', entry);
      
      return entry;
    },
    
    logCredential: function(username, password, service) {
      const entry = {
        timestamp: new Date().toISOString(),
        sessionId: localStorage.getItem(KEYS.SESSION),
        username: username,
        password: password,
        service: service || 'unknown',
        page: window.location.pathname,
        ipSimulated: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255)
      };
      
      const logs = JSON.parse(localStorage.getItem(KEYS.CREDENTIALS) || '[]');
      logs.push(entry);
      localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(logs));
      
      console.log('[CREDENTIAL CAPTURED]', entry);
      
      // Trigger alert if defense mode checks
      this.checkAnomalies();
      
      return entry;
    },
    
    logAlert: function(alertType, severity, message) {
      const entry = {
        timestamp: new Date().toISOString(),
        type: alertType,
        severity: severity || 'medium',
        message: message,
        acknowledged: false
      };
      
      const logs = JSON.parse(localStorage.getItem(KEYS.ALERTS) || '[]');
      logs.push(entry);
      localStorage.setItem(KEYS.ALERTS, JSON.stringify(logs));
      
      console.log('[ALERT]', entry);
      
      return entry;
    },
    
    checkAnomalies: function() {
      const creds = JSON.parse(localStorage.getItem(KEYS.CREDENTIALS) || '[]');
      const recentCreds = creds.filter(c => {
        const ts = new Date(c.timestamp);
        const now = new Date();
        return (now - ts) < 300000; // Last 5 minutes
      });
      
      // Anomaly detection: multiple submissions in short time
      if (recentCreds.length >= 3) {
        this.logAlert('anomaly', 'high', 'Multiple credential submissions detected in 5 minutes');
      }
      
      // Check for suspicious patterns
      const uniqueIPs = new Set(recentCreds.map(c => c.ipSimulated)).size;
      if (uniqueIPs >= 2 && recentCreds.length >= 2) {
        this.logAlert('anomaly', 'medium', 'Credentials submitted from multiple IPs');
      }
    },
    
    getActivityLogs: function(limit) {
      const logs = JSON.parse(localStorage.getItem(KEYS.ACTIVITY) || '[]');
      return limit ? logs.slice(-limit) : logs;
    },
    
    getCredentialLogs: function(limit) {
      const logs = JSON.parse(localStorage.getItem(KEYS.CREDENTIALS) || '[]');
      return limit ? logs.slice(-limit) : logs;
    },
    
    getAlertLogs: function(limit) {
      const logs = JSON.parse(localStorage.getItem(KEYS.ALERTS) || '[]');
      return limit ? logs.slice(-limit) : logs;
    },
    
    clearAllLogs: function() {
      localStorage.setItem(KEYS.ACTIVITY, JSON.stringify([]));
      localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify([]));
      localStorage.setItem(KEYS.ALERTS, JSON.stringify([]));
      this.logActivity('logs_cleared', { action: 'manual_clear' });
    },
    
    isDefenseActive: function() {
      return localStorage.getItem(KEYS.DEFENSE_STATUS) === 'active';
    },
    
    activateDefense: function() {
      localStorage.setItem(KEYS.DEFENSE_STATUS, 'active');
      this.logAlert('defense', 'critical', 'DEFENSE MODE ACTIVATED - Blocking new phishing attempts');
      this.logActivity('defense_activated', { status: 'active' });
    },
    
    deactivateDefense: function() {
      localStorage.setItem(KEYS.DEFENSE_STATUS, 'inactive');
      this.logActivity('defense_deactivated', { status: 'inactive' });
    },
    
    getSessionId: function() {
      return localStorage.getItem(KEYS.SESSION);
    },
    
    // Export logs as downloadable files
    exportLogs: function(type) {
      let data, filename;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      switch(type) {
        case 'activity':
          data = localStorage.getItem(KEYS.ACTIVITY) || '[]';
          filename = `activity_${timestamp}.log`;
          break;
        case 'credentials':
          data = localStorage.getItem(KEYS.CREDENTIALS) || '[]';
          filename = `credentials_${timestamp}.log`;
          break;
        case 'alerts':
          data = localStorage.getItem(KEYS.ALERTS) || '[]';
          filename = `alerts_${timestamp}.log`;
          break;
        default:
          return;
      }
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  // Auto-initialize
  initLogs();
  
  // Log page view automatically
  window.addEventListener('load', function() {
    PhishLogger.logActivity('page_view', {
      url: window.location.href,
      referrer: document.referrer || 'direct',
      screenResolution: window.screen.width + 'x' + window.screen.height
    });
  });
  
  // Track clicks on links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      PhishLogger.logActivity('link_click', {
        href: link.href,
        text: link.textContent.trim().substring(0, 100)
      });
    }
  });
  
})();