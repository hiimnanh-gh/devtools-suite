import React, { useState, useMemo } from "react";
import { ShieldCheck, Copy, Check, Sparkles, ExternalLink, Code2 } from "lucide-react";
import "../shared.css";
import "./BadgeMaker.css";

const PRESETS = [
  { label:"React",        color:"#20232A", logo:"react",        logoColor:"61DAFB", name:"React"      },
  { label:"Spring_Boot",  color:"#6DB33F", logo:"springboot",   logoColor:"white",  name:"Spring Boot"},
  { label:"Angular",      color:"#DD0031", logo:"angular",      logoColor:"white",  name:"Angular"    },
  { label:"MySQL",        color:"#4479A1", logo:"mysql",        logoColor:"white",  name:"MySQL"      },
  { label:"Tailwind_CSS", color:"#06B6D4", logo:"tailwindcss",  logoColor:"white",  name:"Tailwind"   },
  { label:"Docker",       color:"#2496ED", logo:"docker",       logoColor:"white",  name:"Docker"     },
  { label:"TypeScript",   color:"#3178C6", logo:"typescript",   logoColor:"white",  name:"TypeScript" },
  { label:"Python",       color:"#3776AB", logo:"python",       logoColor:"white",  name:"Python"     },
];
const STYLES = [
  { id:"for-the-badge", label:"For The Badge" },
  { id:"flat",          label:"Flat"          },
  { id:"flat-square",   label:"Flat Square"   },
  { id:"plastic",       label:"Plastic"       },
];

export default function BadgeMaker({ onCopy }) {
  const [label, setLabel]   = useState("React");
  const [color, setColor]   = useState("#20232A");
  const [logo,  setLogo]    = useState("react");
  const [lc,    setLc]      = useState("61DAFB");
  const [style, setStyle]   = useState("for-the-badge");
  const [tab,   setTab]     = useState("markdown");
  const [copied,setCopied]  = useState(false);

  const badgeUrl = useMemo(() => {
    const lbl   = (label.trim() || "Badge").replace(/-/g,"--").replace(/_/g,"__");
    const clr   = color.replace("#","") || "6366f1";
    let url = `https://img.shields.io/badge/${encodeURIComponent(lbl)}-${clr}?style=${style}`;
    if (logo.trim()) {
      url += `&logo=${encodeURIComponent(logo.trim())}`;
      if (lc.trim()) url += `&logoColor=${encodeURIComponent(lc.trim().replace("#",""))}`;
    }
    return url;
  }, [label, color, logo, lc, style]);

  const output = useMemo(() => {
    const l = label.trim() || "Badge";
    if (tab === "markdown") return `![${l}](${badgeUrl})`;
    if (tab === "html")     return `<img src="${badgeUrl}" alt="${l}" />`;
    return badgeUrl;
  }, [badgeUrl, label, tab]);

  const apply = (p) => { setLabel(p.label); setColor(p.color); setLogo(p.logo); setLc(p.logoColor); };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(output);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Preview canvas */}
      <div className="bm-canvas">
        <span className="bm-canvas-label">Live Preview</span>
        <div className="bm-badge-wrap">
          <img src={badgeUrl} alt={label || "badge"} className="bm-badge-img" />
        </div>
      </div>

      {/* Presets */}
      <div className="bm-presets">
        <span className="bm-presets-label"><Sparkles size={12} color="#818cf8" /> Quick Presets:</span>
        <div className="bm-preset-chips">
          {PRESETS.map((p) => (
            <button key={p.name} className="bm-preset-chip" onClick={() => apply(p)}>
              <span className="bm-preset-dot" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Config Grid */}
      <div className="bm-grid">
        {/* Label */}
        <div className="bm-field">
          <label className="bm-field-label">Badge Label</label>
          <input
            type="text" value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. React" className="bm-input"
          />
          <span className="bm-field-hint">Use <code style={{background:"rgba(255,255,255,0.08)",padding:"1px 4px",borderRadius:4,fontSize:10}}>_</code> for spaces</span>
        </div>

        {/* Color */}
        <div className="bm-field">
          <label className="bm-field-label">Hex Color</label>
          <div className="bm-color-row">
            <input
              type="color"
              value={color.startsWith("#") ? color : `#${color}`}
              onChange={(e) => setColor(e.target.value)}
              className="bm-color-swatch"
            />
            <input
              type="text" value={color} onChange={(e) => setColor(e.target.value)}
              placeholder="#20232A" className="bm-input"
              style={{ fontFamily:"var(--font-mono)", textTransform:"uppercase" }}
            />
          </div>
        </div>

        {/* Icon */}
        <div className="bm-field">
          <div className="bm-field-label-row">
            <label className="bm-field-label" style={{margin:0}}>Icon Slug</label>
            <a href="https://simpleicons.org" target="_blank" rel="noreferrer" className="bm-ext-link">
              SimpleIcons <ExternalLink size={10} />
            </a>
          </div>
          <input
            type="text" value={logo} onChange={(e) => setLogo(e.target.value)}
            placeholder="e.g. react" className="bm-input"
          />
        </div>

        {/* Style */}
        <div className="bm-field">
          <label className="bm-field-label">Badge Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="bm-select">
            {STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Output Tabs */}
      <div className="bm-output">
        <div className="bm-output-tabs">
          {["markdown","html","url"].map((t) => (
            <button key={t} className={`bm-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "markdown" ? "Markdown" : t === "html" ? "HTML" : "Raw URL"}
            </button>
          ))}
        </div>
        <div className="bm-output-body">
          <Code2 size={14} color="#334155" style={{ flexShrink: 0 }} />
          <code className="bm-output-code">{output}</code>
          <button className={`btn ${copied ? "btn-success" : "btn-primary"}`} onClick={handleCopy} style={{flexShrink:0}}>
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  );
}
