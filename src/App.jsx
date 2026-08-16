import React, { useState } from "react";
import {
  Palette,
  Braces,
  FileCode2,
  ShieldCheck,
  Timer,
  Check,
  ArrowRight,
  ArrowLeft,
  GitFork,
  ExternalLink,
  Layers,
} from "lucide-react";
import "./App.css";

import GradientGenerator from "./features/gradient/GradientGenerator";
import JsonFormatter    from "./features/json-formatter/JsonFormatter";
import SvgOptimizer     from "./features/svg-tool/SvgOptimizer";
import BadgeMaker       from "./features/badge-maker/BadgeMaker";
import PomodoroTimer    from "./features/pomodoro/PomodoroTimer";

// ─── Tool definitions ────────────────────────────────────────
const TOOLS = [
  {
    id: "gradient",
    name: "CSS Gradient",
    desc: "Generate linear & radial gradients with live preview and one-click copy.",
    tag: "Design",
    icon: Palette,
    color: "#6366f1",      // indigo
    colorBg: "rgba(99,102,241,0.12)",
    colorBorder: "rgba(99,102,241,0.25)",
    colorText: "#a5b4fc",
    glowLine: "linear-gradient(90deg, #6366f1, #8b5cf6)",
  },
  {
    id: "json",
    name: "JSON Formatter",
    desc: "Validate, beautify and minify JSON with real-time syntax highlighting.",
    tag: "Formatter",
    icon: Braces,
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.10)",
    colorBorder: "rgba(16,185,129,0.22)",
    colorText: "#6ee7b7",
    glowLine: "linear-gradient(90deg, #10b981, #06b6d4)",
  },
  {
    id: "svg",
    name: "SVG Minifier",
    desc: "Minify SVG code and preview it live with real-time byte savings stats.",
    tag: "Optimizer",
    icon: FileCode2,
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.10)",
    colorBorder: "rgba(245,158,11,0.22)",
    colorText: "#fcd34d",
    glowLine: "linear-gradient(90deg, #f59e0b, #ef4444)",
  },
  {
    id: "badge",
    name: "Badge Maker",
    desc: "Generate shields.io tech stack badges for GitHub READMEs instantly.",
    tag: "Generator",
    icon: ShieldCheck,
    color: "#ec4899",
    colorBg: "rgba(236,72,153,0.10)",
    colorBorder: "rgba(236,72,153,0.22)",
    colorText: "#f9a8d4",
    glowLine: "linear-gradient(90deg, #ec4899, #8b5cf6)",
  },
  {
    id: "pomodoro",
    name: "Focus Timer",
    desc: "Pomodoro timer with circular progress, sound alerts, and session tracking.",
    tag: "Productivity",
    icon: Timer,
    color: "#8b5cf6",
    colorBg: "rgba(139,92,246,0.10)",
    colorBorder: "rgba(139,92,246,0.22)",
    colorText: "#c4b5fd",
    glowLine: "linear-gradient(90deg, #8b5cf6, #6366f1)",
  },
];

function getComponent(id, showToast) {
  switch (id) {
    case "gradient":  return <GradientGenerator onCopy={() => showToast("Copied CSS gradient!")} />;
    case "json":      return <JsonFormatter     onCopy={() => showToast("Copied clean JSON!")} />;
    case "svg":       return <SvgOptimizer      onCopy={() => showToast("Copied minified SVG!")} />;
    case "badge":     return <BadgeMaker        onCopy={() => showToast("Copied badge code!")} />;
    case "pomodoro":  return <PomodoroTimer />;
    default:          return null;
  }
}

// ─── App ─────────────────────────────────────────────────────
export default function App() {
  const [activeTool, setActiveTool] = useState(null); // null = home
  const [toast, setToast]           = useState("");

  const showToast = (msg = "Copied!") => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const tool = TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="app-shell">
      {/* Ambient background blobs */}
      <div className="app-glow" />

      {/* Toast */}
      {toast && (
        <div className="toast">
          <div className="toast-icon">
            <Check size={12} color="#34d399" />
          </div>
          {toast}
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────────── */}
      <div className="app-container">
        <nav className="navbar">
          <button className="navbar-brand" onClick={() => setActiveTool(null)} style={{ cursor: "pointer" }}>
            <div className="navbar-logo">⚡</div>
            <span className="navbar-title">
              DevTools<span> Suite</span>
            </span>
          </button>

          <div className="navbar-links">
            <span className="navbar-link" style={{ gap: 4 }}>
              <Layers size={13} />
              <span>{TOOLS.length} Tools</span>
            </span>
            <a
              href="https://github.com/hiimnanh-gh/devtools-suite"
              target="_blank"
              rel="noreferrer"
              className="navbar-link"
            >
              <GitFork size={13} />
              <span>GitHub</span>
              <ExternalLink size={11} style={{ opacity: 0.5 }} />
            </a>
          </div>
        </nav>
      </div>

      {/* ── Page Content ───────────────────────────────────── */}
      <div className="app-container">
        {activeTool === null ? (
          /* ═══ HOME PAGE ═══════════════════════════════════ */
          <>
            {/* Hero */}
            <div className="home-hero">
              <div className="home-eyebrow">Developer Micro-Tools</div>
              <h1 className="home-title">
                Build faster with<br /><em>DevTools Suite</em>
              </h1>
              <p className="home-subtitle">
                A curated set of single-purpose browser utilities — crafted for developers who value speed and simplicity.
              </p>
            </div>

            {/* Tool Cards Grid */}
            <div className="tools-grid">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    className="tool-card"
                    onClick={() => setActiveTool(t.id)}
                  >
                    {/* Top gradient line on hover */}
                    <div
                      className="tool-card-glow"
                      style={{ background: t.glowLine }}
                    />

                    {/* Icon */}
                    <div
                      className="tool-card-icon"
                      style={{
                        background: t.colorBg,
                        border: `1px solid ${t.colorBorder}`,
                      }}
                    >
                      <Icon size={20} color={t.color} />
                    </div>

                    {/* Tag */}
                    <div
                      className="tool-card-tag"
                      style={{
                        background: t.colorBg,
                        color: t.colorText,
                      }}
                    >
                      {t.tag}
                    </div>

                    {/* Name */}
                    <div className="tool-card-name">{t.name}</div>

                    {/* Desc */}
                    <div className="tool-card-desc">{t.desc}</div>

                    {/* CTA */}
                    <div
                      className="tool-card-arrow"
                      style={{ color: t.colorText }}
                    >
                      Open Tool <ArrowRight size={13} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <footer className="home-footer">
              <span>DevTools Suite · {new Date().getFullYear()}</span>
              <span>
                Built with <strong>React</strong> + <strong>Vite</strong>
              </span>
            </footer>
          </>
        ) : (
          /* ═══ TOOL PAGE ═══════════════════════════════════ */
          <div className="tool-page">
            {/* Back button */}
            <button className="back-btn" onClick={() => setActiveTool(null)}>
              <ArrowLeft size={13} />
              All Tools
            </button>

            {/* Tool header */}
            {tool && (
              <div className="tool-page-header">
                <div
                  className="tool-page-icon"
                  style={{
                    background: tool.colorBg,
                    border: `1px solid ${tool.colorBorder}`,
                  }}
                >
                  <tool.icon size={22} color={tool.color} />
                </div>
                <div>
                  <div className="tool-page-title">{tool.name}</div>
                  <div className="tool-page-desc">{tool.desc}</div>
                </div>
                <div
                  className="tool-page-tag"
                  style={{
                    background: tool.colorBg,
                    color: tool.colorText,
                    border: `1px solid ${tool.colorBorder}`,
                  }}
                >
                  {tool.tag}
                </div>
              </div>
            )}

            {/* Workspace */}
            <div className="tool-workspace">
              {getComponent(activeTool, showToast)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
