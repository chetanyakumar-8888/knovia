import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimplePendulum = () => {
  const navigate = useNavigate();

  // State for controls
  const [length, setLength] = useState(1.0); // meters
  const [gravity, setGravity] = useState({ name: 'Earth', value: 9.8 });

  const gravityOptions = [
    { name: 'Earth', value: 9.8 },
    { name: 'Moon', value: 1.62 },
    { name: 'Mars', value: 3.71 },
    { name: 'Jupiter', value: 24.79 }
  ];

  // Physics Calculations
  // Period T = 2π√(L/g)
  const period = 2 * Math.PI * Math.sqrt(length / gravity.value);
  const frequency = 1 / period;

  // Visual mapping: 0.1m - 2.0m maps to 40px - 180px in SVG
  const stringVisualLength = 40 + (length / 2.0) * 140;

  const getBobColor = () => {
    if (frequency > 0.6) return '#ef4444'; // High freq = Red
    if (frequency > 0.4) return '#f97316'; // Med = Orange
    return '#3b82f6'; // Low = Blue
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <style>
        {`
          @keyframes swing {
            0% { transform: rotate(20deg); }
            50% { transform: rotate(-20deg); }
            100% { transform: rotate(20deg); }
          }
          .animate-pendulum {
            transform-origin: 200px 30px;
            animation: swing var(--period) ease-in-out infinite;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/lab')}
              className="p-2 rounded-full bg-slate-900 border border-white/10 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Simple Pendulum Lab</h1>
          </div>
          <div className="text-xs font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
            SHM SIMULATOR
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
            <h2 className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider mb-6">
              <SlidersIcon className="w-4 h-4" /> Parameters
            </h2>

            <div className="space-y-8">
              {/* Length Control */}
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium">String Length (L)</span>
                  <span className="text-emerald-400 font-mono">{length.toFixed(2)}m</span>
                </div>
                <input 
                  type="range" min="0.1" max="2.0" step="0.05"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Gravity Environment */}
              <div>
                <span className="text-sm font-medium block mb-4">Gravity (g)</span>
                <div className="grid grid-cols-2 gap-2">
                  {gravityOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setGravity(opt)}
                      className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                        gravity.name === opt.name 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                        : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Calculated Period</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{period.toFixed(3)}</span>
              <span className="text-lg font-medium opacity-80">seconds</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs font-mono opacity-80 text-center">
              T = 2π √({length} / {gravity.value})
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-white/5 rounded-3xl relative min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Live Simulation</span>
          </div>

          <svg 
            viewBox="0 0 400 300" 
            className="w-full max-w-lg h-auto"
            style={{ '--period': `${period}s` }}
          >
            {/* Ceiling */}
            <line x1="140" y1="30" x2="260" y2="30" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            
            {/* Equilibrium Line */}
            <line x1="200" y1="30" x2="200" y2="280" stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />

            {/* Pendulum Group */}
            <g className="animate-pendulum">
              <line 
                x1="200" y1="30" 
                x2="200" y2={30 + stringVisualLength} 
                stroke="#94a3b8" strokeWidth="2" 
              />
              <circle 
                cx="200" cy={30 + stringVisualLength} 
                r="14" 
                fill={getBobColor()} 
                className="transition-colors duration-700"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}
              />
              {/* Shine */}
              <circle cx="196" cy={26 + stringVisualLength} r="3" fill="white" fillOpacity="0.3" />
            </g>
          </svg>
        </div>
      </main>

      {/* Theory Footer */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 pb-20">
        <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-blue-400" /> Theory Basics
          </h3>
          
          <p className="text-sm text-slate-400 leading-relaxed">
            In a simple pendulum, the restoring force is $F = -mg \sin\theta$. For small angles, $\sin\theta \approx \theta$, leading to the SHM equation. The period is independent of amplitude and mass, a property known as <strong>isochronism</strong>.
          </p>
        </div>
        <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <LightbulbIcon className="w-5 h-5 text-yellow-500" /> Exam Checklist
          </h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex gap-2"><span>•</span> <span><strong>Seconds Pendulum:</strong> A pendulum with a period of exactly 2 seconds ($L \approx 0.994m$ on Earth).</span></li>
            <li className="flex gap-2"><span>•</span> <span><strong>Length Measurement:</strong> Measured from the point of suspension to the center of gravity of the bob.</span></li>
            <li className="flex gap-2"><span>•</span> <span><strong>Graphing:</strong> A plot of $T^2$ vs $L$ is always a straight line passing through the origin.</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
};

// Simplified Icons for the fix
const ArrowLeftIcon = ({ className }) => (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>);
const SlidersIcon = ({ className }) => (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>);
const BookOpenIcon = ({ className }) => (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const LightbulbIcon = ({ className }) => (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.996-1.09L14.535 9a4 4 0 00-7.07 0l-.798 6.91a1 1 0 00.996 1.09h4.674m0 0v1a3 3 0 01-3 3h6a3 3 0 01-3-3v-1" /></svg>);

export default SimplePendulum;