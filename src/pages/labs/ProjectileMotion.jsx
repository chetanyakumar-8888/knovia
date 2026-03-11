import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProjectileMotion = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [velocity, setVelocity] = useState(50);
  const [angle, setAngle] = useState(45);

  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  
  // Physics Calculations
  const range = ((velocity ** 2) * Math.sin(2 * angleRad) / g).toFixed(2);
  const maxHeight = ((velocity ** 2) * (Math.sin(angleRad) ** 2) / (2 * g)).toFixed(2);
  const timeOfFlight = ((2 * velocity * Math.sin(angleRad)) / g).toFixed(2);

  // Tailwind Color Map Fix
  const colorMap = {
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    green: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    yellow: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    let t = 0;
    const totalTime = parseFloat(timeOfFlight);
    const trail = [];

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw Ground
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, H - 30, W, 30);
      ctx.strokeStyle = "#4338ca";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H - 30);
      ctx.lineTo(W, H - 30);
      ctx.stroke();

      // Dynamic Scaling to keep projectile in view
      const scaleX = (W - 100) / (velocity ** 2 / g); // Max theoretical range
      const scaleY = (H - 100) / (velocity ** 2 / (2 * g)); // Max theoretical height
      const scale = Math.min(scaleX, scaleY, 4);

      // Draw Trajectory Trail
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      trail.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = "rgba(167, 139, 250, 0.5)";
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate Current Position
      const x = velocity * Math.cos(angleRad) * t;
      const y = velocity * Math.sin(angleRad) * t - 0.5 * g * t * t;
      
      const cx = 50 + x * scale;
      const cy = H - 30 - y * scale;

      if (t <= totalTime) {
        trail.push({ x: cx, y: cy });
      }

      // Draw Projectile
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#8b5cf6";
      ctx.fillStyle = "#c4b5fd";
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Timer Logic
      t += 0.05;
      if (t > totalTime + 1) {
        t = 0;
        trail.length = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [velocity, angle, timeOfFlight, angleRad]);

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      {/* Navbar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 border border-gray-800 transition-all">←</button>
          <h1 className="text-2xl font-black tracking-tight">Projectile Motion Lab 🎯</h1>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase">CBSE Physics Class 11</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="space-y-6">
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Simulation Parameters</h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-gray-400">Velocity (u)</span>
                  <span className="text-sm font-mono font-bold text-purple-400">{velocity} m/s</span>
                </div>
                <input type="range" min="10" max="100" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-purple-500 bg-gray-800 h-1.5 rounded-lg appearance-none" />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-gray-400">Angle (θ)</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">{angle}°</span>
                </div>
                <input type="range" min="5" max="85" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-emerald-500 bg-gray-800 h-1.5 rounded-lg appearance-none" />
              </div>
            </div>
          </section>

          <section className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
             <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Live Derivation</h3>
             <div className="font-mono text-sm space-y-3">
                <div className="text-gray-500">R = (u² sin 2θ) / g</div>
                <div className="text-white">R = ({velocity}² × sin({2*angle})) / 9.8</div>
                <div className="text-xl font-bold text-purple-400">{range} meters</div>
             </div>
          </section>
        </div>

        {/* Animation Canvas */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-4 shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trajectory Visualizer</span>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-full bg-gray-950 rounded-2xl" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard label="Horizontal Range" value={range} unit="m" theme={colorMap.purple} />
        <StatCard label="Maximum Height" value={maxHeight} unit="m" theme={colorMap.blue} />
        <StatCard label="Time of Flight" value={timeOfFlight} unit="s" theme={colorMap.green} />
        <StatCard label="Launch Angle" value={angle} unit="deg" theme={colorMap.yellow} />
      </div>

      {/* Theory Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">📖 Theory Overview</h4>
          
          <p className="text-sm text-gray-400 leading-relaxed">
            In projectile motion, we resolve the initial velocity into two components: 
            <br />• <strong>uₓ = u cos θ</strong> (Horizontal, remains constant)
            <br />• <strong>uᵧ = u sin θ</strong> (Vertical, subject to acceleration <i>g</i>)
            <br /><br />
            Since there is no horizontal acceleration, the path is a <strong>Parabola</strong>.
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="text-amber-400 font-bold mb-3">💡 Exam Key Points</h4>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="flex gap-3"><span className="text-amber-500 font-bold">01.</span> Velocity at the highest point is only <b>u cos θ</b>.</li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">02.</span> For the same range, there are two angles: <b>θ</b> and <b>(90 - θ)</b>.</li>
            <li className="flex gap-3"><span className="text-amber-500 font-bold">03.</span> Air resistance is neglected in basic kinematics.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, unit, theme }) => (
  <div className={`border rounded-2xl p-5 transition-all hover:scale-[1.02] ${theme}`}>
    <p className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-2">{label}</p>
    <div className="text-2xl font-black">{value}<span className="text-sm ml-1 opacity-40 font-normal">{unit}</span></div>
  </div>
);

export default ProjectileMotion;