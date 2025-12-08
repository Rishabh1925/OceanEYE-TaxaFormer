"use client"

import { useState } from 'react';
import { 
  ArrowLeft, Download, Search, Filter, Copy, ChevronDown, 
  FileText, AlertCircle, TrendingUp, Database, Layers, 
  Globe, Sparkles, X, ExternalLink, Check, Home
} from 'lucide-react';
import GlareHover from './GlareHover';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChartPieInteractive } from './charts/ChartPieInteractive';
import { ChartRadarDots } from './charts/ChartRadarDots';
import { ChartBarDefault } from './charts/ChartBarDefault';
import { ChartAreaGradient } from './charts/ChartAreaGradient';

interface OutputPageProps {
  isDarkMode: boolean;
  onNavigate: (page: string) => void;
}

// Mock data for the analysis results
const taxonomySummary = [
  { name: 'Alveolata', value: 142, color: '#22D3EE' },
  { name: 'Chlorophyta', value: 89, color: '#10B981' },
  { name: 'Fungi', value: 34, color: '#A78BFA' },
  { name: 'Metazoa', value: 67, color: '#F59E0B' },
  { name: 'Rhodophyta', value: 45, color: '#EC4899' },
  { name: 'Unknown', value: 23, color: '#64748B' }
];

const taxonomyTableData = [
  { accession: 'SEQ_001', taxonomy: 'Alveolata; Dinoflagellata; Gymnodiniales', length: 1842, confidence: 0.94, overlap: 87, cluster: 'C1' },
  { accession: 'SEQ_002', taxonomy: 'Chlorophyta; Chlorophyceae; Chlamydomonadales', length: 1654, confidence: 0.89, overlap: 92, cluster: 'C2' },
  { accession: 'SEQ_003', taxonomy: 'Metazoa; Arthropoda; Copepoda', length: 2103, confidence: 0.96, overlap: 94, cluster: 'C3' },
  { accession: 'SEQ_004', taxonomy: 'Unknown; Novel Cluster A', length: 1723, confidence: 0.42, overlap: 34, cluster: 'N1' },
  { accession: 'SEQ_005', taxonomy: 'Rhodophyta; Florideophyceae; Ceramiales', length: 1889, confidence: 0.91, overlap: 88, cluster: 'C4' },
  { accession: 'SEQ_006', taxonomy: 'Alveolata; Ciliophora; Spirotrichea', length: 1978, confidence: 0.93, overlap: 90, cluster: 'C1' },
  { accession: 'SEQ_007', taxonomy: 'Unknown; Novel Cluster B', length: 1567, confidence: 0.38, overlap: 29, cluster: 'N2' },
  { accession: 'SEQ_008', taxonomy: 'Fungi; Ascomycota; Eurotiomycetes', length: 1745, confidence: 0.88, overlap: 85, cluster: 'C5' },
];

const clusterData = [
  { x: 12.5, y: 8.3, z: 142, cluster: 'Alveolata', color: '#22D3EE' },
  { x: -8.2, y: 15.1, z: 89, cluster: 'Chlorophyta', color: '#10B981' },
  { x: 3.4, y: -12.7, z: 67, cluster: 'Metazoa', color: '#F59E0B' },
  { x: -15.8, y: -5.2, z: 45, cluster: 'Rhodophyta', color: '#EC4899' },
  { x: 18.3, y: 2.1, z: 34, cluster: 'Fungi', color: '#A78BFA' },
  { x: -2.1, y: -18.5, z: 23, cluster: 'Unknown', color: '#64748B' },
];

export default function OutputPage({ isDarkMode, onNavigate }: OutputPageProps) {
  const [selectedTab, setSelectedTab] = useState<'embedding' | 'clusters'>('embedding');
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopySequence = (seq: string) => {
    navigator.clipboard.writeText(seq);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const filteredTableData = taxonomyTableData.filter(row => 
    row.accession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.taxonomy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-3">
            <div>
              <h1 className={`text-3xl md:text-4xl mb-2 font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Analysis Complete
              </h1>
              <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Deep-sea eDNA classification results
              </p>
            </div>
            
            {/* Stats Inline */}
            <div className="flex flex-wrap gap-6 lg:gap-8">
              <div>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  Sample
                </div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  DeepSea_01
                </div>
              </div>
              <div>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  Sequences
                </div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  400
                </div>
              </div>
              <div>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  Time
                </div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  2.3s
                </div>
              </div>
              <div>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  Confidence
                </div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  89%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-1 gap-8 mb-8">
          
          {/* Taxonomy Summary Panel - Using New Chart Component */}
          <ChartPieInteractive
            data={taxonomySummary}
            title="Taxonomy Summary"
            description="Deep-sea eDNA classification distribution"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Secondary Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Novel Species Detection Panel */}
          <GlareHover
            glareColor={isDarkMode ? "#A78BFA" : "#8B5CF6"}
            glareOpacity={0.35}
            glareAngle={-35}
            glareSize={300}
            transitionDuration={750}
            playOnce={false}
            borderColor={isDarkMode ? '#6D28D9' : '#C4B5FD'}
            borderRadius="1rem"
          >
            <div className={`p-6 rounded-2xl backdrop-blur-md h-full ${
              isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-slate-800/50' : 'bg-gradient-to-br from-purple-100/50 to-white/50'
            } border-2 ${isDarkMode ? 'border-purple-500/30' : 'border-purple-300/50'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Novel Species Detected
                </h2>
              </div>

              <div className="text-center py-8">
                <div className={`text-6xl mb-4 font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  23
                </div>
                <p className={`text-sm mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Unassigned sequences found
                </p>
                
                <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-slate-800/60' : 'bg-purple-50/80'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    These sequences do not match PR2/SILVA references. Detected using transformer embeddings + clustering analysis.
                  </p>
                </div>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                } shadow-lg`}>
                  View Novel Clusters
                </button>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800/40' : 'bg-white/60'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Novelty Metrics
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Avg. Distance</p>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>0.67</p>
                  </div>
                  <div>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Clusters</p>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>5</p>
                  </div>
                </div>
              </div>
            </div>
          </GlareHover>

          {/* Biodiversity Metrics */}
          <GlareHover
            glareColor={isDarkMode ? "#10B981" : "#059669"}
            glareOpacity={0.3}
            glareAngle={-45}
            glareSize={280}
            transitionDuration={700}
            playOnce={false}
            borderColor={isDarkMode ? '#065F46' : '#6EE7B7'}
            borderRadius="1rem"
          >
            <div className={`p-6 rounded-2xl backdrop-blur-md h-full ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                  <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Diversity Metrics
                </h2>
              </div>

              <div className="space-y-6">
                <MetricCard 
                  isDarkMode={isDarkMode}
                  label="Species Richness"
                  value="377"
                  description="Total unique taxa identified"
                  icon={<Database className="w-4 h-4" />}
                />
                <MetricCard 
                  isDarkMode={isDarkMode}
                  label="Shannon Index"
                  value="3.42"
                  description="Diversity & evenness measure"
                  icon={<Layers className="w-4 h-4" />}
                />
                <MetricCard 
                  isDarkMode={isDarkMode}
                  label="Simpson Index"
                  value="0.89"
                  description="Probability of intraspecific encounter"
                  icon={<Globe className="w-4 h-4" />}
                />
                <MetricCard 
                  isDarkMode={isDarkMode}
                  label="Confidence Interval"
                  value="±4.2%"
                  description="95% CI for abundance estimates"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </div>
            </div>
          </GlareHover>
        </div>

        {/* Taxonomy Table Viewer */}
        <GlareHover
          glareColor={isDarkMode ? "#60A5FA" : "#3B82F6"}
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={350}
          transitionDuration={800}
          playOnce={false}
          borderColor={isDarkMode ? '#334155' : '#BFDBFE'}
          borderRadius="1rem"
        >
          <div className={`p-6 rounded-2xl backdrop-blur-md mb-8 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Taxonomy Results
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input 
                    type="text"
                    placeholder="Search sequences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700/60 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white/80 border-blue-200 text-slate-900 placeholder-slate-500'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  />
                </div>
                
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700/60 hover:bg-slate-600/60 text-white border border-slate-600' 
                    : 'bg-white/80 hover:bg-white text-slate-900 border border-blue-200'
                }`}>
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isDarkMode 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}>
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-blue-200'}`}>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Accession</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Predicted Taxonomy</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Length</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Confidence</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Overlap %</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Cluster</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableData.map((row, idx) => (
                    <tr 
                      key={row.accession}
                      className={`border-b transition-colors cursor-pointer ${
                        isDarkMode 
                          ? 'border-slate-700/50 hover:bg-slate-700/30' 
                          : 'border-blue-100 hover:bg-blue-50/50'
                      }`}
                      onClick={() => setSelectedSequence(row.accession)}
                    >
                      <td className={`px-4 py-3 text-sm font-mono ${
                        isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>{row.accession}</td>
                      <td className={`px-4 py-3 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{row.taxonomy}</td>
                      <td className={`px-4 py-3 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{row.length}</td>
                      <td className={`px-4 py-3 text-sm`}>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          row.confidence > 0.8 
                            ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                            : isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {(row.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{row.overlap}%</td>
                      <td className={`px-4 py-3 text-sm`}>
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          row.cluster.startsWith('N')
                            ? isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                            : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {row.cluster}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm`}>
                        <button className={`p-1 rounded hover:bg-opacity-80 ${
                          isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-blue-100'
                        }`}>
                          <ExternalLink className={`w-4 h-4 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          }`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlareHover>

        {/* Cluster Visualization Panel */}
        <GlareHover
          glareColor={isDarkMode ? "#60A5FA" : "#3B82F6"}
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={350}
          transitionDuration={800}
          playOnce={false}
          borderColor={isDarkMode ? '#334155' : '#BFDBFE'}
          borderRadius="1rem"
        >
          <div className={`p-6 rounded-2xl backdrop-blur-md mb-8 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Cluster Visualization
              </h2>
              
              <div className={`flex gap-2 p-1 rounded-lg ${
                isDarkMode ? 'bg-slate-700/60' : 'bg-white/60'
              }`}>
                <button 
                  onClick={() => setSelectedTab('embedding')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                    selectedTab === 'embedding'
                      ? isDarkMode 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-cyan-600 text-white'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Embedding Plot
                </button>
                <button 
                  onClick={() => setSelectedTab('clusters')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                    selectedTab === 'clusters'
                      ? isDarkMode 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-cyan-600 text-white'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cluster Details
                </button>
              </div>
            </div>

            {selectedTab === 'embedding' ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="UMAP-1"
                      stroke={isDarkMode ? '#94A3B8' : '#64748B'}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="UMAP-2"
                      stroke={isDarkMode ? '#94A3B8' : '#64748B'}
                    />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="Count" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Scatter name="Sequences" data={clusterData} fill="#8884d8">
                      {clusterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="space-y-4">
                {clusterData.slice(0, 4).map((cluster, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/40' : 'bg-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: cluster.color }}
                        ></div>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {cluster.cluster}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {cluster.z} sequences
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                          Dominant Lineage
                        </p>
                        <p className={`font-semibold mt-1 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {cluster.cluster}
                        </p>
                      </div>
                      <div>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                          Avg. Confidence
                        </p>
                        <p className={`font-semibold mt-1 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {(Math.random() * 0.3 + 0.7).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                          Novelty Score
                        </p>
                        <p className={`font-semibold mt-1 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {cluster.cluster === 'Unknown' ? '92%' : `${Math.floor(Math.random() * 30)}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlareHover>

        {/* Recommendations Panel */}
        <GlareHover
          glareColor={isDarkMode ? "#F59E0B" : "#D97706"}
          glareOpacity={0.3}
          glareAngle={-40}
          glareSize={300}
          transitionDuration={750}
          playOnce={false}
          borderColor={isDarkMode ? '#92400E' : '#FCD34D'}
          borderRadius="1rem"
        >
          <div className={`p-6 rounded-2xl backdrop-blur-md mb-8 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          }`}>
            <h2 className={`mb-6 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Insights & Recommendations
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <InsightCard
                isDarkMode={isDarkMode}
                icon={<Globe className="w-6 h-6" />}
                iconColor={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}
                iconBg={isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}
                title="High Diversity Zone"
                description="Shannon index of 3.42 suggests rich biodiversity. Consider increased sampling in this region."
              />
              <InsightCard
                isDarkMode={isDarkMode}
                icon={<Sparkles className="w-6 h-6" />}
                iconColor={isDarkMode ? 'text-purple-400' : 'text-purple-600'}
                iconBg={isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}
                title="Novel Taxa Detected"
                description="23 sequences show low similarity to references. Potential new species or deep-sea variants."
              />
              <InsightCard
                isDarkMode={isDarkMode}
                icon={<TrendingUp className="w-6 h-6" />}
                iconColor={isDarkMode ? 'text-green-400' : 'text-green-600'}
                iconBg={isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}
                title="Dominant Groups"
                description="Alveolata and Chlorophyta dominate. Typical of productive deep-sea upwelling zones."
              />
            </div>
          </div>
        </GlareHover>

        {/* Footer Credits */}
        <div className={`p-6 rounded-2xl backdrop-blur-md text-center ${
          isDarkMode ? 'bg-slate-800/30 border border-slate-700' : 'bg-white/30 border border-blue-200'
        }`}>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="font-semibold">CMLRE · Ministry of Earth Sciences</span>
            <br />
            Powered by AI-based Deep-Sea Biodiversity Analysis Pipeline
          </p>
        </div>
      </div>

      {/* Sequence Inspection Drawer */}
      {selectedSequence && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedSequence(null)}
          ></div>
          
          <div className={`relative w-full max-w-2xl h-full overflow-y-auto shadow-2xl ${
            isDarkMode ? 'bg-slate-900' : 'bg-white'
          }`}>
            <div className={`sticky top-0 z-10 p-6 border-b ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Sequence Details
                </h3>
                <button 
                  onClick={() => setSelectedSequence(null)}
                  className={`p-2 rounded-lg transition-all ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                      : 'hover:bg-blue-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`text-lg font-mono ${
                  isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  {selectedSequence}
                </span>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  94% Confidence
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Taxonomy Info */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Predicted Taxonomy
                </h4>
                <p className={isDarkMode ? 'text-white font-mono text-sm' : 'text-slate-900 font-mono text-sm'}>
                  Alveolata &gt; Dinoflagellata &gt; Gymnodiniales
                </p>
              </div>

              {/* Sequence Stats */}
              <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${
                isDarkMode ? 'bg-slate-800/60' : 'bg-blue-50/60'
              }`}>
                <div>
                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Sequence Length
                  </p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    1,842 bp
                  </p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    GC Content
                  </p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    47.3%
                  </p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Reference Overlap
                  </p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    87%
                  </p>
                </div>
                <div>
                  <p className={`text-xs mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Cluster ID
                  </p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    C1
                  </p>
                </div>
              </div>

              {/* Full Sequence */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-sm font-semibold ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Nucleotide Sequence
                  </h4>
                  <button 
                    onClick={() => handleCopySequence('ATCGATCGATCG...')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      copiedText
                        ? isDarkMode 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-green-100 text-green-700'
                        : isDarkMode 
                          ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                          : 'bg-blue-100 hover:bg-blue-200 text-slate-900'
                    }`}
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <div className={`p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto ${
                  isDarkMode ? 'bg-slate-800/80' : 'bg-slate-50'
                }`}>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                    ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
                    ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
                    GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA
                    ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
                    TTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAGCCTAG
                  </p>
                </div>
              </div>

              {/* Similarity Summary */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Reference Similarity
                </h4>
                <div className="space-y-3">
                  <SimilarityBar isDarkMode={isDarkMode} label="PR2 Database" percentage={87} />
                  <SimilarityBar isDarkMode={isDarkMode} label="SILVA rRNA" percentage={82} />
                  <SimilarityBar isDarkMode={isDarkMode} label="GenBank NT" percentage={79} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}>
                  <Download className="w-4 h-4 inline mr-2" />
                  Download FASTA
                </button>
                <button className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}>
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  View in NCBI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatBadge({ isDarkMode, label, value }: { isDarkMode: boolean; label: string; value: string }) {
  return (
    <div className={`px-4 py-2 rounded-lg ${
      isDarkMode ? 'bg-slate-700/60' : 'bg-white/80'
    }`}>
      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</p>
      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

function MetricCard({ 
  isDarkMode, 
  label, 
  value, 
  description, 
  icon 
}: { 
  isDarkMode: boolean; 
  label: string; 
  value: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/40' : 'bg-white/60'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-1.5 rounded ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</p>
          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        </div>
      </div>
      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
    </div>
  );
}

function InsightCard({ 
  isDarkMode, 
  icon, 
  iconColor, 
  iconBg, 
  title, 
  description 
}: { 
  isDarkMode: boolean; 
  icon: React.ReactNode; 
  iconColor: string; 
  iconBg: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-700/40' : 'bg-white/60'}`}>
      <div className={`p-3 rounded-lg inline-block mb-4 ${iconBg}`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <h3 className={`mb-2 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {description}
      </p>
    </div>
  );
}

function SimilarityBar({ isDarkMode, label, percentage }: { isDarkMode: boolean; label: string; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
        <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{percentage}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}