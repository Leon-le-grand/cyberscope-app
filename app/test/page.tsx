// "use client";
// import React, { useState } from "react";
// import { ArrowRight, Shield } from "lucide-react";

// const ScanDomainForm = () => {
//   const [domain, setDomain] = useState("");
//   const [isScanning, setIsScanning] = useState(false);

//   const handleScan = async () => {
//     if (!domain) return;
//     setIsScanning(true);

//     // Simulate scanning process
//     setTimeout(() => {
//       alert(`Scanning ${domain}... (Feature preview)`);
//       setIsScanning(false);
//     }, 3000);
//   };

//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto shadow-lg">
//       <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
//         <Shield className="text-green-400" />
//         Scan Your Domain
//       </h2>

//       <p className="text-slate-400 mb-6">
//         Enter your domain to run a real-time security scan and identify vulnerabilities.
//       </p>

//       <div className="flex flex-col sm:flex-row gap-4">
//         <input
//           type="text"
//           placeholder="e.g., example.com"
//           value={domain}
//           onChange={(e) => setDomain(e.target.value)}
//           className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500"
//         />
//         <button
//           onClick={handleScan}
//           disabled={isScanning}
//           className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
//             isScanning
//               ? "bg-green-400/20 text-green-400 cursor-not-allowed"
//               : "bg-green-500 hover:bg-green-600 text-white"
//           }`}
//         >
//           {isScanning ? "Scanning..." : "Scan"}
//           {!isScanning && <ArrowRight className="h-4 w-4" />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ScanDomainForm;
"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<{ cms: string | null; confidence: number; evidence: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.get(`/api/detect?domain=${encodeURIComponent(domain)}`);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze the domain. Please check the input and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">CMS Detector</h1>
      <form onSubmit={handleScan} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="domain" className="block text-gray-700 mb-2">Enter Domain (e.g., example.com)</label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Scanning...
            </span>
          ) : (
            'Scan'
          )}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <div className="mt-6 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p><strong>Detected CMS:</strong> {result.cms || 'None'}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          <h3 className="text-lg font-medium mt-4">Evidence:</h3>
          <ul className="list-disc pl-5">
            {result.evidence.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}