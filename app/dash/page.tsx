'use client';
import { useState } from 'react';

export default function VulnerabilityScanner() {
  const [target, setTarget] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/vuln?target=${encodeURIComponent(target)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(`Failed to scan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Vulnerability Scanner (Nikto)</h1>
      <form onSubmit={handleScan}>
        <label>
          Enter IP or Domain (e.g., scanme.nmap.org):
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="scanme.nmap.org"
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            required
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results && (
        <div>
          <h2>Scan Results</h2>
          <p><strong>Target:</strong> {results.target}</p>
          <h3>Vulnerabilities:</h3>
          {results.vulnerabilities.length > 0 ? (
            <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
              {results.vulnerabilities.map((vuln: any, index: number) => (
                <li key={index}>{vuln.description}</li>
              ))}
            </ul>
          ) : (
            <p>No vulnerabilities found.</p>
          )}
          <h3>Raw Output:</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', overflowX: 'auto' }}>
            {results.rawOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
