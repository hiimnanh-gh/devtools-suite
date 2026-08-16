import React, { useState, useMemo } from "react";
import {
  Layers,
  Copy,
  Check,
  Sparkles,
  Sliders,
  RotateCcw,
} from "lucide-react";
import "../shared.css";
import "./ShadowGenerator.css";

// ── SliderField declared OUTSIDE component to prevent DOM remount on drag ──
function SliderField({ label, min, max, value, onChange, unit = "px" }) {
  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100)
  );

  return (
    <div className="sg-field">
      <div className="sg-field-label">
        <span>{label}</span>
        <span className="sg-field-value">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sg-slider"
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, rgba(255,255,255,0.08) ${percentage}%, rgba(255,255,255,0.08) 100%)`,
        }}
      />
    </div>
  );
}

const SHADOW_PRESETS = [
  { name: "Soft Elevation", x: 0, y: 10, blur: 25, spread: -5, opacity: 25, color: "#000000", inset: false },
  { name: "Floating Card",  x: 0, y: 20, blur: 40, spread: -10, opacity: 35, color: "#000000", inset: false },
  { name: "Sharp Layer",    x: 6, y: 6, blur: 0, spread: 0, opacity: 50, color: "#000000", inset: false },
  { name: "Neon Glow",      x: 0, y: 0, blur: 30, spread: 5, opacity: 60, color: "#6366f1", inset: false },
  { name: "Inner Depth",    x: 0, y: 4, blur: 15, spread: 2, opacity: 40, color: "#000000", inset: true },
];

const GLASS_PRESETS = [
  { name: "Frosted Clean", blur: 16, opacity: 15, border: 20, bgHex: "#ffffff" },
  { name: "Deep Frost",    blur: 30, opacity: 25, border: 30, bgHex: "#ffffff" },
  { name: "Dark Glass",    blur: 20, opacity: 35, border: 15, bgHex: "#0f172a" },
  { name: "Neon Purple",   blur: 18, opacity: 20, border: 35, bgHex: "#8b5cf6" },
];

export default function ShadowGenerator({ onCopy }) {
  const [mode, setMode] = useState("shadow"); // 'shadow' | 'glass'

  // Box-Shadow state
  const [x,       setX]       = useState(0);
  const [y,       setY]       = useState(10);
  const [blur,    setBlur]    = useState(25);
  const [spread,  setSpread]  = useState(-5);
  const [color,   setColor]   = useState("#000000");
  const [opacity, setOpacity] = useState(30);
  const [inset,   setInset]   = useState(false);

  // Glassmorphism state
  const [gBlur,    setGBlur]    = useState(16);
  const [gOpacity, setGOpacity] = useState(15);
  const [gBorder,  setGBorder]  = useState(20);
  const [gColor,   setGColor]   = useState("#ffffff");

  const [copied, setCopied] = useState(false);

  // Convert hex + opacity into RGBA
  const hexToRgba = (hexStr, alphaPercent) => {
    let hex = hexStr.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length !== 6) hex = "000000";
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = (alphaPercent / 100).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const shadowRgba = useMemo(() => hexToRgba(color, opacity), [color, opacity]);
  const glassBgRgba = useMemo(() => hexToRgba(gColor, gOpacity), [gColor, gOpacity]);
  const glassBorderRgba = useMemo(() => hexToRgba(gColor, gBorder), [gColor, gBorder]);

  const shadowValue = useMemo(() => {
    return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${shadowRgba}`;
  }, [x, y, blur, spread, shadowRgba, inset]);

  const cssOutput = useMemo(() => {
    if (mode === "shadow") {
      return `box-shadow: ${shadowValue};`;
    }
    return [
      `background: ${glassBgRgba};`,
      `backdrop-filter: blur(${gBlur}px);`,
      `-webkit-backdrop-filter: blur(${gBlur}px);`,
      `border: 1px solid ${glassBorderRgba};`,
      `border-radius: 16px;`,
    ].join("\n");
  }, [mode, shadowValue, glassBgRgba, glassBorderRgba, gBlur]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(cssOutput);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyShadowPreset = (p) => {
    setX(p.x);
    setY(p.y);
    setBlur(p.blur);
    setSpread(p.spread);
    setOpacity(p.opacity);
    setColor(p.color);
    setInset(p.inset);
  };

  const applyGlassPreset = (p) => {
    setGBlur(p.blur);
    setGOpacity(p.opacity);
    setGBorder(p.border);
    setGColor(p.bgHex);
  };

  return (
    <div>
      {/* Mode Toggle */}
      <div className="sg-mode-bar">
        <button
          type="button"
          className={`sg-mode-btn ${mode === "shadow" ? "active" : ""}`}
          onClick={() => setMode("shadow")}
        >
          <Layers size={14} /> Box Shadow
        </button>
        <button
          type="button"
          className={`sg-mode-btn ${mode === "glass" ? "active" : ""}`}
          onClick={() => setMode("glass")}
        >
          <Sparkles size={14} /> Glassmorphism
        </button>
      </div>

      {/* Live Preview Canvas */}
      <div className={`sg-canvas ${mode === "glass" ? "glass-mode" : ""}`}>
        <div
          className={`sg-preview-card ${mode === "shadow" ? "shadow-mode" : "glass-mode"}`}
          style={
            mode === "shadow"
              ? { boxShadow: shadowValue }
              : {
                  background: glassBgRgba,
                  backdropFilter: `blur(${gBlur}px)`,
                  WebkitBackdropFilter: `blur(${gBlur}px)`,
                  border: `1px solid ${glassBorderRgba}`,
                  borderRadius: "16px",
                }
          }
        >
          {mode === "shadow" ? "Shadow Preview" : "Frosted Glass"}
        </div>
      </div>

      {/* Preset Chips */}
      <div className="sg-presets-row">
        <span className="sg-presets-label">
          <Sparkles size={12} color="#818cf8" /> Presets:
        </span>
        <div className="sg-presets-list">
          {mode === "shadow"
            ? SHADOW_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyShadowPreset(p)}
                  className="sg-preset-chip"
                >
                  {p.name}
                </button>
              ))
            : GLASS_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyGlassPreset(p)}
                  className="sg-preset-chip"
                >
                  {p.name}
                </button>
              ))}
        </div>
      </div>

      {/* Controls */}
      {mode === "shadow" ? (
        <div className="sg-controls">
          <SliderField label="X Offset" min={-60} max={60} value={x} onChange={setX} />
          <SliderField label="Y Offset" min={-60} max={60} value={y} onChange={setY} />
          <SliderField label="Blur Radius" min={0} max={100} value={blur} onChange={setBlur} />
          <SliderField label="Spread Radius" min={-30} max={60} value={spread} onChange={setSpread} />
          <SliderField label="Opacity" min={0} max={100} value={opacity} onChange={setOpacity} unit="%" />

          {/* Color & Inset Card */}
          <div className="sg-field">
            <div className="sg-field-label">
              <span>Shadow Color</span>
              <span className="sg-field-value">{color.toUpperCase()}</span>
            </div>
            <div className="sg-color-row">
              <input
                type="color"
                value={color.length === 7 ? color : "#000000"}
                onChange={(e) => setColor(e.target.value)}
                className="sg-color-swatch"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                maxLength={7}
                placeholder="#000000"
                className="sg-hex-input"
              />
            </div>
            <div className="sg-toggle-row">
              <button
                type="button"
                className={`sg-toggle ${inset ? "on" : ""}`}
                onClick={() => setInset((p) => !p)}
                aria-label="Toggle Inset Shadow"
              />
              <span className="sg-toggle-label">Inset Shadow</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="sg-controls">
          <SliderField label="Backdrop Blur" min={0} max={50} value={gBlur} onChange={setGBlur} />
          <SliderField label="Background Opacity" min={0} max={100} value={gOpacity} onChange={setGOpacity} unit="%" />
          <SliderField label="Border Opacity" min={0} max={100} value={gBorder} onChange={setGBorder} unit="%" />

          {/* Glass Tint Color */}
          <div className="sg-field">
            <div className="sg-field-label">
              <span>Glass Tint</span>
              <span className="sg-field-value">{gColor.toUpperCase()}</span>
            </div>
            <div className="sg-color-row">
              <input
                type="color"
                value={gColor.length === 7 ? gColor : "#ffffff"}
                onChange={(e) => setGColor(e.target.value)}
                className="sg-color-swatch"
              />
              <input
                type="text"
                value={gColor}
                onChange={(e) => setGColor(e.target.value)}
                maxLength={7}
                placeholder="#FFFFFF"
                className="sg-hex-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS Output Block */}
      <div className="sg-output">
        <pre className="sg-output-code">{cssOutput}</pre>
        <div className="sg-output-footer">
          <button
            type="button"
            onClick={handleCopy}
            className={`btn ${copied ? "btn-success" : "btn-primary"}`}
          >
            {copied ? (
              <>
                <Check size={13} /> Copied!
              </>
            ) : (
              <>
                <Copy size={13} /> Copy CSS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
