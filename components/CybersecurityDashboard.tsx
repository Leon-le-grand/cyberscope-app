import React, { useState, useEffect } from 'react';
import { 
  Shield, Search, FileText, Settings, Home, Sun, Moon, Menu, X, 
  User, Download, Calendar, MapPin, Activity, Clock, AlertTriangle,
  CheckCircle, Zap, Globe, Lock, Eye, ChevronDown, Play, Pause,
  Save, Trash2, Filter, BarChart3, TrendingUp, Server
} from 'lucide-react';
import { useNotify } from './NotificationSystem';

const CybersecurityDashboard = () => {
  // Theme and UI State
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Scan State
  const [scanTarget, setScanTarget] = useState('');
  const [scanType, setScanType] = useState('port');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [savedTargets, setSavedTargets] = useState(['scanme.nmap.org', 'testphp.vulnweb.com']);

  // Settings State
  const [scanSettings, setScanSettings] = useState({
    portRange: '1-1000',
    intensity: 'normal',
    timeout: 30
  });

  // Mock user data
  const [user] = useState({
    name: 'John Doe',
    email: 'john@company.com',
    role: 'admin',
    avatar: 'JD'
  });

  const notify = useNotify();

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Mock scan function
  const performScan = async () => {
    if (!scanTarget) {
      notify.error('Missing Target', 'Please enter a target to scan');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    notify.info('Scan Started', `Initiating ${scanType} scan for ${scanTarget}`);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        target: scanTarget,
        type: scanType,
        timestamp: new Date().toISOString(),
        duration: Math.floor(Math.random() * 30) + 10,
        status: 'completed',
        findings: scanType === 'port' ? [
          { port: '22', service: 'SSH', state: 'open', risk: 'low' },
          { port: '80', service: 'HTTP', state: 'open', risk: 'medium' },
          { port: '443', service: 'HTTPS', state: 'open', risk: 'low' },
          { port: '3306', service: 'MySQL', state: 'filtered', risk: 'high' }
        ] : [
          { type: 'XSS', severity: 'high', description: 'Reflected XSS vulnerability found' },
          { type: 'SQL Injection', severity: 'critical', description: 'Potential SQL injection in login form' },
          { type: 'Outdated Software', severity: 'medium', description: 'Apache version 2.4.29 has known vulnerabilities' }
        ]
      };
      
      setScanResults(mockResults);
      setScanHistory(prev => [mockResults, ...prev.slice(0, 9)]);
      setIsScanning(false);
      notify.success('Scan Complete', `Found ${mockResults.findings.length} findings for ${scanTarget}`);
    }, 3000);
  };

  // Save target
  const saveTarget = () => {
    if (scanTarget && !savedTargets.includes(scanTarget)) {
      setSavedTargets(prev => [...prev, scanTarget]);
      notify.success('Target Saved', `${scanTarget} has been added to saved targets`);
    }
  };

  // Export results
  const exportResults = (format: string) => {
    if (!scanResults) return;
    
    const data = JSON.stringify(scanResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan_results_${scanResults.target}_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    notify.success('Export Complete', `Results exported as ${format.toUpperCase()}`);
  };

  const themeClasses = darkMode ? 'dark' : '';
  const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`${themeClasses} min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${darkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'} 1px, transparent 1px),
              linear-gradient(90deg, ${darkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 ${cardClass} border-b backdrop-blur-lg`}>
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">CyberScope Pro</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.avatar}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {userDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${cardClass} border rounded-lg shadow-lg`}>
                  <div className="p-3 border-b border-slate-700">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => setActiveSection('settings')}
                      className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center space-x-2 text-red-400">
                      <X className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 ${cardClass} border-r transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } pt-16 lg:pt-0`}>
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'scanner', label: 'Scanner', icon: Search },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'history', label: 'Scan History', icon: Clock },
              { id: 'targets', label: 'Saved Targets', icon: Save },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveSection(id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeSection === id 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Dashboard</h1>
                <p className="text-slate-400">Monitor your network security status and recent scans</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Scans', value: '1,247', icon: Search, color: 'blue' },
                  { label: 'Critical Issues', value: '23', icon: AlertTriangle, color: 'red' },
                  { label: 'Resolved', value: '186', icon: CheckCircle, color: 'green' },
                  { label: 'Active Targets', value: savedTargets.length, icon: Server, color: 'purple' }
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className={`${cardClass} border rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">{label}</p>
                        <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
                      </div>
                      <Icon className={`h-8 w-8 text-${color}-500`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className={`${cardClass} border rounded-xl p-6`}>
                <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Recent Activity</h2>
                <div className="space-y-3">
                  {scanHistory.slice(0, 5).map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${scan.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <div>
                          <p className={`font-medium ${textClass}`}>{scan.target}</p>
                          <p className="text-sm text-slate-400">{scan.type} scan • {new Date(scan.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          scan.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {scan.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scanner Section */}
          {activeSection === 'scanner' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Network Scanner</h1>
                <p className="text-slate-400">Perform comprehensive security scans on your targets</p>
              </div>

              {/* Scan Configuration */}
              <div className={`${cardClass} border rounded-xl p-6`}>
                <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Scan Configuration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={scanTarget}
                          onChange={(e) => setScanTarget(e.target.value)}
                          placeholder="Enter IP or domain"
                          className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <button
                          onClick={saveTarget}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Save Target"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Scan Type</label>
                      <select
                        value={scanType}
                        onChange={(e) => setScanType(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="port">Port Scan</option>
                        <option value="vulnerability">Vulnerability Scan</option>
                        <option value="comprehensive">Comprehensive Scan</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Saved Targets</label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {savedTargets.map((target, index) => (
                          <button
                            key={index}
                            onClick={() => setScanTarget(target)}
                            className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center justify-between group"
                          >
                            <span className="text-sm">{target}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSavedTargets(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={performScan}
                      disabled={isScanning || !scanTarget}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {isScanning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
                    </button>
                    
                    {scanResults && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => exportResults('json')}
                          className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isScanning && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400" />
                      <span className="text-sm">Scanning in progress...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scan Results */}
              {scanResults && (
                <div className={`${cardClass} border rounded-xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-semibold ${textClass}`}>Scan Results</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">
                        Completed in {scanResults.duration}s
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        {scanResults.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Target Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Target:</span>
                          <span>{scanResults.target}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Scan Type:</span>
                          <span className="capitalize">{scanResults.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Timestamp:</span>
                          <span>{new Date(scanResults.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Findings:</span>
                          <span>{scanResults.findings.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">High Risk:</span>
                          <span className="text-red-400">
                            {scanResults.findings.filter((f: any) => f.risk === 'high' || f.severity === 'high').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Medium Risk:</span>
                          <span className="text-yellow-400">
                            {scanResults.findings.filter((f: any) => f.risk === 'medium' || f.severity === 'medium').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Detailed Findings</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left p-2">
                              {scanResults.type === 'port' ? 'Port' : 'Type'}
                            </th>
                            <th className="text-left p-2">
                              {scanResults.type === 'port' ? 'Service' : 'Description'}
                            </th>
                            <th className="text-left p-2">
                              {scanResults.type === 'port' ? 'State' : 'Severity'}
                            </th>
                            <th className="text-left p-2">Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanResults.findings.map((finding: any, index: number) => (
                            <tr key={index} className="border-b border-slate-700/50">
                              <td className="p-2 font-mono">
                                {finding.port || finding.type}
                              </td>
                              <td className="p-2">
                                {finding.service || finding.description}
                              </td>
                              <td className="p-2">
                                {finding.state || finding.severity}
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  (finding.risk === 'high' || finding.severity === 'critical') ? 'bg-red-500/20 text-red-400' :
                                  (finding.risk === 'medium' || finding.severity === 'high') ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {finding.risk || finding.severity}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Section */}
          {activeSection === 'history' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Scan History</h1>
                <p className="text-slate-400">View and manage your previous security scans</p>
              </div>

              <div className={`${cardClass} border rounded-xl p-6`}>
                <div className="space-y-4">
                  {scanHistory.length > 0 ? scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${scan.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <div>
                          <p className={`font-medium ${textClass}`}>{scan.target}</p>
                          <p className="text-sm text-slate-400">
                            {scan.type} scan • {new Date(scan.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">{scan.duration}s</span>
                        <button className="p-2 hover:bg-slate-700/50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">No scan history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Settings</h1>
                <p className="text-slate-400">Configure your scanning preferences and account settings</p>
              </div>

              <div className={`${cardClass} border rounded-xl p-6`}>
                <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Scan Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Default Port Range</label>
                    <input
                      type="text"
                      value={scanSettings.portRange}
                      onChange={(e) => setScanSettings(prev => ({ ...prev, portRange: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Scan Intensity</label>
                    <select
                      value={scanSettings.intensity}
                      onChange={(e) => setScanSettings(prev => ({ ...prev, intensity: e.target.value }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="light">Light</option>
                      <option value="normal">Normal</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Timeout (seconds)</label>
                    <input
                      type="number"
                      value={scanSettings.timeout}
                      onChange={(e) => setScanSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    onClick={() => notify.success('Settings Saved', 'Your preferences have been updated')}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Targets Section */}
          {activeSection === 'targets' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Saved Targets</h1>
                <p className="text-slate-400">Manage your frequently scanned targets</p>
              </div>

              <div className={`${cardClass} border rounded-xl p-6`}>
                <div className="space-y-4">
                  {savedTargets.map((target, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Globe className="h-5 w-5 text-green-400" />
                        <div>
                          <p className={`font-medium ${textClass}`}>{target}</p>
                          <p className="text-sm text-slate-400">Target #{index + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setScanTarget(target);
                            setActiveSection('scanner');
                          }}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                        >
                          Scan
                        </button>
                        <button
                          onClick={() => setSavedTargets(prev => prev.filter((_, i) => i !== index))}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Reports</h1>
                <p className="text-slate-400">Generate and download security reports</p>
              </div>

              <div className={`${cardClass} border rounded-xl p-6`}>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No reports generated yet</p>
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CybersecurityDashboard;
