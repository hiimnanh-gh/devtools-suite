import React, { useState, useEffect, useMemo } from "react";
import {
  Copy,
  Check,
  AlertCircle,
  Minimize2,
  Maximize2,
  Trash2,
  FileJson,
  Sparkles,
} from "lucide-react";
import "./JsonFormatter.css";

const DEFAULT_JSON = `{
  "projectName": "DevTools Suite",
  "version": "1.0.0",
  "isProduction": false,
  "features": [
    "CSS Gradient Generator",
    "JSON Formatter & Validator"
  ],
  "stats": {
    "activeUsers": 1280,
    "rating": 4.9
  },
  "metadata": null
}`;

export default function JsonFormatter({ onCopy }) {
  const [rawInput, setRawInput] = useState(DEFAULT_JSON);
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Parse and validate JSON in real time
  useEffect(() => {
    if (!rawInput.trim()) {
      setFormattedJson("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(rawInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
      setFormattedJson("");
    }
  }, [rawInput]);

  // Syntax highlighting for the formatted preview
  const highlightedHtml = useMemo(() => {
    if (!formattedJson) return "";
    const escaped = formattedJson
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "json-key";
            return `<span class="${cls}">${match.slice(0, -1)}</span><span class="json-punct">:</span>`;
          } else {
            cls = "json-string";
          }
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }, [formattedJson]);

  const handleBeautify = () => {
    if (!rawInput.trim()) return;
    try {
      const parsed = JSON.parse(rawInput);
      const beautified = JSON.stringify(parsed, null, 2);
      setRawInput(beautified);
      setFormattedJson(beautified);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMinify = () => {
    if (!rawInput.trim()) return;
    try {
      const parsed = JSON.parse(rawInput);
      const minified = JSON.stringify(parsed);
      setRawInput(minified);
      setFormattedJson(minified);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    const textToCopy = formattedJson || rawInput;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (typeof onCopy === "function") {
      onCopy(textToCopy);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setRawInput("");
    setFormattedJson("");
    setError(null);
  };

  const handleLoadSample = () => {
    setRawInput(DEFAULT_JSON);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBeautify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Beautify</span>
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Sample</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!formattedJson && !rawInput.trim()}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
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
                <span>Copy Clean JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Raw JSON Input */}
        <div className="flex flex-col h-[400px] rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-indigo-400" />
              <span>Raw JSON Input</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {rawInput.length} chars
            </span>
          </div>
          <div className="relative flex-1 p-3">
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste or type your JSON here..."
              spellCheck={false}
              className="json-textarea json-editor-scroll w-full h-full p-3 bg-slate-950/50 text-slate-200 font-mono text-xs rounded-xl resize-none border border-slate-800/80 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Right Pane: Formatted Output / Validation */}
        <div className="flex flex-col h-[400px] rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Validated Output</span>
              {error ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Invalid JSON
                </span>
              ) : rawInput.trim() ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Valid JSON
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Empty</span>
              )}
            </div>
          </div>

          <div className="flex-1 p-3 overflow-hidden">
            {error ? (
              <div className="h-full p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col items-start gap-3 text-rose-300">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>JSON Syntax Error</span>
                </div>
                <div className="p-3 w-full bg-slate-950/80 rounded-lg border border-rose-500/20 font-mono text-xs text-rose-200 overflow-auto json-editor-scroll">
                  {error}
                </div>
                <p className="text-[11px] text-slate-400">
                  Please check for missing quotation marks, trailing commas, or unclosed brackets in the raw input.
                </p>
              </div>
            ) : highlightedHtml ? (
              <pre
                className="json-editor-scroll w-full h-full p-3 bg-slate-950/50 font-mono text-xs rounded-xl overflow-auto border border-slate-800/80 leading-relaxed select-text"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Formatted output will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
