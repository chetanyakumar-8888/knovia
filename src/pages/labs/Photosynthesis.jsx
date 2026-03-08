import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Photosynthesis = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [lightIntensity, setLightIntensity] = useState(50);
  const [co2Level, setCo2Level] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  const rate = ((lightIntensity / 100) * (co2Level / 100) *
    Math.max(0, 1 - Math.abs(temperature - 25) / 25) * 100).toFixed(1);
  const o2Produced = (rate * 0.032).toFixed(3);
  const glucoseProduced = (rate * 0.018).toFixed(3);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTick(t => t + 1), 100);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Sky background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    skyGrad.addColorStop(0, `rgba(30, 58, 138, ${1 - lightIntensity/200})`);
    skyGrad.addColorStop(1, `rgba(59, 130, 246, ${lightIntensity/150})`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.65);

    // Ground
    ctx.fillStyle = "#14532d";
    ctx.fillRect(0, H * 0.65, W, H * 0.35);

    // Sun
    const sunBrightness = lightIntensity / 100;
    ctx.beginPath();
    ctx.arc(80, 70, 35 * sunBrightness + 10, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(253, 224, 71, ${sunBrightness})`;
    ctx.fill();

    // Sun rays
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + tick * 0.05;
      ctx.beginPath();
      ctx.moveTo(80 + Math.cos(angle) * 45, 70 + Math.sin(angle) * 45);
      ctx.lineTo(80 + Math.cos(angle) * 65, 70 + Math.sin(angle) * 65);
      ctx.strokeStyle = `rgba(253, 224, 71, ${sunBrightness * 0.7})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Light rays hitting leaf
    if (lightIntensity > 20) {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(80 + i * 20, 100);
        ctx.lineTo(280 + i * 10, H * 0.5);
        ctx.strokeStyle = `rgba(253, 224, 71, ${sunBrightness * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Plant stem
    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.65);
    ctx.lineTo(W / 2, H * 0.35);
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Main leaf
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.45, 100, 50, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${34 + lightIntensity}, ${120 + lightIntensity / 2}, ${34})`;
    ctx.fill();
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Leaf veins
    ctx.beginPath();
    ctx.moveTo(W / 2 - 90, H * 0.45);
    ctx.lineTo(W / 2 + 90, H * 0.45);
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(W / 2 + i * 25, H * 0.45);
      ctx.lineTo(W / 2 + i * 25 + (i > 0 ? 15 : -15), H * 0.45 - 20);
      ctx.stroke();
    }

    // CO2 molecules coming in
    const co2Count = Math.floor(co2Level / 20);
    for (let i = 0; i < co2Count; i++) {
      const x = W - 60 - i * 30 + (tick % 30) * 2;
      const y = H * 0.4 + i * 15;
      if (x > W / 2 + 100) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px monospace";
        ctx.fillText("CO₂", x, y);
      }
    }

    // O2 molecules coming out (when running)
    if (running && rate > 0) {
      for (let i = 0; i < 3; i++) {
        const x = W / 2 - 30 - i * 25;
        const y = H * 0.35 - ((tick * 2 + i * 30) % 80);
        ctx.fillStyle = "#34d399";
        ctx.font = "11px monospace";
        ctx.fillText("O₂", x, y);
      }

      // Glucose label
      const gy = H * 0.65 + ((tick * 1.5) % 40);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "11px monospace";
      ctx.fillText("C₆H₁₂O₆", W / 2 - 30, gy);
    }

    // Chloroplast inside leaf
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(
        W / 2 - 40 + i * 25,
        H * 0.45,
        8, 4, 0, 0, Math.PI * 2
      );
      ctx.fillStyle = "#16a34a";
      ctx.fill();
    }

    // Temperature indicator
    ctx.fillStyle = temperature > 35 ? "#ef4444" : temperature < 15 ? "#60a5fa" : "#34d399";
    ctx.font = "12px monospace";
    ctx.fillText(`🌡 ${temperature}°C`, W - 80, 30);

  }, [tick, lightIntensity, co2Level, temperature, running]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Photosynthesis Simulator 🌿</h1>
        </div>
        <span className="text-xs bg-green-900 text-green-300 px-3 py-1 rounded-full border border-green-700">
          CBSE CLASS 10 BIOLOGY
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>

            {/* Light Intensity */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">☀️ Light Intensity</span>
                <span className="text-sm font-bold text-yellow-400 bg-yellow-900/40 px-2 py-0.5 rounded">
                  {lightIntensity}%
                </span>
              </div>
              <input type="range" min="0" max="100" value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full accent-yellow-500"/>
            </div>

            {/* CO2 Level */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">💨 CO₂ Level</span>
                <span className="text-sm font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                  {co2Level}%
                </span>
              </div>
              <input type="range" min="0" max="100" value={co2Level}
                onChange={(e) => setCo2Level(Number(e.target.value))}
                className="w-full accent-gray-500"/>
            </div>

            {/* Temperature */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">🌡️ Temperature</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  temperature > 35 ? "text-red-400 bg-red-900/40" :
                  temperature < 15 ? "text-blue-400 bg-blue-900/40" :
                  "text-green-400 bg-green-900/40"
                }`}>
                  {temperature}°C
                </span>
              </div>
              <input type="range" min="0" max="50" value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-green-500"/>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0°C</span><span>50°C</span>
              </div>
            </div>

            <button
              onClick={() => setRunning(!running)}
              className={`w-full py-2 rounded-lg text-sm font-medium ${
                running ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >{running ? "⏸ Pause" : "▶ Start Photosynthesis"}</button>
          </div>

          {/* Equation */}
          <div className="bg-green-950/50 rounded-xl p-4 border border-green-800">
            <p className="text-xs text-green-400 font-semibold mb-2">PHOTOSYNTHESIS EQUATION</p>
            <p className="text-xs font-mono text-center text-gray-300 leading-6">
              6CO₂ + 6H₂O<br/>
              <span className="text-yellow-400">+ Light Energy</span><br/>
              → C₆H₁₂O₆ + 6O₂
            </p>
          </div>
        </div>

        {/* Right - Animation */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Photosynthesis Animation</h2>
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Photosynthesis Rate", value: rate, unit: "%", color: "green" },
          { label: "O₂ Produced", value: o2Produced, unit: "mol/s", color: "blue" },
          { label: "Glucose Produced", value: glucoseProduced, unit: "mol/s", color: "yellow" },
          { label: "Optimal Temp", value: "25", unit: "°C", color: "purple" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold text-${card.color}-400`}>
              {card.value}<span className="text-sm ml-1 text-gray-400">{card.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Theory + Key Points */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-green-400 mb-3">📖 Theory for CBSE Exam</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-white">Photosynthesis</strong> is the process by which green plants use sunlight, water and CO₂ to produce glucose and oxygen.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-xs">
            <span className="text-green-400">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Chlorophyll in chloroplasts absorbs light energy",
              "Optimum temperature for photosynthesis: 25°C",
              "Light, CO₂ and water are limiting factors",
              "Stomata allow CO₂ in and O₂ out of leaves",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-yellow-400 shrink-0 mt-0.5">{i + 1}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Photosynthesis;