export interface ScanResult {
  target: string;
  type: 'port' | 'vulnerability' | 'comprehensive';
  timestamp: string;
  duration: number;
  status: 'completed' | 'running' | 'failed';
  findings: Finding[];
  id?: string;
  userId?: string;
}

export interface Finding {
  port?: string;
  service?: string;
  state?: string;
  risk?: 'low' | 'medium' | 'high' | 'critical';
  type?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  cve?: string;
  solution?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  lastLogin?: string;
  scanQuota?: number;
}

export interface ScanSettings {
  portRange: string;
  intensity: 'light' | 'normal' | 'aggressive';
  timeout: number;
  enableVersionDetection: boolean;
  enableOSDetection: boolean;
  maxConcurrentScans: number;
  notificationsEnabled: boolean;
  autoExport: boolean;
  exportFormat: 'json' | 'csv' | 'pdf';
}

export type ThemeMode = 'light' | 'dark';
export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
