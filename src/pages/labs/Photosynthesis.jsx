import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Photosynthesis = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [lightIntensity, setLightIntensity] = useState(50);
  const [co2Level, setCo2Level] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  // Biological Rate Calculations
  const rate = ((lightIntensity / 100) * (co2Level / 100) *
    Math.max(0, 1 - Math.abs(temperature - 25) / 25) * 100).toFixed(1);
  const o2Produced = (rate * 0.032).toFixed(3);
  const glucoseProduced = (rate * 0.018).toFixed(3);

  // Tailwind Color Mapping for Stat Cards
  const colorMap = {
    green: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    blue: "text-sky-400 border-sky-500/20 bg-sky-500/5",
    yellow: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  };

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTick(t => t + 1), 50);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 1. Sky Background (Reacts to Light Intensity)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, `rgb(15, 23, 42)`); // Dark Space
    skyGrad.addColorStop(1, `rgb(${20 + lightIntensity}, ${40 + lightIntensity}, ${80 + lightIntensity})`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Ground
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(0, H * 0.75, W, H * 0.25);

    // 3. The Plant & Leaf
    const leafX = W / 2;
    const leafY = H * 0.5;

    // Stem
    ctx.strokeStyle = "#059669";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(leafX, H * 0.75);
    ctx.lineTo(leafX, leafY + 20);
    ctx.stroke();

    // Leaf Body (Chlorophyll reaction)
    const leafGreen = Math.min(255, 40 + (rate * 2));
    ctx.fillStyle = `rgb(20, ${leafGreen}, 60)`;
    ctx.beginPath();
    ctx.ellipse(leafX, leafY, 80, 45, Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#065f46";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Sun & Light Energy
    const sunX = 80, sunY = 70;
    const sunSize = 30 + (lightIntensity * 0.2);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "yellow";
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Light Rays hitting leaf
    if (lightIntensity > 0) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = `rgba(253, 224, 71, ${lightIntensity / 100})`;
      ctx.beginPath();
      ctx.moveTo(sunX + 20, sunY + 20);
      ctx.lineTo(leafX - 30, leafY - 20);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Molecular Animation (Running State)
    if (running && rate > 0) {
      // CO2 Inflow (From right)
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10px Inter";
      for (let i = 0; i < 3; i++) {
        const offset = (tick * 2 + i * 40) % 150;
        ctx.fillText("CO₂", W - 50 - offset, leafY + (i * 15) - 10);
      }

      // O2 Outflow (Upwards)
      ctx.fillStyle = "#38bdf8";
      for (let i = 0; i < 3; i++) {
        const offset = (tick * 1.5 + i * 30) % 100;
        ctx.fillText("O₂", leafX - 20 + (i * 15), leafY - 20 - offset);
      }
    }

  }, [tick, lightIntensity, running, rate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-10">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-slate-900 rounded-full border border-white/10 hover:bg-slate-800 transition-colors">←</button>
          <h1 className="font-bold text-lg tracking-tight">Photosynthesis Simulator 🌿</h1>
        </div>
        <div className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full tracking-widest uppercase">CBSE Biology</div>
      </nav>

      {/* Grid Layout */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid gap-6 
        grid-cols-1 
        lg:grid-cols-[380px_1fr] 
        [grid-template-areas:'anim''controls''calc''cards''theory''points'] 
        lg:[grid-template-areas:'controls_anim''calc_anim''cards_cards''theory_points']">

        {/* Animation Display */}
        <section className="[grid-area:anim] bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col min-h-[400px] shadow-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Chloroplast Activity</span>
          <canvas ref={canvasRef} width={600} height={350} className="w-full h-auto rounded-2xl bg-black/20" />
          <div className="absolute top-8 right-8 bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs font-mono">
            {temperature}°C
          </div>
        </section>

        {/* Controls */}
        <section className="[grid-area:controls] bg-slate-900/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6">Environmental Factors</h2>
          <div className="space-y-6">
            <ControlSlider label="Light Intensity" value={lightIntensity} unit="%" set={setLightIntensity} color="accent-amber-500" />
            <ControlSlider label="CO₂ Concentration" value={co2Level} unit="%" set={setCo2Level} color="accent-slate-400" />
            <ControlSlider label="Temperature" value={temperature} unit="°C" set={setTemperature} min={0} max={50} color="accent-emerald-500" />
            
            <button onClick={() => setRunning(!running)}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${running ? 'bg-rose-600 shadow-rose-600/20' : 'bg-emerald-600 shadow-emerald-600/20'}`}>
              {running ? "⏸ Stop Process" : "▶ Start Photosynthesis"}
            </button>
          </div>
        </section>

        {/* Chemical Equation */}
        <section className="[grid-area:calc] bg-emerald-600/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-center text-center">
           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Chemical Balanced Equation</p>
           <div className="text-sm font-mono text-slate-300">
            6CO₂ + 6H₂O <span className="text-amber-400">☀️</span> → C₆H₁₂O₆ + 6O₂
           </div>
        </section>

        {/* Stat Cards */}
        <section className="[grid-area:cards] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Synthesis Rate" value={rate} unit="%" theme={colorMap.green} />
          <StatCard label="O₂ Yield" value={o2Produced} unit="mol/s" theme={colorMap.blue} />
          <StatCard label="Glucose Mass" value={glucoseProduced} unit="mol/s" theme={colorMap.yellow} />
          <StatCard label="Efficiency" value={((rate/100)*88).toFixed(1)} unit="%" theme={colorMap.purple} />
        </section>

        {/* Theory Section */}
        <section className="[grid-area:theory] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">📖 Biological Overview</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Photosynthesis occurs in the <strong>chloroplasts</strong> of plant cells. Chlorophyll absorbs solar energy to split water molecules (Photolysis), releasing Oxygen as a byproduct and converting Carbon Dioxide into energy-rich Glucose.
          </p>
          
        </section>

        {/* Key Points */}
        <section className="[grid-area:points] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-4 text-amber-500">💡 Exam Quick-Notes</h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex gap-2"><span>•</span> <strong>Limiting Factors:</strong> If one factor (like CO₂) is low, increasing others won't speed up the rate.</li>
            <li className="flex gap-2"><span>•</span> <strong>Temperature:</strong> Enzymes denature above 40°C, stopping the reaction.</li>
            <li className="flex gap-2"><span>•</span> <strong>Stomata:</strong> Tiny pores on leaves that regulate gas exchange.</li>
          </ul>
          
        </section>
      </div>
    </div>
  );
};

// Sub-components
const ControlSlider = ({ label, value, unit, set, min=0, max=100, color }) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
      <span className="text-sm font-mono font-bold text-white">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} 
      className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${color}`} />
  </div>
);

const StatCard = ({ label, value, unit, theme }) => (
  <div className={`border rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] ${theme}`}>
    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-1">{label}</span>
    <div className="text-2xl font-black">{value}<span className="text-xs ml-1 opacity-40 font-normal">{unit}</span></div>
  </div>
);

export default Photosynthesis;