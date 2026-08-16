import React, { useState, useMemo } from "react";
import {
  FileCode2,
  Copy,
  Check,
  Sparkles,
  Trash2,
  Zap,
  Eye,
} from "lucide-react";
import "./SvgOptimizer.css";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="128" height="128">
  <!-- Modern DevTools Icon -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="24" height="24" rx="6" fill="url(#grad1)" />
  <path d="M7 8l4 4-4 4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <line x1="13" y1="16" x2="17" y2="16" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
</svg>`;

// Helper function to minify SVG code
function minifySvg(svgString) {
  if (!svgString) return "";
  return svgString
    // Remove XML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove XML declarations and doctype
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    // Collapse multi-spaces & tabs to single space
    .replace(/\s+/g, " ")
    // Remove space around tags and symbols
    .replace(/>\s+</g, "><")
    .replace(/\s*([=:,>])\s*/g, "$1")
    .replace(/<svg\s*/gi, "<svg ")
    .trim();
}

function getByteSize(str) {
  return new Blob([str]).size;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

export default function SvgOptimizer({ onCopy }) {
  const [inputSvg, setInputSvg] = useState(SAMPLE_SVG);
  const [minifiedSvg, setMinifiedSvg] = useState(() => minifySvg(SAMPLE_SVG));
  const [copied, setCopied] = useState(false);

  const originalSize = useMemo(() => getByteSize(inputSvg), [inputSvg]);
  const minifiedSize = useMemo(() => getByteSize(minifiedSvg), [minifiedSvg]);

  const savingsPercent = useMemo(() => {
    if (originalSize === 0 || minifiedSize === 0 || originalSize <= minifiedSize) {
      return 0;
    }
    return (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
  }, [originalSize, minifiedSize]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputSvg(val);
    setMinifiedSvg(minifySvg(val));
  };

  const handleMinifyClick = () => {
    const min = minifySvg(inputSvg);
    setMinifiedSvg(min);
  };

  const handleCopy = () => {
    const target = minifiedSvg || inputSvg;
    if (!target.trim()) return;

    navigator.clipboard.writeText(target);
    setCopied(true);
    if (typeof onCopy === "function") {
      onCopy(target);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setInputSvg(SAMPLE_SVG);
    setMinifiedSvg(minifySvg(SAMPLE_SVG));
  };

  const handleClear = () => {
    setInputSvg("");
    setMinifiedSvg("");
  };

  // Safe check if string looks like an SVG tag
  const isValidSvg = useMemo(() => {
    const trimmed = inputSvg.trim().toLowerCase();
    return trimmed.includes("<svg") && trimmed.includes("</svg>");
  }, [inputSvg]);

  return (
    <div className="space-y-4">
      {/* Top Toolbar & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMinifyClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Minify SVG</span>
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

        {/* Compression Statistics */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Raw: <strong className="text-slate-200">{formatBytes(originalSize)}</strong></span>
            <span className="text-slate-600">→</span>
            <span>Min: <strong className="text-indigo-300">{formatBytes(minifiedSize)}</strong></span>
          </div>

          {Number(savingsPercent) > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              -{savingsPercent}% Saved
            </span>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!minifiedSvg.trim()}
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
                <span>Copy Minified SVG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: SVG Code Editor */}
        <div className="flex flex-col h-[380px] rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <span>SVG Source Code</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {formatBytes(originalSize)}
            </span>
          </div>
          <div className="relative flex-1 p-3">
            <textarea
              value={inputSvg}
              onChange={handleInputChange}
              placeholder="Paste raw <svg> code here..."
              spellCheck={false}
              className="svg-editor-scroll w-full h-full p-3 bg-slate-950/50 text-slate-200 font-mono text-xs rounded-xl resize-none border border-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Right Pane: Live Visual Preview */}
        <div className="flex flex-col h-[380px] rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Live Visual Render</span>
            </div>
            {isValidSvg ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Rendered
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">No SVG detected</span>
            )}
          </div>

          <div className="svg-checker-bg flex-1 p-6 flex items-center justify-center overflow-hidden relative">
            {isValidSvg ? (
              <div
                className="svg-preview-container flex items-center justify-center w-full h-full"
                dangerouslySetInnerHTML={{ __html: inputSvg }}
              />
            ) : (
              <div className="text-center space-y-1 text-slate-500">
                <FileCode2 className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs">Paste valid SVG code to view live render</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Minified Output Bar */}
      {minifiedSvg && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-400 truncate flex-1 select-all">
            <span className="text-indigo-400 font-semibold mr-2">Minified:</span>
            <code>{minifiedSvg}</code>
          </div>
        </div>
      )}
    </div>
  );
}
