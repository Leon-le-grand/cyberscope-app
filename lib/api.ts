import { ScanResult, Finding, DashboardStats, SavedTarget, ScheduledScan } from './types';

export class ScanAPI {
  private static baseUrl = '/api';

  // Port scanning
  static async performPortScan(target: string, options?: {
    portRange?: string;
    intensity?: string;
    timeout?: number;
  }): Promise<ScanResult> {
    const queryParams = new URLSearchParams({
      target,
      type: 'port',
      ...options
    });

    const response = await fetch(`${this.baseUrl}/scan?${queryParams}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Scan failed');
    }

    const data = await response.json();
    return this.transformPortScanResult(data);
  }

  // Vulnerability scanning
  static async performVulnerabilityScan(target: string): Promise<ScanResult> {
    const response = await fetch(`${this.baseUrl}/vuln?target=${encodeURIComponent(target)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Vulnerability scan failed');
    }

    const data = await response.json();
    return this.transformVulnScanResult(data);
  }

  // CMS Detection
  static async detectCMS(domain: string): Promise<{
    cms: string | null;
    confidence: number;
    evidence: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/detect?domain=${encodeURIComponent(domain)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'CMS detection failed');
    }

    return response.json();
  }

  // Get scan history
  static async getScanHistory(userId?: string): Promise<ScanResult[]> {
    // Mock implementation - replace with actual API call
    const storedHistory = localStorage.getItem('scanHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  }

  // Save scan result
  static async saveScanResult(scanResult: ScanResult): Promise<void> {
    // Mock implementation - replace with actual API call
    const existingHistory = await this.getScanHistory();
    const newHistory = [scanResult, ...existingHistory.slice(0, 49)]; // Keep last 50
    localStorage.setItem('scanHistory', JSON.stringify(newHistory));
  }

  // Get dashboard statistics
  static async getDashboardStats(userId?: string): Promise<DashboardStats> {
    // Mock implementation - replace with actual API call
    const scanHistory = await this.getScanHistory();
    
    return {
      totalScans: scanHistory.length,
      criticalIssues: scanHistory.reduce((acc, scan) => 
        acc + scan.findings.filter(f => f.severity === 'critical' || f.risk === 'high').length, 0
      ),
      resolvedIssues: Math.floor(Math.random() * 100),
      activeTargets: parseInt(localStorage.getItem('savedTargets') || '0'),
      scansThisMonth: scanHistory.filter(scan => 
        new Date(scan.timestamp).getMonth() === new Date().getMonth()
      ).length,
      avgScanTime: scanHistory.reduce((acc, scan) => acc + scan.duration, 0) / scanHistory.length || 0,
      topVulnerabilities: [
        { type: 'XSS', count: 15, severity: 'high' },
        { type: 'SQL Injection', count: 8, severity: 'critical' },
        { type: 'CSRF', count: 12, severity: 'medium' }
      ]
    };
  }

  // Saved targets management
  static async getSavedTargets(): Promise<SavedTarget[]> {
    const stored = localStorage.getItem('savedTargets');
    return stored ? JSON.parse(stored) : [];
  }

  static async saveSavedTargets(targets: SavedTarget[]): Promise<void> {
    localStorage.setItem('savedTargets', JSON.stringify(targets));
  }

  // Export functionality
  static async exportScanResults(scanResult: ScanResult, format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(scanResult, null, 2)], { type: 'application/json' });
      
      case 'csv':
        const csvContent = this.convertToCSV(scanResult);
        return new Blob([csvContent], { type: 'text/csv' });
      
      case 'pdf':
        // For PDF generation, you'd typically use a library like jsPDF or send to backend
        const pdfContent = await this.generatePDFReport(scanResult);
        return new Blob([pdfContent], { type: 'application/pdf' });
      
      default:
        throw new Error('Unsupported export format');
    }
  }

  // Transform API responses to standard format
  private static transformPortScanResult(data: any): ScanResult {
    return {
      id: Math.random().toString(36).substr(2, 9),
      target: data.target,
      type: 'port',
      timestamp: new Date().toISOString(),
      duration: Math.floor(Math.random() * 30) + 10,
      status: 'completed',
      findings: data.openPorts?.map((port: any) => ({
        port: port.port,
        service: port.service,
        state: port.state,
        risk: this.assessPortRisk(port.port, port.service)
      })) || []
    };
  }

  private static transformVulnScanResult(data: any): ScanResult {
    return {
      id: Math.random().toString(36).substr(2, 9),
      target: data.target,
      type: 'vulnerability',
      timestamp: new Date().toISOString(),
      duration: Math.floor(Math.random() * 60) + 30,
      status: 'completed',
      findings: data.vulnerabilities?.map((vuln: any) => ({
        type: vuln.type || 'Unknown',
        description: vuln.description,
        severity: this.assessVulnSeverity(vuln.description),
        solution: this.getSolution(vuln.description)
      })) || []
    };
  }

  private static assessPortRisk(port: string, service: string): 'low' | 'medium' | 'high' {
    const highRiskPorts = ['21', '23', '135', '139', '445', '1433', '3306', '3389', '5432'];
    const mediumRiskPorts = ['22', '25', '53', '110', '143', '993', '995'];
    
    if (highRiskPorts.includes(port)) return 'high';
    if (mediumRiskPorts.includes(port)) return 'medium';
    return 'low';
  }

  private static assessVulnSeverity(description: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('critical') || lowerDesc.includes('rce') || lowerDesc.includes('sql injection')) {
      return 'critical';
    }
    if (lowerDesc.includes('high') || lowerDesc.includes('xss') || lowerDesc.includes('csrf')) {
      return 'high';
    }
    if (lowerDesc.includes('medium') || lowerDesc.includes('disclosure')) {
      return 'medium';
    }
    return 'low';
  }

  private static getSolution(description: string): string {
    // Basic solution mapping - would be more sophisticated in real implementation
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('sql injection')) {
      return 'Use parameterized queries and input validation';
    }
    if (lowerDesc.includes('xss')) {
      return 'Implement proper input sanitization and output encoding';
    }
    if (lowerDesc.includes('outdated')) {
      return 'Update to the latest software version';
    }
    return 'Review security configuration and apply appropriate patches';
  }

  private static convertToCSV(scanResult: ScanResult): string {
    const headers = scanResult.type === 'port' 
      ? ['Port', 'Service', 'State', 'Risk']
      : ['Type', 'Description', 'Severity', 'Solution'];
    
    const rows = scanResult.findings.map(finding => 
      scanResult.type === 'port'
        ? [finding.port, finding.service, finding.state, finding.risk]
        : [finding.type, finding.description, finding.severity, finding.solution]
    );

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private static async generatePDFReport(scanResult: ScanResult): Promise<string> {
    // Mock PDF generation - in real implementation, use jsPDF or similar
    return `PDF Report for ${scanResult.target}\nGenerated: ${new Date().toISOString()}\nFindings: ${scanResult.findings.length}`;
  }
}

// Utility functions for real-time features
export class RealtimeAPI {
  private static eventSource: EventSource | null = null;

  static startRealtimeUpdates(onUpdate: (data: any) => void) {
    if (typeof window !== 'undefined' && window.EventSource) {
      this.eventSource = new EventSource('/api/realtime');
      this.eventSource.onmessage = (event) => {
        onUpdate(JSON.parse(event.data));
      };
    }
  }

  static stopRealtimeUpdates() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Geolocation API for IP mapping
export class GeolocationAPI {
  static async getIPLocation(ip: string): Promise<{
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    isp: string;
  }> {
    // Mock implementation - replace with actual geolocation service
    return {
      country: 'United States',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      isp: 'Example ISP'
    };
  }
}
