// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Search, FileText, Settings, Home, Sun, Moon, Menu, X,
  User, Download, Calendar, MapPin, Activity, Clock, AlertTriangle,
  CheckCircle, Zap, Globe, Lock, Eye, ChevronDown, Play, Pause,
  Save, Trash2, Filter, BarChart3, TrendingUp, Server, Wrench, Plus,
  Sparkles, Package, Import, List, Cpu, ShieldCheck, Network, Key,
  ChevronsLeft, ChevronsRight, Bell, Info, ExternalLink,
  Code, Terminal, Cloud, Database, Bug, Layers, DollarSign, Gift,
  CreditCard, UserCheck, Code2 // New icons for features
} from 'lucide-react';
import { useNotify } from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image'; // For animated logos

// Define User interface to include plan and trialEndDate
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  lastLogin?: string;
  scanQuota?: number;
  plan?: 'free_trial' | 'pro' | 'pro_plus' | 'free'; // Added plan type
  trialEndDate?: string; // ISO string for trial end date
}

// Define Addon interface with size and status
interface Addon {
  id: string;
  name: string;
  description: string;
  size: string; // e.g., "500 MB", "2 GB"
  installed: boolean;
  status?: 'installing' | 'installed' | 'available';
  version?: string;
  lastUpdated?: string;
}

// Define Tool interface with category
interface Tool {
  id: string;
  name: string;
  icon: React.ElementType; // Lucide icon component
  description: string;
  category: 'network' | 'web' | 'password' | 'general';
  isScanningTool?: boolean; // New property to distinguish scanning tools
}

// Define Scan interface with status
interface Scan {
  id: string;
  target: string;
  type: string;
  timestamp: string;
  duration: number;
  status: 'pending' | 'completed' | 'canceled';
  findings: any[];
  toolsUsed?: string[]; // New: Tools used for this scan
  errors?: string[]; // New: Errors during scan
  logs?: string; // New: Detailed logs
}


export default function DashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const notify = useNotify();

  // Theme and UI State
  const [darkMode, setDarkMode] = useState(true);
  // sidebarMode: 'expanded' = full width, 'icons-only' = collapsed to icons
  const [sidebarMode, setSidebarMode] = useState<'expanded' | 'icons-only'>('expanded');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false); // Controls mobile overlay
  const [activeSection, setActiveSection] = useState('dashboard'); // Changed default active section to 'dashboard'
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false); // New: Notification dropdown

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
  const [scanTarget, setScanTarget] = useState(currentProject.target); // Initialize with current project target
  const [scanType, setScanType] = useState('port');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<Scan[]>([]); // Typed Scan[]

  // New: Scan History Filters & Search
  const [scanFilter, setScanFilter] = useState<'all' | 'pending' | 'completed' | 'canceled'>('all');
  const [scanSearchTerm, setScanSearchTerm] = useState('');
  const [selectedScanForDetails, setSelectedScanForDetails] = useState<Scan | null>(null);

  // Addons State
  const [addons, setAddons] = useState<Addon[]>([
    { id: 'wordlists', name: 'Wordlists', installed: true, description: 'Common password and directory wordlists', size: '500 MB', status: 'installed', version: '1.0.0', lastUpdated: '2025-07-01' },
    { id: 'nmap-scripts', name: 'NMAP Scripts', installed: false, description: 'Advanced NMAP scanning scripts', size: '2 GB', status: 'available', version: '1.2.1', lastUpdated: '2025-06-15' },
    { id: 'payloads', name: 'Payloads', installed: false, description: 'Common attack payloads for testing', size: '1.5 GB', status: 'available', version: '2.0.0', lastUpdated: '2025-07-20' },
    { id: 'recon-modules', name: 'Recon Modules', installed: true, description: 'Modules for advanced reconnaissance', size: '750 MB', status: 'installed', version: '1.1.0', lastUpdated: '2025-07-25' },
    { id: 'exploit-db', name: 'Exploit Database', installed: false, description: 'Access to a comprehensive exploit database', size: '5 GB', status: 'available', version: '1.0.0', lastUpdated: '2025-05-10' }
  ]);
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [addonActionType, setAddonActionType] = useState<'install' | 'manage' | null>(null);

  // Tools State (Generic Tools)
  const [genericTools] = useState<Tool[]>([
    { id: 'port-scanner', name: 'Port Scanner', icon: Network, description: 'Scan for open ports and services', category: 'network' },
    { id: 'vulnerability-scanner', name: 'Vulnerability Scanner', icon: ShieldCheck, description: 'Identify security vulnerabilities', category: 'general' },
    { id: 'ssl-analyzer', name: 'SSL Analyzer', icon: Lock, description: 'Check SSL/TLS configuration', category: 'web' },
    { id: 'subdomain-finder', name: 'Subdomain Finder', icon: Globe, description: 'Discover subdomains of a target', category: 'web' },
    { id: 'password-cracker', name: 'Password Cracker', icon: Key, description: 'Test password strength', category: 'password' },
    { id: 'api-scanner', name: 'API Scanner', icon: Cpu, description: 'Scan API endpoints for issues', category: 'web' }
  ]);

  // Scanning Tools (for Scanner Tab)
  const [scanningTools] = useState<Tool[]>([
    { id: 'nmap', name: 'Nmap', icon: Terminal, description: 'Network discovery and security auditing tool.', category: 'network', isScanningTool: true },
    { id: 'nikto', name: 'Nikto', icon: Bug, description: 'Web server scanner for vulnerabilities.', category: 'web', isScanningTool: true },
    { id: 'gobuster', name: 'Gobuster', icon: Code2, description: 'Directory/file & DNS busting tool.', category: 'web', isScanningTool: true },
    { id: 'sqlmap', name: 'SQLMap', icon: Database, description: 'Automatic SQL injection and database takeover tool.', category: 'web', isScanningTool: true },
  ]);

  // New: Tools Filters & Search (for Tools Tab)
  const [toolFilter, setToolFilter] = useState<'all' | 'network' | 'web' | 'password' | 'general'>('all');
  const [toolSearchTerm, setToolSearchTerm] = useState('');

  // Report Editor State (now tied to the modal)
  const [reportContent, setReportContent] = useState<string>('');
  const [reportMetadata, setReportMetadata] = useState({
    reportId: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    reportedBy: user?.name || 'CyberScope User',
    target: currentProject.target,
  });

  // New: Notifications State
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to CyberScope Pro! Your 7-day free trial has started.",
    "New NMAP Scripts addon available!",
    "Your scan for example.com completed successfully.",
  ]);

  // Trial End Date Calculation
  const trialEndDate = user?.trialEndDate ? new Date(user.trialEndDate) : null;
  const now = new Date();
  const timeLeftMs = trialEndDate ? trialEndDate.getTime() - now.getTime() : 0;
  const daysLeft = Math.max(0, Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24)));
  const isTrialActive = user?.plan === 'free_trial' && daysLeft > 0;

  // State for Tool Options Modal
  const [toolOptionsModalOpen, setToolOptionsModalOpen] = useState(false);
  const [selectedToolForOptions, setSelectedToolForOptions] = useState<Tool | null>(null);
  const [nmapOptions, setNmapOptions] = useState({ osDetection: false, noPing: false, aggressive: false });
  const [niktoOptions, setNiktoOptions] = useState({ fullScan: false, sslSupport: false });
  const [gobusterOptions, setGobusterOptions] = useState({ wordlist: 'common', extensions: '', threads: 10 });
  const [sqlmapOptions, setSqlmapOptions] = useState({ level: 1, risk: 1, tamper: false });


  // Effect to update report metadata when user or project changes (e.g., on first load)
  useEffect(() => {
    setReportMetadata(prev => ({
      ...prev,
      reportedBy: user?.name || 'CyberScope User',
      target: currentProject.target,
    }));
    // Keep scanTarget in sync with current project target
    setScanTarget(currentProject.target);
  }, [user, currentProject]);

  // Handle initial active section on component mount
  useEffect(() => {
    setActiveSection('dashboard'); // Ensure dashboard is active on refresh
  }, []);

  // Set initial trial end date on user load if not already set (for new users)
  useEffect(() => {
    if (user && !user.trialEndDate && user.plan === 'free_trial') {
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      updateProfile({ trialEndDate: sevenDaysFromNow });
    }
  }, [user, updateProfile, now]);

  // Helper to generate a dummy report content for AI Overview button
  const generateDummyReportContent = useCallback(() => {
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
  }, [scanResults, currentProject.target]);


  // Report Editor Actions
  const handleCreateNewReport = () => {
    setReportContent('');
    const newReportId = `REP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setReportMetadata({
      reportId: newReportId,
      date: new Date().toISOString().split('T')[0],
      reportedBy: user?.name || 'CyberScope User',
      target: currentProject.target,
    });
    setReportModalOpen(true);
    notify.info('New Report', 'Creating a new security report.');
  };

  const handleSaveReport = () => {
    console.log('Saving report:', { content: reportContent, metadata: reportMetadata });
    notify.success('Report Saved', 'Your document has been saved locally (mock).');
    setReportModalOpen(false);
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
        setSidebarOpenMobile(false);
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
      const statusOptions: Scan['status'][] = ['completed', 'pending', 'canceled'];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const mockResults: Scan = {
        id: `scan-${Date.now()}`,
        target: scanTarget,
        type: scanType,
        timestamp: new Date().toISOString(),
        duration: Math.floor(Math.random() * 30) + 10,
        status: randomStatus, // Random status for testing filters
        findings: scanType === 'port' ? [
          { port: '22', service: 'SSH', state: 'open', risk: 'low', description: 'SSH Port 22 Open' },
          { port: '80', service: 'HTTP', state: 'open', risk: 'medium', description: 'HTTP Port 80 Open' },
          { port: '443', service: 'HTTPS', state: 'open', risk: 'low', description: 'HTTPS Port 443 Open' },
          { port: '3306', service: 'MySQL', state: 'filtered', risk: 'high', description: 'MySQL Port 3306 Filtered' }
        ] : [
          { type: 'XSS', severity: 'high', description: 'Reflected XSS vulnerability found in search input.' },
          { type: 'SQL Injection', severity: 'critical', description: 'Potential SQL injection in login form.' },
          { type: 'Outdated Software', severity: 'medium', description: 'Apache version 2.4.29 has known vulnerabilities.' }
        ],
        toolsUsed: ['Nmap', 'Nikto'], // Mock tools used
        errors: randomStatus === 'canceled' ? ['Scan interrupted by user.', 'Target unresponsive.'] : [],
        logs: randomStatus === 'pending' ? 'Scan is currently running. Awaiting results...' :
              randomStatus === 'canceled' ? 'Scan was cancelled. Some partial results may be available.' :
              'Scan completed successfully. All checks performed.'
      };

      setScanResults(mockResults);
      setScanHistory(prev => [mockResults, ...prev.slice(0, 9)]);
      setIsScanning(false);
      notify.success('Scan Complete', `Found ${mockResults.findings.length} findings for ${scanTarget}`);
    }, 3000);
  };

  // Function to open AI Insight popup
  const handleViewAiInsight = () => {
    setAiInsightContent(generateDummyReportContent());
    setAiInsightPopupOpen(true);
  };

  // Filtered Scan History
  const filteredScanHistory = scanHistory.filter(scan => {
    const matchesFilter = scanFilter === 'all' || scan.status === scanFilter;
    const matchesSearch = scan.target.toLowerCase().includes(scanSearchTerm.toLowerCase()) ||
                          scan.type.toLowerCase().includes(scanSearchTerm.toLowerCase()) ||
                          scan.status.toLowerCase().includes(scanSearchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Tools (for Tools Tab)
  const filteredGenericTools = genericTools.filter(tool => {
    const matchesFilter = toolFilter === 'all' || tool.category === toolFilter;
    const matchesSearch = tool.name.toLowerCase().includes(toolSearchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(toolSearchTerm.toLowerCase()) ||
                          tool.category.toLowerCase().includes(toolSearchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Addon Modal Handlers
  const handleAddonAction = (addon: Addon, type: 'install' | 'manage') => {
    setSelectedAddon(addon);
    setAddonActionType(type);
    setAddonModalOpen(true);
  };

  const handleInstallAddon = (addonId: string) => {
    setAddons(prev => prev.map(addon =>
      addon.id === addonId ? { ...addon, installed: true, status: 'installing' } : addon
    ));
    notify.info('Installing Addon', `${selectedAddon?.name} is being installed...`);
    setAddonModalOpen(false);
    // Simulate installation
    setTimeout(() => {
      setAddons(prev => prev.map(addon =>
        addon.id === addonId ? { ...addon, status: 'installed' } : addon
      ));
      notify.success('Installation Complete', `${selectedAddon?.name} installed successfully!`);
    }, 2000);
  };

  const handleUpgradePlan = (plan: 'pro' | 'pro_plus') => {
    notify.info('Upgrade Initiated', `Initiating upgrade to ${plan.toUpperCase()} plan.`);
    // In a real app, this would redirect to a payment gateway or trigger a Cloud Function
    console.log(`User ${user?.email} wants to upgrade to ${plan}`);
    // For demo, simulate success
    setTimeout(() => {
      updateProfile({ plan: plan as User['plan'], trialEndDate: undefined }); // Update user's plan in Firestore, clear trial end date
      notify.success('Upgrade Successful', `You are now on the ${plan.toUpperCase()} plan!`);
      setActiveSection('settings'); // Stay on settings to see plan change
    }, 1500);
  };

  // Handle opening tool options modal
  const handleOpenToolOptions = (tool: Tool) => {
    setSelectedToolForOptions(tool);
    setToolOptionsModalOpen(true);
  };

  // Handle initiating scan from tool options modal
  const handleScanWithToolOptions = () => {
    if (!selectedToolForOptions || !scanTarget) {
      notify.error('Scan Error', 'Tool or target not selected.');
      return;
    }
    notify.info('Scan Initiated', `Starting ${selectedToolForOptions.name} scan on ${scanTarget} with custom options.`);
    setToolOptionsModalOpen(false);
    // Here you would integrate with your backend to run the actual scan
    // For now, simulate a generic scan result
    performScan(); // Re-use general scan function for mock results
  };


  const themeClasses = darkMode ? 'dark' : '';
  const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const inputClass = "w-full p-2 rounded-lg bg-slate-700/50 border border-slate-700 focus:outline-none focus:border-green-500";
  const buttonPrimaryClass = "bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors";
  const buttonSecondaryClass = "bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors";


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
              onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
              className="p-2 rounded-lg hover:bg-slate-700/50 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpenMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {/* Desktop Sidebar Toggle (always visible, affects sidebar width) */}
            <button
              onClick={() => setSidebarMode(prev => prev === 'expanded' ? 'icons-only' : 'expanded')}
              className="p-2 rounded-lg hover:bg-slate-700/50 hidden lg:block"
              aria-label="Toggle sidebar collapse"
            >
              {sidebarMode === 'expanded' ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
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

          {/* Trial Countdown & Upgrade Button */}
          {isTrialActive && (
            <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
              <Gift className="h-4 w-4" />
              <span>Free Trial: {daysLeft} days left!</span>
              <button
                onClick={() => handleSetActiveSection('settings')} // Go to settings to upgrade
                className="ml-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors text-xs"
              >
                Upgrade Now
              </button>
            </div>
          )}


          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-slate-900 bg-red-500" />
                )}
              </button>
              {notificationDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-64 ${cardClass} border rounded-lg shadow-lg max-h-60 overflow-y-auto ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}`}>
                  <div className="p-3 border-b border-slate-700">
                    <p className="font-medium">Notifications</p>
                  </div>
                  <div className="p-1">
                    {notifications.length > 0 ? (
                      notifications.map((notif, index) => (
                        <div key={index} className="p-2 text-sm border-b border-slate-700 last:border-b-0">
                          {notif}
                        </div>
                      ))
                    ) : (
                      <p className="p-2 text-sm text-slate-400">No new notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                    <button
                      onClick={() => { handleSetActiveSection('settings'); setUserDropdownOpen(false); }}
                      className="w-full text-left p-2 hover:bg-slate-700/50 rounded flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile & Settings</span>
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
          ${sidebarMode === 'expanded' ? 'w-56' : 'w-20'} /* Desktop: w-56 expanded, w-20 collapsed */
          ${sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'} /* Mobile: slides in/out fully */
          fixed top-16 left-0 z-40 /* Mobile overlay */
          lg:block /* Always block on large screens to maintain layout */
        `}>
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
                  ${sidebarMode === 'icons-only' && 'justify-center'} /* Center icons when collapsed */
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarMode === 'expanded' && <span className="whitespace-nowrap">{label}</span>}
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
              ${sidebarMode === 'icons-only' && 'justify-center'} /* Center icon when collapsed */
              `}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarMode === 'expanded' && <span className="whitespace-nowrap">Settings</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
          ${sidebarMode === 'expanded' ? 'lg:ml-56' : 'lg:ml-20'} /* Push content based on sidebar state */
          ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}
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
                    ].map(({ label, value, icon: Icon, color: itemColor }) => (
                      <div key={label} className={`${cardClass} border rounded-xl p-6`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-400 text-sm">{label}</p>
                            <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
                          </div>
                          <Icon className={`h-8 w-8 text-${itemColor}-500`} />
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
                    <p className="text-slate-400">Get intelligent insights about your target's security posture.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        const reportId = `#AI-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                        setReportMetadata(prev => ({ ...prev, reportId, target: currentProject.target, reportedBy: user?.name || 'CyberScope User' }));
                        setReportContent(generateDummyReportContent());
                        setReportModalOpen(true);
                        notify.success('Report Drafted', `AI-powered report draft '${reportId}' created.`);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate AI-Powered Report</span>
                    </button>
                    <button
                      onClick={handleViewAiInsight}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View AI Insights</span>
                    </button>
                  </div>

                  {/* New: Import Results Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        if (scanResults) {
                          setAiInsightContent(generateDummyReportContent()); // Re-generate content with latest scan results
                          notify.success('Results Imported', 'Latest scan results imported for AI analysis.');
                        } else {
                          notify.info('No Results', 'Perform a scan first to import results.');
                        }
                      }}
                      className={`px-6 py-3 ${buttonSecondaryClass} flex items-center space-x-2`}
                    >
                      <Import className="h-5 w-5" />
                      <span>Import Latest Scan Results</span>
                    </button>
                  </div>

                  {/* Simplified AI Overview content - removed static insights */}
                  <div className={`${cardClass} border rounded-xl p-6 text-center`}>
                    <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h2 className={`text-xl font-semibold ${textClass} mb-2`}>AI Analysis Ready</h2>
                    <p className="text-slate-400 mb-4">Click "Generate AI-Powered Report" to get a detailed security analysis, or "View AI Insights" for a quick summary.</p>
                    <p className="text-sm text-slate-500">The AI leverages data from your recent scans to provide actionable recommendations.</p>
                  </div>
                </div>
              )}

              {/* Scanner Section */}
              {activeSection === 'scanner' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Scanner</h1>
                    <p className="text-slate-400">Configure and launch various security scans against your targets.</p>
                  </div>

                  {/* Scan Configuration */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Quick Scan</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="scanTarget" className="block text-sm font-medium text-slate-400 mb-1">Target (Domain or IP)</label>
                        <input
                          type="text"
                          id="scanTarget"
                          className={inputClass}
                          placeholder="e.g., example.com or 192.168.1.1"
                          value={scanTarget}
                          onChange={(e) => setScanTarget(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="scanType" className="block text-sm font-medium text-slate-400 mb-1">Scan Type</label>
                        <select
                          id="scanType"
                          className={inputClass}
                          value={scanType}
                          onChange={(e) => setScanType(e.target.value)}
                        >
                          <option value="port">Port Scan</option>
                          <option value="vulnerability">Basic Vulnerability Scan</option>
                          <option value="web">Basic Web App Scan</option>
                          <option value="network">Basic Network Discovery</option>
                        </select>
                      </div>
                      <button
                        onClick={performScan}
                        disabled={isScanning}
                        className={`w-full py-2 px-4 rounded-lg ${buttonPrimaryClass} ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isScanning ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Scanning...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <Zap className="h-5 w-5" />
                            <span>Start Quick Scan</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Vulnerability Scanning Tools */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Vulnerability Scanning Tools</h2>
                    <p className="text-slate-400 mb-6">Select a specialized tool to configure and launch a targeted scan.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {scanningTools.map((tool) => (
                        <div key={tool.id} className={`${cardClass} border rounded-xl p-6 flex flex-col`}>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                              <tool.icon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                              <h3 className={`text-xl font-semibold ${textClass}`}>{tool.name}</h3>
                              <p className="text-sm text-slate-400">{tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tool</p>
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm mb-4 flex-grow">{tool.description}</p>
                          <button
                            onClick={() => handleOpenToolOptions(tool)}
                            className={`w-full py-2 ${buttonSecondaryClass}`}
                          >
                            Configure & Scan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scan Results */}
                  {scanResults && (
                    <div className={`${cardClass} border rounded-xl p-6`}>
                      <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Latest Scan Results for {scanResults.target}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400 mb-4">
                        <p><strong>Type:</strong> {scanResults.type}</p>
                        <p><strong>Status:</strong> <span className={`font-medium ${scanResults.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{scanResults.status}</span></p>
                        <p><strong>Duration:</strong> {scanResults.duration} seconds</p>
                        <p><strong>Timestamp:</strong> {new Date(scanResults.timestamp).toLocaleString()}</p>
                      </div>
                      <h3 className={`text-lg font-semibold ${textClass} mb-3`}>Findings ({scanResults.findings.length})</h3>
                      <div className="space-y-3">
                        {scanResults.findings.map((finding: any, index: number) => (
                          <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                            <p className="font-medium text-white">{finding.type || finding.port}</p>
                            <p className="text-sm text-slate-400">{finding.description}</p>
                            <p className={`text-xs font-semibold mt-1 ${
                              finding.severity === 'critical' ? 'text-red-400' :
                              finding.severity === 'high' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`}>Severity: {finding.severity || finding.risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reports Section */}
              {activeSection === 'reports' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Reports</h1>
                    <p className="text-slate-400">Manage and generate detailed security assessment reports.</p>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button onClick={handleCreateNewReport} className={`px-4 py-2 ${buttonPrimaryClass} flex items-center space-x-2`}>
                      <Plus className="h-5 w-5" />
                      <span>Create New Report</span>
                    </button>
                  </div>

                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Report List (Mock)</h2>
                    <p className="text-slate-400">Your generated reports will appear here. Click "Create New Report" to start.</p>
                    {/* Mock report list */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30">
                        <div>
                          <p className="font-medium text-white">Report #ABC1234</p>
                          <p className="text-sm text-slate-400">Target: example.com - 2025-07-28</p>
                        </div>
                        <button onClick={() => notify.info('View Report', 'Viewing mock report')} className={`px-3 py-1 text-sm ${buttonSecondaryClass}`}>View</button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30">
                        <div>
                          <p className="font-medium text-white">Report #DEF5678</p>
                          <p className="text-sm text-slate-400">Target: test.org - 2025-07-20</p>
                        </div>
                        <button onClick={() => notify.info('View Report', 'Viewing mock report')} className={`px-3 py-1 text-sm ${buttonSecondaryClass}`}>View</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scan History Section */}
              {activeSection === 'history' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Scan History</h1>
                    <p className="text-slate-400">Review past scan results and their statuses.</p>
                  </div>

                  {/* Filters and Search for Scan History */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label htmlFor="scanSearch" className="sr-only">Search Scans</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          id="scanSearch"
                          className={`${inputClass} pl-10`}
                          placeholder="Search scans by target or type..."
                          value={scanSearchTerm}
                          onChange={(e) => setScanSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                      {['all', 'completed', 'pending', 'canceled'].map(status => (
                        <button
                          key={status}
                          onClick={() => setScanFilter(status as Scan['status'] | 'all')}
                          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200
                            ${scanFilter === status
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                              : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                            }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scan History List */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4`}>All Scans ({filteredScanHistory.length})</h2>
                    {filteredScanHistory.length > 0 ? (
                      <div className="space-y-4">
                        {filteredScanHistory.map((scan) => (
                          <div key={scan.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <div>
                              <p className={`font-medium ${textClass} text-lg`}>{scan.target} <span className="text-sm text-slate-400">({scan.type})</span></p>
                              <p className="text-sm text-slate-400">Started: {new Date(scan.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                scan.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                scan.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                              </span>
                              <button onClick={() => setSelectedScanForDetails(scan)} className={`px-3 py-1 text-sm ${buttonSecondaryClass}`}>
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-8">No scans match your criteria.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tools Section */}
              {activeSection === 'tools' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Security Tools</h1>
                    <p className="text-slate-400">Explore and utilize a variety of powerful cybersecurity tools.</p>
                  </div>

                  {/* Tool Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label htmlFor="toolSearch" className="sr-only">Search Tools</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          id="toolSearch"
                          className={`${inputClass} pl-10`}
                          placeholder="Search tools by name or description..."
                          value={toolSearchTerm}
                          onChange={(e) => setToolSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                      {['all', 'network', 'web', 'password', 'general'].map(category => (
                        <button
                          key={category}
                          onClick={() => setToolFilter(category as Tool['category'] | 'all')}
                          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200
                            ${toolFilter === category
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                              : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                            }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tool List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGenericTools.map((tool) => (
                      <div key={tool.id} className={`${cardClass} border rounded-xl p-6 flex flex-col`}>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <tool.icon className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className={`text-xl font-semibold ${textClass}`}>{tool.name}</h3>
                            <p className="text-sm text-slate-400">{tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tool</p>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-4 flex-grow">{tool.description}</p>
                        <button onClick={() => notify.info('Tool Action', `Using ${tool.name}`)} className={`w-full py-2 ${buttonSecondaryClass}`}>
                          Use Tool
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Animated Logos Section */}
                  <div className={`${cardClass} border rounded-xl p-6 relative overflow-hidden`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4 text-center`}>Powered by Industry-Leading Tools</h2>
                    <div className="relative w-full overflow-hidden py-4">
                      <div className="flex items-center justify-around animate-marquee whitespace-nowrap">
                        {/* Repeat logos to create continuous scroll effect */}
                        {['/nmap-logo.png', '/nikto-logo.png', '/gobuster-logo.png', '/sqlmap-logo.png', '/metasploit-logo.png', '/burpsuite-logo.png'].map((src, index) => (
                          <Image key={`logo-${index}-1`} src={src} alt={`Tool Logo ${index}`} width={80} height={80} className="mx-8 grayscale opacity-70 hover:opacity-100 transition-opacity duration-300" />
                        ))}
                        {/* Duplicated set for seamless loop */}
                        {['/nmap-logo.png', '/nikto-logo.png', '/gobuster-logo.png', '/sqlmap-logo.png', '/metasploit-logo.png', '/burpsuite-logo.png'].map((src, index) => (
                          <Image key={`logo-${index}-2`} src={src} alt={`Tool Logo ${index}`} width={80} height={80} className="mx-8 grayscale opacity-70 hover:opacity-100 transition-opacity duration-300" />
                        ))}
                      </div>
                    </div>
                    <style jsx>{`
                      @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); } /* Moves half the width of duplicated content */
                      }
                      .animate-marquee {
                        animation: marquee 30s linear infinite; /* Adjust duration for speed */
                      }
                    `}</style>
                    <div className="text-center mt-4">
                      <button onClick={() => notify.info('Learn More', 'Explore our comprehensive toolset.')} className={`px-6 py-2 ${buttonPrimaryClass}`}>
                        Explore All Tools
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Addons Section */}
              {activeSection === 'addons' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Addons Marketplace</h1>
                    <p className="text-slate-400">Extend CyberScope Pro's capabilities with powerful addons.</p>
                  </div>

                  {/* Go to Store Card */}
                  <div className={`${cardClass} border rounded-xl p-6 text-center`}>
                    <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h2 className={`text-xl font-semibold ${textClass} mb-2`}>Discover More Addons</h2>
                    <p className="text-slate-400 mb-4">Visit our full marketplace for even more powerful integrations and tools.</p>
                    <button onClick={() => notify.info('Go to Store', 'Redirecting to CyberScope Addon Store (mock).')} className={`px-6 py-2 ${buttonPrimaryClass}`}>
                      Go to Store
                    </button>
                  </div>

                  {/* Addons List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addons.map((addon) => (
                      <div key={addon.id} className={`${cardClass} border rounded-xl p-6 flex flex-col`}>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Package className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <h3 className={`text-xl font-semibold ${textClass}`}>{addon.name}</h3>
                            <p className="text-sm text-slate-400">{addon.description}</p>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 mb-4 flex-grow">
                          <p><strong>Size:</strong> {addon.size}</p>
                          {addon.version && <p><strong>Version:</strong> {addon.version}</p>}
                          {addon.lastUpdated && <p><strong>Last Updated:</strong> {addon.lastUpdated}</p>}
                          <p><strong>Status:</strong> <span className={`font-semibold ${addon.status === 'installed' ? 'text-green-400' : addon.status === 'installing' ? 'text-yellow-400' : 'text-blue-400'}`}>{addon.status?.charAt(0).toUpperCase() + addon.status?.slice(1)}</span></p>
                        </div>
                        <div className="flex space-x-2">
                          {addon.installed ? (
                            <button
                              onClick={() => handleAddonAction(addon, 'manage')}
                              className={`flex-1 py-2 ${buttonSecondaryClass}`}
                            >
                              Manage
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddonAction(addon, 'install')}
                              className={`flex-1 py-2 ${buttonPrimaryClass}`}
                            >
                              Install
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeSection === 'settings' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Settings</h1>
                    <p className="text-slate-400">Manage your profile, subscription, and application preferences.</p>
                  </div>

                  {/* Subscription Card */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4 flex items-center space-x-2`}>
                      <DollarSign className="h-6 w-6 text-green-400" />
                      <span>Subscription Plan</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-slate-400 text-sm">Current Plan:</p>
                        <p className={`text-2xl font-bold ${textClass}`}>{user?.plan?.toUpperCase() || 'FREE'}</p>
                        {user?.plan === 'free_trial' && (
                          <p className="text-sm text-yellow-400 mt-1">Your free trial ends in {daysLeft} days.</p>
                        )}
                      </div>

                      <h3 className={`text-lg font-semibold ${textClass} mt-6 mb-3`}>Upgrade Your Plan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${cardClass} border rounded-lg p-4 flex flex-col`}>
                          <h4 className="font-semibold text-white mb-2">Pro Plan</h4>
                          <p className="text-slate-400 text-sm mb-4 flex-grow">Advanced scanning features, increased scan quota, priority support.</p>
                          <p className={`text-2xl font-bold ${textClass} mb-3`}>$49<span className="text-sm text-slate-400">/month</span></p>
                          <button
                            onClick={() => handleUpgradePlan('pro')}
                            disabled={user?.plan === 'pro' || user?.plan === 'pro_plus'}
                            className={`w-full py-2 ${buttonPrimaryClass} ${user?.plan === 'pro' || user?.plan === 'pro_plus' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {user?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                          </button>
                        </div>
                        <div className={`${cardClass} border rounded-lg p-4 flex flex-col`}>
                          <h4 className="font-semibold text-white mb-2">Pro+ Plan</h4>
                          <p className="text-slate-400 text-sm mb-4 flex-grow">All Pro features, AI-powered insights, unlimited scans, dedicated account manager.</p>
                          <p className={`text-2xl font-bold ${textClass} mb-3`}>$99<span className="text-sm text-slate-400">/month</span></p>
                          <button
                            onClick={() => handleUpgradePlan('pro_plus')}
                            disabled={user?.plan === 'pro_plus'}
                            className={`w-full py-2 ${buttonPrimaryClass} ${user?.plan === 'pro_plus' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {user?.plan === 'pro_plus' ? 'Current Plan' : 'Upgrade to Pro+'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Settings Card */}
                  <div className={`${cardClass} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-semibold ${textClass} mb-4 flex items-center space-x-2`}>
                      <UserCheck className="h-6 w-6 text-blue-400" />
                      <span>Profile Information</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="profileName" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                        <input
                          type="text"
                          id="profileName"
                          className={inputClass}
                          value={user?.name || ''}
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          disabled={!user}
                        />
                      </div>
                      <div>
                        <label htmlFor="profileEmail" className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          id="profileEmail"
                          className={inputClass}
                          value={user?.email || ''}
                          disabled // Email usually cannot be changed directly from profile settings
                        />
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed directly from here.</p>
                      </div>
                      <button
                        onClick={() => notify.info('Save Profile', 'Profile updates are saved automatically.')}
                        className={`px-4 py-2 ${buttonPrimaryClass}`}
                        disabled={!user}
                      >
                        Save Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* AI Insight Popup Modal */}
      {aiInsightPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className={`${cardClass} border rounded-xl p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto relative ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}`}>
            <button
              onClick={() => setAiInsightPopupOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className={`text-2xl font-bold ${textClass} mb-4`}>AI Insights</h2>
            <pre className="whitespace-pre-wrap break-words p-4 bg-slate-700/30 rounded-lg text-slate-200 text-sm">
              {aiInsightContent}
            </pre>
            <div className="mt-6 text-right">
              <button onClick={() => setAiInsightPopupOpen(false)} className={`px-4 py-2 ${buttonSecondaryClass}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Editor Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className={`${cardClass} border rounded-xl p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto relative ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}`}>
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className={`text-2xl font-bold ${textClass} mb-4`}>Report Editor</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="reportId" className="block text-sm font-medium text-slate-400 mb-1">Report ID</label>
                <input type="text" id="reportId" className={inputClass} value={reportMetadata.reportId} readOnly />
              </div>
              <div>
                <label htmlFor="reportTarget" className="block text-sm font-medium text-slate-400 mb-1">Target</label>
                <input type="text" id="reportTarget" className={inputClass} value={reportMetadata.target} readOnly />
              </div>
              <div>
                <label htmlFor="reportContent" className="block text-sm font-medium text-slate-400 mb-1">Content</label>
                <textarea
                  id="reportContent"
                  className={`${inputClass} h-64`}
                  placeholder="Start writing your security report here..."
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={handleDownloadPdf} className={`px-4 py-2 ${buttonSecondaryClass} flex items-center space-x-2`}>
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
              <button onClick={handleSaveReport} className={`px-4 py-2 ${buttonPrimaryClass} flex items-center space-x-2`}>
                <Save className="h-5 w-5" />
                <span>Save Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addon Details Modal */}
      {addonModalOpen && selectedAddon && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className={`${cardClass} border rounded-xl p-6 w-11/12 max-w-md relative ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}`}>
            <button
              onClick={() => setAddonModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className={`text-2xl font-bold ${textClass} mb-4`}>{selectedAddon.name}</h2>
            <p className="text-slate-400 mb-4">{selectedAddon.description}</p>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <p><strong>Size:</strong> {selectedAddon.size}</p>
              {selectedAddon.version && <p><strong>Version:</strong> {selectedAddon.version}</p>}
              {selectedAddon.lastUpdated && <p><strong>Last Updated:</strong> {selectedAddon.lastUpdated}</p>}
              <p><strong>Status:</strong> <span className={`font-semibold ${selectedAddon.status === 'installed' ? 'text-green-400' : selectedAddon.status === 'installing' ? 'text-yellow-400' : 'text-blue-400'}`}>{selectedAddon.status?.charAt(0).toUpperCase() + selectedAddon.status?.slice(1)}</span></p>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setAddonModalOpen(false)} className={`px-4 py-2 ${buttonSecondaryClass}`}>
                Close
              </button>
              {addonActionType === 'install' && (
                <button onClick={() => handleInstallAddon(selectedAddon.id)} className={`px-4 py-2 ${buttonPrimaryClass}`}>
                  Install Now
                </button>
              )}
              {addonActionType === 'manage' && (
                <button onClick={() => notify.info('Manage Addon', `Managing ${selectedAddon.name}`)} className={`px-4 py-2 ${buttonPrimaryClass}`}>
                  Manage Addon
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scan Details Modal */}
      {selectedScanForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className={`${cardClass} border rounded-xl p-6 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto relative ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}`}>
            <button
              onClick={() => setSelectedScanForDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className={`text-2xl font-bold ${textClass} mb-4`}>Scan Details: {selectedScanForDetails.target}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400 mb-6">
              <p><strong>Scan ID:</strong> {selectedScanForDetails.id}</p>
              <p><strong>Target:</strong> {selectedScanForDetails.target}</p>
              <p><strong>Type:</strong> {selectedScanForDetails.type}</p>
              <p><strong>Status:</strong> <span className={`font-medium ${
                selectedScanForDetails.status === 'completed' ? 'text-green-400' :
                selectedScanForDetails.status === 'pending' ? 'text-yellow-400' :
                'text-red-400'
              }`}>{selectedScanForDetails.status.charAt(0).toUpperCase() + selectedScanForDetails.status.slice(1)}</span></p>
              <p><strong>Started:</strong> {new Date(selectedScanForDetails.timestamp).toLocaleString()}</p>
              <p><strong>Duration:</strong> {selectedScanForDetails.duration} seconds</p>
              <p><strong>Tools Used:</strong> {selectedScanForDetails.toolsUsed?.join(', ') || 'N/A'}</p>
            </div>

            {selectedScanForDetails.findings.length > 0 && (
              <>
                <h3 className={`text-lg font-semibold ${textClass} mb-3`}>Findings ({selectedScanForDetails.findings.length})</h3>
                <div className="space-y-3 mb-6">
                  {selectedScanForDetails.findings.map((finding: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                      <p className="font-medium text-white">{finding.type || finding.port}</p>
                      <p className="text-sm text-slate-400">{finding.description}</p>
                      <p className={`text-xs font-semibold mt-1 ${
                        finding.severity === 'critical' ? 'text-red-400' :
                        finding.severity === 'high' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>Severity: {finding.severity || finding.risk}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedScanForDetails.errors && selectedScanForDetails.errors.length > 0 && (
              <>
                <h3 className={`text-lg font-semibold ${textClass} mb-3 text-red-400`}>Errors</h3>
                <ul className="list-disc list-inside text-red-300 text-sm mb-6">
                  {selectedScanForDetails.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedScanForDetails.logs && (
              <>
                <h3 className={`text-lg font-semibold ${textClass} mb-3`}>Logs</h3>
                <pre className="whitespace-pre-wrap break-words p-4 bg-slate-700/30 rounded-lg text-slate-200 text-sm">
                  {selectedScanForDetails.logs}
                </pre>
              </>
            )}

            <div className="mt-6 text-right">
              <button onClick={() => setSelectedScanForDetails(null)} className={`px-4 py-2 ${buttonSecondaryClass}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tool Options Modal (for Nmap, Nikto, Gobuster, SQLMap) */}
      {toolOptionsModalOpen && selectedToolForOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className={`${cardClass} border rounded-xl p-6 w-11/12 max-w-xl relative ${darkMode ? 'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'}`}>
            <button
              onClick={() => setToolOptionsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className={`text-2xl font-bold ${textClass} mb-4`}>{selectedToolForOptions.name} Options</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1">Target</label>
              <input type="text" className={inputClass} value={scanTarget} readOnly disabled />
              <p className="text-xs text-slate-500 mt-1">Target is determined by your current project or quick scan input.</p>
            </div>

            <h3 className={`text-lg font-semibold ${textClass} mb-3`}>Tool Specific Options</h3>

            {selectedToolForOptions.id === 'nmap' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="nmapOsDetection" className="text-slate-400">OS Detection (-O)</label>
                  <input
                    type="checkbox"
                    id="nmapOsDetection"
                    checked={nmapOptions.osDetection}
                    onChange={(e) => setNmapOptions({ ...nmapOptions, osDetection: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="nmapNoPing" className="text-slate-400">No Ping (-Pn)</label>
                  <input
                    type="checkbox"
                    id="nmapNoPing"
                    checked={nmapOptions.noPing}
                    onChange={(e) => setNmapOptions({ ...nmapOptions, noPing: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="nmapAggressive" className="text-slate-400">Aggressive Scan (-A)</label>
                  <input
                    type="checkbox"
                    id="nmapAggressive"
                    checked={nmapOptions.aggressive}
                    onChange={(e) => setNmapOptions({ ...nmapOptions, aggressive: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {selectedToolForOptions.id === 'nikto' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="niktoFullScan" className="text-slate-400">Full Scan (-C all)</label>
                  <input
                    type="checkbox"
                    id="niktoFullScan"
                    checked={niktoOptions.fullScan}
                    onChange={(e) => setNiktoOptions({ ...niktoOptions, fullScan: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="niktoSslSupport" className="text-slate-400">SSL Support (-ssl)</label>
                  <input
                    type="checkbox"
                    id="niktoSslSupport"
                    checked={niktoOptions.sslSupport}
                    onChange={(e) => setNiktoOptions({ ...niktoOptions, sslSupport: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {selectedToolForOptions.id === 'gobuster' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="gobusterWordlist" className="block text-sm font-medium text-slate-400 mb-1">Wordlist</label>
                  <select
                    id="gobusterWordlist"
                    className={inputClass}
                    value={gobusterOptions.wordlist}
                    onChange={(e) => setGobusterOptions({ ...gobusterOptions, wordlist: e.target.value })}
                  >
                    <option value="common">Common</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="custom">Custom (requires addon)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gobusterExtensions" className="block text-sm font-medium text-slate-400 mb-1">Extensions (comma-separated)</label>
                  <input
                    type="text"
                    id="gobusterExtensions"
                    className={inputClass}
                    placeholder="e.g., php,html,txt"
                    value={gobusterOptions.extensions}
                    onChange={(e) => setGobusterOptions({ ...gobusterOptions, extensions: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="gobusterThreads" className="block text-sm font-medium text-slate-400 mb-1">Threads</label>
                  <input
                    type="number"
                    id="gobusterThreads"
                    className={inputClass}
                    value={gobusterOptions.threads}
                    onChange={(e) => setGobusterOptions({ ...gobusterOptions, threads: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            )}

            {selectedToolForOptions.id === 'sqlmap' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="sqlmapLevel" className="block text-sm font-medium text-slate-400 mb-1">Level (1-5)</label>
                  <input
                    type="number"
                    id="sqlmapLevel"
                    className={inputClass}
                    value={sqlmapOptions.level}
                    onChange={(e) => setSqlmapOptions({ ...sqlmapOptions, level: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="5"
                  />
                </div>
                <div>
                  <label htmlFor="sqlmapRisk" className="block text-sm font-medium text-slate-400 mb-1">Risk (1-3)</label>
                  <input
                    type="number"
                    id="sqlmapRisk"
                    className={inputClass}
                    value={sqlmapOptions.risk}
                    onChange={(e) => setSqlmapOptions({ ...sqlmapOptions, risk: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="3"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sqlmapTamper" className="text-slate-400">Use Tamper Scripts</label>
                  <input
                    type="checkbox"
                    id="sqlmapTamper"
                    checked={sqlmapOptions.tamper}
                    onChange={(e) => setSqlmapOptions({ ...sqlmapOptions, tamper: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setToolOptionsModalOpen(false)} className={`px-4 py-2 ${buttonSecondaryClass}`}>
                Cancel
              </button>
              <button onClick={handleScanWithToolOptions} className={`px-4 py-2 ${buttonPrimaryClass}`}>
                Start Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
