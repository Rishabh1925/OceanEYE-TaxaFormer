'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Upload, Dna, Map, LineChart, Database, Layers, ChevronRight, Waves, Fish, Microscope } from 'lucide-react';
import ModernNav from '@/components/ModernNav';
import UploadPage from '@/components/UploadPage';
import ReportPage from '@/components/ReportPage';
import ResultsPage from '@/components/ResultsPage';
import ContactPage from '@/components/ContactPage';
import OutputPage from '@/components/OutputPage';

// Dynamic imports for components with browser-only dependencies (Three.js, GSAP, Leaflet)
const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false });
const SplitText = dynamic(() => import('@/components/SplitText'), { ssr: false });
const ClickSpark = dynamic(() => import('@/components/ClickSpark'), { ssr: false });
const GlareHover = dynamic(() => import('@/components/GlareHover'), { ssr: false });
const CardSwap = dynamic(() => import('@/components/CardSwap').then(mod => ({ default: mod.default })), { ssr: false });
const Card = dynamic(() => import('@/components/CardSwap').then(mod => ({ default: mod.Card })), { ssr: false });
const MapPage = dynamic(() => import('@/components/MapPage'), { ssr: false });

// Taxaformer Multi-Page Application
type PageType = 'home' | 'upload' | 'map' | 'report' | 'contact' | 'output' | 'results';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Smooth scroll handler
  const handleScrollTo = useCallback((id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as PageType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navItems = [
    {
      label: "Home",
      onClick: () => handleNavigate('home')
    },
    {
      label: "Platform",
      items: [
        { 
          label: "Upload Sequences", 
          onClick: () => handleNavigate('upload'),
          description: "Upload and process eDNA sequences",
          icon: <Upload className="w-5 h-5" />
        },
        { 
          label: "View Map", 
          onClick: () => handleNavigate('map'),
          description: "Explore global biodiversity distribution",
          icon: <Map className="w-5 h-5" />
        }
      ]
    },
    {
      label: "Analysis",
      items: [
        { 
          label: "View Results", 
          onClick: () => handleNavigate('output'),
          description: "Examine detailed classification results",
          icon: <Database className="w-5 h-5" />
        },
        { 
          label: "Analysis Charts", 
          onClick: () => handleNavigate('results'),
          description: "View detailed charts and graphs",
          icon: <LineChart className="w-5 h-5" />
        },
        { 
          label: "View Report", 
          onClick: () => handleNavigate('report'),
          description: "Generate comprehensive analysis reports",
          icon: <Layers className="w-5 h-5" />
        }
      ]
    },
    {
      label: "Contact",
      onClick: () => handleNavigate('contact')
    }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpload = () => {
    handleNavigate('upload');
  };

  const handleDemo = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => handleScrollTo('features'), 100);
    } else {
      handleScrollTo('features');
    }
  };

  return (
    <ClickSpark
      sparkColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={500}
    >
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white' 
          : 'bg-gradient-to-b from-sky-100 via-sky-50 to-blue-50 text-slate-900'
      }`}>
        {/* Fixed Background */}
        <div className="fixed inset-0 z-0 opacity-70">
          <LiquidEther
            colors={isDarkMode ? ['#0891B2', '#0E7490', '#155E75'] : ['#38BDF8', '#60A5FA', '#A78BFA']}
            bgColor={isDarkMode ? '#0F172A' : '#F0F9FF'}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Modern Navigation */}
        <ModernNav
          items={navItems}
          onLogoClick={() => handleNavigate('home')}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={currentPage}
        />

        {/* Scrollable Content */}
        <div className="relative z-10 pt-24">
          {currentPage === 'home' && <HomePage isDarkMode={isDarkMode} onNavigate={handleNavigate} handleScrollTo={handleScrollTo} handleUpload={handleUpload} handleDemo={handleDemo} />}
          {currentPage === 'upload' && <UploadPage isDarkMode={isDarkMode} onNavigate={handleNavigate} />}
          {currentPage === 'map' && <MapPage isDarkMode={isDarkMode} onNavigate={handleNavigate} />}
          {currentPage === 'report' && <ReportPage isDarkMode={isDarkMode} onNavigate={handleNavigate} />}
          {currentPage === 'results' && <ResultsPage isDarkMode={isDarkMode} onNavigate={handleNavigate} />}
          {currentPage === 'contact' && <ContactPage isDarkMode={isDarkMode} onNavigate={handleNavigate} />}
          {currentPage === 'output' && <OutputPage isDarkMode={isDarkMode} onNavigate={handleNavigate} />}
        </div>
      </div>
    </ClickSpark>
  );
}

// HomePage Component
function HomePage({ isDarkMode, onNavigate, handleScrollTo, handleUpload, handleDemo }: { 
  isDarkMode: boolean; 
  onNavigate: (page: string) => void;
  handleScrollTo: (id: string) => void;
  handleUpload: () => void;
  handleDemo: () => void;
}) {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-8">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="relative">
            <div className="space-y-2 md:space-y-4 text-center">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <div className={`hidden md:block w-16 md:w-20 h-1 ${isDarkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`}></div>
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  DECODE THE
                </h1>
              </div>

              <div className="relative inline-block">
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none ${
                  isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700'
                }`}>
                  OCEAN<span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>.</span>
                </h1>
              </div>

              <div className="flex items-center justify-center gap-4 md:gap-6">
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  WITH AI
                </h1>
                <div className={`hidden md:block w-16 md:w-20 h-1 ${isDarkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`}></div>
              </div>
            </div>

            <div className="mt-8 max-w-xl mx-auto text-center">
              <p className={`text-lg md:text-xl font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                AI-Powered eDNA Classification Platform
              </p>
              <p className={`text-sm md:text-base ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Transform environmental DNA sequences into biodiversity insights using Nucleotide Transformer AI
              </p>
            </div>

            <div className="mt-10 md:mt-12 flex justify-center">
              <button 
                type="button"
                onClick={handleUpload}
                className={`group px-10 py-4 rounded-lg text-base font-bold transition-all flex items-center gap-3 ${
                  isDarkMode
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                } shadow-lg`}
              >
                START ANALYZING
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SplitText
              text="Powerful Features"
              tag="h2"
              className={`text-2xl md:text-3xl mb-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              delay={40}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need for comprehensive eDNA analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              isDarkMode={isDarkMode}
              icon={<Dna className="w-8 h-8" />}
              title="Nucleotide Transformer AI"
              description="State-of-the-art deep learning model trained on eukaryotic sequences for accurate taxonomic classification from phylum to genus level"
            />
            <FeatureCard
              isDarkMode={isDarkMode}
              icon={<Database className="w-8 h-8" />}
              title="PR2 + SILVA Database"
              description="Combined reference database specifically optimized for marine and deep-sea eukaryotic diversity analysis"
            />
            <FeatureCard
              isDarkMode={isDarkMode}
              icon={<Map className="w-8 h-8" />}
              title="Spatial Biodiversity Mapping"
              description="Visualize eDNA results on interactive global maps with color-coded taxa and diversity metrics per sampling site"
            />
            <FeatureCard
              isDarkMode={isDarkMode}
              icon={<LineChart className="w-8 h-8" />}
              title="Diversity Metrics"
              description="Calculate species richness, Shannon index, and abundance estimates with confidence intervals"
            />
            <FeatureCard
              isDarkMode={isDarkMode}
              icon={<Layers className="w-8 h-8" />}
              title="Multi-Layer Filtering"
              description="Filter results by taxonomic level, confidence threshold, depth range, and environmental parameters"
            />
            <FeatureCard
              isDarkMode={isDarkMode}
              icon={<Upload className="w-8 h-8" />}
              title="Batch Processing"
              description="Upload multiple samples with metadata and process thousands of sequences in parallel"
            />
          </div>
        </div>
      </section>

      {/* Marine Biodiversity Data Showcase */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? 'bg-slate-800/30' : 'bg-white/20'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SplitText
                text="Marine Biodiversity Data"
                tag="h2"
                className={`text-2xl md:text-3xl mb-6 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                delay={40}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
              />
              <p className={`text-base mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Explore comprehensive marine biodiversity analytics powered by advanced eDNA sequencing and AI classification.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-600/20'}`}>
                    <Dna className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      DNA Sequencing Precision
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Process over 1.2M+ sequences with 99.8% accuracy
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-600/20'}`}>
                    <Waves className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Global Ocean Coverage
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Map biodiversity across 2.3M km² of marine ecosystems
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-600/20'}`}>
                    <Fish className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Species Intelligence
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Identify 1,284 species across 23 phyla
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${isDarkMode ? 'bg-pink-500/20' : 'bg-pink-600/20'}`}>
                    <Microscope className={`w-5 h-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Comprehensive Analysis
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Analyze 661 samples from 47 locations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: '600px', position: 'relative' }}>
              <CardSwap
                cardDistance={50}
                verticalDistance={60}
                delay={4000}
                pauseOnHover={true}
                width={480}
                height={400}
              >
                <Card customClass={!isDarkMode ? 'light-mode' : ''}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                        <Dna className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'}`}>
                        Feature 1
                      </span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      DNA Sequencing
                    </h3>
                    
                    <p className={`text-sm mb-4 flex-grow ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Advanced eDNA extraction and sequencing from environmental samples
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          1.2M+
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Sequences
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          99.8%
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Accuracy
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          &lt; 24h
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Processing
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card customClass={!isDarkMode ? 'light-mode' : ''}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Waves className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'}`}>
                        Feature 2
                      </span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Ocean Mapping
                    </h3>
                    
                    <p className={`text-sm mb-4 flex-grow ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Real-time biodiversity mapping across global marine ecosystems
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          47
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Locations
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          2.3M km²
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Coverage
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          0-6000m
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Depth
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card customClass={!isDarkMode ? 'light-mode' : ''}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <Fish className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'}`}>
                        Feature 3
                      </span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Species Detection
                    </h3>
                    
                    <p className={`text-sm mb-4 flex-grow ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      AI-powered taxonomic classification
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          1,284
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Species
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          23
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Phyla
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          PR2+SILVA
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Database
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card customClass={!isDarkMode ? 'light-mode' : ''}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                        <Microscope className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'}`}>
                        Feature 4
                      </span>
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Analysis Tools
                    </h3>
                    
                    <p className={`text-sm mb-4 flex-grow ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Comprehensive biodiversity analysis
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          661
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Samples
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          23
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Countries
                        </div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                          18
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          Projects
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Helper Components
function FeatureCard({ isDarkMode, icon, title, description }: { 
  isDarkMode: boolean; 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <GlareHover
      glareColor={isDarkMode ? '#60A5FA' : '#3B82F6'}
      glareOpacity={isDarkMode ? 0.3 : 0.2}
      glareSize={400}
    >
      <div className={`p-6 rounded-xl h-full transition-all ${
        isDarkMode 
          ? 'bg-slate-800/50 border border-slate-700/50' 
          : 'bg-white/50 border border-slate-200/50'
      }`}>
        <div className={`mb-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
          {icon}
        </div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {description}
        </p>
      </div>
    </GlareHover>
  );
}
