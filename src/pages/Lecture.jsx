import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Lecture = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload'); // 'upload', 'processing', 'results'
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Processing steps state
  const [currentProcessStep, setCurrentProcessStep] = useState(0);
  const processSteps = [
    "Uploading file...",
    "Extracting audio...",
    "Transcribing speech to text...",
    "Analyzing context & semantics...",
    "Generating structured notes...",
    "Finalizing syllabus alignment..."
  ];

  // Mock processing animation
  useEffect(() => {
    let interval;
    if (step === 'processing') {
      setCurrentProcessStep(0);
      interval = setInterval(() => {
        setCurrentProcessStep(prev => {
          if (prev >= processSteps.length) {
            clearInterval(interval);
            setTimeout(() => setStep('results'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // 1 second per step simulated
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setStep('processing');
    }
  };
  
  const handleUrlSubmit = () => {
    if (youtubeUrl.trim() !== '') {
      setStep('processing');
    }
  };

  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">
      
      {/* Navbar Option 2 (with Knovia Logo as per updated specs) */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group shrink-0"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
          
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 border-l border-white/10 pl-6 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Knovia
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center animate-[fade-in_0.3s_ease-out]">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            Lecture Processor 🎙️
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your teacher's recording or paste a YouTube link. We'll generate perfect notes, summaries, and quizzes instantly.
          </p>
        </div>

        {/* --- STATE 1: UPLOAD SCREEN --- */}
        {step === 'upload' && (
          <div className="animate-[fade-in_0.4s_ease-out]">
            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative overflow-hidden group ${
                isDragging 
                  ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' 
                  : 'border-white/10 bg-slate-900/50 hover:border-purple-500/50 hover:bg-slate-900/80'
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05)_0%,transparent_70%)] pointer-events-none" />
              
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500 ${isDragging ? 'bg-purple-500/20 scale-110' : 'bg-slate-800/80 group-hover:-translate-y-2'}`}>
                <CloudUploadIcon className={`w-10 h-10 ${isDragging ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'} transition-colors duration-300`} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-200 mb-2">
                {isDragging ? 'Drop it here!' : 'Drag & drop lecture file'}
              </h3>
              <p className="text-slate-400 mb-8">
                Supported formats: MP3, MP4, WAV, M4A (Max 500MB)
              </p>
              
              <button 
                onClick={() => setStep('processing')}
                className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors"
              >
                Browse Files
              </button>
            </div>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">OR</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* YouTube Link Area */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <YoutubeIcon className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-bold text-slate-200">Process from YouTube</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input 
                    type="url" 
                    placeholder="Paste YouTube lecture link here..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-white pl-12 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                  />
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  
                  <button 
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        setYoutubeUrl(text);
                      } catch (err) {
                        console.error('Failed to read clipboard contents: ', err);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Paste
                  </button>
                </div>
                <button 
                  onClick={handleUrlSubmit}
                  disabled={!youtubeUrl}
                  className="sm:w-40 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-5 h-5" />
                  Process
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE 2: PROCESSING SCREEN --- */}
        {step === 'processing' && (
          <div className="min-h-[400px] flex flex-col items-center justify-center animate-[fade-in_0.3s_ease-out]">
            
            <div className="relative w-32 h-32 mb-10">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-[spin_1.5s_linear_infinite]" />
              {/* Inner spinning ring */}
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-indigo-400 animate-[spin_1s_ease-in-out_infinite_reverse]" />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuitIcon className="w-10 h-10 text-purple-400 animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-8">
              Knovia AI Processing...
            </h2>

            <div className="w-full max-w-sm space-y-4">
              {processSteps.map((s, idx) => {
                const isComplete = currentProcessStep > idx;
                const isCurrent = currentProcessStep === idx;
                const isPending = currentProcessStep < idx;

                return (
                  <div key={idx} className={`flex items-center gap-4 transition-all duration-300 ${isCurrent ? 'scale-105 ml-2' : ''} ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      isComplete 
                        ? 'bg-emerald-500/20 border-emerald-500/50' 
                        : isCurrent 
                          ? 'bg-purple-500/20 border-purple-500/50' 
                          : 'bg-slate-800 border-slate-700'
                    }`}>
                      {isComplete ? (
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      ) : null}
                    </div>
                    <span className={`font-medium ${isComplete ? 'text-slate-300' : isCurrent ? 'text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-slate-500'}`}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* --- STATE 3: RESULTS SCREEN --- */}
        {step === 'results' && (
          <div className="animate-[fade-in-up_0.5s_ease-out]">
            
            {/* Auto-detected header */}
            <div className="flex items-start justify-between gap-4 mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.2),transparent_70%)] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-purple-300 font-medium mb-3">
                  <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">Auto-Detected</span>
                  <span>•</span>
                  <span>Class 11 Physics</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-100 mb-2">Laws of Motion & Inertia</h2>
                <p className="text-slate-400 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" /> 45 mins lecture processed in 12 seconds
                </p>
              </div>

              <div className="hidden sm:flex w-16 h-16 rounded-full bg-slate-900/50 border border-white/10 items-center justify-center shrink-0 relative z-10 shadow-lg">
                <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            {/* Content Tabs / Structure */}
            <div className="space-y-6">

              {/* AI Structured Notes */}
              <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                    <BookTextIcon className="w-6 h-6 text-purple-400" />
                    Structured Notes
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wide">
                    Ready to study
                  </div>
                </div>
                
                <div className="prose prose-invert prose-purple max-w-none">
                  <h4 className="text-lg font-semibold text-slate-200 mt-4 mb-2">1. Introduction to Force</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Force is an external effort in the form of push or pull which changes or tends to change the state of rest or of uniform motion of a body along a straight line.
                  </p>

                  <h4 className="text-lg font-semibold text-slate-200 mt-6 mb-2">2. Aristotle's Fallacy</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    According to Aristotle, an external force is required to keep a body in motion. This was proved wrong by Galileo because forces like friction always oppose motion in the real world.
                  </p>

                  <h4 className="text-lg font-semibold text-slate-200 mt-6 mb-2">3. Key Points to Remember</h4>
                  <ul className="space-y-2 text-sm text-slate-300 ml-4 list-disc marker:text-purple-500">
                    <li className="pl-1">Inertia is the inherent property of a body to resist change in its state.</li>
                    <li className="pl-1">Mass is a measure of inertia. Greater the mass, greater the inertia.</li>
                    <li className="pl-1">Newton's First Law is also known as the Law of Inertia.</li>
                  </ul>
                </div>
              </div>

              {/* Important Terms highlighting */}
              <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-pink-400" />
                  Key Terminology Isolated
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-white/5 border-l-2 border-l-pink-500">
                    <span className="font-bold text-pink-400 mb-1">Inertia of Rest</span>
                    <span className="text-sm text-slate-400">Tendency to stay at rest until acted upon.</span>
                  </div>
                  <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-white/5 border-l-2 border-l-pink-500">
                    <span className="font-bold text-pink-400 mb-1">Inertia of Motion</span>
                    <span className="text-sm text-slate-400">Tendency to continue moving uniformly.</span>
                  </div>
                  <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-white/5 border-l-2 border-l-pink-500">
                    <span className="font-bold text-pink-400 mb-1">Inertia of Direction</span>
                    <span className="text-sm text-slate-400">Tendency to continue moving in same direction.</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Transcript */}
              <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full flex items-center justify-between p-6 bg-transparent hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileAudioIcon className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-200">View Full Raw Transcript</span>
                  </div>
                  <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showTranscript ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`transition-all duration-500 ease-in-out ${showTranscript ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-6 pt-0 border-t border-white/5">
                    <div className="h-48 overflow-y-auto pr-4 custom-scrollbar text-sm text-slate-400 leading-relaxed space-y-4">
                      <p>[00:00] Alright class, today we're going to dive into the core concepts of mechanics, specifically looking at forces and inertia. Now, if you look at historical perspectives...</p>
                      <p>[02:15] Aristotle actually thought that you needed continuous force to keep something moving. But Galileo later proved through his inclined plane experiments that this was completely false...</p>
                      <p>[05:30] This brings us to inertia. Inertia is basically laziness. It's the property by which a body resists any change to its current state. If it's resting it wants to rest, if it's moving, well, it wants to keep moving...</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Final Action Buttons */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8 pb-10">
              <button className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10 group">
                <BookmarkIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                Save Notes
              </button>
              <button className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10 group">
                <DownloadIcon className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
                Download PDF
              </button>
              <button 
                onClick={() => navigate('/quiz')}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transform hover:-translate-y-1"
              >
                <FileQuestionIcon className="w-5 h-5" />
                Generate Quiz
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

// Icons
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const StarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const CloudUploadIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>);
const YoutubeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>);
const LinkIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const SparklesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>);
const BrainCircuitIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>);
const CheckIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>);
const CheckCircleIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>);
const ClockIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const BookTextIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>);
const FileAudioIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.5 22h.5c.5 0 1-.5 1-1v-2a1 1 0 0 0-1-1h-.5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M14.5 12h.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4.5"/><path d="M21 17.5a4 4 0 0 1-8 0v-4a4 4 0 0 1 8 0Z"/><path d="M21 7.5V14"/></svg>);
const ChevronDownIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>);
const BookmarkIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>);
const FileQuestionIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="18" r="1"/><path d="M12 11c1.5 0 3 1 3 2.5 0 1.5-1.5 2-2.5 2.5"/></svg>);
const DownloadIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);

export default Lecture;
