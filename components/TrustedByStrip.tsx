export default function TrustedByStrip() {
  const brands = [
    {
      name: "Virtuals Protocol",
      img: "https://cryptologos.cc/logos/virtual-protocol-virtual-logo.png",
      width: 20,
    },
    {
      name: "Robinhood",
      img: "https://logo.clearbit.com/robinhood.com",
      width: 20,
    },
  ];

  return (
    <footer
      className="py-5 px-6"
      style={{ background: "#131313", borderTop: "1px solid #1e2020" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 shrink-0">
          Trusted By
        </div>
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-7 gap-y-3 opacity-50 hover:opacity-80 transition-opacity grayscale hover:grayscale-0">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.img}
                alt={brand.name}
                width={brand.width}
                height={brand.width}
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span className="text-[11px] font-medium text-white tracking-wide">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
