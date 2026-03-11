import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Osmosis = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [soluteConc, setSoluteConc] = useState(50);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const leftConc = 20;
  const rightConc = soluteConc;
  const gradient = rightConc - leftConc;
  const waterMovement = gradient > 0 ? "Left → Right" : gradient < 0 ? "Right → Left" : "Equilibrium";
  const osmosisType = rightConc > leftConc ? "Hypertonic (Right)" : rightConc < leftConc ? "Hypotonic (Right)" : "Isotonic";

  // Tailwind Color Mapping
  const colorMap = {
    green: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    red: "text-rose-400 border-rose-500/20 bg-rose-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    blue: "text-sky-400 border-sky-500/20 bg-sky-500/5",
  };

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((t) => {
          if (t >= 100) { setRunning(false); return 100; }
          return t + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const progress = time / 100;
    const waterShift = gradient > 0
      ? Math.min(progress * gradient * 0.6, 60)
      : Math.max(progress * gradient * 0.6, -60);

    // 1. Draw Chambers
    const drawChamber = (x, y, w, h, level, conc, color) => {
      // Water
      ctx.fillStyle = `rgba(56, 189, 248, 0.2)`;
      ctx.fillRect(x, H - level, w, level);
      
      // Top line (surface)
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, H - level);
      ctx.lineTo(x + w, H - level);
      ctx.stroke();

      // Glass Border
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, 40, w, H - 60);
    };

    drawChamber(50, 40, W / 2 - 70, H - 60, H * 0.5 + waterShift, leftConc);
    drawChamber(W / 2 + 20, 40, W / 2 - 70, H - 60, H * 0.5 - waterShift, rightConc);

    // 2. Semi-permeable Membrane
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(W / 2 - 5, 40);
    ctx.lineTo(W / 2 - 5, H - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Particles
    const drawParticles = (count, startX, rangeW, color) => {
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const px = startX + 15 + (i % 5) * 30;
        const py = H - 30 - Math.floor(i / 5) * 30;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawParticles(8, 50, W / 2 - 70, "#34d399"); // Left
    drawParticles(Math.floor(rightConc / 4), W / 2 + 20, W / 2 - 70, "#fb7185"); // Right

    // 4. Directional Arrow
    if (running && gradient !== 0) {
      const dir = gradient > 0 ? 1 : -1;
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px Inter";
      ctx.textAlign = "center";
      ctx.fillText(dir > 0 ? "→" : "←", W / 2 - 5, H / 2);
    }

  }, [time, soluteConc, gradient, running]);

  const handleReset = () => {
    setTime(0);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-10">
      {/* Header */}
      <nav className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-slate-900 rounded-full border border-white/10 hover:bg-slate-800 transition-colors">←</button>
          <h1 className="font-bold text-lg tracking-tight">Osmosis Simulator 🌱</h1>
        </div>
        <div className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full tracking-widest uppercase">CBSE Class 9</div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid gap-6 
        grid-cols-1 
        lg:grid-cols-[380px_1fr] 
        [grid-template-areas:'anim''controls''info''cards''theory''points'] 
        lg:[grid-template-areas:'controls_anim''info_anim''cards_cards''theory_points']">

        {/* Animation Display */}
        <section className="[grid-area:anim] bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col min-h-[420px] shadow-2xl overflow-hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Real-time Diffusion Chamber</span>
          <canvas ref={canvasRef} width={600} height={320} className="w-full h-auto bg-black/20 rounded-2xl" />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase">
            <span>Solution A (20%)</span>
            <span className="text-amber-500">Semi-Permeable Membrane</span>
            <span>Solution B ({soluteConc}%)</span>
          </div>
        </section>

        {/* Controls */}
        <section className="[grid-area:controls] bg-slate-900/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-6">Variables</h2>
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Solute B Conc.</span>
                <span className="text-sm font-mono font-bold text-rose-400">{soluteConc}%</span>
              </div>
              <input type="range" min="0" max="100" value={soluteConc} 
                onChange={(e) => { setSoluteConc(Number(e.target.value)); handleReset(); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setRunning(!running)}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all ${running ? 'bg-rose-600' : 'bg-purple-600'}`}>
                {running ? "⏸ Pause" : "▶ Start Simulation"}
              </button>
              <button onClick={handleReset} className="px-6 rounded-2xl bg-slate-800 font-bold hover:bg-slate-700">↺</button>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="[grid-area:info] bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Biological Classification</p>
          <div className="text-xl font-bold text-white mb-2">{osmosisType}</div>
          <p className="text-xs text-slate-400 leading-relaxed">Water moves: <span className="text-sky-400 font-bold">{waterMovement}</span></p>
          <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${time}%` }} />
          </div>
        </section>

        {/* Data Cards */}
        <section className="[grid-area:cards] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Solution A" value="20" unit="%" theme={colorMap.green} />
          <StatCard label="Solution B" value={soluteConc} unit="%" theme={colorMap.red} />
          <StatCard label="Gradient" value={Math.abs(gradient)} unit="%" theme={colorMap.purple} />
          <StatCard label="Status" value={osmosisType.split(" ")[0]} theme={colorMap.blue} />
        </section>

        {/* Theory */}
        <section className="[grid-area:theory] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">📖 Theory</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Osmosis is a special case of diffusion. It involves the net movement of <strong>solvent (water)</strong> molecules from a region of higher water potential to a region of lower water potential across a <strong>selectively permeable membrane</strong>.
          </p>
          
        </section>

        {/* Key Points */}
        <section className="[grid-area:points] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-amber-500 mb-4">💡 Key Points</h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex gap-2"><span>•</span> <strong>Hypotonic:</strong> More water, less solute. Cell swells (Turgid).</li>
            <li className="flex gap-2"><span>•</span> <strong>Hypertonic:</strong> Less water, more solute. Cell shrinks (Plasmolysis).</li>
            <li className="flex gap-2"><span>•</span> <strong>Isotonic:</strong> Equal concentration. No net movement.</li>
          </ul>
          

[Image of red blood cells in hypotonic, isotonic, and hypertonic solutions]

        </section>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, unit = "", theme }) => (
  <div className={`border rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] ${theme}`}>
    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-1">{label}</span>
    <div className="text-2xl font-black">{value}<span className="text-xs ml-0.5 opacity-40">{unit}</span></div>
  </div>
);

export default Osmosis;