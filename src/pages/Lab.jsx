import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Lab = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('12');
  const [activeSubject, setActiveSubject] = useState('All');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const experiments = [
    { id: '1', title: "Ohm's Law Circuit Simulator", subject: "Physics", desc: "Verify V=IR with an interactive circuit.", classLevel: '12', route: '/lab/ohms-law' },
    { id: '2', title: "Resistors in Series and Parallel", subject: "Physics", desc: "Calculate equivalent resistance.", classLevel: '12', route: '/lab/resistors-series' },
    { id: '3', title: "Projectile Motion Visualizer", subject: "Physics", desc: "Interactive trajectory analysis.", classLevel: '11', route: '/lab/projectile-motion' },
    { id: '4', title: "Simple Pendulum", subject: "Physics", desc: "Measure gravity via oscillation.", classLevel: '11', route: '/lab/simple-pendulum' },
    { id: '5', title: "Lens and Focal Length", subject: "Physics", desc: "Determine focal length of convex lens.", classLevel: '12', route: '/lab/lens-focal-length' },
    { id: '6', title: "Wheatstone Bridge", subject: "Physics", desc: "Find unknown resistance.", classLevel: '12', route: '/lab/wheatstone-bridge' },
    { id: '7', title: "Potentiometer", subject: "Physics", desc: "Compare EMF of two cells.", classLevel: '12', route: '/lab/potentiometer' },
    { id: '8', title: "Refraction through Prism", subject: "Physics", desc: "Plot angle of deviation.", classLevel: '11', route: '/lab/refraction-prism' },
    { id: '9', title: "Acid-Base Titration", subject: "Chemistry", desc: "Determine concentration via endpoint.", classLevel: '11', route: '/lab/acid-base-titration' },
    { id: '10', title: "Salt Analysis", subject: "Chemistry", desc: "Identify cations and anions.", classLevel: '12', route: '/lab/salt-analysis' },
    { id: '11', title: "Chromatography", subject: "Chemistry", desc: "Separate plant pigments.", classLevel: '11', route: '/lab/chromatography' },
    { id: '12', title: "Electrochemistry", subject: "Chemistry", desc: "Construct a galvanic cell.", classLevel: '12', route: '/lab/electrochemistry' },
    { id: '13', title: "pH Testing", subject: "Chemistry", desc: "Test pH of various solutions.", classLevel: '11', route: '/lab/ph-testing' },
    { id: '14', title: "Chemical Reactions", subject: "Chemistry", desc: "Observe different reaction types.", classLevel: '11', route: '/lab/chemical-reactions' },
    { id: '15', title: "Osmosis Experiment", subject: "Biology", desc: "Potato osmometer demonstration.", classLevel: '11', route: '/lab/osmosis' },
    { id: '16', title: "Photosynthesis Simulation", subject: "Biology", desc: "Effect of light intensity.", classLevel: '11', route: '/lab/photosynthesis' },
    { id: '17', title: "Cell Division Mitosis and Meiosis", subject: "Biology", desc: "Stages of Mitosis and Meiosis.", classLevel: '11', route: '/lab/cell-division' },
    { id: '18', title: "DNA Structure", subject: "Biology", desc: "Isolate DNA from plant material.", classLevel: '12', route: '/lab/dna-structure' }
  ];

  const filteredExperiments = experiments.filter(exp => {
    const classMatch = exp.classLevel === selectedClass;
    const subjectMatch = activeSubject === 'All' || exp.subject === activeSubject;
    return classMatch && subjectMatch;
  });

  const handleStartExperiment = (route) => navigate(route);

  const getSubjectColor = (subject) => {
    switch(subject) {
      case 'Physics': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Chemistry': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Biology': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getSubjectIcon = (subject) => {
    switch(subject) {
      case 'Physics': return <ZapIcon className="w-5 h-5" />;
      case 'Chemistry': return <FlaskConicalIcon className="w-5 h-5" />;
      case 'Biology': return <DnaIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30">
      
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group shrink-0">
            <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </button>
          <div onClick={() => navigate('/')}
            className="flex items-center gap-2 border-l border-white/10 pl-6 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Knovia</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20 relative">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Virtual Lab 🔬</h1>
            <p className="text-slate-400 text-lg">Explore {experiments.length} Interactive Practical Experiments</p>
          </div>
          <div className="flex p-1.5 bg-slate-900 border border-white/10 rounded-2xl shrink-0">
            <button onClick={() => setSelectedClass('11')}
              className={`px-8 py-3 rounded-xl font-bold transition-all text-sm ${selectedClass === '11' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
              Class 11
            </button>
            <button onClick={() => setSelectedClass('12')}
              className={`px-8 py-3 rounded-xl font-bold transition-all text-sm ${selectedClass === '12' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
              Class 12
            </button>
          </div>
        </div>

        {/* Subject Filter — FIXED for mobile scrolling */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-10 gap-4">
          <div
            style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="flex gap-2 bg-slate-900/50 p-1.5 rounded-full border border-white/5 w-full sm:w-auto">
            {['All', 'Physics', 'Chemistry', 'Biology'].map(sub => (
              <button key={sub} onClick={() => setActiveSubject(sub)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeSubject === sub
                  ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}>
                {sub === 'Physics' && <ZapIcon className="w-4 h-4 text-blue-400" />}
                {sub === 'Chemistry' && <FlaskConicalIcon className="w-4 h-4 text-emerald-400" />}
                {sub === 'Biology' && <DnaIcon className="w-4 h-4 text-pink-400" />}
                {sub}
              </button>
            ))}
          </div>
          <div className="text-slate-400 font-medium text-sm px-4 py-2 bg-slate-900/50 rounded-full border border-white/5 shrink-0 hidden sm:block">
            Showing {filteredExperiments.length} Practicals
          </div>
        </div>

        {/* Lab Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperiments.map(exp => (
            <div key={exp.id}
              className="group bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 hover:bg-slate-900/80 transition-all flex flex-col relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-10 rounded-full pointer-events-none transition-opacity group-hover:opacity-20 ${
                exp.subject === 'Physics' ? 'bg-blue-500' : exp.subject === 'Chemistry' ? 'bg-emerald-500' : 'bg-pink-500'
              }`} />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 group-hover:-rotate-3 ${getSubjectColor(exp.subject)}`}>
                  {getSubjectIcon(exp.subject)}
                </div>
                <span className="px-3 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-bold text-slate-300">
                  Class {exp.classLevel}
                </span>
              </div>
              <div className="flex gap-2 mb-3 relative z-10">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getSubjectColor(exp.subject)}`}>
                  {exp.subject}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-2 leading-snug relative z-10">{exp.title}</h2>
              <p className="text-sm text-slate-400 mb-8 flex-1 relative z-10 leading-relaxed">{exp.desc}</p>
              <button onClick={() => handleStartExperiment(exp.route)}
                className="w-full py-4 rounded-xl bg-slate-800 hover:bg-purple-600 border border-white/5 hover:border-purple-500 text-white font-semibold transition-all flex justify-center items-center gap-2 group-hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] relative z-10">
                Start Experiment
                <ArrowRightIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center border border-white/5 rounded-3xl bg-slate-900/30 mt-8">
            <FlaskConicalIcon className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No Practical Found</h3>
            <p className="text-slate-500">Try changing your filters to see more experiments.</p>
          </div>
        )}

        {showComingSoon && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-purple-500/50 shadow-[0_10px_40px_rgba(147,51,234,0.3)] rounded-full px-8 py-4 flex items-center gap-3 z-50">
            <WrenchIcon className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="font-semibold text-white">Coming Soon - Building Now!</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const ArrowRightIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const StarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const ZapIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const FlaskConicalIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>);
const DnaIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 15 10-10"/><path d="m9 18 10-10"/><path d="m14 2 10 10"/><path d="m9 2 10 10"/><path d="M3 3h4"/><path d="M3 21h4"/><path d="M17 3h4"/><path d="M17 21h4"/></svg>);
const WrenchIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>);

export default Lab;