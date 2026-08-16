import React, { useState, useEffect, useMemo } from "react";
import {
  Copy, Check, AlertCircle, Minimize2, Maximize2,
  Trash2, FileJson, Sparkles,
} from "lucide-react";
import "../shared.css";
import "./JsonFormatter.css";

const DEFAULT_JSON = `{
  "project": "DevTools Suite",
  "version": "1.0.0",
  "active": true,
  "tools": ["CSS Gradient", "JSON Formatter", "SVG Minifier"],
  "stats": { "users": 1280, "rating": 4.9 },
  "meta": null
}`;

export default function JsonFormatter({ onCopy }) {
  const [raw,    setRaw]    = useState(DEFAULT_JSON);
  const [fmt,    setFmt]    = useState("");
  const [error,  setError]  = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!raw.trim()) { setFmt(""); setError(null); return; }
    try {
      setFmt(JSON.stringify(JSON.parse(raw), null, 2));
      setError(null);
    } catch (e) {
      setError(e.message); setFmt("");
    }
  }, [raw]);

  const highlighted = useMemo(() => {
    if (!fmt) return "";
    return fmt
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (m) => {
          if (/^"/.test(m)) {
            if (/:$/.test(m))
              return `<span class="json-key">${m.slice(0,-1)}</span><span class="json-punct">:</span>`;
            return `<span class="json-string">${m}</span>`;
          }
          if (/true|false/.test(m)) return `<span class="json-boolean">${m}</span>`;
          if (/null/.test(m))       return `<span class="json-null">${m}</span>`;
          return `<span class="json-number">${m}</span>`;
        }
      );
  }, [fmt]);

  const beautify = () => { try { setRaw(JSON.stringify(JSON.parse(raw), null, 2)); } catch(e){ setError(e.message); } };
  const minify   = () => { try { setRaw(JSON.stringify(JSON.parse(raw)));           } catch(e){ setError(e.message); } };
  const clear    = () => { setRaw(""); setFmt(""); setError(null); };

  const handleCopy = () => {
    const t = fmt || raw;
    if (!t) return;
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
          <button className="btn btn-indigo-outline" onClick={beautify}>
            <Maximize2 size={13} /> Beautify
          </button>
          <button className="btn btn-secondary" onClick={minify}>
            <Minimize2 size={13} /> Minify
          </button>
          <button className="btn btn-ghost" style={{ color: "#818cf8", fontSize: 12 }} onClick={() => setRaw(DEFAULT_JSON)}>
            <Sparkles size={12} /> Sample
          </button>
        </div>
        <div className="tool-toolbar-right">
          <button className="btn btn-ghost" onClick={clear}><Trash2 size={13} /></button>
          <button
            className={`btn ${copied ? "btn-success" : "btn-primary"}`}
            onClick={handleCopy}
            disabled={!fmt && !raw.trim()}
          >
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy JSON</>}
          </button>
        </div>
      </div>

      {/* Two-pane */}
      <div className="two-pane">
        {/* Input */}
        <div className="pane">
          <div className="pane-header">
            <div className="pane-header-left">
              <FileJson size={13} color="#818cf8" />
              Raw Input
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{raw.length} chars</span>
          </div>
          <div className="pane-body">
            <textarea
              className="code-editor"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Paste JSON here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output */}
        <div className="pane">
          <div className="pane-header">
            <div className="pane-header-left">Validated Output</div>
            {error ? (
              <span className="status-badge error">Invalid JSON</span>
            ) : raw.trim() ? (
              <span className="status-badge valid">Valid JSON</span>
            ) : (
              <span className="status-badge empty">Empty</span>
            )}
          </div>
          <div className="pane-body">
            {error ? (
              <div className="error-pane">
                <div className="error-pane-title"><AlertCircle size={14} /> Syntax Error</div>
                <div className="error-pane-msg">{error}</div>
                <div className="error-pane-hint">
                  Check for missing quotes, trailing commas, or unclosed brackets.
                </div>
              </div>
            ) : highlighted ? (
              <pre className="code-output" dangerouslySetInnerHTML={{ __html: highlighted }} />
            ) : (
              <div className="empty-state">
                <FileJson size={28} color="#1e293b" />
                Formatted output will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
