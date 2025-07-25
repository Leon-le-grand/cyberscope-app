"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Users, Zap, Globe } from 'lucide-react';

const CyberScopeLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('login'); // 'login' or 'signup'
  
  // Animated security indicators
  const securityIndicators = [
    { text: "256-bit AES Encryption", status: "active" },
    { text: "Multi-Factor Authentication", status: "active" },
    { text: "Zero Trust Architecture", status: "active" },
    { text: "SOC 2 Type II Certified", status: "active" }
  ];

  const [currentIndicator, setCurrentIndicator] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndicator((prev) => (prev + 1) % securityIndicators.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Floating particles animation
  const particles = Array.from({ length: 12 }, (_, i) => i);

  const handleScan = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      alert(`${loginType === 'login' ? 'Login' : 'Signup'} successful! Welcome to CyberScope.`);
    }, 2000);
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
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding and Security Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-50" />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-12">
              <div className="relative">
                <svg className="h-10 w-10 text-green-400" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 2L6 6v8c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14V6l-10-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <circle cx="16" cy="16" r="1" fill="currentColor"/>
                  <line x1="16" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="1"/>
                  <line x1="16" y1="20" x2="16" y2="24" stroke="currentColor" strokeWidth="1"/>
                  <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                  <line x1="20" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1"/>
                </svg>
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold">CyberScope</span>
                <div className="text-green-400 text-sm">Enterprise Security Platform</div>
              </div>
            </div>

            {/* Hero content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Secure Access to
                  <span className="text-green-400"> Your Digital Fortress</span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Join thousands of businesses protecting their digital assets with military-grade security protocols.
                </p>
              </div>

              {/* Animated security features */}
              <div className="space-y-4">
                {securityIndicators.map((indicator, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-500 ${
                      index === currentIndicator
                        ? 'bg-green-400/10 border-green-400/50 text-green-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      index === currentIndicator ? 'bg-green-400 animate-pulse' : 'bg-slate-600'
                    }`} />
                    <span className="font-medium">{indicator.text}</span>
                    {index === currentIndicator && (
                      <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                    )}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">10K+</div>
                  <div className="text-sm text-slate-400">Protected Sites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">24/7</div>
                  <div className="text-sm text-slate-400">Monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="relative z-10">
            <div className="bg-black/30 rounded-xl p-6 border border-green-400/30 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                  JD
                </div>
                <div>
                  <p className="text-slate-300 mb-2">
                    "CyberScope detected vulnerabilities we didn't even know existed. Their platform is a game-changer for small business security."
                  </p>
                  <div className="text-sm">
                    <div className="font-semibold text-white">John Doe</div>
                    <div className="text-slate-400">CTO, TechStart Inc.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
              <svg className="h-8 w-8 text-green-400" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2L6 6v8c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14V6l-10-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
                <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                <circle cx="16" cy="16" r="1" fill="currentColor"/>
                <line x1="16" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="1"/>
                <line x1="16" y1="20" x2="16" y2="24" stroke="currentColor" strokeWidth="1"/>
                <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                <line x1="20" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <span className="text-xl font-bold">CyberScope</span>
            </div>

            {/* Form container */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent rounded-2xl" />
              
              <div className="relative z-10">
                {/* Tab switcher */}
                <div className="flex bg-slate-700/50 rounded-lg p-1 mb-8">
                  <button
                    onClick={() => setLoginType('login')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      loginType === 'login'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setLoginType('signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      loginType === 'signup'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    {loginType === 'login' ? 'Welcome Back' : 'Get Started'}
                  </h2>
                  <p className="text-slate-400">
                    {loginType === 'login' 
                      ? 'Access your security dashboard' 
                      : 'Create your secure account'
                    }
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password for signup */}
                  {loginType === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Remember me / Forgot password */}
                  {loginType === 'login' && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-slate-300">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    onClick={handleScan}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-400/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>{loginType === 'login' ? 'Sign In Securely' : 'Create Account'}</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  {/* Social login buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                      </svg>
                      GitHub
                    </button>
                  </div>
                </div>

                {/* Security notice */}
                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="text-green-400 font-medium mb-1">Your data is protected</div>
                      <div className="text-slate-400">
                        We use bank-level encryption and never store your passwords in plain text.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to site link */}
            <div className="text-center mt-6">
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm">
                ← Back to CyberScope.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberScopeLogin;





