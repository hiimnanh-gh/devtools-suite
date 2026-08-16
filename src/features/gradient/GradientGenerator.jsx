import React, { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import "./GradientGenerator.css";

const PRESETS = [
  { name: "Neon Glow",     c1: "#6366f1", c2: "#ec4899", a: 45  },
  { name: "Ocean Breeze",  c1: "#3b82f6", c2: "#10b981", a: 90  },
  { name: "Sunset Flare",  c1: "#f59e0b", c2: "#ef4444", a: 135 },
  { name: "Cyber Violet",  c1: "#8b5cf6", c2: "#06b6d4", a: 60  },
];

export default function GradientGenerator({ onCopy }) {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#a855f7");
  const [angle,  setAngle]  = useState(90);
  const [type,   setType]   = useState("linear");
  const [copied, setCopied] = useState(false);

  const cssValue =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;
  const cssRule = `background: ${cssValue};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssRule);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(cssRule);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Preview */}
      <div className="gg-preview" style={{ background: cssValue }}>
        <div className="gg-preview-badge">
          {type === "linear" ? `${angle}° Linear` : "Radial"}
        </div>
      </div>

      {/* Controls */}
      <div className="gg-controls">
        {/* Colors */}
        <div className="gg-card">
          <span className="gg-label">Color Stops</span>
          <div className="gg-color-row">
            <div className="gg-color-pill">
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="gg-color-swatch" />
              <span>{color1.toUpperCase()}</span>
            </div>
            <div className="gg-color-pill">
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="gg-color-swatch" />
              <span>{color2.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Angle */}
        <div className="gg-card">
          <div className="gg-label-row">
            <span className="gg-label" style={{ margin: 0 }}>Angle</span>
            <span className={`gg-label-value ${type === "radial" ? "gg-label-disabled" : ""}`}>
              {type === "linear" ? `${angle}°` : "N/A"}
            </span>
          </div>
          <input
            type="range" min="0" max="360" value={angle}
            disabled={type === "radial"}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="gg-slider"
          />
          <div className="gg-slider-ticks"><span>0°</span><span>180°</span><span>360°</span></div>
        </div>

        {/* Mode */}
        <div className="gg-card">
          <span className="gg-label">Mode</span>
          <div className="gg-mode-toggle">
            {["linear", "radial"].map((m) => (
              <button key={m} className={`gg-mode-btn ${type === m ? "active" : ""}`} onClick={() => setType(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Presets + Output */}
      <div className="gg-bottom">
        {/* Presets */}
        <div className="gg-presets-row">
          <span className="gg-presets-label">
            <Sparkles size={12} color="#818cf8" /> Quick Presets
          </span>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              title={p.name}
              className="gg-preset-dot"
              style={{ background: `linear-gradient(${p.a}deg, ${p.c1}, ${p.c2})` }}
              onClick={() => { setColor1(p.c1); setColor2(p.c2); setAngle(p.a); setType("linear"); }}
              aria-label={`Apply ${p.name}`}
            />
          ))}
        </div>

        {/* CSS Output */}
        <div className="gg-output">
          <code>{cssRule}</code>
          <button onClick={handleCopy} className={`gg-copy-btn ${copied ? "copied" : "default"}`}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy CSS</>}
          </button>
        </div>
      </div>
    </div>
  );
}
