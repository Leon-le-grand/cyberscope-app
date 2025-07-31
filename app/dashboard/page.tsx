"use client";
import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Globe,
  Cloud,
  Bell,
  Settings,
  User,
  BarChart3,
  Target,
  Bot,
  LogOut,
  FileText, // For reports
  CloudUpload, // For uploads tab content and icon
  Menu, // For sidebar toggle (expand) / Mobile menu
  X, // For sidebar toggle (collapse) / Mobile close
  Plus, // For the "New" button icon
  Search // For Info Gather
} from 'lucide-react';

// Import Nivo chart components
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';


const Dashboard = () => {
  // State for desktop sidebar: true = collapsed (icon-only), false = expanded (icon+text)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // State for mobile sidebar: true = open (slides in), false = closed (slides out)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // State for selected tab: controls which content is displayed
  const [selectedTab, setSelectedTab] = useState('Dashboard'); // Default active tab

  // Toggle function for desktop sidebar (triggered by TopNavbar on desktop)
  const toggleDesktopSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle function for mobile sidebar (triggered by TopNavbar on mobile)
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // --- Nivo Chart Data (now static for initial load animation) ---

  // Static data for the Vulnerabilities Line Chart
  const vulnerabilityChartData = [
    {
      id: 'New Vulnerabilities',
      data: [
        { x: 'Week 1', y: 50 },
        { x: 'Week 2', y: 55 },
        { x: 'Week 3', y: 48 },
        { x: 'Week 4', y: 60 },
        { x: 'Week 5', y: 53 },
        { x: 'Week 6', y: 65 },
        { x: 'Week 7', y: 58 },
        { x: 'Week 8', y: 70 },
      ],
    },
    {
      id: 'Remediated Vulnerabilities',
      data: [
        { x: 'Week 1', y: 30 },
        { x: 'Week 2', y: 35 },
        { x: 'Week 3', y: 32 },
        { x: 'Week 4', y: 40 },
        { x: 'Week 5', y: 37 },
        { x: 'Week 6', y: 45 },
        { x: 'Week 7', y: 42 },
        { x: 'Week 8', y: 50 },
      ],
    },
  ];

  // Static data for the Investigations Bar Chart
  const investigationBarChartData = [
    {
      "week": "W1",
      "Assign Time": 12,
      "Assign TimeColor": "hsl(140, 70%, 50%)",
      "Close Time": 25,
      "Close TimeColor": "hsl(210, 70%, 50%)",
    },
    {
      "week": "W2",
      "Assign Time": 15,
      "Assign TimeColor": "hsl(140, 70%, 50%)",
      "Close Time": 22,
      "Close TimeColor": "hsl(210, 70%, 50%)",
    },
    {
      "week": "W3",
      "Assign Time": 10,
      "Assign TimeColor": "hsl(140, 70%, 50%)",
      "Close Time": 18,
      "Close TimeColor": "hsl(210, 70%, 50%)",
    },
    {
      "week": "W4",
      "Assign Time": 18,
      "Assign TimeColor": "hsl(140, 70%, 50%)",
      "Close Time": 30,
      "Close TimeColor": "hsl(210, 70%, 50%)",
    },
    {
      "week": "W5",
      "Assign Time": 14,
      "Assign TimeColor": "hsl(140, 70%, 50%)",
      "Close Time": 20,
      "Close TimeColor": "hsl(210, 70%, 50%)",
    },
  ];

  // --- Helper Components (defined inside Dashboard for single-file constraint) ---

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-xl transform transition-transform hover:scale-105 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color} shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <button className="text-gray-400 hover:text-green-400 text-xs font-medium transition-colors">View Details</button>
      </div>
      <div className="space-y-1">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-white text-xl font-bold">{value}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded flex items-center ${
            changeType === 'positive' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
          }`}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        </div>
      </div>
    </div>
  );

  const RemediationItem = ({ title, riskScore }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center">
          <FileText className="w-3 h-3 text-gray-400" />
        </div>
        <span className="text-gray-300 text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white text-sm font-medium">Risk Score {riskScore}</span>
      </div>
    </div>
  );

  const InvestigationItem = ({ title, priority }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center">
          <User className="w-3 h-3 text-gray-400" />
        </div>
        <span className="text-gray-300 text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          priority === 'Critical' ? 'bg-red-500' : 'bg-orange-500'
        }`}></div>
        <span className="text-gray-300 text-sm">{priority}</span>
      </div>
    </div>
  );

  // --- Tab Content Components ---
  const DashboardContent = () => (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Your Security Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        <StatCard
          icon={Shield}
          title="Total Assets"
          value="21,268"
          change="10%"
          changeType="positive"
          color="bg-green-600"
        />
        <StatCard
          icon={Users}
          title="Users"
          value="22,221"
          change="12%"
          changeType="negative"
          color="bg-purple-600"
        />
        <StatCard
          icon={Globe}
          title="External Assets"
          value="1,921"
          change="20%"
          changeType="positive"
          color="bg-teal-600"
        />
        <StatCard
          icon={Cloud}
          title="Cloud Assets"
          value="347"
          change="15%"
          changeType="positive"
          color="bg-indigo-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        {/* Nivo Line Chart for Vulnerabilities (Now animates on initial load) */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">New And Remediated Vulnerabilities</h3>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-0.5 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors">D</button>
              <button className="px-2.5 py-0.5 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors">M</button>
              <button className="px-2.5 py-0.5 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors">Y</button>
              <button className="px-2.5 py-0.5 bg-green-600 rounded text-xs shadow-lg">All</button>
              <button className="px-2.5 py-0.5 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors">Custom</button>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">New Vulnerabilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-medium">Remediated Vulnerabilities</span>
              </div>
            </div>
          </div>

          {/* Nivo ResponsiveLine component */}
          <div style={{ height: '200px' }}> {/* Nivo charts need a defined height */}
            <ResponsiveLine
              data={vulnerabilityChartData} // Static data for now, animates on initial load
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              enableGridX={false}
              enableGridY={true}
              colors={['#22C55E', '#3B82F6']} // Explicit green and blue colors
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              motionConfig="gentle" // Animation setting for initial load
              theme={{
                axis: {
                  domain: { line: { stroke: '#4b5563' } },
                  ticks: { line: { stroke: '#4b5563' }, text: { fill: '#9ca3af' } },
                  legend: { text: { fill: '#e5e7eb' } },
                },
                grid: { line: { stroke: '#374151' } },
                labels: { text: { fill: '#e5e7eb' } },
                legends: { text: { fill: '#e5e7eb' } },
                tooltip: {
                  container: {
                    background: '#1f2937', // Darker background for tooltip
                    color: '#f9fafb',
                    fontSize: '12px',
                    borderRadius: '4px',
                    boxShadow: '0px 0px 8px rgba(0,0,0,0.5)',
                  },
                },
              }}
            />
          </div>

          <div className="text-center text-xs text-gray-400 mt-3">
            <div className="flex justify-center gap-3 mt-1.5">
              <span className="text-green-400">🔸 New Vulnerabilities</span>
              <span className="text-blue-400">🔹 Remediated Vulnerabilities</span>
            </div>
          </div>
        </div>

        {/* Nivo Bar Chart for Investigations */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-xl">
          <h3 className="text-base font-semibold mb-3">Time to Assign and Close Investigations</h3>
          <div className="text-xs text-gray-400 mb-3">15% In average time to close in last 90d</div>

          {/* Nivo ResponsiveBar component */}
          <div style={{ height: '200px' }}> {/* Nivo charts need a defined height */}
            <ResponsiveBar
              data={investigationBarChartData}
              keys={[ 'Assign Time', 'Close Time' ]}
              indexBy="week"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={["#22C55E", "#3B82F6"]} // Custom colors for assign/close time
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Week',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Days',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              enableGridY={true}
              motionConfig="wobbly" // Animation setting for initial load
              theme={{
                axis: {
                  domain: { line: { stroke: '#4b5563' } },
                  ticks: { line: { stroke: '#4b5563' }, text: { fill: '#9ca3af' } },
                  legend: { text: { fill: '#e5e7eb' } },
                },
                grid: { line: { stroke: '#374151' } },
                labels: { text: { fill: '#e5e7eb' } },
                legends: { text: { fill: '#e5e7eb' } },
                tooltip: {
                  container: {
                    background: '#1f2937',
                    color: '#f9fafb',
                    fontSize: '12px',
                    borderRadius: '4px',
                    boxShadow: '0px 0px 8px rgba(0,0,0,0.5)',
                  },
                },
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Average time to Assign</span>
              <span className="text-white ml-3 font-medium">20%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs"> {/* Added flex and gap for consistent spacing */}
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div> {/* Changed to blue for consistency */}
            <span className="text-gray-400">Average time to Close</span>
            <span className="text-white ml-3 font-medium">12%</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Remediations */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-xl">
          <h3 className="text-base font-semibold mb-3">Top Remediations</h3>
          <div className="space-y-1">
            <RemediationItem
              title="Update the GNU C Library (glibc) to..."
              riskScore="900"
            />
            <RemediationItem
              title="2023-05 Security only Quality..."
              riskScore="675"
            />
            <RemediationItem
              title="Update snaps package to the latest..."
              riskScore="820"
            />
            <RemediationItem
              title="Update snapd package to the..."
              riskScore="355"
            />
          </div>
        </div>

        {/* Top Investigations */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-xl">
          <h3 className="text-base font-semibold mb-3">Top Investigations By Priority</h3>
          <div className="space-y-1">
            <InvestigationItem
              title="Update the GNU C Library (glibc) to..."
              priority="Critical"
            />
            <InvestigationItem
              title="First Ingress Authentication From Country"
              priority="Medium"
            />
            <InvestigationItem
              title="Multiple Country Ingress"
              priority="Critical"
            />
            <InvestigationItem
              title="Suspicious PowerShell process execution"
              priority="Medium"
            />
          </div>
        </div>
      </div>
    </>
  );

  const AttackSurfaceContent = () => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Attack Surface Management</h2>
      <p className="text-gray-400">Manage and monitor your external and internal attack surface here. Discover assets, identify exposures, and prioritize risks.</p>
      {/* Add more specific content here later */}
    </div>
  );

  const ReportsContent = () => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>
      <p className="text-gray-400">Generate detailed security reports, compliance documentation, and track historical vulnerability trends.</p>
      {/* Add more specific content here later */}
    </div>
  );

  const InfoGatherContent = () => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Information Gathering</h2>
      <p className="text-gray-400">Tools and insights for collecting intelligence on your assets and potential threats. Reconnaissance data will be displayed here.</p>
      {/* Add more specific content here later */}
    </div>
  );

  const UploadsContent = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      event.target.value = null; // Clear input to allow re-uploading same file
    };

    const handleDrop = (event) => {
      event.preventDefault();
      setIsDragOver(false);
      const files = Array.from(event.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleScanVulnerabilities = () => {
      if (selectedFiles.length === 0) {
        alert("Please select files to scan first!");
        return;
      }
      alert(`Simulating scan for ${selectedFiles.length} file(s): ${selectedFiles.map(f => f.name).join(', ')}.\n\nThis is a UI simulation. In a real application, files would be sent to a backend for analysis.`);
      setSelectedFiles([]); // Clear files after simulating scan
    };

    const removeFile = (fileToRemove) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Uploads for Code Vulnerability Scanning</h2>
        <p className="text-gray-400 mb-6">
          Upload your source code or configuration files (e.g., .zip, .tar.gz, .js, .py, .java, .json, .xml, .yml, .php, .go, .rb, .cs) to scan for vulnerabilities.
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200
            ${isDragOver ? 'border-green-500 bg-gray-700' : 'border-gray-600 bg-gray-700/50'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">Drag and drop your files here, or</p>
          <label htmlFor="file-upload" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-block">
            Browse Files
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".zip,.tar.gz,.js,.py,.java,.json,.xml,.yml,.yaml,.php,.go,.rb,.cs"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold mb-3">Selected Files:</h3>
            <ul className="list-disc list-inside text-gray-300 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-sm py-1 break-all flex justify-between items-center">
                    <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                    <button
                        onClick={() => removeFile(file)}
                        className="text-red-400 hover:text-red-500 text-xs ml-2"
                        title="Remove file"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleScanVulnerabilities}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Scan for Vulnerabilities
            </button>
          </div>
        )}
      </div>
    );
  };

  const AutomationContent = () => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Security Automation</h2>
      <p className="text-gray-400">Configure automated security workflows, incident response playbooks, and continuous monitoring tasks.</p>
      {/* Add more specific content here later */}
    </div>
  );

  const SettingsContent = () => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      <p className="text-gray-400">Configure user roles, integrations, notifications, and other platform settings.</p>
      {/* Add more specific content here later */}
    </div>
  );


  // --- Main Dashboard Render ---
  return (
    // Outer container: Set overall background to match sidebar for smooth transitions
    <div className="min-h-screen bg-gray-800 text-white flex">
      {/* Top Navbar */}
      <div className={`fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 z-20 transition-all duration-300`}>
        {/* Left section: Mobile Menu Toggle & CyberScope Branding */}
        <div className="flex items-center gap-4"> {/* Added gap-4 here to space toggle button and logo group */}
          {/* Mobile Menu Toggle - visible only on LG screens and smaller */}
          <button
            onClick={toggleMobileSidebar}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 lg:hidden"
            title={isMobileSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* CyberScope Pro Branding */}
          <div className="flex items-center gap-2"> {/* This group now relies on parent's gap-4 for spacing */}
            <Shield className="w-8 h-8 text-green-500" />
            <span className="font-bold text-lg text-white">
              CyberScope <span className="text-green-500">Pro</span> {/* "Pro" in green */}
            </span>
          </div>
        </div>

        {/* Center section: New Button & Domain Name Card */}
        <div className="flex items-center gap-3">
          {/* New Button - Redesigned with Plus icon */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
          {/* Domain Name Card */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-full text-gray-300 text-sm cursor-default border border-gray-600">
            <Globe className="w-4 h-4 text-green-400" />
            <span>cyberscope.com</span>
          </div>
        </div>

        {/* Right section: Profile, Notification, Logout, Desktop Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {/* Notification (badge removed) */}
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="hidden sm:inline">Notification</span>
          </button>
          {/* Profile */}
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Profile</span>
          </button>
          {/* Logout */}
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

          {/* Desktop Sidebar Toggle - visible only on LG screens and larger */}
          <button
            onClick={toggleDesktopSidebar}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 hidden lg:block"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
                <Menu className="w-5 h-5" />
            ) : (
                <X className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay - visible when mobile sidebar is open, click to close */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileSidebar} // Close mobile sidebar when clicking overlay
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col
          ${isMobileSidebarOpen ? 'translate-x-0 w-64 z-30' : '-translate-x-full w-64 z-30'} /* Mobile slide-in/out */
          lg:translate-x-0 lg:left-0 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-56'} lg:z-10 /* Desktop: always visible, lower z-index than TopNavbar */
        `}
      >
        {/* Spacer for Top Navbar - Pushes sidebar content down */}
        <div className="h-16"></div>

        {/* Main navigation area */}
        <nav className="p-4 space-y-1.5 flex-grow"> {/* Removed overflow-y-auto as per instruction */}
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-3 px-2">
              {!isSidebarCollapsed && "MENU"}
            </div>

            {/* Dashboard Tab */}
            <button
              onClick={() => setSelectedTab('Dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Dashboard' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <BarChart3 className="w-4 h-4" />
              {!isSidebarCollapsed && "Dashboard"}
            </button>

            {/* Attack Surface Tab */}
            <button
              onClick={() => setSelectedTab('Attack Surface')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Attack Surface' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <Target className="w-4 h-4" />
              {!isSidebarCollapsed && "Attack Surface"}
            </button>

            {/* Info Gather Tab */}
            <button
              onClick={() => setSelectedTab('Info Gather')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Info Gather' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <Search className="w-4 h-4" />
              {!isSidebarCollapsed && "Info Gather"}
            </button>

            {/* Reports Tab */}
            <button
              onClick={() => setSelectedTab('Reports')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Reports' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <FileText className="w-4 h-4" />
              {!isSidebarCollapsed && "Reports"}
            </button>

            {/* Uploads Tab */}
            <button
              onClick={() => setSelectedTab('Uploads')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Uploads' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <CloudUpload className="w-4 h-4" />
              {!isSidebarCollapsed && "Uploads"}
            </button>

            {/* Automation Tab */}
            <button
              onClick={() => setSelectedTab('Automation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Automation' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <Bot className="w-4 h-4" />
              {!isSidebarCollapsed && "Automation"}
            </button>

            {/* Settings Tab */}
            <button
              onClick={() => setSelectedTab('Settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded w-full text-left transition-colors duration-200
                ${selectedTab === 'Settings' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <Settings className="w-4 h-4" />
              {!isSidebarCollapsed && "Settings"}
            </button>
        </nav>

        {/* Plan Card at the absolute bottom of the sidebar */}
        {!isSidebarCollapsed && (
          <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg text-center border border-gray-600 shadow-2xl transition-all duration-300 transform hover:scale-[1.02] mx-3 mb-3">
            <h4 className="text-base font-bold text-white mb-0.5">Pro Plan</h4>
            <p className="text-gray-300 text-xs mb-1">30 Days Left</p>
            <p className="text-green-400 font-semibold text-lg mb-2">$299<span className="text-xs text-gray-400">/month</span></p>
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs font-semibold py-1.5 rounded-full transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 shadow-md">
              Upgrade Plan
            </button>
          </div>
        )}
      </div>

      {/* Mobile Overlay - visible when mobile sidebar is open, click to close */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileSidebar} // Close mobile sidebar when clicking overlay
        ></div>
      )}

      {/* Main Content Area */}
      {/* Set bg-gray-900 here, as the outer div is now bg-gray-800, to maintain visual distinction */}
      <div className={`flex-1 p-5 transition-all duration-300 pt-20 bg-gray-900
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-56'} /* Margin for desktop sidebar */
        ml-0 /* Default to no margin on small screens, sidebar slides over */
      `}>
        {/* Conditional Content Rendering */}
        {(() => {
          switch (selectedTab) {
            case 'Dashboard':
              return <DashboardContent />;
            case 'Attack Surface':
              return <AttackSurfaceContent />;
            case 'Reports':
              return <ReportsContent />;
            case 'Info Gather':
              return <InfoGatherContent />;
            case 'Uploads':
              return <UploadsContent />;
            case 'Automation':
              return <AutomationContent />;
            case 'Settings':
              return <SettingsContent />;
            default:
              return <DashboardContent />; // Fallback
          }
        })()}
      </div>
    </div>
  );
};

export default Dashboard;
