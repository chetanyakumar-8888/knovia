import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CELLS = [
  { name: "Daniell Cell", anode: "Zn", cathode: "Cu", anodeIon: "Zn²⁺", cathodeIon: "Cu²⁺", emf: 1.10, anodeColor: "#94a3b8", cathodeColor: "#f59e0b" },
  { name: "Galvanic Cell", anode: "Fe", cathode: "Cu", anodeIon: "Fe²⁺", cathodeIon: "Cu²⁺", emf: 0.78, anodeColor: "#6b7280", cathodeColor: "#f59e0b" },
  { name: "Lead-Acid Cell", anode: "Pb", cathode: "PbO₂", anodeIon: "Pb²⁺", cathodeIon: "PbO₂", emf: 2.04, anodeColor: "#475569", cathodeColor: "#92400e" },
];

const Electrochemistry = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [cellType, setCellType] = useState(0);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(1.0);
  const [tick, setTick] = useState(0);

  const cell = CELLS[cellType];
  const power = (cell.emf * current).toFixed(2);
  const massDeposited = (current * (tick / 100) * 63.5 / (2 * 96485)).toFixed(6);

  useEffect(() => {
    let interval;
    if (running) interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    ctx.moveTo(80, 80);
    ctx.lineTo(60, H - 60);
    ctx.lineTo(W - 60, H - 60);
    ctx.lineTo(W - 80, 80);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const solGrad = ctx.createLinearGradient(0, 120, 0, H - 60);
    solGrad.addColorStop(0, "rgba(96,165,250,0.15)");
    solGrad.addColorStop(1, "rgba(96,165,250,0.35)");
    ctx.fillStyle = solGrad;
    ctx.fillRect(62, 120, W - 124, H - 180);

    ctx.beginPath();
    ctx.moveTo(W / 2 - 30, 80);
    ctx.lineTo(W / 2 - 30, 160);
    ctx.lineTo(W / 2 + 30, 160);
    ctx.lineTo(W / 2 + 30, 80);
    ctx.fillStyle = "#fef3c7";
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#92400e";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Salt", W / 2, 125);
    ctx.fillText("Bridge", W / 2, 138);

    ctx.fillStyle = cell.anodeColor;
    ctx.fillRect(120, 90, 20, 160);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(120, 90, 20, 160);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(cell.anode, 130, 280);
    ctx.fillStyle = "#f87171";
    ctx.font = "11px monospace";
    ctx.fillText("ANODE (−)", 130, 295);

    ctx.fillStyle = cell.cathodeColor;
    ctx.fillRect(W - 140, 90, 20, 160);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(W - 140, 90, 20, 160);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(cell.cathode, W - 130, 280);
    ctx.fillStyle = "#34d399";
    ctx.font = "11px monospace";
    ctx.fillText("CATHODE (+)", W - 130, 295);

    ctx.beginPath();
    ctx.moveTo(130, 90);
    ctx.lineTo(130, 40);
    ctx.lineTo(W - 130, 40);
    ctx.lineTo(W - 130, 90);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2, 40, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#a78bfa";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("V", W / 2, 36);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`${cell.emf}V`, W / 2, 52);

    if (running) {
      const numDots = 5;
      for (let i = 0; i < numDots; i++) {
        const progress = ((tick * 0.02 + i / numDots) % 1);
        let ex, ey;
        const totalPath = 2 * (W - 260) + 100;
        const pathPos = progress * totalPath;
        if (pathPos < W - 260) { ex = 130 + pathPos; ey = 40; }
        else if (pathPos < W - 260 + 50) { ex = W - 130; ey = 40 + (pathPos - (W - 260)); }
        else { ex = W - 130 - (pathPos - (W - 260 + 50)); ey = 90; }
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      }
    }

    if (running) {
      for (let i = 0; i < 4; i++) {
        const progress = (tick * 0.015 + i * 0.25) % 1;
        const cx1 = 150 + progress * (W - 300);
        ctx.beginPath();
        ctx.arc(cx1, 180 + i * 20, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#34d399";
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillText("+", cx1, 183 + i * 20);
        const cx2 = W - 150 - progress * (W - 300);
        ctx.beginPath();
        ctx.arc(cx2, 200 + i * 15, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#f87171";
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillText("−", cx2, 203 + i * 15);
      }
    }

    ctx.fillStyle = "#f87171";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${cell.anode} → ${cell.anodeIon} + 2e⁻`, 130, H - 30);
    ctx.fillStyle = "#34d399";
    ctx.textAlign = "center";
    ctx.fillText(`${cell.cathodeIon} + 2e⁻ → ${cell.cathode}`, W - 130, H - 30);
  }, [tick, cellType, running]);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/lab")}
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">←</button>
            <h1 className="text-base sm:text-xl font-bold">Electrochemistry ⚡🧪</h1>
          </div>
          <span className="hidden sm:block text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
            CBSE CLASS 12 CHEMISTRY
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* Canvas FIRST — always in DOM, order-first on mobile */}
        <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">{cell.name} — Electrochemical Cell</h2>
          <canvas ref={canvasRef} width={600} height={320} className="w-full rounded-lg bg-gray-950" />
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span> Electrons</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span> Cations (+)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span> Anions (−)</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Cell Type</p>
                <div className="space-y-2">
                  {CELLS.map((c, i) => (
                    <button key={i} onClick={() => { setCellType(i); setTick(0); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${cellType === i ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                      {c.name} ({c.emf}V)
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Current (A)</span>
                  <span className="text-sm font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded">{current}A</span>
                </div>
                <input type="range" min="0.1" max="5" step="0.1" value={current}
                  onChange={(e) => setCurrent(Number(e.target.value))}
                  className="w-full accent-blue-500" />
              </div>
              <button onClick={() => setRunning(!running)}
                className={`w-full py-2 rounded-lg text-sm font-medium ${running ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}>
                {running ? "⏸ Stop" : "▶ Start"}
              </button>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
              <p className="text-xs text-purple-400 font-semibold mb-2">FARADAY'S LAW</p>
              <p className="font-mono text-xs text-center text-purple-300 mb-2">m = ZIt = MIt/nF</p>
              <p className="text-xs text-gray-400">Mass deposited:</p>
              <p className="text-white font-bold">{massDeposited} g</p>
            </div>
          </div>

          {/* Data Cards */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "EMF", value: cell.emf, unit: "V", color: "purple" },
                { label: "Current", value: current, unit: "A", color: "blue" },
                { label: "Power", value: power, unit: "W", color: "yellow" },
                { label: "Mass Deposited", value: massDeposited, unit: "g", color: "green" },
              ].map((card) => (
                <div key={card.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                  <p className={`text-xl font-bold text-${card.color}-400`}>
                    {card.value}<span className="text-sm ml-1 text-gray-400">{card.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Theory + Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-white">Electrochemical cells</strong> convert chemical energy to electrical energy. Oxidation occurs at anode, reduction at cathode.
            </p>
            <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm">
              <span className="text-purple-400">E°cell = E°cathode − E°anode</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
            <ul className="space-y-2">
              {[
                "Anode: oxidation (loss of electrons) — negative",
                "Cathode: reduction (gain of electrons) — positive",
                "Salt bridge maintains electrical neutrality",
                "Faraday's constant F = 96485 C/mol",
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
    </div>
  );
};

export default Electrochemistry;