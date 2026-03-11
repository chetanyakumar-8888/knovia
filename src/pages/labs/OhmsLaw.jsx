import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OhmsLaw = () => {
  const navigate = useNavigate();
  
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(10);

  const current = voltage / resistance;
  const power = voltage * current;

  const baseSpeed = 3;
  const animationDuration = Math.max(0.5, baseSpeed / Math.max(0.1, current));

  const numParticles = 12;
  const particles = Array.from({ length: numParticles }).map((_, i) => ({
    id: i,
    delay: (animationDuration / numParticles) * i,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/lab')}
              className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors group">
              <ArrowLeftIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            <span className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Ohm's Law Simulator <span className="text-yellow-400">⚡</span>
            </span>
          </div>
          <div className="hidden sm:block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase">
            CBSE Class 12 Physics
          </div>
        </div>
      </nav>

      <div className="w-full px-4 sm:px-6 pt-6 max-w-[1600px] mx-auto">

        {/* MOBILE ORDER: Circuit → Controls → Calculation → Cards → Theory */}
        {/* DESKTOP ORDER: Left(Controls+Calc) | Right(Circuit) */}

        {/* Circuit Diagram — shows FIRST on mobile */}
        <div className="w-full bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl mb-6 lg:hidden">
          <h2 className="text-base font-bold text-slate-300 mb-3">Circuit Diagram</h2>
          <div className="relative w-full max-w-[340px] mx-auto">
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M 100,250 L 50,250 L 50,50 L 150,50" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 230,50 L 350,50 L 350,250 L 220,250" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 160,250 L 180,250" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(150, 50)">
                <path d="M 0,0 L 10,-15 L 25,15 L 40,-15 L 55,15 L 70,-15 L 80,0" stroke="#10b981" strokeWidth="4" fill="none" strokeLinejoin="round" filter="url(#glow)" />
                <text x="40" y="-25" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle" filter="url(#glow)">R = {resistance}Ω</text>
              </g>
              <g transform="translate(150, 50)">
                <path d="M 0,0 L 0,-40 L 30,-40" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                <path d="M 80,0 L 80,-40 L 50,-40" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                <circle cx="40" cy="-40" r="16" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="3" filter="url(#glow)" />
                <text x="40" y="-35" fill="#a78bfa" fontSize="14" fontWeight="bold" textAnchor="middle">V</text>
                <text x="40" y="-60" fill="#a78bfa" fontSize="12" fontWeight="bold" textAnchor="middle" filter="url(#glow)">{voltage.toFixed(1)}V</text>
              </g>
              <g transform="translate(100, 250)">
                <line x1="0" y1="-25" x2="0" y2="25" stroke="#c084fc" strokeWidth="4" filter="url(#glow)" />
                <text x="-15" y="-15" fill="#c084fc" fontSize="16" fontWeight="bold">+</text>
                <line x1="20" y1="-15" x2="20" y2="15" stroke="#94a3b8" strokeWidth="6" />
                <text x="35" y="-15" fill="#94a3b8" fontSize="16" fontWeight="bold">-</text>
                <line x1="20" y1="0" x2="40" y2="0" stroke="#334155" strokeWidth="4" />
                <line x1="40" y1="-25" x2="40" y2="25" stroke="#c084fc" strokeWidth="4" filter="url(#glow)" />
                <line x1="60" y1="-15" x2="60" y2="15" stroke="#94a3b8" strokeWidth="6" />
                <text x="30" y="45" fill="#c084fc" fontSize="14" fontWeight="bold" textAnchor="middle" filter="url(#glow)">{voltage}V Source</text>
              </g>
              <g transform="translate(200, 250)">
                <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#3b82f6" strokeWidth="4" filter="url(#glow)" />
                <text x="0" y="6" fill="#60a5fa" fontSize="18" fontWeight="bold" textAnchor="middle">A</text>
                <text x="0" y="-28" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle" filter="url(#glow)">{current.toFixed(2)}A</text>
              </g>
              <g>
                {particles.map((p) => (
                  <circle key={p.id} r="4" fill="#eab308" filter="url(#glow-heavy)" className="opacity-80">
                    <animateMotion dur={`${animationDuration}s`} repeatCount="indefinite" begin={`${p.delay}s`}
                      path="M 160,250 L 200,250 L 350,250 L 350,50 L 200,50 L 150,50 L 50,50 L 50,250 L 100,250" />
                  </circle>
                ))}
              </g>
            </svg>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-yellow-400 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Current Flow Indicator
          </div>
        </div>

        {/* Controls — mobile: below circuit, desktop: left side */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          
          <div className="w-full lg:w-1/4 space-y-6 flex-shrink-0">
            {/* Controls */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] pointer-events-none" />
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <SlidersIcon className="w-5 h-5 text-purple-400" />
                Controls
              </h2>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-300">Voltage (V)</label>
                  <span className="text-lg font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">{voltage} V</span>
                </div>
                <input type="range" min="1" max="12" step="0.5" value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium"><span>1V</span><span>12V</span></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-300">Resistance (R)</label>
                  <span className="text-lg font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">{resistance} Ω</span>
                </div>
                <input type="range" min="1" max="100" step="1" value={resistance}
                  onChange={(e) => setResistance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium"><span>1Ω</span><span>100Ω</span></div>
              </div>
            </div>

            {/* Live Calculation */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Live Calculation</h3>
              <div className="text-center py-4">
                <div className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
                  <span className="text-blue-400">I</span> =
                  <span className="text-purple-400 font-mono">{voltage}</span> /
                  <span className="text-emerald-400 font-mono">{resistance}</span>
                </div>
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  {current.toFixed(2)} A
                </div>
              </div>
            </div>
          </div>

          {/* Circuit — desktop only (hidden on mobile, shown above instead) */}
          <div className="hidden lg:flex w-full lg:w-3/4 bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex-col items-center justify-center min-h-[350px] relative overflow-hidden shadow-2xl flex-shrink-0">
            <h2 className="absolute top-6 left-6 text-lg font-bold text-slate-300 z-10">Circuit Diagram</h2>
            <div className="relative w-full max-w-[500px] aspect-video sm:aspect-square md:aspect-video lg:aspect-square xl:aspect-video flex items-center justify-center p-4">
              <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-heavy2" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path d="M 100,250 L 50,250 L 50,50 L 150,50" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 230,50 L 350,50 L 350,250 L 220,250" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 160,250 L 180,250" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <g transform="translate(150, 50)">
                  <path d="M 0,0 L 10,-15 L 25,15 L 40,-15 L 55,15 L 70,-15 L 80,0" stroke="#10b981" strokeWidth="4" fill="none" strokeLinejoin="round" filter="url(#glow2)" />
                  <text x="40" y="-25" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle">R = {resistance}Ω</text>
                </g>
                <g transform="translate(150, 50)">
                  <path d="M 0,0 L 0,-40 L 30,-40" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                  <path d="M 80,0 L 80,-40 L 50,-40" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                  <circle cx="40" cy="-40" r="16" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="3" filter="url(#glow2)" />
                  <text x="40" y="-35" fill="#a78bfa" fontSize="14" fontWeight="bold" textAnchor="middle">V</text>
                  <text x="40" y="-60" fill="#a78bfa" fontSize="12" fontWeight="bold" textAnchor="middle">{voltage.toFixed(1)}V</text>
                </g>
                <g transform="translate(100, 250)">
                  <line x1="0" y1="-25" x2="0" y2="25" stroke="#c084fc" strokeWidth="4" filter="url(#glow2)" />
                  <text x="-15" y="-15" fill="#c084fc" fontSize="16" fontWeight="bold">+</text>
                  <line x1="20" y1="-15" x2="20" y2="15" stroke="#94a3b8" strokeWidth="6" />
                  <text x="35" y="-15" fill="#94a3b8" fontSize="16" fontWeight="bold">-</text>
                  <line x1="20" y1="0" x2="40" y2="0" stroke="#334155" strokeWidth="4" />
                  <line x1="40" y1="-25" x2="40" y2="25" stroke="#c084fc" strokeWidth="4" filter="url(#glow2)" />
                  <line x1="60" y1="-15" x2="60" y2="15" stroke="#94a3b8" strokeWidth="6" />
                  <text x="30" y="45" fill="#c084fc" fontSize="14" fontWeight="bold" textAnchor="middle">{voltage}V Source</text>
                </g>
                <g transform="translate(200, 250)">
                  <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#3b82f6" strokeWidth="4" filter="url(#glow2)" />
                  <text x="0" y="6" fill="#60a5fa" fontSize="18" fontWeight="bold" textAnchor="middle">A</text>
                  <text x="0" y="-28" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">{current.toFixed(2)}A</text>
                </g>
                <g>
                  {particles.map((p) => (
                    <circle key={p.id} r="4" fill="#eab308" filter="url(#glow-heavy2)" className="opacity-80">
                      <animateMotion dur={`${animationDuration}s`} repeatCount="indefinite" begin={`${p.delay}s`}
                        path="M 160,250 L 200,250 L 350,250 L 350,50 L 200,50 L 150,50 L 50,50 L 50,250 L 100,250" />
                    </circle>
                  ))}
                </g>
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-yellow-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              Current Flow Indicator
            </div>
          </div>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-4 shadow-lg flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><BatteryIcon className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-slate-400">Voltage (V)</span>
            </div>
            <div className="text-2xl font-bold text-white">{voltage}<span className="text-sm text-purple-400 ml-1">V</span></div>
          </div>
          <div className="bg-slate-900/60 border border-blue-500/20 rounded-2xl p-4 shadow-lg flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><ActivityIcon className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-slate-400">Current (I)</span>
            </div>
            <div className="text-2xl font-bold text-white">{current.toFixed(2)}<span className="text-sm text-blue-400 ml-1">A</span></div>
          </div>
          <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-4 shadow-lg flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><MonitorSpeakerIcon className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-slate-400">Resistance (R)</span>
            </div>
            <div className="text-2xl font-bold text-white">{resistance}<span className="text-sm text-emerald-400 ml-1">Ω</span></div>
          </div>
          <div className="bg-slate-900/60 border border-orange-500/20 rounded-2xl p-4 shadow-lg flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400"><ZapIcon className="w-4 h-4" /></div>
              <span className="text-xs font-medium text-slate-400">Power (P=VI)</span>
            </div>
            <div className="text-2xl font-bold text-white">{power.toFixed(1)}<span className="text-sm text-orange-400 ml-1">W</span></div>
          </div>
        </div>

        {/* Theory + Key Points */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="w-full md:w-1/2 bg-slate-900/40 border border-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-indigo-400" />
              Theory for CBSE Exam
            </h3>
            <div className="text-slate-300 text-sm leading-relaxed space-y-4">
              <p><strong>Ohm's Law</strong> states that the current <span className="text-blue-400">I</span> through a conductor is directly proportional to the voltage <span className="text-purple-400">V</span> across it.</p>
              <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 my-4 font-mono text-center text-lg">
                <span className="text-purple-400">V</span> = <span className="text-blue-400">I</span> × <span className="text-emerald-400">R</span>
              </div>
              <p>The constant of proportionality, <span className="text-emerald-400">R</span>, is the resistance. Doubling the voltage doubles the current for a fixed resistance.</p>
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
                <p><strong>Ammeter</strong> is always connected in series to measure current.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">2</div>
                <p><strong>Voltmeter</strong> is always connected in parallel to measure potential difference.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">3</div>
                <p>Ohm's Law holds only if physical conditions like temperature remain constant.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-xs text-white">4</div>
                <p>Power dissipated: P = V × I = I²R.</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>);
const SlidersIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="21" y2="14"/><line x1="4" x2="20" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="4" x2="4" y1="21" y2="16"/><line x1="4" x2="4" y1="12" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="12" y2="12"/><line x1="18" x2="22" y1="16" y2="16"/></svg>);
const BatteryIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/><line x1="7" x2="7" y1="10.5" y2="13.5"/><line x1="5.5" x2="8.5" y1="12" y2="12"/></svg>);
const ActivityIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>);
const ZapIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const MonitorSpeakerIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5.5 20H8"/><path d="M17 9h.01"/><rect width="10" height="16" x="12" y="4" rx="2"/><path d="M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4"/><circle cx="17" cy="15" r="1"/></svg>);
const BookOpenIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>);
const LightbulbIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);

export default OhmsLaw;