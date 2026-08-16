import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  CheckCircle2,
  Volume2,
  VolumeX,
  Coffee,
  Brain,
  Sparkles,
} from "lucide-react";
import "./PomodoroTimer.css";

const MODES = {
  focus: {
    id: "focus",
    label: "Focus",
    duration: 25 * 60, // 25 minutes
    icon: Brain,
    color: "#6366f1", // indigo
    glowClass: "text-indigo-400",
  },
  shortBreak: {
    id: "shortBreak",
    label: "Short Break",
    duration: 5 * 60, // 5 minutes
    icon: Coffee,
    color: "#10b981", // emerald
    glowClass: "text-emerald-400",
  },
  longBreak: {
    id: "longBreak",
    label: "Long Break",
    duration: 15 * 60, // 15 minutes
    icon: Sparkles,
    color: "#8b5cf6", // purple
    glowClass: "text-purple-400",
  },
};

// Gentle chime using Web Audio API
function playChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Gentle pleasant chime: D5 (587.33Hz) -> A5 (880Hz)
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  } catch {
    // Ignore audio context autoplay limitations
  }
}

export default function PomodoroTimer({ onCopy }) {
  const [activeMode, setActiveMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("devtools_pomo_sound") !== "false";
  });
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("devtools_pomo_sessions");
    return saved ? parseInt(saved, 10) : 0;
  });

  const timerRef = useRef(null);

  // Sync session counter to localStorage
  useEffect(() => {
    localStorage.setItem("devtools_pomo_sessions", sessions.toString());
  }, [sessions]);

  // Sync sound preference to localStorage
  useEffect(() => {
    localStorage.setItem("devtools_pomo_sound", soundEnabled.toString());
  }, [soundEnabled]);

  // Timer interval effect with clean cleanup
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);

            if (soundEnabled) {
              playChime();
            }

            if (activeMode === "focus") {
              setSessions((s) => s + 1);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, activeMode, soundEnabled]);

  const switchMode = (modeKey) => {
    setIsRunning(false);
    setActiveMode(modeKey);
    setTimeLeft(MODES[modeKey].duration);
  };

  const handleTogglePlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(MODES[activeMode].duration);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[activeMode].duration);
  };

  const handleResetSessions = () => {
    setSessions(0);
  };

  // Format Time display MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Circular progress bar values
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const currentTotal = MODES[activeMode].duration;
  const progressRatio = timeLeft / currentTotal;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const currentConfig = MODES[activeMode];

  return (
    <div className="space-y-6 flex flex-col items-center max-w-lg mx-auto">
      {/* Top Header Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md w-full justify-center">
        {Object.values(MODES).map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => switchMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex-1 justify-center ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Circular Timer Display */}
      <div className="relative flex items-center justify-center py-4">
        <div
          className={`w-72 h-72 rounded-full flex flex-col items-center justify-center relative bg-slate-900/40 border border-slate-800/80 shadow-2xl transition-all duration-500 ${
            isRunning ? "pomodoro-active-glow" : ""
          }`}
        >
          {/* Circular SVG Ring */}
          <svg className="w-full h-full absolute inset-0 -rotate-90 pointer-events-none">
            {/* Background Track */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="#1e293b"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke={currentConfig.color}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="pomodoro-progress-circle"
            />
          </svg>

          {/* Time and Status inside Circle */}
          <div className="flex flex-col items-center justify-center space-y-1 z-10 select-none">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {currentConfig.label}
            </span>
            <div className="pomodoro-digit-display text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <span className="text-xs font-medium text-slate-400 pt-1">
              {isRunning ? "Session in progress" : timeLeft === 0 ? "Completed!" : "Paused"}
            </span>
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all duration-200 cursor-pointer ${
            isRunning
              ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
              : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 scale-105"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{timeLeft === 0 ? "Restart" : "Start Focus"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-lg ${
            soundEnabled
              ? "bg-slate-900 border-slate-800 text-indigo-400 hover:bg-slate-800"
              : "bg-slate-900/50 border-slate-800/60 text-slate-500 hover:text-slate-300"
          }`}
          title={soundEnabled ? "Mute completion chime" : "Enable completion chime"}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Session Counter & Bottom Bar */}
      <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Sessions Completed: <strong className="text-white">{sessions}</strong>
          </span>
        </div>

        {sessions > 0 && (
          <button
            type="button"
            onClick={handleResetSessions}
            className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Reset Count
          </button>
        )}
      </div>
    </div>
  );
}
