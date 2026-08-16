import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Sparkles,
  ArrowLeftRight,
  RotateCw,
  Compass,
} from "lucide-react";
import "./GradientGenerator.css";

const PRESETS = [
  { name: "Neon Glow",    c1: "#6366f1", c2: "#ec4899", a: 45,  s1: 0, s2: 100, type: "linear" },
  { name: "Ocean Breeze", c1: "#3b82f6", c2: "#10b981", a: 90,  s1: 0, s2: 100, type: "linear" },
  { name: "Sunset Flare", c1: "#f59e0b", c2: "#ef4444", a: 135, s1: 0, s2: 100, type: "linear" },
  { name: "Cyber Violet", c1: "#8b5cf6", c2: "#06b6d4", a: 60,  s1: 0, s2: 100, type: "linear" },
  { name: "Midnight City",c1: "#0f172a", c2: "#3b82f6", a: 180, s1: 0, s2: 100, type: "linear" },
  { name: "Aurora Glow",  c1: "#10b981", c2: "#6366f1", a: 120, s1: 10, s2: 90, type: "linear" },
];

const ANGLE_PRESETS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function GradientGenerator({ onCopy }) {
  const [color1, setColor1] = useState("#6366f1");
  const [stop1,  setStop1]  = useState(0);
  const [color2, setColor2] = useState("#ec4899");
  const [stop2,  setStop2]  = useState(100);
  const [angle,  setAngle]  = useState(90);
  const [type,   setType]   = useState("linear"); // 'linear' | 'radial'
  const [radialShape, setRadialShape] = useState("circle"); // 'circle' | 'ellipse'
  const [copied, setCopied] = useState(false);

  // Validate and format hex color input
  const handleHexChange = (val, setter) => {
    let clean = val.trim();
    if (!clean.startsWith("#")) clean = "#" + clean;
    setter(clean);
  };

  const swapColors = () => {
    setColor1(color2);
    setColor2(color1);
  };

  const cssValue = useMemo(() => {
    if (type === "linear") {
      return `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
    }
    return `radial-gradient(${radialShape} at center, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
  }, [type, angle, color1, stop1, color2, stop2, radialShape]);

  const cssRule = `background: ${cssValue};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssRule);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(cssRule);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (p) => {
    setColor1(p.c1);
    setColor2(p.c2);
    setAngle(p.a);
    setStop1(p.s1 !== undefined ? p.s1 : 0);
    setStop2(p.s2 !== undefined ? p.s2 : 100);
    setType(p.type || "linear");
  };

  return (
    <div className="gg-container">
      {/* Live Preview Box */}
      <div className="gg-preview" style={{ background: cssValue }}>
        <div className="gg-preview-badge">
          {type === "linear" ? `${angle}° Linear` : `Radial (${radialShape})`}
        </div>
      </div>

      {/* Control Grid */}
      <div className="gg-controls">
        {/* Color 1 Card */}
        <div className="gg-card">
          <div className="gg-label-row">
            <span className="gg-label">Color Stop 1</span>
            <span className="gg-label-value">{stop1}%</span>
          </div>
          <div className="gg-color-row">
            <input
              type="color"
              value={color1.length === 7 ? color1 : "#6366f1"}
              onChange={(e) => setColor1(e.target.value)}
              className="gg-color-swatch"
              aria-label="Color 1 picker"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => handleHexChange(e.target.value, setColor1)}
              placeholder="#6366F1"
              maxLength={7}
              className="gg-hex-input"
            />
          </div>
          <div className="gg-slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              value={stop1}
              onChange={(e) => setStop1(Number(e.target.value))}
              className="gg-slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${stop1}%, rgba(255,255,255,0.08) ${stop1}%, rgba(255,255,255,0.08) 100%)`
              }}
            />
          </div>
        </div>

        {/* Color 2 Card */}
        <div className="gg-card">
          <div className="gg-label-row">
            <span className="gg-label">Color Stop 2</span>
            <span className="gg-label-value">{stop2}%</span>
          </div>
          <div className="gg-color-row">
            <input
              type="color"
              value={color2.length === 7 ? color2 : "#ec4899"}
              onChange={(e) => setColor2(e.target.value)}
              className="gg-color-swatch"
              aria-label="Color 2 picker"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => handleHexChange(e.target.value, setColor2)}
              placeholder="#EC4899"
              maxLength={7}
              className="gg-hex-input"
            />
          </div>
          <div className="gg-slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              value={stop2}
              onChange={(e) => setStop2(Number(e.target.value))}
              className="gg-slider"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${stop2}%, rgba(255,255,255,0.08) ${stop2}%, rgba(255,255,255,0.08) 100%)`
              }}
            />
          </div>
        </div>

        {/* Gradient Settings (Angle & Type) */}
        <div className="gg-card">
          <div className="gg-label-row">
            <span className="gg-label">
              {type === "linear" ? "Angle Direction" : "Radial Shape"}
            </span>
            {type === "linear" ? (
              <span className="gg-label-value">{angle}°</span>
            ) : (
              <span className="gg-label-value capitalize">{radialShape}</span>
            )}
          </div>

          {type === "linear" ? (
            <div className="gg-slider-wrap">
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="gg-slider"
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(angle / 360) * 100}%, rgba(255,255,255,0.08) ${(angle / 360) * 100}%, rgba(255,255,255,0.08) 100%)`
                }}
              />
              <div className="gg-angle-pills">
                {ANGLE_PRESETS.map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setAngle(deg)}
                    className={`gg-angle-chip ${angle === deg ? "active" : ""}`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="gg-mode-toggle" style={{ marginTop: 6 }}>
              {["circle", "ellipse"].map((sh) => (
                <button
                  key={sh}
                  type="button"
                  className={`gg-mode-btn ${radialShape === sh ? "active" : ""}`}
                  onClick={() => setRadialShape(sh)}
                >
                  {sh}
                </button>
              ))}
            </div>
          )}

          {/* Type Switcher Bar */}
          <div className="gg-mode-row">
            <div className="gg-mode-toggle flex-1">
              {["linear", "radial"].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`gg-mode-btn ${type === m ? "active" : ""}`}
                  onClick={() => setType(m)}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={swapColors}
              title="Swap color stops"
              className="gg-swap-btn"
            >
              <ArrowLeftRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="gg-presets-card">
        <div className="gg-presets-header">
          <Sparkles size={13} color="#818cf8" />
          <span>Curated Presets:</span>
        </div>
        <div className="gg-presets-list">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              title={p.name}
              className="gg-preset-chip"
              onClick={() => applyPreset(p)}
            >
              <span
                className="gg-preset-dot"
                style={{
                  background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`
                }}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output Code Bar */}
      <div className="gg-output">
        <code>{cssRule}</code>
        <button
          type="button"
          onClick={handleCopy}
          className={`gg-copy-btn ${copied ? "copied" : "default"}`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy CSS
            </>
          )}
        </button>
      </div>
    </div>
  );
}
