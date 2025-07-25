// app/test2/page.tsx
'use client';

import { useState } from 'react';

interface CMSResult {
  name: string;
  version?: string;
  confidence?: number;
}

interface PortResult {
  port: string;
  protocol?: string;
  state: string;
  service?: string;
}

interface AnalysisResults {
  cms: CMSResult[];
  ports: PortResult[];
  headers: Record<string, string>;
}

export default function DomainAnalyzer() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState('');

  const analyzeDomain = async () => {
    if (!domain) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeDomain();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Domain Security Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Discover CMS platforms and scan for open ports on any domain
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Domain Name
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter domain without http:// or https://
              </p>
            </div>
            <button
              onClick={analyzeDomain}
              disabled={loading || !domain}
              className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                '🚀 Analyze Domain'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Error:</span>
              <span className="text-red-700 ml-1">{error}</span>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            {/* CMS Detection Results */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  CMS Detection
                </h2>
              </div>
              
              {results.cms && results.cms.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.cms.map((cms, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{cms.name}</h3>
                        {cms.confidence && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {cms.confidence}% sure
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {cms.version || 'Version not detected'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No CMS detected or unable to determine</p>
                </div>
              )}
            </div>

            {/* Port Scan Results */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Open Ports
                </h2>
              </div>
              
              {results.ports && results.ports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Port
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Protocol
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          State
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.ports.map((port, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                            {port.port}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                            {port.protocol || 'TCP'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              port.state === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {port.state}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {port.service || 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-500">No open ports detected or scan failed</p>
                  <p className="text-sm text-gray-400 mt-1">Make sure nmap is installed and accessible</p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            {results.headers && Object.keys(results.headers).length > 0 && (
              <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Server Information
                  </h2>
                </div>
                
                <div className="grid gap-4">
                  {Object.entries(results.headers).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize mb-1 sm:mb-0">
                        {key.replace(/-/g, ' ')}:
                      </span>
                      <span className="text-gray-600 font-mono text-sm break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// pages/api/analyze.js (or app/api/analyze/route.js for App Router)
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Sanitize domain input
    const sanitizedDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '');
    
    const results: any = {};

    // CMS Detection
    try {
      results.cms = await detectCMS(sanitizedDomain);
    } catch (error) {
      console.error('CMS detection failed:', error);
      results.cms = [];
    }

    // Port Scanning with nmap
    try {
      results.ports = await scanPorts(sanitizedDomain);
    } catch (error) {
      console.error('Port scan failed:', error);
      results.ports = [];
    }

    // Get HTTP headers
    try {
      results.headers = await getHeaders(sanitizedDomain);
    } catch (error) {
      console.error('Header retrieval failed:', error);
      results.headers = {};
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

async function detectCMS(domain: string) {
  const cms = [];
  
  try {
    // Try to fetch the homepage
    const response = await axios.get(`https://${domain}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = response.data.toLowerCase();
    const headers = response.headers;

    // WordPress detection
    if (html.includes('wp-content') || html.includes('wordpress') || headers['x-powered-by']?.includes('WordPress')) {
      cms.push({ name: 'WordPress', confidence: 90 });
    }

    // Drupal detection
    if (html.includes('drupal') || headers['x-drupal-cache'] || html.includes('/sites/default/files')) {
      cms.push({ name: 'Drupal', confidence: 85 });
    }

    // Joomla detection
    if (html.includes('joomla') || html.includes('/media/jui/') || html.includes('option=com_')) {
      cms.push({ name: 'Joomla', confidence: 85 });
    }

    // Shopify detection
    if (html.includes('shopify') || headers['server']?.includes('Shopify')) {
      cms.push({ name: 'Shopify', confidence: 95 });
    }

    // Wix detection
    if (html.includes('wix.com') || headers['server']?.includes('Wix')) {
      cms.push({ name: 'Wix', confidence: 95 });
    }

    // Squarespace detection
    if (html.includes('squarespace') || headers['server']?.includes('Squarespace')) {
      cms.push({ name: 'Squarespace', confidence: 95 });
    }

  } catch (error) {
    // Try HTTP if HTTPS fails
    try {
      const response = await axios.get(`http://${domain}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = response.data.toLowerCase();
      if (html.includes('wp-content') || html.includes('wordpress')) {
        cms.push({ name: 'WordPress', confidence: 80 });
      }
    } catch (httpError) {
      console.error('Both HTTPS and HTTP failed:', httpError);
    }
  }

  return cms;
}

async function scanPorts(domain: string) {
  const ports = [];
  
  try {
    // Common ports to scan
    const commonPorts = '21,22,23,25,53,80,110,111,135,139,143,443,993,995,1723,3306,3389,5432,5900,8080,8443';
    
    const { stdout } = await execAsync(`nmap -p ${commonPorts} --open -T4 ${domain}`, {
      timeout: 30000
    });

    const lines = stdout.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\d+)\/(tcp|udp)\s+(\w+)\s+(.*)$/);
      if (match) {
        ports.push({
          port: match[1],
          protocol: match[2],
          state: match[3],
          service: match[4].trim()
        });
      }
    }
  } catch (error: any) {
    console.error('Nmap scan failed:', error.message);
    throw new Error('Port scan failed. Make sure nmap is installed and accessible.');
  }

  return ports;
}

async function getHeaders(domain: string) {
  const headers: Record<string, string> = {};
  
  try {
    const response = await axios.head(`https://${domain}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Extract interesting headers
    const interestingHeaders = ['server', 'x-powered-by', 'x-frame-options', 'content-security-policy', 'x-content-type-options'];
    
    interestingHeaders.forEach(header => {
      if (response.headers[header]) {
        headers[header] = response.headers[header];
      }
    });

  } catch (error) {
    console.error('Header retrieval failed:', error);
  }

  return headers;
}