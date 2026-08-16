import React, { useState, useMemo } from "react";
import { Layers, Copy, Check, Sparkles, Sliders } from "lucide-react";
import "../shared.css";
import "./ShadowGenerator.css";

export default function ShadowGenerator({ onCopy }) {
  const [mode, setMode] = useState("shadow"); // 'shadow' | 'glass'

  // Box-Shadow state
  const [x,       setX]       = useState(0);
  const [y,       setY]       = useState(8);
  const [blur,    setBlur]    = useState(24);
  const [spread,  setSpread]  = useState(0);
  const [color,   setColor]   = useState("#000000");
  const [opacity, setOpacity] = useState(40);
  const [inset,   setInset]   = useState(false);

  // Glass state
  const [gBlur,    setGBlur]    = useState(12);
  const [gOpacity, setGOpacity] = useState(15);
  const [gBorder,  setGBorder]  = useState(20);
  const [gColor,   setGColor]   = useState("#ffffff");

  const [copied, setCopied] = useState(false);

  // Build hex-with-alpha
  const hexAlpha = useMemo(() => {
    const a = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
    return `${color}${a}`;
  }, [color, opacity]);

  const shadowValue = useMemo(() => {
    return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${hexAlpha}`;
  }, [x, y, blur, spread, hexAlpha, inset]);

  const cssOutput = useMemo(() => {
    if (mode === "shadow") {
      return `box-shadow: ${shadowValue};`;
    }
    const bg  = `rgba(255, 255, 255, ${(gOpacity / 100).toFixed(2)})`;
    const brd = `rgba(255, 255, 255, ${(gBorder  / 100).toFixed(2)})`;
    return [
      `backdrop-filter: blur(${gBlur}px);`,
      `-webkit-backdrop-filter: blur(${gBlur}px);`,
      `background: ${bg};`,
      `border: 1px solid ${brd};`,
      `border-radius: 16px;`,
    ].join("\n");
  }, [mode, shadowValue, gBlur, gOpacity, gBorder]);

  const glassStyle = useMemo(() => ({
    backdropFilter: `blur(${gBlur}px)`,
    WebkitBackdropFilter: `blur(${gBlur}px)`,
    background: `rgba(255,255,255,${gOpacity / 100})`,
    border: `1px solid rgba(255,255,255,${gBorder / 100})`,
    borderRadius: 14,
  }), [gBlur, gOpacity, gBorder]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(cssOutput);
    setTimeout(() => setCopied(false), 2000);
  };

  const SLIDER = ({ label, min, max, value, onChange, unit = "px" }) => (
    <div className="sg-field">
      <div className="sg-field-label">
        {label}
        <span className="sg-field-value">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="sg-slider" />
    </div>
  );

  return (
    <div>
      {/* Mode Toggle */}
      <div className="sg-mode-bar">
        <button className={`sg-mode-btn ${mode === "shadow" ? "active" : ""}`} onClick={() => setMode("shadow")}>
          <Layers size={14} /> Box Shadow
        </button>
        <button className={`sg-mode-btn ${mode === "glass" ? "active" : ""}`} onClick={() => setMode("glass")}>
          <Sparkles size={14} /> Glassmorphism
        </button>
      </div>

      {/* Live Preview Canvas */}
      <div className={`sg-canvas ${mode === "glass" ? "glass-mode" : ""}`}>
        <div
          className={`sg-preview-card ${mode === "shadow" ? "shadow-mode" : "glass-mode"}`}
          style={mode === "shadow"
            ? { boxShadow: shadowValue }
            : glassStyle
          }
        >
          {mode === "shadow" ? "Box Shadow Preview" : "Frosted Glass"}
        </div>
      </div>

      {/* Controls */}
      {mode === "shadow" ? (
        <div className="sg-controls">
          <SLIDER label="X Offset"    min={-50} max={50}  value={x}       onChange={setX} />
          <SLIDER label="Y Offset"    min={-50} max={50}  value={y}       onChange={setY} />
          <SLIDER label="Blur"        min={0}   max={100} value={blur}    onChange={setBlur} />
          <SLIDER label="Spread"      min={-30} max={50}  value={spread}  onChange={setSpread} />
          <SLIDER label="Opacity"     min={0}   max={100} value={opacity} onChange={setOpacity} unit="%" />
          <div className="sg-field">
            <div className="sg-field-label">Shadow Color</div>
            <div className="sg-color-row">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="sg-color-swatch" />
              <span className="sg-color-text">{hexAlpha.toUpperCase()}</span>
            </div>
            <div className="sg-toggle-row">
              <button className={`sg-toggle ${inset ? "on" : ""}`} onClick={() => setInset(p => !p)} />
              <span className="sg-toggle-label">Inset Shadow</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="sg-controls">
          <SLIDER label="Backdrop Blur"  min={0} max={40}  value={gBlur}    onChange={setGBlur} />
          <SLIDER label="BG Opacity"     min={0} max={100} value={gOpacity} onChange={setGOpacity} unit="%" />
          <SLIDER label="Border Opacity" min={0} max={100} value={gBorder}  onChange={setGBorder} unit="%" />
        </div>
      )}

      {/* CSS Output */}
      <div className="sg-output">
        <pre className="sg-output-code">{cssOutput}</pre>
        <div className="sg-output-footer">
          <button onClick={handleCopy} className={`btn ${copied ? "btn-success" : "btn-primary"}`}>
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy CSS</>}
          </button>
        </div>
      </div>
    </div>
  );
}
