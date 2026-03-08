import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PHASES = [
  {
    name: "Interphase",
    color: "#7c3aed",
    description: "Cell prepares for division. DNA replication occurs. Cell grows in size.",
    chromosomes: "duplicated",
  },
  {
    name: "Prophase",
    color: "#2563eb",
    description: "Chromosomes condense and become visible. Nuclear envelope breaks down.",
    chromosomes: "condensing",
  },
  {
    name: "Metaphase",
    color: "#0891b2",
    description: "Chromosomes align at the cell's equator (metaphase plate).",
    chromosomes: "aligned",
  },
  {
    name: "Anaphase",
    color: "#059669",
    description: "Sister chromatids separate and move to opposite poles of the cell.",
    chromosomes: "separating",
  },
  {
    name: "Telophase",
    color: "#d97706",
    description: "Nuclear envelopes reform around each set of chromosomes.",
    chromosomes: "reforming",
  },
  {
    name: "Cytokinesis",
    color: "#dc2626",
    description: "Cytoplasm divides forming two identical daughter cells.",
    chromosomes: "divided",
  },
];

const CellDivision = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(false);
  const [tick, setTick] = useState(0);
  const divisionType = "mitosis";

  useEffect(() => {
    let interval;
    if (auto) {
      interval = setInterval(() => {
        setTick(t => t + 1);
        setPhase(p => (p + 1) % PHASES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [auto]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const currentPhase = PHASES[phase];

    if (phase === 0) {
      // Interphase - single round cell
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(124, 58, 237, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(124, 58, 237, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.stroke();

      // DNA strands
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + (i-1.5)*12, cy, 4, 15, i*0.4, 0, Math.PI*2);
        ctx.fillStyle = "#c4b5fd";
        ctx.fill();
      }
    } else if (phase === 1) {
      // Prophase - chromosomes condensing
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37, 99, 235, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Condensing chromosomes
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const x = cx + Math.cos(angle) * 30;
        const y = cy + Math.sin(angle) * 30;
        ctx.beginPath();
        ctx.ellipse(x, y, 8, 18, angle, 0, Math.PI * 2);
        ctx.fillStyle = "#93c5fd";
        ctx.fill();
        ctx.strokeStyle = "#1d4ed8";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else if (phase === 2) {
      // Metaphase - chromosomes at equator
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8, 145, 178, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#0891b2";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Metaphase plate
      ctx.beginPath();
      ctx.moveTo(cx, cy - 100);
      ctx.lineTo(cx, cy + 100);
      ctx.strokeStyle = "rgba(8, 145, 178, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Chromosomes at center
      for (let i = 0; i < 4; i++) {
        const y = cy - 45 + i * 30;
        // Left chromatid
        ctx.beginPath();
        ctx.ellipse(cx - 12, y, 7, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#67e8f9";
        ctx.fill();
        // Right chromatid
        ctx.beginPath();
        ctx.ellipse(cx + 12, y, 7, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#67e8f9";
        ctx.fill();
        // Centromere
        ctx.beginPath();
        ctx.arc(cx, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#0e7490";
        ctx.fill();
      }

      // Spindle fibers
      for (let i = 0; i < 4; i++) {
        const y = cy - 45 + i * 30;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 90);
        ctx.lineTo(cx, y);
        ctx.strokeStyle = "rgba(103, 232, 249, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy + 90);
        ctx.lineTo(cx, y);
        ctx.stroke();
      }
    } else if (phase === 3) {
      // Anaphase - separating
      ctx.beginPath();
      ctx.ellipse(cx, cy, 130, 90, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5, 150, 105, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Top group
      for (let i = 0; i < 4; i++) {
        const x = cx - 30 + i * 20;
        ctx.beginPath();
        ctx.ellipse(x, cy - 45, 7, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#6ee7b7";
        ctx.fill();
      }
      // Bottom group
      for (let i = 0; i < 4; i++) {
        const x = cx - 30 + i * 20;
        ctx.beginPath();
        ctx.ellipse(x, cy + 45, 7, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#6ee7b7";
        ctx.fill();
      }
    } else if (phase === 4) {
      // Telophase - two nuclei forming
      ctx.beginPath();
      ctx.ellipse(cx, cy, 130, 90, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(217, 119, 6, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Top nucleus
      ctx.beginPath();
      ctx.arc(cx, cy - 40, 35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(217, 119, 6, 0.2)";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bottom nucleus
      ctx.beginPath();
      ctx.arc(cx, cy + 40, 35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(217, 119, 6, 0.2)";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cleavage furrow hint
      ctx.beginPath();
      ctx.moveTo(cx - 130, cy);
      ctx.lineTo(cx + 130, cy);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (phase === 5) {
      // Cytokinesis - two cells
      // Cell 1
      ctx.beginPath();
      ctx.arc(cx - 70, cy, 70, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 38, 38, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx - 70, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 38, 38, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cell 2
      ctx.beginPath();
      ctx.arc(cx + 70, cy, 70, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 38, 38, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + 70, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 38, 38, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#fca5a5";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Daughter Cell 1", cx - 70, cy + 90);
      ctx.fillText("Daughter Cell 2", cx + 70, cy + 90);
    }

    // Phase label
    ctx.fillStyle = currentPhase.color;
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(currentPhase.name, cx, 25);

  }, [phase, tick]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Cell Division (Mitosis) 🔬</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 11 BIOLOGY
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Phase Controls</h2>

            {/* Phase buttons */}
            <div className="space-y-2 mb-4">
              {PHASES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => { setPhase(i); setAuto(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    phase === i
                      ? "text-white border-2"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
                  }`}
                  style={phase === i ? {
                    backgroundColor: p.color + "33",
                    borderColor: p.color,
                    color: p.color
                  } : {}}
                >
                  {i + 1}. {p.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAuto(!auto)}
              className={`w-full py-2 rounded-lg text-sm font-medium ${
                auto ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >{auto ? "⏸ Stop Auto" : "▶ Auto Play"}</button>
          </div>
        </div>

        {/* Right - Animation */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Cell Division Animation</h2>
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full rounded-lg bg-gray-950"
          />
          {/* Phase description */}
          <div
            className="mt-3 p-3 rounded-lg text-sm"
            style={{ backgroundColor: PHASES[phase].color + "22", borderLeft: `3px solid ${PHASES[phase].color}` }}
          >
            <span className="font-bold" style={{ color: PHASES[phase].color }}>
              {PHASES[phase].name}:
            </span>
            <span className="text-gray-300 ml-2">{PHASES[phase].description}</span>
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Current Phase", value: PHASES[phase].name, unit: "", color: "purple" },
          { label: "Phase Number", value: `${phase + 1}/6`, unit: "", color: "blue" },
          { label: "Division Type", value: "Mitosis", unit: "", color: "green" },
          { label: "Daughter Cells", value: phase === 5 ? "2" : "0", unit: "", color: "yellow" },
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
            <strong className="text-white">Mitosis</strong> is a type of cell division where one cell divides into two genetically identical daughter cells.
          </p>
          <p className="text-sm text-gray-400">
            It occurs in somatic (body) cells for growth, repair and asexual reproduction.
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "IPMAT: Interphase, Prophase, Metaphase, Anaphase, Telophase",
              "DNA replication happens during Interphase (S phase)",
              "Chromosomes are most visible during Metaphase",
              "Results in 2 genetically identical daughter cells",
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

export default CellDivision;