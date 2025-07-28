// app/api/comprehensive-scan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';

const execPromise = promisify(exec);

interface ScanOptions {
  target: string;
  scanType: 'port' | 'vulnerability' | 'comprehensive';
  portRange?: string;
  intensity?: 'light' | 'normal' | 'aggressive';
  timeout?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { target, scanType, portRange = '1-1000', intensity = 'normal', timeout = 30 }: ScanOptions = await req.json();

    if (!target) {
      return NextResponse.json({ error: 'Target is required' }, { status: 400 });
    }

    // Validate target
    const isValidIP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(target);
    const isValidDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(target);

    if (!isValidIP && !isValidDomain) {
      return NextResponse.json({ error: 'Invalid target format' }, { status: 400 });
    }

    const results: any = {
      target,
      scanType,
      timestamp: new Date().toISOString(),
      status: 'completed',
      findings: []
    };

    try {
      switch (scanType) {
        case 'port':
          results.findings = await performPortScan(target, portRange, intensity, timeout);
          break;
        case 'vulnerability':
          results.findings = await performVulnerabilityScan(target, timeout);
          break;
        case 'comprehensive':
          const [portFindings, vulnFindings, cmsInfo] = await Promise.all([
            performPortScan(target, portRange, intensity, timeout),
            performVulnerabilityScan(target, timeout),
            performCMSDetection(target)
          ]);
          results.findings = [...portFindings, ...vulnFindings];
          results.cmsInfo = cmsInfo;
          break;
        default:
          return NextResponse.json({ error: 'Invalid scan type' }, { status: 400 });
      }

      results.duration = Math.floor(Math.random() * 60) + 10; // Mock duration
      return NextResponse.json(results);

    } catch (scanError: any) {
      console.error('Scan error:', scanError);
      return NextResponse.json({ 
        error: `Scan failed: ${scanError.message}`,
        target,
        scanType,
        timestamp: new Date().toISOString(),
        status: 'failed'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function performPortScan(target: string, portRange: string, intensity: string, timeout: number) {
  try {
    const intensityFlags = {
      light: '-T2',
      normal: '-T4',
      aggressive: '-T5'
    };

    const nmapCommand = `nmap ${intensityFlags[intensity as keyof typeof intensityFlags]} -p ${portRange} --open -sV ${target}`;
    console.log(`Executing: ${nmapCommand}`);
    
    const { stdout } = await execPromise(nmapCommand, { timeout: timeout * 1000 });
    
    const findings = [];
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\d+)\/(tcp|udp)\s+(\w+)\s+(.*)$/);
      if (match) {
        const [, port, protocol, state, service] = match;
        findings.push({
          type: 'port',
          port,
          protocol,
          state,
          service: service.trim(),
          risk: assessPortRisk(port, service),
          description: `Port ${port}/${protocol} is ${state} - ${service}`
        });
      }
    }
    
    return findings;
  } catch (error: any) {
    console.error('Port scan failed:', error);
    return [{
      type: 'error',
      description: `Port scan failed: ${error.message}`,
      severity: 'medium'
    }];
  }
}

async function performVulnerabilityScan(target: string, timeout: number) {
  try {
    // Using nikto for web vulnerability scanning
    const niktoCommand = `nikto -h ${target} -maxtime ${timeout} -output - -Format json`;
    console.log(`Executing: ${niktoCommand}`);
    
    const { stdout } = await execPromise(niktoCommand, { timeout: timeout * 1000 });
    
    const findings = [];
    
    try {
      const niktoOutput = JSON.parse(stdout);
      if (niktoOutput.vulnerabilities) {
        niktoOutput.vulnerabilities.forEach((vuln: any) => {
          findings.push({
            type: 'vulnerability',
            description: vuln.msg || vuln.description,
            severity: assessVulnerabilitySeverity(vuln.msg || vuln.description),
            url: vuln.url,
            method: vuln.method,
            solution: generateSolution(vuln.msg || vuln.description)
          });
        });
      }
    } catch (parseError) {
      // Fallback to text parsing
      const lines = stdout.split('\n');
      lines.forEach(line => {
        if (line.includes('OSVDB') || line.includes('vulnerability') || line.includes('misconfiguration')) {
          findings.push({
            type: 'vulnerability',
            description: line.trim(),
            severity: assessVulnerabilitySeverity(line),
            solution: generateSolution(line)
          });
        }
      });
    }
    
    return findings;
  } catch (error: any) {
    console.error('Vulnerability scan failed:', error);
    return [{
      type: 'error',
      description: `Vulnerability scan failed: ${error.message}`,
      severity: 'medium'
    }];
  }
}

async function performCMSDetection(target: string) {
  try {
    const url = target.startsWith('http') ? target : `https://${target}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CyberScope/1.0)' },
      maxRedirects: 5,
      timeout: 10000,
    });
    
    const html = response.data.toLowerCase();
    const headers = response.headers;
    
    const cmsDetected = [];
    
    // WordPress detection
    if (html.includes('wp-content') || html.includes('wordpress') || headers['x-powered-by']?.includes('WordPress')) {
      cmsDetected.push({
        name: 'WordPress',
        confidence: 90,
        evidence: ['wp-content directory found', 'WordPress signatures detected']
      });
    }
    
    // Drupal detection
    if (html.includes('drupal') || headers['x-drupal-cache'] || html.includes('/sites/default/files')) {
      cmsDetected.push({
        name: 'Drupal',
        confidence: 85,
        evidence: ['Drupal-specific patterns found']
      });
    }
    
    // Joomla detection
    if (html.includes('joomla') || html.includes('/media/jui/') || html.includes('option=com_')) {
      cmsDetected.push({
        name: 'Joomla',
        confidence: 85,
        evidence: ['Joomla-specific patterns found']
      });
    }
    
    return {
      detected: cmsDetected,
      serverInfo: {
        server: headers['server'],
        poweredBy: headers['x-powered-by'],
        contentType: headers['content-type']
      }
    };
  } catch (error: any) {
    console.error('CMS detection failed:', error);
    return {
      detected: [],
      error: `CMS detection failed: ${error.message}`
    };
  }
}

function assessPortRisk(port: string, service: string): 'low' | 'medium' | 'high' | 'critical' {
  const criticalPorts = ['23', '135', '445', '1433', '3389'];
  const highRiskPorts = ['21', '139', '3306', '5432'];
  const mediumRiskPorts = ['22', '25', '53', '110', '143', '993', '995'];
  
  if (criticalPorts.includes(port)) return 'critical';
  if (highRiskPorts.includes(port)) return 'high';
  if (mediumRiskPorts.includes(port)) return 'medium';
  return 'low';
}

function assessVulnerabilitySeverity(description: string): 'low' | 'medium' | 'high' | 'critical' {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('critical') || lowerDesc.includes('rce') || lowerDesc.includes('remote code execution')) {
    return 'critical';
  }
  if (lowerDesc.includes('high') || lowerDesc.includes('sql injection') || lowerDesc.includes('authentication bypass')) {
    return 'high';
  }
  if (lowerDesc.includes('medium') || lowerDesc.includes('xss') || lowerDesc.includes('csrf')) {
    return 'medium';
  }
  return 'low';
}

function generateSolution(description: string): string {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('sql injection')) {
    return 'Implement parameterized queries and input validation to prevent SQL injection attacks.';
  }
  if (lowerDesc.includes('xss') || lowerDesc.includes('cross-site scripting')) {
    return 'Apply proper input sanitization and output encoding to prevent XSS attacks.';
  }
  if (lowerDesc.includes('csrf') || lowerDesc.includes('cross-site request forgery')) {
    return 'Implement CSRF tokens and validate referrer headers.';
  }
  if (lowerDesc.includes('outdated') || lowerDesc.includes('old version')) {
    return 'Update to the latest version and apply security patches.';
  }
  if (lowerDesc.includes('ssl') || lowerDesc.includes('certificate')) {
    return 'Update SSL certificate and ensure proper SSL/TLS configuration.';
  }
  if (lowerDesc.includes('directory listing') || lowerDesc.includes('directory browsing')) {
    return 'Disable directory listing and properly configure web server permissions.';
  }
  
  return 'Review the security configuration and apply appropriate security measures.';
}
