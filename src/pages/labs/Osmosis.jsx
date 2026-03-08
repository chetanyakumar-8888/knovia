import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Osmosis = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [soluteConc, setSoluteConc] = useState(50);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const leftConc = 20;
  const rightConc = soluteConc;
  const gradient = rightConc - leftConc;
  const waterMovement = gradient > 0 ? "Left → Right" : gradient < 0 ? "Right → Left" : "Equilibrium";
  const osmosisType = rightConc > leftConc ? "Hypertonic (Right)" : rightConc < leftConc ? "Hypotonic (Right)" : "Isotonic";

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((t) => {
          if (t >= 100) { setRunning(false); return 100; }
          return t + 1;
        });
      }, 100);
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
      ? Math.min(progress * gradient * 0.5, 40)
      : Math.max(progress * gradient * 0.5, -40);

    // Left chamber
    const leftH = H * 0.6 + waterShift * 2;
    ctx.fillStyle = `rgba(96, 165, 250, ${0.3 + (leftConc / 200)})`;
    ctx.fillRect(50, H - leftH, W / 2 - 80, leftH);

    // Right chamber
    const rightH = H * 0.6 - waterShift * 2;
    ctx.fillStyle = `rgba(96, 165, 250, ${0.3 + (rightConc / 200)})`;
    ctx.fillRect(W / 2 + 30, H - rightH, W / 2 - 80, rightH);

    // Chamber walls
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 40, W / 2 - 80, H - 60);
    ctx.strokeRect(W / 2 + 30, 40, W / 2 - 80, H - 60);

    // Semi-permeable membrane
    ctx.beginPath();
    ctx.moveTo(W / 2 - 10, 40);
    ctx.lineTo(W / 2 - 10, H - 20);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(W / 2 + 10, 40);
    ctx.lineTo(W / 2 + 10, H - 20);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Membrane label
    ctx.fillStyle = "#f59e0b";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Semi-", W / 2, 25);
    ctx.fillText("permeable", W / 2, 37);

    // Solute particles - Left (fixed low concentration)
    for (let i = 0; i < 8; i++) {
      const px = 70 + (i % 4) * 40;
      const py = H - 40 - Math.floor(i / 4) * 50;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#34d399";
      ctx.fill();
    }

    // Solute particles - Right (variable concentration)
    const particleCount = Math.floor(rightConc / 5);
    for (let i = 0; i < Math.min(particleCount, 20); i++) {
      const px = W / 2 + 50 + (i % 5) * 35;
      const py = H - 40 - Math.floor(i / 5) * 45;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#f87171";
      ctx.fill();
    }

    // Water level labels
    ctx.fillStyle = "#93c5fd";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${leftConc}%`, W / 4, H - leftH + 20);
    ctx.fillText(`${rightConc}%`, W * 3 / 4, H - rightH + 20);

    // Arrow showing water movement
    if (gradient !== 0 && running) {
      const arrowDir = gradient > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - arrowDir * 30, H / 2);
      ctx.lineTo(W / 2 + arrowDir * 30, H / 2);
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 + arrowDir * 20, H / 2 - 10);
      ctx.lineTo(W / 2 + arrowDir * 30, H / 2);
      ctx.lineTo(W / 2 + arrowDir * 20, H / 2 + 10);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Solution A", W / 4, 58);
    ctx.fillText("Solution B", W * 3 / 4, 58);

  }, [time, soluteConc]);

  const handleReset = () => {
    setTime(0);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Osmosis Simulator 🌱</h1>
        </div>
        <span className="text-xs bg-green-900 text-green-300 px-3 py-1 rounded-full border border-green-700">
          CBSE CLASS 9 BIOLOGY
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>

            {/* Solution A - Fixed */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Solution A (Left) — Fixed</p>
              <p className="text-2xl font-bold text-green-400">20%</p>
              <p className="text-xs text-gray-500">Solute concentration</p>
            </div>

            {/* Solution B - Variable */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Solution B (Right)</span>
                <span className="text-sm font-bold text-red-400 bg-red-900/40 px-2 py-0.5 rounded">
                  {soluteConc}%
                </span>
              </div>
              <input
                type="range" min="0" max="100" value={soluteConc}
                onChange={(e) => { setSoluteConc(Number(e.target.value)); handleReset(); }}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0%</span><span>100%</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setRunning(!running)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  running ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >{running ? "⏸ Pause" : "▶ Start"}</button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600"
              >↺ Reset</button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-950/50 rounded-xl p-4 border border-green-800">
            <p className="text-xs text-green-400 font-semibold mb-2">OSMOSIS TYPE</p>
            <p className="text-white font-bold text-lg">{osmosisType}</p>
            <p className="text-sm text-gray-400 mt-1">Water moves: {waterMovement}</p>
            <div className="mt-2 h-2 bg-gray-800 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full transition-all"
                style={{ width: `${time}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Progress: {time}%</p>
          </div>
        </div>

        {/* Right - Animation */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Osmosis Animation</h2>
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full rounded-lg bg-gray-950"
          />
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span> Low solute particles
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span> High solute particles
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-400 rounded-sm inline-block"></span> Semi-permeable membrane
            </span>
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Solution A Conc.", value: "20", unit: "%", color: "green" },
          { label: "Solution B Conc.", value: soluteConc, unit: "%", color: "red" },
          { label: "Concentration Gradient", value: Math.abs(gradient), unit: "%", color: "purple" },
          { label: "Osmosis Type", value: osmosisType.split(" ")[0], unit: "", color: "blue" },
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
            <strong className="text-white">Osmosis</strong> is the movement of water molecules through a semi-permeable membrane from a region of higher water concentration to lower water concentration.
          </p>
          <p className="text-sm text-gray-400">
            Water moves from <strong className="text-white">hypotonic</strong> (low solute) to <strong className="text-white">hypertonic</strong> (high solute) solution.
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Osmosis requires a semi-permeable membrane",
              "Hypotonic: lower solute concentration than cell",
              "Hypertonic: higher solute concentration than cell",
              "Isotonic: equal solute concentration — no net movement",
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

export default Osmosis;