import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SALTS = [
  {
    name: "NaCl", fullName: "Sodium Chloride", color: "#f8fafc",
    appearance: "White crystalline solid",
    solubility: "Highly soluble in water",
    flameTest: { color: "Yellow", hex: "#fbbf24" },
    tests: [
      { reagent: "AgNO₃", observation: "White precipitate of AgCl", inference: "Cl⁻ ion present" },
      { reagent: "NaOH", observation: "No precipitate", inference: "Not NH₄⁺ or heavy metal" },
      { reagent: "Dilute H₂SO₄", observation: "No reaction", inference: "Not carbonate/sulphide" },
      { reagent: "Flame Test", observation: "Yellow flame", inference: "Na⁺ ion confirmed" },
    ]
  },
  {
    name: "CuSO₄", fullName: "Copper Sulphate", color: "#3b82f6",
    appearance: "Blue crystalline solid",
    solubility: "Soluble in water (blue solution)",
    flameTest: { color: "Green-Blue", hex: "#06b6d4" },
    tests: [
      { reagent: "NaOH", observation: "Blue precipitate of Cu(OH)₂", inference: "Cu²⁺ ion present" },
      { reagent: "BaCl₂", observation: "White precipitate of BaSO₄", inference: "SO₄²⁻ ion present" },
      { reagent: "NH₃ (excess)", observation: "Deep blue solution", inference: "Cu²⁺ confirmed" },
      { reagent: "Flame Test", observation: "Green-blue flame", inference: "Cu²⁺ ion confirmed" },
    ]
  },
  {
    name: "FeCl₃", fullName: "Ferric Chloride", color: "#b45309",
    appearance: "Yellow-brown crystalline solid",
    solubility: "Soluble in water (yellow solution)",
    flameTest: { color: "Orange-Red", hex: "#ea580c" },
    tests: [
      { reagent: "NaOH", observation: "Reddish-brown precipitate Fe(OH)₃", inference: "Fe³⁺ ion present" },
      { reagent: "AgNO₃", observation: "White precipitate of AgCl", inference: "Cl⁻ ion present" },
      { reagent: "KSCN", observation: "Blood red coloration", inference: "Fe³⁺ confirmed" },
      { reagent: "Flame Test", observation: "Orange flame", inference: "Fe³⁺ ion present" },
    ]
  },
  {
    name: "ZnSO₄", fullName: "Zinc Sulphate", color: "#f1f5f9",
    appearance: "White crystalline solid",
    solubility: "Soluble in water (colorless solution)",
    flameTest: { color: "Blue-Green", hex: "#2dd4bf" },
    tests: [
      { reagent: "NaOH", observation: "White precipitate of Zn(OH)₂", inference: "Zn²⁺ ion present" },
      { reagent: "NaOH (excess)", observation: "Precipitate dissolves (amphoteric)", inference: "Zn²⁺ confirmed" },
      { reagent: "BaCl₂", observation: "White precipitate of BaSO₄", inference: "SO₄²⁻ ion present" },
      { reagent: "Flame Test", observation: "Blue-green flame", inference: "Zn²⁺ ion present" },
    ]
  },
];

const SaltAnalysis = () => {
  const navigate = useNavigate();
  const [selectedSalt, setSelectedSalt] = useState(0);
  const [currentTest, setCurrentTest] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);
  const [showFlame, setShowFlame] = useState(false);

  const salt = SALTS[selectedSalt];

  // Tailwind Class Mapper
  const colorMap = {
    purple: { text: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-800" },
    blue: { text: "text-blue-400", bg: "bg-blue-900/20", border: "border-blue-800" },
    green: { text: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800" },
    yellow: { text: "text-amber-400", bg: "bg-amber-900/20", border: "border-amber-800" },
  };

  const handleSelectSalt = (i) => {
    setSelectedSalt(i);
    setCurrentTest(null);
    setCompletedTests([]);
    setShowFlame(false);
  };

  const handleRunTest = (i) => {
    setCurrentTest(i);
    if (!completedTests.includes(i)) {
      setCompletedTests([...completedTests, i]);
    }
    setShowFlame(salt.tests[i].reagent === "Flame Test");
  };

  // Helper to extract Cation (e.g., "NaCl" -> "Na")
  const getCation = (name) => {
    const match = name.match(/^[A-Z][a-z]?/);
    return match ? match[0] : name;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/lab")} className="p-2 bg-gray-900 rounded-full border border-gray-800 hover:bg-gray-800 transition-colors">←</button>
          <h1 className="text-2xl font-black tracking-tight">Qualitative Analysis 🧪</h1>
        </div>
        <div className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
          CBSE Class 11 Chemistry
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Selection */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Select Unknown Salt</h2>
            <div className="space-y-2">
              {SALTS.map((s, i) => (
                <button key={i} onClick={() => handleSelectSalt(i)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-4 ${
                    selectedSalt === i ? "bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-900/20" : "bg-gray-950 border-gray-800 hover:border-gray-600"
                  }`}>
                  <div className="w-10 h-10 rounded-lg shadow-inner flex items-center justify-center font-bold" style={{ backgroundColor: s.color, color: '#000' }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{s.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tight">{s.fullName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Physical Properties</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded shadow-sm" style={{ backgroundColor: salt.color }}></div>
                <span className="text-sm font-medium">{salt.appearance}</span>
              </div>
              <p className="text-xs text-gray-500 italic leading-relaxed">{salt.solubility}</p>
            </div>
          </div>
        </div>

        {/* Center - Interactive Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-[32px] p-8 min-h-[400px] flex flex-col">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8 text-center">Experimental Setup</h2>
            
            <div className="flex flex-1 items-center justify-center gap-12">
              {/* Test Tube Visualization */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-40 group">
                  <div className="absolute inset-0 border-4 border-slate-700/50 rounded-b-full overflow-hidden backdrop-blur-sm">
                    {/* Solution level */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 transition-all duration-700 ease-out"
                      style={{ backgroundColor: salt.color + "44" }}>
                    </div>
                    {/* Reaction Overlay */}
                    {currentTest !== null && !showFlame && (
                      <div className="absolute inset-0 flex flex-col justify-end">
                        {salt.tests[currentTest].observation.toLowerCase().includes("precipitate") && (
                          <div className="h-10 w-full animate-pulse bg-white/20 blur-sm"></div>
                        )}
                        {salt.tests[currentTest].observation.toLowerCase().includes("effervescence") && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-40">
                             <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                             <div className="w-1 h-1 bg-white rounded-full animate-ping delay-75"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-gray-600">Sample Tube</span>
              </div>

              {currentTest !== null && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                   {showFlame ? (
                    <div className="relative">
                      <div className="text-6xl animate-bounce">🔥</div>
                      <div className="absolute inset-0 blur-xl opacity-50 rounded-full" style={{ backgroundColor: salt.flameTest.hex }}></div>
                    </div>
                  ) : (
                    <div className="text-3xl text-gray-700 font-light">＋</div>
                  )}
                </div>
              )}

              {currentTest === null && (
                <div className="text-center text-gray-600 max-w-[200px]">
                  <p className="text-xs uppercase font-black tracking-widest mb-2">Ready for analysis</p>
                  <p className="text-sm italic">Add a reagent to observe chemical changes.</p>
                </div>
              )}
            </div>

            {/* Results Panel */}
            {currentTest !== null && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Observation</p>
                  <p className="text-sm font-medium text-white">{salt.tests[currentTest].observation}</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Inference</p>
                  <p className="text-sm font-medium text-white">{salt.tests[currentTest].inference}</p>
                </div>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Chemical Reagents</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {salt.tests.map((test, i) => (
                <button key={i} onClick={() => handleRunTest(i)}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border flex flex-col gap-2 items-center ${
                    currentTest === i ? "bg-purple-600 border-purple-400 text-white" : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600"
                  }`}>
                  <span>{test.reagent}</span>
                  {completedTests.includes(i) && <span className="text-[10px] text-emerald-500">Completed ✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard label="Identification" val={salt.name} color="purple" map={colorMap} />
        <SummaryCard label="Progress" val={`${completedTests.length}/${salt.tests.length}`} color="blue" map={colorMap} />
        <SummaryCard label="Confirmed Cation" val={getCation(salt.name)} color="green" map={colorMap} />
        <SummaryCard label="Flame Test" val={salt.flameTest.color} color="yellow" map={colorMap} />
      </div>

      {/* Educational Footer */}
      <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
          📖 Exam Theory: Systematic Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="text-sm text-gray-400 space-y-2 leading-relaxed">
            <p><strong>Cation Groups:</strong> Salts are analyzed by dividing cations into groups (0 to VI) based on their solubility products ($K_{sp}$).</p>
            <p><strong>Common Errors:</strong> Always perform the flame test on a clean platinum wire. Use concentrated $HCl$ to make a paste of the salt first.</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <p className="text-xs font-black text-amber-500 uppercase mb-2">🔥 Lab Tip</p>
            <p className="text-sm italic">Silver Nitrate ($AgNO_3$) is the standard reagent for halides. AgCl is white, AgBr is pale yellow, and AgI is bright yellow.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, val, color, map }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">{label}</p>
    <p className={`text-lg font-black ${map[color].text}`}>{val}</p>
  </div>
);

export default SaltAnalysis;