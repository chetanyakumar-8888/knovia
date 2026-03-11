import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SOLUTIONS = [
  { name: "Battery Acid", ph: 0.5 },
  { name: "Gastric Acid", ph: 1.5 },
  { name: "Lemon Juice", ph: 2.4 },
  { name: "Vinegar", ph: 3.0 },
  { name: "Tomato Juice", ph: 4.2 },
  { name: "Coffee", ph: 5.0 },
  { name: "Milk", ph: 6.5 },
  { name: "Pure Water", ph: 7.0 },
  { name: "Blood", ph: 7.4 },
  { name: "Baking Soda", ph: 8.3 },
  { name: "Soap", ph: 9.5 },
  { name: "Milk of Magnesia", ph: 10.5 },
  { name: "Ammonia", ph: 11.5 },
  { name: "Bleach", ph: 12.5 },
  { name: "Drain Cleaner", ph: 14.0 },
];

const getPhColor = (ph) => {
  if (ph < 3) return "#ef4444"; // Red
  if (ph < 5) return "#f97316"; // Orange
  if (ph < 6.5) return "#eab308"; // Yellow
  if (ph < 7.5) return "#22c55e"; // Green
  if (ph < 9) return "#06b6d4"; // Cyan
  if (ph < 11) return "#3b82f6"; // Blue
  return "#7c3aed"; // Violet/Purple
};

const PhTesting = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [selectedSolution, setSelectedSolution] = useState(7);
  const [customPh, setCustomPh] = useState(7);
  const [mode, setMode] = useState("preset");

  const ph = mode === "preset" ? SOLUTIONS[selectedSolution].ph : customPh;
  const phColor = getPhColor(ph);
  const hConc = Math.pow(10, -ph).toExponential(2);
  const ohConc = Math.pow(10, -(14 - ph)).toExponential(2);

  // Tailwind Color Mapping for Stat Cards
  const colorMap = {
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    red: "text-rose-400 border-rose-500/20 bg-rose-500/5",
    green: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    yellow: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 1. Draw pH Scale Bar
    const barX = 50, barY = 40, barW = W - 100, barH = 30;
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, "#ef4444");
    grad.addColorStop(0.5, "#22c55e");
    grad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 15);
    ctx.fill();

    // Arrow indicator
    const arrowX = barX + (ph / 14) * barW;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(arrowX, barY + barH + 5);
    ctx.lineTo(arrowX - 8, barY + barH + 15);
    ctx.lineTo(arrowX + 8, barY + barH + 15);
    ctx.fill();

    // 2. Beaker Visualization
    const bx = W / 2, by = 140, bw = 100, bh = 130;
    
    // Liquid
    ctx.fillStyle = phColor;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.roundRect(bx - bw/2 + 5, by + 40, bw - 10, bh - 45, [0, 0, 15, 15]);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Beaker Glass
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx - bw/2, by);
    ctx.lineTo(bx - bw/2, by + bh - 10);
    ctx.arcTo(bx - bw/2, by + bh, bx + bw/2, by + bh, 15);
    ctx.lineTo(bx + bw/2, by + bh);
    ctx.lineTo(bx + bw/2, by);
    ctx.stroke();

    // pH Text in Beaker
    ctx.fillStyle = "white";
    ctx.font = "bold 32px Inter, monospace";
    ctx.textAlign = "center";
    ctx.fillText(ph, bx, by + 90);

  }, [ph, phColor]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-10">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-slate-900 rounded-full border border-white/10 hover:bg-slate-800 transition-colors">
            ←
          </button>
          <h1 className="font-bold text-lg">pH Lab: Acids & Bases 🧪</h1>
        </div>
        <div className="text-[10px] font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1 rounded-full tracking-widest uppercase">
          CBSE Class 10
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid gap-6 
        grid-cols-1 
        lg:grid-cols-[400px_1fr] 
        [grid-template-areas:'viz''controls''calc''cards''theory''points'] 
        lg:[grid-template-areas:'controls_viz''calc_viz''cards_cards''theory_points']">

        {/* 1. VISUALIZATION (Main area) */}
        <section className="[grid-area:viz] bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[420px] shadow-2xl">
          <span className="self-start text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Experimental Setup</span>
          <canvas ref={canvasRef} width={600} height={320} className="w-full h-auto max-w-[500px]" />
          <h3 className="mt-4 text-xl font-bold text-white">
            {mode === "preset" ? SOLUTIONS[selectedSolution].name : "Custom Solution"}
          </h3>
        </section>

        {/* 2. CONTROLS (Sidebar Top) */}
        <section className="[grid-area:controls] bg-slate-900/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-6">Mode Selection</h2>
          
          <div className="flex p-1 bg-slate-950 rounded-2xl border border-white/5 mb-6">
            {["preset", "custom"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${mode === m ? "bg-purple-600 shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                {m}
              </button>
            ))}
          </div>

          {mode === "preset" ? (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {SOLUTIONS.map((sol, i) => (
                <button key={i} onClick={() => setSelectedSolution(i)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all border ${selectedSolution === i ? "bg-purple-600/20 border-purple-500" : "bg-slate-800/40 border-transparent hover:border-white/10"}`}>
                  <span className="font-medium">{sol.name}</span>
                  <span className="font-bold text-xs px-2 py-0.5 rounded-lg bg-white/10">{sol.ph}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500 font-bold uppercase">Adjust pH</span>
                <span className="text-4xl font-black" style={{ color: phColor }}>{customPh}</span>
              </div>
              <input type="range" min="0" max="14" step="0.1" value={customPh}
                onChange={(e) => setCustomPh(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
          )}
        </section>

        {/* 3. QUICK CALC (Sidebar Bottom) */}
        <section className="[grid-area:calc] bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Ionic Product (Kw)</p>
          <div className="text-2xl font-mono font-bold text-white">10⁻¹⁴</div>
          <p className="text-[10px] text-slate-500 mt-2 italic">[H⁺] × [OH⁻] is always constant at 25°C</p>
        </section>

        {/* 4. DATA CARDS (2x2 Mobile / 1x4 Desktop) */}
        <section className="[grid-area:cards] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="pH Value" value={ph} theme={colorMap.purple} />
          <StatCard label="Nature" value={ph < 7 ? "Acidic" : ph === 7 ? "Neutral" : "Basic"} theme={ph < 7 ? colorMap.red : ph === 7 ? colorMap.green : colorMap.blue} />
          <StatCard label="[H⁺] Conc." value={hConc} unit="M" theme={colorMap.yellow} />
          <StatCard label="[OH⁻] Conc." value={ohConc} unit="M" theme={colorMap.green} />
        </section>

        {/* 5. THEORY */}
        <section className="[grid-area:theory] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">📖 The pH Scale</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            The pH of a solution is the negative logarithm of the hydrogen ion concentration. 
            A change of <strong>one pH unit</strong> represents a <strong>tenfold change</strong> in acidity. 
            For example, a solution with pH 3 is 10 times more acidic than one with pH 4.
          </p>
        </section>

        {/* 6. KEY POINTS */}
        <section className="[grid-area:points] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-amber-500 mb-4">💡 Exam Tips</h3>
          <ul className="text-sm text-slate-400 space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-amber-500 border border-amber-500/20">1</span>
              <span>Universal indicator gives a spectrum of colors for different pH values.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-amber-500 border border-amber-500/20">2</span>
              <span>Strong bases like NaOH have pH values approaching 14.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value, unit = "", theme }) => (
  <div className={`border rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] ${theme}`}>
    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-1">{label}</span>
    <div className="text-xl font-black">{value}<span className="text-xs ml-0.5 opacity-40">{unit}</span></div>
  </div>
);

export default PhTesting;