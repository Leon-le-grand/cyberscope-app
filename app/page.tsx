"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Search, FileText, Zap, CheckCircle, Star, Users, Lock, Globe, ArrowRight, Menu, X, Code, Terminal, Database, Bug, Layers, Wifi, Cloud, Key, Settings, Info, CreditCard, DollarSign, Play, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const CyberScopeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scanUrl, setScanUrl] = useState(''); // Not used in current render, but kept from previous
  const [isScanning, setIsScanning] = useState(false); // Not used in current render, but kept from previous
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annually'

  // Animated stats for visual appeal in Hero
  const stats = [
    { label: "Threats Blocked", value: "99.9%" },
    { label: "Active Users", value: "250K+" },
    { label: "Global Coverage", value: "150+" },
  ];

  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Refs for scroll animations
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Increase interval for smoother transition between stats
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 5000); // Change stat every 5 seconds for a smoother feel
    return () => clearInterval(interval);
  }, [stats.length]); // Added stats.length to dependency array

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback for server-side rendering or unsupported browsers: make all content visible
      sectionRefs.current.forEach(section => {
        if (section) {
          // These classes are now the default, so this fallback is less critical for visibility
          // but ensures the animation classes are present for any subsequent styling.
          section.classList.add('animate-slide-in-bottom-visible');
          section.classList.add('animate-fade-in-visible');
        }
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add classes when section enters view
            entry.target.classList.add('animate-slide-in-bottom-visible');
            entry.target.classList.add('animate-fade-in-visible');
            // Unobserve after animation to prevent re-triggering if content leaves and re-enters
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: "$29",
      annuallyPrice: "$299", // ~ $24.92/month
      features: [
        "Essential Threat Protection",
        "Single Endpoint License",
        "Email Security Basic",
        "24/7 Chat Support",
        "Monthly Security Reports"
      ],
      cta: "Choose Basic",
      highlight: false,
    },
    {
      name: "Pro",
      monthlyPrice: "$79",
      annuallyPrice: "$799", // ~ $66.58/month
      features: [
        "Advanced Threat Protection",
        "5 Endpoint Licenses",
        "Email Security Pro",
        "Cloud Security Basic",
        "Dedicated Phone Support",
        "Real-time Threat Alerts",
        "Quarterly Security Audits"
      ],
      cta: "Go Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: "$199",
      annuallyPrice: "$1999", // ~ $166.58/month
      features: [
        "Comprehensive Enterprise Suite",
        "Unlimited Endpoint Licenses",
        "Advanced Email & Cloud Security",
        "Managed Detection & Response",
        "Custom Integrations",
        "Priority 24/7 Support",
        "On-site Security Consulting",
        "Annual Penetration Testing"
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter antialiased">
      {/* Custom Styles */}
      {/* Delay for service cards - these apply to the `animate-slide-in-bottom-visible` class */}
      <style jsx>{`
        .hero-gradient {
          background: radial-gradient(ellipse at center top, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 25%, transparent 70%);
        }
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
          transform: translateY(-8px); /* More pronounced lift */
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(34, 197, 94, 0.4); /* Stronger shadow with green glow */
        }
        .integration-logo {
          filter: grayscale(100%) brightness(0.6); /* Adjusted for brighter image view */
          transition: all 0.3s ease;
        }
        .integration-logo:hover {
          filter: grayscale(0%) brightness(1);
        }
        /* Background Image Animation */
        .animated-bg-zoom {
          animation: subtle-zoom 60s ease-in-out infinite alternate;
        }
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        /* Page-wide animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInFromBottom {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Elements that will animate in (they are visible by default now, so this is for the animation itself) */
        .animate-fade-in-visible {
            opacity: 1;
            transform: translateY(0);
            animation: fadeIn 1s ease-out forwards;
        }

        .animate-slide-in-bottom-visible {
            opacity: 1;
            transform: translateY(0);
            animation: slideInFromBottom 0.6s ease-out forwards;
        }

        .service-card-delay-0 { animation-delay: 0s; }
        .service-card-delay-1 { animation-delay: 0.1s; }
        .service-card-delay-2 { animation-delay: 0.2s; }
        .service-card-delay-3 { animation-delay: 0.3s; }
        .service-card-delay-4 { animation-delay: 0.4s; }
        .service-card-delay-5 { animation-delay: 0.5s; }

        /* Ensure .hero-gradient content is above the image */
        .hero-gradient > .max-w-7xl {
            position: relative;
            z-index: 20; /* Higher than the image's z-index */
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-7 w-7 text-green-400" />
                <div className="absolute inset-0 h-7 w-7 text-green-400 animate-pulse opacity-50">
                  <Shield className="h-7 w-7" />
                </div>
              </div>
              <span className="text-xl font-bold">CyberScope<span className="text-green-400">Pro</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-base">Services</a>
              <a href="#solutions" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-base">Solutions</a>
              <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-base">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-base">Pricing</a>
              <a href="#learn" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-base">Learn</a>
              <a href="#support" className="text-gray-300 hover:text-green-400 transition-colors font-medium text-base">Support</a>
            </div>

            {/* Right Actions - Updated Get Started button radius */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-full font-semibold transition-colors text-base">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-950/95 border-t border-white/10 py-4 px-6 space-y-4">
            <a href="#services" className="block py-2 text-gray-300 hover:text-green-400 transition-colors text-base">Services</a>
            <a href="#solutions" className="block py-2 text-gray-300 hover:text-green-400 transition-colors text-base">Solutions</a>
            <a href="#features" className="block py-2 text-gray-300 hover:text-green-400 transition-colors text-base">Features</a>
            <a href="#pricing" className="block py-2 text-gray-300 hover:text-green-400 transition-colors text-base">Pricing</a>
            <a href="#learn" className="block py-2 text-gray-300 hover:text-green-400 transition-colors text-base">Learn</a>
            <a href="#support" className="block py-2 text-gray-300 hover:text-green-400 transition-colors text-base">Support</a>
            <button className="w-full bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full font-semibold transition-colors mt-4 text-base">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-8 hero-gradient overflow-hidden">
        {/* Earth Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/wp4729537-earth-4k-wallpapers.jpg"
            alt="Earth background"
            layout="fill"
            objectFit="cover"
            className="opacity-40 animated-bg-zoom filter blur-[0.5px]"
          />
        </div>

        {/* Hero content - now defaults to animate-fade-in-visible for immediate display */}
        <div ref={el => sectionRefs.current[0] = el} className="max-w-7xl mx-auto relative z-10 animate-fade-in-visible">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold mb-5 leading-tight">
              Ask Me Anything Webinar:
              <br />
              <span className="text-green-400 text-glow">Hunter vs. Spy</span> in Pacific Rim
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join CyberScope and CISA to explore defending against persistent cyber adversaries.
              <br />
              Learn advanced threat hunting techniques and defensive strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-transparent border border-green-500 hover:bg-green-500/10 px-7 py-3 rounded-full text-lg font-semibold transition-all duration-300 glow-green">
                <Play className="h-5 w-5 inline-block mr-2" />
                Get Started
              </button>
              <button className="bg-transparent border border-green-500 hover:bg-green-500/10 px-7 py-3 rounded-full text-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>

            <div className="flex justify-center space-x-8 mt-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  // Increased transition duration for smoother animation
                  className={`text-center transition-opacity duration-2000 ease-in-out transition-transform transform ${
                    index === currentStatIndex ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl font-bold text-green-400">{stat.value}</div>
                  <div className="text-gray-300 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR SERVICES Section (formerly Integrations Section) */}
      {/* Changed initial class to animate-fade-in-visible for immediate display */}
      <section ref={el => sectionRefs.current[1] = el} className="py-16 px-6 lg:px-8 bg-gray-950/70">
        <div className="max-w-7xl mx-auto">
          {/* Changed initial class to animate-fade-in-visible for immediate display */}
          <div className="text-center mb-12 animate-fade-in-visible">
            <h3 className="text-xl font-bold mb-4">OUR SERVICES</h3>
            <p className="text-gray-400 text-base">Integrations and tools from leading companies around the globe</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {[
              { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png" },
              { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png" },
              { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Microsoft_Azure_Logo.svg/1200px-Microsoft_Azure_Logo.svg.png" },
              { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1280px-IBM_logo.svg.png" },
              { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo.svg/1200px-Cisco_logo.svg.png" }
            ].map((partner, index) => (
              <div key={index} className={`glass-border rounded-lg p-6 w-32 h-20 flex items-center justify-center integration-logo cursor-pointer animate-slide-in-bottom-visible service-card-delay-${index}`}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Advantage Section */}
      {/* Changed initial class to animate-fade-in-visible for immediate display */}
      <section ref={el => sectionRefs.current[2] = el} className="py-20 px-6 lg:px-8 bg-gray-950/80">
        <div className="max-w-7xl mx-auto">
          {/* Changed initial class to animate-fade-in-visible for immediate display */}
          <div className="text-center mb-16 animate-fade-in-visible">
            <div className="text-green-400 text-sm font-semibold mb-4 tracking-wider">UNIQUE FEATURES</div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Discover the <span className="text-green-400">Unique Advantage</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Experience unparalleled cybersecurity with our AI-driven platform designed to protect your organization from the most sophisticated threats.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`glass-border rounded-2xl p-8 card-hover bg-gray-900/30 animate-slide-in-bottom-visible service-card-delay-0`}>
              <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Trusted</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                The world-renowned industry-leading Cybersecurity platform trusted by thousands of organizations worldwide. Advanced Network Firewall.
              </p>
            </div>

            <div className={`glass-border rounded-2xl p-8 card-hover bg-gray-900/30 animate-slide-in-bottom-visible service-card-delay-1`}>
              <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Proven</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                A Leader in the Gartner Magic Quadrant for Network Detection and Response with the MDR, operational excellence and innovative time.
              </p>
            </div>

            <div className={`glass-border rounded-2xl p-8 card-hover bg-gray-900/30 animate-slide-in-bottom-visible service-card-delay-2`}>
              <div className="w-16 h-16 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Leader</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                Stopping 99.99% of threats before they compromise your organization. Fastest and the most precise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Defeat Cyberattacks Section */}
      {/* Changed initial class to animate-fade-in-visible for immediate display */}
      <section ref={el => sectionRefs.current[3] = el} className="py-20 px-6 lg:px-8 bg-gray-950/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-visible">
              <div className="glass-border rounded-2xl p-2 w-fit mb-8 bg-gray-900/30">
                <div className="text-5xl font-bold text-green-400 text-center py-6 px-10">
                  Win<br />
                  <span className="text-3xl text-white">Win</span>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-visible">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Defeat <span className="text-green-400">Cyberattacks</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Award-winning endpoint and network threat protection trusted by over 500 top global customers around the world.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-black w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm mt-1">1</div>
                  <div>
                    <h4 className="font-semibold mb-2 text-base">Our detection and response, cloud, firewall, and managed security services combine to create an integrated protection solution</h4>
                    <p className="text-gray-400 text-sm">Complete visibility and control across your entire infrastructure</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-black w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm mt-1">2</div>
                  <div>
                    <p className="text-gray-400 text-base">
                      Streamline, visualize and leverage your combined security spend to reduce overall costs, increase operational efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Sophos-like section) */}
      {/* Changed initial class to animate-fade-in-visible for immediate display */}
      <section id="services" ref={el => sectionRefs.current[4] = el} className="py-20 px-6 lg:px-8 bg-gray-950/80">
        <div className="max-w-7xl mx-auto">
          {/* Changed initial class to animate-fade-in-visible for immediate display */}
          <div className="text-center mb-16 animate-fade-in-visible">
            <h2 className="text-3xl font-bold mb-4">
              CyberScope has <span className="text-green-400">you covered</span>
            </h2>
            <p className="text-lg text-gray-400">
              Comprehensive security solutions tailored for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="h-7 w-7" />,
                title: "Endpoint Security",
                description: "Advanced protection for all your endpoints with real-time threat detection and response capabilities.",
                cta: "Learn More"
              },
              {
                icon: <Globe className="h-7 w-7" />,
                title: "Ultimate Security",
                description: "Comprehensive security suite that covers every aspect of your digital infrastructure and assets.",
                cta: "Learn More"
              },
              {
                icon: <Code className="h-7 w-7" />,
                title: "Advanced Security Services",
                description: "Professional security services including threat hunting, incident response, and security consulting.",
                cta: "Learn More"
              },
              {
                icon: <Lock className="h-7 w-7" />,
                title: "Email Security",
                description: "Protect your organization from email-based threats including phishing, malware, and data exfiltration.",
                cta: "Learn More"
              },
              {
                icon: <Database className="h-7 w-7" />,
                title: "Cloud Security",
                description: "Secure your cloud infrastructure with continuous monitoring and automated threat response.",
                cta: "Learn More"
              },
              {
                icon: <Wifi className="h-7 w-7" />,
                title: "Managed DETECTION",
                description: "24/7 managed detection and response services with expert security analysts monitoring your environment.",
                cta: "Learn More"
              }
            ].map((service, index) => (
              <div key={index} className={`glass-border rounded-2xl p-6 card-hover bg-gray-900/30 group animate-slide-in-bottom-visible service-card-delay-${index}`}>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <div className="text-green-400">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{service.description}</p>
                <button className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1 group">
                  {service.cta}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* Changed initial class to animate-fade-in-visible for immediate display */}
      <section id="pricing" ref={el => sectionRefs.current[5] = el} className="py-20 px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto text-center animate-fade-in-visible">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Simple, Transparent <span className="text-green-400">Pricing</span>
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Find the perfect plan for your organization, from small businesses to large enterprises.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-gray-800 rounded-full p-1 mb-12 glass-border">
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                billingCycle === 'monthly' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Billing
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                billingCycle === 'annually' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setBillingCycle('annually')}
            >
              Annual Billing <span className="text-green-200 ml-2">(Save up to 20%)</span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`glass-border rounded-2xl p-8 flex flex-col justify-between h-full ${
                  plan.highlight ? 'bg-green-600/20 border-green-500 glow-green relative' : 'bg-gray-900/30'
                } animate-slide-in-bottom-visible service-card-delay-${index}`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-green-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-gray-400 text-base mb-6">
                    {plan.name === "Basic" && "Ideal for individuals and small teams."}
                    {plan.name === "Pro" && "Perfect for growing businesses needing robust protection."}
                    {plan.name === "Enterprise" && "Tailored for large organizations with complex needs."}
                  </p>
                  <div className="text-5xl font-extrabold text-green-400 mb-2">
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annuallyPrice}
                    <span className="text-xl text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  {billingCycle === 'annually' && plan.name !== 'Enterprise' && (
                    <p className="text-gray-400 text-sm">
                      {`$${(parseFloat(plan.monthlyPrice.replace('$', '')) * 12 - parseFloat(plan.annuallyPrice.replace('$', ''))).toFixed(0)} saved annually`}
                    </p>
                  )}
                  {plan.name === "Enterprise" && (
                    <p className="text-gray-400 text-sm">Custom pricing available</p>
                  )}
                </div>
                <ul className="space-y-3 text-left mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-green-500 hover:bg-green-600 text-gray-950'
                      : 'bg-transparent border border-green-500 hover:bg-green-500/10 text-green-400'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {/* Changed initial class to animate-fade-in-visible for immediate display */}
      <section ref={el => sectionRefs.current[6] = el} className="py-20 px-6 lg:px-8 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-visible">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Secure Your Future?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of organizations that trust CyberScope Pro for their cybersecurity needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-transparent border border-green-500 hover:bg-green-500/10 px-7 py-3 rounded-full text-lg font-semibold transition-all duration-300 glow-green">
              Start Free Trial
            </button>
            <button className="bg-transparent border border-green-500 hover:bg-green-500/10 px-7 py-3 rounded-full text-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 lg:px-8 bg-gray-950/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-7 w-7 text-green-400" />
                <span className="text-xl font-bold">CyberScope<span className="text-green-400">Pro</span></span>
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                Advanced cybersecurity solutions for the modern enterprise. Protecting what matters most.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">GitHub</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white text-base">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white text-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 CyberScope Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CyberScopeLanding;
