import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const RefractionPrism = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(60);
  const [incidence, setIncidence] = useState(45);
  const [material, setMaterial] = useState("glass");

  const materials = {
    glass: { n: 1.5, color: "#93c5fd", label: "Glass (n=1.5)" },
    diamond: { n: 2.42, color: "#e879f9", label: "Diamond (n=2.42)" },
    water: { n: 1.33, color: "#67e8f9", label: "Water (n=1.33)" },
    quartz: { n: 1.46, color: "#86efac", label: "Quartz (n=1.46)" },
  };

  const n = materials[material].n;
  const A = angle;
  const i1 = incidence;
  const r1 = (Math.asin(Math.sin(i1 * Math.PI / 180) / n) * 180 / Math.PI).toFixed(2);
  const r2 = (A - parseFloat(r1)).toFixed(2);
  const i2Raw = Math.asin(n * Math.sin(parseFloat(r2) * Math.PI / 180)) * 180 / Math.PI;
  const i2 = isNaN(i2Raw) ? "TIR" : i2Raw.toFixed(2);
  const deviation = i2 === "TIR" ? "TIR" : (i1 + parseFloat(i2) - A).toFixed(2);
  const criticalAngle = (Math.asin(1 / n) * 180 / Math.PI).toFixed(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 30;
    const size = 120;

    // Prism vertices
    const top = { x: cx, y: cy - size };
    const left = { x: cx - size * Math.tan(angle * Math.PI / 360), y: cy + size * 0.3 };
    const right = { x: cx + size * Math.tan(angle * Math.PI / 360), y: cy + size * 0.3 };

    // Draw prism
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.closePath();
    ctx.fillStyle = materials[material].color + "33";
    ctx.fill();
    ctx.strokeStyle = materials[material].color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Angle label
    ctx.fillStyle = "#fbbf24";
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`A=${angle}°`, top.x, top.y - 10);

    // Incident ray
    const leftMidX = (top.x + left.x) / 2;
    const leftMidY = (top.y + left.y) / 2;
    const incRad = (90 - incidence) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(leftMidX - Math.cos(incRad) * 120, leftMidY - Math.sin(incRad) * 120);
    ctx.lineTo(leftMidX, leftMidY);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Normal at entry
    const normAngle = Math.atan2(left.y - top.y, left.x - top.x) + Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(leftMidX - Math.cos(normAngle) * 60, leftMidY - Math.sin(normAngle) * 60);
    ctx.lineTo(leftMidX + Math.cos(normAngle) * 60, leftMidY + Math.sin(normAngle) * 60);
    ctx.strokeStyle = "rgba(148,163,184,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    if (i2 !== "TIR") {
      // Refracted ray inside prism
      const r1Rad = parseFloat(r1) * Math.PI / 180;
      const insideAngle = normAngle - r1Rad;
      const rightMidX = (top.x + right.x) / 2;
      const rightMidY = (top.y + right.y) / 2;

      ctx.beginPath();
      ctx.moveTo(leftMidX, leftMidY);
      ctx.lineTo(rightMidX, rightMidY);
      ctx.strokeStyle = materials[material].color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emergent ray - dispersion effect
      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];
      colors.forEach((color, idx) => {
        const spread = (idx - 3) * 3;
        const exitAngle = Math.atan2(right.y - top.y, right.x - top.x) - Math.PI / 2;
        const emergentAngle = exitAngle + (parseFloat(i2) + spread) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(rightMidX, rightMidY);
        ctx.lineTo(
          rightMidX + Math.cos(emergentAngle) * 130,
          rightMidY + Math.sin(emergentAngle) * 130
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Labels
      ctx.fillStyle = "#fbbf24";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`i=${i1}°`, leftMidX - 110, leftMidY - 20);
      ctx.fillStyle = materials[material].color;
      ctx.fillText(`r₁=${r1}°`, leftMidX + 10, leftMidY + 20);
      ctx.fillText(`r₂=${r2}°`, rightMidX - 50, rightMidY - 10);
    } else {
      // TIR label
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Total Internal Reflection!", cx, cy + 80);
    }

    // Material label
    ctx.fillStyle = materials[material].color;
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(materials[material].label, cx, cy + size * 0.3 + 25);

  }, [angle, incidence, material]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Refraction through Prism 🔺</h1>
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

            {/* Material */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Prism Material</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(materials).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setMaterial(key)}
                    className={`py-2 rounded-lg text-xs font-medium capitalize ${
                      material === key
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >{key}</button>
                ))}
              </div>
            </div>

            {/* Prism Angle */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Prism Angle (A)</span>
                <span className="text-sm font-bold text-yellow-400 bg-yellow-900/40 px-2 py-0.5 rounded">
                  {angle}°
                </span>
              </div>
              <input type="range" min="30" max="90" value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-yellow-500"/>
            </div>

            {/* Angle of Incidence */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Angle of Incidence (i)</span>
                <span className="text-sm font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded">
                  {incidence}°
                </span>
              </div>
              <input type="range" min="10" max="85" value={incidence}
                onChange={(e) => setIncidence(Number(e.target.value))}
                className="w-full accent-blue-500"/>
            </div>
          </div>

          {/* Snell's Law */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-2">SNELL'S LAW</p>
            <p className="font-mono text-sm text-center text-purple-300 mb-2">
              n₁ sin i = n₂ sin r
            </p>
            <div className="text-xs text-gray-400 space-y-1 font-mono">
              <p>n = {n}</p>
              <p>r₁ = {r1}°</p>
              <p>r₂ = {r2}°</p>
              <p>i₂ = {i2}{i2 !== "TIR" ? "°" : ""}</p>
              <p className="text-white font-bold">δ = {deviation}{deviation !== "TIR" ? "°" : ""}</p>
            </div>
          </div>
        </div>

        {/* Right - Diagram */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Ray Diagram</h2>
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="w-full rounded-lg bg-gray-950"
          />
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-yellow-400 inline-block"></span> Incident ray
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 inline-block" style={{backgroundColor: materials[material].color}}></span> Refracted ray
            </span>
            <span className="flex items-center gap-1">
              <span className="w-8 h-3 inline-block rounded" style={{background: "linear-gradient(to right, red, orange, yellow, green, blue, violet)"}}></span> Dispersion
            </span>
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Angle of Refraction r₁", value: r1, unit: "°", color: "blue" },
          { label: "Emergent Angle i₂", value: i2, unit: i2 !== "TIR" ? "°" : "", color: "green" },
          { label: "Angle of Deviation", value: deviation, unit: deviation !== "TIR" ? "°" : "", color: "purple" },
          { label: "Critical Angle", value: criticalAngle, unit: "°", color: "yellow" },
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
            When light passes through a prism it undergoes <strong className="text-white">refraction</strong> at both surfaces. White light splits into spectrum due to <strong className="text-white">dispersion</strong>.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm">
            <span className="text-purple-400">δ = i₁ + i₂ - A</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "Minimum deviation: i₁ = i₂ and r₁ = r₂ = A/2",
              "Dispersion: violet deviates most, red deviates least",
              "Critical angle: sin C = 1/n",
              "TIR occurs when angle > critical angle",
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

export default RefractionPrism;