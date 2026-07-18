# RepHood

**Autonomous Agentic Reputation Engine on Robinhood Chain**

RepHood is a premium, institutional-grade reputation analytics platform powered by [Virtuals Protocol](https://virtuals.io) and deployed on the **Robinhood Chain** (Arbitrum Orbit Stack). It moves beyond subjective, user-driven reviews — instead, specialized AI agents dynamically compute wallet health, process network telemetry, and emit verifiable on-chain reputation attestations in real time.

---

## Overview

Traditional reputation systems are slow, gameable, and subjective. RepHood replaces them with a deterministic, agent-driven audit pipeline:

1. **Wallet & Agent Indexing** — Agents registered via Virtuals Protocol are continuously indexed and scored.
2. **Telemetry Sampling** — The system samples transaction volume (`V_tx`), network age (`A_age`), and anomaly flags (`M_flag`) from on-chain data.
3. **Reputation Delta Formula** — A weighted formula computes a delta score:
   ```
   ΔR = w₁ · log(V_tx) + w₂ · A_age − w₃ · M_flag
   ```
4. **On-Chain Attestation** — The final score is committed via `emitAttestation()` to the Robinhood Chain, with an IPFS evaluation record for cryptographic verifiability.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Styling** | Tailwind CSS v4 |
| **Web3 / Wallet** | Wagmi v2 + Viem |
| **Query Layer** | TanStack React Query |
| **Chain** | Robinhood Chain (Arbitrum Orbit) |
| **Agent Protocol** | Virtuals Protocol |
| **Language** | TypeScript |

---

## Features

- **Cinematic Hero Section** — Full-viewport dark hero with Times New Roman editorial typography and a gradient headline.
- **Live Wallet Connection** — Real-time MetaMask / injected wallet connection via Wagmi, displayed in the Navbar.
- **Agent Directory** — Browse indexed Virtuals Protocol agents with trust scores, anomaly flags, and network age.
- **Live Pipeline Audit Station** — Execute real-time telemetry audits via a terminal-style console that streams agent data step-by-step.
- **Reputation Delta Engine** — On-screen display of the `ΔR` formula and live score computation after each audit.
- **Institutional UI** — Strict matte-black (#0f1010) aesthetic with 1px border layouts, no gradients or neon accents.
- **Footer** — Ecosystem links for Virtuals Protocol, Robinhood Chain, and documentation.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Anmol-345/rephood.git
cd rephood
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
rephood/
├── app/
│   ├── layout.tsx          # Root layout with Web3Provider
│   ├── page.tsx            # Main page (Hero + DemoSection + Footer)
│   └── globals.css         # CSS variables & theme
├── components/
│   ├── Navbar.tsx          # Nav with wallet connection & ecosystem links
│   ├── Hero.tsx            # Cinematic full-viewport hero section
│   ├── Badge.tsx           # Live badge pill
│   ├── DemoSection.tsx     # Agent audit dashboard (main feature)
│   ├── TrustedByStrip.tsx  # Ecosystem branding strip
│   ├── Footer.tsx          # Site footer with protocol links
│   └── Web3Provider.tsx    # Wagmi + TanStack Query context wrapper
└── public/
    └── heroBackground.png  # Hero section background image
```

---

## Design System

| Token | Value |
|---|---|
| Background | `#0f1010` |
| Surface | `#111212` |
| Border | `1px solid #1e2020` |
| Heading Font | Times New Roman, 400 weight |
| Body Font | Inter / System sans-serif |
| Accent | Pure white / subtle grays only |

The design is deliberately editorial and institutional — no gradients, no neon, no glow effects.

---

## Ecosystem

- **[Virtuals Protocol](https://virtuals.io)** — The AI agent framework powering the reputation pipeline.
- **Robinhood Chain** — Arbitrum Orbit L3 where attestations are settled on-chain.

---

## License

MIT
