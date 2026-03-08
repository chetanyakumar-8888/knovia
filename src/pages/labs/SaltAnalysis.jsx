import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SALTS = [
  {
    name: "NaCl", fullName: "Sodium Chloride", color: "#e2e8f0",
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
    name: "FeCl₃", fullName: "Ferric Chloride", color: "#f97316",
    appearance: "Yellow-brown crystalline solid",
    solubility: "Soluble in water (yellow solution)",
    flameTest: { color: "Orange", hex: "#f97316" },
    tests: [
      { reagent: "NaOH", observation: "Reddish-brown precipitate Fe(OH)₃", inference: "Fe³⁺ ion present" },
      { reagent: "AgNO₃", observation: "White precipitate of AgCl", inference: "Cl⁻ ion present" },
      { reagent: "KSCN", observation: "Blood red coloration", inference: "Fe³⁺ confirmed" },
      { reagent: "Flame Test", observation: "Orange flame", inference: "Fe³⁺ ion present" },
    ]
  },
  {
    name: "Na₂CO₃", fullName: "Sodium Carbonate", color: "#94a3b8",
    appearance: "White powder (washing soda)",
    solubility: "Soluble in water (alkaline solution)",
    flameTest: { color: "Yellow", hex: "#fbbf24" },
    tests: [
      { reagent: "Dilute HCl", observation: "Brisk effervescence of CO₂", inference: "CO₃²⁻ ion present" },
      { reagent: "CaCl₂", observation: "White precipitate of CaCO₃", inference: "CO₃²⁻ confirmed" },
      { reagent: "Litmus", observation: "Turns blue (alkaline)", inference: "Alkaline solution" },
      { reagent: "Flame Test", observation: "Yellow flame", inference: "Na⁺ ion confirmed" },
    ]
  },
  {
    name: "ZnSO₄", fullName: "Zinc Sulphate", color: "#86efac",
    appearance: "White crystalline solid",
    solubility: "Soluble in water (colorless solution)",
    flameTest: { color: "Blue-Green", hex: "#34d399" },
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
    if (salt.tests[i].reagent === "Flame Test") setShowFlame(true);
    else setShowFlame(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Salt Analysis 🧂</h1>
        </div>
        <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
          CBSE CLASS 11 CHEMISTRY
        </span>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 mb-4">
        {/* Left - Salt selection */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-3">🧂 Select Salt</h2>
            <div className="space-y-2">
              {SALTS.map((s, i) => (
                <button key={i} onClick={() => handleSelectSalt(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 ${
                    selectedSalt === i
                      ? "bg-purple-900/50 border border-purple-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}>
                  <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                  <div>
                    <p className="font-bold text-white">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.fullName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Salt properties */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-purple-400 mb-3">Properties</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: salt.color }}></span>
                <span className="text-gray-300">{salt.appearance}</span>
              </div>
              <p className="text-gray-400 text-xs">{salt.solubility}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">Flame:</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold text-black"
                  style={{ backgroundColor: salt.flameTest.hex }}>
                  {salt.flameTest.color}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Testing area */}
        <div className="w-2/3 flex flex-col gap-4">
          {/* Test tube visualization */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">🧪 Testing Area</h2>
            <div className="flex gap-6 items-center justify-center min-h-32">

              {/* Salt test tube */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-28">
                  <div className="absolute inset-x-2 top-0 bottom-4 rounded-b-full border-2 border-purple-500 overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-full"
                      style={{ backgroundColor: salt.color + "66" }}></div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 rounded-b-full"
                    style={{ backgroundColor: salt.color }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{salt.name}</p>
              </div>

              {/* Plus sign */}
              {currentTest !== null && (
                <>
                  <span className="text-2xl text-gray-500">+</span>

                  {/* Reagent test tube */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-28">
                      <div className="absolute inset-x-2 top-0 bottom-4 rounded-b-full border-2 border-blue-500 overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-full bg-blue-500/30"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{salt.tests[currentTest].reagent}</p>
                  </div>

                  <span className="text-2xl text-gray-500">→</span>

                  {/* Result */}
                  <div className="flex flex-col items-center">
                    {showFlame ? (
                      <div className="w-16 h-28 flex items-center justify-center">
                        <div className="text-4xl animate-bounce">🔥</div>
                      </div>
                    ) : (
                      <div className="relative w-16 h-28">
                        <div className="absolute inset-x-2 top-0 bottom-4 rounded-b-full border-2 border-green-500 overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 h-20 rounded-b-full"
                            style={{ backgroundColor: salt.color + "99" }}></div>
                          {salt.tests[currentTest].observation.includes("precipitate") && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b-full bg-white/40"></div>
                          )}
                          {salt.tests[currentTest].observation.includes("effervescence") && (
                            <div className="absolute inset-0 flex flex-wrap gap-0.5 p-1 items-end justify-center">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                                  style={{ animationDelay: `${i * 0.1}s` }}></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Result</p>
                  </div>
                </>
              )}

              {currentTest === null && (
                <div className="text-center text-gray-500">
                  <p className="text-4xl mb-2">👇</p>
                  <p className="text-sm">Select a test below</p>
                </div>
              )}
            </div>

            {/* Observation box */}
            {currentTest !== null && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-blue-950/50 rounded-lg p-3 border border-blue-800">
                  <p className="text-xs text-blue-400 font-semibold mb-1">OBSERVATION</p>
                  <p className="text-sm text-white">{salt.tests[currentTest].observation}</p>
                </div>
                <div className="bg-green-950/50 rounded-lg p-3 border border-green-800">
                  <p className="text-xs text-green-400 font-semibold mb-1">INFERENCE</p>
                  <p className="text-sm text-white">{salt.tests[currentTest].inference}</p>
                </div>
              </div>
            )}
          </div>

          {/* Test buttons */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">
              Chemical Tests ({completedTests.length}/{salt.tests.length} done)
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {salt.tests.map((test, i) => (
                <button key={i} onClick={() => handleRunTest(i)}
                  className={`px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between ${
                    currentTest === i
                      ? "bg-purple-600 text-white"
                      : completedTests.includes(i)
                      ? "bg-green-900/40 border border-green-700 text-green-300"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}>
                  <span>+ {test.reagent}</span>
                  {completedTests.includes(i) && <span className="text-green-400">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Salt", value: salt.name, unit: "", color: "purple" },
          { label: "Tests Done", value: `${completedTests.length}/${salt.tests.length}`, unit: "", color: "blue" },
          { label: "Cation", value: salt.name.replace(/[₀-₉]/g, '').split(/(?=[A-Z])/)[0], unit: "", color: "green" },
          { label: "Flame Color", value: salt.flameTest.color, unit: "", color: "yellow" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold text-${card.color}-400`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Theory + Key Points */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-white">Salt Analysis</strong> (Systematic Qualitative Analysis) identifies cations and anions in unknown salts through systematic chemical tests.
          </p>
          <p className="text-sm text-gray-400">
            Tests include: dry tests (appearance, flame), wet tests (acid group, basic radical).
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Flame test: Na=yellow, K=violet, Cu=green, Ca=brick red",
              "AgNO₃ test: white ppt=Cl⁻, yellow=I⁻, pale yellow=Br⁻",
              "NaOH test identifies cations (Cu²⁺=blue, Fe³⁺=brown)",
              "BaCl₂ gives white ppt with SO₄²⁻ ions",
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

export default SaltAnalysis;