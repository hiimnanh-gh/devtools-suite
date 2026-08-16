import React, { useState, useMemo } from "react";
import {
  KeyRound, Copy, Check, Clock, ArrowLeftRight, AlertCircle, Sparkles, RotateCcw,
} from "lucide-react";
import "../shared.css";
import "./JwtInspector.css";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMTIzIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0MDAwMDAwLCJleHAiOjI3MjQwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function b64Decode(str) {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return JSON.parse(atob(base64));
  } catch {
    try { return atob(base64); } catch { return null; }
  }
}

function prettyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

// Syntax highlight JSON string
function highlightJson(str) {
  return str
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"(\w+)":/g, '<span class="jwt-json-key">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="jwt-json-str">"$1"</span>')
    .replace(/: (\d+)/g,     ': <span class="jwt-json-num">$1</span>')
    .replace(/: (true|false)/g, ': <span class="jwt-json-bool">$1</span>');
}

export default function JwtInspector({ onCopy }) {
  const [mode,    setMode]    = useState("jwt");   // 'jwt' | 'base64'
  const [token,   setToken]   = useState("");
  const [copied,  setCopied]  = useState(false);

  // Base64 state
  const [plain,   setPlain]   = useState("");
  const [encoded, setEncoded] = useState("");
  const [b64Dir,  setB64Dir]  = useState("encode"); // 'encode' | 'decode'

  // Parse JWT
  const jwtParts = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length !== 3) return null;
    const header  = b64Decode(parts[0]);
    const payload = b64Decode(parts[1]);
    if (!header || !payload) return null;
    return { header, payload, sig: parts[2], raw: parts };
  }, [token]);

  const expInfo = useMemo(() => {
    if (!jwtParts?.payload?.exp) return { status: "none", label: "No expiry (exp claim missing)" };
    const exp = jwtParts.payload.exp * 1000;
    const now = Date.now();
    const diff = exp - now;
    const date = new Date(exp).toLocaleString();
    if (diff < 0) return { status: "expired", label: `Expired on ${date}` };
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    const remaining = days > 0 ? `${days}d ${hrs % 24}h left` : hrs > 0 ? `${hrs}h ${mins % 60}m left` : `${mins}m left`;
    return { status: "active", label: `Active — expires ${date} (${remaining})` };
  }, [jwtParts]);

  // Base64 ops
  const handlePlainChange = (v) => {
    setPlain(v);
    try { setEncoded(btoa(unescape(encodeURIComponent(v)))); } catch { setEncoded("Invalid input"); }
  };
  const handleEncodedChange = (v) => {
    setEncoded(v);
    try { setPlain(decodeURIComponent(escape(atob(v)))); } catch { setPlain("Invalid Base64"); }
  };
  const swapB64 = () => {
    setPlain(encoded);
    try { setEncoded(btoa(unescape(encodeURIComponent(encoded)))); } catch {}
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (typeof onCopy === "function") onCopy(text);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Mode bar */}
      <div className="jwt-mode-bar">
        <button className={`jwt-mode-btn ${mode === "jwt" ? "active" : ""}`} onClick={() => setMode("jwt")}>
          <KeyRound size={14} /> JWT Inspector
        </button>
        <button className={`jwt-mode-btn ${mode === "base64" ? "active" : ""}`} onClick={() => setMode("base64")}>
          <ArrowLeftRight size={14} /> Base64 Coder
        </button>
      </div>

      {mode === "jwt" ? (
        <>
          {/* Token input */}
          <div className="tool-toolbar" style={{ marginBottom: 12, alignItems: "flex-start" }}>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste JWT token here… (e.g. eyJhbGciOiJIUzI1NiJ9.xxx.xxx)"
              className="code-editor"
              style={{ flex: 1, height: 70, minHeight: 70 }}
              spellCheck={false}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <button className="btn btn-indigo-outline" onClick={() => setToken(SAMPLE_JWT)}>
                <Sparkles size={12} /> Sample
              </button>
              <button className="btn btn-ghost" onClick={() => setToken("")}><RotateCcw size={13} /></button>
            </div>
          </div>

          {/* Color-coded token display */}
          {jwtParts && (
            <div className="jwt-token-display">
              <span className="jwt-part-header">{jwtParts.raw[0]}</span>
              <span className="jwt-part-dot">.</span>
              <span className="jwt-part-payload">{jwtParts.raw[1]}</span>
              <span className="jwt-part-dot">.</span>
              <span className="jwt-part-sig">{jwtParts.raw[2]}</span>
            </div>
          )}

          {/* Expiry status */}
          {jwtParts && (
            <div className={`jwt-exp-bar ${expInfo.status}`}>
              <Clock size={14} />
              {expInfo.label}
            </div>
          )}

          {/* Segments */}
          {jwtParts ? (
            <div className="jwt-segments">
              <div className="jwt-segment">
                <div className="jwt-segment-header header-color">⬤ Header</div>
                <div className="jwt-segment-body">
                  <pre dangerouslySetInnerHTML={{ __html: highlightJson(prettyJson(jwtParts.header)) }} />
                </div>
              </div>
              <div className="jwt-segment">
                <div className="jwt-segment-header payload-color">⬤ Payload</div>
                <div className="jwt-segment-body">
                  <pre dangerouslySetInnerHTML={{ __html: highlightJson(prettyJson(jwtParts.payload)) }} />
                </div>
              </div>
            </div>
          ) : token.trim() ? (
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={15} /> Invalid JWT — token must have 3 dot-separated parts
            </div>
          ) : null}

          {/* Copy button */}
          {jwtParts && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button className={`btn ${copied ? "btn-success" : "btn-primary"}`}
                onClick={() => handleCopy(prettyJson(jwtParts.payload))}>
                {copied ? <><Check size={13} /> Copied Payload!</> : <><Copy size={13} /> Copy Payload</>}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Base64 Mode */
        <div>
          <div className="b64-grid">
            <div>
              <span className="b64-pane-label">Plain Text (UTF-8)</span>
              <textarea
                className="b64-textarea"
                value={plain}
                onChange={(e) => handlePlainChange(e.target.value)}
                placeholder="Enter plain text to encode…"
                spellCheck={false}
              />
            </div>
            <div className="b64-swap-col">
              <button className="b64-swap-btn" onClick={swapB64} title="Swap & re-encode">
                <ArrowLeftRight size={15} />
              </button>
            </div>
            <div>
              <span className="b64-pane-label">Base64 Encoded</span>
              <textarea
                className="b64-textarea"
                value={encoded}
                onChange={(e) => handleEncodedChange(e.target.value)}
                placeholder="Paste Base64 to decode…"
                spellCheck={false}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className={`btn ${copied ? "btn-success" : "btn-secondary"}`}
              onClick={() => handleCopy(plain)} disabled={!plain}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Decoded</>}
            </button>
            <button className="btn btn-primary"
              onClick={() => handleCopy(encoded)} disabled={!encoded}>
              <Copy size={13} /> Copy Encoded
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
