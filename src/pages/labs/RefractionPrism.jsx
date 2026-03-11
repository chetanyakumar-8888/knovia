import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const RefractionPrism = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(60);
  const [incidence, setIncidence] = useState(45);
  const [material, setMaterial] = useState("glass");

  const materials = {
    glass: { n: 1.5, color: "#93c5fd", label: "Glass (n=1.5)" },
    diamond: { n: 2.42, color: "#e879f9", label: "Diamond (n=2.42)" },
    water: { n: 1.33, color: "#67e8f9", label: "Water (n=1.33)" },
    quartz: { n: 1.46, color: "#86efac", label: "Quartz (n=1.46)" },
  };

  const colorMap = {
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    green: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    yellow: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  };

  // Physics Calculations
  const n = materials[material].n;
  const A = angle;
  const i1 = incidence;
  const r1 = (Math.asin(Math.sin(i1 * Math.PI / 180) / n) * 180 / Math.PI).toFixed(2);
  const r2 = (A - parseFloat(r1)).toFixed(2);
  const i2Raw = Math.asin(n * Math.sin(parseFloat(r2) * Math.PI / 180)) * 180 / Math.PI;
  const i2 = isNaN(i2Raw) ? "TIR" : i2Raw.toFixed(2);
  const deviation = i2 === "TIR" ? "TIR" : (i1 + parseFloat(i2) - A).toFixed(2);
  const criticalAngle = (Math.asin(1 / n) * 180 / Math.PI).toFixed(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 30;
    const size = 130;

    // Prism Geometry
    const top = { x: cx, y: cy - size };
    const baseWidth = 2 * size * Math.tan((angle / 2) * (Math.PI / 180));
    const left = { x: cx - baseWidth / 2, y: cy + 20 };
    const right = { x: cx + baseWidth / 2, y: cy + 20 };

    // 1. Draw Prism
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.closePath();
    ctx.fillStyle = materials[material].color + "22";
    ctx.fill();
    ctx.strokeStyle = materials[material].color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Incident Ray
    const midLeft = { x: (top.x + left.x) / 2, y: (top.y + left.y) / 2 };
    const faceAngle = Math.atan2(left.y - top.y, left.x - top.x);
    const normalAngle = faceAngle + Math.PI / 2;
    const rayAngle = normalAngle - (i1 * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(midLeft.x - Math.cos(rayAngle) * 150, midLeft.y - Math.sin(rayAngle) * 150);
    ctx.lineTo(midLeft.x, midLeft.y);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Normal Line 1
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.moveTo(midLeft.x - Math.cos(normalAngle) * 60, midLeft.y - Math.sin(normalAngle) * 60);
    ctx.lineTo(midLeft.x + Math.cos(normalAngle) * 60, midLeft.y + Math.sin(normalAngle) * 60);
    ctx.stroke();
    ctx.setLineDash([]);

    if (i2 !== "TIR") {
      // 3. Refracted Ray (Inside)
      const midRight = { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 };
      ctx.beginPath();
      ctx.moveTo(midLeft.x, midLeft.y);
      ctx.lineTo(midRight.x, midRight.y);
      ctx.strokeStyle = "#fff";
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // 4. Emergent Rays (Dispersion)
      const exitFaceAngle = Math.atan2(right.y - top.y, right.x - top.x);
      const exitNormalAngle = exitFaceAngle - Math.PI / 2;
      const spectrum = ["#ef4444", "#fbbf24", "#22c55e", "#3b82f6", "#a855f7"];
      
      spectrum.forEach((color, idx) => {
        const dispersionShift = (idx - 2) * 2; 
        const exitRayAngle = exitNormalAngle + (parseFloat(i2) + dispersionShift) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(midRight.x, midRight.y);
        ctx.lineTo(midRight.x + Math.cos(exitRayAngle) * 150, midRight.y + Math.sin(exitRayAngle) * 150);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Normal Line 2
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(midRight.x - Math.cos(exitNormalAngle) * 60, midRight.y - Math.sin(exitNormalAngle) * 60);
      ctx.lineTo(midRight.x + Math.cos(exitNormalAngle) * 60, midRight.y + Math.sin(exitNormalAngle) * 60);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Handle TIR Visualization
      ctx.fillStyle = "#f87171";
      ctx.font = "bold 16px Inter";
      ctx.textAlign = "center";
      ctx.fillText("TOTAL INTERNAL REFLECTION", cx, cy + 80);
    }

  }, [angle, incidence, material, i2, i1]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-slate-900 rounded-full border border-white/10">←</button>
          <h1 className="text-2xl font-black tracking-tight">Prism Lab 🔺</h1>
        </div>
        <div className="px-4 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full tracking-widest uppercase">CBSE Physics Class 12</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Simulation Settings</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase">Material</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(materials).map(([key]) => (
                    <button key={key} onClick={() => setMaterial(key)} className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${material === key ? "bg-purple-600 shadow-lg shadow-purple-500/20" : "bg-slate-800 hover:bg-slate-700 text-slate-400"}`}>{key}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Prism Angle (A)</span>
                  <span className="text-sm font-mono text-amber-400 font-bold">{angle}°</span>
                </div>
                <input type="range" min="30" max="90" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Incidence (i₁)</span>
                  <span className="text-sm font-mono text-sky-400 font-bold">{incidence}°</span>
                </div>
                <input type="range" min="10" max="85" value={incidence} onChange={(e) => setIncidence(Number(e.target.value))} className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-tighter">Mathematical Proof</h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><span className="text-slate-500">n₁ sin i₁ = n₂ sin r₁</span> <span className="text-indigo-300">r₁ = {r1}°</span></div>
              <div className="flex justify-between"><span className="text-slate-500">r₁ + r₂ = A</span> <span className="text-indigo-300">r₂ = {r2}°</span></div>
              <div className="flex justify-between text-white font-bold border-t border-white/5 pt-2 mt-2"><span>δ = i₁ + i₂ - A</span> <span>δ = {deviation}°</span></div>
            </div>
          </div>
        </div>

        {/* Animation */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[40px] p-6 shadow-2xl overflow-hidden relative">
          <div className="absolute top-8 left-8">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ray Diagram Visualizer</span>
          </div>
          <canvas ref={canvasRef} width={700} height={400} className="w-full h-full bg-slate-950 rounded-[32px]" />
        </div>
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Refraction (r₁)" value={r1} unit="°" theme={colorMap.blue} />
        <StatCard label="Emergent (i₂)" value={i2} unit={i2 !== "TIR" ? "°" : ""} theme={colorMap.green} />
        <StatCard label="Deviation (δ)" value={deviation} unit={deviation !== "TIR" ? "°" : ""} theme={colorMap.purple} />
        <StatCard label="Critical Angle" value={criticalAngle} unit="°" theme={colorMap.yellow} />
      </div>

      {/* Theory & Visual Aids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-indigo-400 mb-4">📖 Prism Theory</h3>
          
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            A prism is a transparent refracting medium bounded by two plane surfaces inclined at an angle. The most important relationship is:
          </p>
          <div className="bg-slate-950 p-4 rounded-2xl text-center font-mono text-purple-400 text-lg border border-purple-500/20">
            n = sin((A + δₘ)/2) / sin(A/2)
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-amber-500 mb-4">💡 Dispersion Facts</h3>
          [Image showing dispersion of white light through a prism into a rainbow spectrum]
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-400">
              <span className="text-amber-500 font-black">01.</span> Violet light has the shortest wavelength and deviates the <b>most</b>.
            </li>
            <li className="flex gap-3 text-sm text-slate-400">
              <span className="text-amber-500 font-black">02.</span> Red light has the longest wavelength and deviates the <b>least</b>.
            </li>
            <li className="flex gap-3 text-sm text-slate-400">
              <span className="text-amber-500 font-black">03.</span> Cauchy's formula explains why <i>n</i> depends on wavelength.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, unit, theme }) => (
  <div className={`border rounded-2xl p-6 transition-all hover:scale-[1.02] ${theme}`}>
    <p className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-2">{label}</p>
    <div className="text-2xl font-black">{value}<span className="text-sm ml-1 opacity-40 font-normal">{unit}</span></div>
  </div>
);

export default RefractionPrism;