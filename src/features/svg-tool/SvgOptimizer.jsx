import React, { useState, useMemo } from "react";
import { FileCode2, Copy, Check, Sparkles, Trash2, Zap, Eye } from "lucide-react";
import "../shared.css";
import "./SvgOptimizer.css";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="128" height="128">
  <!-- DevTools Icon -->
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="24" height="24" rx="6" fill="url(#g1)" />
  <path d="M7 8l4 4-4 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <line x1="13" y1="16" x2="17" y2="16" stroke="#fff" stroke-width="2" stroke-linecap="round" />
</svg>`;

function minifySvg(s) {
  if (!s) return "";
  return s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s*([=:,>])\s*/g, "$1")
    .replace(/<svg\s*/gi, "<svg ")
    .trim();
}

function bytes(s) { return new Blob([s]).size; }
function fmtBytes(b) {
  if (b === 0) return "0 B";
  return b < 1024 ? `${b} B` : `${(b/1024).toFixed(2)} KB`;
}

export default function SvgOptimizer({ onCopy }) {
  const [input,  setInput]  = useState(SAMPLE);
  const [minified, setMin]  = useState(() => minifySvg(SAMPLE));
  const [copied, setCopied] = useState(false);

  const origSize = useMemo(() => bytes(input), [input]);
  const minSize  = useMemo(() => bytes(minified), [minified]);
  const saved    = useMemo(() => {
    if (!origSize || !minSize || origSize <= minSize) return 0;
    return (((origSize - minSize) / origSize) * 100).toFixed(1);
  }, [origSize, minSize]);

  const isValidSvg = useMemo(() => {
    const t = input.trim().toLowerCase();
    return t.includes("<svg") && t.includes("</svg>");
  }, [input]);

  const handleInput = (e) => { setInput(e.target.value); setMin(minifySvg(e.target.value)); };
  const handleMinify = () => { const m = minifySvg(input); setMin(m); };
  const handleClear = () => { setInput(""); setMin(""); };

  const handleCopy = () => {
    const t = minified || input;
    if (!t.trim()) return;
    navigator.clipboard.writeText(t);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(t);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="tool-toolbar">
        <div className="tool-toolbar-left">
          <button className="btn btn-indigo-outline" onClick={handleMinify}>
            <Zap size={13} color="#fbbf24" /> Minify SVG
          </button>
          <button className="btn btn-ghost" style={{ color: "#818cf8", fontSize: 12 }} onClick={() => { setInput(SAMPLE); setMin(minifySvg(SAMPLE)); }}>
            <Sparkles size={12} /> Sample
          </button>
        </div>
        <div className="tool-toolbar-right">
          {/* Stats */}
          <div className="svg-stat-pill">
            <span>{fmtBytes(origSize)}</span>
            <span className="svg-stat-arrow">→</span>
            <span style={{ color: "#a5b4fc" }}>{fmtBytes(minSize)}</span>
          </div>
          {Number(saved) > 0 && (
            <span className="status-badge valid">-{saved}% saved</span>
          )}
          <button className="btn btn-ghost" onClick={handleClear}><Trash2 size={13} /></button>
          <button
            className={`btn ${copied ? "btn-success" : "btn-primary"}`}
            onClick={handleCopy}
            disabled={!minified.trim()}
          >
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy SVG</>}
          </button>
        </div>
      </div>

      {/* Two pane */}
      <div className="two-pane">
        {/* Input */}
        <div className="pane">
          <div className="pane-header">
            <div className="pane-header-left"><FileCode2 size={13} color="#818cf8" /> SVG Source</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{fmtBytes(origSize)}</span>
          </div>
          <div className="pane-body">
            <textarea
              className="code-editor"
              value={input}
              onChange={handleInput}
              placeholder="Paste <svg> code here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="pane">
          <div className="pane-header">
            <div className="pane-header-left"><Eye size={13} color="#818cf8" /> Live Preview</div>
            {isValidSvg
              ? <span className="status-badge indigo">Rendered</span>
              : <span className="status-badge empty">No SVG</span>}
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <div className="svg-checker-canvas">
              {isValidSvg ? (
                <div
                  className="svg-render"
                  dangerouslySetInnerHTML={{ __html: input }}
                />
              ) : (
                <div className="empty-state">
                  <FileCode2 size={28} color="#1e293b" />
                  Paste valid SVG to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Minified output */}
      {minified && (
        <div className="output-bar" style={{ marginTop: 14 }}>
          <span style={{ color: "#818cf8", fontWeight: 600, fontSize: 11, flexShrink: 0 }}>Minified:</span>
          <code style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {minified}
          </code>
        </div>
      )}
    </div>
  );
}
