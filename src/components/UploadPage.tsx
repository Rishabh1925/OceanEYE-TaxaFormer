import { useState } from 'react';
import { Upload, FileText, Database, ChevronRight } from 'lucide-react';

interface UploadPageProps {
  isDarkMode: boolean;
  onNavigate: (page: string) => void;
}

export default function UploadPage({ isDarkMode, onNavigate }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleAnalyze = () => {
    if (uploadedFiles.length > 0) {
      onNavigate('output');
    } else {
      alert('Please upload at least one file first');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl mb-3 font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Upload Sequences
          </h1>
          <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Upload your eDNA sequence files for AI-powered taxonomic classification
          </p>
        </div>

        {/* Upload Area */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
              dragActive
                ? isDarkMode
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-blue-500 bg-blue-50'
                : isDarkMode
                ? 'border-slate-600 bg-slate-800/50'
                : 'border-slate-300 bg-white/50'
            } backdrop-blur-md`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-cyan-400' : 'text-blue-500'
              }`} />
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Drag & Drop Files
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                or click to browse
              </p>
              <input
                type="file"
                multiple
                accept=".fasta,.fa,.fna"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`inline-block px-6 py-3 rounded-lg cursor-pointer transition-all ${
                  isDarkMode
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Choose Files
              </label>
              <p className={`text-xs mt-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Supported formats: .fasta, .fa, .fna
              </p>
            </div>
          </div>

          {/* Info Panel */}
          <div className={`rounded-xl p-8 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          } backdrop-blur-md`}>
            <h3 className={`text-lg mb-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Upload Guidelines
            </h3>
            <ul className={`space-y-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <li className="flex items-start gap-2">
                <Database className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Upload FASTA formatted files containing DNA sequences</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Multiple files can be uploaded at once</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Sequences will be classified using Nucleotide Transformer AI</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Results will include taxonomic classification and confidence scores</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className={`rounded-xl p-6 mb-8 ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
          } backdrop-blur-md`}>
            <h3 className={`text-lg mb-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{file}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              className={`mt-6 w-full px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                isDarkMode
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Analyze Sequences
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Sample Data Section */}
        <div className={`rounded-xl p-6 ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
        } backdrop-blur-md`}>
          <h3 className={`text-lg mb-4 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Don't have data? Try our sample
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Load a sample dataset to explore Taxaformer's capabilities
          </p>
          <button
            onClick={() => {
              setUploadedFiles(['sample_data.fasta']);
            }}
            className={`px-6 py-3 rounded-lg border-2 transition-all ${
              isDarkMode
                ? 'border-slate-600 hover:border-cyan-400 bg-transparent hover:bg-cyan-500/10 text-slate-300 hover:text-white'
                : 'border-slate-300 hover:border-blue-500 bg-transparent hover:bg-blue-50 text-slate-700 hover:text-blue-700'
            }`}
          >
            Load Sample Data
          </button>
        </div>
      </div>
    </div>
  );
}