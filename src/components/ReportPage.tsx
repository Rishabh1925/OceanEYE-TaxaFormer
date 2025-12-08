import { LineChart, BarChart3, PieChart, Download, Share2 } from 'lucide-react';

interface ReportPageProps {
  isDarkMode: boolean;
  onNavigate: (page: string) => void;
}

export default function ReportPage({ isDarkMode, onNavigate }: ReportPageProps) {
  const taxonomicData = [
    { phylum: 'Arthropoda', count: 324, percentage: 35 },
    { phylum: 'Mollusca', count: 256, percentage: 28 },
    { phylum: 'Cnidaria', count: 178, percentage: 19 },
    { phylum: 'Chordata', count: 142, percentage: 15 },
    { phylum: 'Others', count: 28, percentage: 3 },
  ];

  const monthlyData = [
    { month: 'Jan', samples: 45 },
    { month: 'Feb', samples: 52 },
    { month: 'Mar', samples: 61 },
    { month: 'Apr', samples: 58 },
    { month: 'May', samples: 73 },
    { month: 'Jun', samples: 82 },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-3xl md:text-4xl mb-2 font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Analysis Report
              </h1>
              <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Comprehensive taxonomic classification results
              </p>
            </div>
            <div className="flex gap-3">
              <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}>
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sequences', value: '928', change: '+12%', icon: BarChart3 },
            { label: 'Taxa Identified', value: '247', change: '+8%', icon: PieChart },
            { label: 'Confidence Avg', value: '94.3%', change: '+2.1%', icon: LineChart },
            { label: 'Novel Species', value: '18', change: 'New', icon: BarChart3 }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-6 ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={`w-8 h-8 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-500'
                }`} />
                <span className={`text-xs px-2 py-1 rounded ${
                  isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className={`text-2xl font-bold mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Taxonomic Distribution */}
          <div className={`rounded-xl p-6 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          } backdrop-blur-md`}>
            <h3 className={`text-lg mb-6 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Taxonomic Distribution
            </h3>
            <div className="space-y-4">
              {taxonomicData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                      {item.phylum}
                    </span>
                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-full ${
                        idx === 0
                          ? 'bg-cyan-500'
                          : idx === 1
                          ? 'bg-blue-500'
                          : idx === 2
                          ? 'bg-purple-500'
                          : idx === 3
                          ? 'bg-pink-500'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className={`rounded-xl p-6 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          } backdrop-blur-md`}>
            <h3 className={`text-lg mb-6 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Sample Processing Trends
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isDarkMode ? 'bg-cyan-500' : 'bg-blue-500'
                    }`}
                    style={{ height: `${(item.samples / 82) * 100}%` }}
                  />
                  <span className={`text-xs mt-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Results Table */}
        <div className={`rounded-xl p-6 ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
        } backdrop-blur-md`}>
          <h3 className={`text-lg mb-6 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Top Identified Taxa
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDarkMode ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <th className={`text-left py-3 px-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Taxon
                  </th>
                  <th className={`text-left py-3 px-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Phylum
                  </th>
                  <th className={`text-left py-3 px-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Sequences
                  </th>
                  <th className={`text-left py-3 px-4 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { taxon: 'Copepoda sp.', phylum: 'Arthropoda', sequences: 142, confidence: 97.2 },
                  { taxon: 'Gastropoda sp.', phylum: 'Mollusca', sequences: 128, confidence: 95.8 },
                  { taxon: 'Scyphozoa sp.', phylum: 'Cnidaria', sequences: 94, confidence: 93.4 },
                  { taxon: 'Osteichthyes sp.', phylum: 'Chordata', sequences: 87, confidence: 96.1 },
                  { taxon: 'Malacostraca sp.', phylum: 'Arthropoda', sequences: 76, confidence: 94.7 },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${
                      isDarkMode ? 'border-slate-700 hover:bg-slate-700/30' : 'border-slate-200 hover:bg-slate-100/50'
                    }`}
                  >
                    <td className={`py-3 px-4 font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {row.taxon}
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {row.phylum}
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {row.sequences}
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        row.confidence >= 95
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {row.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}