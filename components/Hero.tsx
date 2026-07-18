import Image from "next/image";
import Navbar from "./Navbar";
import Badge from "./Badge";
import TrustedByStrip from "./TrustedByStrip";

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden flex flex-col">
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroBackground.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      
      {/* hero-gradient-mask */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ background: 'linear-gradient(180deg, rgba(19, 19, 19, 0.4) 0%, rgba(19, 19, 19, 0) 40%, rgba(19, 19, 19, 0.8) 80%, rgba(19, 19, 19, 1) 100%)' }}
      />

      <Navbar />

      {/* Content layer */}
      <div className="relative z-20 mt-auto pb-8 px-6 md:px-12 lg:px-20 w-full">
        <div className="w-full flex flex-col md:flex-row items-end justify-between gap-12">
          {/* Left Column: Headline and Tag */}
          <div className="flex-1">
            <Badge />
            <h1 className="text-[3.5rem] md:text-6xl lg:text-[72px] font-normal leading-[0.9] tracking-tighter" style={{ fontFamily: '"Times New Roman", Times, serif', background: 'linear-gradient(to bottom, #ffffff 60%, #555555 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Reputation Built<br />
              By Autonomous Agents.
            </h1>
          </div>

          {/* Right Column: Call to Action and Description */}
          <div className="max-w-md shrink-0">
            <div className="mb-10">
              <button className="bg-white text-black px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center group transition-colors hover:bg-gray-200">
                Run Audit
                <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </button>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Verifiable on-chain reputation for every wallet. Computed by AI agents. Settled on Robinhood Chain.
            </p>
          </div>
        </div>
      </div>
      
      {/* Trusted-by strip pinned to bottom */}
      <div className="relative z-20">
        <TrustedByStrip />
      </div>
    </section>
  );
}
