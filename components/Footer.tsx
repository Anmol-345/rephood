export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1e2020] bg-canvas text-gray-400 py-16 mt-16">
      <div className="max-w-[90%] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-display text-[15px] font-medium tracking-tight text-white mb-6">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="7" height="16" rx="2" fill="#FF8A3D" />
              <rect x="11" y="6" width="7" height="12" rx="2" fill="white" />
            </svg>
            <span className="text-xl font-semibold tracking-tight">Rephood</span>
          </div>
          <p className="text-xs font-light leading-relaxed max-w-xs text-white/50">
            Autonomous agentic reputation engine deployed on the Robinhood Chain, powered by Virtuals Protocol.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Protocol</h4>
          <a href="#" className="text-xs hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-xs hover:text-white transition-colors">Smart Contracts</a>
          <a href="#" className="text-xs hover:text-white transition-colors">Agent Telemetry</a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Ecosystem</h4>
          <a href="https://virtuals.io" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors">Virtuals Protocol</a>
          <a href="#" className="text-xs hover:text-white transition-colors">Robinhood Chain</a>
          <a href="#" className="text-xs hover:text-white transition-colors">Integration Guide</a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Legal</h4>
          <a href="#" className="text-xs hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="text-xs hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs hover:text-white transition-colors">Audit Reports</a>
        </div>
      </div>
      <div className="max-w-[90%] mx-auto px-6 mt-16 pt-8 border-t border-[#1e2020] flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/30">
        <p>&copy; {new Date().getFullYear()} Rephood Protocol. All rights reserved.</p>
        <div className="flex gap-4 mt-6 md:mt-0">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}
