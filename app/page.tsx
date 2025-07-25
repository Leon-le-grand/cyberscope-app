"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Search, FileText, Zap, CheckCircle, Star, Users, Lock, Globe, ArrowRight, Menu, X } from 'lucide-react';

const CyberScopeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Animated code snippets for visual appeal
  const codeSnippets = [
    "SCANNING: example.com",
    "DETECTED: Apache/2.4.41",
    "VULNERABILITY: CVE-2021-44228",
    "SSL CERTIFICATE: Valid",
    "SECURITY SCORE: 87/100"
  ];

  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    if (!scanUrl) return;
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      alert(`Scanning ${scanUrl}... Feature demo - full functionality available in production!`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <svg className="h-8 w-8 text-green-400" viewBox="0 0 32 32" fill="currentColor">
                  {/* Shield outline */}
                  <path d="M16 2L6 6v8c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14V6l-10-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  {/* Scope/crosshair design */}
                  <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <circle cx="16" cy="16" r="1" fill="currentColor"/>
                  {/* Crosshair lines */}
                  <line x1="16" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="1"/>
                  <line x1="16" y1="20" x2="16" y2="24" stroke="currentColor" strokeWidth="1"/>
                  <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                  <line x1="20" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <span className="text-xl font-bold">CyberScope</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-green-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-green-400 transition-colors">Pricing</a>
              <a href="#security" className="hover:text-green-400 transition-colors">Security</a>
              <a href="#" className="hover:text-green-400 transition-colors">Login</a>
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full transition-colors">
                Start Free Trial
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 hover:text-green-400">Features</a>
              <a href="#pricing" className="block py-2 hover:text-green-400">Pricing</a>
              <a href="#security" className="block py-2 hover:text-green-400">Security</a>
              <a href="#" className="block py-2 hover:text-green-400">Login</a>
              <button className="w-full text-left bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg mt-2">
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Your Business
                  <span className="text-green-400"> Deserves</span>
                  <br />
                  Bulletproof Security
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  CyberScope automatically scans your website, detects vulnerabilities, and generates comprehensive security reports. Protect your small business from cyber threats before they strike.
                </p>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-full px-4 py-2 text-green-400 text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Trusted by 10,000+ businesses worldwide
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">SOC 2 Certified</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Animation Panel */}
            <div className="relative">
              <div className="bg-black rounded-xl border border-green-400/30 overflow-hidden shadow-2xl">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-sm text-slate-400">CyberScope Terminal</span>
                </div>
                <div className="p-6 font-mono text-sm space-y-2 h-64">
                  <div className="text-green-400">$ cyberscope --scan-domain</div>
                  <div className="text-slate-400">Initializing security scan...</div>
                  <br />
                  {codeSnippets.map((snippet, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        index <= currentCodeIndex 
                          ? 'opacity-100 text-green-300' 
                          : 'opacity-30 text-slate-600'
                      }`}
                    >
                      {snippet}
                    </div>
                  ))}
                  <div className="animate-pulse text-green-400 mt-4">
                    {currentCodeIndex === codeSnippets.length - 1 ? '✓ Scan complete!' : '▋'}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-400 text-black px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                Live Scan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Enterprise-Grade Security
              <span className="text-green-400"> Made Simple</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Don't let cyber criminals exploit your business. Our advanced scanning engine identifies threats that 90% of small businesses miss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8" />,
                title: "Deep Domain Analysis",
                description: "Comprehensive scanning of your entire web infrastructure, including subdomains, DNS records, and server configurations.",
                highlight: "Find hidden vulnerabilities"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Real-Time Threat Detection",
                description: "AI-powered vulnerability detection that identifies security risks as they emerge, not weeks after they're discovered.",
                highlight: "Stay ahead of hackers"
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Executive Security Reports",
                description: "Professional, detailed reports that translate technical findings into actionable business insights for decision makers.",
                highlight: "Make informed decisions"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Vulnerability Alerts",
                description: "Get immediate notifications when critical security issues are detected, with step-by-step remediation guidance.",
                highlight: "React in minutes, not months"
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Compliance Monitoring",
                description: "Ensure your business meets GDPR, CCPA, and industry-specific security standards with automated compliance checking.",
                highlight: "Avoid costly fines"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Technology Stack Analysis",
                description: "Identify all technologies, frameworks, and third-party services your website uses, plus their known security issues.",
                highlight: "Know what you're running"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-green-400/50 transition-all duration-300 group">
                <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-300 mb-3">{feature.description}</p>
                <div className="text-green-400 text-sm font-medium">
                  → {feature.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Insights Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stay Ahead of
              <span className="text-green-400"> Cyber Threats</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Knowledge is power. Understanding the cybersecurity landscape helps you make smarter decisions for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                stat: "43%",
                label: "of cyberattacks target small businesses",
                description: "Making security a top priority for growth",
                color: "text-blue-400",
                icon: "🎯"
              },
              {
                stat: "95%",
                label: "of breaches are preventable",
                description: "With the right security tools and practices",
                color: "text-green-400",
                icon: "🛡️"
              },
              {
                stat: "3x",
                label: "faster threat detection with AI",
                description: "Advanced tools spot issues before they escalate",
                color: "text-purple-400",
                icon: "⚡"
              },
              {
                stat: "24/7",
                label: "continuous monitoring available",
                description: "Modern security never sleeps, so you can",
                color: "text-cyan-400",
                icon: "👁️"
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center hover:border-green-400/30 transition-all duration-300">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className={`text-3xl font-bold mb-2 ${item.color}`}>
                  {item.stat}
                </div>
                <div className="text-white font-semibold mb-2">
                  {item.label}
                </div>
                <div className="text-slate-400 text-sm">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">
                  Smart Security Made Simple
                </h3>
                <p className="text-slate-300 mb-6">
                  While cybersecurity can seem overwhelming, the right tools make protection straightforward. 
                  CyberScope brings enterprise-grade security capabilities within reach of every business owner.
                </p>
                <ul className="space-y-3">
                  {[
                    "Proactive threat detection and prevention",
                    "Easy-to-understand security insights", 
                    "Automated compliance and reporting",
                    "Peace of mind for you and your customers"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="bg-black rounded-lg p-6 border border-green-400/30">
                  <div className="text-green-400 text-sm mb-4">🛡️ Active Protection Dashboard</div>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Score:</span>
                      <span className="text-green-400">98/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SSL Certificate:</span>
                      <span className="text-green-400">VALID</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vulnerabilities:</span>
                      <span className="text-green-400">0 CRITICAL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Scan:</span>
                      <span className="text-green-400">2 MIN AGO</span>
                    </div>
                    <div className="text-green-400 text-center mt-4 animate-pulse">
                      ✓ All systems SECURE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Security That Fits Your Budget
            </h2>
            <p className="text-xl text-slate-300">
              From startups to scaling businesses, we have a plan that protects what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$19",
                originalPrice: "$39",
                period: "/month",
                description: "Perfect for small websites and blogs",
                features: [
                  "1 website scan",
                  "Basic vulnerability detection",
                  "Monthly reports",
                  "Email support",
                  "SSL monitoring"
                ],
                cta: "Get Started",
                popular: false,
                savings: "50% OFF"
              },
              {
                name: "Business Pro",
                price: "$49",
                originalPrice: "$99", 
                period: "/month",
                description: "Most popular for growing businesses",
                features: [
                  "5 website scans",
                  "Advanced AI threat detection",
                  "Weekly detailed reports",
                  "Priority support",
                  "Compliance monitoring",
                  "API access",
                  "Real-time alerts",
                  "Custom security policies"
                ],
                cta: "Start Free Trial",
                popular: true,
                savings: "50% OFF"
              },
              {
                name: "Enterprise",
                price: "Custom",
                originalPrice: null,
                period: "",
                description: "Tailored for large organizations",
                features: [
                  "Unlimited scans",
                  "White-label reports",
                  "Dedicated security expert",
                  "24/7 phone support",
                  "Custom integrations",
                  "Advanced compliance",
                  "Penetration testing",
                  "Security training"
                ],
                cta: "Contact Sales",
                popular: false,
                savings: null
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-slate-900 rounded-2xl p-8 border transition-all duration-500 relative overflow-hidden ${
                plan.popular 
                  ? 'border-green-400 shadow-2xl shadow-green-400/30 scale-105' 
                  : 'border-slate-700 hover:border-green-400/50'
              }`}>
                {plan.popular && (
                  <>
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-green-400/20 to-green-400/10 animate-pulse"></div>
                    <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                    <div className="absolute -bottom-px left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                    
                    <div className="relative z-10">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 text-black text-sm font-bold px-4 py-2 rounded-full inline-block mb-4 animate-pulse">
                        🔥 MOST POPULAR - LIMITED TIME
                      </div>
                    </div>
                  </>
                )}
                
                {plan.savings && !plan.popular && (
                  <div className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    {plan.savings}
                  </div>
                )}

                <div className={plan.popular ? "relative z-10" : ""}>
                  <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                  
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-slate-400 line-through text-lg mb-1">
                        {plan.originalPrice}{plan.period}
                      </div>
                    )}
                    <div className="text-4xl font-bold mb-2">
                      {plan.price}
                      <span className="text-lg text-slate-400">{plan.period}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 text-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-400/25 transform hover:scale-105'
                      : 'bg-slate-700 hover:bg-slate-600 text-white hover:shadow-lg'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 bg-slate-800 rounded-full px-6 py-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">Limited Time: 50% OFF All Plans</span>
              </div>
              <div className="text-green-400 text-sm font-semibold">⏰ Ends Soon!</div>
            </div>
            
            <p className="text-slate-400 mb-4">
              ✅ 14-day free trial • ✅ No setup fees • ✅ Cancel anytime • ✅ Money-back guarantee
            </p>
            <div className="flex justify-center items-center gap-6 text-sm flex-wrap">
              <span className="text-green-400">🛡️ SOC 2 Type II Certified</span>
              <span className="text-green-400">🔒 Bank-level encryption</span>
              <span className="text-green-400">⚡ 99.99% Uptime SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Don't Wait for a Cyber Attack to Take Action
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Every minute your business remains unprotected is a minute hackers have to find and exploit vulnerabilities. Start securing your digital assets today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2">
              Start Your Free Security Scan
              <ArrowRight className="h-5 w-5" />
            </button>
            <span className="text-slate-400">No credit card required</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <svg className="h-8 w-8 text-green-400" viewBox="0 0 32 32" fill="currentColor">
                    {/* Shield outline */}
                    <path d="M16 2L6 6v8c0 6.5 4.5 12.5 10 14 5.5-1.5 10-7.5 10-14V6l-10-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    {/* Scope/crosshair design */}
                    <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <circle cx="16" cy="16" r="1" fill="currentColor"/>
                    {/* Crosshair lines */}
                    <line x1="16" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="1"/>
                    <line x1="16" y1="20" x2="16" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1"/>
                    <line x1="20" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">CyberScope</span>
              </div>
              <p className="text-slate-400 mb-4">
                Protecting small businesses from cyber threats with enterprise-grade security tools made simple.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">LinkedIn</a>
                <a href="#" className="text-slate-400 hover:text-green-400 transition-colors">GitHub</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Status Page</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 CyberScope. All rights reserved. • Keeping your business secure, one scan at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CyberScopeLanding;