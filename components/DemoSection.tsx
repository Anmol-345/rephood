"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useState, useEffect, useRef } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Agent {
  id: string;
  name: string;
  type: string;
  networkAge: string;
  flagStatus: string;
  flagCount: number;
  trustScore: number;
  vtx: number;
  aAge: number;
  mFlag: number;
  ipfsHash: string;
}

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const AGENTS: Agent[] = [
  {
    id: "VAGT-001",
    name: "Luna AI",
    type: "Liquidity Automaton",
    networkAge: "142 Blocks",
    flagStatus: "0 Anomalies Detected",
    flagCount: 0,
    trustScore: 78.4,
    vtx: 1042,
    aAge: 365,
    mFlag: 0,
    ipfsHash: "QmX7dKq3n9rVxZ8pMwFcLsT4bN2yEuGhJk6aRoPlW5mYv1",
  },
  {
    id: "VAGT-002",
    name: "Meridian Δ",
    type: "Cross-Chain Arbitrage Engine",
    networkAge: "89 Blocks",
    flagStatus: "High Slippage Event Flagged",
    flagCount: 3,
    trustScore: 41.2,
    vtx: 587,
    aAge: 210,
    mFlag: 3,
    ipfsHash: "QmR3bNk8sYxLo4vPqTmFuHwD9cG7aEjZi5WnBsXp2kRm6A",
  },
  {
    id: "VAGT-003",
    name: "Nexus Prime",
    type: "Predictive Routing Protocol",
    networkAge: "301 Blocks",
    flagStatus: "0 Anomalies Detected",
    flagCount: 0,
    trustScore: 93.7,
    vtx: 2891,
    aAge: 720,
    mFlag: 0,
    ipfsHash: "QmK5pCj2nXqWm8vLsGuTyHbE4dN6oFrZa7YkBxRp9wMt3S",
  },
];

/* ─── Utilities ──────────────────────────────────────────────────────────── */
const SERIF: React.CSSProperties = {
  fontFamily: '"Times New Roman", Times, serif',
  fontWeight: 400,
};

const scoreColor = (score: number) => {
  if (score >= 80) return "#d1fae5"; // green-200
  if (score >= 50) return "#fef9c3"; // yellow-100
  return "#fecaca"; // red-200
};

const flagColor = (count: number) => {
  if (count === 0) return "rgba(255,255,255,0.28)";
  return "#fca5a5";
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function TopBanner() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="w-full flex items-center justify-between px-8 py-3"
      style={{ borderBottom: "1px solid #1e2020" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        <span className="text-[11px] tracking-[0.18em] uppercase text-white/40">
          Robinhood Chain — Arbitrum Orbit
        </span>
      </div>

      <div className="flex items-center gap-4">
        {!mounted ? (
          <div className="w-24 h-6 bg-white/5 animate-pulse" />
        ) : isConnected ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-white/50 tracking-wide font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <button
              onClick={() => disconnect()}
              className="text-[11px] tracking-wider text-white/30 hover:text-white/60 transition-colors uppercase"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            className="px-4 py-1.5 text-[11px] tracking-[0.14em] uppercase border text-white hover:bg-white hover:text-black transition-colors"
            style={{ borderColor: "#1e2020" }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */
export default function DemoSection() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [liveScore, setLiveScore] = useState<number | null>(null);
  const [auditComplete, setAuditComplete] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logs.length > 0) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Reset when agent changes
  useEffect(() => {
    setLogs([]);
    setLiveScore(null);
    setAuditComplete(false);
    setIsAuditing(false);
  }, [selectedAgent]);

  const handleAudit = async () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setLogs([]);
    setLiveScore(null);
    setAuditComplete(false);

    const { name, id, vtx, aAge, mFlag } = selectedAgent;

    const steps: { text: string; type: string }[] = [
      { text: `> Initializing telemetry audit for ${name} [${id}]`, type: "init" },
      { text: `> Connecting to Virtuals Protocol relay...`, type: "info" },
      { text: `> Behavioral tick stream established.`, type: "info" },
      { text: `> Sampling V_tx (Transaction Volume) — raw = ${vtx} ops`, type: "data" },
      { text: `> Sampling A_age (Network Age) — ${aAge} epoch cycles`, type: "data" },
      { text: `> Sampling M_flag (Anomaly Flags) — count = ${mFlag}`, type: mFlag > 0 ? "warn" : "data" },
      { text: `> Applying ΔR formula...`, type: "info" },
      {
        text: `> ΔR = 0.42 · log(${vtx}) + 0.31 · ${aAge} − 0.27 · ${mFlag}`,
        type: "formula",
      },
      { text: `> Invoking emitAttestation() on Robinhood Chain...`, type: "info" },
      { text: `> IPFS evaluation record committed.`, type: "info" },
      { text: `> ✓ Attestation confirmed. RepHood score updated.`, type: "success" },
    ];

    for (const step of steps) {
      await new Promise<void>((r) => setTimeout(r, 600));
      setLogs((prev) => [...prev, step]);
    }

    // Compute delta score
    const w1 = 0.42, w2 = 0.31, w3 = 0.27;
    const delta = w1 * Math.log(vtx) + w2 * (aAge / 100) - w3 * mFlag;
    const newScore = Math.min(100, +(selectedAgent.trustScore + delta * 0.1).toFixed(1));
    setLiveScore(newScore);
    setAuditComplete(true);
    setIsAuditing(false);
  };

  const logTypeStyle = (type: string) => {
    if (type === "success") return "#86efac";
    if (type === "warn") return "#fca5a5";
    if (type === "formula") return "#e2e8f0";
    if (type === "data") return "#a5b4fc";
    if (type === "init") return "#ffffff";
    return "rgba(255,255,255,0.45)";
  };

  return (
    <div style={{ background: "#0f1010" }}>
      <div className="w-[90%] mx-auto" style={{ border: "1px solid #1e2020", borderTop: "none" }}>
      <TopBanner />

      {/* Section Header */}
      <div
        className="w-full px-8 py-10"
        style={{ borderBottom: "1px solid #1e2020" }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3">
          Virtuals Protocol · RepHood Intelligence Suite
        </p>
        <h2 className="text-6xl text-white" style={SERIF}>
          Agentic Reputation Engine
        </h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* ── LEFT: Agent Directory ── */}
        <div
          className="lg:col-span-2 flex flex-col"
          style={{ borderRight: "1px solid #1e2020" }}
        >
          {/* Directory Header */}
          <div
            className="px-8 py-5 flex items-center justify-between"
            style={{ borderBottom: "1px solid #1e2020" }}
          >
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/30">
              Agent Directory
            </span>
            <span className="text-[11px] text-white/20">
              {AGENTS.length} agents indexed
            </span>
          </div>

          {/* Column Headers */}
          <div
            className="grid grid-cols-12 px-8 py-3 gap-2"
            style={{ borderBottom: "1px solid #1e2020" }}
          >
            {["Agent", "Age", "Flags", "Score"].map((col, i) => (
              <span
                key={col}
                className={`text-[10px] tracking-[0.16em] uppercase text-white/25 ${
                  i === 0 ? "col-span-5" : i === 1 ? "col-span-2" : i === 2 ? "col-span-3" : "col-span-2 text-right"
                }`}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Agent Rows */}
          {AGENTS.map((agent) => {
            const isActive = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="grid grid-cols-12 px-8 py-5 gap-2 w-full text-left transition-colors group"
                style={{
                  borderBottom: "1px solid #1e2020",
                  background: isActive ? "#141515" : "transparent",
                }}
              >
                {/* Name + Type */}
                <div className="col-span-5">
                  <div
                    className="text-white text-sm mb-1"
                    style={SERIF}
                  >
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-white/30 leading-tight">
                    {agent.type}
                  </div>
                </div>

                {/* Age */}
                <div className="col-span-2 flex items-center">
                  <span className="text-xs text-white/40 font-mono">
                    {agent.networkAge.split(" ")[0]}
                    <span className="text-white/20 text-[9px] ml-0.5">blk</span>
                  </span>
                </div>

                {/* Flag Status */}
                <div className="col-span-3 flex items-center">
                  <span
                    className="text-[10px] leading-tight"
                    style={{ color: flagColor(agent.flagCount) }}
                  >
                    {agent.flagCount === 0
                      ? "Clean"
                      : `${agent.flagCount} Flag${agent.flagCount > 1 ? "s" : ""}`}
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-2 flex items-center justify-end">
                  <span
                    className="text-sm font-mono"
                    style={{ color: scoreColor(agent.trustScore), ...SERIF }}
                  >
                    {agent.trustScore}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Agent Meta Card */}
          <div className="px-8 py-6 mt-auto">
            <div
              className="p-5"
              style={{ border: "1px solid #1e2020", background: "#111212" }}
            >
              <p className="text-[10px] tracking-[0.16em] uppercase text-white/25 mb-4">
                Selected Agent
              </p>
              <p className="text-lg text-white mb-1" style={SERIF}>
                {selectedAgent.name}
              </p>
              <p className="text-[11px] text-white/35 mb-5">
                {selectedAgent.type}
              </p>
              <div className="space-y-2">
                {[
                  ["Agent ID", selectedAgent.id],
                  ["Network Age", selectedAgent.networkAge],
                  ["Anomaly Status", selectedAgent.flagStatus],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[10px] text-white/25 uppercase tracking-wider">
                      {label}
                    </span>
                    <span
                      className="text-[11px] text-white/55"
                      style={{ color: label === "Anomaly Status" && selectedAgent.flagCount > 0 ? "#fca5a5" : undefined }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Audit Console ── */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Console Header */}
          <div
            className="px-8 py-5 flex items-center justify-between"
            style={{ borderBottom: "1px solid #1e2020" }}
          >
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/30">
              Live Pipeline Audit Station
            </span>
            <span className="text-[11px] font-mono text-white/20">
              {selectedAgent.id}
            </span>
          </div>

          <div className="flex flex-col flex-1 px-8 py-6 gap-6">
            {/* Terminal Viewport */}
            <div
              className="flex-1 min-h-[260px] max-h-[340px] overflow-y-auto p-5"
              style={{
                background: "#090a0a",
                border: "1px solid #1e2020",
                fontFamily: '"Courier New", Courier, monospace',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div
                    key={c}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c, opacity: 0.6 }}
                  />
                ))}
                <span className="text-[10px] text-white/20 ml-2 tracking-wider">
                  telemetry_stream — rephood_agent_audit
                </span>
              </div>

              {logs.length === 0 && (
                <p className="text-[11px] text-white/20">
                  Awaiting audit trigger...
                </p>
              )}
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="text-[11px] leading-relaxed"
                  style={{ color: logTypeStyle(log.type) }}
                >
                  {log.text}
                </div>
              ))}
              {isAuditing && (
                <span className="text-white/40 text-[11px] animate-pulse">█</span>
              )}
              <div ref={logEndRef} />
            </div>

            {/* Audit Trigger Button */}
            <button
              onClick={handleAudit}
              disabled={isAuditing}
              className="w-full py-3.5 text-sm tracking-[0.12em] uppercase transition-colors"
              style={{
                background: isAuditing ? "transparent" : "#ffffff",
                color: isAuditing ? "rgba(255,255,255,0.25)" : "#0f1010",
                border: "1px solid",
                borderColor: isAuditing ? "#1e2020" : "#ffffff",
                cursor: isAuditing ? "not-allowed" : "pointer",
              }}
            >
              {isAuditing
                ? "Audit In Progress..."
                : auditComplete
                ? "Re-Execute Telemetry Audit"
                : "Execute Agent Telemetry Audit"}
            </button>

            {/* Formula Display */}
            <div
              className="px-5 py-4"
              style={{ border: "1px solid #1e2020", background: "#111212" }}
            >
              <p className="text-[10px] tracking-[0.16em] uppercase text-white/25 mb-3">
                Reputation Delta Engine
              </p>
              <p className="text-base text-white/70" style={SERIF}>
                ΔR = w₁ · log(V
                <sub className="text-xs">tx</sub>) + w₂ · A
                <sub className="text-xs">age</sub> − w₃ · M
                <sub className="text-xs">flag</sub>
              </p>
              <div className="flex gap-6 mt-3">
                {[
                  ["w₁", "0.42"],
                  ["w₂", "0.31"],
                  ["w₃", "0.27"],
                ].map(([label, val]) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[9px] text-white/25 uppercase tracking-wider mb-0.5" style={SERIF}>
                      {label}
                    </span>
                    <span className="text-xs font-mono text-white/50">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score + Verification Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Live Score */}
              <div
                className="px-5 py-5"
                style={{ border: "1px solid #1e2020", background: "#111212" }}
              >
                <p className="text-[10px] tracking-[0.16em] uppercase text-white/25 mb-3">
                  Trust Score
                </p>
                <div
                  className="text-5xl transition-all duration-700"
                  style={{
                    ...SERIF,
                    color: liveScore !== null
                      ? scoreColor(liveScore)
                      : scoreColor(selectedAgent.trustScore),
                  }}
                >
                  {liveScore !== null
                    ? liveScore.toFixed(1)
                    : selectedAgent.trustScore.toFixed(1)}
                </div>
                {liveScore !== null && (
                  <p className="text-[10px] text-white/30 mt-2">
                    +{Math.abs(liveScore - selectedAgent.trustScore).toFixed(1)} after audit
                  </p>
                )}
              </div>

              {/* IPFS Record */}
              <div
                className="px-5 py-5 flex flex-col justify-between"
                style={{ border: "1px solid #1e2020", background: "#111212" }}
              >
                <div>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-white/25 mb-3">
                    Evaluation Record
                  </p>
                  <p className="text-[10px] font-mono text-white/25 break-all leading-relaxed">
                    {selectedAgent.ipfsHash.slice(0, 24)}...
                  </p>
                </div>
                <button
                  className="text-left text-[10px] tracking-wider uppercase text-white/40 hover:text-white transition-colors mt-4"
                  style={{
                    borderTop: "1px solid #1e2020",
                    paddingTop: "12px",
                  }}
                >
                  Inspect Cryptographic IPFS Audit Record ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
