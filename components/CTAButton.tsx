import { type ReactNode } from "react";

type Variant = "primary" | "ghost";

export default function CTAButton({
  children,
  href = "#",
  variant = "primary",
  showArrow = true,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  showArrow?: boolean;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-[6px] text-[14px] font-medium transition-transform focus-visible:outline-2 focus-visible:outline-accent";

  const styles: Record<Variant, string> = {
    primary: "bg-white text-navbar px-6 py-2.5 hover:scale-[1.02]",
    ghost:
      "border border-hairline text-secondary px-5 py-2.5 hover:text-white hover:border-white/30 hover:scale-[1.02]",
  };

  return (
    <a href={href} className={`${base} ${styles[variant]}`}>
      {children}
      {showArrow && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 10L10 4M10 4H5.5M10 4V8.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}
