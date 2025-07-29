// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Shield, Search, FileText, Settings, Home, Sun, Moon, Menu, X,
  User, Download, Calendar, MapPin, Activity, Clock, AlertTriangle,
  CheckCircle, Zap, Globe, Lock, Eye, ChevronDown, Play, Pause,
  Save, Trash2, Filter, BarChart3, TrendingUp, Server, Wrench, Plus,
  Sparkles, Package, Import, List, Cpu, ShieldCheck, Network, Key,
  ChevronsLeft, ChevronsRight // Icons for sidebar toggle
} from 'lucide-react';
import { useNotify } from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext'; // CORRECTED: Reverted to the original import path

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const notify = useNotify();

  // Theme and UI State
  const [darkMode, setDarkMode] = useState(true);
  // sidebarOpen: true = expanded (w-56) on desktop, false = collapsed (w-20) on desktop
  // on mobile: true = open (w-56 overlay), false = hidden (w-0)
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to expanded on load
  const [activeSection, setActiveSection] = useState('ai-overview');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  // State for AI Insight Popup
  const [aiInsightPopupOpen, setAiInsightPopupOpen] = useState(false);
  const [aiInsightContent, setAiInsightContent] = useState('');

  // State for Report Creation Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);


  // Project State
  const [currentProject, setCurrentProject] = useState({
    name: 'Web Application Scan',
    target: 'example.com',
    type: 'domain'
  });

  // Scan State
  const [scanTarget, setScanTarget] = useState('');
  const [scanType, setScanType] = useState('port');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  
  // Addons State
  const [addons, setAddons] = useState([
    { name: 'Wordlists', installed: true, description: 'Common password and directory wordlists' },
    { name: 'NMAP Scripts', installed: false, description: 'Advanced NMAP scanning scripts' },
    { name: 'Payloads', installed: false, description: 'Common attack payloads for testing' }
  ]);

  // Tools State
  const [tools] = useState([
    { name: 'Port Scanner', icon: Network, description: 'Scan for open ports and services' },
    { name: 'Vulnerability Scanner', icon: ShieldCheck, description: 'Identify security vulnerabilities' },
    { name: 'SSL Analyzer', icon: Lock, description: 'Check SSL/TLS configuration' },
    { name: 'Subdomain Finder', icon: Globe, description: 'Discover subdomains of a target' },
    { name: 'Password Cracker', icon: Key, description: 'Test password strength' },
    { name: 'API Scanner', icon: Cpu, description: 'Scan API endpoints for issues' }
  ]);

  // Report Editor State (now tied to the modal)
  const [reportContent, setReportContent] = useState<string>('');
  const [reportMetadata, setReportMetadata] = useState({
    reportId: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    reportedBy: user?.name || 'CyberScope User',
    target: currentProject.target,
  });

  // Effect to update report metadata when user or project changes (e.g., on first load)
  useEffect(() => {
    setReportMetadata(prev => ({
      ...prev,
      reportedBy: user?.name || 'CyberScope User',
      target: currentProject.target,
    }));
  }, [user, currentProject]);

  // Helper to generate a dummy report content for AI Overview button
  const generateDummyReportContent = () => {
    const findings = scanResults?.findings || [
      { type: 'XSS', severity: 'high', description: 'Reflected XSS vulnerability found in search input. Malicious script can be injected, leading to session hijacking or defacement.' },
      { type: 'SQL Injection', severity: 'critical', description: 'Potential SQL injection in login form. Attacker can bypass authentication or extract data from database.' },
      { type: 'Outdated Software', severity: 'medium', description: 'Apache version 2.4.29 has known vulnerabilities (CVE-2023-XXXX). Upgrade to a patched version immediately.' }
    ];

    let content = `AI-Powered Analysis Summary:\n\n`;
    content += `The AI has identified the following potential security concerns based on your latest scan data for ${currentProject.target}:\n\n`;

    if (findings.length > 0) {
      findings.forEach((finding: any, index: number) => {
        content += `Vulnerability ${index + 1}: ${finding.type || 'Unknown'}\n`;
        content += `Severity: ${finding.severity.toUpperCase()}\n`;
        content += `Description: ${finding.description}\n`;
        if (finding.severity === 'critical') {
            content += `Impact: Critical vulnerabilities can lead to full system compromise or significant data loss.\n`;
            content += `Recommendation: Immediate action required. Prioritize patching or implementing compensating controls.\n`;
        } else if (finding.severity === 'high') {
            content += `Impact: High-severity issues can allow unauthorized access or privilege escalation.\n`;
            content += `Recommendation: High priority. Address as soon as possible.\n`;
        } else {
            content += `Impact: Potential information disclosure or minor disruption.\n`;
            content += `Recommendation: Medium/Low priority. Review and mitigate as appropriate.\n`;
        }
        content += `\n`;
      });
      content += `Overall Recommendations: Implement rigorous input validation and output encoding for all user-supplied data. Regularly update all software components, libraries, and frameworks. Conduct periodic security audits and penetration testing. Ensure proper access controls and least privilege principles are enforced.`;
    } else {
      content += `No major vulnerabilities were automatically identified by the AI in the recent scan of ${currentProject.target}. Continue regular monitoring and manual penetration testing for comprehensive coverage. Maintain proactive security hygiene and stay updated with the latest threat intelligence.`;
    }

    return content;
  };


  // Report Editor Actions
  const handleCreateNewReport = () => {
    setReportContent('');
    // Generate a simple unique ID for demonstration
    const newReportId = `REP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setReportMetadata({
      reportId: newReportId,
      date: new Date().toISOString().split('T')[0],
      reportedBy: user?.name || 'CyberScope User',
      target: currentProject.target,
    });
    setReportModalOpen(true); // Open the modal
    notify.info('New Report', 'Creating a new security report.');
  };

  const handleSaveReport = () => {
    // In a real app, you'd send `reportContent` and `reportMetadata` to a backend API to save it.
    console.log('Saving report:', { content: reportContent, metadata: reportMetadata });
    notify.success('Report Saved', 'Your document has been saved locally (mock).');
    setReportModalOpen(false); // Close modal on save
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Security Report - ${reportMetadata.reportId || 'New Document'}</title>
            <style>
              body { font-family: sans-serif; margin: 20px; line-height: 1.6; color: #333; }
              h1, h2, h3 { color: #222; margin-bottom: 10px; }
              pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
              .section-divider { border-top: 1px dashed #ccc; margin: 20px 0; }
              .header-title { text-align: center; margin-bottom: 30px; font-size: 2em; color: #10B981; }
              .report-meta p { margin-bottom: 5px; }
              .report-meta strong { color: #555; }
            </style>
          </head>
          <body>
            <div class="header-title">CyberScope Pro Security Report</div>
            <div class="report-meta">
              <p><strong>Report ID:</strong> ${reportMetadata.reportId || 'N/A'}</p>
              <p><strong>Date:</strong> ${reportMetadata.date}</p>
              <p><strong>Target:</strong> ${reportMetadata.target}</p>
              <p><strong>Prepared By:</strong> ${reportMetadata.reportedBy}</p>
            </div>
            <div class="section-divider"></div>
            <h1>Report Content</h1>
            <pre>${reportContent}</pre>
            <div class="section-divider"></div>
            <p style="text-align: center; color: #777;">Generated by CyberScope Pro</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      notify.success('Download Initiated', 'Report prepared for PDF download.');
    } else {
      notify.error('Error', 'Could not open print window. Please allow pop-ups.');
    }
  };


  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    notify.info('Theme Changed', `Switched to ${darkMode ? 'light' : 'dark'} mode`);
  };

  // Handle active section change with loading animation
  const handleSetActiveSection = (id: string) => {
    setIsLoadingContent(true); // Start loading animation
    setTimeout(() => {
      setActiveSection(id); // Change section after a delay
      setIsLoadingContent(false); // End loading animation
      // On small screens, close sidebar after selection
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }, 300); // Simulate 300ms loading time
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
          { port: '22', service: 'SSH', state: 'open', risk: 'low', description: 'SSH Port 22 Open' },
          { port: '80', service: 'HTTP', state: 'open', risk: 'medium', description: 'HTTP Port 80 Open' },
          { port: '443', service: 'HTTPS', state: 'open', risk: 'low', description: 'HTTPS Port 443 Open' },
          { port: '3306', service: 'MySQL', state: 'filtered', risk: 'high', description: 'MySQL Port 3306 Filtered' }
        ] : [
          { type: 'XSS', severity: 'high', description: 'Reflected XSS vulnerability found in search input.' },
          { type: 'SQL Injection', severity: 'critical', description: 'Potential SQL injection in login form.' },
          { type: 'Outdated Software', severity: 'medium', description: 'Apache version 2.4.29 has known vulnerabilities.' }
        ]
      };

      setScanResults(mockResults);
      setScanHistory(prev => [mockResults, ...prev.slice(0, 9)]);
      setIsScanning(false);
      notify.success('Scan Complete', `Found ${mockResults.findings.length} findings for ${scanTarget}`);
    }, 3000);
  };

  // Function to open AI Insight popup
  const handleViewAiInsight = () => {
    setAiInsightContent(generateDummyReportContent()); // Populate with generated content
    setAiInsightPopupOpen(true);
  };

  const themeClasses = darkMode ? 'dark' : '';
  const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const inputClass = "w-full p-2 rounded-lg bg-slate-700/50 border border-slate-700 focus:outline-none focus:border-green-500";


  return (
    <div className={`${themeClasses} min-h-screen ${bgClass} transition-colors duration-300 flex flex-col`}>
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
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-3">
            {/* Mobile-only menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700/50 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">CyberScope Pro</span>
            </div>
          </div>

          {/* Project Selector */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{currentProject.target}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
              <Plus className="h-4 w-4 text-green-400" />
            </button>
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
                  {user?.avatar || 'DU'}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {userDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${cardClass} border rounded-lg shadow-lg`}>
                  <div className="p-3 border-b border-slate-700">
                    <p className="font-medium">{user?.name || 'Demo User'}</p>
                    <p className="text-sm text-slate-400">{user?.email || 'demo@cyberscope.com'}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center space-x-2 text-red-400"
                    >
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

      {/* Main layout container (below header) */}
      <div className="flex flex-grow mt-16 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          ${cardClass} border-r transition-all duration-300 ease-in-out
          flex flex-col py-4
          h-[calc(100vh-4rem)] /* Fixed height for sidebar, allows its content to scroll if needed */
          lg:static lg:h-auto lg:shrink-0 lg:border-r
          ${sidebarOpen ? 'w-56' : 'w-20'} /* Desktop: w-56 expanded, w-20 collapsed */
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} /* Mobile: slides in/out fully */
          fixed top-16 left-0 z-40 /* Mobile overlay */
          lg:block /* Always block on large screens to maintain layout */
        `}>
          {/* Desktop Sidebar Toggle (only visible on large screens) */}
          <div className={`hidden lg:flex justify-end p-2 mb-4`}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700/50"
              aria-label="Toggle sidebar collapse"
            >
              {sidebarOpen ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Sidebar Navigation - Apply overflow-y-auto here for internal scrolling */}
          <nav className="px-4 space-y-1 flex-grow overflow-y-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'ai-overview', label: 'AI Overview', icon: Sparkles },
              { id: 'scanner', label: 'Scanner', icon: Search },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'history', label: 'Scan History', icon: Clock },
              { id: 'tools', label: 'Tools', icon: Wrench },
              { id: 'addons', label: 'Addons', icon: Package },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleSetActiveSection(id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors
                  ${activeSection === id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'hover:bg-slate-700/50'}
                  ${!sidebarOpen && 'justify-center'} /* Center icons when collapsed */
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{label}</span>}
                {/* For collapsed state, a tooltip could be added here */}
              </button>
            ))}
          </nav>

          {/* Settings at the bottom of the scrollable area */}
          <div className="p-4 border-t border-slate-700 mt-auto">
            <button
              onClick={() => handleSetActiveSection('settings')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === 'settings'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'hover:bg-slate-700/50'
              }
              ${!sidebarOpen && 'justify-center'} /* Center icon when collapsed */
              `}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Settings</span>}
              {/* For collapsed state, a tooltip could be added here */}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        {/* Adjusted left margin for desktop to account for sidebar width */}
        <main className={`flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-20'} /* Push content based on sidebar state */
          `}>
          {isLoadingContent ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <p className="text-green-400 text-lg">Loading section...</p>
            </div>
          ) : (
            <>
              {/* Dashboard Overview */}
              {activeSection === 'dashboard' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Dashboard</h1>
                    <p className="text-slate-400">Monitor your network security status and recent scans</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Scans', value: scanHistory.length, icon: Search, color: 'blue' },
                      { label: 'Critical Issues', value: '3', icon: AlertTriangle, color: 'red' },
                      { label: 'Resolved', value: '12', icon: CheckCircle, color: 'green' },
                      { label: 'Active Targets', value: '1', icon: Server, color: 'purple' }
                    ].map(({ label, value, icon: Icon, color: itemColor }) => ( // Renamed 'color' to 'itemColor'
                      <div key={label} className={`${cardClass} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-400 text-sm">{label}</p>
                            <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
                          </div>
                          <Icon className={`h-8 w-8 text-${itemColor}-500`} /> {/* Using itemColor here */}
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
                              <p className="text-sm text-slate-400">{new Date(scan.timestamp).toLocaleString()}</p>
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

              {/* AI Overview Section */}
              {activeSection === 'ai-overview' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>AI Security Overview</h1>
                    <p className="text-slate-400">Get intelligent insights about your target's security posture</p>
                  </div>

                  {/* Buttons for AI Overview */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        const reportId = `#AI-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                        setReportMetadata(prev => ({ ...prev, reportId, target: currentProject.target, reportedBy: user?.name || 'CyberScope User' }));
                        setReportContent(generateDummyReportContent());
                        setReportModalOpen(true); // Open the report modal directly
                        notify.success('Report Drafted', `AI-powered report draft '${reportId}' created.`);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate AI-Powered Report</span>
                    </button>
                    <button
                      onClick={handleViewAiInsight} // New button to view insights in popup
                      className="flex-1 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View AI Insights</span>
                    </button>
                  </div>


                  {/* AI Overview content */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Sparkles className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <h2 className={`text-xl font-semibold ${textClass}`}>Security Assessment</h2>
                        <p className="text-slate-400">AI-powered analysis of your target</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className={`${cardClass} border rounded-lg p-6`}>
                        <h3 className="font-semibold mb-4">Vulnerability Summary</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Critical</span>
                              <span className="text-sm text-red-400">3 issues</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">High</span>
                              <span className="text-sm text-yellow-400">7 issues</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Medium</span>
                              <span className="text-sm text-blue-400">12 issues</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${cardClass} border rounded-lg p-6`}>
                        <h3 className="font-semibold mb-4">Recommendations</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Update Apache to version 2.4.56</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Disable TLS 1.0 and 1.1 support</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Implement rate limiting on login endpoint</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Sanitize user input in contact forms</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className={`${cardClass} border rounded-lg p-6`}>
                      <h3 className="font-semibold mb-4">Detailed AI Insights</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Based on the latest scan of {currentProject.target}, our AI engine detected several patterns indicative of potential security vulnerabilities.
                        Specifically, the system identified outdated server software (Apache 2.4.29) which is known to have CVE-2023-XXXX.
                        Furthermore, certain input fields appear to be susceptible to cross-site scripting (XSS) due to insufficient sanitization, and a possible SQL injection point was flagged in the user authentication module.
                        The AI suggests immediate review of these findings and prioritizes patching critical and high-severity issues to mitigate risks of unauthorized access and data exfiltration.
                        Further analysis reveals that the current SSL/TLS configuration could be strengthened by disabling older, less secure protocols like TLS 1.0 and 1.1.
                        The AI also recommends implementing robust rate-limiting mechanisms on all public-facing endpoints to prevent brute-force attacks.
                        Continuous monitoring and adherence to secure coding practices are advised to maintain a strong security posture.
                        This section could contain a very long, detailed AI-generated report summary, explaining every anomaly, potential attack vector, and mitigation strategy, pulling data from various scan modules and threat intelligence feeds.
                        It would also highlight trends, suggest predictive measures, and recommend specific patches or configuration changes.
                        The goal is to provide a comprehensive, actionable overview that combines raw scan data with intelligent analysis, making it easier for security teams to understand complex issues and prioritize their remediation efforts.
                        This section has enough content that it **should be scrollable independently** if the window is not tall enough to fit it all. This ensures that even if you have a massive AI report, the sidebar itself doesn't scroll with it, and the rest of the dashboard remains in place.
                        This section has enough content that it **should be scrollable independently** if the window is not tall enough to fit it all. This ensures that even if you have a massive AI report, the sidebar itself doesn't scroll with it, and the rest of the dashboard remains in place.
                        This section has enough content that it **should be scrollable independently** if the window is not tall enough to fit it all. This ensures that even if you have a massive AI report, the sidebar itself doesn't scroll with it, and the rest of the dashboard remains in place.
                        This section has enough content that it **should be scrollable independently** if the window is not tall enough to fit it all. This ensures that even if you have a massive AI report, the sidebar itself doesn't scroll with it, and the rest of the dashboard remains in place.
                        This section has enough content that it **should be scrollable independently** if the window is not tall enough to fit it all. This ensures that even if you have a massive AI report, the sidebar itself doesn't scroll with it, and the rest of the dashboard remains in place.
                        This section has enough content that it **should be scrollable independently** if the window is not tall enough to fit it all. This ensures that even if you have a massive AI report, the sidebar itself doesn't scroll with it, and the rest of the dashboard remains in place.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tools Section */}
              {activeSection === 'tools' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Tools</h1>
                    <p className="text-slate-400">Select the tools you want to use for your security assessment</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                      <div key={index} className={`${cardClass} border rounded-xl p-6 hover:border-green-500/30 transition-colors`}>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <tool.icon className="h-5 w-5 text-green-400" />
                          </div>
                          <h3 className="font-semibold">{tool.name}</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{tool.description}</p>
                        <button className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition-colors">
                          Use Tool
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons Section */}
              {activeSection === 'addons' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Addons</h1>
                    <p className="text-slate-400">Enhance your scanning capabilities with additional tools and resources</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addons.map((addon, index) => (
                      <div key={index} className={`${cardClass} border rounded-xl p-6`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{addon.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">{addon.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            addon.installed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {addon.installed ? 'Installed' : 'Available'}
                          </span>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button className={`px-3 py-1 rounded text-sm ${
                            addon.installed
                              ? 'bg-slate-700 hover:bg-slate-600'
                              : 'bg-green-500 hover:bg-green-600'
                          } transition-colors`}>
                            {addon.installed ? 'Manage' : 'Install'}
                          </button>
                          {!addon.installed && (
                            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                              Details
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className={`${cardClass} border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center`}>
                      <Package className="h-8 w-8 text-slate-400 mb-3" />
                      <h3 className="font-medium mb-1">Import Addon</h3>
                      <p className="text-sm text-slate-400 mb-4">Upload custom tools or wordlists</p>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                        <Import className="h-4 w-4" />
                        <span>Import</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scanner Section (placeholder) */}
              {activeSection === 'scanner' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Scanner</h1>
                  <p className="text-slate-400">Configure and run your security scans.</p>
                  {/* Add scanner input fields, type selection, and scan button here */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4`}>New Scan</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="scanTarget" className="block text-sm font-medium text-slate-400 mb-1">Target</label>
                        <input
                          type="text"
                          id="scanTarget"
                          value={scanTarget}
                          onChange={(e) => setScanTarget(e.target.value)}
                          placeholder="e.g., example.com or 192.168.1.1"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="scanType" className="block text-sm font-medium text-slate-400 mb-1">Scan Type</label>
                        <select
                          id="scanType"
                          value={scanType}
                          onChange={(e) => setScanType(e.target.value)}
                          className={inputClass}
                        >
                          <option value="port">Port Scan</option>
                          <option value="vulnerability">Vulnerability Scan</option>
                          <option value="ssl">SSL Scan</option>
                        </select>
                      </div>
                      <button
                        onClick={performScan}
                        disabled={isScanning}
                        className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isScanning ? 'Scanning...' : 'Start Scan'}
                      </button>
                    </div>
                  </div>
                  {scanResults && (
                    <div className={`${cardClass} border rounded-xl p-6 mt-6`}>
                      <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Scan Results</h2>
                      <p className="text-sm text-slate-400 mb-2">Target: {scanResults.target}</p>
                      <p className="text-sm text-slate-400 mb-2">Type: {scanResults.type}</p>
                      <p className="text-sm text-slate-400 mb-4">Duration: {scanResults.duration} seconds</p>
                      <h3 className="font-semibold mb-2">Findings ({scanResults.findings.length})</h3>
                      <ul className="space-y-2">
                        {scanResults.findings.map((finding: any, idx: number) => (
                          <li key={idx} className="bg-slate-700/30 p-3 rounded-lg flex justify-between items-center">
                            <span className="text-sm">{finding.description || `Port: ${finding.port}, Service: ${finding.service}`}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${finding.severity === 'critical' ? 'bg-red-500/20 text-red-400' : ''}
                              ${finding.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : ''}
                              ${finding.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                              ${finding.severity === 'low' ? 'bg-blue-500/20 text-blue-400' : ''}
                              ${finding.state === 'open' ? 'bg-green-500/20 text-green-400' : ''}
                              ${finding.state === 'filtered' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                            `}>
                              {finding.severity || finding.state}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Reports Section (placeholder) */}
              {activeSection === 'reports' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Reports</h1>
                    <p className="text-slate-400">Create, view, and manage your detailed security reports.</p>
                  </div>

                  <div className={`${cardClass} border rounded-xl p-6 flex items-center justify-between`}>
                      <h2 className={`text-xl font-semibold ${textClass}`}>Manage Reports</h2>
                      <button
                          onClick={handleCreateNewReport} // Button to open the modal
                          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors flex items-center space-x-2"
                      >
                          <Plus className="h-4 w-4" />
                          <span>Create New Report</span>
                      </button>
                  </div>

                  <div className={`${cardClass} border rounded-xl p-6`}>
                      <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Existing Reports</h2>
                      {/* Placeholder for a list of existing reports */}
                      <p className="text-slate-400">Your saved reports will appear here. Click "Create New Report" to start.</p>
                      <ul className="mt-4 space-y-2">
                        {/* Example existing report items */}
                        <li className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                          <span>Report #SEC-2023-001 (example.com)</span>
                          <div className="flex space-x-2">
                            <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      </ul>
                  </div>
                </div>
              )}

              {/* Scan History Section (placeholder) */}
              {activeSection === 'history' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Scan History</h1>
                  <p className="text-slate-400">Review your past security scan results.</p>
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    {scanHistory.length === 0 ? (
                      <p>No scan history yet. Start a scan to see it here!</p>
                    ) : (
                      <div className="space-y-3">
                        {scanHistory.map((scan, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30">
                            {/* FIX: Wrapped the first two elements in a parent div */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${scan.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                              <div>
                                <p className={`font-medium ${textClass}`}>{scan.target}</p>
                                <p className="text-sm text-slate-400">{new Date(scan.timestamp).toLocaleString()}</p>
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
                    )}
                  </div>
                </div>
              )}

              {/* Settings Section (placeholder) */}
              {activeSection === 'settings' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Settings</h1>
                  <p className="text-slate-400">Manage your application settings.</p>
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <p>User preferences, integrations, notifications, etc. will go here.</p>
                    <div className="mt-4">
                      <h3 className="font-medium text-slate-300 mb-2">Account Info</h3>
                      <p className="text-sm text-slate-400">Name: {user?.name || 'Demo User'}</p>
                      <p className="text-sm text-slate-400">Email: {user?.email || 'demo@cyberscope.com'}</p>
                      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm">Logout</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay (active when sidebarOpen is true AND it's a small screen) */}
      {sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* AI Insight Popup Card */}
      {aiInsightPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`${cardClass} border rounded-xl shadow-lg w-full max-w-3xl h-3/4 flex flex-col`}>
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h2 className={`text-xl font-bold ${textClass}`}>Detailed AI Insights</h2>
              <button onClick={() => setAiInsightPopupOpen(false)} className="p-2 rounded-lg hover:bg-slate-700/50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 flex-grow overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300">{aiInsightContent}</pre>
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-end">
              <button onClick={() => setAiInsightPopupOpen(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Creation Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`${cardClass} border rounded-xl shadow-lg w-full max-w-4xl h-[90vh] flex flex-col`}>
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h2 className={`text-xl font-bold ${textClass}`}>Create/Edit Security Report</h2>
              <button onClick={() => setReportModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-700/50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 flex-grow overflow-y-auto space-y-6">
              {/* Report Editor Metadata Fields (moved inside modal) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reportId" className="block text-sm font-medium text-slate-400 mb-1">Report ID</label>
                  <input
                    type="text"
                    id="reportId"
                    value={reportMetadata.reportId}
                    onChange={(e) => setReportMetadata(prev => ({ ...prev, reportId: e.target.value }))}
                    placeholder="e.g., CYB-REP-001"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="reportDate" className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    id="reportDate"
                    value={reportMetadata.date}
                    onChange={(e) => setReportMetadata(prev => ({ ...prev, date: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="reportedBy" className="block text-sm font-medium text-slate-400 mb-1">Reported By</label>
                  <input
                    type="text"
                    id="reportedBy"
                    value={reportMetadata.reportedBy}
                    onChange={(e) => setReportMetadata(prev => ({ ...prev, reportedBy: e.target.value }))}
                    placeholder="Your Name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="reportTarget" className="block text-sm font-medium text-slate-400 mb-1">Target</label>
                  <input
                    type="text"
                    id="reportTarget"
                    value={reportMetadata.target}
                    onChange={(e) => setReportMetadata(prev => ({ ...prev, target: e.target.value }))}
                    placeholder="e.g., example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Main Report Content Textarea (moved inside modal) */}
              <div>
                <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Report Content</h2>
                <textarea
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  placeholder="Start typing your security report details here, including vulnerability descriptions, impact, and recommendations..."
                  className={`w-full h-96 ${inputClass} resize-y font-mono text-sm`}
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-700 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setReportModalOpen(false)}
                className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                disabled={!reportContent}
                className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 inline-block mr-2" />
                Save Report
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={!reportContent}
                className="flex-1 sm:flex-none bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 inline-block mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
