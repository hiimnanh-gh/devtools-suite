import React, { useState } from "react";
import {
  Palette, Braces, FileCode2, ShieldCheck, Timer,
  Check, ArrowRight, ArrowLeft, GitFork, ExternalLink, Layers,
  Layers as LayersIcon, FileText, KeyRound,
} from "lucide-react";
import "./App.css";

import GradientGenerator from "./features/gradient/GradientGenerator";
import JsonFormatter    from "./features/json-formatter/JsonFormatter";
import SvgOptimizer     from "./features/svg-tool/SvgOptimizer";
import BadgeMaker       from "./features/badge-maker/BadgeMaker";
import PomodoroTimer    from "./features/pomodoro/PomodoroTimer";
import ShadowGenerator  from "./features/shadow-generator/ShadowGenerator";
import MarkdownPreviewer from "./features/markdown-previewer/MarkdownPreviewer";
import JwtInspector     from "./features/jwt-inspector/JwtInspector";

// ─── Tool definitions ─────────────────────────────────────
const TOOLS = [
  {
    id: "gradient", name: "CSS Gradient",
    desc: "Generate linear & radial gradients with live preview and one-click copy.",
    tag: "Design", icon: Palette,
    color: "#6366f1", colorBg: "rgba(99,102,241,0.12)", colorBorder: "rgba(99,102,241,0.25)",
    colorText: "#a5b4fc", glowLine: "linear-gradient(90deg,#6366f1,#8b5cf6)",
  },
  {
    id: "json", name: "JSON Formatter",
    desc: "Validate, beautify and minify JSON with real-time syntax highlighting.",
    tag: "Formatter", icon: Braces,
    color: "#10b981", colorBg: "rgba(16,185,129,0.10)", colorBorder: "rgba(16,185,129,0.22)",
    colorText: "#6ee7b7", glowLine: "linear-gradient(90deg,#10b981,#06b6d4)",
  },
  {
    id: "svg", name: "SVG Minifier",
    desc: "Minify SVG code and preview it live with real-time byte savings stats.",
    tag: "Optimizer", icon: FileCode2,
    color: "#f59e0b", colorBg: "rgba(245,158,11,0.10)", colorBorder: "rgba(245,158,11,0.22)",
    colorText: "#fcd34d", glowLine: "linear-gradient(90deg,#f59e0b,#ef4444)",
  },
  {
    id: "badge", name: "Badge Maker",
    desc: "Generate shields.io tech stack badges for GitHub READMEs instantly.",
    tag: "Generator", icon: ShieldCheck,
    color: "#ec4899", colorBg: "rgba(236,72,153,0.10)", colorBorder: "rgba(236,72,153,0.22)",
    colorText: "#f9a8d4", glowLine: "linear-gradient(90deg,#ec4899,#8b5cf6)",
  },
  {
    id: "pomodoro", name: "Focus Timer",
    desc: "Pomodoro timer with circular progress, sound alerts, and session tracking.",
    tag: "Productivity", icon: Timer,
    color: "#8b5cf6", colorBg: "rgba(139,92,246,0.10)", colorBorder: "rgba(139,92,246,0.22)",
    colorText: "#c4b5fd", glowLine: "linear-gradient(90deg,#8b5cf6,#6366f1)",
  },
  {
    id: "shadow", name: "Shadow Gen",
    desc: "Build layered box-shadows and glassmorphism effects with live preview.",
    tag: "Design", icon: LayersIcon,
    color: "#0ea5e9", colorBg: "rgba(14,165,233,0.10)", colorBorder: "rgba(14,165,233,0.22)",
    colorText: "#7dd3fc", glowLine: "linear-gradient(90deg,#0ea5e9,#6366f1)",
  },
  {
    id: "markdown", name: "MD Preview",
    desc: "Live split-screen Markdown editor with quick insert toolbar and HTML export.",
    tag: "Editor", icon: FileText,
    color: "#f472b6", colorBg: "rgba(244,114,182,0.10)", colorBorder: "rgba(244,114,182,0.22)",
    colorText: "#fbcfe8", glowLine: "linear-gradient(90deg,#f472b6,#c084fc)",
  },
  {
    id: "jwt", name: "JWT Inspector",
    desc: "Decode JWT tokens client-side and encode/decode Base64 strings instantly.",
    tag: "Security", icon: KeyRound,
    color: "#34d399", colorBg: "rgba(52,211,153,0.10)", colorBorder: "rgba(52,211,153,0.22)",
    colorText: "#6ee7b7", glowLine: "linear-gradient(90deg,#34d399,#0ea5e9)",
  },
];

function getComponent(id, showToast) {
  switch (id) {
    case "gradient":  return <GradientGenerator  onCopy={() => showToast("Copied CSS gradient!")} />;
    case "json":      return <JsonFormatter       onCopy={() => showToast("Copied clean JSON!")} />;
    case "svg":       return <SvgOptimizer        onCopy={() => showToast("Copied minified SVG!")} />;
    case "badge":     return <BadgeMaker          onCopy={() => showToast("Copied badge code!")} />;
    case "pomodoro":  return <PomodoroTimer />;
    case "shadow":    return <ShadowGenerator     onCopy={() => showToast("Copied shadow CSS!")} />;
    case "markdown":  return <MarkdownPreviewer   onCopy={() => showToast("Copied markdown!")} />;
    case "jwt":       return <JwtInspector        onCopy={() => showToast("Copied to clipboard!")} />;
    default:          return null;
  }
}

export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [toast,      setToast]      = useState("");

  const showToast = (msg = "Copied!") => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const tool = TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="app-shell">
      <div className="app-glow" />

      {toast && (
        <div className="toast">
          <div className="toast-icon"><Check size={12} color="#34d399" /></div>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <div className="app-container">
        <nav className="navbar">
          <button className="navbar-brand" onClick={() => setActiveTool(null)} style={{ cursor: "pointer" }}>
            <div className="navbar-logo">⚡</div>
            <span className="navbar-title">DevTools<span> Suite</span></span>
          </button>
          <div className="navbar-links">
            <span className="navbar-link" style={{ gap: 4 }}>
              <Layers size={13} /><span>{TOOLS.length} Tools</span>
            </span>
            <a href="https://github.com/hiimnanh-gh/devtools-suite" target="_blank" rel="noreferrer" className="navbar-link">
              <GitFork size={13} /><span>GitHub</span><ExternalLink size={11} style={{ opacity: 0.5 }} />
            </a>
          </div>
        </nav>
      </div>

      {/* Page */}
      <div className="app-container">
        {activeTool === null ? (
          <>
            {/* Hero */}
            <div className="home-hero">
              <div className="home-eyebrow">Developer Micro-Tools</div>
              <h1 className="home-title">Build faster with<br /><em>DevTools Suite</em></h1>
              <p className="home-subtitle">
                A curated set of single-purpose browser utilities — crafted for developers who value speed and simplicity.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="tools-grid">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.id} className="tool-card" onClick={() => setActiveTool(t.id)}>
                    <div className="tool-card-glow" style={{ background: t.glowLine }} />
                    <div className="tool-card-icon" style={{ background: t.colorBg, border: `1px solid ${t.colorBorder}` }}>
                      <Icon size={20} color={t.color} />
                    </div>
                    <div className="tool-card-tag" style={{ background: t.colorBg, color: t.colorText }}>{t.tag}</div>
                    <div className="tool-card-name">{t.name}</div>
                    <div className="tool-card-desc">{t.desc}</div>
                    <div className="tool-card-arrow" style={{ color: t.colorText }}>
                      Open Tool <ArrowRight size={13} />
                    </div>
                  </button>
                );
              })}
            </div>

            <footer className="home-footer">
              <span>DevTools Suite · {new Date().getFullYear()}</span>
              <span>Built with <strong>React</strong> + <strong>Vite</strong></span>
            </footer>
          </>
        ) : (
          <div className="tool-page">
            <button className="back-btn" onClick={() => setActiveTool(null)}>
              <ArrowLeft size={13} /> All Tools
            </button>

            {tool && (
              <div className="tool-page-header">
                <div className="tool-page-icon" style={{ background: tool.colorBg, border: `1px solid ${tool.colorBorder}` }}>
                  <tool.icon size={22} color={tool.color} />
                </div>
                <div>
                  <div className="tool-page-title">{tool.name}</div>
                  <div className="tool-page-desc">{tool.desc}</div>
                </div>
                <div className="tool-page-tag" style={{ background: tool.colorBg, color: tool.colorText, border: `1px solid ${tool.colorBorder}` }}>
                  {tool.tag}
                </div>
              </div>
            )}

            <div className="tool-workspace">
              {getComponent(activeTool, showToast)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
