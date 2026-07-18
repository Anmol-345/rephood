"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const navLinks = [
  { label: "Virtuals Protocol", href: "https://virtuals.io", external: true },
  { label: "Robinhood Chain", href: "#", external: false },
  { label: "Documentation", href: "#", external: false },
];

function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hidden md:block w-32 h-8 bg-white/5 animate-pulse" />
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-white/50 font-mono tracking-wide">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-xs font-bold tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="hidden md:flex items-center px-4 py-2 border border-white/20 text-xs font-bold tracking-widest uppercase text-white hover:bg-white/10 transition-all"
    >
      Connect Wallet
      <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 lg:px-20">
      <div className="w-full flex items-center justify-between">
        {/* Nav Links Left */}
        <div className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-widest text-gray-400 uppercase">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Center Logo */}
        <div className="flex items-center gap-2 font-display text-[15px] font-medium tracking-tight text-white lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="7" height="16" rx="2" fill="#FF8A3D" />
            <rect x="11" y="6" width="7" height="12" rx="2" fill="white" />
          </svg>
          <span className="text-xl font-semibold tracking-tight">Rephood</span>
        </div>

        {/* Right — Wallet + Get Started */}
        <div className="flex items-center space-x-3">
          <WalletButton />

          <button className="bg-white text-black px-4 py-2 text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-all flex items-center">
            Get Started
            <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="lg:hidden ml-2 p-1.5 text-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 bg-[#131313] border border-white/10 rounded-lg overflow-hidden absolute w-[calc(100%-3rem)] z-50">
          <ul className="flex flex-col px-5 py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-gray-400 text-xs font-medium uppercase tracking-widest transition-colors hover:text-white block w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              {mounted && !isConnected ? (
                <button
                  onClick={() => {
                    connect({ connector: injected() });
                    setMenuOpen(false);
                  }}
                  className="text-gray-400 text-xs font-medium uppercase tracking-widest hover:text-white w-full text-left"
                >
                  Connect Wallet
                </button>
              ) : null}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
