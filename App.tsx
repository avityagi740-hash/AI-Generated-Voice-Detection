
import React, { useState, useRef, useCallback } from 'react';
import { Language, AnalysisState } from './types';
import { analyzeVoiceSample } from './services/geminiService';
import LanguageToggle from './components/LanguageToggle';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.ENGLISH);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic check for audio files
      if (!selectedFile.type.startsWith('audio/')) {
        setAnalysis(prev => ({ ...prev, error: 'Please upload a valid audio file (MP3, WAV, etc.)' }));
        return;
      }
      setFile(selectedFile);
      setAnalysis(prev => ({ ...prev, error: null, result: null }));
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalysis({ isAnalyzing: true, result: null, error: null });

    try {
      const base64Audio = await toBase64(file);
      const result = await analyzeVoiceSample(base64Audio, file.type, selectedLanguage);
      setAnalysis({ isAnalyzing: false, result, error: null });
    } catch (err: any) {
      console.error(err);
      setAnalysis({
        isAnalyzing: false,
        result: null,
        error: err.message || 'An error occurred during analysis. Please check your file and try again.',
      });
    }
  };

  const reset = () => {
    setFile(null);
    setAnalysis({ isAnalyzing: false, result: null, error: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-600/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
            VoxVeritas
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Forensic-grade detection for AI-generated voice samples.
          </p>
        </header>

        <main className="space-y-8">
          <section className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 1: Select Language</h2>
            <LanguageToggle 
              selected={selectedLanguage} 
              onSelect={setSelectedLanguage} 
              disabled={analysis.isAnalyzing}
            />

            <h2 className="text-xl font-semibold mb-4 text-center mt-8">Step 2: Upload Audio Sample</h2>
            <div className="max-w-md mx-auto">
              <label 
                className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
                  file ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/20'
                } ${analysis.isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/*"
                  className="hidden" 
                  disabled={analysis.isAnalyzing}
                />
                
                {file ? (
                  <div className="text-center">
                    <div className="text-indigo-400 mb-2">
                      <svg className="w-10 h-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <p className="text-slate-200 font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                      onClick={(e) => { e.preventDefault(); reset(); }}
                      className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-700 transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-slate-300 font-medium">Click to upload audio</p>
                    <p className="text-slate-500 text-sm mt-1">Supports MP3, WAV, AAC, M4A</p>
                  </>
                )}
              </label>

              <button
                onClick={handleAnalyze}
                disabled={!file || analysis.isAnalyzing}
                className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] ${
                  file && !analysis.isAnalyzing
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {analysis.isAnalyzing ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Waveforms...
                  </div>
                ) : (
                  'Analyze Sample'
                )}
              </button>
            </div>
          </section>

          {analysis.error && (
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-2xl text-red-200 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {analysis.error}
            </div>
          )}

          {analysis.result && <ResultCard result={analysis.result} />}
        </main>

        <footer className="mt-20 text-center pb-12">
          <p className="text-slate-500 text-sm">
            Powered by Gemini Multi-Modal Intelligence
          </p>
          <div className="flex justify-center gap-4 mt-4 opacity-50">
             <span className="text-[10px] uppercase tracking-tighter text-slate-400">Forensics</span>
             <span className="text-[10px] uppercase tracking-tighter text-slate-400">Synthesis Check</span>
             <span className="text-[10px] uppercase tracking-tighter text-slate-400">Spectral Analysis</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
