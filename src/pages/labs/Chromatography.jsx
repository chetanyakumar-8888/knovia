import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MIXTURES = [
  {
    name: "Ink (Blue)",
    components: [
      { name: "Cyan", color: "#06b6d4", rf: 0.85 },
      { name: "Violet", color: "#8b5cf6", rf: 0.65 },
      { name: "Blue", color: "#3b82f6", rf: 0.45 },
    ]
  },
  {
    name: "Leaf Extract",
    components: [
      { name: "Carotene", color: "#f97316", rf: 0.92 },
      { name: "Xanthophyll", color: "#eab308", rf: 0.71 },
      { name: "Chlorophyll A", color: "#16a34a", rf: 0.52 },
      { name: "Chlorophyll B", color: "#15803d", rf: 0.36 },
    ]
  },
  {
    name: "Food Dye",
    components: [
      { name: "Yellow", color: "#fbbf24", rf: 0.88 },
      { name: "Red", color: "#ef4444", rf: 0.62 },
      { name: "Blue", color: "#3b82f6", rf: 0.38 },
    ]
  },
];

const Chromatography = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [mixture, setMixture] = useState(0);
  const [solventHeight, setSolventHeight] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);

  const mix = MIXTURES[mixture];

  useEffect(() => {
    let interval;
    if (running && solventHeight < 100) {
      interval = setInterval(() => {
        setSolventHeight(h => {
          if (h >= 100) { setRunning(false); return 100; }
          return h + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [running, solventHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const paperX = W / 2 - 60;
    const paperW = 120;
    const paperTop = 30;
    const paperBottom = H - 60;
    const paperH = paperBottom - paperTop;

    // Beaker
    ctx.beginPath();
    ctx.moveTo(paperX - 40, paperTop + 20);
    ctx.lineTo(paperX - 50, paperBottom + 20);
    ctx.lineTo(paperX + paperW + 50, paperBottom + 20);
    ctx.lineTo(paperX + paperW + 40, paperTop + 20);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Solvent in beaker
    const solventLevel = paperBottom + 20 - (solventHeight / 100) * 60;
    ctx.fillStyle = "rgba(96,165,250,0.2)";
    ctx.fillRect(paperX - 48, solventLevel, paperW + 96, paperBottom + 20 - solventLevel);
    ctx.beginPath();
    ctx.moveTo(paperX - 48, solventLevel);
    ctx.lineTo(paperX + paperW + 48, solventLevel);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#60a5fa";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Solvent", paperX - 45, solventLevel - 5);

    // Chromatography paper
    ctx.fillStyle = "#fef9c3";
    ctx.fillRect(paperX, paperTop, paperW, paperH);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(paperX, paperTop, paperW, paperH);

    // Origin line
    const originY = paperBottom - 20;
    ctx.beginPath();
    ctx.moveTo(paperX, originY);
    ctx.lineTo(paperX + paperW, originY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    ctx.fillText("Origin", paperX - 5, originY + 4);

    // Solvent front
    const frontY = originY - (solventHeight / 100) * (originY - paperTop - 20);
    ctx.beginPath();
    ctx.moveTo(paperX, frontY);
    ctx.lineTo(paperX + paperW, frontY);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#60a5fa";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    ctx.fillText("Solvent front", paperX - 5, frontY + 4);

    // Component spots
    const totalDist = originY - frontY;
    mix.components.forEach((comp, i) => {
      const spotY = originY - comp.rf * totalDist;
      const spotX = paperX + paperW / 2;
      const spotR = 12;

      ctx.beginPath();
      ctx.arc(spotX, spotY, spotR, 0, Math.PI * 2);
      ctx.fillStyle = comp.color + "cc";
      ctx.fill();
      ctx.strokeStyle = comp.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rf label
      if (solventHeight > 10) {
        ctx.fillStyle = comp.color;
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${comp.name} (Rf=${comp.rf})`, paperX + paperW + 10, spotY + 4);
      }
    });

    // Origin spot (mixture)
    ctx.beginPath();
    ctx.arc(paperX + paperW / 2, originY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#475569";
    ctx.fill();

    // Distance labels
    if (solventHeight > 5) {
      const sfDist = (originY - frontY).toFixed(0);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Solvent dist: ${sfDist}px`, 10, 20);
    }

  }, [solventHeight, mixture]);

  const handleReset = () => {
    setSolventHeight(0);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Chromatography 🧫</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 11 CHEMISTRY
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>

            {/* Mixture selection */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Sample Mixture</p>
              <div className="space-y-2">
                {MIXTURES.map((m, i) => (
                  <button key={i}
                    onClick={() => { setMixture(i); handleReset(); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      mixture === i ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}>{m.name}</button>
                ))}
              </div>
            </div>

            {/* Components */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Components in mixture:</p>
              <div className="space-y-1">
                {mix.components.map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-1 bg-gray-800 rounded">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                      <span className="text-xs text-gray-300">{c.name}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: c.color }}>Rf={c.rf}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setRunning(!running)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  running ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
                }`}>{running ? "⏸ Pause" : "▶ Run"}</button>
              <button onClick={handleReset}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600"
              >↺ Reset</button>
            </div>
          </div>

          {/* Rf Formula */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-2">Rf VALUE</p>
            <p className="font-mono text-xs text-purple-300 text-center mb-2">
              Rf = Distance by solute / Distance by solvent
            </p>
            <p className="text-xs text-gray-400">Solvent progress: {solventHeight.toFixed(1)}%</p>
          </div>
        </div>

        {/* Right - Animation */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Paper Chromatography — {mix.name}
          </h2>
          <canvas ref={canvasRef} width={600} height={320}
            className="w-full rounded-lg bg-gray-950"/>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Components", value: mix.components.length, unit: "", color: "purple" },
          { label: "Solvent Progress", value: solventHeight.toFixed(1), unit: "%", color: "blue" },
          { label: "Highest Rf", value: Math.max(...mix.components.map(c => c.rf)), unit: "", color: "green" },
          { label: "Lowest Rf", value: Math.min(...mix.components.map(c => c.rf)), unit: "", color: "yellow" },
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
            <strong className="text-white">Chromatography</strong> separates mixtures based on different rates of movement through a stationary phase carried by a mobile phase.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm">
            <span className="text-purple-400">Rf = ds/df</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Rf value is always between 0 and 1",
              "Higher Rf = less attracted to stationary phase",
              "Same substance always has same Rf in same conditions",
              "Used to identify and separate compounds",
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

export default Chromatography;