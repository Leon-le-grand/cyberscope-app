import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, RefreshCw, Key, Bell, 
  Shield, Database, Download, Upload, Trash2, Eye, EyeOff
} from 'lucide-react';
import { ScanSettings } from '@/lib/types';
import { useNotify } from '@/components/NotificationSystem';
import { storage } from '@/lib/utils';

interface SettingsProps {
  darkMode: boolean;
  onThemeChange: (darkMode: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const notify = useNotify();

  // Settings state
  const [scanSettings, setScanSettings] = useState<ScanSettings>({
    portRange: '1-1000',
    intensity: 'normal',
    timeout: 30,
    enableVersionDetection: true,
    enableOSDetection: false,
    maxConcurrentScans: 3,
    notificationsEnabled: true,
    autoExport: false,
    exportFormat: 'json'
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: '',
    webhookUrl: '',
    rateLimitPerHour: 100
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    scanComplete: true,
    highRiskFindings: true,
    weeklyReports: false,
    systemMaintenance: true
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedScanSettings = storage.get<ScanSettings>('scanSettings', scanSettings);
    const savedApiSettings = storage.get('apiSettings', apiSettings);
    const savedNotificationSettings = storage.get('notificationSettings', notificationSettings);

    setScanSettings(savedScanSettings);
    setApiSettings(savedApiSettings);
    setNotificationSettings(savedNotificationSettings);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage (in real app, save to backend)
      storage.set('scanSettings', scanSettings);
      storage.set('apiSettings', apiSettings);
      storage.set('notificationSettings', notificationSettings);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      notify.success('Settings saved successfully', 'Your preferences have been updated.');
    } catch (error) {
      notify.error('Failed to save settings', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultScanSettings: ScanSettings = {
        portRange: '1-1000',
        intensity: 'normal',
        timeout: 30,
        enableVersionDetection: true,
        enableOSDetection: false,
        maxConcurrentScans: 3,
        notificationsEnabled: true,
        autoExport: false,
        exportFormat: 'json'
      };

      setScanSettings(defaultScanSettings);
      setApiSettings({
        apiKey: '',
        webhookUrl: '',
        rateLimitPerHour: 100
      });
      setNotificationSettings({
        emailNotifications: true,
        scanComplete: true,
        highRiskFindings: true,
        weeklyReports: false,
        systemMaintenance: true
      });

      notify.info('Settings reset', 'All settings have been reset to default values.');
    }
  };

  const handleExportSettings = () => {
    const allSettings = {
      scanSettings,
      apiSettings: { ...apiSettings, apiKey: '' }, // Don't export API key
      notificationSettings,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allSettings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyberscope-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notify.success('Settings exported', 'Settings file has been downloaded.');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        if (imported.scanSettings) setScanSettings(imported.scanSettings);
        if (imported.notificationSettings) setNotificationSettings(imported.notificationSettings);
        
        notify.success('Settings imported', 'Settings have been imported successfully.');
      } catch (error) {
        notify.error('Import failed', 'Invalid settings file format.');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'scanning', label: 'Scanning', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Integration', icon: Key },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const cardClass = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const inputClass = darkMode 
    ? 'bg-slate-700/50 border-slate-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Settings</h1>
        <p className="text-slate-400">Configure your scanning preferences and account settings</p>
      </div>

      {/* Tabs */}
      <div className={`${cardClass} border rounded-xl p-1`}>
        <div className="flex flex-wrap gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'hover:bg-slate-700/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className={`${cardClass} border rounded-xl p-6`}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${textClass}`}>General Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onThemeChange(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      !darkMode
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'border-slate-600 hover:bg-slate-700/50'
                    }`}
                  >
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => onThemeChange(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'border-slate-600 hover:bg-slate-700/50'
                    }`}
                  >
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                <select className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                <select className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Auto-save Interval</label>
                <select
                  value={scanSettings.autoExport ? 'enabled' : 'disabled'}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, autoExport: e.target.value === 'enabled' }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                >
                  <option value="disabled">Disabled</option>
                  <option value="enabled">After each scan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Scanning Settings */}
        {activeTab === 'scanning' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${textClass}`}>Scanning Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Port Range</label>
                <input
                  type="text"
                  value={scanSettings.portRange}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, portRange: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                  placeholder="1-1000"
                />
                <p className="text-xs text-slate-400 mt-1">Format: 1-1000 or 80,443,8080</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Intensity</label>
                <select
                  value={scanSettings.intensity}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, intensity: e.target.value as any }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                >
                  <option value="light">Light (Stealth)</option>
                  <option value="normal">Normal (Balanced)</option>
                  <option value="aggressive">Aggressive (Fast)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timeout (seconds)</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={scanSettings.timeout}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Max Concurrent Scans</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={scanSettings.maxConcurrentScans}
                  onChange={(e) => setScanSettings(prev => ({ ...prev, maxConcurrentScans: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${textClass}`}>Advanced Options</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={scanSettings.enableVersionDetection}
                    onChange={(e) => setScanSettings(prev => ({ ...prev, enableVersionDetection: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                  <span className="text-sm">Enable version detection</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={scanSettings.enableOSDetection}
                    onChange={(e) => setScanSettings(prev => ({ ...prev, enableOSDetection: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                  <span className="text-sm">Enable OS detection</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={scanSettings.autoExport}
                    onChange={(e) => setScanSettings(prev => ({ ...prev, autoExport: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                  <span className="text-sm">Auto-export scan results</span>
                </label>
              </div>

              {scanSettings.autoExport && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Export Format</label>
                  <select
                    value={scanSettings.exportFormat}
                    onChange={(e) => setScanSettings(prev => ({ ...prev, exportFormat: e.target.value as any }))}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${textClass}`}>Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Email Notifications</span>
                    <p className="text-xs text-slate-400">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Scan Complete</span>
                    <p className="text-xs text-slate-400">Notify when scans finish</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.scanComplete}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, scanComplete: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">High Risk Findings</span>
                    <p className="text-xs text-slate-400">Alert for critical vulnerabilities</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.highRiskFindings}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, highRiskFindings: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Weekly Reports</span>
                    <p className="text-xs text-slate-400">Summary reports every week</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">System Maintenance</span>
                    <p className="text-xs text-slate-400">Updates and maintenance notices</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemMaintenance}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemMaintenance: e.target.checked }))}
                    className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${textClass}`}>API & Integration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiSettings.apiKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                    className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                    placeholder="Enter your API key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Webhook URL</label>
                <input
                  type="url"
                  value={apiSettings.webhookUrl}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                  placeholder="https://your-webhook-url.com/endpoint"
                />
                <p className="text-xs text-slate-400 mt-1">Receive scan results via webhook</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={apiSettings.rateLimitPerHour}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimitPerHour: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-400 mb-2">API Documentation</h3>
              <p className="text-xs text-slate-300">
                Visit our API documentation to learn how to integrate CyberScope with your systems.
              </p>
              <button className="mt-2 text-blue-400 hover:text-blue-300 text-xs underline">
                View API Docs →
              </button>
            </div>
          </div>
        )}

        {/* Data Management */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${textClass}`}>Data Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${textClass}`}>Backup & Export</h3>
                
                <button
                  onClick={handleExportSettings}
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Settings</span>
                </button>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Import Settings</label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${textClass}`}>Data Retention</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Keep scan history for</label>
                  <select className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400 ${inputClass}`}>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180">6 months</option>
                    <option value="365">1 year</option>
                    <option value="-1">Forever</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
                      storage.remove('scanHistory');
                      notify.success('History cleared', 'All scan history has been deleted.');
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear Scan History</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-400 mb-2">Data Privacy</h3>
              <p className="text-xs text-slate-300 mb-2">
                All your scan data is stored locally in your browser and never sent to external servers unless explicitly configured.
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Scan results are stored in browser localStorage</li>
                <li>• API keys are encrypted before storage</li>
                <li>• No personal data is collected without consent</li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </button>

            <button
              onClick={handleResetSettings}
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset to Default</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Settings are automatically saved to your browser
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
