import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimplePendulum = () => {
  const navigate = useNavigate();

  // State for controls
  const [length, setLength] = useState(1.0); // meters, 0.1 to 2.0
  const [gravity, setGravity] = useState({ name: 'Earth', value: 9.8 });

  const gravityOptions = [
    { name: 'Earth', value: 9.8 },
    { name: 'Moon', value: 1.62 },
    { name: 'Mars', value: 3.71 },
    { name: 'Jupiter', value: 24.79 }
  ];

  // Derived Values
  // T = 2π√(L/g)
  const period = 2 * Math.PI * Math.sqrt(length / gravity.value);
  const frequency = 1 / period;

  // Animation values
  // Max velocity at equilibrium for color mapping
  const maxVel = length * Math.sqrt(gravity.value / length) * (Math.PI / 6); // rough estimate for small angle
  
  // Dynamic bob color based on speed (frequency)
  // Higher frequency = hotter color
  const getBobColor = () => {
    if (frequency > 0.8) return '#ef4444'; // red-500
    if (frequency > 0.5) return '#f97316'; // orange-500
    if (frequency > 0.3) return '#eab308'; // yellow-500
    return '#3b82f6'; // blue-500
  };

  // String Length visualization mapping (mapping 0.1m - 2.0m to SVG coords)
  // Max SVG height for string is ~200
  const stringVisualLength = 50 + (length / 2.0) * 150;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 overflow-hidden pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/lab')}
              className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Simple Pendulum <span className="text-blue-400">🔵</span>
              </span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase">
            CBSE Class 11 Physics
          </div>
        </div>
      </nav>

      {/* Main Layout Bound */}
      <div className="w-full px-4 sm:px-6 pt-6 max-w-[1600px] mx-auto overflow-hidden">
        
        {/* SECTION 1 - Top area (flex row, full width) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6 animate-[fade-in_0.4s_ease-out] w-full">
          
          {/* Left box (30%): Controls + Calculation */}
          <div className="w-full lg:w-[30%] space-y-4 flex-shrink-0">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <SlidersIcon className="w-5 h-5 text-blue-400" />
                Controls
              </h2>

              {/* Length Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Length (L)</label>
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {length.toFixed(2)} m
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2.0" 
                  step="0.05"
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                  <span>0.1m</span>
                  <span>2.0m</span>
                </div>
              </div>

              {/* Gravity Selector */}
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">Gravity Environment (g)</label>
                <div className="grid grid-cols-2 gap-2">
                  {gravityOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setGravity(opt)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                        gravity.name === opt.name 
                          ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                          : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {opt.name} ({opt.value})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Formula Display */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Time Period</span>
                <span className="text-blue-400 text-xl">T = 2π√(L/g)</span>
              </h3>
              <div className="text-center py-4">
                <div className="text-3xl font-black text-white mb-1 tracking-tight">
                  <span className="text-blue-400">{period.toFixed(2)}</span>
                  <span className="text-lg text-slate-400 ml-1">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right box (70%): Circuit SVG */}
          <div className="w-full lg:w-[70%] bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden shadow-2xl flex-shrink-0">
            <h2 className="absolute top-4 left-6 text-lg font-bold text-slate-300 z-10 flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-slate-400" />
              Simulation View
            </h2>
            
            <div className="relative w-full h-full flex items-center justify-center py-8">
              
              {/* Added a custom style block for dynamic CSS keyframes since Tailwind config can't be edited inline easily */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes swing {
                  0% { transform: rotate(25deg); }
                  50% { transform: rotate(-25deg); }
                  100% { transform: rotate(25deg); }
                }
                .pendulum-swing {
                  transform-origin: top center;
                  animation: swing ${period}s ease-in-out infinite;
                }
              `}} />

              <svg 
                viewBox="0 0 400 300" 
                className="w-full max-w-[400px] h-full drop-shadow-2xl"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="glow-bob" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>

                {/* Ceiling Mount */}
                <rect x="150" y="20" width="100" height="10" fill="url(#metal)" rx="2" />
                <path d="M 120,20 L 280,20" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                <circle cx="200" cy="30" r="4" fill="#0f172a" />

                {/* Grid Lines for reference */}
                <path d="M 200,30 L 200,280" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" className="opacity-40" />
                
                {/* Animated Pendulum Group */}
                {/* Center point of rotation is cx=200, cy=30 */}
                <g className="pendulum-swing" style={{ transformOrigin: '200px 30px' }}>
                  
                  {/* String */}
                  <line 
                    x1="200" 
                    y1="30" 
                    x2="200" 
                    y2={30 + stringVisualLength} 
                    stroke="#cbd5e1" 
                    strokeWidth="2.5" 
                  />
                  
                  {/* Bob */}
                  <circle 
                    cx="200" 
                    cy={30 + stringVisualLength} 
                    r="16" 
                    fill={getBobColor()} 
                    filter="url(#glow-bob)"
                    className="transition-colors duration-500"
                  />
                  
                  {/* Bob Highlight for 3D effect */}
                  <circle 
                    cx="195" 
                    cy={25 + stringVisualLength} 
                    r="4" 
                    fill="#ffffff" 
                    className="opacity-40"
                  />
                </g>

                {/* Angle Arc Indicator */}
                <path d="M 200,80 A 50 50 0 0 1 220,84" stroke="#64748b" strokeWidth="1" fill="none" strokeDasharray="2,2"/>
                <text x="210" y="70" fill="#94a3b8" fontSize="10">θ</text>
              </svg>

            </div>

          </div>
        </div>

        {/* SECTION 2 - Data cards (below top area) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full animate-[fade-in_0.5s_ease-out]">
            
            {/* Length Card */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-4 shadow-lg group hover:border-emerald-500/40 transition-colors flex flex-col justify-center items-center">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                   <RulerIcon className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-slate-400">Length (L)</span>
               </div>
               <div className="text-2xl font-bold text-white tracking-tight">
                 {length.toFixed(2)}<span className="text-sm text-emerald-400 ml-1">m</span>
               </div>
            </div>

            {/* Period Card */}
            <div className="bg-slate-900/60 border border-blue-500/20 rounded-2xl p-4 shadow-lg group hover:border-blue-500/40 transition-colors flex flex-col justify-center items-center">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                   <ClockIcon className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-slate-400">Period (T)</span>
               </div>
               <div className="text-2xl font-bold text-white tracking-tight">
                 {period.toFixed(2)}<span className="text-sm text-blue-400 ml-1">s</span>
               </div>
            </div>

            {/* Frequency Card */}
            <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-4 shadow-lg group hover:border-purple-500/40 transition-colors flex flex-col justify-center items-center">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                   <ActivityLineIcon className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-slate-400">Frequency (f)</span>
               </div>
               <div className="text-2xl font-bold text-white tracking-tight">
                 {frequency.toFixed(2)}<span className="text-sm text-purple-400 ml-1">Hz</span>
               </div>
            </div>

            {/* Gravity Card */}
            <div className="bg-slate-900/60 border border-orange-500/20 rounded-2xl p-4 shadow-lg group hover:border-orange-500/40 transition-colors flex flex-col justify-center items-center">
               <div className="flex items-center gap-2 mb-1">
                 <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                   <GlobeIcon className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-slate-400">Gravity (g)</span>
               </div>
               <div className="text-2xl font-bold text-white tracking-tight">
                 {gravity.value}<span className="text-sm text-orange-400 ml-1">m/s²</span>
               </div>
            </div>
        </div>

        {/* SECTION 3 - Bottom (2 columns) */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 animate-[fade-in_0.6s_ease-out] w-full">
          
          <div className="w-full md:w-1/2 bg-slate-900/40 border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-indigo-400" />
              Theory for CBSE Exam
            </h3>
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <p>
                A <strong>Simple Pendulum</strong> consists of a mass (bob) suspended from a string of length <span className="text-emerald-400">L</span> that is considered massless and inextensible.
              </p>
              <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 my-4 font-mono text-center text-lg">
                <span className="text-blue-400">T</span> = 2π<span className="text-slate-500">√</span>(<span className="text-emerald-400">L</span> / <span className="text-orange-400">g</span>)
              </div>
              <p>
                For small angular displacements (θ {'<'} 15°), the restoring force is directly proportional to the displacement. Thus, its motion is approximately <strong>Simple Harmonic Motion (SHM)</strong>.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-slate-900/40 border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LightbulbIcon className="w-5 h-5 text-yellow-500" />
              Key Points to Remember
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">1</div>
                <p>The time period <strong>does NOT depend</strong> on the mass of the bob.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">2</div>
                <p>The time period is <strong>directly proportional</strong> to the square root of its length (<span className="text-emerald-400">√L</span>).</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">3</div>
                <p>The time period is <strong>inversely proportional</strong> to the square root of gravity (<span className="text-orange-400">1/√g</span>).</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">4</div>
                <p>If taken to the Moon, where gravity is lower, the pendulum will swing noticeably <strong>slower</strong>.</p>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

// SVG Icons
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const SlidersIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="21" y2="14"/><line x1="4" x2="20" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="4" x2="4" y1="21" y2="16"/><line x1="4" x2="4" y1="12" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="12" y2="12"/><line x1="18" x2="22" y1="16" y2="16"/></svg>);
const RulerIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.3 15.3l-8.4 8.4c-.8.8-2.1.8-2.8 0l-7.3-7.3c-.8-.8-.8-2.1 0-2.8l8.4-8.4c.8-.8 2.1-.8 2.8 0l7.3 7.3c.8.8.8 2.1 0 2.8z"/><path d="M12.5 10l-1.5 1.5"/><path d="M15 12.5l-1.5 1.5"/><path d="M17.5 15l-1.5 1.5"/></svg>);
const ClockIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const ActivityLineIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>);
const GlobeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const BookOpenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>);
const LightbulbIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const ActivityIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>);

export default SimplePendulum;
