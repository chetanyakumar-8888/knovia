import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Potentiometer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [driverEmf, setDriverEmf] = useState(6);
  const [wireLength, setWireLength] = useState(100);
  const [unknownEmf, setUnknownEmf] = useState(2.4);
  const [jockeyPos, setJockeyPos] = useState(50);

  const potentialGradient = driverEmf / wireLength;
  const balancingLength = (unknownEmf / potentialGradient).toFixed(2);
  const voltageAtJockey = (potentialGradient * jockeyPos).toFixed(3);
  const galvReading = (parseFloat(voltageAtJockey) - unknownEmf).toFixed(3);
  const isBalanced = Math.abs(parseFloat(galvReading)) < 0.05;

  // Color Map for Tailwind
  const colorMap = {
    yellow: "text-amber-400 bg-amber-900/40 accent-amber-500 border-amber-500/20",
    blue: "text-blue-400 bg-blue-900/40 accent-blue-500 border-blue-500/20",
    purple: "text-purple-400 bg-purple-900/40 accent-purple-500 border-purple-500/20",
    green: "text-emerald-400 bg-emerald-900/40 accent-emerald-500 border-emerald-500/20",
    red: "text-rose-400 bg-rose-900/40 accent-rose-500 border-rose-500/20"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const wireStartX = 60;
    const wireEndX = W - 60;
    const wireY = 80;
    const wireLen = wireEndX - wireStartX;

    // 1. Driver Circuit (Top Loop)
    ctx.beginPath();
    ctx.moveTo(wireStartX, wireY);
    ctx.lineTo(wireStartX, 30);
    ctx.lineTo(wireEndX, 30);
    ctx.lineTo(wireEndX, wireY);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Driver Battery Symbol
    ctx.beginPath();
    ctx.moveTo(W/2 - 10, 20); ctx.lineTo(W/2 - 10, 40); // Long plate (+)
    ctx.moveTo(W/2 + 5, 25); ctx.lineTo(W/2 + 5, 35);   // Short plate (-)
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Main Potentiometer Wire
    ctx.beginPath();
    ctx.moveTo(wireStartX, wireY);
    ctx.lineTo(wireEndX, wireY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Rulers/Markings
    for (let i = 0; i <= 10; i++) {
      const x = wireStartX + (i / 10) * wireLen;
      ctx.fillStyle = "#475569";
      ctx.fillRect(x - 1, wireY + 8, 2, 8);
      ctx.font = "10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(`${i * (wireLength/10)}`, x, wireY + 28);
    }

    // 3. Jockey and Galvanometer (Secondary Circuit)
    const jx = wireStartX + (jockeyPos / wireLength) * wireLen;
    
    // Jockey Arrow
    ctx.beginPath();
    ctx.moveTo(jx, wireY);
    ctx.lineTo(jx - 8, wireY + 20);
    ctx.lineTo(jx + 8, wireY + 20);
    ctx.closePath();
    ctx.fillStyle = "#fbbf24";
    ctx.fill();

    // Connection from wire start to Unknown Battery
    ctx.beginPath();
    ctx.moveTo(wireStartX, wireY);
    ctx.lineTo(wireStartX, 220);
    ctx.lineTo(wireStartX + 100, 220);
    ctx.strokeStyle = "#7c3aed";
    ctx.stroke();

    // Unknown Battery
    ctx.beginPath();
    ctx.moveTo(wireStartX + 110, 210); ctx.lineTo(wireStartX + 110, 230);
    ctx.moveTo(wireStartX + 120, 215); ctx.lineTo(wireStartX + 120, 225);
    ctx.strokeStyle = "#a78bfa";
    ctx.stroke();

    // Galvanometer Circle
    const gX = wireStartX + 220;
    const gY = 220;
    ctx.beginPath();
    ctx.arc(gX, gY, 25, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.strokeStyle = isBalanced ? "#10b981" : "#f43f5e";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Needle logic
    ctx.save();
    ctx.translate(gX, gY);
    const angle = Math.max(-1, Math.min(1, parseFloat(galvReading) * 0.4));
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, -18);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();

    // Complete the loop to Jockey
    ctx.beginPath();
    ctx.moveTo(wireStartX + 120, 220);
    ctx.lineTo(gX - 25, 220);
    ctx.moveTo(gX + 25, 220);
    ctx.lineTo(jx, 220);
    ctx.lineTo(jx, wireY + 20);
    ctx.strokeStyle = "#7c3aed";
    ctx.stroke();

  }, [driverEmf, wireLength, unknownEmf, jockeyPos, isBalanced, galvReading]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-10">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-slate-900 rounded-full border border-white/10 hover:bg-slate-800 transition-colors">←</button>
          <h1 className="font-bold text-lg tracking-tight">Potentiometer Simulator ⚡</h1>
        </div>
        <div className="hidden sm:block text-[10px] font-black bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full tracking-[0.2em]">CBSE CLASS 12</div>
      </nav>

      {/* Responsive Grid */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid gap-6 
        grid-cols-1 
        lg:grid-cols-[380px_1fr] 
        [grid-template-areas:'circuit''controls''calc''cards''theory''points'] 
        lg:[grid-template-areas:'controls_circuit''calc_circuit''cards_cards''theory_points']">

        {/* 1. CIRCUIT DIAGRAM */}
        <section className="[grid-area:circuit] bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col min-h-[400px] shadow-2xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Interactive Circuit</span>
          <canvas ref={canvasRef} width={700} height={320} className="w-full h-auto bg-slate-950/50 rounded-2xl border border-white/5" />
          <div className={`mt-auto text-center p-3 rounded-xl font-mono text-sm border ${isBalanced ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-white/5 text-slate-400'}`}>
            {isBalanced ? "● NULL POINT DETECTED" : `Galvanometer Deflection: ${galvReading}V`}
          </div>
        </section>

        {/* 2. CONTROLS */}
        <section className="[grid-area:controls] bg-slate-900/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6 text-indigo-400 underline decoration-indigo-500/30 underline-offset-8">Setup Parameters</h2>
          <div className="space-y-5">
            <ControlSlider label="Driver EMF" value={driverEmf} unit="V" set={setDriverEmf} min={1} max={12} step={0.1} theme={colorMap.yellow} />
            <ControlSlider label="Wire Length" value={wireLength} unit="cm" set={setWireLength} min={50} max={200} step={1} theme={colorMap.blue} />
            <ControlSlider label="Unknown EMF" value={unknownEmf} unit="V" set={setUnknownEmf} min={0.1} max={5} step={0.1} theme={colorMap.purple} />
            <ControlSlider label="Jockey Position" value={jockeyPos} unit="cm" set={setJockeyPos} min={0} max={wireLength} step={0.5} theme={colorMap.green} />
            
            <button onClick={() => setJockeyPos(Math.min(parseFloat(balancingLength), wireLength))}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 mt-2">
              ⚖️ Auto-Align Jockey
            </button>
          </div>
        </section>

        {/* 3. CALCULATION */}
        <section className="[grid-area:calc] bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-center text-center">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Potential Gradient (k)</p>
           <div className="text-3xl font-black mb-1">{potentialGradient.toFixed(4)} <span className="text-sm opacity-50">V/cm</span></div>
           <p className="text-xs text-slate-500 font-mono">ε = k × L = {potentialGradient.toFixed(3)} × {balancingLength}</p>
        </section>

        {/* 4. DATA CARDS (2x2 Mobile / 1x4 Desktop) */}
        <section className="[grid-area:cards] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Gradient" value={potentialGradient.toFixed(3)} unit="V/cm" theme={colorMap.purple} />
          <StatCard label="Null Point" value={balancingLength} unit="cm" theme={colorMap.green} />
          <StatCard label="Jockey V" value={voltageAtJockey} unit="V" theme={colorMap.blue} />
          <StatCard label="Deflection" value={galvReading} unit="V" theme={isBalanced ? colorMap.green : colorMap.red} />
        </section>

        {/* 5. THEORY */}
        <section className="[grid-area:theory] bg-slate-900/40 border border-white/5 rounded-3xl p-8 leading-relaxed">
          <h3 className="text-lg font-bold mb-4 text-slate-200">The Principle</h3>
          <p className="text-sm text-slate-400">
            A Potentiometer works on the principle that the potential drop across any portion of the wire is <strong>directly proportional</strong> to its length, provided the wire has a uniform cross-section and a constant current flows through it.
          </p>
        </section>

        {/* 6. KEY POINTS */}
        <section className="[grid-area:points] bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-4 text-slate-200">Pro-Tips</h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex gap-2"><span>•</span> Driver EMF must be greater than unknown EMF.</li>
            <li className="flex gap-2"><span>•</span> Null deflection means no current is drawn from the test cell.</li>
            <li className="flex gap-2"><span>•</span> High sensitivity requires a low potential gradient.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

// Sub-components for cleaner JSX
const ControlSlider = ({ label, value, unit, set, min, max, step, theme }) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
      <span className={`text-sm font-bold ${theme.split(' ')[0]}`}>{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => set(Number(e.target.value))} 
      className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${theme.split(' ')[2]}`} />
  </div>
);

const StatCard = ({ label, value, unit, theme }) => (
  <div className={`bg-slate-900/60 border ${theme.split(' ')[3]} rounded-2xl p-6 flex flex-col items-center justify-center`}>
    <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</span>
    <div className={`text-xl font-bold ${theme.split(' ')[0]}`}>{value}<span className="text-xs ml-0.5 opacity-50">{unit}</span></div>
  </div>
);

export default Potentiometer;