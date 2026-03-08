import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSummary } from "../services/groq";
import { getSubjects, getChapters } from "../services/ncert";
import { saveNote } from "../services/supabase";

const Study = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const classes = ["6", "7", "8", "9", "10", "11", "12"];

  async function handleFetch() {
    if (!selectedClass || !selectedSubject || !selectedChapter) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const summary = await generateSummary(
        selectedClass,
        selectedSubject,
        selectedChapter
      );
      setResult(summary);
    } catch (err) {
      setError("Failed! Please try again.");
    }
    setLoading(false);
  }

  async function handleSaveNote() {
    const res = await saveNote(
      selectedChapter,
      selectedSubject,
      selectedClass,
      result
    );
    if (res) {
      alert("Notes saved to your profile! ✅");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <span className="text-lg font-semibold text-slate-200">Study Room</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-8">
        
        {/* Selection Area */}
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-400" />
            What are we studying today?
          </h1>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {/* Step 1: Class */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Step 1: Class</label>
              <div className="relative">
                <select 
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedSubject('');
                    setSelectedChapter('');
                    setResult(null);
                  }}
                  className="appearance-none w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Class</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Step 2: Subject</label>
              <div className="relative">
                <select 
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedChapter('');
                    setResult(null);
                  }}
                  disabled={!selectedClass}
                  className="appearance-none w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select Subject</option>
                  {(getSubjects(selectedClass) || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Step 3: Chapter */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Step 3: Chapter</label>
              <div className="relative">
                <select 
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(e.target.value);
                    setResult(null);
                  }}
                  disabled={!selectedSubject}
                  className="appearance-none w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select Chapter</option>
                  {(getChapters(selectedClass, selectedSubject) || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleFetch}
            disabled={!selectedClass || !selectedSubject || !selectedChapter || loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoaderIcon className="w-5 h-5 animate-spin" />
                <span>AI is analyzing NCERT...</span>
              </>
            ) : (
              <>
                <BookOpenIcon className="w-5 h-5" />
                <span>Fetch & Study</span>
              </>
            )}
          </button>
        </div>

        {/* Content Area */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 flex items-center justify-center font-medium animate-[fade-in_0.3s_ease-out]">
            {error}
          </div>
        )}

        {result && (
          <div className="animate-[fade-in_0.5s_ease-out]">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-purple-400 font-medium mb-2">
                <span>Class {selectedClass}</span>
                <span>•</span>
                <span>{selectedSubject}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100">{selectedChapter}</h2>
            </div>

            <div className="space-y-6">
              {/* AI Summary Card */}
              <div className="bg-slate-900/40 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    AI Generated
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
                  <BrainCircuitIcon className="w-5 h-5 text-purple-400" />
                  Quick Summary
                </h3>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-white/10">
                <button 
                  onClick={() => navigate('/quiz', { state: { selectedClass, selectedSubject, selectedChapter } })}
                  className="flex-1 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FileQuestionIcon className="w-5 h-5" />
                  Generate Quiz from Notes
                </button>
                <button 
                  onClick={handleSaveNote}
                  className="flex-1 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-white/10 flex items-center justify-center gap-2"
                >
                  <BookmarkIcon className="w-5 h-5" />
                  Save Notes to Profile
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const SparklesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const LoaderIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const BookOpenIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const BrainCircuitIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>
);
const ListIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
);
const BookTextIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
);
const FileQuestionIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="18" r="1"/><path d="M12 11c1.5 0 3 1 3 2.5 0 1.5-1.5 2-2.5 2.5"/></svg>
);
const BookmarkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
);

export default Study;
