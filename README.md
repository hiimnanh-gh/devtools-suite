# DevTools Suite

A modern, fast, and minimalist collection of single-purpose browser utilities built for developers. DevTools Suite runs entirely client-side with zero tracking, instant execution, and a distraction-free dark interface.

---

## Overview

DevTools Suite provides essential daily developer tools in one lightweight web application. Every tool is designed to solve a specific development task quickly without sending sensitive data to external servers.

---

## Features

### 1. CSS Gradient Generator
- Live visual gradient canvas supporting Linear and Radial modes.
- Dual color pickers with hex text input and stop percentage sliders (0% to 100%).
- Angle direction controller (0 deg to 360 deg) with one-click quick presets (0, 45, 90, 135, 180, 225, 270, 315 deg).
- Color stop swapping and radial shape options (circle, ellipse).
- 6 curated gradient presets with instant application.
- One-click CSS rule copy with clipboard feedback.

### 2. JSON Formatter and Validator
- Two-pane layout with raw JSON input on the left and formatted output on the right.
- Real-time syntax validation with specific error messaging.
- Full syntax highlighting for keys, strings, numbers, booleans, and null values.
- Quick actions: Beautify (2-space indentation), Minify (single-line), Load Sample, and Clear.
- One-click clean JSON copy.

### 3. SVG Minifier and Previewer
- Live SVG rendering canvas with checkered transparency background.
- Automated minification: strips XML comments, DOCTYPE declarations, and redundant whitespace.
- Real-time compression metrics displaying original byte size, minified size, and percentage saved.
- Source code editor and live preview synchronization.
- One-click minified SVG code copy.

### 4. Tech Stack Badge Maker
- Interactive Shields.io badge generator with real-time preview.
- Configurable fields: Badge Label, Background Hex Color, SimpleIcons icon slug, and Badge Style (For The Badge, Flat, Flat Square, Plastic).
- 8 quick tech presets: React, Spring Boot, Angular, MySQL, Tailwind CSS, Docker, TypeScript, and Python.
- Multi-format output tabs: Markdown, HTML image tag, and Direct URL.
- URL-safe encoding for special characters and spaces.

### 5. Pomodoro Focus Timer
- 3 timer modes: Focus (25 min), Short Break (5 min), and Long Break (15 min).
- Circular SVG progress ring with smooth stroke-dashoffset animation.
- Tabular countdown display preventing layout shift.
- Completion chime synthesized with the browser Web Audio API (toggleable).
- Session counter with local storage persistence.

### 6. CSS Box-Shadow and Glassmorphism Generator
- Mode switcher: Layered Box-Shadow vs Glassmorphism (Frosted Glass).
- Box-Shadow controls: X-Offset, Y-Offset, Blur Radius, Spread Radius, Shadow Opacity, Hex Color Picker, and Inset toggle.
- Glassmorphism controls: Backdrop Blur, Background Opacity, Border Opacity, and Glass Tint Color.
- Live preview card rendered on dynamic gradient backgrounds.
- Curated presets for elevation shadows and frosted glass styles.
- Clean multi-line CSS output with one-click copy.

### 7. Markdown Live Previewer
- Split-screen editor with raw markdown input and live rendered HTML preview.
- Support for Headings (H1 to H6), Bold, Italic, Code blocks, Inline code, Blockquotes, Tables, Lists, Links, Images, and Horizontal rules.
- Quick Insert Toolbar: Bold, Italic, Link, Code, Image, H2, and Blockquote at cursor position.
- Real-time statistics: Word count, Character count, and Estimated reading time.
- Action buttons: Copy Raw Markdown and Copy HTML Output.

### 8. JWT Inspector and Base64 Tool
- Client-side JWT decoder with zero network transmission for security.
- Color-coded token breakdown: Header (Red), Payload (Purple), and Signature (Cyan).
- JSON syntax-highlighted decoded views for Header and Payload claims.
- Automatic expiration detection displaying Active or Expired state with remaining time.
- Base64 UTF-8 encoder and decoder with instant swap functionality.

---

## Tech Stack

- Framework: React 19
- Build Tool: Vite 8
- Styling: Dedicated Vanilla CSS Design System with CSS Custom Properties
- Icons: Lucide React
- Typography: Inter and JetBrains Mono

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hiimnanh-gh/devtools-suite.git
cd devtools-suite
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
devtools-suite/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── features/
│   │   ├── badge-maker/
│   │   │   ├── BadgeMaker.css
│   │   │   └── BadgeMaker.jsx
│   │   ├── gradient/
│   │   │   ├── GradientGenerator.css
│   │   │   └── GradientGenerator.jsx
│   │   ├── json-formatter/
│   │   │   ├── JsonFormatter.css
│   │   │   └── JsonFormatter.jsx
│   │   ├── jwt-inspector/
│   │   │   ├── JwtInspector.css
│   │   │   └── JwtInspector.jsx
│   │   ├── markdown-previewer/
│   │   │   ├── MarkdownPreviewer.css
│   │   │   └── MarkdownPreviewer.jsx
│   │   ├── pomodoro/
│   │   │   ├── PomodoroTimer.css
│   │   │   └── PomodoroTimer.jsx
│   │   ├── shadow-generator/
│   │   │   ├── ShadowGenerator.css
│   │   │   └── ShadowGenerator.jsx
│   │   ├── svg-tool/
│   │   │   ├── SvgOptimizer.css
│   │   │   └── SvgOptimizer.jsx
│   │   └── shared.css
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Design Principles

- Client-Side Only: No server-side processing or external API calls for data conversion, ensuring full user privacy.
- Lightweight Architecture: Zero heavy runtime UI frameworks; styled completely with modular, scoped CSS.
- Responsive Layout: Adaptable card grid and split-screen layouts optimized for both desktop and mobile viewports.
- Keyboard and Clipboard Optimized: One-click copy actions across all generators and converters.

---

## License

This project is licensed under the MIT License.
