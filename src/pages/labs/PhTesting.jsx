import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SOLUTIONS = [
  { name: "Battery Acid", ph: 0.5, color: "#ef4444" },
  { name: "Gastric Acid", ph: 1.5, color: "#f97316" },
  { name: "Lemon Juice", ph: 2.4, color: "#eab308" },
  { name: "Vinegar", ph: 3.0, color: "#ca8a04" },
  { name: "Tomato Juice", ph: 4.2, color: "#f97316" },
  { name: "Coffee", ph: 5.0, color: "#92400e" },
  { name: "Milk", ph: 6.5, color: "#e2e8f0" },
  { name: "Pure Water", ph: 7.0, color: "#93c5fd" },
  { name: "Blood", ph: 7.4, color: "#fca5a5" },
  { name: "Baking Soda", ph: 8.3, color: "#60a5fa" },
  { name: "Soap", ph: 9.5, color: "#a78bfa" },
  { name: "Milk of Magnesia", ph: 10.5, color: "#818cf8" },
  { name: "Ammonia", ph: 11.5, color: "#6366f1" },
  { name: "Bleach", ph: 12.5, color: "#4f46e5" },
  { name: "Drain Cleaner", ph: 14.0, color: "#3730a3" },
];

const getPhColor = (ph) => {
  if (ph < 3) return "#ef4444";
  if (ph < 5) return "#f97316";
  if (ph < 6) return "#eab308";
  if (ph < 7) return "#84cc16";
  if (ph === 7) return "#22c55e";
  if (ph < 9) return "#06b6d4";
  if (ph < 11) return "#3b82f6";
  if (ph < 13) return "#8b5cf6";
  return "#7c3aed";
};

const getPhType = (ph) => {
  if (ph < 7) return "Acidic";
  if (ph === 7) return "Neutral";
  return "Basic/Alkaline";
};

const PhTesting = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [selectedSolution, setSelectedSolution] = useState(7);
  const [customPh, setCustomPh] = useState(7);
  const [mode, setMode] = useState("preset");

  const ph = mode === "preset" ? SOLUTIONS[selectedSolution].ph : customPh;
  const phColor = getPhColor(ph);
  const phType = getPhType(ph);
  const hConc = Math.pow(10, -ph).toExponential(2);
  const ohConc = Math.pow(10, -(14 - ph)).toExponential(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // pH scale bar
    const barX = 40;
    const barY = 40;
    const barW = W - 80;
    const barH = 40;

    // Rainbow gradient scale
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, "#ef4444");
    grad.addColorStop(0.2, "#f97316");
    grad.addColorStop(0.35, "#eab308");
    grad.addColorStop(0.5, "#22c55e");
    grad.addColorStop(0.65, "#06b6d4");
    grad.addColorStop(0.8, "#3b82f6");
    grad.addColorStop(1, "#7c3aed");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 8);
    ctx.fill();

    // Scale numbers
    for (let i = 0; i <= 14; i++) {
      const x = barX + (i / 14) * barW;
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(i, x, barY + barH + 15);
    }

    // pH indicator arrow
    const arrowX = barX + (ph / 14) * barW;
    ctx.beginPath();
    ctx.moveTo(arrowX - 8, barY - 5);
    ctx.lineTo(arrowX + 8, barY - 5);
    ctx.lineTo(arrowX, barY + 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`pH ${ph}`, arrowX, barY - 10);

    // Labels
    ctx.fillStyle = "#ef4444";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("← ACID", barX, barY + barH + 30);
    ctx.fillStyle = "#22c55e";
    ctx.textAlign = "center";
    ctx.fillText("NEUTRAL", barX + barW / 2, barY + barH + 30);
    ctx.fillStyle = "#7c3aed";
    ctx.textAlign = "right";
    ctx.fillText("BASE →", barX + barW, barY + barH + 30);

    // Test tube / beaker
    const bx = W / 2;
    const by = 160;
    const bw = 80;
    const bh = 120;

    // Beaker
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2, by);
    ctx.lineTo(bx - bw / 2 - 5, by + bh);
    ctx.lineTo(bx + bw / 2 + 5, by + bh);
    ctx.lineTo(bx + bw / 2, by);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Liquid in beaker
    const liquidGrad = ctx.createLinearGradient(bx - bw / 2, by + 20, bx + bw / 2, by + bh);
    liquidGrad.addColorStop(0, phColor + "99");
    liquidGrad.addColorStop(1, phColor + "dd");
    ctx.fillStyle = liquidGrad;
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2 + 2, by + 20);
    ctx.lineTo(bx - bw / 2 - 3, by + bh - 2);
    ctx.lineTo(bx + bw / 2 + 3, by + bh - 2);
    ctx.lineTo(bx + bw / 2 - 2, by + 20);
    ctx.fill();

    // Indicator paper strip
    ctx.fillStyle = phColor;
    ctx.fillRect(bx + bw / 2 + 10, by + 30, 15, 60);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + bw / 2 + 10, by + 30, 15, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("pH", bx + bw / 2 + 17, by + 65);

    // pH value display
    ctx.fillStyle = phColor;
    ctx.font = "bold 32px monospace";
    ctx.textAlign = "center";
    ctx.fillText(ph, bx, by + 75);

    // Solution name
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      mode === "preset" ? SOLUTIONS[selectedSolution].name : "Custom Solution",
      bx, by + bh + 20
    );

    // Bubbles for strong acid/base
    if (ph < 2 || ph > 12) {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          bx - 20 + i * 10,
          by + 40 + (Date.now() / 500 + i * 30) % 80,
          3, 0, Math.PI * 2
        );
        ctx.strokeStyle = phColor + "88";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

  }, [ph, selectedSolution, mode]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">pH Testing Lab 🧪</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 10 CHEMISTRY
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-4">
              {["preset", "custom"].map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize ${
                    mode === m ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}>{m}</button>
              ))}
            </div>

            {mode === "preset" ? (
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {SOLUTIONS.map((sol, i) => (
                  <button key={i} onClick={() => setSelectedSolution(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      selectedSolution === i ? "ring-1 ring-purple-500 bg-purple-900/30" : "bg-gray-800 hover:bg-gray-700"
                    }`}>
                    <span>{sol.name}</span>
                    <span className="font-bold px-2 py-0.5 rounded text-black text-xs"
                      style={{ backgroundColor: getPhColor(sol.ph) }}>
                      {sol.ph}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Custom pH</span>
                  <span className="text-sm font-bold px-2 py-0.5 rounded text-black"
                    style={{ backgroundColor: phColor }}>
                    {customPh}
                  </span>
                </div>
                <input type="range" min="0" max="14" step="0.1" value={customPh}
                  onChange={(e) => setCustomPh(Number(e.target.value))}
                  className="w-full accent-purple-500"/>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0 (Acid)</span><span>14 (Base)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Visualization */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">pH Scale & Testing</h2>
          <canvas ref={canvasRef} width={600} height={320}
            className="w-full rounded-lg bg-gray-950"/>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "pH Value", value: ph, unit: "", color: "purple" },
          { label: "Type", value: phType, unit: "", color: ph < 7 ? "red" : ph === 7 ? "green" : "blue" },
          { label: "[H⁺] Conc.", value: hConc, unit: "mol/L", color: "yellow" },
          { label: "[OH⁻] Conc.", value: ohConc, unit: "mol/L", color: "green" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-lg font-bold text-${card.color}-400`}>
              {card.value}<span className="text-xs ml-1 text-gray-400">{card.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Theory + Key Points */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-white">pH</strong> is a measure of hydrogen ion concentration. pH = -log[H⁺]. The scale ranges from 0 to 14.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm">
            <span className="text-purple-400">pH + pOH = 14</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "pH < 7 = Acidic, pH = 7 = Neutral, pH > 7 = Basic",
              "Each pH unit = 10× change in H⁺ concentration",
              "Strong acids: HCl, H₂SO₄ (pH close to 0)",
              "Indicators: litmus, phenolphthalein, universal",
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

export default PhTesting;