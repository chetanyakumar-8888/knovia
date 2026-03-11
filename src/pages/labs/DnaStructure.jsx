import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BASES = {
  A: { pair: "T", color: "#f87171", name: "Adenine" },
  T: { pair: "A", color: "#34d399", name: "Thymine" },
  G: { pair: "C", color: "#60a5fa", name: "Guanine" },
  C: { pair: "G", color: "#fbbf24", name: "Cytosine" },
};

const SEQUENCE = ["A","T","G","C","A","G","T","C","G","A","T","G"];

const DnaStructure = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [running, setRunning] = useState(true);
  const [selectedBase, setSelectedBase] = useState(null);
  const tickRef = useRef(0);

  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const amplitude = 80;
      const spacing = H / (SEQUENCE.length + 1);

      if (running) tickRef.current += speed * 0.02;
      const t = tickRef.current;

      SEQUENCE.forEach((base, i) => {
        const y = (i + 1) * spacing;
        const phase = t + i * 0.5;
        const lx = cx + Math.sin(phase) * amplitude;
        const rx = cx + Math.sin(phase + Math.PI) * amplitude;
        const baseInfo = BASES[base];
        const pairBase = baseInfo.pair;
        const pairInfo = BASES[pairBase];

        ctx.beginPath();
        ctx.moveTo(lx, y);
        ctx.lineTo(rx, y);
        ctx.strokeStyle = "rgba(148,163,184,0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(lx, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = selectedBase === base ? "#fff" : baseInfo.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#000";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(base, lx, y + 3);

        ctx.beginPath();
        ctx.arc(rx, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = selectedBase === pairBase ? "#fff" : pairInfo.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#000";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(pairBase, rx, y + 3);

        if (i < SEQUENCE.length - 1) {
          const nextPhase = t + (i + 1) * 0.5;
          const nextLx = cx + Math.sin(nextPhase) * amplitude;
          const nextRx = cx + Math.sin(nextPhase + Math.PI) * amplitude;
          const nextY = (i + 2) * spacing;
          ctx.beginPath();
          ctx.moveTo(lx, y);
          ctx.lineTo(nextLx, nextY);
          ctx.strokeStyle = "#a78bfa";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(rx, y);
          ctx.lineTo(nextRx, nextY);
          ctx.strokeStyle = "#a78bfa";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      setRotation(t);
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [running, speed, selectedBase]);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/lab")}
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">←</button>
            <h1 className="text-base sm:text-xl font-bold">DNA Structure 🧬</h1>
          </div>
          <span className="hidden sm:block text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
            CBSE CLASS 12 BIOLOGY
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* Animation — FIRST on mobile */}
        <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6 lg:hidden">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Double Helix Animation</h2>
          <canvas ref={canvasRef} width={600} height={320} className="w-full rounded-lg bg-gray-950" />
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            {Object.entries(BASES).map(([base, info]) => (
              <span key={base} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: info.color }}></span>
                {base} - {info.name}
              </span>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          {/* Left Controls */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Rotation Speed</span>
                  <span className="text-sm font-bold text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded">{speed}x</span>
                </div>
                <input type="range" min="1" max="10" value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-purple-500" />
              </div>
              <button onClick={() => setRunning(!running)}
                className={`w-full py-2 rounded-lg text-sm font-medium mb-4 ${running ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}>
                {running ? "⏸ Pause" : "▶ Play"}
              </button>
              <p className="text-xs text-gray-400 mb-2 font-semibold">BASE PAIRS (click to highlight)</p>
              <div className="space-y-2">
                {[["A","T"], ["G","C"]].map(([b1, b2]) => (
                  <div key={b1} onClick={() => setSelectedBase(selectedBase === b1 ? null : b1)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedBase === b1 ? "ring-2 ring-white" : ""} bg-gray-800 hover:bg-gray-700`}>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                        style={{ backgroundColor: BASES[b1].color }}>{b1}</span>
                      <span className="text-xs text-gray-400">{BASES[b1].name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">pairs with</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{BASES[b2].name}</span>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                        style={{ backgroundColor: BASES[b2].color }}>{b2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sequence */}
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
              <p className="text-xs text-purple-400 font-semibold mb-2">DNA SEQUENCE</p>
              <div className="flex flex-wrap gap-1">
                {SEQUENCE.map((base, i) => (
                  <span key={i} className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-black"
                    style={{ backgroundColor: BASES[base].color }}>{base}</span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Complementary strand:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {SEQUENCE.map((base, i) => (
                  <span key={i} className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-black"
                    style={{ backgroundColor: BASES[BASES[base].pair].color }}>{BASES[base].pair}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Animation — desktop only */}
          <div className="hidden lg:block w-full lg:w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Double Helix Animation</h2>
            <canvas ref={canvasRef} width={600} height={320} className="w-full rounded-lg bg-gray-950" />
            <div className="flex flex-wrap gap-4 mt-2 text-xs">
              {Object.entries(BASES).map(([base, info]) => (
                <span key={base} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: info.color }}></span>
                  {base} - {info.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Base Pairs", value: SEQUENCE.length, unit: "", color: "purple" },
            { label: "Structure", value: "Double Helix", unit: "", color: "blue" },
            { label: "Discovered", value: "1953", unit: "", color: "green" },
            { label: "Discoverers", value: "Watson & Crick", unit: "", color: "yellow" },
          ].map((card) => (
            <div key={card.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <p className="text-xs text-gray-500 mb-1">{card.label}</p>
              <p className={`text-lg font-bold text-${card.color}-400`}>
                {card.value}<span className="text-sm ml-1 text-gray-400">{card.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Theory + Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-white">DNA</strong> (Deoxyribonucleic Acid) is a double helix structure made of two antiparallel strands connected by hydrogen bonds between complementary base pairs.
            </p>
            <p className="text-sm text-gray-400">A always pairs with T (2 hydrogen bonds). G always pairs with C (3 hydrogen bonds).</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
            <ul className="space-y-2">
              {[
                "Chargaff's rule: A=T and G=C in any DNA",
                "Two strands are antiparallel (3'→5' and 5'→3')",
                "G-C pair has 3 hydrogen bonds (stronger)",
                "A-T pair has 2 hydrogen bonds",
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

export default DnaStructure;