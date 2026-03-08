import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WheatstoneBridge = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(15);
  const [voltage, setVoltage] = useState(9);

  // Wheatstone bridge: balanced when R1/R2 = R3/R4
  // So R4 = R2 * R3 / R1
  const r4Balanced = (r2 * r3 / r1).toFixed(2);
  const [r4, setR4] = useState(30);

  const vA = voltage * r2 / (r1 + r2);
  const vB = voltage * r4 / (r3 + r4);
  const vGalvanometer = (vA - vB).toFixed(3);
  const isBalanced = Math.abs(parseFloat(vGalvanometer)) < 0.1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;

    // Node positions (diamond shape)
    const top = { x: cx, y: 60 };
    const left = { x: cx - 160, y: cy };
    const right = { x: cx + 160, y: cy };
    const bottom = { x: cx, y: H - 60 };

    const drawWire = (x1, y1, x2, y2, color = "#7c3aed", width = 2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const drawResistor = (x1, y1, x2, y2, label, color) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const len = 40;

      // Wire before
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(mx - Math.cos(angle) * len / 2, my - Math.sin(angle) * len / 2);
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wire after
      ctx.beginPath();
      ctx.moveTo(mx + Math.cos(angle) * len / 2, my + Math.sin(angle) * len / 2);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Resistor box
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-len / 2, -10, len, 20);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(-len / 2, -10, len, 20);
      ctx.restore();

      // Label
      const offset = 22;
      ctx.fillStyle = color;
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, mx + Math.sin(angle) * offset, my - Math.cos(angle) * offset);
    };

    // Draw resistors on 4 arms
    drawResistor(top.x, top.y, left.x, left.y, `R₁=${r1}Ω`, "#34d399");
    drawResistor(top.x, top.y, right.x, right.y, `R₂=${r2}Ω`, "#60a5fa");
    drawResistor(left.x, left.y, bottom.x, bottom.y, `R₃=${r3}Ω`, "#f59e0b");
    drawResistor(right.x, right.y, bottom.x, bottom.y, `R₄=${r4}Ω`, "#f87171");

    // Galvanometer (middle wire)
    const galColor = isBalanced ? "#34d399" : "#ef4444";
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.strokeStyle = galColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Galvanometer circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = isBalanced ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)";
    ctx.fill();
    ctx.strokeStyle = galColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = galColor;
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("G", cx, cy + 5);

    // Battery
    drawWire(top.x, top.y, top.x, top.y - 10);
    ctx.beginPath();
    ctx.moveTo(top.x - 15, top.y - 10);
    ctx.lineTo(top.x + 15, top.y - 10);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(top.x - 10, top.y - 18);
    ctx.lineTo(top.x + 10, top.y - 18);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f59e0b";
    ctx.font = "11px monospace";
    ctx.fillText(`${voltage}V`, top.x + 22, top.y - 12);

    // Ground
    drawWire(bottom.x, bottom.y, bottom.x, bottom.y + 10);
    ctx.beginPath();
    ctx.moveTo(bottom.x - 15, bottom.y + 10);
    ctx.lineTo(bottom.x + 15, bottom.y + 10);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Node dots
    [top, left, right, bottom].forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#a78bfa";
      ctx.fill();
    });

    // Balanced indicator
    if (isBalanced) {
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("✓ BALANCED", cx, H - 15);
    } else {
      ctx.fillStyle = "#ef4444";
      ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`Ig = ${vGalvanometer} V`, cx, H - 15);
    }

  }, [r1, r2, r3, r4, voltage]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Wheatstone Bridge ⚡</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 12 PHYSICS
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>

            {[
              { label: "R₁ (Ω)", value: r1, set: setR1, color: "green" },
              { label: "R₂ (Ω)", value: r2, set: setR2, color: "blue" },
              { label: "R₃ (Ω)", value: r3, set: setR3, color: "yellow" },
              { label: "R₄ (Ω)", value: r4, set: setR4, color: "red" },
              { label: "Voltage (V)", value: voltage, set: setVoltage, color: "purple", max: 24 },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className={`text-sm font-bold text-${item.color}-400 bg-${item.color}-900/40 px-2 py-0.5 rounded`}>
                    {item.value}
                  </span>
                </div>
                <input type="range" min="1" max={item.max || 100} value={item.value}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className={`w-full accent-${item.color}-500`}/>
              </div>
            ))}
          </div>

          {/* Balance hint */}
          <div className={`rounded-xl p-4 border ${isBalanced ? "bg-green-950/50 border-green-800" : "bg-red-950/50 border-red-800"}`}>
            <p className={`text-xs font-semibold mb-2 ${isBalanced ? "text-green-400" : "text-red-400"}`}>
              {isBalanced ? "✓ BRIDGE BALANCED" : "✗ BRIDGE UNBALANCED"}
            </p>
            <p className="text-xs text-gray-400 font-mono">R₁/R₂ = R₃/R₄</p>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {r1}/{r2} = {r3}/R₄
            </p>
            <p className="text-white font-bold mt-1">
              R₄ for balance = {r4Balanced} Ω
            </p>
            <button
              onClick={() => setR4(Math.round(parseFloat(r4Balanced)))}
              className="mt-2 w-full py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium"
            >Auto Balance</button>
          </div>
        </div>

        {/* Right - Circuit */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Wheatstone Bridge Circuit</h2>
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full rounded-lg bg-gray-950"
          />
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Galvanometer V", value: vGalvanometer, unit: "V", color: isBalanced ? "green" : "red" },
          { label: "R₄ for Balance", value: r4Balanced, unit: "Ω", color: "purple" },
          { label: "Bridge Status", value: isBalanced ? "Balanced" : "Unbalanced", unit: "", color: isBalanced ? "green" : "red" },
          { label: "Supply Voltage", value: voltage, unit: "V", color: "yellow" },
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
          <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-white">Wheatstone Bridge</strong> is used to find unknown resistance. It is balanced when no current flows through the galvanometer.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm">
            <span className="text-purple-400">R₁/R₂ = R₃/R₄</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Bridge is balanced when Ig = 0 (no galvanometer current)",
              "Condition: R₁/R₂ = R₃/R₄ (ratio arms equal)",
              "Used to determine unknown resistance accurately",
              "Invented by Samuel Hunter Christie in 1833",
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

export default WheatstoneBridge;