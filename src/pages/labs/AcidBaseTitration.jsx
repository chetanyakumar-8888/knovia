import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AcidBaseTitration = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [burretteVolume, setBurretteVolume] = useState(0);
  const [acidConc, setAcidConc] = useState(0.1);
  const [acidVolume, setAcidVolume] = useState(25);
  const [indicator, setIndicator] = useState("phenolphthalein");

  const baseConc = (acidConc * acidVolume / Math.max(burretteVolume, 0.01)).toFixed(4);
  const pH = burretteVolume < acidVolume
    ? (1 - Math.log10(acidConc * (1 - burretteVolume / acidVolume) + 0.0001)).toFixed(2)
    : burretteVolume === acidVolume
    ? "7.00"
    : (14 + Math.log10(acidConc * (burretteVolume / acidVolume - 1) + 0.0001)).toFixed(2);

  const getFlaskColor = () => {
    const p = parseFloat(pH);
    if (indicator === "phenolphthalein") {
      if (p < 8.2) return "#f0f9ff";
      if (p < 10) return "#fda4af";
      return "#f43f5e";
    } else {
      if (p < 3.1) return "#ef4444";
      if (p < 4.4) return "#f97316";
      if (p < 6.0) return "#eab308";
      if (p < 7.6) return "#22c55e";
      if (p < 9.0) return "#3b82f6";
      return "#8b5cf6";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Draw burette
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(W / 2 - 15, 20, 30, 180);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 15, 20, 30, 180);

    // Burette liquid
    const liquidH = (1 - burretteVolume / 50) * 160;
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(W / 2 - 13, 22 + (160 - liquidH), 26, liquidH);

    // Burette markings
    for (let i = 0; i <= 5; i++) {
      const y = 22 + i * 32;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${i * 10}`, W / 2 - 18, y + 4);
    }

    // Flask liquid based on color
    ctx.beginPath();
    ctx.moveTo(W / 2 - 20, 250);
    ctx.lineTo(W / 2 - 50, 340);
    ctx.lineTo(W / 2 + 50, 340);
    ctx.lineTo(W / 2 + 20, 250);
    ctx.closePath();
    ctx.fillStyle = getFlaskColor();
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#7c3aed";
    ctx.stroke();

    // pH label in flask
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`pH: ${pH}`, W / 2, 310);

  }, [burretteVolume, indicator, pH]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-10">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md h-16 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 rounded-full bg-slate-900 border border-white/10 hover:bg-slate-800 transition-all">
            <span className="text-xl">←</span>
          </button>
          <h1 className="font-bold text-lg">Acid-Base Titration 🧪</h1>
        </div>
        <div className="hidden sm:block text-xs font-bold text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full bg-purple-500/10 uppercase tracking-widest">
          CBSE Class 11
        </div>
      </nav>

      {/* Responsive Grid System */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 grid gap-6 
        grid-cols-1 
        lg:grid-cols-[380px_1fr] 
        [grid-template-areas:'apparatus''controls''calc''cards''theory''points'] 
        lg:[grid-template-areas:'controls_apparatus''calc_apparatus''cards_cards''theory_points']">

        {/* 1. APPARATUS (Full width on Mobile, Right on Desktop) */}
        <div className="[grid-area:apparatus] bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden">
          <h2 className="text-slate-400 font-bold mb-4 self-start text-sm uppercase tracking-wider">Titration Apparatus</h2>
          <div className="relative w-full flex justify-center p-4">
             <canvas ref={canvasRef} width={400} height={380} className="max-w-full h-auto rounded-lg" />
          </div>
        </div>

        {/* 2. CONTROLS (Full width on Mobile, Sidebar Top on Desktop) */}
        <div className="[grid-area:controls] bg-slate-900/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-purple-400 mb-6 border-b border-white/5 pb-2">⚙️ Controls</h2>
          
          <div className="space-y-6">
            {/* Indicator Toggle */}
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase mb-3">Indicator</p>
              <div className="flex gap-2">
                {["phenolphthalein", "litmus"].map((ind) => (
                  <button key={ind} onClick={() => setIndicator(ind)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${indicator === ind ? "bg-purple-600 shadow-lg shadow-purple-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Base Added */}
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <label className="text-slate-400">Base Added</label>
                <span className="text-blue-400 font-bold">{burretteVolume} mL</span>
              </div>
              <input type="range" min="0" max="50" step="0.5" value={burretteVolume} onChange={(e) => setBurretteVolume(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>

            {/* Slider 2: Acid Conc */}
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <label className="text-slate-400">Acid Conc.</label>
                <span className="text-red-400 font-bold">{acidConc} M</span>
              </div>
              <input type="range" min="0.01" max="1" step="0.01" value={acidConc} onChange={(e) => setAcidConc(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
          </div>
        </div>

        {/* 3. CALCULATION (Full width on Mobile, Sidebar Bottom on Desktop) */}
        <div className="[grid-area:calc] bg-purple-950/20 border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Live Calculation (M₁V₁=M₂V₂)</p>
          <div className="text-3xl font-black text-white mb-1">
            {burretteVolume > 0 ? `${baseConc} M` : "—"}
          </div>
          <p className="text-xs text-slate-500 italic">Estimated Base Concentration</p>
        </div>

        {/* 4. DATA CARDS (2x2 Grid on Mobile, 1x4 Row on Desktop) */}
        <div className="[grid-area:cards] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="pH Level" value={pH} color="border-purple-500/20" text="text-purple-400" />
          <StatCard label="Base Added" value={burretteVolume} unit="mL" color="border-blue-500/20" text="text-blue-400" />
          <StatCard label="Acid Conc" value={acidConc} unit="M" color="border-red-500/20" text="text-red-400" />
          <StatCard label="Acid Vol" value={acidVolume} unit="mL" color="border-orange-500/20" text="text-orange-400" />
        </div>

        {/* 5. THEORY (Full width) */}
        <div className="[grid-area:theory] bg-slate-900/40 border border-white/5 rounded-3xl p-6">
          <h3 className="font-bold text-purple-400 mb-3 flex items-center gap-2">📖 Theory</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Titration is a volumetric analysis technique. The <strong>End Point</strong> is reached when the indicator permanently changes color, signifying that neutralization is complete.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-white/5 font-mono text-center text-sm text-purple-300">
            n₁M₁V₁ = n₂M₂V₂
          </div>
        </div>

        {/* 6. KEY POINTS (Full width) */}
        <div className="[grid-area:points] bg-slate-900/40 border border-white/5 rounded-3xl p-6">
          <h3 className="font-bold text-yellow-500 mb-3">💡 Key Points</h3>
          <ul className="space-y-3">
            {[
              "Phenolphthalein is pink in basic pH (>8.2).",
              "Litmus is blue in basic and red in acidic solutions.",
              "Read the lower meniscus of the burette for accuracy."
            ].map((p, i) => (
              <li key={i} className="text-sm text-slate-400 flex gap-2">
                <span className="text-yellow-500">•</span> {p}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

// Helper Card Component
const StatCard = ({ label, value, unit = "", color, text }) => (
  <div className={`bg-slate-900/60 border ${color} rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg`}>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">{label}</span>
    <div className={`text-2xl font-bold ${text}`}>{value}<span className="text-xs ml-0.5 opacity-50">{unit}</span></div>
  </div>
);

export default AcidBaseTitration;