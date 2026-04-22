// it_dashboard/dashboard.js - Defender dashboard logic
(function() {
  'use strict';
  
  class DefenderDashboard {
    constructor() {
      this.refreshInterval = null;
      this.autoRefreshEnabled = true;
      this.init();
    }
    
    init() {
      this.bindEvents();
      this.loadDashboard();
      this.startAutoRefresh();
      
      // Log dashboard access
      if (window.PhishLogger) {
        PhishLogger.logActivity('dashboard_access', { role: 'it_defender' });
      }
    }
    
    bindEvents() {
      const refreshBtn = document.getElementById('refreshDashboard');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => this.loadDashboard());
      }
      
      const clearBtn = document.getElementById('clearLogsBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.confirmClearLogs());
      }
      
      const defenseBtn = document.getElementById('toggleDefenseBtn');
      if (defenseBtn) {
        defenseBtn.addEventListener('click', () => this.toggleDefense());
      }
      
      const exportActivity = document.getElementById('exportActivity');
      if (exportActivity) {
        exportActivity.addEventListener('click', () => PhishLogger.exportLogs('activity'));
      }
      
      const exportCredentials = document.getElementById('exportCredentials');
      if (exportCredentials) {
        exportCredentials.addEventListener('click', () => PhishLogger.exportLogs('credentials'));
      }
      
      const autoRefreshToggle = document.getElementById('autoRefresh');
      if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', (e) => {
          this.autoRefreshEnabled = e.target.checked;
          if (this.autoRefreshEnabled) {
            this.startAutoRefresh();
          } else {
            this.stopAutoRefresh();
          }
        });
      }
    }
    
    loadDashboard() {
      this.updateStats();
      this.renderActivityLog();
      this.renderCredentialLog();
      this.renderAlertLog();
      this.updateDefenseStatus();
      this.updateLastRefresh();
    }
    
    updateStats() {
      const activities = PhishLogger.getActivityLogs();
      const credentials = PhishLogger.getCredentialLogs();
      const alerts = PhishLogger.getAlertLogs();
      
      // Count unique sessions
      const uniqueSessions = new Set(activities.map(a => a.sessionId)).size;
      
      // Count page views
      const pageViews = activities.filter(a => a.eventType === 'page_view').length;
      
      // Update DOM
      const totalActivities = document.getElementById('totalActivities');
      if (totalActivities) totalActivities.textContent = activities.length;
      
      const capturedCreds = document.getElementById('capturedCredentials');
      if (capturedCreds) capturedCreds.textContent = credentials.length;
      
      const activeAlerts = document.getElementById('activeAlerts');
      if (activeAlerts) {
        const unackedAlerts = alerts.filter(a => !a.acknowledged).length;
        activeAlerts.textContent = unackedAlerts;
      }
      
      const sessionCount = document.getElementById('sessionCount');
      if (sessionCount) sessionCount.textContent = uniqueSessions;
      
      const pageViewCount = document.getElementById('pageViewCount');
      if (pageViewCount) pageViewCount.textContent = pageViews;
    }
    
    renderActivityLog() {
      const container = document.getElementById('activityLogContainer');
      if (!container) return;
      
      const logs = PhishLogger.getActivityLogs(50).reverse();
      
      if (logs.length === 0) {
        container.innerHTML = '<div class="text-muted text-center p-4">No activity recorded yet</div>';
        return;
      }
      
      container.innerHTML = logs.map(log => {
        const time = new Date(log.timestamp).toLocaleTimeString();
        return `
          <div class="log-entry">
            <span class="status-badge status-info">${log.eventType}</span>
            <span class="text-muted" style="margin-left: 8px;">${time}</span>
            <div style="margin-top: 4px; font-size: 0.85rem;">
              ${log.page || 'unknown'} | Session: ${log.sessionId?.substr(0, 8)}...
            </div>
          </div>
        `;
      }).join('');
    }
    
    renderCredentialLog() {
      const container = document.getElementById('credentialLogContainer');
      if (!container) return;
      
      const logs = PhishLogger.getCredentialLogs(50).reverse();
      
      if (logs.length === 0) {
        container.innerHTML = '<div class="text-muted text-center p-4">No credentials captured yet</div>';
        return;
      }
      
      container.innerHTML = logs.map(log => {
        const time = new Date(log.timestamp).toLocaleTimeString();
        return `
          <div class="log-entry" style="border-left-color: var(--accent-red);">
            <div><strong>${log.username}</strong> : ${'*'.repeat(log.password?.length || 6)}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">
              ${log.service} | ${time} | IP: ${log.ipSimulated}
            </div>
          </div>
        `;
      }).join('');
    }
    
    renderAlertLog() {
      const container = document.getElementById('alertLogContainer');
      if (!container) return;
      
      const logs = PhishLogger.getAlertLogs(20).reverse();
      
      if (logs.length === 0) {
        container.innerHTML = '<div class="text-muted text-center p-4">No alerts generated</div>';
        return;
      }
      
      container.innerHTML = logs.map(log => {
        const time = new Date(log.timestamp).toLocaleTimeString();
        const severityClass = log.severity === 'high' || log.severity === 'critical' 
          ? 'status-danger' 
          : log.severity === 'medium' ? 'status-warning' : 'status-success';
        
        return `
          <div class="alert alert-${log.severity === 'high' ? 'danger' : log.severity === 'medium' ? 'warning' : 'success'}">
            <div style="display: flex; justify-content: space-between;">
              <span class="status-badge ${severityClass}">${log.severity.toUpperCase()}</span>
              <span class="text-muted">${time}</span>
            </div>
            <div style="margin-top: 8px;">${log.message}</div>
            ${!log.acknowledged ? '<div style="margin-top: 8px;"><button class="btn btn-outline btn-sm" onclick="acknowledgeAlert(\'' + log.timestamp + '\')">Acknowledge</button></div>' : ''}
          </div>
        `;
      }).join('');
    }
    
    updateDefenseStatus() {
      const statusEl = document.getElementById('defenseStatus');
      const btn = document.getElementById('toggleDefenseBtn');
      
      if (!statusEl || !btn) return;
      
      const isActive = PhishLogger.isDefenseActive();
      
      if (isActive) {
        statusEl.innerHTML = '<span class="status-badge status-success">ACTIVE - BLOCKING ATTACKS</span>';
        btn.textContent = 'Deactivate Defense';
        btn.className = 'btn btn-danger';
      } else {
        statusEl.innerHTML = '<span class="status-badge status-warning">INACTIVE - MONITORING ONLY</span>';
        btn.textContent = 'Activate Defense Mode';
        btn.className = 'btn btn-success';
      }
    }
    
    toggleDefense() {
      if (PhishLogger.isDefenseActive()) {
        PhishLogger.deactivateDefense();
      } else {
        PhishLogger.activateDefense();
      }
      this.updateDefenseStatus();
      this.loadDashboard();
    }
    
    confirmClearLogs() {
      if (confirm('WARNING: This will clear all captured logs. Continue?')) {
        PhishLogger.clearAllLogs();
        this.loadDashboard();
      }
    }
    
    updateLastRefresh() {
      const el = document.getElementById('lastRefresh');
      if (el) {
        el.textContent = new Date().toLocaleTimeString();
      }
    }
    
    startAutoRefresh() {
      this.stopAutoRefresh();
      this.refreshInterval = setInterval(() => {
        if (this.autoRefreshEnabled) {
          this.loadDashboard();
        }
      }, 5000);
    }
    
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    }
  }
  
  // Acknowledge alert function (global for onclick)
  window.acknowledgeAlert = function(timestamp) {
    const alerts = JSON.parse(localStorage.getItem('startech_phish_alerts_log') || '[]');
    const updated = alerts.map(a => {
      if (a.timestamp === timestamp) {
        a.acknowledged = true;
      }
      return a;
    });
    localStorage.setItem('startech_phish_alerts_log', JSON.stringify(updated));
    
    // Refresh dashboard
    if (window.dashboard) {
      window.dashboard.loadDashboard();
    }
  };
  
  // Initialize on load
  window.addEventListener('load', function() {
    window.dashboard = new DefenderDashboard();
  });
  
})();