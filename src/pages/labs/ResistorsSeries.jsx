import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResistorsSeries = () => {
  const navigate = useNavigate();
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(30);
  const [mode, setMode] = useState("series");

  // Physics Logic
  const totalSeries = r1 + r2 + r3;
  const totalParallel = 1 / (1 / r1 + 1 / r2 + 1 / r3);
  const totalR = mode === "series" ? totalSeries : totalParallel;
  const totalCurrent = (voltage / totalR).toFixed(3);

  const i1 = mode === "series" ? totalCurrent : (voltage / r1).toFixed(3);
  const i2 = mode === "series" ? totalCurrent : (voltage / r2).toFixed(3);
  const i3 = mode === "series" ? totalCurrent : (voltage / r3).toFixed(3);

  const v1 = (i1 * r1).toFixed(2);
  const v2 = (i2 * r2).toFixed(2);
  const v3 = (i3 * r3).toFixed(2);

  // Tailwind Class Mapper (Fixes the purging issue)
  const colorMap = {
    green: { text: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800" },
    blue: { text: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-800" },
    red: { text: "text-red-400", bg: "bg-red-900/20", border: "border-red-800" },
    purple: { text: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-800" },
    yellow: { text: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-800" },
  };

  const CircuitDiagram = () => (
    <svg viewBox="0 0 600 300" className="w-full h-64 bg-gray-950 rounded-xl">
      {mode === "series" ? (
        <>
          {/* Main Loop */}
          <rect x="40" y="80" width="520" height="140" fill="none" stroke="#4c1d95" strokeWidth="2" />
          {/* Battery symbol */}
          <rect x="30" y="130" width="20" height="40" fill="#030712" />
          <line x1="30" y1="140" x2="50" y2="140" stroke="#f59e0b" strokeWidth="4" />
          <line x1="35" y1="155" x2="45" y2="155" stroke="#f59e0b" strokeWidth="2" />
          <text x="60" y="152" fill="#f59e0b" fontSize="14" fontWeight="bold">{voltage}V</text>

          {/* Resistors */}
          {[
            { x: 120, label: "R₁", val: r1, color: "#34d399", i: i1 },
            { x: 260, label: "R₂", val: r2, color: "#60a5fa", i: i2 },
            { x: 400, label: "R₃", val: r3, color: "#f87171", i: i3 }
          ].map((res) => (
            <g key={res.label}>
              <rect x={res.x} y="68" width="80" height="24" fill="#1e293b" stroke={res.color} strokeWidth="2" rx="4" />
              <text x={res.x + 40} y="84" fill={res.color} fontSize="11" textAnchor="middle" fontWeight="bold">{res.label}={res.val}Ω</text>
              <text x={res.x + 40} y="60" fill="#94a3b8" fontSize="10" textAnchor="middle">I={res.i}A</text>
            </g>
          ))}
        </>
      ) : (
        <>
          {/* Parallel Rails */}
          <line x1="100" y1="60" x2="500" y2="60" stroke="#4c1d95" strokeWidth="3" />
          <line x1="100" y1="240" x2="500" y2="240" stroke="#4c1d95" strokeWidth="3" />
          {/* Battery Connection */}
          <line x1="100" y1="60" x2="100" y2="240" stroke="#4c1d95" strokeWidth="2" />
          <line x1="40" y1="150" x2="100" y2="150" stroke="#4c1d95" strokeWidth="2" />
          <line x1="30" y1="140" x2="50" y2="140" stroke="#f59e0b" strokeWidth="4" />
          <line x1="35" y1="155" x2="45" y2="155" stroke="#f59e0b" strokeWidth="2" />
          <text x="35" y="130" fill="#f59e0b" fontSize="14" textAnchor="middle" fontWeight="bold">{voltage}V</text>

          {/* Branches */}
          {[
            { x: 200, label: "R₁", val: r1, color: "#34d399", i: i1 },
            { x: 300, label: "R₂", val: r2, color: "#60a5fa", i: i2 },
            { x: 400, label: "R₃", val: r3, color: "#f87171", i: i3 }
          ].map((res) => (
            <g key={res.label}>
              <line x1={res.x} y1="60" x2={res.x} y2="110" stroke="#4c1d95" strokeWidth="2" />
              <rect x={res.x - 40} y="110" width="80" height="24" fill="#1e293b" stroke={res.color} strokeWidth="2" rx="4" />
              <text x={res.x} y="126" fill={res.color} fontSize="11" textAnchor="middle" fontWeight="bold">{res.label}={res.val}Ω</text>
              <line x1={res.x} y1="134" x2={res.x} y2="240" stroke="#4c1d95" strokeWidth="2" />
              <text x={res.x + 5} y="90" fill="#94a3b8" fontSize="10" transform={`rotate(90, ${res.x}, 90)`}>I={res.i}A</text>
            </g>
          ))}
        </>
      )}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition-colors">←</button>
          <h1 className="text-2xl font-black tracking-tight">Circuit Lab ⚡</h1>
        </div>
        <div className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
          CBSE Class 10 Physics
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Simulation Setup</h2>
            
            <div className="flex p-1 bg-gray-950 rounded-xl mb-6 border border-gray-800">
              {["series", "parallel"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    mode === m ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" : "text-gray-500 hover:text-gray-300"
                  }`}
                >{m}</button>
              ))}
            </div>

            <div className="space-y-6">
              <ControlSlider label="Voltage" unit="V" val={voltage} min={1} max={24} color="amber" onChange={setVoltage} />
              <ControlSlider label="Resistor R₁" unit="Ω" val={r1} min={1} max={100} color="emerald" onChange={setR1} />
              <ControlSlider label="Resistor R₂" unit="Ω" val={r2} min={1} max={100} color="blue" onChange={setR2} />
              <ControlSlider label="Resistor R₃" unit="Ω" val={r3} min={1} max={100} color="red" onChange={setR3} />
            </div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Effective Resistance</h3>
            <div className="font-mono text-center">
              <p className="text-gray-500 text-xs mb-2">
                {mode === "series" ? "Rₛ = R₁ + R₂ + R₃" : "1/Rₚ = 1/R₁ + 1/R₂ + 1/R₃"}
              </p>
              <p className="text-2xl font-black text-white">{totalR.toFixed(2)} Ω</p>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-[32px] p-6">
            <CircuitDiagram />
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <DropCard label="V₁ Drop" val={v1} color="green" map={colorMap} />
              <DropCard label="V₂ Drop" val={v2} color="blue" map={colorMap} />
              <DropCard label="V₃ Drop" val={v3} color="red" map={colorMap} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total R" val={totalR.toFixed(2)} unit="Ω" color="purple" map={colorMap} />
            <StatCard label="Total I" val={totalCurrent} unit="A" color="blue" map={colorMap} />
            <StatCard label="Source V" val={voltage} unit="V" color="yellow" map={colorMap} />
            <StatCard label="Power Diss." val={(voltage * totalCurrent).toFixed(1)} unit="W" color="red" map={colorMap} />
          </div>
        </div>
      </div>

      {/* Theory Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-4">📖 CBSE Core Concept</h3>
          
          <p className="text-sm text-gray-400 leading-relaxed">
            In <strong>Series</strong>, current is like a single stream; it has no choice but to pass through every resistor. Thus, $I$ is constant. In <strong>Parallel</strong>, the current "splits" at junctions, but the potential difference ($V$) across each branch remains the same as the source.
          </p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-500 mb-4">💡 Exam Tips</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-amber-500 font-bold">1.</span> Parallel total resistance is <i>always</i> smaller than the smallest individual resistor.</li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">2.</span> If one component fails in series, the whole circuit breaks.</li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">3.</span> Domestic wiring is done in parallel to ensure independent operation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ControlSlider = ({ label, unit, val, min, max, color, onChange }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
      <span className={`text-sm font-mono font-bold text-${color}-400`}>{val}{unit}</span>
    </div>
    <input
      type="range" min={min} max={max} value={val}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
    />
  </div>
);

const DropCard = ({ label, val, color, map }) => (
  <div className={`${map[color].bg} ${map[color].border} border rounded-xl p-3`}>
    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{label}</p>
    <p className={`text-lg font-black ${map[color].text}`}>{val}V</p>
  </div>
);

const StatCard = ({ label, val, unit, color, map }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
    <p className="text-[10px] text-gray-500 uppercase font-black mb-2">{label}</p>
    <p className={`text-xl font-black ${map[color].text}`}>
      {val}<span className="text-xs ml-1 opacity-50">{unit}</span>
    </p>
  </div>
);

export default ResistorsSeries;