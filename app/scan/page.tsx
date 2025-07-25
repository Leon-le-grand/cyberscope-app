// 'use client';
// import { useState } from 'react';

// export default function PortScanner() {
//   const [target, setTarget] = useState('');
//   const [results, setResults] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleScan = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setResults(null);
//     setLoading(true);

//     try {
//       const response = await fetch(`/api/scan?target=${encodeURIComponent(target)}`);
//       const data = await response.json();
//       if (data.error) {
//         setError(data.error);
//       } else {
//         setResults(data);
//       }
//     } catch (err) {
//       setError('Failed to connect to the server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//       <h1>Port Scanner</h1>
//       <form onSubmit={handleScan}>
//         <label>
//           Enter IP or Domain (e.g., scanme.nmap.org):
//           <input
//             type="text"
//             value={target}
//             onChange={(e) => setTarget(e.target.value)}
//             placeholder="scanme.nmap.org"
//             style={{ width: '100%', padding: '8px', margin: '10px 0' }}
//             required
//           />
//         </label>
//         <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
//           {loading ? 'Scanning...' : 'Scan'}
//         </button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {results && (
//         <div>
//           <h2>Scan Results</h2>
//           <pre>{JSON.stringify(results, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { Shield, Zap, Globe, AlertCircle, CheckCircle } from 'lucide-react';

export default function PortScanner() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('quick'); // Default to quick scan
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Animated particles for background
  const particles = Array.from({ length: 12 }, (_, i) => i);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/scan?target=${encodeURIComponent(target)}&type=${encodeURIComponent(scanType)}`);
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
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${particle * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent rounded-2xl" />

          <div className="relative z-10">
            {/* Header with logo */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="relative">
                <Shield className="h-8 w-8 text-green-400" />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
              </div>
              <span className="text-xl font-bold">CyberScope Port Scanner</span>
            </div>

            {/* Form header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Scan Your Target</h2>
              <p className="text-slate-400">Analyze open ports and services with precision</p>
            </div>

            {/* Form */}
            <form onSubmit={handleScan} className="space-y-6">
              {/* Target field */}
              <div className="space-y-2">
                <label htmlFor="target" className="block text-sm font-medium text-slate-300">
                  IP or Domain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="target"
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g., scanme.nmap.org"
                    className="w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Scan type field */}
              <div className="space-y-2">
                <label htmlFor="scanType" className="block text-sm font-medium text-slate-300">
                  Scan Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Zap className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    id="scanType"
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="quick">Quick Scan (Top 100 Ports)</option>
                    <option value="full">Full Scan (All 65,535 Ports)</option>
                    <option value="intense">Intense Scan (Ports + Version + OS)</option>
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-400/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <span>Start Scan</span>
                    <Zap className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Error message */}
            {error && (
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-start space-x-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <h3 className="text-lg font-semibold">Scan Results for {results.target}</h3>
                </div>
                {results.openPorts && results.openPorts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-700/50">
                          <th className="p-3 border-b border-slate-600 text-sm font-medium text-slate-300">Port Number</th>
                          <th className="p-3 border-b border-slate-600 text-sm font-medium text-slate-300">Port Name/Service</th>
                          <th className="p-3 border-b border-slate-600 text-sm font-medium text-slate-300">State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.openPorts.map((port: any, index: number) => (
                          <tr key={index} className="border-b border-slate-600/50 hover:bg-slate-700/70 transition-all duration-200">
                            <td className="p-3">{port.port}</td>
                            <td className="p-3">{port.service}</td>
                            <td className="p-3">{port.state}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-400">No open ports detected.</p>
                )}
                {results.output && (
                  <div className="mt-4">
                    <div className="flex items-start space-x-3 mb-2">
                      <Globe className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <h4 className="text-sm font-medium text-slate-300">Raw Output</h4>
                    </div>
                    <pre className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg overflow-auto">
                      {results.output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}