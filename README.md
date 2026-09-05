<div align="center">

  # ✦ ARFA DANIAL (`@nyzxis`) ✦
  ### *Full-Stack Developer & Cybersecurity / AI Systems Engineer*

  <p align="center">
    <a href="https://nyzxis.vercel.app/">
      <img src="https://img.shields.io/badge/Live_Portfolio-nyzxis.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio" />
    </a>
    <a href="https://github.com/nyzxis">
      <img src="https://img.shields.io/badge/GitHub-@nyzxis-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
    </a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Three.js-R3F%20%2B%20Rapier-black?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-94A3B8?style=flat-square" alt="Lenis" />
    <img src="https://img.shields.io/badge/Python-FastAPI%20%2F%20ML-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  </p>

</div>

---

## 🌌 Overview

Welcome to the official repository for my personal interactive developer portfolio, hosted live at **[nyzxis.vercel.app](https://nyzxis.vercel.app/)**.

Designed with an ultra-minimalist, dark-cyber editorial aesthetic, this site showcases high-performance 3D physics interaction, buttery-smooth typography, interactive particle effects, and an end-to-end suite of **5 production cybersecurity & AI systems**.

---

## ⚡ Key Highlights & Engineering Features

- **Interactive 3D Physics Lanyard Card**: Real-time interactive 3D identification badge built with **React Three Fiber (R3F)**, **Three.js**, and rigid-body physical simulation powered by **Rapier physics** (`@react-three/rapier`).
- **60 FPS Kinetic Micro-Interactions**: Custom hardware cursor with fine/coarse pointer sensing, tactile magnetic cards, and fluid viewport transitions orchestrated by **Framer Motion**.
- **Lenis Smooth Scrolling**: Decoupled momentum scrolling paired with optimized scroll-driven sections.
- **Ultra-Fast Performance**:
  - Deferred 3D WebGL initialization using Intersection Observers (zero main-thread blocking on initial load).
  - High-efficiency WebP asset compression reducing initial bundle payloads by over 70%.
  - Interactive tap/click instant-dismiss splash sequence.
- **Comprehensive Project Showcase**: Live interactive cards with live demo triggers, source repositories, and custom vector artwork.

---

## 🛡️ Featured Cybersecurity & AI Project Suite

| Project | Tech Stack | Live Demo | Repository |
| :--- | :--- | :--- | :--- |
| **APIShield**<br><sub>OWASP API Top 10 Pentesting Engine</sub> | FastAPI • Python • PostgreSQL • React 19 • Requests | [🔗 Live Demo](https://apishield-pi.vercel.app/) | [📁 GitHub](https://github.com/nyzxis/apishield) |
| **MalGuard**<br><sub>AI Malware Classifier & PE Forensics</sub> | Scikit-learn • FastAPI • React 19 • Pandas • XAI | [🔗 Live Demo](https://malguard.vercel.app/) | [📁 GitHub](https://github.com/nyzxis/malguard) |
| **VulnShield**<br><sub>Automated Web Vulnerability Scanner</sub> | FastAPI • BeautifulSoup4 • React 19 • Heuristics | [🔗 Live Demo](https://vulnshield.vercel.app/) | [📁 GitHub](https://github.com/nyzxis/vulnshield) |
| **KeyVault**<br><sub>Password Security & Breach Analyzer</sub> | React 19 • TypeScript • FastAPI • HIBP k-Anonymity | [🔗 Live Demo](https://pwsec-nyz.vercel.app/) | [📁 GitHub](https://github.com/nyzxis/password-security-analyzer) |
| **PhishGuard**<br><sub>AI Phishing Detection System</sub> | Scikit-learn • Flask • React • PostgreSQL | [🔗 Live Demo](https://phishingdetector-nyzxis.vercel.app/) | [📁 GitHub](https://github.com/nyzxis/phishing-detector) |
| **StudyIt**<br><sub>Productivity & Study Workspace</sub> | Vanilla JavaScript • HTML5 • CSS3 | [🔗 Live Demo](https://studyitpi.vercel.app/) | [📁 GitHub](https://github.com/nyzxis/studyit) |

---

## 🛠️ Tech Stack & Architecture

### Core Frontend & 3D WebGL
- **Framework**: React 19.2 (Vite)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **3D Graphics & Physics**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `meshline`
- **Animation & Motion**: Framer Motion 12, Lenis Smooth Scroll
- **Icons**: Lucide React, React Icons

### Backend & Machine Learning Ecosystem
- **Languages**: Python 3.11+, TypeScript, Node.js
- **API Frameworks**: FastAPI, Uvicorn, Flask
- **Data & Machine Learning**: Scikit-learn, Pandas, NumPy, Joblib, Explainable AI (SHAP / feature attribution)
- **Databases**: PostgreSQL, SQLAlchemy, SQLite
- **Deployment**: Vercel Serverless Functions, Edge Networks, GitHub Actions

---

## 📁 Repository Structure

```text
personal-portfolio/
├── public/
│   └── assets/                      # High-resolution WebP & custom project SVGs
│       ├── apishield.svg
│       ├── malguard.svg
│       ├── vulnshield.svg
│       ├── keyvault.svg
│       ├── phishguard.svg
│       └── studyit.svg
├── src/
│   ├── components/
│   │   ├── BandCard.tsx             # 3D interactive physics lanyard (R3F + Rapier)
│   │   ├── ContactSection.tsx       # Interactive contact form & socials
│   │   ├── CustomCursor.tsx         # Scoped hardware cursor with touch suppression
│   │   ├── FrontendDeveloperSection.tsx
│   │   ├── Showcase.tsx             # Curated project gallery & certificate viewer
│   │   └── WelcomeScreen.tsx        # High-performance splash sequence
│   ├── pages/
│   │   ├── Home.tsx                 # Main landing experience
│   │   └── About.tsx                # Interactive resume & engineering dossier
│   ├── App.tsx                      # Root route orchestrator
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Local Development

Clone the repository and install dependencies:

```bash
# Clone repository
git clone https://github.com/nyzxis/personal-portfolio.git

# Navigate into project directory
cd personal-portfolio

# Install node dependencies
npm install

# Start local Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```

---

## 📬 Contact & Connect

- **Portfolio**: [nyzxis.vercel.app](https://nyzxis.vercel.app/)
- **GitHub**: [@nyzxis](https://github.com/nyzxis)
- **Email**: [danial@nyzxis.dev](mailto:danial@nyzxis.dev)

---

<p align="center">
  <sub>Crafted with precision by <strong>Arfa Danial (@nyzxis)</strong> • Built with React 19, Three.js &amp; Tailwind CSS</sub>
</p>
