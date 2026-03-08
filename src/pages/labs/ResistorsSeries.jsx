import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResistorsSeries = () => {
  const navigate = useNavigate();
  const [voltage, setVoltage] = useState(12);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(30);
  const [mode, setMode] = useState("series");

  const totalSeries = r1 + r2 + r3;
  const totalParallel = 1 / (1/r1 + 1/r2 + 1/r3);
  const totalR = mode === "series" ? totalSeries : totalParallel;
  const totalCurrent = (voltage / totalR).toFixed(3);

  const i1 = mode === "series"
    ? totalCurrent
    : (voltage / r1).toFixed(3);
  const i2 = mode === "series"
    ? totalCurrent
    : (voltage / r2).toFixed(3);
  const i3 = mode === "series"
    ? totalCurrent
    : (voltage / r3).toFixed(3);

  const v1 = (i1 * r1).toFixed(2);
  const v2 = (i2 * r2).toFixed(2);
  const v3 = (i3 * r3).toFixed(2);

  const CircuitDiagram = () => (
    <svg viewBox="0 0 600 300" className="w-full h-64">
      {mode === "series" ? (
        <>
          {/* Battery */}
          <line x1="40" y1="150" x2="40" y2="80" stroke="#7c3aed" strokeWidth="2"/>
          <line x1="40" y1="80" x2="560" y2="80" stroke="#7c3aed" strokeWidth="2"/>
          <line x1="560" y1="80" x2="560" y2="150" stroke="#7c3aed" strokeWidth="2"/>
          <line x1="40" y1="150" x2="40" y2="220" stroke="#7c3aed" strokeWidth="2"/>
          <line x1="40" y1="220" x2="560" y2="220" stroke="#7c3aed" strokeWidth="2"/>
          <line x1="560" y1="220" x2="560" y2="150" stroke="#7c3aed" strokeWidth="2"/>

          {/* Battery symbol */}
          <line x1="30" y1="140" x2="50" y2="140" stroke="#f59e0b" strokeWidth="3"/>
          <line x1="35" y1="155" x2="45" y2="155" stroke="#f59e0b" strokeWidth="2"/>
          <text x="55" y="152" fill="#f59e0b" fontSize="12">{voltage}V</text>

          {/* R1 */}
          <rect x="120" y="68" width="80" height="24" fill="#1e293b" stroke="#34d399" strokeWidth="2" rx="4"/>
          <text x="160" y="84" fill="#34d399" fontSize="11" textAnchor="middle">R₁={r1}Ω</text>
          <text x="160" y="60" fill="#94a3b8" fontSize="10" textAnchor="middle">I={i1}A</text>

          {/* R2 */}
          <rect x="260" y="68" width="80" height="24" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="4"/>
          <text x="300" y="84" fill="#60a5fa" fontSize="11" textAnchor="middle">R₂={r2}Ω</text>
          <text x="300" y="60" fill="#94a3b8" fontSize="10" textAnchor="middle">I={i2}A</text>

          {/* R3 */}
          <rect x="400" y="68" width="80" height="24" fill="#1e293b" stroke="#f87171" strokeWidth="2" rx="4"/>
          <text x="440" y="84" fill="#f87171" fontSize="11" textAnchor="middle">R₃={r3}Ω</text>
          <text x="440" y="60" fill="#94a3b8" fontSize="10" textAnchor="middle">I={i3}A</text>

          {/* Current dots */}
          {[80, 200, 340, 480, 530].map((x, i) => (
            <circle key={i} cx={x} cy="80" r="4" fill="#a78bfa"/>
          ))}
          {[80, 200, 340, 480, 530].map((x, i) => (
            <circle key={i} cx={x} cy="220" r="4" fill="#a78bfa"/>
          ))}
        </>
      ) : (
        <>
          {/* Battery */}
          <line x1="40" y1="60" x2="40" y2="240" stroke="#7c3aed" strokeWidth="2"/>
          <line x1="30" y1="140" x2="50" y2="140" stroke="#f59e0b" strokeWidth="3"/>
          <line x1="35" y1="155" x2="45" y2="155" stroke="#f59e0b" strokeWidth="2"/>
          <text x="55" y="152" fill="#f59e0b" fontSize="12">{voltage}V</text>

          {/* Top rail */}
          <line x1="40" y1="60" x2="560" y2="60" stroke="#7c3aed" strokeWidth="2"/>
          {/* Bottom rail */}
          <line x1="40" y1="240" x2="560" y2="240" stroke="#7c3aed" strokeWidth="2"/>

          {/* R1 branch */}
          <line x1="160" y1="60" x2="160" y2="100" stroke="#7c3aed" strokeWidth="2"/>
          <rect x="120" y="100" width="80" height="24" fill="#1e293b" stroke="#34d399" strokeWidth="2" rx="4"/>
          <text x="160" y="116" fill="#34d399" fontSize="11" textAnchor="middle">R₁={r1}Ω</text>
          <line x1="160" y1="124" x2="160" y2="240" stroke="#7c3aed" strokeWidth="2"/>
          <text x="160" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle">I={i1}A</text>

          {/* R2 branch */}
          <line x1="300" y1="60" x2="300" y2="100" stroke="#7c3aed" strokeWidth="2"/>
          <rect x="260" y="100" width="80" height="24" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="4"/>
          <text x="300" y="116" fill="#60a5fa" fontSize="11" textAnchor="middle">R₂={r2}Ω</text>
          <line x1="300" y1="124" x2="300" y2="240" stroke="#7c3aed" strokeWidth="2"/>
          <text x="300" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle">I={i2}A</text>

          {/* R3 branch */}
          <line x1="440" y1="60" x2="440" y2="100" stroke="#7c3aed" strokeWidth="2"/>
          <rect x="400" y="100" width="80" height="24" fill="#1e293b" stroke="#f87171" strokeWidth="2" rx="4"/>
          <text x="440" y="116" fill="#f87171" fontSize="11" textAnchor="middle">R₃={r3}Ω</text>
          <line x1="440" y1="124" x2="440" y2="240" stroke="#7c3aed" strokeWidth="2"/>
          <text x="440" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle">I={i3}A</text>
        </>
      )}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Resistors in Series & Parallel ⚡</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 10 PHYSICS
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left Controls */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-4">⚙️ Controls</h2>

            {/* Mode */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Connection Type</p>
              <div className="flex gap-2">
                {["series", "parallel"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize ${
                      mode === m
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* Voltage */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Voltage (V)</span>
                <span className="text-sm font-bold text-yellow-400 bg-yellow-900/40 px-2 py-0.5 rounded">{voltage}V</span>
              </div>
              <input type="range" min="1" max="24" value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-yellow-500"/>
            </div>

            {/* R1 */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">R₁</span>
                <span className="text-sm font-bold text-green-400 bg-green-900/40 px-2 py-0.5 rounded">{r1}Ω</span>
              </div>
              <input type="range" min="1" max="100" value={r1}
                onChange={(e) => setR1(Number(e.target.value))}
                className="w-full accent-green-500"/>
            </div>

            {/* R2 */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">R₂</span>
                <span className="text-sm font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded">{r2}Ω</span>
              </div>
              <input type="range" min="1" max="100" value={r2}
                onChange={(e) => setR2(Number(e.target.value))}
                className="w-full accent-blue-500"/>
            </div>

            {/* R3 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">R₃</span>
                <span className="text-sm font-bold text-red-400 bg-red-900/40 px-2 py-0.5 rounded">{r3}Ω</span>
              </div>
              <input type="range" min="1" max="100" value={r3}
                onChange={(e) => setR3(Number(e.target.value))}
                className="w-full accent-red-500"/>
            </div>
          </div>

          {/* Formula Box */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-2">
              {mode === "series" ? "SERIES FORMULA" : "PARALLEL FORMULA"}
            </p>
            <p className="font-mono text-sm text-center text-purple-300">
              {mode === "series" ? "R = R₁ + R₂ + R₃" : "1/R = 1/R₁ + 1/R₂ + 1/R₃"}
            </p>
            <p className="text-white font-bold text-center mt-2">
              R = {totalR.toFixed(2)} Ω
            </p>
          </div>
        </div>

        {/* Right - Circuit */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Circuit Diagram — {mode === "series" ? "Series" : "Parallel"} Connection
          </h2>
          <CircuitDiagram />

          {/* Voltage drops */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "V₁ across R₁", value: v1, color: "green" },
              { label: "V₂ across R₂", value: v2, color: "blue" },
              { label: "V₃ across R₃", value: v3, color: "red" },
            ].map((item) => (
              <div key={item.label} className={`bg-${item.color}-900/20 rounded-lg p-2 border border-${item.color}-800`}>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className={`text-lg font-bold text-${item.color}-400`}>{item.value}V</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Total Resistance", value: totalR.toFixed(2), unit: "Ω", color: "purple" },
          { label: "Total Current", value: totalCurrent, unit: "A", color: "blue" },
          { label: "Voltage", value: voltage, unit: "V", color: "yellow" },
          { label: "Power", value: (voltage * totalCurrent).toFixed(2), unit: "W", color: "red" },
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
            In <strong className="text-white">series</strong> connection, same current flows through all resistors. Total resistance is the sum.
          </p>
          <p className="text-sm text-gray-300">
            In <strong className="text-white">parallel</strong> connection, same voltage across all resistors. Total resistance is less than the smallest.
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Series: R_total = R₁ + R₂ + R₃",
              "Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃",
              "Series: same current, different voltages",
              "Parallel: same voltage, different currents",
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

export default ResistorsSeries;