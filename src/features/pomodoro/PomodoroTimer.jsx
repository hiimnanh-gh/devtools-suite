import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX, Brain, Coffee, Sparkles } from "lucide-react";
import "./PomodoroTimer.css";

const MODES = {
  focus:      { id:"focus",      label:"Focus",       duration:25*60, icon:Brain,    color:"#6366f1", track:"#312e81" },
  shortBreak: { id:"shortBreak", label:"Short Break",  duration:5*60,  icon:Coffee,   color:"#10b981", track:"#064e3b" },
  longBreak:  { id:"longBreak",  label:"Long Break",   duration:15*60, icon:Sparkles, color:"#8b5cf6", track:"#4c1d95" },
};

function playChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.85);
  } catch {}
}

export default function PomodoroTimer() {
  const [mode,     setMode]    = useState("focus");
  const [timeLeft, setTime]    = useState(MODES.focus.duration);
  const [running,  setRunning] = useState(false);
  const [sound,    setSound]   = useState(() => localStorage.getItem("pomo_sound") !== "false");
  const [sessions, setSession] = useState(() => parseInt(localStorage.getItem("pomo_sessions") || "0", 10));
  const timerRef = useRef(null);

  useEffect(() => { localStorage.setItem("pomo_sound",    sound.toString()); }, [sound]);
  useEffect(() => { localStorage.setItem("pomo_sessions", sessions.toString()); }, [sessions]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            if (sound) playChime();
            if (mode === "focus") setSession((s) => s + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [running, mode, sound]);

  const switchMode = (m) => { setRunning(false); setMode(m); setTime(MODES[m].duration); };
  const toggle = () => { if (timeLeft === 0) setTime(MODES[mode].duration); setRunning((p) => !p); };
  const reset  = () => { setRunning(false); setTime(MODES[mode].duration); };

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const R = 108;
  const C = 2 * Math.PI * R;
  const cfg = MODES[mode];
  const offset = C - (timeLeft / cfg.duration) * C;
  const pct = Math.round((timeLeft / cfg.duration) * 100);

  return (
    <div className="pm-shell">
      {/* Mode Selector */}
      <div className="pm-mode-bar">
        {Object.values(MODES).map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.id} className={`pm-mode-btn ${mode === m.id ? "active" : ""}`}
              style={mode === m.id ? { "--m-color": m.color } : {}}
              onClick={() => switchMode(m.id)}>
              <Icon size={14} /> {m.label}
            </button>
          );
        })}
      </div>

      {/* Timer Ring */}
      <div className="pm-ring-wrap">
        <svg className="pm-svg" viewBox="0 0 240 240">
          {/* Track */}
          <circle cx="120" cy="120" r={R} fill="none" stroke={cfg.track} strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="120" cy="120" r={R}
            fill="none"
            stroke={cfg.color}
            strokeWidth="8"
            strokeDasharray={C}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 120 120)"
            style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
          />
        </svg>

        {/* Center content */}
        <div className="pm-ring-center">
          <div className="pm-ring-label">{cfg.label}</div>
          <div className="pm-ring-time" style={{ color: running ? cfg.color : "var(--text-primary)" }}>
            {fmt(timeLeft)}
          </div>
          <div className="pm-ring-sub">
            {running ? "Focus in progress" : timeLeft === 0 ? "✓ Completed!" : "Paused"}
          </div>
          <div className="pm-ring-pct" style={{ color: cfg.color }}>{pct}%</div>
        </div>
      </div>

      {/* Controls */}
      <div className="pm-controls">
        <button className="pm-btn-icon" onClick={reset} title="Reset"><RotateCcw size={18} /></button>

        <button className="pm-btn-play" onClick={toggle}
          style={{ background: running ? "#b45309" : cfg.color, boxShadow: `0 6px 24px ${cfg.color}44` }}>
          {running ? <><Pause size={18} fill="currentColor" /> Pause</> : <><Play size={18} fill="currentColor" /> {timeLeft === 0 ? "Restart" : "Start"}</>}
        </button>

        <button className="pm-btn-icon" onClick={() => setSound((p) => !p)} title={sound ? "Mute" : "Unmute"}>
          {sound ? <Volume2 size={18} color="#818cf8" /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Session counter */}
      <div className="pm-sessions">
        <div className="pm-sessions-left">
          <CheckCircle2 size={15} color="#34d399" />
          Sessions completed: <strong style={{ color: "var(--text-primary)" }}>{sessions}</strong>
        </div>
        {sessions > 0 && (
          <button className="pm-sessions-reset" onClick={() => setSession(0)}>Reset count</button>
        )}
      </div>
    </div>
  );
}
