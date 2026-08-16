import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Code2,
} from "lucide-react";
import "./BadgeMaker.css";

const PRESET_TECH = [
  { label: "React", color: "20232A", logo: "react", logoColor: "61DAFB", name: "React" },
  { label: "Spring_Boot", color: "6DB33F", logo: "springboot", logoColor: "white", name: "Spring Boot" },
  { label: "Angular", color: "DD0031", logo: "angular", logoColor: "white", name: "Angular" },
  { label: "MySQL", color: "4479A1", logo: "mysql", logoColor: "white", name: "MySQL" },
  { label: "Tailwind_CSS", color: "06B6D4", logo: "tailwindcss", logoColor: "white", name: "Tailwind CSS" },
  { label: "Docker", color: "2496ED", logo: "docker", logoColor: "white", name: "Docker" },
  { label: "TypeScript", color: "3178C6", logo: "typescript", logoColor: "white", name: "TypeScript" },
  { label: "Python", color: "3776AB", logo: "python", logoColor: "white", name: "Python" },
];

const BADGE_STYLES = [
  { id: "for-the-badge", label: "For The Badge" },
  { id: "flat", label: "Flat" },
  { id: "flat-square", label: "Flat Square" },
  { id: "plastic", label: "Plastic" },
];

export default function BadgeMaker({ onCopy }) {
  const [label, setLabel] = useState("React");
  const [color, setColor] = useState("#20232A");
  const [logo, setLogo] = useState("react");
  const [logoColor, setLogoColor] = useState("61DAFB");
  const [style, setStyle] = useState("for-the-badge");
  const [outputTab, setOutputTab] = useState("markdown"); // 'markdown' | 'html' | 'url'
  const [copied, setCopied] = useState(false);

  // Generate Shields.io Badge URL
  const badgeUrl = useMemo(() => {
    const cleanLabel = (label.trim() || "Badge")
      .replace(/-/g, "--")
      .replace(/_/g, "__");
    const cleanColor = color.replace("#", "") || "6366f1";
    
    let url = `https://img.shields.io/badge/${encodeURIComponent(cleanLabel)}-${cleanColor}?style=${style}`;
    
    if (logo.trim()) {
      url += `&logo=${encodeURIComponent(logo.trim())}`;
      if (logoColor.trim()) {
        url += `&logoColor=${encodeURIComponent(logoColor.trim().replace("#", ""))}`;
      }
    }
    
    return url;
  }, [label, color, logo, logoColor, style]);

  // Formatted Output String
  const outputCode = useMemo(() => {
    const displayLabel = label.trim() || "Badge";
    if (outputTab === "markdown") {
      return `![${displayLabel}](${badgeUrl})`;
    }
    if (outputTab === "html") {
      return `<img src="${badgeUrl}" alt="${displayLabel}" />`;
    }
    return badgeUrl;
  }, [badgeUrl, label, outputTab]);

  const handleApplyPreset = (preset) => {
    setLabel(preset.label);
    setColor(`#${preset.color}`);
    setLogo(preset.logo);
    setLogoColor(preset.logoColor);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    if (typeof onCopy === "function") {
      onCopy(outputCode);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Live Badge Preview Canvas */}
      <div className="badge-preview-box h-48 w-full rounded-2xl flex flex-col items-center justify-center p-6 gap-3 relative">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Live Badge Preview
        </span>
        <div className="badge-image-wrapper cursor-pointer select-none">
          <img
            src={badgeUrl}
            alt={label || "Badge Preview"}
            className="max-h-12 object-contain"
            onError={(e) => {
              e.currentTarget.alt = "Failed to load badge icon";
            }}
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pl-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Tech Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_TECH.map((tech) => (
            <button
              key={tech.name}
              type="button"
              onClick={() => handleApplyPreset(tech)}
              className="badge-preset-chip flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: `#${tech.color}` }}
              />
              {tech.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Label */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-medium block">
            Badge Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. React, Spring_Boot"
            className="w-full px-3 py-2 bg-slate-950/60 text-slate-200 rounded-lg border border-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          <span className="text-[10px] text-slate-500 block">
            Use underscore `_` for spaces
          </span>
        </div>

        {/* Background Color */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-medium block">
            Hex Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color.startsWith("#") ? color : `#${color}`}
              onChange={(e) => setColor(e.target.value)}
              className="badge-color-input w-8 h-8 flex-shrink-0 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#20232A"
              className="w-full px-3 py-2 bg-slate-950/60 text-slate-200 rounded-lg border border-slate-800 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>

        {/* Icon Slug (SimpleIcons) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-400 font-medium">Icon Slug</label>
            <a
              href="https://simpleicons.org"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              <span>SimpleIcons</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="e.g. react, docker"
            className="w-full px-3 py-2 bg-slate-950/60 text-slate-200 rounded-lg border border-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Badge Style */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="text-xs text-slate-400 font-medium block">
            Badge Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/60 text-slate-200 rounded-lg border border-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
          >
            {BADGE_STYLES.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Output Format Tabs & Code */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-1">
            {[
              { id: "markdown", label: "Markdown" },
              { id: "html", label: "HTML" },
              { id: "url", label: "Raw URL" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOutputTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  outputTab === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-950/50 font-mono text-xs text-indigo-300 break-all select-all flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <code>{outputCode}</code>
        </div>
      </div>
    </div>
  );
}
