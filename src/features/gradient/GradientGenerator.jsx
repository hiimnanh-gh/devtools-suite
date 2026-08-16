import React, { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import "./GradientGenerator.css";

const PRESET_GRADIENTS = [
  { name: "Neon Glow", c1: "#6366f1", c2: "#ec4899", a: 45, type: "linear" },
  { name: "Ocean Breeze", c1: "#3b82f6", c2: "#10b981", a: 90, type: "linear" },
  { name: "Sunset Flare", c1: "#f59e0b", c2: "#ef4444", a: 135, type: "linear" },
  { name: "Cyber Violet", c1: "#8b5cf6", c2: "#06b6d4", a: 60, type: "linear" },
];

export default function GradientGenerator({ onCopy }) {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#a855f7");
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState("linear");
  const [copied, setCopied] = useState(false);

  const cssValue =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssRule = `background: ${cssValue};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssRule);
    setCopied(true);
    if (typeof onCopy === "function") {
      onCopy(cssRule);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset) => {
    setColor1(preset.c1);
    setColor2(preset.c2);
    setAngle(preset.a);
    setType(preset.type || "linear");
  };

  return (
    <div className="space-y-6">
      {/* Live Gradient Preview Box */}
      <div
        className="gradient-preview h-56 w-full rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex items-end justify-end p-4"
        style={{ background: cssValue }}
      >
        <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 shadow-lg">
          {type === "linear" ? `${angle}° Linear` : "Radial (Circle)"}
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Color Stops */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-400 font-medium">Color Stops</label>
            <span className="text-[10px] text-slate-500 font-mono">
              {color1.toUpperCase()} / {color2.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800 flex-1">
              <input
                type="color"
                value={color1}
                aria-label="Color stop 1"
                onChange={(e) => setColor1(e.target.value)}
                className="gradient-color-input w-8 h-8 flex-shrink-0"
              />
              <span className="text-xs font-mono text-slate-300 select-all truncate">
                {color1}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800 flex-1">
              <input
                type="color"
                value={color2}
                aria-label="Color stop 2"
                onChange={(e) => setColor2(e.target.value)}
                className="gradient-color-input w-8 h-8 flex-shrink-0"
              />
              <span className="text-xs font-mono text-slate-300 select-all truncate">
                {color2}
              </span>
            </div>
          </div>
        </div>

        {/* Angle / Degree Slider */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-400">Angle Direction</span>
            <span className={`font-mono text-xs ${type === "radial" ? "text-slate-600" : "text-indigo-400"}`}>
              {type === "linear" ? `${angle}°` : "N/A"}
            </span>
          </div>
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              disabled={type === "radial"}
              aria-label="Linear gradient angle"
              onChange={(e) => setAngle(Number(e.target.value))}
              className="gradient-slider cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-mono">
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
          </div>
        </div>

        {/* Gradient Mode */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs text-slate-400 font-medium block">
            Gradient Mode
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {["linear", "radial"].map((mode) => {
              const isSelected = type === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setType(mode)}
                  className={`py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Presets & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pl-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quick Presets:</span>
          </div>
          <div className="flex items-center gap-2.5">
            {PRESET_GRADIENTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                title={preset.name}
                onClick={() => applyPreset(preset)}
                className="gradient-preset-btn w-7 h-7 rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                style={{
                  background: `linear-gradient(${preset.a}deg, ${preset.c1}, ${preset.c2})`,
                }}
                aria-label={`Apply ${preset.name} preset`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Output Code & Copy Button */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shadow-inner">
        <div className="text-indigo-300 break-all select-all font-mono">
          <code>{cssRule}</code>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0 cursor-pointer ${
            copied
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Copy CSS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
