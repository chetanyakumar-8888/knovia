import { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACTIONS = [
  {
    name: "Combustion",
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    type: "Exothermic", color: "#ef4444", emoji: "🔥",
    reactants: ["Methane (CH₄)", "Oxygen (O₂)"],
    products: ["Carbon Dioxide (CO₂)", "Water (H₂O)"],
    energy: -890,
    observations: "Blue flame, heat and light produced, CO₂ turns limewater milky",
    realLife: "Gas stoves, engines, candles",
  },
  {
    name: "Photosynthesis",
    equation: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
    type: "Endothermic", color: "#22c55e", emoji: "🌿",
    reactants: ["Carbon Dioxide (CO₂)", "Water (H₂O)"],
    products: ["Glucose (C₆H₁₂O₆)", "Oxygen (O₂)"],
    energy: +2803,
    observations: "Occurs in chloroplasts, requires sunlight, O₂ released",
    realLife: "All green plants, algae",
  },
  {
    name: "Neutralization",
    equation: "HCl + NaOH → NaCl + H₂O",
    type: "Exothermic", color: "#f59e0b", emoji: "⚗️",
    reactants: ["Hydrochloric Acid (HCl)", "Sodium Hydroxide (NaOH)"],
    products: ["Sodium Chloride (NaCl)", "Water (H₂O)"],
    energy: -57,
    observations: "pH changes from acidic to neutral, slight temperature rise",
    realLife: "Antacids, water treatment",
  },
  {
    name: "Rusting",
    equation: "4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃",
    type: "Oxidation", color: "#f97316", emoji: "🔩",
    reactants: ["Iron (Fe)", "Oxygen (O₂)", "Water (H₂O)"],
    products: ["Iron Hydroxide Fe(OH)₃"],
    energy: -824,
    observations: "Reddish-brown deposit forms on iron surface",
    realLife: "Iron bridges, nails, tools",
  },
  {
    name: "Electrolysis of Water",
    equation: "2H₂O → 2H₂ + O₂",
    type: "Endothermic", color: "#3b82f6", emoji: "⚡",
    reactants: ["Water (H₂O)", "Electricity"],
    products: ["Hydrogen (H₂)", "Oxygen (O₂)"],
    energy: +572,
    observations: "Bubbles at both electrodes, H₂:O₂ ratio = 2:1",
    realLife: "Hydrogen fuel cells, industrial H₂ production",
  },
  {
    name: "Displacement Reaction",
    equation: "Zn + CuSO₄ → ZnSO₄ + Cu",
    type: "Redox", color: "#8b5cf6", emoji: "🔄",
    reactants: ["Zinc (Zn)", "Copper Sulphate (CuSO₄)"],
    products: ["Zinc Sulphate (ZnSO₄)", "Copper (Cu)"],
    energy: -217,
    observations: "Blue solution fades, reddish copper deposited on zinc",
    realLife: "Metal extraction, electroplating",
  },
];

const ChemicalReactions = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const reaction = REACTIONS[selected];

  const handleReact = () => {
    setAnimating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setAnimating(false); return 100; }
        return p + 2;
      });
    }, 50);
  };

  const handleReset = () => { setProgress(0); setAnimating(false); };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/lab")}
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">←</button>
            <h1 className="text-base sm:text-xl font-bold">Chemical Reactions ⚗️</h1>
          </div>
          <span className="hidden sm:block text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
            CBSE CLASS 10 CHEMISTRY
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* Reaction Viewer — FIRST on mobile */}
        <div className="w-full flex flex-col gap-4 mb-6 lg:hidden">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold" style={{ color: reaction.color }}>{reaction.emoji} {reaction.name}</h2>
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: reaction.color + "33", color: reaction.color }}>{reaction.type}</span>
            </div>
            <div className="bg-gray-950 rounded-xl p-4 text-center mb-4">
              <p className="font-mono text-base" style={{ color: reaction.color }}>{reaction.equation}</p>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-red-400 font-semibold mb-2">REACTANTS</p>
                {reaction.reactants.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-xs text-gray-300">{r}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-1">{animating ? "⚡" : progress === 100 ? "✅" : "→"}</div>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-100"
                    style={{ width: `${progress}%`, backgroundColor: reaction.color }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}%</p>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-green-400 font-semibold mb-2">PRODUCTS</p>
                {reaction.products.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1" style={{ opacity: progress / 100 }}>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-xs text-gray-300">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            {progress > 0 && (
              <div className="bg-blue-950/50 rounded-lg p-3 border border-blue-800 mb-3">
                <p className="text-xs text-blue-400 font-semibold mb-1">👁️ OBSERVATION</p>
                <p className="text-sm text-white">{reaction.observations}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleReact} disabled={animating}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50">
                {animating ? "⚡ Reacting..." : "▶ Start Reaction"}
              </button>
              <button onClick={handleReset}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600">↺ Reset</button>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <p className="text-xs text-purple-400 font-semibold mb-1">🌍 Real Life Applications</p>
            <p className="text-sm text-gray-300">{reaction.realLife}</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          {/* Left - Reaction selection */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-purple-400 mb-3">⚗️ Select Reaction</h2>
              <div className="space-y-2">
                {REACTIONS.map((r, i) => (
                  <button key={i} onClick={() => { setSelected(i); handleReset(); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${selected === i ? "bg-purple-900/50 border border-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                    <span>{r.emoji}</span>
                    <div>
                      <p className="font-bold text-white">{r.name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: r.color + "33", color: r.color }}>{r.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Reaction viewer — desktop only */}
          <div className="hidden lg:flex w-full lg:w-2/3 flex-col gap-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold" style={{ color: reaction.color }}>{reaction.emoji} {reaction.name}</h2>
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: reaction.color + "33", color: reaction.color }}>{reaction.type}</span>
              </div>
              <div className="bg-gray-950 rounded-xl p-4 text-center mb-4">
                <p className="font-mono text-lg" style={{ color: reaction.color }}>{reaction.equation}</p>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-semibold mb-2">REACTANTS</p>
                  {reaction.reactants.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span className="text-xs text-gray-300">{r}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-1">{animating ? "⚡" : progress === 100 ? "✅" : "→"}</div>
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-100"
                      style={{ width: `${progress}%`, backgroundColor: reaction.color }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-green-400 font-semibold mb-2">PRODUCTS</p>
                  {reaction.products.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1" style={{ opacity: progress / 100 }}>
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      <span className="text-xs text-gray-300">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              {progress > 0 && (
                <div className="bg-blue-950/50 rounded-lg p-3 border border-blue-800 mb-3">
                  <p className="text-xs text-blue-400 font-semibold mb-1">👁️ OBSERVATION</p>
                  <p className="text-sm text-white">{reaction.observations}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={handleReact} disabled={animating}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 disabled:opacity-50">
                  {animating ? "⚡ Reacting..." : "▶ Start Reaction"}
                </button>
                <button onClick={handleReset}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600">↺ Reset</button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <p className="text-xs text-purple-400 font-semibold mb-1">🌍 Real Life Applications</p>
              <p className="text-sm text-gray-300">{reaction.realLife}</p>
            </div>
          </div>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Reaction Type", value: reaction.type, unit: "", color: "purple" },
            { label: "Energy Change", value: reaction.energy, unit: "kJ/mol", color: reaction.energy < 0 ? "red" : "green" },
            { label: "Reactants", value: reaction.reactants.length, unit: "", color: "blue" },
            { label: "Products", value: reaction.products.length, unit: "", color: "yellow" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong className="text-white">Chemical reactions</strong> involve breaking of bonds in reactants and formation of new bonds in products with energy change.
            </p>
            <p className="text-sm text-gray-400">Exothermic reactions release energy. Endothermic reactions absorb energy.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
            <ul className="space-y-2">
              {[
                "Combination: A + B → AB",
                "Decomposition: AB → A + B",
                "Displacement: A + BC → AC + B",
                "Double Displacement: AB + CD → AD + CB",
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

export default ChemicalReactions;