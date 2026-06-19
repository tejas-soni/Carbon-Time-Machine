# ⏳ Carbon Time Machine

> **See the future your habits are quietly building.**

Carbon Time Machine is an interactive, bright, and responsive web application designed for **PromptWars Challenge 3: Carbon Footprint Awareness Platform**. Rather than acting as a dry carbon calculator displaying static numbers, Carbon Time Machine turns everyday lifestyle choices into visual simulated timelines for a future city in 2050. It challenges users to explore two paths: Timeline A (continuing unchanged patterns) versus Timeline B (committing to just one high-impact habit shift).

---

## 🚀 Live Demo & Repository
- **Live Demo Link**: [https://carbontimemachine.tejassoni.in/](https://carbontimemachine.tejassoni.in/)
- **GitHub Repository**: [https://github.com/tejas-soni/Carbon-Time-Machine](https://github.com/tejas-soni/Carbon-Time-Machine)

---

## 🎯 Problem Statement Alignment & Awareness

Standard footprint apps focus heavily on numbers, metrics, and guilt: *"Your footprint is 5.4 tons CO2e/year."* 
**Carbon Time Machine** shifts the paradigm toward **emotional awareness, visual consequence, and behavioral action**:
- **Future Visualization**: Connects lifestyle habits to a dynamic, animated SVG city.
- **Timeline Comparison**: A slider lets users travel from 2026 to 2050, comparing the visual and environmental state of the city under two timelines side-by-side.
- **One Habit Shift**: Promotes focused behavior change by recommending exactly one high-leverage habit action based on the user's carbon behavior archetype, eliminating choice fatigue.
- **Daily Loop**: Features a 7-day local progress tracker where each daily check-in physically restores the sky clarity and adds green elements to the user's simulated future city.

---

## 🛠️ Architecture & Tech Stack

### Technology Stack
- **Core Framework**: React (v18) + Vite + TypeScript.
- **Styling**: Vanilla CSS utilizing modern CSS variables for a cohesive theme ("Clean Future Lab" mood) with native transitions.
- **Graphics Engine**: 100% code-driven responsive inline SVGs with keyframe animations (no external heavy assets).
- **Testing**: Vitest for fast, reliable unit testing.
- **Persistence**: Browser `localStorage` (fully private, zero-backend dependency).

### System Directory structure
```text
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── index.css          # Design system & HSL theme configurations
│   ├── App.tsx            # Navigation state and page controller
│   ├── types.ts           # Shared TypeScript interfaces
│   ├── components/
│   │   ├── SVGWorld.tsx   # Interactive animated city simulator
│   │   ├── Stepper.tsx    # Mobile progressive quiz progress
│   │   ├── ShareCard.tsx  # Web Share API & Copy-to-clipboard cards
│   │   └── Timeline.tsx   # Comparison year slider & descriptions
│   └── utils/
│       ├── scoring.ts     # Calculations, archetypes, and recommendation engine
│       ├── storage.ts     # LocalStorage state management
│       └── templates.ts   # Future-self narrative templates
└── src/__tests__/
    ├── scoring.test.ts    # Test suites for scoring logic
    └── storage.test.ts    # Test suites for storage helpers
```

---

## 💡 AI Integration & Security Strategy

To ensure absolute security of API keys while providing a rich personalized experience:
- **Zero Exposed Secrets**: The Gemini 3.1 Flash Lite API is securely called via a Vercel Serverless Function (`api/generate.ts`). The `GEMINI_API_KEY` is safely stored in Vercel Environment Variables, preventing client-side leakage.
- **Smart Caching**: Once an AI note is generated for a user's pledge, the result is cached in state. Toggling between Local and AI views does not trigger redundant API calls.
- **Instant Fallback**: A set of highly refined narrative letters from a 2050 future-self are compiled locally based on the user's behavior archetype. If the API key is missing or the network fails, the system instantly falls back to these local templates, guaranteeing that the application **never crashes or freezes**.

---

## ♿ Accessibility (a11y) & Responsiveness

### Accessibility Compliance
- **Landmarks**: Uses semantic elements (`<header>`, `<section>`, `<footer >`, `role="radiogroup"`).
- **Keyboard Navigation**: Stepper steps, options, and actions are keyboard-navigable with clear focus styles.
- **Color Contrast**: Maintained a bright pastel theme with high-contrast text styles (`#112233` text on `#FFFFFF`/`#F8FFF7` backgrounds).
- **Screen Reader Support**: Integrated hidden `sr-only` descriptions for the `SVGWorld` detailing the cloud, tree, traffic, energy, and smog statuses for screen-reading software.
- **Reduced Motion**: All keyframe animations (spinning wind turbines, moving traffic, pulsing windows) scale down or freeze when `@media (prefers-reduced-motion: reduce)` is toggled on in the user's OS.

### Responsiveness
- Scaled from mobile screens (360px+) to high-resolution desktop environments.
- Mobile stacked timeline grid utilizing tabbed navigators to prevent horizontal scrollbars and text overcrowding.
- Dynamic responsive SVG rendering via viewBox coordinates.

---

## 📊 Carbon Estimation Disclaimer
*This application is an educational awareness estimate, not official carbon accounting. Calculations utilize typical global averages for transportation fuel types, food shipping/packaging, grid load cooling indexes, apparel production, and packaging waste footprints. Individual emissions vary based on local energy grids, product supply chains, and regional climate variations.*

---

## ⚙️ Development Commands

### 1. Installation
```powershell
npm install
```

### 2. Run Dev Server
```powershell
npm run dev
```

### 3. Run Unit Tests (Vitest)
```powershell
npm test
# Or to run once:
npx vitest run
```

### 4. Build Production Bundle
```powershell
npm run build
```

---

## 🏆 Hackathon Compliance Checklist

- [x] **Repository under 10 MB**: Kept lightweight by eliminating external assets, videos, heavy fonts, or unnecessary libraries.
- [x] **Zero Exposed Secrets**: No API keys are written or referenced in client-side code.
- [x] **Single-Branch Model**: Developed and maintained exclusively on the `main` branch.
- [x] **Fully Tested**: Coverage includes scoring matrices, archetype selections, state configurations, and storage actions.
- [x] **Pure Web Application**: Runs seamlessly on Safari, Chrome, and Firefox mobile and desktop browsers.
