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
  const range = ((velocity ** 2) * Math.sin(2 * angleRad) / g).toFixed(2);
  const maxHeight = ((velocity ** 2) * (Math.sin(angleRad) ** 2) / (2 * g)).toFixed(2);
  const timeOfFlight = ((2 * velocity * Math.sin(angleRad)) / g).toFixed(2);

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

      // Ground
      ctx.strokeStyle = "#4c1d95";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H - 30);
      ctx.lineTo(W, H - 30);
      ctx.stroke();

      // Scale
      const scaleX = (W - 60) / parseFloat(range);
      const scaleY = (H - 60) / parseFloat(maxHeight);
      const scale = Math.min(scaleX, scaleY, 5);

      // Trail
      ctx.beginPath();
      trail.forEach((p, i) => {
        const alpha = i / trail.length;
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ball position
      const x = velocity * Math.cos(angleRad) * t;
      const y = velocity * Math.sin(angleRad) * t - 0.5 * g * t * t;
      const cx = 30 + x * scale;
      const cy = H - 30 - y * scale;

      trail.push({ x: cx, y: cy });

      // Draw ball
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      gradient.addColorStop(0, "#c4b5fd");
      gradient.addColorStop(1, "#7c3aed");
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Velocity vector
      if (t < 0.1) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + velocity * Math.cos(angleRad) * 1.5,
          cy - velocity * Math.sin(angleRad) * 1.5
        );
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      t += 0.03;
      if (t > totalTime + 0.5) {
        t = 0;
        trail.length = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [velocity, angle]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">Projectile Motion 🎯</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 11 PHYSICS
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Column - Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4 flex items-center gap-2">
              ⚙️ Controls
            </h2>

            {/* Velocity Slider */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Initial Velocity (u)</span>
                <span className="text-sm font-bold text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded">
                  {velocity} m/s
                </span>
              </div>
              <input
                type="range" min="10" max="100" value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>10 m/s</span><span>100 m/s</span>
              </div>
            </div>

            {/* Angle Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Launch Angle (θ)</span>
                <span className="text-sm font-bold text-green-400 bg-green-900/40 px-2 py-0.5 rounded">
                  {angle}°
                </span>
              </div>
              <input
                type="range" min="1" max="89" value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0°</span><span>90°</span>
              </div>
            </div>
          </div>

          {/* Live Calculation */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-3">LIVE CALCULATION</p>
            <div className="space-y-2 text-sm font-mono">
              <p className="text-gray-300">R = u²sin(2θ)/g</p>
              <p className="text-purple-300">
                = {velocity}²×sin({2*angle}°)/9.8
              </p>
              <p className="text-white font-bold text-lg">{range} m</p>
            </div>
          </div>
        </div>

        {/* Right Column - Animation */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Trajectory Animation</h2>
          <canvas
            ref={canvasRef}
            width={700}
            height={320}
            className="w-full rounded-lg bg-gray-950"
          />
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Range", value: range, unit: "m", color: "purple" },
          { label: "Max Height", value: maxHeight, unit: "m", color: "blue" },
          { label: "Time of Flight", value: timeOfFlight, unit: "s", color: "green" },
          { label: "Launch Angle", value: angle, unit: "°", color: "yellow" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold text-${card.color}-400`}>
              {card.value}<span className="text-sm ml-1 text-gray-400">{card.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Theory + Key Points */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-white">Projectile motion</strong> is a form of motion where an object moves in a curved path under the influence of gravity only.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm mb-2">
            <span className="text-purple-400">R = u²sin(2θ)/g</span>
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-green-400">H = u²sin²θ/2g</span>
          </div>
          <p className="text-sm text-gray-400">
            Maximum range is achieved at <strong className="text-white">45°</strong> launch angle.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Horizontal velocity remains constant throughout",
              "Vertical velocity changes due to gravity (9.8 m/s²)",
              "Maximum range at 45°, maximum height at 90°",
              "Time of flight depends on vertical component only",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-yellow-400 shrink-0 mt-0.5">{i+1}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;