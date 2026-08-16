import React, { useState, useMemo, useRef } from "react";
import { FileText, Copy, Check, Code, Type, Trash2, Link, Image, BookOpen } from "lucide-react";
import "../shared.css";
import "./MarkdownPreviewer.css";

const DEFAULT_MD = `# Welcome to Markdown Previewer

A **live** *split-screen* editor that renders markdown in real-time.

## Features

- ✅ **Bold** and *italic* text
- ✅ Headers (H1–H6)
- ✅ Lists (ordered & unordered)
- ✅ \`inline code\` and code fences
- ✅ Blockquotes, tables, and more

## Code Example

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("DevTools"));
\`\`\`

> "Any tool should be useful in the expected way, but a truly great tool lends itself to uses you never anticipated."

| Tool             | Category   | Rating |
|------------------|------------|--------|
| CSS Gradient     | Design     | ⭐⭐⭐⭐⭐ |
| JSON Formatter   | Formatter  | ⭐⭐⭐⭐⭐ |
| Markdown Preview | Editor     | ⭐⭐⭐⭐⭐ |

---

Happy writing! 🚀
`;

// Lightweight regex-based markdown parser
function parseMarkdown(md) {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Code fences (must run before inline)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="lang-${lang || ""}">${code.trim()}</code></pre>`)
    // Headings
    .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.+)$/gm,  "<h5>$1</h5>")
    .replace(/^#### (.+)$/gm,   "<h4>$1</h4>")
    .replace(/^### (.+)$/gm,    "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,     "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,      "<h1>$1</h1>")
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr/>")
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,         "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Images before links
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    // Tables
    .replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm, (_, header, rows) => {
      const ths = header.split("|").filter(Boolean).map(h => `<th>${h.trim()}</th>`).join("");
      const trs = rows.trim().split("\n").map(row => {
        const tds = row.split("|").filter(Boolean).map(c => `<td>${c.trim()}</td>`).join("");
        return `<tr>${tds}</tr>`;
      }).join("");
      return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    })
    // Unordered lists
    .replace(/^[\*\-] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Paragraphs (non-tagged lines)
    .replace(/^(?!<[a-z]|\s*$)(.+)$/gm, "<p>$1</p>")
    // Clean up extra blank lines
    .replace(/\n{3,}/g, "\n\n");

  return html;
}

const INSERT_ACTIONS = [
  { label: "B",    icon: null,       wrap: ["**", "**"],        placeholder: "bold"        },
  { label: "I",    icon: null,       wrap: ["*",  "*"],         placeholder: "italic"      },
  { label: "Link", icon: Link,       insert: "[text](url)",     placeholder: null          },
  { label: "Code", icon: Code,       wrap: ["`",  "`"],         placeholder: "code"        },
  { label: "Img",  icon: Image,      insert: "![alt](url)",     placeholder: null          },
  { label: "H2",   icon: Type,       insert: "## Heading",      placeholder: null          },
  { label: "BQ",   icon: BookOpen,   insert: "> Blockquote",    placeholder: null          },
];

export default function MarkdownPreviewer({ onCopy }) {
  const [raw,       setRaw]       = useState(DEFAULT_MD);
  const [copiedMd,  setCopiedMd]  = useState(false);
  const [copiedHtml,setCopiedHtml]= useState(false);
  const taRef = useRef(null);

  const rendered = useMemo(() => parseMarkdown(raw), [raw]);

  const words   = raw.trim() ? raw.trim().split(/\s+/).length : 0;
  const chars   = raw.length;
  const readMin = Math.max(1, Math.round(words / 200));

  const copyMd = () => {
    navigator.clipboard.writeText(raw);
    setCopiedMd(true);
    if (typeof onCopy === "function") onCopy(raw);
    setTimeout(() => setCopiedMd(false), 2000);
  };
  const copyHtml = () => {
    navigator.clipboard.writeText(rendered);
    setCopiedHtml(true);
    if (typeof onCopy === "function") onCopy(rendered);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const insertAtCursor = (action) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = raw.slice(start, end);

    let newVal, newCursor;
    if (action.insert) {
      newVal    = raw.slice(0, start) + action.insert + raw.slice(end);
      newCursor = start + action.insert.length;
    } else {
      const text = sel || action.placeholder;
      const wrapped = action.wrap[0] + text + action.wrap[1];
      newVal    = raw.slice(0, start) + wrapped + raw.slice(end);
      newCursor = start + action.wrap[0].length + text.length + action.wrap[1].length;
    }
    setRaw(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newCursor, newCursor);
    });
  };

  return (
    <div>
      {/* Quick Insert Toolbar */}
      <div className="mp-toolbar">
        {INSERT_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <button key={i} className="mp-toolbar-btn" onClick={() => insertAtCursor(a)} title={a.label}>
              {Icon ? <Icon size={12} /> : null}
              {a.label}
            </button>
          );
        })}
        <div className="mp-toolbar-sep" />
        <button className={`btn btn-ghost ${copiedMd ? "btn-success" : ""}`} style={{ fontSize: 11, padding: "5px 10px" }} onClick={copyMd}>
          {copiedMd ? <><Check size={11} /> Copied MD!</> : <><Copy size={11} /> Copy MD</>}
        </button>
        <button className={`btn btn-ghost ${copiedHtml ? "btn-success" : ""}`} style={{ fontSize: 11, padding: "5px 10px" }} onClick={copyHtml}>
          {copiedHtml ? <><Check size={11} /> Copied HTML!</> : <><Copy size={11} /> Copy HTML</>}
        </button>
        <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => setRaw("")}>
          <Trash2 size={11} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="mp-stats">
        <div className="mp-stat"><FileText size={12} /><strong>{words}</strong> words</div>
        <div className="mp-stat"><strong>{chars}</strong> chars</div>
        <div className="mp-stat">~<strong>{readMin}</strong> min read</div>
      </div>

      {/* Two-pane */}
      <div className="two-pane">
        {/* Editor */}
        <div className="pane">
          <div className="pane-header">
            <div className="pane-header-left"><FileText size={13} color="#818cf8" /> Markdown Editor</div>
          </div>
          <div className="pane-body">
            <textarea
              ref={taRef}
              className="code-editor"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Write markdown here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="pane">
          <div className="pane-header">
            <div className="pane-header-left">Live Preview</div>
            <span className="status-badge indigo">Rendered</span>
          </div>
          <div className="pane-body" style={{ overflow: "hidden" }}>
            <div
              className="mp-rendered code-output"
              style={{ border: "none", background: "transparent", padding: "4px" }}
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
