"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Users, Zap, Globe } from 'lucide-react';
import { useNotify } from '@/components/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext'; // Import the useAuth hook
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

const CyberScopeLogin = () => {
  const notify = useNotify();
  const { login, register, isLoading: authLoading, isAuthenticated } = useAuth(); // Get auth functions and state
  const router = useRouter(); // Initialize useRouter

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [name, setName] = useState(''); // State for name during signup
  const [loginType, setLoginType] = useState('login'); // 'login' or 'signup'
  const [formKey, setFormKey] = useState(0); // Key to trigger re-render and animation

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
  }, [securityIndicators.length]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Floating particles animation
  const particles = Array.from({ length: 12 }, (_, i) => i);

  const handleAuth = async () => {
    if (!email || !password) {
      notify.error('Input Error', 'Please enter both email and password.');
      return;
    }

    if (loginType === 'signup' && (!name || !confirmPassword)) {
        notify.error('Input Error', 'Please enter your name and confirm password.');
        return;
    }

    if (loginType === 'signup' && password !== confirmPassword) {
        notify.error('Password Mismatch', 'Passwords do not match.');
        return;
    }

    try {
      let success = false;
      if (loginType === 'login') {
        success = await login(email, password);
      } else { // signup
        success = await register(name, email, password);
      }

      if (success) {
        notify.success(`${loginType === 'login' ? 'Login' : 'Signup'} Successful`, `Welcome to CyberScope, ${email}!`);
        // Redirection handled by useEffect due to isAuthenticated change
      } else {
        // Specific error messages from Firebase are usually caught by the AuthContext,
        // but this provides a fallback for general failure.
        notify.error('Authentication Failed', 'Please check your credentials or try again.');
      }
    } catch (error) { // Changed to 'error' to avoid 'any' type
      // This catch block is for errors not handled by the AuthContext's return `false`
      // For example, network errors or unexpected issues.
      console.error("Auth process error:", error);
      notify.error('Error', (error as Error).message || 'An unexpected error occurred during authentication.');
    }
  };

  // Function to handle tab switch and trigger animation
  const handleTabSwitch = (type: 'login' | 'signup') => {
    setLoginType(type);
    setFormKey(prevKey => prevKey + 1); // Increment key to trigger re-render and animation
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden font-inter antialiased">
      {/* Custom Styles for Glassmorphism and Glow */}
      <style jsx>{`
        .glass-border {
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        .glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px); /* Subtle lift */
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.3); /* Softer shadow with green glow */
        }
        /* Particle animation */
        @keyframes float {
          0% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); opacity: 1; }
          100% { transform: translate(0, 0); opacity: 0.5; }
        }
        .animate-float {
          animation: float var(--animation-duration, 5s) ease-in-out infinite alternate;
        }

        /* Tab switch animation */
        @keyframes tab-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-tab-fade-in {
          animation: tab-fade-in 0.4s ease-out forwards; /* Slower and smoother */
        }
      `}</style>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${particle * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              '--animation-duration': `${3 + Math.random() * 2}s` // Pass as CSS variable
            } as React.CSSProperties} // Type assertion for custom CSS properties
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

      {/* Main content wrapper - flex to fill screen, no overflow */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding and Security Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 p-12 flex-col justify-center relative overflow-hidden">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col h-full justify-center items-start">
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-12">
              <div className="relative">
                <Shield className="h-10 w-10 text-green-400" />
                <div className="absolute inset-0 h-10 w-10 text-green-400 animate-pulse opacity-50">
                  <Shield className="h-10 w-10" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold">CyberScope<span className="text-green-400">Pro</span></span>
                <div className="text-green-400 text-base mt-1">Enterprise Security Platform</div>
              </div>
            </div>

            {/* Hero content */}
            <div className="space-y-8 flex-grow-0">
              <div>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Secure Access to
                  <span className="text-green-400"> Your Digital Fortress</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Join thousands of businesses protecting their digital assets with military-grade security protocols.
                </p>
              </div>

              {/* Animated security features */}
              <div className="space-y-4">
                {securityIndicators.map((indicator, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-xl glass-border card-hover transition-all duration-500 ${
                      index === currentIndicator
                        ? 'bg-green-400/10 border-green-400/50 text-green-400'
                        : 'bg-gray-900/30 border-white/10 text-gray-400'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      index === currentIndicator ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                    }`} />
                    <span className="font-medium text-lg">{indicator.text}</span>
                    {index === currentIndicator && (
                      <CheckCircle className="h-5 w-5 text-green-400 ml-auto" />
                    )}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">10K+</div>
                  <div className="text-sm text-gray-400">Protected Sites</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <Shield className="h-9 w-9 text-green-400" />
              <span className="text-2xl font-bold">CyberScope<span className="text-green-400">Pro</span></span>
            </div>

            {/* Form container */}
            <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent rounded-2xl" />
              
              <div key={formKey} className="relative z-10 animate-tab-fade-in"> {/* Added key and animation class */}
                {/* Tab switcher */}
                <div className="flex bg-gray-800/50 rounded-full p-1 mb-8 glass-border">
                  <button
                    onClick={() => handleTabSwitch('login')}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                      loginType === 'login'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleTabSwitch('signup')}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                      loginType === 'signup'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
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
                  <p className="text-gray-400">
                    {loginType === 'login' 
                      ? 'Access your security dashboard' 
                      : 'Create your secure account'
                    }
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Name field for signup */}
                  {loginType === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password for signup */}
                  {loginType === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword} // Bind confirm password state
                          onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                          className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
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
                          className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-300">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    onClick={handleAuth}
                    disabled={authLoading} /* Disable button while auth is loading */
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-green-400/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {authLoading ? (
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
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900/30 text-gray-400 rounded-lg">Or continue with</span> {/* Updated background */}
                    </div>
                  </div>

                  {/* Social login buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
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
                      className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                      </svg>
                      GitHub
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to site link */}
            <div className="text-center mt-6">
              <a href="/" className="text-gray-400 hover:text-green-400 transition-colors text-sm"> {/* Updated href */}
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
