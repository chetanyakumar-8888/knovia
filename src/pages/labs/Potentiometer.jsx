import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Potentiometer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [driverEmf, setDriverEmf] = useState(6);
  const [wireLength, setWireLength] = useState(100);
  const [unknownEmf, setUnknownEmf] = useState(2.4);
  const [jockeyPos, setJockeyPos] = useState(50);

  const potentialGradient = driverEmf / wireLength;
  const balancingLength = (unknownEmf / potentialGradient).toFixed(2);
  const voltageAtJockey = (potentialGradient * jockeyPos).toFixed(3);
  const galvReading = (parseFloat(voltageAtJockey) - unknownEmf).toFixed(3);
  const isBalanced = Math.abs(parseFloat(galvReading)) < 0.05;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const wireStartX = 80;
    const wireEndX = W - 80;
    const wireY = 120;
    const wireLen = wireEndX - wireStartX;

    // Driver battery
    ctx.beginPath();
    ctx.moveTo(wireStartX, wireY);
    ctx.lineTo(wireStartX, 60);
    ctx.lineTo(wireEndX, 60);
    ctx.lineTo(wireEndX, wireY);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Battery symbol
    ctx.beginPath();
    ctx.moveTo(wireStartX + 20, 50);
    ctx.lineTo(wireStartX + 20, 70);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(wireStartX + 30, 55);
    ctx.lineTo(wireStartX + 30, 65);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f59e0b";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`E=${driverEmf}V`, wireStartX + 38, 65);

    // Resistance in driver circuit
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(wireEndX - 60, 48, 50, 24);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.strokeRect(wireEndX - 60, 48, 50, 24);
    ctx.fillStyle = "#60a5fa";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("R", wireEndX - 35, 63);

    // Potentiometer wire
    ctx.beginPath();
    ctx.moveTo(wireStartX, wireY);
    ctx.lineTo(wireEndX, wireY);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Wire markings
    for (let i = 0; i <= 10; i++) {
      const x = wireStartX + (i / 10) * wireLen;
      ctx.beginPath();
      ctx.moveTo(x, wireY - 8);
      ctx.lineTo(x, wireY + 8);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${i * 10}`, x, wireY + 20);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("cm", wireEndX + 20, wireY + 20);

    // Jockey position
    const jx = wireStartX + (jockeyPos / wireLength) * wireLen;
    ctx.beginPath();
    ctx.arc(jx, wireY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("J", jx, wireY + 3);

    // Jockey wire going down
    ctx.beginPath();
    ctx.moveTo(jx, wireY + 8);
    ctx.lineTo(jx, wireY + 60);
    ctx.strokeStyle = isBalanced ? "#34d399" : "#f87171";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Galvanometer
    ctx.beginPath();
    ctx.arc(jx, wireY + 85, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.strokeStyle = isBalanced ? "#34d399" : "#f87171";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = isBalanced ? "#34d399" : "#f87171";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("G", jx, wireY + 89);

    // Galvanometer needle
    const needleAngle = parseFloat(galvReading) * 0.5;
    ctx.save();
    ctx.translate(jx, wireY + 85);
    ctx.rotate(Math.max(-0.8, Math.min(0.8, needleAngle)));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -16);
    ctx.strokeStyle = isBalanced ? "#34d399" : "#f87171";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Unknown EMF battery
    const galvBottom = wireY + 85 + 22;
    ctx.beginPath();
    ctx.moveTo(jx, galvBottom);
    ctx.lineTo(jx, galvBottom + 30);
    ctx.lineTo(wireStartX + 60, galvBottom + 30);
    ctx.lineTo(wireStartX + 60, wireY);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Unknown battery symbol
    ctx.beginPath();
    ctx.moveTo(wireStartX + 50, galvBottom + 20);
    ctx.lineTo(wireStartX + 50, galvBottom + 40);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(wireStartX + 60, galvBottom + 25);
    ctx.lineTo(wireStartX + 60, galvBottom + 35);
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#a78bfa";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`ε=${unknownEmf}V`, wireStartX + 70, galvBottom + 35);

    // Balancing length indicator
    const blx = wireStartX + (parseFloat(balancingLength) / wireLength) * wireLen;
    if (blx <= wireEndX) {
      ctx.beginPath();
      ctx.moveTo(blx, wireY - 15);
      ctx.lineTo(blx, wireY + 15);
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#34d399";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`L=${balancingLength}cm`, blx, wireY - 20);
    }

    // Status
    ctx.fillStyle = isBalanced ? "#34d399" : "#f87171";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      isBalanced ? "✓ NULL DEFLECTION — BALANCED!" : `Galvanometer: ${galvReading}V`,
      W / 2, H - 15
    );

  }, [driverEmf, wireLength, unknownEmf, jockeyPos]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Potentiometer ⚡</h1>
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
              { label: "Driver EMF (V)", value: driverEmf, set: setDriverEmf, min: 1, max: 12, color: "yellow", step: 0.1 },
              { label: "Wire Length (cm)", value: wireLength, set: setWireLength, min: 50, max: 200, color: "blue", step: 1 },
              { label: "Unknown EMF (V)", value: unknownEmf, set: setUnknownEmf, min: 0.1, max: 5, color: "purple", step: 0.1 },
              { label: "Jockey Position (cm)", value: jockeyPos, set: setJockeyPos, min: 0, max: wireLength, color: "green", step: 0.5 },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className={`text-sm font-bold text-${item.color}-400 bg-${item.color}-900/40 px-2 py-0.5 rounded`}>
                    {item.value}
                  </span>
                </div>
                <input type="range" min={item.min} max={item.max}
                  step={item.step} value={item.value}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className={`w-full accent-${item.color}-500`}/>
              </div>
            ))}

            <button
              onClick={() => setJockeyPos(Math.min(parseFloat(balancingLength), wireLength))}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium mt-2"
            >⚖️ Auto Balance</button>
          </div>

          {/* Formula */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-2">FORMULA</p>
            <p className="font-mono text-xs text-purple-300 mb-1">k = E/L (potential gradient)</p>
            <p className="font-mono text-xs text-purple-300 mb-2">ε = k × l</p>
            <div className="text-xs text-gray-400 space-y-1 font-mono">
              <p>k = {driverEmf}/{wireLength} = {potentialGradient.toFixed(4)} V/cm</p>
              <p>l = {balancingLength} cm</p>
              <p className="text-white font-bold">ε = {unknownEmf} V</p>
            </div>
          </div>
        </div>

        {/* Right - Circuit */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Potentiometer Circuit</h2>
          <canvas ref={canvasRef} width={600} height={320}
            className="w-full rounded-lg bg-gray-950"/>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Potential Gradient", value: potentialGradient.toFixed(4), unit: "V/cm", color: "purple" },
          { label: "Balancing Length", value: balancingLength, unit: "cm", color: "green" },
          { label: "Voltage at Jockey", value: voltageAtJockey, unit: "V", color: "blue" },
          { label: "Galvanometer", value: galvReading, unit: "V", color: isBalanced ? "green" : "red" },
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
            A <strong className="text-white">potentiometer</strong> measures EMF without drawing any current from the source. It works on the principle of null deflection.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm">
            <span className="text-purple-400">ε = k × l</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Potentiometer measures EMF accurately (no current drawn)",
              "Potential gradient k = V/L (V per unit length)",
              "Balance point: galvanometer shows zero deflection",
              "Driver EMF must be greater than unknown EMF",
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

export default Potentiometer;