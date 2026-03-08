import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AcidBaseTitration = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [burretteVolume, setBurretteVolume] = useState(0);
  const [acidConc, setAcidConc] = useState(0.1);
  const [acidVolume, setAcidVolume] = useState(25);
  const [indicator, setIndicator] = useState("phenolphthalein");

  const baseConc = (acidConc * acidVolume / Math.max(burretteVolume, 0.01)).toFixed(4);
  const pH = burretteVolume < acidVolume
    ? (1 - Math.log10(acidConc * (1 - burretteVolume / acidVolume) + 0.0001)).toFixed(2)
    : burretteVolume === acidVolume
    ? "7.00"
    : (14 + Math.log10(acidConc * (burretteVolume / acidVolume - 1) + 0.0001)).toFixed(2);

  const getFlaskColor = () => {
    const p = parseFloat(pH);
    if (indicator === "phenolphthalein") {
      if (p < 8.2) return "#f0f9ff";
      if (p < 10) return "#fda4af";
      return "#f43f5e";
    } else {
      if (p < 3.1) return "#ef4444";
      if (p < 4.4) return "#f97316";
      if (p < 6.0) return "#eab308";
      if (p < 7.6) return "#22c55e";
      if (p < 9.0) return "#3b82f6";
      return "#8b5cf6";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Draw burette
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(W / 2 - 15, 20, 30, 180);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 15, 20, 30, 180);

    // Burette liquid
    const liquidH = (1 - burretteVolume / 50) * 160;
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(W / 2 - 13, 22, 26, liquidH);

    // Burette tip
    ctx.beginPath();
    ctx.moveTo(W / 2 - 5, 200);
    ctx.lineTo(W / 2 + 5, 200);
    ctx.lineTo(W / 2, 220);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.strokeStyle = "#7c3aed";
    ctx.stroke();

    // Drop animation
    if (burretteVolume > 0) {
      ctx.beginPath();
      ctx.arc(W / 2, 230, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#93c5fd";
      ctx.fill();
    }

    // Flask
    ctx.beginPath();
    ctx.moveTo(W / 2 - 20, 250);
    ctx.lineTo(W / 2 - 50, 340);
    ctx.lineTo(W / 2 + 50, 340);
    ctx.lineTo(W / 2 + 20, 250);
    ctx.closePath();
    ctx.fillStyle = getFlaskColor();
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Flask neck
    ctx.beginPath();
    ctx.moveTo(W / 2 - 20, 250);
    ctx.lineTo(W / 2 - 20, 230);
    ctx.moveTo(W / 2 + 20, 250);
    ctx.lineTo(W / 2 + 20, 230);
    ctx.strokeStyle = "#7c3aed";
    ctx.stroke();

    // pH label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`pH: ${pH}`, W / 2, 300);

    // Burette markings
    for (let i = 0; i <= 5; i++) {
      const y = 22 + i * 32;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${i * 10}`, W / 2 - 18, y + 4);
    }

  }, [burretteVolume, indicator, pH]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Acid-Base Titration 🧪</h1>
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

            {/* Indicator */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Indicator</p>
              <div className="flex gap-2">
                {["phenolphthalein", "litmus"].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndicator(ind)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize ${
                      indicator === ind
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >{ind}</button>
                ))}
              </div>
            </div>

            {/* Burette Volume */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Base Added (mL)</span>
                <span className="text-sm font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded">
                  {burretteVolume} mL
                </span>
              </div>
              <input
                type="range" min="0" max="50" step="0.5" value={burretteVolume}
                onChange={(e) => setBurretteVolume(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0 mL</span><span>50 mL</span>
              </div>
            </div>

            {/* Acid Concentration */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Acid Conc. (M)</span>
                <span className="text-sm font-bold text-red-400 bg-red-900/40 px-2 py-0.5 rounded">
                  {acidConc} M
                </span>
              </div>
              <input
                type="range" min="0.01" max="1" step="0.01" value={acidConc}
                onChange={(e) => setAcidConc(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            {/* Acid Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Acid Volume (mL)</span>
                <span className="text-sm font-bold text-orange-400 bg-orange-900/40 px-2 py-0.5 rounded">
                  {acidVolume} mL
                </span>
              </div>
              <input
                type="range" min="10" max="50" value={acidVolume}
                onChange={(e) => setAcidVolume(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          {/* Equivalence Point */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-2">EQUIVALENCE POINT</p>
            <p className="text-xs text-gray-400 font-mono">M₁V₁ = M₂V₂</p>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {acidConc} × {acidVolume} = M₂ × {burretteVolume || "?"}
            </p>
            <p className="text-white font-bold mt-2">Base Conc: {burretteVolume > 0 ? baseConc : "—"} M</p>
          </div>
        </div>

        {/* Right - Apparatus */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Titration Apparatus</h2>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={380}
              className="rounded-lg bg-gray-950"
            />
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "pH", value: pH, unit: "", color: "purple" },
          { label: "Base Added", value: burretteVolume, unit: "mL", color: "blue" },
          { label: "Acid Conc.", value: acidConc, unit: "M", color: "red" },
          { label: "Base Conc.", value: burretteVolume > 0 ? baseConc : "—", unit: burretteVolume > 0 ? "M" : "", color: "green" },
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
            <strong className="text-white">Titration</strong> is a technique to determine the concentration of an unknown solution using a standard solution.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm mb-2">
            <span className="text-purple-400">M₁V₁ = M₂V₂</span>
          </div>
          <p className="text-sm text-gray-400">
            At equivalence point, moles of acid = moles of base.
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Phenolphthalein: colorless in acid, pink in base",
              "Litmus: red in acid, blue in base",
              "Equivalence point: complete neutralization",
              "End point: indicator changes color permanently",
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

export default AcidBaseTitration;