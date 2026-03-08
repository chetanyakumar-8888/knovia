import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LensFocalLength = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [objectDistance, setObjectDistance] = useState(30);
  const [focalLength, setFocalLength] = useState(15);
  const [lensType, setLensType] = useState("convex");

  const f = lensType === "convex" ? focalLength : -focalLength;
  const u = -objectDistance;
  const v = 1 / (1 / f - 1 / u);
  const magnification = (v / u).toFixed(2);
  const imageDistance = v.toFixed(2);
  const imageType = v > 0 ? "Real & Inverted" : "Virtual & Erect";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const scale = 3;

    ctx.clearRect(0, 0, W, H);

    // Principal axis
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lens
    ctx.beginPath();
    ctx.moveTo(cx, cy - 80);
    ctx.lineTo(cx, cy + 80);
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 3;
    ctx.stroke();

    if (lensType === "convex") {
      ctx.beginPath();
      ctx.arc(cx - 20, cy, 80, -0.5, 0.5);
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 20, cy, 80, Math.PI - 0.5, Math.PI + 0.5);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(cx + 20, cy, 80, -0.5, 0.5);
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 20, cy, 80, Math.PI - 0.5, Math.PI + 0.5);
      ctx.stroke();
    }

    // Focal points
    const fPos = f * scale;
    ctx.beginPath();
    ctx.arc(cx + fPos, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#34d399";
    ctx.fill();
    ctx.fillStyle = "#34d399";
    ctx.font = "12px monospace";
    ctx.fillText("F", cx + fPos + 8, cy - 8);

    ctx.beginPath();
    ctx.arc(cx - fPos, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#34d399";
    ctx.fill();
    ctx.fillText("F", cx - fPos + 8, cy - 8);

    // Object arrow
    const objX = cx + u * scale;
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, cy - 50);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX - 6, cy - 40);
    ctx.lineTo(objX, cy - 50);
    ctx.lineTo(objX + 6, cy - 40);
    ctx.fillStyle = "#f59e0b";
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.font = "12px monospace";
    ctx.fillText("Object", objX - 20, cy + 20);

    // Image arrow
    const imgX = cx + v * scale;
    const imgHeight = Math.abs(magnification) * 50;
    const imgDir = parseFloat(magnification) < 0 ? 1 : -1;

    ctx.beginPath();
    ctx.moveTo(imgX, cy);
    ctx.lineTo(imgX, cy + imgDir * imgHeight);
    ctx.strokeStyle = v > 0 ? "#f87171" : "#60a5fa";
    ctx.lineWidth = 2;
    ctx.setLineDash(v > 0 ? [] : [4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(imgX - 6, cy + imgDir * imgHeight + (imgDir > 0 ? -10 : 10));
    ctx.lineTo(imgX, cy + imgDir * imgHeight);
    ctx.lineTo(imgX + 6, cy + imgDir * imgHeight + (imgDir > 0 ? -10 : 10));
    ctx.fillStyle = v > 0 ? "#f87171" : "#60a5fa";
    ctx.fill();

    ctx.fillStyle = v > 0 ? "#f87171" : "#60a5fa";
    ctx.font = "12px monospace";
    ctx.fillText("Image", imgX - 20, cy + 20);

  }, [objectDistance, focalLength, lensType]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lab")}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
          >←</button>
          <h1 className="text-xl font-bold">Lens & Focal Length 🔬</h1>
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

            {/* Lens Type */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Lens Type</p>
              <div className="flex gap-2">
                {["convex", "concave"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLensType(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize ${
                      lensType === type
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >{type}</button>
                ))}
              </div>
            </div>

            {/* Object Distance */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Object Distance (u)</span>
                <span className="text-sm font-bold text-yellow-400 bg-yellow-900/40 px-2 py-0.5 rounded">
                  {objectDistance} cm
                </span>
              </div>
              <input
                type="range" min="5" max="100" value={objectDistance}
                onChange={(e) => setObjectDistance(Number(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5 cm</span><span>100 cm</span>
              </div>
            </div>

            {/* Focal Length */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Focal Length (f)</span>
                <span className="text-sm font-bold text-green-400 bg-green-900/40 px-2 py-0.5 rounded">
                  {focalLength} cm
                </span>
              </div>
              <input
                type="range" min="5" max="50" value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5 cm</span><span>50 cm</span>
              </div>
            </div>
          </div>

          {/* Lens Formula */}
          <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-800">
            <p className="text-xs text-purple-400 font-semibold mb-3">LENS FORMULA</p>
            <div className="font-mono text-center text-sm mb-2">
              <span className="text-purple-300">1/v - 1/u = 1/f</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>u = -{objectDistance} cm</p>
              <p>f = {f} cm</p>
              <p className="text-white font-bold">v = {imageDistance} cm</p>
            </div>
          </div>
        </div>

        {/* Right - Ray Diagram */}
        <div className="w-2/3 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Ray Diagram</h2>
          <canvas
            ref={canvasRef}
            width={700}
            height={320}
            className="w-full rounded-lg bg-gray-950"
          />
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span> Object</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span> Real Image</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded-full inline-block"></span> Virtual Image</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span> Focal Point</span>
          </div>
        </div>
      </div>

      {/* 4 Data Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Object Distance", value: objectDistance, unit: "cm", color: "yellow" },
          { label: "Image Distance", value: imageDistance, unit: "cm", color: "red" },
          { label: "Magnification", value: magnification, unit: "x", color: "purple" },
          { label: "Image Type", value: imageType, unit: "", color: "green" },
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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-purple-400 mb-3">📖 Theory for CBSE Exam</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-white">Lens Formula:</strong> 1/v - 1/u = 1/f
            relates object distance, image distance and focal length.
          </p>
          <div className="bg-gray-950 rounded-lg p-3 font-mono text-center text-sm mb-2">
            <span className="text-purple-400">m = v/u = h'/h</span>
          </div>
          <p className="text-sm text-gray-400">
            Convex lens converges light rays. Concave lens diverges light rays.
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="font-semibold text-yellow-400 mb-3">💡 Key Points to Remember</h3>
          <ul className="space-y-2">
            {[
              "All distances measured from optical centre",
              "Distances in direction of light = positive",
              "Convex lens has positive focal length",
              "Concave lens always forms virtual, erect image",
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

export default LensFocalLength;