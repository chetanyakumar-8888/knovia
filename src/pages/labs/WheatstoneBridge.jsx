import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WheatstoneBridge = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // State
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(15);
  const [r4, setR4] = useState(30);
  const [voltage, setVoltage] = useState(9);

  // Constants for Tailwind (Ensures classes aren't purged)
  const colorMap = {
    green: "text-emerald-400 bg-emerald-900/40 accent-emerald-500",
    blue: "text-blue-400 bg-blue-900/40 accent-blue-500",
    yellow: "text-amber-400 bg-amber-900/40 accent-amber-500",
    red: "text-rose-400 bg-rose-900/40 accent-rose-500",
    purple: "text-purple-400 bg-purple-900/40 accent-purple-500",
  };

  // Math Calculations
  const r4Balanced = (r2 * r3 / r1).toFixed(2);
  const vA = voltage * (r2 / (r1 + r2));
  const vB = voltage * (r4 / (r3 + r4));
  const vDiff = vA - vB;
  const isBalanced = Math.abs(vDiff) < 0.001;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;

    // Node positions (Diamond Layout)
    const top = { x: cx, y: 50 };
    const left = { x: cx - 140, y: cy };
    const right = { x: cx + 140, y: cy };
    const bottom = { x: cx, y: H - 50 };

    const drawResistor = (x1, y1, x2, y2, label, color) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const len = 40;

      // Draw Main Wires
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Resistor Body
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-len / 2, -10, len, 20);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(-len / 2, -10, len, 20);
      
      // Zig-zag pattern inside
      ctx.beginPath();
      ctx.moveTo(-len/2, 0);
      for(let i=0; i<4; i++) {
        ctx.lineTo(-len/2 + (i*10) + 5, (i%2 === 0 ? -5 : 5));
      }
      ctx.lineTo(len/2, 0);
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.restore();

      // Label with slight offset
      ctx.fillStyle = color;
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas";
      ctx.textAlign = "center";
      const labelOffset = 30;
      ctx.fillText(label, mx + Math.sin(angle) * labelOffset, my - Math.cos(angle) * labelOffset);
    };

    // 1. Draw Resistors
    drawResistor(top.x, top.y, left.x, left.y, `R1: ${r1}Ω`, "#34d399");
    drawResistor(top.x, top.y, right.x, right.y, `R2: ${r2}Ω`, "#60a5fa");
    drawResistor(left.x, left.y, bottom.x, bottom.y, `R3: ${r3}Ω`, "#fbbf24");
    drawResistor(right.x, right.y, bottom.x, bottom.y, `R4: ${r4}Ω`, "#f87171");

    // 2. Draw Galvanometer Arm
    const galColor = isBalanced ? "#34d399" : "#f43f5e";
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.strokeStyle = galColor;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Galvanometer Circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.strokeStyle = galColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Pointer
    ctx.save();
    ctx.translate(cx, cy);
    const rotation = Math.max(-Math.PI/3, Math.min(Math.PI/3, vDiff * 0.5));
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -15);
    ctx.strokeStyle = galColor;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = galColor;
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("G", cx, cy + 30);

    // 3. Power Supply & Ground
    ctx.strokeStyle = "#a78bfa";
    ctx.beginPath();
    ctx.moveTo(top.x, top.y); ctx.lineTo(top.x, top.y - 20);
    ctx.moveTo(bottom.x, bottom.y); ctx.lineTo(bottom.x, bottom.y + 20);
    ctx.stroke();

  }, [r1, r2, r3, r4, voltage, isBalanced, vDiff]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="hover:bg-slate-800 p-2 rounded-full transition-colors">←</button>
          <h1 className="text-2xl font-black tracking-tight">Wheatstone Bridge Lab</h1>
        </div>
        <div className="px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest">
          Circuit Simulator
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Component Parameters</h3>
            
            {[
              { label: "Resistor R1", value: r1, set: setR1, color: "green", unit: "Ω" },
              { label: "Resistor R2", value: r2, set: setR2, color: "blue", unit: "Ω" },
              { label: "Resistor R3", value: r3, set: setR3, color: "yellow", unit: "Ω" },
              { label: "Variable R4", value: r4, set: setR4, color: "red", unit: "Ω" },
              { label: "DC Voltage", value: voltage, set: setVoltage, color: "purple", unit: "V", max: 30 },
            ].map((item) => (
              <div key={item.label} className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-400">{item.label}</label>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${colorMap[item.color].split(' ')[0]} ${colorMap[item.color].split(' ')[1]}`}>
                    {item.value}{item.unit}
                  </span>
                </div>
                <input 
                  type="range" min="1" max={item.max || 100} value={item.value}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-800 ${colorMap[item.color].split(' ')[2]}`}
                />
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border transition-all duration-500 ${isBalanced ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-900 border-slate-800'}`}>
             <h4 className={`text-xs font-bold uppercase mb-2 ${isBalanced ? 'text-emerald-400' : 'text-slate-500'}`}>
               {isBalanced ? "● Bridge Balanced" : "○ Finding Null Point"}
             </h4>
             <p className="text-sm text-slate-400 leading-relaxed mb-4">
               To balance: Adjust <span className="text-rose-400">R4</span> until the galvanometer reads <span className="text-white font-mono">0.000V</span>.
             </p>
             <button
              onClick={() => setR4(Math.round(r4Balanced))}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              Auto-Align to Null Point
            </button>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={700} height={400} className="w-full h-auto rounded-2xl" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Galvanometer ΔV" value={vDiff.toFixed(3)} unit="V" status={isBalanced} />
            <StatCard label="Target R4" value={r4Balanced} unit="Ω" color="text-purple-400" />
            <StatCard label="R1 / R2 Ratio" value={(r1/r2).toFixed(2)} unit="" color="text-blue-400" />
            <StatCard label="R3 / R4 Ratio" value={(r3/r4).toFixed(2)} unit="" color="text-rose-400" />
          </div>
        </div>
      </div>

      {/* Theory Footer */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <h3 className="text-lg font-bold flex items-center gap-2">
             <span className="text-indigo-400">01.</span> The Null Condition
           </h3>
           <p className="text-slate-400 text-sm leading-relaxed">
             In a Wheatstone Bridge, the "null point" occurs when no current flows through the galvanometer ($I_g = 0$). This happens when the potential at point A equals the potential at point B.
           </p>
           

[Image of Wheatstone bridge circuit diagram]

        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Physics Checklist</h3>
           <ul className="space-y-3 text-sm text-slate-400">
             <li className="flex gap-3">
               <span className="text-indigo-500">✔</span>
               <span>Sensitivity is maximum when all four resistances are similar in magnitude.</span>
             </li>
             <li className="flex gap-3">
               <span className="text-indigo-500">✔</span>
               <span>The result is independent of the internal resistance of the galvanometer at balance.</span>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, unit, status, color = "text-white" }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-xl font-black ${status !== undefined ? (status ? 'text-emerald-400' : 'text-rose-400') : color}`}>
      {value}<span className="text-xs ml-1 opacity-50 font-normal">{unit}</span>
    </p>
  </div>
);

export default WheatstoneBridge;